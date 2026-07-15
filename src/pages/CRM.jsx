import { useState, useEffect } from "react";
import useTheme from "../hooks/useTheme";
import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiBriefcase,
  FiSearch,
  FiMoreVertical,
} from "react-icons/fi";
import { getCustomers } from "../services/crmservice";
function CRM() {
  const { t } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const getNextBillingDate = () => {
    const date = new Date();

    date.setMonth(date.getMonth() + 1);

    return date.toISOString();
  };
  const customersPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customers, setCustomers] = useState(() => {
    let savedData = getCustomers();

    if (savedData.length === 0) {
      const now = new Date();

      const defaultCustomer = [
        {
          id: 1,
          name: "Ahmed Ali",
          email: "ahmed@example.com",
          phone: "+20 100 123 4567",
          company: "Tech Corp",
          avatar: "https://i.pravatar.cc/150?img=1",
          plan: "Enterprise",
          status: "active",
          revenue: 199,
          notes: "",

          date: now.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),

          createdAt: now.toISOString(),
          month: now.toLocaleString("en-US", { month: "short" }),
          year: now.getFullYear(),
        },
      ];

      localStorage.setItem("crm_customers", JSON.stringify(defaultCustomer));

      return defaultCustomer;
    }

    // Migration للعملاء القدامى
    const migrated = savedData.map((customer) => {
      if (customer.createdAt) return customer;

      const now = new Date();

      return {
        ...customer,
        createdAt: now.toISOString(),
        month: now.toLocaleString("en-US", {
          month: "short",
        }),
        year: now.getFullYear(),
      };
    });

    console.log(migrated);

    localStorage.setItem("crm_customers", JSON.stringify(migrated));

    return migrated;
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    plan: "Pro",
    status: "active",
    paymentMethod: "Visa",
  });

  // الـ State الخاص بمودال التعديل
  const [editFormData, setEditFormData] = useState(null);

  const getRevenueByPlan = (plan) => {
    switch (plan) {
      case "Starter":
        return 19;
      case "Pro":
        return 49;
      case "Enterprise":
        return 199;
      default:
        return 0;
    }
  };

  // حفظ البيانات تلقائياً في LocalStorage عند تغير الـ customers
  useEffect(() => {
    localStorage.setItem("crm_customers", JSON.stringify(customers));
  }, [customers]);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const now = new Date();

    const newUser = {
      ...formData,
      id: Date.now(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      phone: formData.phone || "-",
      company: formData.company || "-",

      revenue: getRevenueByPlan(formData.plan),

      subscriptionPrice: getRevenueByPlan(formData.plan),

      subscriptionStatus: "paid",

      nextBillingDate: getNextBillingDate(),

      paymentMethod: "Visa",

      invoiceId: `INV-${Math.floor(Math.random() * 999999)}`,

      notes: "",

      // هيستخدم في صفحة CRM
      date: now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

      // الجديد
      createdAt: now.toISOString(),

      month: now.toLocaleString("en-US", {
        month: "short",
      }),

      year: now.getFullYear(),
    };

    setCustomers([newUser, ...customers]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      plan: "Pro",
      status: "active",
      paymentMethod: "Visa",
    });
    setIsModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData) return;
    updateCustomer(editFormData);
  };

  const getPlanStyle = (plan) => {
    switch (plan.toLowerCase()) {
      case "enterprise":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
      case "pro":
        return "bg-slate-200/40 dark:bg-slate-700/30 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "canceled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const enterpriseCustomers = customers.filter(
    (c) => c.plan === "Enterprise",
  ).length;
  const totalRevenue = customers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + Number(c.revenue || 0), 0);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    const matchesPlan = planFilter === "all" || customer.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer,
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const deleteCustomer = (id) => {
    if (window.confirm("Delete customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    }
  };

  const updateCustomer = (updatedCustomer) => {
    updatedCustomer.revenue = getRevenueByPlan(updatedCustomer.plan);

    updatedCustomer.subscriptionPrice = getRevenueByPlan(updatedCustomer.plan);

    updatedCustomer.nextBillingDate = getNextBillingDate();
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );
    setEditingCustomer(null);
    setEditFormData(null);
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Company", "Plan", "Revenue"];
    const rows = customers.map((c) => [
      c.name,
      c.email,
      c.company,
      c.plan,
      c.revenue,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  useEffect(() => {
    const closeMenu = () => setOpenMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const getPlanName = (plan) => {
    switch (plan) {
      case "Starter":
        return t.crmPage.starter;
      case "Pro":
        return t.crmPage.pro;
      case "Enterprise":
        return t.crmPage.enterprise;
      default:
        return plan;
    }
  };

  return (
    <div className=" animate-fade-in pb-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t.crmPage.title}
            </h1>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
              {t.crmPage.subtitle}
            </p>
          </div>
        </div>

        {/* STATES CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Total Customers */}
          <div className="h-full p-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {t.crmPage.totalCustomers}
              </p>
              <div className="p-2 rounded-xl bg-slate-200/40 dark:bg-slate-700/30">
                <FiUsers className="slate text-lg" />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              {totalCustomers}
            </h3>
            <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-emerald-500 font-medium">+12%</span>
              <span className="text-slate-500">{t.crmPage.thisMonth}</span>
            </div>
          </div>

          {/* Active Customers */}
          <div className="h-full p-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {t.crmPage.activeCustomers}
              </p>
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <FiActivity className="text-emerald-500 text-lg" />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              {activeCustomers}
            </h3>
            <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-emerald-500 font-medium">
                {t.crmPage.active}
              </span>
              <span className="text-slate-500">{t.crmPage.customers}</span>
            </div>
          </div>

          {/* Enterprise */}
          <div className="h-full p-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {t.crmPage.enterprise}
              </p>
              <div className="p-2 rounded-xl bg-purple-500/10">
                <FiBriefcase className="text-purple-500 text-lg" />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              {enterpriseCustomers}
            </h3>
            <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-purple-500 font-medium">
                {t.crmPage.premium}
              </span>
              <span className="text-slate-500">{t.crmPage.accounts}</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="h-full p-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {t.crmPage.revenue}
              </p>
              <div className="p-2 rounded-xl bg-amber-500/10">
                <FiDollarSign className="text-amber-500 text-lg" />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              ${totalRevenue}
            </h3>
            <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-emerald-500 font-medium">+8.5%</span>
              <span className="text-slate-500">{t.crmPage.growth}</span>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <input
                type="text"
                placeholder={t.crmPage.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {["all", "active", "pending", "canceled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 h-11 rounded-xl text-sm font-medium transition-all ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {status === "all"
                    ? t.crmPage.all
                    : status === "active"
                      ? t.crmPage.active
                      : status === "pending"
                        ? t.crmPage.pending
                        : t.crmPage.canceled}
                </button>
              ))}

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm"
              >
                <option value="all">{t.crmPage.allPlans}</option>
                <option value="Starter">{t.crmPage.starter}</option>
                <option value="Pro">{t.crmPage.pro}</option>
                <option value="Enterprise">{t.crmPage.enterprise}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.crmPage.customers}
            </h3>
<p className="text-sm text-slate-500">
  {filteredCustomers.length} {t.crmPage.customersFound}
</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportCSV}
              className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {t.crmPage.exportCSV}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm shadow-xl shadow-indigo-600/20 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t.crmPage.addCustomer}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {currentCustomers.length === 0 ? (
            <div className="col-span-full p-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h3 className="text-xl font-semibold">{t.crmPage.noCustomers}</h3>
              <p className="mt-2 text-slate-500">
                {t.crmPage.noCustomersSubtitle}
              </p>
            </div>
          ) : (
            currentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="relative overflow-visible bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(
                        openMenu === customer.id ? null : customer.id,
                      );
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <FiMoreVertical />
                  </button>
                </div>

                {/* Company Details */}
                <div className="mt-5 space-y-2 text-sm">
                  <p>
                    <span className="text-slate-500">{t.crmPage.company}</span>{" "}
                    {customer.company}
                  </p>
                  <p>
                    <span className="text-slate-500">{t.crmPage.phone}</span>{" "}
                    {customer.phone}
                  </p>
                  <p>
                    <span className="text-slate-500">{t.crmPage.revenue}</span>{" "}
                    ${customer.revenue}
                  </p>
                  <p>
                    <span className="text-slate-500">{t.crmPage.joined}</span>{" "}
                    {customer.date}
                  </p>
                </div>

                {/* Plan + Status */}
                <div className="flex gap-2 mt-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getPlanStyle(customer.plan)}`}
                  >
                    {getPlanName(customer.plan)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(customer.status)}`}
                  >
                    {customer.status}
                  </span>
                </div>

                {openMenu === customer.id && (
                  <div className="absolute top-14 right-4 z-50 w-44 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {t.crmPage.view}
                    </button>

                    <button
                      onClick={() => {
                        setEditingCustomer(customer);
                        setEditFormData(customer); // الـ State بيتحدث هنا مباشرة وقت الضغط
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {t.crmPage.edit}
                    </button>
                    <button
                      onClick={() => {
                        deleteCustomer(customer.id);
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-500/10"
                    >
                      {t.crmPage.delete}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 rounded-xl border disabled:opacity-40"
          >
            {t.previous}
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl transition-all ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 rounded-xl border disabled:opacity-40"
          >
            {t.next}
          </button>
        </div>
      )}

      {/* المودال الأول (إضافة عميل) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">{t.crm.addCustomer}</h2>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                required
                value={formData.name}
                placeholder={t.crmPage.name}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                required
                value={formData.email}
                type="email"
                placeholder={t.crmPage.email}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                placeholder={t.crmPage.phone}
                value={formData.phone}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                placeholder={t.crmPage.company}
                value={formData.company}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <select
                value={formData.plan}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
              >
                <option value="Starter">{t.crmPage.starter}</option>
                <option value="Pro">{t.crmPage.pro}</option>
                <option value="Enterprise">{t.crmPage.enterprise}</option>
              </select>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
                <option value="PayPal">PayPal</option>
                <option value="Stripe">Stripe</option>
              </select>
              <select
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">{t.crmPage.active}</option>
                <option value="pending">{t.crmPage.pending}</option>
                <option value="canceled">{t.crmPage.canceled}</option>
              </select>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال التعديل (Edit Modal) */}
      {editingCustomer && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900">
            <h2 className="text-xl font-bold mb-5">{t.crm.editCustomer}</h2>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                placeholder={t.crmPage.name}
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <input
                placeholder={t.crmPage.email}
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <input
                placeholder={t.crmPage.phone}
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <input
                placeholder={t.crmPage.company}
                value={editFormData.company}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, company: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <select
                value={editFormData.plan}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, plan: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Starter">{t.crmPage.starter}</option>
                <option value="Pro">{t.crmPage.pro}</option>
                <option value="Enterprise">{t.crmPage.enterprise}</option>
              </select>

              <select
                value={editFormData.paymentMethod}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option>Visa</option>
                <option>MasterCard</option>
                <option>PayPal</option>
                <option>Stripe</option>
              </select>

              <select
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, status: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="active">{t.crmPage.active}</option>
                <option value="pending">{t.crmPage.pending}</option>
                <option value="canceled">{t.crmPage.canceled}</option>
              </select>

              <textarea
                value={editFormData.notes || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, notes: e.target.value })
                }
                rows="4"
                placeholder={t.crmPage.notes}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCustomer(null);
                    setEditFormData(null);
                  }}
                  className="flex-1 py-2 rounded-xl border"
                >
                  {t.crmPage.cancel}
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white"
                >
                  {t.crmPage.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تفاصيل العميل */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t.crm.customerDetails}</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedCustomer.avatar}
              alt=""
              className="w-20 h-20 rounded-full mx-auto"
            />

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500">{t.crmPage.name}</p>
                <p>{selectedCustomer.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t.crmPage.email}</p>
                <p>{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t.crmPage.phone}</p>
                <p>{selectedCustomer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t.crmPage.company}</p>
                <p>{selectedCustomer.company}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t.crmPage.plan}</p>
                <p>{selectedCustomer.plan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t.crmPage.revenue}</p>
                <p>${selectedCustomer.revenue}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  {t.crmPage.paymentMethod}
                </p>

                <p>{selectedCustomer.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  {t.crmPage.subscription}
                </p>

                <p>{selectedCustomer.subscriptionStatus}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">{t.crmPage.invoice}</p>

                <p>{selectedCustomer.invoiceId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t.crmPage.notes}</p>
                <p className="whitespace-pre-wrap">
                  {selectedCustomer.notes || "No notes"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRM;
