import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import GitHubStats from "../components/GitHubStats";
import styles from "./index.module.css";

const heroBadges = [
    {
        description:
            "Flat-config presets built specifically for eslint-plugin-etc-misc.",
        icon: "⚙️",
        label: "Flat Config native",
    },
    {
        description:
            "Curated blend of eslint-plugin-etc and eslint-plugin-misc best practices.",
        icon: "🧠",
        label: "Merged plugin conventions",
    },
    {
        description:
            "Detailed rule docs with incorrect/correct snippets and rollout guidance.",
        icon: "🛠️",
        label: "Actionable rule docs",
    },
];

const heroStats = [
    {
        description:
            "Coverage across naming, imports, structure, and TypeScript correctness.",
        headline: "📏 103 Rules",
    },
    {
        description:
            "A focused baseline plus full enforcement when you need everything.",
        headline: "🎛️ 2 Presets",
    },
    {
        description:
            "Core and TypeScript-specific rule families with consistent navigation.",
        headline: "✨ Core + TypeScript Rule Groups",
    },
];

const homeCards = [
    {
        description:
            "Install the plugin, enable a preset, and start enforcing consistent TypeScript-first conventions.",
        icon: "\u{F135}",
        title: "Get Started",
        to: "/docs/rules/getting-started",
    },
    {
        description:
            "Choose between the focused recommended preset and the complete all-rules preset.",
        icon: "\u{F14E}",
        title: "Presets",
        to: "/docs/rules/presets/all",
    },
    {
        description:
            "Browse every rule with concrete incorrect/correct examples and migration guidance.",
        icon: "\u{F02D}",
        title: "Rule Reference",
        to: "/docs/rules",
    },
];

/**
 * Renders the Docusaurus landing page.
 *
 * @returns {import("react").JSX.Element} Home page layout.
 */
export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.png");

    return (
        <Layout
            description="Documentation for eslint-plugin-etc-misc"
            title="eslint-plugin-etc-misc docs"
        >
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div>
                            <p className={styles.heroKicker}>
                                🛠️ ESLint plugin for modern TypeScript teams 🚀
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                eslint-plugin-etc-misc
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                ESLint rules for teams that want a single,
                                pragmatic plugin combining the strongest
                                conventions from eslint-plugin-etc and
                                eslint-plugin-misc.
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        className={styles.heroBadge}
                                        key={badge.label}
                                    >
                                        <p className={styles.heroBadgeLabel}>
                                            <span
                                                aria-hidden="true"
                                                className={styles.heroBadgeIcon}
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles.heroBadgeDescription
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.heroActions}>
                                <Link
                                    className="button button--primary button--lg"
                                    to="/docs/rules/overview"
                                >
                                    Open Rule Overview
                                </Link>
                                <Link
                                    className="button button--secondary button--lg"
                                    to="/docs/rules/presets/all"
                                >
                                    See All Preset Rules
                                </Link>
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt="eslint-plugin-etc-misc logo"
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                        </aside>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        {heroStats.map((stat) => (
                            <article
                                className={styles.heroStatCard}
                                key={stat.headline}
                            >
                                <p className={styles.heroStatHeading}>
                                    {stat.headline}
                                </p>
                                <p className={styles.heroStatDescription}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className="container">
                    <div className={styles.cardGrid}>
                        {homeCards.map((card) => (
                            <article className={styles.card} key={card.title}>
                                <div className={styles.cardHeader}>
                                    <p className={styles.cardIcon}>
                                        {card.icon}
                                    </p>
                                    <Heading
                                        as="h2"
                                        className={styles.cardTitle}
                                    >
                                        {card.title}
                                    </Heading>
                                </div>
                                <p className={styles.cardDescription}>
                                    {card.description}
                                </p>
                                <Link className={styles.cardLink} to={card.to}>
                                    Open section →
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
