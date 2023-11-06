import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useRef } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function Overview({ user, data }: { user: User; data: any }) {
  return (
    <main className="dashboardParent">
      <Head>
        <title>Overview • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar uI={user} current="Overview" />

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

  const { data } = await supabase.from("users").select("*");

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data ?? [],
    },
  };
};
