import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token, user,role }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token?.token}` },
      });

      console.log("Fetched products:", response.data);

      if (response.data.success) {
        // Change 'product.vendorId' to 'product.vendor'
        const filteredProducts = response.data.products.filter(
          (product) => product.vendor === user?.user._id
        );
        console.log("Filtered products:", filteredProducts);

        setList(filteredProducts.reverse());
        setFilteredList(filteredProducts.reverse()); // Set initial filtered list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error fetching list:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);

    const filtered = list.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredList(filtered); // Update the filtered list
  };

  const removeProduct = async (id,role) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id ,role},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh the product list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error removing product:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  console.log("TOKEN IS HAI",token)


  useEffect(() => {
    if (user?.user._id) {
      fetchList();
    } else {
      toast.error("User ID is missing");
    }
  }, [user?.user._id]); // Fetch list when user ID is available

  useEffect(() => {
    setFilteredList(list); // Sync filtered list with the full list
  }, [list]); // Ensure the list is populated first

  console.log("ID OF VENDOR", user?.user._id);
  console.log("Token",token?.token);
  console.log("Role",user?.user.role);



  return (
    <>
      <p className="mb-2">Vendor's Product List</p>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search products..."
        className="mb-2 p-1 border"
      />

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {filteredList.length === 0 ? (
          <p>No products found for this vendor.</p>
        ) : (
          filteredList.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
              key={index}
            >
              <img className="w-12" src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={() => removeProduct(item._id,user?.user.role)} className="text-right md:text-center cursor-pointer text-lg w-fit mx-auto">X</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default List;
