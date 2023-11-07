import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Kbd } from "@radix-ui/themes";
import { AnimateArrow } from "@/components/Animation";
import { HashtagIcon, SignalIcon } from "@heroicons/react/24/outline";
import DashboardHeader from "@/components/DashboardHeader";
import { connect } from "@planetscale/database";
import { config } from "@/utilities/supabaseClient";
import { Category } from "@/utilities/databaseTypes";

export default function Setup({
  user,
  categoriesData,
  favCategories,
}: {
  user: User;
  categoriesData: Category[];
  favCategories: any;
}) {
  const [current, setCurrent] = useState(0);

  const [codeLang, setCodeLang] = useState(0);

  return (
    <main className="dashboardParent">
      <Head>
        <title>Setup • Eventflow</title>
      </Head>

      <div className="dashboardGrid">
        <Sidebar
          favCategories={favCategories[0].fav_categories}
          categoriesList={categoriesData}
          uI={user}
          current="Setup & Onboarding"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Setup and Onboarding</h3>
              <p className="mdP mt-1.5">
                Set up your Eventflow project and start tracking events within a
                few steps.
              </p>

              <div className="flex mt-4 gap-12">
                <div className="flex flex-col w-fit items-center gap-[7px]">
                  <div
                    className={`w-px h-28 bg-gradient-to-b transition-all duration-300 from-transparent ${
                      current > 0 ? `to-emerald-500/20` : `to-white/[0.15]`
                    }`}
                  />
                  <div
                    className={`w-3 h-3 border-2 transition-all duration-300 rounded-3xl ${
                      current > 0 && `border-emerald-600`
                    }`}
                  />
                  <div
                    className={`w-px h-96 ${
                      current > 1 ? `bg-emerald-600/20` : `bg-white/[0.15]`
                    }`}
                  />
                  <div
                    className={`w-3 h-3 border-2 transition-all duration-300 rounded-3xl ${
                      current > 1 && `border-emerald-600`
                    }`}
                  />
                  <div
                    className={`w-px h-96 ${
                      current > 2 ? `bg-emerald-600/20` : `bg-white/[0.15]`
                    }`}
                  />
                  <div
                    className={`w-3 h-3 border-2 transition-all duration-300 rounded-3xl ${
                      current > 2 && `border-emerald-600`
                    }`}
                  />

                  <div
                    className={`w-px h-[700px] bg-gradient-to-t transition-all duration-300 from-transparent ${
                      current > 2 ? `to-emerald-500/20` : `to-white/[0.15]`
                    }`}
                  />
                </div>

                <div>
                  <div className="h-[522px]">
                    <div className="h-28" />
                    <h4>Generate an API Token</h4>
                    <p className="mdP mt-1.5 leading-relaxed">
                      Generate an API Key Token for authentication when sending
                      requests to track events and send data submissions.
                      <br />
                      This data is sensitive and should only be visible to you
                      and your team.
                    </p>

                    <div className="flexc gap-3 mt-5">
                      <Link
                        onClick={() => {
                          setTimeout(() => {
                            setCurrent(
                              current == 0 || current == 1 ? 1 : current
                            );
                          }, 1000);
                        }}
                        target="_blank"
                        className={`text-sm font-medium tracking-sm px-[17px] relative group py-[9.2px] transition-all border border-white/[0.15] rounded-lg overflow-hidden duration-200 hover:text-white`}
                        href={"/keys"}
                        passHref
                      >
                        Create API Key
                        <span className="absolute inset-0 bg-gradient-to-t group-hover:opacity-100 opacity-0 transition-all duration-300 from-white/10 via-white/5 to-white/[0.03]" />
                      </Link>
                      <button
                        onClick={() => {
                          setCurrent(
                            current == 0 || current == 1 ? 1 : current
                          );

                          const element = document.getElementById("scroll_two");
                          setTimeout(() => {
                            element!.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }, 2750);
                        }}
                        className={`${
                          current > 0
                            ? `bg-emerald-600 text-white border-emerald-600 shadow-l shadow-emerald-400/30`
                            : `text-black border-white bg-white hover:opacity-[0.85]`
                        } text-sm font-medium tracking-sm px-[17px] active:scale-95 relative group py-[9.2px] transition-all border rounded-lg overflow-hidden duration-200 flexc gap-1.5`}
                      >
                        <CheckCircleIcon className="w-[17px] -ml-0.5" />
                        Complete{current > 0 && `d`} Mission
                      </button>
                    </div>

                    <div
                      className={`mt-10 transition-all duration-500 ${
                        current > 0
                          ? `opacity-100 visible translate-y-0`
                          : `opacity-0 invisible -translate-y-5`
                      }`}
                    >
                      <p className={`mdP leading-[1.75] text-emerald-100 `}>
                        Great! You can now use this Key Token to send requests
                        and easily track events on your platform.
                        {/* <br /> Now, let&apos;s learn how to use this API Key to
                      submit data. */}
                      </p>

                      <p className="w-fit border p-[11px] pr-4 flexc gap-4 font-mono rounded-m border-white/10 shadow-ins mt-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 stroke-white -translate-y-[0.5px]"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 17v-2m0 0c.513 0 .929-.448.929-1s-.416-1-.929-1c-.513 0-.929.448-.929 1s.416 1 .929 1Zm5.573-5.761V9c0-3.314-2.495-6-5.573-6-3.078 0-5.573 2.686-5.573 6v.239m11.146 0C16.887 9 15.965 9 14.303 9H9.697c-1.662 0-2.584 0-3.27.239m11.146 0c.084.029.164.061.242.098.951.45 1.684 1.307 2.021 2.366.253.793.176 1.794.02 3.795-.133 1.723-.2 2.584-.507 3.26-.41.901-1.119 1.604-1.987 1.969-.65.273-1.454.273-3.06.273H9.698c-1.605 0-2.408 0-3.06-.273-.867-.365-1.577-1.068-1.986-1.969-.308-.676-.374-1.537-.508-3.26-.154-2.001-.232-3.002.02-3.795.338-1.059 1.071-1.916 2.022-2.366.078-.037.158-.07.242-.098"
                          />
                        </svg>
                        <span className="maskLinear">
                          qShxHgDmAWrBogDlbYDPfoaetAvrZVDrIbLBAlTzcYcJMmcpAlTzcYcJMmcpMJ
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-[409px] transition-all duration-300 ${
                      current < 1 && `opacity-30 pointer-events-none`
                    }`}
                  >
                    <h4>Create Categories to Track</h4>
                    <p className="mdP mt-1.5 leading-relaxed">
                      Create custom categories to easily track relevant events
                      that are running on your platform.
                      <br /> For example, you can create a custom category for
                      'Registration' to easily track new users, or 'Errors' to
                      identify where and when errors occurred in your code.
                    </p>

                    <div className="flexc gap-3 mt-5">
                      <Link
                        target="_blank"
                        className={`text-sm font-medium tracking-sm px-[17px] relative group py-[9.2px] transition-all border border-white/[0.15] rounded-lg overflow-hidden duration-200 hover:text-white`}
                        href={"/categories"}
                        passHref
                      >
                        Create Category
                        <span className="absolute inset-0 bg-gradient-to-t group-hover:opacity-100 opacity-0 transition-all duration-300 from-white/10 via-white/5 to-white/[0.03]" />
                      </Link>
                      <button
                        onClick={() => {
                          setCurrent(current >= 2 ? current : 2);
                          const element =
                            document.getElementById("scroll_three");
                          setTimeout(() => {
                            element!.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }, 2750);
                        }}
                        className={`${
                          current > 1
                            ? `bg-emerald-600 text-white border-emerald-600 shadow-l shadow-emerald-400/30`
                            : `text-black border-white bg-white hover:opacity-[0.85]`
                        } text-sm font-medium tracking-sm px-[17px] active:scale-95 relative group py-[9.2px] transition-all border rounded-lg overflow-hidden duration-200 flexc gap-1.5`}
                      >
                        <CheckCircleIcon className="w-[17px] -ml-0.5" />
                        Complete{current > 1 && `d`} Mission
                      </button>
                    </div>

                    <div
                      id="scroll_two"
                      className={`mt-10 transition-all duration-500 ${
                        current > 1
                          ? `opacity-100 visible translate-y-0`
                          : `opacity-0 invisible -translate-y-5`
                      }`}
                    >
                      <p className={`mdP leading-[1.75] text-emerald-100 `}>
                        Using categories will allow you to easily manage and
                        track events and insights running in real-time on your
                        platform.
                      </p>

                      <div className="flexc gap-3 mt-3">
                        <p className="px-3 w-fit shadow-ins shadow-emerald-300/10 text-emerald-300 text-sm py-1.5 border border-emerald-300/10 rounded-lg gap-1.5 flexc">
                          <HashtagIcon className="w-3.5 -ml-[3px]" />
                          Payments
                        </p>

                        <p className="px-3 w-fit shadow-ins shadow-red-300/10 text-red-300 text-sm py-1.5 border border-red-300/10 rounded-lg gap-1.5 flexc">
                          <HashtagIcon className="w-3.5 -ml-[3px]" />
                          Errors
                        </p>

                        <p className="px-3 w-fit shadow-ins shadow-blue-300/10 text-blue-300 text-sm py-1.5 border border-blue-300/10 rounded-lg gap-1.5 flexc">
                          <HashtagIcon className="w-3.5 -ml-[3px]" />
                          Sign-Ups
                        </p>

                        <p className="px-3 w-fit shadow-ins shadow-orange-300/10 text-orange-300 text-sm py-1.5 border border-orange-300/10 rounded-lg gap-1.5 flexc">
                          <HashtagIcon className="w-3.5 -ml-[3px]" />
                          Support
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`h-[400px] transition-all duration-300 ${
                      current < 2 && `opacity-30 pointer-events-none`
                    }`}
                  >
                    <h4>Send Request to Track an Event</h4>
                    <p className="mdP mt-1.5 leading-relaxed">
                      Generate an API Key Token for authentication when sending
                      requests to easily track events and send data submissions.
                      <br />
                      This data is sensitive, and should only be visible to you
                      and your team.
                    </p>

                    <div className="border mt-5 rounded-xl border-white/10 w-[610px] overflow-hidden shadow-lgb shadow-blue-950/20">
                      <div
                        id="scroll_three"
                        className="w-full p-3 flexc gap-2.5 border-b border-white/10 bg-[#1f6aff06] shadow-ins2"
                      >
                        <button
                          onClick={() => setCodeLang(0)}
                          className={`text-[13px] px-3.5 py-1.5 rounded-md transition-all hover:bg-white/5 border border-white/0 ${
                            codeLang == 0 && `shadow-ins border-white/10`
                          }`}
                        >
                          Node.js
                        </button>
                        <button
                          onClick={() => setCodeLang(1)}
                          className={`text-[13px] px-3.5 py-1.5 rounded-md transition-all hover:bg-white/5 border border-white/0 ${
                            codeLang == 1 && `shadow-ins border-white/10`
                          }`}
                        >
                          Python
                        </button>
                        <button
                          onClick={() => setCodeLang(2)}
                          className={`text-[13px] px-3.5 py-1.5 rounded-md transition-all hover:bg-white/5 border border-white/0 ${
                            codeLang == 2 && `shadow-ins border-white/10`
                          }`}
                        >
                          cURL
                        </button>
                      </div>

                      {codeValue[codeLang]}
                    </div>

                    <div className="flexc gap-3 mt-7">
                      <button
                        onClick={() => setCurrent(3)}
                        className={`${
                          current > 2
                            ? `bg-emerald-600 text-white border-emerald-600 shadow-l shadow-emerald-400/30`
                            : `text-black border-white bg-white hover:opacity-[0.85]`
                        } text-sm font-medium tracking-sm px-[17px] active:scale-95 relative group py-[9.2px] transition-all border rounded-lg overflow-hidden duration-200 flexc gap-1.5`}
                      >
                        <CheckCircleIcon className="w-[17px] -ml-0.5" />
                        Complete{current > 2 && `d`} Mission
                      </button>

                      <Link
                        target="_blank"
                        className={`${
                          current > 2
                            ? `translate-y-0 opacity-100 visible`
                            : `translate-y-6 opacity-0 invisible`
                        } text-sm font-medium flexc gap-2 tracking-sm px-[17px] relative group py-[9.2px] transition-all border border-white/[0.15] rounded-lg overflow-hidden duration-300 hover:text-white`}
                        href={"/overview"}
                        passHref
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          className="w-[17px] -ml-1 animate-spinslow stroke-white"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 2v4m0 12v4M6 12H2m20 0h-4m1.078 7.078L16.25 16.25M19.078 5 16.25 7.828M4.922 19.078 7.75 16.25M4.922 5 7.75 7.828"
                          />
                        </svg>
                        Start Tracking{" "}
                        <span className="absolute inset-0 bg-gradient-to-t group-hover:opacity-100 opacity-0 transition-all duration-300 from-white/10 via-white/5 to-white/[0.03]" />
                      </Link>
                    </div>
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

  const conn = connect(config);

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

const codeValue = [
  <div className="p-5 h-[430px] overflow-y-scroll codeContainer">
    <code>
      <span className="text-blue-300">const</span> option = {"{"}
      <br />
    </code>
    <div className="ml-4">
      <code className="whitespace-pre-line">
        {`method: "POST",\nheaders: {`}
      </code>
    </div>
    <div className="ml-8">
      <code className="whitespace-pre-line">
        {`"Content-Type": "application/json",\n"Authorization": "Bearer `}
        <span className="text-emerald-300">KEY TOKEN</span>
        {`"\n`}
      </code>
    </div>
    <div className="ml-4">
      <code className="whitespace-pre-line">{`}\nbody: '{`}</code>
    </div>
    <div className="ml-8">
      <code className="whitespace-pre-line">
        <span className="text-orange-300">&quot;title&quot;</span>
        : &quot;New Account&quot;,
        <br />
        <span className="text-orange-300">&quot;category_id&quot;</span>
        : 49482,
        <br />
        <span className="text-orange-300">&quot;description&quot;</span>:
        &quot;A new user has successfully registered with the email address:
        name@email.com.&quot;
      </code>
    </div>
    <div className="ml-4">
      <code>{`}'`}</code>
    </div>

    <code>{`}`}</code>
    <br />
    <br />
    <code>
      <span className="text-purple-300">fetch</span>
      {"("}
      <span className="text-orange-300">
        {`"https://eventflow.com/api/events/create"`}
      </span>
      ,<span className="text-blue-300"> options</span>
      {"}"}
      <br />
    </code>

    <div className="ml-4">
      <code>
        <span className="text-purple-300">{`.then`}</span>
        {"(res => res.json())"}
      </code>
      <br />
      <code>
        <span className="text-purple-300">{`.then`}</span>
        {"(json => console.log(json))"}
      </code>
      <br />
      <code>
        <span className="text-red-300">{`.catch`}</span>
        {"(err => console.error('error:' + err));"}
      </code>
    </div>
  </div>,
  //
  <div className="p-5 h-[430px] overflow-y-scroll codeContainer">
    <code>
      <span className="text-blue-300">import</span> requests
      <br />
      <br />
      url{" "}
      <span className="text-orange-300">
        &quot;https://eventflow.com/api/events/create&quot;
      </span>
      <br />
      <br />
      headers = {"{"}
    </code>
    <div className="ml-4">
      <code className="whitespace-pre-line">
        {`"Content-Type": "application/json",\n"Authorization": "Bearer`}
        <span className="text-emerald-300"> KEY TOKEN</span>
        {`"\n`}
      </code>
    </div>
    <code>
      {"}"}
      <br />
      <br />
      data = {"{"}
    </code>
    <div className="mx-4">
      <code className="whitespace-pre-line">
        <span className="text-orange-300">&quot;title&quot;</span>
        : &quot;New Account&quot;,
        <br />
        <span className="text-orange-300">&quot;category_id&quot;</span>
        : 49482,
        <br />
        <span className="text-orange-300">&quot;description&quot;</span>:
        &quot;A new user has successfully registered with the email address:
        name@email.com.&quot;
      </code>
    </div>
    <code>{`}`}</code>
    <br />
    <br />
    <code className="text-purple-300">try:</code> <br />
    <code className="ml-7">
      response = requests.request{"("}
      <span className="text-orange-300">{`"POST"`}</span>,
      <span className="text-blue-300"> url</span>, json=
      <span className="text-blue-300">data</span>, headers=
      <span className="text-blue-300">headers</span>
      {")"}
    </code>
  </div>,
  //
  <div className="p-5 h-[430px] overflow-y-scroll codeContainer leading-[1.75]">
    <code>
      <span className="text-blue-300">curl</span> -X POST{" "}
      <span className="text-orange-200">
        &quot;https://eventflow.com/api/events/create&quot;
      </span>{" "}
      \
      <br />
    </code>
    <div className="ml-4">
      <code>
        <span className="text-blue-300">-H</span>{" "}
        <span className="text-purple-200">
          &quot;Content-Type: application/json&quot;
        </span>{" "}
        \
        <br />
        <span className="text-blue-300">-H</span>{" "}
        <span className="text-purple-200">
          &quot;Authorization: Bearer KEY TOKEN&quot;
        </span>{" "}
        <span></span>
        \
        <br />
        <span className="text-blue-300">-d</span>
        <span className="text-purple-200"> &apos;{"{ "}</span> <span></span>
        <br />
      </code>
      <div className="ml-5">
        <code className="whitespace-pre-line text-purple-200">{`"title": "New Account",\n"category_id": 49482,\n"description": "A new user has successfully registered with the email address: name@email.com."\n"tags": {
`}</code>
      </div>
      <div className="ml-8">
        <code className="whitespace-pre-line text-purple-200">{`"country": "USA",\n"utm_source": "Facebook"\n}
`}</code>
      </div>
      <div className="ml-4">
        <code className="whitespace-pre-line text-purple-200">{`}'`}</code>
      </div>
    </div>
  </div>,
];
