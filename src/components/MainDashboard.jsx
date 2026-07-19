import React, { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { mockData } from "../data/mockData";

export default function MainDashboard() {
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    totalMonthlyRevenue: 0,
  });

  const columnDefs = useMemo(() => [
    { 
      field: "customer", 
      headerName: "Customer Name", 
      flex: 1.5, 
      minWidth: 180,
      cellStyle: { fontWeight: "500", color: "#111827" }
    },
    { field: "plan", headerName: "Plan Tier", flex: 1, filter: true },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      filter: true,
      cellRenderer: (params) => {
        const val = params.value;
        let bg = "bg-gray-100 text-gray-800";
        if (val === "Active") bg = "bg-emerald-100 text-emerald-800";
        if (val === "Pending") bg = "bg-amber-100 text-amber-800";
        if (val === "Inactive") bg = "bg-rose-100 text-rose-800";
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg}`}>
            {val}
          </span>
        );
      }
    },
    { 
      field: "spend", 
      headerName: "Monthly Spend", 
      flex: 1,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
      cellStyle: { textAlign: "right" }
    },
    { 
      field: "joined", 
      headerName: "Join Date", 
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }), []);

  // Performance-optimized metrics computation utilizing native client-side engine hooks
  const handleModelUpdated = (event) => {
    const api = event.api;
    let totalSpend = 0;
    let activeCount = 0;
    let totalCount = 0;

    api.forEachNodeAfterFilter((node) => {
      const data = node.data;
      if (data) {
        totalCount++;
        totalSpend += data.spend;
        if (data.status === "Active") activeCount++;
      }
    });

    setMetrics({
      totalCustomers: totalCount,
      activeSubscriptions: activeCount,
      totalMonthlyRevenue: totalSpend,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Workspace Management Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Client Dashboard</h1>
            <p className="text-sm text-slate-500">Real-time subscription operations and business metrics</p>
          </div>
          
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search data fields instantly..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
            />
          </div>
        </header>

        {/* Scalable Business Metrics Sections */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Rows Visible</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalCustomers.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cohort</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{metrics.activeSubscriptions.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aggregated Revenue</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">${metrics.totalMonthlyRevenue.toLocaleString()}</p>
          </div>
        </section>

        {/* Grid Canvas Panel Container */}
        <main className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Customer Records</h2>
            <span className="text-xs text-slate-400">Displaying {metrics.totalCustomers.toLocaleString()} nodes</span>
          </div>
          
          <div className="ag-theme-quartz w-full" style={{ height: "480px" }}>
            <AgGridReact
              ref={gridRef}
              rowData={mockData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              quickFilterText={quickFilterText}
              onModelUpdated={handleModelUpdated}
              animateRows={true}
              rowBuffer={10} // Optimized row element buffering mapping
            />
          </div>
        </main>
        
      </div>
    </div>
  );
}