import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { DialogClose } from '@radix-ui/react-dialog'

interface ConfirmDeleteProps {
    title?: string
    message?: string | React.ReactNode
    onDelete: () => void
    buttonLabel?: string
    buttonClassName?: string
}

const ConfirmDelete = ({
    title,
    message,
    onDelete,
    buttonLabel,
    buttonClassName
}: ConfirmDeleteProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    <Button variant="outline" className={buttonClassName}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {buttonLabel || 'Delete'}
                    </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title || 'Are you absolutely sure?'}</DialogTitle>
                    <DialogDescription>
                        {message ||
                            'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={onDelete}>Si, quiero eliminar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmDelete
