//@ts-ignore
import v8n from "v8n";
import { VForm } from "~/base/vformTypes";
//@ts-ignore
import emailValidator from "email-validator";
import TValidationRules = VForm.ValidationRules;
import TValidationHandler = VForm.ValidationRuleHandler;
import { Arr, assert } from "@gdknot/frontend_common";
import { EFormValidationRules } from "@/../__tests__/tests/form.test";
import { T } from "vitest/dist/types-1cf24598";

export enum EBaseRuleIdent {
  allUserPattern = "allUserPattern",
  bail = "bail",
  greater = "greater",
  lesser = "lesser",
  confirm = "confirm",
  email = "email",
  remark = "remark",
  notEqual = "notEqual",
  optional = "optional",
  phone = "phone",
  pwdLength = "pwdLength",
  pwdPattern = "pwdPattern",
  required = "required",
  searchLength = "searchLength",
  nickLength = "nickLength",
  userLength = "userLength",
  amountLength = "amountLength",
  userPattern = "userPattern",
  decimalPattern = "decimalPattern",
  intPattern = "intPattern",
}
// 00311  12344
const PWD_PATTERN = /[a-zA-Z0-9#_\-]+/g;
const USER_PATTERN = /[a-zA-Z0-9\-]+/g;
const ALL_USER_PATTERN = /[a-zA-Z0-9_\-]+/g;
const DECIMAL_PATTERN = /([1-9][0-9\/.,]*[0-9]$)|([0-9])/g;
const INT_PATTERN = /([1-9][0-9,]*[0-9]$)|([0-9])/g;

v8n.extend({
  pattern(expect: RegExp) {
    return function (value: any) {
      if (expect.global) {
        const matches = Arr([...value.matchAll(expect)]);
        return matches.first[0].length == value.length;
        // console.log('1match pattern...', result);
        // return result;
      } else {
        return value.test(expect);
        // console.log('2match pattern...', result);
        // return result;
      }
    };
  },
});

const _R = EBaseRuleIdent;
export const baseRules = {
  username: `required|${_R.userLength}|${_R.userPattern}`,
  nickname: `required|${_R.nickLength}|${_R.userPattern}`,
  password: `required|${_R.pwdLength}|${_R.pwdPattern}`,
  newPassword: `required|${_R.notEqual}|${_R.pwdLength}|${_R.pwdPattern}`,
  confirmPassword: "required|confirm",
  remark: "optional",
  allUsername: `bail|${_R.allUserPattern}|${_R.userLength}`,
  searchField: `bail|${_R.userLength}|${_R.userPattern}`,
  phone: `required|${_R.phone}`,
  email: `required|${_R.email}`,
  referral_code: "optional",
};

export function aRule<T extends EBaseRuleIdent>(rules: T[]) {
  return rules.join("|");
}

/** 同樣適用於 vue_formula, 規則同於 vue_formula*/
export const baseValidationHandlers: Record<EBaseRuleIdent, TValidationHandler> = {
  /** 無 rule*/
  [EBaseRuleIdent.optional](ctx, ...args: any) {
    return true;
  },
  /** 必填*/
  [EBaseRuleIdent.required](ctx, ...args: any) {
    return v8n().not.empty().test(ctx.value);
  },
  /** 可容許多個錯誤 */
  [EBaseRuleIdent.bail](ctx, ...args: any) {
    ctx.displayOption.showMultipleErrors = true;
    return true;
  },
  /** 大小寫英文數字(底線、減號、井號) 8-30字*/
  [EBaseRuleIdent.pwdPattern](ctx, ...args: any[]) {
    return v8n().pattern(PWD_PATTERN).test(ctx.value);
  },
  /**8-30字*/
  [EBaseRuleIdent.pwdLength](ctx, ...args: any[]) {
    return v8n().length(8, 30).test(ctx.value);
  },
  /** 當欄位名為 sampleField_confirm, 則可用來匹配 欄位名 sampleFIeld */
  [EBaseRuleIdent.confirm](ctx, ...args: any[]) {
    const name = ctx.name;
    const targetName = name.split("_confirm")[0];
    const targetField = ctx.model.getFieldByFieldName(targetName);
    const targetVal = targetField.value;

    ctx.model.linkFields({
      master: { name: ctx.name as any, dataKey: ctx.dataKey },
      slave: { name: targetField.name, dataKey: targetField.dataKey },
    });

    console.log(
      "name:",
      name,
      "val:",
      ctx.value,
      "targetName",
      targetName,
      "targetVal:",
      targetVal,
      "model:",
      ctx.model
    );
    return targetVal == ctx.value;
  },
  /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
   *  就代表其 prefix 為 notEqual 的比較對象
   * */
  [EBaseRuleIdent.notEqual](ctx, ...args: any[]) {
    const name = ctx.name;
    const targetName = name.split("_notEqual")[0];
    const targetField = ctx.model.getFieldByFieldName(targetName);
    const targetVal = targetField.value;

    ctx.model.linkFields({
      master: { name: ctx.name as any, dataKey: ctx.dataKey },
      slave: { name: targetField.name, dataKey: targetField.dataKey },
    });

    console.log(
      "name:",
      name,
      "val:",
      ctx.value,
      "targetName",
      targetName,
      "targetVal:",
      targetVal,
      "model:",
      ctx.model
    );
    return targetVal != ctx.value;
  },
  [EBaseRuleIdent.email](ctx, ...args) {
    return emailValidator.validate(ctx.value);
  },
  [EBaseRuleIdent.phone](ctx, ...args) {
    ctx.value = args[1].number;
    return args[1].isValid;
  },
  /** 大小寫英文數字減號 */
  [EBaseRuleIdent.userPattern](ctx, ...args) {
    return v8n().pattern(USER_PATTERN).test(ctx.value);
  },

  [EBaseRuleIdent.decimalPattern](ctx, ...args) {
    return v8n().pattern(DECIMAL_PATTERN).test(ctx.value);
  },

  [EBaseRuleIdent.intPattern](ctx, ...args) {
    return v8n().pattern(INT_PATTERN).test(ctx.value);
  },

  [EBaseRuleIdent.amountLength](ctx, ...args) {
    return v8n().length(4, 10).test(ctx.value);
  },
  /** 大小寫英文數字減號（底線：助理帳號專用） */
  [EBaseRuleIdent.allUserPattern](ctx, ...args) {
    return v8n().pattern(ALL_USER_PATTERN).test(ctx.value);
  },
  /**  5-30字*/
  [EBaseRuleIdent.userLength](ctx, ...args) {
    return v8n().length(5, 30).test(ctx.value);
  },
  [EBaseRuleIdent.nickLength](ctx, ...args) {
    return v8n().length(1, 10).test(ctx.value);
  },
  /**  3字*/
  [EBaseRuleIdent.searchLength](ctx, ...args) {
    const val = ctx.value as string;
    const arr = val.toAsciiArray();
    return arr.length >= 3 || arr.length == 0;
  },
  [EBaseRuleIdent.remark](ctx, ...rags) {
    return v8n().length(0, 100).test(ctx.value);
  },

  // untested:
  [EBaseRuleIdent.greater](ctx, ...args: any[]) {
    const name = ctx.name;
    const lidx = name.lastIndexOf("_lesser");
    const targetName = name.substring(0, lidx);
    const targetField = ctx.model.getFieldByFieldName(targetName);
    const targetVal = Number(targetField.value);

    ctx.model.linkFields({
      master: { name: ctx.name as any, dataKey: ctx.dataKey },
      slave: { name: targetField.name, dataKey: targetField.dataKey },
    });

    if (isNaN(Number(ctx.value))) {
      console.log("ctx:", ctx);
      ctx.value = 0;
    }

    console.log(
      `${name}-${targetName}`,
      "targetName:",
      targetName,
      "targetVal:",
      targetVal,
      "value:",
      ctx.value,
      "targetVal < ctx.value",
      targetVal < ctx.value
    );
    return targetVal < ctx.value;
  },

  // untested:
  [EBaseRuleIdent.lesser](ctx, ...args: any[]) {
    const name = ctx.name;
    const lidx = name.lastIndexOf("_lesser");
    const targetName = name.substring(0, lidx);
    const targetField = ctx.model.getFieldByFieldName(targetName);
    const targetVal = Number(targetField.value);

    ctx.model.linkFields({
      master: { name: ctx.name as any, dataKey: ctx.dataKey },
      slave: { name: targetField.name, dataKey: targetField.dataKey },
    });

    if (isNaN(Number(ctx.value))) {
      ctx.value = 0;
    }
    console.log(
      `${name}-${targetName}`,
      "targetVal:",
      targetVal,
      "value:",
      ctx.value,
      "targetVal > ctx.value",
      targetVal > ctx.value
    );
    return targetVal > ctx.value;
  },
} as TValidationRules<EBaseRuleIdent>;

// export function addValidationRule<T extends string>(
//   ruleName: T,
//   handler: TValidationHandler,
//   override: boolean = false
// ): T {
//   if (!override)
//     assert(
//       !Arr(Object.keys(EBaseRuleIdent)).any((_) => _ === ruleName),
//       `Rule: ${ruleName} already defined, to ignore this message set override to "true" explicitly`
//     );
//   baseValidationHandlers[ruleName as keyof typeof baseValidationHandlers] = handler;
//   //@ts-ignore
//   EBaseRuleIdent[ruleName] = ruleName;
//   return ruleName;
// }

// export function addFieldRule<T extends string>(
//   fieldName: T,
//   rule: string,
//   override: boolean = false
// ): DefaultFieldRules {
//   if (!override)
//     assert(
//       !Arr(Object.keys(EBaseRuleIdent)).any((_) => _ === fieldName),
//       `Rule: ${fieldName} already defined, to ignore this message set override to "true" explicitly`
//     );
//   //@ts-ignore
//   baseRules[fieldName] = rule;
//   return baseRules;
// }

export type DefaultValidationHandlers = typeof baseValidationHandlers;
export function getValidationRules(): DefaultValidationHandlers {
  return baseValidationHandlers;
}

export type DefaultFieldRules = typeof baseRules;
export function getFieldRules(): DefaultFieldRules {
  return baseRules;
}

export function createValidationRules<T>(rules: {
  identity: keyof T,
  extendRules: Partial<(keyof T) & EFormValidationRules>[],
  handler: TValidationHandler,
}[]): {
  rules: DefaultFieldRules & Record<keyof T, string>,
  validationHandler: DefaultValidationHandlers & Record<keyof T, TValidationHandler>,
} {
  baseValidationHandlers;
  baseRules;
  rules.forEach((rule)=>{
    const {identity, extendRules, handler} = rule;
    baseValidationHandlers[identity as any as EBaseRuleIdent] = handler;
    baseRules[identity as any as keyof (typeof baseRules)] = [...extendRules, identity].join("|");
  });
  return {
    rules: baseRules,
    validationHandler: baseValidationHandlers
  } as any
}


export const createFormConfig = function<F>(
  cfg: VForm.FormField<F, F>[]
): Record<keyof F, VForm.FormField<F, F>>{
  const _cfg = Arr(cfg);
  return new Proxy({}, {
    get: function (target, name) {
      return _cfg.firstWhere((_)=> _.dataKey == name);
    }
  }) as any;
}


// const forms = createFormConfig([
//    {
//     dataKey: "unconfirmedLeague",
//     name: "unconfirmedLeague",
//     value: 0,
//     label: computed(() => "facade.languageService.txt.unconfirmedLeague"),
//     rule: "",
//     placeholder: computed(() => "facade.languageService.txt.unconfirmedLeague")
//   },
// ]);

// forms;
