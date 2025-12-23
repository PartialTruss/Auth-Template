const PEPER = "superpeper";

export const generateRandomSalt = (length: number = 5) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let salt = ""

    for (let i = 0; i < length; i++) {
        salt += chars[Math.floor(Math.random() * chars.length)]
    }
    return salt
}
export const saltAndPepperPassword = (password: string) => {

    const salt = generateRandomSalt();
    return {
        salt,
        result: password + salt + PEPER
    }
}
