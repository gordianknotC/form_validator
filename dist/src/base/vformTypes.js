export var VForm;
(function (VForm) {
    ///     C O N T E X T
    /**
     *
     *  #### context object 於 rule definition 階段存取, 用來讀取當前表單資料
     * */
    class IBaseFormContext {
    }
    VForm.IBaseFormContext = IBaseFormContext;
    ///   M O D E L
    /**
     *  #### 用來存取 BaseFormImpl 資料層
     *
     *  @property initialState
     *  表單初始狀態，提供重設表單時所呈現
     *
     *  @property state
     *    表單當前狀態
     *
     *  @property remoteErrors
     *    remote errors 別於 {@link FormField.fieldError}, {@link FormField.fieldError}為
     *
     *  @property rules
     *    definition of validation rules
     *
     *  @property messages
     *    validation messages
     *
     *  @property config
     *    表單擴展定義
     *
     *  @method getDataKeys
     *    @return (TFormKey<T,E>)[]
     *
     *    取得欄位 dataKeys
     *    const payload = {username:..., password: ...}
     *    ...
     *    model.getDataKeys() // ['username', 'password']
     *
     *  @method getIdentifiers
     *    @return string[];
     *
     *    identifier 為 field name, 如表單定義為
     *    > const def = {
     *    >
     *    > }
     *
     *  @function getFields
     *  @method getFieldByDataKey
     *
     * */
    class IBaseFormModel {
    }
    VForm.IBaseFormModel = IBaseFormModel;
    //
    //    C O N T R O L L E R
    //
    /**
     *  #### 實作 BaseFormImpl 控制項
     *
     *  @computed canSubmit
     *  判斷當前 submit 按鍵是否可按，當表單有錯誤時為不可按
     *
     *  @method cancel
     *  用以指定於表單 cancel button @click 時
     *
     *  @method getPayload
     *  定義表單送出時 生成的payload
     *
     *  @method request
     *  定義表單送出時的請求方法
     *
     *  @method submit
     *  用以指定於表單 submit button @click 時
     *
     *  @method validate
     *  依據欄位名稱驗證該欄位
     *  e.g:
     *    > validate('username')
     *    > validate('password')
     *
     * */
    class IBaseFormCtrl {
    }
    VForm.IBaseFormCtrl = IBaseFormCtrl;
    class IBaseFormCtrlExt {
    }
    VForm.IBaseFormCtrlExt = IBaseFormCtrlExt;
    ///   E V E N T    H A N D L E R
    /**
     *
     *  #### 用來實作 html 車件與 IBaseForm 互動的界面
     *
     *  @method {@link notifyLeavingFocus}
     *  @method {@link notifyReFocus}
     *  @method {@link notifyOnInput}
     *  以上三者提供 input element 事件輸入界面，輸入後進行表單驗證及狀態更新
     *
     * */
    class IBaseEventHandler {
    }
    VForm.IBaseEventHandler = IBaseEventHandler;
})(VForm || (VForm = {}));
//# sourceMappingURL=vformTypes.js.map