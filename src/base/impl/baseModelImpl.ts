
import { injectFacade, computed, ref, reactive, Ref, UnwrapRef, ComputedRef, is, assert, assertMsg, ArrayDelegate, ObjDelegate, Arr, flattenInstance  } from "@gdknot/frontend_common"
import { Optional } from "~/base/types/commonTypes";
import { DisplayOption, IBaseFormContext } from "~/base/types/contextTypes";
import { FormState, Link, FormValue, RemoteErrors, ErrorKey, FormExt, FormField, FormKey, FormOption, FormPayload, FormValuesByName } from "~/base/types/formTYpes";
import { IBaseFormModel, IBaseFormCtrl, IBaseEventHandler, EFormStage } from "~/base/types/modelTypes";
import { UDValidationMessages } from "~/base/types/validatorTypes";

 

/**
 *
 *      M O D E L
 * 
 * {@inheritDoc IBaseFormModel}
 * @see {@link IBaseFormModel}
 * @typeParam T - 
 * @typeParam E - 
 * 
 * */
export class BaseFormModel<T, E, V> 
  implements 
  IBaseFormModel<T, E, V>
{
  /** 代表表單的二個狀態，loading/ready，用來區分表單是否正和遠端請求資料 */
  stage: Ref<EFormStage> = ref(EFormStage.ready);

  /** @deprecated @notImplemented 遠端錯誤 */
  private remoteErrors: UnwrapRef<RemoteErrors<T, E, V>>;
  
  state: UnwrapRef<FormState<T, E, V>>;
  
  /**@deprecated @notImplemented @private 初始遠端錯誤 */
  private initialRemoteErrors: RemoteErrors<T, E, V>;
  private initialState: FormState<T, E, V>;
  linkages: ArrayDelegate<Link<T, E, V>>;

  constructor(
    state: FormState<T, E, V>,
    public messages: UDValidationMessages<V>,
    public config: FormExt<T, E, V>
  ) {
    this.initialState = { ...state };
    Object.keys(this.initialState).forEach((element) => {
      //@ts-ignore
      this.initialState[element] = { ...state[element] };
    });
    
    this.state = reactive(state) as any;
    this.linkages = Arr([]);
    this.payloadKeys = Arr(Object.keys(this.state as FormState<T, E, V>) as any[]) as ArrayDelegate<(keyof (T & E))>;
    this.identifiers = this.payloadKeys.map((dataKey: FormKey<T, E, V>) => {
      try{
        const field = (this.state as FormState<T, E, V>)[dataKey];
        field.fieldType ??= "text";
        (this.state as FormState<T, E, V>)[dataKey] = reactive(field) as any;
        return field.name;
      }catch(e){
        throw `${e}\n
        dataKey: ${String(dataKey)}, keys in state: ${Object.keys(state)}\n
        filed: ${state[dataKey]}`;
      }
    });
    
    let remoteErrors: Optional<RemoteErrors<T, E, V>>;
    remoteErrors ??= {} as any;
    Object.keys(this.state as FormState<T, E, V>).forEach((key) => {
      remoteErrors![key as ErrorKey<T, E, V>] = undefined;
    });
    remoteErrors!.unCategorizedError = undefined;
    this.initialRemoteErrors = remoteErrors!;
    this.remoteErrors = reactive(remoteErrors!) as any;
  }

  private payloadKeys: Optional<ArrayDelegate<FormKey<T, E, V>>>;
  getPayloadKeys(): ArrayDelegate<FormKey<T, E, V>> {
    return (
        this.payloadKeys ??= Arr(Object.keys(
          this.state as FormState <T, E, V>
        )) as any as  ArrayDelegate<FormKey <T, E, V>> 
    );
  }

  private formFields: Optional<ArrayDelegate<FormField <T, E, V>>>;
  getFields(): ArrayDelegate<FormField <T, E, V>> {
     return (this.formFields ??= Arr(this.getPayloadKeys().map((_) => {
      return (this.state as FormState <T, E, V>)[_];
    })));
  }

  private identifiers: Optional<string[]>;
  getIdentifiers(): string[] {
    return (this.identifiers ??= this.getPayloadKeys().map((fieldName) => {
      const field = (this.state as FormState <T, E, V>)[fieldName];
      return field.name;
    }));
  }

  //@ts-ignore //todo: 不解？ 
  getValueByPayloadKey(payloadKey: FormKey <T, E, V>): FormValue <T, E, V> {
    return (this.state as FormState <T, E, V>)[payloadKey].value;
  }

  getValueByName(name: string): Optional<FormValue <T, E, V>> {
    return this.getFields().firstWhere((_) => _.name == name)
      ?.value as unknown as any;
  }

  getFieldByPayloadKey(payloadKey: FormKey <T, E, V>): FormField <T, E, V> {
    const field = this.getFields().firstWhere((_) => _.payloadKey == payloadKey);
    assert(
      is.initialized(field),
      `${assertMsg.propertyNotInitializedCorrectly}, payloadKey: ${String(payloadKey)}`
    );
    return field!;
  }

  getFieldByFieldName(fieldName: string): FormField <T, E, V> {
    const field = this.getFields().firstWhere((_) => _.name == fieldName);
    assert(
      is.initialized(field),
      `${assertMsg.propertyNotInitializedCorrectly}, name: ${fieldName}`
    );
    return field!;
  }

  clearRemoteErrors() {
    Object.keys(this.initialRemoteErrors).forEach((element) => {
      // @ts-ignore
      this.remoteErrors[element] = undefined;
    });
  }

  addRemoteErrors(errors: Partial<RemoteErrors <T, E, V>>) {
    Object.keys(errors).forEach((element) => {
      // @ts-ignore
      this.remoteErrors[element] = errors[element];
    });
  }

  resetInitialState() {
    const initialState = this.initialState as FormState <T, E, V>;
    const state = this.state as FormState <T, E, V>;
    Object.keys(state).forEach((element) => {
      const el = element as FormKey <T, E, V>;
      if (is.initialized(initialState[el])) {
        initialState[el].value = state[el].value as any as FormValue <T, E, V>;
      }
    });
  }

  private asPayload(state: FormState <T, E, V>): FormPayload <T, E, V> {
    // @ts-ignore
    const result: FormPayload <T, E, V> = {};
    Object.keys(state).forEach((element) => {
      const el = element as FormKey <T, E, V>;
      // @ts-ignore
      result[el] = state[el].value;
    });
    return result;
  }

  resetState(payload?: FormPayload <T, E, V>) {
    const initialState = this.initialState as FormState <T, E, V>;
    const state = this.state as FormState <T, E, V>;
    const targetState = payload ?? this.asPayload(initialState);
    Object.keys(targetState).forEach((element) => {
      const el = element as FormKey <T, E, V>;
      if (is.initialized(state[el])) {
        state[el].value = targetState[el] as any as FormValue <T, E, V>;
        state[el].fieldError = undefined;
      }
    });
  }

  linkFields(option: Link <T, E, V>): void {
    const master = option.master.name;
    const slave = option.slave.name;
    const alreadyExists = this.linkages.any(
      (_) => _.master.name === master && _.slave.name === slave
    );
    if (!alreadyExists) {
      // console.log("linkPayloadKeys:".brightGreen, option);
      this.linkages.add(option);
    }
  }
}
 