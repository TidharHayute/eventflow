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
  LifebuoyIcon,
  PlusIcon,
  SignalIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import Dialog from "@/components/Dialog";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";

const keys = [
  {
    ic: ({ cn }: { cn: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.25"
          d="M11 15H7a4 4 0 0 0-4 4 2 2 0 0 0 2 2h10m3-3v-3m0 0v-3m0 3h-3m3 0h3m-6-8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        />
      </svg>
    ),
    n: "Sign-Ups",
    p: "New Registration: name@email.com",
    ld: 207,
    at: 4618,
  },
  {
    ic: ({ cn }: { cn: string }) => (
      <ExclamationTriangleIcon strokeWidth={1.25} className={cn} />
    ),
    n: "Errors",
    p: "User Request Error 403",
    ld: 13,
    at: 216,
  },
  {
    ic: ({ cn }: { cn: string }) => (
      <SignalIcon strokeWidth={1.25} className={cn} />
    ),
    n: "Webhooks",
    p: "Slack Notification Triggered",
    ld: 87,
    at: 2186,
  },
  {
    ic: ({ cn }: { cn: string }) => (
      <BanknotesIcon strokeWidth={1.25} className={cn} />
    ),
    n: "Payments",
    p: "Stripe: Payment Succeded",
    ld: 39,
    at: 1074,
  },
  {
    ic: ({ cn }: { cn: string }) => (
      <LifebuoyIcon strokeWidth={1.25} className={cn} />
    ),
    n: "Support",
    p: "Technical Support Ticket: #127482",
    ld: 15,
    at: 593,
  },
];

export default function Categories({
  user,
  data,
  categoryData: any,
}: {
  user: User;
  data: any;
  categoryData: any;
}) {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <main className="bg-[#0a0a0a] relative z-10">
      <Head>
        <title>Sign-Ups • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar uI={user} current="Categories" />

        <div className="z-10">
          <DashboardHeader />

          <div className="dashboardView">
            <div className="flexc gap-2"></div>
            <div className="flex gap-4">
              <div className="w-12 h-12 flexc justify-center border border-white/10 shadow-ins2 rounded-xl bg-white/5">
                <UserPlusIcon className="w-[22px] stroke-white" />
              </div>

              <div className="">
                <h4 className="text-2xl">Sign-Ups</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 border-white/10 border-t pt-4 mt-4">
              {keys.map((it, i) => (
                <div className="flex gap-5 cursor-pointer group" key={i}>
                  <div className="w-[44px] h-[44px] rounded-xl border border-white/10 flexc justify-center shadow-[inset_0px_-3px_12px_1px_rgba(255,255,255,0.05)]">
                    {/* {it.ic({
                      cn: "w-[18px] stroke-white -translate-y-[0.5px]",
                    })} */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 stroke-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m7 20 3-16m4 16 3-16m2.5 11h-16m17-6h-16"
                      />
                    </svg>
                  </div>

                  <div className="pb-3 border-b border-white/10 w-full flex justify-between">
                    <div>
                      <p className="font-[450] tracking-sm flexc gap-1.5">
                        {it.n}{" "}
                        <ChevronRightIcon
                          strokeWidth={2.5}
                          className="w-3.5 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 scale-y-90"
                        />
                      </p>
                      <div className="flexc gap-2 mt-0.5">
                        <p className="text-[13.5px] opacity-80">Category</p>
                        <p className="text-[13.5px] opacity-80">•</p>
                        <p className="text-[13.5px] opacity-80">
                          27th October at 9:12am
                        </p>
                      </div>
                    </div>

                    <div className="flexc gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 mr-1 stroke-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.25"
                          d="M8 8h.01m-4.892-.341-.044.82c-.082 1.573-.124 2.359.026 3.102a6 6 0 0 0 .717 1.869c.386.653.943 1.21 2.056 2.323l2.421 2.421c1.317 1.316 1.975 1.974 2.68 2.334a5 5 0 0 0 4.54 0c.706-.36 1.364-1.018 2.68-2.334s1.974-1.974 2.334-2.68a5 5 0 0 0 0-4.54c-.36-.705-1.018-1.363-2.334-2.68l-2.421-2.421c-1.114-1.113-1.67-1.67-2.323-2.056a6 6 0 0 0-1.869-.717c-.743-.15-1.53-.108-3.101-.026l-.821.044c-1.525.08-2.287.12-2.878.437A3 3 0 0 0 3.555 4.78c-.317.59-.357 1.353-.437 2.878Zm5.371.329a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
                        />
                      </svg>
                      <button className="px-3 py-1.5 text-[13px] capitalizep outline-none rounded-m border border-white/10 bg-white/5 relative group overflow-hidden shadow-ins2">
                        source:<span className="opacity-80"> facebook</span>
                        <span className="absolute inset-0 bg-gradient-to-t group-hover:opacity-50 opacity-0 transition-all duration-300 from-white/10 via-white/5 to-white/[0.02]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

  const query = ctx.query;

  const conn = await connect(config);
  const categoryData = await conn.execute(
    `select * from categories where uid = '${session.user.id}' and id  = '${query.categoryId}'`
  );
  const categoryEvents = await conn.execute(
    `SELECT * FROM events WHERE ed >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND ed <= CURDATE() and ec = ${query.categoryId}`
  );

  // const { data } = await supabase.from("users").select("*");

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: [],
      categoryData: categoryData.rows[0] ?? null,
      categoryEvents: categoryEvents.rows[0] ?? null,
    },
  };
};
