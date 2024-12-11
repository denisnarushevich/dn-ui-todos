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

interface DB {
    users: User[];
    todoLists: TodoListRecord[];
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
        {
            id: '2',
            name: 'Groceries',
            todos: [
                {
                    id: '3',
                    text: 'Buy eggs',
                    completed: false,
                    todos: [],
                    createdBy: '1',
                    updatedBy: '1',
                    contributors: ['1']
                },
                {
                    id: '4',
                    text: 'Buy milk',
                    completed: false,
                    todos: [
                        {
                            id: '5',
                            text: 'Go to market',
                            completed: true,
                            todos: [],
                            createdBy: '1',
                            updatedBy: '2',
                            contributors: ['1','2']
                        },
                        {
                            id: '6',
                            text: 'Find local vendors',
                            completed: true,
                            todos: [],
                            createdBy: '1',
                            updatedBy: '1',
                            contributors: ['1']
                        },
                    ],
                    createdBy: '1',
                    updatedBy: '1',
                    contributors: ['1', '2']
                },
            ],
            isFrozen: false,
            createdBy: '1',
        },
    ],
};

// Simulated delay for async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getContributors(todoList: TodoListRecord) {
    function collectUserIds(todo: Todo): string[] {
        return [...todo.contributors, ...todo.todos.reduce((contributors, todo) => [...contributors, ...collectUserIds(todo)], [] as string[])];
    }

    const uniqIds = [...new Set([todoList.createdBy, ...todoList.todos.map(collectUserIds)])];

    return uniqIds.map((userId) => mockDb.users.find(user => user.id === userId) || null).filter(Boolean).reduce((contributors, contributor) => {
        return {
            ...contributors,
            [contributor!.id]: contributor!
        }
    }, {})
}


// Mock async functions
export async function fetchTodoList(id: string): Promise<TodoList> {
    await delay(500);
    const todoList = mockDb.todoLists.find(list => list.id === id);

    if (!todoList) throw new Error('TodoList not found');

    return {...todoList, contributors: getContributors(todoList)};
}

export async function createTodoList(name: string, createdBy: string): Promise<TodoList> {
    await delay(500);
    const newList: TodoListRecord = {
        id: uuidv4(),
        name,
        todos: [],
        isFrozen: false,
        createdBy,
    };
    mockDb.todoLists.push(newList);

    return {
        ...newList,
        contributors: getContributors(newList)
    };
}

export async function updateTodoList(list: TodoList): Promise<TodoList> {
    await delay(500);
    const index = mockDb.todoLists.findIndex(l => l.id === list.id);
    if (index !== -1) {
        mockDb.todoLists[index] = list;
        return {
            ...list,
            contributors: getContributors(list)
        };
    }
    throw new Error('TodoList not found');
}

export async function getOrCreateUser(name: string): Promise<User> {
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

    return mockDb.todoLists.filter(list => list.createdBy === userId || list.todos.some(isContributor)).map((todoList)=>{
        return {
            ...todoList,
            contributors: getContributors(todoList)
        };
    });
}

