import Papa from 'papaparse'

export interface NinjaTraderRow {
  Instrument?: string
  'Entry time'?: string
  'Exit time'?: string
  'Entry price'?: string
  'Exit price'?: string
  Quantity?: string
  'Market pos.'?: string
  Profit?: string
  Commission?: string
  // Alternative field names (NinjaTrader can have different formats)
  Symbol?: string
  'Entry Time'?: string
  'Exit Time'?: string
  'Avg Entry Price'?: string
  'Avg Exit Price'?: string
  'Qty'?: string
  'Market Position'?: string
  'Gross Profit'?: string
  'Net Profit'?: string
  'Trade #'?: string
  'Execution'?: string
  'Entry Price'?: string
  'Exit Price'?: string
  'Trade P/L'?: string
  'Cum. Profit'?: string
}

export interface ParsedTrade {
  symbol: string
  side: 'LONG' | 'SHORT'
  quantity: number
  entryPrice: number
  exitPrice: number | null
  entryTime: Date
  exitTime: Date | null
  grossPnL: number
  commission: number
  netPnL: number
  execution?: string
  ninjaTraderOrderId?: string
}

function normalizeFieldName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findFieldValue(row: NinjaTraderRow, fieldNames: string[]): string | undefined {
  // Try exact match first
  for (const fieldName of fieldNames) {
    if (row[fieldName as keyof NinjaTraderRow]) {
      return row[fieldName as keyof NinjaTraderRow]
    }
  }

  // Try normalized match
  const normalizedFields = Object.keys(row).reduce((acc, key) => {
    acc[normalizeFieldName(key)] = row[key as keyof NinjaTraderRow]
    return acc
  }, {} as Record<string, string | undefined>)

  for (const fieldName of fieldNames) {
    const normalized = normalizeFieldName(fieldName)
    if (normalizedFields[normalized]) {
      return normalizedFields[normalized]
    }
  }

  return undefined
}

export function parseNinjaTraderCSV(csvContent: string): ParsedTrade[] {
  const parseResult = Papa.parse<NinjaTraderRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  if (parseResult.errors.length > 0) {
    console.error('CSV parsing errors:', parseResult.errors)
  }

  const trades: ParsedTrade[] = []

  for (const row of parseResult.data) {
    try {
      // Extract fields with multiple possible names
      const symbol = findFieldValue(row, ['Instrument', 'Symbol', 'instrument', 'symbol'])
      const entryTimeStr = findFieldValue(row, ['Entry time', 'Entry Time', 'EntryTime', 'entry time'])
      const exitTimeStr = findFieldValue(row, ['Exit time', 'Exit Time', 'ExitTime', 'exit time'])
      const entryPriceStr = findFieldValue(row, ['Entry price', 'Entry Price', 'Avg Entry Price', 'entry price'])
      const exitPriceStr = findFieldValue(row, ['Exit price', 'Exit Price', 'Avg Exit Price', 'exit price'])
      const quantityStr = findFieldValue(row, ['Quantity', 'Qty', 'quantity', 'qty'])
      const marketPos = findFieldValue(row, ['Market pos.', 'Market Position', 'market position', 'Side', 'side'])
      const profitStr = findFieldValue(row, ['Profit', 'Gross Profit', 'Trade P/L', 'profit', 'P/L'])
      const netProfitStr = findFieldValue(row, ['Net Profit', 'net profit'])
      const commissionStr = findFieldValue(row, ['Commission', 'commission', 'Fees', 'fees'])
      const executionStr = findFieldValue(row, ['Execution', 'execution', 'Order Type'])
      const tradeIdStr = findFieldValue(row, ['Trade #', 'Trade ID', 'Order ID'])

      if (!symbol || !entryTimeStr || !entryPriceStr || !quantityStr) {
        console.warn('Skipping row - missing required fields:', row)
        continue
      }

      const entryTime = new Date(entryTimeStr)
      const exitTime = exitTimeStr ? new Date(exitTimeStr) : null
      const entryPrice = parseFloat(entryPriceStr.replace(/[^0-9.-]/g, ''))
      const exitPrice = exitPriceStr ? parseFloat(exitPriceStr.replace(/[^0-9.-]/g, '')) : null
      const quantity = parseFloat(quantityStr.replace(/[^0-9.-]/g, ''))

      // Determine side (LONG or SHORT)
      let side: 'LONG' | 'SHORT' = 'LONG'
      if (marketPos) {
        const posLower = marketPos.toLowerCase()
        if (posLower.includes('short') || posLower.includes('sell')) {
          side = 'SHORT'
        }
      }

      // Calculate P&L
      let grossPnL = 0
      let netPnL = 0
      let commission = 0

      if (profitStr) {
        grossPnL = parseFloat(profitStr.replace(/[^0-9.-]/g, ''))
      } else if (exitPrice) {
        // Calculate from prices
        if (side === 'LONG') {
          grossPnL = (exitPrice - entryPrice) * quantity
        } else {
          grossPnL = (entryPrice - exitPrice) * quantity
        }
      }

      if (commissionStr) {
        commission = Math.abs(parseFloat(commissionStr.replace(/[^0-9.-]/g, '')))
      }

      if (netProfitStr) {
        netPnL = parseFloat(netProfitStr.replace(/[^0-9.-]/g, ''))
      } else {
        netPnL = grossPnL - commission
      }

      trades.push({
        symbol,
        side,
        quantity,
        entryPrice,
        exitPrice,
        entryTime,
        exitTime,
        grossPnL,
        commission,
        netPnL,
        execution: executionStr,
        ninjaTraderOrderId: tradeIdStr,
      })
    } catch (error) {
      console.error('Error parsing trade row:', error, row)
    }
  }

  return trades
}
