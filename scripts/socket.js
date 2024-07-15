let socketlibSocket = undefined;
async function bringPlayersToStageSocket() {
  let activeTheatre = [];

  Object.entries(Theatre.instance.stage).forEach((c) => {
    activeTheatre.push({
      name: c[1].actor.name,
      id: c[0],
    });
  });
  if (activeTheatre.length > 0) {
    Theatre.instance.activateInsertById(activeTheatre[0].id);
  }
}
async function clearAllStagesSocket() {
  const activeTheatre = [];

  Object.entries(Theatre.instance.stage).forEach((c) => {
    activeTheatre.push({
      name: c[1].actor.name,
      id: c[0],
    });
  });
  activeTheatre.forEach((item) => {
    Theatre.instance.removeInsertById(item.id);
  });
}

async function toggleSpecificPlayerSocket(on) {
  const activeTheatre = [];

  Object.entries(Theatre.instance.stage).forEach((c) => {
    activeTheatre.push({
      name: c[1].actor.name,
      id: c[0],
    });
  });
  if (on) {
    activeTheatre.forEach((item) => {
      Theatre.instance.activateInsertById(item.id);
    });
  } else {
    activeTheatre.forEach((item) => {
      Theatre.instance.removeInsertById(item.id);
    });
  }
}

export const setupSocket = () => {
  if (globalThis.socketlib) {
    socketlibSocket = globalThis.socketlib.registerModule(
      "ready-for-the-stage"
    );
    socketlibSocket.register("bringPlayersToStage", bringPlayersToStageSocket);
    socketlibSocket.register("clearAllStages", clearAllStagesSocket);
    socketlibSocket.register("toggleSpecificPlayer", toggleSpecificPlayerSocket);
  }
  return !!globalThis.socketlib;
};
