'use client'

import { MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  participantName: string
  lastMessage: string
  timestamp: Date
  isRead: boolean
}

interface ChatListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelectConversation?: (id: string) => void
}

export function ChatList({
  conversations,
  selectedId,
  onSelectConversation,
}: ChatListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className={cn(
            'cursor-pointer transition-colors hover:bg-muted',
            selectedId === conversation.id && 'border-primary bg-muted'
          )}
          onClick={() => onSelectConversation?.(conversation.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  'text-sm font-semibold truncate',
                  !conversation.isRead && 'text-primary font-bold'
                )}>
                  {conversation.participantName}
                </h4>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {conversation.lastMessage}
                </p>
              </div>
              <p className="text-xs text-muted-foreground ml-2 shrink-0">
                {conversation.timestamp.toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
