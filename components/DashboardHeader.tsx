import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
  CodeBracketIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";

export default function DashboardHeader() {
  const [openFeedback, setOpenFeedback] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openFeedback !== false) {
      const handleClickOutside = (event: MouseEvent) => {
        if (!feedbackRef.current?.contains(event.target as Node))
          setOpenFeedback(false);
      };

      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openFeedback, feedbackRef]);

  return (
    <div className="w-full border-b border-white/10 p-3 flexc justify-end gap-3">
      <div className="relative">
        <button
          onClick={() => {
            setOpenFeedback(!openFeedback);
          }}
          className="grayButton xs group"
        >
          <ChatBubbleOvalLeftEllipsisIcon
            strokeWidth={1.4}
            className="w-[18px] -ml-0.5 -translate-y-[0.5px]"
          />
          Feedback
          <span className="group-hover:opacity-60" />
        </button>

        <div
          ref={feedbackRef}
          className={`absolute right-0 w-[320px] z-10 flex flex-col gap-2 top-[44px] p-3.5 shadow-xl shadow-white/[0.025] bg-[#090910] border border-white/10 rounded-2xl transition-all duration-300 ${
            openFeedback
              ? `scale-100 translate-y-0 opacity-100 visible`
              : `scale-95 -translate-y-2 opacity-0 invisible`
          }`}
        >
          <p className="font-uncut tracking-tight leading-none font-[550] text-[15px] mb-3">
            Submit Feedback
          </p>

          <textarea
            placeholder="Let us know what you think of Eventflow"
            className="w-full rounded-md border placeholder:text-[#757575] p-2 focus:outline-none focus:border-white/20 max-h-48 min-h-[104px] text-[13px] border-white/10 bg-white/5"
            rows={4}
          />

          <div className="flexc justify-end">
            <button className="mt-3 font-[450] tracking-sm hover:opacity-80 transition-all bg-white rounded-md text-black px-3.5 py-1.5 text-[13px]">
              Submit
            </button>
          </div>
        </div>
      </div>
      <button className="grayButton xs group">
        <UserCircleIcon
          strokeWidth={1.4}
          className="w-[18px] -ml-0.5 -translate-y-[0.5px]"
        />
        Account
        <span className="group-hover:opacity-60" />
      </button>

      <Link passHref href={"/keys?ref=API"} className="grayButton xs group">
        <CodeBracketIcon
          strokeWidth={1.4}
          className="w-[18px] -ml-0.5 -translate-y-[0.5px]"
        />
        API Reference
        <span className="group-hover:opacity-60" />
      </Link>

      {/* <button className="px-2 py-1.5 text-sm opacity-75 hover:opacity-100 transition-all">
        Support
      </button> */}
    </div>
  );
}
