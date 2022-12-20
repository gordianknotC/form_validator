import { Optional } from "index";
export type TLoginPayload = {
    username: string;
    password: string;
};
export type TUpdatePwdPayload = {
    password: string;
    new_password: string;
};
export type TSignInPayload = {
    password: string;
    username: string;
    remark: Optional<string>;
    nickname: Optional<string>;
    email: string;
    phone: string;
};
export type TFields = Omit<TSignInPayload & {
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
