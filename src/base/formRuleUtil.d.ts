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
export declare const baseFieldRules: Record<string, string>;
/** 同樣適用於 vue_formula, 規則同於 vue_formula*/
export declare const baseValidationRules: Record<string, VForm.TFormRuleHandler>;
export declare function addValidationRule<T extends string>(ruleName: T, handler: TFormRuleHandler, override?: boolean): T;
export declare function addFieldRule<T extends string>(fieldName: T, rule: string, override?: boolean): DefaultFieldRules & Record<T, string>;
export declare type DefaultValidationRules = typeof baseValidationRules;
export declare function getValidationRules(): DefaultValidationRules;
export declare type DefaultFieldRules = typeof baseFieldRules;
export declare function getFormRules(): DefaultFieldRules;
