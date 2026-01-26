export function createAPI() {
  game.readyForStage = {
    bringPlayersToTheStage,
    clearYourStage,
    clearAllStages,
    toggleSpecificPlayersMenu,
    toggleSelectedTokensOnStage,
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
  const activeTheatre = Object.values(Theatre.instance.stage).map(
    (c) => c.actor,
  );

  activeTheatre.forEach((at) => {
    Theatre.instance.functions.removeFromNavBar(at);
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

function toggleSelectedTokensOnStage() {
  let activeTheatre = Object.entries(Theatre.instance.stage).map(
    ([id, entry]) => ({
      name: entry.actor.name,
      id: id,
    }),
  );

  const t_list = [];
  const activeTheatreNames = activeTheatre.map((a) => a.name);

  canvas.tokens.controlled.forEach((t) => {
    const actorName = t.actor.name;
    if (activeTheatreNames.includes(actorName)) {
      Theatre.instance.functions.removeFromNavBar(t.actor);
    } else {
      Theatre.instance.functions.addToNavBar(t.actor);
      t_list.push(actorName);
    }
  });

  activeTheatre = Object.entries(Theatre.instance.stage).map(([id, entry]) => ({
    name: entry.actor.name,
    id: id,
  }));

  t_list.forEach((name) => {
    const entry = activeTheatre.find((e) => e.name === name);
    if (entry) {
      Theatre.instance.activateInsertById(entry.id);
    }
  });
}
