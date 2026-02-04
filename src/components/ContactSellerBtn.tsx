import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

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
      toast.info("Please login to chat!")
      return
    }

    if (currentUserId === sellerId) {
      toast.error("You can't chat with yourself!")
      return
    }

    setLoading(true)
    console.log('[Chat] Starting chat process...', { listingId, sellerId, currentUserId });

    try {
      // 1. Check if conversation already exists
      const { data: existingChat, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', currentUserId)
        .eq('seller_id', sellerId)
        .maybeSingle() // Returns null if not found (instead of error)

      if (fetchError) {
        console.error('[Chat] Fetch error:', fetchError);
        throw fetchError;
      }

      if (existingChat) {
        console.log('[Chat] Existing chat found:', existingChat.id);
        navigate(`/messages/${existingChat.id}`)
      } else {
        console.log('[Chat] No existing chat, creating new one...');
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

        if (createError) {
          console.error('[Chat] Create error:', createError);
          throw createError;
        }

        console.log('[Chat] New chat created:', newChat.id);
        // Go to new chat
        navigate(`/messages/${newChat.id}`)
      }

    } catch (error: any) {
      console.error('[Chat] Fatal error starting chat:', error)
      toast.error(error.message || 'Something went wrong starting the chat.')
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
