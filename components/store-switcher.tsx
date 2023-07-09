"use client"

import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDownIcon, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;


interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
    className?: string;
}


const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)

    const fItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const currStore = fItems.find((item) => item.value === params.storeId);

    const onStoreSelected = (store: { label: string, value: string }) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size='sm'
                    role='combobox'
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn('w-[200px] justify-between', className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currStore?.label || 'Select a store'}
                    <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store ..." />
                        <CommandEmpty> No StoreFound </CommandEmpty>
                        <CommandGroup heading="stores">
                            {fItems.map(({ label, value }) => (
                                <CommandItem
                                    key={value}
                                    onSelect={() => onStoreSelected({ label, value })}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {label}
                                    <Check
                                        className={cn("ml-auto h-4 w-4", currStore?.value === value ? 'opacity-100' : 'opacity-0')}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    storeModal.onOpen()
                                    setOpen(false)
                                }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default StoreSwitcher;