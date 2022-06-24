import { VForm } from "../base/vformTypes";
import TValidationHandler = VForm.TValidationRuleHandler;
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
export declare const baseFieldRules: {
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
export declare function aRule(rules: string[]): string;
/** 同樣適用於 vue_formula, 規則同於 vue_formula*/
export declare const baseValidationRules: Record<EBaseValidationRules, (ctx: VForm.IBaseFormContext<any, any>, ...args: any[]) => boolean>;
export declare function addValidationRule<T extends string>(ruleName: T, handler: TValidationHandler, override?: boolean): T;
export declare function addFieldRule<T extends string>(fieldName: T, rule: string, override?: boolean): DefaultFieldRules;
export declare type DefaultValidationRules = typeof baseValidationRules;
export declare function getValidationRules(): DefaultValidationRules;
export declare type DefaultFieldRules = typeof baseFieldRules;
export declare function getFieldRules(): DefaultFieldRules;
