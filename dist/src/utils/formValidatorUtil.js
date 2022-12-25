"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineValidators = void 0;
//@ts-ignore
const baseValidatorImpl_1 = require("~/base/impl/baseValidatorImpl");
function renderValidator(rawValidator) {
    const { identity, handler } = rawValidator;
    const key = identity;
    const rendered = {
        handler,
        validatorName: key,
        linkField(fieldName) {
            const ret = Object.assign({}, this);
            ret.linkedFieldName = fieldName;
            // console.log("call linkField:",key, fieldName);
            return ret;
        },
        applyField(fieldName) {
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
function defineValidators(validators) {
    const composedIdents = baseValidatorImpl_1.EBaseValidationIdents;
    const composedValidators = baseValidatorImpl_1.baseValidators;
    Object.entries(composedValidators).forEach((pair) => {
        const [k, v] = pair;
        const rendered = renderValidator({
            identity: v.validatorName,
            handler: v.handler
        });
        composedValidators[k] = rendered;
    });
    validators.forEach(validator => {
        const { identity, handler } = validator;
        const key = identity;
        const rendered = renderValidator(validator);
        composedValidators[key] = rendered;
    });
    return {
        validatorIdents: composedIdents,
        validators: composedValidators
    };
}
exports.defineValidators = defineValidators;
//# sourceMappingURL=formValidatorUtil.js.map