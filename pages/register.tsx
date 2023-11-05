import Header from "@/components/Header";
import supabase from "@/utilities/supabaseClient";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { Button, Separator } from "@radix-ui/themes";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [load, setLoad] = useState(false);

  async function signUpWithEmail() {
    setLoad(true);

    try {
      if (email && pass) {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: pass,
        });

        if (data.user) {
        } else {
          setLoad(false);
        }
      } else {
      }
    } catch (error) {}
  }

  return (
    <main className="relative">
      <Head>
        <title>Register • Eventflow</title>
      </Head>
      <Header current="Login" />

      <div className="absolute inset-0 bgTealGradient z-[-1]" />

      <section className="fixHeight flex flex-col justify-center items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signUpWithEmail();
          }}
          className="flex flex-col gap-1.5 w-md"
        >
          <h2 className="font-uncut text-3xl tracking-[-0.03em] font-semibold">
            Create an Account
          </h2>

          <div className="flex items-center mt-2.5 gap-2.5">
            <Link
              href={"/login"}
              className="text-xs cursor-pointer font-[450] tracking-wider text-gray-400 transition-all hover:text-white"
            >
              ALREADY HAVE AN ACCOUNT?
            </Link>
          </div>

          <label className="field mt-9" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="field"
            type="email"
            autoComplete="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/*  */}

          <label className="field mt-5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="field mb-2.5"
            type="password"
            autoComplete="password"
            placeholder="•••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <Button
            type="submit"
            highContrast
            size={"3"}
            variant="classic"
            color="gray"
          >
            Create Account
          </Button>
        </form>

        <div className="flex items-center whitespace-nowrap gap-5 mt-7 w-md">
          <div className="h-px bg-gray-600 w-full" />
          <p className="text-xs font-[450] tracking-wider text-gray-400">
            CONTINUE WITH
          </p>
          <div className="h-px bg-gray-600 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-7 w-md">
          <button className="field">
            <svg
              className="w-4 fill-white"
              viewBox="-2 -2 24 24"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMin"
            >
              <path d="M4.376 8.068A5.944 5.944 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10.019 10.019 0 0 1-.044 3.956 9.998 9.998 0 0 1-3.52 5.71A9.958 9.958 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 9.998 9.998 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114z" />
            </svg>
            Register with Google
          </button>

          <button className="field">
            <svg
              className="w-4 fill-white scale-105"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
            >
              <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.636 3.636 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2.001 2.001 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.104 2.104 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.892 3.892 0 0 1 1.025-2.688 3.594 3.594 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.427 9.427 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.593 3.593 0 0 1 .1 2.65 3.869 3.869 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.563 4.937a2.368 2.368 0 0 1 .675 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247Z" />
            </svg>
            Register with GitHub
          </button>
        </div>
      </section>
    </main>
  );
}