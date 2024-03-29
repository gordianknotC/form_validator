//@ts-ignore
import v8n from "v8n";
//@ts-ignore
import emailValidator from "email-validator";
import { Arr, assert } from "@gdknot/frontend_common";
import { InternalValidator, InternalValidators } from "~/base/types/validatorTypes";
import { _currentEnv } from "@gdknot/frontend_common/dist/src/extension/extension_setup";
import { defineValidators } from "@/utils/formValidatorUtil";

/**
 * 預設 Validator 名, 可介由 {@link defineValidators} 擴展延伸
 */
 export enum EBaseValidationIdents {
  /** general user name regex pattern, 預設大小寫英文數字減號 */
  username = "username",
  /** 
   * 指定 bail 推疊多個 validation rules, e.g: bail|username|userLength */
  bail = "bail",
  /** greater */
  greater = "greater",
  lesser = "lesser",
  /** 當欄位名取為為 fieldName_confirm 時, 則可用來匹配 欄位名 fieldName */
  confirm = "confirm",
  email = "email",
  remark = "remark",
  /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
   *  就代表其 prefix 為 notEqual 的比較對象
   * */
  notEqual = "notEqual",
  /** 無 rule, 不檢查*/
  optional = "optional",
  phone = "phone",
  /**8-30字*/
  pwdLength = "pwdLength",
  /** 大小寫英文數字(底線、減號、井號) 8-30字*/
  pwdPattern = "pwdPattern",
  /** 必填*/
  required = "required",
  /**  3字*/
  searchLength = "searchLength",
  /**  1-10字*/
  nickLength = "nickLength",
  /**  5-30字*/
  userLength = "userLength",
  amountLength = "amountLength",
  userPattern = "userPattern",
  decimalPattern = "decimalPattern",
  intPattern = "intPattern"
}

/** 給v8n 使用的regex pattern  */
const PWD_PATTERN = /[a-zA-Z0-9#_\-]+/g;
const USER_PATTERN = /[a-zA-Z0-9\-]+/g;
const USER_PTN_UNDERSCORE = /[a-zA-Z0-9_\-]+/g;
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
  }
});
 

export const aValidator = <T>(option: Partial<InternalValidator<T>>): InternalValidator<T> =>{
  return {
    ...option,
    linkField(fieldName: string){
      const ret = Object.assign({}, option);
      ret._linkedFieldName = fieldName;
      return ret;
    },
    applyField(fieldName: string){
      const ret = Object.assign({}, option);
      ret._appliedFieldName = fieldName;
      return ret;
    }
  } as any;
}

