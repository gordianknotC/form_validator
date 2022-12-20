import { baseFieldRules } from "@/base/baseRuleImpl";
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
export const defineFieldRules = function (options) {
    const { ruleChain, validators } = options;
    const newFieldRules = baseFieldRules;
    ruleChain.forEach(fieldRuleConfig => {
        const ident = fieldRuleConfig.ident;
        newFieldRules[ident] ?? (newFieldRules[ident] = {});
        const newRule = newFieldRules[ident];
        newRule.ident = ident;
        Object.assign(newRule, {
            ...fieldRuleConfig,
        });
    });
    return newFieldRules;
};
//# sourceMappingURL=formRuleUtil.js.map