import { computed } from "@gdknot/frontend_common";
export function FormField(option) {
    option.name ?? (option.name = option.dataKey);
    option.value ?? (option.value = undefined);
    option.fieldType ?? (option.fieldType = "text");
    return option;
}
export function HiddenField(option) {
    return FormField({
        dataKey: option.dataKey,
        name: option.dataKey,
        defaultValue: option.value ?? undefined,
        label: computed(() => ""),
        fieldRule: "optional",
        placeholder: computed(() => ""),
        hidden: true,
    });
}
export function createFormState(option) {
    return option;
}
//# sourceMappingURL=formStateUtil.js.map