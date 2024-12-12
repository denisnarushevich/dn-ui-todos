import { useCurrentUser } from "@/lib/react/components/CurrentUserProvider";
import { createTodoList, Todo, TodoList, updateTodoList as apiUpdateTodoList } from "../../api/api";
import { v4 as uuidv4 } from "uuid";
import { mutate } from "swr";
import { todoListsByUserUri, todoListUri } from "@/lib/react/api/api";

export function useApi() {
    const [user] = useCurrentUser();

    function updateTodos(todos: Todo[], id: string, updateFn: (todo: Todo) => Todo): Todo[] {
        return todos.map((todo) => {
            if (todo.id === id) {
                return updateFn(todo);
            }
            if (todo.todos.length > 0) {
                return { ...todo, todos: updateTodos(todo.todos, id, updateFn) };
            }
            return todo;
        });
    }

    async function updateTodoList(todoList: TodoList) {
        if (!user) throw "User not provided";
        mutate(todoListUri(todoList.id), todoList, { revalidate: false });
        const resultingTodoList = await apiUpdateTodoList(todoList);
        mutate(todoListUri(todoList.id), resultingTodoList, { revalidate: false });
        return resultingTodoList;
    }

    return {
        async createTodoList(name: string) {
            if (!user) throw "User not provided";
            const newTodoList = await createTodoList(name, user.id);
            mutate(todoListUri(newTodoList.id), newTodoList, { revalidate: false });
            mutate(todoListsByUserUri(user.id));
            return newTodoList;
        },
        updateTodoList,
        createTodo(todoList: TodoList, text: string, parentId: string | null = null) {
            if (!user) throw "User not provided";

            const newTodo: Todo = {
                id: uuidv4(),
                text,
                completed: false,
                todos: [],
                createdBy: user.id,
                updatedBy: user.id,
                contributors: [user.id],
            };
            if (parentId === null) {
                return updateTodoList({
                    ...todoList,
                    todos: [...todoList.todos, newTodo],
                });
            } else {
                return updateTodoList({
                    ...todoList,
                    todos: updateTodos(todoList.todos, parentId, (todo) => ({
                        ...todo,
                        todos: [...todo.todos, newTodo],
                    })),
                });
            }
        },
        updateTodo(todoList: TodoList, todo: Todo) {
            if (!user) throw "User not provided";

            return updateTodoList({
                ...todoList,
                todos: updateTodos(todoList.todos, todo.id, () => ({
                    ...todo,
                    updatedBy: user.id,
                    contributors: todo.contributors.includes(user.id)
                        ? todo.contributors
                        : [...todo.contributors, user.id],
                })),
            });
        },
        deleteTodo(todoList: TodoList, id: string) {
            const deleteFromTasks = (tasks: Todo[]): Todo[] =>
                tasks.filter((task) => task.id !== id).map((task) => ({ ...task, todos: deleteFromTasks(task.todos) }));

            return updateTodoList({
                ...todoList,
                todos: deleteFromTasks(todoList.todos),
            });
        },
    };
}
