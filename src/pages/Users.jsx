import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useTheme from "../hooks/useTheme";
import { Plus, Search, Shield, Trash2, Edit2 } from "lucide-react";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";

function Users() {
  const { lang } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");



const [users, setUsers] = useState(getUsers());


useEffect(() => {
  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );
}, [users]);

  const [showAddModal, setShowAddModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);
  // فلترة المستخدمين بناءً على البحث
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const [newUser, setNewUser] = useState({
  name: "",
  email: "",
  role: "User",
  status: "Active",
});

const handleAddUser = () => {
  if (!newUser.name || !newUser.email) return;

  const user = {
    id: Date.now(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
    avatar: newUser.name.charAt(0).toUpperCase(),
  };

setUsers(addUser(user));

  setNewUser({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });

  setShowAddModal(false);
};

const handleDeleteUser = () => {
setUsers(
  deleteUser(userToDelete.id)
);

setUserToDelete(null);
};

const handleEditUser = () => {
 setUsers(updateUser(editingUser));
  

  setEditingUser(null);
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* هيدر الصفحة والـ Action الرئيسي */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {lang === "ar" ? "إدارة المستخدمين" : "User Management"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === "ar"
              ? "إدارة أعضاء الفريق، الصلاحيات وحالات الحسابات ديناميكياً."
              : "Manage team members, roles, and account statuses dynamically."}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="
w-full
sm:w-auto
h-11
px-4
rounded-xl
bg-indigo-600
hover:bg-indigo-700
text-white
font-medium
text-sm
flex
items-center
justify-center
gap-2
transition-all
shadow-lg
shadow-indigo-600/15
"
        >
          <Plus size={18} />
          <span>{lang === "ar" ? "إضافة مستخدم جديد" : "Add New User"}</span>
        </button>
      </div>
      

      {/* شريط أدوات البحث والفلترة بتصميم زجاجي ناعم */}
      <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div
          className="
w-full
max-w-md mx-4
flex
items-center
gap-2
px-3
py-2
rounded-xl
border
border-slate-200
dark:border-slate-800
bg-slate-50
dark:bg-slate-950/50
"
        >
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === "ar"
                ? "البحث عن اسم أو بريد إلكتروني..."
                : "Search name or email..."
            }
            className="bg-transparent outline-none text-sm w-full text-slate-800 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>
      <div
        className="grid grid-cols-1
sm:grid-cols-2
xl:grid-cols-4 gap-4"
      >
        <div
          className="
p-5
rounded-3xl
border
border-slate-200
dark:border-slate-800
bg-white
dark:bg-slate-900
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
        >
          <h3 className="text-slate-400">Total Users</h3>
          <p className=" font-bold text-lg mt-2">{users.length}</p>
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
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
        >
          <h3 className="text-slate-400">Active</h3>
          <p className=" font-bold text-lg mt-2 text-green-500">
            {users.filter((u) => u.status === "Active").length}
          </p>
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
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
        >
          <h3 className="text-slate-400">Suspended</h3>
          <p className=" font-bold text-lg mt-2 text-red-500">
            {users.filter((u) => u.status === "Suspended").length}
          </p>
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
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
        >
          <h3 className="text-slate-400">Admins</h3>
          <p className="text-3xl font-bold mt-2 text-indigo-500">
            {
              users.filter((u) => u.role === "Admin" || u.role === "Owner")
                .length
            }
          </p>
        </div>
      </div>
      

     <div className="md:hidden space-y-4">
<div className="md:hidden space-y-3">
  {filteredUsers.map((user) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
      rounded-3xl
      border
      border-slate-200
      dark:border-slate-800
      bg-white
      dark:bg-slate-900
      p-5
      shadow-sm
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div
            className="
            w-14
            h-14
            rounded-2xl
            bg-indigo-100
            dark:bg-indigo-950/40
            flex
            items-center
            justify-center
            font-bold
            text-indigo-600
            "
          >
            {user.avatar}
          </div>

          <div>
            <h3 className="font-semibold">
              {user.name}
            </h3>

            <p className="text-xs text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-xl text-xs font-semibold ${
            user.status === "Active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {user.status}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div
          className="
          flex
          items-center
          gap-2
          px-3
          py-2
          rounded-xl
          bg-slate-100
          dark:bg-slate-800
          text-sm
          "
        >
          <Shield size={14} />
          {user.role}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEditingUser(user)}
            className="
            h-10
            w-10
            rounded-xl
            border
            flex
            items-center
            justify-center
            "
          >
            <Edit2 size={15} />
          </button>

          <button
            onClick={() => setUserToDelete(user)}
            className="
            h-10
            w-10
            rounded-xl
            bg-red-600
            text-white
            flex
            items-center
            justify-center
            "
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  ))}
</div>
</div>
      {/* حاوية الجدول المتجاوبة بالكامل تمنع الـ Overflow الأفقي */}
      <div className="hidden md:block w-full rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mt-6">
        <div className="overflow-x-auto w-full min-w-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 font-semibold text-xs md:text-sm">
                <th className="p-4 text-start">
                  {lang === "ar" ? "المستخدم" : "User"}
                </th>
                <th className="p-4 text-start">
                  {lang === "ar" ? "الصلاحية" : "Role"}
                </th>
                <th className="p-4 text-start">
                  {lang === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="p-4 text-center">
                  {lang === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-20">
                    <h3 className="font-semibold">No Users Found</h3>

                    <p className="text-slate-400 mt-2">Try another search.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* عمود المستخدم (الاسم والإيميل والـ Avatar) */}
                    <td className="p-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-lg flex items-center justify-center shadow-sm shrink-0">
                          {user.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 break-all">
                            {user.email}
                          </span>
                        </div>
                      
                      </div>
                    </td>

                    {/* عمود الصلاحية بتصميم شارات ملونة شيك */}
                    <td className="hidden md:table-cell p-4 text-start">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Shield size={12} className="text-indigo-500" />
                        {user.role}
                      </div>
                    </td>

                    {/* عمود الحالة مع نقط تتبع مضيئة */}
                    <td className="p-4 text-start">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        {lang === "ar"
                          ? user.status === "Active"
                            ? "نشط"
                            : "معطل"
                          : user.status}
                      </span>
                    </td>

                    {/* عمود أزرار التحكم الفورية */}
                    <td className="p-2 sm:p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-md mx-4 p-6 rounded-3xl bg-white dark:bg-slate-900">
            <h2 className="text-xl  mb-4">Add User</h2>

<input
  placeholder="Full Name"
  value={newUser.name}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      name: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-3"
/>

<input
  placeholder="Email"
  value={newUser.email}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      email: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-3"
/>

<select
  value={newUser.role}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      role: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-3"
>
  <option>Owner</option>
  <option>Admin</option>
  <option>Editor</option>
  <option>User</option>
</select>

<select
  value={newUser.status}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      status: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-4"
>
  <option>Active</option>
  <option>Suspended</option>
</select>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-11 rounded-xl border"
              >
                Cancel
              </button>

<button
  onClick={handleAddUser}
  className="flex-1 h-11 rounded-xl bg-indigo-600 text-white"
>
  Save User
</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-md mx-4 p-6 rounded-3xl bg-white dark:bg-slate-900">
            <h2 className=" font-bold text-lg mb-4">Edit User</h2>

<input
  value={editingUser.name}
  onChange={(e) =>
    setEditingUser({
      ...editingUser,
      name: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-3"
/>     

<input
  value={editingUser.email}
  onChange={(e) =>
    setEditingUser({
      ...editingUser,
      email: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-3"
/>

<select
  value={editingUser.role}
  onChange={(e) =>
    setEditingUser({
      ...editingUser,
      role: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-3"
>
  <option>Owner</option>
  <option>Admin</option>
  <option>Editor</option>
  <option>User</option>
</select>

<select
  value={editingUser.status}
  onChange={(e) =>
    setEditingUser({
      ...editingUser,
      status: e.target.value,
    })
  }
  className="w-full h-11 px-4 rounded-xl border mb-4"
>
  <option>Active</option>
  <option>Suspended</option>
</select>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 h-11 rounded-xl border"
              >
                Cancel
              </button>

<button
  onClick={handleEditUser}
  className="flex-1 h-11 rounded-xl bg-indigo-600 text-white"
>
  Save Changes
</button>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900">
            <h2 className=" font-bold text-lg">Delete User</h2>

            <p className="text-slate-500 mt-3">
              Are you sure you want to delete
              {userToDelete.name} ?
            </p>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 h-11 rounded-xl border"
              >
                Cancel
              </button>

<button
  onClick={handleDeleteUser}
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

export default Users;
