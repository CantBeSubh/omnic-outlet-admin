"use client"
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";

interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    const onDelete = async () => {
        const res = await fetch(`/api/store/${params.storeId}/order`, {
            method: "DELETE"
        });

        if (res.ok) {
            toast.success("Deleted all orders");
            router.refresh();
        }
        else {
            toast.error("Something went wrong");
        }

    }


    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Order (${data.length})`} description="Manage orders for your store" />
                <Button
                    variant="destructive"
                    className="flex justify-center items-center space-x-2"
                    onClick={onDelete}
                >
                    <span>DELETE ALL</span>
                    <Trash size={16} />
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label" />
        </>
    );
}

export default OrderClient;