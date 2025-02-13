import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/connection/mongoDB";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        response.cookies.set("accessToken", "", { httpOnly: true, secure: true, expires: new Date(0) });

        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        user.refreshToken = "";
        await user.save();

        return response;
    } catch (error) {
        console.error("Logout failed", error);
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}
