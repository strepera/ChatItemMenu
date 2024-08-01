import { getItemFromNBT, when } from "../utils/utils.js";
import { addDisplay, positionData } from "../utils/display.js";
import { settings } from "../config.js";
let Settings = settings.settings;

const ignoredItems = [
  "Quiver Flint Arrow",
  "Magical Map",
  "Your Score Summary",
  "SkyBlock Menu (Click)"
]

let removedItems = {};
let addedItems = {};
let lastInventory = [];
when(() => Settings.get("Pickup Log") && Player.getInventory(),
  register("step", () => {
    let inventory = Player.getInventory();
    if (!inventory) return;

    inventory.getItems().forEach((item, index) => {
      if (index > 35) return; // armour
      if (item && ignoredItems.includes(ChatLib.removeFormatting(item.getName()).trim())) return;
      if (!item) {
        if (lastInventory[index] != null) {
          let goneItem = getItemFromNBT(lastInventory[index]);
          let name = goneItem.getName();
          if (inventory.getItems().map(item => {if (item) return item.getRawNBT()}).find(item => item == lastInventory[index])) return;
          if (removedItems[name]) {
            removedItems[name] = {
              name: name,
              item: goneItem,
              difference: goneItem.getStackSize() - removedItems[name].difference,
              time: Date.now()
            }
          }
          else {
            removedItems[name] = {
              name: name,
              item: goneItem,
              difference: goneItem.getStackSize() * -1,
              time: Date.now()
            }
          }
        }
      }
      else if (!lastInventory.includes(item.getRawNBT())) {
        let lastItem = null;
        if (lastInventory[index] != null) {
          lastItem = getItemFromNBT(lastInventory[index]);
        }
        let difference = item.getStackSize();
        if (item.getName() == lastItem?.getName()) {
          difference = item.getStackSize() - lastItem.getStackSize();
          if (difference == 0) return;
        }
        let data = {
          name: item.getName(),
          item: item,
          difference: difference,
          time: Date.now()
        }
        if (difference > 0) {
          if (addedItems[data.name]) {
            addedItems[data.name] = {
              name: data.name,
              item: data.item,
              difference: addedItems[data.name].difference + data.difference,
              time: Date.now()
            }
          }
          else {
            addedItems[data.name] = data;
          }
        }
        else {
          if (removedItems[data.name]) {
            removedItems[data.name] = {
              name: data.name,
              item: data.item,
              difference: removedItems[data.name].difference + data.difference,
              time: Date.now()
            }
          }
          else {
            removedItems[data.name] = data;
          }
        }
      }
    })

    lastInventory = [];
    inventory.getItems().forEach((item, index) => {
      if (!item) {
        lastInventory.push(null);
      }
      else {
        lastInventory.push(item.getRawNBT());
      }
    })
  }).setFps(4)
)


let worldLoadTime = 0;

register("step", () => {
  for (let item in addedItems) {
    if (Date.now() - addedItems[item].time > 3000) {
      delete addedItems[item];
    }
    if (Date.now() - worldLoadTime < 3000) {
      delete addedItems[item];
    }
  }
  for (let item in removedItems) {
    if (Date.now() - removedItems[item].time > 3000) {
      delete removedItems[item];
    }
    if (Date.now() - worldLoadTime < 3000) {
      delete removedItems[item];
    }
  }
}).setFps(4)

register("worldLoad", () => {
  worldLoadTime = Date.now();
})

when(() => Settings.get("Pickup Log") && (Object.keys(addedItems).length > 0 || Object.keys(removedItems).length > 0),
  register("renderOverlay", () => {
    let index = 0;
    Object.values(addedItems).forEach((item) => {
      Renderer.drawString("&a+" + item.difference + "x " + item.name, positionData.pickupLog.x*Renderer.screen.getWidth(), positionData.pickupLog.y*Renderer.screen.getHeight() + index*10, true);
      index++;
    })

    Object.values(removedItems).forEach((item) => {
      Renderer.drawString("&c" + item.difference + "x " + item.name, positionData.pickupLog.x*Renderer.screen.getWidth(), positionData.pickupLog.y*Renderer.screen.getHeight() + index*10, true);
      index++;
    })
  })
)

addDisplay(
  "pickupLog",
  [
    {
      text: "Pickup Log"
    }
  ],
  [
    {
      color: Renderer.color(0, 0, 0, 150),
      w: 40,
      h: 40
    }
  ],
  x = 0.8,
  y = 0.8
)