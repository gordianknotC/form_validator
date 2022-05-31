import { VForm } from "~/base/vformTypes";
import TFormRuleHandler = VForm.TFormRuleHandler;
export declare enum EBaseValidationRules {
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
export declare const appFormRules: {
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
/** 同樣適用於 vue_formula, 規則同於 vue_formula*/
export declare const baseValidationRules: Record<string, VForm.TFormRuleHandler>;
export declare function addRule<T extends string>(ruleName: T, handler: TFormRuleHandler, override?: boolean): T;
export declare type DefaultValidationRules = typeof baseValidationRules;
export declare function getValidationRules(): DefaultValidationRules;
export declare type DefaultFormRules = typeof appFormRules;
export declare function getFormRules(): DefaultFormRules;
