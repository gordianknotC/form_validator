import { BaseFormModel } from "./baseModelImpl";
import { Optional } from "~/base/types/commonTypes";
import { DisplayOption, IBaseFormContext } from "~/base/types/contextTypes";
import { FormState, FormValue, FormKey, FormValuesByName } from "../types/formTYpes";
import { UDRule } from "~/base/types/validatorTypes";
/**
 *
 *      C O N T E X T
 *
 * */
export declare class BaseFormContext<T, E, V> implements IBaseFormContext<T, E, V> {
    model: BaseFormModel<T, E, V>;
    fieldName: string;
    payloadKey: FormKey<T, E, V>;
    ruleChain: UDRule<V, T & E>;
    displayOption: DisplayOption;
    constructor(model: BaseFormModel<T, E, V>, fieldName: string, payloadKey: FormKey<T, E, V>, ruleChain: UDRule<V, T & E>);
    get value(): FormValue<T, E, V>;
    set value(val: FormValue<T, E, V>);
    getFormValues(): FormValuesByName<T, E, V>;
    getFormState(): FormState<T, E, V>;
    getLinkedFieldName(validatorIdent: keyof V): Optional<string>;
}
