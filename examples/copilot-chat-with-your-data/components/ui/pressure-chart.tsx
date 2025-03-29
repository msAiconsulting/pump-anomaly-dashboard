"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceDot,
  ReferenceArea,
  Brush
} from "recharts";

interface PressureChartProps {
  data: any[];
  anomalies: number[];
  minPressure: number;
  maxPressure: number;
  className?: string;
}

export function PressureChart({
  data,
  anomalies,
  minPressure,
  maxPressure,
  className,
}: PressureChartProps) {
  // State for controlling zoom
  const [zoomLevel, setZoomLevel] = React.useState(1); // 1 = 100% (no zoom)
  const [centerPoint, setCenterPoint] = React.useState(0); // Index to center view on
  const [zoomedData, setZoomedData] = React.useState<any[]>([]);
  const [currentView, setCurrentView] = React.useState<'all' | 'zoomed'>('all'); // Track view mode

  // Process data for the chart with explicit X positions
  const chartData = React.useMemo(() => {
    // Prepare data with consistent date structures
    return data.map((point, idx) => {
      // Format date for display
      const date = new Date(point.timestamp);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit'
      });
      
      // Create a consistent data point with all needed fields
      return {
        originalTimestamp: point.timestamp,
        formattedDate,
        // Store the actual date object for sorting/filtering
        date: date,
        // Map directly to pressure values
        pressure: point.pressure,
        rollingMean: point.rollingMean,
        // Flag anomaly regions
        anomalyRegion: anomalies.includes(idx) ? 1 : 0,
        // Flag anomaly points
        isAnomaly: anomalies.includes(idx),
        // Store index for reference
        index: idx
      };
    });
  }, [data, anomalies]);

  // Calculate zoom window and update zoomed data
  const updateZoomedData = React.useCallback(() => {
    if (chartData.length === 0) return;
    
    // If showing all data
    if (currentView === 'all') {
      setZoomedData(chartData);
      return;
    }
    
    // Calculate how many points to show based on zoom level
    const pointsToShow = Math.ceil(chartData.length / zoomLevel);
    
    // Calculate start and end indices with center point in the middle
    let startIdx = Math.max(0, Math.floor(centerPoint - pointsToShow / 2));
    let endIdx = Math.min(chartData.length - 1, Math.floor(centerPoint + pointsToShow / 2));
    
    // Adjust if we're at the edges
    if (startIdx === 0) {
      endIdx = Math.min(chartData.length - 1, startIdx + pointsToShow - 1);
    } else if (endIdx === chartData.length - 1) {
      startIdx = Math.max(0, endIdx - pointsToShow + 1);
    }
    
    // If the visible window is almost the whole dataset, just show everything
    if (endIdx - startIdx + 1 >= chartData.length * 0.99) {
      handleResetZoom();
      return;
    }
    
    // Slice the data to show only the visible window
    const newZoomedData = chartData.slice(startIdx, endIdx + 1);
    setZoomedData(newZoomedData);
  }, [chartData, zoomLevel, centerPoint, currentView]);

  // Rest of your existing zoom handlers (unchanged)
  const handleZoomIn = () => {
    setCurrentView('zoomed');
    setZoomLevel(prev => {
      // Zoom in by approximately 5% steps (showing 5% less data)
      // If prev=1 (100%), next step is showing 95% (zoom level ≈ 1.053)
      if (prev === 1) return 1.053;
      
      // For all other steps, increase by approximately 5% of visible data
      // Convert current zoom to percentage visible, decrease by 5%, convert back
      const visiblePercentage = 1 / prev;
      const newVisiblePercentage = Math.max(0.05, visiblePercentage - 0.05);
      return 1 / newVisiblePercentage;
    });
  };

  const handleZoomOut = () => {
    // If we're at the first zoom level, go back to fit all
    if (Math.abs(zoomLevel - 1.053) < 0.01) {
      handleResetZoom();
      return;
    }
    
    // Apply consistent 5% increments
    // Convert current zoom to percentage visible, increase by 5%, convert back
    const visiblePercentage = 1 / zoomLevel;
    const newVisiblePercentage = Math.min(1, visiblePercentage + 0.05);
    
    // If we're very close to showing everything, reset zoom
    if (newVisiblePercentage > 0.97) {
      handleResetZoom();
      return;
    }
    
    setZoomLevel(1 / newVisiblePercentage);
    setCurrentView('zoomed');
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setCurrentView('all');
    setCenterPoint(Math.floor(chartData.length / 2));
    setZoomedData(chartData);
  };

  const handlePanLeft = () => {
    if (currentView === 'all') {
      setCurrentView('zoomed');
      setZoomLevel(2);
    }
    setCenterPoint(prev => {
      const step = Math.max(1, Math.ceil(chartData.length / zoomLevel / 4));
      return Math.max(0, prev - step);
    });
  };

  const handlePanRight = () => {
    if (currentView === 'all') {
      setCurrentView('zoomed');
      setZoomLevel(2);
    }
    setCenterPoint(prev => {
      const step = Math.max(1, Math.ceil(chartData.length / zoomLevel / 4));
      return Math.min(chartData.length - 1, prev + step);
    });
  };

  // Initialize zoomed data when chart data changes
  React.useEffect(() => {
    if (data.length > 0) {
      // Force 'all' view on initial load and when data changes
      setCurrentView('all');
      setZoomLevel(1);
      setCenterPoint(Math.floor(chartData.length / 2));
      setZoomedData(chartData);
    }
  }, [data, chartData]);

  // Update zoomed data whenever zoom level or center point changes
  React.useEffect(() => {
    updateZoomedData();
  }, [updateZoomedData, zoomLevel, centerPoint, currentView]);

  // Custom tooltip to show formatted data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isAnomaly = payload[0]?.payload?.isAnomaly;
      const anomalyRegion = payload[0]?.payload?.anomalyRegion;
      const originalTimestamp = payload[0]?.payload?.originalTimestamp;
      
      // Format the full date and time for the tooltip
      const formattedDateTime = originalTimestamp 
        ? new Date(originalTimestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })
        : label;
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{formattedDateTime}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.name === 'isAnomaly' || entry.name === 'anomalyRegion' || 
                entry.name === 'index' || entry.name === 'originalTimestamp' || 
                entry.name === 'date' || entry.name === 'formattedDate') 
              return null;
            
            return (
              <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value} PSI
              </p>
            );
          })}
          {isAnomaly && (
            <p className="text-sm font-medium text-orange-500 mt-1">Anomaly</p>
          )}
          {anomalyRegion > 0 && (
            <p className="text-sm font-medium text-pink-500 mt-1">Anomaly Region</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate tick values for the x-axis based on date boundaries
  const getTickValues = React.useCallback(() => {
    if (zoomedData.length === 0) return [];
    
    // Group data by day
    const dayMap = new Map();
    zoomedData.forEach(point => {
      const date = point.date;
      const day = date.toLocaleDateString();
      if (!dayMap.has(day)) {
        dayMap.set(day, { date, label: point.formattedDate });
      }
    });
    
    // Return sorted unique days
    return Array.from(dayMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(d => d.label);
  }, [zoomedData]);

  const tickValues = getTickValues();

  return (
    <div className={`w-full h-full flex flex-col ${className || ''}`}>
      {/* Zoom controls (unchanged) */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-500 italic">
          Use the zoom controls to adjust the view
        </div>
        
        <div className="flex space-x-1 items-center bg-gray-100 rounded-md p-1">
          <button 
            onClick={handlePanLeft}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm"
            title="Pan left"
          >
            ←
          </button>
          
          <button 
            onClick={handleZoomOut}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm"
            title="Zoom out"
          >
            −
          </button>
          
          <button 
            onClick={handleResetZoom}
            className={`px-3 py-1.5 ${currentView === 'all' ? 'bg-blue-100' : 'bg-gray-200 hover:bg-gray-300'} rounded text-xs font-medium text-gray-700`}
          >
            Fit All
          </button>
          
          <button 
            onClick={handleZoomIn}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm"
            title="Zoom in"
          >
            +
          </button>
          
          <button 
            onClick={handlePanRight}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm"
            title="Pan right"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-grow">
        <div style={{ 
          width: '100%', 
          height: '300px', 
          minWidth: currentView === 'all' ? `${Math.max(800, data.length * 3)}px` : `${zoomedData.length * 5}px` 
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={zoomedData}
              margin={{
                top: 10,
                right: 50,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate"
                ticks={tickValues}
                tickMargin={10}
                height={50}
                angle={-15}
                textAnchor="end"
                interval={0}
                allowDataOverflow={true}
                tick={{ fontSize: 10, fill: '#1e3a8a' }}
                axisLine={{ stroke: '#1e3a8a' }}
                tickLine={{ stroke: '#1e3a8a' }}
              />
              <YAxis 
                domain={[minPressure * 0.9, maxPressure * 1.1]} 
                padding={{ top: 20, bottom: 20 }}
                allowDataOverflow={true}
                tick={{ fontSize: 10, fill: '#1e3a8a' }}
                axisLine={{ stroke: '#1e3a8a' }}
                tickLine={{ stroke: '#1e3a8a' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Anomaly regions */}
              {zoomedData
                .filter((d, i) => 
                  d.isAnomaly && 
                  (i === 0 || !zoomedData[i-1].isAnomaly)
                )
                .map((startPoint, idx) => {
                  // Find the end of this anomaly region
                  let endIdx = zoomedData.findIndex((d, i) => 
                    i > zoomedData.indexOf(startPoint) && !d.isAnomaly
                  );
                  
                  if (endIdx === -1) endIdx = zoomedData.length;
                  const endPoint = zoomedData[endIdx - 1];
                  
                  return (
                    <ReferenceArea 
                      key={`anomaly-${idx}`}
                      x1={zoomedData.indexOf(startPoint)}
                      x2={zoomedData.indexOf(endPoint)}
                      y1={minPressure * 0.9}
                      y2={maxPressure * 1.1}
                      fill="rgba(255, 200, 200, 0.7)"
                      stroke="rgba(255, 150, 150, 0.9)"
                      strokeWidth={1}
                      ifOverflow="extendDomain"
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease"
                    />
                  );
                })}
              
              {/* Main pressure line */}
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#8884d8"
                strokeWidth={2}
                name="Pressure"
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  
                  if (payload.isAnomaly) {
                    return (
                      <circle 
                        key={`anomaly-dot-${payload.originalTimestamp}`}
                        cx={cx} 
                        cy={cy} 
                        r={3} 
                        fill="white" 
                        stroke="#FF9800"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  
                  // Return an invisible circle for non-anomaly points
                  return (
                    <circle 
                      key={`pressure-dot-${payload.originalTimestamp}`}
                      cx={cx} 
                      cy={cy} 
                      r={0} 
                      fill="transparent" 
                      stroke="transparent" 
                    />
                  );
                }}
                activeDot={{ r: 8 }}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease"
              />
              
              {/* Rolling mean line */}
              <Line
                type="monotone"
                dataKey="rollingMean"
                stroke="#4caf50"
                strokeWidth={2}
                name="Rolling Mean"
                dot={false}
                strokeDasharray="5 5"
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 