import { Quote } from "./Quote";

export interface UserLogin {
  username: string;
  password: string;
  email: string;
  savedQuote: Quote[];
  // rememberMe: boolean;
}