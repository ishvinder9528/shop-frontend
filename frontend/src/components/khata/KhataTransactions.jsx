import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

const KhataTransactions = ({ entries }) => {
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

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry._id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">{entry.buyerName}</h3>
            <p className="text-sm text-muted-foreground">{entry.description}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(entry.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="font-medium">{formatAmount(entry.amount)}</div>
            <Badge variant={entry.status === 'COMPLETED' ? 'success' : 'secondary'}>
              {entry.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KhataTransactions; 