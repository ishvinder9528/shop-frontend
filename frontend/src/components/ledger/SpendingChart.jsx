import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SpendingChart = ({ entries }) => {
  const processData = () => {
    const dailyTotals = entries.reduce((acc, entry) => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, amount: 0 };
      }
      acc[date].amount += entry.type === 'expense' ? entry.amount : 0;
      return acc;
    }, {});

    return Object.values(dailyTotals).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    ).slice(-7);
  };

  const data = processData();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground mb-4">
          Weekly Spending
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric' })}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Spending']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { 
                  day: 'numeric',
                  month: 'short' 
                })}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;