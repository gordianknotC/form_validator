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
  card_number: number;
  card_number_A: number;
  card_number_B: number;
};

export type Fields = SignUpPayload 
& LoginPayload
& UpdatePwdPayload;


export enum EFieldNames {
  cardNumber = "cardNumber",
  cardNumberA = "cardNumberA",
  cardNumberB = "cardNumberB",
  username = "username", 
  password = "password",
  newPassword="newPassword",
  //confirm password
  confirmPasswordOnSignUp = "confirmPasswordOnSignUp",
  confirmPasswordOnResetPassword = "confirmPasswordOnResetPassword",
  //
  nickname = "nickname",
  email = "email",
  phone = "phone",
  remark="remark"
}