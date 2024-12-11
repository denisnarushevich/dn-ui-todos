import useSWR from "swr";
import {getTodoListsByUser} from "@/app/api/api";

export function todoListsByUserUri(userId: string) {
    return `${userId}/todos`
}

export function useTodoListsByUser(userId: string) {
    return useSWR(todoListsByUserUri(userId), (async () => {
            return await getTodoListsByUser(userId);
        })
    )
}