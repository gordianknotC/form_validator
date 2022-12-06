import { VForm } from "../../base/vformTypes";
export type FormFieldOption = Omit<VForm.FormField<any, any>, "name" | "value"> & {
    name?: string;
    value?: any;
};
export declare function FormField(option: FormFieldOption): FormFieldOption;
export declare function HiddenField(option: {
    dataKey: string;
    value?: any;
}): FormFieldOption;
export declare function createFormState<T, E>(option: Record<string, FormFieldOption>): Record<string, FormFieldOption>;
