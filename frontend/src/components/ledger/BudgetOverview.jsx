import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BudgetOverview = ({ summary, budget, onBudgetChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  if (!summary) return null;

  const expense = summary.summary.find(item => item._id === 'expense')?.total || 0;
  const usedPercentage = Math.min((expense / budget) * 100, 100);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onBudgetChange(newBudget);
    setNewBudget(newBudget);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Monthly Budget
            </div>
            <AiOutlineEdit className="cursor-pointer" onClick={handleEditClick} />
          </div>
          <div className="text-2xl font-bold">
            {isEditing ? (
              <div className="flex items-center">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-24 mr-2"
                />
                <Button size="sm" onClick={handleSaveClick}>Save</Button>
              </div>
            ) : (
              formatAmount(budget)
            )}
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