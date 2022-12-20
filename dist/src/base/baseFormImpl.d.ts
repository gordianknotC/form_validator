import { Optional, VForm } from "@/base/baseFormTypes";
import TDisplayOption = VForm.DisplayOption;
import TFormMessages = VForm.ValidationMessages;
import TFormValuesByName = VForm.FormValuesByName;
import TFormField = VForm.FormField;
import TFormState = VForm.FormState;
import TFormValue = VForm.FormValue;
import TFormKey = VForm.FormKey;
import TFormPayload = VForm.FormPayload;
import TFormOption = VForm.FormOption;
import TFormExt = VForm.FormExt;
import { Ref, UnwrapRef, ComputedRef, ArrayDelegate } from "@gdknot/frontend_common";
/** #### 表單當前狀態 */
export declare enum EFormStage {
    loading = 0,
    ready = 1
}
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
export declare class BaseFormModel<T, E, V> implements VForm.IBaseFormModel<T, E, V> {
    validators: VForm.InternalValidators<string>;
    messages: TFormMessages<T, E>;
    config: TFormExt<T, E, V>;
    /** 代表表單的二個狀態，loading/ready，用來區分表單是否正和遠端請求資料 */
    stage: Ref<EFormStage>;
    /** @deprecated @notImplemented 遠端錯誤 */
    private remoteErrors;
    state: UnwrapRef<TFormState<T, E, V>>;
    /**@deprecated @notImplemented @private 初始遠端錯誤 */
    private initialRemoteErrors;
    private initialState;
    linkages: ArrayDelegate<VForm.Link<T, E, V>>;
    constructor(validators: VForm.InternalValidators<string>, state: TFormState<T, E, V>, messages: TFormMessages<T, E>, config: TFormExt<T, E, V>);
    private payloadKeys;
    getPayloadKeys(): ArrayDelegate<TFormKey<T, E, V>>;
    private formFields;
    getFields(): ArrayDelegate<TFormField<T, E, V>>;
    private identifiers;
    getIdentifiers(): string[];
    getValueByPayloadKey(payloadKey: TFormKey<T, E, V>): TFormValue<T, E, V>;
    getValueByName(name: string): Optional<TFormValue<T, E, V>>;
    getFieldByPayloadKey(payloadKey: TFormKey<T, E, V>): TFormField<T, E, V>;
    getFieldByFieldName(fieldName: string): TFormField<T, E, V>;
    clearRemoteErrors(): void;
    addRemoteErrors(errors: Partial<VForm.RemoteErrors<T, E, V>>): void;
    resetInitialState(): void;
    private asPayload;
    resetState(payload?: TFormPayload<T, E, V>): void;
    linkFields(option: VForm.Link<T, E, V>): void;
}
/**
 *
 *      C O N T E X T
 *
 * */
export declare class BaseFormContext<T, E, V> implements VForm.IBaseFormContext<T, E, V> {
    model: BaseFormModel<T, E, V>;
    name: string;
    payloadKey: TFormKey<T, E, V>;
    ruleChain: ArrayDelegate<VForm.InternalValidator<V>>;
    displayOption: TDisplayOption;
    constructor(model: BaseFormModel<T, E, V>, name: string, payloadKey: TFormKey<T, E, V>, ruleChain: ArrayDelegate<VForm.InternalValidator<V>>);
    get value(): TFormValue<T, E, V>;
    set value(val: TFormValue<T, E, V>);
    getFormValues(): TFormValuesByName<T, E, V>;
    getFormState(): TFormState<T, E, V>;
    getLinkedFieldName(ident: keyof V): Optional<string>;
}
/**
 *
 *        B A S E   F O R M
 *
 *  @see {@link BaseFormModel}
 *  @see {@link VForm.IBaseFormCtrl}
 *  @see VForm.IBaseEventHandler}
 * */
export declare abstract class BaseFormImpl<T, E, V> extends BaseFormModel<T, E, V> implements VForm.IBaseFormCtrl<T, E, V>, VForm.IBaseEventHandler<T, E, V> {
    canSubmit: ComputedRef<boolean>;
    request: (...args: any[]) => any;
    resend: (...args: any[]) => any;
    protected constructor(option: TFormOption<T, E, V>);
    private cachedContext;
    getContext(fieldName: string): VForm.IBaseFormContext<T, E, V>;
    getPayload(): Record<TFormKey<T, E, V>, any>;
    notifyRectifyingExistingErrors(): void;
    notifyLeavingFocus(payloadKey: TFormKey<T, E, V>): void;
    notifyReFocus(payloadKey: TFormKey<T, E, V>): void;
    notifyOnInput(payloadKey: TFormKey<T, E, V>, extraArg?: any): void;
    cancel(): void;
    submit(): Promise<any>;
    validate(payloadKey: TFormKey<T, E, V>, extraArg?: any): boolean;
    validateAll(): boolean;
}
