'use client'

import {useCallback, useState} from 'react'
import {TodoItem} from '../TodoItem'
import {AddTodoForm} from '../AddTodoForm'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {ListChecksIcon, LockIcon, UnlockIcon} from 'lucide-react'
import {useCurrentUser} from "@/app/CurrentUserProvider";
import {NameFormContent} from "@/app/NameForm";

import {Dialog, DialogContent,} from "@/components/ui/dialog"
import {createTodoList, fetchTodoList, Todo, TodoList, updateTodoList} from "@/app/mockDb";
import useSWR, {Fetcher, mutate} from "swr";
import {useParams, useRouter} from "next/navigation";

import {v4 as uuidv4} from 'uuid';
import {Spinner} from "@/app/Spinner";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

export default function TodoApp() {
    const router = useRouter()
    const {listId} = useParams<{ listId: string }>();

    const {data, error, mutate: mutateList} = useSWR(`todos/${listId}`, (async () => {
            const list = await fetchTodoList(listId);
            if (list) {
                return list;
            } else {
                throw "list not found";
            }
        }) as Fetcher<TodoList, string>
    )
    const todoList = data as TodoList | undefined;

    const [user, loginByName] = useCurrentUser();

    const [showNameForm, setShowNameForm] = useState(false);
    const handleEditClick = useCallback(() => {
        setShowNameForm(true);
    }, [])
    const handleNameFormSubmit = useCallback(async ({name}: { name: string }) => {
        await loginByName(name);
        setShowNameForm(false);
    }, [loginByName]);


    if (!todoList) {
        if (error) {
            return error
        } else {
            return <Spinner className="w-10 h-10"/>;
        }
    }

    function update(list: TodoList) {
        mutateList(list, {revalidate: false});
        return updateTodoList(list);
    }

    const addTodo = (text: string, parentId: string | null = null, author: string) => {
        const newTodo: Todo = {
            id: uuidv4(),
            text,
            completed: false,
            todos: [],
            createdBy: author,
            updatedBy: author,
            contributors: [author]
        }
        if (parentId === null) {
            update({
                ...todoList,
                todos: [...todoList.todos, newTodo]
            })
        } else {
            update({
                ...todoList,
                todos: updateTodos(todoList.todos, parentId, (todo) => ({
                    ...todo,
                    todos: [...todo.todos, newTodo]
                }))
            })
        }
        mutateList()
    }

    const toggleTodo = (id: string) => {
        update({
            ...todoList,
            todos: updateTodos(todoList.todos, id, (todo) => ({
                ...todo,
                completed: !todo.completed
            }))
        })
    }

    const deleteTodo = (id: string) => {
        const deleteFromTasks = (tasks: Todo[]): Todo[] =>
            tasks.filter(task => task.id !== id)
                .map(task => ({...task, tasks: deleteFromTasks(task.todos)}))

        update({
            ...todoList,
            todos: deleteFromTasks(todoList.todos)
        })
    }

    const updateTodos = (todos: Todo[], id: string, updateFn: (todo: Todo) => Todo): Todo[] => {
        return todos.map(todo => {
            if (todo.id === id) {
                return updateFn(todo)
            }
            if (todo.todos.length > 0) {
                return {...todo, todos: updateTodos(todo.todos, id, updateFn)}
            }
            return todo
        })
    }

    const toggleFreeze = () => {
        update({
            ...todoList,
            isFrozen: !todoList.isFrozen
        })
    }

    const updateListName = (newName: string) => {
        update({
            ...todoList,
            name: newName
        })
        mutateList();
    }

    const createNew = async () => {
        if (user) {
            const newList = await createTodoList("New Todos", user.id);
            await mutate(`todos/${newList.id}`, newList);
            router.push(`/${newList.id}`);
        } else {
            setShowNameForm(true);
        }
    }

    return (
        <>
            <div className="min-h-full flex flex-col">
                <div className="h-16 shadow-md flex px-4 items-center gap-4">
                    <div className="flex-grow flex gap-2 items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button size="icon">
                                    <ListChecksIcon
                                        className="w-6 h-6 flex-shrink-0"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={createNew}>Create New</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Input
                            value={todoList.name}
                            onChange={(e) => updateListName(e.target.value)}
                            className="text-lg font-bold bg-transparent border-none"
                            disabled={todoList.isFrozen}
                        />
                    </div>
                    {user && todoList.createdBy === user.id && <Button onClick={toggleFreeze} variant="outline">
                        {todoList.isFrozen ? <UnlockIcon className="mr-2"/> : <LockIcon className="mr-2"/>}
                        {todoList.isFrozen ? 'Freeze' : 'Unfreeze'}
                    </Button>}
                    {!user && <Button onClick={handleEditClick} variant="outline">
                        Edit
                    </Button>}
                </div>

                <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4">


                    </div>
                    <AddTodoForm onAdd={(text) => addTodo(text, null, 'Current User')}
                                 disabled={todoList.isFrozen}/>

                    <ul
                        className="mt-4 space-y-4"
                    >
                        {todoList?.todos.map((todo, index) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                                onAddTask={(text, parentId) => addTodo(text, parentId, 'Current User')}
                                level={0}
                                index={index}
                                isFrozen={todoList?.isFrozen ?? true}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <Dialog open={showNameForm} onOpenChange={setShowNameForm}>
                <DialogContent>
                    <NameFormContent onSubmit={handleNameFormSubmit}/>
                </DialogContent>
            </Dialog>
        </>
    )
}


