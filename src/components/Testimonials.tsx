import { Quote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "GiveArm made it so easy to support a cause I care about. I received photo updates from the borehole project and could see exactly where my donation went.",
    name: "Ama Serwaa",
    role: "Monthly Donor, Accra",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "Our community clinic now has essential equipment because of GiveArm donors. The transparency and care they show to communities is truly inspiring.",
    name: "Kwame Asante",
    role: "Community Leader, Ashanti Region",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=200&q=80",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-brand-mint py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand">TESTIMONIALS</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
              What donors &amp; communities say
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
              Real stories from the people who give and the communities whose lives are changed.
            </p>
          </div>
          <div className="rounded-2xl bg-brand p-8 text-white shadow-soft">
            <p className="text-4xl font-extrabold">4.9/5</p>
            <p className="mt-2 text-sm text-brand-soft">Average donor trust rating</p>
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-white text-white" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl bg-white p-8 shadow-card">
              <Quote className="h-10 w-10 text-brand/25" />
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand text-brand" />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-slate-600">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
                  <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
