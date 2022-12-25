import { ComputedRef, UnwrapRef } from "@gdknot/frontend_common";
import { Optional } from "./commonTypes";
import { IBaseFormContext } from "./contextTypes";
import { IBaseFormModel } from "./modelTypes";
import { ValidationMessages, InternalValidator } from "./validatorTypes";
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
export type FormOption<T, E, V> = {
    validators: V;
    state: FormState<T, E, V>;
    messages: ValidationMessages<V>;
    request: (...args: any[]) => any;
    resend?: (...args: any[]) => any;
} & FormConfig<T, E, V>;
export type Link<T, E, V> = {
    master: {
        payloadKey: FormKey<T, E, V>;
        name: string;
    };
    slave: {
        payloadKey: FormKey<T, E, V>;
        name: string;
    };
};
/**
 *    #### 設定{@link IBaseFormModel} 欄位資料, 可用於全局設定並於 BaseFormModel 實作設定中直接引用
 *
 *    -----------------------------
 *    #### 全局欄位設定，自定義設定格式
 *
 *    __example:__
 *    ```typescript
 *    const globalBaseFormState: FormState<Fields, TExtraFields> = {
 *      id: {
 *        payloadKey: 'id',
 *        name: 'id',
 *        value: 0,
 *        label: computed(()=>'') ,
 *        rule: '',
 *        placeholder: '',
 *        hidden: true,
 *      },
 *      username: {
 *        payloadKey: 'username',
 *        name: 'username',
 *        value: '',
 *        label: computed(()=>txt.username) ,
 *        rule: 'required|userLength|userPattern',
 *        placeholder: '',
 *      },
 *      ...
 *    }
 *    ```
 *
 *    > 之後有任何表單需要用到同樣的欄位，且表單 payload payloadKey 也一樣時
 *    > 便可直接引用
 *
 *    __example:__
 *    ```typescript
 *    export class CreateMerchantForm extends BaseFormImpl<T, E>
 *      {
 *     constructor(option?: Partial<FormOption<T, E>>) {
 *       super(_.extend(option ?? {}, {
 *         state: getBaseFormStatesByKeys([
 *           'username',
 *           'password',
 *           'confirm_password',
 *           'email',
 *           'nickname',
 *           'phone',
 *           'remark'
 *         ]),
 *         rules: baseFormRules,
 *         messages: GenCustomValidationMessages(facade.languageService),
 *         title: computed(()=> facade.languageService.txt.addMerchant),
 *       } as FormOption<T, E>));
 *       this.request = apiService.createNewMerchant;
 *     }
 *   }
 *   ```
 *
 *   > 直接於 getBaseFormStatesByKeys 方法指定欄位名稱即可
 *   > 相應㿝表單行為及 validation rule 會直接套上
 *
 *    ---------------------
 *    @typeParam T 欄位主要 payload 型別
 *    @typeParam E 欄位次要 payload 型別，用於延伸擴展，可以是空物件
 *
 * */
export type FormField<T, E, V> = {
    /** 代表該欄位 payload 所使用的 key*/
    payloadKey: FormKey<T, E, V>;
    /** 代表該欄位表單名稱，於 validation rule 階段, 可用於 成對 validation rule 的匹配，如
     *  > - **confirm**  規則中 password 匹配於 password_confirm,
     *  > - **notEqual** 規則中 newPassword 匹配於 newPassword_notEqual*/
    name: string;
    defaultValue: FormValue<T, E, V>;
    /** 代表當前 input 欄位的值，也是表單最後上傳 payload 的值 */
    value: FormValue<T, E, V>;
    /** label 用, 包於 computed, 需考慮語系 */
    label: ComputedRef<string>;
    /** rule 驗證規則,
     * todo: doc
     * */
    ruleChain: InternalValidator<V, T & E>[];
    fieldType?: string;
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
export interface FormConfig<T, E, V> {
    /** dialog 標題*/
    title?: ComputedRef<string>;
    /** 傳入 dialog 是否 visible, 類別為 reactive
     *
     *  > visible 可由 vue template script 傳入
     *  > 全局傳入也可以, 以下為 vue template 引入
     *
     *  __example__
     *  ```typescript
     *      const createMerchantModel = new CreateMerchantForm({
     *         visible: toRef(dialogHandler, 'createDialog'),
     *         onSubmit(response, model){
     *           reRender();
     *           return true;
     *         }
     *       })
     *  ```
     *  > 全局引入的方式則為於 Class constructor 中 覆寫
     *
     *  */
    visible?: UnwrapRef<{
        value: boolean;
    }>;
    /** 設計於 dialog visible 時呼叫 */
    onVisible?: (model: IBaseFormModel<T, E, V>, extra: any) => void;
    /** 設計於 dialog visible 前呼叫*/
    onBeforeVisible?: (model: IBaseFormModel<T, E, V>, extra: any) => void;
    /** cancel / submit 後呼叫 */
    onClose?: (model: IBaseFormModel<T, E, V>) => void;
    onCancel?: (model: IBaseFormModel<T, E, V>) => void;
    /** 用於ui 使用者送出表單 */
    onSubmit?: (resp: any, model: IBaseFormModel<T, E, V>) => boolean;
    onNotifyRectifyingExistingErrors: () => void;
    /** submit 前呼叫 */
    onBeforeSubmit: () => void;
    /** submit 後呼叫 */
    onAfterSubmit: () => void;
    /** submit 偵錯呼叫 */
    onCatchSubmit: (e: any) => void;
}
/**
 *   @internal 同 {@link FormConfig}，用於內部使用
 * */
export interface FormExt<T, E, V> {
    title: ComputedRef<string>;
    visible: UnwrapRef<{
        value: boolean;
    }>;
    onVisible: (model: IBaseFormModel<T, E, V>, extra: any) => void;
    onBeforeVisible: (model: IBaseFormModel<T, E, V>, extra: any) => void;
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
