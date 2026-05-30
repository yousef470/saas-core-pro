import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

function Products() {
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

const [newProduct, setNewProduct] = useState({
  name: "",
  category: "",
  price: "",
  stock: "",
});


const [editingProduct, setEditingProduct] =
  useState(null);
  const [products, setProducts] = useState([
    {
      id: 1,
      image: "https://picsum.photos/100?1",
      name: "SaaS Pro Plan",
      category: "Subscription",
      price: "$49",
      stock: 120,
      status: "Active",
    },
    {
      id: 2,
      image: "https://picsum.photos/100?2",
      name: "CRM Package",
      category: "Software",
      price: "$99",
      stock: 45,
      status: "Active",
    },
    {
      id: 3,
      image: "https://picsum.photos/100?3",
      name: "Analytics Suite",
      category: "Software",
      price: "$79",
      stock: 0,
      status: "Out of Stock",
    },
  ]);

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
  if (!newProduct.name) return;

  const product = {
    id: Date.now(),
    image: "https://picsum.photos/100",
    name: newProduct.name,
    category: newProduct.category,
    price: `$${newProduct.price}`,
    stock: Number(newProduct.stock),
    status: "Active",
  };

  setProducts([...products, product]);

  setNewProduct({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  setShowAddModal(false);
};
const handleDeleteProduct = (id) => {
  const confirmed = window.confirm(
    "Delete this product?"
  );

  if (!confirmed) return;

  setProducts(
    products.filter(
      (product) => product.id !== id
    )
  );
};

const handleEditProduct = (product) => {
  setEditingProduct(product);
};

const handleSaveEdit = () => {
  setProducts(
    products.map((product) =>
      product.id === editingProduct.id
        ? editingProduct
        : product
    )
  );

  setEditingProduct(null);
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-slate-400 mt-1">
            Manage all products from one place
          </p>
        </div>

<button
  onClick={() =>
    setShowAddModal(true)
  }
  className="flex items-center gap-2 px-5 h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

  <div className="p-5 rounded-3xl border">
    <div className="flex items-center justify-between">
      <Package />
      <span className="text-2xl font-bold">
        {products.length}
      </span>
    </div>

    <p className="text-slate-400 mt-3">
      Total Products
    </p>
  </div>

  <div className="p-5 rounded-3xl border">
    <div className="flex items-center justify-between">
      <CheckCircle />
      <span className="text-2xl font-bold">
        {
          products.filter(
            (p) => p.status === "Active"
          ).length
        }
      </span>
    </div>

    <p className="text-slate-400 mt-3">
      Active Products
    </p>
  </div>

  <div className="p-5 rounded-3xl border">
    <div className="flex items-center justify-between">
      <AlertCircle />
      <span className="text-2xl font-bold">
        {
          products.filter(
            (p) =>
              p.status === "Out of Stock"
          ).length
        }
      </span>
    </div>

    <p className="text-slate-400 mt-3">
      Out Of Stock
    </p>
  </div>

  <div className="p-5 rounded-3xl border">
    <div className="flex items-center justify-between">
      <DollarSign />
      <span className="text-2xl font-bold">
        $12.4K
      </span>
    </div>

    <p className="text-slate-400 mt-3">
      Revenue
    </p>
  </div>

</div>

<input
  type="text"
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  placeholder="Search products..."
  className="w-full h-12 pl-11 pr-4 rounded-2xl border bg-transparent outline-none"
/>
      </div>

      {/* Table */}
      <div className="rounded-3xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-900">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
          {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t"
              >
<td className="p-4">
  <div className="flex items-center gap-3">

    <img
      src={product.image}
      alt=""
      className="w-12 h-12 rounded-xl object-cover"
    />

    <div>
      <p className="font-semibold">
        {product.name}
      </p>

      <p className="text-xs text-slate-400">
        Product #{product.id}
      </p>
    </div>

  </div>
</td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4">
                  {product.price}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
<button
  onClick={() =>
    handleEditProduct(product)
  }
  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
>
                      <Edit size={16} />
                    </button>

<button
  onClick={() =>
    handleDeleteProduct(product.id)
  }
  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Add Product
        </h2>

        <button
          onClick={() =>
            setShowAddModal(false)
          }
        >
          <X />
        </button>
      </div>

      <div className="space-y-4">

<input
  placeholder="Product Name"
  value={newProduct.name}
  onChange={(e) =>
    setNewProduct({
      ...newProduct,
      name: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border bg-transparent"
/>


<input
  placeholder="Category"
  value={newProduct.category}
  onChange={(e) =>
    setNewProduct({
      ...newProduct,
      category: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border bg-transparent"
/>


<input
  placeholder="Price"
  value={newProduct.price}
  onChange={(e) =>
    setNewProduct({
      ...newProduct,
      price: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border bg-transparent"
/>
<input
  placeholder="Stock"
  value={newProduct.stock}
  onChange={(e) =>
    setNewProduct({
      ...newProduct,
      stock: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border bg-transparent"
/>

        <input
          type="file"
          className="w-full"
        />

      </div>



      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setShowAddModal(false)
          }
          className="px-4 h-10 rounded-xl border"
        >
          Cancel
        </button>

<button
  onClick={handleAddProduct}
  className="px-4 h-10 rounded-xl bg-indigo-600 text-white"
>
          Save Product
        </button>

      </div>

    </div>

  </div>
)}
{editingProduct && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Edit Product
        </h2>

        <button
          onClick={() =>
            setEditingProduct(null)
          }
        >
          <X />
        </button>
      </div>

      <div className="space-y-4">

        <input
          value={editingProduct.name}
          onChange={(e) =>
            setEditingProduct({
              ...editingProduct,
              name: e.target.value,
            })
          }
          className="w-full h-11 px-4 rounded-xl border bg-transparent"
        />

        <input
          value={editingProduct.category}
          onChange={(e) =>
            setEditingProduct({
              ...editingProduct,
              category: e.target.value,
            })
          }
          className="w-full h-11 px-4 rounded-xl border bg-transparent"
        />

        <input
          value={editingProduct.price}
          onChange={(e) =>
            setEditingProduct({
              ...editingProduct,
              price: e.target.value,
            })
          }
          className="w-full h-11 px-4 rounded-xl border bg-transparent"
        />

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setEditingProduct(null)
          }
          className="px-4 h-10 rounded-xl border"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveEdit}
          className="px-4 h-10 rounded-xl bg-indigo-600 text-white"
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default Products;