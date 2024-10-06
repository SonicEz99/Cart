"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AUTH from "../components/authComponents";
import Link from "next/link";
import Swal from "sweetalert2"; 

function Page() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // To store selected product
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle modal
  const [userId, setUserId] = useState(); // Assume you have a user ID (replace with actual logic to get user ID)
  const { data : session} = useSession();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const getId = async () => {
      // Ensure the session exists
      if (session) {
        const userId = await session.user.id; // Get userId from session
        setUserId(userId); // Set the userId state
        console.log(userId.data);
      } else {
        console.error("No session found"); // Log if session is not available
      }
    };

    fetchProducts();
    getId();
    
  }, [session]);

  // Function to open modal with product details
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Function to handle adding product to cart
  const handleAddToCart = async () => {
    if (!selectedProduct) return; // Ensure a product is selected

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add to cart!",
    });

    if (result.isConfirmed) {
      // If confirmed, proceed with API call
      try {
        const response = await fetch("http://localhost:3000/api/cartItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: selectedProduct.id,
            userId: userId, // Send userId along with productId
          }),
        });

        if (response.ok) {
          const newCartItem = await response.json();
          console.log("Item added to cart:", newCartItem);
          
          // Show success message
          Swal.fire({
            title: "Done!",
            text: "Your item has been added to the cart.",
            icon: "success",
            timer: 1500, // Auto-close after 1.5 seconds
            showConfirmButton: false // Hide the confirm button
          });

          closeModal(); // Close the modal after adding to cart
        } else {
          const errorData = await response.json();
          console.error("Error adding to cart:", errorData);
          Swal.fire({
            title: "Error!",
            text: "Failed to add item to cart.",
            icon: "error"
          });
        }
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while adding the item to the cart.",
          icon: "error"
        });
      }
    }
  };

  return (
    <AUTH>
      <div className="bg-[#212A40] w-full">
        <div className="flex justify-center mt-5 mb-5">
          <h1 className="text-4xl">Recommended GAME OF THE YEAR!!</h1>
        </div>

        <div className="bg-[#212A40] p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                className="text-center flex flex-col items-center"
                key={product.id}
              >
                <div
                  className="w-[300px] h-[300px] flex justify-center items-center cursor-pointer"
                  onClick={() => openModal(product)} // Open modal on click
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-2">
                  <Link href={`/product/${product.id}`}>{product.name}</Link>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-50">
            <div className="p-6 rounded-lg max-w-lg w-full relative bg-[#1E1E24]">
              <button
                className="absolute top-2 right-2 text-2xl"
                onClick={closeModal} // Close modal
              >
                &times;
              </button>
              <div className="flex flex-col items-center bg-[#1E1E24]">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-[300px] object-contain mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="mb-4">{selectedProduct.description}</p>
                <p className="text-xl font-semibold mb-4">
                  ${selectedProduct.price}
                </p>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleAddToCart} // Call the function on click
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AUTH>
  );
}

export default Page;
