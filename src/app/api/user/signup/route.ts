import connect from "@/connection/mongoDB";
import { User } from "@/models/User";
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if ([name, email, password].some(
            (field) => (field?.trim() === "")
        )) {
            throw new Error("All fields are required")
        }

        const hashedPassword= await bcrypt.hash(password,10)

        await connect();

        const userExists = await User.findOne({
            $or: [{ name }, { email }]
        })

        if (userExists) {
            throw new Error("user with username or email already exists")
        }

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        return NextResponse.json({ message: "User registered" }, { status: 201 })
    } catch (error) {
        console.error("User registeration faield", error);
        return NextResponse.json({ message: "User registeration failed" }, { status: 500 });
    }
}