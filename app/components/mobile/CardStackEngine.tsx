"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSpring, useSprings, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import type { Project } from "@/app/data/profile";
import { CardDeckContext } from "./CardDeckVideo";
import GestureTutorialOverlay from "./GestureTutorialOverlay";
import MobileProjectCard from "./MobileProjectCard";
import dynamic from "next/dynamic";

const MobileProjectModal = dynamic(() => import("./MobileProjectModal"), { ssr: false });

interface CardStackEngineProps {
	projects?: Project[];
	projectCards?: React.ReactNode[];
	experienceCards: React.ReactNode[];
}

const ENGINE_SHAPE_CLASSES = "w-11/12 max-w-sm mx-auto aspect-[5/7]";
const NUM_PHYSICAL_CARDS = 5;

// Pre-calculate static visual rotations for the 5 depth slots to prevent hydration jitter.
const STATIC_ROTATIONS = [0, 2, 1, 0, 0];

export default function CardStackEngine({
	projects,
	projectCards,
	experienceCards,
}: CardStackEngineProps) {
	const [activeProject, setActiveProject] = useState<Project | null>(null);
	const [mounted, setMounted] = useState(false);
	const prevProjectRef = useRef<Project | null>(null);
	const isInitialMount = useRef(true);
	const isNavigatingAway = useRef(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Safely sync activeProject state with browser URL History API
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			prevProjectRef.current = activeProject;
			return;
		}

		if (activeProject) {
			isNavigatingAway.current = false;
			const targetUrl = `/projects/${activeProject.title.toLowerCase().replace(/\s+/g, "-")}`;
			if (window.location.pathname !== targetUrl) {
				window.history.pushState({ modal: activeProject.title }, "", targetUrl);
			}
		} else if (prevProjectRef.current && !isNavigatingAway.current) {
			// Only push "/" if a previously open modal in this session was just closed
			if (window.location.pathname.startsWith("/projects/")) {
				window.history.pushState({}, "", "/");
			}
		}

		prevProjectRef.current = activeProject;
	}, [activeProject]);

	// Listen to browser back/forward buttons once on mount
	useEffect(() => {
		const handlePopState = () => {
			setActiveProject(null);
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	const handleOpenDemo = useCallback((p: Project) => {
		setActiveProject(p);
	}, []);

	const resolvedProjectCards = useMemo(() => {
		if (!projects) return projectCards || [];
		return projects.map((proj) => (
			<MobileProjectCard
				key={proj.title}
				project={proj}
				onOpenDemo={handleOpenDemo}
			/>
		));
	}, [projects, projectCards, handleOpenDemo]);

	const DECKS = useMemo(
		() => [
			{ id: "projects" as const, cards: resolvedProjectCards },
			{ id: "experience" as const, cards: experienceCards },
		],
		[resolvedProjectCards, experienceCards],
	);
	const [activeDeckIndex, setActiveDeckIndex] = useState(0);

	
	const activeDeckType = DECKS[activeDeckIndex].id;
	const activeCards = DECKS[activeDeckIndex].cards;
	
	const inactiveDeckIndex = 1 - activeDeckIndex; // Strictly for 2 decks (peep effect)
	const inactiveDeckType = DECKS[inactiveDeckIndex].id;
	const inactiveCards = DECKS[inactiveDeckIndex].cards;

	type DeckCursor = { offset: number; direction: "next" | "prev" };
	const [cursors, setCursors] = useState<Record<"projects" | "experience", DeckCursor>>({
		projects: { offset: 0, direction: "next" },
		experience: { offset: 0, direction: "next" },
	});
	const { offset, direction: dragDirection } = cursors[activeDeckType];
	const inactiveCursor = cursors[inactiveDeckType];

	const patchActiveCursor = (fn: (c: DeckCursor) => DeckCursor) =>
		setCursors(prev => ({ ...prev, [activeDeckType]: fn(prev[activeDeckType]) }));

	// Tracks the physical DOM nodes mapped to their current depth slot (0 is front, 4 is back)
	const orderRef = useRef([0, 1, 2, 3, 4]);

	// Lock gesture intent so dragging diagonally doesn't jitter
	const intentRef = useRef<"horizontal" | "vertical" | null>(null);



	// Resolves the exact data to render for a given virtual index, wrapping around the array infinitely
	const getCardData = (dataIndex: number, deck: React.ReactNode[]) => {
		if (!deck || deck.length === 0) return null;
		const wrappedIndex = ((dataIndex % deck.length) + deck.length) % deck.length;
		return deck[wrappedIndex];
	};

	const [bgSpring, bgApi] = useSpring(() => ({
		scale: 1,
		opacity: 1,
		config: { friction: 50, tension: 500 }
	}));

	const CFG_FAN = { mass: 1, tension: 400, friction: 30 };
	const isFannedRef = useRef(false);

	const togglePokerFan = () => {
		window.dispatchEvent(new CustomEvent("tutorial-cancel"));
		isFannedRef.current = !isFannedRef.current;
		
		const visibleCount = Math.min(NUM_PHYSICAL_CARDS, activeCards.length);

		// Dynamic safe-angle: compute max spread that keeps every card within the viewport
		const vw = window.innerWidth;
		const cardW = Math.min(vw * (11 / 12), 384);       // matches w-11/12 max-w-sm
		const cardH = cardW * (7 / 5);                      // matches aspect-[5/7]
		const fanScale = 0.5;
		const halfW = cardW / 2;
		// D = distance from card center to pivot. Pivot at card bottom edge.
		const D = cardH * 0.5;  // card center to bottom = half the height
		const safeMargin = 16;
		const availableX = (vw / 2) - safeMargin;
		// Constraint: D * sin(maxAngle) + fanScale * halfW <= availableX
		const sinLimit = Math.max(0, Math.min(1, (availableX - fanScale * halfW) / D));
		const maxSafeAngle = Math.asin(sinLimit) * (180 / Math.PI);
		const SPREAD_ANGLE = Math.min(15, (2 * maxSafeAngle) / (visibleCount - 1));
		const maxAngle = ((visibleCount - 1) * SPREAD_ANGLE) / 2;

		if (isFannedRef.current) {
			bgApi.start({ scale: 0.5, opacity: 0, config: CFG_FAN });
		} else {
			bgApi.start({ scale: 1, opacity: 1, config: CFG_FAN });
		}

		api.start(i => {
			const currentPos = orderRef.current.indexOf(i);
			
			if (isFannedRef.current) {
				if (currentPos >= visibleCount) {
					return { opacity: 0, scale: 0, immediate: true };
				}

				const angle = maxAngle - (currentPos * SPREAD_ANGLE);
				const rad = angle * (Math.PI / 180);

				// Arc translation: rotate card center around virtual pivot at (0, D) below
				const arcX = D * Math.sin(rad);
				const arcY = D * (1 - Math.cos(rad));

				return {
					x: arcX, y: arcY, rotZ: angle, scale: fanScale, opacity: 1,
					config: CFG_FAN
				};
			} else {
				return {
					x: 0, y: 0, rotZ: STATIC_ROTATIONS[currentPos], scale: 1, opacity: 1,
					config: { friction: 50, tension: 500 }
				};
			}
		});
	};

	const togglePokerFanRef = useRef(togglePokerFan);
	useEffect(() => {
		togglePokerFanRef.current = togglePokerFan;
	});

	useEffect(() => {
		const SHAKE_HIGH = 15;  // m/s² that starts a shake
		const REST_LOW = 5;     // m/s² below which the device is "resting"
		const REST_MS = 400;    // rest time before the next shake counts
		
		let shaking = false;
		let restSince = 0;

		const handleMotion = (e: DeviceMotionEvent) => {
			const { x, y, z } = e.acceleration || {};
			if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') return;
			const magnitude = Math.sqrt(x * x + y * y + z * z);
			const now = Date.now();

			if (!shaking) {
				if (magnitude > SHAKE_HIGH) {
					shaking = true;
					togglePokerFanRef.current();
				}
			} else if (magnitude < REST_LOW) {
				if (restSince === 0) {
					restSince = now;
				} else if (now - restSince >= REST_MS) {
					shaking = false;
					restSince = 0;
				}
			} else {
				restSince = 0;
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === 's') togglePokerFanRef.current();
		};

		window.addEventListener('keydown', handleKeyDown);

		let isUnmounted = false;
		const attachMotion = () => {
			if (!isUnmounted) {
				window.addEventListener('devicemotion', handleMotion, { passive: true });
			}
		};

		let timerId: ReturnType<typeof setTimeout> | undefined;
		let idleId: number | undefined;

		if (typeof window !== "undefined" && "requestIdleCallback" in window) {
			idleId = (window as Window & { requestIdleCallback: (cb: () => void, opt?: { timeout: number }) => number }).requestIdleCallback(attachMotion, { timeout: 2000 });
		} else {
			timerId = setTimeout(attachMotion, 1000);
		}

		return () => {
			isUnmounted = true;
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('devicemotion', handleMotion);
			if (idleId && typeof window !== "undefined" && "cancelIdleCallback" in window) {
				(window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
			}
			if (timerId) {
				clearTimeout(timerId);
			}
		};
	}, []);

	// 5 Physical Springs representing the active DOM nodes
	const [springs, api] = useSprings(NUM_PHYSICAL_CARDS, i => {
		const pos = orderRef.current.indexOf(i);
		return {
			x: 0, y: 0, scale: 1, 
			rotZ: STATIC_ROTATIONS[pos],
			rotY: 0,
			opacity: 1, zIndex: NUM_PHYSICAL_CARDS - pos,
			config: { friction: 50, tension: 500 }
		};
	});

	// ==========================================
	// TUTORIAL PUPPET LISTENER (100% Decoupled)
	// ==========================================
	useEffect(() => {
		const handleTutorialPeek = (e: Event) => {
			const customEvent = e as CustomEvent;
			const { mx, my, snap, cancel } = customEvent.detail || {};

			if (snap || cancel) {
				api.start(i => {
					const currentPos = orderRef.current.indexOf(i);
					return {
						x: 0,
						y: 0,
						rotY: 0,
						rotZ: STATIC_ROTATIONS[currentPos],
						scale: 1,
						config: { friction: 32, tension: 380 },
					};
				});
				return;
			}

			if (intentRef.current) return; // Ignore animated frames if user is actively dragging

			// We mirror the original useDrag peel logic exactly, but purely externally
			api.set(i => {
				const currentPos = orderRef.current.indexOf(i);
				const pivotFactor = my < 0 ? -1 : 1; 

				// Whole Deck Vertical Swipe
				if (Math.abs(my) > 0 && Math.abs(mx) === 0) {
					return { y: my, rotZ: STATIC_ROTATIONS[currentPos], rotY: 0, scale: 1, x: 0 };
				}
				
				// Horizontal Top Card Peel
				if (currentPos === 0) {
					if (Math.abs(mx) > 0) {
						return { x: mx, y: Math.abs(mx) * 0.1, rotZ: (mx / 20) * pivotFactor, rotY: 0, scale: 1.02 };
					}
				}
				
				// Background card horizontal fan
				if (currentPos < 3 && Math.abs(mx) > 0) {
					return { rotZ: STATIC_ROTATIONS[currentPos] + (mx / 300), scale: 1 };
				}
				
				return {};
			});
		};

		window.addEventListener("tutorial-peek", handleTutorialPeek);
		return () => window.removeEventListener("tutorial-peek", handleTutorialPeek);
	}, [api]);


	const bind = useDrag(({ args: [index], active, movement: [mx, my], velocity: [vx], initial: [, iy] }) => {
		if (isFannedRef.current) {
			togglePokerFanRef.current();
		}

		const pos = orderRef.current.indexOf(index);
		if (pos !== 0) return; // Only allow grabbing the top card

		// Lock gesture intent once there's enough movement to know the dominant axis
		if (intentRef.current === null) {
			if (Math.abs(mx) > 4 || Math.abs(my) > 4) {
				intentRef.current = Math.abs(mx) > Math.abs(my) ? "horizontal" : "vertical";
			} else {
				if (!active) intentRef.current = null;
				return; // not enough movement yet — wait for a clearer signal
			}
		}
		
		const isVertical = intentRef.current === "vertical";
		const grabbedTopHalf = iy < window.innerHeight / 2;
		const pivotFactor = grabbedTopHalf ? 1 : -1;

		// ==========================================
		// VERTICAL LOGIC: The Heavy Layer Slide
		// ==========================================
		if (isVertical) {
			const dragDistance = Math.abs(my);
			const isDown = my > 0;
			
			// Phase 1: Lifting the deck (0 to 150px drag)
			// Removed deck-wide scale computation (flicker fix)

			// Release Check (Bi-directional support)
			const isSwipeComplete = !active && dragDistance > window.innerHeight * 0.18;

			if (isSwipeComplete) {
				const runLayerSwap = async () => {
					// 1. Force the active deck completely off the screen
					const outPromises = api.start(i => {
						const currentPos = orderRef.current.indexOf(i);
						return {
							y: window.innerHeight * 1.2 * (isDown ? 1 : -1),
							opacity: 0,
							rotZ: STATIC_ROTATIONS[currentPos], // Keep it wonderfully messy as it flies away!
							scale: 1.05,
							config: { mass: 1, tension: 300, friction: 30 }
						};
					});
					await Promise.all(Array.isArray(outPromises) ? outPromises : [outPromises]);

					// 2. Trigger React State Swap (Array Navigation)
					setActiveDeckIndex(prevIndex => {
						if (isDown) {
							// Swipe Down -> Previous Deck
							return (prevIndex - 1 + DECKS.length) % DECKS.length;
						} else {
							// Swipe Up -> Next Deck
							return (prevIndex + 1) % DECKS.length;
						}
					});
					orderRef.current = [0, 1, 2, 3, 4]; // Reset logical array
					
					// 3. Teleport new deck perfectly to the exact resting state of the passive deck
					// We use scale 1.0 so there is no visual bouncing or shrinking when it takes focus. It is perfectly seamless!
					api.start(j => ({
						x: 0, y: 0, rotY: 0,
						rotZ: STATIC_ROTATIONS[j], 
						scale: 1, opacity: 1,
						zIndex: NUM_PHYSICAL_CARDS - j,
						immediate: true
					}));
				};
				
				runLayerSwap();
				intentRef.current = null; // Clear intent
				return;
			}

			// Interactive scrubbing: imperative set (no spring re-solve per frame)
			if (active) {
				api.set(i => {
					const currentPos = orderRef.current.indexOf(i);
					return {
						y: my,
						rotZ: STATIC_ROTATIONS[currentPos],
						scale: 1,
						opacity: 1,
						rotY: 0, x: 0,
					};
				});
			} else {
				// Released without completing the swipe — spring back to rest
				api.start(i => {
					const currentPos = orderRef.current.indexOf(i);
					return {
						y: 0,
						rotZ: STATIC_ROTATIONS[currentPos],
						scale: 1,
						opacity: 1,
						rotY: 0, x: 0,
						config: { tension: 500, friction: 50 },
					};
				});
			}
			
			if (!active) intentRef.current = null;
			return; 
		}

		// ==========================================
		// HORIZONTAL LOGIC: The Light Card Throw
		// ==========================================
		if (active) {
			const currentDir = mx < 0 ? "prev" : "next";
			if (dragDirection !== currentDir) {
				patchActiveCursor(c => ({ ...c, direction: currentDir }));
			}
		}

		const cardWidth = Math.min(window.innerWidth * 0.916, 384);
		const isSwipe = !active && (vx > 0.5 || Math.abs(mx) > cardWidth * 0.3);

		if (isSwipe) {
			const dir = mx < 0 ? -1 : 1;
			const isNext = dir === 1;

			api.start(i => {
				const currentPos = orderRef.current.indexOf(i);

				if (currentPos === 0) {
					return {
						x: cardWidth * 0.8 * dir, 
						y: Math.abs(mx) * 0.2 + (cardWidth * 0.3), 
						rotZ: (mx / 10) * pivotFactor + (dir * 20 * vx),
						rotY: dir * 60 * vx, 
						scale: 0.5, 
						opacity: 0, 
						config: { friction: 40, tension: 350 }, 
						onRest: () => {
							const newOrder = [...orderRef.current];
							const shifted = newOrder.shift() as number;
							newOrder.push(shifted);
							orderRef.current = newOrder;

							patchActiveCursor(c => ({ offset: c.offset + (isNext ? 1 : -1), direction: "next" }));

							api.start(j => {
								const newPos = orderRef.current.indexOf(j);
								if (newPos === NUM_PHYSICAL_CARDS - 1) { 
									return {
										x: 0, y: 0, rotY: 0,
										scale: 1, 
										rotZ: STATIC_ROTATIONS[newPos],
										opacity: 1, 
										zIndex: NUM_PHYSICAL_CARDS - newPos,
										immediate: true
									};
								}
								return { zIndex: NUM_PHYSICAL_CARDS - newPos, immediate: true };
							});
						}
					};
				}

				return {
					scale: 1,
					rotZ: STATIC_ROTATIONS[currentPos - 1],
					config: { friction: 40, tension: 300 }
				};
			});
			
			intentRef.current = null;
			return;
		}

		// Interactive dragging: imperative set (no spring re-solve per frame)
		if (active) {
			api.set(i => {
				const currentPos = orderRef.current.indexOf(i);

				if (currentPos === 0) {
					return {
						x: mx,
						y: Math.abs(mx) * 0.1,
						rotZ: (mx / 20) * pivotFactor,
						rotY: 0,
						scale: 1.02,
					};
				}

				if (currentPos < 3) {
					return {
						rotZ: STATIC_ROTATIONS[currentPos] + (mx / 300),
						scale: 1,
					};
				}
				return {};
			});
		} else {
			// Released — spring back to rest
			api.start(i => {
				const currentPos = orderRef.current.indexOf(i);
				return {
					x: 0,
					y: 0,
					rotZ: STATIC_ROTATIONS[currentPos],
					rotY: 0,
					scale: 1,
					config: { friction: 50, tension: 500 },
				};
			});
		}
		
		if (!active) intentRef.current = null;
	}, { filterTaps: true }); // Capture both axes

	return (
		<>
			<div className="card-stack-engine relative w-full mx-auto isolate mb-fluid-md select-none" style={{ perspective: "1500px" }}>
				
				<GestureTutorialOverlay />
			
			{/* The Ghost Element: Holds container open securely */}
			{activeCards.length > 0 && (
				<div className={`relative invisible pointer-events-none opacity-0 ${ENGINE_SHAPE_CLASSES}`} />
			)}

			{/* The Shadow Plate */}
			{activeCards.length > 0 && (
				<animated.div className="absolute inset-0 origin-center pointer-events-none" style={{ zIndex: -1, scale: bgSpring.scale, opacity: bgSpring.opacity, willChange: "transform" }}>
					<div className={`rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-transparent ${ENGINE_SHAPE_CLASSES}`} />
				</animated.div>
			)}

			{/* The Passive Inactive Deck (The "Peep" Fix) */}
			{/* Rendered physically behind the active deck so when you pull up, you see the actual new deck waiting beneath! */}
			{inactiveCards.length > 0 && (
				<animated.div className="absolute inset-0 origin-center pointer-events-none" style={{ zIndex: 0, scale: bgSpring.scale, opacity: bgSpring.opacity, willChange: "transform" }}>
					{Array.from({ length: NUM_PHYSICAL_CARDS }, (_, positionInStack) => {
						const dataIndex = inactiveCursor.offset + (positionInStack * (inactiveCursor.direction === "prev" ? -1 : 1));
						const card = getCardData(dataIndex, inactiveCards);
						if (!card) return null;
						return (
							<div
								key={`inactive-${positionInStack}`}
								className={`absolute top-0 left-0 right-0 mx-auto origin-center ${ENGINE_SHAPE_CLASSES}`}
								style={{
									transform: `rotateZ(${STATIC_ROTATIONS[positionInStack]}deg)`,
									zIndex: NUM_PHYSICAL_CARDS - positionInStack
								}}
							>
								<CardDeckContext.Provider value={{ isTop: false }}>
									<div className="w-full h-full pointer-events-none overflow-hidden rounded-xl">
										{card}
									</div>
								</CardDeckContext.Provider>
							</div>
						);
					})}
				</animated.div>
			)}

			{/* The Animated Physical Stack */}
			{springs.map(({ x, y, rotZ, rotY, scale, zIndex, opacity }, i) => {
				const positionInStack = orderRef.current.indexOf(i);
				const isTop = positionInStack === 0;

				const dirMult = dragDirection === "prev" ? -1 : 1;
				const dataIndex = offset + (positionInStack * dirMult);
				const cardData = getCardData(dataIndex, activeCards);

				if (!cardData) return null;

				return (
					<animated.div
						key={i}
						{...(isTop ? bind(i) : {})} 
						className={`absolute top-0 left-0 right-0 mx-auto origin-center ${ENGINE_SHAPE_CLASSES}`}
						style={{
							zIndex, x, y, scale,
							rotateZ: rotZ, rotateY: rotY,
							opacity,
							willChange: "transform",
							pointerEvents: isTop ? "auto" : "none",
							cursor: isTop ? "grab" : "auto",
							touchAction: "none", // Hijack scroll for the vertical gesture!
						}}
					>
						<CardDeckContext.Provider value={{ isTop }}>
							<div className="relative w-full h-full pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto overflow-hidden rounded-xl">
								{cardData}
							</div>
						</CardDeckContext.Provider>
					</animated.div>
				);
			})}
		</div>

		{mounted &&
			activeProject &&
			projects &&
			createPortal(
				<MobileProjectModal
					project={activeProject}
					allProjects={projects}
					onClose={() => setActiveProject(null)}
					onSelectProject={(p) => setActiveProject(p)}
				/>,
				document.body,
			)}
	</>
	);
}

