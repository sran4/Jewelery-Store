"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DiagnosticTest {
  name: string;
  status: string;
  details: any;
}

interface DiagnosticResult {
  timestamp: string;
  tests: DiagnosticTest[];
  summary: string;
  recommendation: string;
  error?: any;
}

export default function DiagnosticsPage() {
  const [results, setResults] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diagnostic/cloudinary");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Diagnostic failed:", error);
      setResults({
        timestamp: new Date().toISOString(),
        tests: [],
        summary: "Failed to run diagnostics",
        recommendation: "Check console for errors",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes("✅") || status.includes("PASSED")) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (status.includes("❌") || status.includes("FAILED")) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (status.includes("⚠️") || status.includes("WARNING")) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Diagnostics</h1>
          <p className="text-muted-foreground mt-2">
            Run comprehensive tests to diagnose Cloudinary integration issues
          </p>
        </div>
        <Button
          onClick={runDiagnostics}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Running Tests..." : "Run Diagnostics"}
        </Button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Summary</h2>
                <p className="text-lg mb-4">{results.summary}</p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    💡 Recommendation
                  </h3>
                  <p className="text-sm">{results.recommendation}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(results.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Test Results</h2>
            {results.tests.map((test, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="text-lg font-semibold">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">{test.status}</p>
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* Error Details */}
          {results.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                Error Details
              </h2>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(results.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="bg-card p-12 rounded-lg border border-border text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Ready to Diagnose</h3>
          <p className="text-muted-foreground mb-6">
            Click the "Run Diagnostics" button above to start testing your
            Cloudinary integration
          </p>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>This will test:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Environment variables configuration</li>
              <li>Cloudinary API connection</li>
              <li>Account status and plan details</li>
              <li>Usage and quota limits</li>
              <li>Actual upload functionality</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

