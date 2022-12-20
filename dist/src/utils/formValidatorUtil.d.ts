import { VForm } from "@/base/baseFormTypes";
import InternalValidators = VForm.InternalValidators;
import ValidatorHandler = VForm.ValidatorHandler;
import { baseValidators, EBaseValidationIdents } from "@/base/baseValidatorImpl";
import { baseFieldRules } from "@/base/baseRuleImpl";
/** 預設 DefaultValidationHandlers = typeof baseValidators*/
export type DefaultValidationHandlers = typeof baseValidators;
export declare function getValidationRules(): DefaultValidationHandlers;
/** 預設 DefaultFieldRules = typeof baseFieldRules*/
export type DefaultFieldRules = typeof baseFieldRules;
export declare function getFieldRules(): DefaultFieldRules;
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
export declare function defineValidators<T, V = (typeof EBaseValidationIdents) & T>(validators: {
    identity: keyof T;
    handler: ValidatorHandler<V>;
}[]): {
    validationIdents: Record<keyof V, string>;
    validators: InternalValidators<V>;
};
