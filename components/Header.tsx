"use client";

import Link from "next/link";
import Image from "next/image";

import { Button, HoverCard, Kbd, Text } from "@radix-ui/themes";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import Logo from "public/Logo.png";
import { AnimateArrow } from "./Animation";

const navList = [
  { t: "Home", l: "/" },
  { t: "About", l: "/about" },
  { t: "Features", l: "/" },
  { t: "Pricing", l: "/pricing" },
  { t: "Blog", l: "/blog" },
];

export default function Header({ current }: { current: string }) {
  return (
    <main>
      <nav className="max-w-7xl py-5 px-5 grid items-center grid-cols-[1fr_2fr_1fr] mx-auto">
        <Link href={"/login"} passHref>
          <Image src={Logo} alt="Logo" className="h-[18px] w-fit" />
        </Link>

        <ul className="navList justify-center">
          {navList.map((it, i) => (
            <li
              className={`group ${
                current == it.t ? `text-white` : `text-gray-400`
              }`}
              key={i}
            >
              {it.t}
              <span className="absolute inset-0 bg-gradient-to-r group-hover:opacity-90 opacity-0 transition-all duration-[400ms] from-white/10 to-white/5 border border-white/[0.15] rounded-3xl" />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 justify-end">
          <Link
            className={`${
              current != "Login" && `text-gray-300`
            } text-sm font-medium px-[17px] relative group py-[9.2px] transition-all duration-200 hover:text-white`}
            href={"/login"}
            passHref
          >
            Sign In
          </Link>

          <Link
            passHref
            href={"/register"}
            className="cursor-pointer group relative px-4 py-2.5 bg-white text-black rounded-3xl flexc gap-[11px] text-sm font-medium transition-all duration-200 active:scale-90"
          >
            <p className="mr-0.5 ml-px">Get Started</p>

            <AnimateArrow c="black" />
          </Link>
        </div>
      </nav>
    </main>
  );
}
