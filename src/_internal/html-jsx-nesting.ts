import { arrayAt, isDefined, setHas } from "ts-extras";

/** A deterministic invalid HTML relationship found in a JSX tree. */
type NestingViolation = Readonly<{
    readonly kind:
        | "ancestor"
        | "parent"
        | "void-parent";
    readonly relatedName?: string;
}>;

const headingNames: ReadonlySet<string> = new Set([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
]);

const pClosingDescendants: ReadonlySet<string> = new Set([
    "address",
    "article",
    "aside",
    "blockquote",
    "center",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "hr",
    "listing",
    "main",
    "menu",
    "nav",
    "ol",
    "p",
    "pre",
    "search",
    "section",
    "summary",
    "table",
    "ul",
    "xmp",
]);

const voidElementNames: ReadonlySet<string> = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

const requiredParentsByChild: Readonly<Record<string, ReadonlySet<string>>> = {
    body: new Set(["html"]),
    caption: new Set(["table"]),
    col: new Set(["colgroup"]),
    colgroup: new Set(["table"]),
    frame: new Set(["frameset"]),
    frameset: new Set(["html"]),
    head: new Set(["html"]),
    html: new Set(),
    tbody: new Set(["table"]),
    td: new Set(["tr"]),
    tfoot: new Set(["table"]),
    th: new Set(["tr"]),
    thead: new Set(["table"]),
    tr: new Set([
        "tbody",
        "tfoot",
        "thead",
    ]),
};

const allowedChildrenByParent: Readonly<Record<string, ReadonlySet<string>>> = {
    colgroup: new Set(["col", "template"]),
    frameset: new Set(["frame"]),
    head: new Set([
        "base",
        "basefont",
        "bgsound",
        "link",
        "meta",
        "noframes",
        "noscript",
        "script",
        "style",
        "template",
        "title",
    ]),
    html: new Set(["body", "head"]),
    optgroup: new Set(["option"]),
    option: new Set(),
    select: new Set([
        "hr",
        "optgroup",
        "option",
        "script",
        "template",
    ]),
    table: new Set([
        "caption",
        "colgroup",
        "script",
        "style",
        "tbody",
        "template",
        "tfoot",
        "thead",
    ]),
    tbody: new Set([
        "script",
        "template",
        "tr",
    ]),
    tfoot: new Set([
        "script",
        "template",
        "tr",
    ]),
    thead: new Set([
        "script",
        "template",
        "tr",
    ]),
    tr: new Set([
        "script",
        "td",
        "template",
        "th",
    ]),
};

const impliedEndTagNames: ReadonlySet<string> = new Set([
    "dd",
    "dt",
    "li",
    "optgroup",
    "option",
    "p",
    "rp",
    "rt",
]);

const inScopeBoundaryNames: ReadonlySet<string> = new Set([
    "applet",
    "caption",
    "desc",
    "foreignObject",
    "html",
    "marquee",
    "object",
    "table",
    "td",
    "template",
    "th",
    "title",
]);

const listItemScopeBoundaryNames: ReadonlySet<string> = new Set([
    "applet",
    "area",
    "article",
    "aside",
    "base",
    "basefont",
    "bgsound",
    "blockquote",
    "body",
    "br",
    "button",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dir",
    "dl",
    "dt",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "iframe",
    "img",
    "input",
    "li",
    "link",
    "listing",
    "main",
    "marquee",
    "menu",
    "meta",
    "nav",
    "noembed",
    "noframes",
    "noscript",
    "object",
    "ol",
    "param",
    "plaintext",
    "pre",
    "script",
    "section",
    "select",
    "source",
    "style",
    "summary",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul",
    "wbr",
    "xmp",
]);

const buttonScopeBoundaryNames: ReadonlySet<string> = new Set([
    ...inScopeBoundaryNames,
    "button",
]);
const paragraphAncestorNames: ReadonlySet<string> = new Set(["p"]);
const formAncestorNames: ReadonlySet<string> = new Set(["form"]);
const listItemAncestorNames: ReadonlySet<string> = new Set(["li"]);
const descriptionListItemAncestorNames: ReadonlySet<string> = new Set([
    "dd",
    "dt",
]);
const sameTagScopedAncestors: Readonly<Record<string, ReadonlySet<string>>> = {
    a: new Set(["a"]),
    button: new Set(["button"]),
    nobr: new Set(["nobr"]),
};

