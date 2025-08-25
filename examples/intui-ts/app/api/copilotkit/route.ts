import { CopilotRuntime } from "@copilotkit/react-core";

const runtime = new CopilotRuntime({
  actions: ({properties, url}) => {
    return [
      {
        name: "getCurrentTime",
        description: "Gets the current time.",
        parameters: [],
        handler: async () => {
          return new Date().toLocaleTimeString();
        },
      },
      {
        name: "analyzeData",
        description: "Analyzes the dashboard data and provides insights.",
        parameters: [],
        handler: async () => {
          return {
            summary: "Dashboard shows strong growth with $125K revenue and 36% profit margin",
            trends: "Revenue increasing month over month, strong customer acquisition",
            recommendations: "Focus on maintaining profit margins while scaling operations"
          };
        },
      },
    ]
  }
});

export const { GET, POST } = runtime.handler();
