export function createAPI() {
  game.readyForStage = {
    bringPlayersToTheStage,
    clearYourStage,
    clearAllStages,
    toggleSpecificPlayersMenu,
    quickToggleStage,
    toggleSelectedTokensAndStage,
  };
}

function bringPlayersToTheStage() {
  //execute this macro on players
  socketlib.modules.get("ready-for-the-stage").executeForUsers(
    "bringPlayersToStage",
    game.users.players.map((p) => p.id),
  );
}

export function clearYourStage() {
  const activeTheatre = Object.entries(Theatre.instance.stage).map((c) => ({
    actor: c[1].actor,
    id: c[0],
  }));

  if (!!game.user.character) {
    const mainPC = activeTheatre.find(
      (chars) => chars.actor?.id === game.user.character?.id,
    )?.actor;
    if (mainPC) {
      deactivateStagedActor(mainPC);
      activeTheatre.splice(
        activeTheatre.findIndex(
          (chars) => chars.actor?.id === game.user.character?.id,
        ),
        1,
      );
    }
  }

  activeTheatre.forEach((thespian) => {
    Theatre.instance.functions.removeFromNavBar(thespian.actor);
  });
}

function clearAllStages() {
  socketlib.modules
    .get("ready-for-the-stage")
    .executeForEveryone("clearAllStages");
}

function toggleSpecificPlayersMenu() {
  // Define a list of players
  const players = game.users.players.filter((u) => u.active);

  // Create buttons for each player
  const createButtons = (player) => {
    return `
    <button class="toggle-btn" data-player="${player.name}" data-playerId="${player.id}" data-status="true">On</button>
    <button class="toggle-btn" data-player="${player.name}" data-playerId="${player.id}" data-status="false">Off</button>
  `;
  };

  // Create the dialogue content
  let content = "<table>";
  players.forEach((player) => {
    content += `
    <tr style="text-align: center;">
      <td><img src="${
        player?.character?.img ?? player.avatar
      }" width="50" height="50"/></td>
      ${
        player?.character
          ? "<td>" +
            player?.character?.name +
            "<br />(" +
            player.name +
            ")</td>"
          : "<td>" + player.name + "</td>"
      }
      <td>${createButtons(player)}</td>
    </tr>
  `;
  });
  content += "</table>";

  // Display the dialogue box
  foundry.applications.api.DialogV2.wait({
    window: {
      title: "Player Status",
    },
    content: content,
    buttons: [],
    render: (event) => {
      const html = event.target.element;
      // Add click handler for each image
      $(html)
        .find(".toggle-btn")
        .click((ev) => {
          const playerId = ev.currentTarget.dataset.playerid;
          const status = ev.currentTarget.dataset.status === "true";

          socketlib.modules
            .get("ready-for-the-stage")
            .executeAsUser("toggleSpecificPlayer", playerId, status);
        });
    },
  });
}

function quickToggleStage() {
  const ids = Object.keys(Theatre.instance.stage);
  const playerCharactersAndUsers = getActivePlayerIDsAndCharacterIDs();
  const activeTheatreActorIDs = Theatre.instance.portraitDocks.map((item) =>
    getActorIdFromTheatreId(item.imgId),
  );

  const relevantActors =
    canvas.tokens.controlled?.length > 0
      ? canvas.tokens.controlled.map((t) => t.actor)
      : game.user.character
        ? [game.user.character]
        : [];

  // If any tokens from the group are on the board, remove them, else add
  const addOrRemove = relevantActors.some((act) =>
    activeTheatreActorIDs.includes(act.id),
  )
    ? "remove"
    : "add";

  relevantActors.forEach((act) => {
    if (playerCharactersAndUsers.some((pc) => pc.charID === act.id)) {
      socketlib.modules
        .get("ready-for-the-stage")
        .executeAsUser(
          "toggleSpecificPlayer",
          playerCharactersAndUsers.find((pc) => pc.charID === act.id).userID,
          addOrRemove === "add",
        );
    } else if (addOrRemove === "remove") {
      if (act.id !== game.user.character?.id) {
        Theatre.instance.functions.removeFromNavBar(act);
      } else {
        deactivateStagedActor(act);
      }
    } else if (addOrRemove === "add") {
      if (!ids.includes(getTheatreIdFromActorId(act.id))) {
        Theatre.instance.functions.addToNavBar(act);
      }
      activateStagedActor(act);
    }
  });
}

function toggleSelectedTokensAndStage() {
  if (Object.keys(theatre.stage).length > 0) {
    game.readyForStage.clearYourStage();
  } else {
    game.readyForStage.quickToggleStage();
  }
}

export function getTheatreIdFromActorId(actorID) {
  return `theatre-${actorID}`;
}

export function getActorIdFromTheatreId(theatreID) {
  return theatreID.replace("theatre-", "");
}

function activateStagedActor(actor) {
  const ids = Object.keys(Theatre.instance.stage);
  Theatre.instance.functions.activateStagedByID(
    ids.indexOf(getTheatreIdFromActorId(actor.id)),
  );
}

function deactivateStagedActor(actor) {
  const ids = Object.keys(Theatre.instance.stage);
  Theatre.instance.functions.removeFromStagedByID(
    ids.indexOf(getTheatreIdFromActorId(actor.id)),
  );
}

function getActivePlayerIDsAndCharacterIDs() {
  return game.users.players
    .filter((p) => p.active)
    .map((p) => ({ userID: p.id, charID: p?.character?.id }));
}
