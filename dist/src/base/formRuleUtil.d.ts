import { VForm } from "../../base/vformTypes";
import Validators = VForm.Validators;
import Validator = VForm.Validator;
import ValidatorHandler = VForm.ValidatorHandler;
import ValidatorLinkHandler = VForm.ValidatorLinkHandler;
import FieldRuleConfig = VForm.FieldRuleConfig;
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
export type FieldValidatorLinker = (fieldName: string) => {
    rule: string;
    name: string;
};
export type FieldRuleValidator = {
    name: string;
    handler: ValidatorHandler;
    linkTo?: FieldValidatorLinker;
};
export type FieldRuleRef = {
    rule: string;
    name: string;
    linkTo?: FieldValidatorLinker;
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
/** 同樣適用於 vue_formula, 規則同於 vue_formula*/
export declare const baseValidators: Record<EBaseValidationIdents, {
    handler: ValidatorHandler;
    linkHandler?: ValidatorLinkHandler;
}>;
export type DefaultValidationHandlers = typeof baseValidators;
export declare function getValidationRules(): DefaultValidationHandlers;
export type DefaultFieldRules = typeof baseFieldRules;
export declare function getFieldRules(): DefaultFieldRules;
export declare function defineValidators<T>(rules: {
    identity: keyof T;
    handler: ValidatorHandler;
    linkHandler?: ValidatorLinkHandler;
}[]): {
    validationIdents: Record<(keyof T), string>;
    validators: Validators<keyof ((typeof EBaseValidationIdents) & T)>;
};
export type DefinedFieldConfigs<F> = Record<keyof F, VForm.FormField<F, F>>;
export declare const defineFieldConfigs: <F>(cfg: (() => VForm.FormField<F, F>)[]) => DefinedFieldConfigs<F>;
export type DefinedFieldRules<T> = Record<keyof T, FieldRuleConfig<T> & Validator & {
    config: {
        name: string;
        fieldRule: string;
    };
    linkField: (fieldName: string) => ({
        name: string;
        fieldRule: string;
    });
}>;
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
} & typeof EBaseValidationIdents>(configurations: VForm.FieldRuleConfig<T>[], validators: Validators<keyof (typeof EBaseValidationIdents)>) => DefinedFieldRules<T>;
