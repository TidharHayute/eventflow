import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="relative">
      <Header current="Home" />

      <div className="absolute inset-0 bgTealGradient z-[-1]" />

      <section className="fixHeight flex items-center justify-center">
        <p></p>
        <h1 className="font-uncut text-center font-[550] text-6xl tracking-[-0.035em]">
          Events tracking tool
          <br />
          for your business
        </h1>
      </section>
    </main>
  );
}
