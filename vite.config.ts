import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import million from "million/compiler";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node"
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
//@ts-expect-error ts being ts
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `${baremuxPath}/**/*`.replace(/\\/g, "/"),
          dest: "baremux",
          overwrite: false,
        },
        {
          src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false,
        },
        {
          src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
          dest: "epoxy",
          overwrite: false,
        },
      ]
    }),
    million.vite({ mode: "preact" })
  ],
  server: {
    headers: {
      "X-Frame-Options": "SAMEORIGIN"
    },
    proxy: {
      "/cdn": {
        target: isDev ? "http://localhost:8080" : "https://cdn.radon.games",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, ""),
        headers: {
          referer: isDev ? "http://localhost:5173" : "https://cdn.radon.games"
        }
      },
      "/api": {
        target: "https://api.radon.games",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        headers: {
          referer: "https://api.radon.games"
        },

      },
      "/w/": {
        target: "http://localhost:1111/",
        rewrite: (p) => p.replace(/^\/w/, ""),
        ws: true,
      },
    }
  }
});
