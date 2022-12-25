import { EBaseValidationIdents } from "~/base/impl/baseValidatorImpl";
import { InternalValidators, UDFieldRuleConfig, UDFieldRules } from "@/base/types/validatorTypes";
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
export declare const defineFieldRules: <R, V = typeof EBaseValidationIdents & R, E = any>(options: {
    validators: InternalValidators<V, any>;
    ruleChain: UDFieldRuleConfig<R & E, V>[];
}) => UDFieldRules<R, V>;
