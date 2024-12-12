"use client";

import { useCallback, useState } from "react";
import { TodoItem } from "@/lib/react/components/TodoItem";
import { AddTodoForm } from "@/lib/react/components/AddTodoForm";
import { Button } from "@/lib/react/components/ui/button";
import { Title } from "@/lib/react/components/Title";
import { ListChecksIcon, LockIcon, LogOutIcon, PlusIcon, UnlockIcon, UserIcon } from "lucide-react";
import { useCurrentUser } from "@/lib/react/components/CurrentUserProvider";
import { NameFormContent } from "@/lib/react/components/NameForm";

import { Dialog, DialogContent } from "@/lib/react/components/ui/dialog";
import { createTodoList, Todo, TodoList } from "@/lib/api/api";
import { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";

import { Spinner } from "@/lib/react/components/Spinner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/lib/react/components/ui/dropdown-menu";
import { useAsyncFn } from "react-use";
import { useApi } from "@/lib/react/api/useApi";
import { useTodoList } from "@/lib/react/api/useTodoList";
import { TodoLists } from "@/lib/react/components/TodoLists";
import { Contributor } from "@/lib/react/components/Contributor";

export default function TodoApp() {
    const { push: navigate } = useRouter();
    const { updateTodoList, updateTodo, createTodo, deleteTodo } = useApi();
    const { listId } = useParams<{ listId: string }>();

    const { data, error, mutate: mutateList } = useTodoList(listId);
    const todoList = data as TodoList | undefined;

    const [user, loginByName, logout] = useCurrentUser();

    const [showNameForm, setShowNameForm] = useState(false);

    const handleEditClick = useCallback(() => {
        setShowNameForm(true);
    }, []);

    const handleNameFormSubmit = useCallback(
        async ({ name }: { name: string }) => {
            await loginByName(name);
            setShowNameForm(false);
        },
        [loginByName],
    );

    const [{ loading: saving }, update] = useAsyncFn(updateTodoList, [updateTodoList]);

    if (!todoList) {
        if (error) {
            return error;
        } else {
            return (
                <div className="min-h-full flex items-center justify-center">
                    <Spinner className="w-10 h-10" />
                </div>
            );
        }
    }

    const handleToggleTodo = (todo: Todo) => {
        updateTodo(todoList, {
            ...todo,
            completed: !todo.completed,
        });
    };

    const handleDeleteTodo = (todo: Todo) => {
        deleteTodo(todoList, todo.id);
    };

    const handleToggleFreeze = () => {
        update({
            ...todoList,
            isFrozen: !todoList.isFrozen,
        });
    };

    const handleAddTodo = (text: string, parentId: string | null = null) =>
        todoList && createTodo(todoList, text, parentId);

    const updateListName = (newName: string) => {
        update({
            ...todoList,
            name: newName,
        });
        mutateList();
    };

    const createNew = async () => {
        if (user) {
            const newList = await createTodoList("New Todos", user.id);
            await mutate(`todos/${newList.id}`, newList);
            navigate(`/${newList.id}`);
        } else {
            setShowNameForm(true);
        }
    };

    return (
        <>
            <div className="min-h-full flex flex-col">
                <div className="h-16 shadow-md flex px-4 items-center gap-4">
                    <div className="flex-grow flex gap-2 items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button size="icon" variant="outline">
                                    {saving ? (
                                        <Spinner className="w-6 h-6 flex-shrink-0" />
                                    ) : (
                                        <ListChecksIcon className="w-6 h-6 flex-shrink-0" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {user ? (
                                    <>
                                        <DropdownMenuLabel>
                                            <div className="flex items-center gap-2">
                                                <Contributor userId={user.id} small />
                                                {user?.name}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem onClick={logout}>
                                            <div className="flex items-center gap-2">
                                                <LogOutIcon className="w-5 h-5" />
                                                Logout
                                            </div>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem onClick={() => setShowNameForm(true)}>
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="w-5 h-5" />
                                            Login
                                        </div>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                {user !== undefined && (
                                    <>
                                        <TodoLists userId={user?.id} />
                                    </>
                                )}

                                <DropdownMenuItem onClick={createNew}>
                                    <div className="flex items-center gap-2">
                                        <PlusIcon className="w-5 h-5" />
                                        New List
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {user && todoList.createdBy === user.id ? (
                            <Title
                                value={todoList.name}
                                onChange={updateListName}
                                className="text-lg font-bold bg-transparent border-none"
                                disabled={todoList.isFrozen}
                            />
                        ) : (
                            <div className="px-2.5 text-lg font-bold bg-transparent border-none">{todoList.name}</div>
                        )}
                    </div>
                    {user && todoList.createdBy === user.id && (
                        <Button onClick={handleToggleFreeze} variant="outline">
                            {todoList.isFrozen ? <UnlockIcon className="mr-2" /> : <LockIcon className="mr-2" />}
                            {todoList.isFrozen ? "Unreeze" : "Freeze"}
                        </Button>
                    )}
                    {!user && (
                        <Button onClick={handleEditClick} variant="outline">
                            Edit
                        </Button>
                    )}
                </div>

                <div className="container mx-auto px-4">
                    <div className="mt-10 p-6 bg-white rounded-lg shadow-xl">
                        <div className="flex justify-between items-center mb-4"></div>
                        <AddTodoForm onAdd={(text) => handleAddTodo(text)} disabled={todoList.isFrozen || !user} />

                        <ul className="mt-4 space-y-4">
                            {todoList?.todos.map((todo, index) => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                    onAddTask={handleAddTodo}
                                    level={0}
                                    index={index}
                                    isFrozen={todoList?.isFrozen ?? true}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Dialog open={showNameForm} onOpenChange={setShowNameForm}>
                <DialogContent>
                    <NameFormContent onSubmit={handleNameFormSubmit} />
                </DialogContent>
            </Dialog>
        </>
    );
}
