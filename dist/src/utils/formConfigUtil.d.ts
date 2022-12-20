import { VForm } from "@/base/baseFormTypes";
import { UnwrapNestedRefs } from "vue";
import UDFieldDefineMethod = VForm.UDFieldDefineMethod;
import UDFieldConfigs = VForm.UDFieldConfigs;
/**
 * 使用者自定義欄位設定
 * @typeParam F - 所有欄位 payload 型別聯集
 * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
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
export declare const defineFieldConfigs: <F, V, R>(options: {
    fieldRules: R;
    validators: V;
    configBuilder: (define: VForm.UDFieldDefineMethod<F, V, R>) => VForm.FormField<F, F, V>[];
}) => VForm.UDFieldConfigs<F, V>;
export declare const generateForm: <F, R = any, V = any>(option: {
    config: VForm.UDFieldConfigs<F, V>;
    pickFields: (keyof F & keyof R)[];
}) => Partial<VForm.UDFieldConfigs<F, V>>;
export declare const generateReactiveForm: <F, R = any, V = any>(option: {
    config: VForm.UDFieldConfigs<F, V>;
    pickFields: (keyof F & keyof R)[];
} & {
    validators: VForm.InternalValidators<F & R>;
    state: VForm.FormState<F, R, V>;
    messages: VForm.ValidationMessages<F, R>;
    request: (...args: any[]) => any;
    resend?: ((...args: any[]) => any) | undefined;
} & VForm.FormConfig<F, R, V>) => UnwrapNestedRefs<Partial<VForm.UDFieldConfigs<F, V>>>;
