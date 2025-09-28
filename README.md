# GoldenWhales TWAP Service

A sophisticated Time-Weighted Average Price (TWAP) trading service that enables automated, strategic order execution across decentralized exchanges. Built for ETHDelhi hackathon, this service provides intelligent order splitting and execution scheduling to minimize market impact and optimize trade execution.

## 🚀 Overview

GoldenWhales TWAP Service breaks down large orders into smaller, time-distributed executions to achieve better average prices while reducing market slippage. The service integrates with 1inch's Limit Order Protocol to execute trades across multiple DEXs.

### Key Features

- **Intelligent Order Splitting**: Automatically divides large orders into smaller chunks with randomized amounts
- **Time-Based Execution**: Distributes trades over configurable time intervals to minimize market impact
- **Multi-Chain Support**: Compatible with various EVM-compatible chains
- **1inch Integration**: Leverages 1inch's Limit Order SDK for optimal trade execution
- **Persistent Storage**: Uses Supabase for reliable order and execution tracking
- **RESTful API**: Clean API endpoints for order management and execution monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│  GoldenWhales API  │───▶│   1inch SDK     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                          │
                              ▼                          ▼
                       ┌──────────────┐         ┌─────────────────┐
                       │   Supabase   │         │      DEXs       │
                       │   Database   │         │ (Uniswap, etc.) │
                       └──────────────┘         └─────────────────┘
```

### Core Components

- **Order Management**: Create, track, and manage TWAP orders
- **Execution Engine**: Automated execution of order splits based on time schedules
- **Database Layer**: Persistent storage for orders and execution history
- **Integration Layer**: Seamless connection with 1inch for trade execution

## 🛠️ Technology Stack

- **Backend**: Node.js with TypeScript and Express.js
- **Database**: Supabase (PostgreSQL)
- **Blockchain Integration**: Viem for Web3 interactions
- **DEX Integration**: 1inch Limit Order SDK
- **Development**: Nodemon for hot reloading

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project
- 1inch API key
- Ethereum wallet private key for order signing

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/goldenWhales-service.git
   cd goldenWhales-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ONE_INCH_API_KEY=your_1inch_api_key
   PRIVATE_KEY=your_wallet_private_key
   TOTAL_TRADES=10
   ```

4. **Database Setup**
   Set up your Supabase database with the following tables:
   
   **Order Table**:
   ```sql
   CREATE TABLE "Order" (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     created_at TIMESTAMP DEFAULT NOW(),
     signature TEXT NOT NULL,
     chain_id INTEGER NOT NULL,
     amount_0 TEXT NOT NULL,
     amount_1 TEXT NOT NULL,
     total_trades INTEGER,
     interval INTEGER,
     max_interval INTEGER,
     address TEXT NOT NULL,
     currency_0 TEXT NOT NULL,
     currency_1 TEXT NOT NULL,
     status TEXT DEFAULT 'NEW'
   );
   ```

   **Execution Table**:
   ```sql
   CREATE TABLE "Execution" (
     id SERIAL PRIMARY KEY,
     order_id UUID REFERENCES "Order"(id),
     chain_id INTEGER NOT NULL,
     amount_0 TEXT NOT NULL,
     amount_1 TEXT NOT NULL,
     start_time TIMESTAMP NOT NULL,
     address TEXT NOT NULL,
     currency_0 TEXT NOT NULL,
     currency_1 TEXT NOT NULL,
     signature TEXT NOT NULL,
     status TEXT DEFAULT 'PENDING'
   );
   ```

## 🚀 Usage

### Starting the Service

**Development Mode**:
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The service will start on `http://localhost:8000` (or your configured PORT).

### API Endpoints

#### Create TWAP Order
```http
POST /order
Content-Type: application/json

{
  "id": "unique-order-id",
  "signature": "0x...",
  "chain_id": 1,
  "amount_0": "1000000000000000000",
  "amount_1": "2000000000000000000",
  "total_trades": 5,
  "interval": 60,
  "max_interval": 300,
  "address": "0x...",
  "currency_0": "0x...",
  "currency_1": "0x...",
  "status": "NEW"
}
```

#### Get Orders
```http
GET /order/:chain_id/:address/:is_open
```

Parameters:
- `chain_id`: Blockchain network ID
- `address`: Wallet address
- `is_open`: `true` for active orders, `false` for all orders

#### Execute Pending Orders
```http
POST /resolve
```

This endpoint processes all pending executions that are due for execution.

### Order Execution Flow

1. **Order Creation**: Client submits a TWAP order with total amount and execution parameters
2. **Order Splitting**: Service automatically splits the order into smaller chunks with randomized amounts
3. **Execution Scheduling**: Each chunk is scheduled for execution at calculated intervals
4. **Automated Execution**: Background process monitors and executes pending orders via 1inch
5. **Status Tracking**: Real-time status updates for orders and individual executions

## 📊 Order Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount_0` | string | Amount of token to sell (in wei) |
| `amount_1` | string | Expected amount of token to receive (in wei) |
| `total_trades` | number | Number of execution chunks (optional, randomized if not provided) |
| `interval` | number | Minimum time between executions (minutes) |
| `max_interval` | number | Maximum time between executions (minutes) |
| `currency_0` | address | Token to sell contract address |
| `currency_1` | address | Token to buy contract address |

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 8000)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `ONE_INCH_API_KEY`: 1inch API authentication key
- `PRIVATE_KEY`: Ethereum wallet private key for signing orders
- `TOTAL_TRADES`: Default maximum number of trade splits

### Order Execution Logic

- **Random Splitting**: Orders are split into random-sized chunks to avoid predictable patterns
- **Time Distribution**: Executions are spread across the specified time interval range
- **Status Management**: Orders progress through states: NEW → PENDING → ONGOING → COMPLETED
- **Error Handling**: Failed executions are logged and can be retried

## 🛡️ Security Considerations

- Store private keys securely and never commit them to version control
- Use environment variables for all sensitive configuration
- Implement proper access controls for production deployments
- Monitor execution logs for unusual patterns or failures
- Consider using hardware wallets or key management services for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the existing documentation and API endpoints
- Review the terminal logs for debugging information

---

Built with ❤️ for ETHDelhi hackathon
