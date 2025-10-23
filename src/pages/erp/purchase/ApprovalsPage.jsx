import React, { useState } from "react";
import { Check, X, Eye } from "lucide-react";

// -----------------------------
// Inline UI Components
// -----------------------------
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm transition ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md border border-gray-700 bg-gray-800 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => <div className={`p-4 ${className}`}>{children}</div>;

// -----------------------------
// Modal Component
// -----------------------------
const Modal = ({ title, show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-emerald-400">{title}</h2>
          <X className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-200" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};

// -----------------------------
// Approvals Page Component
// -----------------------------
const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState([
    { id: 1, order: "ORD-001", supplier: "Supplier A", requestedBy: "John Doe", status: "Pending" },
    { id: 2, order: "ORD-002", supplier: "Supplier B", requestedBy: "Sarah Johnson", status: "Pending" },
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);

  const handleApprove = (id) =>
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)));

  const handleReject = (id) =>
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)));

  const openDetailModal = (approval) => {
    setSelectedApproval(approval);
    setShowDetailModal(true);
  };

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
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleApprove(a.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleReject(a.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      className="bg-gray-600 hover:bg-gray-500"
                      onClick={() => openDetailModal(a)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedApproval && (
        <Modal
          title={`Approval Details - ${selectedApproval.order}`}
          show={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        >
          <div className="space-y-4 text-gray-300">
            <p><strong>Order:</strong> {selectedApproval.order}</p>
            <p><strong>Supplier:</strong> {selectedApproval.supplier}</p>
            <p><strong>Requested By:</strong> {selectedApproval.requestedBy}</p>
            <p><strong>Status:</strong> {selectedApproval.status}</p>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-gray-700 hover:bg-gray-600"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApprovalsPage;
