
import {computed, ComputedRef, reactive, Ref, UnwrapRef} from "vue";
import {ref} from "vue";
import {TOptional, VForm} from "~/base/vformTypes";
import TRemoteErrors = VForm.TRemoteErrors;
import TDisplayOption = VForm.TDisplayOption;
import TFormMessages = VForm.TFormMessages;
import TFormValuesByName = VForm.TFormValuesByName;
import TFormField = VForm.TFormField;
import TFormState = VForm.TFormState;
import TFormValue = VForm.TFormValue;
import TFormRules = VForm.TFormRules;
import TFormKey = VForm.TFormKey;
import TErrorKey = VForm.TErrorKey;
import TFormPayload = VForm.TFormPayload;
import TFormOption = VForm.TFormOption;
import TFormExt = VForm.TFormExt;
import {assert, assertMsg} from "common_js_builtin/dist/utils/assert";
import {is} from "common_js_builtin/dist/utils/typeInferernce";

export enum ECompStage{
  loading,
  ready,
}

/**
 *
 *      M O D E L
 *
 * */
export class BaseFormModel<T, E>
  implements VForm.IBaseFormModel<T, E>
{
  stage: Ref<ECompStage> = ref<ECompStage>(ECompStage.ready);
  remoteErrors: UnwrapRef<TRemoteErrors<T,E>>;
  state: UnwrapRef<TFormState<T, E>>
  private initialRemoteErrors: TRemoteErrors<T,E>;
  initialState: TFormState<T,E>;
  linkages: VForm.TLink<T, E>[];

  constructor(
    public rules: TFormRules,
    state: TFormState<T, E>,
    public messages: TFormMessages,
    public config: TFormExt<T, E>,
  ) {
    this.initialState = {...state};
    Object.keys(this.initialState).forEach((element) => {
      //@ts-ignore
      this.initialState[element] = {...state[element]};
    });

    this.state = reactive(state) as any;
    this.linkages = [];
    this.dataKeys = Object.keys(this.state as TFormState<T, E>) as ((keyof T) & (keyof E))[];
    this.identifiers = this.dataKeys.map((fieldName: TFormKey<T, E>) => {
      const field = (this.state as TFormState<T, E>)[fieldName];
      field.fieldType ??= "text";
      (this.state as TFormState<T, E>)[fieldName] = reactive(field) as any;
      return field.name;
    });

    let remoteErrors: TOptional<TRemoteErrors<T,E>>;
    remoteErrors ??= {} as any;
    Object.keys(this.state as TFormState<T,E>).forEach((key)=>{
      remoteErrors![key as TErrorKey<T,E>] = undefined;
    });
    remoteErrors!.uncategorizedError = undefined;
    this.initialRemoteErrors = remoteErrors!;
    this.remoteErrors = reactive(remoteErrors!) as any;
  }

  private dataKeys: TOptional<(TFormKey<T,E>)[]>;
  getDataKeys(): (TFormKey<T,E>)[] {
    return this.dataKeys ??= Object.keys(this.state as TFormState<T, E>) as ((keyof T) & (keyof E))[];
  }

  private formFields: TOptional<TFormField<T, E>[]>;
  getFields(): TFormField<T, E>[] {
    return this.formFields ??= this.getDataKeys().map((_)=>{
      return (this.state as TFormState<T, E>)[_];
    });
  }

  private identifiers: TOptional<string[]>;
  getIdentifiers(): string[] {
    return this.identifiers ??= this.getDataKeys().map((fieldName) => {
      const field = (this.state as TFormState<T, E>)[fieldName];
      return field.name;
    })
  }

  //@ts-ignore
  getValueByDataKey(dataKey: TFormKey<T,E>): TFormValue<T,E> {
    return (this.state as TFormState<T, E>)[dataKey].value as any ;
  }

  getValueByName(name: string): TOptional<TFormValue<T,E>> {
    return this.getFields().firstWhere((_)=> _.name == name)?.value as unknown as any;
  }

  getFieldByDataKey(dataKey: TFormKey<T,E>): TFormField<T, E> {
    const field = this.getFields().firstWhere((_)=> _.dataKey == dataKey);
    assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}, dataKey: ${dataKey}`);
    return field!;
  }

  getFieldByFieldName(fieldName: string): TFormField<T, E> {
    const field = this.getFields().firstWhere((_)=> _.name == fieldName);
    assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}, name: ${fieldName}`);
    return field!;
  }

  clearRemoteErrors() {
    Object.keys(this.initialRemoteErrors).forEach((element) => {
      // @ts-ignore
      this.remoteErrors[element] = undefined;
    })
  }

  addRemoteErrors(errors: Partial<VForm.TRemoteErrors<T, E>>) {
    Object.keys(errors).forEach((element) => {
      // @ts-ignore
      this.remoteErrors[element] = errors[element];
    })
  }

  resetInitialState(){
    const initialState = (this.initialState as TFormState<T,E>);
    const state = (this.state as TFormState<T,E>);
    Object.keys(state).forEach((element) => {
      const el = element as TFormKey<T,E>;
      if (is.initialized(initialState[el])){
        initialState[el].value = (state[el].value as any as TFormValue<T,E>);
      }
    })
  }

  private asPayload(state: TFormState<T,E>): TFormPayload<T,E>{
    // @ts-ignore
    const result: TFormPayload<T,E> = {};
    Object.keys(state).forEach((element) => {
      const el = element as TFormKey<T,E>;
      // @ts-ignore
      result[el] = state[el].value;
    })
    return result;
  }

  resetState(payload?: TFormPayload<T,E>) {
    const initialState = (this.initialState as TFormState<T,E>);
    const state        = (this.state as TFormState<T,E>);
    const targetState  = payload ?? this.asPayload(initialState);
    Object.keys(targetState).forEach((element) => {
      const el = element as TFormKey<T,E>;
      if (is.initialized(state[el])){
        state[el].value = targetState[el] as any as TFormValue<T,E>;
        state[el].fieldError = undefined;
      }
    })
  }

  // hasLinked(fieldName: string): boolean{
  //   const alreadyExists = this.linkages.any((_)=> _.master.name === fieldName);
  // }

  linkFields(option: VForm.TLink<T, E>): void {
    const master = option.master.name;
    const slave = option.slave.name;
    const alreadyExists = this.linkages.any((_)=> _.master.name === master && _.slave.name === slave);
    if (!alreadyExists){
      // console.log("linkDataKeys:".brightGreen, option);
      this.linkages.add(option);
    }
  }
}

