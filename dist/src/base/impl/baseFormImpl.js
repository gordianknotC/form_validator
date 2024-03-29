"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typed = exports.BaseFormImpl = void 0;
const frontend_common_1 = require("@gdknot/frontend_common");
const baseContextImpl_1 = require("./baseContextImpl");
const baseModelImpl_1 = require("./baseModelImpl");
const modelTypes_1 = require("../../base/types/modelTypes");
const formValidatorUtil_1 = require("../../utils/formValidatorUtil");
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
            onVisibleChanged: option.onVisibleChanged ?? emptyFunc,
            onCancel: option.onCancel ?? emptyFunc,
            onSubmit: option.onSubmit ?? emptyFunc,
            // onBeforeVisible:
            //   option.onBeforeVisible ??
            //   (((model: this, extra: any) => {
            //     model.resetState(extra);
            //   }) as unknown as any),
            onNotifyRectifyingExistingErrors: option.onNotifyRectifyingExistingErrors ?? emptyFunc,
            onBeforeSubmit: option.onBeforeSubmit ?? emptyFunc,
            onAfterSubmit: option.onAfterSubmit ?? emptyFunc,
            onCatchSubmit: option.onCatchSubmit ?? emptyFunc,
        });
        this.getFields().forEach((field) => {
            field.context = this.getContext(field.fieldName);
            field.fieldError = "";
            field.hidden ?? (field.hidden = false);
            field.hasError ?? (field.hasError = (0, frontend_common_1._computed)(() => {
                return frontend_common_1.is.not.empty(field.fieldError);
            }));
            for (let index = 0; index < field.ruleChain.length; index++) {
                const validator = field.ruleChain[index];
                if (validator._linkedFieldName) {
                    const linkName = field.context.getLinkedFieldName(validator.validatorName);
                    (0, frontend_common_1.assert)(() => linkName != undefined);
                    // 透過欄位名取得欄位物件
                    const linkField = field.context.model.getFieldByFieldName(linkName);
                    const linkVal = linkField.value;
                    field.context.model.link({
                        master: { fieldName: field.context.fieldName, payloadKey: field.context.payloadKey },
                        slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
                    });
                }
            }
        });
        this.canSubmit = (0, frontend_common_1._computed)(() => {
            // let results: ArrayDelegate<boolean> = Arr([]);
            // let stage = this.stage.value;
            // Object.keys(this.state as FormState <T, E, V>).forEach((_: any) => {
            //   const field = (this.state as FormState <T, E, V>)[
            //     _ as FormKey <T, E, V>
            //     ] as FormField <T, E, V>;
            //   const value = field.value;
            //   if (is.empty(field.fieldError)) {
            //     const ruleChain = Arr(field.ruleChain);
            //     const required = ruleChain.firstWhere((_)=>_.validatorName == "required");
            //     if (required && is.empty(value)) {
            //       results.add(false);
            //       return;
            //     }
            //     results.add(true);
            //     return;
            //   }
            //   results.add(false);
            //   return;
            // });
            // return results.every((_) => _) && stage === EFormStage.ready;
            let stage = this.stage.value;
            return !this.hasError() && stage === modelTypes_1.EFormStage.ready;
        });
        this.request = option.postMethod;
        this.resend = option.resendPost ?? ((...args) => { });
    }
    hasError() {
        let results = (0, frontend_common_1.Arr)([]);
        let stage = this.stage.value;
        const keys = Object.keys(this.state);
        for (let index = 0; index < keys.length; index++) {
            const _ = keys[index];
            const field = this.state[_];
            const value = field.value;
            if (frontend_common_1.is.empty(field.fieldError)) {
                const ruleChain = (0, frontend_common_1.Arr)(field.ruleChain);
                const required = ruleChain.firstWhere((_) => _.validatorName == "required");
                if (required && frontend_common_1.is.empty(value)) {
                    return true;
                }
                continue;
            }
            else {
                return true;
            }
        }
        return false;
    }
    getContext(fieldName) {
        var _a;
        this.cachedContext ?? (this.cachedContext = {});
        const field = this.getFieldByFieldName(fieldName);
        (0, frontend_common_1.assert)(() => frontend_common_1.is.initialized(field), `${formValidatorUtil_1.assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`);
        (_a = this.cachedContext)[fieldName] ?? (_a[fieldName] = new baseContextImpl_1.BaseFormContext(this, field.fieldName, field.payloadKey, (0, frontend_common_1.Arr)(field.ruleChain)));
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
    notifyVisibilityChanged() {
        this.config.onVisibleChanged(this, this.config.visible.value);
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
        const context = this.getContext(field.fieldName);
        const errors = (0, frontend_common_1.Arr)([]);
        const ruleChain = (0, frontend_common_1.Arr)(field.ruleChain);
        let stackErrorMessage = false;
        for (let index = 0; index < ruleChain.length; index++) {
            const validator = ruleChain[index];
            const { validatorName, _appliedFieldName: appliedFieldName } = validator;
            if (validatorName == "bail")
                stackErrorMessage = true;
            (0, frontend_common_1.assert)(() => frontend_common_1.is.initialized(appliedFieldName), `${formValidatorUtil_1.assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
            (0, frontend_common_1.assert)(() => frontend_common_1.is.initialized(validatorName), `${formValidatorUtil_1.assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
            try {
                context.validator = validator;
                const passed = validator.handler(context, field.value, extraArg);
                if (passed) {
                }
                else {
                    const ruleMsg = (this.messages[validatorName]);
                    errors.add(ruleMsg?.value ?? "Undefined error");
                    if (!stackErrorMessage) {
                        break;
                    }
                }
            }
            catch (e) {
                const error = String(e).toLowerCase();
                const isAssertError = error.contains("assertionerror");
                const hasLinkedField = validator._linkedFieldName;
                if (isAssertError && hasLinkedField) {
                    const foundLinkedField = context.getLinkedFieldName(validator.validatorName);
                    if (!foundLinkedField) {
                        throw `${formValidatorUtil_1.assertMsg.linkFieldNameNotFound}: validatorName: ${String(validator.validatorName)} at fieldName '${context.fieldName}' link to '${validator._linkedFieldName}'`;
                    }
                }
                console.error(e);
            }
        }
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