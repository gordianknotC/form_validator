import { computed } from "@gdknot/frontend_common";
import { VForm } from "~/base/vformTypes";

export type FormFieldOption = Omit<
  VForm.FormField<any, any>,
  "name" | "value"
> & { name?: string; value?: any };

export function FormField(option: FormFieldOption): FormFieldOption {
  option.name ??= option.dataKey as string;
  option.value ??= undefined;
  option.fieldType ??= "text";
  return option;
}

export function HiddenField(option: {
  dataKey: string;
  value?: any;
}): FormFieldOption {
  return FormField({
    dataKey: option.dataKey as any,
    name: option.dataKey as string,
    defaultValue: option.value ?? undefined,
    label: computed(() => ""),
    fieldRule: "optional",
    placeholder: computed(() => ""),
    hidden: true,
  });
}

export function createFormState<T, E>(
  option: Record<string, FormFieldOption>
) {
  return option;
}
