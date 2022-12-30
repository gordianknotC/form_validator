import { EBaseValidationIdents } from "~/base/impl/baseValidatorImpl";
import { ValidatorHandler, InternalValidators } from "~/base/types/validatorTypes";
import { assertMsg as _assertMsg } from "@gdknot/frontend_common";
declare const extraAssertMessage: {
    linkFieldNameNotFound: string;
};
export declare const assertMsg: (typeof _assertMsg) & (typeof extraAssertMessage);
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
export declare function defineValidators<T, V = (typeof EBaseValidationIdents) & T>(option: {
    identity: keyof T;
    handler: ValidatorHandler<V>;
}[]): {
    validatorIdents: Record<keyof V, keyof V>;
    validators: InternalValidators<V>;
};
export {};
