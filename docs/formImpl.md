
---
<!--#-->

FormImpl 將 Validator / Rules / FormConfig 整合在一起，並提供一個接口，使ui 連接變的可行，這些接口包括：

- **改變 field 值**

  - 針對特定欄位設值
    - form.username.value = …
  - 表單重設值
    - form.resetState()

- **取得欄位錯誤**

  - form.username.hasError - boolean
  - form.username.fieldError - string

- **通知 input 事件發生**

  - form.notifyOnInput(payloadKey, …);

- **通知 focus 事件**

  - form.notifyReFocus()
  - form.notifyLeavingFocus()

- **手動驗證**

  - form .validateAll()
  - form.validate(payloadKey, extraArg)

- **表單是否有錯誤**

  - form.hasError

- **判斷表單是否可傳傳送**

  - form.canSubmit.value
  

當我們依以下方式定義出相關的全局設定後，便可以透過 **createFormModelOption** 創建 FormModel 所需要的設定：

- **[defineValidators]** -  定義驗證基本單元「驗證子」。
- **[defineValidationMsg]** - 定義「驗證子」發生錯誤時所顥示的「錯誤信息」。
- **[defineRules]** - 定義驗證規則，由許多「驗證子」溝成。
- **[defineFormConfig]** - 定義表單所需相關設定，包括注入以上三項定義。

## createFormModelOption

**型別定義**
```ts
/** {@inheritDoc UDFormOption}
 * 用來生成繼承自  {@link BaseFormImpl} 所需的 option
 * @see {@link createReactiveFormModel} 
 * @typeParam F - payload schema
 * @typeParam V - validators
 * @param option - @see {@link UDFormOption}
*/
export const createFormModelOption = function<F, V = any, R=any>(
  option: UDFormOption<F, V, R>
): InternalFormOption <F, F, V>
```

- __[UDFormOption][UDFormOption] - [source][s-UDFormOPtion]__
  ```ts
  /** {@inheritDoc FormOption} 
   * 用來生成繼承自  {@link BaseFormImpl} 所需的 option 
   * 文件繼承自 @see {@link InternalFormOption}
   * @see {@link createFormModelOption}
   * @param config - {@link UDFieldConfigs}
   * @param pickFields - 選擇該 form model 需要哪些對應的 schema
  */
  export interface UDFormOption<F, V, R> extends Omit<InternalFormOption<F, F, V>, "state"> {
    config: UDFieldConfigs<F, V> ,
    pickFields: (keyof (F & R))[],
  }
  ```
- __InternalFormOption [source][s-InternalFormOption]__
  ```ts
  /** 
   * {@inheritDoc InternalFormConfig}
   * 文件繼承自 @see {@link InternalFormConfig}
   * @param validators - 全局所定義的 validator {@link defineValidators}
   * @param messages - 驗證錯誤所需的 message, {@link defineValidationMsg}
   * @param state - 由 {@link defineFieldConfigs} 所定義
   * @param postMethod - 定義向遠端請求的方法（submit)
   * @param resendPost - 
  */
  export interface InternalFormOption<T, E, V> extends InternalFormConfig<T, E, V> {
    validators: V;
    state: FormState<T, E, V>;
    messages: UDValidationMsgOption<V>;
    postMethod: (...args: any[]) => any;
    resendPost?: (...args: any[]) => any;
  } ;
  ```
- __InternalFormConfig [source][s-InternalFormConfig]__
  ```tsx
  export interface InternalFormConfig<T, E, V> {
    /** dialog 標題*/
    title?: ComputedRef<string>;
    /** 傳入 dialog 是否 visible, 類別為 reactive  */
    visible?: UnwrapRef<{ value: boolean }>;
    /** 設計於 dialog visible 時呼叫 */
    onVisibleChanged?: (model: IBaseFormModel<T, E, V>, visible: boolean) => void;
    /** 設計於 dialog visible 前呼叫 notImplemented: */
    // onBeforeVisible?: (model: IBaseFormModel<T, E, V>, extra: any) => void;
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
  ```

**example**

完整範例見 **formModel.test.setup.ts - [source][modelTest], scenarioFormModel.test.setup.ts - [source][scenarioModelTest]**

```tsx
type F = Fields;
type V = typeof validators;
type R = typeof fieldRules;

export const createUserFormModelOption = createFormModelOption<F, V, R>({
  config: fieldConfigs,
  pickFields: [
    "username",
    "password",
    "nickname",
    "confirm_password",
    "confirm_new_password",
    "new_password",
    "remark",
    "card_number",
    "card_number_A",
    "card_number_B"
  ],
  postMethod(...args) {
    return { succeed: true };
  },
  validators,
  messages: validationMessages,
  onNotifyRectifyingExistingErrors: function (): void {
    throw new Error("Function not implemented.");
  },
  onBeforeSubmit: function (): void {
    throw new Error("Function not implemented.");
  },
  onAfterSubmit: function (): void {
    throw new Error("Function not implemented.");
  },
  onCatchSubmit: function (e: any): void {
    throw new Error("Function not implemented.");
  }
});
```

