const theatre = "theatre";
function setupCustomKeybinds() {
  const directionKeys = [
    { dir: "Up", key: "W" },
    { dir: "Down", key: "W" },
    { dir: "Left", key: "W" },
    { dir: "Right", key: "W" },
  ];

  for (const { dir, key } of directionKeys) {
    const keys = game.keybinds.get(theatre, `nudgePortrait${dir}`);
    if (
      keys.some(
        (keybind) =>
          keybind.key === `Key${key}` && keybind.modifiers === "Shift"
      )
    ) {
    } else {
      keys.push({ key: `Key${key}`, modifiers: ["Shift"] });
      game.keybinds.set(theatre, `nudgePortrait${dir}`, keys);
    }
  }

  if (
    game.keybinds
      .get(theatre, `flipPortrait`)
      .some(
        (keybind) => keybind.key === `KeyE` && keybind.modifiers === "Shift"
      )
  ) {
  } else {
    keys.push({ key: `KeyE`, modifiers: ["Shift"] });
    game.keybinds.set(theatre, `flipPortrait`, keys);
  }
}