/** 預設validators */
export const baseValidators: InternalValidators<typeof EBaseValidationIdents> = {
  /** 無 rule*/
  [EBaseValidationIdents.optional]: aValidator({
    validatorName: EBaseValidationIdents.optional,
    handler(ctx, ...args: any[]) {
      ctx.model;
      return true;
    }
  }) ,
  /** 必填*/
  [EBaseValidationIdents.required]: aValidator({
    validatorName: EBaseValidationIdents.required,
    handler(ctx, ...args: any[]) {
      return v8n().not.empty().test(ctx.value);
    }
  }),
  /** 可容許多個錯誤 */
  [EBaseValidationIdents.bail]: aValidator({
    validatorName: EBaseValidationIdents.bail,
    handler(ctx, ...args: any[]) {
      ctx.displayOption.showMultipleErrors = true;
      return true;
    }
  }),
  /** 大小寫英文數字(底線、減號、井號) 8-30字*/
  [EBaseValidationIdents.pwdPattern]: aValidator({
    validatorName: EBaseValidationIdents.pwdPattern,
    handler(ctx, ...args: any[]) {
      return v8n().pattern(PWD_PATTERN).test(ctx.value);
    }
  }),
  /**8-30字*/
  [EBaseValidationIdents.pwdLength]: aValidator({
    validatorName: EBaseValidationIdents.pwdLength,
    handler(ctx, ...args: any[]) {
      return v8n().length(8, 30).test(ctx.value);
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
  [EBaseValidationIdents.confirm]: aValidator({
    validatorName: EBaseValidationIdents.confirm,
    handler(ctx, ...args: any[]) {
      const name = ctx.fieldName; 
      const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.confirm);
      assert(()=>linkName != undefined);
      
      const linkField = ctx.model.getFieldByFieldName(linkName!);
      const linkVal = linkField.value;
      
      // ctx.model.link({
      //   master: { fieldName: ctx.fieldName as any, payloadKey: ctx.payloadKey },
      //   slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
      // });

      return linkVal == ctx.value;
    },
  }),
  /** 用法和 confirm 一樣，只要找到 field name suffixed with _notEqual
   *  就代表其 prefix 為 notEqual 的比較對象
   * */
  [EBaseValidationIdents.notEqual]: aValidator({
    validatorName: EBaseValidationIdents.notEqual,
    handler(ctx, ...args: any[]) {
      const name = ctx.fieldName;
      const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.notEqual);
      assert(()=>linkName != undefined);
      
      const linkField = ctx.model.getFieldByFieldName(linkName!);
      const linkVal = linkField.value;

      // ctx.model.link({
      //   master: { fieldName: ctx.fieldName as any, payloadKey: ctx.payloadKey },
      //   slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
      // });
      if (_currentEnv.value == "develop"){
        console.log("validator notEqual:", `at field: ${ctx.fieldName}, link to field: ${linkName}, linkVal/ctx.val - (${linkVal}/${ctx.value})`)
      }
      return linkVal != ctx.value;
    },
  }),
  [EBaseValidationIdents.email]: aValidator({
    validatorName: EBaseValidationIdents.email,
    handler(ctx, ...args: any[]) {
      return emailValidator.validate(ctx.value);
    }
  }),
  [EBaseValidationIdents.phone]: aValidator({
    validatorName: EBaseValidationIdents.phone,
    handler(ctx, ...args: any[]) {
      ctx.value = args[1].number;
      return args[1].isValid;
    }
  }),
  /** 大小寫英文數字減號 */
  [EBaseValidationIdents.userPattern]: aValidator({
    validatorName: EBaseValidationIdents.userPattern,
    handler(ctx, ...args: any[]) {
      return v8n().pattern(USER_PATTERN).test(ctx.value);
    }
  }),

  [EBaseValidationIdents.decimalPattern]: aValidator({
    validatorName: EBaseValidationIdents.decimalPattern,
    handler(ctx, ...args: any[]) {
      return v8n().pattern(DECIMAL_PATTERN).test(ctx.value);
    }
  }),

  [EBaseValidationIdents.intPattern]: aValidator({
    validatorName: EBaseValidationIdents.intPattern,
    handler(ctx, ...args: any[]) {
      return v8n().pattern(INT_PATTERN).test(ctx.value);
    }
  }),

  [EBaseValidationIdents.amountLength]: aValidator({
    validatorName: EBaseValidationIdents.amountLength,
    handler(ctx, ...args: any[]) {
      return v8n().length(4, 10).test(ctx.value);
    }
  }),
  /** 大小寫英文數字減號（底線：助理帳號專用） */
  [EBaseValidationIdents.username]: aValidator({
    validatorName: EBaseValidationIdents.username,
    handler(ctx, ...args: any[]) {
      return v8n().pattern(USER_PTN_UNDERSCORE).test(ctx.value);
    }
  }),
  /**  5-30字*/
  [EBaseValidationIdents.userLength]: aValidator({
    validatorName: EBaseValidationIdents.userLength,
    handler(ctx, ...args: any[]) {
      return v8n().length(5, 30).test(ctx.value);
    }
  }),
  [EBaseValidationIdents.nickLength]: aValidator({
    validatorName: EBaseValidationIdents.nickLength,
    handler(ctx, ...args: any[]) {
      return v8n().length(1, 10).test(ctx.value);
    }
  }),
  /**  3字*/
  [EBaseValidationIdents.searchLength]: aValidator({
    validatorName: EBaseValidationIdents.searchLength,
    handler(ctx, ...args: any[]) {
      const val = ctx.value as string;
      const arr = val.toAsciiArray();
      return arr.length >= 3 || arr.length == 0;
    }
  }),
  [EBaseValidationIdents.remark]: aValidator({
    validatorName: EBaseValidationIdents.remark,
    handler(ctx, ...rags) {
      return v8n().length(0, 100).test(ctx.value);
    }
  }),
  // untested:
  [EBaseValidationIdents.greater]: aValidator({
    validatorName: EBaseValidationIdents.greater,
    handler(ctx, ...args: any[]) {
      const name = ctx.fieldName;
      const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.greater);
      assert(()=>linkName != undefined);

      const linkField = ctx.model.getFieldByFieldName(linkName!);
      const linkVal = Number(linkField.value);

      // ctx.model.link({
      //   master: { fieldName: ctx.fieldName as any, payloadKey: ctx.payloadKey },
      //   slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
      // });

      ctx.value = 0;
      if (isNaN(Number(ctx.value))) {
        console.log("ctx:", ctx);
        ctx.value = 0;
      } 

      return linkVal < ctx.value;
    },
  }),

  // untested:
  [EBaseValidationIdents.lesser]: aValidator({
    validatorName: EBaseValidationIdents.lesser,
    handler(ctx, ...args: any[]) {
      const name = ctx.fieldName;
      const linkName = ctx.getLinkedFieldName(EBaseValidationIdents.lesser);
      assert(()=>linkName != undefined);
      
      const linkField = ctx.model.getFieldByFieldName(linkName!);
      const linkVal = Number(linkField.value);

      // ctx.model.link({
      //   master: { fieldName: ctx.fieldName as any, payloadKey: ctx.payloadKey },
      //   slave: { fieldName: linkField.fieldName, payloadKey: linkField.payloadKey }
      // });

      if (isNaN(Number(ctx.value))) {
        ctx.value = 0;
      }
      
      return linkVal > ctx.value;
    },
  })
};
