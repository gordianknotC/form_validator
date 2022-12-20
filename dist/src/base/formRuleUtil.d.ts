import { VForm } from "@/base/baseFormTypes";
import Validators = VForm.Validators;
import Validator = VForm.Validator;
import FieldRuleConfig = VForm.FieldRuleConfig;
import { FieldRuleBuilderReturnType } from "./formConfigUtil";
import { EBaseValidationIdents } from "./formValidatorUtil";
export type DefinedFieldRules<T> = Record<keyof T, FieldRuleConfig<T> & Validator & {
    config: FieldRuleBuilderReturnType;
    linkField: (fieldName: string) => FieldRuleBuilderReturnType;
}>;
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
export declare const defineFieldRules: <T extends {
    username: {
        rule: string;
        name: string;
    };
    nickname: {
        rule: string;
        name: string;
    };
    password: {
        rule: string;
        name: string;
    };
    newPassword: {
        rule: string;
        name: string;
    };
    confirmPassword: {
        rule: string;
        name: string;
    };
    remark: {
        rule: string;
        name: string;
    };
    allUsername: {
        rule: string;
        name: string;
    };
    searchField: {
        rule: string;
        name: string;
    };
    phone: {
        rule: string;
        name: string;
    };
    email: {
        rule: string;
        name: string;
    };
    referral_code: {
        rule: string;
        name: string;
    };
} & typeof EBaseValidationIdents>(options: {
    ruleChain: VForm.FieldRuleConfig<T>[];
    validators: Validators<keyof typeof EBaseValidationIdents>;
}) => DefinedFieldRules<T>;
