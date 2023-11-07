import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClipboardIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AnimateArrow, LoaderCustom } from "@/components/Animation";
import { Dialog, Select } from "@radix-ui/themes";
import { useRouter } from "next/router";

import { connect } from "@planetscale/database";
import { toast } from "sonner";
import { Category, Key } from "@/utilities/databaseTypes";

const config = {
  host: process.env.NEXT_PUBLIC_PS_HOST,
  username: process.env.NEXT_PUBLIC_PS_USER,
  password: process.env.NEXT_PUBLIC_PS_PASS,
};

export function formattedDateForSQL(date: Date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function generateKeyToken(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function Keys({
  user,
  keysData,
  categoriesData,
  favCategories,
}: {
  user: User;
  keysData: Key[];
  categoriesData: Category[];
  favCategories: any;
}) {
  const [codeLang, setCodeLang] = useState(0);

  const [newKeyName, setNewKeyName] = useState("");

  const [keysList, setKeysList] = useState<Key[]>(keysData);

  const { ref } = useRouter().query;

  async function createKeyToken() {
    try {
      const conn = await connect(config);

      const generatedKeyToken = generateKeyToken(26);
      const currentFormattedData = formattedDateForSQL(new Date());

      const query = `INSERT INTO keys(id, uid, lu, n) VALUES (?,?,?,?)`;
      const insertToKeys = await conn.execute(query, [
        generatedKeyToken,
        user.id,
        currentFormattedData,
        newKeyName,
      ]);

      setKeysList([
        ...keysList,
        {
          id: generatedKeyToken,
          uid: user.id,
          lu: currentFormattedData,
          n: newKeyName,
        },
      ]);

      setNewKeyName("");
    } catch (error) {}
  }

  useEffect(() => {
    if (ref) {
      const targetDiv = document.getElementById(ref.toLocaleString());

      if (targetDiv) {
        targetDiv!.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [ref]);

  return (
    <main className="dashboardParent">
      <Head>
        <title>Keys & Tokens • Eventflow</title>
      </Head>

      <div className={`dashboardGrid`}>
        <Sidebar
          favCategories={favCategories[0].fav_categories}
          categoriesList={categoriesData}
          uI={user}
          current="Keys & Tokens"
        />

        <div className="dashboardWrap">
          <div className="dashboardBody">
            <DashboardHeader />

            <div className="dashboardView">
              <h3>Keys & Tokens</h3>
              <p className="mdP mt-1">
                API keys are essential for sending requests and publishing
                events.
              </p>

              <div className="mt-10">
                <table className="w-full">
                  <tbody>
                    <tr className="shadow-ins2 px-3.5 py-2 rounded-m border border-white/10 bg-white/[0.03]">
                      <th>Key Name</th>
                      <th>Token</th>
                      <th>Permission</th>
                      <th>Last Used</th>
                    </tr>

                    {keysList.length > 0 ? (
                      keysList.map((it, i) => (
                        <tr key={i} className="p-3.5 border-b border-white/10">
                          <td className="flexc gap-3.5">
                            <div className="w-10 h-10 rounded-3xl border border-white/10 flexc justify-center shadow-[inset_0px_-3px_8px_1px_rgba(255,255,255,0.18)]">
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
                            </div>
                            {it.n || "Key Token"}
                          </td>

                          <td
                            onClick={async () => {
                              await navigator.clipboard.writeText(it.id);
                              toast.success(
                                `Copied ${it.n ? it.n + `'s` : ""} Key`
                              );
                            }}
                            className="px-3 py-1.5 cursor-pointer relative shadow-[inset_0px_-2px_25px_0px_rgba(255,255,255,0.05)] bg-white/[0.02] rounded-lg group text-sm w-fit flexc"
                          >
                            <span className="max-w-[190px] w-[190px] block truncate">
                              {it.id}
                            </span>
                            <p className="absolute -right-[77px] text-[12px] group-active:scale-95 border border-white/10 opacity-0 -translate-x-1.5 bg-white/10 px-2.5 py-1 rounded-2xl transition-all duration-200 scale-95 origin-left flexc gap-1 group-hover:opacity-60 group-hover:translate-x-0 group-hover:scale-100">
                              <ClipboardIcon className="w-[13px] -translate-y-[0.5px] -ml-[0.5px]" />
                              Copy
                            </p>
                            {/* <ClipboardIcon className="p-[7px] w-[32px] stroke-white/60 bg-white/5 absolute -right-9 rounded-lg border border-white/10" /> */}
                          </td>

                          <td className="flexc gap-2 text-sm text-emerald-300">
                            <div className="relative flexc justify-center">
                              <div className="w-1 h-1 rounded-lg bg-emerald-300" />
                              <div className="w-1.5 h-1.5 rounded-lg bg-emerald-300/80 absolute z-[-1] animate-pingslow" />
                            </div>
                            Full Permission
                          </td>

                          <td className="flexc justify-between">
                            <div className="flexc gap-2 text-sm">
                              <CalendarDaysIcon className="w-4 -translate-y-[0.5px]" />
                              {new Date(it.lu).toLocaleDateString("en-GB")}
                            </div>
                            <Dialog.Root>
                              <Dialog.Trigger>
                                <TrashIcon className="w-6 p-1 hover:bg-white/[0.035] border border-white/0 shadow-none hover:shadow-ins2 hover:border-white/10 stroke-white cursor-pointer rounded-md transition-all" />
                              </Dialog.Trigger>

                              <Dialog.Content
                                style={{
                                  maxWidth: "400px",
                                  background: "#151515",
                                }}
                              >
                                <h4 className="">Delete Key Token</h4>
                                <p className="text-sm opacity-75 mt-1.5">
                                  Are you sure you want to delete this key
                                  token?
                                  <br />
                                  This action cannot be undone.
                                </p>
                                <div className="flexc gap-3 justify-end mt-5">
                                  <Dialog.Close>
                                    <button
                                      className={`grayButton md group outline-none`}
                                    >
                                      Cancel
                                      <span className="group-hover:opacity-60" />
                                    </button>
                                  </Dialog.Close>

                                  <Dialog.Close>
                                    <button
                                      onClick={async () => {
                                        try {
                                          const conn = await connect(config);

                                          let updatedKeysList = [...keysList];
                                          updatedKeysList.splice(i, 1);

                                          setKeysList(updatedKeysList);

                                          await conn.execute(
                                            `delete from keys where id = '${it.id}'`
                                          );
                                        } catch (error) {}
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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <div className="flexc gap-2 my-10 opacity-90 justify-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 stroke-white -translate-y-[0.5px]"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.25"
                            d="M12 17v-2m0 0c.513 0 .929-.448.929-1s-.416-1-.929-1c-.513 0-.929.448-.929 1s.416 1 .929 1Zm5.573-5.761V9c0-3.314-2.495-6-5.573-6-3.078 0-5.573 2.686-5.573 6v.239m11.146 0C16.887 9 15.965 9 14.303 9H9.697c-1.662 0-2.584 0-3.27.239m11.146 0c.084.029.164.061.242.098.951.45 1.684 1.307 2.021 2.366.253.793.176 1.794.02 3.795-.133 1.723-.2 2.584-.507 3.26-.41.901-1.119 1.604-1.987 1.969-.65.273-1.454.273-3.06.273H9.698c-1.605 0-2.408 0-3.06-.273-.867-.365-1.577-1.068-1.986-1.969-.308-.676-.374-1.537-.508-3.26-.154-2.001-.232-3.002.02-3.795.338-1.059 1.071-1.916 2.022-2.366.078-.037.158-.07.242-.098"
                          />
                        </svg>
                        <p>
                          No Key Tokens found. Click on{" "}
                          <span className="font-medium">Create Key Token</span>{" "}
                          to get started.
                        </p>
                      </div>
                    )}
                  </tbody>
                </table>

                <div className="flexc justify-end mt-5">
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <button className="grayButton sm group">
                        <PlusIcon className="w-4 -ml-[3px]" />
                        Create Key Token
                        <span className="group-hover:opacity-60" />
                      </button>
                    </Dialog.Trigger>

                    <Dialog.Content
                      style={{
                        maxWidth: "400px",
                        background: "#151515",
                      }}
                    >
                      <h4>Create Key Token</h4>
                      <input
                        className="border mt-4 focus:outline-none focus:border-white/20 placeholder:text-[#757575] border-white/10 rounded-m px-3 py-2.5 text-sm w-full bg-white/5"
                        placeholder="Key Name"
                        maxLength={20}
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />

                      <div className="flexc mt-4 justify-end gap-3">
                        <Dialog.Close>
                          <button className="grayButton sm group shadow-none">
                            Cancel
                            <span className="group-hover:opacity-60"></span>
                          </button>
                        </Dialog.Close>
                        <Dialog.Close>
                          <button
                            onClick={() => {
                              toast.promise(createKeyToken(), {
                                loading: "Creating Key Token...",
                                success: () => {
                                  return `Key Token was created`;
                                },
                                error: `Error creating Key Token.`,
                              });
                            }}
                            className="bg-white border-white text-black grayButton sm hover:opacity-80 transition-all duration-300 group"
                          >
                            Create
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Root>
                </div>
              </div>

              <h5 className="pt-10" id="API">
                API Reference
              </h5>
              <p className="mdP mt-1.5">
                Learn how to use our API to submit data events from your
                platform.
              </p>

              <div className="border mt-5 rounded-xl border-white/10 w-full overflow-hidden">
                <div className="w-full flexc justify-between py-3 pl-5 pr-3 border-b border-white/10 bg-white/[0.025] shadow-ins2">
                  <p className="font-uncut tracking-tight text-lg font-[550]">
                    Create an Event
                  </p>
                  <div className="flexc gap-2.5">
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
                </div>

                {codeValue[codeLang]}
              </div>

              <div className="mt-7">
                <h5 className="text-[22px]">Request</h5>
                <p className="opacity-90 tracking-sm mt-1.5 text-[15px] leading-[1.75]">
                  <span className="font-[450]">Security:</span> Bearer Key Token
                  <br />
                  <span className="font-[450]">Content-Type:</span>{" "}
                  <span className="">application/json</span>
                </p>

                <p className="text-lg font-uncut tracking-tight font-semibold mt-6">
                  Body
                </p>
                <div className="grid grid-cols-1 mt-1.5 codeReference">
                  <code>
                    title<span> string</span>
                  </code>
                  <p>
                    The title value of the new event.
                    <span className="required">required</span>
                  </p>
                  <code>
                    category_id<span> integer</span>
                  </code>
                  <p>
                    The ID associated with the related category of the new
                    event.
                    <span className="required">required</span>
                  </p>
                  <code>
                    description<span> string</span>
                  </code>

                  <p>
                    Short description of the new event for more advanced
                    information.
                    <span className="optional">optional</span>
                  </p>
                  <code>
                    tags<span> {`{ string: any `}</span>
                  </code>
                  <p>
                    Relevant tags for the new event, for more advanced data and
                    filtering.
                    <span className="optional">optional</span>
                  </p>
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

  const keysData = await conn.execute(
    `select * from keys where uid = '${session.user.id}'`
  );

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
      keysData: keysData.rows,
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
