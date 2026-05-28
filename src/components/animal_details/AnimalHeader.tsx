import type { AnimalTaxonomy } from "@/types/animal";

interface AnimalHeaderProps {
  commonName: string;
  taxonomy: AnimalTaxonomy;
  description: string | null;
  descriptionSource?: string | null;
  scientificName: string | null;
  diet?: string | null;
  tags?: { name: string; color: string | null }[];
}

function getSourceHostname(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function AnimalHeader({
  commonName,
  taxonomy,
  description,
  descriptionSource,
  scientificName,
  diet,
  tags,
}: AnimalHeaderProps) {
  return (
    <>
      <div className="break-inside-avoid">
        <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold uppercase tracking-widest">
          {diet || taxonomy.family || "ANIMAL"}
        </span>
        <h1 className="text-5xl font-extrabold text-primary mt-4 font-headline">
          {commonName}
        </h1>
        <p className="text-xl italic text-on-surface-variant mt-2 font-medium">
          {scientificName}
        </p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center px-3 py-1 rounded-lg bg-[#2d5a27]/10 text-[#2d5a27] text-xs font-bold font-['Manrope']"
                style={tag.color ? { backgroundColor: `${tag.color}1A`, color: tag.color } : {}}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="prose prose-stone max-w-none break-inside-avoid mt-6">
        <p className="text-lg leading-relaxed text-on-surface text-justify">
          {description || "No description available."}
        </p>
        {descriptionSource && (
          <p className="text-sm text-on-surface-variant mt-2 font-['Manrope']">
            Source:{" "}
            <a
              href={descriptionSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 transition-colors"
            >
              {getSourceHostname(descriptionSource)}
            </a>
          </p>
        )}
      </div>
    </>
  );
}
