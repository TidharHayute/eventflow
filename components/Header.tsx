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
      <nav className="max-w-7xl py-4 px-4 grid items-center grid-cols-[1fr_2fr_1fr] mx-auto border-b-[0.5px] [border-image:linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0.2),rgba(255,255,255,0))_1]">
        <Link href={"/"} passHref>
          <Image src={Logo} alt="Logo" className="h-5 w-fit" />
        </Link>

        <ul className="navList justify-center">
          {navList.map((it, i) => (
            <li key={i}>
              <Link
                className={`group ${
                  current == it.t ? `text-white` : `text-gray-400`
                }`}
                href={it.l}
                passHref
              >
                {it.t}
                <span className="absolute inset-0 bg-gradient-to-r group-hover:opacity-100 opacity-0 transition-all duration-300 from-white/10 to-white/5 border border-white/[0.15] rounded-3xl" />
              </Link>
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
            <span className="absolute inset-0 bg-gradient-to-r group-hover:opacity-100 opacity-0 transition-all duration-300 from-white/10 to-white/5 border border-white/[0.15] rounded-lg" />
          </Link>

          <Link
            passHref
            href={"/register"}
            className="cursor-pointer group relative"
          >
            <Button radius="large" size={"3"} variant="classic" color="teal">
              Get Started
              <AnimateArrow />
            </Button>
          </Link>
        </div>
      </nav>
    </main>
  );
}
