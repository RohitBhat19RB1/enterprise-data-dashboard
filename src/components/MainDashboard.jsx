import { useState, useMemo, useRef } from "react";
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
    totalEmployees: 0,
    activeHeadcount: 0,
    totalPayroll: 0,
  });

  const columnDefs = useMemo(() => [
    { 
      headerName: "Full Name", 
      valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
      flex: 1.5, 
      minWidth: 160,
      cellStyle: { fontWeight: "500", color: "#111827" }
    },
    { field: "position", headerName: "Job Title", flex: 1.5, minWidth: 150 },
    { field: "department", headerName: "Department", flex: 1, filter: true },
    { 
      field: "isActive", 
      headerName: "Status", 
      flex: 1,
      filter: true,
      cellRenderer: (params) => {
        const active = params.value;
        const bg = active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800";
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg}`}>
            {active ? "Active" : "Inactive"}
          </span>
        );
      }
    },
    { 
      field: "salary", 
      headerName: "Salary", 
      flex: 1,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
      cellStyle: { textAlign: "right" }
    },
    { 
      field: "performanceRating", 
      headerName: "Rating", 
      flex: 0.8,
      cellStyle: { textAlign: "center" }
    },
    { 
      field: "location", 
      headerName: "Office Location", 
      flex: 1
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }), []);

  // Performance-focused recalculation event handler reacting to search filters
  const handleModelUpdated = (event) => {
    const api = event.api;
    let combinedPayroll = 0;
    let activeStaffCount = 0;
    let visibleCount = 0;

    api.forEachNodeAfterFilter((node) => {
      const data = node.data;
      if (data) {
        visibleCount++;
        combinedPayroll += data.salary;
        if (data.isActive) activeStaffCount++;
      }
    });

    setMetrics({
      totalEmployees: visibleCount,
      activeHeadcount: activeStaffCount,
      totalPayroll: combinedPayroll,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Talent Directory</h1>
            <p className="text-sm text-slate-500">Corporate headcount and payroll performance tracking</p>
          </div>
          
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search names, departments, roles..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
            />
          </div>
        </header>

        {/* Dynamic Aggregated Metrics Deck */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visible Headcount</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalEmployees.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Staff</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{metrics.activeHeadcount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aggregated Operational Payroll</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">${metrics.totalPayroll.toLocaleString()}</p>
          </div>
        </section>

        {/* Database Grid Container Frame */}
        <main className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Employee Master Ledger</h2>
            <span className="text-xs text-slate-400">Displaying {metrics.totalEmployees.toLocaleString()} records</span>
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
              rowBuffer={10}
            />
          </div>
        </main>
        
      </div>
    </div>
  );
}