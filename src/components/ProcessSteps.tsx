import { BarChart3, CreditCard, HandHeart, Search } from "lucide-react";

const steps = [
  {
    title: "Choose a Cause",
    description: "Select a verified community initiative that speaks to your heart.",
    icon: Search,
  },
  {
    title: "Donate Easily",
    description: "Give securely via Mobile Money or Card in just a few clicks.",
    icon: CreditCard,
  },
  {
    title: "Direct Field Action",
    description: "Funds go straight to local project execution and trusted partners.",
    icon: HandHeart,
  },
  {
    title: "Receive Impact Updates",
    description: "Get photo and milestone reports showing the change you made.",
    icon: BarChart3,
  },
];

export default function ProcessSteps() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-brand">HOW IT WORKS</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            How GiveArm works
          </h2>
          <p className="mt-4 text-base text-slate-600">
            A simple, transparent journey from your donation to real community impact.
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-12 hidden border-t-2 border-dashed border-brand/30 xl:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-soft text-brand shadow-card">
                  <Icon className="h-10 w-10" />
                </div>
                <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
