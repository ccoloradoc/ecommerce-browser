import { getServerSession } from "next-auth/next"
import { getCsrfToken } from "next-auth/react"
import { authOptions } from "./api/auth/[...nextauth]"
import { LockClosedIcon } from '@heroicons/react/20/solid'

export default function Login({ csrfToken }) {
  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <input type="hidden" name="remember" defaultValue="true" />
          <div>
            <form action="/api/auth/signin/github" method="POST">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <input type="hidden" name="callbackUrl" value="/" />
              <button type="submit" className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div >
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      csrfToken: csrfToken,
    }
  };
}