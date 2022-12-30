
import { injectFacade, _computed, _ref, _reactive, Ref, UnwrapRef, ComputedRef, is, assert, ArrayDelegate, ObjDelegate, Arr, flattenInstance, _watch  } from "@gdknot/frontend_common"
import { BaseFormContext } from "./baseContextImpl";
import { BaseFormModel } from "./baseModelImpl";
import { Optional } from "~/base/types/commonTypes";
import { DisplayOption, IBaseFormContext } from "~/base/types/contextTypes";
import { FormState, Link, FormValue, RemoteErrors, ErrorKey, FormExt, FormField, FormKey, InternalFormOption, FormPayload, FormValuesByName } from "~/base/types/formTYpes";
import { IBaseFormModel, IBaseFormCtrl, IBaseEventHandler, EFormStage } from "~/base/types/modelTypes";
import { InternalValidators, InternalValidator, UDValidationMsgOption } from "~/base/types/validatorTypes";
import { assertMsg } from "@/utils/formValidatorUtil";
  
/**
 *
 *        B A S E   F O R M
 *
 *  @see {@link BaseFormModel} 
 *  @see {@link IBaseFormCtrl}
 *  @see IBaseEventHandler
 * */
export abstract class BaseFormImpl <T, E, V>
  extends BaseFormModel <T, E, V>
  implements 
  IBaseFormCtrl <T, E, V>, 
  IBaseEventHandler <T, E, V>
{
  canSubmit: ComputedRef<boolean>;
  request: (...args: any[]) => any;
  resend: (...args: any[]) => any;

  protected constructor(option: InternalFormOption <T, E, V>) {
    const emptyFunc: any = () => {
      return true;
    };
    super(
      option.state, 
      option.messages, 
    {
      title: option.title ?? _computed(() => ""),
      visible: option.visible ?? _reactive({ value: false }),
      onClose:
        option.onClose ??
        (((model: this) => {
          model.resetState();
          model.config.visible.value = false;
        }) as unknown as any),
      onVisibleChanged: option.onVisibleChanged ?? emptyFunc,
      onCancel: option.onCancel ?? emptyFunc,
      onSubmit: option.onSubmit ?? emptyFunc,
      // onBeforeVisible:
      //   option.onBeforeVisible ??
      //   (((model: this, extra: any) => {
      //     model.resetState(extra);
      //   }) as unknown as any),
      onNotifyRectifyingExistingErrors:
        option.onNotifyRectifyingExistingErrors ?? emptyFunc,
      onBeforeSubmit: option.onBeforeSubmit ?? emptyFunc,
      onAfterSubmit: option.onAfterSubmit ?? emptyFunc,
      onCatchSubmit: option.onCatchSubmit ?? emptyFunc,
    });

    this.getFields().forEach((field) => {
      field.context = this.getContext(field.fieldName) as any;
      field.fieldError = "";
      field.hidden ??= false;
      field.hasError ??= _computed(() => {
        return is.not.empty(field.fieldError);
      });
    });

    this.canSubmit = _computed(() => {
      // let results: ArrayDelegate<boolean> = Arr([]);
      // let stage = this.stage.value;
      // Object.keys(this.state as FormState <T, E, V>).forEach((_: any) => {
      //   const field = (this.state as FormState <T, E, V>)[
      //     _ as FormKey <T, E, V>
      //     ] as FormField <T, E, V>;
      //   const value = field.value;
      //   // console.log(field.rule, value, results);
      //   if (is.empty(field.fieldError)) {
      //     const ruleChain = Arr(field.ruleChain);
      //     const required = ruleChain.firstWhere((_)=>_.validatorName == "required");
      //     if (required && is.empty(value)) {
      //       results.add(false);
      //       return;
      //     }
      //     results.add(true);
      //     return;
      //   }
      //   results.add(false);
      //   return;
      // });
      // return results.every((_) => _) && stage === EFormStage.ready;
      let stage = this.stage.value;
      return !this.hasError() && stage === EFormStage.ready
    });

    this.request = option.postMethod;
    this.resend = option.resendPost ?? ((...args: any[]) => {});
  }

  private cachedContext: Optional<
    Record<string, IBaseFormContext <T, E, V>>
    >;

  hasError(){
    let results: ArrayDelegate<boolean> = Arr([]);
    let stage = this.stage.value;
    Object.keys(this.state as FormState <T, E, V>).forEach((_: any) => {
      const field = (this.state as FormState <T, E, V>)[
        _ as FormKey <T, E, V>
        ] as FormField <T, E, V>;
      const value = field.value;
      // console.log(field.rule, value, results);
      if (is.empty(field.fieldError)) {
        const ruleChain = Arr(field.ruleChain);
        const required = ruleChain.firstWhere((_)=>_.validatorName == "required");
        if (required && is.empty(value)) {
          results.add(false);
          return;
        }
        results.add(true);
        return;
      }
      results.add(false);
      return;
    });
    return results.any((_) => _);
  }

  getContext(fieldName: string): IBaseFormContext <T, E, V>  {
    this.cachedContext ??= {} as any;
    const field = this.getFieldByFieldName(fieldName);
    assert(
      is.initialized(field),
      `${assertMsg.propertyNotInitializedCorrectly}: ${fieldName}`
    );
    
    this.cachedContext![fieldName] ??= new BaseFormContext <T, E, V>(
      this as any as BaseFormModel <T, E, V>,
      field.fieldName,
      field.payloadKey,
      Arr(field.ruleChain),
    ) as any;
    return this.cachedContext![fieldName];
  }

  /** 取得當前表單 payload, 使用者可實作 getPayload 改寫傳送至遠端的 payload
   * @example
   * ```ts
   *  getPayload(){
   *    const result = super.getPayload();
   *    delete result.remark;
   *    return result;
   *  }
   * ```
   */
  getPayload(): Record<FormKey <T, E, V>, any> {
    const result: Record<FormKey <T, E, V>, any> = {} as any;
    Object.keys(this.state as FormState <T, E, V>).forEach((__) => {
      const _ : FormKey <T, E, V> = __ as any;
      const field = (this.state as FormState <T, E, V>)[_] as FormField <T, E, V>;
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

  notifyLeavingFocus(payloadKey: FormKey <T, E, V>): void {
    this.validate(payloadKey);
  }

  notifyReFocus(payloadKey: FormKey <T, E, V>): void {
    this.validate(payloadKey);
  }

  notifyOnInput(payloadKey: FormKey <T, E, V>, extraArg?: any): void {
    const validateResult = this.validate(payloadKey, extraArg);
    // 當自身是 slave 時, 呼叫 master
    const link = this.linkages.firstWhere((_) => _.slave.payloadKey === payloadKey);
    if (is.not.undefined(link)) {
      this.validate(link!.master.payloadKey, extraArg);
    }
  }

  notifyVisibilityChanged(): void {
    this.config.onVisibleChanged!(this as any, this.config.visible.value);
  }

  inputValue(payloadKey: keyof T | keyof E, value: any): void {
    const field = this.getFieldByPayloadKey(payloadKey);
    field.value = value;
    this.notifyOnInput(payloadKey);
  }

  cancel(): void {
    const self = this as any as IBaseFormModel <T, E, V>;
    // console.log('cancel');
    this.config.onCancel?.(self);
    // this.config.onClose(self);
  }

  async submit(): Promise<any> {
    try {
      this.config.onBeforeSubmit();
      this.stage.value = EFormStage.loading;
      const self = this as any as IBaseFormModel <T, E, V>;
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

  validate(payloadKey: FormKey <T, E, V>, extraArg?: any): boolean {
    const field = this.getFieldByPayloadKey(payloadKey);
    const context = this.getContext(field.fieldName) as any as IBaseFormContext<T, E, V> &  {validator?: InternalValidator<V>};
    const errors: ArrayDelegate<string> = Arr([]);
    const ruleChain = Arr(field.ruleChain);
    let stackErrorMessage = false;

    for (let index = 0; index < ruleChain.length; index++) {
      const validator = ruleChain[index];
      const {validatorName, _appliedFieldName: appliedFieldName} = validator;
      if (validatorName == "bail")
        stackErrorMessage = true;
      assert(is.initialized(appliedFieldName),   `${assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
      assert(is.initialized(validatorName),   `${assertMsg.propertyNotInitializedCorrectly}: validator: ${String(validatorName)}`);
      try{
        context.validator = validator;
        const passed = validator.handler(context as any, field.value, extraArg);
        if (passed) {
        } else {
          const ruleMsg = (this.messages[validatorName]);
          errors.add(ruleMsg?.value ?? "Undefined error");
          if (!stackErrorMessage){
            break;
          }
        }
      }catch(e){
        const error = String(e).toLowerCase();
        const isAssertError = error.contains("assertionerror");
        const hasLinkedField = validator._linkedFieldName;
        if (isAssertError && hasLinkedField) {
          const foundLinkedField = context.getLinkedFieldName(validator.validatorName);
          if (!foundLinkedField){
            throw `${assertMsg.linkFieldNameNotFound}: validatorName: ${String(validator.validatorName)} at fieldName '${context.fieldName}' link to '${validator._linkedFieldName}'`;
          }
        }
        console.error(e);
      }
    }

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