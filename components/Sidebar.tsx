import { User } from "@supabase/auth-helpers-nextjs";

import {
  ArrowLeftOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  CreditCardIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import supabase from "@/utilities/supabaseClient";
import Router from "next/router";

const navList = [
  {
    t: "Overview",
    l: "/overview",
    i: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 stroke-white -translate-y-[0.5px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 17h6M7.606 5.65l-2.6 2.456c-.74.698-1.11 1.047-1.374 1.46a4 4 0 0 0-.513 1.191C3 11.233 3 11.742 3 12.76v1.84c0 2.24 0 3.36.436 4.216a4 4 0 0 0 1.748 1.748C6.04 21 7.16 21 9.4 21h5.2c2.24 0 3.36 0 4.216-.436a4 4 0 0 0 1.748-1.748C21 17.96 21 16.84 21 14.6v-1.841c0-1.017 0-1.526-.119-2.002a4 4 0 0 0-.513-1.19c-.265-.414-.634-.763-1.374-1.461l-2.6-2.456c-1.546-1.46-2.32-2.19-3.201-2.466a4 4 0 0 0-2.386 0c-.882.275-1.655 1.006-3.201 2.466Z"
        />
      </svg>
    ),
  },
  {
    t: "Latest Events",
    l: "/events",
    i: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 stroke-white -translate-y-[0.5px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M21 12c-.12.254-.49.441-1.233.816l-6.325 3.196c-.529.267-.793.4-1.07.453a1.996 1.996 0 0 1-.743 0c-.278-.052-.542-.186-1.07-.453l-6.326-3.196C3.49 12.441 3.119 12.254 3 12m18 4.5c-.12.254-.49.441-1.233.816l-6.325 3.196c-.529.267-.793.4-1.07.453a1.996 1.996 0 0 1-.743 0c-.278-.052-.542-.186-1.07-.453l-6.326-3.196C3.49 16.941 3.119 16.754 3 16.5m10.43-4.953 6.27-2.966c.737-.348 1.105-.522 1.223-.757a.719.719 0 0 0 0-.648c-.118-.235-.486-.41-1.222-.757l-6.272-2.966c-.524-.248-.786-.372-1.06-.42a2.11 2.11 0 0 0-.737 0c-.275.048-.537.172-1.061.42L4.299 6.419c-.736.348-1.104.522-1.222.757a.719.719 0 0 0 0 .648c.118.235.486.41 1.222.757l6.272 2.966c.524.248.786.372 1.06.42.244.044.494.044.737 0 .275-.048.537-.172 1.061-.42Z"
        />
      </svg>
    ),
  },
  {
    t: "Charts",
    l: "/charts",
    i: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 stroke-white -translate-y-[0.5px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 21v-6c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C7.398 12 6.932 12 6 12c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C3 13.602 3 14.068 3 15v2.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21H9Zm0 0h6m-6 0V6c0-.932 0-1.398.152-1.765a2 2 0 0 1 1.083-1.083C10.602 3 11.068 3 12 3c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 4.602 15 5.068 15 6v15m0 0h2.8c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8V11c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C19.398 8 18.932 8 18 8c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C15 9.602 15 10.068 15 11v10Z"
        />
      </svg>
    ),
  },
  {
    t: "Categories",
    l: "/categories",
    i: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 stroke-white -translate-y-[0.5px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M21.928 11h-5.005a.923.923 0 0 0-.923.923c0 1.7-1.378 3.077-3.077 3.077h-1.846A3.077 3.077 0 0 1 8 11.923.923.923 0 0 0 7.077 11H2.072m19.856 0a2.029 2.029 0 0 0-.059-.18c-.055-.146-.134-.283-.29-.558l-1.736-3.037c-.671-1.175-1.007-1.762-1.479-2.19a4 4 0 0 0-1.444-.838C16.315 4 15.639 4 14.286 4H9.714c-1.353 0-2.029 0-2.634.197a4 4 0 0 0-1.444.839c-.472.427-.808 1.014-1.479 2.189l-1.735 3.037c-.157.275-.236.412-.291.558a2 2 0 0 0-.06.18m19.857 0a2 2 0 0 1 .048.22c.024.155.024.313.024.63V12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 20 16.8 20 14 20h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 16.2 2 14.8 2 12v-.15c0-.317 0-.475.024-.63a2 2 0 0 1 .048-.22"
        />
      </svg>
    ),
  },
  {
    t: "Keys & Tokens",
    l: "/keys",
    i: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 stroke-white -translate-y-[0.5px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 17v-2m0 0c.513 0 .929-.448.929-1s-.416-1-.929-1c-.513 0-.929.448-.929 1s.416 1 .929 1Zm5.573-5.761V9c0-3.314-2.495-6-5.573-6-3.078 0-5.573 2.686-5.573 6v.239m11.146 0C16.887 9 15.965 9 14.303 9H9.697c-1.662 0-2.584 0-3.27.239m11.146 0c.084.029.164.061.242.098.951.45 1.684 1.307 2.021 2.366.253.793.176 1.794.02 3.795-.133 1.723-.2 2.584-.507 3.26-.41.901-1.119 1.604-1.987 1.969-.65.273-1.454.273-3.06.273H9.698c-1.605 0-2.408 0-3.06-.273-.867-.365-1.577-1.068-1.986-1.969-.308-.676-.374-1.537-.508-3.26-.154-2.001-.232-3.002.02-3.795.338-1.059 1.071-1.916 2.022-2.366.078-.037.158-.07.242-.098"
        />
      </svg>
    ),
  },
];

const navAccount = [
  {
    t: "Account",
    l: "/account",
    ic: <UserCircleIcon className="w-[18px] stroke-white" />,
  },
  {
    t: "Onboarding",
    l: "/setup",
    ic: <Cog8ToothIcon className="w-[18px] stroke-white scale-[1.02]" />,
  },

  {
    t: "Billing",
    l: "/billing",
    ic: <CreditCardIcon className="w-[18px] stroke-white" />,
  },
];

const cat = ["Sign-Ups", "Errors", "Webhooks", "Payments", "Support"];

export default function Sidebar({
  current,
  uI,
  uD,
}: {
  current: string;
  uI: any;
  uD?: any;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.metaKey && e.key === "k") {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (openProfile !== false) {
      const handleClickOutside = (event: MouseEvent) => {
        if (!profileRef.current?.contains(event.target as Node))
          setOpenProfile(false);
      };

      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openProfile, profileRef]);

  return (
    <div className="h-screen border-white/10 sticky top-0 bottom-0 left-0 z-10">
      <div className="flex items-center w-full py-10 pl-10 pr-6 pb-0 justify-between relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-[18px] w-fit"
          fill="none"
          viewBox="0 0 482 71"
        >
          <g clipPath="url(#a)">
            <path
              fill="#fff"
              d="M411.93 21h11.712l9.024 36.96-2.4-.096L441.978 21h9.984l11.712 36.864-2.304.096L470.394 21h11.616l-11.712 48h-12.96l-11.616-36.768h2.592L436.602 69h-12.96L411.93 21Zm-24.687 49.536c-4.672 0-8.864-1.056-12.576-3.168-3.648-2.176-6.528-5.184-8.64-9.024-2.048-3.904-3.072-8.32-3.072-13.248 0-4.992 1.024-9.408 3.072-13.248 2.112-3.904 4.992-6.944 8.64-9.12 3.712-2.176 7.904-3.264 12.576-3.264 4.608 0 8.736 1.088 12.384 3.264 3.712 2.176 6.592 5.216 8.64 9.12 2.048 3.84 3.072 8.256 3.072 13.248 0 4.928-1.024 9.344-3.072 13.248-2.048 3.84-4.896 6.848-8.544 9.024-3.648 2.112-7.808 3.168-12.48 3.168Zm0-9.6c2.56 0 4.8-.64 6.72-1.92 1.984-1.344 3.488-3.2 4.512-5.568 1.088-2.432 1.632-5.216 1.632-8.352 0-3.2-.544-6.016-1.632-8.448-1.024-2.432-2.528-4.288-4.512-5.568-1.92-1.344-4.16-2.016-6.72-2.016-2.624 0-4.928.672-6.912 2.016-1.92 1.28-3.424 3.136-4.512 5.568-1.024 2.432-1.536 5.248-1.536 8.448 0 3.136.512 5.92 1.536 8.352 1.088 2.432 2.592 4.288 4.512 5.568 1.984 1.28 4.288 1.92 6.912 1.92ZM347.694.84h11.04V69h-11.04V.84Zm-28.15 14.688c0-4.928 1.28-8.608 3.84-11.04 2.56-2.432 6.4-3.648 11.52-3.648h10.08v9.6h-8.64c-1.92 0-3.36.48-4.32 1.44-.96.96-1.44 2.4-1.44 4.32V69h-11.04V15.528ZM309.176 21h35.808v9.6h-35.808V21Z"
            />
            <path
              fill="#fff"
              d="M299.78 69c-3.456 0-6.336-.544-8.64-1.632-2.24-1.088-3.936-2.72-5.088-4.896-1.088-2.176-1.632-4.896-1.632-8.16V5.544h11.04V53.64c0 1.92.48 3.36 1.44 4.32.96.96 2.4 1.44 4.32 1.44h8.64V69h-10.08Zm-25.728-48h35.808v9.6h-35.808V21Zm-12.323 18.72c0-3.392-.768-6.016-2.304-7.872-1.472-1.856-3.552-2.784-6.24-2.784-3.584 0-6.464 1.536-8.64 4.608-2.176 3.008-3.264 7.008-3.264 12l-2.112-6.24c0-3.904.736-7.36 2.208-10.368 1.536-3.008 3.648-5.344 6.336-7.008 2.688-1.728 5.76-2.592 9.216-2.592 3.328 0 6.176.8 8.544 2.4 2.368 1.536 4.16 3.808 5.376 6.816 1.28 2.944 1.92 6.496 1.92 10.656V69h-11.04V39.72ZM230.241 21h11.04v48h-11.04V21Zm-25.872 49.536c-4.928 0-9.248-1.056-12.96-3.168-3.712-2.176-6.624-5.184-8.736-9.024-2.112-3.904-3.168-8.384-3.168-13.44 0-4.928.992-9.312 2.976-13.152s4.736-6.848 8.256-9.024c3.584-2.176 7.616-3.264 12.096-3.264 4.544 0 8.544 1.088 12 3.264 3.52 2.176 6.24 5.216 8.16 9.12 1.984 3.904 2.976 8.352 2.976 13.344v2.976h-35.04c0 2.56.544 4.8 1.632 6.72a11.755 11.755 0 0 0 4.512 4.512c1.984 1.024 4.224 1.536 6.72 1.536 2.752 0 5.088-.608 7.008-1.824 1.92-1.28 3.232-2.976 3.936-5.088l11.136.96c-.768 4.736-3.136 8.512-7.104 11.328-3.904 2.816-8.704 4.224-14.4 4.224Zm10.272-30.816c0-2.048-.512-3.872-1.536-5.472-1.024-1.664-2.432-2.944-4.224-3.84-1.728-.896-3.776-1.344-6.144-1.344-2.304 0-4.352.448-6.144 1.344-1.792.896-3.2 2.144-4.224 3.744-.96 1.6-1.44 3.456-1.44 5.568h23.712ZM130.935 21h11.712l14.304 39.648h-2.976L169.143 21h11.712l-18.432 48h-14.112l-17.376-48Zm-20.327 49.536c-4.928 0-9.248-1.056-12.96-3.168-3.712-2.176-6.624-5.184-8.736-9.024-2.112-3.904-3.168-8.384-3.168-13.44 0-4.928.992-9.312 2.976-13.152s4.736-6.848 8.256-9.024c3.584-2.176 7.616-3.264 12.096-3.264 4.544 0 8.544 1.088 12 3.264 3.52 2.176 6.24 5.216 8.16 9.12 1.984 3.904 2.976 8.352 2.976 13.344v2.976h-35.04c0 2.56.544 4.8 1.632 6.72a11.755 11.755 0 0 0 4.512 4.512c1.984 1.024 4.224 1.536 6.72 1.536 2.752 0 5.088-.608 7.008-1.824 1.92-1.28 3.232-2.976 3.936-5.088l11.136.96c-.768 4.736-3.136 8.512-7.104 11.328-3.904 2.816-8.704 4.224-14.4 4.224ZM120.88 39.72c0-2.048-.512-3.872-1.536-5.472-1.024-1.664-2.432-2.944-4.224-3.84-1.728-.896-3.776-1.344-6.144-1.344-2.304 0-4.352.448-6.144 1.344-1.792.896-3.2 2.144-4.224 3.744-.96 1.6-1.44 3.456-1.44 5.568h23.712Z"
            />
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M8 .645a8 8 0 0 0-8 8v28.217a8 8 0 0 0 8 8h15.783v17.793a8 8 0 0 0 8 8H60a8 8 0 0 0 8-8V34.438a8 8 0 0 0-8-8H44.217V8.645a8 8 0 0 0-8-8H8Zm36.217 25.793H31.783a8 8 0 0 0-8 8v10.424h12.434a8 8 0 0 0 8-8V26.438Z"
              clipRule="evenodd"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 .5h482v70H0z" />
            </clipPath>
          </defs>
        </svg>

        <p
          onClick={() => setOpenProfile(!openProfile)}
          className="text-[12px] uppercase leading-[0.5] flex items-center justify-center h-[39px] w-[39px] overflow-hidden cursor-pointer tracking-wider rounded-3xl border shadow-sm border-white/10 bg-gradient-to-t from-white/[0.065] to-white/[0.025] relative group"
        >
          {"mk" || uI.email.substring(0, 2)}{" "}
          <span className="inset-0 absolute opacity-0 group-hover:opacity-70 bg-gradient-to-t from-white/5 to-transparent transition-all duration-300" />
        </p>

        <div
          ref={profileRef}
          className={`absolute overflow-hidden z-10 inset-x-6 flex flex-col gap-2 top-[90px]  bg-[#090910] shadow-xl p-1.5  border border-white/10 rounded-[14px] transition-all duration-300 origin-center ${
            openProfile
              ? `scale-100 translate-y-0 opacity-100 visible`
              : `scale-95 -translate-y-3 opacity-0 invisible`
          }`}
        >
          {" "}
          {navAccount.map((it, i) => (
            <Link
              key={i}
              passHref
              href={it.l}
              className={`${
                current == it.t ? `bg-white/5 font-[475]` : `text-white/70`
              } px-2.5 py-1.5 text-[14px] rounded-lg transition-all hover:bg-white/5 flex items-center gap-2`}
            >
              {" "}
              {it.ic} {it.t}{" "}
            </Link>
          ))}{" "}
          <div className="w-full -scale-x-125 border-b border-white/10 " />{" "}
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (!error) {
                Router.push("/");
              }
            }}
            className="px-2.5 py-1.5 text-white/80 text-[14px] rounded-lg transition-all hover:text-red-300 hover:bg-red-400/10 group flex items-center gap-2"
          >
            {" "}
            <ArrowLeftOnRectangleIcon className="w-[18px] stroke-white transition-all group-hover:stroke-red-300" />{" "}
            Log Out{" "}
          </button>{" "}
        </div>
      </div>

      <div className="px-6 pt-2 pb-5">
        {navList.map((it, i) => (
          <Link
            href={it.l}
            passHref
            className={`${
              it.t == current
                ? ` border-white/[0.15] shadow-[inset_-3px_-3px_35px_3px_rgba(255,255,255,0.14)] `
                : `hover:bg-white/5 text-white/60 border-white/0`
            } px-3 py-2 my-2 relative w-full flex tracking-sm border items-center gap-2.5 rounded-m text-[14px] font-[450] transition-all duration-200`}
            key={i}
          >
            {it.i}
            {it.t}

            {/* <p
              id="cmd"
              className={` ${
                it.t == current && `hidden`
              } absolute right-0 scale-75 transition-all duration-200 text-white/[0.35] py-[3.5px] px-[7px] tracking-wider rounded-[5px] border shadow-md border-white/10 bg-gradient-to-t from-white/[0.065] to-white/[0.025]`}
            >
              ⌘K
            </p> */}
          </Link>
        ))}
      </div>

      <div className="p-6 pb-0 border-t h-[calc(100vh-291px-78px)] border-white/10 flex-col flex justify-between">
        <div>
          <div className="flex items-center gap-2 text-white/60 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 -translate-y-[1.25px]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.15 6.247c.841-1.764 1.262-2.646 1.812-2.967a2.063 2.063 0 0 1 2.077 0c.549.32.97 1.203 1.812 2.967.25.523.374.785.553.993.21.244.473.436.77.56.254.105.54.143 1.115.219 1.939.255 2.908.383 3.382.807.554.495.8 1.249.642 1.975-.135.621-.844 1.294-2.262 2.64-.42.4-.63.599-.773.833a2.064 2.064 0 0 0-.294.906c-.022.273.03.558.136 1.128.356 1.922.534 2.884.277 3.465a2.06 2.06 0 0 1-1.68 1.221c-.633.064-1.492-.402-3.21-1.335-.51-.276-.764-.414-1.03-.478a2.062 2.062 0 0 0-.953 0c-.267.064-.522.202-1.03.478-1.72.933-2.578 1.4-3.21 1.335a2.063 2.063 0 0 1-1.681-1.22c-.257-.582-.079-1.544.277-3.466.106-.57.159-.855.136-1.128a2.063 2.063 0 0 0-.294-.906c-.143-.234-.353-.434-.773-.832-1.418-1.347-2.127-2.02-2.262-2.641a2.063 2.063 0 0 1 .642-1.975c.474-.424 1.444-.552 3.382-.807.574-.076.862-.114 1.115-.22.297-.123.56-.315.77-.56.179-.207.304-.469.553-.992Z"
              />
            </svg>

            <p className="text-[15px] tracking-sm">Favorite Categories</p>
            <PlusIcon className="w-6 translate-x-[3px] p-[3px] border border-white/0 hover:border-white/10 hover:bg-white/5 rounded-md absolute right-0 transition-all cursor-pointer" />
          </div>

          <div className="h-[calc(100vh-58px-303px-173px-35px)] pt-0.5 pb-2.5 overflow-y-auto">
            {cat.map((it, i) => (
              <div key={i} className="pl-3 pt-3">
                <div className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-white/5 rounded-m transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[18px] -translate-y-[0.5px] scale-x-95"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.25"
                      d="m7 20 3-16m4 16 3-16m2.5 11h-16m17-6h-16"
                    />
                  </svg>

                  <p className="text-[14.5px] tracking-sm">{it}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* <div className="rounded-m cursor-pointer group border border-white/10 p-3 overflow-hidden bg-gradient-to-t from-white/[0.04] to-white/[0.025] relative flex items-center gap-2 shadow-[inset_-1px_-1px_30px_0px_rgba(255,255,255,0.1)]">
            <SparklesIcon className="w-4" />
            <p className="text-xs">Upgrade to Premium</p>
            <div className="absolute group-hover:opacity-100 opacity-0 inset-0 z-[0] shadow-[inset_-2px_-2px_45px_0px_rgba(255,255,255,0.06)] transition-all duration-300" />
          </div> */}
          <Link
            href={"/account"}
            passHref
            className={`hover:bg-white/5 text-white/60 border-white/0 px-3 py-2 relative w-full flex tracking-sm border items-center gap-2.5 rounded-m text-[14px] transition-all duration-200`}
          >
            <Cog8ToothIcon className="w-[18px]" />
            Settings
          </Link>
          <Link
            href={"/account"}
            passHref
            className={`hover:bg-white/5 text-white/60 border-white/0 px-3 py-2 relative w-full flex tracking-sm border items-center gap-2.5 rounded-m text-[14px] transition-all duration-200`}
          >
            <LifebuoyIcon className="w-[18px]" />
            Help & Support
          </Link>
        </div>
      </div>
    </div>
  );
}
