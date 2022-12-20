import { computed } from "@gdknot/frontend_common";
import { Optional, VForm } from "@/base/baseFormTypes";
import { defineValidators, EBaseValidationIdents, defineFieldRules, defineFieldConfigs } from "index";
import v8n from "v8n/types/umd";
import { TFields } from "./payload.test.setup";
import { baseFieldRules } from "base/baseRuleImpl";

const OCCUPATION_PATTERN = /designer|engineer|student|freelancer/g;
export const {validationIdents, validators} = defineValidators([
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
        master: { name: ctx.name as any, payloadKey: ctx.payloadKey },
        slave: { name: targetField.name, payloadKey: targetField.payloadKey },
      });
      return targetVal == ctx.value;
    },
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
        master: { name: ctx.name as any, payloadKey: ctx.payloadKey },
        slave: { name: targetField.name, payloadKey: targetField.payloadKey },
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

validators;
validationIdents;

EBaseValidationIdents.required;
/** 宣告後的 rules / validationHandlers 型別繼承 */
validationIdents.occupationLength
validationIdents.occupationLength;
validationIdents.occupationPattern;
validationIdents.insureNumber;
validationIdents.decimalPattern;
validationIdents.email;
validators.email.handler;
validators.occupationLength.validatorName;
validators.insureMatch;
validators.decimalPattern;
validators.required;
validators.bail;

const V = validators;
V.required;
V.confirm
export const fieldRules = defineFieldRules({
    validators: V,
    ruleChain: [
        {ident: "password", rules: [
            V.bail, V.required, V.pwdLength, V.pwdPattern
        ]},
        {ident: "confirmPassword", rules: [
            V.bail, V.required, V.pwdLength, V.pwdPattern, V.confirm.linkField!("password")
        ]},
        {ident: "username", rules: [
            V.bail, V.required, V.userLength, V.userPattern  
        ]},
        {ident: "nickname", rules: [
            V.required, V.nickLength, V.userPattern  
        ]},
        {ident: "remark", rules: [
            V.optional
        ]},
        {ident: "allUsername", rules: [
            V.required, V.userLength, V.userPattern  
        ]},
        {ident: "username", rules: [
            V.required, V.userLength, V.userPattern  
        ]},
    ], 
});
fieldRules.nickname;
fieldRules.email;
baseFieldRules
fieldRules.email.ident;
fieldRules.email.rules;
fieldRules.nickname;
fieldRules.username;
fieldRules.confirmPassword;

export const fieldConfigs = defineFieldConfigs<TFields, typeof validators, typeof fieldRules>({
    fieldRules,
    validators,
    configBuilder: (define)=>([
        // signup - password
        // signup - confirm_password
        define({
            fieldName: "confirmPasswordOnSignup",
            payloadKey: "confirm_password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                
                assert(rules.confirm.linkHandler != undefined);
                return rules.confirm;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        // reset - old password - payloadKey: password
        // reset - new password - payloadKey: new_password
        define({
            fieldName: "newPassword",
            payloadKey: "new_password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                rules.notEqual.linkHandler!("password");
                return rules.notEqual.linkedFieldName("password");
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        // reset - confirm new password - payloadKey: confirm_new_password
        define({
            fieldName: "confirmPasswordOnReset",
            payloadKey: "confirm_new_password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.confirm.linkedFieldName("new_password");
            },
            valueBuilder: ()=>{
                return null;
            }
        }),

        define({
            fieldName: "password",
            payloadKey: "password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.password.config;
            },
            valueBuilder: ()=>{
                return "";
            }
        }),
        define({
            fieldName: "username",
            payloadKey: "username",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.username.config;
            },
            valueBuilder: ()=>{
                return "";
            }
        }),
        define({
            fieldName: "nickname",
            payloadKey: "nickname",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.nickname.config;
            },
            valueBuilder: ()=>{
                return "";
            }
        }),
        define({
            fieldName: "remark",
            payloadKey: "remark",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.remark.config;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        define({
            fieldName: "email",
            payloadKey: "email",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.email.config;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        define({
            fieldName: "phone",
            payloadKey: "phone",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.phone.config;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),

        define({
            fieldName: "prize",
            payloadKey: "prize",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.decimalPattern.config;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        
        define({
            fieldName: "profit",
            payloadKey: "profit",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.decimalPattern.config;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        
        
    ])
})
