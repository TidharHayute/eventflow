import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category } from "@/utilities/databaseTypes";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Overview({
  user,
  categoriesData,
  favCategories,
}: {
  user: User;
  categoriesData: Category[];
  favCategories: any;
}) {
  const [pagination, setPagination] = useState(0);

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

              <div className="grid grid-cols-4 gap-5">
                <div className="bg-white/5 group cursor-pointer h-32 border border-white/10 rounded-[18px] p-5 flex flex-col justify-between">
                  <div className="flexc justify-between">
                    <p className="flexc gap-1.5 opacity-70 text-[13.5px] font-medium tracking-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="w-4 -ml-0.5 -translate-y-[0.5px] stroke-white"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 2v4m0 12v4M6 12H2m20 0h-4m1.078 7.078L16.25 16.25M19.078 5 16.25 7.828M4.922 19.078 7.75 16.25M4.922 5 7.75 7.828"
                        />
                      </svg>
                      Events
                    </p>

                    <ChevronRightIcon
                      className="w-3.5 stroke-white -mr-1 scale-95 opacity-60 group-hover:opacity-100 transition-all duration-200"
                      strokeWidth={1.75}
                    />
                  </div>

                  <div className="flex justify-between items-end">
                    <p className="font-uncut font-semibold text-3xl leading-none tracking-tight">
                      2,391
                    </p>
                    <p className="opacity-75 font-normal text-[13px]">7 Days</p>
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

  const conn = await connect(config);
  const categoriesData = await conn.execute(
    `select * from categories where uid = '${session.user.id}' `
  );

  const eventsList = await conn.execute(
    `SELECT * FROM events WHERE uid = '${session.user.id}' LIMIT 24`
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
    },
  };
};
