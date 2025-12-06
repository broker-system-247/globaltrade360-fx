// ============================================
// GLOBALTRADE360 - COMPLETE TRADING PLATFORM
// ============================================

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const CONFIG = {
  PLATFORM_NAME: "GlobalTrade360",
  SUPPORT_EMAIL: "support@globaltrade360.com",
  ADMIN_EMAIL: "stevenlogan362@gmail.com",
  ADMIN_USERNAME: "globaltrade360",
  ADMIN_PASSWORD: "myhandwork2025",
  EMAIL_USER: "stevenlogan362@gmail.com",
  EMAIL_PASS: "ezdftcffuatisxel",
  
  MIN_DEPOSIT: 100,
  MIN_WITHDRAWAL: 50,
  WELCOME_BONUS: 50,
  
  CRYPTO_ADDRESSES: {
    bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdt: "TNS1V6WVLkQRL2VQGP1C7nKFQZ0Gq9Zq1e",
    bnb: "bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjxsnw2"
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Database
const DB_FILE = path.join(__dirname, 'database.json');

function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          id: 1001,
          name: "Michael Rodriguez",
          email: "michael@example.com",
          username: "testuser",
          password: "Test123!",
          phone: "+1234567890",
          balance: 12500.00,
          totalDeposited: 15000.00,
          totalWithdrawn: 2500.00,
          country: "USA",
          joined: new Date().toISOString(),
          verified: true,
          isAdmin: false,
          investments: [
            {
              id: 1,
              plan: "Professional",
              amount: 10000,
              dailyRate: 8.5,
              duration: 45,
              startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              active: true,
              totalProfit: 6375.00,
              dailyProfit: 850.00
            }
          ]
        }
      ],
      admin: {
        username: CONFIG.ADMIN_USERNAME,
        password: CONFIG.ADMIN_PASSWORD,
        email: CONFIG.ADMIN_EMAIL,
        fullName: "Steven Logan"
      },
      cryptoAddresses: CONFIG.CRYPTO_ADDRESSES,
      messages: [],
      depositRequests: [],
      withdrawalRequests: []
    };
    
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log("✅ Database initialized");
  }
}

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (error) {
    initDatabase();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.EMAIL_USER,
    pass: CONFIG.EMAIL_PASS
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get crypto addresses
app.get('/api/crypto', (req, res) => {
  const db = readDB();
  res.json({ success: true, addresses: db.cryptoAddresses });
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const db = readDB();
    
    if (db.users.some(u => u.email === email || u.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = {
      id: Date.now(),
      name,
      email,
      username,
      password,
      balance: CONFIG.WELCOME_BONUS,
      totalDeposited: 0,
      totalWithdrawn: 0,
      investments: [],
      joined: new Date().toISOString(),
      verified: false,
      isAdmin: false
    };
    
    db.users.push(newUser);
    writeDB(db);
    
    res.json({
      success: true,
      message: `Registration successful! $${CONFIG.WELCOME_BONUS} bonus added.`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        balance: newUser.balance
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const db = readDB();
    
    // Admin login
    if (username === db.admin.username && password === db.admin.password) {
      return res.json({
        success: true,
        isAdmin: true,
        user: {
          username: db.admin.username,
          email: db.admin.email,
          fullName: db.admin.fullName
        }
      });
    }
    
    // User login
    const user = db.users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );
    
    if (user) {
      res.json({
        success: true,
        isAdmin: false,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          balance: user.balance,
          investments: user.investments
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user
app.get('/api/user/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id == req.params.id);
  
  if (user) {
    // Calculate profits
    user.investments.forEach(inv => {
      if (inv.active) {
        const daysActive = Math.floor((Date.now() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24));
        inv.currentProfit = inv.amount * (inv.dailyRate / 100) * daysActive;
      }
    });
    
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Deposit request
app.post('/api/deposit', (req, res) => {
  const { userId, amount, cryptoType } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id == userId);
  
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  const depositAmount = parseFloat(amount);
  if (depositAmount < CONFIG.MIN_DEPOSIT) {
    return res.status(400).json({ error: `Minimum deposit is $${CONFIG.MIN_DEPOSIT}` });
  }
  
  const transaction = {
    id: 'DEP' + Date.now(),
    userId,
    amount: depositAmount,
    cryptoType,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  db.depositRequests.push(transaction);
  writeDB(db);
  
  res.json({
    success: true,
    message: 'Deposit request submitted',
    address: db.cryptoAddresses[cryptoType.toLowerCase()],
    transactionId: transaction.id
  });
});

// Withdraw request
app.post('/api/withdraw', (req, res) => {
  const { userId, amount, walletAddress } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id == userId);
  
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  const withdrawAmount = parseFloat(amount);
  if (withdrawAmount < CONFIG.MIN_WITHDRAWAL) {
    return res.status(400).json({ error: `Minimum withdrawal is $${CONFIG.MIN_WITHDRAWAL}` });
  }
  
  if (db.users[userIndex].balance < withdrawAmount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  const transaction = {
    id: 'WTH' + Date.now(),
    userId,
    amount: withdrawAmount,
    walletAddress,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  db.withdrawalRequests.push(transaction);
  writeDB(db);
  
  res.json({
    success: true,
    message: 'Withdrawal request submitted',
    transactionId: transaction.id
  });
});

// Invest
app.post('/api/invest', (req, res) => {
  const { userId, plan, amount } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id == userId);
  
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  const investmentAmount = parseFloat(amount);
  if (db.users[userIndex].balance < investmentAmount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  const planDetails = {
    'basic': { dailyRate: 5, duration: 30 },
    'professional': { dailyRate: 8.5, duration: 45 },
    'vip': { dailyRate: 12, duration: 60 }
  }[plan.toLowerCase()];
  
  if (!planDetails) return res.status(400).json({ error: 'Invalid plan' });
  
  db.users[userIndex].balance -= investmentAmount;
  
  const investment = {
    id: Date.now(),
    plan: plan.charAt(0).toUpperCase() + plan.slice(1),
    amount: investmentAmount,
    dailyRate: planDetails.dailyRate,
    duration: planDetails.duration,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + planDetails.duration * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    totalProfit: 0
  };
  
  db.users[userIndex].investments.push(investment);
  writeDB(db);
  
  res.json({
    success: true,
    message: `Investment created in ${plan} plan`,
    investment,
    newBalance: db.users[userIndex].balance
  });
});

// Admin routes
app.get('/api/admin/users', (req, res) => {
  const { adminKey } = req.query;
  if (adminKey !== CONFIG.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const db = readDB();
  res.json({ success: true, users: db.users });
});

app.post('/api/admin/update-crypto', (req, res) => {
  const { bitcoin, ethereum, usdt, bnb, adminKey } = req.body;
  
  if (adminKey !== CONFIG.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const db = readDB();
  db.cryptoAddresses = {
    bitcoin: bitcoin || db.cryptoAddresses.bitcoin,
    ethereum: ethereum || db.cryptoAddresses.ethereum,
    usdt: usdt || db.cryptoAddresses.usdt,
    bnb: bnb || db.cryptoAddresses.bnb
  };
  
  writeDB(db);
  
  res.json({ success: true, addresses: db.cryptoAddresses });
});

app.post('/api/admin/approve-deposit', (req, res) => {
  const { requestId, adminKey } = req.body;
  
  if (adminKey !== CONFIG.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const db = readDB();
  const requestIndex = db.depositRequests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  const request = db.depositRequests[requestIndex];
  const userIndex = db.users.findIndex(u => u.id == request.userId);
  
  db.users[userIndex].balance += request.amount;
  db.users[userIndex].totalDeposited += request.amount;
  db.depositRequests[requestIndex].status = 'approved';
  
  writeDB(db);
  
  res.json({
    success: true,
    message: 'Deposit approved',
    newBalance: db.users[userIndex].balance
  });
});

app.post('/api/admin/approve-withdrawal', (req, res) => {
  const { requestId, adminKey } = req.body;
  
  if (adminKey !== CONFIG.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const db = readDB();
  const requestIndex = db.withdrawalRequests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  const request = db.withdrawalRequests[requestIndex];
  const userIndex = db.users.findIndex(u => u.id == request.userId);
  
  db.users[userIndex].balance -= request.amount;
  db.users[userIndex].totalWithdrawn += request.amount;
  db.withdrawalRequests[requestIndex].status = 'approved';
  
  writeDB(db);
  
  res.json({
    success: true,
    message: 'Withdrawal approved',
    newBalance: db.users[userIndex].balance
  });
});

// Market data
app.get('/api/market-data', (req, res) => {
  const data = {
    btc: { price: 45218.50 + (Math.random() * 1000 - 500), change: 2.3 },
    eth: { price: 2415.75 + (Math.random() * 100 - 50), change: 1.8 },
    xrp: { price: 0.6245 + (Math.random() * 0.1 - 0.05), change: -0.5 },
    eur_usd: { price: 1.0850 + (Math.random() * 0.01 - 0.005), change: 0.2 },
    gold: { price: 2034.50 + (Math.random() * 10 - 5), change: 0.8 }
  };
  
  res.json({ success: true, data });
});

// AI Chat
app.post('/api/ai-chat', (req, res) => {
  const { message } = req.body;
  
  let response = "I'm your AI trading advisor! I can help with deposits, withdrawals, investments, and market analysis.";
  
  if (message.toLowerCase().includes('deposit')) {
    response = "To deposit: Go to Deposit section, select cryptocurrency, send to provided address. Minimum: $100.";
  } else if (message.toLowerCase().includes('withdraw')) {
    response = "Withdrawals take 2-24 hours. Minimum: $50. Submit request in Withdraw section.";
  } else if (message.toLowerCase().includes('profit')) {
    response = "Our AI ensures 98.7% success rate. Professional plan recommended (8.5% daily). No losses guaranteed.";
  } else if (message.toLowerCase().includes('bitcoin')) {
    response = "BTC analysis: Bullish trend. Target: $55,000. Good entry: $45K-$48K.";
  }
  
  res.json({ success: true, response });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GlobalTrade360 running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🔐 Admin: ${CONFIG.ADMIN_USERNAME} / ${CONFIG.ADMIN_PASSWORD}`);
  console.log(`👤 Test: testuser / Test123! (Balance: $12,500)`);
  
  initDatabase();
});
