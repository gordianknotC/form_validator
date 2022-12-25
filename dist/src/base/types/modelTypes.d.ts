import { ComputedRef, UnwrapRef } from "@gdknot/frontend_common";
import { Optional } from "./commonTypes";
import { IBaseFormContext } from "./contextTypes";
import { Link, FormState, RemoteErrors, FormExt, FormKey, FormField, FormValue, FormPayload } from "./formTYpes";
import { InternalValidators, ValidationMessages } from "./validatorTypes";
/** #### 表單當前狀態 */
export declare enum EFormStage {
    loading = 0,
    ready = 1
}
/**
 *  #### 用來存取 BaseFormImpl 資料層
 * @typeParam T - 欄位名集合
 * @typeParam E - 欄位名集合，用來擴展用，可以是空物件
 * @typeParam V - validators名集合
 * */
export declare abstract class IBaseFormModel<T, E, V> {
    /** 儲存欄位 master/slave連結關係
     * 用於 {@link linkFields}, 型別為 Link[] {@link Link}
     * @example
     * ```js
     * const linkage = [{master: {payloadKey: ..., name: ...}, slave: {...}}]
     * ```
     */
    abstract linkages: Link<T, E, V>[];
    /** 表單初始狀態，提供重設表單時的來源 */
    abstract initialState: FormState<T, E, V>;
    /** 表單狀態 @see {@link FormState} */
    abstract state: UnwrapRef<FormState<T, E, V>>;
    /** remote errors 別於 {@link FormField.fieldError} 為前台表單錯誤,
     * @deprecated @notImplemented
     * */
    abstract remoteErrors: UnwrapRef<RemoteErrors<T, E, V>>;
    /** Form 所引用的 validation rules
     * @see {@link InternalValidators}
     */
    abstract validators: InternalValidators<V>;
    /** Form 定義驗證規則發生錯誤時的信息 */
    abstract messages: ValidationMessages<V>;
    /** 使用者表單擴展定義 */
    abstract config: FormExt<T, E, V>;
    /** 取得表單所有欄位 payloadKeys
     * @see {@link FormKey}
     */
    abstract getPayloadKeys(): FormKey<T, E, V>[];
    /** 取得表單所有欄位名稱 */
    abstract getIdentifiers(): string[];
    /** 取得表單所有欄位
     * @see {@link FormField}
     */
    abstract getFields(): FormField<T, E, V>[];
    /** get FormField by payloadKey*/
    abstract getFieldByPayloadKey(payloadKey: FormKey<T, E, V>): FormField<T, E, V>;
    /** get FormField by field name*/
    abstract getFieldByFieldName(fieldName: string): FormField<T, E, V>;
    /** get FormValue by payloadKey*/
    abstract getValueByPayloadKey(payloadKey: FormKey<T, E, V>): FormValue<T, E, V>;
    /** 依欄位名取得該欄位值 (value) */
    abstract getValueByName(name: string): Optional<FormValue<T, E, V>>;
    abstract clearRemoteErrors(): void;
    abstract addRemoteErrors(errors: Partial<RemoteErrors<T, E, V>>): void;
    /** 重置初始狀態 */
    abstract resetInitialState(): void;
    /** reset into initialState or specific state, 當值為空時，重設為初始資料
     *  當值為非空，重設為所提供皫值
     *  @param state 重設state
     *  */
    abstract resetState(state?: FormPayload<T, E, V>): void;
    /** 對欄位進行彼此連結，於自定義 validator 呼叫，使 validator 階段能夠與被連結者檢查，
     * 連結者為 master, 被連結者為 slave
     */
    abstract linkFields(option: Link<T, E, V>): void;
}
/**
 *  #### 實作 BaseFormImpl 控制項
 *
 * */
export declare abstract class IBaseFormCtrl<T, E, V> {
    /** 判斷當前 submit 按鍵是否可按，當表單有錯誤時為不可按
     * 型別為 {@link ComputedRef}，於內部追蹤表單狀態的錯誤
     * 有錯時 canSubmit 為 false，無錯時為 true */
    abstract canSubmit: ComputedRef<boolean>;
    /** 取消表單送出，可用於 ui - onClick cancel button */
    abstract cancel(): void;
    /** 定義用來返回表單送出時生成的payload */
    abstract getPayload(): Record<FormKey<T, E, V>, any>;
    /** 於內部送出表單時呼叫 */
    abstract request: (...args: any[]) => Promise<any>;
    /** @notImplemented 於內部送出表單時呼叫 */
    abstract resend: (...args: any[]) => Promise<any>;
    /** 用於ui 使用者送出表單
     * 表單送出前會走以下流程
     * - {@link FormConfig.onBeforeSubmit}
     * - {@link EFormStage} 設為 loading
     * - {@link request} 取得遠端結果
     * - {@link FormConfig.onSubmit} 取得使用者回傳是否要 destroy 表單
     * - {@link EFormStage} 設為 ready
     * - {@link FormConfig.onAfterSubmit}
     * - {@link FormConfig.onClose} (如果使用者於 submit 回傳要 destroy 表單)
     * - {@link FormConfig.onCatchSubmit} 如果過程中有錯誤
     */
    abstract submit(): Promise<any>;
    /** 依 field name 取得當前表單 context
     * @see {@link IBaseFormContext}
     */
    abstract getContext(fieldName: string): IBaseFormContext<T, E, V>;
    /** 依 payload schema key 驗證表單
     * @return 布林，判斷是否「無錯誤」
     */
    abstract validate(payloadKey: FormKey<T, E, V>, extraArg?: any): boolean;
    abstract validateAll(): boolean;
}
export declare abstract class IBaseFormCtrlExt<T, E> {
    abstract apiGet(...args: any[]): Promise<any>;
    abstract onCreate(): void;
    abstract afterSubmit(): Promise<any>;
}
/**
 *
 *  #### 用來實作 html 車件與 IBaseForm 互動的界面
 *  @method {@link notifyLeavingFocus}
 *  @method {@link notifyReFocus}
 *  @method {@link notifyOnInput}
 *  以上三者提供 input element 事件輸入界面，輸入後進行表單驗證及狀態更新
 *
 * */
export declare abstract class IBaseEventHandler<T, E, V> {
    /** 當 ui 層unfocus 時，應呼叫本方法，由ui層輸入input事件
     * @param payloadKey - 欄位 payload key
     * @example
     * ```ts
     *  form.notifyLeavingFocus("username");
     * ```
     */
    abstract notifyLeavingFocus(payloadKey: FormKey<T, E, V>): void;
    /** 當 ui 層 focus 時，應呼叫本方法，由ui層輸入input事件
     * @param payloadKey - 欄位 payload key
     * @example
     * ```ts
     *  form.notifyReFocus("username");
     * ```
     */
    abstract notifyReFocus(payloadKey: FormKey<T, E, V>): void;
    /** 當 ui 層輸入字元時，應呼叫本方法，由ui層輸入input事件
     * @param payloadKey - 欄位 payload key
     * @param extraArg - 對應該欄位所輸入的資料
     * @example
     * ```ts
     *  form.notifyOnInput("username", "HelloKitty", "optional information...");
     * ```
     */
    abstract notifyOnInput(payloadKey: FormKey<T, E, V>, extraArg?: any): void;
    /** @notImplemented 當表單有錯誤時, 重新驗證／更新目前的錯誤 */
    abstract notifyRectifyingExistingErrors(): void;
}
