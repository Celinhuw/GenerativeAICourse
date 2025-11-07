import { prisma } from '@/lib/prisma'
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Calendar } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
  const trades = await prisma.trade.findMany({
    orderBy: { entryTime: 'desc' },
    include: { account: true },
  })

  const totalTrades = trades.length
  const closedTrades = trades.filter(t => t.exitTime !== null)
  const openTrades = trades.filter(t => t.exitTime === null)

  const totalPnL = closedTrades.reduce((sum, t) => sum + t.netPnL, 0)
  const totalCommission = closedTrades.reduce((sum, t) => sum + t.commission, 0)

  const winningTrades = closedTrades.filter(t => t.netPnL > 0)
  const losingTrades = closedTrades.filter(t => t.netPnL < 0)
  const breakEvenTrades = closedTrades.filter(t => t.netPnL === 0)

  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0
  const averageWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.netPnL, 0) / winningTrades.length : 0
  const averageLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.netPnL, 0) / losingTrades.length) : 0
  const profitFactor = averageLoss > 0 ? (averageWin * winningTrades.length) / (averageLoss * losingTrades.length) : 0

  const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.netPnL)) : 0
  const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.netPnL)) : 0

  // Recent trades
  const recentTrades = trades.slice(0, 10)

  // P&L by day
  const pnlByDay: { [key: string]: number } = {}
  closedTrades.forEach(trade => {
    const day = trade.exitTime ? new Date(trade.exitTime).toISOString().split('T')[0] : ''
    if (day) {
      pnlByDay[day] = (pnlByDay[day] || 0) + trade.netPnL
    }
  })

  return {
    totalTrades,
    closedTrades: closedTrades.length,
    openTrades: openTrades.length,
    totalPnL,
    totalCommission,
    winRate,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    breakEvenTrades: breakEvenTrades.length,
    averageWin,
    averageLoss,
    profitFactor,
    largestWin,
    largestLoss,
    recentTrades,
    pnlByDay,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link
          href="/trades"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          View All Trades
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total P&L"
          value={`$${data.totalPnL.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend={data.totalPnL >= 0 ? 'up' : 'down'}
          className={data.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <MetricCard
          title="Win Rate"
          value={`${data.winRate.toFixed(1)}%`}
          icon={<Target className="w-6 h-6" />}
          subtitle={`${data.winningTrades}W / ${data.losingTrades}L`}
        />
        <MetricCard
          title="Total Trades"
          value={data.totalTrades.toString()}
          icon={<BarChart3 className="w-6 h-6" />}
          subtitle={`${data.closedTrades} closed, ${data.openTrades} open`}
        />
        <MetricCard
          title="Profit Factor"
          value={data.profitFactor.toFixed(2)}
          icon={<TrendingUp className="w-6 h-6" />}
          className={data.profitFactor >= 1.5 ? 'text-green-600' : data.profitFactor >= 1 ? 'text-yellow-600' : 'text-red-600'}
        />
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Breakdown
          </h2>
          <div className="space-y-3">
            <StatRow label="Average Win" value={`$${data.averageWin.toFixed(2)}`} positive />
            <StatRow label="Average Loss" value={`$${data.averageLoss.toFixed(2)}`} negative />
            <StatRow label="Largest Win" value={`$${data.largestWin.toFixed(2)}`} positive />
            <StatRow label="Largest Loss" value={`$${data.largestLoss.toFixed(2)}`} negative />
            <StatRow label="Total Commission" value={`$${data.totalCommission.toFixed(2)}`} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Trade Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Winning Trades</span>
                <span className="text-sm font-medium text-green-600">{data.winningTrades}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${data.closedTrades > 0 ? (data.winningTrades / data.closedTrades) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Losing Trades</span>
                <span className="text-sm font-medium text-red-600">{data.losingTrades}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${data.closedTrades > 0 ? (data.losingTrades / data.closedTrades) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Break-Even Trades</span>
                <span className="text-sm font-medium text-gray-600">{data.breakEvenTrades}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-gray-600 h-2.5 rounded-full"
                  style={{ width: `${data.closedTrades > 0 ? (data.breakEvenTrades / data.closedTrades) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Trades
        </h2>
        {data.recentTrades.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No trades yet</p>
            <Link
              href="/import"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition inline-block"
            >
              Import Trades
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Side
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Entry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Exit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.recentTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {trade.symbol}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.side === 'LONG'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      ${trade.entryPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <span className={trade.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${trade.netPnL.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {trade.exitTime ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.netPnL > 0
                            ? 'bg-green-100 text-green-800'
                            : trade.netPnL < 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trade.winLoss}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          OPEN
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  className = 'text-primary-600',
}: {
  title: string
  value: string
  icon: React.ReactNode
  subtitle?: string
  trend?: 'up' | 'down'
  className?: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={className}>{icon}</div>
        {trend && (
          <div className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${className}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}

function StatRow({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-semibold ${
        positive ? 'text-green-600' : negative ? 'text-red-600' : 'text-gray-900 dark:text-white'
      }`}>
        {value}
      </span>
    </div>
  )
}
