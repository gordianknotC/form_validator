import { EBaseValidationIdents } from "../../index";
import { ArrayDelegate, ComputedRef } from "@gdknot/frontend_common";
import { Optional } from "./commonTypes";
import { IBaseFormContext } from "./contextTypes";
/**
 * Validator Handler 用來處理驗證邏輯， return true 代表驗證通過，false 不通過
 * @typeParam V - validator keys
 * @typeParam F - payload schema for form fields
 * @param ctx - validator context, 擴展至 {@link IBaseFormContext}, validator 屬性由 {@link BaseFormImpl.validate} 時 runtime 傳入
 * @param args - additional arguments
 * @example
   - **簡單範例**
    ```ts
    handler: (ctx, ...args)=>{
      return v8n().length(10, 30).test(ctx.value);
    }
    ```

  - **連結其他欄位**

    部份驗證規則需要連結其他欄位以進行驗證，如 confirm password 便需要
    confirm_password 欄位與 password 欄位進行連結，以檢查其質是否一致，
    以下例，欄位 confirm_password 欲匹配 password 的情況下，我們需要一個
    confirm validator 可以用來匹配其他欄位，以比較其值是否一致，這個時候
    我們就能夠以

    - context.getLinkedFieldName
      
      取得連結的欄位名稱

    - context.model.getFieldByFieldName
      
      取得欄位物件
      
    ```ts
    [EBaseValidationIdents.confirm]: aValidator({
        validatorName: EBaseValidationIdents.confirm,
        handler(ctx, ...args: any[]) {
          const fieldName = ctx.fieldName;
          // 取得連結欄位名
          const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.confirm);
          assert(linkName != undefined);
          // 透過欄位名取得欄位物件
          const linkField = ctx.model.getFieldByFieldName(linkName);
          const linkVal = linkField.value;
          return linkVal == ctx.value;
        },
      }),
    ```
 * */
export type ValidatorHandler<V, F = any> = (ctx: IBaseFormContext<F, F, V> & {
    validator?: InternalValidator<V>;
}, ...args: any[]) => boolean;
/**
 * @inheritDoc
 * @typeParam V - return type
 * @param linkField - 連結欄位名稱
 * */
export type InternalValidatorLinkHandler<V, F> = (option: {
    fieldName: string;
}) => InternalValidator<V, F>;
/**
 * @inheritDoc
 * @typeParam V - return type
 * @param linkField - 連結欄位名稱
 * */
export type InternalValidatorApplyHandler<V, F> = (fieldName: string) => InternalValidator<V, F>;
/**
 * 於內部使用的 Validator
 * @typeParam V - object containing keys of all validators
 * @typeParam F - payload schema for form fields
 * */
export type InternalValidator<V, F = any> = {
    /** 處理主要驗證邏輯*/
    handler: ValidatorHandler<V, F>;
    /** 指派 validator 唯一名稱不得重複，如重複名命則會覆寫定義*/
    validatorName: keyof V;
    /**
     * 用來連結其他欄位，如 confirm_password 需要與 password 欄位進行比對，
     * 因此當定義 confirm 這個 validator 時便需要考慮到欄位連結可能由外部傳入，
     * 這樣於 validator 內部就能夠依據外部傳入的 linkedFieldName 來取得相應的
     * 欄位值，如在定義 validation rules 時…
     * @example
     * ```ts
      export const fieldRules = defineFieldRules({
        validators: V,
        ruleChain: [
            {ident: EFieldNames.password, rules: ruleOfPassword},
            {ident: "confirmPassword", rules: [
                ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.password})
            ]} ]})
      ```

      以上 confirmPassword 的驗證規則為 ruleOfPassword 加上
      confirm.linkField({fieldName: password})
    */
    linkField: InternalValidatorLinkHandler<V, F>;
    /** @private 將 validator 套用至欄位名 - applyField(fieldName)*/
    _applyField?: InternalValidatorApplyHandler<V, F>;
    /** @private 連結的欄位名 */
    _linkedFieldName?: string;
    /** @private 套用的欄位名 */
    _appliedFieldName?: string;
};
/**
 * @typeParam V - object containing keys of all validators
 */
export type InternalValidators<V, F = any> = Record<keyof V, InternalValidator<V, F>>;
/** 用來定義驗證規則所對應的驗證訊息
 * 鍵為欄位名，值必須為 {@link ComputedRef}，用來追踪i18n狀態上的變化
 * @typeParam V - validators
 * @example
 ```ts
  export const validationMessages = defineValidationMsg<V>({
      pwdLength: undefined,
      pwdPattern: computed(()=>i18n.t.pwdLengthValidationError)
  })
 ```
 */
export type UDValidationMessages<V> = Record<keyof (V), Optional<ComputedRef<string>>>;
/**
 * @typeParam V - object containing keys of all validators
 * */
