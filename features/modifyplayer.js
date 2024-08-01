// inspired by the Spin module
import { settings } from "../config.js";
import { when } from "../utils/utils.js";

let rot = 0;
when(() => settings["Player Spin Toggle"],
  register("step", (i) => {
    rot = 180 - ((i*settings["Player Spin"]) % 360);
  }).setFps(100)
)

const EntityOtherPlayerMP = Java.type('net.minecraft.client.entity.EntityOtherPlayerMP');
const EntityPlayerSP = Java.type('net.minecraft.client.entity.EntityPlayerSP');

when(() => settings["Player Height Toggle"] || settings["Player Spin Toggle"], 
  register("renderEntity", (entity) => {
    if (entity.getName() != Player.getName()) return;
    if (entity.entity instanceof EntityOtherPlayerMP || entity.entity instanceof EntityPlayerSP) {
      Tessellator.pushMatrix();
      if (settings["Player Height Toggle"]) {
        if (settings["Apply To All Players"] && entity.getName() != Player.getName()) {
          Tessellator.translate(0, (entity.getRenderY() - Player.getRenderY())*2, 0);
        }
        let height = Number(settings["Player Height"]);
        if (isNaN(height)) return;
        if (height < 0) {
          Tessellator.translate(0, height * -2, 0);
        }
        Tessellator.scale(1, height, 1);
      }
      if (settings["Player Spin Toggle"]) {
        Tessellator.rotate(rot, 0, 1, 0);
      }
    }
  })
)

when(() => settings["Player Height Toggle"] || settings["Player Spin Toggle"], 
  register("postRenderEntity", (entity) => {
    if (entity.getName() != Player.getName()) return;
    if (entity.entity instanceof EntityOtherPlayerMP || entity.entity instanceof EntityPlayerSP) {
      Tessellator.popMatrix();
    }
  })
)