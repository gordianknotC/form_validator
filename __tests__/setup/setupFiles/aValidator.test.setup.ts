import {
  aValidator,
  BaseFormImpl,
  defineFieldConfigs,
  defineFieldRules,
  defineValidationMsg,
  formModelOption,
  VForm
} from "~/index";
import {
  Arr,
  ArrayDelegate,
  flattenInstance,
  is
} from "@gdknot/frontend_common";
import { computed, reactive } from "vue";

type F = { username: string; password: string };
type V = { name: any; password: any; required: any };

let requiredValidator: VForm.InternalValidator<V>;
let nameValidator: VForm.InternalValidator<V>;
let passwordValidator: VForm.InternalValidator<V>;
let validatorMsg: VForm.ValidationMessages<V>;

let nameContext: VForm.IBaseFormContext<F, F, V>;
let pwdContext: VForm.IBaseFormContext<F, F, V>;

let nameRuleChain: ArrayDelegate<VForm.InternalValidator<V>>;
let pwdRuleChain: ArrayDelegate<VForm.InternalValidator<V>>;

let validators: VForm.InternalValidators<V>;

const nameKey: VForm.FormKey<F, F, V> = "username";
const nameFieldName = "userFieldName";

const pwdKey: VForm.FormKey<F, F, V> = "password";
const pwdFieldName = "passwordFieldName";

let nameField: VForm.FormField<F, F, V>;
let pwdField: VForm.FormField<F, F, V>;

class CreateUserFormModel extends BaseFormImpl<F, F, V> {
  constructor(option: VForm.FormOption<F, F, V>) {
    flattenInstance(super(option));
    this.state.username.value = "guest";
  }
  getPayload(): Record<VForm.FormKey<F, F, V>, any> {
    return super.getPayload();
  }
}

let model: CreateUserFormModel;

export type SetupAValidatorTestReturnType = {
  model: typeof model;
  modelOption: VForm.FormOption<F, F, V>;
  fieldConfigs: VForm.UDFieldConfigs<F, V>;
  fieldRules: VForm.UDFieldRules<any, V>;
  validatorMsg: typeof validatorMsg;
  validators: typeof validators;
  pwdField: typeof pwdField;
  pwdContext: VForm.IBaseFormContext<F, F, V>;
  nameField: typeof nameField;
  nameContext: VForm.IBaseFormContext<F, F, V>;
};
export function setupAValidatorTest(): SetupAValidatorTestReturnType {
  requiredValidator = aValidator({
    validatorName: "required",
    handler(ctx, ...args: any[]) {
      return true;
    }
  });
  nameValidator = aValidator({
    validatorName: "name",
    handler(ctx, ...args: any[]) {
      return ctx.value == "John";
    }
  });
  passwordValidator = aValidator({
    validatorName: "password",
    handler(ctx, ...args: any[]) {
      return ctx.value == "1234";
    }
  });
  validators = {
    name: nameValidator,
    password: passwordValidator,
    required: requiredValidator
  };
  nameRuleChain = Arr([validators.required, validators.name]);
  pwdRuleChain = Arr([validators.required, validators.password]);

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
    name: undefined,
    password: undefined,
    required: undefined
  });

  const fieldRules = defineFieldRules({
    validators,
    ruleChain: [
      { ident: pwdFieldName, rules: pwdRuleChain },
      { ident: nameFieldName, rules: nameRuleChain }
    ]
  });

  type R = typeof fieldRules;

  const fieldConfigs = defineFieldConfigs<F, V, R>({
    fieldRules,
    validators,
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
      })
    ]
  });

  const modelOption = formModelOption<F, V, R>({
    pickFields: ["username", "password"],
    request(...args) {
      return { succeed: true };
    },
    validators,
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
    nameContext
  };
}
