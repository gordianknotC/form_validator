import { BaseFormImpl } from "@/base/baseFormImpl";
import { VForm } from "@/base/baseFormTypes";
import UDFieldDefineMethod = VForm.UDFieldDefineMethod;
import UDFieldConfigs = VForm.UDFieldConfigs;
export declare class BaseReactiveForm<F, V> extends BaseFormImpl<F, F, V> {
    constructor(option: VForm.FormOption<F, F, V>);
}
/**
 * 使用者自定義欄位設定
 * @typeParam F - 所有欄位 payload 型別聯集
 * @typeParam R - 使用者自定義 rules {@link VForm.UDFieldConfigs}
 * @see {defineFieldConfigs}
 * @example
 * ```ts
 export const fieldConfigs = defineFieldConfigs<TFields, typeof fieldRules>({
  fieldRules: fieldRules,
  configBuilder: (define)=>([
      define({
          fieldName: "confirmPasswordOnSignup",
          payloadKey: "confirm_password",
          placeholder: computed(()=> ""),
          label: computed(()=> ""),
          ruleBuilder: (rules)=>{
              return rules.confirm.linkField("password");
          },
          valueBuilder: ()=>{
              return null;
          }
      }),
      define({
          fieldName: "password",
          payloadKey: "password",
          placeholder: computed(()=> ""),
          label: computed(()=> ""),
          ruleBuilder: (rules)=>{
              return rules.password.config;
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
    configBuilder: (define: VForm.UDFieldDefineMethod<F, V, R>) => VForm.FormField<F, F, V>[];
}) => VForm.UDFieldConfigs<F, V>;
/** 用來生成繼承自 {@link BaseFormImpl} 所需的 option, 用於以 oop
 * 的方式寫 form model, 如需以 functional 的方式寫 form model
 * {@see generateReactiveFormModel}
 * @typeParam F - payload schema
 * @typeParam V - validators
 * @param option.config - {@link VForm.UDFieldConfigs}
 * @param option.pickFields - 選擇該 form model 需要哪些對應的 schema
 * @param option.request - 遠端請求方法
 * @param option.validators - 全局所定義的 validator {@link defineValidators}
 * @param option.messages - 驗證錯誤所需的 message, {@link defineValidationMsg}
 * @example
 * ```ts
type F = Fields;
type V = typeof validators;
type R = typeof fieldRules;
export class CreateUserFormModel extends BaseFormImpl<F, F, V> {
  constructor(option?: Partial<VForm.FormOption<F, F, V>>) {
    const formOption = formModelOption<F, V, R>({
      config: fieldConfigs,
      pickFields: [
        "username",
        "password",
        "nickname"
      ],
      request(...args) {
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
 * ```
*/
export declare const formModelOption: <F, V = any, R = any>(option: {
    config: VForm.UDFieldConfigs<F, V>;
    pickFields: (keyof F | keyof R)[];
} & Omit<VForm.FormOption<F, F, V>, "state">) => VForm.FormOption<F, F, V>;
/** 用來生成由{@link BaseFormImpl} 所實作的 form model
 * 如需以 oop 的方式寫 form model{@see formModelOption}
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
export declare const generateReactiveFormModel: <F, V = any, R = any>(formOption: {
    validators: V;
    state: VForm.FormState<F, F, V>;
    messages: VForm.ValidationMessages<V>;
    request: (...args: any[]) => any;
    resend?: ((...args: any[]) => any) | undefined;
} & VForm.FormConfig<F, F, V> & {
    getPayload: () => Record<keyof F, any>;
}) => BaseFormImpl<F, F, V>;
/** 用來定義驗證錯誤時所對應的信息
 * @typeParam V - validators
*/
export declare const defineValidationMsg: <V>(option: VForm.UDValidationMessages<V>) => VForm.ValidationMessages<V>;
