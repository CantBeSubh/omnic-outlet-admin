"use client"

import * as z from "zod"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    name: z.string().nonempty("Store name is required").min(3, "Store name must be at least 3 characters"),
})

export const StoreModal = () => {
    const storeModel = useStoreModal()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
        <Modal
            title="Create store"
            description="Add new store to manage stuff"
            isOpen={storeModel.isOpen}
            onClose={storeModel.onClose}
        >
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-Commerce" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pt-6 space-x-2 items-center w-full">
                            <Button variant={'outline'} onClick={storeModel.onClose}>Cancel</Button>
                            <Button type="submit" >Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}