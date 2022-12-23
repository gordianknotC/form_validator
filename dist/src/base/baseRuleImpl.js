"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseFieldRules = exports.aRule = void 0;
const baseValidatorImpl_1 = require("./baseValidatorImpl");
const _R = baseValidatorImpl_1.EBaseValidationIdents;
function aRule(rules) {
    return rules.join("|");
}
exports.aRule = aRule;
exports.baseFieldRules = {
    username: {
        rule: `required|${_R.userLength}|${_R.userPattern}`,
        name: "username"
    },
    nickname: {
        rule: `required|${_R.nickLength}|${_R.userPattern}`,
        name: "nickname"
    },
    password: {
        rule: `required|${_R.pwdLength}|${_R.pwdPattern}`,
        name: "password"
    },
    newPassword: {
        rule: `required|${_R.notEqual}|${_R.pwdLength}|${_R.pwdPattern}`,
        name: "newPassword"
    },
    confirmPassword: { rule: `required|confirm`, name: "confirmPassword" },
    remark: { rule: "optional", name: "remark" },
    allUsername: {
        rule: `bail|${_R.username}|${_R.userLength}`,
        name: "allUsername"
    },
    searchField: {
        rule: `bail|${_R.userLength}|${_R.userPattern}`,
        name: "searchField"
    },
    phone: { rule: `required|${_R.phone}`, name: "phone" },
    email: { rule: `required|${_R.email}`, name: "email" },
    referral_code: { rule: "optional", name: "referral_code" }
};
//# sourceMappingURL=baseRuleImpl.js.map