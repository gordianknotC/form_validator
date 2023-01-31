import { EBaseValidationIdents } from "../base/impl/baseValidatorImpl";
import { InternalValidators, UDFieldRuleConfig, UDFieldRules } from "../base/types/validatorTypes";
/**
 * 使用者自定義「驗證規則」（validation rules)，「驗證子」(validator) 定義
 * @see {@link defineValidators}
 * @typeParam V - 繼承預設「驗證子」值鍵對 加上 R
 * @typeParam R - 使用者目前新增定義的驗證子值鍵對
 * @example
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
export declare const defineFieldRules: <R, V = typeof EBaseValidationIdents & R>(options: {
    validators: InternalValidators<V, any>;
    ruleChain: UDFieldRuleConfig<R, V>[];
}) => UDFieldRules<R, V>;
