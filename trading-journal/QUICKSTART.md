# Quick Start Guide

Get TradeJournal Pro running in 5 minutes!

## Step 1: Navigate to the Project

```bash
cd trading-journal
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up the Database

The Prisma database setup might require an environment variable due to network restrictions:

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
npm run db:push
```

Alternatively, if you encounter issues:
```bash
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npm run db:generate
npm run db:push
```

## Step 4: Start the Development Server

```bash
npm run dev
```

## Step 5: Open the App

Open your browser and go to:
```
http://localhost:3000
```

## Step 6: Import Sample Data (Optional)

1. Go to the Import page: http://localhost:3000/import
2. Upload the sample CSV file located at `sample-data/sample-ninjatrader-export.csv`
3. Click "Import Trades"
4. Navigate to the Dashboard to see your imported trades!

## Troubleshooting

### Prisma Engine Download Issues

If you get errors about downloading Prisma engines:

```bash
# Set the environment variable and try again
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npm run db:generate
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
npm run dev -- -p 3001
```

Then open http://localhost:3001

### Database Issues

If you need to reset the database:

```bash
# Delete the database file
rm prisma/dev.db

# Recreate it
npm run db:push
```

## Next Steps

1. **Import Your Trades**: Upload your NinjaTrader CSV exports
2. **View Dashboard**: Check your trading statistics
3. **Explore Trades**: Review individual trade details
4. **Analyze Performance**: Visit the Analytics page for charts
5. **Add Notes**: Enhance trades with notes, tags, and insights

## Key Pages

- **Home**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Import**: http://localhost:3000/import
- **Trades**: http://localhost:3000/trades
- **Analytics**: http://localhost:3000/analytics

## Database Management

View and edit your database directly:

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555

Enjoy tracking your trades! 📊
