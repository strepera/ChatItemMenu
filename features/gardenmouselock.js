import { settings } from "../config.js";
import { locraw } from "../utils/locraw.js";
import { when } from "../utils/utils.js";
import { getCurrentPlot } from "./pestborder.js";
let Settings = settings.settings;

const gameSettings = Client.getMinecraft().field_71474_y; //gameSettings
let initialSensitivity = gameSettings.field_74341_c;

let lastBlockBreak = 0;

when(() => Settings.get("Lock Mouse Sensitivity"), 
  register("renderOverlay", () => {
    if (gameSettings.field_74341_c > 0) {
      initialSensitivity = gameSettings.field_74341_c;
    }
    gameSettings.field_74341_c = initialSensitivity;

    if (locraw.mode != "garden") return;
    if (!getCurrentPlot()) return;
    let item = Player.getHeldItem();
    if (!item) return;
    let nbt = item.getRawNBT(); 
    if (nbt.includes("Roll em'") || nbt.includes("Counter:") || nbt.includes("Swift Slicer") || nbt.includes("Fun Guy Bonus") || item.getName().includes("Cocoa Chopper")) {
      if (Date.now() - lastBlockBreak < 3000) {
        gameSettings.field_74341_c = -1/3; //mouseSensitivity
        let string = "&cMouse locked for " + (3000 - (Date.now() - lastBlockBreak)) + " ms";
        Renderer.drawString(string, Renderer.screen.getWidth()/2-Renderer.getStringWidth(string)/2, Renderer.screen.getHeight()/2, true);
      }
      else {
        gameSettings.field_74341_c = 0; //mouseSensitivity
        let yawString = `&6Yaw &e${Player.getYaw().toFixed(2)}`;
        Renderer.drawString(yawString, Renderer.screen.getWidth()/2-Renderer.getStringWidth(yawString)/2, Renderer.screen.getHeight()/2, true);
        let pitchString = `&6Pitch &e${Player.getPitch().toFixed(2)}`;
        Renderer.drawString(pitchString, Renderer.screen.getWidth()/2-Renderer.getStringWidth(pitchString)/2, Renderer.screen.getHeight()/2+10, true);
      }
    }
  })
)

register("blockBreak", () => {
  lastBlockBreak = Date.now();
})