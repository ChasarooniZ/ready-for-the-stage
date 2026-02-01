import { createAPI } from "./api.js";
import {
  addPF2eApplicationsToFiltered,
  firstTimeMessage,
  setupCustomKeybinds,
  setupSettings,
} from "./setup.js";
import { setupSocket } from "./socket.js";
Hooks.once("setup", function () {
  if (!setupSocket()) {
    console.error("Error: Unable to set up socket lib for Read for the Stage");
  }
  setupSettings();
  setupModuleKeybinds();
});

Hooks.once("ready", async function () {
  createAPI();
  // TODO add a setting to setup custom keybinds
  setupCustomKeybinds();
  addPF2eApplicationsToFiltered();
  firstTimeMessage();
  if (!!Theatre && !!game.user?.character) {
    Theatre.instance.functions.addToNavBar(game.user.character);
  }
  //if (game.user.isGM) {
  // Hooks.on("renderPlayerList", (_playerList, $html, _miscData) => {
  //   $html.find(`.stage-toggle`).remove();
  //   $html.find(`.player`).each((idx, elem) => {
  //     const userId = elem.dataset.userId;
  //     const isHidden = hiddenUsers.has(userId);
  //     const styles = `flex:0 0 17px;width:17px;height:16px;border:0`;
  //     const src = isHidden
  //       ? `modules/cursor-hider/img/nocursor.png`
  //       : `modules/cursor-hider/img/cursor.png`;
  //     const alt = isHidden
  //       ? `Cursor is being hidden`
  //       : `Cursor is being shown`;
  //     const $img = $(
  //       `<img class=stage-toggle style="${styles}" src="${src}" alt="${alt}" title="${alt}" />`
  //     );
  //     if (!settings.showIconAlways) {
  //       $img.css(`visibility`, `hidden`);
  //       $html.on(`mouseenter`, () => {
  //         $img.css(`visibility`, `visible`);
  //       });
  //       $html.on(`mouseleave`, () => {
  //         $img.css(`visibility`, `hidden`);
  //       });
  //     }
  //     if (
  //       userId === foundryGame.user.id &&
  //       foundryGame.user.hasRole(settings[Const.MINIMUM_PERMISSION])
  //     ) {
  //       $img.css(`cursor`, `pointer`);
  //       $img.on(`click`, toggleCursor);
  //     }
  //     $(elem).append($img);
  //   });
  // });
  //}
});
