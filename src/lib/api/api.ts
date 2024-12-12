import axios from "axios";

export interface User {
    id: string;
    name: string;
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    todos: Todo[];
    createdBy: string;
    updatedBy: string;
    contributors: string[];
}

export interface TodoListRecord {
    id: string;
    name: string;
    todos: Todo[];
    isFrozen: boolean;
    createdBy: string;
}

export interface TodoList {
    id: string;
    name: string;
    todos: Todo[];
    isFrozen: boolean;
    createdBy: string;
    contributors: Record<string, User>;
}

export interface ApiData {
    users: User[];
    todoLists: TodoListRecord[];
}

export function getContributors(data: ApiData, todoList: TodoListRecord) {
    function collectUserIds(todo: Todo): string[] {
        return [
            ...todo.contributors,
            ...todo.todos.reduce((contributors, todo) => [...contributors, ...collectUserIds(todo)], [] as string[]),
        ];
    }

    const uniqIds = [...new Set([todoList.createdBy, ...todoList.todos.map(collectUserIds)])];

    return uniqIds
        .map((userId) => data.users.find((user) => user.id === userId) || null)
        .filter(Boolean)
        .reduce((contributors, contributor) => {
            return {
                ...contributors,
                [contributor!.id]: contributor!,
            };
        }, {});
}

export async function createTodoList(name: string, createdBy: string): Promise<TodoList> {
    const { data: response } = await axios.post(`/api`, {
        name,
        createdBy,
    });
    return response as TodoList;
}

export async function updateTodoList(list: TodoList): Promise<TodoList> {
    const { data: response } = await axios.put(`/api/${list.id}`, list);
    return response as TodoList;
}

export async function getOrCreateUser(name: string): Promise<User> {
    const { data: response } = await axios.post("/api/user", { name });
    return response as User;
}

export async function fetchTodoList(id: string): Promise<TodoList> {
    const { data: response } = await axios.get(`/api/${id}`);
    return response as TodoList;
}

export async function getUser(userId: string): Promise<User> {
    const { data: response } = await axios.get(`/api/user/${userId}`);
    return response as User;
}

export async function getUserTodoLists(userId: string): Promise<TodoList[]> {
    const { data: response } = await axios.get(`/api/user/${userId}/todos`);
    return response as TodoList[];
}
