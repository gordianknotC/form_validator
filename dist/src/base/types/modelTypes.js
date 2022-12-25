"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBaseEventHandler = exports.IBaseFormCtrlExt = exports.IBaseFormCtrl = exports.IBaseFormModel = exports.EFormStage = void 0;
/** #### 表單當前狀態 */
var EFormStage;
(function (EFormStage) {
    EFormStage[EFormStage["loading"] = 0] = "loading";
    EFormStage[EFormStage["ready"] = 1] = "ready";
})(EFormStage = exports.EFormStage || (exports.EFormStage = {}));
///   M O D E L
/**
 *  #### 用來存取 BaseFormImpl 資料層
 * @typeParam T - 欄位名集合
 * @typeParam E - 欄位名集合，用來擴展用，可以是空物件
 * @typeParam V - validators名集合
 * */
class IBaseFormModel {
}
exports.IBaseFormModel = IBaseFormModel;
//
//    C O N T R O L L E R
//
/**
 *  #### 實作 BaseFormImpl 控制項
 *
 * */
class IBaseFormCtrl {
}
exports.IBaseFormCtrl = IBaseFormCtrl;
class IBaseFormCtrlExt {
}
exports.IBaseFormCtrlExt = IBaseFormCtrlExt;
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
exports.IBaseEventHandler = IBaseEventHandler;
//# sourceMappingURL=modelTypes.js.map