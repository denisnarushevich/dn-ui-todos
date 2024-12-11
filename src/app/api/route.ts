import {Redis} from '@upstash/redis';
import {NextResponse} from 'next/server';

const redis = Redis.fromEnv();

export async function GET() {
    const result = await redis.get("data");
    return new NextResponse(JSON.stringify({data: result}));
}

export async function POST(request: Request) {
    const data = await request.json();
    await redis.set("data", data);
    return new NextResponse(JSON.stringify(data));
}