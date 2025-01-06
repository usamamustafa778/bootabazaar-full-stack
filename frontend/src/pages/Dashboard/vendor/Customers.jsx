import React, { useState, useEffect } from "react";
import { FaUser, FaSearch } from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockCustomers = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            status: "Active",
            orders: [
              { id: 1, date: "2024-03-15", amount: 150.0 },
              { id: 2, date: "2024-03-20", amount: 75.5 },
            ],
          },
          // ... other customer data
        ];

        const customersWithOrders = mockCustomers.filter(
          (customer) => customer.orders.length > 0
        );
        setCustomers(customersWithOrders);
        setFilteredCustomers(customersWithOrders);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
    );

    setFilteredCustomers(filtered);
  };

  return (
    <div className="p-10 w-full">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-4">
        <FaUser className="text-gray-700 text-xl" />
        <h2 className="text-2xl font-bold text-gray-800">Customer Overview</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search customers..."
          className="w-full md:w-1/2 p-2 pl-10 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Header Row */}
      <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 items-center pb-2 mb-2 border-b text-sm font-semibold text-gray-500 uppercase tracking-wide">
        <span>Name</span>
        <span>Email</span>
        <span>Status</span>
        <span>Orders</span>
        <span>Total Spent</span>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No customers found.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-800">{customer.name}</div>
              <div className="text-gray-600">{customer.email}</div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    customer.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <div className="text-gray-800">{customer.orders.length}</div>
              <div className="font-semibold text-gray-800">
                $
                {customer.orders
                  .reduce((sum, order) => sum + order.amount, 0)
                  .toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;
