import connect from "@/connection/mongoDB";
import { User } from "@/models/User";
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { username, email, password } = await request.json();

        if (!username || !email || !password || username.trim() === "" || email.trim() === "" || password.trim() === "") {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userExists = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (userExists) {
            return NextResponse.json({ message: "User with this username or email already exists" }, { status: 400 });
        }

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return NextResponse.json({ message: "User registered" }, { status: 201 })
    } catch (error) {
        console.error("User registeration failed", error);
        return NextResponse.json({ message: "User registeration failed" }, { status: 500 });
    }
}