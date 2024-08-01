import { settings } from "../config.js";
import { when } from "../utils/utils";

const EntityArrow = Java.type('net.minecraft.entity.projectile.EntityArrow');
const EntityOtherPlayerMP = Java.type('net.minecraft.client.entity.EntityOtherPlayerMP');
const EntityPlayerSP = Java.type('net.minecraft.client.entity.EntityPlayerSP');
let positions = {};

function setPositions() {
  World.getAllEntitiesOfType(EntityArrow).forEach(entity => {
    let shootingEntity = entity.entity.field_70250_c;
    if (shootingEntity instanceof EntityOtherPlayerMP && !settings["Show other Player's Trails"]) return;
    else if (!(shootingEntity instanceof EntityPlayerSP) && !settings["Show all arrow trails"]) return;
    let uuid = entity.getUUID().toString();
    if (!positions[uuid]) {
      positions[uuid] = {arrows: [], time: Date.now()};
    }
    positions[uuid].arrows.push({
      x: entity.getRenderX(),
      y: entity.getRenderY(),
      z: entity.getRenderZ(),
      time: Date.now()
    })
  })
}

when(() => settings["Arrow Trails"],
  register("step", () => {
    setPositions();
    for (let arrow in positions) {
      positions[arrow].arrows = positions[arrow].arrows.filter(position => Date.now() - position.time < 2000);
      if (Date.now() - positions[arrow].time > 5000 || positions[arrow].arrows == []) {
        delete positions[arrow];
      }
    }
  }).setFps(5)
)

when(() => settings["Arrow Trails"] && Player.getHeldItem() && Player.getHeldItem().getID() == 261,
  register("clicked", (mouseX, mouseY, button) => {
    Client.scheduleTask(5, () => {
      setPositions();
    })
  })
)
when(() => settings["Arrow Trails"] && Player.getHeldItem() && Player.getHeldItem().getID() == 261,
  register("dragged", (mouseX, mouseY, button) => {
    Client.scheduleTask(5, () => {
      setPositions();
    })
  })
)

when(() => settings["Arrow Trails"],
  register("renderWorld", () => {
    for (let arrow of Object.values(positions)) {
      GL11.glBlendFunc(770,771);
      GL11.glEnable(GL11.GL_BLEND);
      GL11.glLineWidth(settings["Arrow Trail Size"]/5);
      GL11.glDisable(GL11.GL_TEXTURE_2D);

      Tessellator.begin(GL11.GL_LINE_STRIP);
      arrow.arrows.forEach(pos => {
        Tessellator.pos(pos.x, pos.y, pos.z).tex(0, 0);
      })
      Tessellator.draw();

      GL11.glEnable(GL11.GL_TEXTURE_2D);
      GL11.glDisable(GL11.GL_BLEND);
    }
  })
)