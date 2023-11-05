import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  BanknotesIcon,
  ChartBarSquareIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  LifebuoyIcon,
  PlusIcon,
  PresentationChartBarIcon,
  QueueListIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

import { ColorNames, ColorValues } from "../utilities/rechartColors";

import { BarList, DonutChart, AreaChart, BarChart } from "@tremor/react";

const UserSource = [
  { name: "Facebook", users: 202 },
  { name: "Instagram", users: 142 },
  { name: "TikTok", users: 109 },
  { name: "Twitter", users: 130 },
  { name: "Organic SEO", users: 182 },
];

const UsersCharts = [
  { date: "Oct 19", Users: 180 },
  { date: "Oct 20", Users: 195 },
  { date: "Oct 21", Users: 210 },
  { date: "Oct 22", Users: 165 },
  { date: "Oct 23", Users: 180 },
  { date: "Oct 24", Users: 155 },
  { date: "Oct 25", Users: 225 },
];

const SourceData = [
  { name: "Stripe: Payment Succeded", value: 324 },
  { name: "New File Uploaded", value: 249 },
];

const chartdata2 = [
  {
    name: "Errors",
    "Group A": 590,
    "Group B": 338,
    "Group C": 538,
    "Group D": 396,
    "Group E": 338,
    "Group F": 436,
  },
];

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
    p: "Stripe: Payment Succeeded",
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
        <title>Charts • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar uI={user} current="Charts" />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Charts</h3>
              <p className="mdP mt-1">
                Monitor your events and analytics all in one place.
              </p>

              <div className="mt-10 mb-6 flexc justify-between pb-4 border-b border-white/10">
                <div className="flex gap-3">
                  <button className="grayButton xs group">
                    <PlusIcon className="w-4 -ml-[3px]" />
                    Create a Chart
                    <span className="group-hover:opacity-60" />
                  </button>

                  <button className="grayButton xs group">
                    <PresentationChartBarIcon className="w-4 -ml-0.5" />
                    Use a Template
                    <span className="group-hover:opacity-60" />
                  </button>
                </div>

                <button className="grayButton xs group">
                  <QueueListIcon className="w-4 -ml-px -translate-y-[0.25px]" />
                  Edit Chart View
                  <span className="group-hover:opacity-60" />
                </button>
              </div>

              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10 flexc justify-between">
                    <div>
                      <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                        <ChartBarSquareIcon className="w-4" />
                        New Users Registration
                      </p>
                      <p className="text-[12.5px] mt-0.5 opacity-75">
                        Last 7 days, Category: Sign-Ups
                      </p>
                    </div>
                    <EllipsisVerticalIcon className="w-5 opacity-75 transition-all hover:opacity-100 cursor-pointer" />
                  </div>

                  <div className="flex gap-10 p-4 h-60">
                    <AreaChart
                      className="h-52 mt-1 w-full"
                      data={UsersCharts}
                      categories={["Users"]}
                      showYAxis={false}
                      showAnimation
                      index="date"
                      showLegend={false}
                      colors={ColorNames}
                      curveType="natural"
                      valueFormatter={(number) =>
                        new Intl.NumberFormat("us").format(number).toString()
                      }
                    />
                  </div>
                </div>

                <div className="col-span-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10 flexc justify-between">
                    <div>
                      <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                        <ChartBarSquareIcon className="w-4" />
                        New Users Sources
                      </p>
                      <p className="text-[12.5px] mt-0.5 opacity-75">
                        Last 7 days, Category: Sign-Ups
                      </p>{" "}
                    </div>{" "}
                    <EllipsisVerticalIcon className="w-5 opacity-75 transition-all hover:opacity-100 cursor-pointer" />
                  </div>

                  <div className="flexc justify-center gap-10 p-4 h-60">
                    <DonutChart
                      className="h-40 w-40"
                      data={UserSource}
                      showAnimation
                      category="users"
                      valueFormatter={(number) =>
                        new Intl.NumberFormat("us").format(number).toString()
                      }
                      colors={ColorNames}
                    />
                    <div className="flex flex-col gap-2">
                      {UserSource.map((it, i) => (
                        <div key={i} className="flexc gap-1.5 text-[13px]">
                          <div
                            style={{ background: ColorValues[i] }}
                            className={`w-3 h-3 rounded-[4px]`}
                          />
                          {it.name}
                          <span className="opacity-75">({it.users})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10 flexc justify-between">
                    <div>
                      <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                        <ChartBarSquareIcon className="w-4" />
                        Landing Page Views
                      </p>
                      <p className="text-[12.5px] mt-0.5 opacity-75">
                        Last 7 days, Category: Analytics
                      </p>{" "}
                    </div>{" "}
                    <EllipsisVerticalIcon className="w-5 opacity-75 transition-all hover:opacity-100 cursor-pointer" />
                  </div>

                  <div className="flexc flex-col gap-2 mt-6 -mb-6 p-4 h-56">
                    <div className="flexc gap-1.5 text-[13px] font-uncut font-medium">
                      <div className="w-3 h-3 translate-y-[0.25px] bg-[#3b82f6] rounded-[4px]" />
                      Overall
                    </div>
                    <p className="text-6xl font-semibold font-uncut tracking-tighter">
                      25,493
                    </p>
                    <p className="font-uncut text-sm opacity-75">
                      Overall Views
                    </p>
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10 flexc justify-between">
                    <div>
                      <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                        <ChartBarSquareIcon className="w-4" />
                        Top Performing Webhooks
                      </p>
                      <p className="text-[12.5px] mt-0.5 opacity-75">
                        Last 7 days, Category: Webhooks
                      </p>
                    </div>{" "}
                    <EllipsisVerticalIcon className="w-5 opacity-75 transition-all hover:opacity-100 cursor-pointer" />
                  </div>

                  <div className="flexc flex-col text-[#ffffffba] justify-center p-4 h-56 overflow-hidden">
                    <BarList
                      className="h-52 mt-1 w-full"
                      data={SourceData}
                      showAnimation

                      // curveType="natural"
                      // valueFormatter={(number) =>
                      //   new Intl.NumberFormat("us").format(number).toString()
                      // }
                    />
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10 flexc justify-between">
                    <div>
                      <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                        <ChartBarSquareIcon className="w-4" />
                        Top Errors Sources
                      </p>
                      <p className="text-[12.5px] mt-0.5 opacity-75">
                        Last 7 days, Category: Errors
                      </p>
                    </div>{" "}
                    <EllipsisVerticalIcon className="w-5 opacity-75 transition-all hover:opacity-100 cursor-pointer" />
                  </div>

                  <div className="flexc flex-col justify-center p-4 h-56">
                    <BarChart
                      className="h-52 mt-1 w-full"
                      index="name"
                      categories={[
                        "Group A",
                        "Group B",
                        "Group C",
                        "Group D",
                        "Group E",
                        "Group F",
                      ]}
                      showLegend={false}
                      showYAxis={false}
                      colors={ColorNames}
                      valueFormatter={(number) =>
                        new Intl.NumberFormat("us").format(number).toString()
                      }
                      data={chartdata2}
                    />
                  </div>
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

  const { data } = await supabase.from("users").select("*");

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data ?? [],
    },
  };
};