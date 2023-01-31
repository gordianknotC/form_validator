import { computed, reactive, ref, watch } from "vue";
import {
  flattenInstance,
  setupComputed,
  setupCurrentEnv,
  setupReactive,
  setupRef,
  setupWatch
} from "@gdknot/frontend_common";
setupComputed(computed);
setupReactive(reactive);
setupRef(ref);
setupWatch(watch);
setupCurrentEnv("develop");

import { createReactiveFormModel } from "@/index";
import { is } from "@gdknot/frontend_common";
import { helper, TestHelper } from "../helper/testHelper.validator";
import {
  setupAValidatorTest,
  SetupAValidatorTestReturnType
} from "../setup/setupFiles/aValidator.test.setup";
import {
  CreateUserFormModel,
  createUserFormModelOption
} from "../setup/setupFiles/formModel.test.setup";
import { EFieldNames } from "../setup/setupFiles/payload.test.setup";
import { EAdditionalValidatorIdents, validatorIdents } from "../setup/setupFiles/formConfig.test.setup";
import { undefinedValidationErrorMessage } from "@/constants";


describe("Validator", () => {
  describe("baseValidatorImpl - aValidator", () => {
    let S: SetupAValidatorTestReturnType;
    beforeAll(async () => {
      S = setupAValidatorTest();
    });

    test("check validatorIdents to see if it's valid defined", ()=>{
      const idents = Object.keys(validatorIdents);
      const expected = new Set([
        ...Object.keys(validatorIdents),
        ...Object.keys(EAdditionalValidatorIdents)
      ]);
      expect(idents).toEqual([...expected])
    });
    
    test("defaultValue check before any typing", () => {
      helper.expectDefaultValue(S.model.state as any, {
        username: "Guest",
        nickname: "OK",
        password: "",
        confirm_password: ""
      });
    });

    test("required field not being filled, expect cannot be submit", () => {
      helper.expectCannotSubmitBeforeTyping(S.model as any);
    });

    test("username field context validity", () => {
      const {
        model,
        modelOption,
        fieldConfigs,
        fieldRules,
        validatorMsg,
        validators,
        pwdContext,
        nameContext,
        pwdField,
        nameField
      } = S;
      helper.expectFieldValidity({
        model: S.model as any,
        field: nameField,
        validValue: "John",
        valueWithError: "abc",
        validatorName: "username"
      });
    });

    test("password field context validity", () => {
      const {
        model,
        modelOption,
        fieldConfigs,
        fieldRules,
        validatorMsg,
        validators,
        pwdContext,
        nameContext,
        pwdField,
        nameField
      } = S;
      helper.expectFieldValidity({
        model: S.model as any,
        field: pwdField,
        validValue: "1234",
        valueWithError: "999",
        validatorName: "password"
      });
    });

    test("defaultValue check after typing", () => {
      helper.expectDefaultValue(S.model.state as any, {
        username: "Guest",
        nickname: "OK",
        password: "",
        confirm_password: ""
      });
    });

    test("expect ruleChain to be filled with fieldName and linked to other field if necessary", () => {
      helper.expectRuleChainValidity({
        field: S.model.state.username as any,
        expectValidators: ["required", "username"],
        appliedFieldName: EFieldNames.username,
        linkedFieldName: undefined
      });
      helper.expectRuleChainValidity({
        field: S.model.state.password as any,
        expectValidators: ["required", "password"],
        appliedFieldName: EFieldNames.password,
        linkedFieldName: undefined
      });
      helper.expectRuleChainValidity({
        field: S.model.state.confirm_password as any,
        expectValidators: ["required","bail",  "password", "confirm"],
        appliedFieldName: EFieldNames.confirmPasswordOnSignUp,
        linkedFieldName: EFieldNames.password
      }); 
    });

    test("before typing - cannot submit", () => {
      helper.expectCannotSubmit(S.model as any);
    });

    test("expect confirm field linked with password field", () => {
      const master = S.pwdField;
      const slave = S.confirmPwdField;
      helper.expectLinked({
        master,
        slave,
        validatorName: "confirm"
      });
    });

    test("type {username: 'Curtis'} expect errors", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.username as any,
        value: "Curtis",
        expectedError: S.nameValidationErrorMsg
      });
    });

    test("type {username: 'John'} expect passed", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.username as any,
        value: "John",
        expectedError: ""
      });
    });

    test("type {nickname: 'John'} expect passed", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.nickname as any,
        value: "John",
        expectedError: ""
      });
    });

    test("type {password: '996'} expect errors", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.password as any,
        value: "996",
        expectedError: S.passwordValidationErrorMsg
      });
    });

    test("type {password: '1234'} expect pass", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.password as any,
        value: "1234",
        expectedError: ""
      });
    });

    test("type {confirm_password: '1236'}, expect not confirmed with password", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.confirm_password as any,
        value: "1236",
        expectedError: S.confirmPwdValidationErrorMsg
      });
    });

    test("type {confirm_password: '1234'}, expect pass", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.confirm_password as any,
        value: "1234",
        expectedError: ""
      });
    });

    test("expect form can be submit", () => {
      helper.expectCanSubmit(S.model as any);
    });

    test("expect all fields are not in defaults", () => {
      helper.expectNotDefaultValue(S.model.state as any);
    });

    test("reset state", () => {
      helper.resetState(S.model as any);
    });

    test("expect cannot submit", () => {
      helper.expectCannotSubmit(S.model as any);
    });

    test("type {confirm_password: 'hello'}, expect multiple error messages stacked", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.confirm_password as any,
        value: "hello",
        expectedError: ['validate password error',  'confirm password error'].join("\n")
      });
    });

    test("leave {confirm_password: ''} empty, expect no multiple error messages stacked, since bail is behind required", () => {
      helper.typing({
        model: S.model as any,
        field: S.model.state.confirm_password as any,
        value: "",
        expectedError: 'validate password error'
      });
    });
  });

  // todo: 補足其他 validator
});