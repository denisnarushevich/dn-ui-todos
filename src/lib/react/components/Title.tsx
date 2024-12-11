import {useState} from "react";
import {Input} from "@/lib/react/components/ui/input";
import * as React from "react";

export function Title({value, onChange, ...props}: {
    value: string,
    onChange(value: string): void
} & Omit<React.ComponentProps<"input">, 'value' | 'onChange' | 'onBlur'>) {
    const [title, setTitle] = useState(value);

    return <Input
        {...props}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => onChange(title)}
    />
}