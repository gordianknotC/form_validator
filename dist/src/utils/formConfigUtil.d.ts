import { BaseFormImpl } from "../base/impl/baseFormImpl";
import { UDFieldConfigs, UDConfigBuilder } from "../base/types/configTYpes";
import { InternalFormOption, FormKey, UDFormOption } from "../base/types/formTypes";
import { UDValidationMessages } from "..";
export declare class BaseReactiveForm<F, V> extends BaseFormImpl<F, F, V> {
    constructor(option: InternalFormOption<F, F, V>);
}
/**
 * 使用者自定義欄位設定
 * @typeParam F - 所有欄位 payload 型別聯集
 * @typeParam R - 使用者自定義 rules @see {@link UDFieldConfigs}
 * @param options.fieldRules -
 * @param options.validators -
 * @param options.configBuilder - @see {@link UDConfigBuilder} {@link UDFieldDefineMethod}
 * @example
 * ```ts
 export const fieldConfigs = defineFieldConfigs<TFields, typeof fieldRules>({
  fieldRules: fieldRules,
  configBuilder: (define)=>([
      define({
          fieldName: "password",
          payloadKey: "password",
          placeholder: computed(()=> ""),
          label: computed(()=> ""),
          ruleBuilder: (rules)=>{
              return rules.password.rules;
          },
          valueBuilder: ()=>{
              return "";
          }
      }),
    ])
  })
 * ```
 */
export declare const defineFieldConfigs: <F, V = any, R = any>(options: {
    fieldRules: R;
    validators: V;
    configBuilder: UDConfigBuilder<F, V, R>;
}) => UDFieldConfigs<F, V>;
/** {@inheritDoc UDFormOption}
 * 用來生成繼承自  {@link BaseFormImpl} 所需的 option
 * @see {@link createReactiveFormModel}
 * @typeParam F - payload schema
 * @typeParam V - validators
 * @param option - {@link UDFormOption}
 * @returns - {@link InternalFormOption}
 * @example
 ```ts
type Fields = UserLoginPayload & UserResetPwdPayload;
type F = Fields;
type V = typeof validators;
type R = typeof fieldRules;

export const createUserFormModelOption = createFormModelOption<F, V, R>({
  config: fieldConfigs,
  pickFields: [
    "username",
    "password",
  ],
  postMethod(...args) {
    return { succeed: true };
  },
  validators,
  messages: validationMessages,
  onNotifyRectifyingExistingErrors: function (): void {
    throw new Error("Function not implemented.");
  },
  onBeforeSubmit: function (): void {
    throw new Error("Function not implemented.");
  },
  onAfterSubmit: function (): void {
    throw new Error("Function not implemented.");
  },
  onCatchSubmit: function (e: any): void {
    throw new Error("Function not implemented.");
  }
});
 ```
*/
export declare const createFormModelOption: <F, V = any, R = any>(option: UDFormOption<F, V, R>) => InternalFormOption<F, F, V>;
/** 用來生成由{@link BaseFormImpl} 所實作的 form model
 * 如需以 oop 的方式寫 form model @see {@link formModelOption}
 * @example
 * ```ts
  const userFormModel = generateReactiveFormModel({
  ...formOption,
  getPayload(){
    const result = super.getPayload();
    if (is.empty(result.remark)) {
      result.remark = null;
    }
    delete result.confirm_password;
    return result;
  }
});
 * ```
*/
export declare const createReactiveFormModel: <F, V = any, R = any>(formOption: InternalFormOption<F, F, V> & {
    getPayload: (_payload: Record<keyof F, any>) => Record<keyof F, any>;
}) => BaseFormImpl<F, F, V>;
/** 用來定義驗證錯誤時所對應的信息
 * @typeParam V - validators 值鍵對
*/
export declare const defineValidationMsg: <V>(option: UDValidationMessages<V>) => UDValidationMessages<V>;
