import prismadb from "@/lib/prismadb";
import OrderClient from "./components/client";
import { OrderColumn } from "./components/columns";
import moment from "moment";
import { formatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrdersPageProps {
    params: { storeId: string }
}

const OrdersPage: React.FC<OrdersPageProps> = async ({ params }) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            },

        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const fOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((item) => item.product.name).join(", "),
        totalPrice: formatter.format(item.orderItems.reduce((acc, item) => acc + Number(item.product.price), 0)),
        isPaid: item.isPaid,
        createdAt: moment(item.createdAt).format("DD/MM/YYYY | HH:mm:ss"),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={fOrders} />
            </div>
        </div>
    );
}

export default OrdersPage;