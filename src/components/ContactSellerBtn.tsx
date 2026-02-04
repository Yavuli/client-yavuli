import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

interface ContactSellerBtnProps {
  listingId: string
  sellerId: string
  currentUserId: string
}

export const ContactSellerBtn = ({ listingId, sellerId, currentUserId }: ContactSellerBtnProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleContact = async () => {
    if (!currentUserId) {
      alert("Please login to chat!")
      return
    }

    if (currentUserId === sellerId) {
      alert("You can't chat with yourself!")
      return
    }

    setLoading(true)

    try {
      // 1. Check if conversation already exists
      const { data: existingChat, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', currentUserId)
        .eq('seller_id', sellerId)
        .maybeSingle() // Returns null if not found (instead of error)

      if (fetchError) throw fetchError

      if (existingChat) {
        // Chat exists then we  Go to it
        navigate(`/messages/${existingChat.id}`)
      } else {
        // Chat doesn't exist we  Create it
        const { data: newChat, error: createError } = await supabase
          .from('conversations')
          .insert({
            listing_id: listingId,
            buyer_id: currentUserId,
            seller_id: sellerId
          })
          .select()
          .single()

        if (createError) throw createError

        // Go to new chat
        navigate(`/messages/${newChat.id}`)
      }

    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Something went wrong starting the chat.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleContact}
      disabled={loading}
      variant="outline"
      className="w-full"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {loading ? 'Starting Chat...' : 'Chat with Seller'}
    </Button>
  )
}
