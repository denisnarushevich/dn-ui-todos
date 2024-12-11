import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/Spinner";
import {useState} from "react";
import {useAsyncFn} from "react-use";

export type NameFormProps = {
    onSubmit(values: { name: string }): Promise<void>
}

export function NameFormContent({onSubmit}: NameFormProps) {
    const [{loading}, handleSubmit] = useAsyncFn(onSubmit, [onSubmit]);
    const [name, setName] = useState("")

    return <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({
            name
        });
    }}>
        <div className="font-bold text-sm" style={{
            fontVariant: "small-caps"
        }}>
            Your Name
        </div>
        <div className="mt-2 flex justify-between items-center">
            <Input
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold bg-white border-none"
            />

        </div>
        <div className="mt-4 flex justify-center">
            <Button type="submit" disabled={!name || loading} variant="outline">
                <div className="flex gap-2 items-center">
                    {loading && <Spinner className="w-5 h-5"/>}
                    Continue
                </div>
            </Button>
        </div>
    </form>
}

export function NameForm(props: NameFormProps) {
    return <div className="max-w-lg mt-10 p-6 rounded-lg shadow-xl bg-gray-100">
        <NameFormContent {...props}/>
    </div>
}