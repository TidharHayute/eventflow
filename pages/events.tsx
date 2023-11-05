import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  BanknotesIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { DropdownMenu } from "@radix-ui/themes";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category, Event } from "@/utilities/databaseTypes";
import { IconLibrary } from "@/utilities/iconsLibrary";

function formatDate(date: Date) {
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

  const formattedDateTime = `${dayWithSuffix} ${month}, ${
    time.charAt(0) == "0" ? time.substring(1) : time
  }`;

  return formattedDateTime;
}

export default function LatestEvents({
  user,
  data,
  eventsList,
  categoriesData,
}: {
  user: User;
  data: any;
  eventsList: Event[];
  categoriesData: Category[];
}) {
  const [categoriesFilter, setCategoriesFilter] = useState<any[]>([]);
  const [tagsFilter, setTagsFilter] = useState<any>({});
  const [sortBy, setSortBy] = useState();

  const [searchFilter, setSearchFilter] = useState("");

  const uniqueKeyTags: any = {};

  eventsList.forEach((event) => {
    const et = event.et;
    if (et && typeof et === "object") {
      Object.keys(et).forEach((key) => {
        if (!uniqueKeyTags[key]) {
          uniqueKeyTags[key] = [];
        }
        if (!uniqueKeyTags[key].includes(et[key])) {
          uniqueKeyTags[key].push(et[key]);
        }
      });
    }
  });

  console.log(uniqueKeyTags);

  let eventsListFilter = eventsList
    .map((e) => ({ ...e, ed: new Date(e.ed) }))
    .sort((a, b) => b.ed.getTime() - a.ed.getTime())
    .filter(
      (e) =>
        e.en.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.edes?.toLowerCase().includes(searchFilter.toLowerCase())
    )
    .filter((e) =>
      categoriesFilter.length > 0 ? categoriesFilter.includes(e.ec) : true
    )
    .filter((e) =>
      Object.keys(tagsFilter).length > 0
        ? Object.keys(tagsFilter).every((key) => {
            if (e.et && typeof e.et === "object") {
              const value = tagsFilter[key];
              if (!e.et[key] || e.et[key] !== value) {
                return false;
              }
              return true;
            }
            return false;
          })
        : true
    );

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
                        Categories:{" "}
                        {categoriesFilter.length == 0
                          ? `All`
                          : `${categoriesFilter.length} Selected`}
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
                        {categoriesData.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (categoriesFilter.includes(c.id)) {
                                setCategoriesFilter(
                                  categoriesFilter.filter((id) => id !== c.id)
                                );
                              } else {
                                setCategoriesFilter([
                                  ...categoriesFilter,
                                  c.id,
                                ]);
                              }
                            }}
                            className="flexc w-44 relative truncate gap-2 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm"
                          >
                            {IconLibrary[
                              categoriesData.find((ca) => ca.id == c.id)!.ic
                            ].i("w-4")}

                            {c.n}
                            <CheckCircleIcon
                              className={`transition-all duration-200 w-3.5 absolute right-2 ${
                                categoriesFilter.includes(c.id)
                                  ? `opacity-100`
                                  : `opacity-0`
                              }`}
                            />
                          </button>
                        ))}

                        <DropdownMenu.Separator />
                        <button
                          onClick={() => setCategoriesFilter([])}
                          className="flexc w-full gap-1.5 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm"
                        >
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
                        Tags:{" "}
                        {Object.keys(tagsFilter).length == 0
                          ? `All`
                          : `${Object.keys(tagsFilter).length} Selected`}
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
                        <div className="max-h-[200px] overflow-y-scroll">
                          {Object.entries(uniqueKeyTags).map(
                            ([key, value], i) => (
                              <div
                                key={i}
                                className="w-44 capitalize gap-1 pl-2.5 pr-1 py-[7px]"
                              >
                                <p className="text-sm font-medium"> {key}</p>

                                <div className="grid grid-cols-1 ml-2 mt-1">
                                  {Array.isArray(value) &&
                                    value.map((it: any, i: number) => (
                                      <button
                                        key={i}
                                        onClick={() => {
                                          const tagObject = { [key]: it };

                                          const isTagIncluded =
                                            JSON.stringify(tagsFilter) ===
                                            JSON.stringify({
                                              ...tagsFilter,
                                              ...tagObject,
                                            });

                                          if (isTagIncluded) {
                                            const updatedTagsFilter = {
                                              ...tagsFilter,
                                            };
                                            delete updatedTagsFilter[key];
                                            setTagsFilter(updatedTagsFilter);
                                          } else {
                                            setTagsFilter({
                                              ...tagsFilter,
                                              ...tagObject,
                                            });
                                          }
                                        }}
                                        className="text-start flexc px-2.5 py-1.5 hover:bg-white/5 rounded-lg transition-all text-sm opacity-75 relative"
                                      >
                                        {it}
                                        <CheckCircleIcon
                                          className={`transition-all duration-200 w-3.5 absolute right-2 ${
                                            JSON.stringify(tagsFilter) ===
                                            JSON.stringify({
                                              ...tagsFilter,
                                              ...{ [key]: it },
                                            })
                                              ? `opacity-100`
                                              : `opacity-0`
                                          }`}
                                        />
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <DropdownMenu.Separator />
                        <button
                          onClick={() => setTagsFilter({})}
                          className="flexc w-full gap-1.5 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm"
                        >
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
                              d="M8 8h.01m-4.892-.341-.044.82c-.082 1.573-.124 2.359.026 3.102a6 6 0 0 0 .717 1.869c.386.653.943 1.21 2.056 2.323l2.421 2.421c1.317 1.316 1.975 1.974 2.68 2.334a5 5 0 0 0 4.54 0c.706-.36 1.364-1.018 2.68-2.334s1.974-1.974 2.334-2.68a5 5 0 0 0 0-4.54c-.36-.705-1.018-1.363-2.334-2.68l-2.421-2.421c-1.114-1.113-1.67-1.67-2.323-2.056a6 6 0 0 0-1.869-.717c-.743-.15-1.53-.108-3.101-.026l-.821.044c-1.525.08-2.287.12-2.878.437A3 3 0 0 0 3.555 4.78c-.317.59-.357 1.353-.437 2.878Zm5.371.329a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
                            />
                          </svg>
                          All Key Tags
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
                            d="M4 12h8m-8 6h8M4 6h16m-4 10.186a15.01 15.01 0 0 0 2.556 2.654c.13.105.287.157.444.157m3-2.811a14.998 14.998 0 0 1-2.556 2.654.704.704 0 0 1-.444.157m0 0V11.5"
                          />
                        </svg>
                        Sort By: Newest to Oldest
                        <span className="group-hover:opacity-60" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content
                      style={{
                        marginTop: "5px",
                        background: "#151515",
                        width: "100%",
                      }}
                    >
                      <div className="-m-px">
                        <button className="flexc relative truncate gap-2 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm">
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
                              d="M4 12h8m-8 6h8M4 6h16m-4 10.186a15.01 15.01 0 0 0 2.556 2.654c.13.105.287.157.444.157m3-2.811a14.998 14.998 0 0 1-2.556 2.654.704.704 0 0 1-.444.157m0 0V11.5"
                            />
                          </svg>
                          Newest to Oldest
                        </button>

                        <button className="flexc w-[207.36px] relative truncate gap-2 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm">
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
                              d="M4 12h8m-8 6h8M4 6h16m-4 8.312a14.998 14.998 0 0 1 2.556-2.655A.704.704 0 0 1 19 11.5m3 2.812a14.998 14.998 0 0 0-2.556-2.655A.704.704 0 0 0 19 11.5m0 0v7.497"
                            />
                          </svg>
                          Oldest to Newest
                        </button>
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>

                <div className="px-3.5 py-1.5 text-[14px] rounded-m border border-white/10 focus-within:border-white/20 bg-white/5 flexc gap-2 relative group overflow-hidden shadow-ins2">
                  <MagnifyingGlassIcon className="w-4 -ml-0.5 stroke-white" />
                  <input
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent outline-none placeholder:text-[#8a8a8a] w-56"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {eventsListFilter.map((it, i) => (
                  <div className="flex gap-5 cursor-pointer group" key={i}>
                    <div className="w-[44px] h-[44px] aspect-square rounded-xl border border-white/10 flexc justify-center shadow-[inset_0px_-3px_12px_1px_rgba(255,255,255,0.05)]">
                      {IconLibrary[
                        categoriesData.find((c) => c.id == it.ec)!.ic
                      ].i("w-[18px]")}
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
                            {categoriesData.find((c) => c.id == it.ec)?.n ||
                              "No Category"}
                          </p>
                          <p className="text-[13.5px] opacity-80">•</p>
                          <p className="text-[13.5px] opacity-80">
                            {formatDate(it.ed)}
                          </p>
                        </div>
                      </div>

                      <div className="flexc gap-2">
                        {it.et &&
                          Object.entries(it.et).map(([key, value], i) => (
                            <button
                              key={i}
                              className="px-3 py-1.5 text-[13px] capitalize outline-none rounded-m border border-white/10 bg-white/5 relative group overflow-hidden shadow-ins2"
                            >
                              {key}:<span className="opacity-80"> {value}</span>
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

  const conn = connect(config);

  const eventsList = await conn.execute(
    `SELECT * FROM events WHERE ed > DATE_SUB(NOW(), INTERVAL 7 DAY) and uid = '${session.user.id}'`
  );

  const categoriesData = await conn.execute(
    `select * from categories where uid = '${session.user.id}' `
  );

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: [],
      eventsList: eventsList.rows,
      categoriesData: categoriesData.rows,
    },
  };
};
