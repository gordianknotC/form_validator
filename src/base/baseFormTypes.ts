import { ArrayDelegate, ComputedRef, UnwrapRef } from "@gdknot/frontend_common";
import { K } from "vitest/dist/types-1cf24598";

export type Optional<T> = T | null | undefined;

export namespace VForm {
  export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
    U[keyof U];

  /** #### 代表欄位 payloadKey 型別F
   *  ---------------------
   *  @typeParam T 欄位主要 payload 型別
   *  @typeParam E 欄位次要 payload 型別，用於延伸擴展，可以是空物件
   * */
  export type FormKey<T, E, V> = keyof T | keyof E;

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
  export type FormValue<T, E, V> = (T & E)[FormKey<T, E, V>];
  export type ErrorKey<T, E, V> = FormKey<T, E, V> | "unCategorizedError";
  export type RemoteErrors<T, E, V> = Record<
    ErrorKey<T, E, V>,
    Optional<string>
  >;
  export type FormValuesByName<T, E, V> = Record<string, FormValue<T, E, V>>;
  export type FormOption<T, E, V> = {
    validators: InternalValidators<T & E>;
    state: FormState<T, E, V>;
    messages: ValidationMessages<T, E>;
    request: (...args: any[]) => any;
    resend?: (...args: any[]) => any;
  } & FormConfig<T, E, V>;

  export type Link<T, E, V> = {
    master: { payloadKey: FormKey<T, E, V>; name: string };
    slave: { payloadKey: FormKey<T, E, V>; name: string };
  };

