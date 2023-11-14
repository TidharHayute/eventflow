import Header from "@/components/Header";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

export default function Home() {
  return (
    <main className="relative h-screen">
      <Head>
        <title>Eventflow</title>
      </Head>

      <Header current="Home" />

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

  return {
    redirect: {
      destination: "/login  ",
      permanent: false,
    },
  };
};