const containsName = (names: ReadonlySet<string>, name: string): boolean =>
    setHas(names, name);

const findAncestor = (
    ancestorNames: readonly string[],
    candidates: ReadonlySet<string>
): string | undefined =>
    ancestorNames.find((ancestorName) =>
        containsName(candidates, ancestorName)
    );

const findScopedAncestor = (
    ancestorNames: readonly string[],
    candidates: ReadonlySet<string>,
    boundaries: ReadonlySet<string>
): string | undefined => {
    for (const ancestorName of ancestorNames) {
        if (containsName(candidates, ancestorName)) {
            return ancestorName;
        }

        if (containsName(boundaries, ancestorName)) {
            return undefined;
        }
    }

    return undefined;
};

const getDirectRelationshipViolation = (
    childName: string,
    ancestorNames: readonly string[]
): NestingViolation | undefined => {
    const parentName = arrayAt(ancestorNames, 0);

    if (isDefined(parentName) && containsName(voidElementNames, parentName)) {
        return {
            kind: "void-parent",
            relatedName: parentName,
        };
    }

    if (!isDefined(parentName)) {
        return undefined;
    }

    const allowedChildren = allowedChildrenByParent[parentName];

    if (
        isDefined(allowedChildren) &&
        !containsName(allowedChildren, childName)
    ) {
        return {
            kind: "parent",
            relatedName: parentName,
        };
    }

    const requiredParents = requiredParentsByChild[childName];

    if (
        isDefined(requiredParents) &&
        !containsName(requiredParents, parentName)
    ) {
        return {
            kind: "parent",
            relatedName: parentName,
        };
    }

    if (
        containsName(headingNames, childName) &&
        containsName(headingNames, parentName)
    ) {
        return {
            kind: "parent",
            relatedName: parentName,
        };
    }

    return (childName === "rp" || childName === "rt") &&
        containsName(impliedEndTagNames, parentName)
        ? {
              kind: "parent",
              relatedName: parentName,
          }
        : undefined;
};

const getAncestorRelationshipViolation = (
    childName: string,
    ancestorNames: readonly string[]
): NestingViolation | undefined => {
    if (containsName(pClosingDescendants, childName)) {
        const paragraphAncestor = findScopedAncestor(
            ancestorNames,
            paragraphAncestorNames,
            buttonScopeBoundaryNames
        );

        if (isDefined(paragraphAncestor)) {
            return {
                kind: "ancestor",
                relatedName: paragraphAncestor,
            };
        }
    }

    const excludedAncestor = (() => {
        if (childName === "form") {
            return findAncestor(ancestorNames, formAncestorNames);
        }

        const sameTagAncestors = sameTagScopedAncestors[childName];
        if (isDefined(sameTagAncestors)) {
            return findScopedAncestor(
                ancestorNames,
                sameTagAncestors,
                inScopeBoundaryNames
            );
        }

        if (childName === "li") {
            return findScopedAncestor(
                ancestorNames,
                listItemAncestorNames,
                listItemScopeBoundaryNames
            );
        }

        if (childName === "dd" || childName === "dt") {
            return findScopedAncestor(
                ancestorNames,
                descriptionListItemAncestorNames,
                listItemScopeBoundaryNames
            );
        }

        return undefined;
    })();

    return isDefined(excludedAncestor)
        ? {
              kind: "ancestor",
              relatedName: excludedAncestor,
          }
        : undefined;
};

/**
 * Validate parser-significant HTML parent and ancestor relationships.
 *
 * This intentionally focuses on relationships that are deterministic from JSX
 * alone. Attribute-dependent content models and custom-component output are
 * outside its scope.
 */
export const getHtmlNestingViolation = (
    childName: string,
    ancestorNames: readonly string[]
): NestingViolation | undefined =>
    getDirectRelationshipViolation(childName, ancestorNames) ??
    getAncestorRelationshipViolation(childName, ancestorNames);

export type { NestingViolation };
