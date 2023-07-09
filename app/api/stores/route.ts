import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { name } = body;
        if (!name) return new NextResponse("Name is required", { status: 400 });

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        return new NextResponse(JSON.stringify(store), {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[STORES][POST][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}