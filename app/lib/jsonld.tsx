import {
	profile,
	staticRoutes,
	getProjectSlug,
	getDisambiguatingDescription,
	type Project,
} from "@/app/data/profile";

export const SITE_URL = "https://medhanshk.me";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const NAVIGATION_ID = `${SITE_URL}/#navigation`;
export const ISO_DATE = "2026-08-28T00:00:00+00:00";

export interface BreadcrumbItem {
	name: string;
	path: string;
}

/**
 * Generates Schema.org BreadcrumbList for hierarchical Google SERP navigation.
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[] = []) {
	return {
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: SITE_URL,
			},
			...items.map((crumb, idx) => ({
				"@type": "ListItem",
				position: idx + 2,
				name: crumb.name,
				item: crumb.path.startsWith("http")
					? crumb.path
					: `${SITE_URL}${crumb.path}`,
			})),
		],
	};
}

/**
 * Generates Schema.org SiteNavigationElement list for Google Sitelinks.
 * Dynamically derived from profile.ts staticRoutes and profile.projects.
 */
export function getSiteNavigationSchema() {
	const mainNavElements = staticRoutes.map((route, index) => ({
		"@type": "SiteNavigationElement",
		position: index + 1,
		name: route.name,
		description: route.description,
		url: route.path.startsWith("http")
			? route.path
			: `${SITE_URL}${route.path}`,
	}));

	const projectNavElements = profile.projects.map((proj, index) => {
		const slug = getProjectSlug(proj.title);
		return {
			"@type": "SiteNavigationElement",
			position: mainNavElements.length + index + 1,
			name: proj.title,
			description: proj.description,
			url: `${SITE_URL}/projects/${slug}`,
		};
	});

	return {
		"@type": "ItemList",
		"@id": NAVIGATION_ID,
		name: "Site Navigation",
		description:
			"Primary site navigation and sitelinks for Medhansh Kapoor's portfolio.",
		itemListElement: [...mainNavElements, ...projectNavElements],
	};
}

/**
 * Generates the canonical Schema.org Person entity for Medhansh Kapoor.
 * Unifies all identities, skills, affiliations, and verified social profiles.
 */
export function getPersonSchema() {
	const allSkills = Array.from(
		new Set(Object.values(profile.skills).flat())
	);

	return {
		"@type": "Person",
		"@id": PERSON_ID,
		name: profile.name,
		alternateName: ["Medhansh", "Medhansh-741"],
		url: SITE_URL,
		jobTitle: "AI/ML Engineer & Full-Stack Developer",
		disambiguatingDescription: getDisambiguatingDescription(),
		description: profile.intro,
		email: `mailto:${profile.email}`,
		telephone: profile.phone,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Jaipur",
			addressCountry: "IN",
		},
		sameAs: [
			profile.github,
			profile.linkedin,
			profile.x,
			profile.instagram,
			profile.cal,
			"https://www.wikidata.org/wiki/Q141155822",
		].filter(Boolean),
		nationality: {
			"@type": "Country",
			name: "India",
		},
		knowsLanguage: ["English", "Hindi"],
		alumniOf: profile.education.map((edu) => ({
			"@type": "EducationalOrganization",
			name: edu.institution,
		})),
		hasOccupation: profile.experience.map((exp) => ({
			"@type": "Role",
			roleName: exp.role,
			description: exp.description,
			startDate: exp.period.includes("May 2026") ? "2026-05-01" : undefined,
			endDate: exp.period.includes("July 2026") ? "2026-07-31" : undefined,
			worksFor: {
				"@type": "Organization",
				name: exp.company,
			},
		})),
		knowsAbout: allSkills,
	};
}

/**
 * Generates the canonical WebSite schema linking author and publisher to the Person entity.
 */
export function getWebSiteSchema() {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		url: SITE_URL,
		name: profile.name,
		description:
			"Portfolio of Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer based in Jaipur, India.",
		publisher: {
			"@id": PERSON_ID,
		},
		author: {
			"@id": PERSON_ID,
		},
	};
}

/**
 * Generates the root graph combining WebSite, Person, and SiteNavigation for global recognition.
 */
export function getRootGraphSchema() {
	return {
		"@context": "https://schema.org",
		"@graph": [
			getWebSiteSchema(),
			getPersonSchema(),
			getSiteNavigationSchema(),
		],
	};
}

/**
 * Generates ProfilePage schema linking back to the Person entity with breadcrumbs.
 */
