import Image, { StaticImageData } from "next/image";

export function Testimonial(props: {
  quote: string | React.ReactNode;
  project: {
    name: string;
    description: string;
    url?: string;
  };
  author: {
    name: string;
    title: string;
    avatar: StaticImageData | string;
    url: string;
  };
}) {
  return (
    <div className="-mx-4 mt-8 rounded-md bg-stone-50 p-4 shadow">
      {/*
      <h3>{props.project.name}</h3>
      <div className="text-lg text-stone-600">
        {props.project.url ? (
          <a
            href={props.project.url}
            target="_blank"
            className="underline hover:text-cyan-700"
          >
            {props.project.description}
          </a>
        ) : (
          props.project.description
        )}
      </div>
      */}
      <blockquote className="border-l-4 border-stone-300 pl-4 italic">
        {props.quote}
      </blockquote>
      <div className="mt-4 flex items-center gap-2">
        <a href={props.author.url} target="_blank" className="shrink-0">
          {typeof props.author.avatar !== "string" ? (
            <Image
              className="size-12 rounded-full object-cover shadow"
              src={props.author.avatar}
              alt={`${props.author.name}, ${props.author.title}`}
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-stone-200 text-base font-bold tracking-wide text-stone-600">
              {props.author.avatar}
            </div>
          )}
        </a>
        <div className="flex flex-col">
          <strong className="text-lg">{props.author.name}</strong>
          <div className="text-stone-600">{props.author.title}</div>
        </div>
      </div>
    </div>
  );
}
