import Image, { StaticImageData } from "next/image";

export function Testimonial(props: {
  project: {
    name: string;
    url?: string;
    description: string;
  };
  quote: string;
  author: {
    name: string;
    title: string;
    image: StaticImageData;
    url: string;
  };
}) {
  return (
    <>
      <h3>{props.project.name}</h3>
      <div className="text-stone-600">
        {props.project.url ? (
          <a
            href={props.project.url}
            target="_blank"
            className="underline hover:text-cyan-700"
          >
            {props.project.description}
          </a>
        ) : (
          <span>{props.project.description}</span>
        )}
      </div>
      <blockquote>{props.quote}</blockquote>
      <div className="mt-4 flex items-center gap-2">
        <a href={props.author.url} target="_blank">
          <Image
            className="size-12 rounded-full object-cover"
            src={props.author.image}
            alt={props.author.name}
          />
        </a>
        <div className="flex flex-col">
          <strong className="text-lg">{props.author.name}</strong>
          <div className="text-stone-700">{props.author.title}</div>
        </div>
      </div>
    </>
  );
}
