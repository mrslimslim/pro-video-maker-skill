declare module "@blocks/*/Component" {
  import type { ComponentType } from "react";

  const BlockComponent: ComponentType<any>;
  export default BlockComponent;
}

declare module "@blocks/*/schema" {
  export const schema: unknown;
}
