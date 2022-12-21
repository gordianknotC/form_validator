import { VForm } from "@/base/baseFormTypes";
import { baseFieldRules } from "@/base/baseRuleImpl";
import { EBaseValidationIdents } from "@/base/baseValidatorImpl";
//@ts-ignore
import InternalValidators = VForm.InternalValidators;
import InternalValidator = VForm.InternalValidator;
import UDFieldRuleConfig = VForm.UDFieldRuleConfig;
import UDFieldRules = VForm.UDFieldRules;



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
  R, 
  V = (typeof EBaseValidationIdents) & R,
  E = any
>(options: {
  validators: InternalValidators<V>;
  ruleChain: UDFieldRuleConfig<R & E, V>[];
}): UDFieldRules<R, V> {
  const { ruleChain, validators } = options;
  const newFieldRules = baseFieldRules as any as UDFieldRules<R, V>;
  ruleChain.forEach(fieldRuleConfig => {
    const ident = fieldRuleConfig.ident as any as keyof (typeof newFieldRules);
    newFieldRules[ident] ??= {} as any;

    const newRule = newFieldRules[ident];
    newRule.ident = ident;

    Object.assign(newRule, {
      ...fieldRuleConfig,
    });
  });

  Object.assign(baseFieldRules, newFieldRules);
  return newFieldRules;
};