export function getProfilePageSchema(
	path = "",
	title = "Medhansh Kapoor",
	description = profile.intro
) {
	const pageUrl = `${SITE_URL}${path}`;
	const breadcrumbs: BreadcrumbItem[] = path
		? [{ name: title.split("—")[0].trim() || "Profile", path }]
		: [];

	const graphItems: Record<string, unknown>[] = [
		{
			"@type": "ProfilePage",
			"@id": `${pageUrl}/#profilepage`,
			url: pageUrl,
			name: title,
			description,
			dateModified: ISO_DATE,
			isPartOf: {
				"@id": WEBSITE_ID,
			},
			mainEntity: {
				"@id": PERSON_ID,
			},
			speakable: {
				"@type": "SpeakableSpecification",
				cssSelector: ["h1", "p"],
			},
		},
	];

	if (breadcrumbs.length > 0) {
		graphItems.push(getBreadcrumbSchema(breadcrumbs));
	}

	return {
		"@context": "https://schema.org",
		"@graph": graphItems,
	};
}

/**
 * Generates CollectionPage + ItemList for projects with SoftwareApplication entities and BreadcrumbList.
 */
export function getProjectsCollectionSchema() {
	const pageUrl = `${SITE_URL}/projects`;
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "CollectionPage",
				"@id": `${pageUrl}/#collection`,
				url: pageUrl,
				name: "Projects — Medhansh Kapoor",
				description:
					"Explore production AI systems built by Medhansh Kapoor, including JanSamadhan (autonomous civic surveillance) and NyayaAI (multi-agent legal platform).",
				dateModified: ISO_DATE,
				isPartOf: {
					"@id": WEBSITE_ID,
				},
				mainEntity: {
					"@type": "ItemList",
					itemListElement: profile.projects.map((proj, index) => {
						const projSlug = getProjectSlug(proj.title);
						return {
							"@type": "ListItem",
							position: index + 1,
							item: {
								"@type": "SoftwareApplication",
								name: proj.title,
								description: proj.description,
								applicationCategory: "AI / Machine Learning Application",
								operatingSystem: "Web",
								url: proj.links.live,
								image: `${SITE_URL}/og/${projSlug}.png`,
								sameAs: [proj.links.github, proj.links.demo].filter(Boolean),
								author: {
									"@id": PERSON_ID,
								},
							},
						};
					}),
				},
			},
			getBreadcrumbSchema([{ name: "Projects", path: "/projects" }]),
		],
	};
}

/**
 * Generates WebPage schema for /experience linking to the canonical Person and BreadcrumbList.
 */
export function getExperiencePageSchema() {
	const pageUrl = `${SITE_URL}/experience`;
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": `${pageUrl}/#webpage`,
				url: pageUrl,
				name: "Experience — Medhansh Kapoor",
				description:
					"Professional engineering experience of Medhansh Kapoor — AI/ML roles at IndiaAI Mission (MeitY), ISSA-DRDO, and Geminid Systems.",
				dateModified: ISO_DATE,
				isPartOf: {
					"@id": WEBSITE_ID,
				},
				mainEntity: {
					"@id": PERSON_ID,
				},
			},
			getBreadcrumbSchema([{ name: "Experience", path: "/experience" }]),
		],
	};
}

/**
 * Generates ItemPage + SoftwareApplication schema for a dedicated project page (/projects/[slug]) with hierarchical BreadcrumbList.
 */
export function getSingleProjectSchema(project: Project, slug: string) {
	const pageUrl = `${SITE_URL}/projects/${slug}`;
	const ogImageUrl = `${SITE_URL}/og/${slug}.png`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "ItemPage",
				"@id": `${pageUrl}/#webpage`,
				url: pageUrl,
				name: project.title,
				description: project.description,
				dateModified: ISO_DATE,
				primaryImageOfPage: {
					"@type": "ImageObject",
					url: ogImageUrl,
					contentUrl: ogImageUrl,
					caption: `${project.title} Preview`,
				},
				isPartOf: {
					"@id": WEBSITE_ID,
				},
				mainEntity: {
					"@type": "SoftwareApplication",
					"@id": `${pageUrl}/#software`,
					name: project.title,
					description: project.description,
					applicationCategory: "AI / Machine Learning Application",
					operatingSystem: "Web",
					url: project.links.live,
					image: ogImageUrl,
					sameAs: [project.links.github, project.links.demo].filter(Boolean),
					author: {
						"@id": PERSON_ID,
					},
					offers: {
						"@type": "Offer",
						price: "0",
						priceCurrency: "USD",
					},
				},
			},
			getBreadcrumbSchema([
				{ name: "Projects", path: "/projects" },
				{ name: project.title, path: `/projects/${slug}` },
			]),
		],
	};
}

/**
 * Safe JSON-LD Server Component with XSS sanitation.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
		/>
	);
}
