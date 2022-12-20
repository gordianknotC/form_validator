import { is } from "@gdknot/frontend_common";
import { BaseFormImpl } from "index";
import { computed } from "vue";
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
            rules: baseFormRules,
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
export default new CreateUserFormModel();
//# sourceMappingURL=formModel.test.setup%20copy.js.map