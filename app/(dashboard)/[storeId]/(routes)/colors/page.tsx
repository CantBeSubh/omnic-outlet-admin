import prismadb from "@/lib/prismadb";
import SizeClient from "./components/client";
import { ColorColumn } from "./components/columns";
import moment from "moment";

interface ColorsPageProps {
    params: { storeId: string }
}

const ColorsPage: React.FC<ColorsPageProps> = async ({ params }) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const fColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: moment(item.createdAt).format("MMMM Do,YYYY")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={fColors} />
            </div>
        </div>
    );
}

export default ColorsPage;