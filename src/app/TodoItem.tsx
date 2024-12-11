'use client'

import {useState} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {Button} from '@/components/ui/button'
import {ChevronDown, ChevronRight, Trash2} from 'lucide-react'
import {AddTodoForm} from './AddTodoForm'
import {Todo} from "@/app/api/mockDb";

interface TodoItemProps {
    todo: Todo
    onToggle: (todo: Todo) => void
    onDelete: (todo: Todo) => void
    onAddTask: (text: string, parentId: string) => void
    level?: number
    index: number
    isFrozen: boolean
}

export function TodoItem({
                             todo,
                             onToggle,
                             onDelete,
                             onAddTask,
                             level = 0,
                             isFrozen
                         }: TodoItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const getBgColor = (level: number) => {
        const colors = [
            'bg-gray-100',
            'bg-gray-200',
            'bg-gray-300',
            'bg-gray-400',
            'bg-gray-500',
        ]
        return colors[level % colors.length]
    }

    const completedSubtasks = todo.todos.filter(task => task.completed).length
    const totalSubtasks = todo.todos.length
    const allSubtasksCompleted = totalSubtasks > 0 && completedSubtasks === totalSubtasks

    return (
        <div
            className={`${getBgColor(level ?? 0)} p-4 rounded-lg mb-2`}
        >
            <div className="flex items-center space-x-2">
                {todo.todos.length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? "Collapse tasks" : "Expand tasks"}
                    >
                        {isExpanded ? <ChevronDown className="h-4"/> : <ChevronRight className="h-4"/>}
                    </Button>
                )}
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo)}
                    id={`todo-${todo.id}`}
                    disabled={isFrozen}
                />
                <label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
                >
                    {todo.text}
                </label>
                {totalSubtasks > 0 && (
                    <span className={`text-sm ${allSubtasksCompleted ? 'text-green-500' : 'text-gray-500'}`}>
                {completedSubtasks}/{totalSubtasks}
              </span>
                )}
            </div>
            {isExpanded && (
                <>
                    <div className="mt-2 text-sm text-gray-500">by {todo.updatedBy}</div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(todo)}
                        className="mt-2 text-red-500 hover:text-red-700"
                        disabled={isFrozen}
                    >
                        <Trash2 className="h-4 w-4 mr-2"/>
                        Delete
                    </Button>

                    <div
                        className="ml-6 mt-2 space-y-2"
                    >
                        {todo.todos.map((task, taskIndex) => (
                            <TodoItem
                                key={task.id}
                                todo={task}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                onAddTask={onAddTask}
                                level={level + 1}
                                index={taskIndex}
                                isFrozen={isFrozen}
                            />
                        ))}
                        <AddTodoForm onAdd={(text) => onAddTask(text, todo.id)} disabled={isFrozen}/>
                    </div>
                </>
            )}
            {!isExpanded && todo.todos.length === 0 && (
                <div className="ml-6 mt-2">
                    <AddTodoForm onAdd={(text) => onAddTask(text, todo.id)} disabled={isFrozen}/>
                </div>
            )}
        </div>

    )
}

