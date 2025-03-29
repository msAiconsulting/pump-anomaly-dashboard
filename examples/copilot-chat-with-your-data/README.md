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

## Sample Questions for the AI Assistant

The AI assistant can answer questions about the pump data. Here are some examples:

1. What is the average pressure across all pumps?
2. Show me the pressure trend for pump 3
3. Which pump has the most anomalies?
4. When did pump 2 have its highest pressure reading?
5. Compare the performance of pump 1 and pump 4
6. Identify periods of unusual pressure fluctuations
7. What time of day do pressure anomalies typically occur?
8. Has any pump shown signs of failure?
9. What's the correlation between pressure and time of day?
10. Predict when pump 5 might need maintenance

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