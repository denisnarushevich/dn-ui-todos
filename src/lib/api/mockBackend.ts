import {v4 as uuidv4} from 'uuid';
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

interface ApiData {
    users: User[];
    todoLists: TodoListRecord[];
}

function getContributors(data: ApiData, todoList: TodoListRecord) {
    function collectUserIds(todo: Todo): string[] {
        return [...todo.contributors, ...todo.todos.reduce((contributors, todo) => [...contributors, ...collectUserIds(todo)], [] as string[])];
    }

    const uniqIds = [...new Set([todoList.createdBy, ...todoList.todos.map(collectUserIds)])];

    return uniqIds.map((userId) => data.users.find(user => user.id === userId) || null).filter(Boolean).reduce((contributors, contributor) => {
        return {
            ...contributors,
            [contributor!.id]: contributor!
        }
    }, {})
}


// Mock async functions
export async function fetchTodoList(id: string): Promise<TodoList> {
    const {data: response} = await axios.get("/api");
    const data = response.data as ApiData;

    const todoList = data.todoLists.find(list => list.id === id);

    if (!todoList) throw new Error('TodoList not found');

    return {...todoList, contributors: getContributors(data, todoList)};
}

export async function createTodoList(name: string, createdBy: string): Promise<TodoList> {
    const {data: response} = await axios.get("/api");

    const data = response.data as ApiData;

    const newList: TodoListRecord = {
        id: uuidv4(),
        name,
        todos: [],
        isFrozen: false,
        createdBy,
    };
    data.todoLists.push(newList);

    await axios.post("/api", data);

    return {
        ...newList,
        contributors: getContributors(data, newList)
    };
}

export async function updateTodoList(list: TodoList): Promise<TodoList> {
    const {data: response} = await axios.get("/api");
    const data = response.data as ApiData;

    const index = data.todoLists.findIndex(l => l.id === list.id);
    if (index !== -1) {
        data.todoLists[index] = list;

        await axios.post("/api", data);

        return {
            ...list,
            contributors: getContributors(data, list)
        };
    }
    throw new Error('TodoList not found');
}

export async function getOrCreateUser(name: string): Promise<User> {
    const {data: response} = await axios.get("/api");
    const data = response.data as ApiData;
    let user = data.users.find(u => u.name === name);
    if (!user) {
        user = {id: uuidv4(), name};
        data.users.push(user);
    }

    await axios.post("/api", data);

    return user;
}

export async function getUser(id: string): Promise<User> {
    const {data: response} = await axios.get("/api");
    const data = response.data as ApiData;
    const user = data.users.find(u => u.id === id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export async function getUserTodoLists(userId: string): Promise<TodoList[]> {
    const {data: response} = await axios.get("/api");
    const data = response.data as ApiData;

    function isContributor(task: Todo) {
        return task.contributors.indexOf(userId) !== -1 || task.todos.some(isContributor);
    }

    return data.todoLists.filter(list => list.createdBy === userId || list.todos.some(isContributor)).map((todoList) => {
        return {
            ...todoList,
            contributors: getContributors(data, todoList)
        };
    });
}

