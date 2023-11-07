import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useRef } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category } from "@/utilities/databaseTypes";

export default function Overview({
  user,
  categoriesData,
  favCategories,
}: {
  user: User;
  categoriesData: Category[];
  favCategories: any;
}) {
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
              <p className="mdP mt-1">
                Summarized overview of your project's events and analytics.
              </p>
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
