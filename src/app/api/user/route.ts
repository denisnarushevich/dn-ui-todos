import {Redis} from '@upstash/redis';
import {NextResponse} from 'next/server';
import {v4 as uuidv4} from "uuid";
import {ApiData} from "@/lib/api/api";

const redis = Redis.fromEnv();

export async function POST(request: Request) {
    const data = await redis.get("data") as ApiData;

    const {name} = await request.json() as { name: string };

    let user = data.users.find(u => u.name === name);
    if (!user) {
        user = {id: uuidv4(), name};
        data.users.push(user);
    }

    await redis.set("data", data)

    return new NextResponse(JSON.stringify(user));
}