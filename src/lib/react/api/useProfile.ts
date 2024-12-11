import useSWR from "swr";
import {getProfile, profileUri} from "@/lib/react/api/api";


export function useProfile(id: string) {
    return useSWR(profileUri(id), (async () => {
            const list = await getProfile(id);
            if (list) {
                return list;
            } else {
                throw "user not found";
            }
        })
    )
}