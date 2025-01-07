import React, { useState, useEffect } from "react";
import { FaUsers, FaSearch, FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:4000/api/user/profiles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterUsers(query, roleFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterUsers(search, role);
  };

  const filterUsers = (searchQuery, role) => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery)
      );
    }

    if (role !== "all") {
      filtered = filtered.filter((user) => user.role === role);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId) => {
    if (currentUser?.role !== "admin") {
      setError("Only administrators can delete users");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/api/user/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setUsers(users.filter((user) => user._id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  const handleEdit = (user) => {
    if (currentUser?.role !== "admin") {
      setError("Only administrators can edit users");
      return;
    }
    setEditingUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();

      // Update both users and filteredUsers arrays with the updated user data
      const updateUserInList = (userList) => {
        return userList.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      };

      setUsers(updateUserInList(users));
      setFilteredUsers(updateUserInList(filteredUsers));

      // Close modal and reset form
      setIsEditModalOpen(false);
      setEditingUser({ _id: "", name: "", email: "", password: "", role: "" });
      setError("");
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    }
  };

  const handleAdd = () => {
    if (currentUser?.role !== "admin") {
      setError("Only administrators can add users");
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      setUsers([...users, data]);
      setFilteredUsers([...filteredUsers, data]);
      setIsAddModalOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      setError("");
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="p-8 w-full h-screen overflow-y-scroll">
      {/* Heading with improved styling */}
      <div className="mb-8 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaUsers className="text-primary text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Users Management
              </h2>
              <p className="text-gray-500 text-sm">Manage your system users</p>
            </div>
          </div>
          {currentUser?.role === "admin" && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-secondary transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaUserPlus className="text-lg" />
              <span>Add User</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Role Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleRoleFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${
                    roleFilter === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
            >
              All
            </button>
            <button
              onClick={() => handleRoleFilter("admin")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${
                    roleFilter === "admin"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleFilter("vendor")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${
                    roleFilter === "vendor"
                      ? "bg-secondary text-white"
                      : "bg-blue-100 text-secondary hover:bg-blue-200"
                  }`}
            >
              Vendor
            </button>
            <button
              onClick={() => handleRoleFilter("user")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${
                    roleFilter === "user"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
            >
              User
            </button>
          </div>
        </div>
      </div>

      {/* Users List with improved styling */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Row - reduced padding */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 items-center p-4 bg-gray-200 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-600">NAME</span>
          <span className="text-sm font-semibold text-gray-600">EMAIL</span>
          <span className="text-sm font-semibold text-gray-600">ROLE</span>
          <span className="text-sm font-semibold text-gray-600">ACTIONS</span>
        </div>

        {/* Users List - reduced padding in rows */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FaUsers className="text-5xl mx-auto" />
            </div>
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div
                key={user?._id}
                className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr] items-center p-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="font-medium text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {user?.name}
                </div>
                <div className="text-gray-600">{user.email}</div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "vendor"
                        ? "bg-blue-100 text-secondary"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="flex gap-2">
                  {currentUser?.role === "admin" && (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-gray-600 hover:text-secondary hover:bg-blue-50 rounded-lg transition-colors duration-150"
                        title="Edit user"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        title="Delete user"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal with improved styling */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsAddModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 mb-6"
                  >
                    Add New User
                  </Dialog.Title>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleAddSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      >
                        <option value="user">User</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-secondary font-medium transition-colors duration-200"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 mb-6"
                  >
                    Edit User
                  </Dialog.Title>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleEditSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingUser.name}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                        <span className="text-gray-400 text-xs ml-2">
                          (Leave blank to keep unchanged)
                        </span>
                      </label>
                      <input
                        type="password"
                        value={editingUser.password}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all duration-200"
                      >
                        <option value="user">User</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-secondary font-medium transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
