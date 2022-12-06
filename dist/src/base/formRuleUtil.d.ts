import { VForm } from "../../base/vformTypes";
import TValidationHandler = VForm.ValidationRuleHandler;
import { EFormValidationRules } from "@/../__tests__/tests/form.test";
export declare enum EBaseRuleIdent {
    allUserPattern = "allUserPattern",
    bail = "bail",
    greater = "greater",
    lesser = "lesser",
    confirm = "confirm",
    email = "email",
    remark = "remark",
    notEqual = "notEqual",
    optional = "optional",
    phone = "phone",
    pwdLength = "pwdLength",
    pwdPattern = "pwdPattern",
    required = "required",
    searchLength = "searchLength",
    nickLength = "nickLength",
    userLength = "userLength",
    amountLength = "amountLength",
    userPattern = "userPattern",
    decimalPattern = "decimalPattern",
    intPattern = "intPattern"
}
export declare const baseRules: {
    username: string;
    nickname: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    remark: string;
    allUsername: string;
    searchField: string;
    phone: string;
    email: string;
    referral_code: string;
};
export declare function aRule<T extends EBaseRuleIdent>(rules: T[]): string;
/** 同樣適用於 vue_formula, 規則同於 vue_formula*/
export declare const baseValidationHandlers: Record<EBaseRuleIdent, TValidationHandler>;
export type DefaultValidationHandlers = typeof baseValidationHandlers;
export declare function getValidationRules(): DefaultValidationHandlers;
export type DefaultFieldRules = typeof baseRules;
export declare function getFieldRules(): DefaultFieldRules;
export declare function createValidationRules<T>(rules: {
    identity: keyof T;
    extendRules: Partial<(keyof T) & EFormValidationRules>[];
    handler: TValidationHandler;
}[]): {
    rules: DefaultFieldRules & Record<keyof T, string>;
    validationHandler: DefaultValidationHandlers & Record<keyof T, TValidationHandler>;
};
export declare const createFormConfig: <F>(cfg: VForm.FormField<F, F>[]) => Record<keyof F, VForm.FormField<F, F>>;
