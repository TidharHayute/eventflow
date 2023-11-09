import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category } from "@/utilities/databaseTypes";
import {
  ChartBarSquareIcon,
  ChevronRightIcon,
  CreditCardIcon,
  LifebuoyIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

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
        <title>Account • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favCategories[0].fav_categories}
          categoriesList={categoriesData}
          uI={user}
          current="Account"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Settings</h3>
              <p className="mdP mt-1">Manage your Eventflow account.</p>
              <div className="mt-10 mb-6 flexc gap-3 pb-4 border-b border-white/10">
                <button className="grayButton xs group">
                  <UserCircleIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Account
                  <span className="group-hover:opacity-60" />
                </button>
                <button className="grayButton xs group">
                  <CreditCardIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Billing
                  <span className="group-hover:opacity-60" />
                </button>
                <button className="grayButton xs group">
                  <UsersIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Team
                  <span className="group-hover:opacity-60" />
                </button>
                <button className="grayButton xs group">
                  <LifebuoyIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Support
                  <span className="group-hover:opacity-60" />
                </button>
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
