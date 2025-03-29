"use client";

import * as React from "react";
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { cn } from "../../lib/utils";

interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGrid?: boolean;
  yAxisWidth?: number;
  className?: string;
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#0ea5e9", "#84cc16", "#ef4444", "#eab308", "#6366f1"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  yAxisWidth = 56,
  className,
}: LineChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 8,
          }}
        >
          {showGrid ? (
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#f1f5f9"
            />
          ) : null}
          {showXAxis ? (
            <XAxis
              dataKey={index}
              tick={{ transform: "translate(0, 6)" }}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#94a3b8"
              tickFormatter={(value) => value.toString()}
            />
          ) : null}
          {showYAxis ? (
            <YAxis
              width={yAxisWidth}
              axisLine={false}
              tickLine={false}
              fontSize={12}
              stroke="#94a3b8"
              tickFormatter={(value) => valueFormatter(value)}
            />
          ) : null}
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload) return null;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {index}
                      </span>
                      <span className="font-bold">
                        {label}
                      </span>
                    </div>
                    {payload.map((item, index) => (
                      <div key={index} className="flex flex-col">
                        <span
                          className="text-[0.70rem] uppercase text-muted-foreground"
                          style={{
                            color: item.color,
                          }}
                        >
                          {item.name}
                        </span>
                        <span className="font-bold">{valueFormatter(Number(item.value))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />
          {showLegend ? (
            <Legend
              verticalAlign="top"
              height={60}
              fontSize={12}
              iconType="circle"
              iconSize={8}
            />
          ) : null}
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 1 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
} 