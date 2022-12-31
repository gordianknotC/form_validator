
---
<!--#-->

## 注入 Reactive method
### vue
  ```typescript
  import { computed, reactive, ref, watch } from "vue";
  import {
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
  ```

### react
  
  __尚未驗證__

## 設值

- 外部設值

```tsx
const form = new CreateUserFormModel(createUserFormModelOption);
form.username.value = "hello";
form.notifyOnInput("username")
```

- ui 設值 (vue)

```javascript
<template lang="pug">
el-input(
  :placeholder="field.placeholder"
  v-model='field.value'
  type="field.fieldType"
  @input="()=>model.notifyOnInput(field.dataKey)"
)
.error-container
	span.error-sign(v-if="field.hasError")
	span.text-red {{field.fieldError}}
</template>
...
setup(){
	const form = new CreateUserFormModel(createUserFormModelOption);
	return {
		field: form.state.username
	}
}
```

## 改變預設值

- **formField.value / formField.defaultValue－** 於 constructor 內
    
    ```tsx
    export class BaseReactiveForm<F, V> extends BaseFormImpl<F, F, V> {
      constructor(option: InternalFormOption<F, F, V>) {
        flattenInstance(super(option));
    		this.state.username.defaultValue 
    			= this.state.username.value 
    			= "initial username";
      }
    }
    ```
    
    - **formFIeld.value** - 當前值
    - **formFIeld.defaultValue** - 預設值
    於 reset 方法觸發後，內部會將 defaultValue 設至 value以作為 reset 的參考來源
- f**orm.resetInitialState**
    
    ```tsx
    const form = new CreateUserFormModel(createUserFormModelOption);
    form.resetInitialState({
    	username: "initialUsername"
    });
    ```
    

### 觸發事件

- notifyOnInput (payloadKey) 
- notifyOnFocus (payloadKey)
- notifyLeavingFocus (payloadKey)
  

### 驗證欄位(validate) - ruleChain

notifyOnInput 時會自動觸發 validate, 或者可以手動的方式 validate

- form.validate(payloadKey, extraArg)
- form.validateAll()




 