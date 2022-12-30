import { FormField } from "@/index";
import { ArrayDelegate, ComputedRef, UnwrapRef } from "@gdknot/frontend_common";
import { Optional } from "./commonTypes";
import { IBaseFormContext } from "./contextTypes";

  //
  //
  //      V A L I D A T O R S
  //
  /**
   * Validator Handler 用來處理驗證邏輯， return true 代表驗證通過，false 不通過
   * @typeParam V - validator keys
   * @typeParam F - payload schema for form fields
   * @param ctx - validator context, 擴展至 {@link IBaseFormContext}, validator 屬性由 {@link BaseFormImpl.validate} 時 runtime 傳入
   * @param args - additional arguments
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
  export type ValidatorHandler<V, F = any> = (
    ctx: IBaseFormContext<F, F, V> &  {validator?: InternalValidator<V>},
    ...args: any[]
  ) => boolean;

  /**
   * @inheritDoc
   * @typeParam V - return type
   * @param linkField - 連結欄位名稱
   * */
  export type InternalValidatorLinkHandler<V, F> = (
    option: {fieldName: string}
  ) => InternalValidator<V, F>;

  /**
   * @inheritDoc
   * @typeParam V - return type
   * @param linkField - 連結欄位名稱
   * */
  export type InternalValidatorApplyHandler<V, F> = (
    fieldName: string
  ) => InternalValidator<V, F>;

  /**
   * @typeParam V - object containing keys of all validators
   * @typeParam F - payload schema for form fields
   * */
  export type InternalValidator<V, F = any> = {
    /** validator 驗證邏輯*/
    handler: ValidatorHandler<V, F>;
    /** 指派 validator 名，唯一名稱不得重複 */
    validatorName: keyof V;
    /** 用來連結其他欄位名 － linkField(fieldName) */
    linkField: InternalValidatorLinkHandler<V, F>;
    /** 將 validator 套用至欄位名 */
    _applyField?: InternalValidatorApplyHandler<V, F>;
    /** 連結的欄位名 */
    _linkedFieldName?: string;
    /** 套用的欄位名 */
    _appliedFieldName?: string;
  };
  /**
   * @typeParam V - object containing keys of all validators
   */
  export type InternalValidators<V, F=any> = Record<keyof V, InternalValidator<V, F>>;


  /** 用來定義驗證規則所對應的驗證訊息
   * 鍵為欄位名，值必須為 {@link ComputedRef}，用來追踪i18n狀態上的變化
   * @typeParam V - validators 值鍵對
   */
  export type ValidationMessages<V> = Record<
    keyof (V),
    ComputedRef<string>
  >;

  /** 用來定義驗證規則所對應的驗證訊息
   * 鍵為欄位名，值必須為 {@link ComputedRef}，用來追踪i18n狀態上的變化
   * @typeParam V - validators
   * @example 
   ```ts
    export const validationMessages = defineValidationMsg<V>({
        pwdLength: undefined,
        pwdPattern: computed(()=>i18n.t.pwdLengthValidationError)
    })
   ```
   */
  export type UDValidationMsgOption<V> = Record<
    keyof (V),
    Optional<ComputedRef<string>>
  >;

  /**
   * @typeParam V - object containing keys of all validators
   * */
  export type UDValidatorLinkHandler<V = string> = (
    linkField?: string
  ) => string;

  export type UDValidator<V, F = any> = {
    identity: keyof V;
    handler: ValidatorHandler<V, F>;
  };



  //
  //
  //    F I E L D     R U L E S
  //
  //
  //
  /**
   * @typeParam V - object containing keys of all validators
   */
  export type UDValidators<V> = Record<
    keyof V,
    UDValidator<V>
  >;

  /** 驗證規則由許多「驗證子」的集合構成
   * @example
   * ```ts
   * const passwordRule = [
   *    validators.required, validators.pwdLength, validators.pwdPattern
   * ]
   * ```
   */
  export type UDRule<V, F> = ArrayDelegate<InternalValidator<V, F>>;

  /**
   * 使用者自定義「驗證規則」設定
   * @typeParam V - validators
   * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
   * @param ident - 「驗證規則」命名，字串名不可重複
   * @param rules - 「驗證規則」由許多「驗證子」的集合構成 @see {@link FormField}
   */
  export type UDFieldRuleConfig<R, V> = {
    ident: keyof R;
    rules: InternalValidator<V>[];
  };

  /**
   * 由 {@link defineFieldRules} 所返回的驗證規則集合
   * @typeParam V - validators
   * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
   */
  export type UDFieldRules<R, V> = Record<
    keyof R,
    UDFieldRuleConfig<R, V> 
  >;


  /**
   * 於使用者「自定義欄位設定」 {@link UDFieldConfigs}，用來將「證驗規則」對應至「欄位名稱」，回傳值為 {@link FieldRuleBuilderReturnType}
   * @typeParam V - validators
   * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
   * @see {@link UDFieldDefineMethod}
   * @see {@link defineFieldConfigs}
   */
  export type FieldRuleBuilder<R, V> = (
    rules: R
  ) => InternalValidator<any>[];
