import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

// Native core engine layout styles required for visual canvas drawing
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { mockData } from "../data/mockData";

export default function MainDashboard() {
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Client Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time subscription operations and business metrics</p>
        </header>

        <main className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <div className="ag-theme-quartz w-full" style={{ height: "480px" }}>
            <AgGridReact
              rowData={mockData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}