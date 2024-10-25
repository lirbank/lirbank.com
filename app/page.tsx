import Image from "next/image";
import mikaelImage from "../public/mikael-lirbank.jpg";
import { LinkedInIcon, SquareGitHubIcon, SquareXTwitterIcon } from "./icons";

export default function Home() {
  return (
    <main className="min-h-dvh bg-stone-300 text-slate-800">
      <section className="flex flex-col gap-10 p-10">
        <h1>Unleash your app&apos;s true potential</h1>
        <Image
          className="mx-auto size-64 rounded-full object-cover"
          src={mikaelImage}
          alt="Mikael Lirbank"
        />
        <div className="flex flex-col gap-2">
          <div>
            <h3>Mikael Lirbank</h3>
            {/* <p>Tech lead, product manager, code quality expert</p> */}
            <p className="text-lg">I help companies build better software</p>
          </div>
          <div className="flex gap-2">
            <LinkedInIcon className="size-8" />
            <SquareXTwitterIcon className="size-8" />
            <SquareGitHubIcon className="size-8" />
          </div>
        </div>
      </section>
      {/* <section className="flex flex-col gap-10 bg-stone-300 p-10">
        <div>
          <h3 className="text-lg font-semibold">What I do</h3>
          <p>I help companies build better software.</p>
        </div>
      </section> */}
      <section className="flex flex-col gap-10 rounded bg-stone-200 p-10">
        <h2>Things I&apos;d love to build for you</h2>
        <div className="flex flex-col gap-2">
          <h3>Build from scratch</h3>
          <p>Ipsums dolor sit amet.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3>JavaScript to TypeScript</h3>
          <p>
            TypeScript will boost productivity and reduce bugs. If your app is
            not written in TypeScript, I can convert it for you.
          </p>
        </div>
      </section>
    </main>
  );
}
