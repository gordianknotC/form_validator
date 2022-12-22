import { BaseFormImpl } from "@/base/baseFormImpl";
import { VForm } from "@/base/baseFormTypes";
import { flattenInstance, Obj } from "@gdknot/frontend_common";
import { computed, reactive, UnwrapNestedRefs } from "vue";
import InternalValidators = VForm.InternalValidators;
import InternalValidator = VForm.InternalValidator;
import UDFieldRuleConfig = VForm.UDFieldRuleConfig;
import UDFieldRules = VForm.UDFieldRules;
import FieldRuleBuilder = VForm.FieldRuleBuilder;
import UDFieldDefineMethod = VForm.UDFieldDefineMethod;
import UDFieldConfigs = VForm.UDFieldConfigs;


export class BaseReactiveForm<F, V> extends BaseFormImpl<F, F, V> {
  constructor(option: VForm.FormOption<F, F, V>) {
    flattenInstance(super(option));
  }
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
export const defineFieldConfigs = function <F, V=any, R=any>(options: {
  fieldRules: R,
  validators: V,
  configBuilder: (define: UDFieldDefineMethod<F, V, R>) => VForm.FormField<F, F, V>[];
}): UDFieldConfigs<F, V> {
  let _cfg: VForm.FormField<F, F, V>[];
  return new Proxy({},{
      get: function (target, name: string) {
        _cfg ??= options.configBuilder(option => {
          const {
            payloadKey,fieldName,
            placeholder, label,
            ruleBuilder, valueBuilder,
          } = option;
          
          const ruleChain = ruleBuilder(options.fieldRules);
          const transformed: VForm.FormField<F, F, V> = {
            payloadKey,
            name,
            ruleChain,
            defaultValue: valueBuilder(),
            value: valueBuilder(),
            label,
            placeholder
          };
          return transformed;
        });
        const index = _cfg.findIndex(_ => _.name == name);
        return _cfg[index];
      }
    }
  ) as any;
};
 

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
export const formModelOption = function<F, V = any, R=any>(
  option: {
    config: UDFieldConfigs<F, V> ,
    pickFields: (keyof (F & R))[],
  } & Omit<VForm.FormOption<F, F, V>, "state">
): VForm.FormOption <F, F, V> {
  const {config, pickFields} = option;
  const records: typeof config = {} as any;
  pickFields.forEach((key)=>{
    const _key = key as keyof (typeof records);
    records[_key] = config[_key];
  });
  const state =  reactive(records);
  const result = Obj(option).omitBy((k, v)=> k == "config" || k == "pickFields");
  (result as VForm.FormOption <F, F, V>).state = state as any;
  return result as any;
}

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
export const generateReactiveFormModel = function<F, V = any, R=any>(
  formOption: VForm.FormOption <F, F, V> & {
    getPayload: ()=>Record<VForm.FormKey<F, F, V>, any>
  }
): BaseFormImpl<F, F, V>{
  const result = new BaseReactiveForm(formOption)
  result.getPayload = formOption.getPayload.bind(result);
  return result;
}

/** 用來定義驗證錯誤時所對應的信息 
 * @typeParam V - validators
*/
export const defineValidationMsg = function<V>(option: VForm.UDValidationMessages<V>): VForm.ValidationMessages<V>{
  const proceedOption: VForm.ValidationMessages<V> = {} as any;
  Object.keys(option).forEach((_k)=>{
    const key = _k as keyof (typeof option);
    proceedOption[key] = (option[key] ?? computed(()=>{
      return `undefined validation error on field "${String(key)}"`;
    }) as any);
  });
  return proceedOption;
}