import prismadb from "@/lib/prismadb";
import SizeClient from "./components/client";
import { SizeColumn } from "./components/columns";
import moment from "moment";

interface SizesPageProps {
    params: { storeId: string }
}

const SizesPage: React.FC<SizesPageProps> = async ({ params }) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const fSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: moment(item.createdAt).format("MMMM Do,YYYY")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={fSizes} />
            </div>
        </div>
    );
}

export default SizesPage;