import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from  '@/lib/supabase'

export const Inbox = () => {
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getChats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      // Fetch conversations where I am the Buyer OR the Seller
      // We also verify we fetch the product details (listings) to show the title
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id, 
          listing_id,
          buyer_id,
          seller_id,
          listings ( title, images, price ) 
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      
      if (error) console.error('Error fetching inbox:', error)
      else setChats(data || [])
      
      setLoading(false)
    }

    getChats()
  }, [])

  if (loading) return <div className="p-10">Loading your chats...</div>

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Messages</h1>
      
      <div className="space-y-4">
        {chats.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          chats.map((chat) => {
            // Figure out the "Other Person's" role
            const isBuyer = chat.buyer_id === userId
            const role = isBuyer ? 'Buying' : 'Selling'
            
            // Safe access to listing data (handle if listing was deleted)
            const title = chat.listings?.title || 'Unknown Item'
            const img = chat.listings?.images?.[0] || '/placeholder.jpg'

            return (
              <Link 
                key={chat.id} 
                to={`/messages/${chat.id}`}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition shadow-sm bg-white"
              >
                {/* Product Image */}
                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                  <img src={img} alt={title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{title}</h3>
                  <p className="text-sm text-gray-500">
                    You are {role} • <span className="text-green-600">Active</span>
                  </p>
                </div>

                {/* Chevron Icon */}
                <div className="text-gray-400">→</div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}