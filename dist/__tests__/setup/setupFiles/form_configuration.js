import { computed } from "@gdknot/frontend_common";
import { defineFieldConfigs, defineFieldRules, defineValidators, EBaseValidationIdents } from "../../../base/formRuleUtil";
import v8n from "v8n/types/umd";
const OCCUPATION_PATTERN = /designer|engineer|student|freelancer/g;
const { validationIdents, validators } = defineValidators([
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
            const targetName = name.split("_insureMatch")[0];
            const targetField = ctx.model.getFieldByFieldName(targetName);
            const targetVal = targetField.value;
            ctx.model.linkFields({
                master: { name: ctx.name, dataKey: ctx.dataKey },
                slave: { name: targetField.name, dataKey: targetField.dataKey },
            });
            return targetVal == ctx.value;
        }
    },
    /** 匹配其他 field 範例, 確保不匹配 */
    {
        identity: "insureMismatch",
        handler: (ctx, ...args) => {
            const name = ctx.name;
            const targetName = name.split("_insureMismatch")[0];
            const targetField = ctx.model.getFieldByFieldName(targetName);
            const targetVal = targetField.value;
            ctx.model.linkFields({
                master: { name: ctx.name, dataKey: ctx.dataKey },
                slave: { name: targetField.name, dataKey: targetField.dataKey },
            });
            return targetVal != ctx.value;
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
EBaseValidationIdents.required;
/** 宣告後的 rules / validationHandlers 型別繼承 */
validationIdents.occupationLength;
validationIdents.occupationPattern;
validationIdents.insureNumber;
validators;
validators.occupationLength;
validators.insureMatch;
validators.required;
const V = validators;
V.required;
const fieldRules = defineFieldRules([
    { ident: "password", rules: [
            V.bail, V.required, V.pwdLength, V.pwdPattern
        ] },
    { ident: "newPassword", rules: [
            V.bail, V.required, V.notEqual, V.pwdLength, V.pwdPattern
        ] },
    { ident: "username", rules: [
            V.bail, V.required, V.userLength, V.userPattern
        ] },
    { ident: "nickname", rules: [
            V.required, V.nickLength, V.userPattern
        ] },
    { ident: "confirmPassword", rules: [
            V.required, V.confirm
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
], V);
fieldRules.confirmPassword;
fieldRules.email.handler;
fieldRules.email.targetHandler;
fieldRules.email.ident;
fieldRules.email.rules;
const fieldConfigs = defineFieldConfigs([
    () => ({
        ...fieldRules.notEqual.linkField("password"),
        dataKey: "new_password",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.newPassword"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_password")
    }),
    () => ({
        ...fieldRules.confirm.linkField("new_password"),
        dataKey: "confirm_new_password",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.newPasswordConfirm"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_confirm_password")
    }),
    () => ({
        ...fieldRules.confirm.linkField("password"),
        dataKey: "confirm_password",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.confirmPassword"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_confirm_password")
    }),
    () => ({
        ...fieldRules.allUsername.config,
        dataKey: "username",
        value: "",
        label: computed(() => "facade.languageService.txt.username"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_username")
    }),
    () => ({
        ...fieldRules.password.config,
        dataKey: "password",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.password"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_password")
    }),
    () => ({
        ...fieldRules.nickname.config,
        dataKey: "nickname",
        value: "",
        fieldType: "text",
        label: computed(() => "facade.languageService.txt.nickname"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_nickname")
    }),
    () => ({
        ...fieldRules.remark.config,
        dataKey: "remark",
        value: "",
        label: computed(() => "facade.languageService.txt.remark"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_remark")
    }),
    () => ({
        ...fieldRules.email.config,
        dataKey: "email",
        value: "",
        label: computed(() => "facade.languageService.txt.email"),
        placeholder: computed(() => "facade.languageService.txt.placeholder_email")
    }),
]);
//# sourceMappingURL=form_configuration.js.map