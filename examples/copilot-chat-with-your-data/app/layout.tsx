import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pump Failure Dashboard",
  description: "AI-powered pump anomaly detection and monitoring dashboard",
  keywords: ["pump monitoring", "anomaly detection", "AI dashboard", "industrial IoT", "predictive maintenance"],
  authors: [{ name: "msAi Consulting" }],
  creator: "msAi Consulting",
  publisher: "msAi Consulting",
  robots: "index, follow",
  openGraph: {
    title: "Pump Failure Dashboard",
    description: "AI-powered pump anomaly detection and monitoring dashboard",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pump Failure Dashboard",
    description: "AI-powered pump anomaly detection and monitoring dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CopilotKit 
          runtimeUrl="/api/copilotkit"
          showDevConsole={false}
        >
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
