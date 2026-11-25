import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";

const stories = [
  {
    title: "A New Borehole Brings Clean Water to Kpando",
    excerpt:
      "Over 300 families now have safe drinking water after GiveArm donors funded a solar-powered borehole and hygiene training.",
    image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=900&q=80",
    date: "Apr 12, 2026",
    category: "Clean Water",
  },
  {
    title: "Digital Lab Opens Doors for Young Learners",
    excerpt:
      "Students in a rural school received laptops, internet access, and STEM mentorship through our Back-to-School initiative.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
    date: "Mar 28, 2026",
    category: "Education",
  },
  {
    title: "Mobile Clinic Reaches Mothers in Remote Communities",
    excerpt:
      "Our maternal health outreach delivered essential screenings, supplies, and care to mothers across three rural districts.",
    image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=900&q=80",
    date: "Feb 15, 2026",
    category: "Healthcare",
  },
];

export default function StoriesSection() {
  return (
    <section id="stories" className="bg-brand-mint py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-brand">IMPACT STORIES</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Stories of impact
          </h2>
          <p className="mt-4 text-base text-slate-600">
            See how generosity turns into real outcomes for communities across Ghana.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story) => (
            <article key={story.title} className="overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative h-60">
                <Image src={story.image} alt={story.title} fill className="object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">
                  {story.category}
                </span>
              </div>
              <div className="p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
                  <CalendarDays className="h-3.5 w-3.5 text-brand" />
                  {story.date}
                </div>
                <h3 className="mt-4 text-xl font-bold leading-snug text-slate-900">{story.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{story.excerpt}</p>
                <a href="#contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover">
                  Read Story <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
