'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  sender: 'buyer' | 'seller'
  senderName: string
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  messages: Message[]
  currentUserRole: 'buyer' | 'seller'
  onSendMessage?: (message: string) => void
}

export function ChatInterface({
  messages,
  currentUserRole,
  onSendMessage,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.sender === currentUserRole
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-xs px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-3xl rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-3xl rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">{message.senderName}</p>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
