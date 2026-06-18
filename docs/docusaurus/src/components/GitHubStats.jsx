import Link from "@docusaurus/Link";

import styles from "./GitHubStats.module.css";

const liveBadges = [
    {
        alt: "npm license",
        href: "https://www.npmjs.com/package/eslint-plugin-etc-misc",
        src: "https://flat.badgen.net/npm/license/eslint-plugin-etc-misc?color=purple",
    },
    {
        alt: "npm total downloads",
        href: "https://www.npmjs.com/package/eslint-plugin-etc-misc",
        src: "https://flat.badgen.net/npm/dt/eslint-plugin-etc-misc?color=pink",
    },
    {
        alt: "latest GitHub release",
        href: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/releases",
        src: "https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-etc-misc?color=cyan",
    },
    {
        alt: "GitHub stars",
        href: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/stargazers",
        src: "https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-etc-misc?color=yellow",
    },
    {
        alt: "GitHub forks",
        href: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/forks",
        src: "https://flat.badgen.net/github/forks/Nick2bad4u/eslint-plugin-etc-misc?color=green",
    },
    {
        alt: "GitHub open issues",
        href: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/issues",
        src: "https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-plugin-etc-misc?color=red",
    },
];

/**
 * @typedef {object} GitHubStatsProps
 *
 * @property {string} [className] - Optional class appended to the badge list.
 */

/**
 * Renders live repository and package badges powered by flat.badgen.net.
 *
 * @param {GitHubStatsProps} [props] - Optional list class override.
 *
 * @returns {import("react").JSX.Element} Badge strip with links to
 *   package/repository metadata.
 */
export default function GitHubStats({ className = "" } = {}) {
    const badgeListClassName = [styles.liveBadgeList, className]
        .filter(Boolean)
        .join(" ");

    return (
        <ul className={badgeListClassName}>
            {liveBadges.map((badge) => (
                <li className={styles.liveBadgeListItem} key={badge.src}>
                    <Link
                        className={styles.liveBadgeAnchor}
                        href={badge.href}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <img
                            alt={badge.alt}
                            className={styles.liveBadgeImage}
                            decoding="async"
                            loading="lazy"
                            src={badge.src}
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
