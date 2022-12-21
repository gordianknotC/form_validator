import { baseValidators, EBaseValidationIdents } from "@/base/baseValidatorImpl";
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
export function defineValidators(validators) {
    const composedIdents = EBaseValidationIdents;
    const composedHandlers = baseValidators;
    const newValidators = {};
    validators.forEach(validator => {
        const { identity, handler } = validator;
        const key = identity;
        const newValidator = {
            handler,
            validatorName: key,
            // linkedFieldName,
            // appliedFieldName,
            linkField(fieldName) {
                const ret = Object.assign({}, this);
                ret.linkedFieldName = fieldName;
                return ret;
            },
            applyField(fieldName) {
                const ret = Object.assign({}, this);
                ret.appliedFieldName = fieldName;
                return ret;
            }
        };
        composedHandlers[key] = newValidator;
        composedIdents[key] = identity;
        newValidators[key] = newValidator;
    });
    return {
        validatorIdents: composedIdents,
        validators: newValidators
    };
}
//# sourceMappingURL=formValidatorUtil.js.map