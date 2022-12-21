import { flattenInstance, is } from "@gdknot/frontend_common";
import { generateReactiveForm, defineValidationMsg } from "@/utils/formConfigUtil";
import { VForm, BaseFormImpl, EBaseValidationIdents } from "index";
import { fieldConfigs, validators, validationMessages, validatorIdents, fieldRules } from "./formConfig.test.setup";
import { Fields } from "./payload.test.setup";

type F = Fields;
type V = typeof validators;
type R = typeof fieldRules;

export class CreateUserFormModel extends BaseFormImpl<F, F, V> {
  constructor(option?: Partial<VForm.FormOption<F, F, V>>) {
    const formOption = generateReactiveForm<F, V, R>({
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
    flattenInstance(super(formOption));
  }

  getPayload(): Record<VForm.FormKey<F, F, V>, any> {
    const result = super.getPayload();
    if (is.empty(result.remark)) {
      result.remark = null;
    }
    delete result.confirm_password;
    return result;
  }
}

export const createUserFormModel = new CreateUserFormModel();
createUserFormModel;

