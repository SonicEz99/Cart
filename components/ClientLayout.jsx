"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import { isAuthPage } from "../utils/checkPath"; //ตรวจสอบ routh ที่ต้องการแสดง nav และ sidebar

export default function ClientLayout({ session, children }) {
  const pathname = usePathname();

  return (
    <div className="font-sans w-[full]">
      {" "}
      {/*ให้แสดง navbar ใน routh ที่เลือก*/}
      <div className="">

        <SessionProvider session={session}>
          <div className="flex fixed-top">{isAuthPage(pathname) && <Navbar session={session} />}</div>
          <div className="flex">
          {children}
          </div>
        </SessionProvider>
        
      </div>
    </div>
  );
}