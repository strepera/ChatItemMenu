import { settings } from "../config.js";
let Settings = settings.settings;
import RenderLib from "../../RenderLib/index.js";
import renderBeaconBeam from "../../BeaconBeam";
import { when } from "../utils/utils.js";

function addWaypoint(x, y, z, name) {
  waypoints.push({
    x: x,
    y: y,
    z: z,
    time: Date.now(),
    name: name
  })
  new Message(
    new TextComponent(`&e[ChatItemMenu] Added waypoint at &b${x} ${y} ${z} &7(${name})`),
    new TextComponent(" &c[Delete]").setClick("run_command", `/cimwaypointsdelete ${name}`)
  ).chat();
}

register("messageSent", (message, event) => {
  if (!Settings.get("Coords in Chat")) return;
  let newMessage = message;

  newMessage = newMessage.replaceAll("[coords]", `x: ${Math.floor(Player.getX())}, y: ${Math.floor(Player.getY())}, z: ${Math.floor(Player.getZ())}`);

  if (newMessage != message) {
    cancel(event);
    ChatLib.say(newMessage);
  }
})

let waypoints = []

register("chat", (message) => {
  if (!Settings.get("Grab Coords from Chat")) return;
  if (match = message.match(/^(?:.*?)?(?:(?:\[(?:.*?)\] )*)([a-zA-Z0-9_]{1,25})(?: \[(?:.*?)\])?: (.*)$/)) {
    if (match2 = match[2].match(/([^-0-9]+ )?(?:x: )?(-?\d+),? (?:y: )?(-?\d+),? (?:z: )?(-?\d+)/)) {
      let x = parseFloat(match2[2]);
      let y = parseFloat(match2[3]);
      let z = parseFloat(match2[4]);
      addWaypoint(x, y, z, `${(match2[1].trim().replace(/:$/, ""))?? match[1]}`);
    }
  }
}).setCriteria("${message}")

register("worldLoad", () => {
  waypoints = [];
})

when(() => waypoints != [], 
  register("renderWorld", () => {
    waypoints.forEach((waypoint) => {
      renderBeaconBeam(waypoint.x, waypoint.y, waypoint.z, 0, 0.5, 1, 1, false);
      RenderLib.drawInnerEspBox(waypoint.x + 0.5, waypoint.y, waypoint.z + 0.5, 1, 1, 0, 0.5, 1, 1, true);
      Tessellator.drawString(waypoint.name, waypoint.x + 0.5, waypoint.y + 0.5, waypoint.z + 0.5, 16777215, true, 1, true);
    })
  })
)

register("command", () => {
  ChatLib.chat("&9&lWaypoints");
  if (waypoints.length == 0) {
    ChatLib.chat("&r &r&c&lNone");
    return;
  }
  waypoints.forEach((waypoint) => {
    new Message(
      new TextComponent("&r &r" + waypoint.name),
      new TextComponent(" &a[Copy]").setClick("run_command", `/ct copy ${waypoint.name}: ${waypoint.x} ${waypoint.y} ${waypoint.z}`),
      new TextComponent(" &c[Delete]").setClick("run_command", `/cimwaypointsdelete ${waypoint.name}`)
    ).chat();
  })
}).setName("cimwaypoints").setAliases(["cimwp", "cimwaypoint"]);

register("command", (...args) => {
  waypoints = waypoints.filter(waypoint => waypoint.name != args.join(" "));
  ChatLib.chat(`&eDeleted waypoint: ` + args.join(" "));
}).setName("cimwaypointsdelete")