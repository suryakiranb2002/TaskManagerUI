import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTHENTICATED = "auth"

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState('false');

    const setToStorage = (value) => {
        localStorage.setItem(AUTHENTICATED, value);
    }

    useEffect(() => {
        const authValue = localStorage.getItem(AUTHENTICATED)

        if (authValue == null) {
            console.log("auth is null. setting auth to false")
            localStorage.setItem(AUTHENTICATED, 'false')
        }
        else {

            setAuthenticated(authValue);

        }
    }, [])

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated, setToStorage }}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;
