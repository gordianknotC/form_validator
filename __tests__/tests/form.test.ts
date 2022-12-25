import globalSetup from "../setup/globalSetup";
import { setupAValidatorTest, SetupAValidatorTestReturnType } from "../setup/setupFiles/aValidator.test.setup";

/** 
 * default 輸入驗䮴
 */
describe("Form", ()=>{
  beforeAll(async ()=>{
    await globalSetup();
  });
  // describe("BaseFormImpl", ()=>{
  // });
  describe("Validator", ()=>{
    describe("baseValidatorImpl - aValidator", ()=>{
      let S: SetupAValidatorTestReturnType;
      beforeAll(async ()=>{
        S = setupAValidatorTest()
      });
      test("username context validity", ()=>{
        const {model, modelOption, fieldConfigs, fieldRules, validatorMsg, validators, pwdContext, nameContext, pwdField, nameField} = S;
        expect(nameContext.name).toBe(nameField.name);
        expect(nameContext.payloadKey).toBe(nameField.payloadKey);

        nameContext.value = "abc";
        expect(validators.username.handler(nameContext)).toBeFalsy();

        nameContext.value = "John";
        expect(validators.username.handler(nameContext)).toBeTruthy();
      })

      test("password context validity", ()=>{
        const {model, modelOption, fieldConfigs, fieldRules, validatorMsg, validators, pwdContext, nameContext, pwdField, nameField} = S;
        expect(pwdContext.name).toBe(pwdField.name);
        expect(pwdContext.payloadKey).toBe(pwdField.payloadKey);

        pwdContext.value = "999";
        expect(validators.password.handler(pwdContext)).toBeFalsy();

        pwdContext.value = "1234";
        expect(validators.password.handler(pwdContext)).toBeTruthy();
      })

      test("expect ruleChain to be filled with fieldName", ()=>{
        expect(S.model.state.username.ruleChain.map((_)=>_.validatorName)).toEqual(["required", "username"]);
        expect(S.model.state.password.ruleChain.map((_)=>_.validatorName)).toEqual(["required", "password"]);
        expect(S.model.state.confirm_password.ruleChain.map((_)=>_.validatorName)).toEqual(["required", "password", "confirm"]);

        expect(S.model.state.nickname.ruleChain[0].appliedFieldName).toBe(S.model.state.nickname.name);
        expect(S.model.state.username.ruleChain[0].appliedFieldName).toBe(S.model.state.username.name);
        expect(S.model.state.password.ruleChain[0].appliedFieldName).toBe(S.model.state.password.name);
        expect(S.model.state.confirm_password.ruleChain[0].appliedFieldName).toBe(S.model.state.confirm_password.name);
      });

      test("expect linkName to be rendered validly", ()=>{
        const pwdValidator = S.model.state.password.ruleChain.find((_)=>_.validatorName == "password");
        const confirmPwdValidator = S.model.state.confirm_password.ruleChain.find((_)=>_.validatorName == "confirm");
        expect(pwdValidator!.appliedFieldName).toBe(S.pwdField.name);
        expect(confirmPwdValidator!.appliedFieldName).toBe(S.confirmPwdField.name);

        expect(pwdValidator!.linkedFieldName).toBeUndefined();
        expect(confirmPwdValidator!.linkedFieldName).toBe(S.pwdField.name);
      });

      test("type {username: 'Curtis'} expect errors", ()=>{
        S.model.state.username.value = "Curtis";
        S.model.notifyOnInput(S.nameField.payloadKey, "Curtis");
        expect(S.model.state.username.value).toBe("Curtis");
        expect(S.model.state.username.hasError).toBeTruthy();
        expect(S.model.state.username.fieldError).toBe(S.nameValidationErrorMsg);
      });

      test("type {username: 'John'} expect passed", ()=>{
        S.model.state.username.value = "John";
        S.model.notifyOnInput(S.nameField.payloadKey, "John");
        expect(S.model.state.username.hasError).toBeFalsy();
        expect(S.model.state.username.fieldError).toBe("");
        // S.model.notifyOnInput(S.pwdField.payloadKey, "996");
      });

      test("type {password: '996'} expect errors", ()=>{
        S.model.state.password.value = "996";
        S.model.notifyOnInput(S.pwdField.payloadKey, "996");
        expect(S.model.state.password.value).toBe("996");
        expect(S.model.state.password.hasError).toBeTruthy();
        expect(S.model.state.password.fieldError).toBe(S.passwordValidationErrorMsg);
      });

      test("type {password: '1234'} expect pass", ()=>{
        const val = "1234";
        S.model.state.password.value = val;
        S.model.notifyOnInput(S.pwdField.payloadKey, val);
        expect(S.model.state.password.value).toBe(val);
        expect(S.model.state.password.hasError).toBeFalsy();
        expect(S.model.state.password.fieldError).toBe("");
      });

      test("type {confirm_password: '1236'}, expect not confirmed with password", ()=>{
        const val = "1236";
        S.model.state.confirm_password.value = val;
        S.model.notifyOnInput(S.confirmPwdField.payloadKey, val);
        expect(S.model.state.confirm_password.value).toBe(val);
        expect(S.model.state.confirm_password.hasError).toBeTruthy();
        expect(S.model.state.confirm_password.fieldError).toBe(S.confirmPwdValidationErrorMsg);
        
        expect(S.model.state.confirm_password.name).toBe(S.confirmPwdField.name);
        expect(S.model.state.password.name).toBe(S.model.state.password.name);
        expect(S.model.getContext(S.pwdField.name).getLinkedFieldName("password")).toBeUndefined();
        expect(S.model.getContext(S.confirmPwdField.name).getLinkedFieldName("confirm")).toBe(S.pwdField.name);
      });
      // test("", ()=>{

      // });
      // test("", ()=>{

      // });
      // test("", ()=>{

      // });
      
    });
    // describe("Validator Configuration", ()=>{
    //   test("", ()=>{
    //     expect(true).toBeTruthy();
    //   });
    // });

    // describe("Validator Handler", ()=>{
    //   test("", ()=>{
    //     expect(true).toBeTruthy();
    //   });
    // });
    
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






