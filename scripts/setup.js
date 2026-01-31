import { CSS_SELECTORS, MODULE_ID } from "./const.js";

const theatre = "theatre";
export function setupCustomKeybinds() {
  const directionKeys = [
    { dir: "Up", key: "W" },
    { dir: "Down", key: "S" },
    { dir: "Left", key: "A" },
    { dir: "Right", key: "D" },
  ];
  for (const { dir, key } of directionKeys) {
    const keys = game.keybindings.get("theatre", `nudgePortrait${dir}`);
    if (
      !keys.some(
        (keybind) => keybind.key === `Key${key}` && keybind.modifiers === "Alt",
      )
    ) {
      keys.push({ key: `Key${key}`, modifiers: ["Alt"] });
      game.keybindings.set("theatre", `nudgePortrait${dir}`, keys);
    }
    if (
      !keys.some(
        (keybind) => keybind.key === `Arrow${dir}` && keybind.modifiers === "Alt",
      )
    ) {
      keys.push({ key: `Arrow${dir}`, modifiers: ["Alt"] });
      game.keybindings.set("theatre", `nudgePortrait${dir}`, keys);
    }
  }
}

export function setupSettings() {
  game.settings.register(MODULE_ID, "first-time", {
    name: "",
    hint: "",
    requiresReload: false,
    scope: "user",
    config: false,
    default: true,
    type: Boolean,
  });
  game.settings.register(MODULE_ID, "voice-mode.old-value", {
    name: "",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: "",
    type: String,
  });
  game.settings.register(MODULE_ID, "voice-mode", {
    name: `${MODULE_ID}.module-settings.voice-mode.name`,
    hint: `${MODULE_ID}.module-settings.voice-mode.hint`,
    requiresReload: false,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: async (value) => {
      if (value) {
        //backup old
        await game.settings.set(
          MODULE_ID,
          "voice-mode.old-value",
          game.settings.get("theatre", "theatreStyle"),
        );
        await game.settings.set("theatre", "theatreStyle", "clearbox");
        Theatre.instance.configTheatreStyle("clearbox");
      } else {
        const style = game.settings.get(MODULE_ID, "voice-mode.old-value");
        await game.settings.set("theatre", "theatre-style", style);
        Theatre.instance.configTheatreStyle(style);
      }
    },
  });
  game.settings.register(MODULE_ID, "show-names.old-value", {
    name: "",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: 0,
    type: Number,
  });
  game.settings.register(MODULE_ID, "show-names", {
    name: `${MODULE_ID}.module-settings.show-names.name`,
    hint: `${MODULE_ID}.module-settings.show-names.hint`,
    requiresReload: false,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: async (value) => {
      if (!value) {
        //backup old
        await game.settings.set(
          MODULE_ID,
          "show-names.old-value",
          game.settings.get("theatre", "nameFontSize"),
        );
        await game.settings.set("theatre", "nameFontSize", 0);
      } else {
        await game.settings.set(
          "theatre",
          "nameFontSize",
          game.settings.get(MODULE_ID, "show-names.old-value"),
        );
      }
    },
  });
}

export async function addPF2eApplicationsToFiltered() {
  let currCSS = game.settings.get("theatre", "suppressCustomCss");
  [CSS_SELECTORS.PF2E_PERSISTENT_HUD].forEach((selector) => {
    if (!currCSS.includes(selector)) {
      currCSS += `${selector};`;
    }
  });
  await game.settings.set("theatre", "suppressCustomCss", currCSS);
}

export async function firstTimeMessage() {
  if (game.settings.get(MODULE_ID, "first-time")) {
    await ChatMessage.create({
      content: `<p>@UUID[Compendium.ready-for-the-stage.ready-for-the-stage-help.JournalEntry.0ll9LjdT6ougheIj]</p><p>${game.i18n.localize("ready-for-the-stage.message.first-time")}</p>`,
    });
    await game.settings.set(MODULE_ID, "first-time", false)
  }
}
