import { VForm } from "@/base/baseFormTypes";
import { reactive, UnwrapNestedRefs } from "vue";
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
export const defineFieldConfigs = function <F, V, R>(options: {
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
 
export const generateForm = function<F, R = any, V=any>(option: {
  config: UDFieldConfigs<F, V> ,
  pickFields: ((keyof F) & (keyof R))[]
}): Partial<UDFieldConfigs<F, V>>{
  const {config, pickFields} = option;
  const records: typeof config = {} as any;
  pickFields.forEach((key)=>{
    records[key] = config[key];
  });
  return records;
}

export const generateReactiveForm = function<F, R = any, V=any>(option: {
    config: UDFieldConfigs<F, V> ,
    pickFields: ((keyof F) & (keyof R))[],
  } & VForm.FormOption<F, R, V>
): UnwrapNestedRefs<Partial<UDFieldConfigs<F, V>>> {
  return reactive(generateForm(option));
}