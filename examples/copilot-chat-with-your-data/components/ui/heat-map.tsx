"use client";

import * as React from "react";
import { Tooltip, Cell, ResponsiveContainer, Treemap } from "recharts";
import { cn } from "../../lib/utils";

interface HeatMapProps {
  data: any[];
  valueKey: string;
  nameKey: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  aspectRatio?: number;
}

export function HeatMap({
  data,
  valueKey,
  nameKey,
  colors = ["#0ea5e9", "#84cc16", "#ef4444", "#eab308", "#6366f1"],
  valueFormatter = (value: number) => value.toString(),
  className,
  aspectRatio = 4 / 3,
}: HeatMapProps) {
  // Calculate the intensity for each item relative to max value
  const maxValue = Math.max(...data.map((item) => item[valueKey]));
  
  // Data with color intensity based on value
  const colorizedData = data.map((item, i) => {
    const colorIndex = i % colors.length;
    const baseColor = colors[colorIndex];
    // Calculate opacity based on value (0.3 to 1.0)
    const opacityFactor = 0.3 + (0.7 * item[valueKey] / maxValue);
    
    return {
      ...item,
      colorOpacity: opacityFactor,
      baseColor,
      fill: baseColor
    };
  });

  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
        <Treemap
          data={colorizedData}
          dataKey={valueKey}
          nameKey={nameKey}
          stroke="#fff"
          animationDuration={300}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) {
                return null;
              }
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      {data[nameKey]}
                    </span>
                    <span className="font-bold">{valueFormatter(data[valueKey])}</span>
                  </div>
                </div>
              );
            }}
          />
          {colorizedData.map((item, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={item.baseColor}
              fillOpacity={item.colorOpacity}
            />
          ))}
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
} 