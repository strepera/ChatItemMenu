import { locraw } from "../utils/locraw.js";
import { when } from "../utils/utils.js";
import { settings } from "../config.js";
let Settings = settings.settings;
import RenderLib from "../../RenderLib/index.js";

let data = JSON.parse(FileLib.read("ChatItemMenu", "data/fairysouls.json"));
for (let island in data) {
  if (!Array.isArray(data[island])) continue;
  data[island].forEach((pos, index) => {
    let split = pos.split(",");
    data[island][index] = {x: Number(split[0]), y: Number(split[1]), z: Number(split[2])};
  })
}
let found = FileLib.read("ChatItemMenu", "player_data/foundfairysouls.json");
if (!found) {
  found = {
    "hub": [
  
    ],
    "combat_1": [
  
    ],
    "crimson_isle": [
  
    ],
    "combat_3": [
  
    ],
    "foraging_1": [
  
    ],
    "farming_1": [
  
    ],
    "mining_1": [
  
    ],
    "mining_2": [
  
    ],
    "mining_3": [
  
    ],
    "winter": [
  
    ],
    "dungeon_hub": [
  
    ]
  }
  FileLib.write("ChatItemMenu", "player_data/foundfairysouls.json", JSON.stringify(found));
}
else {
  found = JSON.parse(found);
}

when(() => Settings.get("Fairy Soul Waypoints") && data[locraw.mode], 
  register("renderWorld", (ticks) => {
    for (let soul of data[locraw.mode]) {
      if (!soul || JSON.stringify(found[locraw.mode]).includes(JSON.stringify(soul))) continue;
      let colour = Settings.get("Fairy Soul Colour");
      RenderLib.drawInnerEspBox(soul.x + 0.5, soul.y, soul.z + 0.5, w = 1, h = 1, r = colour[0]/255, g = colour[1]/255, b = colour[2]/255, a = colour[3]/255, true);
      Tessellator.drawString(`Fairy Soul ${data[locraw.mode].indexOf(soul) + 1}`, soul.x + 0.5, soul.y + 0.5, soul.z + 0.5, -377430, true, 1, true);
    }
  })
)

register("attackEntity", (entity, event) => {
  if (!Settings.get("Fairy Soul Waypoints") || !data[locraw.mode]) return;
  let x = entity.getX() - 0.5;
  let y = entity.getY() + 1.46875;
  let z = entity.getZ() - 0.5;
  for (let soul of data[locraw.mode]) {
    if (x == soul.x && y == soul.y && z == soul.z && !JSON.stringify(found[locraw.mode]).includes(JSON.stringify(soul))) {
      found[locraw.mode].push(soul);
      FileLib.write("ChatItemMenu", "player_data/foundfairysouls.json", JSON.stringify(found));
    }
  }
})
