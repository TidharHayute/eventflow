import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category } from "@/utilities/databaseTypes";
import {
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  CreditCardIcon,
  LifebuoyIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

function getCurrentMonthRange(): string {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  const formattedFirstDay = firstDayOfMonth.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
  });
  const formattedLastDay = lastDayOfMonth.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
  });

  return `${formattedFirstDay} - ${formattedLastDay}`;
}

interface Invoice {
  name: string;
  date: string;
  amount: number;
}

const InvoiceList: Invoice[] = [
  {
    name: "Premium Subscription",
    date: "November 01, 2023",
    amount: 10.9,
  },
  {
    name: "Premium Subscription",
    date: "October 01, 2023",
    amount: 10.9,
  },
  {
    name: "Premium Subscription",
    date: "September 01, 2023",
    amount: 10.9,
  },
  {
    name: "Premium Subscription",
    date: "August 01, 2023",
    amount: 10.9,
  },
];

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

              <div className="grid grid-cols-2 gap-6">
                <div className="border border-white/10 bg-white/[0.03] shadow-ins2 rounded-[20px] p-5">
                  <div className="flexc justify-between">
                    <p className="font-medium">Monthly Usage</p>
                    <p className="opacity-75 text-sm flexc gap-2">
                      <CalendarDaysIcon
                        className="w-4 -translate-y-[0.75px]"
                        strokeWidth={1.25}
                      />
                      {getCurrentMonthRange()}
                    </p>
                  </div>

                  <div className="mt-14">
                    <p className="text-sm opacity-75">Events Tracked</p>
                    <p className="text-sm mt-1">
                      {monthlyUsage.toLocaleString()} /{" "}
                      {billingData.limit.toLocaleString()}{" "}
                      <span className="opacity-75 text-xs">
                        ({(billingData.limit - monthlyUsage).toLocaleString()}{" "}
                        left)
                      </span>
                    </p>

                    <div className="relative w-72 bg-white/5 rounded-3xl h-3 mt-3 overflow-hidden">
                      <div
                        style={{
                          width: (monthlyUsage / billingData.limit) * 100 + "%",
                        }}
                        className="absolute inset-y-0 left-0 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 bg-white/[0.03] shadow-ins2 rounded-[20px] p-5">
                  <div className="flexc justify-between">
                    <p className="font-medium">Current Plan</p>
                    <button className="opacity-75 text-sm flexc gap-1.5 hover:bg-white/10 px-3 py-2 -m-2 transition-all rounded-lg">
                      <ArrowsRightLeftIcon
                        className="w-4 -ml-px"
                        strokeWidth={1.25}
                      />
                      Change Plan
                    </button>
                  </div>

                  <div className="mt-[72px]">
                    <p className="text-sm opacity-75">{billingData.plan}</p>
                    <div className="flexc justify-between mt-1">
                      <p className="text-lg font-medium">
                        $10.9{" "}
                        <span className="text-sm font-normal">/ month</span>
                      </p>
                      <p className="text-sm opacity-75">
                        Next Payment:{" "}
                        {new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4>Billing History</h4>
              </div>

              <div className="mt-5">
                <table className="w-full">
                  <tbody>
                    <tr className="shadow-ins2 px-3.5 py-2 rounded-m border border-white/10 bg-white/[0.03] grid-cols-[2.5fr_1.5fr_1fr_0.75fr]">
                      <th>Invoice</th>
                      <th>Billing Date</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>

                    {InvoiceList.map((it, i) => (
                      <InvoiceItem invoice={it} key={i} />
                    ))}
                  </tbody>
                </table>
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

function InvoiceItem({ invoice }: { invoice: Invoice }) {
  return (
    <tr className="p-3.5 border-b border-white/10 grid-cols-[2.5fr_1.5fr_1fr_0.75fr]">
      <td className="flexc gap-3.5">
        <div className="w-10 h-10 rounded-3xl border border-white/10 flexc justify-center shadow-[inset_0px_-3px_10px_1px_rgba(255,255,255,0.15)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[17px] stroke-white -translate-y-[0.25px]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.35"
              d="M7 8h6m-6 4h6m-6 4h3m7-5v8a2 2 0 0 0 2 2m-2-10V4.971c0-.442 0-.663-.04-.821a1.3 1.3 0 0 0-1.46-.963c-.162.025-.365.112-.771.286a6.363 6.363 0 0 1-.491.199 3 3 0 0 1-1.511.095 5.634 5.634 0 0 1-.512-.134l-.896-.256c-.49-.14-.736-.21-.986-.238a3 3 0 0 0-.666 0c-.25.028-.495.098-.986.238l-.896.256c-.256.073-.384.11-.512.135a3 3 0 0 1-1.51-.096 5.718 5.718 0 0 1-.492-.199c-.406-.174-.61-.26-.77-.286a1.3 1.3 0 0 0-1.46.963C3 4.308 3 4.529 3 4.97V15.4c0 1.96 0 2.94.381 3.688a3.5 3.5 0 0 0 1.53 1.53C5.66 21 6.64 21 8.6 21H19m-2-10h2.4c.56 0 .84 0 1.054.11a1 1 0 0 1 .437.436C21 11.76 21 12.04 21 12.6V19a2 2 0 0 1-2 2"
            />
          </svg>
        </div>

        {invoice.name}
        <p className="flexc gap-1 w-fit shadow-[inset_0px_-3px_8px_3px_rgba(110,231,183,0.05)] text-sm rounded-3xl border text-emerald-200 border-emerald-200/10 px-3 py-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 stroke-emerald-200 -ml-0.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m2.447 12.327 4.682 4.678.374-.654a26.68 26.68 0 0 1 8.119-8.793l.825-.563m5.106.614-.87.49a26.693 26.693 0 0 0-8.837 8.07l-.428.62-.298-.352"
            />
          </svg>
          Paid
        </p>
      </td>

      <td className="text-sm opacity-80">{invoice.date}</td>
      <td className="text-sm">USD ${invoice.amount}</td>
      <td className="flex justify-end">
        <ArrowDownTrayIcon className="w-7 translate-x-2 p-1.5 border border-white/0 hover:border-white/10 hover:bg-white/5 rounded-lg transition-all cursor-pointer" />
      </td>
    </tr>
  );
}
