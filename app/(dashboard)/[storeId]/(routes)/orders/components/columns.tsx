"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
    id: string
    phone: string
    address: string
    totalPrice: string
    products: string
    isPaid: boolean
    createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "products",
        header: "Procucts",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
    },
    {
        accessorKey: "isPaid",
        header: "Paid",
        cell: ({ row }) => row.original.isPaid ? "Yes" : "No"
    }
]
