import {useProfile} from "@/app/api/useProfile";
import {User} from "@/app/api/mockBackend";


function stringToRandomHexColor(input: string): string {
    // Helper function to create a hash from a string
    function hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // Convert the hash into a hex color
    function hashToHexColor(hash: number): string {
        const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return "#" + "000000".substring(0, 6 - color.length) + color;
    }

    // Generate the hash and convert it to a hex color
    const hash = hashString(input);
    return hashToHexColor(hash);
}

export function Contributor({userId}: { userId: string }) {
    const {data} = useProfile(userId)
    const user = data as User | undefined;
    const initials = user ? (user?.name[0] + user?.name[1]).toUpperCase() : "";

    return <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "100%",
        lineHeight: "32px",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 12,
        color: "white",
        backgroundColor: user ? stringToRandomHexColor(user.name) : "lightslategray"
    }}>{initials}</div>;
}