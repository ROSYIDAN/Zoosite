import Link from "next/link";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { cn } from "@/lib/utils";

/**
 * EcosystemGrid component displaying the Biome Explorer sections.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function EcosystemGrid() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
        Biome Explorer
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
        <HabitatLink
          href="/habitats#forests"
          title="Forests"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDadjWTOMfguD_tfs48aC-NRDHcb4ytEPynocRlNKVLaz3FWfVekQuBUrIHZQ9v8alT0hm7j3GyRV-SbZKZl_XYb6tXt3qd-97wVi5m1RpQUqjKe1-ltE0R7tnVWSDsD7_EpruioTn911SIs9rY9AJW-yAl7ATjlO92cfMIJb8r0cXhEfL6oBrCpi_Dtsx7TW456Ym6sCwXQQif6Ax2zKHZmNyAPSg8-axG2pq0z2-EJI6GQUXf4PI2HvsuxEtOPnol8XVwIaMzb74"
        />

        <HabitatLink
          href="/habitats#grasslands"
          title="Grasslands"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ1xb_JQMugjeQiob9reIJU-eTRqsuYiOxjunJ3gHdug7zSxbZwqPVv84vzyIvRR2CcRhuJi6MJSnI66zi2a0_45sb_yCYuuWabW1tUtnqlGBV2yAILkk_AioUfSNlI70MAOv3q37SU9e3rAeMT6x9ffnSlJv_FXHQCxJFK22zBC1H8SWIjdIkAsdAqrRUDFRETHjnFwl8l9gc2c8o199JlSZPeUE2PFW60FfL9gJlhZpQPSHnmCNQJgJmhgkpUPt9xmap0Fj4nus"
        />

        <HabitatLink
          href="/habitats#wetlands"
          title="Wetlands"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuA6BdToWbtZrZ-jAnOQhhLAqlLHT3UF2zyWo2AyQNm2XCmo3YVcb74p77xnwo0jfeWyZv2OzijlAYv0u6uhkYtZN1noIjkn9c8-uUPGluFExvOBl8EMqBS52M_rwKu-o7MPyfPX4m613PVdAWvlYV5h-XQ64X8pgGoNmBs0nnJgbP_KJlTmAZAJ_l4yPtQ382YDL32PUkNryqTFtnQ5uPnc7KivNb9rW91d5ds3NZsYPuyoxyOl097KF-_lz9DaCJcs7yEi8wY0jAc"
        />

        <HabitatLink
          href="/habitats#waters"
          title="Waters"
          imageSrc="/waters.png"
        />

        <HabitatLink
          href="/habitats#deserts-drylands"
          title="Deserts & Drylands"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBU2lhd6d63ZL5hLL2-ngN1FqzPSkVo_pK8QvwWAkaF1h3yfo_EuIUeYGil-MB4yNa2Bwdzj3MeFzBHjlcIqA84ez5U400cxfxPhmq9m9wGcVQnNrQHhh--j5YgyHwiNxCTuUhFkxZPUjMbsfL2wSG482lKSoMaQOxiyAAh2nc0-iSWl1Y5PtwpDzkitZgG3yXs8GJ5R8qSXahBJg5PsEvRcMMFGnpX4x03GVaGCRjggd5xXDdB8A0F-p-BwLp4HbclSo3u2l48o18"
        />

        <HabitatLink
          href="/habitats#polar-tundra"
          title="Polar & Tundra"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBLxP2iQKTKfBFPHJGFvREaYpyzsmd9h3MvQP4Onz_ngMNpJFZRYiYiPaFlpHc-1CmdP1vVmKDM1lygIWaXa5fYlosnYdxEJ8t0c9RhtzTPiShRr0p9v6qLZ8QdJ9_jcCRCBzo--8sHtkVDqCbQ24B81KsBTHT2k5CwTBi25SavohRI8TreMAsTytM_HS6v32gGCE2Q6DvVzXzH2_FLX9gVL16ftMQ_R45_Zy49_r2wcuTy8raOUloeWdFhjsFzRHNUhbPnrnQRkYM"
        />

        <HabitatLink
          href="/habitats#mountains-highlands"
          title="Mountains & Highlands"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC_n3ZXYb8kg2-ubo32fpKrktkMIXqOjZ2NkRjMKd03U81szS2iCYPDWMz0oAtKcym6aCb0wjP6Xh9obNhe_m8VIQG0yEk8IiaFqNrWtlaLtc2l4-FC5ibH4Dufw-YvFzzh7ArWwANlFmEJrAMUJ0d7pAtDJCAgLVxpOFq9cDiifnWiUSe3qed3OiiKP5gw2GXLGggqC_M50ew7Fb1T8IpuDLk0M6xOaUf-DlyXemz6l4UcTUvOyxsN-d3__R71zpcY17_bE8jrhMU"
        />
      </div>
    </section>
  );
}

interface HabitatLinkProps {
  href: string;
  title: string;
  imageSrc: string;
}

/**
 * Sub-component for individual habitat links.
 * DRY principle: extracted repeating JSX.
 */
function HabitatLink({ href, title, imageSrc }: HabitatLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative h-40 rounded-[1.5rem] overflow-hidden group cursor-pointer block border border-outline-variant/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]"
      )}
    >
      <ImageWithSkeleton
        alt={`${title} Biome`}
        src={imageSrc}
        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        containerClassName="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
        <p className="text-white font-bold text-sm md:text-base font-headline leading-tight">{title}</p>
      </div>
    </Link>
  );
}
