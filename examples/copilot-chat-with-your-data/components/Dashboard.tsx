"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
// Comment out problematic chart imports
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AreaChart } from "./ui/area-chart";
import { LineChart } from "./ui/line-chart";
import { BarChart } from "./ui/bar-chart";
import { PressureChart } from "./ui/pressure-chart";
import { SearchResults } from "./generative-ui/SearchResults";

// Comment out chart registration
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// Define data interfaces
interface PumpDataPoint {
  timestamp: Date;
  pressure: number;
  machine_status: string;
}

interface RollingStatsPoint {
  timestamp: string;
  value: number;
}

interface TimeSeriesDataPoint {
  timestamp: string;
  pressure: number;
  rollingMean: number;
  rollingStd: number;
  isAnomaly: number;
  isBroken: number;
  [key: string]: string | number; // Index signature for chart component
}

interface PressureDistribution {
  range: string;
  count: number;
  percentage: number;
  [key: string]: string | number; // Index signature for chart component
}

interface PatternData {
  pattern: string;
  count: number;
  [key: string]: string | number; // Index signature for chart component
}

interface PumpMetrics {
  averagePressure: number;
  maxPressure: number;
  minPressure: number;
  anomalyCount: number;
  brokenStateDuration: number;
  anomalyFrequency: number;
}

// Define chat message interface
interface ChatMessage {
  role: string;
  content: string;
}

// Mock useChat hook if the real one doesn't exist
const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I received your question about: "${input}". The dashboard shows pump pressure data.` 
      }]);
    }, 1000);
    
    setInput('');
  };

  return { messages, input, handleInputChange, handleSubmit };
};

// The Dashboard component
export default function Dashboard() {
  // Base state
  const [pumpData, setPumpData] = useState<PumpDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Create the ref at component scope
  const anomaliesRef = useRef<number[]>([]);
  
  // Derived state from analysis
  const [metrics, setMetrics] = useState<PumpMetrics>({
    averagePressure: 0,
    maxPressure: 0,
    minPressure: 0,
    anomalyCount: 0,
    brokenStateDuration: 0,
    anomalyFrequency: 0
  });
  
  const [rollingStats, setRollingStats] = useState<{
    mean: RollingStatsPoint[];
    std: RollingStatsPoint[];
  }>({
    mean: [],
    std: []
  });
  
  const [anomalies, setAnomalies] = useState<number[]>([]);
  const [brokenStates, setBrokenStates] = useState<number[]>([]);
  
  // File path for the CSV data - update with a path that exists
  const csvUrl = useMemo(() => {
    return '/pump_pressure_data.csv';
  }, []);
  
  // CopilotKit integration
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  // Make data available to CopilotKit
  useCopilotAction({
    name: "getPumpData",
    description: "Get the pump pressure data points",
    parameters: [
      {
        name: "count",
        type: "number",
        description: "Number of data points to retrieve. Default is 10.",
      }
    ],
    handler: async ({ count = 10 }) => {
      const limit = Math.min(count, pumpData.length);
      return pumpData.slice(0, limit);
    }
  });
  
  useCopilotAction({
    name: "getPumpMetrics",
    description: "Get the calculated metrics about the pump pressure data",
    parameters: [],
    handler: async () => {
      return metrics;
    }
  });
  
  useCopilotAction({
    name: "getAnomalies",
    description: "Get the detected anomalies in the data",
    parameters: [],
    handler: async () => {
      return anomalies.map(idx => pumpData[idx]);
    }
  });
  
  // Fix useCopilotContext call
  const contextString = `You are a knowledgeable assistant helping with a pump pressure monitoring system. The system monitors pressure readings from industrial pumps and detects anomalies.
      
This dashboard visualizes pressure readings over time, with anomaly detection and statistical analysis. Currently showing data from 1 sensor.

Key metrics displayed:
- Average pressure: ${metrics.averagePressure} PSI
- Maximum pressure: ${metrics.maxPressure} PSI
- Minimum pressure: ${metrics.minPressure} PSI
- Number of anomalies detected: ${metrics.anomalyCount}
- Anomaly frequency: ${metrics.anomalyFrequency}%
- Total broken state duration: ${metrics.brokenStateDuration} time units

The dashboard shows ${pumpData.length} data points from ${timeRange[0]?.toLocaleString() || 'N/A'} to ${timeRange[1]?.toLocaleString() || 'N/A'}.

