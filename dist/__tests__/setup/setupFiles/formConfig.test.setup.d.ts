import { VForm } from "@/base/baseFormTypes";
import { EBaseValidationIdents } from "index";
import { TFields } from "./payload.test.setup";
export declare const validatorIdents: Record<"occupationLength" | "occupationPattern" | "insureMatch" | "insureMismatch" | "insureNumber" | "username" | "bail" | "greater" | "lesser" | "confirm" | "email" | "remark" | "notEqual" | "optional" | "phone" | "pwdLength" | "pwdPattern" | "required" | "searchLength" | "nickLength" | "userLength" | "amountLength" | "userPattern" | "decimalPattern" | "intPattern", "occupationLength" | "occupationPattern" | "insureMatch" | "insureMismatch" | "insureNumber" | "username" | "bail" | "greater" | "lesser" | "confirm" | "email" | "remark" | "notEqual" | "optional" | "phone" | "pwdLength" | "pwdPattern" | "required" | "searchLength" | "nickLength" | "userLength" | "amountLength" | "userPattern" | "decimalPattern" | "intPattern">, validators: VForm.InternalValidators<typeof EBaseValidationIdents & {
    occupationLength: any;
} & {
    occupationPattern: any;
} & {
    insureMatch: any;
} & {
    insureMismatch: any;
} & {
    insureNumber: any;
}>;
export declare const fieldRules: VForm.UDFieldRules<{
    password: any;
} & {
    confirmPassword: any;
} & {
    newPassword: any;
} & {
    confirmNewPassword: any;
} & {
    username: any;
} & {
    nickname: any;
} & {
    remark: any;
} & {
    allUsername: any;
}, typeof EBaseValidationIdents & {
    occupationLength: any;
} & {
    occupationPattern: any;
} & {
    insureMatch: any;
} & {
    insureMismatch: any;
} & {
    insureNumber: any;
}>;
export declare const fieldConfigs: VForm.UDFieldConfigs<TFields, VForm.InternalValidators<typeof EBaseValidationIdents & {
    occupationLength: any;
} & {
    occupationPattern: any;
} & {
    insureMatch: any;
} & {
    insureMismatch: any;
} & {
    insureNumber: any;
}>>;
