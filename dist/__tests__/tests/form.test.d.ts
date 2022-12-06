import { TOptional, VForm } from "../../src";
import TFormState = VForm.FormState;
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
    remark: TOptional<string>;
    nickname: TOptional<string>;
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
type TExtraFields = {
    is_generate_contest: number;
    oldPassword: number;
};
export declare enum EFormValidationRules {
    allUserPattern = "allUserPattern",
    bail = "bail",
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
    userPattern = "userPattern"
}
export declare const appFormRules: {
    general: {
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
    };
};
export declare const baseFormState: TFormState<TFields, TExtraFields>;
export {};
