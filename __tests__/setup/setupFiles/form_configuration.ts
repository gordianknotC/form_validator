import { computed } from "@gdknot/frontend_common";
import { baseValidators, defineFieldConfigs, defineFieldRules, defineValidators, EBaseValidationIdents } from "base/formRuleUtil";
import v8n from "v8n/types/umd";

const OCCUPATION_PATTERN = /designer|engineer|student|freelancer/g;
const {validationIdents, validators} = defineValidators([
  /** 長度範例 */
  {
    identity: "occupationLength",
    handler: (ctx, ...args)=>{
      return v8n().length(10, 30).test(ctx.value);
    }
  },
  /** Regex 範例 */
  {
    identity: "occupationPattern",
    handler: (ctx, ...args)=>{
      return v8n().pattern(OCCUPATION_PATTERN).test(ctx.value);
    }
  },
  /** 匹配其他 field 範例, 確保匹配 */
  {
    identity: "insureMatch",
    handler: (ctx, ...args)=>{
      const name = ctx.name;
      const targetName = name.split("_insureMatch")[0];
      const targetField = ctx.model.getFieldByFieldName(targetName);
      const targetVal = targetField.value;
      ctx.model.linkFields({
        master: { name: ctx.name as any, dataKey: ctx.dataKey },
        slave: { name: targetField.name, dataKey: targetField.dataKey },
      });
      return targetVal == ctx.value;
    }
  },
  /** 匹配其他 field 範例, 確保不匹配 */
  {
    identity: "insureMismatch",
    handler: (ctx, ...args)=>{
      const name = ctx.name;
      const targetName = name.split("_insureMismatch")[0];
      const targetField = ctx.model.getFieldByFieldName(targetName);
      const targetVal = targetField.value;
      ctx.model.linkFields({
        master: { name: ctx.name as any, dataKey: ctx.dataKey },
        slave: { name: targetField.name, dataKey: targetField.dataKey },
      });
      return targetVal != ctx.value;
    }
  },
  {
    identity: "insureNumber",
    handler: (ctx, ...args)=>{
      if(isNaN(Number(ctx.value))){
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

const R = validators;
R.required;
const fieldRules = defineFieldRules([
    {ident: "password", rules: [
        R.bail, R.required, R.pwdLength, R.pwdPattern  
    ]},
    {ident: "newPassword", rules: [
        R.bail, R.required, R.notEqual, R.pwdLength, R.pwdPattern  
    ]},
    {ident: "username", rules: [
        R.bail, R.required, R.userLength, R.userPattern  
    ]},
    {ident: "nickname", rules: [
        R.required, R.nickLength, R.userPattern  
    ]},
    {ident: "confirmPassword", rules: [
        R.required, R.confirm
    ]},
    {ident: "remark", rules: [
        R.optional
    ]},
    {ident: "allUsername", rules: [
        R.required, R.userLength, R.userPattern  
    ]},
    {ident: "username", rules: [
        R.required, R.userLength, R.userPattern  
    ]},
], validators);

fieldRules.confirmPassword;
fieldRules.email.handler;
fieldRules.email.targetHandler;

const fieldConfigs = defineFieldConfigs([
  ()=>({
    ...fieldRules.allUsername.config,
    dataKey: "username",
    value: "",
    label: computed(() => "facade.languageService.txt.username"),
    placeholder: computed(() => "facade.languageService.txt.placeholder_username")
  }),
  ()=>({
    ...fieldRules.password.config,
    dataKey: "password",
    value: "",
    fieldType: "password",
    label: computed(() => "facade.languageService.txt.password"),
    placeholder: computed(() => "facade.languageService.txt.placeholder_password")
  }), 
  ()=>({
    ...fieldRules.notEqua.linkHandler("password"),
    dataKey: "new_password",
    value: "",
    fieldType: "password",
    label: computed(() => "facade.languageService.txt.newPassword"),
    placeholder: computed(() => "facade.languageService.txt.placeholder_password")
  }),
  ()=>({
    ...fieldRules.confirm("new_password"),
    dataKey: "confirm_new_password",
    value: "",
    fieldType: "password",
    label: computed(() => "facade.languageService.txt.newPasswordConfirm"),
    placeholder: computed(
      () => "facade.languageService.txt.placeholder_confirm_password"
    )
  }),
  ()=>({
    dataKey: "confirm_password",
    value: "",
    ...fieldRules.confirm("password")
    fieldType: "password",
    label: computed(() => "facade.languageService.txt.confirmPassword"),
    fieldRule: appFormRules.general.confirmPassword,
    placeholder: computed(
      () => "facade.languageService.txt.placeholder_confirm_password"
    )
  }),
  ()=>({
    dataKey: "nickname",
    value: "",
    label: computed(() => "facade.languageService.txt.nickname"),
    fieldRule: appFormRules.general.nickname,
    placeholder: computed(() => "facade.languageService.txt.placeholder_nickname")
  }),
  ()=>({
    dataKey: "remark",
    value: "",
    label: computed(() => "facade.languageService.txt.remark"),
    fieldRule: appFormRules.general.remark,
    placeholder: computed(() => "facade.languageService.txt.placeholder_remark")
  }),
  ()=>({
    dataKey: "phone",
    value: "",
    label: computed(() => "facade.languageService.txt.phone"),
    fieldRule: appFormRules.general.phone,
    placeholder: computed(() => "facade.languageService.txt.placeholder_phone")
  }),
  ()=>({
    dataKey: "email",
    value: "",
    label: computed(() => "facade.languageService.txt.email"),
    fieldRule: appFormRules.general.email,
    placeholder: computed(() => "facade.languageService.txt.placeholder_email")
  }),
]);