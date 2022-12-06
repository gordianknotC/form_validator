import { Optional, VForm } from "../../base/vformTypes";
import TRemoteErrors = VForm.RemoteErrors;
import TDisplayOption = VForm.DisplayOption;
import TFormMessages = VForm.ValidationMessages;
import TFormValuesByName = VForm.FormValuesByName;
import TFormField = VForm.FormField;
import TFormState = VForm.FormState;
import TFormValue = VForm.FormValue;
import TFormRules = VForm.ValidationRules;
import TFormKey = VForm.FormKey;
import TFormPayload = VForm.FormPayload;
import TFormOption = VForm.TFormOption;
import TFormExt = VForm.FormExt;
import { Ref, UnwrapRef, ComputedRef, ArrayDelegate } from "@gdknot/frontend_common";
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
    rules: TFormRules<string>;
    messages: TFormMessages;
    config: TFormExt<T, E>;
    stage: Ref<ECompStage>;
    remoteErrors: UnwrapRef<TRemoteErrors<T, E>>;
    state: UnwrapRef<TFormState<T, E>>;
    private initialRemoteErrors;
    initialState: TFormState<T, E>;
    linkages: ArrayDelegate<VForm.Link<T, E>>;
    constructor(rules: TFormRules<string>, state: TFormState<T, E>, messages: TFormMessages, config: TFormExt<T, E>);
    private dataKeys;
    getDataKeys(): ArrayDelegate<TFormKey<T, E>>;
    private formFields;
    getFields(): ArrayDelegate<TFormField<T, E>>;
    private identifiers;
    getIdentifiers(): string[];
    getValueByDataKey(dataKey: TFormKey<T, E>): TFormValue<T, E>;
    getValueByName(name: string): Optional<TFormValue<T, E>>;
    getFieldByDataKey(dataKey: TFormKey<T, E>): TFormField<T, E>;
    getFieldByFieldName(fieldName: string): TFormField<T, E>;
    clearRemoteErrors(): void;
    addRemoteErrors(errors: Partial<VForm.RemoteErrors<T, E>>): void;
    resetInitialState(): void;
    private asPayload;
    resetState(payload?: TFormPayload<T, E>): void;
    linkFields(option: VForm.Link<T, E>): void;
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
