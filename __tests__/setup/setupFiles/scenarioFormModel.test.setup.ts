import { flattenInstance, is, setupComputed, setupReactive, setupRef, setupWatch } from "@gdknot/frontend_common";
import { createFormModelOption as createFormModelOption, defineValidationMsg, createReactiveFormModel } from "@/utils/formConfigUtil";
import { BaseFormImpl, EBaseValidationIdents } from "index";
import { fieldConfigs, validators, validationMessages, validatorIdents, fieldRules } from "./formConfig.test.setup";
import { Fields } from "./payload.test.setup";
import { InternalFormOption, FormKey } from "@/base/types/formTYpes";
import { computed, reactive, ref, watch } from "vue";



type F = Fields;
type V = typeof validators;
type R = typeof fieldRules;

export const createUserFormModelOption = createFormModelOption<F, V, R>({
  config: fieldConfigs,
  pickFields: [
    "username",
    "password",
    "nickname",
    "confirm_password",
    "confirm_new_password",
    "new_password",
    "remark",
    "card_number",
    "card_number_A",
    "card_number_B"
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

export class CreateUserFormModel extends BaseFormImpl<F, F, V> {
  constructor(option: InternalFormOption<F, F, V>) {
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

export const userFormModelOOP = new CreateUserFormModel(createUserFormModelOption);
export const userFormModel = createReactiveFormModel({
  ...createUserFormModelOption,
  getPayload(_payload){
    const ret = _payload;
    if (is.empty(ret.remark)) {
      ret.remark = null;
    }
    delete ret.confirm_password;
    return ret;
  }
});

