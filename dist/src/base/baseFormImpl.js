import { computed, ref, reactive, is, assert, assertMsg, Arr } from "@gdknot/frontend_common";
export var ECompStage;
(function (ECompStage) {
    ECompStage[ECompStage["loading"] = 0] = "loading";
    ECompStage[ECompStage["ready"] = 1] = "ready";
})(ECompStage || (ECompStage = {}));
/**
 *
 *      M O D E L
 *
 * */
export class BaseFormModel {
    constructor(rules, state, messages, config) {
        this.rules = rules;
        this.messages = messages;
        this.config = config;
        this.stage = ref(ECompStage.ready);
        this.initialState = { ...state };
        Object.keys(this.initialState).forEach((element) => {
            //@ts-ignore
            this.initialState[element] = { ...state[element] };
        });
        this.state = reactive(state);
        this.linkages = Arr([]);
        this.dataKeys = Arr(Object.keys(this.state));
        this.identifiers = this.dataKeys.map((fieldName) => {
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
    getDataKeys() {
        return (this.dataKeys ?? (this.dataKeys = Arr(Object.keys(this.state))));
    }
    getFields() {
        return (this.formFields ?? (this.formFields = Arr(this.getDataKeys().map((_) => {
            return this.state[_];
        }))));
    }
    getIdentifiers() {
        return (this.identifiers ?? (this.identifiers = this.getDataKeys().map((fieldName) => {
            const field = this.state[fieldName];
            return field.name;
        })));
    }
    //@ts-ignore
    getValueByDataKey(dataKey) {
        return this.state[dataKey].value;
    }
    getValueByName(name) {
        return this.getFields().firstWhere((_) => _.name == name)
            ?.value;
    }
    getFieldByDataKey(dataKey) {
        const field = this.getFields().firstWhere((_) => _.dataKey == dataKey);
        assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}, dataKey: ${String(dataKey)}`);
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
    // hasLinked(fieldName: string): boolean{
    //   const alreadyExists = this.linkages.any((_)=> _.master.name === fieldName);
    // }
    linkFields(option) {
        const master = option.master.name;
        const slave = option.slave.name;
        const alreadyExists = this.linkages.any((_) => _.master.name === master && _.slave.name === slave);
        if (!alreadyExists) {
            // console.log("linkDataKeys:".brightGreen, option);
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
    constructor(model, name, dataKey) {
        this.model = model;
        this.name = name;
        this.dataKey = dataKey;
        this.displayOption = { showMultipleErrors: false };
    }
    //@ts-ignore
    get value() {
        return this.model.getValueByName(this.name);
    }
    //@ts-ignore
    set value(val) {
        // @ts-ignore
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
}
/**
 *
 *        B A S E   F O R M
 *
 * */
export class BaseFormImpl extends BaseFormModel {
    constructor(option) {
        const emptyFunc = () => {
            return true;
        };
        super(option.rules, option.state, option.messages, {
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
                    if (field.rule.contains("required") && is.empty(value)) {
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
            return results.every((_) => _) && stage === ECompStage.ready;
        });
        this.request = option.request;
        this.resend = option.resend ?? ((...args) => { });
    }
    getContext(fieldName) {
        var _a;
        this.cachedContext ?? (this.cachedContext = {});
        const field = this.getFieldByFieldName(fieldName);
        assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`);
        (_a = this.cachedContext)[fieldName] ?? (_a[fieldName] = new BaseFormContext(this, field.name, field.dataKey));
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
    notifyLeavingFocus(dataKey) {
        this.validate(dataKey);
    }
    notifyReFocus(dataKey) {
        this.validate(dataKey);
    }
    notifyOnInput(dataKey, extraArg) {
        const validateResult = this.validate(dataKey, extraArg);
        const link = this.linkages.firstWhere((_) => _.slave.dataKey === dataKey);
        if (is.not.undefined(link)) {
            this.validate(link.master.dataKey, extraArg);
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
            this.stage.value = ECompStage.loading;
            const self = this;
            const result = await this.request(this.getPayload());
            const destroyForm = this.config.onSubmit?.(result, self);
            this.stage.value = ECompStage.ready;
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
                this.stage.value = ECompStage.ready;
            }, 800);
        }
        return Promise.resolve(undefined);
    }
    validate(dataKey, extraArg) {
        const field = this.getFieldByDataKey(dataKey);
        const context = this.getContext(field.name);
        const errors = Arr([]);
        const rules = Arr(field.rule.split("|"));
        rules.forEach((element) => {
            const rule = this.rules[element];
            assert(is.initialized(rule), `${assertMsg.propertyNotInitializedCorrectly}: rule: ${element}`);
            const passed = this.rules[element](context, field.value, extraArg);
            if (passed) {
            }
            else {
                errors.add(this.messages[element]?.value ?? "Undefined error");
            }
        });
        if (context.displayOption.showMultipleErrors) {
            field.fieldError = errors.join("\n");
        }
        else {
            field.fieldError = is.empty(errors) ? "" : errors.first;
        }
        /** 如果是 optional 且內容為空，無論 validation 結果為何，均為 true*/
        if (rules.contains("optional") && is.empty(field.value)) {
            field.fieldError = "";
            return true;
        }
        /** 如果沒有 required 且內容為空，無論 validation 結果為何，均為 true*/
        if (!rules.contains("required") && is.empty(field.value)) {
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
            return this.validate(_.dataKey);
        });
        return results.every((_) => _);
    }
}
//# sourceMappingURL=baseFormImpl.js.map