import { Card, CardContent } from "../../components/ui/card";

const LedgerSummary = ({ summary }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  if (!summary) {
    return <div>Loading summary...</div>;
  }

  const income = summary.summary.find(item => item._id === 'income')?.total || 0;
  const expense = summary.summary.find(item => item._id === 'expense')?.total || 0;
  const balance = income - expense;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium">Income</div>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(income)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium">Expense</div>
            <div className="text-2xl font-bold text-red-600">
              {formatAmount(expense)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium">Balance</div>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatAmount(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
        <div className="space-y-2">
          {summary.categorySummary.map((category) => (
            <div key={`${category._id.type}-${category._id.category}`} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${category._id.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="capitalize">{category._id.category}</span>
              </div>
              <span className={`font-medium ${category._id.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {formatAmount(category.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LedgerSummary; 