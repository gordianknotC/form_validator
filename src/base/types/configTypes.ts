import { ArrayDelegate, ComputedRef, UnwrapRef } from "@gdknot/frontend_common";
import { FormField, FormValue } from "./formTYpes";
import { FieldRuleBuilder } from "./validatorTypes";


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
   * @see {@link FormField}
   * @example
   ```ts
  type TField = {
      email: string;
      password: string;
  }
  const fieldConfigs:DefinedFieldConfigs<TFields> = defineFieldConfigs<TFields, typeof fieldRules>(...);
  const field: FormField = fieldConfigs.email;
  * ```
  */
  export type UDFieldConfigs<F, V> = Record<keyof F, FormField<F, F, V>>;

  /**
    * 使用者自定義欄位設定
    * @typeParam F - 所有欄位 payload 型別聯集
    * @typeParam V - validators
    * @typeParam R - 使用者自定義 rules {@link UDFieldRules}
    * @see {@link defineFieldConfigs}
    */
  export type UDFieldDefineMethod<F, V, R> = (
    option: Pick<
      FormField<F, F, V>,
      "placeholder" | "hidden" | "disabled" | "label" | "fieldType" | "payloadKey"
    > & {
      fieldName: string;
      ruleBuilder: FieldRuleBuilder<R, V>;
      valueBuilder: () => FormValue<F, F, V>;
    }
  ) => FormField<F, F, V>;
 