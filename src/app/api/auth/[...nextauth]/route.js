import { dbConnect } from "@/lib/dbConnect";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google";




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
          })
     ],
     callbacks: {
          async signIn({ user, account, profile, email, credentials }) {
               return true
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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }