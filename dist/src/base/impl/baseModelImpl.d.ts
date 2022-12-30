import { Ref, UnwrapRef, ArrayDelegate } from "@gdknot/frontend_common";
import { Optional } from "~/base/types/commonTypes";
import { FormState, Link, FormValue, RemoteErrors, FormExt, FormField, FormKey, FormPayload } from "~/base/types/formTYpes";
import { IBaseFormModel, EFormStage } from "~/base/types/modelTypes";
import { UDValidationMsgOption } from "~/base/types/validatorTypes";
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
export declare class BaseFormModel<T, E, V> implements IBaseFormModel<T, E, V> {
    messages: UDValidationMsgOption<V>;
    config: FormExt<T, E, V>;
    /** 代表表單的二個狀態，loading/ready，用來區分表單是否正和遠端請求資料 */
    stage: Ref<EFormStage>;
    /** @deprecated @notImplemented 遠端錯誤 */
    private remoteErrors;
    state: UnwrapRef<FormState<T, E, V>>;
    /**@deprecated @notImplemented @private 初始遠端錯誤 */
    private initialRemoteErrors;
    linkages: ArrayDelegate<Link<T, E, V>>;
    constructor(state: FormState<T, E, V>, messages: UDValidationMsgOption<V>, config: FormExt<T, E, V>);
    private payloadKeys;
    getPayloadKeys(): ArrayDelegate<FormKey<T, E, V>>;
    private formFields;
    getFields(): ArrayDelegate<FormField<T, E, V>>;
    private identifiers;
    getIdentifiers(): string[];
    getValueByPayloadKey(payloadKey: FormKey<T, E, V>): FormValue<T, E, V>;
    getValueByName(name: string): Optional<FormValue<T, E, V>>;
    getFieldByPayloadKey(payloadKey: FormKey<T, E, V>): FormField<T, E, V>;
    getFieldByFieldName(fieldName: string): FormField<T, E, V>;
    clearRemoteErrors(): void;
    addRemoteErrors(errors: Partial<RemoteErrors<T, E, V>>): void;
    resetInitialState(): void;
    resetState(payload?: FormPayload<T, E, V>): void;
    link(option: Link<T, E, V>): void;
}
