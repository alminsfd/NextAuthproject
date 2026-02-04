import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";



const userList = [
     {
          name: 'Almin',
          password: 158988,
          Secretcode: 14656,

     },
     {
          name: 'Tanvir',
          password: 69958,
          Secretcode: 54569
     }
]
export const authOptions = {
     providers: [

          CredentialsProvider({
               // The name to display on the sign in form (e.g. "Sign in with...")
               name: " credentials ",
               credentials: {
                    username: { label: "Username", type: "text", placeholder: "jsmith" },
                    password: { label: "Password", type: "password", placeholder: '************' },
                    Secretcode: { label: " Secretcode", type: "tel", placeholder: '1858XXXXXXXX' }

               },
               async authorize(credentials, req) {
                    const { Secretcode, password, username } = credentials
                    const user = userList.find(u => u.name == username)
                    if (!user) return null
                    const isPassworkOk = user.password == password
                    if (isPassworkOk) {
                         return user
                    }
                    return null
               }
          })
     ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }