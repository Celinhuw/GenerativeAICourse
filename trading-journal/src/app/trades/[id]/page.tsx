import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { notFound } from 'next/navigation'

async function getTrade(id: string) {
  const trade = await prisma.trade.findUnique({
    where: { id },
    include: {
      account: true,
      tags: true,
      screenshots: true,
    },
  })
  return trade
}

export default async function TradeDetailPage({ params }: { params: { id: string } }) {
  const trade = await getTrade(params.id)

  if (!trade) {
    notFound()
  }

  const duration = trade.exitTime
    ? Math.round((new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) / (1000 * 60))
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/trades"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {trade.symbol} - {trade.side}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {format(new Date(trade.entryTime), 'MMMM dd, yyyy • HH:mm')}
            </p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${
          trade.netPnL > 0 ? 'text-green-600' : trade.netPnL < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          ${trade.netPnL.toFixed(2)}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        {trade.exitTime ? (
          <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
            trade.winLoss === 'WIN'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : trade.winLoss === 'LOSS'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {trade.winLoss}
          </span>
        ) : (
          <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            OPEN POSITION
          </span>
        )}
        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
          trade.side === 'LONG'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {trade.side}
        </span>
        {trade.tags.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
            style={{ backgroundColor: tag.color + '20', color: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Trade Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DetailCard
          title="Entry Price"
          value={`$${trade.entryPrice.toFixed(2)}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <DetailCard
          title="Exit Price"
          value={trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : 'Not Closed'}
          icon={<TrendingDown className="w-5 h-5" />}
        />
        <DetailCard
          title="Quantity"
          value={trade.quantity.toString()}
        />
        <DetailCard
          title="Gross P&L"
          value={`$${trade.grossPnL.toFixed(2)}`}
          valueClassName={trade.grossPnL >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <DetailCard
          title="Commission"
          value={`$${trade.commission.toFixed(2)}`}
          valueClassName="text-red-600"
        />
        <DetailCard
          title="Net P&L"
          value={`$${trade.netPnL.toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5" />}
          valueClassName={trade.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      {/* Timing Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Timing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Entry Time</div>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {format(new Date(trade.entryTime), 'MMMM dd, yyyy')}
              <span className="text-sm text-gray-500 ml-2">
                {format(new Date(trade.entryTime), 'HH:mm:ss')}
              </span>
            </div>
          </div>
          {trade.exitTime && (
            <>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Exit Time</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {format(new Date(trade.exitTime), 'MMMM dd, yyyy')}
                  <span className="text-sm text-gray-500 ml-2">
                    {format(new Date(trade.exitTime), 'HH:mm:ss')}
                  </span>
                </div>
              </div>
              {duration !== null && (
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {duration < 60
                      ? `${duration} minutes`
                      : duration < 1440
                      ? `${Math.floor(duration / 60)}h ${duration % 60}m`
                      : `${Math.floor(duration / 1440)}d ${Math.floor((duration % 1440) / 60)}h`
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Strategy & Setup */}
      {(trade.strategy || trade.setup || trade.timeframe) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Strategy & Setup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trade.strategy && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Strategy</div>
                <div className="text-base text-gray-900 dark:text-white">{trade.strategy}</div>
              </div>
            )}
            {trade.setup && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Setup</div>
                <div className="text-base text-gray-900 dark:text-white">{trade.setup}</div>
              </div>
            )}
            {trade.timeframe && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timeframe</div>
                <div className="text-base text-gray-900 dark:text-white">{trade.timeframe}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {trade.notes && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Trade Notes
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{trade.notes}</p>
        </div>
      )}

      {/* Mistakes & Lessons */}
      {(trade.mistakes || trade.lessonsLearned) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trade.mistakes && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-4">
                Mistakes
              </h2>
              <p className="text-red-800 dark:text-red-300 whitespace-pre-wrap">{trade.mistakes}</p>
            </div>
          )}
          {trade.lessonsLearned && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4">
                Lessons Learned
              </h2>
              <p className="text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{trade.lessonsLearned}</p>
            </div>
          )}
        </div>
      )}

      {/* Account Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account</div>
            <div className="text-base font-medium text-gray-900 dark:text-white">{trade.account.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Broker</div>
            <div className="text-base text-gray-900 dark:text-white">{trade.account.broker}</div>
          </div>
          {trade.execution && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Execution</div>
              <div className="text-base text-gray-900 dark:text-white">{trade.execution}</div>
            </div>
          )}
          {trade.ninjaTraderOrderId && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order ID</div>
              <div className="text-base text-gray-900 dark:text-white font-mono text-sm">
                {trade.ninjaTraderOrderId}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailCard({
  title,
  value,
  icon,
  valueClassName = 'text-gray-900 dark:text-white',
}: {
  title: string
  value: string
  icon?: React.ReactNode
  valueClassName?: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-primary-600 dark:text-primary-400">{icon}</div>}
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  )
}
