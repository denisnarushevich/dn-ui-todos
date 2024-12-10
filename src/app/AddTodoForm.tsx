'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Plus} from 'lucide-react'

interface AddTodoFormProps {
    onAdd: (text: string) => void
    disabled?: boolean
}

export function AddTodoForm({onAdd, disabled = false}: AddTodoFormProps) {
    const [text, setText] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (text.trim() && !disabled) {
            onAdd(text.trim())
            setText('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new task"
                className="flex-grow"
                disabled={disabled}
            />
            <Button type="submit" size="icon" disabled={disabled}>
                <Plus className="h-4 w-4"/>
            </Button>
        </form>
    )
}

