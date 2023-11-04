import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="relative">
      <Header current="Home" />

      <div className="absolute inset-0 bgTealGradient z-[-1]" />

      <section className="fixHeight flex items-center justify-center">
        <h1 className="font-uncut font-medium text-7xl tracking-tighter">
          Email for
          <br />
          developers
        </h1>
      </section>
    </main>
  );
}
