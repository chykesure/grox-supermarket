import React, { useState } from "react";
import { Card, CardContent, Button } from "../../../components/UIComponents";
import { FileText, Download } from "lucide-react";

const FinancialPage = () => {
  const [transactions] = useState([
    { id: 1, date: "2025-10-01", type: "Revenue", amount: "₦500,000", description: "Loan repayment" },
    { id: 2, date: "2025-10-03", type: "Expense", amount: "₦120,000", description: "Office supplies" },
    { id: 3, date: "2025-10-05", type: "Revenue", amount: "₦300,000", description: "New disbursement" },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Financial Report</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Financials
        </Button>
      </div>

      <Card>
        <CardContent>
          <table className="min-w-full text-gray-300 border border-gray-700">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs border-b border-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4">{t.date}</td>
                  <td className="py-3 px-4">{t.type}</td>
                  <td className="py-3 px-4">{t.amount}</td>
                  <td className="py-3 px-4">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialPage;
