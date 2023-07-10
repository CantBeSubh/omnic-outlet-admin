"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import AlertModal from "@/components/modals/alert-modal";
import { useParams, useRouter } from "next/navigation";

interface ColorFormProps {
    initialData: Color | null;
}

const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    value: z.string().min(4).regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid Hex Value")
});

type ColorFormValues = z.infer<typeof formSchema>;


const ColorForm = ({ initialData }: ColorFormProps) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Color" : "Create Color"
    const description = initialData ? "Edit the Color" : "Add a new Color"
    const toastMsg = initialData ? "Color updated" : "Created new color"
    const action = initialData ? "Save Changes" : "Create"

    const params = useParams()
    const router = useRouter()

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: "",
        },
    });

    const onSubmit = async (values: ColorFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await fetch(`/api/${params.storeId}/colors/${params.colorId}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            } else {
                await fetch(`/api/${params.storeId}/colors`, {
                    method: "POST",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }
            router.push(`/${params.storeId}/colors`)
            router.refresh()
            toast.success(toastMsg)
        }
        catch (err) {
            toast.error("Something went wrong!")
        }
        finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await fetch(`/api/${params.storeId}/colors/${params.colorId}`, {
                method: "DELETE",
            })
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success("Redirecting...")
        }
        catch (err) {
            toast.error("Make sure you remove all products using this Color!")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        variant="destructive"
                        disabled={loading}
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Color Name"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">

                                            <Input disabled={loading} placeholder="Color Value"  {...field} />
                                            <div
                                                className="rounded-full border p-4"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit" >{action}</Button>
                </form>
            </Form>

        </>
    );
}

export default ColorForm;