## **UDFormOption**

以下為 UDFormOption | [source][s-UDFormOption] 的屬性

- **validators**
    
    或由 [defineValidators] | [source][s-defineValidators] 所定義的 validators, 型別為 InternalValidators | [source][s-InternalValidators]
    
- **messages**
    
    驗證錯誤所需的 message, [defineValidationMsg] | [source][s-defineValidationMsg]
    
- **postMethod**
    
    定義向遠端請求的方法（submit)
    
    **Example**
    
    ```tsx
     postMethod(payload){ return apiService.createUser(payload); }
    ```
    
- **onNotifyRectifyingExistingErrors**
- **onBeforeSubmit**
    
     submit | [source][s-submit] 後, onSubmit 前呼叫
    
- **onAfterSubmit**
    
     submit | [source][s-submit]  後 ／ onSubmit 後呼叫
    
- **onCatchSubmit**
    
     submit | [source][s-submit]  偵錯呼叫
    
- **config**
    
    由 [defineFormConfig] | [source][s-defineFormConfig] 所生成的 UDFieldConfigs | [source][s-UDFieldConfigs]
    
- **pickFields**
    
    選擇該 form model 需要哪些對應的 payload schema
    
    **example**
    
    ```tsx
    type F = Fields;
    type V = typeof validators;
    type R = typeof fieldRules;
    export const createUserFormModelOption = createFormModelOption<F, V, R>({
    
    ```
    
    以上 type F = Fields 中，指的是我們於 App 中所定義的一切與表單有關的payload， 以一般應用為例，如 App 中有以下payload。
    
    ```tsx
    type UserLogin = {username:string, password: string}
    type UserResetPwd = {password: string, new_password: string, confirm_new_password: string}
    
    ```
    
    則我們於 App 中所需所有與表單有關的 payload type F 則為
    
    ```tsx
    type Fields = UserLogin & UserResetPwd;
    type F = Fields
    
    ```
    
    而不同的表單有不同的 payload 定義，所以我們需要㨂選當前表單所需要的 payload, 這就是 pickFields 的作用，用來㨂選當前 Form 所需要的欄位。
    
- `**Optional`resendPost**
    
    重新送出 -Not Implemented
    
- `**Optional`title**
    
    用於 dialog ui 中的標題
    
- `**Optional`visible**
    
    visible?: {    value: *boolean*;}
    
    用來控制 dialog 是否 visible, 類別為 reactive
    
    **Example**
    
    ```tsx
    const createMerchantModel = new CreateMerchantForm({
       visible: toRef(dialogHandler, 'createDialog'),
       onSubmit(response, model){
         reRender();
         return true;
       }
     })
    ```
    
- `**Optional`onVisibleChanged**
    
    設計於 dialog visible 時呼叫
    
- `**Optional`onClose**
    
    cancel 及 submit | [source][s-submit]  後呼叫, 用於 dialog form ui
    
- `**Optional`onCancel**
    
    cancel | [source][s-cancel] 後呼叫
    
- `**Optional`onSubmit**
    
    用於ui 使用者送出表單 submit | [source][s-submit] 後呼叫
    

## 創建 FormImpl

**創建 FromImpl 所需要的設定**

```tsx
type F = Fields;
type V = typeof validators;
type R = typeof fieldRules;

export const createUserFormModelOption = createFormModelOption<F, V, R>({
  config: fieldConfigs,
  pickFields: [
    "username",
    "password",
    "nickname",
    "confirm_password",
    "confirm_new_password",
    "new_password",
    "remark",
    "card_number",
    "card_number_A",
    "card_number_B"
  ],
  postMethod(payload) {
    return apiService.createUser(payload);
  },
  validators,
  messages: validationMessages,
  onNotifyRectifyingExistingErrors: function (): void {
    throw new Error("Function not implemented.");
  },
  onBeforeSubmit: function (): void {
    throw new Error("Function not implemented.");
  },
  onAfterSubmit: function (): void {
    throw new Error("Function not implemented.");
  },
  onCatchSubmit: function (e: any): void {
    throw new Error("Function not implemented.");
  }
});
```

### by extend BaseFormImpl（class based）

**example**

```tsx
export class CreateUserFormModel extends BaseFormImpl<F, F, V> {
  constructor(option: InternalFormOption<F, F, V>) {
    flattenInstance(super(option));
		// 改變 username 初始值
    this.state.username.value = "guest";
  }

  getPayload(): Record<FormKey<F, F, V>, any> {
    const result = super.getPayload();
    if (is.empty(result.remark)) {
      result.remark = null;
    }
    delete result.confirm_password;
    return result;
  }
}

export const userFormModel = new CreateUserFormModel(createUserFormModelOption);
```

### by createReactiveFormModel

**example**

```tsx
export const userFormModel = createReactiveFormModel({
  ...createUserFormModelOption,
  getPayload(_payload){
    const ret = _payload;
    if (is.empty(ret.remark)) {
      ret.remark = null;
    }
    delete ret.confirm_password;
    return ret;
  }
});
```
 
 