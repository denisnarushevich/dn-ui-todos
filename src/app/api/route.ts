import {Redis} from '@upstash/redis';
import {NextRequest, NextResponse} from 'next/server';
import {ApiData, getContributors, TodoListRecord} from "@/lib/api/api";
import {v4 as uuidv4} from "uuid";

const redis = Redis.fromEnv();

export async function POST(request: NextRequest) {
    const data = await redis.get("data") as ApiData;
    const {name, createdBy} = await request.json() as {
        name: string;
        createdBy: string;
    };

    const newList: TodoListRecord = {
        id: uuidv4(),
        name,
        todos: [],
        isFrozen: false,
        createdBy,
    };
    data.todoLists.push(newList);

    await redis.set("data", data);

    return new NextResponse(JSON.stringify({
        ...newList,
        contributors: getContributors(data, newList)
    }));
}