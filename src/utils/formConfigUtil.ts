import { BaseFormImpl } from "~/base/impl/baseFormImpl";
import { UDFieldDefineMethod, UDFieldConfigs, UDConfigBuilder } from "@/base/types/configTYpes";
import { InternalFormOption, FormField, FormKey, UDFormOption, FormPayload } from "@/base/types/formTYpes";
import { flattenInstance, Obj } from "@gdknot/frontend_common";
import { computed, reactive, UnwrapNestedRefs } from "vue";
import { UDValidationMessages } from "..";
import { undefinedValidationErrorMessage } from "@/constants";


export class BaseReactiveForm<F, V> extends BaseFormImpl<F, F, V> {
  constructor(option: InternalFormOption<F, F, V>) {
    flattenInstance(super(option));
  }
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
export const defineFieldConfigs = function <F, V=any, R=any>(options: {
  fieldRules: R,
  validators: V,
  configBuilder: UDConfigBuilder<F, V, R>;
}): UDFieldConfigs<F, V> {
  let _cfg: FormField<F, F, V>[];
  return new Proxy({},{
      get: function (target, name: string) {
        _cfg ??= options.configBuilder(option => {
          const {
            payloadKey,
            fieldName,
            placeholder, 
            label,
            ruleBuilder, 
            valueBuilder,
          } = option;
          
          const ruleChain = ruleBuilder(options.fieldRules).map((_)=>{
            try{
              return _._applyField!(fieldName);
            }catch(e){
              console.log("validator:", _);
              throw `${e}\n fieldName: ${fieldName}\nvalidator: ${_}`;
            }
          });
          
          const transformed: FormField<F, F, V> = {
            payloadKey,
            fieldName: fieldName,
            ruleChain,
            defaultValue: valueBuilder(),
            value: valueBuilder(),
            label,
            placeholder
          };
          return transformed;
        });
        const index = _cfg.findIndex(_ => _.payloadKey == name);
        return _cfg[index];
      }
    }
  ) as any;
};
 
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
export const createFormModelOption = function<F, V = any, R=any>(
  option: UDFormOption<F, V, R>
): InternalFormOption <F, F, V> {
  const {config, pickFields} = option;
  const records: typeof config = {} as any;
  
  pickFields.forEach((key)=>{
    const _key = key as keyof (typeof records);
    records[_key] = config[_key];
  });
  
  const state =  reactive(records);
  const result = Obj(option).omitBy((k, v)=> k == "config" || k == "pickFields");
  (result as InternalFormOption <F, F, V>).state = state as any;
  return result as any;
}

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
export const createReactiveFormModel = function<F, V = any, R=any>(
  formOption: InternalFormOption <F, F, V> & {
    getPayload: (_payload: Record<FormKey <F, F, V>, any>)=>Record<FormKey<F, F, V>, any>
  }
): BaseFormImpl<F, F, V>{
  const result = new BaseReactiveForm(formOption)
  const superPayloadGetter = result.getPayload.bind(result);
  const inheritPayloadGetter = formOption.getPayload.bind(result);
  result.getPayload = ()=>{
    return inheritPayloadGetter(superPayloadGetter());
  }
  return result;
}

/** 用來定義驗證錯誤時所對應的信息 
 * @typeParam V - validators 值鍵對
*/
export const defineValidationMsg = function<V>(
  option: UDValidationMessages<V>
): UDValidationMessages<V>{
  const proceedOption: UDValidationMessages<V> = {} as any;
  Object.keys(option).forEach((_k)=>{
    const key = _k as keyof (typeof option);
    proceedOption[key] = (option[key] ?? computed(()=>{
      return `${undefinedValidationErrorMessage}"${String(key)}"`;
    }) as any);
  });
  return proceedOption;
}