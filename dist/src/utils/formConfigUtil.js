"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineValidationMsg = exports.createReactiveFormModel = exports.createFormModelOption = exports.defineFieldConfigs = exports.BaseReactiveForm = void 0;
const baseFormImpl_1 = require("~/base/impl/baseFormImpl");
const frontend_common_1 = require("@gdknot/frontend_common");
const vue_1 = require("vue");
const constants_1 = require("@/constants");
class BaseReactiveForm extends baseFormImpl_1.BaseFormImpl {
    constructor(option) {
        (0, frontend_common_1.flattenInstance)(super(option));
    }
}
exports.BaseReactiveForm = BaseReactiveForm;
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
const defineFieldConfigs = function (options) {
    let _cfg;
    return new Proxy({}, {
        get: function (target, name) {
            _cfg ?? (_cfg = options.configBuilder(option => {
                const { payloadKey, fieldName, placeholder, label, ruleBuilder, valueBuilder, } = option;
                const ruleChain = (0, frontend_common_1.Arr)(ruleBuilder(options.fieldRules).map((_) => {
                    try {
                        return _._applyField(fieldName);
                    }
                    catch (e) {
                        console.log("validator:", _);
                        throw `${e}\n fieldName: ${fieldName}\nvalidator: ${_}`;
                    }
                }));
                const transformed = {
                    payloadKey,
                    fieldName: fieldName,
                    ruleChain,
                    defaultValue: valueBuilder(),
                    value: valueBuilder(),
                    label,
                    placeholder
                };
                return transformed;
            }));
            const index = _cfg.findIndex(_ => _.payloadKey == name);
            return _cfg[index];
        }
    });
};
exports.defineFieldConfigs = defineFieldConfigs;
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
const createFormModelOption = function (option) {
    const { config, pickFields } = option;
    const records = {};
    pickFields.forEach((key) => {
        const _key = key;
        records[_key] = config[_key];
    });
    const state = (0, vue_1.reactive)(records);
    const result = (0, frontend_common_1.Obj)(option).omitBy((k, v) => k == "config" || k == "pickFields");
    result.state = state;
    return result;
};
exports.createFormModelOption = createFormModelOption;
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
const createReactiveFormModel = function (formOption) {
    const result = new BaseReactiveForm(formOption);
    const superPayloadGetter = result.getPayload.bind(result);
    const inheritPayloadGetter = formOption.getPayload.bind(result);
    result.getPayload = () => {
        return inheritPayloadGetter(superPayloadGetter());
    };
    return result;
};
exports.createReactiveFormModel = createReactiveFormModel;
/** 用來定義驗證錯誤時所對應的信息
 * @typeParam V - validators 值鍵對
*/
const defineValidationMsg = function (option) {
    const proceedOption = {};
    Object.keys(option).forEach((_k) => {
        const key = _k;
        proceedOption[key] = (option[key] ?? (0, vue_1.computed)(() => {
            return `${constants_1.undefinedValidationErrorMessage}"${String(key)}"`;
        }));
    });
    return proceedOption;
};
exports.defineValidationMsg = defineValidationMsg;
//# sourceMappingURL=formConfigUtil.js.map