import { useState } from "react";
import {
  Search,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  RotateCcw,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

function Products() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState(getProducts());
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 6;

  // فلاتر المنتجات
  const filteredProducts = products.filter((product) => {
    const searchMatch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.id.toString().includes(search);

    const statusMatch = statusFilter === "all" || product.status === statusFilter;
    return searchMatch && statusMatch;
  });

  // الترتيب
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price") {
      return (
        Number(b.price.replace("$", "")) - Number(a.price.replace("$", ""))
      );
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    if (sortBy === "stock") {
      return b.stock - a.stock;
    }
    return a.name.localeCompare(b.name);
  });

  // التقسيم لصفحات
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;

  const showToastMessage = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleAddProduct = () => {
    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      Number(newProduct.price) <= 0 ||
      Number(newProduct.stock) < 0
    )
      return;

    // تم إنشاء الثوابت الديناميكية هنا لحل مشكلة الـ Purity
    const currentId = Date.now();
    const currentDateString = new Date().toLocaleDateString();

    const product = {
      id: currentId,
      image: imagePreview || "https://picsum.photos/100",
      name: newProduct.name,
      category: newProduct.category,
      price: `$${newProduct.price}`,
      stock: Number(newProduct.stock),
      status: Number(newProduct.stock) > 0 ? "Active" : "Out of Stock",
      updated: currentDateString,
    };

    setProducts(addProduct(product));
    setNewProduct({ name: "", category: "", price: "", stock: "" });
    setImagePreview(null);
    setShowAddModal(false);
    showToastMessage("Product Added Successfully");
  };

  const handleDeleteProduct = (id) => {
    setProducts(deleteProduct(id));
    showToastMessage("Product Deleted Successfully");
  };

  // حل مشكلة الدالة غير المعرفة بنجاح وإضافة const
  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = () => {
    const currentDateString = new Date().toLocaleDateString();
    
    const updatedProduct = {
      ...editingProduct,
      updated: currentDateString,
      status: editingProduct.stock > 0 ? "Active" : "Out of Stock",
    };

    setProducts(updateProduct(updatedProduct));
    setEditingProduct(null);
    showToastMessage("Product Updated Successfully");
  };

  const revenue = products.reduce(
    (total, product) =>
      total + Number(product.price.replace("$", "")) * product.stock,
    0
  );

  const handleExport = () => {
    const headers = "ID,Name,Category,Price,Stock,Status,Updated\n";
    const rows = products
      .map(
        (p) => `${p.id},${p.name},${p.category},${p.price},${p.stock},${p.status},${p.updated}`
      )
      .join("\n");

    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-slate-100"
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl z-50 text-sm font-medium flex items-center gap-2">
          <span>✅</span> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage all products from one place
          </p>
        </div>
      </div>

      {/* =========================================
          STATS CARDS
      ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Products */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Total Products</p>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Package size={18} />
            </div>
          </div>
          <h3 className="mt-4 text-2xl sm:text-3xl font-semibold">{products.length}</h3>
        </div>

        {/* Active Products */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Active Products</p>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle size={18} />
            </div>
          </div>
          <h3 className="mt-4 text-2xl sm:text-3xl font-semibold">
            {products.filter((p) => p.status === "Active").length}
          </h3>
        </div>

        {/* Out Of Stock */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Out Of Stock</p>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <AlertCircle size={18} />
            </div>
          </div>
          <h3 className="mt-4 text-2xl sm:text-3xl font-semibold">
            {products.filter((p) => p.status === "Out of Stock").length}
          </h3>
        </div>

        {/* Inventory Value */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Inventory Value</p>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="mt-4 text-2xl sm:text-3xl font-semibold">${revenue.toLocaleString()}</h3>
        </div>
      </div>

      {/* =========================================
          Toolbar
      ========================================= */}
      <div className="sticky top-4 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-11 pl-11 pr-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 "
            />
          </div>

          {/* Action & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-start sm:justify-end">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 flex-1 sm:flex-none min-w-[120px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Out of Stock">Out Of Stock</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 flex-1 sm:flex-none min-w-[120px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="status">Status</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setSortBy("name");
                setCurrentPage(1);
              }}
              title="Reset Filters"
              className="h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-slate-500"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={() => handleExport()}
              className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm font-medium flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Download size={16} />
              <span className="hidden xs:inline">Export</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-md hover:opacity-9 w-full sm:w-auto flex items-center justify-center gap-1.5 order-first sm:order-last"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

        </div>
      </div>

      {/* Info Label */}
      <div className="text-xs sm:text-sm text-slate-500 px-1">
        Showing <span className="font-semibold text-slate-700 dark:text-white">{currentProducts.length}</span> of{" "}
        <span className="font-semibold text-slate-700 dark:text-white">{filteredProducts.length}</span> products
      </div>

      {/* =========================================
          PRODUCT TABLE & CARDS (FULLY RESPONSIVE)
      ========================================= */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-transparent md:bg-white md:dark:bg-slate-900 shadow-none md:shadow-sm overflow-hidden">
        
        {/* 1. الموبايل: يظهر كـ Cards ويختفي على الشاشات الكبيرة */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Package size={40} className="text-slate-300 dark:text-slate-700 mb-3 mx-auto" />
              <h3 className="font-semibold text-sm">No Products Found</h3>
            </div>
          ) : (
            currentProducts.map((product) => (
              <div 
                key={product.id} 
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
              >
                {/* الرأس: الصورة، الاسم، والـ Status */}
                <div className="flex items-start gap-3">
                  <img
                    src={product.image}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">ID: #{product.id}</p>
                    <span className="text-[11px] font-medium text-slate-500 block mt-1">
                      Category: <span className="text-slate-700 dark:text-slate-300">{product.category}</span>
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      product.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* تفاصيل السعر والمخزون */}
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-medium">Price</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px] uppercase font-medium">Stock</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{product.stock} items</p>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* أزرار التحكم مفرودة بالكامل وتسهل الضغط بالإصبع */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-xs transition text-center"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 font-medium text-xs transition text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setProductToDelete(product)}
                    className="h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-medium text-xs transition text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. الديسكتوب: جدول تقليدي يظهر فقط من أول الشاشات المتوسطة md فما فوق */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full min-w-full border-collapse text-left table-auto">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                      <div className="truncate max-w-[180px]">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        product.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                    {product.updated || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="px-2.5 py-1.5 rounded-lg text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="px-2.5 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          Pagination
      ========================================= */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed text-sm shadow-sm"
        >
          ←
        </button>
        <span className="text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={indexOfLast >= sortedProducts.length}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed text-sm shadow-sm"
        >
          →
        </button>
      </div>
      {/* =========================================
          MODALS & OVERLAYS (RESPONSIVE POPUPS)
      ========================================= */}
      
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Add Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
              />
              <input
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
              />
              <input
                placeholder="Price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
              />
              <input
                placeholder="Stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
              />
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium block">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-slate-300"
                />
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-700 mt-2"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 h-11 text-sm rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock}
                className="px-5 h-11 text-sm rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl overflow-hidden">
            <img
              src={selectedProduct.image}
              alt=""
              className="w-full h-40 object-cover rounded-xl mb-4 border border-slate-100 dark:border-slate-800"
            />
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {selectedProduct.id}</p>
                </div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedProduct.status === "Active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {selectedProduct.status}
                </span>
              </div>
              <hr className="border-slate-100 dark:border-slate-800" />
              <div className="grid grid-cols-2 gap-y-2 text-slate-500 dark:text-slate-400">
                <div>Category:</div>
                <div className="text-slate-900 dark:text-white font-medium text-right">{selectedProduct.category}</div>
                <div>Price:</div>
                <div className="text-slate-900 dark:text-white font-semibold text-right">{selectedProduct.price}</div>
                <div>Stock Quantity:</div>
                <div className="text-slate-900 dark:text-white font-medium text-right">{selectedProduct.stock} items</div>
                <div>Last Updated:</div>
                <div className="text-slate-900 dark:text-white text-xs text-right">{selectedProduct.updated}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium mt-5 text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Name</label>
                <input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Category</label>
                <input
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Price</label>
                <input
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Status Override</label>
                <select
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 h-11 text-sm rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 h-11 text-sm rounded-xl bg-indigo-600 text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-xl">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Delete Product</h2>
            <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{productToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 h-11 text-sm rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete.id)}
                className="flex-1 h-11 text-sm rounded-xl bg-red-600 text-white font-medium transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Products;