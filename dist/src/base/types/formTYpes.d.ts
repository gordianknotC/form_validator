import { ArrayDelegate, ComputedRef, UnwrapRef } from "@gdknot/frontend_common";
import { Optional } from "./commonTypes";
import { UDFieldConfigs } from "./configTypes";
import { IBaseFormContext } from "./contextTypes";
import { IBaseFormModel } from "./modelTypes";
import { UDValidationMessages, InternalValidator } from "./validatorTypes";
/** #### 代表欄位 payloadKey 型別F
   *  ---------------------
   *  @typeParam T 欄位主要 payload 型別
   *  @typeParam E 欄位次要 payload 型別，用於延伸擴展，可以是空物件
   * */
export type FormKey<T, E, V> = keyof (T & E);
/** #### 代表欄位 payloadKey 對應至 payload 相應值的型別
 *
 *  > 如 payload 為
 *
 *  ```typescript
 *    type TPayload = {username: string, id: number}
 *  ```
 *
 *  > 則 FormKey   為 'username' | 'id'
 *  >    FormValue 為 string | number
 *
 *  ---------------------
 *  @typeParam T 欄位主要 payload 型別
 *  @typeParam E 欄位次要 payload 型別，用於延伸擴展，可以是空物件
 * */
export type FormValue<T, E, V> = (T & E)[keyof (T & E)];
export type ErrorKey<T, E, V> = FormKey<T, E, V> | "unCategorizedError";
export type RemoteErrors<T, E, V> = Record<ErrorKey<T, E, V>, Optional<string>>;
export type FormValuesByName<T, E, V> = Record<string, FormValue<T, E, V>>;
/**
 * 文件繼承自 @see {@link InternalFormConfig}
 * {@inheritDoc InternalFormConfig}
*/
export interface InternalFormOption<T, E, V> extends InternalFormConfig<T, E, V> {
    /** 全局所定義的 validator, 或由 {@link defineValidators} 所定義的 validators, 型別為 {@link InternalValidators} */
    validators: V;
    /** 驗證錯誤所需的 message, {@link defineValidationMsg} */
    messages: UDValidationMessages<V>;
    /** 由 {@link defineFieldConfigs} 定義於，於內部轉換型別為 {@link FormState}*/
    state: FormState<T, E, V>;
    /** 定義向遠端請求的方法（submit)
     * @example
    ```ts
      postMethod(payload){
        return apiService.createUser(payload);
      }
    ```*/
    postMethod: (...args: any[]) => any;
    /** 重新送出 - @notImplemented */
    resendPost?: (...args: any[]) => any;
}
export type Link<T, E, V> = {
    master: {
        payloadKey: FormKey<T, E, V>;
        fieldName: string;
    };
    slave: {
        payloadKey: FormKey<T, E, V>;
        fieldName: string;
    };
};
/** {@inheritDoc InternalFormOption}
 * 用來生成繼承自  {@link BaseFormImpl} 所需的 option
 * 文件繼承自 @see {@link InternalFormOption}
 * @see {@link createFormModelOption}
*/
export interface UDFormOption<F, V, R> extends Omit<InternalFormOption<F, F, V>, "state"> {
    /** 由 {@link defineFieldConfigs} 所生成的 {@link UDFieldConfigs} */
    config: UDFieldConfigs<F, V>;
    /** 選擇該 form model 需要哪些對應的 payload schema
     * @example
    ```ts
    type F = Fields;
    type V = typeof validators;
    type R = typeof fieldRules;
    export const createUserFormModelOption = createFormModelOption<F, V, R>({
    ```
    以上 type F = Fields 中，指的是我們於 App 中所定義的一切與表單有關的payload，
    以一般應用為例，如 App 中有以下payload。
  
    ```ts
    type UserLogin = {username:string, password: string}
    type UserResetPwd = {password: string, new_password: string, confirm_new_password: string}
    ```
    則我們於 App 中所需所有與表單有關的 payload type F 則為
  
    ```ts
    type Fields = UserLogin & UserResetPwd;
    type F = Fields
    ```
    而不同的表單有不同的 payload 定義，所以我們需要㨂選當前表單所需要的 payload,
    這就是 pickFields 的作用，用來㨂選當前 Form 所需要的欄位。
    */
    pickFields: (keyof (F & R))[];
}
/**
 * 「表單欄位」所需的資料集合
 * @typeParam T 欄位主要 payload 型別
 * @typeParam E 欄位次要 payload 型別，用於延伸擴展，可以是空物件 // FIXME: 沒必要
 *
 * */
