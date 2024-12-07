import { ScrollArea } from "@/components/ui/scroll-area";

const RecentTransactions = ({ entries }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {entry.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(entry.date)}
                </p>
              </div>
            </div>
            <div className={`text-sm font-medium ${
              entry.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {entry.type === 'income' ? '+' : '-'}{formatAmount(entry.amount)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentTransactions;