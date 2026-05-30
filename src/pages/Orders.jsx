import { useState } from "react";
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
  const [showAddModal, setShowAddModal] =
  useState(false);

const [newOrder, setNewOrder] =
  useState({
    customer: "",
    email: "",
    total: "",
    status: "Pending",
  });

  const [orders, setOrders] = useState([
    {
      id: "#1001",
      customer: "John Doe",
      email: "john@example.com",
      total: "$120",
      status: "Pending",
      date: "2026-05-28",
    },
    {
      id: "#1002",
      customer: "Ahmed Ali",
      email: "ahmed@example.com",
      total: "$250",
      status: "Completed",
      date: "2026-05-29",
    },
    {
      id: "#1003",
      customer: "Sarah Smith",
      email: "sarah@example.com",
      total: "$75",
      status: "Cancelled",
      date: "2026-05-30",
    },
  ]);
const [currentPage, setCurrentPage] =
  useState(1);

const ordersPerPage = 5;

  const filteredOrders = orders.filter(
    (o) =>
      (statusFilter === "All" || o.status === statusFilter) &&
      o.customer.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(
  filteredOrders.length /
    ordersPerPage
);

const startIndex =
  (currentPage - 1) *
  ordersPerPage;

const currentOrders =
  filteredOrders.slice(
    startIndex,
    startIndex +
      ordersPerPage
  );
  const handleDeleteOrder = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmed) return;

    setOrders(orders.filter((order) => order.id !== id));
  };


  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status: newStatus,
            }
          : order,
      ),
    );
  };

  const handleAddOrder = () => {
  if (
    !newOrder.customer ||
    !newOrder.email
  )
    return;

  const order = {
    id: `#${Math.floor(
      Math.random() * 10000
    )}`,
    customer: newOrder.customer,
    email: newOrder.email,
    total: `$${newOrder.total}`,
    status: newOrder.status,
    date:
      new Date()
        .toISOString()
        .split("T")[0],
  };

  setOrders([
    order,
    ...orders,
  ]);
  setCurrentPage(1);

  setNewOrder({
    customer: "",
    email: "",
    total: "",
    status: "Pending",
  });

  setShowAddModal(false);
};
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            className="p-5 rounded-3xl border shadow-sm hover:shadow-lg hover:-translate-y-1
hover:border-indigo-500/30
cursor-pointer transition-all bg-gradient-to-br
from-white
to-slate-50
dark:from-slate-900
dark:to-slate-800"
          >
            <stat.icon className={`${stat.color} mb-2`} />
            <h3 className="text-slate-400">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            className="w-full h-12 pl-11 pr-4 rounded-2xl border       bg-white
      dark:bg-slate-900
      focus:ring-2
      focus:ring-indigo-500
      outline-none"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
    h-12
    px-4
    rounded-2xl
    border
    bg-white
    dark:bg-slate-900
    text-slate-700
    dark:text-slate-200
    border-slate-200
    dark:border-slate-700
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
    focus:border-indigo-500
    transition-all
    cursor-pointer
  "
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button className="px-4 h-11 rounded-xl border flex items-center gap-2">
          <Calendar size={18} /> Date
        </button>
        <button
          onClick={() => alert("Export Coming Soon")}
          className="px-4 h-11 rounded-xl bg-slate-900 text-white flex items-center gap-2"
        >
          <FileDown size={18} /> Export
        </button>
        <button
  onClick={() =>
    setShowAddModal(true)
  }
  className="
  px-4
  h-11
  rounded-xl
  bg-indigo-600
  text-white
  flex
  items-center
  gap-2
"
>
  Add Order
</button>
      </div>

      {/* Table */}
      <div className="rounded-3xl border overflow-hidden">
        <table className="overflow-x-auto text-left">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
            <tr>
              {[
                "Customer",
                "Email",
                "Order",
                "Date",
                "Status",
                "Total",
                "Action",
              ].map((h) => (
                <th key={h} className="p-4 font-semibold text-slate-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-indigo-50
dark:hover:bg-slate-800
transition-all
duration-200"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/40?u=${order.id}`}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />

                      <div>
                        <p className="font-semibold">{order.customer}</p>

                        <p className="text-xs text-slate-400">Customer</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{order.email}</td>
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4 font-bold">{order.total}</td>
<td className="p-4 relative">
  <button
    onClick={() =>
      setActiveMenu(
        activeMenu === order.id
          ? null
          : order.id
      )
    }
  >
    <MoreVertical size={20} />
  </button>

  {activeMenu === order.id && (
    <div
      className="
      absolute
      right-0
      mt-2
      w-40
      rounded-2xl
      border
      bg-white
      dark:bg-slate-900
      shadow-xl
      z-50
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
        onClick={() =>
          handleDeleteOrder(
            order.id
          )
        }
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
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <div className="py-20 text-center">
                    <ShoppingCart
                      size={60}
                      className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-4 text-lg font-semibold">
                      No Orders Found Create your first order or change your
                      filters.
                    </h3>

                    <p className="text-slate-400">
                      Create your first order or change your filters..
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl space-y-4">
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
  <div
    className="
    fixed
    inset-0
    bg-black/40
    flex
    items-center
    justify-center
    z-50
  "
  >
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
      <h2 className="text-2xl font-bold mb-6">
        Add Order
      </h2>

      <div className="space-y-4">
        <input
          placeholder="Customer"
          value={newOrder.customer}
          onChange={(e) =>
            setNewOrder({
              ...newOrder,
              customer:
                e.target.value,
            })
          }
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
          "
        />

        <input
          placeholder="Email"
          value={newOrder.email}
          onChange={(e) =>
            setNewOrder({
              ...newOrder,
              email:
                e.target.value,
            })
          }
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
          "
        />

        <input
          placeholder="Total"
          value={newOrder.total}
          onChange={(e) =>
            setNewOrder({
              ...newOrder,
              total:
                e.target.value,
            })
          }
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
          "
        />

        <select
          value={newOrder.status}
          onChange={(e) =>
            setNewOrder({
              ...newOrder,
              status:
                e.target.value,
            })
          }
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
          "
        >
          <option>
            Pending
          </option>

          <option>
            Completed
          </option>

          <option>
            Cancelled
          </option>
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
          onClick={() =>
            setShowAddModal(false)
          }
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
          onClick={
            handleAddOrder
          }
          className="
            px-4
            h-10
            rounded-xl
            bg-indigo-600
            text-white
          "
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
      {/* Pagination */}
     <div className="flex justify-center items-center gap-2 mt-6">

  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(
        currentPage - 1
      )
    }
    className="
      px-4 py-2
      rounded-lg
      border
      disabled:opacity-50
    "
  >
    Previous
  </button>

  {Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).map((page) => (
    <button
      key={page}
      onClick={() =>
        setCurrentPage(page)
      }
      className={`w-10 h-10 rounded-lg transition-all ${
        currentPage === page
          ? "bg-indigo-600 text-white"
          : "border"
      }`}
    >
      {page}
    </button>
  ))}

  <button
    disabled={
      currentPage === totalPages
    }
    onClick={() =>
      setCurrentPage(
        currentPage + 1
      )
    }
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
    </div>
  );
}
export default Orders;
