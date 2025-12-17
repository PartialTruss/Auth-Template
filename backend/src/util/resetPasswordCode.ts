import crypto from "crypto"

export const generatePasswordResetCode = () => {

    return crypto.randomBytes(32).toString("hex")

}