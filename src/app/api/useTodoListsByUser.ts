import useSWR from "swr";
import {getTodoListsByUser, todoListsByUserUri} from "@/app/api/api";

export function useTodoListsByUser(userId: string) {
    return useSWR(todoListsByUserUri(userId), (async () => {
            return await getTodoListsByUser(userId);
        })
    )
}