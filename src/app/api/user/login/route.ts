import connect from "@/connection/mongoDB";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const accessToken = jwt.sign(
            {
                username: user.username,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { 
                expiresIn: "15m"
            }
        );

        const refreshToken = jwt.sign(
            { username: user.username,
                
            },
            process.env.REFRESH_TOKEN_SECRET!,
            { 
                expiresIn: "7d"
            }
        );

        user.refreshToken = refreshToken;
        await user.save();

        const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: true
        });

        return response;

    } catch (error) {
        console.error("Login failed", error);
        return NextResponse.json({ message: "Login failed" }, { status: 500 });
    }
}