import RenderLib from "../../RenderLib/index.js";
import { settings } from '../config.js';
import { locraw } from "../utils/locraw.js";
let Settings = settings.settings;
import { drawLineToCoords, when } from "../utils/utils.js";

let nearbyChests = [];
let chestCount = 0;

when(() => Settings.get("Treasure Chest Helper") && locraw.mode == "crystal_hollows" && nearbyChests.length !== 0,
  register("renderWorld", () => {
    nearbyChests.forEach(chest => {
      let x1 = Player.getRenderX();
      let y1 = Player.getRenderY();
      let z1 = Player.getRenderZ();
      let x2 = chest.getX();
      let y2 = chest.getY();
      let z2 = chest.getZ();
      RenderLib.drawEspBox(x2 + 0.5, y2, z2 + 0.5, 0.9, 0.9, 1, 1, 1, 0.7, false);
      drawLineToCoords(x1, y1 + Player.asPlayerMP().getEyeHeight(), z1, x2 + 0.5, y2 + 0.5, z2 + 0.5, 1, 1, 1, 1, false);
    })
  })
)

when(() => Settings.get("Treasure Chest Helper") && locraw.mode == "crystal_hollows",
  register("packetReceived", (packet, event) => {
    Client.scheduleTask(4, () => {
      nearbyChests = World.getAllTileEntitiesOfType(net.minecraft.tileentity.TileEntityChest).filter(chest => Player.asPlayerMP().distanceTo(chest.getX(), chest.getY(), chest.getZ()) < 8);
    })
  }).setFilteredClass(net.minecraft.network.play.server.S23PacketBlockChange)
)

let rewardsMessagesSending = false;
let rewardsMessage = [];
register("chat", (message, event) => {
  if (!Settings.get("Treasure Chest Helper") || locraw.mode != "crystal_hollows") return; 

  if (message == "&aYou uncovered a treasure chest!&r") {
    cancel(event);
    chestCount += 1;
    Client.showTitle("", "&aTreasure Chest Spawned &7(" + (chestCount) + " left)", 4, 20, 4);
    Client.scheduleTask(4, () => {
      nearbyChests = World.getAllTileEntitiesOfType(net.minecraft.tileentity.TileEntityChest).filter(chest => Player.asPlayerMP().distanceTo(chest.getX(), chest.getY(), chest.getZ()) < 8);
      chestCount = nearbyChests.length;
    })
  }

  if (message.trim() == "&r&6&lCHEST LOCKPICKED &r") {
    chestCount -= 1;
    Client.showTitle("", "&7" + (chestCount) + " left", 4, 20, 4);
    rewardsMessagesSending = true;
    rewardsMessage = [];
    cancel(event);
    return;
  }

  if (message == "&e&l▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬&r") {
    if (rewardsMessagesSending) {
      ChatLib.chat(rewardsMessage.join(", "));
    }
    rewardsMessagesSending = !rewardsMessagesSending;
    cancel(event);
    return;
  }

  if (rewardsMessagesSending) {
    cancel(event);
    if (message.trim() != "&r&a&lREWARDS&r" && message.trim()) {
      rewardsMessage.push(message.trim());
    }
  }
  
}).setCriteria("&r${message}");