export type UDValidatorLinkHandler<V = string> = (linkField?: string) => string;
/**
 * # Validator (驗證子)
 *
 * Validator(驗證子)，用來處理驗證邏輯最基本的單位，可定義多個 validator
 * 每個 validator 可以被單獨定義重複使用，不同 validator 彼此名稱不得重複
 * 定義時需提供 ident(identity) 及 handler 屬性, ident 代表 validator
 * 的唯一名稱, handler 則為處理驗證時所需的邏輯。
 * @example
 * ```ts
    type Payload = {
      username: any;
      password: any;
    };
    type V = Payload & (typeof EBaseValidationIdents);
    const {validatorIdents, validators} = defineValidators<V>([
        {
          identity: "username",
          handler: (ctx, ...args)=>{
            // ctx 為 context {@link }
            return ctx.value == "John";
          }
        }
    ])
    // validatorIdents 為 validator 名稱集合 (string enum)
    assert(validatorIdents.username == "username")
    validators.username // 對應至 InternalValidator 物件
    // 以下未定義 password, 但 "password" 繼承至內部預設定義
    assert(validatorIdents.password == "password")
    validatorIdents.password // InternalValidator 物件
 ```
 > 當validator 依 defineValidator 方法所定義後，會將新增的
 validator 自動繼承預設的 Validator 名稱集合至 **validators, validatorIdents,** ，
 以供使用者可滙入引用, 預設 Validators 有哪些見 {@link EBaseValidationIdents}
 *
 * @typeParam A - 新增的驗證子值鍵對
 * @typeParam V - 內部預設驗證子值鍵對
 */
export type UDValidator<A, V = (typeof EBaseValidationIdents) & A> = {
    identity: keyof A;
    handler: ValidatorHandler<V>;
};
/**
 * # FieldRule
 * 驗證規則由許多個驗證子的集合構成，多個驗證子集合成一個驗證挸則，並將
 * 驗證挸則套用在特定的欄位上，如處理密碼的驗證規則需包括多個驗證子，如下：
    ```ts
    const V = validators;
    const treasurePasswordRule = [
      V.pwdLength, V.pwdPattern
    ]
    const userPasswordRule = [
      V.required, V.pwdLength, V.pwdPattern
    ]
    const confirmPasswordRule = [
      ...passwordRule, V.confirm.linkField("password")
    ]
    ```
  不同的驗證規則適用於不同的情境，不同的表單，定義時需使用
  defineFieldRules 方法，如下。

  ```ts
  enum EFieldName {
    confirmPassword="confirmPassword",
    password="generalPassword",
    treasurePassword="treasurePassword"
  }
  export const fieldRules = defineFieldRules({
    validators: V,
    ruleChain: [
      {ident: EFieldNames.treasurePassword, rules: treasurePasswordRule},
      {ident: EFieldNames.password, rules: userPasswordRule},
      {ident: "confirmPassword", rules: [
        ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.password})
      ]}
    ]})
  fieldRules.password // UDFieldRuleConfig 物件
  ```

  驗證時，驗證規則會線性式處理驗證規則內所有的驗證子，
  以 password 為例

  ```ts
  const password = [V.required, V.pwdLength, V.pwdPattern]
  ```

  當 input 事件發生進行驗證時，會先處理是否 required（必填）,
  再處理 pwdLength(長度限制），最後處理 pwdPattern（字元限制），
  直到當中其中一個驗證子出現錯誤，因錯誤發生便沒有需要再繼續檢查下去，
  如此構成一個 validator chain，而有一些特殊的 validator
  會影響 validator chain 的處理方式，能夠允許 validator chain
  持續處理驗證錯誤，能夠堆疊多個驗證錯誤，如 bail 驗證子。

 * @typeParam V - object containing keys of all validators
 */
export type UDValidators<V> = Record<keyof V, UDValidator<V>>;
/** 驗證規則由許多「驗證子」的集合構成
 * @example
 * ```ts
 * const passwordRule = [
 *    validators.required, validators.pwdLength, validators.pwdPattern
 * ]
 * ```
 */
export type UDRule<V, F> = ArrayDelegate<InternalValidator<V, F>>;
/**
 * 使用者自定義「驗證規則」設定
 * @typeParam V - validators
 * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
 * @param ident - 「驗證規則」命名，字串名不可重複
 * @param rules - 「驗證規則」由許多「驗證子」的集合構成 @see {@link FormField}
 */
export type UDFieldRuleConfig<R, V> = {
    ident: keyof R;
    rules: InternalValidator<V>[];
};
/**
 * 由 {@link defineFieldRules} 所返回的驗證規則集合
 * @typeParam V - validators
 * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
 */
export type UDFieldRules<R, V> = Record<keyof R, UDFieldRuleConfig<R, V>>;
/**
 * 於使用者「自定義欄位設定」 {@link UDFieldConfigs}，用來將「證驗規則」對應至「欄位名稱」，回傳值為 {@link FieldRuleBuilderReturnType}
 * @typeParam V - validators
 * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
 * @see {@link UDFieldDefineMethod}
 * @see {@link defineFieldConfigs}
 */
export type FieldRuleBuilder<R, V> = (rules: R) => InternalValidator<any>[];
