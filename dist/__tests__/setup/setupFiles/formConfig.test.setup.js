import { computed } from "@gdknot/frontend_common";
import { defineValidators, EBaseValidationIdents, defineFieldRules, defineFieldConfigs } from "index";
import v8n from "v8n/types/umd";
const OCCUPATION_PATTERN = /designer|engineer|student|freelancer/g;
export const { validatorIdents, validators } = defineValidators([
    /** 長度範例 */
    {
        identity: "occupationLength",
        handler: (ctx, ...args) => {
            return v8n().length(10, 30).test(ctx.value);
        }
    },
    /** Regex 範例 */
    {
        identity: "occupationPattern",
        handler: (ctx, ...args) => {
            return v8n().pattern(OCCUPATION_PATTERN).test(ctx.value);
        }
    },
    /** 匹配其他 field 範例, 確保匹配 */
    {
        identity: "insureMatch",
        handler: (ctx, ...args) => {
            const name = ctx.name;
            const linkName = ctx.getLinkedFieldName(validatorIdents.insureMismatch);
            assert(linkName != undefined);
            const linkField = ctx.model.getFieldByFieldName(linkName);
            const linkVal = linkField.value;
            ctx.model.linkFields({
                master: { name: ctx.name, payloadKey: ctx.payloadKey },
                slave: { name: linkField.name, payloadKey: linkField.payloadKey },
            });
            return linkVal == ctx.value;
        },
    },
    /** 匹配其他 field 範例, 確保不匹配 */
    {
        identity: "insureMismatch",
        handler: (ctx, ...args) => {
            const name = ctx.name;
            const linkName = ctx.getLinkedFieldName(validatorIdents.insureMismatch);
            assert(linkName != undefined);
            const linkField = ctx.model.getFieldByFieldName(linkName);
            const linkVal = linkField.value;
            ctx.model.linkFields({
                master: { name: ctx.name, payloadKey: ctx.payloadKey },
                slave: { name: linkField.name, payloadKey: linkField.payloadKey },
            });
            return linkVal != ctx.value;
        }
    },
    {
        identity: "insureNumber",
        handler: (ctx, ...args) => {
            if (isNaN(Number(ctx.value))) {
                ctx.value = 0;
            }
            return true;
        }
    }
]);
validatorIdents.insureMismatch;
const V = validators;
/** 由 {@link EBaseValidationIdents} 存取 validators  */
const ruleOfPassword = [
    V[EBaseValidationIdents.bail],
    V[EBaseValidationIdents.required],
    V[EBaseValidationIdents.pwdLength],
    V[EBaseValidationIdents.pwdPattern],
];
export const fieldRules = defineFieldRules({
    validators: V,
    ruleChain: [
        { ident: "password", rules: ruleOfPassword },
        { ident: "confirmPassword", rules: [
                ...ruleOfPassword, V.confirm.linkField("password")
            ] },
        { ident: "newPassword", rules: [
                ...ruleOfPassword, V.notEqual.linkField("password")
            ] },
        { ident: "confirmNewPassword", rules: [
                ...ruleOfPassword, V.confirm.linkField("new_password")
            ] },
        { ident: "username", rules: [
                V.required, V.userLength, V.userPattern
            ] },
        { ident: "nickname", rules: [
                V.required, V.nickLength, V.userPattern
            ] },
        { ident: "remark", rules: [
                V.optional
            ] },
        { ident: "allUsername", rules: [
                V.required, V.userLength, V.userPattern
            ] },
        { ident: "username", rules: [
                V.required, V.userLength, V.userPattern
            ] },
    ],
});
export const fieldConfigs = defineFieldConfigs({
    fieldRules,
    validators,
    configBuilder: (define) => ([
        // signup - password
        // signup - confirm_password
        define({
            fieldName: "confirmPasswordOnSignup",
            payloadKey: "confirm_password",
            placeholder: computed(() => ""),
            label: computed(() => ""),
            ruleBuilder: (rules) => {
                return rules.confirmPassword.rules;
            },
            valueBuilder: () => {
                return null;
            }
        }),
        // reset - old password - payloadKey: password
        // reset - new password - payloadKey: new_password
        define({
            fieldName: "newPassword",
            payloadKey: "new_password",
            placeholder: computed(() => ""),
            label: computed(() => ""),
            ruleBuilder: (rules) => {
                return rules.newPassword.rules;
            },
            valueBuilder: () => {
                return null;
            }
        }),
        // reset - confirm new password - payloadKey: confirm_new_password
        define({
            fieldName: "confirmPasswordOnReset",
            payloadKey: "confirm_new_password",
            placeholder: computed(() => ""),
            label: computed(() => ""),
            ruleBuilder: (rules) => {
                return rules.confirmNewPassword.rules;
            },
            valueBuilder: () => {
                return null;
            }
        }),
        define({
            fieldName: "password",
            payloadKey: "password",
            placeholder: computed(() => ""),
            label: computed(() => ""),
            ruleBuilder: (rules) => {
                return rules.password.rules;
            },
            valueBuilder: () => {
                return "";
            }
        }),
        define({
            fieldName: "username",
            payloadKey: "username",
            placeholder: computed(() => ""),
            label: computed(() => ""),
            ruleBuilder: (rules) => {
                return rules.username.rules;
            },
            valueBuilder: () => {
                return "";
            }
        }),
        define({
            fieldName: "nickname",
            payloadKey: "nickname",
            placeholder: computed(() => ""),
            label: computed(() => ""),
            ruleBuilder: (rules) => {
                return rules.nickname.rules;
            },
            valueBuilder: () => {
                return "";
            }
        }),
        define({
            fieldName: "remark",
            payloadKey: "remark",
            placeholder: computed(() => ""),
            label: computed(() => ""),
            ruleBuilder: (rules) => {
                return rules.remark.rules;
            },
            valueBuilder: () => {
                return null;
            }
        }),
    ])
});
//# sourceMappingURL=formConfig.test.setup.js.map