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
import { getUser, updateUser } from '../../services/userService';
import LedgerEntryForm from './LedgerEntryForm';
import LedgerTable from './LedgerTable';
import LedgerSummary from './LedgerSummary';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import SpendingChart from './SpendingChart';
import BudgetOverview from './BudgetOverview';
import { Input } from "@/components/ui/input";

const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [budget, setBudget] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).budget : 100000);

  useEffect(() => {
    fetchAllData();
    fetchUserData();
  }, [selectedShop]);

  const fetchAllData = async () => {
    try {
      const filters = selectedShop ? { shopId: selectedShop } : {};
      const [entriesData, summaryData] = await Promise.all([
        getLedgerEntries(filters),
        getLedgerSummary(filters),
      ]);
      setEntries(entriesData);
      setSummary(summaryData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log(userData);
      setBudget(userData.budget);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
  };

  const handleBudgetChange = async (newBudget) => {
    setBudget(newBudget);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const newUserData = await updateUser(user.googleId, { budget: newBudget });
      localStorage.setItem('user', JSON.stringify(newUserData));
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ledger</h1>
        <div className="space-x-4">
          <Button onClick={() => setShowForm(true)}>Add Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BalanceSummary summary={summary} />
        <SpendingChart entries={entries} />
        <BudgetOverview summary={summary} budget={budget} onBudgetChange={handleBudgetChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions entries={entries.slice(0, 5)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            <LedgerSummary summary={summary} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <LedgerTable
            entries={entries}
            onRefresh={fetchAllData}
          />
        </CardContent>
      </Card>

      <LedgerEntryForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          fetchAllData();
        }}
      />
    </div>
  );
};

export default Ledger; 