import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  CheckCircle,
  Clock3,
  XCircle,
  MoreVertical,
  Search,
  Calendar,
  FileDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import useTheme from "../hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../components/ui/Avatar";

import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../services/orderService";
import * as XLSX from "xlsx";

// دالة تفاعلية ومحسنة لتحديد ألوان الـ Status
const getStatusBadge = (status, t) => {
  const styles = {
    Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${styles[status] || styles.Pending}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status === "Completed"
        ? t.ordersPage.status.completed
        : status === "Pending"
          ? t.ordersPage.status.pending
          : t.ordersPage.status.cancelled}
    </span>
  );
};

function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const { t } = useTheme();

  const [editModal, setEditModal] = useState(null);
  const dateInputRef = useRef(null);

  const [newOrder, setNewOrder] = useState({
    customer: "",
    email: "",
    total: "",
    status: "Pending",
  });

  const [orders, setOrders] = useState(getOrders());
  const [currentPage, setCurrentPage] = useState(1);

  // إغلاق قائمة الخيارات عند الضغط في أي مكان خارجها
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (showAddModal || editModal || deleteModal || selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAddModal, editModal, deleteModal, selectedOrder]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChangeFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const exportData = (
    selectedOrders.length > 0
      ? orders.filter((o) => selectedOrders.includes(o.id))
      : orders
  ).map((order) => ({
    "Order ID": order.id,
    Customer: order.customer,
    Email: order.email,
    Status: order.status,
    Total: order.total,
    Date: order.date,
  }));

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const ordersPerPage = 6; // تم تعديلها لـ 6 لتتناسب تماماً مع شبكة الـ 3 أعمدة (Grid)

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesDate = !selectedDate || o.date === selectedDate;

    return matchesStatus && matchesSearch && matchesDate;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage),
  );
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage,
  );

  const handleDeleteOrder = (id) => {
    setDeleteModal(orders.find((o) => o.id === id));
  };

  const handleBulkDelete = () => {
    if (selectedOrders.length === 0) return;
    const confirmed = window.confirm(`Delete ${selectedOrders.length} orders?`);
    if (!confirmed) return;

    const updatedOrders = orders.filter((o) => !selectedOrders.includes(o.id));
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setSelectedOrders([]);
  };

  const handleAddOrder = () => {
    if (!newOrder.customer || !newOrder.email) return;

    const order = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      customer: newOrder.customer,
      email: newOrder.email,
      total: newOrder.total.startsWith("$")
        ? newOrder.total
        : `$${newOrder.total}`,
      status: newOrder.status,
      date: new Date().toISOString().split("T")[0],
    };

    setOrders(addOrder(order));
    setCurrentPage(1);
    setNewOrder({ customer: "", email: "", total: "", status: "Pending" });
    setShowAddModal(false);
  };

  const handleUpdateOrder = () => {
    setOrders(
      updateOrder(editModal.id, {
        customer: editModal.customer,
        email: editModal.email,
        total: editModal.total,
        status: editModal.status,
      }),
    );
    setEditModal(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 max-w-[1600px] mx-auto "
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-5">
          <div>
            <h1 className="text-3xl font-black tracking-normal bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t.ordersPage.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t.ordersPage.subtitle}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: t.ordersPage.stats.totalOrders,
              val: orders.length,
              icon: ShoppingCart,
              color: "slate bg-slate-200/40 dark:bg-slate-700/30",
            },
            {
              label: t.ordersPage.stats.completed,
              val: orders.filter((o) => o.status === "Completed").length,
              icon: CheckCircle,
              color: "text-emerald-500 bg-emerald-500/10",
            },
            {
              label: t.ordersPage.stats.pending,
              val: orders.filter((o) => o.status === "Pending").length,
              icon: Clock3,
              color: "text-amber-500 bg-amber-500/10",
            },
            {
              label: t.ordersPage.stats.cancelled,
              val: orders.filter((o) => o.status === "Cancelled").length,
              icon: XCircle,
              color: "text-rose-500 bg-rose-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900/40 backdrop-blur-xl p-6 hover:shadow-xl dark:hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                    {stat.label}
                  </h3>
                  <p className="text-3xl font-black tracking-normal mt-1">
                    {stat.val}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${stat.color}`}
                >
                  <stat.icon size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-white/50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-white/5 rounded-3xl p-4 sm:p-6 space-y-4 backdrop-blur-md">
          {/* Row 1: Search & Dynamic Select Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="relative md:col-span-6">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder={t.ordersPage.searchplaceholder}
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={handleStatusChangeFilter}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-indigo-500 transition-all appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  backgroundSize: "16px",
                }}
              >
                <option value="All">{t.ordersPage.filters.allStatuses}</option>
                <option value="Pending">{t.ordersPage.status.pending}</option>
                <option value="Completed">
                  {t.ordersPage.status.completed}
                </option>
                <option value="Cancelled">
                  {t.ordersPage.status.cancelled}
                </option>
              </select>
            </div>

            <div className="relative md:col-span-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dateInputRef.current?.showPicker();
                }}
                className="w-full px-4 h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 hover:border-indigo-500 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span>
                    {selectedDate || t.ordersPage.filters.filterByDate}
                  </span>
                </div>
                {selectedDate && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate("");
                    }}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    {t.ordersPage.filters.clear}
                  </span>
                )}
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
              />
            </div>
          </div>

          {/* Row 2: Bulk Actions & Creation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (
                    currentOrders.length > 0 &&
                    currentOrders.every((o) => selectedOrders.includes(o.id))
                  ) {
                    setSelectedOrders([]);
                  } else {
                    setSelectedOrders(currentOrders.map((o) => o.id));
                  }
                }}
                className="px-4 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-bold hover:border-indigo-500 transition-all"
              >
                {selectedOrders.length === currentOrders.length
                  ? t.ordersPage.bulk.unselectPage
                  : t.ordersPage.actions.selectCurrentPage}
              </button>

              {selectedOrders.length > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={handleExport}
                    className="px-4 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-emerald-600/10"
                  >
                    <FileDown size={14} /> {t.ordersPage.bulk.exportSelected} (
                    {selectedOrders.length})
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-rose-600/10"
                  >
                    <Trash2 size={14} /> {t.ordersPage.bulk.deleteSelected}
                  </button>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
              <button
                onClick={handleExport}
                className="flex-1 sm:flex-none px-4 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <FileDown size={15} /> {t.ordersPage.actions.exportAll}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 sm:flex-none px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10"
              >
                <Plus size={16} /> {t.ordersPage.actions.addOrder}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Orders Dynamic Cards Grid Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          currentOrders.map((order) => {
            const isChecked = selectedOrders.includes(order.id);
            return (
              <div
                key={order.id}
                className={`w-full min-h-[260px] p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative group
                  ${
                    isChecked
                      ? "bg-indigo-600/5 border-indigo-500 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500"
                      : "bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg hover:bg-white dark:hover:bg-slate-900"
                  }
                `}
              >
                {/* Top Section Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Avatar
                        src={order.avatar}
                        name={order.customer}
                        size={48}
                        className="ring-2 ring-slate-100 dark:ring-white/5"
                      />
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order.id]);
                          } else {
                            setSelectedOrders(
                              selectedOrders.filter((id) => id !== order.id),
                            );
                          }
                        }}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-md border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer shadow"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 truncate tracking-normal">
                        {order.customer}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {order.email}
                      </p>
                    </div>
                  </div>

                  {/* الـ Actions Dropdown الزر والقائمة بداخل الكارت */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(
                          activeMenu === order.id ? null : order.id,
                        );
                      }}
                      className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {activeMenu === order.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          onClick={(e) => e.stopPropagation()}
                          // التعديل هنا: استبدال right-0 بـ ltr:right-0 rtl:left-0 لضبط مكان ظهور المنيو حسب لغة الصفحة
                          className="absolute ltr:right-0 rtl:left-0 top-9 w-44 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl dark:shadow-black/40 p-1.5 z-40"
                        >
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setActiveMenu(null);
                            }}
                            // التعديل هنا: تحويل المحاذاة إلى text-start لكي تتكيف تلقائياً مع لغة الصفحة
                            className="w-full text-start px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-200"
                          >
                            {t?.ordersPage?.actions?.view}
                          </button>
                          <button
                            onClick={() => {
                              setEditModal(order);
                              setActiveMenu(null);
                            }}
                            // التعديل هنا: استبدال text-left بـ text-start
                            className="w-full text-start px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-200"
                          >
                            {t?.ordersPage?.actions?.edit}
                          </button>
                          <div className="my-1 border-t border-slate-100 dark:border-white/5" />
                          <button
                            onClick={() => {
                              handleDeleteOrder(order.id);
                              setActiveMenu(null);
                            }}
                            // التعديل هنا: استبدال text-left بـ text-start
                            className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                          >
                            {t?.ordersPage?.actions?.delete}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Details Middle Content Content Info */}
                <div className="my-4 space-y-2.5 border-t border-b border-slate-100 dark:border-white/5 py-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      {t.ordersPage.card.orderId}
                    </span>
                    <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-slate-700 dark:text-slate-300">
                      {order.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      {t.ordersPage.card.placedOn}
                    </span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {order.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      {t.ordersPage.card.currentStatus}
                    </span>
                    {getStatusBadge(order.status, t)}
                  </div>
                </div>

                {/* Bottom Total Container */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-slate-400 font-medium">
                    {t.ordersPage.card.amountDue}
                  </span>
                  <span className="text-lg font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    {order.total}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-300 dark:border-white/10 rounded-[2.5rem] bg-white/30 dark:bg-slate-900/10">
            <ShoppingCart
              size={48}
              className="mx-auto text-slate-300 dark:text-slate-600"
            />
            <h3 className="mt-4 text-base font-bold">
              {t.ordersPage.empty.title}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-xs mx-auto">
              {t.ordersPage.empty.description}
            </p>
          </div>
        )}
      </div>

      {/* Modern Dialog Modals Block View Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-[99999]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/10 space-y-5"
            >
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                <Avatar
                  src={selectedOrder.avatar}
                  name={selectedOrder.customer}
                  size={56}
                />
                <div>
                  <h3 className="font-black text-xl">
                    {selectedOrder.customer}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {selectedOrder.email}
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-black tracking-normal">
                {t.ordersPage.modals.view.title}
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {t.ordersPage.modals.view.orderId}
                  </span>
                  <span className="font-mono font-bold">
                    {selectedOrder.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {t.ordersPage.modals.view.date}
                  </span>
                  <span>{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">
                    {t.ordersPage.modals.view.status}
                  </span>
                  {getStatusBadge(selectedOrder.status, t)}
                </div>
                <div className="border-t border-slate-100 dark:border-white/5 my-2 pt-3 flex justify-between items-center">
                  <span className="font-bold">
                    {t.ordersPage.modals.view.total}
                  </span>
                  <span className="font-black text-lg slate">
                    {selectedOrder.total}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-90 transition-opacity"
              >
                {t.ordersPage.modals.view.close}
              </button>
            </motion.div>
          </div>
        )}

        {/* Dynamic Add Order Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-5"
            >
              <div>
                <h2 className="text-2xl font-black tracking-normal">
                  {t.ordersPage.modals.add.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {t.ordersPage.modals.add.subtitle}
                </p>
              </div>

              <div className="space-y-3.5">
                <input
                  placeholder={t.ordersPage.modals.add.customer}
                  value={newOrder.customer}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customer: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <input
                  placeholder={t.ordersPage.modals.add.email}
                  value={newOrder.email}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, email: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <input
                  placeholder={t.ordersPage.modals.add.total}
                  value={newOrder.total}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, total: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />

                <select
                  value={newOrder.status}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, status: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    backgroundSize: "16px",
                  }}
                >
                  <option>{t.ordersPage.status.pending}</option>
                  <option>{t.ordersPage.status.completed}</option>
                  <option>{t.ordersPage.status.cancelled}</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 h-11 rounded-xl border border-slate-300 dark:border-white/10 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  {t.ordersPage.common.cancel}
                </button>
                <button
                  onClick={handleAddOrder}
                  className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/10 transition-colors"
                >
                  {t.ordersPage.modals.add.save}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Order Modal */}
        {editModal && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-5"
            >
              <h2 className="text-2xl font-black tracking-normal">
                {t.ordersPage.modals.edit.title} #{editModal.id}
              </h2>

              <div className="space-y-3.5">
                <input
                  value={editModal.customer}
                  onChange={(e) =>
                    setEditModal({ ...editModal, customer: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <input
                  value={editModal.email}
                  onChange={(e) =>
                    setEditModal({ ...editModal, email: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <input
                  value={editModal.total}
                  onChange={(e) =>
                    setEditModal({ ...editModal, total: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />

                <select
                  value={editModal.status}
                  onChange={(e) =>
                    setEditModal({ ...editModal, status: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    backgroundSize: "16px",
                  }}
                >
                  <option value="Pending">{t.ordersPage.status.pending}</option>
                  <option value="Completed">
                    {t.ordersPage.status.completed}
                  </option>
                  <option value="Cancelled">
                    {t.ordersPage.status.cancelled}
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="px-5 h-11 rounded-xl border border-slate-300 dark:border-white/10 text-sm font-semibold transition-colors"
                >
                  {t.ordersPage.common.cancel}
                </button>
                <button
                  onClick={handleUpdateOrder}
                  className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/10 transition-colors"
                >
                  {t.ordersPage.common.saveChanges}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Individual Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-[2rem] bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-white/5 shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                <XCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">
                  {t.ordersPage.modals.delete.title}
                </h2>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  {t.ordersPage.modals.delete.description}{" "}
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {deleteModal.id}
                  </span>
                  ? Action cannot be reversed.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold transition-colors"
                >
                  {t.ordersPage.common.cancel}
                </button>
                <button
                  onClick={() => {
                    setOrders(deleteOrder(deleteModal.id));
                    setDeleteModal(null);
                  }}
                  className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/20 transition-colors"
                >
                  {t.ordersPage.modals.delete.confirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pagination Controls Section Footer */}
      {totalPages > 1 && (
        <div className="mt-8 border-t border-slate-200/60 dark:border-white/5 pt-6 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400">
            {t.ordersPage.pagination.showing} {currentPage}{" "}
            {t.ordersPage.pagination.of} {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-500 hover:border-indigo-500 disabled:opacity-40 disabled:hover:border-slate-200 dark:disabled:hover:border-white/10 transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-indigo-500"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-500 hover:border-indigo-500 disabled:opacity-40 disabled:hover:border-slate-200 dark:disabled:hover:border-white/10 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Orders;