/**
 *
 *      C O N T E X T
 *
 * */
export class BaseFormContext<T, E>
  implements VForm.IBaseFormContext<T, E>
{
  displayOption: TDisplayOption;

  constructor(
    public model: BaseFormModel<T, E>,
    public name: string,
    public dataKey: TFormKey<T, E>
  ) {
    this.displayOption = {showMultipleErrors: false};
  }

  //@ts-ignore
  get value(): TFormValue<T,E>{
    return this.model.getValueByName(this.name)! as any;
  }

  //@ts-ignore
  set value(val: TFormValue<T,E>){
    // @ts-ignore
    (this.model.state[this.name] as TFormField<T, E>).value = val;
  }

  getFormValues(): TFormValuesByName<T, E> {
    type TF = TFormField<T, E>;
    const self = this;
    return new Proxy<TF>({} as TF, {
      get: function (target, name: string) {
        const field = self.model.getFields().firstWhere((_)=>_.name == name);
        const initialized = is.initialized(field);
        assert(initialized,`form key: ${name} not found`);
        return field!.value;
      }
    }) as any as TFormValuesByName<T, E>;
  }

  getFormState(): TFormState<T, E> {
    return this.model.state as TFormState<T, E>;
  }
}


/**
 *
 *        B A S E   F O R M
 *
 * */
