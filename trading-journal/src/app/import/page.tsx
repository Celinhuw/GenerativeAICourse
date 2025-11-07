'use client'

import { useState } from 'react'
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/import/ninjatrader', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully imported ${data.count} trades`,
          count: data.count,
        })
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to import trades',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred while importing trades',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Import Trades from NinjaTrader
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          How to Export from NinjaTrader
        </h2>
        <ol className="space-y-2 text-gray-700 dark:text-gray-300 list-decimal list-inside">
          <li>Open NinjaTrader and go to the Control Center</li>
          <li>Click on "Tools" → "Trade Performance" or "Account Performance"</li>
          <li>Select the date range for your trades</li>
          <li>Click "Export" and save as CSV</li>
          <li>Upload the CSV file below</li>
        </ol>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select CSV File
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  NinjaTrader CSV file
                </p>
                {file && (
                  <p className="mt-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {result && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${
              result.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}
          >
            {result.success ? (
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span>{result.message}</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Import Trades
            </>
          )}
        </button>
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          📝 Note
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          The importer will automatically parse your NinjaTrader trades and calculate P&L metrics.
          You can add notes, tags, and screenshots to your trades after importing.
        </p>
      </div>
    </div>
  )
}
