"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typed = exports.BaseFormImpl = void 0;
const frontend_common_1 = require("@gdknot/frontend_common");
const baseContextImpl_1 = require("./baseContextImpl");
const baseModelImpl_1 = require("./baseModelImpl");
const modelTypes_1 = require("~/base/types/modelTypes");
const formValidatorUtil_1 = require("@/utils/formValidatorUtil");
/**
 *
 *        B A S E   F O R M
 *
 *  @see {@link BaseFormModel}
 *  @see {@link IBaseFormCtrl}
 *  @see IBaseEventHandler
 * */
class BaseFormImpl extends baseModelImpl_1.BaseFormModel {
    constructor(option) {
        const emptyFunc = () => {
            return true;
        };
        super(option.state, option.messages, {
            title: option.title ?? (0, frontend_common_1._computed)(() => ""),
            visible: option.visible ?? (0, frontend_common_1._reactive)({ value: false }),
            onClose: option.onClose ??
                ((model) => {
                    model.resetState();
                    model.config.visible.value = false;
                }),
            onVisible: option.onVisible ?? emptyFunc,
            onCancel: option.onCancel ?? emptyFunc,
            onSubmit: option.onSubmit ?? emptyFunc,
            onBeforeVisible: option.onBeforeVisible ??
                ((model, extra) => {
                    model.resetState(extra);
                }),
            onNotifyRectifyingExistingErrors: option.onNotifyRectifyingExistingErrors ?? emptyFunc,
            onBeforeSubmit: option.onBeforeSubmit ?? emptyFunc,
            onAfterSubmit: option.onAfterSubmit ?? emptyFunc,
            onCatchSubmit: option.onCatchSubmit ?? emptyFunc,
        });
        this.getFields().forEach((field) => {
            field.context = this.getContext(field.name);
            field.fieldError = "";
            field.hidden ?? (field.hidden = false);
            field.hasError ?? (field.hasError = (0, frontend_common_1._computed)(() => {
                return frontend_common_1.is.not.empty(field.fieldError);
            }));
        });
        this.canSubmit = (0, frontend_common_1._computed)(() => {
            let results = (0, frontend_common_1.Arr)([]);
            let stage = this.stage.value;
            Object.keys(this.state).forEach((_) => {
                const field = this.state[_];
                const value = field.value;
                // console.log(field.rule, value, results);
                if (frontend_common_1.is.empty(field.fieldError)) {
                    const ruleChain = (0, frontend_common_1.Arr)(field.ruleChain);
                    const required = ruleChain.firstWhere((_) => _.validatorName == "required");
                    if (required && frontend_common_1.is.empty(value)) {
                        results.add(false);
                        return;
                    }
                    // if (!field.rule.contains('required') && is.empty(value)){
                    //   results.add(false);
                    //   return;
                    // }
                    results.add(true);
                    return;
                }
                results.add(false);
                return;
            });
            return results.every((_) => _) && stage === modelTypes_1.EFormStage.ready;
        });
        this.request = option.request;
        this.resend = option.resend ?? ((...args) => { });
    }
    getContext(fieldName) {
        var _a;
        this.cachedContext ?? (this.cachedContext = {});
        const field = this.getFieldByFieldName(fieldName);
        (0, frontend_common_1.assert)(frontend_common_1.is.initialized(field), `${formValidatorUtil_1.assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`);
        (_a = this.cachedContext)[fieldName] ?? (_a[fieldName] = new baseContextImpl_1.BaseFormContext(this, field.name, field.payloadKey, (0, frontend_common_1.Arr)(field.ruleChain)));
        return this.cachedContext[fieldName];
    }
    /** 取得當前表單 payload, 使用者可實作 getPayload 改寫傳送至遠端的 payload
     * @example
     * ```ts
     *  getPayload(){
     *    const result = super.getPayload();
     *    delete result.remark;
     *    return result;
     *  }
     * ```
     */
    getPayload() {
        const result = {};
        Object.keys(this.state).forEach((__) => {
            const _ = __;
            const field = this.state[_];
            if (frontend_common_1.is.not.empty(field.value)) {
                result[_] = field.value;
            }
        });
        // console.log('payload:', result);
        return result;
    }
    notifyRectifyingExistingErrors() {
        if (!this.canSubmit.value) {
            this.config.onNotifyRectifyingExistingErrors();
        }
    }
    notifyLeavingFocus(payloadKey) {
        this.validate(payloadKey);
    }
    notifyReFocus(payloadKey) {
        this.validate(payloadKey);
    }
    notifyOnInput(payloadKey, extraArg) {
        const validateResult = this.validate(payloadKey, extraArg);
        // 當自身是 slave 時, 呼叫 master
        const link = this.linkages.firstWhere((_) => _.slave.payloadKey === payloadKey);
        if (frontend_common_1.is.not.undefined(link)) {
            this.validate(link.master.payloadKey, extraArg);
        }
    }
    inputValue(payloadKey, value) {
        const field = this.getFieldByPayloadKey(payloadKey);
        field.value = value;
        this.notifyOnInput(payloadKey);
    }
    cancel() {
        const self = this;
        // console.log('cancel');
        this.config.onCancel?.(self);
        // this.config.onClose(self);
    }
    async submit() {
        try {
            this.config.onBeforeSubmit();
            this.stage.value = modelTypes_1.EFormStage.loading;
            const self = this;
            const result = await this.request(this.getPayload());
            const destroyForm = this.config.onSubmit?.(result, self);
            this.stage.value = modelTypes_1.EFormStage.ready;
            this.config.onAfterSubmit();
            if (destroyForm) {
                try {
                    this.config.onClose(self);
                }
                catch (e) { }
            }
            return result;
        }
        catch (e) {
            console.error(e);
            this.config.onCatchSubmit(e);
            throw e;
        }
        finally {
            setTimeout(() => {
                this.stage.value = modelTypes_1.EFormStage.ready;
            }, 800);
        }
        return Promise.resolve(undefined);
    }
    validate(payloadKey, extraArg) {
        const field = this.getFieldByPayloadKey(payloadKey);
        const context = this.getContext(field.name);
        const errors = (0, frontend_common_1.Arr)([]);
        const ruleChain = (0, frontend_common_1.Arr)(field.ruleChain);
        ruleChain.forEach((validator) => {
            const { validatorName, appliedFieldName } = validator;
            (0, frontend_common_1.assert)(frontend_common_1.is.initialized(appliedFieldName), `${formValidatorUtil_1.assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
            (0, frontend_common_1.assert)(frontend_common_1.is.initialized(validatorName), `${formValidatorUtil_1.assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
            try {
                context.validator = validator;
                const passed = validator.handler(context, field.value, extraArg);
                if (passed) {
                }
                else {
                    /**
                     * todo: 實作 bail 的作用 */
                    const ruleMsg = (this.messages[validatorName]);
                    errors.add(ruleMsg?.value ?? "Undefined error");
                }
            }
            catch (e) {
                const error = String(e).toLowerCase();
                const isAssertError = error.contains("assertionerror");
                const hasLinkedField = validator.linkedFieldName;
                if (isAssertError && hasLinkedField) {
                    const foundLinkedField = context.getLinkedFieldName(validator.validatorName);
                    if (!foundLinkedField) {
                        throw `${formValidatorUtil_1.assertMsg.linkFieldNameNotFound}: validatorName: ${String(validator.validatorName)} at fieldName '${context.name}' link to '${validator.linkedFieldName}'`;
                    }
                }
                throw e;
            }
        });
        if (context.displayOption.showMultipleErrors) {
            field.fieldError = errors.join("\n");
        }
        else {
            field.fieldError = frontend_common_1.is.empty(errors) ? "" : errors.first;
        }
        const isOptional = ruleChain.firstWhere((_) => _.validatorName == "optional");
        /** 如果是 optional 且內容為空，無論 validation 結果為何，均為 true*/
        if (isOptional && frontend_common_1.is.empty(field.value)) {
            field.fieldError = "";
            return true;
        }
        const isRequired = ruleChain.firstWhere((_) => _.validatorName == "required");
        /** 如果沒有 required 且內容為空，無論 validation 結果為何，均為 true*/
        if (!isRequired && frontend_common_1.is.empty(field.value)) {
            field.fieldError = "";
            return true;
        }
        return frontend_common_1.is.empty(errors);
    }
    validateAll() {
        // don't apply validation on hidden fields
        const results = this.getFields()
            .where((_) => !(_.hidden ?? false))
            .map((_) => {
            return this.validate(_.payloadKey);
        });
        return results.every((_) => _);
    }
}
exports.BaseFormImpl = BaseFormImpl;
function typed(val) {
    return val;
}
exports.typed = typed;
//# sourceMappingURL=baseFormImpl.js.map