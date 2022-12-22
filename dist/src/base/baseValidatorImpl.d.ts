import { VForm } from "@/base/baseFormTypes";
import InternalValidators = VForm.InternalValidators;
import InternalValidator = VForm.InternalValidator;
/**
 * 預設 Validator 名, 可介由 {@link defineValidators} 擴展延伸
 */
export declare enum EBaseValidationIdents {
    /** general user name regex pattern, 預設大小寫英文數字減號 */
    username = "username",
    /**
     * todo: 指定 bail 推疊多個 validation rules, e.g: bail|username|userLength */
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
export declare const aValidator: <T>(option: Partial<VForm.InternalValidator<T, any>>) => VForm.InternalValidator<T, any>;
/** 預設validators */
export declare const baseValidators: InternalValidators<typeof EBaseValidationIdents>;
