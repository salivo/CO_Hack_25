"use client";
import HeaderComponent from "@/components/header";
import Planetspace2 from "@/components/planetspace2";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

export default function Home() {
  // const [status, setStatus] = useState("loading");
  // const [user, setUser] = useState(null);
  // const router = useRouter();
  return (
    <div className="flex flex-col h-full">
      <HeaderComponent>
        <div className="flex items-center">
          <button className="login-submit-button w-auto">About Us</button>
        </div>

        {/* <div className="flex space-x-10">
            <button className="login-submit-button w-auto">Login</button>

            <button className="login-submit-button w-auto">Register</button>
          </div>*/}
      </HeaderComponent>

      <Planetspace2 />
    </div>
  );
}
