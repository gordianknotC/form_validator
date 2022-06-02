import { computed, reactive } from "vue";
import { ref } from "vue";
import { assert, assertMsg } from "common_js_builtin/dist/utils/assert";
import { is } from "common_js_builtin/dist/utils/typeInferernce";
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
        this.linkages = [];
        this.dataKeys = Object.keys(this.state);
        this.identifiers = this.dataKeys.map((fieldName) => {
            var _a;
            const field = this.state[fieldName];
            (_a = field.fieldType) !== null && _a !== void 0 ? _a : (field.fieldType = "text");
            this.state[fieldName] = reactive(field);
            return field.name;
        });
        let remoteErrors;
        remoteErrors !== null && remoteErrors !== void 0 ? remoteErrors : (remoteErrors = {});
        Object.keys(this.state).forEach((key) => {
            remoteErrors[key] = undefined;
        });
        remoteErrors.uncategorizedError = undefined;
        this.initialRemoteErrors = remoteErrors;
        this.remoteErrors = reactive(remoteErrors);
    }
    getDataKeys() {
        var _a;
        return (_a = this.dataKeys) !== null && _a !== void 0 ? _a : (this.dataKeys = Object.keys(this.state));
    }
    getFields() {
        var _a;
        return (_a = this.formFields) !== null && _a !== void 0 ? _a : (this.formFields = this.getDataKeys().map((_) => {
            return this.state[_];
        }));
    }
    getIdentifiers() {
        var _a;
        return (_a = this.identifiers) !== null && _a !== void 0 ? _a : (this.identifiers = this.getDataKeys().map((fieldName) => {
            const field = this.state[fieldName];
            return field.name;
        }));
    }
    //@ts-ignore
    getValueByDataKey(dataKey) {
        return this.state[dataKey].value;
    }
    getValueByName(name) {
        var _a;
        return (_a = this.getFields().firstWhere((_) => _.name == name)) === null || _a === void 0 ? void 0 : _a.value;
    }
    getFieldByDataKey(dataKey) {
        const field = this.getFields().firstWhere((_) => _.dataKey == dataKey);
        assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}, dataKey: ${dataKey}`);
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
        const targetState = payload !== null && payload !== void 0 ? payload : this.asPayload(initialState);
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
            }
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const emptyFunc = () => { return true; };
        super(option.rules, option.state, option.messages, {
            title: (_a = option.title) !== null && _a !== void 0 ? _a : computed(() => ""),
            visible: (_b = option.visible) !== null && _b !== void 0 ? _b : reactive({ value: false }),
            onClose: (_c = option.onClose) !== null && _c !== void 0 ? _c : ((model) => {
                model.resetState();
                model.config.visible.value = false;
            }),
            onVisible: (_d = option.onVisible) !== null && _d !== void 0 ? _d : emptyFunc,
            onCancel: (_e = option.onCancel) !== null && _e !== void 0 ? _e : emptyFunc,
            onSubmit: (_f = option.onSubmit) !== null && _f !== void 0 ? _f : emptyFunc,
            onBeforeVisible: (_g = option.onBeforeVisible) !== null && _g !== void 0 ? _g : ((model, extra) => {
                model.resetState(extra);
            }),
            onNotifyRectifyingExistingErrors: (_h = option.onNotifyRectifyingExistingErrors) !== null && _h !== void 0 ? _h : emptyFunc,
            onBeforeSubmit: (_j = option.onBeforeSubmit) !== null && _j !== void 0 ? _j : emptyFunc,
            onAfterSubmit: (_k = option.onAfterSubmit) !== null && _k !== void 0 ? _k : emptyFunc,
            onCatchSubmit: (_l = option.onCatchSubmit) !== null && _l !== void 0 ? _l : emptyFunc,
        });
        this.getFields().forEach((field) => {
            var _a, _b;
            field.context = this.getContext(field.name);
            field.fieldError = "";
            (_a = field.hidden) !== null && _a !== void 0 ? _a : (field.hidden = false);
            (_b = field.hasError) !== null && _b !== void 0 ? _b : (field.hasError = computed(() => {
                return is.not.empty(field.fieldError);
            }));
        });
        this.canSubmit = computed(() => {
            let results = [];
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
        this.resend = (_m = option.resend) !== null && _m !== void 0 ? _m : ((...args) => { });
    }
    getContext(fieldName) {
        var _a, _b;
        var _c;
        (_a = this.cachedContext) !== null && _a !== void 0 ? _a : (this.cachedContext = {});
        const field = this.getFieldByFieldName(fieldName);
        assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`);
        (_b = (_c = this.cachedContext)[fieldName]) !== null && _b !== void 0 ? _b : (_c[fieldName] = new BaseFormContext(this, field.name, field.dataKey));
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
        const vresult = this.validate(dataKey, extraArg);
        // console.log('notifyOnInput:', vresult,  dataKey, this.getFieldByDataKey(dataKey).value, 'extraArg:', extraArg);
        const link = this.linkages.firstWhere((_) => _.slave.dataKey === dataKey);
        if (is.not.undefined(link)) {
            this.validate(link.master.dataKey, extraArg);
        }
    }
    cancel() {
        var _a, _b;
        const self = this;
        // console.log('cancel');
        (_b = (_a = this.config).onCancel) === null || _b === void 0 ? void 0 : _b.call(_a, self);
        // this.config.onClose(self);
    }
    async submit() {
        var _a, _b;
        try {
            this.config.onBeforeSubmit();
            this.stage.value = ECompStage.loading;
            const self = this;
            const result = await this.request(this.getPayload());
            const destroyForm = (_b = (_a = this.config).onSubmit) === null || _b === void 0 ? void 0 : _b.call(_a, result, self);
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
            this.stage.value = ECompStage.ready;
            this.config.onCatchSubmit(e);
            throw e;
        }
        return Promise.resolve(undefined);
    }
    validate(dataKey, extraArg) {
        const field = this.getFieldByDataKey(dataKey);
        const context = this.getContext(field.name);
        const errors = [];
        const rules = (field.rule.split("|"));
        rules.forEach((element) => {
            var _a, _b;
            const rule = this.rules[element];
            assert(is.initialized(rule), `${assertMsg.propertyNotInitializedCorrectly}: rule: ${element}`);
            const passed = this.rules[element](context, field.value, extraArg);
            if (passed) {
            }
            else {
                errors.add((_b = (_a = this.messages[element]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "Undefined error");
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
            .where((_) => { var _a; return !((_a = _.hidden) !== null && _a !== void 0 ? _a : false); })
            .map((_) => {
            return this.validate(_.dataKey);
        });
        return results.every((_) => _);
    }
}
//# sourceMappingURL=baseFormImpl.js.map