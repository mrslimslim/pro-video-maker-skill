import path from "path";
import { Config } from "@remotion/cli/config";

const projectRoot = process.cwd();

Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      symlinks: false,
      alias: {
        ...currentConfiguration.resolve?.alias,
        "@": path.resolve(projectRoot, "src"),
        "@engine": path.resolve(projectRoot, "src/engine"),
        "@blocks": path.resolve(projectRoot, "material-library/blocks"),
      },
    },
  };
});
