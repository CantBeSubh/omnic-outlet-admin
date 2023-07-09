"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import AlertModal from "@/components/modals/alert-modal";
import { useRouter } from "next/navigation";

interface SettingFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").nonempty("Store name is required"),
});

type SettingsFormValues = z.infer<typeof formSchema>;


const SettingsForm = ({ initialData }: SettingFormProps) => {

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (values: SettingsFormValues) => {
        try {
            setLoading(true)
            await fetch(`/api/stores/${initialData.id}`, {
                method: "PUT",
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            router.refresh()
            toast.success("Store updated successfully!")
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
            await fetch(`/api/stores/${initialData.id}`, {
                method: "DELETE",
            })
            router.refresh()
            router.push("/")
            toast.success("Redirecting...")
        }
        catch (err) {
            toast.error("Make sure you remove all products and categories first!")
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
                <Heading title="Settings" description="Manage your store settings" />
                <Button
                    variant="destructive"
                    disabled={loading}
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
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
                                        <Input disabled={loading} placeholder="Store Name"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit" >Save Changes</Button>
                </form>
            </Form>
        </>
    );
}

export default SettingsForm;