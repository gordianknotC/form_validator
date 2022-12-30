"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseValidators = exports.aValidator = exports.EBaseValidationIdents = void 0;
const tslib_1 = require("tslib");
//@ts-ignore
const v8n_1 = tslib_1.__importDefault(require("v8n"));
//@ts-ignore
const email_validator_1 = tslib_1.__importDefault(require("email-validator"));
const frontend_common_1 = require("@gdknot/frontend_common");
const extension_setup_1 = require("@gdknot/frontend_common/dist/extension/extension_setup");
/**
 * 預設 Validator 名, 可介由 {@link defineValidators} 擴展延伸
 */
var EBaseValidationIdents;
(function (EBaseValidationIdents) {
    /** general user name regex pattern, 預設大小寫英文數字減號 */
    EBaseValidationIdents["username"] = "username";
    /**
     * todo: 指定 bail 推疊多個 validation rules, e.g: bail|username|userLength */
    EBaseValidationIdents["bail"] = "bail";
    /** greater */
    EBaseValidationIdents["greater"] = "greater";
    EBaseValidationIdents["lesser"] = "lesser";
    /** 當欄位名取為為 fieldName_confirm 時, 則可用來匹配 欄位名 fieldName */
    EBaseValidationIdents["confirm"] = "confirm";
    EBaseValidationIdents["email"] = "email";
    EBaseValidationIdents["remark"] = "remark";
    /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
     *  就代表其 prefix 為 notEqual 的比較對象
     * */
    EBaseValidationIdents["notEqual"] = "notEqual";
    /** 無 rule, 不檢查*/
    EBaseValidationIdents["optional"] = "optional";
    EBaseValidationIdents["phone"] = "phone";
    /**8-30字*/
    EBaseValidationIdents["pwdLength"] = "pwdLength";
    /** 大小寫英文數字(底線、減號、井號) 8-30字*/
    EBaseValidationIdents["pwdPattern"] = "pwdPattern";
    /** 必填*/
    EBaseValidationIdents["required"] = "required";
    /**  3字*/
    EBaseValidationIdents["searchLength"] = "searchLength";
    /**  1-10字*/
    EBaseValidationIdents["nickLength"] = "nickLength";
    /**  5-30字*/
    EBaseValidationIdents["userLength"] = "userLength";
    EBaseValidationIdents["amountLength"] = "amountLength";
    EBaseValidationIdents["userPattern"] = "userPattern";
    EBaseValidationIdents["decimalPattern"] = "decimalPattern";
    EBaseValidationIdents["intPattern"] = "intPattern";
})(EBaseValidationIdents = exports.EBaseValidationIdents || (exports.EBaseValidationIdents = {}));
/** 給v8n 使用的regex pattern  */
const PWD_PATTERN = /[a-zA-Z0-9#_\-]+/g;
const USER_PATTERN = /[a-zA-Z0-9\-]+/g;
const USER_PTN_UNDERSCORE = /[a-zA-Z0-9_\-]+/g;
const DECIMAL_PATTERN = /([1-9][0-9\/.,]*[0-9]$)|([0-9])/g;
const INT_PATTERN = /([1-9][0-9,]*[0-9]$)|([0-9])/g;
v8n_1.default.extend({
    pattern(expect) {
        return function (value) {
            if (expect.global) {
                const matches = (0, frontend_common_1.Arr)([...value.matchAll(expect)]);
                return matches.first[0].length == value.length;
                // console.log('1match pattern...', result);
                // return result;
            }
            else {
                return value.test(expect);
                // console.log('2match pattern...', result);
                // return result;
            }
        };
    }
});
const aValidator = (option) => {
    return {
        ...option,
        linkField(fieldName) {
            const ret = Object.assign({}, option);
            ret._linkedFieldName = fieldName;
            return ret;
        },
        applyField(fieldName) {
            const ret = Object.assign({}, option);
            ret._appliedFieldName = fieldName;
            return ret;
        }
    };
};
exports.aValidator = aValidator;
/** 預設validators */
exports.baseValidators = {
    /** 無 rule*/
    [EBaseValidationIdents.optional]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.optional,
        handler(ctx, ...args) {
            ctx.model;
            return true;
        }
    }),
    /** 必填*/
    [EBaseValidationIdents.required]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.required,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().not.empty().test(ctx.value);
        }
    }),
    /** 可容許多個錯誤 */
    [EBaseValidationIdents.bail]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.bail,
        handler(ctx, ...args) {
            ctx.displayOption.showMultipleErrors = true;
            return true;
        }
    }),
    /** 大小寫英文數字(底線、減號、井號) 8-30字*/
    [EBaseValidationIdents.pwdPattern]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.pwdPattern,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().pattern(PWD_PATTERN).test(ctx.value);
        }
    }),
    /**8-30字*/
    [EBaseValidationIdents.pwdLength]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.pwdLength,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().length(8, 30).test(ctx.value);
        }
    }),
    /** 當欄位名為 sampleField_confirm, 則可用來匹配 欄位名 sampleFIeld
     * ### description -
     * 部份驗證規則需要連結其他欄位以進行驗證，如 confirm password 便需要
     * confirm_password 欄位與 password 欄位進行連結，以檢查其質是否一致
     * - context.getLinkedFieldName(validatorIdentity)
     *   以下例，透過 confirm 取得當前 context 中所連結的欄位名 **linkName**
     * - 並透過該被連結的欄位名，查找其欄位物件 (FormField)
     * - 由欄位物件取得該欄位目前的值 linkField.value
     *
    */
    [EBaseValidationIdents.confirm]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.confirm,
        handler(ctx, ...args) {
            const name = ctx.fieldName;
            const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.confirm);
            (0, frontend_common_1.assert)(linkName != undefined);
            const linkField = ctx.model.getFieldByFieldName(linkName);
            const linkVal = linkField.value;
            ctx.model.link({
                master: { fieldName: ctx.fieldName, payloadKey: ctx.payloadKey },
                slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
            });
            return linkVal == ctx.value;
        },
    }),
    /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
     *  就代表其 prefix 為 notEqual 的比較對象
     * */
    [EBaseValidationIdents.notEqual]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.notEqual,
        handler(ctx, ...args) {
            const name = ctx.fieldName;
            const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.notEqual);
            (0, frontend_common_1.assert)(linkName != undefined);
            const linkField = ctx.model.getFieldByFieldName(linkName);
            const linkVal = linkField.value;
            ctx.model.link({
                master: { fieldName: ctx.fieldName, payloadKey: ctx.payloadKey },
                slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
            });
            if (extension_setup_1._currentEnv.value == "develop") {
                console.log("validator notEqual:", `at field: ${ctx.fieldName}, link to field: ${linkName}, linkVal/ctx.val - (${linkVal}/${ctx.value})`);
            }
            return linkVal != ctx.value;
        },
    }),
    [EBaseValidationIdents.email]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.email,
        handler(ctx, ...args) {
            return email_validator_1.default.validate(ctx.value);
        }
    }),
    [EBaseValidationIdents.phone]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.phone,
        handler(ctx, ...args) {
            ctx.value = args[1].number;
            return args[1].isValid;
        }
    }),
    /** 大小寫英文數字減號 */
    [EBaseValidationIdents.userPattern]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.userPattern,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().pattern(USER_PATTERN).test(ctx.value);
        }
    }),
    [EBaseValidationIdents.decimalPattern]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.decimalPattern,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().pattern(DECIMAL_PATTERN).test(ctx.value);
        }
    }),
    [EBaseValidationIdents.intPattern]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.intPattern,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().pattern(INT_PATTERN).test(ctx.value);
        }
    }),
    [EBaseValidationIdents.amountLength]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.amountLength,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().length(4, 10).test(ctx.value);
        }
    }),
    /** 大小寫英文數字減號（底線：助理帳號專用） */
    [EBaseValidationIdents.username]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.username,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().pattern(USER_PTN_UNDERSCORE).test(ctx.value);
        }
    }),
    /**  5-30字*/
    [EBaseValidationIdents.userLength]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.userLength,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().length(5, 30).test(ctx.value);
        }
    }),
    [EBaseValidationIdents.nickLength]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.nickLength,
        handler(ctx, ...args) {
            return (0, v8n_1.default)().length(1, 10).test(ctx.value);
        }
    }),
    /**  3字*/
    [EBaseValidationIdents.searchLength]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.searchLength,
        handler(ctx, ...args) {
            const val = ctx.value;
            const arr = val.toAsciiArray();
            return arr.length >= 3 || arr.length == 0;
        }
    }),
    [EBaseValidationIdents.remark]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.remark,
        handler(ctx, ...rags) {
            return (0, v8n_1.default)().length(0, 100).test(ctx.value);
        }
    }),
    // untested:
    [EBaseValidationIdents.greater]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.greater,
        handler(ctx, ...args) {
            const name = ctx.fieldName;
            const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.greater);
            (0, frontend_common_1.assert)(linkName != undefined);
            const linkField = ctx.model.getFieldByFieldName(linkName);
            const linkVal = Number(linkField.value);
            ctx.model.link({
                master: { fieldName: ctx.fieldName, payloadKey: ctx.payloadKey },
                slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
            });
            ctx.value = 0;
            if (isNaN(Number(ctx.value))) {
                console.log("ctx:", ctx);
                ctx.value = 0;
            }
            return linkVal < ctx.value;
        },
    }),
    // untested:
    [EBaseValidationIdents.lesser]: (0, exports.aValidator)({
        validatorName: EBaseValidationIdents.lesser,
        handler(ctx, ...args) {
            const name = ctx.fieldName;
            const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.lesser);
            (0, frontend_common_1.assert)(linkName != undefined);
            const linkField = ctx.model.getFieldByFieldName(linkName);
            const linkVal = Number(linkField.value);
            ctx.model.link({
                master: { fieldName: ctx.fieldName, payloadKey: ctx.payloadKey },
                slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
            });
            if (isNaN(Number(ctx.value))) {
                ctx.value = 0;
            }
            return linkVal > ctx.value;
        },
    })
};
//# sourceMappingURL=baseValidatorImpl.js.map