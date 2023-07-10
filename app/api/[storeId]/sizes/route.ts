import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) return new NextResponse("StoreId is required", { status: 400 });

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(sizes), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[SIZE][GET][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });

        const { name, value } = body;
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!value) return new NextResponse("BillboardID is required", { status: 400 });
        if (!params.storeId) return new NextResponse("StoreId is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return new NextResponse(JSON.stringify(size), {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[SIZE][POST][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}