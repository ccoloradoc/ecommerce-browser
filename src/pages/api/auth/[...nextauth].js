import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log('jwt', token, user)
      if (user && user.email == '100332966@alumnos.uc3m.es') {
        token.role = user.role = 'admin';
      }
      return token;
    },
    session({ session, token }) {
      
      if (token && session.user && session.user.email == '100332966@alumnos.uc3m.es') {
        session.user.role = 'admin'; 
      }
      // console.log('session', token, session)
      return session;
    },
  }
}
export default NextAuth(authOptions)