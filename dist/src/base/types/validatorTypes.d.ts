import { ComputedRef } from "@gdknot/frontend_common";
import { Optional } from "./commonTypes";
import { IBaseFormContext } from "./contextTypes";
/**
 *  #### validation rules 自定義設定格式
 * @typeParam V - validator keys
 * @typeParam F - payload schema for form fields
 *  __example:__
 *   ```typescript
 *   const baseFormRules = {
 *     [EBaseValidationRules.optional](ctx, ...args: any){
 *       return true;
 *     },
 *      [EBaseValidationRules.required](ctx, ...args: any){
 *       return v8n().not.empty().test(ctx.value);
 *     },
 *      [EBaseValidationRules.bail](ctx, ...args: any){
 *       ctx.displayOption.showMultipleErrors = true;
 *       return true;
 *     },
 *   }
 *  ```
 * */
export type ValidatorHandler<V, F = any> = (ctx: IBaseFormContext<F, F, V>, ...args: any[]) => boolean;
/**
 * @inheritDoc
 * @typeParam V - return type
 * @param linkField - 連結欄位名稱
 * */
export type InternalValidatorLinkHandler<V, F> = (linkField: string) => InternalValidator<V, F>;
/**
 * @typeParam V - object containing keys of all validators
 * @typeParam F - payload schema for form fields
 * */
export type InternalValidator<V, F = any> = {
    handler: ValidatorHandler<V, F>;
    validatorName: keyof V;
    /** 用來連結其他欄位 － linkField(fieldName) */
    linkField: InternalValidatorLinkHandler<V, F>;
    applyField?: InternalValidatorLinkHandler<V, F>;
    linkedFieldName?: keyof F;
    appliedFieldName?: keyof F;
};
/**
 * @typeParam V - object containing keys of all validators
 */
export type InternalValidators<V, F = any> = Record<keyof V, InternalValidator<V, F>>;
/** 用來定義驗證規則所對應的驗證訊息
 * 鍵為欄位名，值必須為 {@link ComputedRef}，用來追踪i18n狀態上的變化
 * @typeParam V - validators
 */
export type ValidationMessages<V> = Record<keyof (V), ComputedRef<string>>;
/** 用來定義驗證規則所對應的驗證訊息
 * 鍵為欄位名，值必須為 {@link ComputedRef}，用來追踪i18n狀態上的變化
 * @typeParam V - validators
 */
export type UDValidationMessages<V> = Record<keyof (V), Optional<ComputedRef<string>>>;
/**
 * @typeParam V - object containing keys of all validators
 * */
export type UDValidatorLinkHandler<V = string> = (linkField?: string) => string;
export type UDValidator<V, F = any> = {
    handler: ValidatorHandler<V, F>;
};
/**
 * @typeParam V - object containing keys of all validators
 */
export type UDValidators<V> = Record<keyof V, UDValidator<V>>;
/**
 * @typeParam V - validators
 * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
 */
export type UDFieldRuleConfig<R, V> = {
    ident: keyof R;
    rules: InternalValidator<V>[];
};
/**
 * @typeParam V - validators
 * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
 */
export type UDFieldRules<R, V> = Record<keyof R, UDFieldRuleConfig<R, V>>;
/**
 * 於使用者「自定義欄位設定」 {@link UDFieldConfigs}，用來將「證驗規則」對應至「欄位名稱」，回傳值為 {@link FieldRuleBuilderReturnType}
 * @typeParam V - validators
 * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
 * @see {@link UDFieldDefineMethod}
 * @see {@link defineFieldConfigs}
 */
export type FieldRuleBuilder<R, V> = (rules: R) => InternalValidator<any>[];
