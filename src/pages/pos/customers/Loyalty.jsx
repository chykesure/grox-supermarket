import React, { useState } from "react";
import { Gift, Users, PlusCircle, MinusCircle } from "lucide-react";

function Loyalty() {
  // Demo loyalty programs (replace with backend fetch later)
  const [loyaltyPrograms] = useState([
    {
      id: 1,
      name: "Bronze Tier",
      points: 100,
      rewards: "5% discount on next purchase",
      customers: 25,
    },
    {
      id: 2,
      name: "Silver Tier",
      points: 250,
      rewards: "Free gift on orders above ₦10,000",
      customers: 12,
    },
    {
      id: 3,
      name: "Gold Tier",
      points: 500,
      rewards: "15% discount + VIP support",
      customers: 6,
    },
  ]);

  // Demo customers (replace with backend fetch later)
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", points: 120, history: [] },
    { id: 2, name: "Jane Smith", points: 80, history: [] },
  ]);

  const addPoints = (id, amount) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              points: c.points + amount,
              history: [
                { action: "Added", amount, date: new Date().toLocaleString() },
                ...c.history,
              ],
            }
          : c
      )
    );
  };

  const redeemPoints = (id, amount) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              points: Math.max(0, c.points - amount),
              history: [
                {
                  action: "Redeemed",
                  amount,
                  date: new Date().toLocaleString(),
                },
                ...c.history,
              ],
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Loyalty Programs Section */}
      <div>
        <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2 mb-4">
          <Gift size={20} /> Loyalty Programs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loyaltyPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 flex flex-col justify-between hover:shadow-lg hover:border-green-600 transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-green-300">
                  {program.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{program.rewards}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Required Points:{" "}
                  <span className="text-green-400 font-semibold">
                    {program.points}
                  </span>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-400">
                  <Users className="w-4 h-4 text-green-400" />
                  {program.customers} customers
                </span>
                <button className="px-3 py-1 rounded-md bg-green-700 hover:bg-green-600 text-xs">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customers Table Section */}
      <div>
        <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2 mb-4">
          <Users size={20} /> Customers & Points
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-center">Points</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-800">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2 text-center font-semibold text-green-400">
                    {c.points}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => addPoints(c.id, 10)}
                      className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-500"
                    >
                      <PlusCircle size={16} className="mr-1" /> Add 10
                    </button>
                    <button
                      onClick={() => redeemPoints(c.id, 10)}
                      className="inline-flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
                    >
                      <MinusCircle size={16} className="mr-1" /> Redeem 10
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Loyalty History
        </h3>
        {customers.map((c) => (
          <div key={c.id} className="mb-4">
            <p className="font-medium text-green-400">{c.name}</p>
            <ul className="text-gray-300 text-sm pl-4 list-disc">
              {c.history.length === 0 ? (
                <li>No transactions yet.</li>
              ) : (
                c.history.map((h, i) => (
                  <li key={i}>
                    {h.date}:{" "}
                    <span
                      className={`font-medium ${
                        h.action === "Added"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {h.action}
                    </span>{" "}
                    {h.amount} points
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loyalty;
