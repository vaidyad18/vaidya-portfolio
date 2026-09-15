"use client";

import { useEffect } from "react";
import { useSpring, useTrail, animated } from "@react-spring/web";

const TRAIL_LENGTH = 5;

export default function GestureTutorialOverlay() {
	// The driving physics spring: This holds the actual x/y values 
	// and broadcasts them via CustomEvent on every frame.
	const [, driverApi] = useSpring(() => ({
		x: 0,
		y: 0,
		config: { mass: 1, tension: 170, friction: 40 },
		onChange: ({ value }) => {
			// Broadcast the position exactly to the engine
			window.dispatchEvent(
				new CustomEvent("tutorial-peek", {
					detail: { mx: value.x, my: value.y, snap: value.x === 0 && value.y === 0 },
				})
			);
			
			// Command the visual trail to chase this coordinate
			trailApi.start({ x: value.x, y: value.y });
		},
	}));

	// The visual motion trail: Uses React Spring's staggered trail physics
	const [trail, trailApi] = useTrail(TRAIL_LENGTH, () => ({
		x: 0,
		y: 0,
		scale: 0,
		opacity: 0,
		config: { mass: 0.8, tension: 300, friction: 25 },
	}));

	useEffect(() => {
		let isCancelled = false;
		let observer: IntersectionObserver;

		const notifyComplete = () => {
			window.dispatchEvent(new CustomEvent("tutorial-complete"));
		};

		const runTutorial = async () => {
			const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

			// Give the user 2 seconds to look at the screen before running tutorial
			await delay(2000);

			if (isCancelled) return;

			// We derive sizing dynamically at runtime per mobile rulebook (no hardcoded px logic)
			const peekX = window.innerWidth * 0.28; 
			const peekY = window.innerHeight * 0.15;

			// Phase 1: Fade in the touch indicator
			trailApi.start({ opacity: 0.7, scale: 1 });
			await delay(500);

			if (isCancelled) return;
			// Phase 2: Swipe Right (Horizontal Peek)
			driverApi.start({ x: peekX, y: 0, config: { tension: 170, friction: 40 } });
			await delay(1200);

			if (isCancelled) return;
			// Phase 3: Snap Back
			driverApi.start({ x: 0, y: 0, config: { tension: 400, friction: 30 } });
			await delay(800);

			if (isCancelled) return;
			// Phase 4: Swipe Down (Vertical Peep)
			driverApi.start({ x: 0, y: peekY, config: { tension: 170, friction: 40 } });
			await delay(1200);

			if (isCancelled) return;
			// Phase 5: Snap Back
			driverApi.start({ x: 0, y: 0, config: { tension: 400, friction: 30 } });
			await delay(600);
			
			// Phase 6: Fade out and complete single cycle
			trailApi.start({ opacity: 0, scale: 0 });
			await delay(400);

			if (!isCancelled) {
				notifyComplete();
			}
		};

		const cancelTutorial = () => {
			isCancelled = true;
			// Smoothly glide driver to (0,0) with natural physics
			driverApi.start({ x: 0, y: 0, config: { tension: 350, friction: 35 } });
			// Smoothly fade out the visual trail
			trailApi.start({ opacity: 0, scale: 0, config: { tension: 250, friction: 30 } });
			// Ensure engine is commanded to smoothly spring back to rest
			window.dispatchEvent(
				new CustomEvent("tutorial-peek", {
					detail: { mx: 0, my: 0, snap: true, cancel: true },
				})
			);
			notifyComplete();
		};

		const handleInteraction = (e: Event) => {
			const target = e.target as HTMLElement;
			if (target.closest(".card-stack-engine")) {
				cancelTutorial();
				// Once cancelled, we no longer need the listeners
				window.removeEventListener("touchstart", handleInteraction);
				window.removeEventListener("mousedown", handleInteraction);
				window.removeEventListener("pointerdown", handleInteraction);
			}
		};

		const overlayElement = document.getElementById("gesture-tutorial-overlay");
		const handleTutorialCancel = () => {
			cancelTutorial();
		};

		window.addEventListener("tutorial-cancel", handleTutorialCancel, { once: true });
		window.addEventListener("keydown", handleTutorialCancel, { once: true, passive: true });

		if (overlayElement) {
			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && !isCancelled) {
						runTutorial();
						// Only listen for kills once it's on screen
						window.addEventListener("touchstart", handleInteraction, { passive: true });
						window.addEventListener("mousedown", handleInteraction, { passive: true });
						window.addEventListener("pointerdown", handleInteraction, { passive: true });
						observer.disconnect(); // Only trigger once
					}
				},
				{ threshold: 0.5 },
			);
			observer.observe(overlayElement);
		}

		return () => {
			isCancelled = true;
			window.removeEventListener("tutorial-cancel", handleTutorialCancel);
			window.removeEventListener("keydown", handleTutorialCancel);
			if (observer) observer.disconnect();
			window.removeEventListener("touchstart", handleInteraction);
			window.removeEventListener("mousedown", handleInteraction);
			window.removeEventListener("pointerdown", handleInteraction);
		};
	}, [driverApi, trailApi]);

	return (
		<div id="gesture-tutorial-overlay" className="absolute inset-0 pointer-events-none z-[100] overflow-visible">
			{trail.map((style, i) => (
				<animated.div
					key={i}
					className="absolute top-[45%] left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full pointer-events-none bg-accent"
					style={{
						...style,
						opacity: style.opacity.to((o) => o * (1 - i / TRAIL_LENGTH)),
						scale: style.scale.to((s) => s * (1 - i * 0.15)),
						zIndex: 100 - i,
						boxShadow: i === 0 
							? "0 0 25px 8px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(255,255,255,0.8)" 
							: "none",
					}}
				/>
			))}
		</div>
	);
}
