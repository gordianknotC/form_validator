import { computed } from "@gdknot/frontend_common";
const hiddenField = (dataKey) => {
    return {
        dataKey,
        name: dataKey,
        value: 0,
        label: computed(() => ""),
        rule: "",
        placeholder: computed(() => ""),
        hidden: true
    };
};
export var EFormValidationRules;
(function (EFormValidationRules) {
    EFormValidationRules["allUserPattern"] = "allUserPattern";
    EFormValidationRules["bail"] = "bail";
    EFormValidationRules["confirm"] = "confirm";
    EFormValidationRules["email"] = "email";
    EFormValidationRules["remark"] = "remark";
    EFormValidationRules["notEqual"] = "notEqual";
    EFormValidationRules["optional"] = "optional";
    EFormValidationRules["phone"] = "phone";
    EFormValidationRules["pwdLength"] = "pwdLength";
    EFormValidationRules["pwdPattern"] = "pwdPattern";
    EFormValidationRules["required"] = "required";
    EFormValidationRules["searchLength"] = "searchLength";
    EFormValidationRules["nickLength"] = "nickLength";
    EFormValidationRules["userLength"] = "userLength";
    EFormValidationRules["userPattern"] = "userPattern";
})(EFormValidationRules || (EFormValidationRules = {}));
export const appFormRules = {
    general: {
        username: `required|${EFormValidationRules.userLength}|${EFormValidationRules.userPattern}`,
        nickname: `required|${EFormValidationRules.nickLength}|${EFormValidationRules.userPattern}`,
        password: `required|${EFormValidationRules.pwdLength}|${EFormValidationRules.pwdPattern}`,
        newPassword: `required|${EFormValidationRules.notEqual}|${EFormValidationRules.pwdLength}|${EFormValidationRules.pwdPattern}`,
        confirmPassword: "required|confirm",
        remark: "optional",
        allUsername: `bail|${EFormValidationRules.allUserPattern}|${EFormValidationRules.userLength}`,
        searchField: `bail|${EFormValidationRules.userLength}|${EFormValidationRules.userPattern}`,
        phone: `required|${EFormValidationRules.phone}`,
        email: `required|${EFormValidationRules.email}`
    }
};
export const baseFormState = {
    unconfirmedLeague: {
        dataKey: "unconfirmedLeague",
        name: "unconfirmedLeague",
        value: 0,
        label: computed(() => "facade.languageService.txt.unconfirmedLeague"),
        rule: "",
        placeholder: computed(() => "facade.languageService.txt.unconfirmedLeague")
    },
    confirmedLeague: {
        dataKey: "confirmedLeague",
        name: "confirmedLeague",
        value: 0,
        label: computed(() => "facade.languageService.txt.confirmedLeague"),
        rule: "",
        placeholder: computed(() => "facade.languageService.txt.confirmedLeague")
    },
    winners: {
        dataKey: "winners",
        name: "winners",
        value: 0,
        label: computed(() => "facade.languageService.txt.selectWinners"),
        rule: "",
        placeholder: computed(() => "facade.languageService.txt.selectWinners")
    },
    entity: {
        dataKey: "entity",
        name: "entity",
        value: 0,
        label: computed(() => "facade.languageService.txt.entity"),
        rule: "",
        placeholder: computed(() => "facade.languageService.txt.entity")
    },
    profit: {
        dataKey: "profit",
        name: "profit",
        value: 0,
        label: computed(() => "facade.languageService.txt.profit"),
        rule: "",
        placeholder: computed(() => "")
    },
    max_teams: {
        dataKey: "max_teams",
        name: "max_teams",
        value: 0,
        label: computed(() => "facade.languageService.txt.maxTeams"),
        rule: "",
        placeholder: computed(() => "")
    },
    prize: {
        dataKey: "prize",
        name: "prize",
        value: 0,
        label: computed(() => "facade.languageService.txt.prize"),
        rule: "",
        placeholder: computed(() => "")
    },
    contest_size: {
        dataKey: "contest_size",
        name: "contest_size",
        value: 0,
        label: computed(() => "facade.languageService.txt.contestSize"),
        rule: "",
        placeholder: computed(() => "")
    },
    sport_id: hiddenField("sport_id"),
    match_id: hiddenField("match_id"),
    id: hiddenField("id"),
    merchantId: hiddenField("merchantId"),
    username: {
        dataKey: "username",
        name: "username",
        value: "",
        label: computed(() => "facade.languageService.txt.username"),
        rule: appFormRules.general.allUsername,
        placeholder: computed(() => "facade.languageService.txt.placeholder_username")
    },
    password: {
        dataKey: "password",
        name: "password",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.password"),
        rule: appFormRules.general.password,
        placeholder: computed(() => "facade.languageService.txt.placeholder_password")
    },
    oldPassword: {
        dataKey: "password",
        name: "password",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.oldPassword"),
        rule: appFormRules.general.password,
        placeholder: computed(() => "facade.languageService.txt.placeholder_password")
    },
    new_password: {
        dataKey: "new_password",
        name: "password_notEqual",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.newPassword"),
        rule: appFormRules.general.newPassword,
        placeholder: computed(() => "facade.languageService.txt.placeholder_password")
    },
    confirm_new_password: {
        dataKey: "confirm_new_password",
        name: "password_notEqual_confirm",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.newPasswordConfirm"),
        rule: appFormRules.general.confirmPassword,
        placeholder: computed(() => "facade.languageService.txt.placeholder_confirm_password")
    },
    confirm_password: {
        dataKey: "confirm_password",
        name: "password_confirm",
        value: "",
        fieldType: "password",
        label: computed(() => "facade.languageService.txt.confirmPassword"),
        rule: appFormRules.general.confirmPassword,
        placeholder: computed(() => "facade.languageService.txt.placeholder_confirm_password")
    },
    nickname: {
        dataKey: "nickname",
        name: "nickname",
        value: "",
        label: computed(() => "facade.languageService.txt.nickname"),
        rule: appFormRules.general.nickname,
        placeholder: computed(() => "facade.languageService.txt.placeholder_nickname")
    },
    remark: {
        dataKey: "remark",
        name: "remark",
        value: "",
        label: computed(() => "facade.languageService.txt.remark"),
        rule: appFormRules.general.remark,
        placeholder: computed(() => "facade.languageService.txt.placeholder_remark")
    },
    phone: {
        dataKey: "phone",
        name: "phone",
        value: "",
        label: computed(() => "facade.languageService.txt.phone"),
        rule: appFormRules.general.phone,
        placeholder: computed(() => "facade.languageService.txt.placeholder_phone")
    },
    email: {
        dataKey: "email",
        name: "email",
        value: "",
        label: computed(() => "facade.languageService.txt.email"),
        rule: appFormRules.general.email,
        placeholder: computed(() => "facade.languageService.txt.placeholder_email")
    },
    is_generate_contest: {
        dataKey: "is_generate_contest",
        name: "is_generate_contest",
        value: false,
        label: computed(() => "facade.languageService.txt.isGenerateContest"),
        rule: "required",
        placeholder: computed(() => "facade.languageService.txt.placeholder_email"),
        fieldType: "radio"
    }
};
describe("ref setup", () => {
    test("computed", () => {
        expect(13).toBe(13);
    });
});
//# sourceMappingURL=form.test.js.map