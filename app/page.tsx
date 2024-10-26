import Image from "next/image";
import mikaelImage from "../public/mikael-lirbank.jpg";
import { LinkedInIcon, SquareGitHubIcon, SquareXTwitterIcon } from "./icons";

const technologies = [
  ["AI", "https://en.wikipedia.org/wiki/Artificial_intelligence"],
  ["AWS", "https://aws.amazon.com/"],
  ["bun", "https://bun.sh/"],
  ["Convex", "https://convex.dev/"],
  ["Docker", "https://www.docker.com/"],
  ["Drizzle", "https://orm.drizzle.team/"],
  ["Expo", "https://expo.dev/"],
  ["Heroku", "https://www.heroku.com/"],
  ["LLM", "https://en.wikipedia.org/wiki/Large_language_model"],
  ["Neon", "https://neon.tech/"],
  ["Next.js", "https://nextjs.org/"],
  ["OpenAI", "https://openai.com/"],
  ["Playwright", "https://playwright.dev/"],
  ["pnpm", "https://pnpm.io/"],
  ["Postgres", "https://www.postgresql.org/"],
  [
    "React Server Actions",
    "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions",
  ],
  ["React", "https://react.dev/"],
  [
    "RSC",
    "https://nextjs.org/docs/app/building-your-application/optimizing/rsc",
  ],
  ["Tailwind CSS", "https://tailwindcss.com/"],
  ["tRPC", "https://trpc.io/"],
  ["tubo repo", "https://turbo.build/repo"],
  ["TypeScript", "https://www.typescriptlang.org/"],
  ["Vercel", "https://vercel.com/"],
  ["Vitest", "https://vitest.dev/"],
] as const;

export default function Home() {
  return (
    <main className="min-h-dvh bg-stone-200 text-slate-800">
      <section>
        <inner className="gap-10 sm:grid sm:grid-cols-2">
          <h1 className="text-center sm:text-left">
            Unleash your{" "}
            <span className="font-semibold text-cyan-600">web app</span>
            &apos;s true potential
          </h1>
          <Image
            className="mx-auto size-64 rounded-full object-cover sm:row-span-2 sm:rounded sm:shadow"
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
        </inner>
      </section>

      {/* <section className="mx-auto flex max-w-3xl flex-col gap-10 bg-stone-100 px-8 py-10"> */}
      <section className="bg-stone-100">
        <inner className="gap-10">
          <h2>Things I&apos;d love to take off your plate</h2>
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
        </inner>
      </section>
      <section>
        <inner className="gap-6">
          <h2>About me</h2>
          <p>
            I have a strong track record of building apps from scratch, rescuing
            existing ones, and leading development teams.
          </p>
          <h2>Expertise</h2>
          <p>I consider myself an expert in the following technologies:</p>
          <div className="-mx-4 flex flex-wrap justify-center gap-1">
            {technologies.map(([name, url]) => (
              <div
                key={name}
                className="rounded-lg bg-stone-100 px-3 py-1 text-sm text-nowrap"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </div>
            ))}
          </div>

          <p>
            I&apos;m a tech lead, product manager, UI designer, and code quality
            expert with over 20 years of experience building apps from scratch,
            rescuing existing ones, and managing development teams. I&apos;m
            very hands-on and I love building web apps, whether solo or as part
            of a team.
          </p>
          <p>
            I live in Corte Madera, just north of the Golden Gate Bridge, in the
            San Francisco Bay Area.
          </p>
          <p>
            I take ownership of every project, delivering predictability and
            peace of mind to you.
          </p>
        </inner>
      </section>
    </main>
  );
}
