import crypto from "crypto";
import jwt from "jsonwebtoken";

export const createJwt = (payload: object) =>
    jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "2d",
    });

export const createResetToken = () => {
    const raw = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");

    return {
        raw,
        hashed,
        expires: Date.now() + 1000 * 60 * 15,
    };
};
