import { Ref, UnwrapRef, ArrayDelegate } from "@gdknot/frontend_common";
import { Optional } from "./types/commonTypes";
import {
  FormState,
  Link,
  FormValue,
  RemoteErrors,
  FormExt,
  FormField,
  FormKey,
  FormPayload
} from "./types/formTYpes";
import { IBaseFormModel, EFormStage } from "./types/modelTypes";
import {
  InternalValidators,
  ValidationMessages
} from "./types/validatorTypes";
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
export declare class BaseFormModel<T, E, V> implements IBaseFormModel<T, E, V> {
  validators: InternalValidators<V>;
  messages: ValidationMessages<V>;
  config: FormExt<T, E, V>;
  /** 代表表單的二個狀態，loading/ready，用來區分表單是否正和遠端請求資料 */
  stage: Ref<EFormStage>;
  /** @deprecated @notImplemented 遠端錯誤 */
  private remoteErrors;
  state: UnwrapRef<FormState<T, E, V>>;
  /**@deprecated @notImplemented @private 初始遠端錯誤 */
  private initialRemoteErrors;
  private initialState;
  linkages: ArrayDelegate<Link<T, E, V>>;
  constructor(
    validators: InternalValidators<V>,
    state: FormState<T, E, V>,
    messages: ValidationMessages<V>,
    config: FormExt<T, E, V>
  );
  private payloadKeys;
  getPayloadKeys(): ArrayDelegate<FormKey<T, E, V>>;
  private formFields;
  getFields(): ArrayDelegate<FormField<T, E, V>>;
  private identifiers;
  getIdentifiers(): string[];
  getValueByPayloadKey(payloadKey: FormKey<T, E, V>): FormValue<T, E, V>;
  getValueByName(name: string): Optional<FormValue<T, E, V>>;
  getFieldByPayloadKey(payloadKey: FormKey<T, E, V>): FormField<T, E, V>;
  getFieldByFieldName(fieldName: string): FormField<T, E, V>;
  clearRemoteErrors(): void;
  addRemoteErrors(errors: Partial<RemoteErrors<T, E, V>>): void;
  resetInitialState(): void;
  private asPayload;
  resetState(payload?: FormPayload<T, E, V>): void;
  linkFields(option: Link<T, E, V>): void;
}
