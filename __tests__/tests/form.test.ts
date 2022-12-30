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
import { is } from "@gdknot/frontend_common/dist/utils/typeInference";
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

/**
 * default 輸入驗䮴
 */
describe("Form", () => {
  // describe("BaseFormImpl", ()=>{
  // });
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
  });

  describe("BaseFormImpl", () => {
    let modelA: CreateUserFormModel;
    let modelB: CreateUserFormModel;
    beforeAll(async () => {
      modelA = new CreateUserFormModel(createUserFormModelOption);
      modelB = createReactiveFormModel({
        ...createUserFormModelOption,
        getPayload() {
          const result = super.getPayload();
          if (is.empty(result.remark)) {
            result.remark = null;
          }
          delete result.confirm_password;
          return result;
        }
      });
    });

    test("expect both oop and fp form model are the same", () => {
      helper.expectTwoIdenticalFormModel(modelA as any, modelB as any);
    });

    test("expect ruleChain to be filled with fieldName and linked to other field as expectedly", () => {
      helper.expectRuleChainValidity({
        field: modelA.state.username as any,
        expectValidators: ["required", "userLength", "userPattern"],
        appliedFieldName: EFieldNames.username,
        linkedFieldName: undefined
      });
      const pwdRule = [ "bail", "required", "pwdLength", "pwdPattern"];
      const cardNumberRule = ["required", "insureNumber"];
      helper.expectRuleChainValidity({
        field: modelA.state.password as any,
        expectValidators:pwdRule,
        appliedFieldName: EFieldNames.password,
        linkedFieldName: undefined
      });
      helper.expectRuleChainValidity({
        field: modelA.state.confirm_password as any,
        expectValidators:[...pwdRule, "confirm"],
        appliedFieldName: EFieldNames.confirmPasswordOnSignUp,
        linkedFieldName: EFieldNames.password
      });
      helper.expectRuleChainValidity({
        field: modelA.state.confirm_new_password as any,
        expectValidators:[...pwdRule, "confirm"],
        appliedFieldName: EFieldNames.confirmPasswordOnResetPassword,
        linkedFieldName: EFieldNames.newPassword
      });
      helper.expectRuleChainValidity({
        field: modelA.state.card_number as any,
        expectValidators:cardNumberRule,
        appliedFieldName: EFieldNames.cardNumber,
        linkedFieldName: undefined
      });
      helper.expectRuleChainValidity({
        field: modelA.state.card_number_A as any,
        expectValidators:[...cardNumberRule, "insureMatch"],
        appliedFieldName: EFieldNames.cardNumberA,
        linkedFieldName: EFieldNames.cardNumber
      });
      helper.expectRuleChainValidity({
        field: modelA.state.card_number_B as any,
        expectValidators:[...cardNumberRule, "insureMismatch"],
        appliedFieldName: EFieldNames.cardNumberB,
        linkedFieldName: EFieldNames.cardNumberA
      });
    });

    describe("Validator linkage", ()=>{
      test("expect confirm_password field linked with password field", () => {
        const master = modelA.state.password as any;
        const slave = modelA.state.confirm_password as any;
        helper.expectLinked({
          master,
          slave,
          validatorName: "confirm"
        });
      });
      test("expect new_password field linked with password field", () => {
        const master = modelA.state.password as any;
        const slave = modelA.state.new_password as any;
        helper.expectLinked({
          master,
          slave,
          validatorName: "notEqual"
        });
      });
      test("expect card_numberA field linked with card_number field", () => {
        const master = modelA.state.card_number as any;
        const slave = modelA.state.card_number_A as any;
        helper.expectLinked({
          master,
          slave,
          validatorName: "insureMatch"
        });
      });
      test("expect card_numberA field linked with card_number field", () => {
        const master = modelA.state.card_number_A as any;
        const slave = modelA.state.card_number_B as any;
        helper.expectLinked({
          master,
          slave,
          validatorName: "insureMismatch"
        });
      });
    });
    

    test("before typing - cannot submit", () => {
      helper.expectCannotSubmit(modelA as any);
      helper.expectCannotSubmit(modelB as any);
    });

    describe("Validator - simple username", ()=>{
      test("type {username: 'Curtis'} expect pass", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.username as any,
          value: "Curtis",
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.username as any,
          value: "Curtis",
          expectedError: ""
        });
      });
  
      test("type {nickname: 'John'} expect passed", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.nickname as any,
          value: "John",
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.nickname as any,
          value: "John",
          expectedError: ""
        });
      });
    });

    describe("Validator - simple password", ()=>{
      test("type {password: '996'} expect errors", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.password as any,
          value: "996",
          expectedError: `${undefinedValidationErrorMessage}"pwdLength"`
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.password as any,
          value: "996",
          expectedError: `${undefinedValidationErrorMessage}"pwdLength"`
        });
      });
  
      test("type {password: '123456789'} expect pass", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.password as any,
          value: "123456789",
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.password as any,
          value: "123456789",
          expectedError: ""
        });
      });
    });

    describe("LinkedValidator - confirm, notEqual", ()=>{
      test("type {confirm_password: '1234567890'}, expect should be identical with password", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.confirm_password as any,
          value: "1234567890",
          expectedError: `${undefinedValidationErrorMessage}"confirm"`
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.confirm_password as any,
          value: "1234567890",
          expectedError: `${undefinedValidationErrorMessage}"confirm"`
        });
      });
  
      test("type {confirm_password: '123456789'}, expect no error", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.confirm_password as any,
          value: "123456789",
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.confirm_password as any,
          value: "123456789",
          expectedError: ""
        });
      });
  
  
      test("type {new_password: '123456789'} expect should be not equal to password", () => {
        console.log("type {new_password: '123456789'}");
        helper.typing({
          model: modelA as any,
          field: modelA.state.new_password as any,
          value: "123456789",
          expectedError: `${undefinedValidationErrorMessage}"notEqual"`
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.new_password as any,
          value: "123456789",
          expectedError: `${undefinedValidationErrorMessage}"notEqual"`
        });
      });
  
      test("type {new_password: '12345678090'} expect pass", () => {
        console.log("type {new_password: '1234567890'}");
        helper.typing({
          model: modelA as any,
          field: modelA.state.new_password as any,
          value: "1234567890",
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.new_password as any,
          value: "1234567890",
          expectedError: ""
        });
      });
      
  
      test("type {confirm_new_password: '123456789'} expect should be identical to new_password", () => {
        console.log("type {confirm_new_password: '123456789'}");
        helper.typing({
          model: modelA as any,
          field: modelA.state.confirm_new_password as any,
          value: "123456789",
          expectedError: `${undefinedValidationErrorMessage}"confirm"`
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.confirm_new_password as any,
          value: "123456789",
          expectedError: `${undefinedValidationErrorMessage}"confirm"`
        });
      });
  
      test("type {confirm_new_password: '12345678090'} expect pass", () => {
        console.log("type {confirm_new_password: '1234567890'}");
        helper.typing({
          model: modelA as any,
          field: modelA.state.confirm_new_password as any,
          value: "1234567890",
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.confirm_new_password as any,
          value: "1234567890",
          expectedError: ""
        });
      });
    });
    
    describe("UserDefined LinkedValidator - insureMatch/insureMismatch", ()=>{
      test("type {card_number: 36767}, expect pass", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.card_number as any,
          value: 36767,
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.card_number as any,
          value: 36767,
          expectedError: ""
        });
      });
  
      test("type {card_number_A: 36766} which applies an user defined validator, expect error", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.card_number_A as any,
          value: 36766,
          expectedError: `${undefinedValidationErrorMessage}"insureMatch"`
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.card_number_A as any,
          value: 36766,
          expectedError:  `${undefinedValidationErrorMessage}"insureMatch"`
        });
      });
  
      test("type {card_number_A: 36767} which applies an user defined validator, expect no error", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.card_number_A as any,
          value: 36767,
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.card_number_A as any,
          value: 36767,
          expectedError: ""
        });
      });
  
      test("type {card_number_B: 36767} which applies an user defined validator, expect error", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.card_number_B as any,
          value: 36767,
          expectedError: `${undefinedValidationErrorMessage}"insureMismatch"`
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.card_number_B as any,
          value: 36767,
          expectedError:  `${undefinedValidationErrorMessage}"insureMismatch"`
        });
      });
  
      test("type {card_number_B: 36766} which applies an user defined validator, expect no error", () => {
        helper.typing({
          model: modelA as any,
          field: modelA.state.card_number_B as any,
          value: 36766,
          expectedError: ""
        });
        helper.typing({
          model: modelB as any,
          field: modelB.state.card_number_B as any,
          value: 36766,
          expectedError: ""
        });
      });
    });
   

    test("expect form can be submit", () => {
      helper.expectCanSubmit(modelA as any);
      helper.expectCanSubmit(modelB as any);
    });

    test("type {remark:'abc'}, expect pass", () => {
      helper.typing({
        model: modelA as any,
        field: modelA.state.remark as any,
        value: "abc",
        expectedError: ""
      });
      helper.typing({
        model: modelB as any,
        field: modelB.state.remark as any,
        value: "abc",
        expectedError: ""
      });
    });


    test("expect all fields are not in defaults", () => {
      helper.expectNotDefaultValue(modelA.state as any);
      helper.expectNotDefaultValue(modelB.state as any);
    });

    test("reset state", () => {
      helper.resetState(modelA as any);
      helper.resetState(modelB as any);
    });

    test("expect cannot submit", () => {
      helper.expectCannotSubmit(modelA as any);
      helper.expectCannotSubmit(modelB as any);
    });
  });

  // describe("Rules", ()=>{
  //   describe("Rules Configuration", ()=>{
  //     test("", ()=>{
  //       expect(true).toBeTruthy();
  //     });
  //   });

  //   describe("Validation tests", ()=>{
  //     test("", ()=>{
  //       expect(true).toBeTruthy();
  //     });
  //   });

  //   test("", ()=>{
  //     expect(true).toBeTruthy();
  //   });
  // });

  // describe("FieldConfig builder", ()=>{
  //   test("", ()=>{
  //     expect(true).toBeTruthy();
  //   });
  // });
});
