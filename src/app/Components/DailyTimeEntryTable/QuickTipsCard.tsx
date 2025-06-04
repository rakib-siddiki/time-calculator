import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickTipsCard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">💡 Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600">
        <p>• Values update automatically as you type</p>
        <p>• Minutes and seconds are capped at 59</p>
        <p>• Use Tab to navigate between fields quickly</p>
        <p>• Click the copy button to save your total</p>
        <p>• Load sample data to see the calculator in action</p>
      </CardContent>
    </Card>
  );
};

export default QuickTipsCard;
