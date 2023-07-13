import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });

        if (!params.storeId) return new NextResponse("StoreId is required", { status: 400 });

        console.log('[COLOR][POST][PARAMS]', params);

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const order = await prismadb.order.deleteMany({
            where: {
                storeId: params.storeId,
            }
        });

        return new NextResponse(JSON.stringify(order), { status: 200 });
    }
    catch (err) {
        console.error('[COLOR][POST][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}