import {useTodoListsByUser} from "@/lib/react/api/useTodoListsByUser";
import {TodoList} from "@/lib/api/api";
import {DropdownMenuItem, DropdownMenuSeparator} from "@/lib/react/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import {Spinner} from "@/lib/react/components/Spinner";

export function TodoLists({userId}: { userId: string }) {
    const {data, isLoading} = useTodoListsByUser(userId);
    const todoLists = data as TodoList[] | undefined;
    const {push: navigate} = useRouter();

    return <>
        {todoLists && todoLists.length > 0 ? <>
            {todoLists.map((todoList) => {
                return <DropdownMenuItem key={todoList.id} onClick={() => {
                    navigate(`/${todoList.id}`)
                }}>
                    <div className="flex items-center gap-2">
                        {todoList.name}
                    </div>
                </DropdownMenuItem>
            })}
            <DropdownMenuSeparator/>
        </> : isLoading && <><div className="flex items-center justify-center"><Spinner className="w-5 h-5"/></div><DropdownMenuSeparator/></>
        }
    </>
}