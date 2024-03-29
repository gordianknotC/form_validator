import { Optional } from "./commonTypes";
import { FormKey, FormValue, FormValuesByName, FormState } from "./formTypes";
import { IBaseFormModel } from "./modelTypes";
import { UDRule } from "./validatorTypes";
/** #### 用於擴展欄位顯示選擇
 * */
export type DisplayOption = {
    /** 用來實作如 bail rule, 可顯示多重 validation errors*/
    showMultipleErrors: boolean;
};
/**
 *
 *  #### context object 於 rule definition 階段存取, 用來讀取當前表單資料
 * */
export declare abstract class IBaseFormContext<T, E, V> {
    /**
     * 可用來判斷 {@link DisplayOption.showMultipleErrors}
     * 用來實作如 bail 多重錯誤 rule
     * */
    abstract displayOption: DisplayOption;
    abstract model: IBaseFormModel<T, E, V>;
    abstract payloadKey: FormKey<T, E, V>;
    /** ruleChain */
    abstract ruleChain: UDRule<V, T & E>;
    /** 取得當前 field name*/
    abstract fieldName: string;
    /** 取得當前 field 的值*/
    abstract value: FormValue<T, E, V>;
    /** 取得所有旳 formValue 並以 field name 作為 index key*/
    abstract getFormValues(): FormValuesByName<T, E, V>;
    /** 取得當前 formState */
    abstract getFormState(): FormState<T, E, V>;
    /** 取得連結欄位
     * @param validatorIdent - 先前所定義的 validator identity
    */
    abstract getLinkedFieldName(validatorIdent?: keyof V): Optional<string>;
}