You can help the user interpret this data, suggest maintenance actions, or explain the anomaly detection methodology.`;

  try {
    // useCopilotContext(contextString);
  } catch (error) {
    console.log("Error setting CopilotContext:", error);
  }
  
  // Load data - only attempt to load data once on mount with csvUrl
  useEffect(() => {
    let isComponentMounted = true;
    
    async function loadData() {
      if (!isComponentMounted) return;
      
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Attempting to fetch pump data from ${csvUrl}`);
        
        const response = await fetch(csvUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const textData = await response.text();
        console.log(`Received data (first 100 chars): ${textData.substring(0, 100)}`);
        
        // Parse CSV data 
        const parseResult = Papa.parse(textData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        
        if (!parseResult.data || !Array.isArray(parseResult.data)) {
          throw new Error('Failed to parse CSV data');
        }
        
        if (!isComponentMounted) return;
        
        // Process the successfully parsed data
        const processedData = processRawData(parseResult.data);
        
        if (processedData.length === 0) {
          throw new Error('No valid data points found in CSV');
        }
        
        if (!isComponentMounted) return;
        
        // Update data state
        setPumpData(processedData);
        setTimeRange([
          processedData[0].timestamp,
          processedData[processedData.length - 1].timestamp
        ]);
        
        // Run data analysis after state updates in the next cycle
        if (isComponentMounted) {
          setTimeout(() => {
            if (isComponentMounted) {
              const statsData = calculateDataStats(processedData);
              setMetrics(statsData.metrics);
              setRollingStats(statsData.rollingStats);
              setBrokenStates(statsData.brokenStates);
              setAnomalies(statsData.anomalies);
            }
          }, 10);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        if (isComponentMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error loading data');
          setIsLoading(false);
        }
      }
    }
    
    loadData();
    
    // Cleanup function to prevent setting state after unmount
    return () => {
      isComponentMounted = false;
    };
  }, [csvUrl]);
  
  // Update chart rendering when data changes
  useEffect(() => {
    if (pumpData.length > 0) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [pumpData.length]);
  
  // Pure functions for data processing - isolated from state
  function processRawData(rawData: any[]): PumpDataPoint[] {
    const processedData: PumpDataPoint[] = [];
    
    // Safely process each row
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      
      if (!row || typeof row !== 'object') continue;
      
      // Find sensor columns (they should start with "sensor_")
      const sensorKeys = Object.keys(row).filter(key => 
        typeof key === 'string' && key.startsWith('sensor_')
      );
      
      if (sensorKeys.length === 0) continue;
      
      // Just use the first sensor found
      const sensorKey = sensorKeys[0];
      
      // Check that we have valid data in this row
      if (!row.timestamp || !row[sensorKey] || isNaN(Number(row[sensorKey]))) {
        continue;
      }
      
      // Create a data point
      processedData.push({
        timestamp: new Date(row.timestamp), 
        pressure: Number(row[sensorKey]),
        machine_status: String(row.machine_status || 'NORMAL')
      });
    }
    
    // Sort by timestamp
    return processedData.sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
  }
  
  // Calculate all derived statistics from data in a pure function
  function calculateDataStats(data: PumpDataPoint[]) {
    // Prepare return structure
    const result = {
      metrics: {
        averagePressure: 0,
        maxPressure: 0,
        minPressure: 0,
        anomalyCount: 0,
        brokenStateDuration: 0,
        anomalyFrequency: 0
      } as PumpMetrics,
      rollingStats: {
        mean: [] as RollingStatsPoint[],
        std: [] as RollingStatsPoint[]
      },
      brokenStates: [] as number[],
      anomalies: [] as number[]
    };
    
    if (!data.length) return result;
    
    // Extract pressure values
    const pressureValues = data.map(d => d.pressure);
    
    // Calculate basic metrics
    const sum = pressureValues.reduce((a, b) => a + b, 0);
    const mean = sum / pressureValues.length;
    const max = Math.max(...pressureValues);
    const min = Math.min(...pressureValues);
    
    // Calculate standard deviation
    const squaredDiffs = pressureValues.map(p => Math.pow(p - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(avgSquaredDiff);
    
    // Find broken states
    const brokenStateIndices = data.map((d, idx) => 
      d.machine_status === 'BROKEN' ? idx : -1
    ).filter(idx => idx !== -1);
    
    // Detect anomalies using z-score method
    const zScoreThreshold = 2.5;
    const anomalyIndices = data.map((d, idx) => {
      const zScore = Math.abs(d.pressure - mean) / stdDev;
      return zScore > zScoreThreshold ? idx : -1;
    }).filter(idx => idx !== -1);
    
    // Calculate rolling statistics
    const windowSize = Math.max(20, Math.floor(data.length / 50));
    const rollingMean: RollingStatsPoint[] = [];
    const rollingStd: RollingStatsPoint[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const windowStart = Math.max(0, i - windowSize);
      const window = data.slice(windowStart, i + 1);
      const windowValues = window.map(d => d.pressure);
      
      // Calculate window mean
      const windowSum = windowValues.reduce((a, b) => a + b, 0);
      const windowMean = windowSum / windowValues.length;
      
      // Calculate window std dev
      const windowSquaredDiffs = windowValues.map(p => Math.pow(p - windowMean, 2));
      const windowAvgSquaredDiff = windowSquaredDiffs.reduce((a, b) => a + b, 0) / windowSquaredDiffs.length;
      const windowStdDev = Math.sqrt(windowAvgSquaredDiff);
      
      rollingMean.push({
        timestamp: data[i].timestamp.toISOString(),
        value: Number(windowMean.toFixed(2))
      });
      
      rollingStd.push({
        timestamp: data[i].timestamp.toISOString(),
        value: Number(windowStdDev.toFixed(2))
      });
    }
    
    // Build result object
    result.metrics = {
      averagePressure: Number(mean.toFixed(2)),
      maxPressure: Number(max.toFixed(2)),
      minPressure: Number(min.toFixed(2)),
      anomalyCount: anomalyIndices.length,
      brokenStateDuration: brokenStateIndices.length,
      anomalyFrequency: Number(((anomalyIndices.length / data.length) * 100).toFixed(2))
    };
    
    result.rollingStats = {
      mean: rollingMean,
      std: rollingStd
    };
    
    result.brokenStates = brokenStateIndices;
    result.anomalies = anomalyIndices;
    
    return result;
  }
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!pumpData.length) return {
      labels: [],
      datasets: []
    };
    
    // Format timestamps as abbreviated dates (MM/DD) instead of time
    const labels = pumpData.map(row => {
      const date = new Date(row.timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}`; // MM/DD format
    });
    
    // Format pressure readings
    const pressureData = pumpData.map(row => row.pressure);
    
    // Format mean/std bands if available
    let meanData: (number | undefined)[] = [];
    let upperBandData: (number | undefined)[] = [];
    let lowerBandData: (number | undefined)[] = [];
    
    if (rollingStats.mean.length > 0 && rollingStats.std.length > 0) {
      meanData = rollingStats.mean.map(point => point.value);
      
      upperBandData = rollingStats.mean.map((mean, idx) => {
        const std = rollingStats.std[idx]?.value || 0;
        return mean.value + (2 * std);
      });
      
      lowerBandData = rollingStats.mean.map((mean, idx) => {
        const std = rollingStats.std[idx]?.value || 0;
        return mean.value - (2 * std);
      });
    }
    
    // Highlight anomalies in the chart
    const anomalyData = pumpData.map((_, idx) => {
      return anomalies.includes(idx) ? pressureData[idx] : undefined;
    });
    
    // Highlight broken states in the chart
    const brokenData = pumpData.map((_, idx) => {
      return brokenStates.includes(idx) ? pressureData[idx] : undefined;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Pressure',
          data: pressureData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          pointRadius: 0.5,
          borderWidth: 1
        },
        {
          label: 'Mean',
          data: meanData,
          borderColor: 'rgba(54, 162, 235, 0.8)',
          backgroundColor: 'transparent',
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 1,
          borderDash: [5, 5]
        },
        {
          label: 'Upper Band',
          data: upperBandData,
          borderColor: 'rgba(54, 162, 235, 0.3)',
          backgroundColor: 'transparent',
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 1,
          borderDash: [3, 3]
        },
        {
          label: 'Lower Band',
          data: lowerBandData,
          borderColor: 'rgba(54, 162, 235, 0.3)',
          backgroundColor: 'transparent',
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 1,
          borderDash: [3, 3]
        },
        {
          label: 'Anomalies',
          data: anomalyData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 1)',
          tension: 0,
          pointRadius: 4,
          pointStyle: 'rectRot',
          showLine: false
        },
        {
          label: 'Broken States',
          data: brokenData,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 1)',
          tension: 0,
          pointRadius: 0,
          showLine: false
        }
      ]
    };
  }, [pumpData, rollingStats, anomalies, brokenStates]);
  
  // Chart options
  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 0.8,
          to: 0.2,
          loop: false
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Pressure (PSI)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Pump Pressure Over Time'
        },
        tooltip: {
          callbacks: {
            title: function(context: any) {
              const idx = context[0].dataIndex;
              if (idx >= 0 && idx < pumpData.length) {
                const date = new Date(pumpData[idx].timestamp);
                return date.toLocaleString();
              }
              return '';
            }
          }
        }
      }
    };
  }, [pumpData]);
  
  // Debug button event handler
  const handleTestFetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Testing direct fetch from ${csvUrl}`);
      const response = await fetch(csvUrl);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`Success! First 100 chars: ${text.substring(0, 100)}`);
        alert(`File fetched successfully! Size: ${text.length} bytes`);
        
        // Process the data
        const results = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        
        const processedData = processRawData(results.data);
        
        if (processedData.length > 0) {
          setPumpData(processedData);
          setTimeRange([
            processedData[0].timestamp,
            processedData[processedData.length - 1].timestamp
          ]);
          
          // Run data analysis
          const statsData = calculateDataStats(processedData);
          setMetrics(statsData.metrics);
          setRollingStats(statsData.rollingStats);
          setBrokenStates(statsData.brokenStates);
          setAnomalies(statsData.anomalies);
        } else {
          setError('No valid data points found in the CSV');
        }
      } else {
        console.error(`Fetch failed: ${response.status} ${response.statusText}`);
        setError(`Fetch failed: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Replace Chart components with placeholder divs
  // In the render section where Line components are used:
  // Replace:
  // <Line data={chartData} options={chartOptions} />
  // With:
  // <div className="h-full w-full bg-gray-100 rounded flex items-center justify-center">
  //   <p className="text-gray-500">Chart will render here</p>
  // </div>

  // Replace anomaliesRef when anomalies changes
  useEffect(() => {
    if (typeof anomaliesRef?.current !== 'undefined') {
      anomaliesRef.current = anomalies;
    }
  }, [anomalies]);

  // Render component
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pump Pressure Monitoring Dashboard
        </h1>
        
        {/* Display loading state */}
        {isLoading && (
          <div className="flex items-center justify-center p-4 mb-6 bg-blue-50 rounded-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mr-3"></div>
            <p className="text-blue-700">Loading data...</p>
          </div>
        )}
        
        {/* Display error state */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 rounded-md border border-red-200">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Data</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleTestFetch}
              >
                Test Data Fetch
              </button>
              <button 
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        )}
        
        {/* Main dashboard content - stacked vertically */}
        {!error && (
          <div className="grid grid-cols-1 gap-6">
            {/* Metrics section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-600">Avg Pressure</p>
                  <p className="text-2xl font-bold text-blue-700">{metrics.averagePressure} PSI</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-600">Max Pressure</p>
                  <p className="text-2xl font-bold text-green-700">{metrics.maxPressure} PSI</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-sm text-purple-600">Min Pressure</p>
                  <p className="text-2xl font-bold text-purple-700">{metrics.minPressure} PSI</p>
                </div>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm text-red-600">Anomalies</p>
                  <p className="text-2xl font-bold text-red-700">{metrics.anomalyCount}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-md">
                  <p className="text-sm text-orange-600">Broken States</p>
                  <p className="text-2xl font-bold text-orange-700">{metrics.brokenStateDuration}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-sm text-yellow-600">Anomaly Rate</p>
                  <p className="text-2xl font-bold text-yellow-700">{metrics.anomalyFrequency}%</p>
                </div>
              </div>
              <div className="mt-2 text-right">
                <p className="text-xs text-gray-500">Data points: {pumpData.length}</p>
              </div>
            </div>
            
            {/* Chart section with anomaly regions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pressure Readings Over Time</h2>
              
              <div className="flex flex-wrap gap-2 justify-start text-xs mb-4">
                <p className="flex items-center">
                  <span className="w-4 h-0.5 inline-block bg-purple-500 mr-2"></span>
                  Pressure
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-3 inline-block bg-red-200 mr-2" style={{ border: '1px solid rgba(255, 150, 150, 0.9)' }}></span>
                  Anomaly Region
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-0.5 inline-block bg-green-500 mr-2"></span>
                  Rolling Mean
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-4 flex items-center justify-center mr-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  </span>
                  Anomaly
                </p>
              </div>
              
              <div className="h-[320px] mb-0">
                {pumpData.length > 0 ? (
                  <PressureChart
                    data={pumpData.map((point, idx) => ({
                      timestamp: point.timestamp,
                      pressure: point.pressure,
                      rollingMean: rollingStats.mean[idx]?.value ?? undefined
                    }))}
                    anomalies={anomalies}
                    minPressure={metrics.minPressure}
                    maxPressure={metrics.maxPressure}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}