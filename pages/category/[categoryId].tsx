import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  ChartBarSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { connect } from "@planetscale/database";
import supabase, { config } from "@/utilities/supabaseClient";
import { Category, Event } from "@/utilities/databaseTypes";
import { toast } from "sonner";
import { IconLibrary } from "@/utilities/iconsLibrary";
import { Dialog, DropdownMenu } from "@radix-ui/themes";
import Router from "next/router";
import { AreaChart, BarList } from "@tremor/react";

function calculateEventsPerDay(events: Event[]) {
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
  const topEvents: Record<string, number> = {}; // Object to store event counts by name

  events.forEach((event) => {
    const eventDate = new Date(event.ed).toLocaleString("default", {
      month: "short",
      day: "2-digit",
    });
    if (dates.includes(eventDate)) {
      if (!eventCounts[eventDate]) {
        eventCounts[eventDate] = 1;
      } else {
        eventCounts[eventDate]++;
      }

      // Track event counts by name
      if (!topEvents[event.en]) {
        topEvents[event.en] = 1;
      } else {
        topEvents[event.en]++;
      }
    }
  });

  const EventsChart = dates.map((date) => ({
    date: date,
    Events: eventCounts[date] || 0,
  }));

  // Convert the top events object into the desired array format
  const topEventsArray = Object.entries(topEvents).map(([name, value]) => ({
    name,
    value,
  }));

  return { EventsChart, topEvents: topEventsArray };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

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
  { date: "Oct 19", Users: 180 },
  { date: "Oct 20", Users: 195 },
  { date: "Oct 21", Users: 210 },
  { date: "Oct 22", Users: 165 },
  { date: "Oct 23", Users: 180 },
  { date: "Oct 24", Users: 155 },
  { date: "Oct 25", Users: 225 },
];

const SourceData = [
  { name: "Home Page Visit", value: 124 },
  { name: "Pricing Page Visit", value: 94 },
];

