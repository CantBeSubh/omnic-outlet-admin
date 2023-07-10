import prismadb from "@/lib/prismadb";
import CategoryClient from "./components/client";
import { CategoryColumn } from "./components/columns";
import moment from "moment";

interface CategoriesPageProps {
    params: { storeId: string }
}

const CategoriesPage: React.FC<CategoriesPageProps> = async ({ params }) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const fCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: moment(item.createdAt).format("MMMM Do,YYYY")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={fCategories} />
            </div>
        </div>
    );
}

export default CategoriesPage;