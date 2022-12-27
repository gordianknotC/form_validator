import { ComputedRef } from "@gdknot/frontend_common";
import { BaseFormModel } from "./baseModelImpl";
import { IBaseFormContext } from "~/base/types/contextTypes";
import { FormKey, FormOption } from "~/base/types/formTYpes";
import { IBaseFormCtrl, IBaseEventHandler } from "~/base/types/modelTypes";
/**
 *
 *        B A S E   F O R M
 *
 *  @see {@link BaseFormModel}
 *  @see {@link IBaseFormCtrl}
 *  @see IBaseEventHandler
 * */
export declare abstract class BaseFormImpl<T, E, V> extends BaseFormModel<T, E, V> implements IBaseFormCtrl<T, E, V>, IBaseEventHandler<T, E, V> {
    canSubmit: ComputedRef<boolean>;
    request: (...args: any[]) => any;
    resend: (...args: any[]) => any;
    protected constructor(option: FormOption<T, E, V>);
    private cachedContext;
    getContext(fieldName: string): IBaseFormContext<T, E, V>;
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
    getPayload(): Record<FormKey<T, E, V>, any>;
    notifyRectifyingExistingErrors(): void;
    notifyLeavingFocus(payloadKey: FormKey<T, E, V>): void;
    notifyReFocus(payloadKey: FormKey<T, E, V>): void;
    notifyOnInput(payloadKey: FormKey<T, E, V>, extraArg?: any): void;
    inputValue(payloadKey: keyof T | keyof E, value: any): void;
    cancel(): void;
    submit(): Promise<any>;
    validate(payloadKey: FormKey<T, E, V>, extraArg?: any): boolean;
    validateAll(): boolean;
}
export declare function typed<T = any>(val: T): T;
