"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
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
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-uplaod";

interface BillboardFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(3, "Name must be at least 3 characters long").nonempty("Store name is required"),
    imageUrl: z.string().min(3, "Name must be at least 3 characters long").nonempty("Store name is required"),
});

type BillboardFormValues = z.infer<typeof formSchema>;


const BillboardForm = ({ initialData }: BillboardFormProps) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Billboard" : "Create Billboard"
    const description = initialData ? "Edit the billboard" : "Add a new Billboard"
    const toastMsg = initialData ? "Billboard updated" : "Created new billboard"
    const action = initialData ? "Save Changes" : "Create"

    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        },
    });

    const onSubmit = async (values: BillboardFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            } else {
                await fetch(`/api/${params.storeId}/billboards`, {
                    method: "POST",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }
            router.push(`/${params.storeId}/billboards`)
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
            await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`, {
                method: "DELETE",
            })
            router.refresh()
            router.push("/")
            toast.success("Redirecting...")
        }
        catch (err) {
            toast.error("Make sure you remove all categories using this billboard!")
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
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard Label"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit" >{action}</Button>
                </form>
            </Form>
            <Separator />

        </>
    );
}

export default BillboardForm;