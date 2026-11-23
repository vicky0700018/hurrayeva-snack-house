import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { PageHero } from "@/components/site/SectionHeading";
import { SmartImage } from "@/components/SmartImage";
import { CheckIcon } from "@/components/icons";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | HURRAYECA FOOD SOLUTIONS LLP" },
      { name: "description", content: "Learn about HURRAYECA FOOD SOLUTIONS LLP – our story, mission and commitment to delicious Indian namkeen." },
      { property: "og:title", content: "About HURRAYECA" },
      { property: "og:description", content: "Our story, mission and vision." },
    ],
  }),
  component: About,
});

function About() {
  const a = useStore().data.content.about;
  return (
    <>
      <PageHero crumb="About Us" title={a.heroTitle} subtitle={a.intro} />
      <section className="container-x grid items-center gap-10 py-14 lg:grid-cols-2">
        <SmartImage src="img:about-store" alt="Namkeen jars on a shelf" className="aspect-square w-full rounded-3xl object-cover shadow-lift" />
        <div className="space-y-5">
          <p className="eyebrow">Our story</p>
          <h2 className="text-3xl font-semibold">How HURRAYECA began</h2>
          <p className="leading-relaxed text-muted-foreground">{a.story}</p>
          <h3 className="text-xl font-semibold">Business overview</h3>
          <p className="leading-relaxed text-muted-foreground">{a.overview}</p>
        </div>
      </section>
      <section className="bg-muted/60 py-14">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {[["Quality commitment", a.quality], ["Our mission", a.mission], ["Our vision", a.vision]].map(([t, d]) => (
            <div key={t} className="card-surface p-6"><h3 className="text-xl font-semibold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="container-x grid items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Why HURRAYECA</p>
          <h2 className="mt-3 text-3xl font-semibold">Why customers choose us</h2>
          <ul className="mt-6 space-y-3">
            {a.whyChoose.map((w) => <li key={w} className="flex gap-2 font-semibold"><CheckIcon className="text-success" /> {w}</li>)}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SmartImage src="img:about-spices" alt="Spices" className="aspect-square rounded-3xl object-cover" />
          <SmartImage src="img:about-packing" alt="Packing namkeen" className="aspect-square rounded-3xl object-cover" />
        </div>
      </section>
    </>
  );
}
