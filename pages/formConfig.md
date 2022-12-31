
---
<!--#-->

FormConfig 主要用來生成 [FormImpl] | [source][s-FormImpl] 所需要的一些相關設定，並非套件主要邏輯的部份，而是提供使用者一個較方便的介面，用以生成 [FormImpl] | [source][s-FormImpl] ，主要分為四個部份： 

- **[defineValidators]** -  定義驗證基本單元「驗證子」。
- **[defineValidationMsg]** - 定義「驗證子」發生錯誤時所顥示的「錯誤信息」。
- **[defineRules]** - 定義驗證規則，由許多「驗證子」溝成。
- **[defineFormConfig]** - 定義表單所需相關設定，包括注入以上三項定義。

## defineFormConfig

[source][s-defineFormConfig] | 

**型別定義**

```ts
/** 
 * 使用者自定義欄位設定
 * @typeParam F - 所有欄位 payload 型別聯集
 * @typeParam R - 使用者自定義 rules {@link UDFieldConfigs}
 * @see {defineFieldConfigs}
 */
export const defineFieldConfigs = function <F, V=any, R=any>(options: {
  fieldRules: R,
  validators: V,
  configBuilder: (define: UDFieldDefineMethod<F, V, R>) => FormField<F, F, V>[];
}): UDFieldConfigs<F, V> {
	...
}
```

**example**

> 完整範例見 **fomConfig.test.setup.ts ｜ [source][configTest]**

```ts
type Fields = SignUpPayload 
	& LoginPayload
	& UpdatePwdPayload;
type V = typeof validators;
type R = typeof fieldRules;
export const fieldConfigs = defineFieldConfigs<Fields, V, R>({
  fieldRules,
  validators,
  configBuilder: (define)=>([
      define({
          fieldName: "password",
          payloadKey: "password",
          placeholder: computed(()=> ""),
          label: computed(()=> ""),
          ruleBuilder: (rules)=>{
              return rules.password.rules;
          },
          valueBuilder: ()=>{
              return "";
          }
      }),
    ]),
		...
  })
```

### configBuilder - define 方法
[source][s-configBuilder] | 

```ts
/** 
  * 使用者自定義欄位設定, param options 繼承至 {@link FormField}
  * @typeParam F - 所有欄位 payload 型別聯集
  * @typeParam V - validators
  * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
  * @param ruleBuilder - 需返迴驗證規則 {@link FieldRuleBuilder}
  * @param valueBuilder -  需返回 {@link FormValue}
  * @param fieldName - {@link FormField}
  * @param placeholder - {@link FormField}
  * @param hidden - {@link FormField}
  * @param disabled - {@link FormField}
  * @param label - {@link FormField}
  * @param fieldType - {@link FormField}
  * @param payloadKey - {@link FormField}
  */
export type UDFieldDefineMethod<F, V, R> = (
  option: Pick<
    FormField<F, F, V>,
    "placeholder" | "hidden" | "disabled" | "label" | "fieldType" | "payloadKey"
  > & {
    fieldName: string;
    ruleBuilder: FieldRuleBuilder<R, V>;
    valueBuilder: () => FormValue<F, F, V>;
  }
) => FormField<F, F, V>;
```

- fieldName - 欄位名稱
- payloadKey - 傳送至遠端的 payload 鍵名，同樣的 payload 鍵名可以有不同的欄位名稱，如 password 可能用於 userLogin / userRegister / userResetPassword，可以為這三種表單情境分別命名不同的欄位名，也可以視為同一個欄位名稱.

## defineValidators
[source][s-defineValidators] | 

**型別定義**

```ts
export function defineValidators<T, V = (typeof EBaseValidationIdents) & T>(
  option: {
    identity: keyof T;
    handler: ValidatorHandler<V>
  }[]
): {
  validatorIdents: Record<keyof V, keyof V>;
  validators: InternalValidators<V>;
} {
```

**example**

完整範例見 **fomConfig.test.setup.ts | [source][configTest]**

```ts
export const {validatorIdents, validators} = defineValidators([
  {
    identity: EAdditionalValidatorIdents.occupationLength,
    handler: (ctx, ...args)=>{
      return v8n().length(10, 30).test(ctx.value);
    }
  },
  ...]);

validators.occupationLength // InternalValidator 物件;
assert(validatorIdents.occupationLength == EAdditionalValidatorIdents.occupationLength);
```

## defineRules
[source][s-defineRules] | 

**型別定義**

```ts
/**
 * 使用者自定義「驗證規則」（validation rules)，「驗證子」(validator) 定義 
 * @see {@link defineValidators}
 * @typeParam V - 繼承預設「驗證子」值鍵對 加上 R
 * @typeParam R - 使用者目前新增定義的驗證子值鍵對
 */
export const defineFieldRules = function <
  R, 
  V = (typeof EBaseValidationIdents) & R,
>(options: {
  validators: InternalValidators<V>;
  ruleChain: UDFieldRuleConfig<R, V>[];
}): UDFieldRules<R, V>
```

**example**

完整範例見 **fomConfig.test.setup.ts | [source][configTest]**

```ts
export const fieldRules = defineFieldRules({
    validators: V,
    ruleChain: [
        {ident: EFieldNames.password, rules: ruleOfPassword},
        {ident: "confirmPassword", rules: [
            ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.password})
        ]}]
});
fieldRules.nickname // UDFieldRuleConfig 物件
```

## defineValidationMsg
[source][s-defineValidationMsg] |

**型別定義**

```ts
/** 用來定義驗證規則所對應的驗證訊息
 * 鍵為欄位名，值必須為 {@link ComputedRef}，用來追踪i18n狀態上的變化
 * @typeParam V - validators 值鍵對
 */
export type UDValidationMsgOption<V> = Record<
  keyof (V),
  Optional<ComputedRef<string>>
>;

export const defineValidationMsg = function<V>(
  option: UDValidationMessages<V>
): UDValidationMessages<V>
```

**example**

完整範例見 **fomConfig.test.setup.ts | [source][configTest]**

```ts
export const validationMessages = defineValidationMsg<V>({
    pwdLength: computed(()=>{
			return i18n.t.validationPwdLengthError
		}),
    pwdPattern: undefined,
    insureMatch: undefined,
});

assert(validationMessages.pwdLength == i18n.t.validationPwdLengthError.value);
assert(validationMessages.pwdPattern == `${undefinedValidationErrorMessage}"pwdPattern"`);
assert(validationMessages.insureMatch == `${undefinedValidationErrorMessage}"insureMatch"`);

``` 