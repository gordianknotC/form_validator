import { VForm } from "~/base/vformTypes";
export declare type TFormFieldOption = Omit<VForm.TFormField<any, any>, 'name' | 'value'> & {
    name?: string;
    value?: any;
};
export declare function FormField(option: TFormFieldOption): TFormFieldOption;
export declare function HiddenField(option: {
    dataKey: string;
    value?: any;
}): TFormFieldOption;
export declare function createFormState<T, E>(option: Record<string, TFormFieldOption>): Record<string, TFormFieldOption>;
