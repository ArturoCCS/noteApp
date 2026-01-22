import { Crepe } from "@milkdown/crepe";
import { useEffect } from "react";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

export function CrepeEditor() {
  useEffect(() => {
    const crepe = new Crepe({
      root: "#editor",
      defaultValue: "# Hola\n\nEsto ya tiene toolbar 😄",
    });

    crepe.create();

    return () => {
      crepe.destroy();
    };
  }, []);

  return <div id="editor" />;
}
