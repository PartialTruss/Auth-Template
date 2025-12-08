import { useContext } from "react"
import { TokenContext } from "../context/TokenContext"

export const useToken = () => {
    useContext(TokenContext)
}