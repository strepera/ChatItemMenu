import { settings } from "../config.js";
import RenderLib from "../../RenderLib/index.js";
import { locraw } from "../utils/locraw";
import { Keybind } from "KeybindFix"
import { when } from "../utils/utils.js";

const warpToPest = new Keybind("Warp to Pest", 56, "ChatItemMenu");

export function getCurrentPlot() {
  for (let line of Scoreboard.getLines()) {
    if (match = ChatLib.removeFormatting(line).replace(/[^A-Za-z0-9]/g, "").match(/Plot(\d+)/)) {
      return match[1];
    }
  }
  return;
}

let pests = {};

register("chat", (message, event) => {
  if (locraw.mode != "garden") return;
  if (match = message.match(/^(?:\S+) (\d+) Pest(?:s | )have spawned in Plot - (\d+)!/)) {
    let pestCount = match[1];
    let plot = match[2];
    if (!pests[plot]) {
      pests[plot] = pestCount;
    }
    else {
      pests[plot] = Number(pests[plot]) + Number(pestCount);
    }
    
    cancel(event);
    ChatLib.chat(`&a[ChatItemMenu] &c${pestCount} &aPests have spawned in plot &c${plot}`);
  }
}).setCriteria("${message}");

register("chat", (message, event) => {
  if (locraw.mode != "garden") return;
  if (!message.match(/^You received (.+) for killing a (.+)!/)) return;

  let currentPlot = getCurrentPlot();
  if (!currentPlot) return;

  if (pests[currentPlot] && pests[currentPlot] > 0) {
    pests[currentPlot] = Number(pests[currentPlot]) - 1;
  }
}).setCriteria("${message}");

warpToPest.registerKeyPress(() => {
  for (let plot of Object.keys(pests)) {
    if (pests[plot] <= 0) continue;
    ChatLib.command(`plottp ${plot}`);
    return;
  }
  ChatLib.command(`warp garden`);
})

const plotOrder = {
  1: [3, 2],
  2: [2, 3],
  3: [4, 3],
  4: [3, 4],
  5: [2, 2],
  6: [4, 2],
  7: [2, 4],
  8: [4, 4],
  9: [3, 1],
  10: [1, 3],
  11: [5, 3],
  12: [3, 5],
  13: [2, 1],
  14: [4, 1],
  15: [1, 2],
  16: [5, 2],
  17: [1, 4],
  18: [5, 4],
  19: [2, 5],
  20: [4, 5],
  21: [1, 1],
  22: [5, 1],
  23: [1, 5],
  24: [5, 5]
}

const startX = -240;
const startZ = -240;

when(() => settings.pestHelper && locraw.mode == "garden" && Object.keys(pests).length !== 0,
  register("renderWorld", () => {
    for (let plot of Object.keys(pests)) {
      if (pests[plot] <= 0) continue;
      let x = plotOrder[plot][0];
      let z = plotOrder[plot][1];
      RenderLib.drawInnerEspBox(startX + x*96 - 48, 0, startZ + z*96 - 48, 96, 100, 0, 1, 0, 0.3, false);
      Tessellator.drawString(pests[plot], startX + x*96 - 48, 80, startZ + z*96 - 48, 16646655, false, 10, true);
    }
  })
)