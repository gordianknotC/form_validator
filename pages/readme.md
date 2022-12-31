

<!--#-->

表單驗證工具

# 安裝
```bash
yarn add @gdknot/frontend_common
```

# Feature

- 使用者自定義「驗證規則」／「驗證子」。
- 「驗證子」提供基本驗證邏輯，「驗證規則」由多個「驗證子」串連，以進行多層驗證。
- 「驗證子」支援雙欄位連結，以查找其他欄位進行驗證。
- 提供 ui 層輪入事件，以利ui整合
    - 事件
        - input
        - focus
    - 屬性
        - hasError
        - fieldErrors
        - canSubmit
    - submit mediator
        - beforeSubmit
        - onSubmit
        - afterSubmit
        - catchSubmit
- 相依分離於各大 UI framework (Vue/Reactive) －未完全測試

# 概述

一般表單驗證流程可分為，「欄位驗證」，「表單驗證」，「表單驗證」又包括蒐集原「欄位驗證」的錯誤集合與取得遠端錯誤集合，綜合以後再進行判斷，而「欄位驗證」又包括驗證子(Validator) 及驗證規則(Rule), 驗證規則是由許多驗證子（Validator) 所組成的，如，password 的驗證規則可能是由以下組成。

```ts
const passwordRule = [
	validators.required, validators.pwdLength, validators.pwdPattern
]
```

一個應用程式或網站，為了重複使用這些規則，可以進行全局定義，如：

```ts
export const fieldRules = defineFieldRules({
    validators: V,
    ruleChain: [
        {ident: EFieldNames.password, rules: ruleOfPassword},
        {ident: "confirmPassword", rules: [
            ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.password})
        ]},
        {ident: "newPassword", rules: [
            ...ruleOfPassword, V.notEqual.linkField!({fieldName: EFieldNames.password})
        ]},
        {ident: "confirmNewPassword", rules: [
            ...ruleOfPassword, V.confirm.linkField!({fieldName: EFieldNames.newPassword})
        ]},
        {ident: "username", rules: [
            V.required, V.userLength, V.userPattern  
        ]},
        {ident: "nickname", rules: [
            V.required, V.nickLength, V.userPattern  
        ]},
        {ident: "remark", rules: [
            V.optional
        ]} ]})
```

並在對應的表單內容中重複使用，不同的欄位名稱需要定義不同的驗證規則，及驗證規則相應所需要的錯誤信息，如

```ts
const validatorMsg = defineValidationMsg({
    pwdPattern: computed(()=>"..."),
    pwdLength: computed(()=>"..."),
    ...
});
```

欄位設定包括了不同「欄位名」所需要的相應資料，如

- payloadKey
- validation rule
- defaultValue

```ts
export const fieldConfigs = defineFieldConfigs<Fields, V, R>({
    fieldRules,
    validators,
    configBuilder: (define)=>([
        define({
            fieldName: EFieldNames.confirmPasswordOnSignUp,
            payloadKey: "confirm_password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.confirmPassword.rules;
            },
            valueBuilder: ()=>{
                return null;
            }
        }),
				define({
            fieldName: EFieldNames.password,
            payloadKey: "password",
            placeholder: computed(()=> ""),
            label: computed(()=> ""),
            ruleBuilder: (rules)=>{
                return rules.password.rules;
            },
            valueBuilder: ()=>{
                return "";
            }
        }),
```

當具備以上設定以後，便能重複利用以上設定套用在 UI 層，UI層的應用，應與任何 UI Framework，獨立出來，理論上應能夠被各大框架上使用（目前只測試過 Vue），不同ui framework 的 Reactive 方法以外部注入的方式注入，以達成相依分離，以下細部說明 Validator / Rule / FormField / FormConfig / FormModel 的構成。

- **Validator** － 驗證子，處理欄位基本驗證邏輯。
- **Rule** － 驗證規則，由多個驗證子串連。
- **FormConfig** － 表單設定，用來設定欄位名所對應相關的驗證設定方式。
- **FormField** － 欄位名對所對應的欄位物件，與 UI 連連結時會需要存取欄位物件。
- **Form** － 表單物件，包括表單處理及欄位集合所需的相關控制。

# Table of Content
<!-- START doctoc -->
<!-- END doctoc -->







[s-FormImpl]: ../src/base/impl/baseFormImpl.ts "FormImpl"
[s-FormField]: ../src/base/types/formTypes.ts "FormTypes"
[s-submit]: ../src/base/types/modelTypes.ts "submit"
[s-cancel]: ../src/base/types/modelTypes.ts "cancel"
[s-baseValidators]: ../src/base/impl/baseValidatorImpl.ts "baseValidators"

[s-UDValidationMessage]: ../src/base/types/validatorTypes.ts "UDValidationMessage"
[s-InternalValidator]: ../src/base/types/validatorTypes.ts "InternalValidator"
[s-InternalValidators]: ../src/base/types/validatorTypes.ts "InternalValidators"
[s-InternalFormConfig]: ../src/base/types/formTypes.ts "InternalFormConfig"
[s-InternalFormOption]: ../src/base/types/formTypes.ts "InternalFormOption"
[s-UDFormOption]: ../src/base/types/formTypes.ts "UDFormOption"
[s-UDFieldConfigs]: ../src/base/types/configTypes.ts "UDFieldConfigs"
[s-UDFieldRuleConfig]: ../src/base/types/validatorTypes.ts "UDFieldRuleConfig"
[s-configBuilder]: ../src/base/types/configTypes.ts "configBuilder"
[s-defineRules]: ../src/base/types/validatorTypes.ts "defineRules"
[s-defineValidators]: ../src/utils/formConfigUtil.ts "defineValidators"
[s-defineFormConfig]: ../src/base/types/configTypes.ts "defineFormConfig"
[s-defineValidationMsg]: ../src/base/types/validatorTypes.ts "defineValidationMsg"

[modelTest]: ../__tests__/tests/../setup/setupFiles/formModel.test.setup.ts
[scenarioModelTest]: ../__tests__/tests/../setup/setupFiles/scenarioFormModel.test.setup.ts
[configTest]: ../__tests__/tests/../setup/setupFiles/formConfig.test.setup.ts

[defineRules]: #definerules "defineRules"
[defineValidators]: #definevalidators "defineValidators"
[defineFormConfig]: #defineformconfig "defineFormConfig"
[defineValidationMsg]: definevalidationmsg "defineValidationMsg"
[UDFormOption]: #udformoption "UDFormOption"
[UDFieldRuleConfig]: #udfieldruleconfig "UDFieldRuleConfig"
[FormImpl]: #formimpl
[FormField]: #formfield