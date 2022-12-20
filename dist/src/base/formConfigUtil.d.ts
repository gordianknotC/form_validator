import { VForm } from "@/base/baseFormTypes";
import { UnwrapNestedRefs } from "vue";
/**
 * 使用者自定義欄位設定
 * @typeParam F - 所有欄位 payload 型別聯集
 * @see {@link defineFieldConfigs}
 * @see {@link VForm.FormField}
 * @example
 ```ts
 type TField = {
     email: string;
     password: string;
 }
 const fieldConfigs:DefinedFieldConfigs<TFields> = defineFieldConfigs<TFields, typeof fieldRules>(...);
 const field: VForm.FormField = fieldConfigs.email;
 * ```
 */
export type DefinedFieldConfigs<F> = Record<keyof F, VForm.FormField<F, F>>;
/**
 * 使用者自定義欄位設定
 * @typeParam F - 所有欄位 payload 型別聯集
 * @typeParam R - 使用者自定義 rules {@link DefinedFieldRules}
 * @see {@link defineFieldConfigs}
 */
export type FieldDefineMethod<F, R> = (option: Pick<VForm.FormField<F, F>, "placeholder" | "hidden" | "disabled" | "label" | "fieldType" | "payloadKey"> & {
    fieldName: string;
    ruleBuilder: FieldRuleBuilder<R>;
    valueBuilder: () => VForm.FormValue<F, F>;
}) => VForm.FormField<F, F>;
export type FieldRuleBuilderReturnType = {
    name: string;
    fieldRule: string;
};
/**
 * 於使用者「自定義欄位設定」 {@link DefinedFieldConfigs}，用來將「證驗規則」對應至「欄位名稱」，回傳值為 {@link FieldRuleBuilderReturnType}
 * @typeParam R - 使用者自定義 rules {@link DefinedFieldRules}
 * @see {@link FieldDefineMethod}
 * @see {@link defineFieldConfigs}
 */
export type FieldRuleBuilder<R> = (rules: R) => FieldRuleBuilderReturnType;
/**
 * 使用者自定義欄位設定
 * @typeParam F - 所有欄位 payload 型別聯集
 * @typeParam R - 使用者自定義 rules {@link DefinedFieldRules}
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
export declare const defineFieldConfigs: <F, R = any>(options: {
    fieldRules: R;
    configBuilder: (define: FieldDefineMethod<F, R>) => VForm.FormField<F, F>[];
}) => DefinedFieldConfigs<F>;
export declare const generateForm: <F, R = any>(option: {
    config: DefinedFieldConfigs<F>;
    pickFields: (keyof F & keyof R)[];
}) => Partial<DefinedFieldConfigs<F>>;
export declare const generateReactiveForm: <F, R = any>(option: {
    config: DefinedFieldConfigs<F>;
    pickFields: (keyof F & keyof R)[];
} & {
    rules: VForm.Validators<string>;
    state: VForm.FormState<F, R>;
    messages: VForm.ValidationMessages<F, R>;
    request: (...args: any[]) => any;
    resend?: ((...args: any[]) => any) | undefined;
} & VForm.FormConfig<F, R>) => UnwrapNestedRefs<Partial<DefinedFieldConfigs<F>>>;
