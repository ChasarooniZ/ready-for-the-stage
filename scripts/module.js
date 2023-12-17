Hooks.once('ready', async function() {
  if (!Theatre && !!game.user.character) {
    Theatre.instance.functions.addToNavBar(t.actor);
  }
});
