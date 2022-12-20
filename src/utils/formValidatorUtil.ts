//@ts-ignore
import v8n from "v8n";
import { VForm } from "@/base/baseFormTypes";
//@ts-ignore
import emailValidator from "email-validator";
import InternalValidators = VForm.InternalValidators;
import InternalValidator = VForm.InternalValidator;
import ValidatorHandler = VForm.ValidatorHandler;
import InternalValidatorLinkHandler = VForm.InternalValidatorLinkHandler;
import FieldRuleConfig = VForm.UDFieldRuleConfig;
import { Arr, assert } from "@gdknot/frontend_common";
import { baseValidators, EBaseValidationIdents } from "@/base/baseValidatorImpl";
import { baseFieldRules } from "@/base/baseRuleImpl";
 


/** 預設 DefaultValidationHandlers = typeof baseValidators*/
export type DefaultValidationHandlers = typeof baseValidators;
export function getValidationRules(): DefaultValidationHandlers {
  return baseValidators;
}

/** 預設 DefaultFieldRules = typeof baseFieldRules*/
export type DefaultFieldRules = typeof baseFieldRules;
export function getFieldRules(): DefaultFieldRules {
  return baseFieldRules;
}

/**使用者自定義／擴展 Validators
 * @typeParam T -  validator 值鍵對
 * @example
 * e.g.:
```ts
const OCCUPATION_PATTERN = /designer|engineer|student|freelancer/g;
export const {validationIdents, validators} = defineValidators([
  {
    identity: "occupationLength",
    handler: (ctx, ...args)=>{
      return v8n().length(10, 30).test(ctx.value);
    }
  }, 
  {
    identity: "insureMatch",
    handler: (ctx, ...args)=>{
      const name = ctx.name;
      const linkName = name.split("_insureMatch")[0];
      const linkField = ctx.model.getFieldByFieldName(linkName);
      const linkVal = linkField.value;
      ctx.model.linkFields({
        master: { name: ctx.name as any, payloadKey: ctx.payloadKey },
        slave: { name: linkField.name, payloadKey: linkField.payloadKey },
      });
      return linkVal == ctx.value;
    }
  }, 
]); 
 * ```
 */
export function defineValidators<T, V = (typeof EBaseValidationIdents) & T>(
  validators: {
    identity: keyof T;
    handler: ValidatorHandler<V>
  }[]
): {
  validationIdents: Record<keyof V, string>;
  validators: InternalValidators<V>;
} {
  const composedIdents: Record<keyof V, string> = EBaseValidationIdents as any;
  const composedHandlers: InternalValidators<V> = baseValidators as any;
  const newValidators: InternalValidators<V> = {} as any;

  validators.forEach(validator => {
    const { identity, handler } = validator;
    const key: keyof V = identity as any;
    
    const newValidator: InternalValidator<V> = { 
      handler,
      validatorName: key,
      // linkedFieldName,
      // appliedFieldName,
      linkField(fieldName: string){
        this.linkedFieldName = fieldName;
        return this;
      },
      applyField(fieldName: string){
        this.appliedFieldName = fieldName;
        return this;
      }
    };
  
    composedHandlers[key] = newValidator;
    composedIdents[key] = identity as any;
    newValidators[key] = newValidator;
  });

  return {
    validationIdents: composedIdents,
    validators: newValidators
  };
}
 