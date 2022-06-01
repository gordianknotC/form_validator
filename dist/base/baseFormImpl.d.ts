import { ComputedRef, Ref, UnwrapRef } from "vue";
import { TOptional, VForm } from "../base/vformTypes";
import TRemoteErrors = VForm.TRemoteErrors;
import TDisplayOption = VForm.TDisplayOption;
import TFormMessages = VForm.TFormMessages;
import TFormValuesByName = VForm.TFormValuesByName;
import TFormField = VForm.TFormField;
import TFormState = VForm.TFormState;
import TFormValue = VForm.TFormValue;
import TFormRules = VForm.TFormRules;
import TFormKey = VForm.TFormKey;
import TFormPayload = VForm.TFormPayload;
import TFormOption = VForm.TFormOption;
import TFormExt = VForm.TFormExt;
export declare enum ECompStage {
    loading = 0,
    ready = 1
}
/**
 *
 *      M O D E L
 *
 * */
export declare class BaseFormModel<T, E> implements VForm.IBaseFormModel<T, E> {
    rules: TFormRules;
    messages: TFormMessages;
    config: TFormExt<T, E>;
    stage: Ref<ECompStage>;
    remoteErrors: UnwrapRef<TRemoteErrors<T, E>>;
    state: UnwrapRef<TFormState<T, E>>;
    private initialRemoteErrors;
    initialState: TFormState<T, E>;
    linkages: VForm.TLink<T, E>[];
    constructor(rules: TFormRules, state: TFormState<T, E>, messages: TFormMessages, config: TFormExt<T, E>);
    private dataKeys;
    getDataKeys(): (TFormKey<T, E>)[];
    private formFields;
    getFields(): TFormField<T, E>[];
    private identifiers;
    getIdentifiers(): string[];
    getValueByDataKey(dataKey: TFormKey<T, E>): TFormValue<T, E>;
    getValueByName(name: string): TOptional<TFormValue<T, E>>;
    getFieldByDataKey(dataKey: TFormKey<T, E>): TFormField<T, E>;
    getFieldByFieldName(fieldName: string): TFormField<T, E>;
    clearRemoteErrors(): void;
    addRemoteErrors(errors: Partial<VForm.TRemoteErrors<T, E>>): void;
    resetInitialState(): void;
    private asPayload;
    resetState(payload?: TFormPayload<T, E>): void;
    linkFields(option: VForm.TLink<T, E>): void;
}
/**
 *
 *      C O N T E X T
 *
 * */
export declare class BaseFormContext<T, E> implements VForm.IBaseFormContext<T, E> {
    model: BaseFormModel<T, E>;
    name: string;
    dataKey: TFormKey<T, E>;
    displayOption: TDisplayOption;
    constructor(model: BaseFormModel<T, E>, name: string, dataKey: TFormKey<T, E>);
    get value(): TFormValue<T, E>;
    set value(val: TFormValue<T, E>);
    getFormValues(): TFormValuesByName<T, E>;
    getFormState(): TFormState<T, E>;
}
/**
 *
 *        B A S E   F O R M
 *
 * */
export declare abstract class BaseFormImpl<T, E> extends BaseFormModel<T, E> implements VForm.IBaseFormCtrl<T, E>, VForm.IBaseEventHandler<T, E> {
    canSubmit: ComputedRef<boolean>;
    request: (...args: any[]) => any;
    resend: (...args: any[]) => any;
    protected constructor(option: TFormOption<T, E>);
    private cachedContext;
    getContext(fieldName: string): VForm.IBaseFormContext<T, E>;
    getPayload(): Record<TFormKey<T, E>, any>;
    notifyRectifyingExistingErrors(): void;
    notifyLeavingFocus(dataKey: TFormKey<T, E>): void;
    notifyReFocus(dataKey: TFormKey<T, E>): void;
    notifyOnInput(dataKey: TFormKey<T, E>, extraArg?: any): void;
    cancel(): void;
    submit(): Promise<any>;
    validate(dataKey: TFormKey<T, E>, extraArg?: any): boolean;
    validateAll(): boolean;
}
