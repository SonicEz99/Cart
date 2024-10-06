"use client"
import "./Register.css";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // ตรวจสอบรหัสผ่าน
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน!",
        text: "กรุณาตรวจสอบรหัสผ่านอีกครั้ง",
      });
      return;
    }
  
    // ตรวจสอบว่าข้อมูลครบ
    if (!name || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ!",
        text: "กรุณาใส่ข้อมูลให้ครบ",
      });
      return;
    }
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "ลงทะเบียนสำเร็จ!",
          text: "กำลังนำไปยังหน้าเข้าสู่ระบบ",
          timer: 2000,
          showConfirmButton: false,
        });
  
        setTimeout(() => router.push("/")); // นำไปหน้า login หลัง 2 วินาที
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: data.error || "เกิดข้อผิดพลาดในการลงทะเบียน",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการลงทะเบียน",
      });
    }
  };

  return (
    <>
      <div className="container w-[800px]">
        <div className="register-box pl-[30px]">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}
          className="w-[110%]">
            <label htmlFor="username">Username</label>
            <input
              type="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="username"
              name="username"
              placeholder="Enter username"
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              placeholder="Enter email"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              placeholder="Enter password"
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm your password"
            />

            <button type="submit" className="btn btn-primary mt-3">Register</button>
            <p className="account mt-3">
              Have an account? <a href="/">Login here!</a>
            </p>
          </form>
        </div>

        {/* Image */}
        <div className="logo-box text-center mt-5 w-[1500px] pr-[-170px]">
          <Image src="/Gamebuy.png" alt="Gamebuy Logo" width={900} height={900} />
        </div>
      </div>
    </>
  );
};

export default Register;
