"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFormContext = void 0;
const frontend_common_1 = require("@gdknot/frontend_common");
/**
 *
 *      C O N T E X T
 *
 * */
class BaseFormContext {
    constructor(model, fieldName, payloadKey, ruleChain) {
        this.model = model;
        this.fieldName = fieldName;
        this.payloadKey = payloadKey;
        this.ruleChain = ruleChain;
        this.displayOption = { showMultipleErrors: false };
    }
    //@ts-ignore //todo: comment out ts-ignore 不解？ 
    get value() {
        return this.model.state[this.payloadKey].value;
    }
    //@ts-ignore //todo: comment out ts-ignore 不解？ 
    set value(val) {
        this.model.state[this.payloadKey].value = val;
    }
    getFormValues() {
        const self = this;
        return new Proxy({}, {
            get: function (target, name) {
                const field = self.model.getFields().firstWhere((_) => _.fieldName == name);
                const initialized = frontend_common_1.is.initialized(field);
                (0, frontend_common_1.assert)(initialized, `form key: ${name} not found`);
                return field.value;
            },
        });
    }
    getFormState() {
        return this.model.state;
    }
    getLinkedFieldName(validatorIdent) {
        const validator = this.ruleChain.firstWhere((_) => _.validatorName == validatorIdent);
        return validator?._linkedFieldName;
    }
}
exports.BaseFormContext = BaseFormContext;
//# sourceMappingURL=baseContextImpl.js.map