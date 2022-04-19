import {auth} from '../backend/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "@firebase/auth";
//https://www.youtube.com/watch?v=DuAv6Yqv9LI&t=2126s
export const AuthService = {
    logout : async () => {
        await signOut(auth);
        window.location.href = '/'
    },
    createUserWithEmailAndPassword: async (email, password) => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password)
            await userCred.user.sendEmailVerification({
                url: "http://localhost:3000"
            })
            return {
                user: userCred.user
            }
        } catch (e) {
            return{
                error: e.message
            }
        }
    },

    signInWithEmailAndPassword: async (email, password) => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password)
            return {
                user: userCred.user
            }
        } catch (e) {
            return{
                error: e.message
            }
        }
    },

    resetPassword: async (email) => {
        try {
            auth.sendPasswordResetEmail(email, {url: "http://localhost:3000/login"})
        } catch (e) {
            return{
                error: e.message
            }
        }
    }



 }