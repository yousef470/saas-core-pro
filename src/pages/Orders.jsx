import { useState, useEffect } from "react";
import {
  ShoppingCart,
  CheckCircle,
  Clock3,
  XCircle,
  MoreVertical,
  Search,
  Calendar,
  FileDown,
} from "lucide-react";
import useTheme from "../hooks/useTheme";
import { motion } from "framer-motion";

import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../services/orderService";

import * as XLSX from "xlsx";

// دالة لتحديد ألوان الـ Status
const getStatusBadge = (status) => {
  const styles = {
    Completed: "bg-green-500/10 text-green-500",
    Pending: "bg-yellow-500/10 text-yellow-500",
    Cancelled: "bg-red-500/10 text-red-500",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
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
const { t } = useTheme();

  const [editModal, setEditModal] = useState(null);

  const [newOrder, setNewOrder] = useState({
    customer: "",
    email: "",
    total: "",
    status: "Pending",
  });

  const [orders, setOrders] = useState(getOrders());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
  if (
    showAddModal ||
    editModal ||
    deleteModal ||
    selectedOrder
  ) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [
  showAddModal,
  editModal,
  deleteModal,
  selectedOrder,
]);
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

  const ordersPerPage = 5;
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;

    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
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

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      updateOrder(id, {
        status: newStatus,
      }),
    );
  };

  const handleAddOrder = () => {
    if (!newOrder.customer || !newOrder.email) return;

    const order = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      customer: newOrder.customer,
      email: newOrder.email,
      total: `$${newOrder.total}`,
      status: newOrder.status,
      date: new Date().toISOString().split("T")[0],
    };

    setOrders(addOrder(order));
    setCurrentPage(1);

    setNewOrder({
      customer: "",
      email: "",
      total: "",
      status: "Pending",
    });

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" p-4"
    >

      <div className="space-y-6"> 
    <div
      className="
  p-4
  sm:p-6
  space-y-6
"
    >
    <div>
    <h1 className="text-3xl font-bold">
       {t.orders}
    </h1>

    <p className="text-slate-500 mt-1">
      Manage customer orders and track their status.
    </p>
  </div>



      {/* Stats Section */}
      <div
        className="
  grid
  grid-cols-1
  sm:grid-cols-2
  xl:grid-cols-4
  gap-5
