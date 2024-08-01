export let locraw = {server: null, gametype: null, mode: null, map: null};

register("worldLoad", () => {
  ChatLib.command("locraw");
})

register("chat", (server, gametype, mode, map, event) => {
  locraw.server = server;
  locraw.gametype = gametype;
  locraw.mode = mode;
  locraw.map = map;
}).setCriteria('{"server":"${server}","gametype":"${gametype}","mode":"${mode}","map":"${map}"}');