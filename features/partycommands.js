let requestedPlaytime = false;
let playTimeChat = "";

import { settings } from "../config.js";

register("chat", (hours, minutes) => {
  if (!requestedPlaytime || !playTimeChat) return;
  ChatLib.say(`${playTimeChat}Playtime: ${hours} hours, ${minutes} minutes`);
  requestedPlaytime = false;
}).setCriteria("&aYou have ${hours} hours and ${minutes} minutes playtime!&r")

register("chat", () => {
  requestedPlaytime = false;
}).setCriteria("You don't have enough playtime to use this command, try again later!")

register("chat", (message, event) => {
  if (match = message.match(/([A-Za-z]+) > \[[^\]]*\] ([A-Za-z0-9_]+)(?: \[[A-Za-z]+\])?: !(\S+)/)) {
    if (settings["Self Commands"] && Player.getName() != match[2]) return;
    let chat = "";
    if (match[1] == "Party") {
      chat = "/pc ";
    }
    else if (match[1] == "Guild") {
      chat = "/gc ";
    }
    if (!chat) return;
    switch (match[3]) {
      case "time":
        if (!settings["Time Command"]) break;
        ChatLib.say(chat + new Date(Date.now()).toLocaleTimeString());
        break;
      case "playtime":
        if (!settings["Playtime Command"]) break;
        requestedPlaytime = true;
        playTimeChat = chat;
        ChatLib.command("playtime");
      case "ptme":
        if (!settings["PT me Command"]) break;
        if (chat != "/pc ") break;
        ChatLib.command("p transfer " + match[2]);
        break;
      default:
        break;
    }
  }
}).setCriteria("${message}")