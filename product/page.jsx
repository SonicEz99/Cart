"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCartPlus } from 'react-icons/fa';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // จัดการสถานะการเข้าสู่ระบบ
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // ตรวจสอบสถานะการเข้าสู่ระบบ
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/session'); // URL ที่ตรวจสอบ session ของ NextAuth.js
        const data = await response.json();
        setIsAuthenticated(!!data?.user); // ถ้ามีข้อมูลผู้ใช้ ถือว่าล็อกอินแล้ว
      } catch (error) {
        console.error('Failed to check authentication status', error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      router.push('/login'); // ถ้ายังไม่ได้ล็อกอิน ให้นำไปที่หน้า login
      return;
    }

    try {
      await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      alert('Product added to cart');
    } catch (error) {
      console.error('Failed to add product to cart', error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <div>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <img src={product.imageUrl} alt={product.name} width={100} />
              <button onClick={() => handleAddToCart(product.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <FaCartPlus size={24} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/carts">Go to Cart</Link>
    </div>
  );
};

export default ProductsPage;
