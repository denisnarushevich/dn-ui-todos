import {useTodoListsByUser} from "@/app/api/useTodoListsByUser";
import {TodoList} from "@/app/api/mockBackend";
import {DropdownMenuItem, DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";

export function TodoLists({userId}: { userId: string }) {
    const {data} = useTodoListsByUser(userId);
    const todoLists = data as TodoList[] | undefined;
    const {push: navigate} = useRouter();

    return <>
        {todoLists && todoLists.length > 0 && <>
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
        </>
        }
    </>
}