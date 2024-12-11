import {Redis} from '@upstash/redis';
import {NextResponse} from 'next/server';


const redis = Redis.fromEnv();

const initData = {
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
                            contributors: ['1', '2']
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

export const GET = async () => {
    await redis.set('data', initData);

    return new NextResponse(JSON.stringify({ok: true}));
};