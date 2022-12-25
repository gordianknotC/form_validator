import {
  aValidator,
  BaseFormImpl,
  baseValidators,
  defineFieldConfigs,
  defineFieldRules,
  defineValidationMsg,
  defineValidators,
  EBaseValidationIdents,
  formModelOption,
} from "~/index";
import {
  Arr,
  ArrayDelegate,
  flattenInstance,
  is
} from "@gdknot/frontend_common";
import { computed, reactive } from "vue";
import { UDFieldConfigs } from "@/base/types/configTYpes";
import { IBaseFormContext } from "@/base/types/contextTypes";
import { FormKey, FormField, FormOption } from "@/base/types/formTYpes";
import { InternalValidator, UDValidationMessages, InternalValidators, UDFieldRules } from "@/base/types/validatorTypes";

type F = { 
  username: string; 
  password: string;
  confirm_password: string;
};
type V = { 
  username: any; 
  password: any; 
  required: any 
} & (typeof EBaseValidationIdents);

let requiredValidator: InternalValidator<V>;
let nameValidator: InternalValidator<V>;
let passwordValidator: InternalValidator<V>;
let validatorMsg: UDValidationMessages<V>;

let nameContext: IBaseFormContext<F, F, V>;
let pwdContext: IBaseFormContext<F, F, V>;

let nameRuleChain: ArrayDelegate<InternalValidator<V>>;
let pwdRuleChain: ArrayDelegate<InternalValidator<V>>;
let confirmPwdRuleChain: ArrayDelegate<InternalValidator<V>>;

let validators: InternalValidators<V>;

const nameKey: FormKey<F, F, V> = "username";
const nameFieldName = "userFieldName";

const pwdKey: FormKey<F, F, V> = "password";
const pwdFieldName = "passwordFieldName";

const confirmPwdKey: FormKey<F, F, V> = "confirm_password";
const confirmPwdFieldName = "confirmPasswordFieldName";

let nameField: FormField<F, F, V>;
let pwdField: FormField<F, F, V>;

class CreateUserFormModel extends BaseFormImpl<F, F, V> {
  constructor(option: FormOption<F, F, V>) {
    flattenInstance(super(option));
    this.state.username.value = "guest";
  }
  getPayload(): Record<FormKey<F, F, V>, any> {
    return super.getPayload();
  }
}

let model: CreateUserFormModel;

