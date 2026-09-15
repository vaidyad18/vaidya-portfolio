"use client";

import { profile } from "@/app/data/profile";
import {
	SiC,
	SiCelery,
	SiCplusplus,
	SiDocker,
	SiFastapi,
	SiGit,
	SiGooglecloud,
	SiJavascript,
	SiLangchain,
	SiNeo4J,
	SiNextdotjs,
	SiNodedotjs,
	SiOnnx,
	SiOpencv,
	SiOpenlayers,
	SiPodman,
	SiPostgresql,
	SiPydantic,
	SiPython,
	SiPytorch,
	SiQdrant,
	SiReact,
	SiRedhat,
	SiRedis,
	SiSqlite,
	SiSupabase,
	SiTypescript,
	SiUbuntu,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import {
	TbBrain,
	TbMapPinCode,
	TbScan,
	TbServer2,
	TbSql,
	TbTransform,
	TbWorldLatitude,
	TbWorldPin,
} from "react-icons/tb";

const skillIconMap: Record<string, React.ReactNode> = {
	Python: <SiPython />,
	TypeScript: <SiTypescript />,
	JavaScript: <SiJavascript />,
	SQL: <TbSql />,
	C: <SiC />,
	"C++": <SiCplusplus />,
	FastAPI: <SiFastapi />,
	"Next.js": <SiNextdotjs />,
	"Node.js": <SiNodedotjs />,
	React: <SiReact />,
	Celery: <SiCelery />,
	Pydantic: <SiPydantic />,
	Supabase: <SiSupabase />,
	Git: <SiGit />,
	PyTorch: <SiPytorch />,
	LangGraph: <SiLangchain />,
	LangChain: <SiLangchain />,
	LlamaIndex: <TbBrain />,
	YOLOv8: <TbScan />,
	ONNX: <SiOnnx />,
	OpenCV: <SiOpencv />,
	"Sentence Transformers": <TbTransform />,
	PostgreSQL: <SiPostgresql />,
	PostGIS: <TbMapPinCode />,
	Qdrant: <SiQdrant />,
	Neo4j: <SiNeo4J />,
	Redis: <SiRedis />,
	SQLite: <SiSqlite />,
	GDAL: <TbWorldPin />,
	GeoServer: <TbWorldLatitude />,
	"Martin Tile Server": <TbServer2 />,
	OpenLayers: <SiOpenlayers />,
	"AWS S3": <FaAws />,
	GCP: <SiGooglecloud />,
	Docker: <SiDocker />,
	Podman: <SiPodman />,
	RHEL: <SiRedhat />,
	Ubuntu: <SiUbuntu />,
};

const allSkills = Object.values(profile.skills)
	.flat()
	.map((name) => ({
		name,
		icon: skillIconMap[name] ?? null,
	}));

export default function SkillStrip() {
	const duplicated = [...allSkills, ...allSkills];

	return (
		<div className="w-full overflow-hidden border-y-[3px] border-border bg-muted py-3">
			<div className="flex marquee gap-6 items-center">
				{duplicated.map((skill, i) => (
					<div
						key={`${skill.name}-${i}`}
						className="flex items-center gap-2 px-4 py-2 bg-background border-[2px] border-border shadow-sm whitespace-nowrap"
					>
						<span className="text-foreground text-lg" aria-hidden="true">
							{skill.icon}
						</span>
						<span className="text-xs font-bold text-foreground uppercase tracking-wider">
							{skill.name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
