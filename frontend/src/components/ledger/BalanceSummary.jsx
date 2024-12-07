import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

const BalanceSummary = ({ summary }) => {
  if (!summary) return null;

  const income = summary.summary.find(item => item._id === 'income')?.total || 0;
  const expense = summary.summary.find(item => item._id === 'expense')?.total || 0;
  const balance = income - expense;
  const percentageChange = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Balance
          </div>
          <div className="text-3xl font-bold">
            {formatAmount(balance)}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            {balance >= 0 ? (
              <ArrowUpIcon className="text-green-500" />
            ) : (
              <ArrowDownIcon className="text-red-500" />
            )}
            <span className={balance >= 0 ? "text-green-500" : "text-red-500"}>
              {percentageChange}%
            </span>
            <span className="text-muted-foreground">from income</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSummary;