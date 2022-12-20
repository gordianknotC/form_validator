import { VForm } from "@/base/baseFormTypes";
import ValidatorHandler = VForm.ValidatorHandler;
import ValidatorLinkHandler = VForm.ValidatorLinkHandler;
/**
 * 預設 Validator 名, 可介由 {@link defineValidators} 擴展延伸
 */
export declare enum EBaseValidationIdents {
    /** general user name regex pattern, 預設大小寫英文數字減號 */
    username = "username",
    /** 指定 bail 推疊多個 validation rules, e.g: bail|username|userLength */
    bail = "bail",
    /** greater */
    greater = "greater",
    lesser = "lesser",
    /** 當欄位名取為為 fieldName_confirm 時, 則可用來匹配 欄位名 fieldName */
    confirm = "confirm",
    email = "email",
    remark = "remark",
    /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
     *  就代表其 prefix 為 notEqual 的比較對象
     * */
    notEqual = "notEqual",
    /** 無 rule, 不檢查*/
    optional = "optional",
    phone = "phone",
    /**8-30字*/
    pwdLength = "pwdLength",
    /** 大小寫英文數字(底線、減號、井號) 8-30字*/
    pwdPattern = "pwdPattern",
    /** 必填*/
    required = "required",
    /**  3字*/
    searchLength = "searchLength",
    /**  1-10字*/
    nickLength = "nickLength",
    /**  5-30字*/
    userLength = "userLength",
    amountLength = "amountLength",
    userPattern = "userPattern",
    decimalPattern = "decimalPattern",
    intPattern = "intPattern"
}
/**
 * 定義 {@link DefinedFieldRules} 的 linkField 方法
 * e.g.: fieldRule.ruleName.linkField(filedName) */
export type FieldValidatorLinker = (fieldName: string) => {
    rule: string;
    name: string;
};
export declare const baseFieldRules: {
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
};
export declare function aRule<T extends EBaseValidationIdents>(rules: T[]): string;
/**
 * 定義 Validator Handler
 * {@link ValidatorLinkHandler} - 定義欄位連結邏輯
 * {@link ValidatorHandler} - 定義 Validator 邏輯
 * e.g.:
 *  validators.ident.handler()
 *  validators.ident.linkHandler(fieldName)
 *
 * @param handler
 * @param linkHandler
 */
export type UDValidatorHandler = {
    handler: ValidatorHandler;
    linkHandler?: ValidatorLinkHandler;
};
/** 預設validators */
export declare const baseValidators: Record<EBaseValidationIdents, UDValidatorHandler>;
