import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@/models/User";
import connect from "@/connection/mongoDB";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    try {
        await connect();

        const token = request.cookies.get("accessToken")?.value;

        console.log("Token from cookies:", token);

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

        const user = await User.findOne({ email: decoded.email }).select("-password -refreshToken");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid Token" }, { status: 403 });
    }
}
