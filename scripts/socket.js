import { clearYourStage } from "./api.js";

let socketlibSocket = undefined;
async function bringPlayersToStageSocket() {
  const activeTheatre = Object.keys(Theatre.instance.stage);
  if (activeTheatre.length > 0) {
    Theatre.instance.activateInsertById(activeTheatre[0]);
  }
}

async function toggleSpecificPlayerSocket(on) {
  Object.keys(Theatre.instance.stage).forEach((thespianID) => {
    Theatre.instance[on ? "activateInsertById" : "removeInsertById"](
      thespianID,
    );
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
