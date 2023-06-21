import Navbar from 'browser/components/navbar'
import Search from 'browser/components/search'
import Card from 'browser/components/card'
import { useEffect } from 'react';
import { getServerSession } from "next-auth/next"
import useStore from "browser/state/store"
import ItemService from 'browser/service/ItemService'

export default function BrandNew(props) {
  const { user } = props 
  const { syncState, filter, items, allItems } = useStore((state) => state)
  
  useEffect(() => {
    // Initialize state
    syncState({
      filter: props.filter,
      selectedStore: props.selectedStore,
      allItems: props.allItems,
      items: props.items,
      query: props.query
    })
  }, []);

  return (
    <>
      <div className="min-h-full">
        <Navbar user={user} />
        <Search filter={filter} />

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div>
              <p className="text-gray-500 font-light text-sm text-center pb-5">
                Displaying {items.length} of {allItems.length}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(
    req,
    res
  )

  if (!session || !session.user) {
    return {
      redirect: { destination: "/signin" },
    };
  }

  const { term } = query

  const items = await ItemService.findItems({ 
    title: term
  });

  return {
    props: {
      user: session.user,
      filter: {
        text: '',
        available: true,
        alarm: true,
        deal: false,
        super: false,
        price: true
      },
      items: items.filter(item => item.available == true && item.alarm == true),
      allItems: items,
      query: {
        title: term
      }
    }
  };
}