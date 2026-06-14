import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useTheme from "../hooks/useTheme";
import { Plus, Search } from "lucide-react";
import { Users as UsersIcon, UserCheck, Shield, UserX } from "lucide-react";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";

import { MoreVertical } from "lucide-react";

import toast from "react-hot-toast";

function Users() {
  const { t } = useTheme();
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(getUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });
  const roleLabel = {
    Owner: t.usersPage.owner,
    Admin: t.usersPage.admin,
    Editor: t.usersPage.editor,
    User: t.usersPage.user,
  };
  const [openMenu, setOpenMenu] = useState(null);

  const statusLabel = {
    Active: t.usersPage.active,
    Suspended: t.usersPage.suspended,
  };

  const isRTL = document.documentElement.dir === "rtl";

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const roleMatch = roleFilter === "All" || user.role === roleFilter;

    const statusMatch = statusFilter === "All" || user.status === statusFilter;

    return searchMatch && roleMatch && statusMatch;
  });
  const usersPerPage = 8;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddUser = () => {
    if (!newUser.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!isValidEmail(newUser.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    const user = {
      id: Date.now(),
      ...newUser,
      avatar: newUser.name.charAt(0).toUpperCase(),
    };
    setUsers(addUser(user));
    toast.success("User added successfully");
    setShowAddModal(false);
    setNewUser({ name: "", email: "", role: "User", status: "Active" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" p-4"
    >
      <div className="space-y-6">
        {/* =========================================
    HEADER
========================================= */}
        <div>
          <h1 className="text-2xl font-bold">{t.usersPage.title}</h1>

          <p className="text-slate-500 text-sm">
            Manage team members and roles.
          </p>
        </div>

        {/* =========================================
    STATS CARDS
========================================= */}



         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div
            className="
      h-full
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
"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>

                <h3 className="text-3xl font-bold mt-2">{users.length}</h3>
              </div>

              <div
                className="
      w-12
      h-12
      rounded-2xl
      bg-indigo-500/10
      text-indigo-600
      flex
      items-center
      justify-center
      "
              >
                <UsersIcon size={22} />
              </div>
            </div>
    <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="mt-5">
              <span
                className="
      px-2
      py-1
      rounded-full
      text-xs
      bg-emerald-500/10
      text-emerald-600
      "
              >
                +12% this month
              </span>

             
            </div>
          </div>

          {/* Active Users */}

          <div
            className="
relative
overflow-hidden
rounded-3xl
border
border-slate-200
dark:border-slate-800
bg-white
dark:bg-slate-900
p-5
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Users</p>

                <h3 className="text-3xl font-bold mt-2">
                  {users.filter((u) => u.status === "Active").length}
                </h3>
              </div>
              <div
                className="
      w-12
      h-12
      rounded-2xl
      bg-emerald-500/10
      text-emerald-600
      flex

      items-center
      justify-center
      "
              >
                <UserCheck size={22} />
              </div>
            </div>
    <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="mt-5">
              <span
                className="
      px-2
      py-1
      rounded-full
      text-xs
      bg-emerald-500/10
      text-emerald-600
      "
              >
                +10% this month
              </span>

           
            </div>
          </div>

             

          {/* Admins */}

          <div
            className="
relative
overflow-hidden
rounded-3xl
border
border-slate-200
dark:border-slate-800
bg-white
dark:bg-slate-900
p-5
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Admins</p>

                <h3 className="text-3xl font-bold mt-2">
                  {users.filter((u) => u.role === "Admin").length}
                </h3>
              </div>

              <div
                className="
      w-12
      h-12
      rounded-2xl
      bg-violet-500/10
      text-violet-600
      flex
      items-center
      justify-center
      "
              >
                <Shield size={22} />
              </div>
            </div>
                <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />

            <div className="mt-5">
              <span
                className="
      px-2
      py-1
      rounded-full
      text-xs
      bg-violet-500/10
      text-violet-600
      "
              >
                +8% this month
              </span>

            </div>
          </div>

          {/* Suspended Users */}

          <div
            className="
relative
overflow-hidden
rounded-3xl
border
border-slate-200
dark:border-slate-800
bg-white
dark:bg-slate-900
p-5
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Suspended Users</p>

                <h3 className="text-3xl font-bold mt-2">
                  {users.filter((u) => u.status === "Suspended").length}
                </h3>
              </div>

              <div
                className="
      w-12
      h-12
      rounded-2xl
      bg-red-500/10
      text-red-600
      flex
      items-center
      justify-center
      "
              >
                <UserX size={22} />
              </div>
            </div>

                <div className="mt-4 h-px bg-slate-200 dark:bg-slate-800" />

            <div className="mt-5">
              <span
                className="
      px-2
      py-1
      rounded-full
      text-xs
      bg-red-500/10
      text-red-600
      "
              >
                +12% this month
              </span>

           
            </div>
          </div>
        </div>

                {/* =========================================
    SEARCH & FILTERS
========================================= */}

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3.5 text-slate-400"
              size={18}
            />
            <input
              placeholder={t.usersPage.search}
              className="
  w-full
  pl-10
  pr-4
  py-3
  rounded-2xl
  border
  border-slate-200
  dark:border-slate-800
  bg-white
  dark:bg-slate-900
  outline-none
  "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap lg:flex-nowrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="
    px-4
    py-3
    rounded-xl
    border
     border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900
    "
            >
              <option value="All">{t.usersPage.filterRole}</option>

              <option value="Owner">{t.usersPage.owner}</option>
              <option value="Admin">{t.usersPage.admin}</option>

              <option value="Editor">{t.usersPage.editor}</option>

              <option value="User">{t.usersPage.user}</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
    px-4
    py-3
    rounded-xl
    border
     border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900
    "
            >
              <option value="All">{t.usersPage.filterStatus}</option>

              <option value="Active">{t.usersPage.Active}</option>

              <option value="Suspended">{t.usersPage.suspended}</option>
            </select>
          </div>
        </div>


        {/* =========================================
    USERS GRID
========================================= */}

        <div className="flex items-center justify-between mt-8">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>

          <button
            onClick={() => setShowAddModal(true)}
            className="
    flex
    items-center
    gap-2
    bg-indigo-600
    text-white
    px-5
    py-2.5
    rounded-xl
    hover:bg-indigo-700
    "
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentUsers.length === 0 ? (
            <div
              className="
    col-span-full
    p-10
    rounded-3xl
    border
    border-dashed
    border-slate-300
    dark:border-slate-700
    text-center
    "
            >
              <h3 className="text-lg font-semibold">No users found</h3>

              <p className="text-slate-500 mt-2">
                Try changing search or filters
              </p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user.id}
                className="
group
relative
overflow-visible
p-6
rounded-3xl
border
border-slate-200
dark:border-slate-800
bg-white
dark:bg-slate-900
shadow-sm
hover:shadow-2xl
hover:-translate-y-1
transition-all
duration-300
"
              >
                <div
                  className="
absolute
top-0
right-0
w-24
h-24
bg-indigo-500/10
rounded-full
blur-2xl
"
                />
                <div className="flex items-center justify-between">
                  <div
                    className="
w-14
h-14
rounded-2xl
bg-gradient-to-br
from-indigo-500
to-violet-600
text-white
flex
items-center
justify-center
font-bold
shadow-lg
"
                  >
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className="
px-3
py-1
rounded-full
bg-indigo-500/10
text-indigo-600
dark:text-indigo-400
text-xs
font-medium
"
                  >
                    {roleLabel[user.role]}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`

px-3
py-1
rounded-full
text-xs
font-semibold

${
  user.status === "Active"
    ? "bg-emerald-500/10 text-emerald-600"
    : "bg-red-500/10 text-red-600"
}

`}
                  >
                    {statusLabel[user.status]}
                  </span>

                  <div className="relative ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        setOpenMenu(openMenu === user.id ? null : user.id);
                      }}
                      className="
    p-2
    rounded-xl
    hover:bg-slate-100
    dark:hover:bg-slate-800
    "
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === user.id && (
                      <div
                        className={`
absolute
${isRTL ? "left-0" : "right-0"}
bottom-full mt-2
z-50
w-44
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-white
dark:bg-slate-900
shadow-xl
overflow-hidden
`}
                      >
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenMenu(null);
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
                          Details
                        </button>

                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setOpenMenu(null);
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
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setOpenMenu(null);
                          }}
                          className="
        w-full
        text-left
        px-4
        py-3
        text-red-600
        hover:bg-red-50
        "
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* =========================================
    PAGINATION
========================================= */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-3 border rounded-xl disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-sm font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-xl disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* =========================================
    MODALS
========================================= */}

      {/* =========================================
    USER ADD MODAL 
========================================= */}

      {(showAddModal || editingUser || userToDelete) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div
            className="
 w-full
 max-w-md
 rounded-3xl
 border
 border-slate-200
 dark:border-slate-800
 bg-white
 dark:bg-slate-900
 p-6
 shadow-xl
 "
            onClick={(e) => e.stopPropagation()}
          >
            {showAddModal && (
              <>
                <h2 className="text-lg font-bold mb-4">Add User</h2>
                <input
                  placeholder="Name"
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all
"
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all
"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                    })
                  }
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all

  "
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
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all
"
                >
                  <option>Active</option>
                  <option>Suspended</option>
                </select>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="
    flex-1
    h-12
    rounded-xl
    border
    border-slate-200
    dark:border-slate-700
    hover:bg-slate-100
    dark:hover:bg-slate-800
    transition
    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddUser}
                    className="
    flex-1
    h-12
    rounded-xl
    bg-indigo-600
    hover:bg-indigo-700
    text-white
    font-medium
    transition
    "
                  >
                    Save User
                  </button>
                </div>
              </>
            )}

            {/* ======================================
    USER EDIT MODAL
========================================= */}

            {editingUser && (
              <>
                <h2 className="text-lg font-bold mb-4">Edit User</h2>
                <input
                  placeholder="Name"
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all
"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="Email"
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all
"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                />
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value,
                    })
                  }
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all

  "
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
                  className="
