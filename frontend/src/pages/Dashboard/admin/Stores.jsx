import React, { useState, useEffect, Fragment } from "react";
import { FaStore, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState({
    _id: "",
    user: "",
    storeName: "",
    storeDescription: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newStore, setNewStore] = useState({
    user: "",
    storeName: "",
    storeDescription: "",
  });

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
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:4000/api/vendor/stores-list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }
        const data = await response.json();
        setStores(data?.data);
        setFilteredStores(data?.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setError("Failed to fetch stores");
        setStores([]);
        setFilteredStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (!Array.isArray(stores)) return;

    const filtered = stores.filter(
      (store) =>
        store.storeName.toLowerCase().includes(query) ||
        store.storeDescription.toLowerCase().includes(query) ||
        store.user?.name.toLowerCase().includes(query) ||
        store.slug.toLowerCase().includes(query)
    );

    setFilteredStores(filtered);
  };

  const handleDelete = async (storeId) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/api/vendor/${storeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete store");
        }

        // Remove store from both stores and filteredStores states
        setStores(stores.filter((store) => store._id !== storeId));
        setFilteredStores(
          filteredStores.filter((store) => store._id !== storeId)
        );
      } catch (error) {
        console.error("Error deleting store:", error);
        setError("Failed to delete store. Please try again.");
      }
    }
  };

  const handleEdit = (store) => {
    setEditingStore({
      _id: store._id,
      user: store.user._id,
      storeName: store.storeName,
      storeDescription: store.storeDescription,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/vendor/${editingStore._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: editingStore.user,
            storeName: editingStore.storeName,
            storeDescription: editingStore.storeDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update store");
      }

      const updatedStore = await response.json();

      // Update both stores and filteredStores arrays
      const updateStoreInList = (storeList) => {
        return storeList.map((store) =>
          store._id === updatedStore._id ? updatedStore : store
        );
      };

      setStores(updateStoreInList(stores));
      setFilteredStores(updateStoreInList(filteredStores));
      setIsEditModalOpen(false);
      setEditingStore({
        _id: "",
        user: "",
        storeName: "",
        storeDescription: "",
      });
      setError("");
    } catch (error) {
      console.error("Error updating store:", error);
      setError("Failed to update store. Please try again.");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const storeData = {
        ...newStore,
        user: selectedUser,
      };

      const response = await fetch(
        "http://localhost:4000/api/vendor/create-store",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storeData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create store");
      }

      const createdStore = await response.json();

      // Update stores list
      setStores([createdStore, ...stores]);
      setFilteredStores([createdStore, ...filteredStores]);

      // Reset form and close modal
      setIsCreateModalOpen(false);
      setNewStore({ user: "", storeName: "", storeDescription: "" });
      setError("");
    } catch (error) {
      console.error("Error creating store:", error);
      setError("Failed to create store. Please try again.");
    }
  };

  return (
    <div className="p-8 w-full h-screen overflow-y-scroll">
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaStore className="text-primary text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Stores Management
              </h2>
              <p className="text-gray-500 text-sm">Manage vendor stores</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200"
          >
            Create Store
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by store name, description or vendor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 items-center p-4 bg-gray-50 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-600">STORE</span>
          <span className="text-sm font-semibold text-gray-600">VENDOR</span>
          <span className="text-sm font-semibold text-gray-600">PRODUCTS</span>
          <span className="text-sm font-semibold text-gray-600">CREATED</span>
          <span className="text-sm font-semibold text-gray-600">ACTIONS</span>
        </div>

        {/* Stores List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FaStore className="text-5xl mx-auto" />
            </div>
            <p className="text-gray-500">No stores found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredStores.map((store) => (
              <div
                key={store._id}
                className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center p-3 hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Store Info */}
                <div className="space-y-1">
                  <div className="font-medium text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {store?.storeName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {store.storeName}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {store.storeDescription}
                  </div>
                  <div className="text-xs text-gray-400">
                    Slug: {store.slug}
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="space-y-1">
                  <div className="font-medium text-gray-800">
                    {store.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {store.user?.email}
                  </div>
                </div>

                {/* Products Count */}
                <div className="text-gray-600">
                  {store.products?.length || 0} products
                </div>

                {/* Created Date */}
                <div className="text-sm text-gray-600">
                  {format(new Date(store.createdAt), "MMM d, yyyy")}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(store)}
                    className="p-1.5 text-gray-600 hover:text-secondary hover:bg-blue-50 rounded-lg transition-colors duration-150"
                    title="Edit store"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(store._id)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                    title="Delete store"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

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
                    Edit Store
                  </Dialog.Title>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleEditSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingStore.storeName}
                        onChange={(e) =>
                          setEditingStore({
                            ...editingStore,
                            storeName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Description
                      </label>
                      <textarea
                        required
                        value={editingStore.storeDescription}
                        onChange={(e) =>
                          setEditingStore({
                            ...editingStore,
                            storeDescription: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                      />
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
                        className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-secondary font-medium transition-colors duration-200"
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

      <Transition appear show={isCreateModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsCreateModalOpen(false)}
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
                    Create New Store
                  </Dialog.Title>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleCreateSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Vendor
                      </label>
                      <select
                        required
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                      >
                        <option value="">Select a vendor</option>
                        {users
                          .filter((user) => user.role === "vendor")
                          .map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newStore.storeName}
                        onChange={(e) =>
                          setNewStore({
                            ...newStore,
                            storeName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Description
                      </label>
                      <textarea
                        required
                        value={newStore.storeDescription}
                        onChange={(e) =>
                          setNewStore({
                            ...newStore,
                            storeDescription: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-secondary font-medium transition-colors duration-200"
                      >
                        Create Store
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
