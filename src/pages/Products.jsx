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

import { motion } from "framer-motion";
import { Download } from "lucide-react";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";



function Products() {

  
  const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
  useState("all");
const [sortBy, setSortBy] =
  useState("name");

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
 const [products, setProducts] =
  useState(getProducts());

  const [imagePreview, setImagePreview] =
  useState(null);

const filteredProducts = products.filter(
  (product) => {
const searchMatch =
product.name
.toLowerCase()
.includes(search.toLowerCase())
||
product.category
.toLowerCase()
.includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all" ||
      product.status === statusFilter;

    return searchMatch && statusMatch;
  }
);

const sortedProducts =
  [...filteredProducts].sort(
    (a, b) => {

      if (sortBy === "price") {
        return (
          Number(
            b.price.replace("$", "")
          ) -
          Number(
            a.price.replace("$", "")
          )
        );
      }
          if (sortBy === "status") {
  return a.status.localeCompare(
    b.status
  );
}

      if (sortBy === "stock") {
        return b.stock - a.stock;
      }

      return a.name.localeCompare(
        b.name
      );
    }

  );
  


  const handleAddProduct = () => {
if (
 !newProduct.name.trim() ||
 !newProduct.price ||
 Number(newProduct.price) <= 0 ||
 Number(newProduct.stock) < 0
)
return;

  const product = {
    id: Date.now(),
    image: imagePreview ||
"https://picsum.photos/100",
    name: newProduct.name,
    category: newProduct.category,
    price: `$${newProduct.price}`,
    stock: Number(newProduct.stock),
    status:
  Number(newProduct.stock) > 0
    ? "Active"
    : "Out of Stock",
  };

  setProducts(addProduct(product));

  setNewProduct({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  setImagePreview(null);


  setShowAddModal(false);
};
const [productToDelete, setProductToDelete] =
  useState(null);

const handleDeleteProduct = (id) => {
  setProducts(deleteProduct(id));
};

const handleEditProduct = (product) => {
  setEditingProduct(product);
};

const handleSaveEdit = () => {
const updatedProduct = {
  ...editingProduct,
  status:
    editingProduct.stock > 0
      ? "Active"
      : "Out of Stock",
};

setProducts(
  updateProduct(updatedProduct)
);



  setProducts(
    products.map((product) =>
      product.id === editingProduct.id
        ? editingProduct
        : product
    )
  );

  setEditingProduct(null);
};

const revenue = products.reduce(
  (total, product) =>
    total +
    Number(product.price.replace("$", "")) *
      product.stock,
  0
);

const [selectedProduct,
setSelectedProduct] =
useState(null);



const [currentPage,
setCurrentPage] = useState(1);

const itemsPerPage = 6;

const indexOfLast =
currentPage * itemsPerPage;

const indexOfFirst =
indexOfLast - itemsPerPage;

const currentProducts =
sortedProducts.slice(
  indexOfFirst,
  indexOfLast
);

const totalPages =
Math.ceil(
  sortedProducts.length /
  itemsPerPage
);


const handleExport = () => {
  const headers =
    "ID,Name,Category,Price,Stock,Status\n";

  const rows = products
    .map(
      (p) =>
        `${p.id},${p.name},${p.category},${p.price},${p.stock},${p.status}`
    )
    .join("\n");

  const csv = headers + rows;

  const blob = new Blob([csv], {
    type: "text/csv",
  });

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;
  a.download = "products.csv";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
};


  return (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" p-4 "
    >

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


      </div>



           {/* =========================================
    STATS CARDS
========================================= */}       
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">



 {/* total product*/}
  <div className=" h-full
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
">
    <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-slate-500">
      Total Products
    </p>

       <div className="p-2 rounded-xl bg-indigo-500/10">
       
      <Package  className="text-indigo-500 text-lg" />
      </div>

    </div>
    
          <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
     {products.length}
    </h3>

  </div>

  {/* Active product */}

  <div className=" h-full
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
">

    <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-slate-500">
      Active Products
    </p>

<div className="p-2 rounded-xl bg-emerald-500/10">
  <CheckCircle className="text-emerald-500" size={20} />
</div>
            </div>


        <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
           {
          products.filter(
            (p) => p.status === "Active"
          ).length
        }
    </h3>
  

  </div>

 {/* out of the stock */}


  <div className=" h-full
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
">
    <div className="flex items-center justify-between">

          <p className="text-xs uppercase tracking-wider text-slate-500">
      Out Of Stock
    </p>
     
<div className="p-2 rounded-xl bg-red-500/10">
  <AlertCircle className="text-red-500" size={20} />
</div>

    </div>

          <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
             {
          products.filter(
            (p) =>
              p.status === "Out of Stock"
          ).length
        }
    </h3>
  
  </div>

 {/* Revenue */}

  <div className=" h-full
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
">
    <div className="flex items-center justify-between">

          <p className="text-xs uppercase tracking-wider text-slate-500">
      Inventory Value
    </p>
      <div className="p-2 rounded-xl bg-emerald-500/10">
        < DollarSign  className="text-emerald-500 text-lg" />
      </div>



    </div>

      <span className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
        ${revenue.toLocaleString()}
      </span>


  </div>
</div>

        {/* =========================================
    SEARCH and Filters
========================================= */}

  
  
<div
  className="
    bg-white
    dark:bg-slate-900
    border
    border-slate-200
    dark:border-slate-800
    rounded-2xl
    p-5
    shadow-sm
  "
>
  <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">

    {/* Search */}
    <div className="relative w-full lg:max-w-md">
      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-indigo-500
        "
      />

      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search products..."
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
    </div>

    {/* Filters */}
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
        p-2
        rounded-2xl
        border
        border-slate-200
        dark:border-slate-700
        bg-slate-50
        dark:bg-slate-800
      "
    >
      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="
          h-11
          px-4
          rounded-xl
          border
          border-slate-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
        "
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
        className="
          h-11
          px-4
          rounded-xl
          border
          border-slate-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
        "
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
        className="
          h-11
          px-4
          rounded-xl
          border
          border-slate-300
          hover:bg-slate-100
          dark:hover:bg-slate-700
          transition
        "
      >
        Reset
      </button>
    </div>

  </div>
</div>


            {/* =========================================
   Button 
========================================= */}


<div className="flex gap-3 mt-4">

  <button
    onClick={() =>
      setShowAddModal(true)
    }
    className="
      flex items-center gap-2
      px-5 h-12
      rounded-2xl
      bg-gradient-to-r
      from-indigo-600
      to-violet-600
      text-white
      font-medium
    "
  >
    <Plus size={18} />
    Add Product
  </button>

  <button
    onClick={handleExport}
    className="
      flex items-center gap-2
      px-5 h-12
      rounded-2xl
      bg-emerald-600
      text-white
      font-medium
    "
  >
    <Download size={18} />
    Export
  </button>

</div>






            {/* =========================================
    PRODUCT GRID
========================================= */}

     

        
<div
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

  
  {filteredProducts.length === 0 ? (
    
    <div className="col-span-full text-center py-20 text-slate-400">
      No Products Found
    </div>
  ) : (
    currentProducts.map((product) => (
      <div
        key={product.id}

className="
bg-white
dark:bg-slate-900
p-5
rounded-3xl
border
border-slate-200
dark:border-slate-800
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div>
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-sm text-slate-400">Category: {product.category}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 text-sm">
          <div>
            <p className="text-slate-400">Price</p>
            <p className="font-semibold">{product.price}</p>
          </div>
          <div>
            <p className="text-slate-400">Stock</p>
            <p className="font-semibold">{product.stock}</p>
          </div>
          <div>
            <p className="text-slate-400">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                product.status === "Active"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">

<button
  onClick={(e) => {
    e.stopPropagation();
    setSelectedProduct(product);
  }}
  className="
  flex-1
  flex
  items-center
  justify-center
  gap-2
  py-2.5
  rounded-xl
  bg-slate-500/10
  text-slate-500
  hover:bg-slate-500/20
  transition-all
  font-medium
"
>
  View
</button>

<button
  onClick={() => handleEditProduct(product)}
  className="
  flex-1
  flex
  items-center
  justify-center
  gap-2
  py-2.5
  rounded-xl
  bg-indigo-500/10
  text-indigo-500
  hover:bg-indigo-500/20
  transition-all
  font-medium
"
>
            <Edit size={16} /> Edit
          </button>


<button
  onClick={() => setProductToDelete(product)}
  className="
  flex-1
  flex
  items-center
  justify-center
  gap-2
  py-2.5
  rounded-xl
  bg-red-500/10
  text-red-500
  hover:bg-red-500/20
  transition-all
  font-medium
"
>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>

      </div>

                  {/* =========================================
    Pagination
========================================= */}
<div className="flex justify-center gap-2 mt-8">

<button
disabled={currentPage === 1}
onClick={() =>
setCurrentPage(
currentPage - 1
)
}
className="
px-4 py-2
rounded-xl
border
"
>
Prev
</button>

<span className="px-4 py-2">
{currentPage} / {totalPages}
</span>

<button
disabled={
indexOfLast >=
sortedProducts.length
}
onClick={() =>
setCurrentPage(
currentPage + 1
)
}
className="
px-4 py-2
rounded-xl
border
"
>
Next
</button>

</div>

            {/* =========================================
    MODALS
========================================= */}
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
        onChange={(e) => {
const file = e.target.files[0];

if (!file) return;

const reader = new FileReader();

reader.onloadend = () => {
  setImagePreview(reader.result);
};

reader.readAsDataURL(file);

}}
          type="file"
          className="w-full"
        />
        {imagePreview && (
  <img
    src={imagePreview}
    alt="preview"
    className="
      w-full
      h-40
      object-cover
      rounded-xl
      border
      mt-2
    "
  />
)}

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

{
selectedProduct && (

<div className="
fixed inset-0
bg-black/50
flex items-center justify-center
z-50
">

<div className="
w-full max-w-lg
bg-white
dark:bg-slate-900
rounded-3xl
p-6
">

<img
  src={selectedProduct.image}
  alt={selectedProduct.name}
  className="
  w-full
  h-48
  object-cover
  rounded-2xl
  mb-5
"
/>

<h2 className="text-2xl font-bold">
  {selectedProduct.name}
</h2>

<p>
Category:
{selectedProduct.category}
</p>

<p>
Price:
{selectedProduct.price}
</p>

<p>
ID:
{selectedProduct.id}
</p>

<p>
Stock:
{selectedProduct.stock}
</p>

<span
className={`
px-3 py-1 rounded-full
text-xs font-bold
${
selectedProduct.status === "Active"
? "bg-green-500/10 text-green-500"
: "bg-red-500/10 text-red-500"
}
`}
>
{selectedProduct.status}
</span>

<button
onClick={() =>
setSelectedProduct(null)
}
className="
w-full
h-11
rounded-xl
bg-indigo-600
text-white
mt-5
"
>
Close
</button>

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

        <input
  value={editingProduct.stock}
  onChange={(e) =>
    setEditingProduct({
      ...editingProduct,
      stock: Number(e.target.value),
    })
  }
  className="w-full h-11 px-4 rounded-xl border bg-transparent"
/>
<select
  value={editingProduct.status}
  onChange={(e) =>
    setEditingProduct({
      ...editingProduct,
      status: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border bg-transparent"
>
  <option>Active</option>
  <option>Out of Stock</option>
</select>



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
{productToDelete && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900">

      <h2 className="font-bold text-lg">
        Delete Product
      </h2>

      <p className="mt-3 text-slate-500">
        Are you sure you want to delete
        {" "}
        {productToDelete.name} ?
      </p>

      <div className="flex gap-2 mt-6">

        <button
          onClick={() =>
            setProductToDelete(null)
          }
          className="flex-1 h-11 rounded-xl border"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            handleDeleteProduct(
              productToDelete.id
            );
            setProductToDelete(null);
          }}
          className="flex-1 h-11 rounded-xl bg-red-600 text-white"
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