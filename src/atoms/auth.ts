import { atom } from "recoil";
import { IAuthState } from "../types";

const authState = atom<IAuthState>({
  key: "authState",
  default: {
    password: "",
    valid: false,
  },
});

export default authState;