w-full
h-12
px-4
mb-3
rounded-2xl
border
border-slate-200
dark:border-slate-700
bg-slate-50
dark:bg-slate-800/80
text-slate-900
dark:text-white
placeholder:text-slate-400
focus:outline-none
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
transition-all
"
                >
                  <option>Active</option>
                  <option>Suspended</option>
                </select>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="
    flex-1
    h-12
    rounded-xl
    border
    border-slate-200
    dark:border-slate-700
    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      if (!editingUser.name.trim()) {
                        toast.error("Name is required");
                        return;
                      }

                      if (!isValidEmail(editingUser.email)) {
                        toast.error("Please enter a valid email");
                        return;
                      }

                      setUsers(updateUser(editingUser));
                      toast.success("User updated successfully");
                      setEditingUser(null);
                    }}
                    className="
    flex-1
    h-12
    rounded-xl
    bg-indigo-600
    text-white
    "
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {/* ====================================
    USER DELETE MODAL
========================================= */}

            {userToDelete && (
              <>
                <h2 className="text-lg font-bold text-red-600">Delete User</h2>
                <p className="my-4 text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete
                  <span className="font-bold text-red-500 mx-1">
                    {userToDelete.name}
                  </span>
                  ?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserToDelete(null)}
                    className="flex-1 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setUsers(deleteUser(userToDelete.id));
                      toast.success("User deleted successfully");
                      setUserToDelete(null);
                    }}
                    className="flex-1 py-2 bg-red-600 text-white rounded-xl"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================
    USER DETAILS MODAL
========================================= */}
      {selectedUser && (
        <div
          className="
  fixed
  top-0
  left-0
  w-screen
  h-screen
  z-[99999]
  bg-black/50
  backdrop-blur-sm
  flex
  items-center
  justify-center
  "
        >
          <div
            className="
bg-white
dark:bg-slate-900
p-6
rounded-3xl
w-full
max-w-md
"
          >
            <h2 className="text-xl font-bold mb-5">User Details</h2>

            <div className="space-y-4 mt-5">
              <div>
                <p className="text-xs text-slate-500">Name</p>

                <p className="font-medium">{selectedUser.name}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Email</p>

                <p className="font-medium">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Role</p>

                <p className="font-medium">{roleLabel[selectedUser.role]}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Status</p>

                <p className="font-medium">
                  {statusLabel[selectedUser.status]}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="
    w-full
    mt-5
    h-11
    rounded-xl
    bg-indigo-600
    text-white
    "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Users;
