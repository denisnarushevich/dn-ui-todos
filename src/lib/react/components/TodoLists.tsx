import {useTodoListsByUser} from "@/app/api/useTodoListsByUser";
import {TodoList} from "@/app/api/mockBackend";
import {PlusIcon} from "lucide-react";
import {DropdownMenuItem, DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";

export function TodoLists({userId}: { userId }) {
    const {data} = useTodoListsByUser(userId);
    const todoLists = data as TodoList[] | undefined;
    const {push: navigate} = useRouter();

    return <>
        {todoLists && todoLists.length > 0 && <>
            {todoLists.map((todoList) => {
                return <DropdownMenuItem onClick={() => {
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