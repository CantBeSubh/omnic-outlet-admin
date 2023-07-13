import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) return new NextResponse("Billlboard ID is required", { status: 400 });

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            }
        })

        return new NextResponse(JSON.stringify(product), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[PRODUCT][GET][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!price) return new NextResponse("Price is required", { status: 400 });
        if (!images || !images.length) return new NextResponse("Images are required", { status: 400 });
        if (!categoryId) return new NextResponse("CategoryID is required", { status: 400 });
        if (!colorId) return new NextResponse("ColorID is required", { status: 400 });
        if (!sizeId) return new NextResponse("SizeID is required", { status: 400 });
        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived,

            }
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((img: { url: string }) => img)
                        ]
                    }
                }
            }
        })

        return new NextResponse(JSON.stringify(product), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[PRODUCT][PUT][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unathenticated", { status: 401 });
        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })

        return new NextResponse(JSON.stringify(product), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (err) {
        console.error('[PRODUCT][DELETE][ERROR]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}