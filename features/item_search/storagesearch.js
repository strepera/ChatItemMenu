import { Tooltip, getItemFromNBT, getLongest, containerPosition, when } from "../../utils/utils.js";
import { settings } from "../../config.js";
let Settings = settings.settings;

const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField");
let height = Renderer.screen.getHeight();
let width = Renderer.screen.getWidth();

let storageBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = containerPosition.getX()+containerPosition.getWidth()/2-35, y = containerPosition.getY()-36, w = 70, h = 12);

let storageData = FileLib.read("ChatItemMenu", "player_data/storage.json");
if (!storageData) {
  storageData = {
    enderchest: {},
    backpacks: {},
    sacks: {}
  }
  FileLib.write("ChatItemMenu", "player_data/storage.json", JSON.stringify(storageData));
}
else {
  storageData = JSON.parse(storageData);
}
let enderchest = {};
let backpacks = {};
let sacks = storageData.sacks;
for (let page in storageData.enderchest) {
  let items = [];
  for (let item of storageData.enderchest[page]) {
    items.push(getItemFromNBT(item));
  }
  enderchest[page] = items;
}
for (let page in storageData.backpacks) {
  let items = [];
  for (let item of storageData.backpacks[page]) {
    items.push(getItemFromNBT(item));
  }
  backpacks[page] = items;
}
let searchItems = [];

register("step", () => {
  let newH = Renderer.screen.getHeight();
  let newW = Renderer.screen.getWidth();
  if (height != newH || width != newW) {
    height = newH;
    width = newW;
  }
}).setFps(2);

register("tick", () => {
  if (!Client.isInGui()) {
    storageBar.func_146195_b(false);
  }
})

let searchTerm = "";
register("guiKey", (char, keyCode, gui, event) => {
  if (!Settings.get("Storage Search")) return;
  if (storageBar.func_146206_l()) { // if text box is focused
    storageBar.func_146201_a(char, keyCode) // add character to text box
    searchTerm = storageBar.func_146179_b() // getText()
    if (searchTerm) {
      searchItems = filterStorage(searchTerm.toLowerCase(), height / 11);
    }
    else {
      searchItems = [];
    }
    if (keyCode != 1) { // keycode for escape key
      cancel(event)
    }
  }
})

when(() => Settings.get("Storage Search") && Player.getContainer() && Client.currentGui.getClassName() == "GuiChest",
  register("postGuiRender", () => {
    let name = Player.getContainer().getName();
    if (name != "Storage" && !name.includes("Backpack") && !name.includes("Ender Chest")) return;
    storageBar.func_146194_f(); // drawTextBox()
  })
)

when(() => Settings.get("Storage Search") && searchItems.length > 0 && Player.getContainer() && Client.currentGui.getClassName() == "GuiChest",
  register("guiRender", (mouseX, mouseY) => {
    let name = Player.getContainer().getName();
    if (name != "Storage" && !name.includes("Backpack") && !name.includes("Ender Chest")) return;
    let searchArr = searchItems.slice(0, height / 8).map(item => "&f" + item.count.toLocaleString() + "x " + item.name);
    let longest = getLongest(searchArr);
    Renderer.drawRect(Renderer.color(0, 0, 0, 100), 0, 0, longest.width + 8, searchArr.length * 9 + 8)
    Renderer.drawString(searchArr.join("\n"), 4, 4, true);
    if (mouseX > 4 && mouseX < longest.width + 4 && mouseY > 4 && mouseY < searchArr.length * 9 + 4) {
      new Tooltip(searchItems[Math.floor((mouseY - 4) / 9)].lore, mouseX, mouseY, 0, 0).draw();
    }
  })
)

when(() => Settings.get("Storage Search") && Player.getContainer() && (Player.getContainer().getName().includes("Backpack") || Player.getContainer().getName().includes("Ender Chest")),
  register('guiRender', () => {
    Player.getContainer().getItems().forEach((item, index) => {
      let maxSlot = Player.getContainer().getSize();
      if (!item) return;
      let name = item.getName();
      if (ChatLib.removeFormatting(name) == "Enchanted Book") {
        name = item.getLore()[1];
      }
      if (searchTerm && index <= maxSlot && name.toLowerCase().includes(searchTerm.toLowerCase())) {
        let x = index % 9;
        let y = Math.floor(index / 9);
        if (name == "GuiInventory") {
          if (index < 5) return;
          if (index < 9) {
            x = 8 - x;
            y -= x + 0.2;
            x = 0;
          }
          if (index > 35) y += 1.93;
          else y += 1.72;
        }
        else if (index > maxSlot - 37) {
          y += 0.71;
          if (maxSlot - index < 10) {
            y += 0.23;
          }
        }
        let renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18) + 1;
        let renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - Player.getContainer().getSize() / 18) * 18) + 1;
    
        Renderer.translate(0, 0, 100);
        Renderer.drawRect(Renderer.GREEN, renderX-9, renderY-9, 16, 16);
      }
    });
  })
)