export abstract class BaseFormImpl<T, E>
  extends BaseFormModel<T, E>
  implements
    VForm.IBaseFormCtrl    <T, E>,
    VForm.IBaseEventHandler<T, E>
{
  canSubmit: ComputedRef<boolean>;
  request:(...args: any[])=>any;
  resend:(...args: any[])=>any;

  protected constructor(option: TFormOption<T, E>) {
    const emptyFunc: any = ()=>{ return true};
    super(
      option.rules,
      option.state,
      option.messages,
      {
        title     : option.title ?? computed(()=>""),
        visible   : option.visible ?? reactive({value: false}),
        onClose   : option.onClose ?? (((model: this)=>{
          model.resetState();
          model.config.visible.value = false;
        }) as unknown as any),
        onVisible : option.onVisible ?? emptyFunc,
        onCancel  : option.onCancel ?? emptyFunc,
        onSubmit  : option.onSubmit ?? emptyFunc,
        onBeforeVisible: option.onBeforeVisible ?? (((model: this, extra: any)=>{
          model.resetState(extra);
        }) as unknown as any),
        onNotifyRectifyingExistingErrors: option.onNotifyRectifyingExistingErrors ?? emptyFunc,
        onBeforeSubmit: option.onBeforeSubmit ?? emptyFunc,
        onAfterSubmit: option.onAfterSubmit ?? emptyFunc,
        onCatchSubmit: option.onCatchSubmit ?? emptyFunc,
      },
    );

    this.getFields().forEach((field)=>{
      field.context = this.getContext(field.name) as any;
      field.fieldError = "";
      field.hidden ??= false;
      field.hasError ??= computed(()=>{
        return is.not.empty(field.fieldError);
      })
    });

    this.canSubmit = computed(()=>{
      let results: boolean[] = []
      let stage = this.stage.value;
      Object.keys(this.state as TFormState<T, E>).forEach((_: any)=>{
        const field = (this.state as TFormState<T, E>)[_ as TFormKey<T,E>] as TFormField<T, E>;
        const value = field.value;
        // console.log(field.rule, value, results);
        if (is.empty(field.fieldError)){
          if (field.rule.contains("required") && is.empty(value)){
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
      return results.every((_)=>_) && stage === ECompStage.ready;
    });

    this.request = option.request;
    this.resend = option.resend ?? ((...args: any[])=>{});
  }

  private cachedContext: TOptional<Record<string, VForm.IBaseFormContext<T, E>>>;
  getContext(fieldName: string): VForm.IBaseFormContext<T, E> {
    this.cachedContext ??= {} as any;
    const field = this.getFieldByFieldName(fieldName);
    assert(is.initialized(field), `${assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`);
    this.cachedContext![fieldName] ??= new BaseFormContext<T, E>(
      this as any as BaseFormModel<T, E>,
      field.name,
      field.dataKey
    ) as any;
    return this.cachedContext![fieldName];
  }

  getPayload(): Record<TFormKey<T,E>, any> {
    // @ts-ignore
    const result: Record<TFormKey<T,E>, any> = {};
    //@ts-ignore
    Object.keys(this.state as TFormState<T, E>).forEach((_: TFormKey<T,E>)=>{
      const field = (this.state as TFormState<T, E>)[_] as TFormField<T, E>;
      if (is.not.empty(field.value)) {
        result[_] = field.value;
      }
    });
    // console.log('payload:', result);
    return result;

  }

  notifyRectifyingExistingErrors(): void{
    if (!this.canSubmit.value){
      this.config.onNotifyRectifyingExistingErrors();
    }
  }

  notifyLeavingFocus(dataKey: TFormKey<T,E>): void {
    this.validate(dataKey);
  }

  notifyReFocus(dataKey: TFormKey<T,E>): void {
    this.validate(dataKey);
  }

  notifyOnInput(dataKey: TFormKey<T,E>, extraArg?: any): void {
    const vresult = this.validate(dataKey, extraArg);
    // console.log('notifyOnInput:', vresult,  dataKey, this.getFieldByDataKey(dataKey).value, 'extraArg:', extraArg);
    const link = this.linkages.firstWhere((_)=>_.slave.dataKey === dataKey);
    if (is.not.undefined(link)){
      this.validate(link!.master.dataKey, extraArg);
    }
  }

  cancel(): void {
    const self = this as any as VForm.IBaseFormModel<T, E>;
    // console.log('cancel');
    this.config.onCancel?.(self);
    // this.config.onClose(self);
  }


  async submit(): Promise<any> {
    try{
      this.config.onBeforeSubmit();
      this.stage.value = ECompStage.loading;
      const self        = this as any as VForm.IBaseFormModel<T, E>;
      const result      = await this.request(this.getPayload());
      const destroyForm = this.config.onSubmit?.(result, self);
      this.stage.value = ECompStage.ready;
      this.config.onAfterSubmit();
      if (destroyForm){
        try{
          this.config.onClose(self);
        }catch(e){}
      }
      return result;
    } catch(e){
      console.error(e);
      this.stage.value = ECompStage.ready;
      this.config.onCatchSubmit(e);
      throw e;
    }
    return Promise.resolve(undefined);
  }

  validate(dataKey: TFormKey<T,E>, extraArg?: any): boolean {
    const field = this.getFieldByDataKey(dataKey);
    const context = this.getContext(field.name);
    const errors: string[] = [];
    const rules: string[] = (field.rule.split("|"));

    rules.forEach((element) => {
      const rule = this.rules[element];
      assert(is.initialized(rule), `${assertMsg.propertyNotInitializedCorrectly}: rule: ${element}`);
      const passed = this.rules[element](context, field.value, extraArg);
      if (passed){
      }else{
        errors.add(this.messages[element]?.value ?? "Undefined error");
      }
    });
    if (context.displayOption.showMultipleErrors){
      field.fieldError = errors.join("\n");
    }else{
      field.fieldError = is.empty(errors) ? "" : errors.first;
    }

    /** 如果是 optional 且內容為空，無論 validation 結果為何，均為 true*/
    if (rules.contains("optional") && is.empty(field.value)){
      field.fieldError = "";
      return true;
    }
    /** 如果沒有 required 且內容為空，無論 validation 結果為何，均為 true*/
    if (!rules.contains("required") && is.empty(field.value)){
      field.fieldError = "";
      return true;
    }

    return is.empty(errors);
  }

  validateAll(): boolean{
    const results = this.getFields().map((_)=>{
      return this.validate(_.dataKey);
    });
    return results.every((_)=> _);
  }
}


