import { google } from "googleapis";
import { oauthClient } from "../util/googleOauthUtil";
import User from "../models/User";

export const handleGoogleCallback = async (code: string) => {
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);

    const oauth2 = google.oauth2("v2");
    const { data } = await oauth2.userinfo.get({
        auth: oauthClient,
    });

    if (!data.email) {
        throw new Error("No email from Google.");
    }

    let user = await User.findOne({ email: data.email });

    if (!user) {
        user = new User({
            email: data.email,
            passwordHash: undefined,
            googleId: data.id,
            emailVerified: true,
        });
        await user.save();
    }
    return user
}