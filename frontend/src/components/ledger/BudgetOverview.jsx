import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

const BudgetOverview = ({ summary }) => {
  if (!summary) return null;

  const expense = summary.summary.find(item => item._id === 'expense')?.total || 0;
  const budget = 100000; // Example budget amount
  const usedPercentage = Math.min((expense / budget) * 100, 100);

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
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Monthly Budget
            </div>
            <div className="text-2xl font-bold">
              {formatAmount(budget)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used</span>
              <span>{formatAmount(expense)}</span>
            </div>
            <Progress value={usedPercentage} />
            <div className="text-sm text-muted-foreground">
              {usedPercentage.toFixed(1)}% of budget used
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Remaining: {formatAmount(budget - expense)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;