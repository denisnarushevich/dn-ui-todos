import {v4 as uuidv4} from 'uuid';

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

export interface TodoList {
    id: string;
    name: string;
    todos: Todo[];
    isFrozen: boolean;
    createdBy: string;
}

interface DB {
    users: User[];
    todoLists: TodoList[];
}

const mockDb: DB = {
    users: [
        {id: '1', name: 'Alice'},
        {id: '2', name: 'Bob'},
        {id: '3', name: 'Charlie'},
    ],
    todoLists: [
        {
            id: '1',
            name: 'Work Tasks',
            todos: [
                {
                    id: '1',
                    text: 'Complete project proposal',
                    completed: false,
                    todos: [],
                    createdBy: '1',
                    updatedBy: '1',
                    contributors: ['1']
                },
                {
                    id: '2',
                    text: 'Review team performance',
                    completed: false,
                    todos: [
                        {
                            id: '3',
                            text: 'Gather feedback',
                            completed: true,
                            todos: [],
                            createdBy: '1',
                            updatedBy: '2',
                            contributors: ['1', '2']
                        },
                    ],
                    createdBy: '1',
                    updatedBy: '1',
                    contributors: ['1']
                },
            ],
            isFrozen: false,
            createdBy: '1',
        },
    ],
};

// Simulated delay for async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock async functions
export async function fetchTodoList(id: string): Promise<TodoList | null> {
    await delay(500);
    return mockDb.todoLists.find(list => list.id === id) || null;
}

export async function fetchUser(id: string): Promise<User | null> {
    await delay(200);
    return mockDb.users.find(user => user.id === id) || null;
}

export async function createTodoList(name: string, createdBy: string): Promise<TodoList> {
    await delay(500);
    const newList: TodoList = {
        id: uuidv4(),
        name,
        todos: [],
        isFrozen: false,
        createdBy,
    };
    mockDb.todoLists.push(newList);
    return newList;
}

export async function updateTodoList(list: TodoList): Promise<TodoList> {
    await delay(500);
    const index = mockDb.todoLists.findIndex(l => l.id === list.id);
    if (index !== -1) {
        mockDb.todoLists[index] = list;
        return list;
    }
    throw new Error('TodoList not found');
}

export async function findOrCreateUser(name: string): Promise<User> {
    await delay(500);
    let user = mockDb.users.find(u => u.name === name);
    if (!user) {
        user = {id: uuidv4(), name};
        mockDb.users.push(user);
    }
    return user;
}

export async function getUser(id: string): Promise<User> {
    await delay(500);
    const user = mockDb.users.find(u => u.id === id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export async function getUserTodoLists(userId: string): Promise<TodoList[]> {
    await delay(500);

    function isContributor(task: Todo) {
        return task.contributors.indexOf(userId) !== -1 || task.todos.some(isContributor);
    }

    return mockDb.todoLists.filter(list => list.createdBy === userId || list.todos.some(isContributor));
}

