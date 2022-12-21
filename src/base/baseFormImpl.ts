import { Optional, VForm } from "@/base/baseFormTypes";
import TRemoteErrors = VForm.RemoteErrors;
import TDisplayOption = VForm.DisplayOption;
import TFormMessages = VForm.ValidationMessages;
import TFormValuesByName = VForm.FormValuesByName;
import TFormField = VForm.FormField;
import TFormState = VForm.FormState;
import TFormValue = VForm.FormValue;
import TFormRules = VForm.InternalValidators;
import TFormKey = VForm.FormKey;
import TErrorKey = VForm.ErrorKey;
import TFormPayload = VForm.FormPayload;
import TFormOption = VForm.FormOption;
import TFormExt = VForm.FormExt;
import { injectFacade, computed, ref, reactive, Ref, UnwrapRef, ComputedRef, is, assert, assertMsg, ArrayDelegate, ObjDelegate, Arr, flattenInstance  } from "@gdknot/frontend_common"

/** #### 表單當前狀態 */
export enum EFormStage {
  loading,
  ready,
}

/**
 *
 *      M O D E L
 * 
 * {@inheritDoc VForm.IBaseFormModel}
 * @see {@link VForm.IBaseFormModel}
 * @typeParam T - 
 * @typeParam E - 
 * 
 * */
export class BaseFormModel<T, E, V> implements VForm.IBaseFormModel<T, E, V> {
  /** 代表表單的二個狀態，loading/ready，用來區分表單是否正和遠端請求資料 */
  stage: Ref<EFormStage> = ref(EFormStage.ready);

  /** @deprecated @notImplemented 遠端錯誤 */
  private remoteErrors: UnwrapRef<TRemoteErrors<T, E, V>>;
  
  state: UnwrapRef<TFormState<T, E, V>>;
  
  /**@deprecated @notImplemented @private 初始遠端錯誤 */
  private initialRemoteErrors: TRemoteErrors<T, E, V>;
  private initialState: TFormState<T, E, V>;
  linkages: ArrayDelegate<VForm.Link<T, E, V>>;

  constructor(
    public validators: VForm.InternalValidators<string>,
    state: TFormState<T, E, V>,
    public messages: TFormMessages<T, E>,
    public config: TFormExt<T, E, V>
  ) {
    this.initialState = { ...state };
    Object.keys(this.initialState).forEach((element) => {
      //@ts-ignore
      this.initialState[element] = { ...state[element] };
    });

    this.state = reactive(state) as any;
    this.linkages = Arr([]);
    this.payloadKeys = Arr(Object.keys(this.state as TFormState<T, E, V>) as any[]) as ArrayDelegate<(keyof T &
      keyof E)>;
    this.identifiers = this.payloadKeys.map((fieldName: TFormKey<T, E, V>) => {
      const field = (this.state as TFormState<T, E, V>)[fieldName];
      field.fieldType ??= "text";
      (this.state as TFormState<T, E, V>)[fieldName] = reactive(field) as any;
      return field.name;
    });

    let remoteErrors: Optional<TRemoteErrors<T, E, V>>;
    remoteErrors ??= {} as any;
    Object.keys(this.state as TFormState<T, E, V>).forEach((key) => {
      remoteErrors![key as TErrorKey<T, E, V>] = undefined;
    });
    remoteErrors!.unCategorizedError = undefined;
    this.initialRemoteErrors = remoteErrors!;
    this.remoteErrors = reactive(remoteErrors!) as any;
  }

  private payloadKeys: Optional<ArrayDelegate<TFormKey<T, E, V>>>;
  getPayloadKeys(): ArrayDelegate<TFormKey<T, E, V>> {
    return (
        this.payloadKeys ??= Arr(Object.keys(
          this.state as TFormState <T, E, V>
        )) as any as  ArrayDelegate<TFormKey <T, E, V>> 
    );
  }

  private formFields: Optional<ArrayDelegate<TFormField <T, E, V>>>;
  getFields(): ArrayDelegate<TFormField <T, E, V>> {
     return (this.formFields ??= Arr(this.getPayloadKeys().map((_) => {
      return (this.state as TFormState <T, E, V>)[_];
    })));
  }

