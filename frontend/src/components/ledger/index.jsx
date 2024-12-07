import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLedgerEntries, getLedgerSummary } from '../../services/ledgerService';
import LedgerEntryForm from './LedgerEntryForm';
import LedgerTable from './LedgerTable';
import LedgerSummary from './LedgerSummary';

const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);


  useEffect(() => {
    fetchLedgerData();
  }, [selectedShop]);

  const fetchLedgerData = async () => {
    try {
      const filters = selectedShop ? { shopId: selectedShop } : {};
      const [entriesData, summaryData] = await Promise.all([
        getLedgerEntries(filters),
        getLedgerSummary(filters)
      ]);
      setEntries(entriesData);
      setSummary(summaryData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ledger data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ledger</h1>
        <Button onClick={() => setShowForm(true)}>Add Entry</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            <LedgerSummary summary={summary} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <LedgerTable 
              entries={entries} 
              onRefresh={fetchLedgerData}
            />
          </CardContent>
        </Card>
      </div>

      <LedgerEntryForm 
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          fetchLedgerData();
        }}
      />
    </div>
  );
};

export default Ledger; 