export type FormField<T, E, V> = {
    /** 代表該欄位 payload 所使用的 key，傳送至遠端的 payload 鍵名，
     * 同樣的 payload 鍵名可以有不同的欄位名稱：
     *
     * e.g.:
     * payloadKey:password 可能用於 userLogin / userRegister / userResetPassword
     * 這三種情境中，可以為這三種表單情境分別命名不同的欄位名，也可以視為同一個欄位名稱.*/
    payloadKey: FormKey<T, E, V>;
    /** 代表該欄位表單名稱，於 validation rule 階段, 可用於 成對 validation rule 的匹配，如
     *  > - **confirm**  規則中 password 匹配於 password_confirm,
     *  > - **notEqual** 規則中 newPassword 匹配於 newPassword_notEqual*/
    fieldName: string;
    defaultValue: FormValue<T, E, V>;
    /** 代表當前 input 欄位的值，也是表單最後上傳 payload 的值 */
    value: FormValue<T, E, V>;
    /** label 用, 包於 computed, 需考慮語系 */
    label: ComputedRef<string>;
    /** rule 驗證規則, 由驗證子集合構成 **/
    ruleChain: ArrayDelegate<InternalValidator<V, T & E>>;
    /** 欄位類型，給 UI 層作為 ui 層判斷用，此套件內部不處理欄位類型 */
    fieldType?: string;
    /** 欄位 placeholder, 需為 ComputedRef */
    placeholder: ComputedRef<string>;
    /** 用於非顯示用表單，如ID*/
    hidden?: boolean;
    /** 用於不可修改的表單，如某些希望顯示但不修改的欄位*/
    disabled?: boolean;
    /** @internal
     *  以字串顯示 form errors, 於內部生成
     *
     *  > 當 validation rules 沒有指定 bail 時，就算有多個規則錯誤
     *  > 只出現一筆 formError, 除非指定 bail, fieldError 才會顯示多筆錯誤
     *  > 當出現多筆錯誤時會以 "\n" line break symbol 連結錯誤字串
     * */
    fieldError?: string;
    /** @internal
     *  用於Validation 階段存於表單資料，於內部生成 */
    context?: IBaseFormContext<T, E, V>;
    hasError?: ComputedRef<boolean>;
};
/**
 *    #### BaseFormImpl config 設定，可用於擴展 BaseFormImpl
 *
 * */
export interface InternalFormConfig<T, E, V> {
    /** 用於 dialog ui 中的標題*/
    title?: ComputedRef<string>;
    /** 用來控制 dialog 是否 visible, 類別為 reactive
       > visible 可由 vue template script 傳入
       > 全局傳入也可以, 以下為 vue template 引入
       @example
       ```ts
           const createMerchantModel = new CreateMerchantForm({
              visible: toRef(dialogHandler, 'createDialog'),
              onSubmit(response, model){
                reRender();
                return true;
              }
            })
       ```
       > 全局引入的方式則為於 Class constructor 中 覆寫
     *  */
    visible?: UnwrapRef<{
        value: boolean;
    }>;
    /** 設計於 dialog visible 時呼叫 */
    onVisibleChanged?: (model: IBaseFormModel<T, E, V>, visible: boolean) => void;
    /** 設計於 dialog visible 前呼叫 notImplemented: */
    /** cancel / submit 後呼叫, 用於 dialog base form ui */
    onClose?: (model: IBaseFormModel<T, E, V>) => void;
    /** cancel {@link IBaseFormCtrl.cancel} 後呼叫 */
    onCancel?: (model: IBaseFormModel<T, E, V>) => void;
    /** 用於ui 使用者送出表單 {@link IBaseFormCtrl.submit} 後呼叫*/
    onSubmit?: (resp: any, model: IBaseFormModel<T, E, V>) => boolean;
    onNotifyRectifyingExistingErrors: () => void;
    /** submit {@link IBaseFormCtrl.submit} 後,  onSubmit 前呼叫 */
    onBeforeSubmit: () => void;
    /** submit {@link IBaseFormCtrl.submit} 後 ／ onSubmit 後呼叫 */
    onAfterSubmit: () => void;
    /** submit {@link IBaseFormCtrl.submit}  偵錯呼叫 */
    onCatchSubmit: (e: any) => void;
}
/**
 *   @internal 同 {@link InternalFormConfig}，用於內部使用
 * */
export interface FormExt<T, E, V> {
    title: ComputedRef<string>;
    visible: UnwrapRef<{
        value: boolean;
    }>;
    onVisibleChanged: (model: IBaseFormModel<T, E, V>, visible: boolean) => void;
    onClose: (model: IBaseFormModel<T, E, V>) => void;
    onCancel: (model: IBaseFormModel<T, E, V>) => void;
    /** return true for close, false for stay the same*/
    onSubmit: (resp: any, model: IBaseFormModel<T, E, V>) => boolean;
    onNotifyRectifyingExistingErrors: () => void;
    onBeforeSubmit: () => void;
    onAfterSubmit: () => void;
    onCatchSubmit: (e: any) => void;
}
/** #### 代表欄位 BaseFormImpl reactive state
 *
 *   > 該狀態為 由 {@link FormField} 轉為 {@link FormState}
 *
 *  ---------------------
 *  @typeParam T 欄位主要 payload 型別
 *  @typeParam E 欄位次要 payload 型別，用於延伸擴展，可以是空物件
 **/
export type FormState<T, E, V> = Record<FormKey<T, E, V>, FormField<T, E, V>>;
export type FormPayload<T, E, V> = Record<FormKey<T, E, V>, FormValue<T, E, V>>;
