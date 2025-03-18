import { CredentialResponse} from '@react-oauth/google';
import apiClient from './api-client';

export interface IUser {
    email: string,
    username?: string;
    password?: string,
    imgUrl?: string,
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export const register = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Registering user")
        apiClient.post("/api/auth/register", user).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export const login = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("login user")
        apiClient.post("/api/auth/login", user).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export const googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("google signin")
        apiClient.post("/api/auth/google", credentialResponse).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}