import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {
        if (!params.sizeId) return new NextResponse("sizeId is required", { status: 400 });

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        })

        return new NextResponse(JSON.stringify(size), {
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

export async function PUT(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!name) return new NextResponse("name is required", { status: 400 });
        if (!value) return new NextResponse("BillboardID is required", { status: 400 });
        if (!params.sizeId) return new NextResponse("size ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            }
        })


        return new NextResponse(JSON.stringify(size), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[SIZE][PUT][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!params.sizeId) return new NextResponse("Billlboard ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        })

        return new NextResponse(JSON.stringify(size), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[SIZE][DELETE][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}