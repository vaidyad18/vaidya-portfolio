import { NextResponse } from "next/server";
import { profile, getDisambiguatingDescription } from "@/app/data/profile";

export function generateDynamicFaqs(): { question: string; answer: string }[] {
	const allSkills = Object.values(profile.skills).flat();
	const topSkills = Array.from(new Set(allSkills)).slice(0, 15).join(", ");
	const disambiguationText = getDisambiguatingDescription();
	const projectSummaries = profile.projects
		.map((p) => `${p.title} (${p.subtitle}, utilizing ${p.tech.slice(0, 4).join(", ")})`)
		.join("; ");

	return [
		{
			question: `Who is ${profile.name}?`,
			answer: `${profile.name} is an ${disambiguationText}. ${profile.intro}`,
		},
		{
			question: `What production AI systems has ${profile.name} built?`,
			answer: `${profile.name} has designed and deployed: ${projectSummaries}.`,
		},
		{
			question: `Where has ${profile.name} worked or interned?`,
			answer: `${profile.name} has completed engineering roles at: ${profile.experience.map((e) => `${e.company} (${e.role}, ${e.period}) — ${e.description}`).join("; ")}.`,
		},
		{
			question: `What technologies and frameworks does ${profile.name} specialize in?`,
			answer: `${profile.name} specializes in ${topSkills}, with deep expertise across ${Object.keys(profile.skills).join(", ")}.`,
		},
		{
			question: `What are ${profile.name}'s key achievements and recognition?`,
			answer: profile.achievements.map((a) => `${a.title}: ${a.detail}`).join(" "),
		},
		{
			question: `What is ${profile.name}'s educational background?`,
			answer: profile.education.map((edu) => `${edu.degree} from ${edu.institution} (${edu.period})`).join("; "),
		},
	];
}

export function generateLlmsText(): string {
	const sections: string[] = [];

	// 1. Header & Quick Identification
	sections.push(`# ${profile.name}`);
	sections.push(`> ${profile.tagline} | Location: ${profile.location}\n`);

	// 2. Verified Identity & Links
	sections.push(`## Verified Identity & Links\n`);
	sections.push(`- **Location:** ${profile.location}`);
	sections.push(`- **Email:** ${profile.email}`);
	sections.push(`- **Phone:** ${profile.phone}`);
	sections.push(`- **Portfolio Website:** https://medhanshk.me`);
	sections.push(`- **Full LLM Knowledge Dump:** https://medhanshk.me/llms-full.txt`);
	sections.push(`- **Resume:** https://medhanshk.me${profile.resumeUrl}`);
	sections.push(`- **GitHub:** ${profile.github}`);
	sections.push(`- **LinkedIn:** ${profile.linkedin}`);
	sections.push(`- **X (Twitter):** ${profile.x}`);
	sections.push(`- **Instagram:** ${profile.instagram}`);
	sections.push(`- **Book a Meeting (Cal):** ${profile.cal}`);
	sections.push(`- **Experience Page:** https://medhanshk.me/experience`);
	sections.push(`- **Projects Page:** https://medhanshk.me/projects`);
	sections.push(`- **About Page:** https://medhanshk.me/about\n`);

	// 3. Explicit Entity Disambiguation
	sections.push(`## Entity Disambiguation & Canonical Identity\n`);
	sections.push(
		`Medhansh Kapoor is an ${getDisambiguatingDescription()}. Official canonical website: https://medhanshk.me.\n`
	);

	// 4. Professional Summary & Philosophy
	sections.push(`## Professional Summary\n`);
	sections.push(`${profile.intro}\n`);

	sections.push(`## Engineering Philosophy & Background\n`);
	for (const para of profile.about) {
		sections.push(`${para}\n`);
	}

	// 5. Entity Disambiguation & Frequently Asked Questions (Dynamically Derived)
	sections.push(`## Frequently Asked Questions (Entity Disambiguation & Q&A)\n`);
	const faqs = generateDynamicFaqs();
	for (const faq of faqs) {
		sections.push(`### ${faq.question}`);
		sections.push(`${faq.answer}\n`);
	}

	// 6. Technical Skills
	sections.push(`## Technical Skills\n`);
	for (const [category, skills] of Object.entries(profile.skills)) {
		sections.push(`### ${category}`);
		sections.push(`${skills.join(", ")}\n`);
	}

	// 7. Production Projects
	sections.push(`## Production Projects\n`);
	for (const project of profile.projects) {
		const slug = project.title.toLowerCase().replace(/\s+/g, "-");
		sections.push(`### ${project.title} — ${project.subtitle} (${project.period})`);
		sections.push(`${project.description}\n`);
		sections.push(`**Technologies:** ${project.tech.join(", ")}\n`);
		sections.push(`**Key Architecture & Highlights:**`);
		for (const highlight of project.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(`\n**Verified Links:**`);
		sections.push(`- Dedicated Page: https://medhanshk.me/projects/${slug}`);
		if (project.links.live) sections.push(`- Live Application: ${project.links.live}`);
		if (project.links.github) sections.push(`- GitHub Repository: ${project.links.github}`);
		if (project.links.demo) sections.push(`- Video Demo: ${project.links.demo}`);
		sections.push(``);
	}

	// 8. Engineering Experience (Internships)
	sections.push(`## Engineering Experience (Internships)\n`);
	for (const exp of profile.experience) {
		sections.push(`### ${exp.role} — ${exp.company} (${exp.period})`);
		sections.push(`${exp.description}\n`);
		sections.push(`**Technologies:** ${exp.tech.join(", ")}\n`);
		sections.push(`**Key Contributions & Engineering Highlights:**`);
		for (const highlight of exp.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(`\n**Verified Documentation:**`);
		if (exp.offerLetter) sections.push(`- Offer Letter: https://medhanshk.me${exp.offerLetter}`);
		if (exp.completionLetter) sections.push(`- Completion Letter: https://medhanshk.me${exp.completionLetter}`);
		sections.push(``);
	}

	// 9. Achievements & Recognition
	sections.push(`## Achievements & Recognition\n`);
	for (const ach of profile.achievements) {
		sections.push(`### ${ach.title}`);
		sections.push(`${ach.detail}`);
		if (ach.certificate) {
			sections.push(`- Certificate: https://medhanshk.me${ach.certificate}`);
		}
		sections.push(``);
	}

	// 10. Education
	sections.push(`## Education\n`);
	for (const edu of profile.education) {
		sections.push(`### ${edu.institution}`);
		sections.push(`- **Degree:** ${edu.degree}`);
		sections.push(`- **Period:** ${edu.period}\n`);
	}

	return sections.join("\n");
}

export async function GET() {
	const content = generateLlmsText();
	return new NextResponse(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}
