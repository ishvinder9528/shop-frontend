import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import KhataEntryDialog from './KhataEntryDialog';
import { ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';

const KhataTransactions = ({ entries, onRefresh }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down one viewport height
      setShowScrollTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

  // Get all transactions including payments
  const getAllTransactions = () => {
    const transactions = [];
    entries.forEach(entry => {
      // Add the main entry
      transactions.push({
        ...entry,
        type: 'entry',
        date: entry.createdAt
      });
      
      // Add all payments for this entry
      entry.payments?.forEach(payment => {
        transactions.push({
          ...payment,
          type: 'payment',
          buyerName: entry.buyerName,
          entryId: entry._id
        });
      });
    });

    // Sort by date, newest first
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const transactions = getAllTransactions();
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className="space-y-4">
      {displayTransactions.map((transaction) => (
        <div 
          key={transaction._id} 
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
          onClick={() => {
            if (transaction.type === 'entry') {
              setSelectedEntry(entries.find(e => e._id === transaction._id));
            } else {
              setSelectedEntry(entries.find(e => e._id === transaction.entryId));
            }
          }}
        >
          <div>
            <h3 className="font-semibold">{transaction.buyerName}</h3>
            {transaction.type === 'entry' ? (
              <>
                <p className="text-sm text-muted-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(transaction.date)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Payment Received</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(transaction.date)}
                </p>
              </>
            )}
          </div>
          <div className="text-right">
            <div className="font-medium">
              {transaction.type === 'entry' ? (
                formatAmount(transaction.amount)
              ) : (
                <span className="text-green-600">+{formatAmount(transaction.amount)}</span>
              )}
            </div>
            {transaction.type === 'entry' && (
              <Badge variant={transaction.status === 'COMPLETED' ? 'success' : 'secondary'}>
                {transaction.status}
              </Badge>
            )}
          </div>
        </div>
      ))}

      {transactions.length > 5 && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEntry(null);
              setShowAll(!showAll);
            }}
          >
            {showAll ? (
              <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>Show More <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      )}

      <KhataEntryDialog
        entry={selectedEntry}
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onRefresh={onRefresh}
      />

      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default KhataTransactions; 