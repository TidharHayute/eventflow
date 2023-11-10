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
  CreditCardIcon,
  LifebuoyIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Billing({
  user,
  categoriesData,
  userData,
}: {
  user: User;
  categoriesData: Category[];
  userData: any;
}) {
  let favCategories = userData[0].fav_categories;
  let billingData = userData[0].plan;
  let monthlyUsage = userData[0].monthly_usage;

  return (
    <main className="dashboardParent">
      <Head>
        <title>Billing • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favCategories}
          categoriesList={categoriesData}
          uI={user}
          current="Billing"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Billing</h3>
              <p className="mdP mt-1">Manage your Eventflow account billing.</p>

              <div className="mt-10 mb-6 flexc gap-3 pb-4 border-b border-white/10">
                <Link
                  passHref
                  href={"/settings/account"}
                  className="grayButton xs group"
                >
                  <UserCircleIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Account
                  <span className="group-hover:opacity-60" />
                </Link>
                <Link
                  passHref
                  href={"/settings/billing"}
                  className="grayButton xs group"
                >
                  <CreditCardIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Billing
                  <div className="absolute inset-0 bg-gradient-to-t opacity-60 transition-all duration-300 from-white/10 via-white/5 to-white/[0.02];" />
                </Link>
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

              <div className="grid grid-cols-2 gap-10 divide-x divide-white/10"></div>
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

  const userData = await supabase
    .from("users")
    .select("fav_categories, plan, monthly_usage")
    .eq("id", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session.user,
      categoriesData: categoriesData.rows ?? null,
      userData: userData.data ?? null,
    },
  };
};
