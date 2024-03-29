
import { injectFacade, _computed, _ref, _reactive, Ref, UnwrapRef, ComputedRef, is, assert, assertMsg, ArrayDelegate, ObjDelegate, Arr, flattenInstance  } from "@gdknot/frontend_common"
import { BaseFormModel } from "./baseModelImpl";
import { Optional } from "~/base/types/commonTypes";
import { DisplayOption, IBaseFormContext } from "~/base/types/contextTypes";
import { FormState, Link, FormValue, RemoteErrors, ErrorKey, FormExt, FormField, FormKey, InternalFormOption, FormPayload, FormValuesByName } from "../types/formTypes";
import { IBaseFormModel, IBaseFormCtrl, IBaseEventHandler } from "~/base/types/modelTypes";
import { InternalValidators, InternalValidator, UDRule } from "~/base/types/validatorTypes";



/**
 *
 *      C O N T E X T
 *
 * */
export class BaseFormContext <T, E, V> 
  implements 
  IBaseFormContext <T, E, V> 
{
  displayOption: DisplayOption;

  constructor(
    public model: BaseFormModel <T, E, V>,
    public fieldName: string,
    public payloadKey: FormKey <T, E, V>,
    public ruleChain: UDRule<V, T & E>
  ) {
    this.displayOption = { showMultipleErrors: false };
  }

  //@ts-ignore //todo: comment out ts-ignore 不解？ 
  get value(): FormValue <T, E, V> {
    return (this.model.state as FormState<T, E, V>)[this.payloadKey].value;
  }

  //@ts-ignore //todo: comment out ts-ignore 不解？ 
  set value(val: FormValue <T, E, V>) {
    (this.model.state as FormState<T, E, V>)[this.payloadKey].value = val;
  }

  getFormValues(): FormValuesByName <T, E, V> {
    type TF = FormField <T, E, V>;
    const self = this;
    return new Proxy<TF>({} as TF, {
      get: function (target, name: string) {
        const field = self.model.getFields().firstWhere((_) => _.fieldName == name);
        const initialized = is.initialized(field);
        assert(()=>initialized, `form key: ${name} not found`);
        return field!.value;
      },
    }) as any as FormValuesByName <T, E, V>;
  }

  getFormState(): FormState <T, E, V> {
    return this.model.state as FormState <T, E, V>;
  }

  getLinkedFieldName(validatorIdent: keyof V): Optional<string> {
    const validator = this.ruleChain.firstWhere((_)=>_.validatorName == validatorIdent);
    return validator?._linkedFieldName;
  }
}
 