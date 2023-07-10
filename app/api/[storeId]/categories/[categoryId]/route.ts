import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        if (!params.categoryId) return new NextResponse("CategoryID is required", { status: 400 });

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            }
        })

        return new NextResponse(JSON.stringify(category), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[CATEGORY][GET][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body;
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!name) return new NextResponse("name is required", { status: 400 });
        if (!billboardId) return new NextResponse("BillboardID is required", { status: 400 });
        if (!params.categoryId) return new NextResponse("category ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
            }
        })


        return new NextResponse(JSON.stringify(category), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[CATEGORY][PUT][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!params.categoryId) return new NextResponse("Billlboard ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        })

        return new NextResponse(JSON.stringify(category), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[CATEGORY][DELETE][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}