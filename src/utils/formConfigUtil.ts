import { VForm } from "@/base/baseFormTypes";
import { Obj } from "@gdknot/frontend_common";
import { computed, reactive, UnwrapNestedRefs } from "vue";
import InternalValidators = VForm.InternalValidators;
import InternalValidator = VForm.InternalValidator;
import UDFieldRuleConfig = VForm.UDFieldRuleConfig;
import UDFieldRules = VForm.UDFieldRules;
import FieldRuleBuilder = VForm.FieldRuleBuilder;
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
 
const generateForm = function<F, V = any, R=any>(
  option: {
    config: UDFieldConfigs<F, V> ,
    pickFields: (keyof (F & R))[],
  } & Omit<VForm.FormOption<F, F, V>, "state">
): Partial<UDFieldConfigs<F, V>>{
  const {config, pickFields} = option;
  const records: typeof config = {} as any;
  pickFields.forEach((key)=>{
    const _key = key as keyof (typeof records);
    records[_key] = config[_key];
  });
  return records;
}

export const generateReactiveForm = function<F, V = any, R=any>(
  option: {
    config: UDFieldConfigs<F, V> ,
    pickFields: (keyof (F & R))[],
  } & Omit<VForm.FormOption<F, F, V>, "state">
): VForm.FormOption <F, F, V> {
  const state =  reactive(generateForm<F, V, R>(option));
  const result = Obj(option).omitBy((k, v)=> k == "config" || k == "pickFields");
  (result as VForm.FormOption <F, F, V>).state = state as any;
  return result as any;
}

export const defineValidationMsg = function<F>(option: VForm.UDValidationMessages<F>): VForm.ValidationMessages<F>{
  const proceedOption: VForm.ValidationMessages<F> = {} as any;
  Object.keys(option).forEach((_k)=>{
    const key = _k as keyof (typeof option);
    proceedOption[key] = (option[key] ?? computed(()=>{
      return `undefined validation error on field "${key}"`;
    }) as any);
  });
  return proceedOption;
}