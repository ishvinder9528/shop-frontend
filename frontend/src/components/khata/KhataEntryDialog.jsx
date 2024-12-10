import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { updateKhataPayment, deleteKhataEntry, updateKhataEntry } from '@/services/khataService';
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Pencil, Save, X, ChevronLeft } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

const KhataEntryDialog = ({ entry, open, onClose, onRefresh }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showPaymentDeleteAlert, setShowPaymentDeleteAlert] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd HH:mm'));
    const [editingPayment, setEditingPayment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        buyerName: '',
        description: '',
        amount: ''
    });
    const [currentEntry, setCurrentEntry] = useState(null);

    useEffect(() => {
        if (entry) {
            setCurrentEntry(entry);
            setEditForm({
                buyerName: entry.buyerName,
                description: entry.description,
                amount: entry.amount.toString()
            });
        }
    }, [entry]);

    useEffect(() => {
        if (!open) {
            setPaymentAmount('');
            setPaymentDate(format(new Date(), 'yyyy-MM-dd HH:mm'));
            setEditingPayment(null);
            setIsEditing(false);
            setSelectedPayment(null);
        }
        setPaymentDate(format(new Date(), 'yyyy-MM-dd HH:mm'));
    }, [open]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDateTime = (date) => {
        return format(new Date(date), 'dd MMM yyyy, HH:mm');
    };

    const handlePayment = async () => {
        const amount = parseFloat(paymentAmount);
        if (!amount || amount <= 0) {
            toast({
                title: "Error",
                description: "Please enter a valid payment amount",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            let updatedEntry;
            if (editingPayment) {
                updatedEntry = await updateKhataPayment(currentEntry._id, {
                    paymentId: editingPayment._id,
                    amount,
                    date: new Date(paymentDate)
                }, 'edit');
            } else {
                updatedEntry = await updateKhataPayment(currentEntry._id, {
                    amount,
                    date: new Date(paymentDate)
                }, 'add');
            }

            setCurrentEntry(updatedEntry);
            toast({
                title: "Success",
                description: `Payment ${editingPayment ? 'updated' : 'recorded'} successfully`,
            });
            setPaymentAmount('');
            setPaymentDate(format(new Date(), 'yyyy-MM-dd HH:mm'));
            setEditingPayment(null);
            await onRefresh();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditPayment = (payment) => {
        setEditingPayment(payment);
        setPaymentAmount(payment.amount.toString());
        setPaymentDate(format(new Date(payment.date), 'yyyy-MM-dd HH:mm'));
    };

    const handleDeletePayment = async () => {
        if (!selectedPayment) return;

        setLoading(true);
        try {
            const updatedEntry = await updateKhataPayment(currentEntry._id, {
                paymentId: selectedPayment._id
            }, 'delete');

            setCurrentEntry(updatedEntry);
            toast({
                title: "Success",
                description: "Payment deleted successfully",
            });
            setSelectedPayment(null);
            await onRefresh();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setShowPaymentDeleteAlert(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteKhataEntry(currentEntry._id);
            toast({
                title: "Success",
                description: "Khata entry deleted successfully",
            });
            onClose();
            await onRefresh();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete khata entry",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setShowDeleteAlert(false);
        }
    };

    const handleEdit = async () => {
        setLoading(true);
        try {
            const updatedEntry = await updateKhataEntry(currentEntry._id, editForm);
            setCurrentEntry(updatedEntry);
            toast({
                title: "Success",
                description: "Khata entry updated successfully",
            });
            setIsEditing(false);
            await onRefresh();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update khata entry",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await onRefresh();
    };

    if (!entry) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg mx-auto">
                <DialogHeader>
                    <DialogTitle>Edit Khata Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {isEditing ? (
                        <div className="space-y-4 ">
                            <div className='flex flex-col gap-2'>
                                <Label>Buyer Name</Label>
                                <Input
                                    value={editForm.buyerName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, buyerName: e.target.value }))}
                                    className="font-semibold"
                                    placeholder="Enter buyer name"
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>Description</Label>
                                <Input
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter description"
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={editForm.amount}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <DialogTitle className="text-xl">{currentEntry?.buyerName}</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">{currentEntry?.description}</p>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <div className='ml-10 flex flex-col gap-5'>

                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    disabled={loading}
                                >
                                    <ChevronLeft className="h-4 w-4" />

                                </Button>
                                <Button
                                    size="icon"
                                    onClick={handleEdit}
                                    disabled={loading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                            className='mr-5'
                        >
                            <Pencil className="h-4 w-4 " />
                        </Button>
                    )}
                </div>
                <div className="space-y-4">
                    <Input
                        type="datetime-local"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default KhataEntryDialog; 