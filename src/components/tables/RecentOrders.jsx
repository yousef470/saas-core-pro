import useTheme from "../../hooks/useTheme";

const orders = [
  {
    id: "#1024",
    customer: "Ahmed Ali",
    product: "Pro Subscription",
    status: "Completed",
    amount: "$120",
  },
  {
    id: "#1025",
    customer: "Sarah Mohamed",
    product: "CRM Package",
    status: "Pending",
    amount: "$80",
  },
  {
    id: "#1026",
    customer: "John Doe",
    product: "Analytics",
    status: "Completed",
    amount: "$220",
  },
];

function RecentOrders() {
  const { rtl } = useTheme();

  return (
    <div
      className="mt-8 rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="p-6 border-b"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-2xl font-bold">
          {rtl
            ? "أحدث الطلبات"
            : "Recent Orders"}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr
              className="text-left"
              style={{
                color: "var(--text-muted)",
              }}
            >
              <th className="p-5">
                {rtl ? "الطلب" : "Order"}
              </th>

              <th className="p-5">
                {rtl ? "العميل" : "Customer"}
              </th>

              <th className="p-5">
                {rtl ? "المنتج" : "Product"}
              </th>

              <th className="p-5">
                {rtl ? "الحالة" : "Status"}
              </th>

              <th className="p-5">
                {rtl ? "المبلغ" : "Amount"}
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <td className="p-5">
                  {order.id}
                </td>

                <td className="p-5">
                  {order.customer}
                </td>

                <td className="p-5">
                  {order.product}
                </td>

                <td className="p-5">
                  <span className="text-green-500">
                    {rtl
                      ? order.status ===
                        "Completed"
                        ? "مكتمل"
                        : "قيد الانتظار"
                      : order.status}
                  </span>
                </td>

                <td className="p-5">
                  {order.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;