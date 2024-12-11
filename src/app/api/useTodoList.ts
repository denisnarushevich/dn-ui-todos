import useSWR from "swr";
import {getTodoList} from "@/app/api/api";

export function todoListUri(id: string) {
    return `todos/${id}`
}

export function useTodoList(id: string) {
    return useSWR(todoListUri(id), (async () => {
            const list = await getTodoList(id);
            if (list) {
                return list;
            } else {
                throw "list not found";
            }
        })
    )
}