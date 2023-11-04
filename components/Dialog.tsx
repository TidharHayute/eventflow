import React, { ReactNode, useEffect, useRef } from "react";

type MyComponentProps = {
  children: ReactNode;
  open: boolean;
  close: () => void;
};

const Dialog: React.FC<MyComponentProps> = ({ children, open, close }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open !== false) {
      const handleClickOutside = (event: MouseEvent) => {
        if (!dialogRef.current?.contains(event.target as Node)) close();
      };

      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open, dialogRef]);

  return (
    <div
      className={`bg-black/60 fixed inset-0 flexc justify-center transition-all duration-200 ${
        open ? `opacity-100 visible` : `opacity-0 invisible`
      }`}
    >
      <div
        ref={dialogRef}
        style={{ maxWidth: "450px" }}
        className={`border border-white/10 w-full shadow-2xl bg-[#151515] rounded-3xl p-6 transition-all duration-200 origin-center z-10 ${
          open
            ? `translate-y-0 scale-100 visible`
            : `translate-y-1 scale-[0.975] invisible`
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