  /**
   *    #### 設定{@link VForm.IBaseFormModel} 欄位資料, 可用於全局設定並於 BaseFormModel 實作設定中直接引用
   *
   *    -----------------------------
   *    #### 全局欄位設定，自定義設定格式
   *
   *    __example:__
   *    ```typescript
   *    const globalBaseFormState: TFormState<Fields, TExtraFields> = {
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
   *     constructor(option?: Partial<TFormOption<T, E>>) {
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
   *       } as TFormOption<T, E>));
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
     *  > 只出現一筆 formError, 除非指定 bail, fieldError 才會顯示多筆錯誤*/
    fieldError?: string;
    /** @internal
     *  用於Validation 階段存於表單資料，於內部生成 */
    context?: IBaseFormContext<T, E, V>;
    hasError?: ComputedRef<boolean>;
  };

  ///     C O N F I G
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
    visible?: UnwrapRef<{ value: boolean }>;
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
   *   @internal 同 {@link VForm.FormConfig}，用於內部使用
   * */
  export interface FormExt<T, E, V> {
    title: ComputedRef<string>;
    visible: UnwrapRef<{ value: boolean }>;
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
   *   > 該狀態為 由 {@link VForm.FormField} 轉為 {@link VForm.FormState}
   *
   *  ---------------------
   *  @typeParam T 欄位主要 payload 型別
   *  @typeParam E 欄位次要 payload 型別，用於延伸擴展，可以是空物件
   **/
  export type FormState<T, E, V> = Record<FormKey<T, E, V>, FormField<T, E, V>>;

  export type FormPayload<T, E, V> = Record<
    FormKey<T, E, V>,
    FormValue<T, E, V>
  >;

  //
  //
  //      V A L I D A T O R S
  //
  /**
   *  #### validation rules 自定義設定格式
   * @typeParam V - validator keys
   * @typeParam F - payload schema for form fields
   *  __example:__
   *   ```typescript
   *   const baseFormRules = {
   *     [EBaseValidationRules.optional](ctx, ...args: any){
   *       return true;
   *     },
   *      [EBaseValidationRules.required](ctx, ...args: any){
   *       return v8n().not.empty().test(ctx.value);
   *     },
   *      [EBaseValidationRules.bail](ctx, ...args: any){
   *       ctx.displayOption.showMultipleErrors = true;
   *       return true;
   *     },
   *   }
   *  ```
   * */
  export type ValidatorHandler<V, F = any> = (
    ctx: IBaseFormContext<F, F, V>,
    ...args: any[]
  ) => boolean;

  /**
   * @typeParam V - return type
   * */
  export type InternalValidatorLinkHandler<V, F> = (
    linkField: string
  ) => InternalValidator<V, F>;

  /**
   * @typeParam V - object containing keys of all validators
   * @typeParam F - payload schema for form fields
   * */
  export type InternalValidator<V, F = any> = {
    handler: ValidatorHandler<V, F>;
    validatorName: keyof V;
    linkField?: InternalValidatorLinkHandler<V, F>;
    applyField?: InternalValidatorLinkHandler<V, F>;
    linkedFieldName?: keyof F;
    appliedFieldName?: keyof F;
  };
  /**
   * @typeParam V - object containing keys of all validators
   */
  export type InternalValidators<V> = Record<keyof V, InternalValidator<V>>;

  /** 用來定義驗證規則所對應的驗證訊息
   * 鍵為欄位名，值必須為 {@link ComputedRef}，用來追踪i18n狀態上的變化
   * @typeParam T - 欄位名集合
   * @typeParam E - 欄位名集合，用來擴展用，可以是空物件
   *
   */
  export type ValidationMessages<T, E> = Record<
    keyof (T & E),
    ComputedRef<keyof (T & E)>
  >;

  /**
   * @typeParam V - object containing keys of all validators
   * */
  export type UDValidatorLinkHandler<V = string> = (
    linkField?: string
  ) => string;

  export type UDValidator<V, F = any> = {
    handler: ValidatorHandler<V, F>;
  };



  //
  //
  //    F I E L D     R U L E S
  //
  //
  //
  /**
   * @typeParam V - object containing keys of all validators
   */
  export type UDValidators<V> = Record<
    keyof V,
    UDValidator<V>
  >;

  /**
   * @typeParam V - validators
   * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
   */
  export type UDFieldRuleConfig<R, V> = {
    ident: keyof R;
    rules: InternalValidator<V>[];
  };

  /**
   * @typeParam V - validators
   * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
   */
  export type UDFieldRules<R, V> = Record<
    keyof R,
    UDFieldRuleConfig<R, V> 
  >;

  export type FieldRuleBuilderReturnType<V> = InternalValidator<V>[];

  /**
   * 於使用者「自定義欄位設定」 {@link UDFieldConfigs}，用來將「證驗規則」對應至「欄位名稱」，回傳值為 {@link FieldRuleBuilderReturnType}
   * @typeParam V - validators
   * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
   * @see {@link UDFieldDefineMethod}
   * @see {@link defineFieldConfigs}
   */
  export type FieldRuleBuilder<R, V> = (
    rules: R
  ) => FieldRuleBuilderReturnType<V>;


  //
  //
  //    F I E L D       C O N F I G S
  //
  //
  //
  /** 
   * 使用者自定義欄位設定
   * @typeParam F - 所有欄位 payload 型別聯集
   * @typeParam V - object containing all validator keys
   * @see {@link defineFieldConfigs}
   * @see {@link VForm.FormField}
   * @example
   ```ts
  type TField = {
      email: string;
      password: string;
  }
  const fieldConfigs:DefinedFieldConfigs<TFields> = defineFieldConfigs<TFields, typeof fieldRules>(...);
  const field: VForm.FormField = fieldConfigs.email;
  * ```
  */
  export type UDFieldConfigs<F, V> = Record<keyof F, VForm.FormField<F, F, V>>;

  /**
    * 使用者自定義欄位設定
    * @typeParam F - 所有欄位 payload 型別聯集
    * @typeParam V - validators
    * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
    * @see {@link defineFieldConfigs}
    */
  export type UDFieldDefineMethod<F, V, R> = (
    option: Pick<
      VForm.FormField<F, F, V>,
      "placeholder" | "hidden" | "disabled" | "label" | "fieldType" | "payloadKey"
    > & {
      fieldName: string;
      ruleBuilder: FieldRuleBuilder<R, V>;
      valueBuilder: () => VForm.FormValue<F, F, V>;
    }
  ) => VForm.FormField<F, F, V>;
 

  /** #### 用於擴展欄位顯示選擇
   * */
  export type DisplayOption = {
    /** 用來實作如 bail rule, 可顯示多重 validation errors*/
    showMultipleErrors: boolean;
  };

  ///     C O N T E X T
  /**
   *
   *  #### context object 於 rule definition 階段存取, 用來讀取當前表單資料
   * */
  export abstract class IBaseFormContext<T, E, V> {
    /**
     * 可用來判斷 {@link VForm.DisplayOption.showMultipleErrors}
     * 用來實作如 bail 多重錯誤 rule
     * */
    abstract displayOption: DisplayOption;
    abstract model: IBaseFormModel<T, E, V>;
    abstract payloadKey: FormKey<T, E, V>;
    /** ruleChain */
    abstract ruleChain: ArrayDelegate<InternalValidator<V, T & E>>;
    /** 取得當前 field name*/
    abstract name: string;
    /** 取得當前 field 的值*/
    abstract value: FormValue<T, E, V>;
    /** 取得所有旳 formValue 並以 field name 作為 index key*/
    abstract getFormValues(): FormValuesByName<T, E, V>;
    /** 取得當前 formState */
    abstract getFormState(): FormState<T, E, V>;
    /** 取得連結欄位 */
    abstract getLinkedFieldName(ident: keyof V): Optional<string>;
  }

  ///   M O D E L
  /**
   *  #### 用來存取 BaseFormImpl 資料層
   * @typeParam T - 欄位名集合
   * @typeParam E - 欄位名集合，用來擴展用，可以是空物件
   * @typeParam V - validators名集合
   * */
  export abstract class IBaseFormModel<T, E, V> {
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
    abstract messages: ValidationMessages<T, E>;

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
    abstract getFieldByPayloadKey(
      payloadKey: FormKey<T, E, V>
    ): FormField<T, E, V>;

    /** get FormField by field name*/
    abstract getFieldByFieldName(fieldName: string): FormField<T, E, V>;

    /** get FormValue by payloadKey*/
    abstract getValueByPayloadKey(
      payloadKey: FormKey<T, E, V>
    ): FormValue<T, E, V>;

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

    // abstract hasLinked(fieldName: string): boolean;
  }

  //
  //    C O N T R O L L E R
  //
  /**
   *  #### 實作 BaseFormImpl 控制項
   *
   * */
  export abstract class IBaseFormCtrl<T, E, V> {
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

  export abstract class IBaseFormCtrlExt<T, E> {
    abstract apiGet(...args: any[]): Promise<any>;
    abstract onCreate(): void;
    abstract afterSubmit(): Promise<any>;
  }

  ///   E V E N T    H A N D L E R
  /**
   *
   *  #### 用來實作 html 車件與 IBaseForm 互動的界面
   *  @method {@link notifyLeavingFocus}
   *  @method {@link notifyReFocus}
   *  @method {@link notifyOnInput}
   *  以上三者提供 input element 事件輸入界面，輸入後進行表單驗證及狀態更新
   *
   * */
  export abstract class IBaseEventHandler<T, E, V> {
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
}
