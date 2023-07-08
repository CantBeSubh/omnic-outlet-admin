"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"

export const StoreModal = () => {
    const storeModel = useStoreModal()

    return (
        <Modal
            title="Create store"
            description="Add new store to manage stuff"
            isOpen={storeModel.isOpen}
            onClose={storeModel.onClose}
        >
            Future Modal Form here
        </Modal>
    )
}