export type SetupAValidatorTestReturnType = {
  model: typeof model;
  modelOption: FormOption<F, F, V>;
  fieldConfigs: UDFieldConfigs<F, V>;
  fieldRules: UDFieldRules<any, V>;
  validatorMsg: typeof validatorMsg;
  validators: typeof validators;
  pwdField: typeof pwdField;
  pwdContext: IBaseFormContext<F, F, V>;
  nameField: typeof nameField;
  nameContext: IBaseFormContext<F, F, V>;
  nameValidationErrorMsg: string,
  passwordValidationErrorMsg: string,
};
export function setupAValidatorTest(): SetupAValidatorTestReturnType {
  const nameValidationErrorMsg = "validate name error";
  const passwordValidationErrorMsg = "validate password error";  
  const {validatorIdents, validators} = defineValidators<V>([
    {
      identity: "required",
      handler: (ctx, ...args)=>{
        return true;
      }
    },
    {
      identity: "username",
      handler: (ctx, ...args)=>{
        return ctx.value == "John";
      }
    },
    {
      identity: "password",
      handler: (ctx, ...args)=>{
        return ctx.value == "1234";
      }
    },
  ]);

  nameRuleChain = Arr([validators.required, validators.username]);
  pwdRuleChain = Arr([validators.required, validators.password]);
  confirmPwdRuleChain = Arr([validators.required, validators.password, validators.confirm.linkField(pwdFieldName)]);

  console.log("name rules:",  nameRuleChain.map((_)=>_.appliedFieldName));
  console.log("password rules:",  pwdRuleChain.map((_)=>_.appliedFieldName));
  
  nameField = {
    payloadKey: nameKey,
    name: nameFieldName,
    defaultValue: "guest",
    value: "",
    label: computed(() => ""),
    ruleChain: nameRuleChain,
    placeholder: computed(() => "")
  };

  pwdField = {
    payloadKey: pwdKey,
    name: pwdFieldName,
    defaultValue: "",
    value: "",
    label: computed(() => ""),
    ruleChain: pwdRuleChain,
    placeholder: computed(() => "")
  };

  validatorMsg = defineValidationMsg({
    username: computed(()=>nameValidationErrorMsg),
    password: computed(()=>passwordValidationErrorMsg),
    required: computed(()=>"required"),
    bail: computed(()=>"bail"),
    greater: computed(()=>"greater"),
    lesser: computed(()=>"lesser"),
    confirm: computed(()=>"confirm"),
    email: computed(()=>"email"),
    remark: computed(()=>"remark"),
    notEqual: computed(()=>"notEqual"),
    optional: computed(()=>"optional"),
    phone: computed(()=>"phone"),
    pwdLength: computed(()=>"pwdLength"),
    pwdPattern: computed(()=>"pwdPattern"),
    searchLength: computed(()=>"searchLength"),
    nickLength: computed(()=>"nickLength"),
    userLength: computed(()=>"userLength"),
    amountLength: computed(()=>"amountLength"),
    userPattern: computed(()=>"userPattern"),
    decimalPattern: computed(()=>"decimalPattern"),
    intPattern: computed(()=>"intPattern")
  });

  const fieldRules = defineFieldRules({
    validators,
    ruleChain: [
      { ident: pwdFieldName, rules: pwdRuleChain },
      { ident: nameFieldName, rules: nameRuleChain },
      { ident: confirmPwdFieldName, rules: confirmPwdRuleChain }
    ]
  });

  type R = typeof fieldRules;
  
  console.log("confirm rules:", fieldRules.confirmPasswordFieldName.rules);
  console.log("validators:", validators)

  const fieldConfigs = defineFieldConfigs<F, V, R>({
    fieldRules,
    validators: validators as any ,
    configBuilder: define => [
      define({
        fieldName: nameFieldName,
        payloadKey: nameKey,
        placeholder: computed(() => ""),
        label: computed(() => ""),
        ruleBuilder: rules => {
          return rules.userFieldName.rules;
        },
        valueBuilder: () => {
          return "";
        }
      }),
      define({
        fieldName: pwdFieldName,
        payloadKey: pwdKey,
        placeholder: computed(() => ""),
        label: computed(() => ""),
        ruleBuilder: rules => {
          return rules.passwordFieldName.rules;
        },
        valueBuilder: () => {
          return "";
        }
      }),
      define({
        fieldName: confirmPwdFieldName,
        payloadKey: confirmPwdKey,
        placeholder: computed(() => ""),
        label: computed(() => ""),
        ruleBuilder: rules => {
          return rules.confirmPasswordFieldName.rules;
        },
        valueBuilder: () => {
          return "";
        }
      })
    ]
  });
  

  const modelOption = formModelOption<F, V, R>({
    pickFields: ["username", "password", "confirm_password"],
    request(...args) {
      return { succeed: true };
    },
    validators: validators as any,
    messages: validatorMsg,
    onNotifyRectifyingExistingErrors: function (): void {
      throw new Error("Function not implemented.");
    },
    onBeforeSubmit: function (): void {
      throw new Error("Function not implemented.");
    },
    onAfterSubmit: function (): void {
      throw new Error("Function not implemented.");
    },
    onCatchSubmit: function (e: any): void {
      throw new Error("Function not implemented.");
    },
    config: fieldConfigs
  });

  model = new CreateUserFormModel(modelOption);
  nameContext = model.getContext(nameFieldName);
  pwdContext = model.getContext(pwdFieldName);

  console.log("fieldConfigs.username:", fieldConfigs.username.ruleChain.map((_)=>_));
  console.log("fieldConfigs.password:", fieldConfigs.password.ruleChain.map((_)=>_));

  // console.log("model.state.username:", model.state.username.ruleChain.map((_)=>_));
  // console.log("model.state.password:", model.state.password.ruleChain.map((_)=>_));

  return {
    model,
    modelOption,
    fieldConfigs,
    fieldRules,
    validatorMsg,
    validators,
    pwdField,
    pwdContext,
    nameField,
    nameContext,
    nameValidationErrorMsg,
    passwordValidationErrorMsg
  };
}