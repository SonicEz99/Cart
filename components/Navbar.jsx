"use client";
import "../globals.css";
import React, { useEffect, useState } from "react"; // Import useState
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AUTH from "../components/authComponents";

function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [totalItems, setTotalItems] = useState(0); // State to store total item count
  const [subtotal, setSubtotal] = useState(0); // Change to 0 for a numerical subtotal

  const fetchPrice = async () => {
    if (session) {
      try {
        const response = await fetch(`http://localhost:3000/api/cartsession/${session.user.id}`);
        const data = await response.json();

        // Calculate the subtotal by summing the prices of the products
        const total = data.reduce((acc, item) => {
          return acc + item.product.price; // Sum the product prices
        }, 0);

        setSubtotal(total); // Set the subtotal state
        console.log("Subtotal:", total);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (session) {
        try {
          const response = await fetch(`http://localhost:3000/api/cartItem/${session.user.id}`); 
          const data = await response.json();
          setCartItems(data);

        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };
    
    const setTime = setInterval(() => {
      fetchCartItems();
      fetchPrice();
    }, 2000);

  }, [session]); 

  return (
    <AUTH>
      <div className="navbar bg-[#1E1E24]">
        <div className="flex-1">
          <a href="./main">
          <Image
            src="/Gamebuy.png"
            alt="Gamebuy Logo"
            width={100} // Adjust width as needed
            height={100} // Adjust height as needed
          />
          </a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">{cartItems}</span> {/* Display total items */}
              </div>
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">{cartItems} Items</span> {/* Display total items */}
                <span className="text-info">Subtotal: ${subtotal.toFixed(2)}</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">
                  <a href="./carts">View cart</a>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  src="/pro.jpg"
                  alt="User Avatar"
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>{session ? <a>{session.user.name}</a> : <a>No user</a>}</li>
              <li>
                <a onClick={() => signOut({ callbackUrl: "/" })}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AUTH>
  );
}

export default Navbar;
