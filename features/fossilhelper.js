import { inventoryPosition, when } from "../utils/utils";

let fossilPercent = 0;

const images = {
  8.33: [Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Spine.png")],
  7.14: [Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Helix.png")],
  7.69: [Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Footprint.png"), Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Claw.png")],
  10: [Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Webbed.png")],
  12.5: [Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Tusk.png")],
  9.09: [Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Clubbed.png")],
  6.25: [Image.fromFile("./config/ChatTriggers/modules/ChatItemMenu/assets/Ugly.png")]
}

register("guiOpened", () => {
  Client.scheduleTask(2, () => {
    if (Player.getContainer() && Player.getContainer().getName() != "Fossil Excavator") return;
    fossilPercent = 0;
  })
})

when(() => Player.getContainer() && Player.getContainer().getName() == "Fossil Excavator",
  register("itemTooltip", (lore, item) => {
    if (!item.getName().includes("Fossil") || fossilPercent !== 0) return;

    for (let line of lore) {
      if (match = ChatLib.removeFormatting(line).match(/Fossil Excavation Progress: ([0-9.]+)%/)) {
        fossilPercent = Number(match[1]);
      }
    }
  })
)

when(() => Player.getContainer().getName() == "Fossil Excavator",
  register("guiRender", () => {
    if (!images[fossilPercent]) return;
    images[fossilPercent].forEach((image, index) => {
      image.draw(inventoryPosition.getX() + inventoryPosition.getWidth(), inventoryPosition.getY()+index*110, 100, 100);
    });
  })
)