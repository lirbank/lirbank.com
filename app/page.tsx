import Image from "next/image";
import mikaelImage from "../public/mikael-lirbank.jpg";
import { LinkedInIcon, SquareGitHubIcon, SquareXTwitterIcon } from "./icons";
import { technologies } from "./technologies";

export default function Home() {
  return (
    <>
      <main>
        {/* 1. Hero */}
        <container>
          <section
            aria-labelledby="main-heading"
            className="flex flex-col gap-10 sm:grid sm:grid-cols-2"
          >
            <h1 id="main-heading" className="text-center sm:text-left">
              Let's unleash your{" "}
              <span className="font-semibold text-cyan-600">web app</span>
              's true potential
            </h1>
            <Image
              className="mx-auto size-64 rounded-full object-cover sm:row-span-2 sm:rounded sm:shadow"
              src={mikaelImage}
              alt="Mikael Lirbank, a web development expert smiling at the camera"
            />
            <div className="flex flex-col gap-2">
              <div>
                <h3>Mikael Lirbank</h3>
                <p className="mt-1!">
                  I help companies build better software, focusing on web
                  technologies.
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://www.linkedin.com/in/mikaellirbank"
                  aria-label="LinkedIn profile"
                >
                  <LinkedInIcon className="size-8" />
                </a>
                <a
                  href="https://x.com/mikaellirbank"
                  aria-label="Twitter profile"
                >
                  <SquareXTwitterIcon className="size-8" />
                </a>
                <a
                  href="https://github.com/lirbank"
                  aria-label="GitHub profile"
                >
                  <SquareGitHubIcon className="size-8" />
                </a>
              </div>
            </div>
          </section>
        </container>

        {/* 2. Services */}
        <container>
          <section aria-labelledby="services-heading">
            <h2 id="services-heading">
              Things I'd love to take off your plate
            </h2>
            <h3>App development</h3>
            <p>
              I love building web apps from scratch, and I'm great at fixing up
              broken ones, too. I'm happy to work solo or alongside your
              existing dev team, to ship a well-crafted app.
            </p>
            <p>
              If your app needs a modern look or a smoother experience, I can
              refresh the design and create a consistent design system that your
              users will appreciate.
            </p>
            <h3>Deployment and quality assurance</h3>
            <p>
              A bug-free, fast, and stable app that is a delight to use starts
              with robust test automation. I set up test automation frameworks
              to eliminate regressions and keep your app thoroughly tested, from
              integration to end-to-end testing. Quality is at the heart of what
              I do, and I'm happy to get your team up to speed with test-driven
              development if that's a focus.
            </p>
            <p>
              I'll also streamline your deployment process, setting up a
              reliable release pipeline—whether you're using Vercel, Heroku,
              GitHub Actions, or another service—so you can release with
              confidence.
            </p>
            <h3>Tech strategy, architecture, and stack optimization</h3>
            <p>
              Choosing the right tech stack and architecture is key to a
              productive, scalable app. I'll work with you to select and
              optimize the technologies that best fit your goals, ensuring a
              solid foundation for growth and maintainability.
            </p>
            <p>
              If your app is currently in JavaScript, I can convert it to
              TypeScript to improve reliability and reduce bugs. For projects
              that need a refresh, I'll clean up code, update dependencies, and
              streamline your setup to keep everything running smoothly.
            </p>
            <h3>Leadership and product direction</h3>
            <p>
              Combines team leadership with product management expertise. Ideal
              for clients seeking someone to lead development efforts, provide
              direction to their team, or guide product decisions with an eye
              for quality and scalability.
            </p>
          </section>
        </container>

        {/* 3. Benefits */}
        <container>
          <section aria-labelledby="benefits-heading">
            <h2 id="benefits-heading">Why work with me</h2>
            <p>
              I pay close attention to detail and quality, in both code and
              design.
            </p>
          </section>
        </container>

        {/* 4. Contact */}
        <container>
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading">Let's get in touch</h2>
          </section>
        </container>

        {/* 5. About */}
        <container>
          <section aria-labelledby="about-heading">
            <h2 id="about-heading">About me</h2>
            <p>
              I live in Corte Madera with my wife and children, just north of
              the Golden Gate Bridge, in the San Francisco Bay Area. I am a bit
              of a cycling fanatic so if you'd ever want to go mountain biking
              or road cycling in Marin County, hit me up.
            </p>
            <p>
              I have a strong track record of building apps from scratch,
              rescuing existing ones, and leading development teams.
            </p>
            <p>
              I'm a tech lead, product manager, UI designer, and code quality
              expert with over 20 years of experience building apps from
              scratch, rescuing existing ones, and managing development teams.
              I'm very hands-on and I love building web apps, whether solo or as
              part of a team.
            </p>
            <p>
              I take ownership of every project, delivering predictability and
              peace of mind to you.
            </p>
            <h3>Expertise</h3>
            <p>I consider myself an expert in the following technologies:</p>
            <div className="-mx-6 flex flex-wrap justify-center gap-1 pt-8 sm:mx-0">
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
          </section>
        </container>
      </main>
      <footer className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-4 text-center">
        © {new Date().getFullYear()} Mikael Lirbank & Airlab LLC
      </footer>
    </>
  );
}
