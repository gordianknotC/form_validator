import { computed } from "vue";
import { useBuiltIn } from "common_js_builtin/dist/base/builtinTypes";
useBuiltIn();
export function FormField(option) {
    var _a, _b, _c;
    (_a = option.name) !== null && _a !== void 0 ? _a : (option.name = option.dataKey);
    (_b = option.value) !== null && _b !== void 0 ? _b : (option.value = undefined);
    (_c = option.fieldType) !== null && _c !== void 0 ? _c : (option.fieldType = "text");
    return option;
}
export function HiddenField(option) {
    var _a;
    return FormField({
        dataKey: option.dataKey,
        name: option.dataKey,
        value: (_a = option.value) !== null && _a !== void 0 ? _a : undefined,
        label: computed(() => ""),
        rule: "optional",
        placeholder: computed(() => ""),
        hidden: true
    });
}
export function createFormState(option) {
    return option;
}
//# sourceMappingURL=formStateUtil.js.map