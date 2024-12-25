import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { ArrowUpDown } from 'lucide-react'
import React from 'react'

interface Props {
  className?: string
}

export const SortPopap: React.FC<Props> = ({ className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn('inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-xl cursor-pointer', className)}
        >
          <ArrowUpDown className="w-4 h-4" />
          <b>Sorting:</b>

          <b className="text-primary">Popular</b>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] bg-white rounded-md">
        <ul>
          <li className="hover:bg-secondary hover:text-primary p-2 px-4 cursor-pointer rounded-md">Popular first</li>
          <li className="hover:bg-secondary hover:text-primary p-2 px-4 cursor-pointer rounded-md">
            First inexpensive
          </li>
          <li className="hover:bg-secondary hover:text-primary p-2 px-4 cursor-pointer rounded-md">First expensive</li>
          <li className="hover:bg-secondary hover:text-primary p-2 px-4 cursor-pointer rounded-md">Best rated</li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
