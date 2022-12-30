"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineFieldRules = void 0;
const baseRuleImpl_1 = require("~/base/impl/baseRuleImpl");
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
const defineFieldRules = function (options) {
    const { ruleChain, validators } = options;
    const newFieldRules = baseRuleImpl_1.baseFieldRules;
    ruleChain.forEach(fieldRuleConfig => {
        const ident = fieldRuleConfig.ident;
        newFieldRules[ident] ?? (newFieldRules[ident] = {});
        const newRule = newFieldRules[ident];
        newRule.ident = ident;
        Object.assign(newRule, {
            ...fieldRuleConfig,
        });
    });
    Object.assign(baseRuleImpl_1.baseFieldRules, newFieldRules);
    return newFieldRules;
};
exports.defineFieldRules = defineFieldRules;
//# sourceMappingURL=formRuleUtil.js.map