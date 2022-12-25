import { EBaseValidationIdents, baseValidators } from "./baseValidatorImpl";
const _R = EBaseValidationIdents;


export function aRule<T extends (typeof EBaseValidationIdents)>(rules: T[]) {
  return rules.join("|");
}

export let baseFieldRules = {
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

 