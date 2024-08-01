import { getItemFromNBT, Tooltip, formatNumber, getLongest, rarityColours, petLevels, petOffset, inventoryPosition, when } from "../utils/utils.js";
import { settings } from "../config.js";
import { locraw } from "../utils/locraw.js";
import { addDisplay, positionData } from "../utils/display.js";
let Settings = settings.settings;

const items = JSON.parse(FileLib.read('ChatItemMenu', 'data/items.json'));

let equipmentData = FileLib.read("ChatItemMenu", "player_data/equipment.json");
if (!equipmentData) {
  equipmentData = {
    equip: [],
    pet: null,
    expSharing: []
  }
  FileLib.write("ChatItemMenu", "player_data/equipment.json", JSON.stringify(equipmentData));
}
else {
  equipmentData = JSON.parse(equipmentData);
}

let pet;
let petInfo;
if (equipmentData.pet) pet = getItemFromNBT(equipmentData.pet);
let equipment = equipmentData.equip.map(item => getItemFromNBT(item));
let expSharing = equipmentData.expSharing.map(item => getItemFromNBT(item));

register("guiOpened", () => {
  Client.scheduleTask(2, () => {
    let container = Player.getContainer();
    if (container?.getName()?.match(/Pets \(\d+\/\d+\)/)) {
      if (!Settings.get("Pet Overlay")) return;
      for (let i = 0; i < container.getSize() - 36; i++) {
        let item = container.getStackInSlot(i);
        for (let line of item.getLore()) {
          if (line.includes("Click to despawn!")) {
            equipmentData.pet = item.getRawNBT();
            FileLib.write("ChatItemMenu", "player_data/equipment.json", JSON.stringify(equipmentData));
            pet = item;
            petInfo = JSON.parse(pet.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").get("petInfo").toString().replaceAll("\\", "").replace(/^"|"$/g, ''));
            break;
          }
        }
      }
    }
    else if (container?.getName() == "Exp Sharing") {
      let petSlot1 = container.getStackInSlot(30);
      let petSlot2 = container.getStackInSlot(31);
      let petSlot3 = container.getStackInSlot(32);
      equipmentData.expSharing = [petSlot1.getRawNBT(), petSlot2.getRawNBT(), petSlot3.getRawNBT()];
      FileLib.write("ChatItemMenu", "player_data/equipment.json", JSON.stringify(equipmentData));
      expSharing = [petSlot1, petSlot2, petSlot3];
    }
    if (!Settings.get("Equipment Display")) return;
    if (container?.getName() != "Your Equipment and Stats") return;
    equipmentData.equip = [];
    equipmentData.equip.push((container.getStackInSlot(10)?? new Item("minecraft:barrier")).getRawNBT());
    equipmentData.equip.push((container.getStackInSlot(19)?? new Item("minecraft:barrier")).getRawNBT());
    equipmentData.equip.push((container.getStackInSlot(28)?? new Item("minecraft:barrier")).getRawNBT());
    equipmentData.equip.push((container.getStackInSlot(37)?? new Item("minecraft:barrier")).getRawNBT());
    FileLib.write("ChatItemMenu", "player_data/equipment.json", JSON.stringify(equipmentData));
    equipment = equipmentData.equip.map(item => getItemFromNBT(item));
  })
})

register("guiMouseClick", (_, __, ___, gui, event) => {
  let container = Player.getContainer();
  if (!gui?.getSlotUnderMouse()) return;
  if (container?.getName()?.match(/Pets \(\d+\/\d+\)/)) {
    const item = new Slot(gui.getSlotUnderMouse())?.getItem();
    if (!item || !item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes")) return;
    if (item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").get("id") != '"PET"') return;
    equipmentData.pet = item.getRawNBT();
    FileLib.write("ChatItemMenu", "player_data/equipment.json", JSON.stringify(equipmentData));
    pet = item;
    petInfo = JSON.parse(pet.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").get("petInfo").toString().replaceAll("\\", "").replace(/^"|"$/g, ''));
    petTabData = "&eLoading...";
  }
})

when(() => Settings.get("Equipment Display") && Client.currentGui.getClassName() == "GuiInventory" && locraw.gametype == "SKYBLOCK",
  register("guiRender", (mouseX, mouseY, gui) => {
    let x = inventoryPosition.getX() + inventoryPosition.getWidth()/2;
    let y = inventoryPosition.getY() + inventoryPosition.getHeight()/2-18;
    Renderer.drawRect(Renderer.color(200, 200, 200), x, y-2, 62, 18);
    Renderer.drawRect(Renderer.color(170, 170, 170), x-2, y, 66, 14 );
    (equipment?? []).forEach((item, index) => {
      item.draw(x + index * 16, y, 1, 100);
      if (mouseX > x + index * 16 && mouseX < x + index * 16 + 16 && mouseY > y && mouseY < y + 16) {
        new Tooltip(item.getLore(), mouseX, mouseY, 0, 0).draw();
      }
    });
  })
)

register("guiMouseClick", (mouseX, mouseY) => {
  if (!Settings.get("Equipment Display")) return;
  let name = Client.currentGui.getClassName();
  if (name != "GuiInventory") return;
  if (locraw.gametype != "SKYBLOCK") return;
  let x = inventoryPosition.getX() + inventoryPosition.getWidth()/2;
  let y = inventoryPosition.getY() + inventoryPosition.getHeight()/2-18;
  if (mouseX > x && mouseX < x + 68 && mouseY > y && mouseY < y + 16) {
    ChatLib.command("equipment");
  }
})

let petTabData = "&eLoading...";

when(() => Settings.get("Pet Overlay") && locraw.gametype == "SKYBLOCK" && pet && expSharing,
  register("renderOverlay", () => {
    if (!petInfo) petInfo = JSON.parse(pet.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").get("petInfo")?.toString()?.replaceAll("\\", "")?.replace(/^"|"$/g, ''));

    let petSharedArray = expSharing.map(pet => pet.getName()).filter(name => name != "§7No pet in slot");

    let name = pet.getName();
    let exp = petInfo.exp;
    let held = items[petInfo.heldItem]?.displayname?? "&cNone";
    let string = [
      `${name}`, 
      `${petTabData}`, 
      `&eTotal XP &6${formatNumber(exp)} &7(${formatNumber((petLevels[0] / 20 * petOffset[petInfo.tier]) - exp)} left)`,
      held
    ];
    if (petSharedArray.length == 0) {
      string.push("&cNone");
    }
    else {
      petSharedArray.forEach(pet => string.push(pet.trim()));
    }
    let length = getLongest(string).width;
    let x = positionData.petGui.x*Renderer.screen.getWidth() - length / 2;
    let y = positionData.petGui.y*Renderer.screen.getHeight();
    Renderer.drawRect(Renderer.color(0, 0, 0, 150), x - 4, y - 4, length + 8, string.length * 10);
    string.forEach((line, index) => {
      Renderer.drawString(line, x, y+index*9, true);
    })
  })
)

register("chat", (message) => {
  if (match = message.match(/&aYour &r&(\S)(\S+) &r&aleveled up to level &r&9(\d+)&r&a!&r/)) {
    if (pet.getName().replace(/§7\[Lvl (\d+)\] /, '') == `§${match[1]}${match[2]}`) {
      pet.setName(`&7[Lvl ${match[3]}] &${match[1]}${match[2]}`);
    }
    for (let pet of expSharing) {
      if (pet.getName().replace(/§7\[Lvl (\d+)\] /, '') == `§${match[1]}${match[2]}`) {
        pet.setName(`&7[Lvl ${match[3]}] &${match[1]}${match[2]}`);
        return;
      }
    }
  }
}).setCriteria("&r${message}")

function setPetTabData() {
  if (!Player.getPlayer()) return;
  if (!TabList?.getNames()) return;
  let lines = TabList.getNames();
  for (let line of lines) {
    if (ChatLib.removeFormatting(line).match(/(\S+\/\S+ XP \(\S+\))/)) {
      petTabData = line.trim().replace(/^§r §r/, '');;
      return;
    }
    if (ChatLib.removeFormatting(line).trim() == "MAX LEVEL") {
      petTabData = line.trim().replace(/^§r §r/, '');
      return;
    }
  }
  if (petTabData == "&eLoading...") petTabData = "&cPlease enable pet data in /tab";
  return;
}

register("step", () => {
  setPetTabData();
}).setDelay(2)

addDisplay(
  "petGui",
  [
    {
      text: "Pet Overlay"
    }
  ],
  [
    {
      color: Renderer.color(0, 0, 0, 150),
      w: 40,
      h: 40
    }
  ],
  x = 0.5,
  y = 0.01
)