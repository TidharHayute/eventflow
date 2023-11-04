import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  BanknotesIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  HashtagIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  SignalIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import { DropdownMenu } from "@radix-ui/themes";

const keys = [
  {
    ic: ({ cn }: { cn: string }) => <BanknotesIcon className={cn} />,
    n: "Stripe: Payment Succeded",
    c: "Payments",
    d: "27th October at 9:12am",
    t: [{ t: "plan", v: "Premium" }],
  },
  {
    ic: ({ cn }: { cn: string }) => <UserPlusIcon className={cn} />,
    n: "New Registration: name@email.com",
    c: "Sign-Ups",
    d: "27th October at 7:48am",
    t: [{ t: "source", v: "facebook" }],
  },
  {
    ic: ({ cn }: { cn: string }) => <ExclamationTriangleIcon className={cn} />,
    n: "User Request Error 403",
    c: "Errors",
    d: "26th October at 11:32pm",
    t: [{ t: "error", v: "403" }],
  },
  {
    ic: ({ cn }: { cn: string }) => (
      <LifebuoyIcon
        strokeWidth={1.2}
        style={{ transform: "scale(1.1)" }}
        className={cn}
      />
    ),
    n: "Technical Support Ticket: #127482",
    c: "Support",
    d: "26th October at 11:09am",
    t: [{ t: "support", v: "Technical" }],
  },
  {
    ic: ({ cn }: { cn: string }) => <SignalIcon className={cn} />,
    n: "Slack Notification Triggered",
    c: "Webhooks",
    d: "26th October at 10:53am",
    t: [],
  },
  {
    ic: ({ cn }: { cn: string }) => <UserPlusIcon className={cn} />,
    n: "New Registration: name@email.com",
    c: "Sign-Ups",
    d: "26th October at 10:28pm",
    t: [{ t: "source", v: "google ads" }],
  },
];

export default function LatestEvents({
  user,
  data,
}: {
  user: User;
  data: any;
}) {
  return (
    <main className="dashboardParent">
      <Head>
        <title>Latest Events • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar uI={user} current="Latest Events" />

        <div className="dashboardWrap">
          <div className="dashboardBody ">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Latest Events</h3>
              <p className="mdP mt-1">
                List of recent events you have recoreded in the last 7 days.
              </p>

              <div className="mt-10 mb-5 flexc justify-between pb-4 border-b border-white/10">
                <div className="flex gap-3">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <button className="grayButton xs group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 stroke-white -ml-px"
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
                        Categories: All
                        <span className="group-hover:opacity-60" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                      style={{
                        marginTop: "5px",
                        background: "#151515",
                      }}
                    >
                      <div className="-m-px">
                        <button className="flexc w-40 truncate gap-1.5 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm">
                          <BanknotesIcon strokeWidth={1.3} className="w-4" />
                          Payments
                        </button>
                        <button className="flexc w-40 gap-1.5 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm">
                          <BanknotesIcon strokeWidth={1.3} className="w-4" />
                          Payments
                        </button>
                        <DropdownMenu.Separator />
                        <button className="flexc w-40 gap-1.5 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 stroke-white"
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
                          All Categories
                        </button>
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <button className="grayButton xs group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 stroke-white -ml-px"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M8 8h.01m-4.892-.341-.044.82c-.082 1.573-.124 2.359.026 3.102a6 6 0 0 0 .717 1.869c.386.653.943 1.21 2.056 2.323l2.421 2.421c1.317 1.316 1.975 1.974 2.68 2.334a5 5 0 0 0 4.54 0c.706-.36 1.364-1.018 2.68-2.334s1.974-1.974 2.334-2.68a5 5 0 0 0 0-4.54c-.36-.705-1.018-1.363-2.334-2.68l-2.421-2.421c-1.114-1.113-1.67-1.67-2.323-2.056a6 6 0 0 0-1.869-.717c-.743-.15-1.53-.108-3.101-.026l-.821.044c-1.525.08-2.287.12-2.878.437A3 3 0 0 0 3.555 4.78c-.317.59-.357 1.353-.437 2.878Zm5.371.329a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
                          />
                        </svg>
                        Tags: All
                        <span className="group-hover:opacity-60" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content style={{ marginTop: "5px" }}>
                      <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                      <DropdownMenu.Item shortcut="⌘ D">
                        Duplicate
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item shortcut="⌘ N">
                        Archive
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <button className="grayButton xs group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 stroke-white -ml-px"
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
                        Key Tokens: All
                        <span className="group-hover:opacity-60" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content style={{ marginTop: "5px" }}>
                      <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                      <DropdownMenu.Item shortcut="⌘ D">
                        Duplicate
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item shortcut="⌘ N">
                        Archive
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>

                <div className="px-3.5 py-1.5 text-[14px] rounded-m border border-white/10 focus-within:border-white/20 bg-white/5 flexc gap-2 relative group overflow-hidden shadow-ins2">
                  <MagnifyingGlassIcon className="w-4 -ml-0.5 stroke-white" />
                  <input
                    placeholder="Search..."
                    className="bg-transparent outline-none placeholder:text-[#8a8a8a] w-56"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {keys.map((it, i) => (
                  <div className="flex gap-5 cursor-pointer group" key={i}>
                    <div className="w-[44px] h-[44px] aspect-square rounded-xl border border-white/10 flexc justify-center shadow-[inset_0px_-3px_12px_1px_rgba(255,255,255,0.05)]">
                      {it.ic({
                        cn: "w-[18px] stroke-white -translate-y-[0.5px]",
                      })}
                    </div>

                    <div className="pb-3 border-b border-white/[0.075] w-full flex justify-between">
                      <div>
                        <p className="font-[43  0] text-[15px] tracking-sm flexc gap-1.5">
                          {it.n}{" "}
                          <ChevronRightIcon
                            strokeWidth={2.5}
                            className="w-3.5 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 scale-y-90"
                          />
                        </p>
                        <div className="flexc gap-2 mt-0.5">
                          <p className="text-[13.5px] opacity-80">{it.c}</p>
                          <p className="text-[13.5px] opacity-80">•</p>
                          <p className="text-[13.5px] opacity-80">{it.d}</p>
                        </div>
                      </div>

                      <div className="flexc gap-2">
                        {it.t.map((it, i) => (
                          <button
                            key={i}
                            className="px-3 py-1.5 text-[13px] capitalize outline-none rounded-m border border-white/10 bg-white/5 relative group overflow-hidden shadow-ins2"
                          >
                            {it.t}:<span className="opacity-80"> {it.v}</span>
                            <span className="absolute inset-0 bg-gradient-to-t group-hover:opacity-50 opacity-0 transition-all duration-300 from-white/10 via-white/5 to-white/[0.02]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-1.5 justify-end items-center mt-3">
                  <button
                    className={`w-7 h-7 text-[13px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.075] flexc justify-center border border-white/10 bg-white/5 shadow-ins2 rounded-lg`}
                  >
                    1
                  </button>
                  <button
                    className={`w-7 h-7 text-[13px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.075] flexc justify-center border border-white/10 shadow-ins2 rounded-lg`}
                  >
                    2
                  </button>
                  <button
                    className={`w-7 h-7 text-[13px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.075] flexc justify-center border border-white/10 shadow-ins2 rounded-lg`}
                  >
                    3
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // const conn = connect(config);
  // const results = await conn.execute("select 1 from dual where 1=?", [1]);

  const { data } = await supabase.from("users").select("*");

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data ?? [],
    },
  };
};
