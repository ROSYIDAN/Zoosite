import Link from "next/link";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { cn } from "@/lib/utils";

/**
 * EcosystemGrid component displaying various habitats.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function EcosystemGrid() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
        Ecosystem Archive
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <HabitatLink
          href="/habitats/savanna"
          title="Savanna"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCMGoM1daoMPZt32Or4sN6m0ZcrA0g2_FdsFlCysWtCeA-vZY_5YZzhFqIQDU2cloTUBhh1VoDeQ4lCtsLt_doHxgUGKYUwPQ0seyJJ2sZIoMa9mEB-WyRf6L0-HgEXaepY06AD60XCJKSYzvpYlqdfBlkFZ4I8iUlB1GXFcz0lnsrq-y8UPIf641YZrvz-bqKUXmplcSLdxuOexe6y9e5gJA26u7cYCGGW7LooRQCv0TiJZXnCPV8ZNmp9j2RoVCls6dojDcYYrIzf"
          priority={true}
        />

        <HabitatLink
          href="/habitats/forest"
          title="Forest"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDJfDwnjxtxlb3LMZGsA5lx5ca59J4phTWdypzQuufXF4goX3uNATaAnwN30JHxtnJtGl3YQ5lK11rpeqjUfMMT0VTahE7mVb7bJr7duHbbHasyu2cCBKMAy4H0IdLX9Fo3BNAqih2z2O2qiNHFcnE_ybuLLIBODjz-21Zri3lm-R7FlABFQ-zsAQ9Jpv5LN1Xw1OUH0EZ6A2gh5KGFLYI_bBAmtx52wncK_qXKv6GUXryJCCs6AGJYSjRxXKJoVUWAVrKRDSUD8qWC"
          priority={true}
        />

        <HabitatLink
          href="/habitats/desert"
          title="Arid"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAogrWseSMkAr8N9CURoBnn8k8Xdz4WxCUyJ0p9dvzuwDIe5SpFJp9dHxNSSix2VsUlNF4h3K8DxcATpYjiS91iG5Fy3DDGOYEKdZG7Dl0rTbwAiv-qRXMrmD2OBaL-QjSpvMuPksuuCBlodhsmNQxCLINiZQ5snDxYeo6PrY224wdch3iqKhccszU2vvJx_2yNtaHhRD-npafZkdn112eahOCbCo4zYxFpy8gboah60zOWgv5MsQrddiW8_5PyJV5Qj3ccCY7TwyCU"
          priority={true}
        />

        <HabitatLink
          href="/habitats/ocean"
          title="Ocean"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBtikfaylVWkpMJG2TCSL7fdCamoM-0r4EokYIhXmLcG_nOkyiRi0oMunV8PFSSQVocHo69duarlNUR8BtOmv0DUQgAdDRdwh37wUYwI4Bx34bXBg_RKUmeP17s2LHA3O_S_RRLrUL_6tZFmwhP3MOlOkAYv8PQBGH9GNf4Y7LHPoUCO58BoREJsuiIsDhfWp-65HCqTblXXfmYpoK2sXqmveEG-GuFD_1JQiMg-bvqP4vycyuEQhOF--ctr8H7qVIFD3iU7W377yFe"
          priority={true}
        />
      </div>
    </section>
  );
}

interface HabitatLinkProps {
  href: string;
  title: string;
  imageSrc: string;
  priority?: boolean;
}

/**
 * Sub-component for individual habitat links.
 * DRY principle: extracted repeating JSX.
 */
function HabitatLink({ href, title, imageSrc, priority }: HabitatLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative h-48 rounded-[1.5rem] overflow-hidden group cursor-pointer block"
      )}
    >
      <ImageWithSkeleton
        alt={`${title} Habitat`}
        src={imageSrc}
        priority={priority}
        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        containerClassName="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
        <p className="text-white font-bold text-lg font-headline">{title}</p>
      </div>
    </Link>
  );
}
