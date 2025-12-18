import { useEffect, useState } from "react";
import { useToken } from "../context/useToken";

export const useUser = () => {
    const [token] = useToken();

    const getPayloadFromToken = (token) => {
        const encodedPayload = token.split(".")[1];
        return JSON.parse(atob(encodedPayload))
    }

    const [user, setUser] = useState(() => {
        if (!token) return null
        return getPayloadFromToken(token)
    })


    useEffect(() => {
        if (!token) {
            setUser(null)
        } else {
            setUser(getPayloadFromToken(token))
        }

    }, [token]);
    return user
}