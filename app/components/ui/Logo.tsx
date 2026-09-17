import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	className?: string;
}

export default function Logo({ className, alt = "Logo", ...props }: LogoProps) {
	return (
		<img
			src="/logo.png"
			alt={alt}
			className={`object-contain ${className || ""}`}
			{...props}
		/>
	);
}
