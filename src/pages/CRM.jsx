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

function CRM() {
  const { lang } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

const customersPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // بيانات الـ State مع تحميلها من الـ LocalStorage
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("crm_customers");
    return saved
      ? JSON.parse(saved)
      : [
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

            date: "May 10, 2026",

            notes: "",

            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    plan: "Pro",
    status: "active",
  });
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

    const newUser = {
      ...formData,
      id: Date.now(),

      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,

      phone: formData.phone || "-",
      company: formData.company || "-",

      revenue: getRevenueByPlan(formData.plan),

      notes: "",

      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setCustomers([newUser, ...customers]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      plan: "Pro",
      status: "active",
    });
    setIsModalOpen(false);
  };

  const getPlanStyle = (plan) => {
    switch (plan.toLowerCase()) {
      case "enterprise":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
      case "pro":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
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

  const totalRevenue = customers.reduce(
    (sum, c) => sum + Number(c.revenue || 0),
    0,
  );

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) 
     ;
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    const matchesPlan = planFilter === "all" || customer.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const indexOfLastCustomer =
  currentPage * customersPerPage;

const indexOfFirstCustomer =
  indexOfLastCustomer - customersPerPage;

const currentCustomers =
  filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

const totalPages = Math.ceil(
  filteredCustomers.length /
    customersPerPage
);
  const deleteCustomer = (id) => {
    if (window.confirm("Delete customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    }
  };

  const updateCustomer = (updatedCustomer) => {
    updatedCustomer.revenue = getRevenueByPlan(updatedCustomer.plan);

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );

    setEditingCustomer(null);
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

  return (
    <div className=" animate-fade-in pb-10">
        <div className="space-y-6">

          
            {/* ====================================
                     Header
========================================= */}
    
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {lang === "ar" ? "إدارة مجتمع العملاء" : "Customer Ecosystem"}
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            {lang === "ar"
              ? "التحكم الكامل في الاشتراكات، الحالات، والتدفق المالي."
              : "Full control over subscriptions and revenue metrics."}
          </p>
        </div>
      </div>


            {/* ====================================
      STATES CARD
========================================= */}

   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

  {/* Total Customers */}
  <div
    className="
      h-full
      p-6
      rounded-3xl
      border
      bg-white
      dark:bg-slate-900
      border-slate-200
      dark:border-slate-800
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
    "
  >
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        Total Customers
      </p>

      <div className="p-2 rounded-xl bg-indigo-500/10">
        <FiUsers className="text-indigo-500 text-lg" />
      </div>
    </div>

    <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
      {totalCustomers}
    </h3>

    <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />

    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-emerald-500 font-medium">
        +12%
      </span>

      <span className="text-slate-500">
        this month
      </span>
    </div>
  </div>

  {/* Active Customers */}
  <div
    className="
      h-full
      p-6
      rounded-3xl
      border
      bg-white
      dark:bg-slate-900
      border-slate-200
      dark:border-slate-800
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
    "
  >
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        Active Customers
      </p>

      <div className="p-2 rounded-xl bg-emerald-500/10">
        <FiActivity  className="text-emerald-500 text-lg" />
      </div>
    </div>

    <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
      {activeCustomers}
    </h3>

    <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />

    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-emerald-500 font-medium">
        Active
      </span>

      <span className="text-slate-500">
        customers
      </span>
    </div>
  </div>

  {/* Enterprise */}
  <div
    className="
      h-full
      p-6
      rounded-3xl
      border
      bg-white
      dark:bg-slate-900
      border-slate-200
      dark:border-slate-800
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
    "
  >
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        Enterprise
      </p>

      <div className="p-2 rounded-xl bg-purple-500/10">
        < FiBriefcase  className="text-purple-500 text-lg" />
      </div>
    </div>

    <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
      {enterpriseCustomers}
    </h3>

    <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />

    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-purple-500 font-medium">
        Premium
      </span>

      <span className="text-slate-500">
        accounts
      </span>
    </div>
  </div>

  {/* Revenue */}
  <div
    className="
      h-full
      p-6
      rounded-3xl
      border
      bg-white
      dark:bg-slate-900
      border-slate-200
      dark:border-slate-800
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
    "
  >
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        Revenue
      </p>

      <div className="p-2 rounded-xl bg-amber-500/10">
        <FiDollarSign className="text-amber-500 text-lg" />
      </div>
    </div>

    <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
      ${totalRevenue}
    </h3>

    <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />

    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-emerald-500 font-medium">
        +8.5%
      </span>

      <span className="text-slate-500">
        growth
      </span>
    </div>
  </div>
  </div> 

              {/* ====================================
  SEARCH AND FILTERS
========================================= */}

    <div
  className="
    bg-white
    dark:bg-slate-900
    border
    border-slate-200
    dark:border-slate-800
    rounded-3xl
    p-5
    shadow-sm
  "
>
  <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">

    {/* Search */}
    <div className="relative w-full lg:max-w-md">
      <input
        type="text"
        placeholder={lang === "ar" ? "ابحث عن عميل..." : "Search customers..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full
          h-12
          pl-11
          pr-4
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-700
          bg-slate-50
          dark:bg-slate-800
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500/30
          focus:border-indigo-500
        "
      />

      <FiSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />
    </div>

    {/* Filters */}
    <div className="flex flex-wrap gap-2 justify-center lg:justify-end">

      {["all", "active", "pending", "canceled"].map((status) => (
        <button
          key={status}
          onClick={() => setStatusFilter(status)}
          className={`
            px-4
            h-11
            rounded-xl
            text-sm
            font-medium
            transition-all
            ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }
          `}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}

      <select
        value={planFilter}
        onChange={(e) => setPlanFilter(e.target.value)}
        className="
          h-11
          px-4
          rounded-xl
          border
          border-slate-200
          dark:border-slate-700
          bg-slate-100
          dark:bg-slate-800
          text-sm
        "
      >
        <option value="all">All Plans</option>
        <option value="Starter">Starter</option>
        <option value="Pro">Pro</option>
        <option value="Enterprise">Enterprise</option>
      </select>

    </div>
  </div>
</div>
              {/* ====================================
          ACTIVITY
========================================= */}

     <div
  className="
    p-6
    rounded-3xl
    border
    border-slate-200
    dark:border-slate-800
    bg-white
    dark:bg-slate-900
    shadow-sm
  "
>
  <div className="flex items-center justify-between mb-5">
    <h3 className="font-semibold text-lg">
      Recent Activity
    </h3>

    <span className="text-xs text-slate-500">
      Last 5 customers
    </span>
  </div>

  <div className="space-y-4">
    {customers.slice(0, 5).map((c) => (
      <div
        key={c.id}
        className="
          flex
          items-center
          justify-between
          p-3
          rounded-2xl
          hover:bg-slate-50
          dark:hover:bg-slate-800/50
          transition-all
        "
      >
        <div className="flex items-center gap-3">
          <img
            src={c.avatar}
            alt={c.name}
            className="w-10 h-10 rounded-full"
          />

          <div>
            <p className="font-medium">
              {c.name}
            </p>

            <p className="text-xs text-slate-500">
              {c.company}
            </p>
          </div>
        </div>

        <span
          className="
            text-xs
            px-3
            py-1
            rounded-full
            bg-emerald-500/10
            text-emerald-500
          "
        >
          Joined
        </span>
      </div>
    ))}
  </div>
</div>

              {/* ====================================
          Customers cards
========================================= */}


      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Side */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Customers
          </h3>

          <p className="text-sm text-slate-500">
            {filteredCustomers.length} Customers Found
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportCSV}
            className="
        h-11
        px-5
        rounded-xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        hover:bg-slate-50
        dark:hover:bg-slate-800
        transition-all
      "
          >
            Export CSV
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="
        h-11
        px-5
        rounded-xl
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
        text-white
        font-medium
        text-sm
        shadow-xl
        shadow-indigo-600/20
        hover:opacity-95
        transition-all
        flex
        items-center
        gap-2
      "
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
            Add New User
          </button>
        </div>
      </div>{" "}



<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

  {currentCustomers.length === 0 ? (

    <div
      className="
        col-span-full
        p-16
        text-center
        rounded-3xl
        border
        border-dashed
        border-slate-300
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
      "
    >
      <h3 className="text-xl font-semibold">
        No Customers Found
      </h3>

      <p className="mt-2 text-slate-500">
        Try changing filters or add a new customer.
      </p>
    </div>

  ) : (

    currentCustomers.map((customer) => (
              <div
            key={customer.id}
            className="
            relative
overflow-visible
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-800
      rounded-3xl
      p-5
      shadow-sm
      hover:shadow-xl
hover:-translate-y-1
      transition-all
      "
          >
            {/* Header */}
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

                  setOpenMenu(openMenu === customer.id ? null : customer.id);
                }}
                className="
    p-2
    rounded-lg
    hover:bg-slate-100
    dark:hover:bg-slate-800
  "
              >
                <FiMoreVertical />
              </button>
            </div>
            {/* Company */}
            <div className="mt-5 space-y-2 text-sm">
              <p>
                <span className="text-slate-500">Company:</span>{" "}
                {customer.company}
              </p>

              <p>
                <span className="text-slate-500">Phone:</span> {customer.phone}
              </p>

              <p>
                <span className="text-slate-500">Revenue:</span> $
                {customer.revenue}
              </p>

              <p>
                <span className="text-slate-500">Joined:</span> {customer.date}
              </p>
            </div>
            {/* Plan + Status */}
            <div className="flex gap-2 mt-5">
              <span
                className={`px-3 py-1 rounded-full text-xs ${getPlanStyle(customer.plan)}`}
              >
                {customer.plan}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(customer.status)}`}
              >
                {customer.status}
              </span>
            </div>
            {openMenu === customer.id && (
              <div
                className="
      absolute
      top-14
      right-4
      z-50
      w-44
      rounded-2xl
      border
      border-slate-200
      dark:border-slate-700
      bg-white
      dark:bg-slate-900
      shadow-2xl
      overflow-hidden
    "
              >
                <button
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setOpenMenu(null);
                  }}
                  className="
        w-full
        px-4
        py-3
        text-left
        hover:bg-slate-100
        dark:hover:bg-slate-800
      "
                >
                  View
                </button>

                <button
                  onClick={() => {
                    setEditingCustomer(customer);
                    setOpenMenu(null);
                  }}
                  className="
        w-full
        px-4
        py-3
        text-left
        hover:bg-slate-100
        dark:hover:bg-slate-800
      "
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    deleteCustomer(customer.id);
                    setOpenMenu(null);
                  }}
                  className="
        w-full
        px-4
        py-3
        text-left
        text-red-500
        hover:bg-red-500/10
      "
                >
                  Delete
                </button>
              </div>
            )}{" "}
          </div>
    ))

  )}

</div>



      
      </div> 

              {/* ====================================
          Pagination
========================================= */}



      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-8">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage(currentPage - 1)
      }
      className="
        px-4
        py-2
        rounded-xl
        border
        disabled:opacity-40
      "
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() =>
          setCurrentPage(i + 1)
        }
        className={`
          w-10
          h-10
          rounded-xl
          transition-all
          ${
            currentPage === i + 1
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800"
          }
        `}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage(currentPage + 1)
      }
      className="
        px-4
        py-2
        rounded-xl
        border
        disabled:opacity-40
      "
    >
      Next
    </button>

  </div>
)}
      
      {/* المودال */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">
              {lang === "ar" ? "إضافة مستخدم" : "Add User"}
            </h2>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                required
                value={formData.name}
                placeholder="Name"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                required
                value={formData.email}
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                value={formData.phone}
                className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <input
                placeholder="Company"
                value={formData.company}
                className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <select
                value={formData.plan}
                className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
              >
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <select
                className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
              </select>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white"
                >
                  {lang === "ar" ? "حفظ" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={updateCustomer}
        />
      )}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div
            className="
      w-full
      max-w-md
      h-full
      bg-white
      dark:bg-slate-900
      border-l
      border-slate-200
      dark:border-slate-800
      p-6
      overflow-y-auto
    "
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Customer Details</h2>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="
    w-9
    h-9
    rounded-lg
    hover:bg-slate-100
    dark:hover:bg-slate-800
  "
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
                <p className="text-xs text-slate-500">Name</p>
                <p>{selectedCustomer.name}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p>{selectedCustomer.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p>{selectedCustomer.phone}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Company</p>
                <p>{selectedCustomer.company}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Plan</p>
                <p>{selectedCustomer.plan}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Revenue</p>
                <p>${selectedCustomer.revenue}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Notes</p>

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


function EditCustomerModal({ customer, onClose, onSave }) {
  const [data, setData] = useState(customer);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="
        w-full
        max-w-md
        p-6
        rounded-2xl
        bg-white
        dark:bg-slate-900
      "
      >
        <h2 className="text-xl font-bold mb-5">Edit Customer</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="name"
            value={data.name}
            onChange={(e) =>
              setData({
                ...data,
                name: e.target.value,
              })
            }
            className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
          />

          <input
            placeholder="Email"
            value={data.email}
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
          />

          <input
            placeholder="phone"
            value={data.phone}
            onChange={(e) =>
              setData({
                ...data,
                phone: e.target.value,
              })
            }
            className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
          />

          <input
            placeholder="company"
            value={data.company}
            onChange={(e) =>
              setData({
                ...data,
                company: e.target.value,
              })
            }
            className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
          />

          <select
            value={data.plan}
            onChange={(e) =>
              setData({
                ...data,
                plan: e.target.value,
              })
            }
            className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
          >
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          <select
            value={data.status}
            onChange={(e) =>
              setData({
                ...data,
                status: e.target.value,
              })
            }
            className="
w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>

          <textarea
            value={data.notes || ""}
            onChange={(e) =>
              setData({
                ...data,
                notes: e.target.value,
              })
            }
            rows="4"
            placeholder="Customer Notes"
            className="
   w-full
p-3
rounded-xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-800
text-slate-900
dark:text-white
            "
          />

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                py-2
                rounded-xl
                border
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                flex-1
                py-2
                rounded-xl
                bg-indigo-600
                text-white
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CRM;
