import { useBuiltIn, is, assert, assertMsg } from "common_js_builtin";
import { computed, reactive } from "vue";
useBuiltIn();
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
        //@ts-ignore;
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
    getValueByName(ident) {
        var _a;
        return (_a = this.getFields().firstWhere((_) => _.name == ident)) === null || _a === void 0 ? void 0 : _a.value;
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
    resetAsInitialState() {
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
            console.log("linkDataKeys:".brightGreen, option);
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const emptyFunc = () => { return true; };
        super(option.rules, option.state, option.messages, {
            title: (_a = option.title) !== null && _a !== void 0 ? _a : computed(() => ''),
            visible: (_b = option.visible) !== null && _b !== void 0 ? _b : reactive({ value: false }),
            onClose: option.onClose,
            onVisible: (_c = option.onVisible) !== null && _c !== void 0 ? _c : emptyFunc,
            onCancel: (_d = option.onCancel) !== null && _d !== void 0 ? _d : emptyFunc,
            onSubmit: (_e = option.onSubmit) !== null && _e !== void 0 ? _e : emptyFunc,
            onBeforeVisible: (_f = option.onBeforeVisible) !== null && _f !== void 0 ? _f : emptyFunc,
            onNotifyRectifyingExistingErrors: (_g = option.onNotifyRectifyingExistingErrors) !== null && _g !== void 0 ? _g : emptyFunc,
            onBeforeSubmit: (_h = option.onBeforeSubmit) !== null && _h !== void 0 ? _h : emptyFunc,
            onAfterSubmit: (_j = option.onAfterSubmit) !== null && _j !== void 0 ? _j : emptyFunc,
            onCatchSubmit: (_k = option.onCatchSubmit) !== null && _k !== void 0 ? _k : emptyFunc,
        });
        this.getFields().forEach((field) => {
            var _a, _b;
            field.context = this.getContext(field.name);
            field.fieldError = '';
            (_a = field.hidden) !== null && _a !== void 0 ? _a : (field.hidden = false);
            (_b = field.hasError) !== null && _b !== void 0 ? _b : (field.hasError = computed(() => {
                return is.not.empty(field.fieldError);
            }));
        });
        this.canSubmit = computed(() => {
            let results = [];
            Object.keys(this.state).forEach((_) => {
                const field = this.state[_];
                const value = field.value;
                if (is.empty(field.fieldError)) {
                    if (field.rule.contains('required') && is.empty(value)) {
                        results.add(false);
                        return;
                    }
                    results.add(true);
                    return;
                }
                results.add(false);
                return;
            });
            return results.every((_) => _);
        });
        this.request = option.request;
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
            result[_] = field.value;
        });
        console.log('payload:', result);
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
        //console.log('notifyOnInput:', vresult,  dataKey, this.getFieldByDataKey(dataKey).value, 'extraArg:', extraArg);
        const link = this.linkages.firstWhere((_) => _.slave.dataKey === dataKey);
        if (is.not.undefined(link)) {
            this.validate(link.master.dataKey, extraArg);
        }
    }
    cancel() {
        var _a, _b;
        const self = this;
        console.log('cancel');
        (_b = (_a = this.config).onCancel) === null || _b === void 0 ? void 0 : _b.call(_a, self);
        // this.config.onClose(self);
    }
    async submit() {
        var _a, _b;
        try {
            this.config.onBeforeSubmit();
            const self = this;
            const result = await this.request(this.getPayload());
            const destroyForm = (_b = (_a = this.config).onSubmit) === null || _b === void 0 ? void 0 : _b.call(_a, result, self);
            this.config.onAfterSubmit();
            // fixme: login時這報錯
            if (destroyForm) {
                try {
                    this.config.onClose(self);
                }
                catch (e) {
                }
            }
            return result;
        }
        catch (e) {
            console.error(e);
            this.config.onCatchSubmit(e);
            throw e;
        }
        return Promise.resolve(undefined);
    }
    validate(dataKey, extraArg) {
        const field = this.getFieldByDataKey(dataKey);
        const context = this.getContext(field.name);
        const errors = [];
        (field.rule.split('|')).forEach((element) => {
            const ruleHandler = this.rules[element];
            assert(is.initialized(ruleHandler), `${assertMsg.propertyNotInitializedCorrectly}: rule: ${element}`);
            const passed = ruleHandler(context, field.value, extraArg);
            console.log("rule:", element, passed);
            if (passed) {
                //errors.clear();
            }
            else {
                const error = (is.string(this.messages[element])
                    ? this.messages[element]
                    : this.messages[element].value);
                try {
                    assert(is.not.undefined(error), `validation error message for rule:${element} not specified`);
                    errors.add(error);
                }
                catch (e) {
                    console.log("this.message: ", this.messages);
                    throw e;
                }
            }
        });
        const noError = is.empty(errors);
        if (noError) {
            // console.log('noError'.blue);
            field.fieldError = "";
        }
        else {
            if (context.displayOption.showMultipleErrors) {
                field.fieldError = errors.join('\n');
                // console.log('multiple errors'.brightBlue, errors.join('\n'));
            }
            else {
                field.fieldError = errors.first;
                // console.log('one error'.brightBlue, errors.first);
            }
        }
        // console.log("fieldError:", field.fieldError);
        return noError;
    }
    validateAll() {
        const results = this.getFields().map((_) => {
            return this.validate(_.dataKey);
        });
        return results.every((_) => _);
    }
}
//# sourceMappingURL=baseFormImpl.js.map