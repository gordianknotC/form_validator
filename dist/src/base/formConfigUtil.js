import { reactive } from "vue";
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
export const defineFieldConfigs = function (options) {
    let _cfg;
    return new Proxy({}, {
        get: function (target, name) {
            _cfg ?? (_cfg = options.configBuilder(option => {
                const { payloadKey, fieldName, placeholder, label, ruleBuilder, valueBuilder } = option;
                const { name, fieldRule } = ruleBuilder(options.fieldRules);
                const transformed = {
                    payloadKey,
                    name,
                    fieldRule,
                    defaultValue: valueBuilder(),
                    value: valueBuilder(),
                    label,
                    placeholder
                };
                return transformed;
            }));
            const index = _cfg.findIndex(_ => _.name == name);
            return _cfg[index];
        }
    });
};
export const generateForm = function (option) {
    const { config, pickFields } = option;
    const records = {};
    pickFields.forEach((key) => {
        records[key] = config[key];
    });
    return records;
};
export const generateReactiveForm = function (option) {
    return reactive(generateForm(option));
};
//# sourceMappingURL=formConfigUtil.js.map