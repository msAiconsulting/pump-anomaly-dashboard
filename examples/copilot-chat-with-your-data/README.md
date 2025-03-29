# Pump Data Analysis Dashboard with AI Assistant

A powerful, interactive dashboard for pump pressure data visualization and analysis, powered by an AI assistant that can answer questions about your data.

![Screenshot of Dashboard](public/assets/intuigence.png)

## Features

- 📊 **Interactive Pressure Data Visualization**: View time series data with anomaly detection
- 🤖 **AI-Powered Data Assistant**: Ask questions about your data in natural language
- 📈 **Real-time Analytics**: Key metrics and insights at a glance
- 🔍 **Anomaly Detection**: Automatically identify unusual patterns in pressure data
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.2 (with App Router)
- **UI Framework**: [React](https://reactjs.org/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Charts**: [Recharts](https://recharts.org/) 2.15
- **AI Integration**: [CopilotKit](https://copilotkit.ai/) 1.8.3
- **Form Handling**: React Hook Form with Zod validation
- **Components**: Custom UI components with shadcn/ui design system
- **Date Handling**: date-fns
- **CSV Parsing**: PapaParse

## Requirements

- Node.js 18+ (LTS recommended)
- pnpm (recommended) or npm
- Modern browser (Chrome, Firefox, Safari, Edge)

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd copilot-chat-with-your-data
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
```

4. **Run the development server**

```bash
pnpm dev
# or
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Sample Questions for the Pump Data Assistant

Use these sample questions to test the AI assistant's capabilities with the pump data:

### GENERAL ANALYSIS
- What is the average pressure across all pumps?
- Show me the pressure trend for pump 3
- Which pump has the most anomalies?

### TEMPORAL ANALYSIS
- Can you tell me the time period of the failures?
- What's the statistical distribution of anomalies across different operational shifts or time periods?
- Are there correlations between ambient conditions (time of day, external temperature) and the frequency of anomalies?

### PRESSURE BEHAVIOR ANALYSIS
- What were the pressure fluctuations just before the anomalies were detected?
- What is the average PSI range during normal operation versus during anomalous periods?
- Is there evidence of pressure pulsation that might indicate issues with the pump impeller or valve chatter?
- How do the pressure readings compare to the manufacturer's specified operating ranges?

### PATTERN RECOGNITION
- Are there any cyclic patterns in the pressure data that might indicate cavitation issues?
- What are the common precursor patterns observed before major pressure excursions?
- Can you extract the frequency characteristics of the pressure oscillations to help identify potential resonance issues?

### CORRELATION & CAUSATION
- Can you identify any correlation between pressure drops and subsequent equipment failures?
- Can you compare the behavior of multiple sensors during the same anomaly events to determine if failures cascade through the system?
- Do any of the anomalies correspond with known maintenance activities or process changes?
- Can you identify any temperature-related variables that might be contributing to the pressure anomalies?
- Do the anomalies appear to be more related to mechanical issues (sudden changes) or operational issues (gradual drift)?

### EARLY WARNING & PREDICTION
- What's the rate of pressure decline before failure events? This could help establish early warning thresholds.
- Which sensor shows the earliest indication of abnormal behavior before a complete failure?
- What would be appropriate alarm thresholds based on the historical anomaly patterns?
- Can you create a failure mode prediction model based on the observed patterns in this dataset?

## Project Structure

```
├── app/               # Next.js app router files
├── components/        # React components
│   ├── ui/            # UI components
│   └── Dashboard.tsx  # Main dashboard component
├── public/            # Static assets
│   └── pump_data/     # Pump sensor CSV data
├── lib/               # Utility functions
├── models/            # ML models for anomaly detection
└── archive/           # Sample questions and backups
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 