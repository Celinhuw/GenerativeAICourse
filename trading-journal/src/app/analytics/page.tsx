'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsData {
  totalTrades: number
  winRate: number
  profitFactor: number
  avgWin: number
  avgLoss: number
  pnlByDay: { date: string; pnl: number }[]
  pnlBySymbol: { symbol: string; pnl: number; trades: number }[]
  winLossDistribution: { name: string; value: number }[]
  cumulativePnL: { date: string; cumulative: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API endpoint
    // For now, we'll use placeholder data
    setData({
      totalTrades: 0,
      winRate: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      pnlByDay: [],
      pnlBySymbol: [],
      winLossDistribution: [
        { name: 'Wins', value: 0 },
        { name: 'Losses', value: 0 },
        { name: 'Break-even', value: 0 },
      ],
      cumulativePnL: [],
    })
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  if (!data || data.totalTrades === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No trades available for analysis
          </p>
          <a
            href="/import"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition inline-block"
          >
            Import Trades
          </a>
        </div>
      </div>
    )
  }

  const COLORS = ['#10b981', '#ef4444', '#6b7280']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Trades" value={data.totalTrades.toString()} />
        <MetricCard title="Win Rate" value={`${data.winRate.toFixed(1)}%`} />
        <MetricCard title="Profit Factor" value={data.profitFactor.toFixed(2)} />
        <MetricCard
          title="Avg Win / Loss"
          value={`$${data.avgWin.toFixed(0)} / $${data.avgLoss.toFixed(0)}`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative P&L */}
        {data.cumulativePnL.length > 0 && (
          <ChartCard title="Cumulative P&L">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.cumulativePnL}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Cumulative P&L"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Win/Loss Distribution */}
        <ChartCard title="Win/Loss Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.winLossDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.winLossDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* P&L by Day */}
        {data.pnlByDay.length > 0 && (
          <ChartCard title="Daily P&L">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.pnlByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="pnl" name="P&L" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* P&L by Symbol */}
        {data.pnlBySymbol.length > 0 && (
          <ChartCard title="P&L by Symbol">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.pnlBySymbol}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="symbol" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="pnl" name="P&L" fill="#8b5cf6" />
                <Bar dataKey="trades" name="Trades" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InsightCard
            title="Best Performing Symbol"
            description="Track which instruments are most profitable"
            status="Import more trades to see insights"
          />
          <InsightCard
            title="Optimal Trading Times"
            description="Identify your most successful trading hours"
            status="Import more trades to see insights"
          />
          <InsightCard
            title="Strategy Effectiveness"
            description="Compare performance across different strategies"
            status="Add strategy tags to your trades"
          />
          <InsightCard
            title="Risk Management"
            description="Track your risk-reward ratios and position sizing"
            status="Add stop loss and target data"
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}

function InsightCard({
  title,
  description,
  status,
}: {
  title: string
  description: string
  status: string
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 italic">{status}</p>
    </div>
  )
}
