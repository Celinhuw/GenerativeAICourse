import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseNinjaTraderCSV } from '@/utils/ninjatrader-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    // Read file content
    const fileContent = await file.text()

    // Parse NinjaTrader CSV
    const parsedTrades = parseNinjaTraderCSV(fileContent)

    if (parsedTrades.length === 0) {
      return NextResponse.json(
        { error: 'No valid trades found in CSV' },
        { status: 400 }
      )
    }

    // Get or create default account
    let account = await prisma.account.findFirst({
      where: { name: 'Default Account' },
    })

    if (!account) {
      account = await prisma.account.create({
        data: {
          name: 'Default Account',
          broker: 'NinjaTrader',
          initialBalance: 0,
          currentBalance: 0,
        },
      })
    }

    // Import trades
    const importedTrades = []
    for (const trade of parsedTrades) {
      // Determine win/loss status
      let winLoss: string | null = null
      if (trade.exitPrice !== null) {
        if (trade.netPnL > 0) {
          winLoss = 'WIN'
        } else if (trade.netPnL < 0) {
          winLoss = 'LOSS'
        } else {
          winLoss = 'BREAKEVEN'
        }
      }

      // Calculate R-multiple (placeholder - would need initial risk)
      const rMultiple = null // Would calculate based on stop loss if available

      const createdTrade = await prisma.trade.create({
        data: {
          accountId: account.id,
          symbol: trade.symbol,
          side: trade.side,
          quantity: trade.quantity,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          entryTime: trade.entryTime,
          exitTime: trade.exitTime,
          grossPnL: trade.grossPnL,
          commission: trade.commission,
          netPnL: trade.netPnL,
          winLoss,
          rMultiple,
          execution: trade.execution,
          ninjaTraderOrderId: trade.ninjaTraderOrderId,
        },
      })

      importedTrades.push(createdTrade)
    }

    // Update account balance
    const totalPnL = importedTrades.reduce((sum, t) => sum + t.netPnL, 0)
    await prisma.account.update({
      where: { id: account.id },
      data: {
        currentBalance: account.currentBalance + totalPnL,
      },
    })

    return NextResponse.json({
      success: true,
      count: importedTrades.length,
      message: `Successfully imported ${importedTrades.length} trades`,
    })
  } catch (error) {
    console.error('Error importing trades:', error)
    return NextResponse.json(
      { error: 'Failed to import trades', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
