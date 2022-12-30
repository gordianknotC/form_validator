import { FormField, FormState } from "@/base/types/formTYpes";
import {
  BaseFormImpl,
  BaseFormModel,
  IBaseFormModel,
  InternalValidator
} from "@/index";

type Rule = InternalValidator<any>;
type Field = FormField<any, any, any>;
type Model = BaseFormImpl<any, any, any>;

export class TestHelper {
  static nameValidationErrorMsg = "validate name error";
  static passwordValidationErrorMsg = "validate password error";
  static confirmPwdValidationErrorMsg = "confirm password error";

  constructor() {}
  expectDefaultValue<F>(
    state: FormState<F, any, any>,
    defaults: Record<keyof F, any>
  ) {
    Object.entries(defaults).forEach(field => {
      const [key, val] = field;
      expect(state[key].defaultValue).toBe(val);
    });
  }
  expectNotDefaultValue<F>(state: FormState<F, any, any>) {
    Object.entries(state).forEach(field => {
      const [key, val] = field;
      expect(state[key].defaultValue).not.toBe(state[key].value);
    });
  }
  expectCannotSubmit(model: BaseFormImpl<any, any, any>) {
    expect(model.canSubmit.value).toBeFalsy();
  }
  expectCanSubmit(model: BaseFormImpl<any, any, any>) {
    expect(model.canSubmit.value).toBeTruthy();
  }
  expectCannotSubmitBeforeTyping(model: BaseFormImpl<any, any, any>) {
    this.expectCannotSubmit(model);
  }
  expectFieldValidity(option: {
    model: BaseFormImpl<any, any, any>;
    field: FormField<any, any, any>;
    validValue: any;
    valueWithError: any;
    validatorName: string;
  }) {
    const { model, field, validValue, valueWithError, validatorName } = option;
    const context = model.getContext(field.fieldName);
    //
    expect(context.fieldName).toBe(field.fieldName);
    expect(context.payloadKey).toBe(field.payloadKey);
    //
    const validator = context.ruleChain.firstWhere(
      _ => _.validatorName == validatorName
    );
    context.value = valueWithError;
    expect(validator?.handler(context)).toBeFalsy();
    context.value = validValue;
    expect(validator?.handler(context)).toBeTruthy();
  }
  expectRuleChainValidity(option: {
    field: FormField<any, any, any>;
    expectValidators: string[];
    appliedFieldName: string;
    linkedFieldName: any;
  }) {
    const { field, expectValidators, appliedFieldName, linkedFieldName } =
      option;
    expect(
      field.ruleChain.map(
        _ => _.validatorName,
        `ValidatorName in ruleChain not matched with expected one. `
      )
    ).toEqual(expectValidators);

    expect(
      field.ruleChain.every(_ => _._appliedFieldName == appliedFieldName),
      `Not every validator in ruleChain applied to expected fieldName: ${appliedFieldName}. Actual: ${field.ruleChain.map(
        _ => _._appliedFieldName
      )}`
    ).toBeTruthy();

    if (linkedFieldName) {
      expect(
        field.ruleChain.find(_ => _._linkedFieldName == linkedFieldName),
        `Expect find the target linked field`
      ).not.toBeUndefined();
    } else {
      expect(
        field.ruleChain.every(_ => _._linkedFieldName == linkedFieldName),
        `Expect no target linked field`
      ).toBeTruthy();
    }
  }

  expectLinked(option: { master: Field; slave: Field; validatorName: string }) {
    const { master, slave, validatorName } = option;
    const slaveRule = slave.ruleChain!.find(
      _ => _.validatorName == validatorName
    );
    expect(
      slaveRule?._linkedFieldName,
      `Master - fieldName: ${master.fieldName}\n` +
        `Slave - appliedField: ${String(
          slaveRule?._appliedFieldName
        )}, linkedField: ${String(slaveRule?._linkedFieldName)}`
    ).toBe(master.fieldName);
  }

  typing(option: {
    model: Model;
    field: Field;
    value: any;
    expectedError: string;
  }) {
    const { model, field, value, expectedError } = option;
    field.value = value;
    model.notifyOnInput(field.payloadKey, value);
    expect(field.value).toBe(value);
    if (expectedError) {
      expect(field.hasError, "expect typing with error").toBeTruthy();
      expect(field.fieldError).toBe(expectedError);
    } else {
      expect(field.hasError,  "expect typing with no error").toBeFalsy();
      expect(field.fieldError).toBe("");
    }
  }
  resetState(model: BaseFormImpl<any, any, any>) {
    model.resetState();
    const state = model.state;
    Object.entries(state).forEach(pair => {
      const [key, field] = pair;
      expect(field.defaultValue).toBe(field.value);
    });
  }
  resetInitialState() {}

  expectTwoIdenticalRuleChain(A: Rule[], B: Rule[]) {
    for (let index = 0; index < A.length; index++) {
      const ruleA = A[index];
      const ruleB = B[index];
      expect(ruleA).toEqual(ruleB);
    }
  }

  expectTwoIdenticalField(A: Field, B: Field) {
    expect(A.defaultValue).toBe(B.defaultValue);
    expect(A.value).toBe(B.value);
    expect(A.fieldError).toBe(B.fieldError);
    expect(A.fieldType).toBe(B.fieldType);
    expect(A.fieldName).toBe(B.fieldName);
    expect(A.payloadKey).toBe(B.payloadKey);
    expect(A.placeholder.value).toBe(A.placeholder.value);
    expect(A.label.value).toBe(A.label.value);
    this.expectTwoIdenticalRuleChain(A.ruleChain, B.ruleChain);
  }

  expectTwoIdenticalFormModel(A: Model, B: Model) {
    Object.entries(A.state).forEach(pair => {
      const [key, fieldA] = pair;
      const fieldB = B.state[key];
      this.expectTwoIdenticalField(fieldA, fieldB);
    });
  }
}

export const helper = new TestHelper();
