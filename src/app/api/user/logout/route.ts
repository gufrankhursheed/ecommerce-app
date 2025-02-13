import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/connection/mongoDB";

export async function POST(request: NextRequest) {
    try {
        await connect();
        const { refreshToken } = await request.json();

        if (!refreshToken) {
            return NextResponse.json({ message: "Refresh token is required" }, { status: 400 });
        }

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = "";
            await user.save();
        }

        const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

        response.cookies.set("accessToken", "", {
            httpOnly: true,
            secure: true,
        });

        return response;

    } catch (error) {
        console.error("Logout failed", error);
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}
