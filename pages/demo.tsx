import { LoaderCustom } from "@/components/Animation";
import Header from "@/components/Header";
import supabase from "@/utilities/supabaseClient";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@radix-ui/themes";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [loadCreate, setLoadCreate] = useState(false);
  const [loadDemo, setLoadDemo] = useState(false);

  async function signInWithEmail() {
    try {
      if (email && pass) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: pass,
        });

        if (data.user) {
        }

        if (error) {
          if (error.message == "Email not confirmed") {
          } else {
            setLoadCreate(false);
          }
        } else {
          Router.push("/dashboard");
        }
      } else {
      }
    } catch (error) {}
  }

  return (
    <main className="relative h-screen">
      <Head>
        <title>Login • Eventflow</title>
      </Head>
      <Header current="Login" />

      <div className="absolute inset-0 bgTealGradient z-[-1]" />
    </main>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/overview",
        permanent: false,
      },
    };

  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.NEXT_PUBLIC_DEMO_USER!,
    password: process.env.NEXT_PUBLIC_DEMO_PASS!,
  });

  if (error)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    redirect: {
      destination: "/overview?demo",
      permanent: false,
    },
  };
};
