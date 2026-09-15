"use client";

import { motion } from "framer-motion";
import { type ReactNode, useRef, useState } from "react";

export default function MagneticWrap({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [pos, setPos] = useState({ x: 0, y: 0 });

	const handleMouse = (e: React.MouseEvent) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		setPos({
			x: (e.clientX - rect.left - rect.width / 2) * 0.35,
			y: (e.clientY - rect.top - rect.height / 2) * 0.35,
		});
	};

	const handleLeave = () => setPos({ x: 0, y: 0 });

	return (
		<motion.div
			ref={ref}
			onPointerMove={handleMouse}
			onPointerLeave={handleLeave}
			animate={{ x: pos.x, y: pos.y }}
			transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
