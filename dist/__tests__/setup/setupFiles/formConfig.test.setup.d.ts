import { VForm } from "@/base/baseFormTypes";
import { EBaseValidationIdents } from "index";
import { TFields } from "./payload.test.setup";
export declare const validationIdents: Record<"occupationLength" | "occupationPattern" | "insureMatch" | "insureMismatch" | "insureNumber" | "username" | "bail" | "greater" | "lesser" | "confirm" | "email" | "remark" | "notEqual" | "optional" | "phone" | "pwdLength" | "pwdPattern" | "required" | "searchLength" | "nickLength" | "userLength" | "amountLength" | "userPattern" | "decimalPattern" | "intPattern", string>, validators: VForm.InternalValidators<typeof EBaseValidationIdents & {
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
