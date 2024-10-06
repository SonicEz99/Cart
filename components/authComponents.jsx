// components/AuthWrapper.js

"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const AuthWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
        return;
    }
  }, [router, session, status]);

  // const Relofresh = async () => {
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       window.location.reload();
  //     }, 10000);

  //     return () => clearInterval(interval);
  //   }, []);
  //   return null;
  // };
  // Relofresh();

  return children;
};

export default AuthWrapper;
