export const MODULE_ID = "ready-for-the-stage";

export const KEYBINDS = [
  {
    id: "quickToggleStage",
    gmOnly: false,
    keys: [
      {
        key: "KeyK",
      },
    ],
  },
  {
    id: "bringPlayersToTheStage",
    gmOnly: true,
    keys: [],
  },
  {
    id: "clearYourStage",
    gmOnly: false,
    keys: [
      {
        key: "KeyK",
        modifiers: ["Alt"],
      },
    ],
  },
  {
    id: "clearAllStages",
    gmOnly: true,
    keys: [
      {
        key: "KeyK",
        modifiers: ["Shift"],
      },
    ],
  },
  {
    id: "toggleSpecificPlayersMenu",
    gmOnly: true,
    keys: [],
  },
  {
    id: "toggleSelectedTokensAndStage",
    gmOnly: false,
    keys: [],
  },
];

export const CSS_SELECTORS = {
  PF2E_PERSISTENT_HUD: "#pf2e-hud-persistent",
};
