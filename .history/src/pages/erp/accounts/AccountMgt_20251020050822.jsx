import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../partials/ErpSidebar";
import Header from "../../../partials/Header";
import Banner from "../../../partials/Banner";

// Import account sub-pages
import Overview from "./Overview";
import Revenue from "./Revenue";
import Expenses from "./Expenses";
import Payables from "./Payables";
import Receivables from "./Receivables";

function AccountMgt() {
  const { subpage } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!subpage) {
      navigate("/erp/account/overview", { replace: true });
    }
  }, [subpage, navigate]);

  const activeTab = subpage || "overview";

  const handleTabChange = (tab) => {
    navigate(`/erp/account/${tab}`);
  };

  const renderTabContent = () => {
