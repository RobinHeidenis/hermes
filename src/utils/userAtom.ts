import {atom} from "jotai";
import type {User} from "lucia";

export const userAtom = atom<null | User>(null);