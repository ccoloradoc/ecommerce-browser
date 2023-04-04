import { SessionProvider } from "next-auth/react"
import 'browser/styles/globals.css'

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps}
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