register("guiMouseClick", (mouseX, mouseY, button) => {
  if (!Settings.get("Storage Search")) return;
  storageBar.func_146192_a(mouseX, mouseY, button); //GuiTextField.mouseClicked()

  if (!Player.getContainer()) return;
  let name = Player.getContainer().getName();
  if (name != "Storage" && !name.includes("Backpack") && !name.includes("Ender Chest")) return;
  if (searchItems.length > 0) {
    let searchArr = searchItems.slice(0, height / 8).map(item => "&f" + item.count + "x " + item.name);
    let longest = getLongest(searchArr);
    if (mouseX > 4 && mouseX < longest.width + 4 && mouseY > 4 && mouseY < searchArr.length * 9 + 4) {
      let item = searchItems[Math.floor((mouseY - 4) / 9)];
      ChatLib.command(item.location);
      searchTerm = item.name;
    }
  }
})

function setContainerData() {
  let container = Player.getContainer();
  if (!container) return;
  let match;
  if (match = container.getName().match(/Ender Chest \((\d+)\/\d+\)/)) {
    let size = container.getSize();
    storageData.enderchest[match[1]] = [];
    container.getItems().forEach((item, index) => {
      if (index > size - 36 || index < 9 || !item) return;
      storageData.enderchest[match[1]].push(item.getRawNBT());
    })
    enderchest[match[1]] = storageData.enderchest[match[1]].map(item => getItemFromNBT(item));
    FileLib.write("ChatItemMenu", "player_data/storage.json", JSON.stringify(storageData));
  }
  else if (match = container.getName().match(/(?:.+)Backpack(?:.+)\(Slot #(\d+)\)/)) {
    let size = container.getSize();
    storageData.backpacks[match[1]] = [];
    container.getItems().forEach((item, index) => {
      if (index > size - 36 || index < 9 || !item) return;
      storageData.backpacks[match[1]].push(item.getRawNBT());
    })
    backpacks[match[1]] = storageData.backpacks[match[1]].map(item => getItemFromNBT(item));
    FileLib.write("ChatItemMenu", "player_data/storage.json", JSON.stringify(storageData));
  }
  else if (match = container.getName().match(/(.+) Sack$/)) {
    container.getItems().forEach(item => {
      if (!item) return;
      let lore = item.getLore();
      if (!lore) return;
      for (let line of lore)  {
        if (match2 = ChatLib.removeFormatting(line).match(/Stored: ([0-9,]+)\/(\S+)/)) {
          let amount = Number(match2[1].replace(/[^0-9]+/g, ""));
          let name = ChatLib.removeFormatting(item.getName());
          storageData.sacks[name] = {name: name, amount: amount, colorName: item.getName()};
          sacks[name] = {name: name, amount: amount, colorName: item.getName()};
          FileLib.write("ChatItemMenu", "player_data/storage.json", JSON.stringify(storageData));
          break;
        }
      }
    })
  }
}

register("guiOpened", () => {
  if (!Settings.get("Storage Search")) return;
  storageBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = containerPosition.getX()+containerPosition.getWidth()/2-35, y = containerPosition.getY()-36, w = 70, h = 12);
  Client.scheduleTask(2, () => {
    setContainerData();
  })
})

register("guiMouseClick", () => {
  if (!Settings.get("Storage Search")) return;
  setContainerData();
})

function filterStorage(search, limit) {
  let data = [];
  let count = 0;

  for (let page in enderchest) {
    if (count >= limit) return data;
    for (let item of enderchest[page]) {
      let name = item.getName();
      if (ChatLib.removeFormatting(name) == "Enchanted Book") {
        name = item.getLore()[1];
      }
      if (name.toLowerCase().includes(search)) { 
        if (data.some(i => i.name == name && (i.location == "enderchest " + page || i.location == "backpack " + page))) {
          let matchIndex = data.findIndex(i => i.name == name && (i.location == "enderchest " + page || i.location == "backpack " + page));
          data[matchIndex].count += item.getStackSize();
        }
        else {
          data.push({name: name, lore: item.getLore(), item: item, count: item.getStackSize(), location: "enderchest " + page});
          count++;
        }
      }
    }
  }

  for (let page in backpacks) {
    if (count >= limit) return data;
    for (let item of backpacks[page]) {
      let name = item.getName();
      if (ChatLib.removeFormatting(name) == "Enchanted Book") {
        name = item.getLore()[1];
      }
      if (name.toLowerCase().includes(search)) { 
        if (data.some(i => i.name == name && (i.location == "enderchest " + page || i.location == "backpack " + page))) {
          let matchIndex = data.findIndex(i => i.name == name && (i.location == "enderchest " + page || i.location == "backpack " + page));
          data[matchIndex].count += item.getStackSize();
        }
        else {
          data.push({name: name, lore: item.getLore(), item: item, count: item.getStackSize(), location: "backpack " + page});
          count++;
        }
      }
    }
  }

  for (let item of Object.values(sacks)) {
    if (count >= limit) return data;
    if (item.name.toLowerCase().includes(search)) {
      let location = `gfs ${item.name} ${item.amount < 64? item.amount : 64}`;
      if (item.name.includes("Gemstones")) {
        location = "sacks";
      }
      data.push({name: item.colorName, lore: [item.colorName], count: item.amount, location: location});
      count++;
    }
  }

  return data;
}
