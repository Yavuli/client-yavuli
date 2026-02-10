import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    schema?: Record<string, any>;
}

const SEO = ({
    title = "Yavuli | The Ultimate Student Marketplace",
    description = "Yavuli is the smart, centralized marketplace for everything in your college life. Buy and sell textbooks, gear, and essentials within your campus community.",
    keywords = "student marketplace, college buy sell, textbooks, college life, campus gear, Yavuli, buy and sell, university marketplace, peer to peer, campus trade",
    image = "https://yavuli.app/og-image.jpg", // Ensure absolute path for better social sharing
    url = "https://yavuli.app",
    type = "website",
    schema
}: SEOProps) => {
    const siteTitle = title.includes("Yavuli") ? title : `${title} | Yavuli`;

    // Default Structured Data (JSON-LD)
    const defaultSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://yavuli.app/#organization",
                "name": "Yavuli",
                "url": "https://yavuli.app",
                "logo": "https://yavuli.app/favicon.jpeg",
                "sameAs": [
                    "https://twitter.com/yavuli",
                    "https://instagram.com/yavuli"
                ],
                "founder": {
                    "@type": "Person",
                    "name": "Kishlaya Mishra",
                    "jobTitle": "Founder & CEO",
                    "url": "https://www.linkedin.com/in/kishlayamishra"
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://yavuli.app/#website",
                "url": "https://yavuli.app",
                "name": "Yavuli",
                "description": description,
                "publisher": {
                    "@id": "https://yavuli.app/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://yavuli.app/explore?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                },
                "inLanguage": "en-US"
            }
        ]
    };

    const structuredData = schema ? { ...defaultSchema, ...schema } : defaultSchema;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Yavuli" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:creator" content="@yavuli" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;