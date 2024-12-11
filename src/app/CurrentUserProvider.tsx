'use client'

import React, {createContext, ReactNode, useCallback, useContext, useState} from 'react';
import {getOrCreateUser, User} from "@/app/api/mockBackend";


type UseCurrentUserReturn = [
    userData: User | undefined,
    loginByName: (name: string) => Promise<User>,
    logout: () => void,
];

const CurrentUserContext = createContext<UseCurrentUserReturn | undefined>(undefined);


export function CurrentUserProvider({children}: { children: ReactNode }) {
    const [userData, setUserData] = useState<User>();

    const loginByName = useCallback(async (name: string): Promise<User> => {
        const user = await getOrCreateUser(name);
        setUserData(user);
        return user;
    }, []);

    const logout = useCallback(() => {
        setUserData(undefined);
    }, []);


    return (
        <CurrentUserContext.Provider value={[userData, loginByName, logout]}>
            {children}
        </CurrentUserContext.Provider>
    );
}

// Custom hook
export const useCurrentUser = (): UseCurrentUserReturn => {
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error('useCurrentUser must be used within a CurrentUserProvider');
    }
    return context;
};