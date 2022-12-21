import { Optional } from "index";

export type LoginPayload = {
  username: string;
  password: string;
};

export type UpdatePwdPayload = {
  password: string;
  new_password: string;
  confirm_new_password: string;
};

export type SignUpPayload = {
  password: string;
  confirm_password: string;
  username: string;
  remark: Optional<string>;
  nickname: Optional<string>;
  email: string;
  phone: string;
};

export type Fields = SignUpPayload 
& LoginPayload
& UpdatePwdPayload;
