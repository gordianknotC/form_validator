import { DefinedFieldRules, EBaseValidationIdents } from "../../../base/formRuleUtil";
import { Optional, VForm } from "../../../base/vformTypes";
type TLoginPayload = {
    username: string;
    password: string;
};
type TUpdatePwdPayload = {
    password: string;
    new_password: string;
};
type TSignInPayload = {
    password: string;
    username: string;
    remark: Optional<string>;
    nickname: Optional<string>;
    email: string;
    phone: string;
};
type TFields = Omit<TSignInPayload & {
    confirm_password: string;
    id: number;
    merchantId: number;
    confirm_new_password: string;
} & {
    match_id: number;
    sport_id: number;
    contest_size: number;
    prize: number;
    max_teams: number;
    profit: number;
    entity: number;
    confirmedLeague: boolean;
    unconfirmedLeague: boolean;
    winners: number;
} & TLoginPayload & TUpdatePwdPayload, "role">;
export declare const validationIdents: Record<"occupationLength" | "occupationPattern" | "insureMatch" | "insureMismatch" | "insureNumber", string>, validators: VForm.Validators<"username" | "optional" | "remark" | "phone" | "email" | "bail" | "greater" | "lesser" | "confirm" | "notEqual" | "pwdLength" | "pwdPattern" | "required" | "searchLength" | "nickLength" | "userLength" | "amountLength" | "userPattern" | "decimalPattern" | "intPattern" | "occupationLength" | "occupationPattern" | "insureMatch" | "insureMismatch" | "insureNumber">;
export declare const fieldRules: DefinedFieldRules<{
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
} & typeof EBaseValidationIdents>;
export declare const fieldConfigs: import("../../../base/formRuleUtil").DefinedFieldConfigs<TFields>;
export {};
