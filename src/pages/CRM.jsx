import { useState, useEffect } from "react";
import useTheme from "../hooks/useTheme";
import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiBriefcase,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
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
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    const matchesPlan = planFilter === "all" || customer.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });
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

  const headers = [
    "Name",
    "Email",
    "Company",
    "Plan",
    "Revenue",
  ];

  const rows = customers.map((c) => [
    c.name,
    c.email,
    c.company,
    c.plan,
    c.revenue,
  ]);

  const csv =
    [
      headers.join(","),
      ...rows.map((r) =>
        r.join(",")
      ),
    ].join("\n");

  const blob = new Blob(
    [csv],
    { type: "text/csv" }
  );

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "customers.csv";

  a.click();
};

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      {/* الهيدر العلوي */}
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
          {lang === "ar" ? "إضافة مستخدم جديد" : "Add New User"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div
          className="
    p-6
    rounded-3xl
    border
    bg-white
    dark:bg-slate-900
    border-slate-200
    dark:border-slate-800
    shadow-sm
    hover:shadow-lg
    transition-all
  "
        >
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Total Customers
          </p>
          <FiUsers className="text-indigo-500 text-lg" />
          <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {totalCustomers}
          </h3>
          <p className="text-emerald-500 text-sm mt-1">+12% this month</p>
        </div>

        <div
          className="
    p-6
    rounded-3xl
    border
    bg-white
    dark:bg-slate-900
    border-slate-200
    dark:border-slate-800
    shadow-sm
    hover:shadow-lg
    transition-all
  "
        >
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Active
          </p>
          <FiDollarSign className="text-indigo-500 text-lg" />
          <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {activeCustomers}
          </h3>
        </div>

        <div
          className="
    p-6
    rounded-3xl
    border
    bg-white
    dark:bg-slate-900
    border-slate-200
    dark:border-slate-800
    shadow-sm
    hover:shadow-lg
    transition-all
  "
        >
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Enterprise
          </p>
          <FiActivity className="text-indigo-500 text-lg" />

          <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {enterpriseCustomers}
          </h3>
        </div>

        <div
          className="
    p-6
    rounded-3xl
    border
    bg-white
    dark:bg-slate-900
    border-slate-200
    dark:border-slate-800
    shadow-sm
    hover:shadow-lg
    transition-all
  "
        >
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Revenue
          </p>
          <FiBriefcase className="text-indigo-500 text-lg" />
          <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            ${totalRevenue}
          </h3>

          <p className="text-emerald-500 text-sm mt-1">+8.5% growth</p>
        </div>
      </div>

      {/* بار البحث والفلترة */}
      <div className="p-3.5 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-center backdrop-blur-md shadow-sm bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن عميل..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 ps-11 pe-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-900/30 focus:outline-none focus:border-indigo-500 transition-all"
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
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["all", "active", "pending", "canceled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 h-10 rounded-xl text-xs font-semibold transition-all shrink-0 ${statusFilter === status ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {status.toUpperCase()}
            </button>
          ))}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="
    h-10
    px-4
    rounded-xl
    border
    border-slate-200
    dark:border-slate-700
    bg-transparent
  "
          >
            <option value="all">All Plans</option>
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>
<div
  className="
  p-5
  rounded-3xl
  border
  border-slate-200
  dark:border-slate-800
  bg-white
  dark:bg-slate-900
"
>
  <h3 className="font-semibold mb-4">
    Recent Activity
  </h3>

  <div className="space-y-3">

    {customers.slice(0,5).map((c)=>(
      <div
        key={c.id}
        className="
        flex
        justify-between
        text-sm
      "
      >
        <span>
          {c.name}
        </span>

        <span
          className="
          text-slate-500
        "
        >
          joined
        </span>
      </div>
    ))}

  </div>
</div>
      {/* الجدول */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-start border-collapse">
          <thead className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4">
                {lang === "ar" ? "المستخدم" : "User"}
              </th>

              <th className="px-6 py-4">{lang === "ar" ? "الخطة" : "Plan"}</th>
              <th className="px-6 py-4">
                {lang === "ar" ? "التاريخ" : "Date"}
              </th>
              <th className="px-6 py-4">{lang === "ar" ? "السعر" : "Price"}</th>
              <th className="px-6 py-4">
                {lang === "ar" ? "الحالة" : "Status"}
              </th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="
      w-10
      h-10
      rounded-full
      object-cover
      "
                    />

                    <div>
                      <p className="font-semibold">{customer.name}</p>

                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getPlanStyle(customer.plan)}`}
                  >
                    {customer.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{customer.date}</td>
                <td className="px-6 py-4 font-bold">${customer.revenue}</td>
                <td className="px-6 py-4">
                  <span
                    className={`
      px-3
      py-1
      rounded-full
      text-xs
      font-semibold
      ${getStatusStyle(customer.status)}
    `}
                  >
                    {customer.status.charAt(0).toUpperCase() +
                      customer.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === customer.id ? null : customer.id)
                    }
                    className="
      p-2
      rounded-lg
      hover:bg-slate-100
      dark:hover:bg-slate-800
    "
                  >
                    <FiMoreVertical />
                  </button>

                  {openMenu === customer.id && (
                    <div
                      className="
        absolute
        right-6
        mt-2
        w-40
        rounded-xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        shadow-xl
        z-50
      "
                    >
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setOpenMenu(null);
                        }}
                        className="
          w-full
          flex
          items-center
          gap-2
          px-4
          py-3
          hover:bg-slate-100
          dark:hover:bg-slate-800
        "
                      >
                        <FiEye />
                        View
                      </button>

                      <button
                        onClick={() => {
                          setEditingCustomer(customer);
                          setOpenMenu(null);
                        }}
                        className="
          w-full
          flex
          items-center
          gap-2
          px-4
          py-3
          hover:bg-slate-100
          dark:hover:bg-slate-800
        "
                      >
                        <FiEdit />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          deleteCustomer(customer.id);
                          setOpenMenu(null);
                        }}
                        className="
          w-full
          flex
          items-center
          gap-2
          px-4
          py-3
          text-red-500
          hover:bg-red-500/10
        "
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  )}
                </td>{" "}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                className="w-full p-3 rounded-xl border"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <input
                placeholder="Company"
                value={formData.company}
                className="w-full p-3 rounded-xl border"
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <select
                value={formData.plan}
                className="w-full p-3 rounded-xl border"
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
              >
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <select
                className="w-full p-3 rounded-xl border"
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

              <button onClick={() => setSelectedCustomer(null)}>✕</button>
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
            value={data.name}
            onChange={(e) =>
              setData({
                ...data,
                name: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl border"
          />

          <input
            value={data.email}
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl border"
          />

          <input
            value={data.phone}
            onChange={(e) =>
              setData({
                ...data,
                phone: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl border"
          />

          <input
            value={data.company}
            onChange={(e) =>
              setData({
                ...data,
                company: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl border"
          />

          <select
            value={data.plan}
            onChange={(e) =>
              setData({
                ...data,
                plan: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl border"
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
            className="w-full p-3 rounded-xl border"
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
