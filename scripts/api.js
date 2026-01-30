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

  if (!game.user.isGM) {
    const mainPC = activeTheatre.shift();
    Theatre.instance.removeInsertById(mainPC.id);
  }

  activeTheatre.forEach((thespian) => {
    Theatre.instance.functions.removeFromNavBar(thespian);
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
  const activeTheatreActorIDs = Object.entries(Theatre.instance.stage)
    .filter(([id, entry]) =>
      entry.navElement.classList.contains(
        "theatre-control-nav-bar-item-active",
      ),
    )
    .map(([id, entry]) => entry.actor.id);

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
    if (addOrRemove === "remove") {
      if (act.id !== game.user.character?.id) {
        Theatre.instance.functions.removeFromNavBar(act);
      } else {
        Theatre.instance.removeFromStagedByID(getTheatreIdFromActorId(act.id));
      }
    } else if (addOrRemove === "add") {
      Theatre.instance.functions.addToNavBar(act);
      Theatre.instance.functions.activateStagedByID(
        getTheatreIdFromActorId(act.id),
      );
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
