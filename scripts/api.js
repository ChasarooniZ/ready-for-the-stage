export function createAPI() {
  game.readyForStage = {
    bringPlayersToTheStage,
    clearYourStage,
    clearAllStages,
  };
}

function bringPlayersToTheStage() {
  //execute this macro on players
  socketlib.modules.get("ready-for-the-stage").executeForUsers(
    "bringPlayersToStage",
    game.users.players.map((p) => p.id)
  );
}

function clearYourStage() {
  let activeTheatre = [];

  Object.entries(Theatre.instance.stage).forEach((c) => {
    activeTheatre.push({
      name: c[1].actor.name,
      id: c[0],
    });
  });

  activeTheatre.forEach((at) => {
    Theatre.instance.functions.removeFromNavBar(game.actors.getName(at.name));
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
  new Dialog({
    title: "Player Status",
    content: content,
    buttons: {},
    render: (html) => {
      // Add event listeners for buttons
      html.find(".toggle-btn").click((ev) => {
        const playerId = ev.currentTarget.dataset.playerId;
        const status = ev.currentTarget.dataset.status === "true";

        socketlib.modules
          .get("ready-for-the-stage")
          .executeAsUser("toggleSpecificPlayer", playerId, status);
      });
    },
  }).render(true);
}
