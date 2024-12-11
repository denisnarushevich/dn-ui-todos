import {fetchTodoList, getUser, getUserTodoLists} from "@/app/api/mockBackend";
import {mutate} from "swr";

export function todoListUri(id: string) {
    return `todos/${id}`
}

export function todoListsByUserUri(userId: string) {
    return `${userId}/todos`
}

export function profileUri(id: string) {
    return `profile/${id}`
}

export async function getTodoListsByUser(userId: string) {
    const todoLists = await getUserTodoLists(userId);
    todoLists.forEach((todoList) => Object.values(todoList.contributors).forEach((user) => {
        mutate(profileUri(user.id), user, {
            revalidate: false
        })
    }));
    return todoLists;
}

export async function getTodoList(id: string) {
    const todoList = await fetchTodoList(id);
    Object.values(todoList.contributors).forEach((user) => {
        mutate(profileUri(user.id), user, {
            revalidate: false
        })
    });
    return todoList;
}

export function getProfile(userId: string) {
    return getUser(userId);
}

