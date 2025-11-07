import Link from 'next/link'
import { TrendingUp, FileUp, BarChart3, Calendar } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to TradeJournal Pro
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Professional trading journal with NinjaTrader integration and advanced analytics
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/import"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Import Trades
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<FileUp className="w-8 h-8" />}
          title="NinjaTrader Import"
          description="Seamlessly import your trades from NinjaTrader CSV exports"
          href="/import"
        />
        <FeatureCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Performance Tracking"
          description="Track your P&L, win rate, and performance metrics"
          href="/dashboard"
        />
        <FeatureCard
          icon={<BarChart3 className="w-8 h-8" />}
          title="Advanced Analytics"
          description="Deep insights into your trading patterns and strategies"
          href="/analytics"
        />
        <FeatureCard
          icon={<Calendar className="w-8 h-8" />}
          title="Trade Calendar"
          description="Visualize your trades on a calendar view"
          href="/trades"
        />
      </div>

      {/* Getting Started */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Getting Started
        </h2>
        <ol className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              1
            </span>
            <span>Export your trades from NinjaTrader as a CSV file</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </span>
            <span>Go to the Import page and upload your CSV file</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              3
            </span>
            <span>Review your trades and add notes, tags, and screenshots</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              4
            </span>
            <span>Analyze your performance with detailed metrics and charts</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition group"
    >
      <div className="text-primary-600 dark:text-primary-400 mb-3 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </Link>
  )
}
