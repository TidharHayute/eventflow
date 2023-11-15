import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  BanknotesIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import Dialog from "@/components/Dialog";
import { IconLibrary } from "@/utilities/iconsLibrary";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category } from "@/utilities/databaseTypes";
import { toast } from "sonner";
import Router from "next/router";

export default function Categories({
  user,
  categoriesData,
  lastEvents,
  favCategories,
}: {
  user: User;
  categoriesData: Category[];
  lastEvents: { en: string; ec: number; last24: number }[];
  favCategories: any;
}) {
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openCategoryIcon, setOpenCategoryIcon] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: 6 });

  const [searchIcon, setSearchIcon] = useState("");

  const [categoriesList, setCategoriesList] =
    useState<Category[]>(categoriesData);

  async function createCategory() {
    try {
      const conn = await connect(config);

      const query = `INSERT INTO categories(uid, n, ic, t) VALUES (?,?,?,?)`;
      const insertToKeys = await conn.execute(query, [
        user.id,
        newCategory.name,
        newCategory.icon,
        0,
      ]);

      const newCategoryId: any = await (
        await conn.execute(
          `SELECT id FROM categories WHERE uid = '${user.id}' AND n = '${newCategory.name}' LIMIT 1`
        )
      ).rows[0];

      setCategoriesList([
        ...categoriesList,
        {
          uid: user.id,
          id: newCategoryId.id,
          ic: newCategory.icon,
          n: newCategory.name,
          t: 0,
        },
      ]);

      setNewCategory({ name: "", icon: 6 });
      setOpenCreateCategory(false);
    } catch (error) {}
  }

  return (
    <main className="dashboardParent">
      <Head>
        <title>Categories • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favCategories[0].fav_categories}
          categoriesList={categoriesData}
          uI={user}
          current="Categories"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Categories</h3>
              <p className="mdP mt-1">
                Easily manage and track events using custom categories.
              </p>

              <div className="mt-10">
                <table className="w-full">
                  <tbody>
                    <tr className="shadow-ins2 px-3.5 py-2 rounded-m border border-white/10 bg-white/[0.03]">
                      <th>Name</th>
                      <th>Recent Event</th>
                      <th>Last 24 Hours</th>
                      <th>Total Events</th>
                    </tr>

                    {categoriesList.length > 0 ? (
                      categoriesList.map((it, i) => (
                        <tr
                          onClick={() => Router.push(`/category/${it.id}`)}
                          key={i}
                          className="p-3.5 group border-b group border-white/10 transition-all duration-[280ms] hover:bg-white/5 cursor-pointer"
                        >
                          <td className="flexc gap-3.5">
                            <div className="w-10 h-10 rounded-xl border border-white/10 flexc justify-center shadow-[inset_0px_-3px_8px_0.5px_rgba(255,255,255,0.15)]">
                              {IconLibrary[it.ic].i(
                                "w-[18px] stroke-white -translate-y-[0.5px]"
                              )}
                            </div>
                            <div
                              className="cursor-copy"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await navigator.clipboard.writeText(
                                  it.id.toString()
                                );
                                toast.success(`Copied ${it.n}'s Category ID`);
                              }}
                            >
                              {it.n}
                              <p className="transition-all duration-[280ms] opacity-0 text-xs h-0 group-hover:h-4 group-hover:opacity-60 flexc gap-1.5">
                                Category ID — {it.id}
                                <ClipboardDocumentIcon className="w-3.5 -translate-y-[0.5px]" />
                              </p>
                            </div>
                          </td>

                          <td className="flexc gap-2 text-sm">
                            <div className="relative flexc justify-center">
                              <div className="w-1 h-1 rounded-lg bg-emerald-200" />
                              <div className="w-1.5 h-1.5 rounded-lg bg-emerald-200/80 absolute z-[-1] animate-pingslow" />
                            </div>
                            {lastEvents
                              ? lastEvents.find((event) => event.ec === it.id)
                                  ?.en || "No events recorded yet."
                              : "No events recorded yet."}
                          </td>

                          <td className="flexc gap-2 w-fit shadow-[inset_0px_-3px_8px_3px_rgba(110,231,183,0.05)] text-sm rounded-3xl border text-emerald-200 border-emerald-200/10 px-2.5 py-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 stroke-emerald-200"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M12 8v4.816a.5.5 0 0 0 .232.422L15 15m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>

                            {lastEvents
                              ? lastEvents.find((event) => event.ec === it.id)
                                  ?.last24 || "0"
                              : "0"}
                          </td>

                          <td className="flexc justify-between">
                            <div className="flexc gap-2 text-sm">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="w-4 -ml-0.5 group-hover:animate-spinslow stroke-white"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 2v4m0 12v4M6 12H2m20 0h-4m1.078 7.078L16.25 16.25M19.078 5 16.25 7.828M4.922 19.078 7.75 16.25M4.922 5 7.75 7.828"
                                />
                              </svg>

                              {it.t || 0}
                            </div>

                            <div className="group flexc translate-x-0.5">
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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="my-7 flex flex-col">
                        <p className="text-center text-[15px] font-medium">
                          No categories found.
                        </p>
                        <p className="text-center text-[15px] opacity-75">
                          Click on Create Category first.
                        </p>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="flexc justify-end mt-5">
                  <button
                    onClick={() => {
                      setOpenCreateCategory(!openCreateCategory);
                    }}
                    className="grayButton sm group active:scale-95 transition-all duration-200"
                  >
                    <PlusIcon className="w-4 -ml-[3px] -translate-y-[0.2  5px]" />
                    Create Category
                    <span className="group-hover:opacity-60" />
                  </button>
                  <Dialog
                    close={() => {
                      setOpenCreateCategory(false);
                      setTimeout(() => {
                        setNewCategory({ name: "", icon: 6 });
                      }, 400);
                    }}
                    open={openCreateCategory}
                  >
                    <h4>Create Category</h4>

                    <div className="flexc gap-2 mt-5">
                      <button
                        onClick={() => setOpenCategoryIcon(true)}
                        className="h-[42px] min-w-[42px] flexc justify-center border rounded-m bg-white/5 border-white/10 shadow-ins2 transition-all duration-200 hover:bg-white/[0.075] active:scale-95 hover:-translate-y-0.5"
                      >
                        {IconLibrary[newCategory.icon].i(
                          "w-[18px] stroke-white -translate-y-[0.5px]"
                        )}
                      </button>

                      <Dialog
                        open={openCategoryIcon}
                        close={() => {
                          setOpenCategoryIcon(false);
                          setTimeout(() => {
                            setSearchIcon("");
                          }, 400);
                        }}
                      >
                        <div className="flexc justify-between">
                          <h4>Select Icon</h4>

                          <XMarkIcon
                            onClick={() => {
                              setOpenCategoryIcon(false);
                              setTimeout(() => {
                                setSearchIcon("");
                              }, 400);
                            }}
                            className="w-4 opacity-75 hover:opacity-100 translate-x-0 duration-200 cursor-pointer"
                            strokeWidth={1.75}
                          />
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
                            ic.k
                              .toLowerCase()
                              .includes(searchIcon.toLowerCase())
                          ).map((ic, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setNewCategory({
                                  name: newCategory.name,
                                  icon: IconLibrary.findIndex(
                                    (icon) => icon.k == ic.k
                                  ),
                                });
                                setOpenCategoryIcon(false);
                              }}
                              className="aspect-square flexc justify-center border rounded-m border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-0.5 hover:shadow-l duration-200 active:scale-95"
                            >
                              {ic.i("w-[18px] stroke-white")}
                            </button>
                          ))}
                          {IconLibrary.filter((ic) =>
                            ic.k
                              .toLowerCase()
                              .includes(searchIcon.toLowerCase())
                          ).length == 0 && (
                            <p className="col-span-8 row-span-4 mb-3 flexc gap-1.5 -translate-y-[0.75px] justify-center opacity-75">
                              <MagnifyingGlassIcon className="w-4" />
                              No icons found. Try something else.
                            </p>
                          )}
                        </div>
                      </Dialog>
                      <input
                        className="border focus:outline-none focus:border-white/20 placeholder:text-[#757575] border-white/10 rounded-m px-3 py-2.5 text-sm w-full bg-white/5"
                        placeholder="Category Name"
                        maxLength={17}
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            name: e.target.value,
                            icon: newCategory.icon,
                          })
                        }
                      />
                    </div>
                    <div className="flexc gap-3 justify-end mt-4">
                      <button
                        onClick={() => {
                          setOpenCreateCategory(false);
                          setTimeout(() => {
                            setNewCategory({ name: "", icon: 6 });
                          }, 400);
                        }}
                        className={`group grayButton sm shadow-none ${
                          openCategoryIcon ? `z-[-1]` : `z-0`
                        } `}
                      >
                        Cancel
                        <span className="group-hover:opacity-60" />
                      </button>
                      <button
                        onClick={() => {
                          if (newCategory.name.length > 2)
                            if (
                              categoriesList.some(
                                (c) => c.n == newCategory.name
                              )
                            ) {
                              toast.error(
                                "Category with the same name already exist."
                              );
                            } else {
                              toast.promise(createCategory(), {
                                loading: "Creating Category...",
                                success: () => {
                                  return `Category was created`;
                                },
                                error: `Error creating Category.`,
                              });
                            }
                        }}
                        className="px-3.5 py-2 text-[14px] rounded-m border text-black border-white bg-white flexc gap-1.5 transition-all duration-300 hover:opacity-75 active:scale-90"
                      >
                        Create
                      </button>
                    </div>
                  </Dialog>
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
  const categoriesData: any = await conn.execute(
    `select * from categories where uid = '${session.user.id}' `
  );

  let lastEventData;
  if (categoriesData.rows.length > 0) {
    lastEventData =
      await conn.execute(`SELECT e1.ec, e1.en, COUNT(e2.ec) AS last24
    FROM events e1
    LEFT JOIN events e2 ON e1.ec = e2.ec AND e2.ed >= NOW() - INTERVAL 24 HOUR
    WHERE e1.ec IN (${categoriesData.rows.map((obj: any) => obj.id).join(", ")})
      AND (e1.ec, e1.ed) IN (
        SELECT ec, MAX(ed) AS max_ed
        FROM events
        WHERE ec IN (${categoriesData.rows
          .map((obj: any) => obj.id)
          .join(", ")})
        GROUP BY ec
      )
    GROUP BY e1.ec, e1.en
    ORDER BY e1.ec;    
  `);
  }

  const favCategories = await supabase
    .from("users")
    .select("fav_categories")
    .eq("id", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: [],
      categoriesData: categoriesData.rows,
      lastEvents: lastEventData ? lastEventData.rows : null,
      favCategories: favCategories.data ?? null,
    },
  };
};
