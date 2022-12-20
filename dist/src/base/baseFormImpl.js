import { computed, ref, reactive, is, assert, assertMsg, Arr } from "@gdknot/frontend_common";
/** #### 表單當前狀態 */
export var EFormStage;
(function (EFormStage) {
    EFormStage[EFormStage["loading"] = 0] = "loading";
    EFormStage[EFormStage["ready"] = 1] = "ready";
})(EFormStage || (EFormStage = {}));
/**
 *
 *      M O D E L
 *
 * {@inheritDoc VForm.IBaseFormModel}
 * @see {@link VForm.IBaseFormModel}
 * @typeParam T -
 * @typeParam E -
 *
 * */
export class BaseFormModel {
    constructor(validators, state, messages, config) {
        this.validators = validators;
        this.messages = messages;
        this.config = config;
        /** 代表表單的二個狀態，loading/ready，用來區分表單是否正和遠端請求資料 */
        this.stage = ref(EFormStage.ready);
        this.initialState = { ...state };
        Object.keys(this.initialState).forEach((element) => {
            //@ts-ignore
            this.initialState[element] = { ...state[element] };
        });
        this.state = reactive(state);
        this.linkages = Arr([]);
        this.payloadKeys = Arr(Object.keys(this.state));
        this.identifiers = this.payloadKeys.map((fieldName) => {
            const field = this.state[fieldName];
            field.fieldType ?? (field.fieldType = "text");
            this.state[fieldName] = reactive(field);
            return field.name;
        });
        let remoteErrors;
        remoteErrors ?? (remoteErrors = {});
        Object.keys(this.state).forEach((key) => {
            remoteErrors[key] = undefined;
        });
        remoteErrors.unCategorizedError = undefined;
        this.initialRemoteErrors = remoteErrors;
        this.remoteErrors = reactive(remoteErrors);
    }
    getPayloadKeys() {
        return (this.payloadKeys ?? (this.payloadKeys = Arr(Object.keys(this.state))));
    }
    getFields() {
        return (this.formFields ?? (this.formFields = Arr(this.getPayloadKeys().map((_) => {
            return this.state[_];
        }))));
    }
    getIdentifiers() {
        return (this.identifiers ?? (this.identifiers = this.getPayloadKeys().map((fieldName) => {
            const field = this.state[fieldName];
            return field.name;
        })));
    }
    //@ts-ignore
    getValueByPayloadKey(payloadKey) {
        return this.state[payloadKey].value;
    }
    getValueByName(name) {
        return this.getFields().firstWhere((_) => _.name == name)
            ?.value;
    }
    getFieldByPayloadKey(payloadKey) {
        const field = this.getFields().firstWhere((_) => _.payloadKey == payloadKey);
        assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}, payloadKey: ${String(payloadKey)}`);
        return field;
    }
    getFieldByFieldName(fieldName) {
        const field = this.getFields().firstWhere((_) => _.name == fieldName);
        assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}, name: ${fieldName}`);
        return field;
    }
    clearRemoteErrors() {
        Object.keys(this.initialRemoteErrors).forEach((element) => {
            // @ts-ignore
            this.remoteErrors[element] = undefined;
        });
    }
    addRemoteErrors(errors) {
        Object.keys(errors).forEach((element) => {
            // @ts-ignore
            this.remoteErrors[element] = errors[element];
        });
    }
    resetInitialState() {
        const initialState = this.initialState;
        const state = this.state;
        Object.keys(state).forEach((element) => {
            const el = element;
            if (is.initialized(initialState[el])) {
                initialState[el].value = state[el].value;
            }
        });
    }
    asPayload(state) {
        // @ts-ignore
        const result = {};
        Object.keys(state).forEach((element) => {
            const el = element;
            // @ts-ignore
            result[el] = state[el].value;
        });
        return result;
    }
    resetState(payload) {
        const initialState = this.initialState;
        const state = this.state;
        const targetState = payload ?? this.asPayload(initialState);
        Object.keys(targetState).forEach((element) => {
            const el = element;
            if (is.initialized(state[el])) {
                state[el].value = targetState[el];
                state[el].fieldError = undefined;
            }
        });
    }
    linkFields(option) {
        const master = option.master.name;
        const slave = option.slave.name;
        const alreadyExists = this.linkages.any((_) => _.master.name === master && _.slave.name === slave);
        if (!alreadyExists) {
            // console.log("linkPayloadKeys:".brightGreen, option);
            this.linkages.add(option);
        }
    }
}
/**
 *
 *      C O N T E X T
 *
 * */
