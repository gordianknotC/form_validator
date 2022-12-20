import { VForm, BaseFormImpl, baseValidators } from "index";
import { TSignInPayload } from "./payload.test.setup";
import TFormKey = VForm.FormKey;
import TFormOption = VForm.FormOption;
type TFields = TSignInPayload & {
    confirm_password: string;
};
type TExtraFields = {};
type T = TFields;
type E = TExtraFields;
type V = typeof baseValidators;
export declare class CreateUserFormModel extends BaseFormImpl<T, E, V> {
    constructor(option?: Partial<TFormOption<T, E, V>>);
    getPayload(): Record<TFormKey<T, E, V>, any>;
}
export declare const createUserFormModel: CreateUserFormModel;
export {};
