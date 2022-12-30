<!--#-->
# Validators

## 描述

可定義多個 validator，每個 validator 可以被單獨定義重複使用，不同 validator 彼此名稱不得重複，定義時需提供 ident(identity) 及 handler 屬性, ident 代表 validator 的唯一名稱, handler 則為處理驗證時所需的邏輯。

**exmaple**

> devineValidators([
     { identity: “validatorName”, handler(context, …args){  return true | false }}
])
> 

```ts
type V = {
	username: any;
	password: any;
} & (typeof EBaseValidationIdents);
const {validatorIdents, validators} = defineValidators<V>([
    {
      identity: "username",
      handler: (ctx, ...args)=>{
        return ctx.value == "John";
      }
    }
])
assert(validatorIdents.username == "username") 
validators.username // 對應至 InternalValidator 物件
// 以下未定義 password, 但 "password" 繼承至內部預設定義
assert(validatorIdents.password == "password") 
validatorIdents.password /// InternalValidator 物件 
```

- 當validator 依 defineValidator 方法所定義後，會將新增的 validator 名稱集合至 **validators | validatorIents,** 並繼承所有預設 validator，以供使用者可滙入引用, 預設 Validators 有哪些見 **EBaseValidationIdents**

- **defineValidator**
    
    defineValidator 用來生成內部所需要的 InternalValidator
    
    ```ts
    export function defineValidators<T, V = (typeof EBaseValidationIdents) & T>(
      option: UDValidator<V>[]
    ): {
      validatorIdents: Record<keyof V, keyof V>;
      validators: **InternalValidators**<V>;
    } {
    ```
    

- **InternalValidator** 有以下屬性
    - handler
    - validatorName
    - linkField
    - applyField - private
    - linkedFieldName - private
    - appliedFieldName - private

## InternalValidator

```ts
/**
   * @typeParam V - object containing keys of all validators
   * @typeParam F - payload schema for form fields
   * */
  export type InternalValidator<V, F = any> = {
    /** validator 驗證邏輯*/
    handler: ValidatorHandler<V, F>;
    /** 指派 validator 名，唯一名稱不得重複 */
    validatorName: keyof V;
    /** 用來連結其他欄位名 － linkField(fieldName) */
    linkField: InternalValidatorLinkHandler<V, F>;
    /** 將 validator 套用至欄位名 */
    _applyField?: InternalValidatorApplyHandler<V, F>;
    /** 連結的欄位名 */
    _linkedFieldName?: string;
    /** 套用的欄位名 */
    _appliedFieldName?: string;
  };
  /**
```

```mermaid
classDiagram
	FormField <|-- RuleChains
  RuleChains: InternalValidator bail
	RuleChains: InternalValidator required
	RuleChains: InternalValidator ...
	RuleChains <|-- InternalValidator
	class FormField{
		String name;
		String payloadKey;
		ruleChains;
	}
	class InternalValidator{
        String _linkedFieldName
				String _appliedFieldName
        InternalValidator link(fieldName)
				InternalValidator _applyField(fieldName)
        Boolean handler(context, ...args)
    }
```

### .handler

返回 true 代表驗證通過，false 代表 驗證失敗, 驗證錯誤相關的錯誤信息定義，見**UDValidationMessage**

```ts
/**
   * Validator Handler 用來處理驗證邏輯， return true 代表驗證通過，false 不通過
   * @typeParam V - validator keys
   * @typeParam F - payload schema for form fields
   * @param ctx - validator context, 擴展至 {@link IBaseFormContext}, validator 屬性由 {@link BaseFormImpl.validate} 時 runtime 傳入
   * @param args - additional arguments
   *  __example:__
   *   ```typescript
   *   const baseFormRules = {
   *     [EBaseValidationRules.optional](ctx, ...args: any){
   *       return true;
   *     },
   *      [EBaseValidationRules.required](ctx, ...args: any){
   *       return v8n().not.empty().test(ctx.value);
   *     },
   *      [EBaseValidationRules.bail](ctx, ...args: any){
   *       ctx.displayOption.showMultipleErrors = true;
   *       return true;
   *     },
   *   }
   *  ```
   * */
  export type ValidatorHandler<V, F = any> = (
    ctx: IBaseFormContext<F, F, V> &  {validator?: InternalValidator<V>},
    ...args: any[]
  ) => boolean;
```

