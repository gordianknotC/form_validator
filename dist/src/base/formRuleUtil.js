import { baseFieldRules } from "./formValidatorUtil";
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
    const { ruleChain: configurations, validators } = options;
    const newFieldRules = baseFieldRules;
    configurations.forEach(config => {
        const ident = config.ident;
        const validator = validators[ident] ?? {};
        newFieldRules[ident].ident = ident;
        newFieldRules[ident] ?? (newFieldRules[ident] = {
            ...config,
            ...validator,
            config: {
                name: String(ident),
                fieldRule: config.rules.map(_ => _.validatorName).join("|")
            },
            linkField: (linkField) => {
                const name = validator.linkHandler(linkField).linkField;
                const fieldRule = newFieldRules[ident].rules
                    .map(_ => _.validatorName)
                    .join("|");
                return { name, fieldRule };
            }
        });
    });
    return newFieldRules;
};
//# sourceMappingURL=formRuleUtil.js.map