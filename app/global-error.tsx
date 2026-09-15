"use client";

import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Global Layout Exception caught:", error);
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					backgroundColor: "#0f0f0f",
					color: "#f5f5f5",
					fontFamily: "sans-serif",
					margin: 0,
					padding: 0,
				}}
			>
				<div
					style={{
						minHeight: "100vh",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "2rem",
					}}
				>
					<div
						style={{
							border: "3px solid #00FF41",
							padding: "2.5rem",
							maxWidth: "500px",
							textAlign: "center",
							backgroundColor: "#1a1a1a",
						}}
					>
						<h1
							style={{
								color: "#00FF41",
								margin: "0 0 1rem 0",
								fontSize: "1.5rem",
								fontFamily: "monospace",
							}}
						>
							SYSTEM_HALT: GLOBAL_ERROR
						</h1>
						<p
							style={{
								color: "#aaaaaa",
								fontSize: "0.875rem",
								lineHeight: "1.5",
								margin: "0 0 1.5rem 0",
								fontFamily: "monospace",
							}}
						>
							{error.message ||
								"A fatal exception halted the root layout engine."}
						</p>
						<button
							onClick={() => reset()}
							style={{
								backgroundColor: "#00FF41",
								color: "#000000",
								border: "2px solid #f5f5f5",
								padding: "0.75rem 1.5rem",
								fontWeight: "bold",
								fontFamily: "monospace",
								cursor: "pointer",
							}}
						>
							RESTART ROOT ENGINE
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
