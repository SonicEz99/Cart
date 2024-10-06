"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        console.error(result.error);
        Swal.fire({
          title: "Invalid email or password",
          text: "Please check your credentials and try again",
          icon: "error",
          confirmButtonColor: "#60d0ac",
          confirmButtonText: "OK",
        });
      } else {
        // Use router.push for client-side navigation
        router.push("/main");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container">
      <div className="register-box pl-5">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
          <p className="account">
            Don't have an account? <Link href="/register">Register here!</Link>
          </p>
        </form>
      </div>

      <div className="logo-box">
        <Image src="/Gamebuy.png" alt="Gamebuy Logo" width={500} height={500} />
      </div>
    </div>
  );
};

export default Login;
