import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KhataEntryDialog from './KhataEntryDialog';
import { useState, useMemo } from "react";

const KhataOverview = ({ entries, onRefresh }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [entries, searchQuery, statusFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Khata Entries</CardTitle>
    

       
        <div className="mt-4 flex gap-16  " style={{marginTop:"18px"}} >
          
          <Input
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Entries</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        
        </div>
        
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] ">
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <Card 
                  key={entry._id} 
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{entry.buyerName}</h3>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
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

      <KhataEntryDialog
        entry={selectedEntry}
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onRefresh={onRefresh}
      />
    </Card>
  );
};

export default KhataOverview; 