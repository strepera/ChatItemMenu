import RenderLib from "../../RenderLib/index.js";
import { settings } from "../config.js";
import { when } from "../utils/utils.js";
let Settings = settings.settings;

let teleporting = false;
let inRange = false;
let rangeString = "";

when(() => inRange, 
  register("renderCrosshair", (event) => {
    cancel(event);
  })
)

when(() => teleporting, 
  register("renderOverlay", () => {
    Renderer.drawString(rangeString, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(rangeString) / 2, Renderer.screen.getHeight() / 2, true);
  })
)

when(() => fireVeilTime && Settings.get("Fire Veil Cooldown Display"),
  register("renderOverlay", () => {
    let string = "&c" + (fireVeilTime - Date.now()) / 1000;
    if (fireVeilTime - Date.now() < 0) string = "&aAvailable";
    if (fireVeilTime - Date.now() > -5000) {
      Renderer.drawString(string, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(string) / 2, Renderer.screen.getHeight() / 2 + 8, true);
    }
    else {
      fireVeilTime = null;
    }
  })
)

let fireVeilTime;
const useKeybind = Client.getKeyBindFromDescription("key.use");

when(() => (Settings.get("Etherwarp Overlay") || Settings.get("Gyrokinetic Wand Overlay")) && Player.getHeldItem(),
  register("renderWorld", () => {
    teleporting = false;
    inRange = false;
    let hand = Player.getHeldItem()?.getName();
    if (!hand) return;
    if (hand.includes("Aspect of the Void")) {
      if (!Settings.get("Etherwarp Overlay")) return;
      if (!Player.isSneaking()) return;
      teleporting = true;
      let block = raytraceBlock(61);
      if (block.type.name == "tile.air.name") return rangeString = "&cOut of range";
      if (World.getBlockAt(block.x, block.y + 1, block.z).type.name !== "tile.air.name") return rangeString = "&cNo air above";
      inRange = true;
      rangeString = "&aIn range";
      let colour = Settings.get("Etherwarp Overlay Colour");
      RenderLib.drawInnerEspBox(block.x + 0.5, block.y, block.z + 0.5, 1, 1, colour[0]/255, colour[1]/255, colour[2]/255, colour[3]/255, true);
    }
    else if (hand.includes("Gyrokinetic Wand")) {
      if (!Settings.get("Gyrokinetic Wand Overlay")) return;
      let block = raytraceBlock(25);
      if (block.type.name == "tile.air.name") return;
      if (World.getBlockAt(block.x, block.y + 1, block.z).type.name !== "tile.air.name") return;
      let colour = Settings.get("Gyro Overlay Colour");
      RenderLib.drawCyl(block.x+0.5, block.y+1, block.z+0.5, brad = 9, trad = 10, height = 0.2, vert = 64, stacks = 2, rx = 0, ry = 90, rz = 90, r = colour[0]/255, g = colour[1]/255, b = colour[2]/255, a = colour[3]/255, true, false);
    }
  })
)

useKeybind.registerKeyDown(() => {
  let hand = Player.getHeldItem()?.getName();
  if (hand?.includes("Fire Veil Wand")) {
    if (!Settings.get("Fire Veil Cooldown Display")) return;
    fireVeilTime = Date.now() + 5000;
  }
})

function raytraceBlock(distance) {
  let raytrace = Player.getPlayer().func_174822_a(distance, 0) // rayTrace()
  let blockpos = raytrace.func_178782_a() // getBlockPos()
  if (!blockpos) return null
  return World.getBlockAt(new BlockPos(blockpos))
}