import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeGithubAlerts } from "rehype-github-alerts";

const alertIcon = (path) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">${path}</svg>`;

const githubAlerts = [
  {
    keyword: "NOTE",
    icon: alertIcon(
      '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>',
    ),
    title: "Note",
  },
  {
    keyword: "TIP",
    icon: alertIcon(
      '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 0 1 4.118 10.32c-.17.17-.39.29-.63.34l-.45.09-.2.97a.5.5 0 0 1-.49.4h-2.6a.5.5 0 0 1-.49-.4l-.2-.97-.45-.09a1.5 1.5 0 0 1-.63-.34A6 6 0 0 1 8 2zm.5 9h-1v1h1v-1zM8 4.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>',
    ),
    title: "Tip",
  },
  {
    keyword: "IMPORTANT",
    icon: alertIcon(
      '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/><path d="M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>',
    ),
    title: "Important",
  },
  {
    keyword: "WARNING",
    icon: alertIcon(
      '<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>',
    ),
    title: "Warning",
  },
  {
    keyword: "CAUTION",
    icon: alertIcon(
      '<path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>',
    ),
    title: "Caution",
  },
];

const mathAlerts = [
  {
    keyword: "THEOREM",
    icon: alertIcon(
      '<path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM9 2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM9 10.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>',
    ),
    title: "Theorem",
  },
  {
    keyword: "LEMMA",
    icon: alertIcon(
      '<path d="M4 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4z"/><path d="M6 5h4v1H6V5zm0 3h4v1H6V8zm0 3h2v1H6v-1z"/>',
    ),
    title: "Lemma",
  },
  {
    keyword: "DEFINITION",
    icon: alertIcon(
      '<path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783A7.06 7.06 0 0 1 8 1c2.137 0 3.895.86 4.565 2.24A.5.5 0 0 1 12 3.896V14.5a.5.5 0 0 1-.757.429C9.868 13.84 8.965 13 8 13c-.956 0-1.826.788-2.757 1.929a.5.5 0 0 1-.757-.429V3.896a.5.5 0 0 1 .192-.413z"/>',
    ),
    title: "Definition",
  },
  {
    keyword: "PROOF",
    icon: alertIcon(
      '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 6.97a.75.75 0 0 1 0 1.06l-3.47 3.47-2-2a.75.75 0 1 1 1.06-1.06l.94.94 2.41-2.41a.75.75 0 0 1 1.06 0z"/>',
    ),
    title: "Proof",
  },
];

export default defineConfig({
  site: "https://hotteano.github.io",
  base: "/",
  output: "static",
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [rehypeGithubAlerts, { alerts: [...githubAlerts, ...mathAlerts] }],
    ],
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        [rehypeGithubAlerts, { alerts: [...githubAlerts, ...mathAlerts] }],
      ],
    }),
    sitemap(),
    tailwind(),
  ],
  build: {
    format: "directory",
  },
});
