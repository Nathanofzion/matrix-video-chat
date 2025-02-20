/*
Copyright 2021 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { defineConfig, loadEnv } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import htmlTemplate from "vite-plugin-html-template";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      svgrPlugin(),
      htmlTemplate({
        data: {
          title: env.VITE_PRODUCT_NAME || "Matrix Video Chat",
        },
      }),
    ],
    server: {
      proxy: {
        "/_matrix": env.VITE_DEFAULT_HOMESERVER || "http://localhost:8008",
      },
      fs: {
        // Current we're bundling files linked in from matrix-react-sdk
        // We should re-enable this if we plan to run Vite outside the dev server mode
        strict: false,
      },
    },
    resolve: {
      alias: {
        "$(res)": path.resolve(__dirname, "node_modules/matrix-react-sdk/res"),
      },
      dedupe: [
        "react",
        "react-dom",
        "matrix-js-sdk",
        "react-use-measure",
        "@juggle/resize-observer",
      ],
    },
  };
});
