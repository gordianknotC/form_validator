
---
<!--#-->

**型別**

```tsx
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
  ruleChain: InternalValidator<V, T & E>[];
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
```


#### 改變 field 值
- 改變當前值
  - field.value = ...
- 改變預設值
  - field.defaultValue = ...
#### 取得欄位錯誤
- field.hasError - boolean
- field.fieldError - string

#### 通知 ui 事件
- input
  - form.notifyOnInput(payloadKey, …);
    notifyOnInput 後於內部會進行該欄位的驗證
- focus
  - form.notifyReFocus()
  - form.notifyLeavingFocus()


