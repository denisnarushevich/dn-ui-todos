import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { ApiData } from "@/lib/api/api";

const redis = Redis.fromEnv();

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId;
    const data = (await redis.get("data")) as ApiData;
    const user = data.users.find((u) => u.id === userId);
    if (!user) {
        throw new Error("User not found");
    }
    return new NextResponse(JSON.stringify(user));
}