export class BaseFormContext {
    constructor(model, name, payloadKey, ruleChain) {
        this.model = model;
        this.name = name;
        this.payloadKey = payloadKey;
        this.ruleChain = ruleChain;
        this.displayOption = { showMultipleErrors: false };
    }
    //@ts-ignore
    get value() {
        return this.model.getValueByName(this.name);
    }
    //@ts-ignore
    set value(val) {
        this.model.state[this.name].value = val;
    }
    getFormValues() {
        const self = this;
        return new Proxy({}, {
            get: function (target, name) {
                const field = self.model.getFields().firstWhere((_) => _.name == name);
                const initialized = is.initialized(field);
                assert(initialized, `form key: ${name} not found`);
                return field.value;
            },
        });
    }
    getFormState() {
        return this.model.state;
    }
    getLinkedFieldName(ident) {
        return this.ruleChain.firstWhere((_) => _.validatorName == ident)?.linkedFieldName;
    }
}
/**
 *
 *        B A S E   F O R M
 *
 *  @see {@link BaseFormModel}
 *  @see {@link VForm.IBaseFormCtrl}
 *  @see VForm.IBaseEventHandler}
 * */
export class BaseFormImpl extends BaseFormModel {
    constructor(option) {
        const emptyFunc = () => {
            return true;
        };
        super(option.validators, option.state, option.messages, {
            title: option.title ?? computed(() => ""),
            visible: option.visible ?? reactive({ value: false }),
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
            field.hasError ?? (field.hasError = computed(() => {
                return is.not.empty(field.fieldError);
            }));
        });
        this.canSubmit = computed(() => {
            let results = Arr([]);
            let stage = this.stage.value;
            Object.keys(this.state).forEach((_) => {
                const field = this.state[_];
                const value = field.value;
                // console.log(field.rule, value, results);
                if (is.empty(field.fieldError)) {
                    const ruleChain = Arr(field.ruleChain);
                    const required = ruleChain.firstWhere((_) => _.validatorName == "required");
                    if (required && is.empty(value)) {
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
            return results.every((_) => _) && stage === EFormStage.ready;
        });
        this.request = option.request;
        this.resend = option.resend ?? ((...args) => { });
    }
    getContext(fieldName) {
        var _a;
        this.cachedContext ?? (this.cachedContext = {});
        const field = this.getFieldByFieldName(fieldName);
        assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`);
        (_a = this.cachedContext)[fieldName] ?? (_a[fieldName] = new BaseFormContext(this, field.name, field.payloadKey, Arr(field.ruleChain)));
        return this.cachedContext[fieldName];
    }
    getPayload() {
        // @ts-ignore
        const result = {};
        //@ts-ignore
        Object.keys(this.state).forEach((_) => {
            const field = this.state[_];
            if (is.not.empty(field.value)) {
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
        if (is.not.undefined(link)) {
            this.validate(link.master.payloadKey, extraArg);
        }
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
            this.stage.value = EFormStage.loading;
            const self = this;
            const result = await this.request(this.getPayload());
            const destroyForm = this.config.onSubmit?.(result, self);
            this.stage.value = EFormStage.ready;
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
                this.stage.value = EFormStage.ready;
            }, 800);
        }
        return Promise.resolve(undefined);
    }
    validate(payloadKey, extraArg) {
        const field = this.getFieldByPayloadKey(payloadKey);
        const context = this.getContext(field.name);
        const errors = Arr([]);
        const ruleChain = Arr(field.ruleChain);
        ruleChain.forEach((validator) => {
            const { validatorName, appliedFieldName } = validator;
            assert(is.initialized(appliedFieldName), `${assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
            assert(is.initialized(validatorName), `${assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
            const passed = validator.handler(context, field.value, extraArg);
            if (passed) {
            }
            else {
                const ruleMsg = this.messages[appliedFieldName];
                errors.add(ruleMsg?.value ?? "Undefined error");
            }
        });
        if (context.displayOption.showMultipleErrors) {
            field.fieldError = errors.join("\n");
        }
        else {
            field.fieldError = is.empty(errors) ? "" : errors.first;
        }
        const isOptional = ruleChain.firstWhere((_) => _.validatorName == "optional");
        /** 如果是 optional 且內容為空，無論 validation 結果為何，均為 true*/
        if (isOptional && is.empty(field.value)) {
            field.fieldError = "";
            return true;
        }
        const isRequired = ruleChain.firstWhere((_) => _.validatorName == "required");
        /** 如果沒有 required 且內容為空，無論 validation 結果為何，均為 true*/
        if (!isRequired && is.empty(field.value)) {
            field.fieldError = "";
            return true;
        }
        return is.empty(errors);
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
//# sourceMappingURL=baseFormImpl.js.map