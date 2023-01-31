//
//
//      T  Y  P  E  S
//
//
export {
  EFormStage,
  IBaseFormModel,
  IBaseFormCtrl,
  IBaseFormCtrlExt,
  IBaseEventHandler
} from "~/base/types/modelTypes";

export type { Optional } from "~/base/types/commonTypes";

export type { UDFieldConfigs, UDFieldDefineMethod } from "~/base/types/configTypes";

export type { DisplayOption, IBaseFormContext } from "~/base/types/contextTypes";

export type {
  ValidatorHandler,
  InternalValidatorLinkHandler,
  InternalValidator,
  InternalValidators,
  UDValidationMessages,
  UDValidator,
  UDValidators,
  UDFieldRuleConfig,
  UDFieldRules,
  FieldRuleBuilder
} from "~/base/types/validatorTypes";

export type {
  FormKey,
  FormValue,
  ErrorKey,
  RemoteErrors,
  InternalFormOption,
  UDFormOption,
  FormField,
  InternalFormConfig,
  FormExt,
  FormState,
  FormPayload
} from "~/base/types/formTypes";

//
//
//      I M P L E M E N T A T I O N
//
//
export { BaseFormModel } from "~/base/impl/baseModelImpl";

export { BaseFormContext } from "@/base/impl/baseContextImpl";

export { baseFieldRules, aRule } from "~/base/impl/baseRuleImpl";

export { BaseFormImpl } from "~/base/impl/baseFormImpl";

export { EBaseValidationIdents, aValidator, baseValidators } from "~/base/impl/baseValidatorImpl";



//
//
//   
//
//
//

export { defineFieldRules } from "~/utils/formRuleUtil";

export { defineValidators } from "~/utils/formValidatorUtil";

export {
  defineFieldConfigs,
  defineValidationMsg,
  createReactiveFormModel,
  createFormModelOption,
  BaseReactiveForm,
} from "@/utils/formConfigUtil";

