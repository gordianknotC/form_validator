import { VForm } from "~/appCommon/types/vformTypes";
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
export declare function addRule<T extends string>(ruleName: T, handler: TFormRuleHandler, override?: boolean): T;
export declare function getFormRules(): Record<string, VForm.TFormRuleHandler>;
