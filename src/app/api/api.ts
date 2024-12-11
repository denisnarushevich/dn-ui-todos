import {fetchTodoList, getUserTodoLists} from "@/app/api/mockDb";

export function getTodoListsByUser(userId: string) {
    return getUserTodoLists(userId);
}

export function getTodoList(id: string) {
    return fetchTodoList(id);
}