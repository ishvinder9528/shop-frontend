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
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
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
                        </div>
                    </DialogHeader>

                    {!isEditing && (
                        <Tabs defaultValue="details" className="mt-1">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="payments">Payments</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader className="py-2">
                                            <CardTitle className="text-sm">Total Amount</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">{formatAmount(currentEntry?.amount)}</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="py-2">
                                            <CardTitle className="text-sm">Remaining</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">{formatAmount(currentEntry?.amount - currentEntry?.paidAmount)}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setShowDeleteAlert(true)}
                                        disabled={loading}
                                    >
                                        Delete Entry
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="payments" className="space-y-4">

                                <div className='space-y-2'>
                                    <div className='flex justify-between '>
                                        <p className='text-xs font-semibold text-gray-500'>Total Amount</p>
                                        <p className='text-xs font-semibold text-gray-500'>{formatAmount(currentEntry?.amount)}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-xs font-semibold text-gray-500'>Remaining</p>
                                        <p className='text-xs font-semibold text-gray-500'>{formatAmount(currentEntry?.amount - currentEntry?.paidAmount)}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-sm font-semibold text-gray-500'>Paid Amount</p>
                                        <p className='text-sm font-semibold text-gray-500'>{formatAmount(currentEntry?.paidAmount)}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Payment Date</Label>
                                    <Input
                                        type="datetime-local"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Amount</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter payment amount"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                        />
                                        <Button
                                            disabled={loading}
                                            onClick={handlePayment}
                                        >
                                            {editingPayment ? 'Update' : 'Pay'}
                                        </Button>
                                    </div>
                                </div>
                                {editingPayment && (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            setEditingPayment(null);
                                            setPaymentAmount('');
                                            setPaymentDate(format(new Date(), 'yyyy-MM-dd HH:mm'));
                                        }}
                                    >
                                        Cancel Edit
                                    </Button>
                                )}

                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold mb-2">Payment History</h4>
                                    <div className="space-y-2">
                                        {currentEntry?.payments?.length > 0 ? currentEntry?.payments?.map((payment) => (
                                            <div
                                                key={payment._id}
                                                className="text-sm flex justify-between items-center bg-muted/50 p-2 rounded group"
                                            >
                                                <div className="flex items-center  gap-32">
                                                    <div>{formatDateTime(payment.date)}</div>
                                                    <div className="font-medium">{formatAmount(payment.amount)}</div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="opacity-0 group-hover:opacity-100"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                                                            Edit Payment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setSelectedPayment(payment);
                                                                setShowPaymentDeleteAlert(true);
                                                            }}
                                                        >
                                                            Delete Payment
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )) : <div className='text-sm font-semibold text-gray-500 text-center'>No payments yet</div>}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Khata Entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this khata entry and all its payment history.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showPaymentDeleteAlert} onOpenChange={setShowPaymentDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Payment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the payment of {selectedPayment && formatAmount(selectedPayment.amount)}
                            made on {selectedPayment && formatDateTime(selectedPayment.date)}.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePayment}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default KhataEntryDialog; 