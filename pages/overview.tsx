import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { connect } from "@planetscale/database";
import supabase, { config } from "@/utilities/supabaseClient";
import { Category, Event } from "@/utilities/databaseTypes";
import {
  ChartBarSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { AreaChart, BarChart } from "@tremor/react";
import { ColorNames } from "@/utilities/rechartColors";
import { IconLibrary } from "@/utilities/iconsLibrary";
import { Dialog } from "@radix-ui/themes";
import { toast } from "sonner";
import { useRouter } from "next/router";

function calculateAverageEventsPerDay(events: Event[]): number {
  const currentDate = new Date();
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    dates.push(
      date.toLocaleString("default", { month: "short", day: "2-digit" })
    );
  }

  const eventCounts: Record<string, number> = {};
  const uniqueEventDates: Set<string> = new Set(); // Set to track unique event dates

  events.forEach((event) => {
    const eventDate = new Date(event.ed).toLocaleString("default", {
      month: "short",
      day: "2-digit",
    });
    if (dates.includes(eventDate)) {
      if (!eventCounts[eventDate]) {
        eventCounts[eventDate] = 1;
        uniqueEventDates.add(eventDate);
      } else {
        eventCounts[eventDate]++;
      }
    }
  });

  // Calculate the average based on unique event dates
  const uniqueEventDatesCount = uniqueEventDates.size;
  const totalEvents = Object.values(eventCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const averageEventsPerDay =
    uniqueEventDatesCount > 0 ? totalEvents / uniqueEventDatesCount : 0;

  return Math.round(averageEventsPerDay);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  const dayWithSuffix =
    day +
    (day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th");
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDateTime = `${month} ${dayWithSuffix}, ${
    time.charAt(0) == "0" ? time.substring(1) : time
  }`;

  return formattedDateTime;
}

const UsersCharts = [
  { date: "Oct 19", Events: 180 },
  { date: "Oct 20", Events: 195 },
  { date: "Oct 21", Events: 210 },
  { date: "Oct 22", Events: 165 },
  { date: "Oct 23", Events: 180 },
  { date: "Oct 24", Events: 155 },
  { date: "Oct 25", Events: 225 },
];

const ErrorsData = [
  {
    name: "Categories",
    Errors: 381,
    Webhooks: 593,
    Payments: 428,
    Support: 326,
    Analytics: 452,
    Registrations: 571,
    "File Uploads": 394,
    "AWS S3": 326,
    "DDoS Attacks": 472,
  },
];

export default function Overview({
  user,
  categoriesData,
  eventsListData,
  favCategories,
}: {
  user: User;
  eventsListData: Event[];
  categoriesData: Category[];
  favCategories: any;
}) {
  const [pagination, setPagination] = useState(0);

  const [openEventDialog, setOpenEventDialog] = useState(-1);

  const [eventsList, setEventsList] = useState(
    eventsListData
      .map((e) => ({ ...e, ed: new Date(e.ed) }))
      .sort((a, b) => b.ed.getTime() - a.ed.getTime())
  );
  const [expandList, setExpandList] = useState(eventsListData.length < 6);

  const router = useRouter();
  const [isDemoPresent, setIsDemoPresent] = useState(false);

  useEffect(() => {
    setIsDemoPresent(router.query.demo == "");
  }, [router]);

  return (
    <main className="dashboardParent">
      <Head>
        <title>Overview • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favCategories[0].fav_categories}
          categoriesList={categoriesData}
          uI={user}
          current="Overview"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Overview</h3>
              <p className="mdP mt-1 w-full pb-3.5 mb-5 border-b  border-white/10">
                Summarized overview of your project's events and analytics.
              </p>

              <div className="grid grid-cols-3 gap-5">
                <Link
                  passHref
                  href={"/categories"}
                  className="overviewItemContainer group"
                >
                  <div className="flexc justify-center shadow-ins2 w-9 h-9 min-w-[36px] min-h-[36px] border rounded-3xl border-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[17px] stroke-white -translate-y-[0.5px]"
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
                  </div>

                  <div className="w-full justify-between flexc">
                    <p className="text-sm">Categories </p>
                    <div className="flexc translate-x-0.5">
                      <ChevronRightIcon
                        className="w-3 scale-y-100 transition-all duration-[250ms] group-hover:translate-x-[3px]"
                        strokeWidth={2.5}
                        stroke="white"
                      />
                      <svg
                        stroke="white"
                        fill="white"
                        strokeWidth={2.5}
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-[17px] w-5"
                        viewBox="0 0 100 100"
                      >
                        <g>
                          <path
                            className="opacity-0 group-hover:opacity-100 transition-all duration-[250ms]"
                            d="M26,50.5c0,1.104,0.896,2,2,2h44c1.104,0,2-0.896,2-2s-0.896-2-2-2H28C26.896,48.5,26,49.396,26,50.5z"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                </Link>

                <Link
                  passHref
                  href={"/events"}
                  className="overviewItemContainer group"
                >
                  <div className="flexc justify-center shadow-ins2 w-9 h-9 min-w-[36px] min-h-[36px] border rounded-3xl border-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[17px] stroke-white -translate-y-[0.5px]"
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
                  </div>

                  <div className="w-full justify-between flexc">
                    <p className="text-sm">Latest Events </p>
                    <div className="flexc translate-x-0.5">
                      <ChevronRightIcon
                        className="w-3 scale-y-100 transition-all duration-[250ms] group-hover:translate-x-[3px]"
                        strokeWidth={2.5}
                        stroke="white"
                      />
                      <svg
                        stroke="white"
                        fill="white"
                        strokeWidth={2.5}
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-[17px] w-5"
                        viewBox="0 0 100 100"
                      >
                        <g>
                          <path
                            className="opacity-0 group-hover:opacity-100 transition-all duration-[250ms]"
                            d="M26,50.5c0,1.104,0.896,2,2,2h44c1.104,0,2-0.896,2-2s-0.896-2-2-2H28C26.896,48.5,26,49.396,26,50.5z"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                </Link>

                <div className="overviewItemContainer group cursor-pointer">
                  <div className="flexc justify-center shadow-ins2 w-9 h-9 min-w-[36px] min-h-[36px] border rounded-3xl border-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[17px] stroke-white -translate-y-[0.5px]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M17 3.535c1.196.692 2 1.984 2 3.465 0 1.48-.804 2.773-2 3.465m4 10.268A2 2 0 0 0 22 19c0-1.48-.804-2.773-2-3.465M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-8 8h8a4 4 0 0 1 4 4 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 4 4 0 0 1 4-4Z"
                      />
                    </svg>
                  </div>

                  <div className="w-full justify-between flexc">
                    <p className="text-sm">Team Management</p>
                    <div className="flexc translate-x-0.5">
                      <ChevronRightIcon
                        className="w-3 scale-y-100 transition-all duration-[250ms] group-hover:translate-x-[3px]"
                        strokeWidth={2.5}
                        stroke="white"
                      />
                      <svg
                        stroke="white"
                        fill="white"
                        strokeWidth={2.5}
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-[17px] w-5"
                        viewBox="0 0 100 100"
                      >
                        <g>
                          <path
                            className="opacity-0 group-hover:opacity-100 transition-all duration-[250ms]"
                            d="M26,50.5c0,1.104,0.896,2,2,2h44c1.104,0,2-0.896,2-2s-0.896-2-2-2H28C26.896,48.5,26,49.396,26,50.5z"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-5">
                <div className="rounded-2xl bg-white/[0.035] border border-white/10">
                  <div className="p-4 border-b border-white/10 flexc justify-between">
                    <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                      <ChartBarSquareIcon className="w-4" />
                      Events Chart
                    </p>
                    <p className="text-[12.5px] mt-0.5 opacity-75">
                      Last 7 days
                    </p>
                  </div>

                  <div className="flex gap-10 p-4 h-52">
                    <AreaChart
                      className="h-44 mt-1 w-full"
                      data={UsersCharts}
                      categories={["Events"]}
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

                <div className="rounded-2xl bg-white/[0.035] border border-white/10">
                  <div className="p-4 border-b border-white/10 flexc justify-between">
                    <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                      <ChartBarSquareIcon className="w-4" />
                      Top Categories
                    </p>
                    <p className="text-[12.5px] mt-0.5 opacity-75">
                      Last 7 days
                    </p>
                  </div>

                  <div className="flex gap-10 p-4 h-52">
                    <BarChart
                      className="h-44 mt-1 w-full"
                      index="name"
                      categories={[
                        "Errors",
                        "Webhooks",
                        "Payments",
                        "Support",
                        "Analytics",
                        "Registrations",
                        "File Uploads",
                        "AWS S3",
                        "DDoS Attacks",
                      ]}
                      showLegend={false}
                      showYAxis={false}
                      colors={ColorNames}
                      valueFormatter={(number) =>
                        new Intl.NumberFormat("us").format(number).toString()
                      }
                      data={ErrorsData}
                    />
                  </div>
                </div>
              </div>

              <div className="flexc gap-2 my-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 stroke-white -translate-y-px"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 11v4m1-4h-2m-.621 10h3.242M12 2V1m7 3.707L19.707 4m-15 .707L4 4m18 7h-1M3 11H2m4.313-.532c0-3.023 2.546-5.474 5.687-5.474 3.141 0 5.688 2.45 5.688 5.474 0 1.657-.765 3.142-1.974 4.146-.51.424-.95.95-1.117 1.593l-.227.875c-.14.537-.624.912-1.18.912h-2.38a1.22 1.22 0 0 1-1.18-.912l-.227-.875c-.167-.643-.606-1.17-1.116-1.593-1.21-1.004-1.974-2.489-1.974-4.146Z"
                  />
                </svg>
                <p className="text-[15px]">
                  Based on our forecast, we expect{" "}
                  <span className="opacity-100 font-medium">
                    {calculateAverageEventsPerDay(eventsListData)}
                  </span>{" "}
                  new events today, across{" "}
                  <span className="opacity-100 font-medium">
                    {categoriesData.length}
                  </span>{" "}
                  categories.
                </p>
              </div>

              <div className="flexc justify-between mt-10 mb-4 pb-3 border-b border-white/10">
                <h4>Latest Events</h4>
                <Link
                  passHref
                  href={"/events"}
                  className="flexc gap-[2px] opacity-75 hover:opacity-100 transition-all duration-300 group"
                >
                  <p className="text-sm">Complete List</p>
                  <div className="flexc translate-x-0.5 translate-y-[0.5px]">
                    <ChevronRightIcon
                      className="w-3 scale-y-100 transition-all duration-[250ms] group-hover:translate-x-[3px]"
                      strokeWidth={2.5}
                      stroke="white"
                    />
                    <svg
                      stroke="white"
                      fill="white"
                      strokeWidth={2.5}
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="-ml-[16px] w-5"
                      viewBox="0 0 100 100"
                    >
                      <g>
                        <path
                          className="opacity-0 group-hover:opacity-100 transition-all duration-[250ms]"
                          d="M26,50.5c0,1.104,0.896,2,2,2h44c1.104,0,2-0.896,2-2s-0.896-2-2-2H28C26.896,48.5,26,49.396,26,50.5z"
                        />
                      </g>
                    </svg>
                  </div>
                </Link>
              </div>

              <div
                className={`transition-all duration-500 pb-8 relative ${
                  expandList
                    ? `max-h-[597.5px]`
                    : `max-h-[420px] overflow-hidden`
                }`}
              >
                <div className={`grid grid-cols-1 gap-3 pb-6`}>
                  {eventsList.length > 0 ? (
                    eventsList
                      .slice(pagination * 25, (pagination + 1) * 25)
                      .map((it, i) => (
                        <div
                          onClick={() => setOpenEventDialog(i)}
                          className="flex gap-5 cursor-pointer group"
                          key={i}
                        >
                          <div className="iconWrapper">
                            {categoriesData.find((c) => c.id == it.ec)
                              ? IconLibrary[
                                  categoriesData.find((c) => c.id == it.ec)!.ic
                                ].i("w-[18px]")
                              : IconLibrary[6].i("w-[18px]")}
                          </div>

                          <div className="pb-3 border-b border-white/[0.075] w-full flex justify-between">
                            <div>
                              <p className="font-[430] text-[15px] tracking-sm flexc gap-1.5">
                                {it.en}
                                <ChevronRightIcon
                                  strokeWidth={2.5}
                                  className="w-3.5 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 scale-y-90"
                                />
                              </p>
                              <div className="flexc gap-2 mt-0.5">
                                <p className="text-[13.5px] opacity-80">
                                  {categoriesData.find((c) => c.id == it.ec)
                                    ?.n || "No Category"}
                                </p>
                                <p className="text-[13.5px] opacity-80">•</p>
                                <p className="text-[13.5px] opacity-80">
                                  {formatDate(it.ed.toString())}
                                </p>
                              </div>
                            </div>

                            <div className="flexc gap-2">
                              {it.et &&
                                Object.entries(it.et)
                                  .slice(0, 3)
                                  .map(([key, value], i) => (
                                    <button
                                      key={i}
                                      className="px-3 py-1.5 text-[13px] capitalize grayButton group shadow-ins2"
                                    >
                                      {key}:{" "}
                                      <p className="opacity-70">{value}</p>
                                      <span className="group-hover:opacity-50" />
                                    </button>
                                  ))}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="my-7">
                      <p className="text-center text-[15px] font-medium">
                        No events found.
                      </p>
                      <p className="text-center text-[15px] opacity-75">
                        Click below to learn how to track events.
                      </p>

                      <div className="flexc gap-2 justify-center mt-3">
                        <button className="grayButton group xs ">
                          API Reference
                          <span className="group-hover:opacity-60" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 justify-end items-center mb-5 pb-5">
                  {Array.from(
                    { length: Math.ceil(eventsList.length / 24) },
                    (_, i) => (
                      <button
                        onClick={() => setPagination(i)}
                        className={`w-7 h-7 text-[13px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.075] flexc justify-center border border-white/10 ${
                          pagination == i
                            ? `bg-white/[0.075]`
                            : `bg-white/[0.015]`
                        }  shadow-ins2 rounded-lg`}
                        key={i}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => {
                    setExpandList(!expandList);
                  }}
                  className={`${
                    expandList ? `opacity-0 invisible` : `opacity-100 visible `
                  } transition-all duration-500 absolute bottom-0 h-28 justify-center [background:linear-gradient(0deg,rgba(4,4,11,1)_0%,rgba(4,4,11,1)_40%,rgba(4,4,11,0)_100%)] w-full text-[15px] gap-1.5 flexc`}
                >
                  <ChevronDownIcon className="w-4" strokeWidth={2} />
                  Expand Events List
                </button>
              </div>
            </div>
          </div>
        </div>

        <Dialog.Root
          onOpenChange={() => setOpenEventDialog(-1)}
          open={openEventDialog > -1}
        >
          {openEventDialog > -1 && (
            <Dialog.Content
              style={{
                borderRadius: "24px",
              }}
            >
              <div className="flex items-end justify-between w-full border-b border-white/10 pb-3 mb-4">
                <div>
                  <p className="text-[17px] font-[550] tracking-tight">
                    {eventsList[openEventDialog].en}
                  </p>
                  <p className="opacity-80 text-sm mt-0.5 tracking-sm">
                    {formatDate(
                      new Date(eventsList[openEventDialog].ed).toLocaleString()
                    )}
                  </p>
                </div>

                <Link
                  passHref
                  href={`/category/${eventsList[openEventDialog].ec}`}
                  className="flexc gap-1.5 opacity-75 transition-all hover:opacity-100"
                >
                  {categoriesData.find(
                    (c) => c.id == eventsList[openEventDialog].ec
                  )
                    ? IconLibrary[
                        categoriesData.find(
                          (c) => c.id == eventsList[openEventDialog].ec
                        )!.ic
                      ].i("w-[18px]")
                    : IconLibrary[6].i("w-[18px] scale-y-90")}
                  <p className="text-sm">
                    {categoriesData.find(
                      (c) => c.id == eventsList[openEventDialog].ec
                    )?.n || "No Category"}
                  </p>
                </Link>
              </div>

              <p className="text-sm">
                {eventsList[openEventDialog].edes ||
                  "No short description provided."}
              </p>

              <div className="flexc justify-between mt-10">
                <div className="flexc gap-2 ">
                  {eventsList[openEventDialog].et &&
                    Object.entries(eventsList[openEventDialog].et!)
                      .slice(0, 3)
                      .map(([key, value], i) => (
                        <button
                          key={i}
                          className="px-3 py-1.5 text-[13px] capitalize grayButton group shadow-ins2 outline-none"
                        >
                          {key}: <p className="opacity-70">{value}</p>
                          <span className="group-hover:opacity-50" />
                        </button>
                      ))}
                </div>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <button className="grayButton py-1.5 px-2 aspect-square group outline-none">
                      <TrashIcon className="w-4" />
                      <span className="group-hover:opacity-60" />
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Content
                    style={{
                      maxWidth: "400px",
                      background: "#151515",
                      borderRadius: "24px",
                    }}
                  >
                    <h4 className="">Delete Event</h4>
                    <p className="text-sm opacity-75 mt-1.5">
                      Are you sure you want to delete this event?
                      <br />
                      This action cannot be undone.
                    </p>
                    <div className="flexc gap-3 justify-end mt-5">
                      <Dialog.Close>
                        <button className={`grayButton md group outline-none`}>
                          Cancel
                          <span className="group-hover:opacity-60" />
                        </button>
                      </Dialog.Close>

                      <Dialog.Close>
                        <button
                          onClick={() => {
                            toast.promise(deleteEvent, {
                              loading: "Loading...",
                              success: "Event deleted!",
                              error: "Error occurred. Try again!",
                            });

                            async function deleteEvent() {
                              try {
                                const conn = await connect(config);
                                await conn.execute(
                                  `delete from events where eid = ${eventsList[openEventDialog].eid}`
                                );

                                setOpenEventDialog(-1);

                                setEventsList((prevList) =>
                                  prevList.filter(
                                    (event) =>
                                      event.eid !=
                                      eventsList[openEventDialog].eid
                                  )
                                );
                              } catch (error) {}
                            }
                          }}
                          className="px-5 py-[7px] text-[14px] rounded-m border text-white bg-red-500 border-red-400 flexc gap-1.5 transition-all duration-200 hover:opacity-75 active:scale-95"
                        >
                          <TrashIcon
                            strokeWidth={1.3}
                            className="w-4 -ml-0.5 -translate-y-[0.5px]"
                          />
                          Delete
                        </button>
                      </Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Root>

        <Dialog.Root
          onOpenChange={() => setIsDemoPresent(false)}
          open={isDemoPresent}
        >
          <Dialog.Trigger></Dialog.Trigger>

          <Dialog.Content
            style={{
              maxWidth: "430px",
              background: "#151515",
              borderRadius: "24px",
            }}
          >
            <h4 className="">Demo Account</h4>
            <p className="text-sm opacity-75 mt-1.5">
              You are currently logged in to our demo account.
              <br />
              You can log out and create a new account.
            </p>
            <div className="flexc gap-3 justify-between mt-8">
              <Dialog.Close>
                <button
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (!error) {
                      useRouter().push("/");
                    }
                  }}
                  className={`grayButton md group outline-none`}
                >
                  Log Out
                  <span className="group-hover:opacity-60" />
                </button>
              </Dialog.Close>

              <Dialog.Close>
                <button
                  className={`grayButton md group outline-none bg-white text-black`}
                >
                  OK
                  <span className="group-hover:opacity-60" />
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>
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

  const conn = await connect(config);
  const categoriesData = await conn.execute(
    `select * from categories where uid = '${session.user.id}' `
  );

  // const eventsList = await conn.execute(
  //   `SELECT * FROM events WHERE ed > DATE_SUB(NOW(), INTERVAL 7 DAY) and uid = '${session.user.id}' LIMIT 100`
  // );

  const eventsList = await conn.execute(
    `SELECT * FROM events WHERE uid = '${session.user.id}' LIMIT 100`
  );

  const favCategories = await supabase
    .from("users")
    .select("fav_categories")
    .eq("id", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session.user,
      categoriesData: categoriesData.rows ?? null,
      favCategories: favCategories.data ?? null,
      eventsListData: eventsList.rows ?? null,
    },
  };
};
