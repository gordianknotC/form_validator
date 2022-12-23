import globalSetup from "../setup/globalSetup";
import { setupAValidatorTest, SetupAValidatorTestReturnType } from "../setup/setupFiles/aValidator.test.setup";

/**
 * 
 * default 輸入驗䮴
 * 
 */
describe("Form", ()=>{
  // describe("BaseFormImpl", ()=>{
  // });
  test("", ()=>{
    expect(true).toBeTruthy();
  });
  describe("Validator", ()=>{
    test("", ()=>{
      expect(true).toBeTruthy();
    });
    describe("baseValidatorImpl - aValidator", ()=>{
      let setup: SetupAValidatorTestReturnType;
      beforeAll(async ()=>{
        await globalSetup();
        setup = setupAValidatorTest()
      });
      test("declare validator by aValidator", ()=>{
        const {model, modelOption, fieldConfigs, fieldRules, validatorMsg, validators, pwdContext, nameContext, pwdField, nameField} = setup;
        expect(nameContext.name).toBe(nameField.name);
        expect(nameContext.payloadKey).toBe(nameField.payloadKey);
        nameContext.value = "abc";
        expect(validators.name.handler(nameContext)).toBeFalsy;
        nameContext.value = "John";
        expect(validators.name.handler(nameContext)).toBeTruthy;
        expect(true).toBeTruthy;
      })
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






