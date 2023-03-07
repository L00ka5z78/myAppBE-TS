import {UserDocument} from "../../models/User";

type UserType = UserDocument;

export interface UserEntity extends UserType {
    name: string,
    email: string,
    age: number,
    password: string
}