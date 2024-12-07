import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KhataSummary = ({ summary }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAmount(summary?.totalCredit)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Received</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAmount(summary?.totalReceived)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAmount(summary?.pendingAmount)}</div>
        </CardContent>
      </Card>
    </>
  );
};

export default KhataSummary; 