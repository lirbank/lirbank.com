import Image from "next/image";
import mikaelImage from "../public/mikael-lirbank.jpg";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-10 p-10 text-slate-800">
      <h1 className="max-w-screen-md text-center text-4xl font-semibold sm:text-6xl">
        Unleash your app&apos;s true potential
      </h1>
      <Image
        className="size-64 rounded-full border-slate-200 object-cover"
        src={mikaelImage}
        alt="Mikael Lirbank"
      />
      <div>
        <h2 className="text-lg font-semibold">Mikael Lirbank</h2>
        <p>Tech lead, product manager, code quality expert</p>
      </div>
    </main>
  );
}
