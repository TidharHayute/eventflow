import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DropdownMenu } from "@radix-ui/themes";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category, Event } from "@/utilities/databaseTypes";
import { IconLibrary } from "@/utilities/iconsLibrary";
import { toast } from "sonner";
import Link from "next/link";
import { formatDate } from "./events";

export default function LatestEvents({
  user,
  eventsList,
  categoriesData,
  favCategories,
}: {
  user: User;
  eventsList: Event[];
  categoriesData: Category[];
  favCategories: any;
}) {
  const [categoriesFilter, setCategoriesFilter] = useState<any[]>([]);
  const [tagsFilter, setTagsFilter] = useState<any>({});
  const [sortBy, setSortBy] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");

  const [pagination, setPagination] = useState(0);

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

  const [eventsListFilter, setEventsListFilter] = useState<Event[]>([]);

  useEffect(() => {
    const sortedAndFilteredEvents = eventsList
      .map((e) => ({ ...e, ed: new Date(e.ed) }))
      .sort((a, b) =>
        sortBy
          ? a.ed.getTime() - b.ed.getTime()
          : b.ed.getTime() - a.ed.getTime()
      )
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

    setEventsListFilter(sortedAndFilteredEvents);
  }, [eventsList, sortBy, searchFilter, categoriesFilter, tagsFilter]);

  const [openEventDialog, setOpenEventDialog] = useState(-1);

  return (
    <main className="dashboardParent">
      <Head>
        <title>Latest Events • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favCategories[0].fav_categories}
          categoriesList={categoriesData}
          uI={user}
          current="Latest Events"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
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
                        <div className="max-h-[250px] overflow-y-scroll">
                          {categoriesData.length > 0 ? (
                            categoriesData.map((c, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  if (categoriesFilter.includes(c.id)) {
                                    setCategoriesFilter(
                                      categoriesFilter.filter(
                                        (id) => id !== c.id
                                      )
                                    );
                                  } else {
                                    setCategoriesFilter([
                                      ...categoriesFilter,
                                      c.id,
                                    ]);
                                  }
                                }}
                                className="flexc w-52 relative truncate gap-2 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm"
                              >
                                {IconLibrary[
                                  categoriesData.find((ca) => ca.id == c.id)!.ic
                                ].i("min-w-[16px] max-w-[16px]")}

                                {c.n}
                                <CheckCircleIcon
                                  className={`transition-all duration-200 w-3.5 absolute right-2 ${
                                    categoriesFilter.includes(c.id)
                                      ? `opacity-100`
                                      : `opacity-0`
                                  }`}
                                />
                              </button>
                            ))
                          ) : (
                            <div className="my-7 w-52 flexc justify-center gap-2 text-sm">
                              <MagnifyingGlassIcon className="w-4 -ml-0.5" />
                              No categories found.
                            </div>
                          )}
                        </div>

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
                        <div className="max-h-[250px] overflow-y-scroll">
                          {Object.entries(uniqueKeyTags).length > 0 ? (
                            Object.entries(uniqueKeyTags).map(
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
                            )
                          ) : (
                            <div className="my-7 w-52 flexc justify-center gap-2 text-sm">
                              <MagnifyingGlassIcon className="w-4 -ml-0.5" />
                              No Key Tags found.
                            </div>
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
                        Sort By:{" "}
                        {sortBy ? `Oldest to Newest` : `Newest to Oldest`}
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
                        <button
                          onClick={() => setSortBy(false)}
                          className="flexc w-[207.36px] relative truncate gap-2 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm"
                        >
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
                          <CheckCircleIcon
                            className={`transition-all duration-200 w-3.5 absolute right-2 ${
                              sortBy ? `opacity-0` : `opacity-100`
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => setSortBy(true)}
                          className="flexc w-[207.36px] relative truncate gap-2 px-2.5 py-[7px] rounded-lg hover:bg-white/5 text-sm"
                        >
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
                          <CheckCircleIcon
                            className={`transition-all duration-200 w-3.5 absolute right-2 ${
                              sortBy ? `opacity-100` : `opacity-0`
                            }`}
                          />
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
                {eventsListFilter.length > 0 ? (
                  eventsListFilter
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
                              Object.entries(it.et)
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
                      <button className="grayButton group xs">
                        API Reference
                        <span className="group-hover:opacity-60" />
                      </button>
                      <button
                        onClick={() => {
                          setSearchFilter("");
                          setCategoriesFilter([]);
                          setTagsFilter({});
                        }}
                        className="grayButton group xs"
                      >
                        Reset Filters
                        <span className="group-hover:opacity-60" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-1.5 justify-end items-center mt-3">
                  {Array.from(
                    { length: Math.ceil(eventsListFilter.length / 24) },
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
                    {eventsListFilter[openEventDialog].en}
                  </p>
                  <p className="opacity-80 text-sm mt-0.5 tracking-sm">
                    {formatDate(eventsListFilter[openEventDialog].ed)}
                  </p>
                </div>

                <Link
                  passHref
                  href={`/category/${eventsListFilter[openEventDialog].ec}`}
                  className="flexc gap-1.5 opacity-75 transition-all hover:opacity-100"
                >
                  {categoriesData.find(
                    (c) => c.id == eventsListFilter[openEventDialog].ec
                  )
                    ? IconLibrary[
                        categoriesData.find(
                          (c) => c.id == eventsListFilter[openEventDialog].ec
                        )!.ic
                      ].i("w-[18px]")
                    : IconLibrary[6].i("w-[18px] scale-y-90")}
                  <p className="text-sm">
                    {categoriesData.find(
                      (c) => c.id == eventsListFilter[openEventDialog].ec
                    )?.n || "No Category"}
                  </p>
                </Link>
              </div>

              <p className="text-sm">
                {eventsListFilter[openEventDialog].edes ||
                  "No short description provided."}
              </p>

              <div className="flexc justify-between mt-10">
                <div className="flexc gap-2 ">
                  {eventsListFilter[openEventDialog].et &&
                    Object.entries(eventsListFilter[openEventDialog].et!)
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
                                  `delete from events where eid = ${eventsListFilter[openEventDialog].eid}`
                                );

                                setOpenEventDialog(-1);

                                // setEventsListFilter((prevList) =>
                                //   prevList.filter(
                                //     (event) =>
                                //       event.eid !=
                                //       eventsListFilter[openEventDialog].eid
                                //   )
                                // );
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
