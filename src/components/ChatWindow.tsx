import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  is_read: boolean
}

interface ChatProps {
  conversationId: string
  currentUserId: string
}

export const ChatWindow = ({ conversationId, currentUserId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    let mounted = true;
    let channel: any = null;

    // 1. Fetch Messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('[ChatWindow] Error fetching messages:', error);
          return;
        }

        if (mounted && data) {
          setMessages(data)
        }

        // 2. MARK AS READ 
        // If there are messages from the OTHER person that are unread, mark them read now.
        const unreadIds = data
          ?.filter(m => m.sender_id !== currentUserId && !m.is_read)
          .map(m => m.id)

        if (unreadIds && unreadIds.length > 0) {
          try {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .in('id', unreadIds)
          } catch (updateError) {
            console.error('[ChatWindow] Error marking messages as read:', updateError);
          }
        }
      } catch (error) {
        console.error('[ChatWindow] Fatal error fetching messages:', error);
      }
    }

    fetchMessages()

    // 3. Realtime Subscription
    try {
      channel = supabase
        .channel(`chat:${conversationId}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
          (payload) => {
            if (!mounted) return;

            try {
              setMessages((prev) => [...prev, payload.new as Message])
              // If I receive a message while looking at the screen, mark it read immediately
              if (payload.new.sender_id !== currentUserId) {
                supabase.from('messages')
                  .update({ is_read: true })
                  .eq('id', payload.new.id)
                  .then(({ error }) => {
                    if (error) console.error('[ChatWindow] Error marking new message as read:', error);
                  })
              }
            } catch (error) {
              console.error('[ChatWindow] Error processing new message:', error);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[ChatWindow] Realtime subscribed successfully');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[ChatWindow] Realtime subscription error');
          } else if (status === 'TIMED_OUT') {
            console.warn('[ChatWindow] Realtime subscription timed out');
          }
        })
    } catch (error) {
      console.error('[ChatWindow] Error setting up realtime subscription:', error);
    }

    return () => {
      mounted = false;
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('[ChatWindow] Error removing channel:', error);
        }
      }
    }
  }, [conversationId, currentUserId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const msg = newMessage
    setNewMessage('') // clear input immediately

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: msg,
        sender_id: currentUserId
      })

    if (error) {
      console.error('Error sending:', error)
      setNewMessage(msg) // restore if failed
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm relative group ${isMe
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border rounded-bl-none'
                }`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {time}
                  {isMe && <span className="ml-1">{msg.is_read ? '✓✓' : '✓'}</span>}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2 items-center">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 border-none focus:ring-1 focus:ring-blue-500 rounded-full px-4 py-3"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}