**example －簡單範例**

```ts
handler: (ctx, ...args)=>{
  return v8n().length(10, 30).test(ctx.value);
}
```

**example － 連結其他欄位：**

部份驗證規則需要連結其他欄位以進行驗證，如 confirm password 便需要 confirm_password 欄位與 password 欄位進行連結，以檢查其質是否一致

- context.getLinkedFieldName(validatorIdentity)
    
    以下例，透過 confirm 取得當前 context 中所連結的欄位名 **linkName**
    
- 並透過該被連結的欄位名，查找其欄位物件 (FormField)
- 由欄位物件取得該欄位目前的值 linkField.value
- 由 FormModel(context.model) 連結

```ts
/** 當欄位名為 sampleField_confirm, 則可用來匹配 欄位名 sampleFIeld */
[EBaseValidationIdents.confirm]: aValidator({
    validatorName: EBaseValidationIdents.confirm,
    handler(ctx, ...args: any[]) {
      const fieldName = ctx.fieldName; 
      const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.confirm);
      assert(linkName != undefined);
      
      const linkField = ctx.model.getFieldByFieldName(linkName);
      const linkVal = linkField.value;
      
      ctx.model.link({
        master: { fieldName: ctx.fieldName as any, payloadKey: ctx.payloadKey },
        slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
      });

      return linkVal == ctx.value;
    },
  }),
```

### .validatorName

Validator 名稱（字串），不可重複名命，如重複名命則會覆寫定義。

### .linkField

用來連結其他欄位，如 confirm_password 需要與 password 欄位進行比對，因此當定義 confirm 這個 validator 時便需要考慮到欄位連結可能由外部傳入，這樣於 validator 內部就能夠依據外部傳入的 linkedFieldName 來取得相應的欄位值，如在定義 validation rules 時….

**example**:

```ts
export const fieldRules = defineFieldRules({
    validators: V,
    ruleChain: [
        {ident: EFieldNames.password, rules: ruleOfPassword},
        {ident: "confirmPassword", rules: [
            ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.password})
        ]} ]})
```

以上 confirmPassword 的驗證規則為 ruleOfPassword 加上 confirm.linkField({fieldName: password}).

### EBaseValidationIdents

內部預設所定義的 validator identities，當validator 依 defineValidator 方法所定義後會自動繼承自 EbaseValidationIdents 內所有的 validator，使用者使用時不應直接用 EBaseValidationIdents，應使用 defineValidator 所返迴的 validatorIdents

```ts
/**
 * 預設 Validator 名, 可介由 {@link defineValidators} 擴展延伸
 */
 export enum EBaseValidationIdents {
  /** general user name regex pattern, 預設大小寫英文數字減號 */
  username = "username",
  /** 
   * todo: 指定 bail 推疊多個 validation rules, e.g: bail|username|userLength */
  bail = "bail",
  /** greater */
  greater = "greater",
  lesser = "lesser",
  /** 當欄位名取為為 fieldName_confirm 時, 則可用來匹配 欄位名 fieldName */
  confirm = "confirm",
  email = "email",
  remark = "remark",
  /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
   *  就代表其 prefix 為 notEqual 的比較對象
   * */
  notEqual = "notEqual",
  /** 無 rule, 不檢查*/
  optional = "optional",
  phone = "phone",
  /**8-30字*/
  pwdLength = "pwdLength",
  /** 大小寫英文數字(底線、減號、井號) 8-30字*/
  pwdPattern = "pwdPattern",
  /** 必填*/
  required = "required",
  /**  3字*/
  searchLength = "searchLength",
  /**  1-10字*/
  nickLength = "nickLength",
  /**  5-30字*/
  userLength = "userLength",
  amountLength = "amountLength",
  userPattern = "userPattern",
  decimalPattern = "decimalPattern",
  intPattern = "intPattern"
}
```

使用者如需存取 validator identities 應使用 defineValidato

```ts
export const {validatorIdents, validators} = defineValidators<V>([
  {
    identity: "username",
    handler: (ctx, ...args)=>{
      return ctx.value == "John";
    }
  }])
assert(validatorIdents.password == "password") 
```
