const orders = [
  {
    id: "#1024",
    customer: "John Smith",
    product: "Pro Subscription",
    amount: "$120",
    status: "Paid",
  },
  {
    id: "#1025",
    customer: "Sarah Johnson",
    product: "Starter Plan",
    amount: "$80",
    status: "Pending",
  },
  {
    id: "#1026",
    customer: "Michael Brown",
    product: "Enterprise Plan",
    amount: "$320",
    status: "Paid",
  },
  {
    id: "#1027",
    customer: "Emma Wilson",
    product: "Business Plan",
    amount: "$210",
    status: "Refunded",
  },
];

function RecentOrders() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8 overflow-x-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold">
          Recent Orders
        </h3>

        <p className="text-slate-400 text-sm">
          Latest customer purchases
        </p>
      </div>

      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="text-left border-b border-slate-800">
            <th className="pb-4 text-slate-400 font-medium">
              Order ID
            </th>

            <th className="pb-4 text-slate-400 font-medium">
              Customer
            </th>

            <th className="pb-4 text-slate-400 font-medium">
              Product
            </th>

            <th className="pb-4 text-slate-400 font-medium">
              Amount
            </th>

            <th className="pb-4 text-slate-400 font-medium">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-slate-800 hover:bg-slate-800/40 transition"
            >
              <td className="py-5 font-medium">
                {order.id}
              </td>

              <td className="py-5">
                {order.customer}
              </td>

              <td className="py-5 text-slate-300">
                {order.product}
              </td>

              <td className="py-5">
                {order.amount}
              </td>

              <td className="py-5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    order.status === "Paid"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : order.status === "Pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrders;