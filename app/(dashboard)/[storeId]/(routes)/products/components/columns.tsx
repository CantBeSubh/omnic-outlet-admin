"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellActions from "./cell-actions"
import { Checkbox } from "@/components/ui/checkbox"

export type ProductColumn = {
    id: string
    name: string
    isFeatured: boolean
    isArchived: boolean
    price: string
    category: string
    size: string
    color: string
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },

    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => <div className="flex items-center gap-x-2">
            {row.original.color}
            <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: row.original.color }}
            ></div>
        </div>
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => (
            <div className="flex justify-start items-center">

                <Checkbox
                    checked={row.original.isFeatured}
                    className="ml-6"
                />
            </div>
        )
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
        cell: ({ row }) => (
            <div className="flex justify-start items-center">

                <Checkbox
                    checked={row.original.isArchived}
                    className="ml-6"
                />
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CellActions data={row.original} />
    }
]
