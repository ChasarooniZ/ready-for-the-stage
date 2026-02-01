import { clearYourStage } from "./api.js";

let socketlibSocket = undefined;
async function bringPlayersToStageSocket() {
  const activeTheatre = Object.keys(Theatre.instance.stage);
  if (activeTheatre.length > 0) {
    Theatre.instance.activateStagedByID(0);
  }
}

async function toggleSpecificPlayerSocket(on) {
  Object.keys(Theatre.instance.stage).forEach((thespianID, count) => {
    if (on === null) {
      Theatre.instance.functions?.[
        Theatre.instance.stage[thespianID].navElement.classList.contains(
          "theatre-control-nav-bar-item-active",
        )
          ? "removeFromStagedByID"
          : "activateStagedByID"
      ](count);
    } else {
      Theatre.instance.functions?.[
        on ? "activateStagedByID" : "removeFromStagedByID"
      ](count);
    }
  });
}

export const setupSocket = () => {
  if (globalThis.socketlib) {
    socketlibSocket = globalThis.socketlib.registerModule(
      "ready-for-the-stage",
    );
    socketlibSocket.register("bringPlayersToStage", bringPlayersToStageSocket);
    socketlibSocket.register("clearAllStages", clearYourStage);
    socketlibSocket.register(
      "toggleSpecificPlayer",
      toggleSpecificPlayerSocket,
    );
  }
  return !!globalThis.socketlib;
};
