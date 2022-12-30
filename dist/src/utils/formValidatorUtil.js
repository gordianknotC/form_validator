"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineValidators = exports.assertMsg = void 0;
//@ts-ignore
const baseValidatorImpl_1 = require("~/base/impl/baseValidatorImpl");
const frontend_common_1 = require("@gdknot/frontend_common");
const extraAssertMessage = {
    linkFieldNameNotFound: "linked field name not found"
};
exports.assertMsg = frontend_common_1.assertMsg;
Object.assign(exports.assertMsg, extraAssertMessage);
/** */
function renderValidator(rawValidator) {
    const { identity, handler } = rawValidator;
    const key = identity;
    const rendered = {
        handler,
        validatorName: key,
        linkField(option) {
            const { fieldName } = option;
            const ret = Object.assign({}, this);
            ret._linkedFieldName = fieldName;
            // console.log("call linkField:",key, fieldName);
            return ret;
        },
        _applyField(fieldName) {
            const ret = Object.assign({}, this);
            ret._appliedFieldName = fieldName;
            // console.log("call applyField:",key, fieldName, ret);
            return ret;
        }
    };
    return rendered;
}
/**使用者自定義／擴展 Validators, 並將  Validator render 成 {@link InternalValidator}
 * @typeParam T -  validator 值鍵對
 * @typeParam V -
 * @typeParam R -
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
function defineValidators(option) {
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
    option.forEach(validator => {
        const { identity, handler } = validator;
        const key = identity;
        const rendered = renderValidator(validator);
        composedValidators[key] = rendered;
        composedIdents[key] = key;
    });
    return {
        validatorIdents: composedIdents,
        validators: composedValidators
    };
}
exports.defineValidators = defineValidators;
//# sourceMappingURL=formValidatorUtil.js.map