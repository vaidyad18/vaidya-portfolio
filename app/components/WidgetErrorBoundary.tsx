"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";

interface Props {
	widgetTitle?: string;
	children?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export default class WidgetErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(
			`Widget exception [${this.props.widgetTitle || "WIDGET"}]:`,
			error,
			errorInfo,
		);
	}

	public handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	public render() {
		if (this.state.hasError) {
			const title = (this.props.widgetTitle || "WIDGET").toUpperCase();
			return (
				<div className="w-full bg-card border-[length:var(--border-fluid)] border-border shadow-md p-4 flex flex-col justify-between overflow-hidden relative select-none min-h-[160px]">
					<CardHeader
						icon={<FiAlertTriangle className="w-[1.2em] h-[1.2em]" />}
						accentColor="var(--color-accent)"
						title={`${title} OFFLINE`}
						badge="ERROR"
					/>

					<div className="my-3 flex flex-col items-center justify-center text-center gap-2 font-mono">
						<span className="text-[length:var(--text-fluid-xs)] text-muted-foreground uppercase">
							{this.state.error?.message ||
								"Data parsing fault / render exception"}
						</span>
						<button
							onClick={this.handleReset}
							className="inline-flex items-center gap-1 px-3 py-1 text-[length:var(--text-fluid-2xs)] font-bold uppercase tracking-wider bg-accent text-accent-foreground border border-border shadow-xs hover:-translate-y-[0.5px] cursor-pointer"
						>
							<FiRefreshCw className="w-[1em] h-[1em]" /> RETRY
						</button>
					</div>

					<CardFooter left="status: offline" right="ERR_RECOVER" />
				</div>
			);
		}

		return this.props.children;
	}
}
