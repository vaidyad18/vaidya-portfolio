import Script from "next/script";

interface GoogleAnalyticsDeferredProps {
	gaId: string;
}

export default function GoogleAnalyticsDeferred({ gaId }: GoogleAnalyticsDeferredProps) {
	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
				strategy="lazyOnload"
			/>
			<Script id="google-analytics-deferred" strategy="lazyOnload">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${gaId}', {
						page_path: window.location.pathname,
					});
				`}
			</Script>
		</>
	);
}
