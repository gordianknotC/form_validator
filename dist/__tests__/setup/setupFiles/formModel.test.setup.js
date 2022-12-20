import { is } from "@gdknot/frontend_common";
import { generateReactiveForm } from "@/utils/formConfigUtil";
import { BaseFormImpl, baseValidators } from "index";
import { computed } from "vue";
import { fieldConfigs } from "./formConfig.test.setup";
export class CreateUserFormModel extends BaseFormImpl {
    constructor(option) {
        super(Object.assign(option ?? {}, {
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
            onVisible(model, extra) { },
            onBeforeVisible(model, extra) {
                model.resetState(extra);
            }
        }));
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
    getPayload() {
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
//# sourceMappingURL=formModel.test.setup.js.map