import { computed } from "vue";
import { defineValidators, EBaseValidationIdents, defineFieldRules, defineFieldConfigs } from "index";
import v8n from "v8n";
import { EFieldNames, Fields } from "./payload.test.setup";
import { defineValidationMsg } from "@/utils/formConfigUtil";
import { assert } from "@gdknot/frontend_common";



const OCCUPATION_PATTERN = /designer|engineer|student|freelancer/g;
export enum EAdditionalValidatorIdents  {
    occupationLength = "occupationLength",
    occupationPattern = "occupationPattern",
    insureMatch = "insureMatch",
    insureMismatch = "insureMismatch",
    insureNumber = "insureNumber"
}
export const {validatorIdents, validators} = defineValidators([
  /** 長度範例 */
  {
    identity: EAdditionalValidatorIdents.occupationLength,
    handler: (ctx, ...args)=>{
      return v8n().length(10, 30).test(ctx.value);
    }
  },
  /** Regex 範例 */
  {
    identity: EAdditionalValidatorIdents.occupationPattern,
    handler: (ctx, ...args)=>{
      return v8n().pattern(OCCUPATION_PATTERN).test(ctx.value);
    }
  },
  /** 匹配其他 field 範例, 確保匹配 */
  {
    identity: EAdditionalValidatorIdents.insureMatch,
    handler: (ctx, ...args)=>{
      const name = ctx.name;
      const linkName = ctx.getLinkedFieldName(validatorIdents.insureMatch);
      console.log("insureMatch, linkName", linkName, "validatorName:", validatorIdents.insureMatch, "fieldName:", ctx.name);
      console.log("insureMatch, validator", ctx.validator);
      assert(linkName != undefined);
    
      const linkField = ctx.model.getFieldByFieldName(linkName!)!;
      const linkVal = linkField.value;

      ctx.model.linkFields({
        master: { name: ctx.name as any, payloadKey: ctx.payloadKey },
        slave: { name: linkField.name, payloadKey: linkField.payloadKey },
      });
      return linkVal == ctx.value;
    },
  },
  /** 匹配其他 field 範例, 確保不匹配 */
  {
    identity: EAdditionalValidatorIdents.insureMismatch,
    handler: (ctx, ...args)=>{
      const name = ctx.name;
      const linkName = ctx.getLinkedFieldName(validatorIdents.insureMismatch)!;
      assert(linkName != undefined);
        
      const linkField = ctx.model.getFieldByFieldName(linkName);
      const linkVal = linkField.value;
      ctx.model.linkFields({
        master: { name: ctx.name as any, payloadKey: ctx.payloadKey },
        slave: { name: linkField.name, payloadKey: linkField.payloadKey },
      });
      return linkVal != ctx.value;
    }
  },
  {
    identity: EAdditionalValidatorIdents.insureNumber,
    handler: (ctx, ...args)=>{
        return v8n().number().test(ctx.value);
    }
  }
]);


validatorIdents.insureMismatch;

const V = validators;
/** 由 {@link EBaseValidationIdents} 存取 validators  */
const ruleOfPassword =  [
    V[EBaseValidationIdents.bail],
    V[EBaseValidationIdents.required],
    V[EBaseValidationIdents.pwdLength],
    V[EBaseValidationIdents.pwdPattern],
];

export const fieldRules = defineFieldRules({
    validators: V,
    ruleChain: [
        {ident: "password", rules: ruleOfPassword},
        {ident: "confirmPassword", rules: [
            ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.password})
        ]},
        {ident: "newPassword", rules: [
            ...ruleOfPassword, V.notEqual.linkField!({fieldName: EFieldNames.password})
        ]},
        {ident: "confirmNewPassword", rules: [
            ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.newPassword})
        ]},
        {ident: "username", rules: [
            V.required, V.userLength, V.userPattern  
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
        {ident: "cardNumber", rules: [
            V.required, V.insureNumber  
        ]},
        {ident: "cardNumberA", rules: [
            V.required, V.insureNumber, V.insureMatch.linkField!({fieldName: EFieldNames.cardNumber})
        ]},
        {ident: "cardNumberB", rules: [
            V.required, V.insureNumber, V.insureMismatch.linkField!({fieldName: EFieldNames.cardNumberA})  
        ]},
    ], 
});


type V = typeof validators;
type R = typeof fieldRules;
export const fieldConfigs = defineFieldConfigs<Fields, V, R>({
    fieldRules,
    validators,
    configBuilder: (define)=>([
        // signup - password
        // signup - confirm_password
        define({
            fieldName: EFieldNames.confirmPasswordOnSignUp,
            payloadKey: "confirm_password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.confirmPassword.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        // reset - old password - payloadKey: password
        // reset - new password - payloadKey: new_password
        define({
            fieldName: EFieldNames.newPassword,
            payloadKey: "new_password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.newPassword.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        // reset - confirm new password - payloadKey: confirm_new_password
        define({
            fieldName: EFieldNames.confirmPasswordOnResetPassword,
            payloadKey: "confirm_new_password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.confirmNewPassword.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),

        define({
            fieldName: EFieldNames.password,
            payloadKey: "password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.password.rules;
            },
            valueBuilder: ()=>{
                return "";
            }
        }),
        define({
            fieldName: EFieldNames.username,
            payloadKey: "username",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.username.rules;
            },
            valueBuilder: ()=>{
                return "";
            }
        }),
        define({
            fieldName: EFieldNames.nickname,
            payloadKey: "nickname",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.nickname.rules;
            },
            valueBuilder: ()=>{
                return "";
            }
        }),
        define({
            fieldName: EFieldNames.remark,
            payloadKey: "remark",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.remark.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        define({
            fieldName: EFieldNames.cardNumber,
            payloadKey: "card_number",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.cardNumber.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        define({
            fieldName: EFieldNames.cardNumberA,
            payloadKey: "card_number_A",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.cardNumberA.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
        define({
            fieldName: EFieldNames.cardNumberB,
            payloadKey: "card_number_B",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.cardNumberB.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
    ])
})


type F = Fields;

export const validationMessages = defineValidationMsg<V>({
    occupationLength: undefined,
    occupationPattern: undefined,
    insureMatch: undefined,
    insureMismatch: undefined,
    insureNumber: undefined,
    username: undefined,
    bail: undefined,
    greater: undefined,
    lesser: undefined,
    confirm: undefined,
    email: undefined,
    remark: undefined,
    notEqual: undefined,
    optional: undefined,
    phone: undefined,
    pwdLength: undefined,
    pwdPattern: undefined,
    required: undefined,
    searchLength: undefined,
    nickLength: undefined,
    userLength: undefined,
    amountLength: undefined,
    userPattern: undefined,
    decimalPattern: undefined,
    intPattern: undefined
})

