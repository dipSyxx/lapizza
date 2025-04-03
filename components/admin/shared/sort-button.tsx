import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SortButtonProps {
  active: boolean
  direction: 'asc' | 'desc'
  onClick: () => void
  children: React.ReactNode
}

export function SortButton({ active, direction, onClick, children }: SortButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('h-8 p-0 font-medium flex items-center gap-1', active ? 'text-primary' : 'text-muted-foreground')}
      onClick={onClick}
    >
      {children}
      {active ? (
        direction === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <ChevronUp className="h-4 w-4 text-transparent" />
      )}
    </Button>
  )
}
