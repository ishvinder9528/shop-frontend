import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import KhataEntryForm from './KhataEntryForm';
import KhataOverview from './KhataOverview';
import KhataSummary from './KhataSummary';
import KhataTransactions from './KhataTransactions';
import { getKhataEntries, getKhataSummary } from '@/services/khataService';
import { useToast } from "@/hooks/use-toast";

const Khata = () => {
    const [entries, setEntries] = useState([]);
    const [summary, setSummary] = useState(null);
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [entriesData, summaryData] = await Promise.all([
                getKhataEntries(),
                getKhataSummary()
            ]);
            
            setEntries(Array.isArray(entriesData) ? entriesData : []);
            setSummary(summaryData);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to fetch data",
                variant: "destructive",
            });
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='container mx-auto py-6 px-4 sm:px-6 lg:px-8'>
            <div className="space-y-6">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold ">Khata Book</h1>
                    <Button onClick={() => setShowEntryForm(true)} loading={loading}>
                        <span className='hidden md:block'>
                            Add New Entry
                        </span>
                        <span className='block md:hidden'>
                            +
                        </span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <KhataSummary summary={summary} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Latest khata activities and payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <KhataTransactions 
                                entries={entries} 
                                onRefresh={fetchData}
                            />
                        </CardContent>
                    </Card>

                    <KhataOverview
                        entries={entries}
                        onRefresh={fetchData}
                    />
                </div>

                <KhataEntryForm
                    open={showEntryForm}
                    onClose={() => setShowEntryForm(false)}
                    onSuccess={() => {
                        setShowEntryForm(false);
                        fetchData();
                    }}
                />
            </div>
        </div>
    );
};

export default Khata;
