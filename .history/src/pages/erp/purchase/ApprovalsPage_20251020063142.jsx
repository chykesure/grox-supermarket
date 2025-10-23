import React, { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import { Card, CardContent, Button } from "../../../components/UIComponents";

const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState([
    { id: 1, order: "ORD-001", supplier: "Supplier A", requestedBy: "John Doe", status: "Pending" },
    { id: 2, order: "ORD-002", supplier: "Supplier B", requestedBy: "Sarah Johnson", status: "Pending" },
  ]);

  const handleApprove = (id) =>
    setApprovals(
      approvals.map((a) => (a.id === id ? { ...a, status: "Approved" } : a))
    );
  const handleReject = (id) =>
    setApprovals(
      approvals.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a))
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Approvals</h2>

      <Card>
        <CardContent>
          <table className="min-w-full text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400 uppercase text-xs">
              <tr>
                <th className="py-3 text-left">Order</th>
                <th className="py-3 text-left">Supplier</th>
                <th className="py-3 text-left">Requested By</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((a) => (
                <tr key={a.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3">{a.order}</td>
                  <td className="py-3">{a.supplier}</td>
                  <td className="py-3">{a.requestedBy}</td>
                  <td className="py-3">{a.status}</td>
                  <td className="py-3 flex justify-center gap-3">
                    {a.status === "Pending" && (
                      <>
                        <Button onClick={() => handleApprove(a.id)} className="bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                        <Button onClick={() => handleReject(a.id)} className="bg-red-600 hover:bg-red-700">Reject</Button>
                      </>
                    )}
                    <Button className="bg-gray-600 hover:bg-gray-500"><Eye className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalsPage;
