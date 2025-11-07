# TradeJournal Pro

A professional trading journal application with NinjaTrader integration and advanced analytics. Track, analyze, and improve your trading performance with comprehensive statistics, charts, and insights.

![TradeJournal Pro](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748)

## Features

### 📊 Core Features
- **NinjaTrader Integration**: Seamlessly import trades from NinjaTrader CSV exports
- **Comprehensive Dashboard**: Real-time statistics including P&L, win rate, profit factor, and more
- **Trade Management**: View, search, and filter all your trades with detailed information
- **Performance Analytics**: Advanced charts and visualizations of your trading performance
- **Trade Journal**: Add notes, tags, screenshots, and lessons learned to each trade
- **Multi-Account Support**: Track trades across multiple trading accounts

### 📈 Analytics & Metrics
- Total P&L tracking
- Win rate calculation
- Profit factor analysis
- Average win/loss metrics
- Largest win/loss tracking
- Commission tracking
- Daily P&L charts
- Cumulative P&L visualization
- Performance by symbol
- Win/Loss distribution

### 🎯 Trading Features
- Support for LONG and SHORT positions
- Multiple execution types (Market, Limit, Stop, etc.)
- Trade timing analysis
- Duration tracking
- Strategy and setup categorization
- Custom tags and labels
- Trade notes and journaling
- Mistake tracking and lessons learned

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd trading-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma Client (may require setting PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1)
   npm run db:generate

   # Create the database
   npm run db:push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Importing Trades from NinjaTrader

1. **Export from NinjaTrader**:
   - Open NinjaTrader Control Center
   - Go to Tools → Trade Performance
   - Select your date range
   - Click Export and save as CSV

2. **Import to TradeJournal Pro**:
   - Navigate to the Import page
   - Click or drag your CSV file
   - Click "Import Trades"
   - Your trades will be automatically parsed and saved

### Supported NinjaTrader CSV Fields

The importer automatically detects and maps the following fields:

- **Symbol/Instrument**: Trading instrument
- **Entry Time/Entry time**: When the position was opened
- **Exit Time/Exit time**: When the position was closed
- **Entry Price/Avg Entry Price**: Entry price
- **Exit Price/Avg Exit Price**: Exit price
- **Quantity/Qty**: Position size
- **Market Position/Side**: LONG or SHORT
- **Profit/Trade P/L**: Gross profit/loss
- **Commission/Fees**: Trading fees
- **Execution/Order Type**: Order execution type

### Adding Trade Notes

1. Navigate to the Trades page
2. Click on any trade to view details
3. Add notes, tags, and insights
4. Track mistakes and lessons learned

### Viewing Analytics

- **Dashboard**: Quick overview of your trading performance
- **Analytics Page**: Detailed charts and performance breakdowns
- **Trade List**: Filter and sort trades by various criteria

## Database Schema

### Account
- Account information (name, broker, balance)

### Trade
- Complete trade details (entry/exit, P&L, timing)
- Links to account, tags, and screenshots

### Tag
- Custom labels for categorizing trades

### Screenshot
- Trade chart images and annotations

## Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)
```

## Project Structure

```
trading-journal/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── import/        # Import API endpoints
│   │   ├── dashboard/         # Dashboard page
│   │   ├── trades/            # Trades list and detail pages
│   │   ├── import/            # Import page
│   │   ├── analytics/         # Analytics page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   └── prisma.ts          # Prisma client
│   └── utils/
│       └── ninjatrader-parser.ts  # CSV parser
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Features Roadmap

- [ ] Trade editing and deletion
- [ ] Screenshot upload and management
- [ ] Custom strategy templates
- [ ] Risk-reward ratio calculations
- [ ] Export reports to PDF
- [ ] Multiple account comparison
- [ ] Advanced filtering and search
- [ ] Mobile responsive design improvements
- [ ] Dark mode toggle
- [ ] Real-time trade tracking
- [ ] Integration with other platforms (TradingView, MetaTrader, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

- Inspired by Tradezella
- Built with Next.js and Prisma
- Icons by Lucide
- Charts by Recharts

---

**Happy Trading! 📈**
