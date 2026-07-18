import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTheme from "../hooks/useTheme";

import { AuthContext } from "../context/auth-context";

import { getRevenueStats } from "../services/crmservice";
import { getOrders } from "../services/orderService";

import {
  getBusinessGoals,
  saveBusinessGoals,
} from "../services/settingsService";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

function Billing() {
  const { lang, t } = useTheme();

  const [goals, setGoals] = useState(getBusinessGoals());

  const { users } = useContext(AuthContext) || { users: [] };

  const activeStaffOnly = (users || []).filter(
    (u) => u.status === "Active" && u.role?.toLowerCase() !== "owner",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState(() => {
    const savedCard = localStorage.getItem("saas_merchant_card");
    return savedCard
      ? JSON.parse(savedCard)
      : { number: "4242 4242 4242 4242", expiry: "12/28" };
  });

  const [inputNumber, setInputNumber] = useState("");
  const [inputExpiry, setInputExpiry] = useState("");

  // فتح المودال مع تحميل البيانات الحالية للكارت لتعديلها
  const handleOpenModal = () => {
    setInputNumber(cardInfo.number);
    setInputExpiry(cardInfo.expiry);
    setIsModalOpen(true);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || "";
    setInputNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setInputExpiry(value);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!inputNumber || !inputExpiry) return;

    const newCard = { number: inputNumber, expiry: inputExpiry };

    setCardInfo(newCard);
    localStorage.setItem("saas_merchant_card", JSON.stringify(newCard));
    setIsModalOpen(false);
    setInputNumber("");
    setInputExpiry("");
  };

  const crmStats = getRevenueStats() || {
    customers: [],
    totalRevenue: 0,
    pendingRevenue: 0,
    activeCustomers: 0,
    totalCustomers: 0,
  };
  const allOrders = getOrders() || [];

  const completedOrders = allOrders.filter((o) => o.status === "Completed");
  const pendingOrders = allOrders.filter((o) => o.status === "Pending");

  const cleanAmount = (val) => {
    if (val === null || val === undefined || val === "") return 0;

    if (typeof val === "number") return val;

    const stringVal = String(val);
    return Number(stringVal.replace(/[^0-9.-]/g, "")) || 0;
  };

  const productsRevenue = completedOrders.reduce(
    (sum, o) => sum + cleanAmount(o.total),
    0,
  );

  const productsPending = pendingOrders.reduce(
    (sum, o) => sum + cleanAmount(o.total),
    0,
  );

  const totalPayrollExpenses = activeStaffOnly.reduce((acc, curr) => {
    const base = Number(curr.baseSalary || 0);
    const allow = Number(curr.allowances || 0);
    const deduct = Number(curr.deductions || 0);
    return acc + (base + allow - deduct);
  }, 0);

  const grossIncome = crmStats.totalRevenue + productsRevenue;
  const netAvailable = grossIncome - totalPayrollExpenses;

  const revenue = {
    subscriptions: crmStats.totalRevenue,
    products: productsRevenue,
    payrollExpenses: totalPayrollExpenses,
    pending: crmStats.pendingRevenue + productsPending,
    available: netAvailable >= 0 ? netAvailable : 0,
  };

  const subscriptionInvoices = (crmStats.customers || []).map((c) => ({
    id: c.invoiceId || `INV-SUB-${c.id}`,
    customer: c.name,
    type: t.billingPage.crmSubscription,
    date: c.date || "May 1, 2026",
    rawDate: c.createdAt ? new Date(c.createdAt) : new Date(),
    amount: c.revenue || 0,
    txType: "Income",
    status:
      c.status === "active"
        ? "Paid"
        : c.status === "pending"
          ? "Pending"
          : "Cancelled",
  }));

  const orderInvoices = allOrders.map((o) => ({
    id: o.id || `ORD-${o.orderNumber}`,
    customer: o.customer || "Walk-in Customer",
    type: t.billingPage.productSale,
    date: o.date || "May 1, 2026",
    rawDate: new Date(o.date || new Date()),
    amount: cleanAmount(o.total),
    txType: "Income",
    status:
      o.status === "Completed"
        ? "Paid"
        : o.status === "Pending"
          ? "Pending"
          : "Cancelled",
  }));

  const payrollInvoices = activeStaffOnly
    .filter((u) => u.baseSalary || u.allowances)
    .map((u) => {
      const netSalary =
        Number(u.baseSalary || 0) +
        Number(u.allowances || 0) -
        Number(u.deductions || 0);
      return {
        id: `PAY-${u.id}-${new Date().getMonth() + 1}`,
        customer: u.name,
        type: t.billingPage.staffPayroll,
        date: new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        rawDate: new Date(),
        amount: netSalary,
        txType: "Expense",
        status: "Paid",
      };
    });

  const dynamicInvoices = [
    ...subscriptionInvoices,
    ...orderInvoices,
    ...payrollInvoices,
  ].sort((a, b) => b.rawDate - a.rawDate);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]";
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]";
      default:
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.05)]";
    }
  };

  const handleSaveGoals = () => {
    saveBusinessGoals(goals);
    window.dispatchEvent(new Event("goalsUpdated"));
  };

  // دالة صغيرة لإخفاء أرقام الكارت عدا آخر 4 أرقام بشكل جمالي
  const formatCardDisplay = (num) => {
    const clean = num.replace(/\s+/g, "");
    if (clean.length <= 4) return clean;
    const lastFour = clean.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-8 max-w-[1600px] mx-auto px-1 ${lang === "ar" ? "text-right" : "text-left"}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Title Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {t.billingPage.auditLog}
          </h1>
          <p
            className="text-sm mt-1.5 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {t.billingPage.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t.billingPage.realtimeDynamic}
        </div>
      </motion.div>

      {/* Grid: Overview Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Analytics Summary Card */}
        <div
          className="p-7 rounded-[24px] border backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
          <h2 className="text-lg font-bold mb-6 tracking-wide text-slate-800 dark:text-slate-100">
            {t.billingPage.ecosystemSummary}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/5">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {t.billingPage.activeCustomers}
                </p>
                <h3 className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100">
                  {crmStats.activeCustomers}
                </h3>
                <span className="text-[11px] text-slate-400 font-normal">
                  {t.billingPage.activeAccounts}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/5">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {t.billingPage.activeStaff}
                </p>
                <h3 className="text-2xl font-black mt-1 text-indigo-500">
                  {activeStaffOnly.length}
                </h3>
                <span className="text-[11px] text-indigo-400/80 font-normal">
                  {t.billingPage.staffExcludingOwner}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-white/5">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {t.billingPage.totalEcosystem}
                </p>
                <p className="font-semibold text-sm mt-0.5 text-slate-700 dark:text-slate-300">
                  {crmStats.totalCustomers} {t.billingPage.totalLeads}
                </p>
              </div>
              <div className="text-end">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {t.billingPage.syncFrequency}
                </p>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5 justify-end">
                  {t.billingPage.realtimeDynamic}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Payment Info Gateway View */}
        <div
          className="p-7 rounded-[24px] border backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
          <h2 className="text-lg font-bold mb-6 tracking-wide text-slate-800 dark:text-slate-100">
            {t.billingPage.payoutSettlement}
          </h2>
          
          <div className="relative overflow-hidden w-full h-48 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border border-white/10 shadow-xl group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />

            <div className="flex justify-between items-start h-full flex-col">
              <div className="flex justify-between items-center w-full">
                <div className="w-10 h-8 rounded-md bg-gradient-to-r from-amber-400/80 to-amber-200/60 opacity-80" />
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                  {t.billingPage.merchantAccount}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {t.billingPage.cardNumber}
                </p>
                <h3 className="text-2xl font-mono tracking-widest mt-1 font-bold">
                  {formatCardDisplay(cardInfo.number)}
                </h3>
              </div>

              <div className="flex justify-between items-center w-full pt-2 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    {t.billingPage.expires}
                  </p>
                  <p className="text-sm font-mono font-medium">
                    {cardInfo.expiry}
                  </p>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer transition"
                >
                  {t.billingPage.manage}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Goals Section */}
      <div
        className="rounded-3xl border p-6 md:col-span-2 shadow-sm transition-all duration-300"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">
            {t.billingPage.businessGoals}
          </h3>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium tracking-wider uppercase">
            {t.billingPage.targets}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-1">
              {t.billingPage.customersGoal}
            </label>
            <input
              type="number"
              value={goals.customers}
              onChange={(e) =>
                setGoals({
                  ...goals,
                  customers: Number(e.target.value),
                })
              }
              className="w-full mt-2 h-11 px-4 rounded-xl border bg-transparent text-sm font-medium outline-none text-slate-800 dark:text-white transition-all duration-200 hover:bg-slate-500/[0.02] focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.12)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-1">
              {t.billingPage.revenueGoal}
            </label>
            <input
              type="number"
              value={goals.subscriptions}
              onChange={(e) =>
                setGoals({
                  ...goals,
                  subscriptions: Number(e.target.value),
                })
              }
              className="w-full mt-2 h-11 px-4 rounded-xl border bg-transparent text-sm font-medium outline-none text-slate-800 dark:text-white transition-all duration-200 hover:bg-slate-500/[0.02] focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.12)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-1">
              {t.billingPage.ordersGoal}
            </label>
            <input
              type="number"
              value={goals.orders}
              onChange={(e) =>
                setGoals({
                  ...goals,
                  orders: Number(e.target.value),
                })
              }
              className="w-full mt-2 h-11 px-4 rounded-xl border bg-transparent text-sm font-medium outline-none text-slate-800 dark:text-white transition-all duration-200 hover:bg-slate-500/[0.02] focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.12)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-1">
              {t.billingPage.productSalesGoal}
            </label>
            <input
              type="number"
              value={goals.sales}
              onChange={(e) =>
                setGoals({
                  ...goals,
                  sales: Number(e.target.value),
                })
              }
              className="w-full mt-2 h-11 px-4 rounded-xl border bg-transparent text-sm font-medium outline-none text-slate-800 dark:text-white transition-all duration-200 hover:bg-slate-500/[0.02] focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.12)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveGoals}
            className="px-6 h-11 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[0.97] transition-all duration-150 shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            {t.billingPage.saveGoals}
          </button>
        </div>
      </div>

      {/* Dynamic Metrics Financial Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div
          className="p-5 rounded-2xl border transition-all hover:translate-y-[-2px] duration-200"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {t.billingPage.subscriptionRevenue}
          </p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-slate-800 dark:text-slate-100">
            ${revenue.subscriptions.toLocaleString()}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-500">
            <span>✔</span>
            <span>{t.billingPage.liveSubs}</span>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl border transition-all hover:translate-y-[-2px] duration-200"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {t.billingPage.productsRevenue}
          </p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-slate-800 dark:text-slate-100">
            ${revenue.products.toLocaleString()}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-indigo-500">
            <span>✔</span>
            <span>{t.billingPage.ordersDone}</span>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl border border-rose-500/10 transition-all hover:translate-y-[-2px] duration-200"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <p className="text-xs font-bold text-rose-500/90">
            {t.billingPage.payrollExpenses}
          </p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-rose-500">
            -${revenue.payrollExpenses.toLocaleString()}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-rose-400/80">
            <span>⚙</span>
            <span>{t.billingPage.ownerExcluded}</span>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl border transition-all hover:translate-y-[-2px] duration-200"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {t.billingPage.pendingBalance}
          </p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-slate-800 dark:text-slate-100">
            ${revenue.pending.toLocaleString()}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-amber-500">
            <span className="animate-pulse">⏱</span>
            <span>{t.billingPage.processing}</span>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-emerald-500/[0.08] flex flex-col justify-between transition-all hover:translate-y-[-2px] duration-200 sm:col-span-2 lg:col-span-1 shadow-[0_4px_20px_rgba(16,185,129,0.03)]"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {t.billingPage.netProfit}
              </p>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="text-3xl font-black mt-3 tracking-tight text-emerald-600 dark:text-emerald-400">
              ${revenue.available.toLocaleString()}
            </h3>
          </div>
          <button className="mt-5 w-full h-10 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 transition font-bold shadow-lg shadow-emerald-600/10 active:scale-[0.98] cursor-pointer">
            {t.billingPage.withdrawFunds}
          </button>
        </div>
      </motion.div>

      {/* Dynamic Billing History Log Table & Cards */}
      <motion.div
        variants={itemVariants}
        className="rounded-[24px] border backdrop-blur-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.01)]"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div className="p-6 pb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {t.billingPage.unifiedAuditLog}
          </h2>
        </div>

        {/* 1. Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table
            className={`w-full text-sm ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-semibold text-xs bg-slate-500/[0.02]">
                <th className="py-4 px-6">{t.billingPage.date}</th>
                <th className="py-4 px-4">{t.billingPage.referenceId}</th>
                <th className="py-4 px-4">{t.billingPage.entityCustomer}</th>
                <th className="py-4 px-4">{t.billingPage.classification}</th>
                <th className="py-4 px-4">{t.billingPage.amount}</th>
                <th className="py-4 px-6 text-center">
                  {t.billingPage.status}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
              {dynamicInvoices.slice(0, 12).map((invoice, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-500/[0.015] transition-colors duration-150"
                >
                  <td className="py-4 px-6 text-slate-400 dark:text-slate-500 font-normal text-xs whitespace-nowrap">
                    {invoice.date}
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-mono text-xs tracking-tight">
                    {invoice.id}
                  </td>
                  <td className="py-4 px-4 text-slate-900 dark:text-white font-semibold">
                    {invoice.customer}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        invoice.txType === "Expense"
                          ? "bg-rose-500/10 text-rose-500"
                          : "bg-indigo-500/10 text-indigo-500"
                      }`}
                    >
                      {invoice.txType === "Expense"
                        ? t.billingPage.expense
                        : t.billingPage.income}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-4 font-black text-base ${invoice.txType === "Expense" ? "text-rose-500" : "text-slate-900 dark:text-white"}`}
                  >
                    {invoice.txType === "Expense" ? "-" : "+"}$
                    {invoice.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-block min-w-[75px] ${getStatusStyle(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Mobile View Cards */}
        <div className="block md:hidden p-4 space-y-4">
          {dynamicInvoices.slice(0, 12).map((invoice, index) => (
            <div 
              key={index}
              className="p-4 rounded-2xl border flex flex-col gap-3 bg-slate-500/[0.01] hover:bg-slate-500/[0.02] transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {invoice.customer}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {invoice.id}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    invoice.txType === "Expense"
                      ? "bg-rose-500/10 text-rose-500"
                      : "bg-indigo-500/10 text-indigo-500"
                  }`}
                >
                  {invoice.txType === "Expense" ? t.billingPage.expense : t.billingPage.income}
                </span>
              </div>

              <div className="h-[1px] w-full bg-slate-100 dark:bg-white/5" />

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400 font-normal">
                    {invoice.date}
                  </span>
                  <span className={`text-lg font-black mt-0.5 ${invoice.txType === "Expense" ? "text-rose-500" : "text-slate-900 dark:text-white"}`}>
                    {invoice.txType === "Expense" ? "-" : "+"}${invoice.amount.toLocaleString()}
                  </span>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-bold min-w-[75px] text-center ${getStatusStyle(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Premium Glassmorphism Modal for Changing Bank Account Card */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Content Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md p-6 rounded-3xl border shadow-2xl overflow-hidden"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t.billingPage.updateCard}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                {t.billingPage.updateCardDesc}
              </p>

              <form onSubmit={handleSaveCard} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    {t.billingPage.cardNumber}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    value={inputNumber}
                    onChange={handleCardNumberChange}
                    maxLength="19"
                    className="w-full h-11 px-3 rounded-xl border text-sm font-mono tracking-widest font-semibold outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                    style={{
                      background: "var(--bg-main)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    {t.billingPage.expiryDate}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={inputExpiry}
                    onChange={handleExpiryChange}
                    maxLength="5"
                    className="w-full h-11 px-3 rounded-xl border text-sm font-mono tracking-widest font-semibold outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                    style={{
                      background: "var(--bg-main)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
                  >
                    {t.billingPage.saveCard}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 h-10 rounded-xl border text-xs font-semibold text-slate-500"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {t.billingPage.cancel}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Billing;