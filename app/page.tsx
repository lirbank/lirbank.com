import Image from "next/image";
import mikaelImage from "../public/mikael-lirbank.jpg";
import { LinkedInIcon, SquareGitHubIcon, SquareXTwitterIcon } from "./icons";

export default function Home() {
  return (
    <main className="min-h-dvh bg-stone-300 text-slate-800">
      <section className="flex flex-col gap-10 px-8 py-10">
        <h1>Unleash your web app&apos;s true potential</h1>
        <Image
          className="mx-auto size-64 rounded-full object-cover"
          src={mikaelImage}
          alt="Mikael Lirbank"
        />
        <div className="flex flex-col gap-2">
          <div>
            <h3>Mikael Lirbank</h3>
            <p>
              I help companies build better software, focusing on web
              technologies.
            </p>
          </div>
          <div className="flex gap-2">
            <a href="https://www.linkedin.com/in/mikaellirbank">
              <LinkedInIcon className="size-8" />
            </a>
            <a href="https://x.com/mikaellirbank">
              <SquareXTwitterIcon className="size-8" />
            </a>
            <a href="https://github.com/lirbank">
              <SquareGitHubIcon className="size-8" />
            </a>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-10 bg-stone-200 px-8 py-10">
        <h2>Things I&apos;d love to build for you</h2>

        <div className="flex flex-col gap-2">
          <h3>Build from scratch</h3>
          <p>
            Standing up a new project from scratch? I can help you with that.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3>JavaScript to TypeScript</h3>
          <p>
            TypeScript boosts productivity and reduces bugs. If your app is
            written in JavaScript, I can convert it to TypeScript for you.
          </p>
        </div>
      </section>
      <section className="bg- flex flex-col gap-6 p-8 py-10">
        <h2>About me</h2>
        <p>
          I have a strong track record of building apps from scratch, rescuing
          existing ones, and leading development teams.
        </p>

        <p>
          I&apos;m a tech lead, product manager, UI designer, and code quality
          expert with over 20 years of experience building apps from scratch,
          rescuing existing ones, and managing development teams. I&apos;m very
          hands-on and I love building web apps, whether solo or as part of a
          team.
        </p>
        <p>
          I live in Corte Madera, just north of the Golden Gate Bridge, in the
          San Francisco Bay Area.
        </p>
        <p>
          I take ownership of every project, delivering predictability and peace
          of mind to you.
        </p>
      </section>
    </main>
  );
}
