import React from "react";
import {
	SiCplusplus,
	SiPython,
	SiTypescript,
	SiJavascript,
	SiNodedotjs,
	SiExpress,
	SiMongodb,
	SiMysql,
	SiPostgresql,
	SiReact,
	SiNextdotjs,
	SiRedux,
	SiTailwindcss,
	SiApachespark,
	SiDatabricks,
	SiGit,
	SiGithub,
	SiGitlab,
	SiPostman,
	SiDocker,
	SiHtml5,
	SiCss,
	SiFastapi,
	SiCelery,
	SiSupabase,
	SiRedis,
	SiSqlite,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { TbSql, TbApi, TbGitFork, TbBrandAzure } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

export const skillIconMap: Record<string, React.ReactNode> = {
	// Languages
	"C++": <SiCplusplus />,
	Python: <SiPython />,
	TypeScript: <SiTypescript />,
	JavaScript: <SiJavascript />,
	SQL: <TbSql />,
	HTML: <SiHtml5 />,
	HTML5: <SiHtml5 />,
	CSS: <SiCss />,
	CSS3: <SiCss />,

	// Backend & APIs
	"Node.js": <SiNodedotjs />,
	NodeJS: <SiNodedotjs />,
	"Express.js": <SiExpress />,
	Express: <SiExpress />,
	"REST APIs": <TbApi />,
	"REST API": <TbApi />,
	REST: <TbApi />,
	MongoDB: <SiMongodb />,
	MySQL: <SiMysql />,
	PostgreSQL: <SiPostgresql />,
	FastAPI: <SiFastapi />,
	Celery: <SiCelery />,
	Supabase: <SiSupabase />,
	Redis: <SiRedis />,
	SQLite: <SiSqlite />,

	// Frontend
	"React.js": <SiReact />,
	React: <SiReact />,
	"Next.js": <SiNextdotjs />,
	NextJS: <SiNextdotjs />,
	Redux: <SiRedux />,
	"Tailwind CSS": <SiTailwindcss />,
	TailwindCSS: <SiTailwindcss />,
	Tailwind: <SiTailwindcss />,

	// Data & Cloud
	PySpark: <SiApachespark />,
	"Apache Spark": <SiApachespark />,
	Spark: <SiApachespark />,
	Databricks: <SiDatabricks />,
	"Microsoft Azure": <TbBrandAzure />,
	Azure: <TbBrandAzure />,
	AWS: <FaAws />,
	"AWS S3": <FaAws />,
	"ETL pipelines": <TbGitFork />,
	ETL: <TbGitFork />,

	// Developer Tools
	Git: <SiGit />,
	GitHub: <SiGithub />,
	GitLab: <SiGitlab />,
	"VS Code": <VscVscode />,
	VSCode: <VscVscode />,
	Postman: <SiPostman />,
	Docker: <SiDocker />,
};

export function getSkillIcon(name: string): React.ReactNode {
	return skillIconMap[name] ?? null;
}