  private identifiers: Optional<string[]>;
  getIdentifiers(): string[] {
    return (this.identifiers ??= this.getPayloadKeys().map((fieldName) => {
      const field = (this.state as TFormState <T, E, V>)[fieldName];
      return field.name;
    }));
  }

  //@ts-ignore
  getValueByPayloadKey(payloadKey: TFormKey <T, E, V>): TFormValue <T, E, V> {
    return (this.state as TFormState <T, E, V>)[payloadKey].value as any;
  }

  getValueByName(name: string): Optional<TFormValue <T, E, V>> {
    return this.getFields().firstWhere((_) => _.name == name)
      ?.value as unknown as any;
  }

  getFieldByPayloadKey(payloadKey: TFormKey <T, E, V>): TFormField <T, E, V> {
    const field = this.getFields().firstWhere((_) => _.payloadKey == payloadKey);
    assert(
      is.initialized(field),
      `${assertMsg.propertyNotInitializedCorrectly}, payloadKey: ${String(payloadKey)}`
    );
    return field!;
  }

  getFieldByFieldName(fieldName: string): TFormField <T, E, V> {
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

  addRemoteErrors(errors: Partial<VForm.RemoteErrors <T, E, V>>) {
    Object.keys(errors).forEach((element) => {
      // @ts-ignore
      this.remoteErrors[element] = errors[element];
    });
  }

  resetInitialState() {
    const initialState = this.initialState as TFormState <T, E, V>;
    const state = this.state as TFormState <T, E, V>;
    Object.keys(state).forEach((element) => {
      const el = element as TFormKey <T, E, V>;
      if (is.initialized(initialState[el])) {
        initialState[el].value = state[el].value as any as TFormValue <T, E, V>;
      }
    });
  }

  private asPayload(state: TFormState <T, E, V>): TFormPayload <T, E, V> {
    // @ts-ignore
    const result: TFormPayload <T, E, V> = {};
    Object.keys(state).forEach((element) => {
      const el = element as TFormKey <T, E, V>;
      // @ts-ignore
      result[el] = state[el].value;
    });
    return result;
  }

  resetState(payload?: TFormPayload <T, E, V>) {
    const initialState = this.initialState as TFormState <T, E, V>;
    const state = this.state as TFormState <T, E, V>;
    const targetState = payload ?? this.asPayload(initialState);
    Object.keys(targetState).forEach((element) => {
      const el = element as TFormKey <T, E, V>;
      if (is.initialized(state[el])) {
        state[el].value = targetState[el] as any as TFormValue <T, E, V>;
        state[el].fieldError = undefined;
      }
    });
  }

  linkFields(option: VForm.Link <T, E, V>): void {
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

/**
 *
 *      C O N T E X T
 *
 * */
export class BaseFormContext <T, E, V> implements VForm.IBaseFormContext <T, E, V> {
  displayOption: TDisplayOption;

  constructor(
    public model: BaseFormModel <T, E, V>,
    public name: string,
    public payloadKey: TFormKey <T, E, V>,
    public ruleChain: ArrayDelegate<VForm.InternalValidator<V>>
  ) {
    this.displayOption = { showMultipleErrors: false };
  }
  //@ts-ignore
  get value(): TFormValue <T, E, V> {
    return this.model.getValueByName(this.name)! as any;
  }
  //@ts-ignore
  set value(val: TFormValue <T, E, V>) {
    (this.model.state[this.name as keyof (typeof this.model.state)] as TFormField <T, E, V>).value = val;
  }

  getFormValues(): TFormValuesByName <T, E, V> {
    type TF = TFormField <T, E, V>;
    const self = this;
    return new Proxy<TF>({} as TF, {
      get: function (target, name: string) {
        const field = self.model.getFields().firstWhere((_) => _.name == name);
        const initialized = is.initialized(field);
        assert(initialized, `form key: ${name} not found`);
        return field!.value;
      },
    }) as any as TFormValuesByName <T, E, V>;
  }

  getFormState(): TFormState <T, E, V> {
    return this.model.state as TFormState <T, E, V>;
  }

  getLinkedFieldName(ident: keyof V): Optional<string>{
    return this.ruleChain.firstWhere((_)=>_.validatorName == ident)?.linkedFieldName as Optional<string>;
  }
}

/**
 *
 *        B A S E   F O R M
 *
 *  @see {@link BaseFormModel} 
 *  @see {@link VForm.IBaseFormCtrl}
 *  @see VForm.IBaseEventHandler}
 * */
export abstract class BaseFormImpl <T, E, V>
  extends BaseFormModel <T, E, V>
  implements VForm.IBaseFormCtrl <T, E, V>, VForm.IBaseEventHandler <T, E, V>
{
  canSubmit: ComputedRef<boolean>;
  request: (...args: any[]) => any;
  resend: (...args: any[]) => any;

  protected constructor(option: TFormOption <T, E, V>) {
    const emptyFunc: any = () => {
      return true;
    };
    super(
      option.validators as VForm.InternalValidators<string>, 
      option.state, 
      option.messages, 
    {
      title: option.title ?? computed(() => ""),
      visible: option.visible ?? reactive({ value: false }),
      onClose:
        option.onClose ??
        (((model: this) => {
          model.resetState();
          model.config.visible.value = false;
        }) as unknown as any),
      onVisible: option.onVisible ?? emptyFunc,
      onCancel: option.onCancel ?? emptyFunc,
      onSubmit: option.onSubmit ?? emptyFunc,
      onBeforeVisible:
        option.onBeforeVisible ??
        (((model: this, extra: any) => {
          model.resetState(extra);
        }) as unknown as any),
      onNotifyRectifyingExistingErrors:
        option.onNotifyRectifyingExistingErrors ?? emptyFunc,
      onBeforeSubmit: option.onBeforeSubmit ?? emptyFunc,
      onAfterSubmit: option.onAfterSubmit ?? emptyFunc,
      onCatchSubmit: option.onCatchSubmit ?? emptyFunc,
    });

    this.getFields().forEach((field) => {
      field.context = this.getContext(field.name) as any;
      field.fieldError = "";
      field.hidden ??= false;
      field.hasError ??= computed(() => {
        return is.not.empty(field.fieldError);
      });
    });

    this.canSubmit = computed(() => {
      let results: ArrayDelegate<boolean> = Arr([]);
      let stage = this.stage.value;
      Object.keys(this.state as TFormState <T, E, V>).forEach((_: any) => {
        const field = (this.state as TFormState <T, E, V>)[
          _ as TFormKey <T, E, V>
          ] as TFormField <T, E, V>;
        const value = field.value;
        // console.log(field.rule, value, results);
        if (is.empty(field.fieldError)) {
          const ruleChain = Arr(field.ruleChain);
          const required = ruleChain.firstWhere((_)=>_.validatorName == "required");
          if (required && is.empty(value)) {
            results.add(false);
            return;
          }
          // if (!field.rule.contains('required') && is.empty(value)){
          //   results.add(false);
          //   return;
          // }
          results.add(true);
          return;
        }
        results.add(false);
        return;
      });
      return results.every((_) => _) && stage === EFormStage.ready;
    });

    this.request = option.request;
    this.resend = option.resend ?? ((...args: any[]) => {});
  }

  private cachedContext: Optional<
    Record<string, VForm.IBaseFormContext <T, E, V>>
    >;
  getContext(fieldName: string): VForm.IBaseFormContext <T, E, V> {
    this.cachedContext ??= {} as any;
    const field = this.getFieldByFieldName(fieldName);
    assert(
      is.initialized(field),
      `${assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`
    );
    
    this.cachedContext![fieldName] ??= new BaseFormContext <T, E, V>(
      this as any as BaseFormModel <T, E, V>,
      field.name,
      field.payloadKey,
      Arr(field.ruleChain),
    ) as any;
    return this.cachedContext![fieldName];
  }

  getPayload(): Record<TFormKey <T, E, V>, any> {
    // @ts-ignore
    const result: Record<TFormKey <T, E, V>, any> = {};
    //@ts-ignore
    Object.keys(this.state as TFormState <T, E, V>).forEach((_: TFormKey <T, E, V>) => {
      const field = (this.state as TFormState <T, E, V>)[_] as TFormField <T, E, V>;
      if (is.not.empty(field.value)) {
        result[_] = field.value;
      }
    });
    // console.log('payload:', result);
    return result;
  }

  notifyRectifyingExistingErrors(): void {
    if (!this.canSubmit.value) {
      this.config.onNotifyRectifyingExistingErrors();
    }
  }

  notifyLeavingFocus(payloadKey: TFormKey <T, E, V>): void {
    this.validate(payloadKey);
  }

  notifyReFocus(payloadKey: TFormKey <T, E, V>): void {
    this.validate(payloadKey);
  }

  notifyOnInput(payloadKey: TFormKey <T, E, V>, extraArg?: any): void {
    const validateResult = this.validate(payloadKey, extraArg);
    // 當自身是 slave 時, 呼叫 master
    const link = this.linkages.firstWhere((_) => _.slave.payloadKey === payloadKey);
    if (is.not.undefined(link)) {
      this.validate(link!.master.payloadKey, extraArg);
    }
  }

  cancel(): void {
    const self = this as any as VForm.IBaseFormModel <T, E, V>;
    // console.log('cancel');
    this.config.onCancel?.(self);
    // this.config.onClose(self);
  }

  async submit(): Promise<any> {
    try {
      this.config.onBeforeSubmit();
      this.stage.value = EFormStage.loading;
      const self = this as any as VForm.IBaseFormModel <T, E, V>;
      const result = await this.request(this.getPayload());
      const destroyForm = this.config.onSubmit?.(result, self);
      this.stage.value = EFormStage.ready;
      this.config.onAfterSubmit();
      if (destroyForm) {
        try {
          this.config.onClose(self);
        } catch (e) {}
      }
      return result;
    } catch (e) {
      console.error(e);
      this.config.onCatchSubmit(e);
      throw e;
    } finally {
      setTimeout(() => {
        this.stage.value = EFormStage.ready;
      }, 800);
    }
    return Promise.resolve(undefined);
  }

  validate(payloadKey: TFormKey <T, E, V>, extraArg?: any): boolean {
    const field = this.getFieldByPayloadKey(payloadKey);
    const context = this.getContext(field.name);
    const errors: ArrayDelegate<string> = Arr([]);
    const ruleChain = Arr(field.ruleChain);

    ruleChain.forEach((validator) => {
      const {validatorName, appliedFieldName} = validator;
      assert(is.initialized(appliedFieldName),   `${assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
      assert(is.initialized(validatorName),   `${assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
      const passed = validator.handler(context as any, field.value, extraArg);
      if (passed) {
      } else {
        /** 
         * todo: 實作 bail 的作用 */
        const ruleMsg = (this.messages[appliedFieldName! as any as keyof (T & E)] as any as ComputedRef);
        errors.add(ruleMsg?.value ?? "Undefined error")
      }
    });

    if (context.displayOption.showMultipleErrors) {
      field.fieldError = errors.join("\n");
    } else {
      field.fieldError = is.empty(errors) ? "" : errors.first;
    }

    const isOptional = ruleChain.firstWhere((_)=>_.validatorName == "optional");
    /** 如果是 optional 且內容為空，無論 validation 結果為何，均為 true*/
    if (isOptional && is.empty(field.value)) {
      field.fieldError = "";
      return true;
    }

    const isRequired = ruleChain.firstWhere((_)=>_.validatorName == "required");
    /** 如果沒有 required 且內容為空，無論 validation 結果為何，均為 true*/
    if (!isRequired && is.empty(field.value)) {
      field.fieldError = "";
      return true;
    }
    return is.empty(errors);
  }

  validateAll(): boolean {
    // don't apply validation on hidden fields
    const results = this.getFields()
      .where((_) => !(_.hidden ?? false))
      .map((_) => {
        return this.validate(_.payloadKey);
      });
    return results.every((_) => _);
  }


}


export function typed<T=any>(val: T): T {
  return val;
}