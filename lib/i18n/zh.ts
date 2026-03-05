import type { Strings } from "./en";

export const zh: Strings = {
  appName: "财富镜",
  tagline: "一站掌握全球资产",

  netWorth: "净资产总览",
  totalAssets: "总资产",
  overview: "总览",
  assets: "资产",
  trendsTab: "走势",
  proTab: "专业版",

  addAsset: "添加资产",
  editAsset: "编辑资产",
  deleteAsset: "删除资产",
  deleteConfirm: "确定要删除该资产吗？",
  cancel: "取消",
  save: "保存",
  delete: "删除",
  done: "完成",
  next: "下一步",
  back: "返回",

  categories: {
    cash: "现金/存款",
    stock: "股票/基金",
    realestate: "房产",
    crypto: "加密货币",
  },

  categoryIcons: {
    cash: "🏦",
    stock: "📈",
    realestate: "🏠",
    crypto: "₿",
  },

  assetForm: {
    category: "资产类别",
    name: "资产名称",
    namePlaceholder: "如：浦发银行存款",
    value: "金额",
    valuePlaceholder: "0.00",
    currency: "币种",
    note: "备注（可选）",
    notePlaceholder: "如：联名账户、退休金",
  },

  noAssets: "暂无资产",
  noAssetsSubtitle: "点击 + 添加第一笔资产",
  assetCount: (n: number) => `${n} 项资产`,

  freeLimit: "已达免费版上限",
  freeLimitSubtitle: "升级专业版，无限添加资产",
  upgradeNow: "立即升级",

  currency: {
    label: "显示货币",
    switcher: "货币",
  },

  monthlyChange: "较上月",
  noChange: "暂无变化",
  allTime: "全部",

  trends: {
    title: "净资产走势",
    noData: "坚持记录！积累 2 个月数据后，走势图将自动显示。",
    monthlyChanges: "月度变化",
    history: "历史记录",
  },

  pro: {
    title: "解锁全部功能",
    subtitle: "自动同步所有账户，AI 分析资产配置",
    monthly: "$4.99 / 月",
    yearly: "$39.99 / 年",
    save: "省40%",
    trial: "免费试用 7 天 · 无需信用卡 · 随时取消",
    cta: "免费开始 7 天试用 →",
    comingSoon: "即将上线，我们会通知您！",
    features: [
      { emoji: "🏦", title: "银行/券商自动同步", tag: "最受欢迎", tagColor: "blue" },
      { emoji: "₿", title: "Coinbase/币安同步", tag: "免费 API", tagColor: "orange" },
      { emoji: "🏠", title: "房产 AI 估值", tag: "即将上线", tagColor: "purple" },
      { emoji: "📊", title: "资产报告（PDF）", tag: "即将上线", tagColor: "purple" },
      { emoji: "👨‍👩‍👧", title: "家庭资产总览", tag: "即将上线", tagColor: "purple" },
      { emoji: "🤖", title: "AI 财务建议", tag: "即将上线", tagColor: "purple" },
    ],
    currentPlan: "当前计划",
    free: "免费版",
    proLabel: "专业版",
  },

  settings: {
    title: "设置",
    account: "账户",
    preferences: "偏好设置",
    language: "语言",
    defaultCurrency: "默认币种",
    faceId: "面容 ID / 触控 ID",
    notifications: "推送通知",
    subscription: "订阅",
    currentPlan: "当前套餐",
    danger: "账户",
    signOut: "退出登录",
    signOutConfirm: "确定要退出登录吗？",
    version: "财富镜 v1.0.0",
  },

  auth: {
    welcome: "欢迎使用财富镜",
    signIn: "登录",
    signUp: "注册",
    email: "邮箱",
    password: "密码",
    continueWithGoogle: "使用 Google 账号登录",
    continueWithEmail: "使用邮箱登录",
    orDivider: "或",
    noAccount: "没有账号？",
    haveAccount: "已有账号？",
    forgotPassword: "忘记密码？",
    terms: "继续即表示您同意我们的服务条款和隐私政策。",
    emailPlaceholder: "your@email.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "您的姓名",
    name: "姓名",
    signInError: "邮箱或密码错误",
    signUpError: "无法创建账号",
    loading: "加载中...",
  },

  loading: "加载中...",
  error: "出现错误",
  retry: "重试",

  allocation: "资产配置",
  donutCenter: "资产",
};
