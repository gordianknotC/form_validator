//@ts-ignore
import v8n from "v8n";
//@ts-ignore
import emailValidator from "email-validator";
import { Arr } from "@gdknot/frontend_common";
export var EBaseValidationIdents;
(function (EBaseValidationIdents) {
    /** general user name regex pattern, 預設大小寫英文數字減號 */
    EBaseValidationIdents["username"] = "username";
    /** 指定 bail 推疊多個 validation rules, e.g: bail|username|userLength */
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
})(EBaseValidationIdents || (EBaseValidationIdents = {}));
// 00311  12344
const PWD_PATTERN = /[a-zA-Z0-9#_\-]+/g;
const USER_PATTERN = /[a-zA-Z0-9\-]+/g;
const USER_PTN_UNDERSCORE = /[a-zA-Z0-9_\-]+/g;
const DECIMAL_PATTERN = /([1-9][0-9\/.,]*[0-9]$)|([0-9])/g;
const INT_PATTERN = /([1-9][0-9,]*[0-9]$)|([0-9])/g;
v8n.extend({
    pattern(expect) {
        return function (value) {
            if (expect.global) {
                const matches = Arr([...value.matchAll(expect)]);
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
    },
});
const _R = EBaseValidationIdents;
export const baseFieldRules = {
    username: { rule: `required|${_R.userLength}|${_R.userPattern}`, name: "username" },
    nickname: { rule: `required|${_R.nickLength}|${_R.userPattern}`, name: "nickname" },
    password: { rule: `required|${_R.pwdLength}|${_R.pwdPattern}`, name: "password" },
    newPassword: { rule: `required|${_R.notEqual}|${_R.pwdLength}|${_R.pwdPattern}`, name: "newPassword" },
    confirmPassword: { rule: `required|confirm`, name: "confirmPassword" },
    remark: { rule: "optional", name: "remark" },
    allUsername: { rule: `bail|${_R.username}|${_R.userLength}`, name: "allUsername" },
    searchField: { rule: `bail|${_R.userLength}|${_R.userPattern}`, name: "searchField" },
    phone: { rule: `required|${_R.phone}`, name: "phone" },
    email: { rule: `required|${_R.email}`, name: "email" },
    referral_code: { rule: "optional", name: "referral_code" },
};
export function aRule(rules) {
    return rules.join("|");
}
/** 同樣適用於 vue_formula, 規則同於 vue_formula*/
export const baseValidators = {
    /** 無 rule*/
    [EBaseValidationIdents.optional]: { handler(ctx, ...args) {
            return true;
        } },
    /** 必填*/
    [EBaseValidationIdents.required]: { handler(ctx, ...args) {
            return v8n().not.empty().test(ctx.value);
        } },
    /** 可容許多個錯誤 */
    [EBaseValidationIdents.bail]: { handler(ctx, ...args) {
            ctx.displayOption.showMultipleErrors = true;
            return true;
        } },
    /** 大小寫英文數字(底線、減號、井號) 8-30字*/
    [EBaseValidationIdents.pwdPattern]: { handler(ctx, ...args) {
            return v8n().pattern(PWD_PATTERN).test(ctx.value);
        } },
    /**8-30字*/
    [EBaseValidationIdents.pwdLength]: { handler(ctx, ...args) {
            return v8n().length(8, 30).test(ctx.value);
        } },
    /** 當欄位名為 sampleField_confirm, 則可用來匹配 欄位名 sampleFIeld */
    [EBaseValidationIdents.confirm]: {
        handler(ctx, ...args) {
            const name = ctx.name;
            const targetName = name.split("_confirm")[0];
            const targetField = ctx.model.getFieldByFieldName(targetName);
            const targetVal = targetField.value;
            ctx.model.linkFields({
                master: { name: ctx.name, dataKey: ctx.dataKey },
                slave: { name: targetField.name, dataKey: targetField.dataKey },
            });
            console.log("name:", name, "val:", ctx.value, "targetName", targetName, "targetVal:", targetVal, "model:", ctx.model);
            return targetVal == ctx.value;
        },
        targetHandler(targetField) {
            return {
                targetField: `${targetField}_confirm`,
                validator: baseValidators[EBaseValidationIdents.confirm]
            };
        }
    },
    /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
     *  就代表其 prefix 為 notEqual 的比較對象
     * */
    [EBaseValidationIdents.notEqual]: {
        handler(ctx, ...args) {
            const name = ctx.name;
            const targetName = name.split("_notEqual")[0];
            const targetField = ctx.model.getFieldByFieldName(targetName);
            const targetVal = targetField.value;
            ctx.model.linkFields({
                master: { name: ctx.name, dataKey: ctx.dataKey },
                slave: { name: targetField.name, dataKey: targetField.dataKey },
            });
            console.log("name:", name, "val:", ctx.value, "targetName", targetName, "targetVal:", targetVal, "model:", ctx.model);
            return targetVal != ctx.value;
        },
        targetHandler(targetField) {
            return {
                targetField: `${targetField}_notEqual`,
                validator: baseValidators[EBaseValidationIdents.notEqual]
            };
        }
    },
    [EBaseValidationIdents.email]: {
        handler(ctx, ...args) {
            return emailValidator.validate(ctx.value);
        }
    },
    [EBaseValidationIdents.phone]: { handler(ctx, ...args) {
            ctx.value = args[1].number;
            return args[1].isValid;
        } },
    /** 大小寫英文數字減號 */
    [EBaseValidationIdents.userPattern]: { handler(ctx, ...args) {
            return v8n().pattern(USER_PATTERN).test(ctx.value);
        } },
    [EBaseValidationIdents.decimalPattern]: { handler(ctx, ...args) {
            return v8n().pattern(DECIMAL_PATTERN).test(ctx.value);
        } },
    [EBaseValidationIdents.intPattern]: { handler(ctx, ...args) {
            return v8n().pattern(INT_PATTERN).test(ctx.value);
        } },
    [EBaseValidationIdents.amountLength]: { handler(ctx, ...args) {
            return v8n().length(4, 10).test(ctx.value);
        } },
    /** 大小寫英文數字減號（底線：助理帳號專用） */
    [EBaseValidationIdents.username]: { handler(ctx, ...args) {
            return v8n().pattern(USER_PTN_UNDERSCORE).test(ctx.value);
        } },
    /**  5-30字*/
    [EBaseValidationIdents.userLength]: { handler(ctx, ...args) {
            return v8n().length(5, 30).test(ctx.value);
        } },
    [EBaseValidationIdents.nickLength]: { handler(ctx, ...args) {
            return v8n().length(1, 10).test(ctx.value);
        } },
    /**  3字*/
    [EBaseValidationIdents.searchLength]: { handler(ctx, ...args) {
            const val = ctx.value;
            const arr = val.toAsciiArray();
            return arr.length >= 3 || arr.length == 0;
        } },
    [EBaseValidationIdents.remark]: { handler(ctx, ...rags) {
            return v8n().length(0, 100).test(ctx.value);
        } },
    // untested:
    [EBaseValidationIdents.greater]: {
        handler(ctx, ...args) {
            const name = ctx.name;
            const lidx = name.lastIndexOf("_lesser");
            const targetName = name.substring(0, lidx);
            const targetField = ctx.model.getFieldByFieldName(targetName);
            const targetVal = Number(targetField.value);
            ctx.model.linkFields({
                master: { name: ctx.name, dataKey: ctx.dataKey },
                slave: { name: targetField.name, dataKey: targetField.dataKey },
            });
            if (isNaN(Number(ctx.value))) {
                console.log("ctx:", ctx);
                ctx.value = 0;
            }
            console.log(`${name}-${targetName}`, "targetName:", targetName, "targetVal:", targetVal, "value:", ctx.value, "targetVal < ctx.value", targetVal < ctx.value);
            return targetVal < ctx.value;
        },
        targetHandler(targetField) {
            return {
                targetField: `${targetField}_greater`,
                validator: baseValidators[EBaseValidationIdents.greater]
            };
        }
    },
    // untested:
    [EBaseValidationIdents.lesser]: {
        handler(ctx, ...args) {
            const name = ctx.name;
            const lidx = name.lastIndexOf("_lesser");
            const targetName = name.substring(0, lidx);
            const targetField = ctx.model.getFieldByFieldName(targetName);
            const targetVal = Number(targetField.value);
            ctx.model.linkFields({
                master: { name: ctx.name, dataKey: ctx.dataKey },
                slave: { name: targetField.name, dataKey: targetField.dataKey },
            });
            if (isNaN(Number(ctx.value))) {
                ctx.value = 0;
            }
            console.log(`${name}-${targetName}`, "targetVal:", targetVal, "value:", ctx.value, "targetVal > ctx.value", targetVal > ctx.value);
            return targetVal > ctx.value;
        },
        targetHandler(targetField) {
            return {
                targetField: `${targetField}_lesser`,
                validator: baseValidators[EBaseValidationIdents.lesser]
            };
        }
    },
};
export function getValidationRules() {
    return baseValidators;
}
export function getFieldRules() {
    return baseFieldRules;
}
export function defineValidators(rules) {
    const composedIdents = EBaseValidationIdents;
    const composedHandlers = baseValidators;
    const validators = {};
    rules.forEach((rule) => {
        const { identity, handler } = rule;
        const key = identity;
        const validator = { handler, validatorName: identity };
        const _defaultLinkHandler = () => {
            return {
                name: identity,
                targetField: key,
                validator
            };
        };
        validator.targetHandler = (targetField) => {
            if (!targetField)
                return _defaultLinkHandler();
            return {
                targetField: `${targetField}_${key}`,
                validator,
                name: identity
            };
        };
        composedHandlers[key] = validator;
        composedIdents[key] = identity;
        validators[key] = validator;
    });
    return {
        validationIdents: composedIdents,
        validators
    };
}
export const defineFieldConfigs = function (cfg) {
    let _cfg;
    return new Proxy({}, {
        get: function (target, name) {
            _cfg ?? (_cfg = Arr(cfg.map((_) => _())));
            const index = _cfg.findIndex((_) => _.name == name);
            return cfg[index]();
        }
    });
};
export const defineFieldRules = function (configurations, validators) {
    const newFieldRules = baseFieldRules;
    configurations.forEach((config) => {
        const ident = config.ident;
        const validator = validators[ident] ?? {};
        newFieldRules[ident].ident = ident;
        newFieldRules[ident] ?? (newFieldRules[ident] = { rule: "", name: "", ...validator,
            getConfig: (targetField) => {
                const name = validator.targetHandler(targetField).targetField;
                const fieldRule = newFieldRules[ident].rules.map((_) => _.validatorName).join("|");
                return { name, fieldRule };
            }
        });
    });
    return newFieldRules;
};
//# sourceMappingURL=formRuleUtil.js.map