export default function CategoryPage({
  user,

  categoriesData,
  categoryEvents,
  favCategories,
  categoryId,
}: {
  user: User;

  categoriesData: Category[];
  categoryEvents: Event[];
  favCategories: any;
  categoryId: number;
}) {
  const [eventsList, setEventsList] = useState(
    categoryEvents
      .map((e) => ({ ...e, ed: new Date(e.ed) }))
      .sort((a, b) => b.ed.getTime() - a.ed.getTime())
  );

  const [category, setCategory] = useState(
    categoriesData.find((category: any) => category.id == categoryId)!
  );

  const [searchIcon, setSearchIcon] = useState("");

  const [selectedIcon, setSelectedIcon] = useState(category.ic);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [expandList, setExpandList] = useState(categoryEvents.length < 6);

  const [favoriteCategories, setFavoriteCategories] = useState<number[]>(
    favCategories[0].fav_categories
  );

  const eventsPerDay = calculateEventsPerDay(categoryEvents).EventsChart;
  const topEvents = calculateEventsPerDay(categoryEvents).topEvents;

  const [pagination, setPagination] = useState(0);

  const [openEventDialog, setOpenEventDialog] = useState(-1);

  return (
    <main className="dashboardParent">
      <Head>
        <title>{category.n.toString()} • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favoriteCategories}
          categoriesList={categoriesData}
          uI={user}
          current="Categories"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader showBack="/categories" />

            <div className="dashboardView">
              <div className="flex justify-between items-end pb-4 mb-4 border-b border-white/10">
                <div>
                  <h3>{category.n || "Category Name"}</h3>
                  <div className="flexc gap-2 mt-1">
                    <p className="mdP">Total Events: {category.t}</p>
                    <p className="mdP text-sm">•</p>
                    <p className="mdP">
                      Last Update:{" "}
                      {eventsList.length > 0
                        ? formatDate(eventsList[0].ed.toString())
                        : "Never"}
                    </p>
                  </div>
                </div>

                <div className="flexc gap-2.5 mb-[5px]">
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        category.id.toString()
                      );
                      toast.success(`Copied Category ID`);
                    }}
                    className="grayButton xs font-uncut group"
                  >
                    <HashtagIcon className="w-3.5 -ml-0.5 scale-y-90" />
                    {category.id}
                    <span className="group-hover:opacity-60" />
                  </button>

                  <Dialog.Root
                    onOpenChange={() => {
                      setSelectedIcon(category.ic);
                    }}
                  >
                    <Dialog.Trigger>
                      <button className="grayButton xs group">
                        {IconLibrary[category.ic].i("w-4")}
                        Change Icon
                        <span className="group-hover:opacity-60" />
                      </button>
                    </Dialog.Trigger>

                    <Dialog.Content
                      style={{
                        maxWidth: "450px",
                        borderRadius: "24px",
                      }}
                    >
                      <div className="flexc justify-between">
                        <h4>Change Icon</h4>

                        <Dialog.Close>
                          <XMarkIcon
                            className="w-4 opacity-75 hover:opacity-100 translate-x-0 duration-200 cursor-pointer"
                            strokeWidth={1.75}
                          />
                        </Dialog.Close>
                      </div>

                      <div className="px-3.5 py-[7px] text-[15px] rounded-m border border-white/10 focus-within:border-white/20 bg-white/5 flexc gap-2 relative group overflow-hidden shadow- mt-2.5">
                        <MagnifyingGlassIcon className="w-4 -ml-0.5 stroke-white" />
                        <input
                          placeholder="Search..."
                          value={searchIcon}
                          onChange={(e) => setSearchIcon(e.target.value)}
                          className="bg-transparent outline-none placeholder:text-[#8a8a8a] w-full"
                        />
                      </div>

                      <div className="grid grid-cols-8 grid-rows-4 gap-2.5 mt-4 min-h-[194px]">
                        {IconLibrary.filter((ic) =>
                          ic.k.toLowerCase().includes(searchIcon.toLowerCase())
                        ).map((ic, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedIcon(i);
                            }}
                            className={`aspect-square flexc justify-center border rounded-m border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-0.5 hover:shadow-l duration-200 ${
                              selectedIcon == i &&
                              `bg-white/[0.15] border-white/20`
                            }`}
                          >
                            {ic.i("w-[18px] stroke-white")}
                          </button>
                        ))}
                        {IconLibrary.filter((ic) =>
                          ic.k.toLowerCase().includes(searchIcon.toLowerCase())
                        ).length == 0 && (
                          <p className="col-span-8 row-span-4 mb-3 flexc gap-1.5 -translate-y-[0.75px] justify-center opacity-75">
                            <MagnifyingGlassIcon className="w-4" />
                            No icons found. Try something else.
                          </p>
                        )}
                      </div>

                      <div className="flexc justify-end mt-7">
                        <Dialog.Close>
                          <button
                            onClick={() => {
                              setCategory({ ...category, ic: selectedIcon });

                              async function updateCategoryIcon() {
                                const conn = connect(config);

                                await conn.execute(
                                  `update categories set ic = ${selectedIcon} where id = ${category.id}`
                                );
                              }

                              updateCategoryIcon();
                            }}
                            className="px-3.5 py-2 text-[14px] rounded-m border text-black border-white bg-white flexc gap-1.5 transition-all duration-300 hover:opacity-75"
                          >
                            Change
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Root>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <button className="grayButton xs group">
                        <PencilSquareIcon
                          strokeWidth={1.3}
                          className="w-4 -translate-y-[0.75px]"
                        />
                        Edit
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
                        <Dialog.Root>
                          <Dialog.Trigger>
                            <button className="flexc text-[15px] w-[150px] relative truncate gap-2 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 -translate-y-[0.5px] -ml-px stroke-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.4"
                                  d="M13 21h8M15.118 5.216l1.745-1.753a1.569 1.569 0 0 1 1.964-.212 6.32 6.32 0 0 1 1.932 1.965c.404.65.272 1.473-.258 2.006l-1.674 1.681m-3.71-3.687L3.81 16.573c-.266.267-.398.4-.495.555-.085.138-.15.288-.19.445-.045.177-.05.365-.059.742L3 20.995 5.727 21c.39 0 .584 0 .767-.043.163-.04.318-.104.46-.191.161-.1.299-.237.574-.514L18.827 8.903m-3.71-3.687 3.71 3.687"
                                />
                              </svg>
                              Change Name
                            </button>
                          </Dialog.Trigger>

                          <Dialog.Content
                            style={{
                              maxWidth: "400px",
                              background: "#151515",
                              borderRadius: "24px",
                            }}
                          >
                            <h4>Change Name</h4>

                            <input
                              className="border focus:outline-none mt-2 focus:border-white/20 placeholder:text-[#757575] border-white/10 rounded-m px-3 py-2.5 text-sm w-full bg-white/5"
                              placeholder="Category Name"
                              maxLength={17}
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                            />

                            <div className="flexc gap-3 justify-end mt-5">
                              <Dialog.Close>
                                <button
                                  className={`grayButton md group outline-none`}
                                >
                                  Cancel
                                  <span className="group-hover:opacity-60" />
                                </button>
                              </Dialog.Close>

                              <Dialog.Close>
                                <button
                                  onClick={() => {
                                    setCategory({
                                      ...category,
                                      n: newCategoryName,
                                    });

                                    async function updateCategoryName() {
                                      const conn = connect(config);

                                      const dd = await conn.execute(
                                        `update categories set n = '${newCategoryName}' where id = ${category.id}`
                                      );
                                    }

                                    updateCategoryName();
                                    setNewCategoryName("");
                                  }}
                                  className="md text-[14px] rounded-m border text-black border-white bg-white flexc gap-1.5 transition-all duration-300 hover:opacity-75"
                                >
                                  Change
                                </button>
                              </Dialog.Close>
                            </div>
                          </Dialog.Content>
                        </Dialog.Root>

                        <Dialog.Root>
                          <Dialog.Trigger>
                            <button className="flexc text-[15px] w-[150px] relative truncate gap-1.5 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm">
                              <TrashIcon className="w-3.5 -translate-y-[0.5px] -ml-px" />
                              Delete Category
                            </button>
                          </Dialog.Trigger>

                          <Dialog.Content
                            style={{
                              maxWidth: "400px",
                              background: "#151515",
                              borderRadius: "24px",
                            }}
                          >
                            <h4 className="">Delete Category</h4>
                            <p className="text-sm opacity-75 mt-1.5">
                              Are you sure you want to delete this category?
                              <br />
                              This action cannot be undone.
                            </p>
                            <div className="flexc gap-3 justify-end mt-5">
                              <Dialog.Close>
                                <button
                                  className={`grayButton md group outline-none`}
                                >
                                  Cancel
                                  <span className="group-hover:opacity-60" />
                                </button>
                              </Dialog.Close>

                              <Dialog.Close>
                                <button
                                  onClick={async () => {
                                    try {
                                      const conn = await connect(config);
                                      await conn.execute(
                                        `delete from categories where id = ${category.id}`
                                      );

                                      Router.push("/categories");
                                    } catch (error) {}
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

                        <button
                          onClick={async () => {
                            if (favoriteCategories.includes(category.id)) {
                              const updatedFavorites =
                                favoriteCategories.filter(
                                  (c) => c != category.id
                                );

                              const { data, error } = await supabase
                                .from("users")
                                .update({ fav_categories: updatedFavorites })
                                .eq("id", user.id);

                              setFavoriteCategories(updatedFavorites);
                            } else {
                              const updatedFavorites = [
                                ...favoriteCategories,
                                category.id,
                              ];

                              const { data, error } = await supabase
                                .from("users")
                                .update({ fav_categories: updatedFavorites })
                                .eq("id", user.id);

                              setFavoriteCategories(updatedFavorites);
                            }
                          }}
                          className="flexc text-[15px] w-[150px] relative truncate gap-1.5 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm"
                        >
                          <StarIcon
                            className={`w-3.5 scale-105 -translate-y-px -ml-px ${
                              favoriteCategories.includes(category.id) &&
                              `fill-white`
                            }`}
                          />
                          {favoriteCategories.includes(category.id)
                            ? `Unfavorite`
                            : `Favorite`}
                        </button>
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
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
                            {IconLibrary[category.ic].i("w-[18px]")}
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

                <div className="flex gap-1.5 justify-end items-center">
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

              <div className="grid grid-cols-10 gap-6 mt-5">
                <div className="col-span-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10">
                    <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                      <ChartBarSquareIcon className="w-4" />
                      Events Chart
                    </p>
                    <p className="text-[12.5px] mt-0.5 opacity-75">
                      Last 7 days, Category: {category.n}
                    </p>
                  </div>

                  <div className="flex gap-10 p-4 h-52">
                    <AreaChart
                      className="h-44 mt-2 w-full"
                      data={UsersCharts}
                      categories={["Users"]}
                      showYAxis={false}
                      showAnimation
                      index="date"
                      showLegend={false}
                      color="blue"
                      curveType="natural"
                      valueFormatter={(number) =>
                        new Intl.NumberFormat("us").format(number).toString()
                      }
                    />
                  </div>
                </div>

                <div className="col-span-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10">
                    <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                      <ChartBarSquareIcon className="w-4" />
                      Total Events
                    </p>
                    <p className="text-[12.5px] mt-0.5 opacity-75">
                      Lifetime, Category: {category.n}
                    </p>
                  </div>

                  <div className="flexc flex-col justify-center gap-2 p-4 h-52">
                    <div className="flexc gap-1.5 text-[13px] font-uncut font-medium">
                      <div className="w-3 h-3 translate-y-[0.25px] bg-[#3b82f6] rounded-[4px]" />
                      Overall
                    </div>
                    <p className="text-6xl font-semibold font-uncut tracking-tighter">
                      {category.t}
                    </p>
                    <p className="font-uncut text-sm opacity-75">
                      {category.n}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-4 border-b border-white/10">
                    <p className="flexc gap-1.5 text-[14.5px] tracking-sm">
                      <ChartBarSquareIcon className="w-4" />
                      Top Performing Events
                    </p>
                    <p className="text-[12.5px] mt-0.5 opacity-75">
                      Last 7 days, Category: {category.n}
                    </p>{" "}
                  </div>

                  <div className="flexc flex-col p-4 h-52 overflow-hidden">
                    <BarList
                      className="h-full mt-1 w-full"
                      data={SourceData}
                      showAnimation
                    />
                    {topEvents.length == 0 && (
                      <p className="mb-20">No events found.</p>
                    )}
                  </div>
                </div>
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
                    {formatDate(eventsList[openEventDialog].ed.toString())}
                  </p>
                </div>

                <div className="flexc gap-1.5 opacity-75">
                  {IconLibrary[category.ic].i("w-4")}
                  <p className="text-sm">{category.n}</p>
                </div>
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
                          className="px-3 py-1.5 text-[13px] capitalize grayButton group shadow-ins2"
                        >
                          {key}: <p className="opacity-70">{value}</p>
                          <span className="group-hover:opacity-50" />
                        </button>
                      ))}
                </div>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <button className="grayButton py-1.5 px-2 aspect-square group">
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

  const categoriesData = await conn.execute(
    `select * from categories where uid = '${session.user.id}' `
  );

  const categoryEvents = await conn.execute(
    `SELECT * FROM events WHERE ed > DATE_SUB(NOW(), INTERVAL 7 DAY) and ec = ${query.categoryId} and uid = '${session.user.id}'`
  );

  const favCategories = await supabase
    .from("users")
    .select("fav_categories")
    .eq("id", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session.user,
      categoryId: query.categoryId,
      categoriesData: categoriesData.rows ?? null,
      categoryEvents: categoryEvents.rows ?? null,
      favCategories: favCategories.data ?? null,
    },
  };
};
