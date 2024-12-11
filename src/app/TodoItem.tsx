'use client'

import {useState} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {Button} from '@/components/ui/button'
import {ChevronUp, Trash2} from 'lucide-react'
import {AddTodoForm} from './AddTodoForm'
import {Todo, User} from "@/app/api/mockBackend";
import {useProfile} from "@/app/api/useProfile";

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

    const {data} = useProfile(todo.createdBy);
    const createdByProfile = data as User | undefined;
    console.log(createdByProfile);
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
    const allSubtasksCompleted = totalSubtasks > 0 && completedSubtasks === totalSubtasks;

    return (
        <div
            className={`${getBgColor(level ?? 0)} p-4 rounded-lg mb-2`}
        >
            <div className="flex items-center space-x-2">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo)}
                    id={`todo-${todo.id}`}
                    disabled={isFrozen}
                />
                <label
                    htmlFor={`todo-${todo.id}`}
                    className={`font-bold flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
                >
                    {todo.text}
                </label>
                {totalSubtasks > 0 && (
                    <span
                        className={`text-sm font-bold ${allSubtasksCompleted ? 'text-green-500' : completedSubtasks ? 'text-orange-500' : 'text-gray-500'}`}>
                {completedSubtasks}/{totalSubtasks}
              </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Collapse tasks" : "Expand tasks"}
                >
                    <ChevronUp className="h-4" style={{
                        transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
                        transition: "transform 200ms ease-in"
                    }}/>
                </Button>
            </div>
            {isExpanded && (
                <div className="mt-4">

                    <div className='font-bold text-sm'>Actions</div>
                    <div className='mt-1'>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onDelete(todo)}
                            className="text-red-500 hover:text-red-700"
                            disabled={isFrozen}
                        >
                            <Trash2 className="h-4 w-4 "/>
                        </Button>
                    </div>

                    <div className=' font-bold text-sm mt-4'>Author</div>
                    {createdByProfile && <div className="mt-1 text-sm text-gray-500">{createdByProfile.name}</div>}

                    <div className=' font-bold text-sm mt-4'>Subtasks</div>
                    <div
                        className="mt-1"
                    >
                        <AddTodoForm onAdd={(text) => onAddTask(text, todo.id)} disabled={isFrozen}/>
                        <div className="mt-2">
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
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

