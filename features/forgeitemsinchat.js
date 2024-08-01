import { locraw } from "../utils/locraw";

register("guiMouseClick", (_, __, ___, gui, event) => {
  if (locraw.mode != "mining_3") return;
  let container = Player.getContainer();
  if (!container) return;

  if (container.getName() != "Confirm Process") return;
  if (!gui?.getSlotUnderMouse()) return;

  const confirmItem = new Slot(gui.getSlotUnderMouse())?.getItem();
  if (!confirmItem) return;
  if (!confirmItem.getName().includes("Confirm")) return;
  for (let line of confirmItem.getLore()) {
    if (ChatLib.removeFormatting(line).includes("You don't have the required items!")) {
      return;
    }
  }

  const item = container.getStackInSlot(16);
  ChatLib.chat(`&aStarted forging &f${item.getName()}`);
})