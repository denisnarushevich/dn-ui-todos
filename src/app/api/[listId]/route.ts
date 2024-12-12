import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { ApiData, getContributors, TodoList } from "@/lib/api/api";

const redis = Redis.fromEnv();

export async function GET(request: NextRequest, { params }: { params: Promise<{ listId: string }> }) {
    const listId = (await params).listId;
    const data = (await redis.get("data")) as ApiData;

    const todoList = data.todoLists.find((list) => list.id === listId);

    if (!todoList) throw new Error("TodoList not found");

    const response = { ...todoList, contributors: getContributors(data, todoList) };

    return new NextResponse(JSON.stringify(response));
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ listId: string }> }) {
    const data = (await redis.get("data")) as ApiData;
    const listId = (await params).listId;
    const list = (await request.json()) as TodoList;

    const index = data.todoLists.findIndex((l) => l.id === listId);
    if (index !== -1) {
        data.todoLists[index] = list;

        await redis.set("data", data);

        return new NextResponse(
            JSON.stringify({
                ...list,
                contributors: getContributors(data, list),
            }),
        );
    }
    throw new Error("TodoList not found");
}
