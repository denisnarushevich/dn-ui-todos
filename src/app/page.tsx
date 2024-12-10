'use client'

import {ListChecksIcon} from "lucide-react";
import {useCurrentUser} from "@/app/CurrentUserProvider";
import {useCallback, useEffect} from "react";
import {createTodoList, getUserTodoLists} from "@/app/mockDb";
import {useRouter} from "next/navigation";
import {NameForm} from "@/app/NameForm";
import {Spinner} from "@/app/Spinner";
import {Button} from "@/components/ui/button";
import {mutate} from "swr";

export default function Home() {
    const [user, loginByName] = useCurrentUser();
    const router = useRouter()

    const init = useCallback(async (userId: string) => {
        const lists = await getUserTodoLists(userId);
        let list = lists[0]
        if (!list) {
            list = await createTodoList("Todos", userId);
            mutate(`todos/${list.id}`, list);
        }
        router.push(`/${list.id}`);
    }, [router]);


    useEffect(() => {
        if (user) {
            init(user.id);
        }
    }, [init, user]);

    return (
        <div className="min-h-full flex flex-col">
            <div className="h-16 shadow-md flex px-4 items-center">
                <div className="flex-grow">
                    <Button size="icon" className="pointer-events-none">
                        <ListChecksIcon
                            className="w-6 h-6 flex-shrink-0"/>
                    </Button>
                </div>
            </div>
            <div className="flex-grow h-0 overflow-auto">
                <div className="min-h-full flex items-center justify-center">
                    {user ? <Spinner className="w-10 h-10"/> : <NameForm onSubmit={async ({name}) => {
                        await loginByName(name)
                    }}/>}
                </div>
            </div>
        </div>
    );
}
