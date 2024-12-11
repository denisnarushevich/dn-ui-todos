import useSWR from "swr";
import {getTodoList, todoListUri} from "@/app/api/api";

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