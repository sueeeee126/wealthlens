export const en = {
  appName: "WealthLens",
  tagline: "Your global wealth, unified.",

  netWorth: "Net Worth",
  totalAssets: "Total Assets",
  overview: "Overview",
  assets: "Assets",
  trendsTab: "Trends",
  proTab: "Pro",

  addAsset: "Add Asset",
  editAsset: "Edit Asset",
  deleteAsset: "Delete Asset",
  deleteConfirm: "Are you sure you want to delete this asset?",
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
  done: "Done",
  next: "Next",
  back: "Back",

  categories: {
    cash: "Cash / Bank",
    stock: "Stocks / Funds",
    realestate: "Property",
    crypto: "Crypto",
  },

  categoryIcons: {
    cash: "🏦",
    stock: "📈",
    realestate: "🏠",
    crypto: "₿",
  },

  assetForm: {
    category: "Category",
    name: "Asset Name",
    namePlaceholder: "e.g. Chase Checking",
    value: "Value",
    valuePlaceholder: "0.00",
    currency: "Currency",
    note: "Note (optional)",
    notePlaceholder: "e.g. Joint account, retirement",
  },

  noAssets: "No assets yet",
  noAssetsSubtitle: "Tap + to add your first asset",
  assetCount: (n: number) => `${n} asset${n !== 1 ? "s" : ""}`,

  freeLimit: "Free Plan Limit Reached",
  freeLimitSubtitle: "Upgrade to Pro to track unlimited assets",
  upgradeNow: "Upgrade to Pro",

  currency: {
    label: "Display Currency",
    switcher: "Currency",
  },

  monthlyChange: "vs. last month",
  noChange: "No change",
  allTime: "All time",

  trends: {
    title: "Net Worth Trends",
    noData: "Keep tracking! Your trend will appear after 2 months.",
    monthlyChanges: "Monthly Changes",
    history: "History",
  },

  pro: {
    title: "Unlock Everything",
    subtitle: "Auto-sync all accounts. AI-powered portfolio analysis.",
    monthly: "$4.99 / mo",
    yearly: "$39.99 / yr",
    save: "Save 40%",
    trial: "7-day free trial · No credit card · Cancel anytime",
    cta: "Try Pro Free for 7 Days →",
    comingSoon: "Coming Soon — we'll notify you!",
    features: [
      { emoji: "🏦", title: "Bank Auto-Sync",              tag: "Most Popular", tagColor: "blue",   description: "Connect Chase, Bank of America, Wells Fargo, HSBC and more. Auto-syncs balance daily." },
      { emoji: "₿",  title: "Coinbase Auto-Sync",          tag: "Most Popular", tagColor: "blue",   description: "Auto-sync: Coinbase. Manual entry supported for other brokers." },
      { emoji: "🏠", title: "Property Valuation Tracking", tag: "US Only",      tagColor: "orange", description: "Auto-updates US home values via Zillow. Non-US properties use manual entry." },
      { emoji: "📊", title: "Portfolio Reports (PDF)",      tag: "Coming Soon",  tagColor: "purple", description: "Download quarterly and annual net worth reports as PDF or Excel. Share with your accountant or financial advisor." },
      { emoji: "👨‍👩‍👧", title: "Family Wealth View",         tag: "Coming Soon",  tagColor: "purple", description: "Invite your spouse or family members. See combined household net worth in one dashboard." },
      { emoji: "🤖", title: "AI Financial Insights",        tag: "Coming Soon",  tagColor: "purple", description: "AI analyzes your cross-border asset allocation and suggests optimizations based on your goals." },
    ],
    currentPlan: "Current Plan",
    free: "Free",
    proLabel: "Pro",
  },

  settings: {
    title: "Settings",
    account: "Account",
    preferences: "Preferences",
    language: "Language",
    defaultCurrency: "Default Currency",
    faceId: "Face ID / Touch ID",
    notifications: "Push Notifications",
    subscription: "Subscription",
    currentPlan: "Current Plan",
    danger: "Account",
    signOut: "Sign Out",
    signOutConfirm: "Are you sure you want to sign out?",
    version: "WealthLens v1.0.0",
  },

  auth: {
    welcome: "Welcome to WealthLens",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    continueWithGoogle: "Continue with Google",
    continueWithEmail: "Sign in with Email",
    orDivider: "or",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    forgotPassword: "Forgot password?",
    terms: "By continuing, you agree to our Terms of Service and Privacy Policy.",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Your name",
    name: "Name",
    signInError: "Invalid email or password",
    signUpError: "Could not create account",
    loading: "Loading...",
  },

  loading: "Loading...",
  error: "Something went wrong",
  retry: "Retry",

  allocation: "Allocation",
  donutCenter: "Assets",
};

export type Strings = typeof en;
