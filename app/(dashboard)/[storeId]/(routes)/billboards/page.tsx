import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";
import { BillboardColumn } from "./components/columns";
import moment from "moment";

interface BillBoardsPageProps {
    params: { storeId: string }
}

const BillBoardsPage: React.FC<BillBoardsPageProps> = async ({ params }) => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const fBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: moment(item.createdAt).format("MMMM Do,YYYY")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={fBillboards} />
            </div>
        </div>
    );
}

export default BillBoardsPage;