"
      >
        {[
          {
            label: "Total",
            val: orders.length,
            icon: ShoppingCart,
            color: "text-blue-500",
          },
          {
            label: "Completed",
            val: orders.filter((o) => o.status === "Completed").length,
            icon: CheckCircle,
            color: "text-green-500",
          },
          {
            label: "Pending",
            val: orders.filter((o) => o.status === "Pending").length,
            icon: Clock3,
            color: "text-yellow-500",
          },
          {
            label: "Cancelled",
            val: orders.filter((o) => o.status === "Cancelled").length,
            icon: XCircle,
            color: "text-red-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="
group
relative
overflow-hidden
rounded-3xl
border
border-slate-200/60
dark:border-slate-700

bg-white/90
dark:bg-slate-900/80

backdrop-blur-xl

p-6

hover:shadow-2xl
hover:-translate-y-1

transition-all
duration-300
"
          >
            <div
              className="
  w-12
  h-12
  rounded-2xl
  bg-indigo-500/10
  flex
  items-center
  justify-center
  mb-4
"
            >
              <stat.icon size={24} className={stat.color} />
            </div>
            <h3 className="text-slate-400">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}

      <div className="space-y-4">
        {/* Row 1 */}
        <div
          className="
    flex
    flex-col
    md:flex-row
    gap-3
  "
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
            />

            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search orders..."
              className="
          w-full
          h-12
          pl-11
          pr-4
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          focus:ring-2
          focus:ring-indigo-500
          outline-none
        "
            />
          </div>

          <select
            value={statusFilter}
            onChange={handleStatusChangeFilter}
            className="
    h-12
    min-w-[180px]

    px-4

    rounded-2xl

    border
    border-slate-200
    dark:border-slate-700

    bg-white
    dark:bg-slate-900

    text-slate-700
    dark:text-slate-200

    shadow-sm

    hover:border-indigo-400

    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500

    transition-all
    cursor-pointer
  "
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            className="
        px-4
        h-12
        rounded-2xl
        border
        flex
        items-center
        gap-2
      "
          >
            <Calendar size={18} />
            Date
          </button>
        </div>

        {/* Row 2 */}
        <div
          className="
    flex
    flex-wrap
    gap-3
  "
        >
          <button
            onClick={handleExport}
            disabled={!selectedOrders.length}
            className="
        px-4
        h-11
        rounded-xl
        bg-green-600
        text-white
      "
          >
            Export Selected
          </button>

          <button
            onClick={handleBulkDelete}
            disabled={!selectedOrders.length}
            className="
        px-4
        h-11
        rounded-xl
        bg-red-600
        text-white
      "
          >
            Delete Selected
          </button>

          <button
            onClick={handleExport}
            className="
        px-4
        h-11
        rounded-xl
        bg-slate-900
        text-white
        flex
        items-center
        gap-2
      "
          >
            <FileDown size={18} />
            Export All
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="
       px-4
        h-11
        rounded-xl
        bg-slate-900
        text-white
        flex
        items-center
        gap-2
        
      "
          >
            <FileDown size={18} />
            Add Order
          </button>
        </div>
      </div>



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
        className="
    px-4
    py-2

    rounded-xl

    border
    border-slate-200
    dark:border-slate-700

    bg-white
    dark:bg-slate-900

    hover:border-indigo-500

    transition-all
  "
      >
        {selectedOrders.length === currentOrders.length
          ? "Unselect All"
          : "Select All"}
      </button>

      {/* Table */}
      <div
        className="
  grid
  grid-cols-1
  md:grid-cols-2
  xl:grid-cols-3
  gap-5
"
      >
        {filteredOrders.length > 0 ? (
          currentOrders.map((order) => (
            <div
              key={order.id}
              className="
    w-full
    h-[270px]

    p-5
    rounded-3xl
    border

    bg-white
    dark:bg-slate-900

    shadow-sm
    hover:shadow-lg

    transition-all
  "
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/50?u=${order.id}`}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders([...selectedOrders, order.id]);
                      } else {
                        setSelectedOrders(
                          selectedOrders.filter((id) => id !== order.id),
                        );
                      }
                    }}
                    className="
w-5
h-5

rounded-md

border-slate-300
dark:border-slate-600

text-indigo-600

focus:ring-2
focus:ring-indigo-500

cursor-pointer
"
                  />
                  <div>
                    <h3 className="font-semibold">{order.customer}</h3>

                    <p className="text-sm text-slate-400">{order.email}</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === order.id ? null : order.id)
                  }
                  className="relative"
                >
                  <MoreVertical size={20} />

                  {activeMenu === order.id && (
                    <div
                      className="
                absolute
                right-0
                top-8
                w-40
                rounded-2xl
                border
                bg-white
                dark:bg-slate-900
                shadow-xl
               z-[99999]
              "
                    >
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setActiveMenu(null);
                        }}
                        className="
                    w-full
                    text-left
                    px-4
                    py-3
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                  "
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setEditModal(order);
                          setActiveMenu(null);
                        }}
                        className="
    w-full
    text-left
    px-4
    py-3
    hover:bg-slate-100
    dark:hover:bg-slate-800
  "
                      >
                        Edit Order
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="
                    w-full
                    text-left
                    px-4
                    py-3
                    text-red-500
                    hover:bg-red-500/10
                  "
                      >
                        Delete Order
                      </button>
                    </div>
                  )}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID</span>

                  <span>{order.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>

                  <span>{order.date}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="
                px-3
                py-2
                rounded-xl
                border
                bg-white
                dark:bg-slate-900
                text-sm
              "
                  >
                    <option value="Pending">Pending</option>

                    <option value="Completed">Completed</option>

                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Total</span>

                  <span className="font-bold text-indigo-600">
                    {order.total}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <ShoppingCart size={60} className="mx-auto text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold">No Orders Found</h3>

            <p className="text-slate-400">
              Create your first order or change your filters.
            </p>
          </div>
        )}
      </div>
             </div>
              </div>

      {/* Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[99999] "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={`https://i.pravatar.cc/60?u=${selectedOrder.id}`}
                alt=""
                className="w-14 h-14 rounded-full"
              />

              <div>
                <h3 className="font-bold text-lg">{selectedOrder.customer}</h3>

                <p className="text-slate-400">{selectedOrder.email}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold">Order Details</h2>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span>Customer</span>
                <span className="font-semibold">{selectedOrder.customer}</span>
              </div>

              <div className="flex justify-between">
                <span>Email</span>
                <span>{selectedOrder.email}</span>
              </div>

              <div className="flex justify-between">
                <span>Order ID</span>
                <span>{selectedOrder.id}</span>
              </div>

              <div className="flex justify-between">
                <span>Date</span>
                <span>{selectedOrder.date}</span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold">{selectedOrder.total}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showAddModal && (
<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">      
   <div
            className="
    w-full
    max-w-md

    rounded-3xl

    bg-white/95
    dark:bg-slate-900/95

    backdrop-blur-xl

    border
    border-slate-200
    dark:border-slate-700

    p-6

    shadow-2xl
  "
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Add New Order</h2>

              <p className="text-sm text-slate-400 mt-1">
                Create a new customer order.
              </p>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Customer"
                value={newOrder.customer}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    customer: e.target.value,
                  })
                }
                className="
w-full
h-12

px-4

rounded-2xl

border
border-slate-200
dark:border-slate-700

bg-slate-50
dark:bg-slate-800

focus:ring-2
focus:ring-indigo-500

outline-none
transition-all
"
              />

              <input
                placeholder="Email"
                value={newOrder.email}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    email: e.target.value,
                  })
                }
                className="
