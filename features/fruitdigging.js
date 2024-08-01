import RenderLib from "../../RenderLib";
import { settings } from "../config.js";
import { locraw } from "../utils/locraw";
import { when } from "../utils/utils.js";
let Settings = settings.settings;

let lastBombCount;
let blocks = [];
let strings = [];

function isInFruitDigging() {
  let lines = Scoreboard.getLines();
  for (let line of lines) {
    if (ChatLib.removeFormatting(line).trim().includes("Fruit")) {
      return true;
    }
  }
  return false;
}

when(() => Settings.get("Fruit Digging Helper") && lastBombCount !== null && locraw.mode == "hub" && isInFruitDigging(), 
  register("tick", () => {
    Client.scheduleTask(2, () => {
      let block = raytraceBlock(5);
      if (block.type.getName() != "Sandstone") return;
      let pushBlocks = [
        World.getBlockAt(block.x + 1, block.y, block.z + 1),
        World.getBlockAt(block.x, block.y, block.z + 1),
        World.getBlockAt(block.x - 1, block.y, block.z + 1),
        World.getBlockAt(block.x + 1, block.y, block.z - 1),
        World.getBlockAt(block.x, block.y, block.z - 1),
        World.getBlockAt(block.x - 1, block.y, block.z - 1),
        World.getBlockAt(block.x + 1, block.y, block.z),
        World.getBlockAt(block.x - 1, block.y, block.z)
      ];
      for (let block of pushBlocks) {
        let obj = {count: lastBombCount, pos: {x: block.x, y: block.y, z: block.z}};
        if (!JSON.stringify(strings).includes(JSON.stringify(obj))) {
          strings.push(obj);
        }
        if (lastBombCount === 0) {
          if (JSON.stringify(blocks).includes(JSON.stringify({x: block.x, y: block.y, z: block.z}))) continue;
          blocks.push({name: block.type.getName(), pos: {x: block.x, y: block.y, z: block.z}, safe: true});
        }
      }
      lastBombCount = null;
    })
  })
)

register("chat", (count, event) => {
  lastBombCount = Number(count);
}).setCriteria("&r&c&lMINES! &r&fThere are &r&6${count} &r&fbombs hidden nearby.&r");

register("chat", () => {
  blocks = [];
  strings = [];
  lastBombCount = null;
}).setCriteria("&r&f                               &r&6&lFruit Digging&r");

register("chat", () => {
  blocks = [];
  strings = [];
  lastBombCount = null;
}).setCriteria("&e[NPC] Carnival Pirateman&f: &rGood luck, matey!&r");

when(() => Settings.get("Fruit Digging Helper") && locraw.mode == "hub" && (blocks != [] || strings != []) && isInFruitDigging(), 
  register("renderWorld", (ticks) => {
    for (let block of blocks) {
      if (block.name != "Sand") continue;
      let red = block.safe? 0 : 1;
      RenderLib.drawInnerEspBox(block.pos.x + 0.5, block.pos.y + 0.05, block.pos.z + 0.5, 1, 1, red, 1, 0, 0.2, false);
    }
    for (let string of strings) {
      Tessellator.drawString(string.count, string.pos.x + 0.5, string.pos.y + 1.3, string.pos.z + 0.5, 16777215, true, 3, true);
    }
  })
)

function raytraceBlock(distance) {
  let raytrace = Player.getPlayer().func_174822_a(distance, 0) // rayTrace()
  let blockpos = raytrace.func_178782_a() // getBlockPos()
  if (!blockpos) return null
  return World.getBlockAt(new BlockPos(blockpos))
}