import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { deleteLedgerEntry } from '@/services/ledgerService';

const LedgerTable = ({ entries, onRefresh }) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        setLoading(true);
        try {
            await deleteLedgerEntry(id);
            toast({
                title: "Success",
                description: "Entry deleted successfully",
            });
            onRefresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete entry",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="w-full overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>{formatDate(entry.date)}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell className="capitalize">{entry.type}</TableCell>
                            <TableCell>{entry.category}</TableCell>
                            <TableCell className={`text-right ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {formatAmount(entry.amount)}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={loading}
                                    onClick={() => handleDelete(entry.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {entries.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                                No entries found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default LedgerTable; 