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

export { Optional } from "~/base/types/commonTypes";

export { UDFieldConfigs, UDFieldDefineMethod } from "~/base/types/configTypes";

export { DisplayOption, IBaseFormContext } from "~/base/types/contextTypes";

export {
  ValidatorHandler,
  InternalValidatorLinkHandler,
  InternalValidator,
  InternalValidators,
  ValidationMessages,
  UDValidationMessages,
  UDValidator,
  UDValidators,
  UDFieldRuleConfig,
  UDFieldRules,
  FieldRuleBuilder
} from "~/base/types/validatorTypes";

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
  generateReactiveFormModel,
  formModelOption,
  BaseReactiveForm,
} from "@/utils/formConfigUtil";
