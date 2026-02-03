import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'  
import { ChatWindow } from '@/components/ChatWindow'
import { ArrowLeft } from 'lucide-react'

export const ChatPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [chatDetails, setChatDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChatData = async () => {
      // 1. Get Me
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/auth/login'); return }
      setUserId(user.id)

      // 2. Get Chat Details
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listings ( id, title, price, images, condition ),
          buyer:buyer_id ( full_name, profile_image_url ), 
          seller:seller_id ( full_name, profile_image_url )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching chat:', error)
        navigate('/inbox') 
      } else {
        setChatDetails(data)
      }
      setLoading(false)
    }

    fetchChatData()
  }, [id, navigate])

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )

  if (!chatDetails || !userId) return null

  // Determine who the "Other Person" is
  const isMeBuyer = chatDetails.buyer_id === userId
  const otherUser = isMeBuyer ? chatDetails.seller : chatDetails.buyer
  const otherUserName = otherUser?.full_name || (isMeBuyer ? 'Seller' : 'Buyer')
  const otherUserImg = otherUser?.profile_image_url 
  const product = chatDetails.listings

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* --- PRO HEADER --- */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/inbox')} 
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* User Avatar (Fixed to show Image) */}
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border">
           {otherUserImg ? (
             <img src={otherUserImg} alt={otherUserName} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold">
               {otherUserName[0]?.toUpperCase()}
             </div>
           )}
        </div>

        {/* User & Product Info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-800 truncate">{otherUserName}</h2>
          <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <span>Talking about:</span>
            <span className="font-medium text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate(`/product/${product.id}`)}>
              {product.title}
            </span>
            <span>• ₹{product.price}</span>
          </div>
        </div>

        {/* Product Thumbnail (Clickable) */}
        <div className="w-10 h-10 rounded border overflow-hidden cursor-pointer bg-gray-100"
             onClick={() => navigate(`/product/${product.id}`)}>
           <img src={product.images?.[0] || '/placeholder.jpg'} alt="Product" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow conversationId={id!} currentUserId={userId} />
      </div>
    </div>
  )
}