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
     * @typeParam T - 欄位名集合
     * @typeParam E - 欄位名集合，用來擴展用，可以是空物件
     * @typeParam V - validators名集合
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
//# sourceMappingURL=baseFormTypes.js.map