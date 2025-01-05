import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";

export default function Sellers({ token }) {
  const [vendors, setVendors] = useState([]); // State to hold filtered vendor data

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Fetch all user profiles from the backend with the token
      const response = await axios.get(`${backendUrl}/api/user/profiles`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the Authorization header
        },
      });
      console.log("API Response:", response); // Debug the full response
      if (response.status === 200 && Array.isArray(response.data.users)) {
        // Filter the users to only include vendors
        const filteredVendors = response.data.users.filter(
          (user) => user.role && user.role.toLowerCase() === "vendor"
        );
        console.log("Filtered Vendors:", filteredVendors);
        setVendors(filteredVendors); // Update state with vendors
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Vendors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Phone</th>
              <th className="px-6 py-3 border-b">Role</th>
              <th className="px-6 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{vendor.name || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{vendor.email || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{vendor.phone || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{vendor.role || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{vendor.status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 border-b text-center">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
