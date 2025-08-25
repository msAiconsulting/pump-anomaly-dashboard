"use client";

import { useCopilotReadable } from "@copilotkit/react-core";

export function Dashboard() {
  // Sample data for demonstration
  const sampleData = {
    totalRevenue: 125000,
    totalProfit: 45000,
    totalCustomers: 1250,
    conversionRate: "3.2%",
    averageOrderValue: 100,
    profitMargin: "36%"
  };

  // Make data available to the Copilot
  useCopilotReadable({
    description: "Dashboard data including sales trends, product performance, and category distribution",
    value: {
      metrics: sampleData,
      salesData: [
        { month: "Jan", revenue: 10000, profit: 3500 },
        { month: "Feb", revenue: 12000, profit: 4200 },
        { month: "Mar", revenue: 15000, profit: 5400 },
        { month: "Apr", revenue: 18000, profit: 6500 },
        { month: "May", revenue: 20000, profit: 7200 },
        { month: "Jun", revenue: 25000, profit: 9000 }
      ]
    }
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-xl font-semibold text-gray-900">${sampleData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">Total Profit</p>
          <p className="text-xl font-semibold text-gray-900">${sampleData.totalProfit.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">Customers</p>
          <p className="text-xl font-semibold text-gray-900">{sampleData.totalCustomers.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">Conversion Rate</p>
          <p className="text-xl font-semibold text-gray-900">{sampleData.conversionRate}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">Avg Order Value</p>
          <p className="text-xl font-semibold text-gray-900">${sampleData.averageOrderValue}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">Profit Margin</p>
          <p className="text-xl font-semibold text-gray-900">{sampleData.profitMargin}</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sales Data</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">January</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$10,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$3,500</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">February</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$12,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$4,200</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">March</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$15,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$5,400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
