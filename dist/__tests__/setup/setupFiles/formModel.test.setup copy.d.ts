import { VForm, BaseFormImpl, Optional } from "index";
import TFormKey = VForm.FormKey;
import TFormOption = VForm.FormOption;
export type PostUserPayload = {
    password: string;
    username: string;
    remark: Optional<string>;
    nickname: Optional<string>;
    email: string;
    phone: string;
};
type TFields = PostUserPayload & {
    confirm_password: string;
};
type TExtraFields = {};
type T = TFields;
type E = TExtraFields;
export declare class CreateUserFormModel extends BaseFormImpl<T, E> {
    constructor(option?: Partial<TFormOption<T, E>>);
    getPayload(): Record<TFormKey<T, E>, any>;
}
declare const _default: CreateUserFormModel;
export default _default;
