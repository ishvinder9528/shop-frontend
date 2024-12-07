import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { updateKhataPayment } from "@/services/khataService";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';

const KhataOverview = ({ entries, onRefresh }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState({});

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (date) => {
    return format(new Date(date), 'dd MMM yyyy, hh:mm a');
  };

  const handlePaymentAmountChange = (entryId, value) => {
    setPaymentAmount(prev => ({
      ...prev,
      [entryId]: value
    }));
  };

  const handlePayment = async (entryId) => {
    const amount = parseFloat(paymentAmount[entryId]);
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
      await updateKhataPayment(entryId, { amount });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
      setPaymentAmount(prev => ({ ...prev, [entryId]: '' }));
      onRefresh();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Khata Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {entries && entries.length > 0 ? (
              entries.map((entry) => (
                <Card key={entry._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{entry.buyerName}</h3>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                    <Badge variant={entry.status === 'COMPLETED' ? 'success' : 'secondary'}>
                      {entry.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Amount:</span>
                      <span className="font-medium">{formatAmount(entry.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paid Amount:</span>
                      <span className="font-medium">{formatAmount(entry.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining:</span>
                      <span className="font-medium">{formatAmount(entry.amount - entry.paidAmount)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Payment History</h4>
                    <div className="space-y-2">
                      {entry.payments?.map((payment, index) => (
                        <div key={index} className="text-sm flex justify-between items-center bg-muted/50 p-2 rounded">
                          <span>{formatDateTime(payment.date)}</span>
                          <span className="font-medium">{formatAmount(payment.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {entry.status !== 'COMPLETED' && (
                    <div className="mt-4 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter payment amount"
                          value={paymentAmount[entry._id] || ''}
                          onChange={(e) => handlePaymentAmountChange(entry._id, e.target.value)}
                        />
                        <Button
                          disabled={loading}
                          onClick={() => handlePayment(entry._id)}
                        >
                          Pay
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No khata entries found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default KhataOverview; 