w-full
h-12

px-4

rounded-2xl

border
border-slate-200
dark:border-slate-700

bg-slate-50
dark:bg-slate-800

focus:ring-2
focus:ring-indigo-500

outline-none
transition-all
"
              />

              <input
                placeholder="Total"
                value={newOrder.total}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    total: e.target.value,
                  })
                }
                className="
w-full
h-12

px-4

rounded-2xl

border
border-slate-200
dark:border-slate-700

bg-slate-50
dark:bg-slate-800

focus:ring-2
focus:ring-indigo-500

outline-none
transition-all
"
              />

              <select
                value={newOrder.status}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    status: e.target.value,
                  })
                }
                className="
w-full
h-12

px-4

rounded-2xl

border
border-slate-200
dark:border-slate-700

bg-slate-50
dark:bg-slate-800

focus:ring-2
focus:ring-indigo-500

outline-none
transition-all
"
              >
                <option>Pending</option>

                <option>Completed</option>

                <option>Cancelled</option>
              </select>
            </div>

            <div
              className="
        flex
        justify-end
        gap-3
        mt-6
      "
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="
px-5
h-11
rounded-xl
border
border-slate-300
dark:border-slate-700
"
              >
                Cancel
              </button>

              <button
                onClick={handleAddOrder}
                className="
px-5
h-11
rounded-xl
bg-indigo-600
text-white
hover:bg-indigo-700
transition
"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className="
        w-full
        max-w-md

        rounded-3xl

        bg-white
        dark:bg-slate-900

        p-6

        shadow-2xl
      "
          >
            <h2 className="text-xl font-bold">Delete Order</h2>

            <p className="mt-3 text-slate-400">
              Are you sure you want to delete order {deleteModal.id} ?
            </p>

            <div
              className="
          flex
          justify-end
          gap-3
          mt-6
        "
            >
              <button
                onClick={() => setDeleteModal(null)}
                className="
              px-4
              h-10
              rounded-xl
              border
            "
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setOrders(deleteOrder(deleteModal.id));

                  setDeleteModal(null);
                }}
                className="
              px-4
              h-10
              rounded-xl

              bg-red-600
              text-white
            "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className="
        w-full
        max-w-md

        rounded-3xl

        bg-white
        dark:bg-slate-900

        border
        border-slate-200
        dark:border-slate-700

        p-6

        shadow-2xl
      "
          >
            <h2 className="text-2xl font-bold mb-5">Edit Order</h2>

            <div className="space-y-4">
              <input
                value={editModal.customer}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    customer: e.target.value,
                  })
                }
                className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-slate-50
            dark:bg-slate-800
          "
              />

              <input
                value={editModal.email}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    email: e.target.value,
                  })
                }
                className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-slate-50
            dark:bg-slate-800
          "
              />

              <input
                value={editModal.total}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    total: e.target.value,
                  })
                }
                className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-slate-50
            dark:bg-slate-800
          "
              />


              <select
                value={editModal.status}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    status: e.target.value,
                  })
                }
                className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-slate-50
            dark:bg-slate-800
          "
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="
            px-5
            h-11
            rounded-xl
            border
          "
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateOrder}
                className="
            px-5
            h-11
            rounded-xl
            bg-indigo-600
            text-white
          "
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      <div className="mt-8 border-t border-slate-700 pt-6 flex justify-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="
      px-4 py-2
      rounded-lg
      border
      disabled:opacity-50
    "
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-lg transition-all ${
              currentPage === page ? "bg-indigo-600 text-white" : "border"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="
      px-4 py-2
      rounded-lg
      border
      disabled:opacity-50
    "
        >
          Next
        </button>
      </div>
  
    </motion.div>
  );
}
export default Orders;





