import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { ApiData, getContributors, Todo } from "@/lib/api/api";

const redis = Redis.fromEnv();

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId;
    const data = (await redis.get("data")) as ApiData;
    const user = data.users.find((u) => u.id === userId);
    if (!user) {
        throw new Error("User not found");
    }

    function isContributor(task: Todo) {
        return task.contributors.indexOf(userId) !== -1 || task.todos.some(isContributor);
    }

    const result = data.todoLists
        .filter((list) => list.createdBy === userId || list.todos.some(isContributor))
        .map((todoList) => {
            return {
                ...todoList,
                contributors: getContributors(data, todoList),
            };
        });

    return new NextResponse(JSON.stringify(result));
}
