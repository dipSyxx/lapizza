import React, { ChangeEvent } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function SearchBarAdmin({ searchTerm, onChange }: SearchBarProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search categories by name..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={searchTerm}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
