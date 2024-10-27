import Image from "next/image";
import mikaelImage from "../public/mikael-lirbank.jpg";
import { technologies } from "./technologies";
import { contact } from "./contact";

export default function Home() {
  return (
    <>
      <header className="border-b border-stone-300 bg-stone-200">
        <header className="mx-auto flex max-w-3xl justify-between px-6">
          <a href="#services-heading" className="p-2">
            Services
          </a>
          <a href="#benefits-heading" className="p-2">
            Benefits
          </a>
          <a href="#contact-heading" className="p-2">
            Contact
          </a>
          <a href="#about-heading" className="p-2">
            About
          </a>
        </header>
      </header>
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
                {contact.map(({ href, icon: Icon, label }) => (
                  <a key={href} href={href} aria-label={label} title={label}>
                    <Icon className="size-8" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </container>

        {/* 2. Services */}
        <container>
          <section aria-labelledby="services-heading">
            <h2 id="services-heading" className="scroll-mt-10">
              Things I'd love to take off your plate
            </h2>
            <h3>Hands-on web app development</h3>
            <p>
              I love building web apps from scratch, and I'm great at fixing up
              broken ones, too. I'm happy to work solo or alongside your
              existing dev team, to ship a well-crafted web application.
            </p>
            <p>
              If your app needs a modern look or a smoother experience, I can
              refresh the design and create a consistent design system that your
              users will appreciate.
            </p>
            <h3>Deployment and quality assurance</h3>
            <p>
              A bug-free, fast, and stable app that is a delight to use starts
              with robust test automation. I set up test automation to eliminate
              regressions and keep your app thoroughly tested, from integration
              to end-to-end testing. Quality is at the heart of what I do, and
              I'm happy to get your team up to speed with test-driven
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
              With a relaxed but high-accountability approach to leadership,
              I'll help your dev team stay focused, aligned, and motivated.
              Whether guiding your team's day-to-day work, mentoring individual
              developers, or setting long-term goals, I keep quality and
              consistency at the forefront.
            </p>
            <p>
              As a product manager, I make sure every decision supports both
              business objectives and user needs, creating a clear path from
              concept to delivery. My approach brings peace of mind, knowing
              that your project is in good hands and moving in the right
              direction.
            </p>
          </section>
        </container>

        {/* 3. Benefits */}
        <container>
          <section aria-labelledby="benefits-heading">
            <h2 id="benefits-heading" className="scroll-mt-10">
              Why work with me
            </h2>
            <h3>Peace of mind</h3>
            <p>
              My main deliverable is peace of mind. Working with me, you'll have
              an app leader who takes ownership of every aspect of the project,
              handles complex situations independently, and keeps everything
              moving smoothly.
            </p>
            <p>
              I'll keep you informed on what really matters, so you can stay
              focused on your core priorities without unnecessary interruptions.
            </p>
            <h3>Experience and quality</h3>
            <p>
              With years of experience building and refining apps, I create
              stable, scalable software that's ready to grow with your business.
            </p>
            <p>
              My commitment to quality—from clean, maintainable code to
              thoughtful architecture, rigorous testing, and gorgeous
              design—means you'll have a reliable and performant app to impress
              your users with.
            </p>
          </section>
        </container>

        {/* 4. Contact */}
        <container>
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="scroll-mt-10">
              Let's get to work
            </h2>
            <p>
              Ready to take your web app to the next level? I am here to help.
              Whether you need an urgent fix or a long-term partner, let's make
              it happen. The sky is the limit.
            </p>
            <div className="mt-4 flex flex-col gap-2 first:mt-0" />
            <ul className="mt-4 ml-4 flex list-disc flex-col gap-2 first:mt-0">
              {contact
                .filter((e) => e.type === "contact" || e.id === "linkedIn")
                .map(({ href, label, text, cta }) => (
                  <li key={href}>
                    <span className="font-semibold">{cta}: </span>
                    <a
                      href={href}
                      aria-label={label}
                      title={label}
                      className="underline"
                    >
                      {text}
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        </container>

        {/* 5. About */}
        <container>
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="scroll-mt-10">
              About me
            </h2>
            <p>
              I live in Corte Madera with my wife and children, just north of
              the Golden Gate Bridge, in the San Francisco Bay Area. I am a bit
              of a cycling fanatic so if you'd ever want to go mountain biking
              or road cycling in Marin County, hit me up.
            </p>
            <p>TBD</p>
            {/* <p>
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
            <p>I consider myself an expert in the following technologies:</p> */}
            <h3>Technologies</h3>
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
      <footer className="mx-auto max-w-3xl px-8 py-4 text-center">
        © {new Date().getFullYear()} Airlab LLC. All rights reserved.
      </footer>
    </>
  );
}
