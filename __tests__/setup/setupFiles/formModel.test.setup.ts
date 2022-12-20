


import { is } from "@gdknot/frontend_common";
import { generateReactiveForm } from "@/utils/formConfigUtil";
import { VForm, BaseFormImpl, Optional, baseFieldRules, baseValidators } from "index";
import { _ } from "numeral";
import { computed } from "vue";
import { fieldConfigs } from "./formConfig.test.setup";
import { TSignInPayload } from "./payload.test.setup";

import TFormKey = VForm.FormKey;
import TFormOption = VForm.FormOption;


type TFields = TSignInPayload & {
  confirm_password: string;
};
type TExtraFields = {};
type T = TFields;
type E = TExtraFields;
type V = typeof baseValidators;

export class CreateUserFormModel extends BaseFormImpl<T, E, V> {
  constructor(option?: Partial<TFormOption<T, E, V>>) {
    super(
      Object.assign(option ?? {}, {
        state: getBaseFormStatesByKeys([
          "username",
          "password",
          "confirm_password",
          "nickname",
          "remark"
        ]),
        request: apiService.createNewMerchant,
        validators: baseFormRules,
        messages: GenCustomValidationMessages(facade.languageService),
        title: computed(() => facade.languageService.txt.addMerchant),
        //@ts-ignore
        onClose(model) {
          model.resetState();
          model.config.visible.value = false;
          console.log("onCancel");
        },
        onVisible(model, extra) {},
        onBeforeVisible(model, extra) {
          model.resetState(extra);
        }
      } as TFormOption<T, E, V>)
    );

    generateReactiveForm({
      config: fieldConfigs,
      pickFields: [
        "username"
      ],
      request(...args) {
          
      },
      validators: baseValidators,

    });

    asCascadeClass(this);
  }

  getPayload(): Record<TFormKey<T, E, V>, any> {
    const result = super.getPayload();
    if (is.empty(result.remark)) {
      result.remark = null;
    }
    delete result.confirm_password;
    result.email = null;
    result.phone = null;
    return result;
  }
}

export const createUserFormModel = new CreateUserFormModel();
createUserFormModel;