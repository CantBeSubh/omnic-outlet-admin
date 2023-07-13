import prismadb from "@/lib/prismadb";
import ProductClient from "./components/client";
import { ProductColumn } from "./components/columns";
import moment from "moment";
import { formatter } from "@/lib/utils";

interface ProductsPageProps {
    params: { storeId: string }
}

const ProductsPage: React.FC<ProductsPageProps> = async ({ params }) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const fProduct: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: {value:item.color.value,name:item.color.name},
        createdAt: moment(item.createdAt).format("MMMM Do,YYYY")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={fProduct} />
            </div>
        </div>
    );
}

export default ProductsPage;