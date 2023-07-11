"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import AlertModal from "@/components/modals/alert-modal";
import { useParams, useRouter } from "next/navigation";
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-uplaod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


interface ProductFormProps {
    initialData: Product & { Image: Image[] } | null;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").nonempty({ message: "Name is required" }),
    Image: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1, "Price must be at least 1"),
    categoryId: z.string().nonempty({ message: "Category is required" }),
    colorId: z.string().nonempty({ message: "Color is required" }),
    sizeId: z.string().nonempty({ message: "Size is required" }),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;


const ProductForm = ({ initialData, categories, sizes, colors }: ProductFormProps) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit the product" : "Add a new Product"
    const toastMsg = initialData ? "Product updated" : "Created new product"
    const action = initialData ? "Save Changes" : "Create"

    const params = useParams()
    const router = useRouter()

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        } : {
            name: "",
            Image: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
        },
    });

    const onSubmit = async (values: ProductFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await fetch(`/api/${params.storeId}/products/${params.productId}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            } else {
                await fetch(`/api/${params.storeId}/products`, {
                    method: "POST",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }
            router.push(`/${params.storeId}/products`)
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
            await fetch(`/api/${params.storeId}/products/${params.productId}`, {
                method: "DELETE",
            })
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Redirecting...")
        }
        catch (err) {
            toast.error("Something went wrong!")
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
                        name="Image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((item) => item.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value].filter((item) => item.url !== url))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product Name"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Size</SelectLabel>
                                                {sizes.map((size) => (
                                                    <SelectItem
                                                        key={size.id}
                                                        value={size.id}
                                                    >
                                                        {size.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Color</SelectLabel>
                                                {colors.map((color) => (
                                                    <SelectItem
                                                        key={color.id}
                                                        value={color.id}
                                                    >
                                                        {color.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger type="button" >
                                                    <FormLabel className="hover:cursor-pointer">Featured</FormLabel>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Featured products are displayed on the home page</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger type="button" >
                                                    <FormLabel className="hover:cursor-pointer">Archived</FormLabel>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Archived products are not displayed anywhere on store</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
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

export default ProductForm;