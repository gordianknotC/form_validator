//@ts-ignore
import { baseValidators, EBaseValidationIdents } from "~/base/impl/baseValidatorImpl";
import { baseFieldRules } from "~/base/impl/baseRuleImpl";
import { ValidatorHandler, InternalValidator, InternalValidators } from "~/base/types/validatorTypes";
 


function renderValidator<T, V>(rawValidator: {
  identity: keyof T;
  handler: ValidatorHandler<V>
}): InternalValidator<V>{
    const { identity, handler } = rawValidator;
    const key: keyof V = identity as any;
    const rendered: InternalValidator<V> = { 
      handler,
      validatorName: key,
      linkField(fieldName: string){
        const ret = Object.assign({}, this);
        ret.linkedFieldName = fieldName;
        // console.log("call linkField:",key, fieldName);
        return ret;
      },
      applyField(fieldName: string){
        const ret = Object.assign({}, this);
        ret.appliedFieldName = fieldName;
        // console.log("call applyField:",key, fieldName, ret);
        return ret;
      }
    };
    return rendered;
}


/**使用者自定義／擴展 Validators, 將並 
 * Validator render 成 {@link InternalValidator}
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
  validatorIdents: Record<keyof V, keyof V>;
  validators: InternalValidators<V>;
} {
  const composedIdents: Record<keyof V, keyof V> = EBaseValidationIdents as any;
  const composedValidators: InternalValidators<V> = baseValidators as any;
  
  Object.entries(composedValidators).forEach((pair)=>{
    const [k, v] = pair as [keyof V, InternalValidator<V>];
    const rendered = renderValidator({
      identity: v.validatorName,
      handler: v.handler
    })
    composedValidators[k] = rendered;
  });

  validators.forEach(validator => {
    const { identity, handler } = validator;
    const key: keyof V = identity as any;
    const rendered = renderValidator(validator);
    composedValidators[key] = rendered;
  });

  return {
    validatorIdents: composedIdents,
    validators: composedValidators
  };
}
 