import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name } = body;
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })

        return new NextResponse(JSON.stringify(store), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[STORE][PUT][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        })
        return new NextResponse(JSON.stringify(store), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[STORE][DELETE][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}