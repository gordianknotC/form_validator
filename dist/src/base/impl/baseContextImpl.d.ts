import { ArrayDelegate } from "@gdknot/frontend_common";
import { BaseFormModel } from "./baseModelImpl";
import { Optional } from "~/base/types/commonTypes";
import { DisplayOption, IBaseFormContext } from "~/base/types/contextTypes";
import { FormState, FormValue, FormKey, FormValuesByName } from "../types/formTYpes";
import { InternalValidator } from "~/base/types/validatorTypes";
/**
 *
 *      C O N T E X T
 *
 * */
export declare class BaseFormContext<T, E, V> implements IBaseFormContext<T, E, V> {
    model: BaseFormModel<T, E, V>;
    name: string;
    payloadKey: FormKey<T, E, V>;
    ruleChain: ArrayDelegate<InternalValidator<V>>;
    displayOption: DisplayOption;
    constructor(model: BaseFormModel<T, E, V>, name: string, payloadKey: FormKey<T, E, V>, ruleChain: ArrayDelegate<InternalValidator<V>>);
    get value(): FormValue<T, E, V>;
    set value(val: FormValue<T, E, V>);
    getFormValues(): FormValuesByName<T, E, V>;
    getFormState(): FormState<T, E, V>;
    getLinkedFieldName(validatorIdent: keyof V): Optional<string>;
}
