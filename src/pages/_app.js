import { SessionProvider } from "next-auth/react"
import 'browser/styles/globals.css'

export default function App({
  Component,
  pageProps
}) {
  return (
    <SessionProvider session={pageProps.session} >
      <Component {...pageProps} />
    </SessionProvider>
  )
}
