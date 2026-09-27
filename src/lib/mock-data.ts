export type Status = "good" | "warn" | "bad" | "idle";

export const account = {
  name: "Samuel T.",
  email: "samuel@example.com",
  balance: "$1,250.00",
  equity: "$1,262.40",
  todayPl: "+$12.40",
  openTrades: 2,
  copying: true,
  mt5: { status: "Connected", account: "12345678", broker: "Example Broker" },
  provider: "Ab Marshall",
  access: { status: "Active", start: "September 27, 2026", expires: "November 27, 2026" },
};

export const openTrades = [
  { id: "t1", symbol: "GOLD", direction: "SELL", lot: "0.01", pl: "+$2.10" },
  { id: "t2", symbol: "GOLD", direction: "BUY", lot: "0.01", pl: "-$0.80" },
];

export const tradeHistory = [
  {
    id: "h1",
    date: "Sep 27, 09:14",
    symbol: "GOLD",
    direction: "SELL",
    pl: "+$8.20",
    status: "Closed",
  },
  {
    id: "h2",
    date: "Sep 27, 08:02",
    symbol: "GOLD",
    direction: "BUY",
    pl: "+$4.20",
    status: "Closed",
  },
  {
    id: "h3",
    date: "Sep 26, 16:41",
    symbol: "GOLD",
    direction: "SELL",
    pl: "-$3.10",
    status: "Closed",
  },
  {
    id: "h4",
    date: "Sep 26, 11:22",
    symbol: "GOLD",
    direction: "BUY",
    pl: "+$6.50",
    status: "Closed",
  },
];

export const notifications: { id: string; tone: Status; title: string; body: string; time: string }[] =
  [
    {
      id: "n1",
      tone: "good",
      title: "Trade copied",
      body: "Gold SELL copied successfully.",
      time: "2 min ago",
    },
    {
      id: "n2",
      tone: "good",
      title: "Trade closed",
      body: "Gold SELL closed with +$8.20.",
      time: "1 hour ago",
    },
    {
      id: "n3",
      tone: "warn",
      title: "MT5 disconnected",
      body: "Your MT5 connection was lost.",
      time: "Yesterday",
    },
    {
      id: "n4",
      tone: "good",
      title: "Payment approved",
      body: "Your challenge access is now active.",
      time: "Sep 27",
    },
  ];

export const adminSummary = [
  { label: "Customers", value: "25" },
  { label: "Active", value: "21" },
  { label: "Pending payments", value: "3" },
  { label: "MT5 connected", value: "19" },
  { label: "Copying", value: "17" },
  { label: "Open trades", value: "12" },
];

export const adminActivity = [
  { id: "a1", text: "New customer registered — Hanna M.", time: "3 min ago" },
  { id: "a2", text: "Payment submitted — Daniel K. (Telebirr)", time: "18 min ago" },
  { id: "a3", text: "Payment approved — Sara A.", time: "1 hour ago" },
  { id: "a4", text: "Trade copied to 17 accounts — GOLD SELL", time: "2 hours ago" },
  { id: "a5", text: "MT5 disconnected — Yonas B.", time: "4 hours ago" },
];

export const adminCustomers = [
  {
    id: "c1",
    name: "Sara A.",
    access: "Active",
    mt5: "Connected",
    copying: true,
    pl: "+$182.40",
    status: "good" as Status,
  },
  {
    id: "c2",
    name: "Daniel K.",
    access: "Pending",
    mt5: "Connected",
    copying: false,
    pl: "+$0.00",
    status: "warn" as Status,
  },
  {
    id: "c3",
    name: "Hanna M.",
    access: "Active",
    mt5: "Disconnected",
    copying: false,
    pl: "-$24.10",
    status: "bad" as Status,
  },
  {
    id: "c4",
    name: "Yonas B.",
    access: "Active",
    mt5: "Connected",
    copying: true,
    pl: "+$96.70",
    status: "good" as Status,
  },
];

export const adminPayments = [
  {
    id: "p1",
    customer: "Daniel K.",
    method: "Telebirr",
    amount: "$100",
    submitted: "Sep 27, 08:40",
    status: "Pending",
  },
  {
    id: "p2",
    customer: "Hanna M.",
    method: "CBE",
    amount: "$100",
    submitted: "Sep 26, 19:12",
    status: "Pending",
  },
  {
    id: "p3",
    customer: "Sara A.",
    method: "Bank Transfer",
    amount: "$100",
    submitted: "Sep 25, 10:05",
    status: "Approved",
  },
  {
    id: "p4",
    customer: "Yonas B.",
    method: "Telebirr",
    amount: "$100",
    submitted: "Sep 24, 14:33",
    status: "Rejected",
  },
];

export const adminTrades = [
  {
    id: "at1",
    customer: "Sara A.",
    symbol: "GOLD",
    direction: "SELL",
    lot: "0.01",
    pl: "+$8.20",
    status: "Closed",
  },
  {
    id: "at2",
    customer: "Yonas B.",
    symbol: "GOLD",
    direction: "SELL",
    lot: "0.02",
    pl: "+$2.10",
    status: "Open",
  },
  {
    id: "at3",
    customer: "Hanna M.",
    symbol: "GOLD",
    direction: "BUY",
    lot: "0.01",
    pl: "-$1.40",
    status: "Open",
  },
];
