// src/pages/pos/Loyalty.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Gift, Users } from "lucide-react";

function Loyalty() {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);

  useEffect(() => {
    // Fetch loyalty programs from backend (placeholder)
    setLoyaltyPrograms([
      { id: 1, name: "Gold Members", points: 5000, reward: "10% Discount" },
      { id: 2, name: "Silver Members", points: 2500, reward: "5% Discount" },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gift className="w-6 h-6 text-yellow-400" /> Loyalty Programs
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Program
        </Button>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loyaltyPrograms.map((program) => (
          <Card
            key={program.id}
            className="bg-[#0d1b2a] text-white border border-gray-700 rounded-2xl shadow-lg"
          >
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold">{program.name}</h2>
              <p className="text-sm text-gray-300 mt-1">
                Points: {program.points}
              </p>
              <p className="text-sm text-gray-300">Reward: {program.reward}</p>
              <div className="mt-4 flex justify-between items-center">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Manage
                </Button>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loyaltyPrograms.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No loyalty programs created yet.
        </p>
      )}
    </div>
  );
}

export default Loyalty;
