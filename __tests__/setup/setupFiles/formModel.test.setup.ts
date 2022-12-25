import { flattenInstance, is } from "@gdknot/frontend_common";
import { formModelOption, defineValidationMsg, generateReactiveFormModel } from "@/utils/formConfigUtil";
import { VForm, BaseFormImpl, EBaseValidationIdents } from "index";
import { fieldConfigs, validators, validationMessages, validatorIdents, fieldRules } from "./formConfig.test.setup";
import { Fields } from "./payload.test.setup";

type F = Fields;
type V = typeof validators;
type R = typeof fieldRules;

const formOption = formModelOption<F, V, R>({
  config: fieldConfigs,
  pickFields: [
    "username",
    "password",
    "nickname",
    "confirm_password",
    "remark"
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
});
export class CreateUserFormModel extends BaseFormImpl<F, F, V> {
  constructor(option: FormOption<F, F, V>) {
    flattenInstance(super(option));
    this.state.username.value = "guest";
    
  }

  getPayload(): Record<FormKey<F, F, V>, any> {
    const result = super.getPayload();
    if (is.empty(result.remark)) {
      result.remark = null;
    }
    delete result.confirm_password;
    return result;
  }
}

export const userFormModelOOP = new CreateUserFormModel(formOption);
export const userFormModel = generateReactiveFormModel({
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

