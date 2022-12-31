//@ts-ignore
import { baseValidators, EBaseValidationIdents } from "~/base/impl/baseValidatorImpl";
import { baseFieldRules } from "~/base/impl/baseRuleImpl";
import { ValidatorHandler, InternalValidator, InternalValidators, UDValidator } from "~/base/types/validatorTypes";
import { assertMsg as _assertMsg } from "@gdknot/frontend_common";
 
const extraAssertMessage = {
  linkFieldNameNotFound: "linked field name not found"
}
export const assertMsg: (typeof _assertMsg) & (typeof extraAssertMessage) = _assertMsg as any;
Object.assign(assertMsg, extraAssertMessage);


/** */
function renderValidator<T, V, F=string>(rawValidator: {
  identity: keyof T;
  handler: ValidatorHandler<V>
}): InternalValidator<V>{
    const { identity, handler } = rawValidator;
    const key: keyof V = identity as any;
    const rendered: InternalValidator<V, F> = { 
      handler,
      validatorName: key,
      linkField(option: {fieldName: string}){
        const {fieldName} = option;
        const ret = Object.assign({}, this);
        ret._linkedFieldName = fieldName;
        // console.log("call linkField:",key, fieldName);
        return ret;
      },
      _applyField(fieldName: string){
        const ret = Object.assign({}, this);
        ret._appliedFieldName = fieldName;
        // console.log("call applyField:",key, fieldName, ret);
        return ret;
      }
    };
    return rendered;
}


/**
 * 用於使用者自定義／擴展 Validators, 並將 Validator render 
 * 成 {@link InternalValidator} 供內部使用
 * @typeParam A - 新增的驗證子值鍵對
 * @typeParam V - 內部預設驗證子值鍵對
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
      const name = ctx.fieldName;
      const linkName = name.split("_insureMatch")[0];
      const linkField = ctx.model.getFieldByFieldName(linkName);
      const linkVal = linkField.value;
      ctx.model.link({
        master: { name: ctx.fieldName as any, payloadKey: ctx.payloadKey },
        slave: { name: linkField.name, payloadKey: linkField.payloadKey },
      });
      return linkVal == ctx.value;
    }
  }, 
]); 
 * ```
 */
export function defineValidators<A, V = (typeof EBaseValidationIdents) & A>(
  option: UDValidator<A, V>[]
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

  option.forEach(validator => {
    const { identity, handler } = validator;
    const key: keyof V = identity as any;
    const rendered = renderValidator(validator);
    composedValidators[key] = rendered;
    composedIdents[key] = key;
  });

  return {
    validatorIdents: composedIdents,
    validators: composedValidators
  };
}
 