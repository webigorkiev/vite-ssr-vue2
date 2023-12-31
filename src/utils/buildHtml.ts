const defaultHtmlParts = [
    "headTags",
    "body",
    "bodyAttrs",
    "htmlAttrs",
    "initialState",
].reduce(
    (acc, item) => ({ ...acc, [item]: `\${${item}}` }),
    {} as Record<string, string>
);

// Replace inserts to the value or!!! to the name of params
export const buildHtml = (template: string, parts = defaultHtmlParts): string => {
    return template
        .replace("<html", `<html${parts.htmlAttrs}`)
        .replace("<body", `<body${parts.bodyAttrs}`)
        .replace("</head>", `${parts.headTags ? `${parts.headTags}\n`: ""}</head>`)
        .replace(
            "<div id=\"app\"></div>",

            // eslint-disable-next-line max-len
            `${parts.body}<script>window.__INITIAL_STATE__=${parts.initialState}</script>`
        );
};
