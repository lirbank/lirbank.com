import Image from "next/image";
import mikaelImage from "../public/mikael-lirbank.jpg";
import justinImage from "../public/justin-muncaster.jpg";
import chrisImage from "../public/chris-jamieson.jpg";
import hansImage from "../public/hans-pedersen.jpg";
import spencerImage from "../public/spencer-smith.jpg";
import victorImage from "../public/victor-meyer.jpg";
import joeImage from "../public/joe-hochgreve.jpg";
import daneImage from "../public/dane-theisen.jpg";
import { highlightedTechnologies, technologies } from "./technologies";
import { contact } from "./contact";
import { Testimonial } from "./atoms";
import { metadata } from "./layout";

export default function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <container>
        <section
          aria-labelledby="main"
          className="flex flex-col gap-10 sm:grid sm:grid-cols-2"
        >
          <h1 id="main" className="scroll-mt-[81px] text-center sm:text-left">
            Let's unleash your <span>web app</span>
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
              <p>{metadata.description}</p>
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

      {/* 2. Testimonials */}
      <container>
        <section aria-labelledby="testimonials">
          <h2 id="testimonials" className="scroll-mt-20">
            What people say
          </h2>
          <p>
            My peers and clients often point out my attention to detail and
            excellent communication skills.
          </p>
          <Testimonial
            project={{ name: "", url: "", description: "" }}
            quote={
              <>
                <p>
                  I had the pleasure of working with Mikael on my company,
                  BenAi, and he brought a whole new level of professionalism and
                  polish to our software. From day one, he zeroed in on areas
                  for improvement and took our platform from a prototype to a
                  production-ready product of true enterprise quality.
                </p>
                <p>
                  What stood out the most was Mikael's incredible attention to
                  detail. He's always up-to-date on the latest technology trends
                  and consistently recommends modern, high-performing solutions
                  that have significantly improved the functionality and
                  performance of our platform. He didn't just upgrade the code;
                  he transformed our development process with a disciplined,
                  organized approach that brought real structure to our team.
                </p>
                <p>
                  Mikael's work has elevated BenAi in ways I hadn't imagined. If
                  you need someone who can turn ideas into robust, scalable
                  solutions, I would highly recommend working with Mikael.
                </p>
              </>
            }
            author={{
              name: "Spencer Smith",
              title: "Principal Data Scientist, Zillow Group, Founder, BenAi",
              avatar: spencerImage,
              url: "https://www.linkedin.com/in/spencergsmith6/",
            }}
          />
          <Testimonial
            project={{ name: "", url: "", description: "" }}
            quote="It's been a privilege to work alongside Mikael for the past 15 years. He's not only an exceptional developer and mentor but also has an impressive talent for breaking down complex, emerging technologies like AI into insights that are accessible and easy to understand. His expertise and guidance have been invaluable, and we look forward to future collaborations with Mikael."
            author={{
              name: "Victor Meyer",
              title: "Co-Founder and Creative Web Developer, Pixby Media",
              avatar: victorImage,
              url: "https://www.linkedin.com/in/victor-meyer-9784702b/",
            }}
          />
          <Testimonial
            project={{
              name: "FLIR Conservator",
              url: "https://www.flirconservator.com/",
              description: "Image and Video Repository",
            }}
            quote="Mikael was a pleasure to work with. Very knowledgable, very competent, very productive."
            author={{
              name: "Justin Muncaster",
              title: "Teledyne FLIR/Muncaster Consulting",
              avatar: justinImage,
              url: "https://www.linkedin.com/in/jmuncaster/",
            }}
          />
          <Testimonial
            project={{
              name: "POD",
              description: "Logistics and payments app",
            }}
            quote={
              <>
                <p>
                  We couldn't have asked for anything more from Mikael. We had a
                  relatively difficult new application which needed to be built,
                  on a short timeframe and to specific requirements. His
                  approach was careful, considered and fast throughout.
                </p>
                <p>
                  He is an excellent communicator and was able to work
                  considerately, prioritise tasks appropriately and ask
                  questions when needed. He understood the task well and he
                  produced very high quality code, in line with all the best
                  practices etc. - I am confident that his code will be running
                  with us for a long time to come.
                </p>
                <p>
                  Thank you Mikael for a job well done, we're looking forward to
                  working with you again in the future.
                </p>
              </>
            }
            author={{
              name: "Chris Jamieson",
              title: "Director, Melior Enterprises",
              avatar: chrisImage,
              url: "https://www.linkedin.com/in/chris-jamieson-02776a19/",
            }}
          />
          <Testimonial
            project={{
              name: "Formcode",
              description: "Field inspection app",
            }}
            quote="Mikael is fantastic! We are already finding new ways to utilize his vast knowledge. HIGHLY RECOMMEND!"
            author={{
              name: "Joe Hochgreve",
              title: "Web Developer, Formcode",
              avatar: joeImage,
              url: "https://www.linkedin.com/in/joe-hochgreve-71053316/",
            }}
          />
          <Testimonial
            project={{
              name: "The Check Station",
              description: "App rescue",
            }}
            quote={
              <>
                <p>
                  Mikael did a great job with our project. He provided excellent
                  documentation and handed over all of the necessary
                  information.
                </p>
                <p>
                  He also worked with my to make sure my AWS S3 was setup
                  properly and found solutions before and during the project
                  that allow our web app to re-launch and to be cost effective.
                </p>
                <p>
                  Very solid person and developer. Excellent communication and
                  that is key for me.
                </p>
              </>
            }
            author={{
              name: "Hans Pedersen",
              title: "Owner, The Check Station",
              avatar: hansImage,
              url: "https://www.linkedin.com/in/hanspedersen/",
            }}
          />
          <Testimonial
            project={{
              name: "R We Still On Time",
              description: "App rescue",
            }}
            quote="Great communication, highly organized, works efficiently without delay. I look forward to working with Mikael again."
            author={{
              name: "Dane Theisen",
              title: "Founder, R We Still On Time",
              // avatar: "DT",
              avatar: daneImage,
              url: "https://www.linkedin.com/in/danetheisen/",
            }}
          />
        </section>
      </container>

      {/* 3. Projects */}
      <container>
        <section aria-labelledby="projects">
          <h2 id="projects" className="scroll-mt-20">
            Open source
          </h2>
          <p>Author and maintainer of this project.</p>
          <h3>PimDB</h3>
          <p>
            A lightweight, persisted in-memory database built from the ground up
            for the browser. PimDB provides fast and efficient text indexing
            with substring, n-gram, and sorted indexes, enabling quick lookups
            for partial and exact matches. It's <strong>4,000x+ faster</strong>{" "}
            than Array.filter for sorted lookups and{" "}
            <strong>700x+ faster</strong> for substring searches on a dataset of
            100,000 documents.
          </p>
          <p>
            <a
              href="https://www.npmjs.com/package/pimdb"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              npmjs.com/package/pimdb
            </a>
            <br />
            <a
              href="https://github.com/lirbank/pimdb"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              github.com/lirbank/pimdb
            </a>
          </p>
        </section>
      </container>
      <container>
        <section>
          <h2 className="scroll-mt-20">Select commercial projects</h2>
          <p>
            I've recently spent six years as a tech lead, engineering manager,
            and product inventor within the{" "}
            <strong>Applied AI Venture Studio</strong> at{" "}
            <a
              href="https://www.aresmgmt.com/"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              BootstrapLabs, an Ares Management company
            </a>
            , a venture capital firm investing in applied AI. During this time,
            I led a series of applied AI projects.
          </p>
          <p>
            Here are a few favorite AI applications I've built or been a main
            contributor to.
          </p>
          <h3>STΛR MODΞ</h3>
          <p>
            Built from the ground up as an AI-first, humanless bookkeeper that
            handles financial business accounting without human intervention.
            Powered by OpenAI APIs and custom data pipelines, STΛR MODΞ employs
            a next-gen AI-driven user interface with voice input and
            voice+screen output.
          </p>
          <p>
            <a
              href="https://www.starmode.app/"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              Visit starmode.app
            </a>
          </p>
          <h3>BenAi</h3>
          <p>
            A dedicated AI-first chatbot for health benefits administrators
            (TPAs), BenAi quickly and accurately answers questions on individual
            member claims and plans by ingesting plan documents and claims data
            at the individual member level. Built with OpenAI LLMs and custom
            embeddings.
          </p>
          <p>
            <a
              href="https://www.benefits-ai.com/"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              Visit benefits-ai.com
            </a>
          </p>
          <h3>Shorty</h3>
          <p>
            An AI-augmented communication platform that enhances team
            productivity by organizing conversations and interactions into a
            graph of nodes and edges. Integrated with OpenAI LLMs, Shorty relies
            on AI agents to summarize discussions, identify consensus points,
            and enable seamless decision-making support.
          </p>
          <p>
            <a
              href="https://shorty.run/"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              Visit shorty.run
            </a>
          </p>
          <h3>Teledyne FLIR Conservator</h3>
          <p>
            A curated repository of video, imagery, and analytics components.
            This application allows data scientists to build and manage
            repositories of annotated data, and to test and experiment with
            machine-learning video analytics algorithms.
          </p>
          <p>
            <a
              href="https://www.flirconservator.com/"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              Visit flirconservator.com
            </a>
            <br />
            <a
              href="https://www.flir.com/oem/conservator/"
              target="_blank"
              className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            >
              Visit flir.com/oem/conservator
            </a>
          </p>
        </section>
      </container>

      {/* 4. Services */}
      <container>
        <section aria-labelledby="services">
          <h2 id="services" className="scroll-mt-20">
            Things I'd love to take off your plate
          </h2>
          <h3>Hands-on web app development</h3>
          <p>
            I love building web apps from scratch, and I'm great at fixing up
            broken ones, too. I'm happy to work solo or alongside your existing
            dev team, to ship a well-crafted web application.
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
            regressions and keep your app thoroughly tested, from integration to
            end-to-end testing. Quality is at the heart of what I do, and I'm
            happy to get your team up to speed with test-driven development if
            that's a focus.
          </p>
          <p>
            I'll also streamline your deployment process, setting up a reliable
            release pipeline—whether you're using Vercel, Heroku, GitHub
            Actions, or another service—so you can release with confidence.
          </p>
          <h3>Tech strategy, architecture, and stack optimization</h3>
          <p>
            Choosing the right tech stack and architecture is key to a
            productive, scalable app. I'll work with you to select and optimize
            the technologies that best fit your goals, ensuring a solid
            foundation for growth and maintainability.
          </p>
          <p>
            If your app is currently in JavaScript, I can convert it to
            TypeScript to improve reliability and reduce bugs. For projects that
            need a refresh, I'll clean up code, update dependencies, and
            streamline your setup to keep everything running smoothly.
          </p>
          <h3>Leadership and product direction</h3>
          <p>
            With a relaxed but high-accountability approach to leadership, I'll
            help your dev team stay focused, aligned, and motivated. Whether
            guiding your team's day-to-day work, mentoring individual
            developers, or setting long-term goals, I keep quality and
            consistency at the forefront.
          </p>
          <p>
            As a product manager, I make sure every decision supports both
            business objectives and user needs, creating a clear path from
            concept to delivery. My approach brings peace of mind, knowing that
            your project is in good hands and moving in the right direction.
          </p>
        </section>
      </container>

      {/* 5. Benefits */}
      <container>
        <section aria-labelledby="benefits">
          <h2 id="benefits" className="scroll-mt-20">
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
            My commitment to quality—from clean, maintainable code to thoughtful
            architecture, rigorous testing, and gorgeous design—means you'll
            have a reliable and performant app to impress your users with.
          </p>
        </section>
      </container>

      {/* 6. Contact */}
      <container>
        <section aria-labelledby="contact">
          <h2 id="contact" className="scroll-mt-20">
            Let's get to work
          </h2>
          <p>
            Ready to take your web app to the next level? I am here to help.
            Whether you need an urgent fix or a long-term partner, let's make it
            happen. The sky's the limit.
          </p>
          <ul className="ml-4 flex list-disc flex-col gap-2">
            {contact
              .filter((e) => e.type === "contact" || e.id === "linkedIn")
              .map(({ href, label, text, cta }) => (
                <li key={href}>
                  <span className="font-semibold">{cta}: </span>
                  <a
                    href={href}
                    aria-label={label}
                    title={label}
                    className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
                  >
                    {text}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      </container>

      {/* 7. Talks */}
      <container>
        <section aria-labelledby="about">
          <h2 id="talks" className="scroll-mt-20">
            Talks
          </h2>
          <p>
            I speak at meetups, conferences, and private corporate events about
            leveraging AI to build better software.
          </p>
          <ul className="ml-4 flex list-disc flex-col gap-2">
            {[
              {
                date: "December 2, 2024",
                title: "SpikeGadgets",
                url: "https://spikegadgets.com/",
                isPublic: false,
              },
              {
                date: "January, 2025",
                title: "All Things Web",
                url: "https://allthingsweb.dev/",
                isPublic: true,
              },
              {
                date: "March, 2025",
                title: "Silicon Valley AI Think Tank",
                url: "https://lu.ma/JTA",
                isPublic: true,
              },
            ].map(({ date, title, url, isPublic }) => (
              <li key={url + date}>
                <span>{date} - </span>
                <a
                  href={url}
                  aria-label={title}
                  title={title}
                  className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
                  target="_blank"
                >
                  {title}
                </a>{" "}
                <span className="italic_ text-stone-600">
                  ({isPublic ? "public" : "private"})
                </span>
              </li>
            ))}
          </ul>
          <h3>
            <span className="font-bold">Synopsis: Leading LLMs</span>
          </h3>
          <p className="font-semibold">
            A structured approach to building quality software with AI
          </p>
          <p>
            I've been working on a way to use AI to write high-quality,
            well-tested, high-performing code really fast. This approach is
            inspired by my work building PimDB, a browser-based persisted
            in-memory database. In this talk, we'll explore a structured process
            to empower teams to leverage AI to tackle complex projects with
            incredible velocity without compromising on quality.
          </p>
          <p>Through live coding, we'll cover:</p>

          <ol className="ml-5 flex list-decimal flex-col gap-2">
            <li>API design and architecture</li>
            <li>Writing tests</li>
            <li>Performance benchmarking</li>
            <li>Writing documentation</li>
            <li>Implementation and optimization</li>
          </ol>
        </section>
      </container>

      {/* 8. About */}
      <container>
        <section aria-labelledby="about">
          <h2 id="about" className="scroll-mt-20">
            About me
          </h2>
          <p>
            I'm Mikael Lirbank, based in Corte Madera, just north of the Golden
            Gate Bridge in the beautiful San Francisco Bay Area. I live here
            with my amazing wife and children. In my spare time, I'm a bit of a
            cycling fanatic, so if you'd ever want to go mountain biking or road
            cycling in Marin County, hit me up!
          </p>
          <p>
            With over 20 years of experience, I've built a strong track record
            of building apps from scratch, rescuing existing ones, and leading
            development teams. I'm a tech lead, product manager, UI designer,
            and code quality expert, known for taking ownership of every project
            and delivering predictability and peace of mind to my clients.
          </p>
          <h3>Technologies & tooling</h3>
          <p>I thrive with these tools and technologies.</p>
          <div className="-mx-6 flex flex-wrap justify-center gap-1 pt-4 sm:-mx-3">
            {technologies
              .toSorted((a, b) => a[0].localeCompare(b[0]))
              .map(([name, url]) => (
                <div
                  key={name}
                  className={
                    "rounded-lg px-3 py-1 text-sm text-nowrap" +
                    (highlightedTechnologies.includes(name)
                      ? " bg-cyan-50 font-medium text-cyan-900"
                      : " bg-stone-50")
                  }
                >
                  <a href={url} target="_blank">
                    {name}
                  </a>
                </div>
              ))}
          </div>
        </section>
      </container>
    </main>
  );
}
