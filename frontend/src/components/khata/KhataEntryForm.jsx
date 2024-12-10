import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createKhataEntry } from '@/services/khataService';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const KhataEntryForm = ({ open, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
  });

  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
      }));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createKhataEntry({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({
        buyerName: '',
        amount: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      });
      toast({
        title: "Success",
        description: "Khata entry added successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create khata entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Khata Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buyerName">Buyer Name</Label>
            <Input
              id="buyerName"
              required
              value={formData.buyerName}
              onChange={(e) => setFormData(prev => ({ ...prev, buyerName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Khata Entry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KhataEntryForm; 