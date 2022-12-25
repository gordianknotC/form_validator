"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFormModel = void 0;
const frontend_common_1 = require("@gdknot/frontend_common");
const modelTypes_1 = require("~/base/types/modelTypes");
/**
 *
 *      M O D E L
 *
 * {@inheritDoc IBaseFormModel}
 * @see {@link IBaseFormModel}
 * @typeParam T -
 * @typeParam E -
 *
 * */
class BaseFormModel {
    constructor(validators, state, messages, config) {
        this.validators = validators;
        this.messages = messages;
        this.config = config;
        /** 代表表單的二個狀態，loading/ready，用來區分表單是否正和遠端請求資料 */
        this.stage = (0, frontend_common_1.ref)(modelTypes_1.EFormStage.ready);
        this.initialState = { ...state };
        Object.keys(this.initialState).forEach((element) => {
            //@ts-ignore
            this.initialState[element] = { ...state[element] };
        });
        this.state = (0, frontend_common_1.reactive)(state);
        this.linkages = (0, frontend_common_1.Arr)([]);
        this.payloadKeys = (0, frontend_common_1.Arr)(Object.keys(this.state));
        this.identifiers = this.payloadKeys.map((dataKey) => {
            try {
                const field = this.state[dataKey];
                field.fieldType ?? (field.fieldType = "text");
                this.state[dataKey] = (0, frontend_common_1.reactive)(field);
                return field.name;
            }
            catch (e) {
                throw `${e}\n
        dataKey: ${String(dataKey)}, keys in state: ${Object.keys(state)}\n
        filed: ${state[dataKey]}`;
            }
        });
        let remoteErrors;
        remoteErrors ?? (remoteErrors = {});
        Object.keys(this.state).forEach((key) => {
            remoteErrors[key] = undefined;
        });
        remoteErrors.unCategorizedError = undefined;
        this.initialRemoteErrors = remoteErrors;
        this.remoteErrors = (0, frontend_common_1.reactive)(remoteErrors);
    }
    getPayloadKeys() {
        return (this.payloadKeys ?? (this.payloadKeys = (0, frontend_common_1.Arr)(Object.keys(this.state))));
    }
    getFields() {
        return (this.formFields ?? (this.formFields = (0, frontend_common_1.Arr)(this.getPayloadKeys().map((_) => {
            return this.state[_];
        }))));
    }
    getIdentifiers() {
        return (this.identifiers ?? (this.identifiers = this.getPayloadKeys().map((fieldName) => {
            const field = this.state[fieldName];
            return field.name;
        })));
    }
    //@ts-ignore //todo: 不解？ 
    getValueByPayloadKey(payloadKey) {
        return this.state[payloadKey].value;
    }
    getValueByName(name) {
        return this.getFields().firstWhere((_) => _.name == name)
            ?.value;
    }
    getFieldByPayloadKey(payloadKey) {
        const field = this.getFields().firstWhere((_) => _.payloadKey == payloadKey);
        (0, frontend_common_1.assert)(frontend_common_1.is.initialized(field), `${frontend_common_1.assertMsg.propertyNotInitializedCorrectly}, payloadKey: ${String(payloadKey)}`);
        return field;
    }
    getFieldByFieldName(fieldName) {
        const field = this.getFields().firstWhere((_) => _.name == fieldName);
        (0, frontend_common_1.assert)(frontend_common_1.is.initialized(field), `${frontend_common_1.assertMsg.propertyNotInitializedCorrectly}, name: ${fieldName}`);
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
            if (frontend_common_1.is.initialized(initialState[el])) {
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
            if (frontend_common_1.is.initialized(state[el])) {
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
exports.BaseFormModel = BaseFormModel;
//# sourceMappingURL=baseModelImpl.js.map