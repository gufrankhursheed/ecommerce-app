import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/connection/mongoDB";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user || !user.refreshToken) {
            return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
        }

        const refreshToken = user.refreshToken;

        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        } catch (error) {
            return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 403 });
        }

        const newAccessToken = jwt.sign(
            { username: user.username, email: user.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { username: user.username },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        const response = NextResponse.json({ message: "Token refreshed successfully" }, { status: 200 });
        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true
        });

        return response;
    } catch (error) {
        console.error("Token refresh failed", error);
        return NextResponse.json({ message: "Token refresh failed" }, { status: 500 });
    }
}
