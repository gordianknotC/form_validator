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
import { TestHelper } from "../../helper/testHelper.validator";
import { EFieldNames } from "./payload.test.setup";

type F = { 
  nickname: string;
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
let nicknameContext: IBaseFormContext<F, F, V>;
let pwdContext: IBaseFormContext<F, F, V>;
let confirmPwdContext: IBaseFormContext<F, F, V>;

let nameRuleChain: ArrayDelegate<InternalValidator<V>>;
let pwdRuleChain: ArrayDelegate<InternalValidator<V>>;
let confirmPwdRuleChain: ArrayDelegate<InternalValidator<V>>;

let validators: InternalValidators<V>;


const nicknameKey: FormKey<F, F, V> = "nickname";
const nicknameFieldName = EFieldNames.nickname;

const nameKey: FormKey<F, F, V> = "username";
const nameFieldName = EFieldNames.username;

const pwdKey: FormKey<F, F, V> = "password";
const pwdFieldName = EFieldNames.password;

const confirmPwdKey: FormKey<F, F, V> = "confirm_password";
const confirmPwdFieldName = EFieldNames.confirmPasswordOnSignUp;

let nameField: FormField<F, F, V>;
let nicknameField: FormField<F, F, V>;
let pwdField: FormField<F, F, V>;
let confirmPwdField: FormField<F, F, V>;
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
  pwdKey: string,
  pwdField: typeof pwdField;
  pwdContext: IBaseFormContext<F, F, V>;
  nameKey: string,
  nameField: typeof nameField;
  nameContext: IBaseFormContext<F, F, V>;

  nicknameKey: string,
  nicknameField: typeof nicknameField;
  nicknameContext: IBaseFormContext<F, F, V>;

  confirmPwdKey: string,
  confirmPwdField: typeof confirmPwdField;
  confirmPwdContext: IBaseFormContext<F, F, V>;
  nameValidationErrorMsg: string,
  passwordValidationErrorMsg: string,
  confirmPwdValidationErrorMsg: string,
};
export function setupAValidatorTest(): SetupAValidatorTestReturnType {
  const nameValidationErrorMsg = TestHelper.nameValidationErrorMsg;
  const passwordValidationErrorMsg = TestHelper.passwordValidationErrorMsg;  
  const confirmPwdValidationErrorMsg = TestHelper.confirmPwdValidationErrorMsg;
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
        return ctx.value.length == 4;
      }
    },
  ]);

  nameRuleChain = Arr([validators.required, validators.username]);
  pwdRuleChain = Arr([validators.required, validators.password]);
  confirmPwdRuleChain = Arr([validators.required, validators.password, validators.confirm.linkField({fieldName: pwdFieldName})]);

  nameField = {
    payloadKey: nameKey,
    name: nameFieldName,
    defaultValue: "guest",
    value: "",
    label: computed(() => ""),
    ruleChain: nameRuleChain,
    placeholder: computed(() => "")
  };

  nicknameField = {
    payloadKey: nicknameKey,
    name: nicknameFieldName,
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

  confirmPwdField = {
    payloadKey: confirmPwdKey,
    name: confirmPwdFieldName,
    defaultValue: "",
    value: "",
    label: computed(() => ""),
    ruleChain: confirmPwdRuleChain,
    placeholder: computed(() => "")
  };

  validatorMsg = defineValidationMsg({
    username: computed(()=>nameValidationErrorMsg),
    password: computed(()=>passwordValidationErrorMsg),
    confirm: computed(()=>confirmPwdValidationErrorMsg),
    required: computed(()=>"required"),
    bail: computed(()=>"bail"),
    greater: computed(()=>"greater"),
    lesser: computed(()=>"lesser"),
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
  
  const fieldConfigs = defineFieldConfigs<F, V, R>({
    fieldRules,
    validators: validators as any ,
    configBuilder: define => [
      define({
        fieldName: EFieldNames.username,
        payloadKey: nameKey,
        placeholder: computed(() => ""),
        label: computed(() => ""),
        ruleBuilder: rules => {
          return rules.username.rules;
        },
        valueBuilder: () => {
          return "Guest";
        }
      }),
      define({
        fieldName: EFieldNames.nickname,
        payloadKey: nicknameKey,
        placeholder: computed(() => ""),
        label: computed(() => ""),
        ruleBuilder: rules => {
          return rules.username.rules;
        },
        valueBuilder: () => {
          return "OK";
        }
      }),
      define({
        fieldName: pwdFieldName,
        payloadKey: pwdKey,
        placeholder: computed(() => ""),
        label: computed(() => ""),
        ruleBuilder: rules => {
          return rules.password.rules;
        },
        valueBuilder: () => {
          return "";
        }
      }),
      define({
        fieldName: EFieldNames.confirmPasswordOnSignUp,
        payloadKey: confirmPwdKey,
        placeholder: computed(() => ""),
        label: computed(() => ""),
        ruleBuilder: rules => {
          return rules.confirmPasswordOnSignUp.rules;
        },
        valueBuilder: () => {
          return "";
        }
      })
    ]
  });
  

  const modelOption = formModelOption<F, V, R>({
    pickFields: ["username", "password", "confirm_password", "nickname"],
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
  nicknameContext = model.getContext(nicknameFieldName);
  nameContext = model.getContext(nameFieldName);
  pwdContext = model.getContext(pwdFieldName);
  confirmPwdContext = model.getContext(confirmPwdFieldName);
  // //
  // console.group("fields");
  // console.log("username", fieldConfigs.username);
  // console.groupEnd();
  // //
  // console.group("validators");
  // console.log("fieldConfigs.username:", fieldConfigs.username.ruleChain.find((_)=>_.validatorName == "username"));
  // console.log("fieldConfigs.password:", fieldConfigs.password.ruleChain.find((_)=>_.validatorName == "password"));
  // console.log("fieldConfigs.confirm_password:", fieldConfigs.confirm_password.ruleChain.find((_)=>_.validatorName == "confirm"));
  // console.groupEnd();

  return {
    model,
    modelOption,
    fieldConfigs,
    fieldRules,
    validatorMsg,
    validators,
    pwdKey,
    pwdField,
    pwdContext,
    confirmPwdKey,
    confirmPwdField,
    confirmPwdContext,
    nameKey,
    nameField,
    nameContext,
    nicknameKey,
    nicknameField,
    nicknameContext,
    nameValidationErrorMsg,
    passwordValidationErrorMsg,
    confirmPwdValidationErrorMsg
  };
}
