// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  // TinaCloud credentials — set these as environment variables in Netlify
  // TINA_PUBLIC_CLIENT_ID and TINA_TOKEN
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  branch: process.env.GITHUB_BRANCH || "main",
  build: {
    // Tina outputs the CMS admin UI to static/admin/
    outputFolder: "admin",
    publicFolder: "static"
  },
  media: {
    // Images upload into static/images/ in the repo
    tina: {
      mediaRoot: "images",
      publicFolder: "static"
    }
  },
  schema: {
    collections: [
      {
        name: "dinner_party",
        label: "Dinner Party",
        path: "content/dinner-party",
        // Match all index.md files inside subdirectories (Hugo page bundles)
        match: {
          include: "**",
          exclude: "_index"
        },
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            dateFormat: "YYYY-MM-DD"
          },
          {
            type: "string",
            name: "description",
            label: "Description"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      },
      {
        name: "out_on_the_town",
        label: "Out on the Town",
        path: "content/out-on-the-town",
        match: {
          include: "**",
          exclude: "_index"
        },
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            dateFormat: "YYYY-MM-DD"
          },
          {
            type: "string",
            name: "description",
            label: "Description"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
