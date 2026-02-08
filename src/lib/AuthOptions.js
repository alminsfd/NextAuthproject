
import { dbConnect } from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
     providers: [

          CredentialsProvider({
               // The name to display on the sign in form (e.g. "Sign in with...")
               name: " Email and Password",
               credentials: {
                    email: { label: "Email", type: "email", placeholder: "user@example.com" },
                    password: { label: "Password", type: "password", placeholder: '************' },
               },

               async authorize(credentials, req) {
                    const { email, password } = credentials
                    const user = await dbConnect('user').findOne({ email })
                    if (!user) return null
                    const isMatched = await bcrypt.compare(password, user.password)
                    if (isMatched) {
                         return user
                    }
                    return null
               }
          }),
          GoogleProvider({
               clientId: process.env.GOOGLE_CLIENT_ID,
               clientSecret: process.env.GOOGLE_CLIENT_SECRET
          }),
          GitHubProvider({
               clientId: process.env.GITHUB_ID,
               clientSecret: process.env.GITHUB_SECRET
          })
     ],
     callbacks: {
          async signIn({ user, account, profile, email, credentials }) {
               try {
                    const payload = {
                         ...user,
                         provider: account.provider,
                         providerId: account.providerAccountId,
                         role: 'user',
                         createdAt: new Date().toISOString()
                    }
                    if (!user?.email) {
                         return false
                    }
                    const Isexisted = await dbConnect('user').findOne({ email: user.email })
                    if (!Isexisted) {
                         await dbConnect('user').insertOne(payload)
                    }
                    return true

               } catch (err) {
                    console.log(err)
                    return false
               }


          },
          // async redirect({ url, baseUrl }) {
          //      return baseUrl
          // },
          async session({ session, token, user }) {
               if (token) {
                    session.role = token.role
               }
               return session
          },
          async jwt({ token, user, account, profile, isNewUser }) {
               // console.log(user)
               if (user) {
                    token.email = user.email
                    token.role = user.role
               }
               return token
          }
     },
}