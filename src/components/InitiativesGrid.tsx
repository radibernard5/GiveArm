import { ArrowRight, Droplets, GraduationCap, Stethoscope } from "lucide-react";
import Image from "next/image";

const initiatives = [
	{
		title: "Clean Water & Boreholes",
		description:
			"Providing safe, sustainable drinking water to rural communities through solar-powered boreholes.",
		image:
			"https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?auto=format&fit=crop&w=500&q=80",
		icon: Droplets,
	},
	{
		title: "Community Healthcare Access",
		description:
			"Mobile clinics, maternal care, and essential medical supplies reaching families where they are.",
		image:
			"https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80",
		icon: Stethoscope,
	},
	{
		title: "STEM & School Support",
		description:
			"Scholarships, digital labs, and school supplies empowering students for a brighter future.",
		image:
			"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80",
		icon: GraduationCap,
	},
];

export default function InitiativesGrid() {
	return (
		<section className="bg-brand-mint py-20 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl text-center">
					<p className="text-sm font-semibold tracking-[0.2em] text-brand">
						OUR INITIATIVES
					</p>
					<h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
						Our comprehensive services
					</h2>
					<p className="mt-4 text-base leading-relaxed text-slate-600">
						We deliver practical, community-led programs that create measurable and
						lasting impact.
					</p>
				</div>

				<div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
					{initiatives.map((item) => {
						const Icon = item.icon;
						return (
							<article
								key={item.title}
								className="group rounded-2xl bg-white p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
									<Icon className="h-6 w-6" />
								</div>
								<h3 className="mt-5 text-xl font-bold text-slate-900">
									{item.title}
								</h3>
								<p className="mt-3 text-sm leading-relaxed text-slate-600">
									{item.description}
								</p>
								<div className="relative mx-auto mt-8 h-44 w-44 overflow-hidden rounded-full border-4 border-brand-soft">
									<Image
										src={item.image}
										alt={item.title}
										fill
										className="object-cover transition duration-500 group-hover:scale-105"
									/>
								</div>
								<a
									href="#causes"
									className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-slate-900 transition hover:text-brand"
								>
									Read More
									<span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
										<ArrowRight className="h-4 w-4" />
									</span>
								</a>
							</article>
						);
					})}
				</div>

				<p className="mt-12 text-center text-sm text-slate-600 sm:text-base">
					Want to partner with us on a community project?{" "}
					<a
						href="#contact"
						className="font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-hover"
					>
						Contact us today 0543314054
					</a>
				</p>
			</div>
		</section>
	);
}
