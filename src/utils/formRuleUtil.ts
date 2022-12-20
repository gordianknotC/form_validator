import { VForm } from "@/base/baseFormTypes";
//@ts-ignore
import emailValidator from "email-validator";
import InternalValidators = VForm.InternalValidators;
import InternalValidator = VForm.InternalValidator;
import UDFieldRuleConfig = VForm.UDFieldRuleConfig;
import UDFieldRules = VForm.UDFieldRules;
import { baseFieldRules } from "@/base/baseRuleImpl";
import { EBaseValidationIdents } from "@/base/baseValidatorImpl";


/**
使用者自定義「驗證規則」（validation rules)，「驗證子」(validator) 定義 @see ｛defineValidators｝
@typeParam T - 自動繼承預設「驗證規則」至使用者自定義「驗證規則」
@example
```ts
export const fieldRules = defineFieldRules({
    configurations: [
        {ident: "password", rules: [
            V.bail, V.required, V.pwdLength, V.pwdPattern  
        ]},
        ...
    ], 
    validators: V
});
```
 */
export const defineFieldRules = function <
  R extends (typeof baseFieldRules), 
  V = (typeof EBaseValidationIdents) & R
>(options: {
  validators: InternalValidators<V>;
  ruleChain: UDFieldRuleConfig<R, V>[];
}): UDFieldRules<R, V> {
  const { ruleChain, validators } = options;
  const newFieldRules = baseFieldRules as any as UDFieldRules<R, V>;
  ruleChain.forEach(fieldRuleConfig => {
    const ident = fieldRuleConfig.ident;
    newFieldRules[ident] ??= {} as any;
    const newRule = newFieldRules[ident as any as keyof (typeof newFieldRules)];
    newRule.ident = ident as any;

    Object.assign(newRule, {
      ...fieldRuleConfig,
    });
  });
  return newFieldRules;
};

