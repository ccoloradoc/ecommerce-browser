import Navbar from 'browser/components/navbar'
import StackItem from 'browser/components/stack-item'
import { getSession, signOut } from "next-auth/react"
import ItemService from 'browser/service/ItemService'

export default function Example({ user, stores }) {
  return (
    <>
      <div className="min-h-full">
        <Navbar user={user} />
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <ul className="flex flex-col">
            {stores.map(store => (
              <StackItem 
                key={store.name}
                title={store.name}
                dek={`${store.count} monitored items`}
                link={`/store/${store.name.toLowerCase()}`}
                />
            ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: "/signin" },
    };
  }

  const stores = await ItemService.findStores()
  return {
    props: {
      user: session.user,
      stores: stores
    }
  };
}