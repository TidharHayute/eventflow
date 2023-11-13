import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { connect } from "@planetscale/database";
import supabase, { config } from "@/utilities/supabaseClient";
import { Category } from "@/utilities/databaseTypes";
import {
  ArrowUpRightIcon,
  CreditCardIcon,
  LifebuoyIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { toast } from "sonner";
import Router from "next/router";

export default function Account({
  user,
  categoriesData,
  userData,
}: {
  user: User;
  categoriesData: Category[];
  userData: any;
}) {
  let favCategories = userData[0].fav_categories;
  let accountData = userData[0].account;

  const [firstName, setFirstName] = useState(accountData.fn ?? "");
  const [lastName, setLastName] = useState(accountData.ln ?? "");

  return (
    <main className="dashboardParent">
      <Head>
        <title>Account • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favCategories}
          categoriesList={categoriesData}
          uI={user}
          current="Account"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Account</h3>
              <p className="mdP mt-1">Manage your Eventflow account.</p>

              <div className="mt-10 mb-6 flexc gap-3 pb-4 border-b border-white/10">
                <Link
                  passHref
                  href={"/settings/account"}
                  className="grayButton xs group"
                >
                  <UserCircleIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Account
                  <div className="absolute inset-0 bg-gradient-to-t opacity-60 transition-all duration-300 from-white/10 via-white/5 to-white/[0.02];" />
                </Link>
                <Link
                  passHref
                  href={"/settings/billing"}
                  className="grayButton xs group"
                >
                  <CreditCardIcon strokeWidth={1.4} className="w-4 -ml-[3px]" />
                  Billing
                  <span className="group-hover:opacity-60" />
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

              <div className="grid grid-cols-2 gap-10 divide-x divide-white/10">
                <div className="flex flex-col">
                  <p className="font-medium mb-3">Account</p>

                  <label className="opacity-75 text-sm" htmlFor="email">
                    Email address
                  </label>

                  <input
                    id="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={() => {}}
                    disabled
                    type="email"
                    className="border focus:outline-none placeholder:text-[#757575] border-white/10 rounded-m px-3 py-2.5 text-sm w-full bg-white/5 mt-2 mb-4"
                  />

                  <label className="opacity-75 text-sm" htmlFor="password">
                    Password
                  </label>

                  <input
                    id="password"
                    placeholder="Password"
                    value="·········"
                    onChange={() => {}}
                    type="password"
                    disabled
                    className="border focus:outline-none placeholder:text-[#757575] border-white/10 rounded-m px-3 py-2.5 text-sm w-full bg-white/5 mt-2"
                  />

                  <p className="font-medium mb-3 mt-10">Profile</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="opacity-75 text-sm" htmlFor="firstName">
                        First Name
                      </label>

                      <input
                        id="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        className="border focus:outline-none placeholder:text-[#757575] border-white/10 rounded-m px-3 py-2.5 text-sm w-full bg-white/5 mt-2 mb-4"
                      />
                    </div>
                    <div>
                      <label className="opacity-75 text-sm" htmlFor="lastName">
                        Last Name
                      </label>

                      <input
                        id="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        className="border focus:outline-none placeholder:text-[#757575] border-white/10 rounded-m px-3 py-2.5 text-sm w-full bg-white/5 mt-2 mb-4"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => {
                        const profileObject = { fn: firstName, ln: lastName };

                        async function updateProfile() {
                          const { data, error } = await supabase
                            .from("users")
                            .update({ account: profileObject })
                            .eq("id", user.id);

                          if (error) {
                            console.log(error);
                            throw error;
                          }
                        }

                        toast.promise(updateProfile, {
                          loading: "Loading...",
                          success: "Account Saved",
                          error: "Failed to update account.",
                        });
                      }}
                      className="px-5 py-2 text-[14px] active:scale-95 rounded-m border text-black border-white bg-white flexc gap-1.5 transition-all duration-300 hover:opacity-75"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="pl-10 flex flex-col justify-end">
                  <div className="flexc justify-between">
                    <div>
                      <p className="font-[450]">Delete Your Account</p>
                      <p className="opacity-75 mt-0.5 text-sm">
                        This action cannot be undone.
                      </p>
                    </div>

                    <button className="px-5 py-[7px] text-[14px] rounded-m border text-white bg-red-500 border-red-400 transition-all duration-200 hover:opacity-75 active:scale-95">
                      Delete Account
                    </button>
                  </div>

                  <div className="flexc justify-end mt-5">
                    <button
                      onClick={async () => {
                        const { error } = await supabase.auth.signOut();
                        if (!error) {
                          Router.push("/");
                        }
                      }}
                      className="px-5 py-[7px] text-[14px] shadow-ins2 rounded-m border text-white bg-white/[0.025] border-white/10 flexc gap-2 transition-all duration-200 overflow-hidden active:scale-95 relative group"
                    >
                      Log Out
                      <ArrowUpRightIcon
                        className="w-[13px] -mr-[3px]"
                        strokeWidth={1.8}
                      />{" "}
                      <span className="absolute inset-0 bg-gradient-to-t opacity-0 transition-all duration-300 from-white/10 via-white/5 to-white/[0.02] group-hover:opacity-60" />
                    </button>
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

  const userData = await supabase
    .from("users")
    .select("fav_categories, account")
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
