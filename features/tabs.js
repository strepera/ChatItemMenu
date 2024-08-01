import { settings } from '../config.js';
import { locraw } from '../utils/locraw';
import { inventoryPosition, getItemId, neuItemToCt, getItemFromNBT, when } from "../utils/utils";
import { filterData } from "./item_search/chatitemmenu";

const items = JSON.parse(FileLib.read('ChatItemMenu', 'data/items.json'));

let tabs = FileLib.read("ChatItemMenu", "player_data/buttons.json");
if (!tabs) {
  tabs = [
    {
      command: "cimopentabgui"
    }
  ];
  FileLib.write("ChatItemMenu", "player_data/buttons.json", JSON.stringify(tabs));
}
else {
  let parsedTabs = JSON.parse(tabs);
  parsedTabs.forEach(button => {
    if (!button.item) return;
    button.item = getItemFromNBT(button.item);
  });
  tabs = parsedTabs;
}

function updateButtons() {
  let stringifiedTabs = [];
  for (let tab of tabs) {
    if (tab.item) {
      stringifiedTabs.push({item: tab.item.getRawNBT(), command: tab.command});
    }
    else {
      stringifiedTabs.push({command: tab.command});
    }
  }
  FileLib.write("ChatItemMenu", "player_data/buttons.json", JSON.stringify(stringifiedTabs));
}

when(() => Player.getContainer() && locraw.gametype == "SKYBLOCK" && (Client.currentGui.getClassName() == "GuiInventory" || Client.currentGui.getClassName() == "GuiChest"),
  register("guiRender", () => {
    let array = tabs;
    if (!settings["Add Inventory Button Button"]) {
      array = array.filter(tab => tab.item);
    }
    array.forEach((tab, index) => {
      let w = inventoryPosition.getWidth()/6;
      let h = inventoryPosition.getHeight()/6;
      let colIndex = (Math.floor(index/4));
      let rowIndex = index % 4;
      let x = inventoryPosition.getX()-w-4 - colIndex*(w+w/4);
      let y = inventoryPosition.getY() + rowIndex*(w+w/4);

      Renderer.drawRect(Renderer.DARK_GRAY, x, y, w, h);
      Renderer.drawRect(Renderer.WHITE, x+1, y+1, w-2, h-2);
      Renderer.drawRect(Renderer.BLACK, x+2, y+2, w-4, h-4);

      if (index == 0 && settings["Add Inventory Button Button"]) {
        Renderer.drawRect(Renderer.DARK_GRAY, x+w/2, y+7, 2, 18);
        Renderer.drawRect(Renderer.DARK_GRAY, x+7, y+h/2, 18, 2);
        Renderer.drawRect(Renderer.WHITE, x+w/2-2, y+5, 2, 18);
        Renderer.drawRect(Renderer.WHITE, x+5, y+h/2-2, 18, 2);
      }
      else {
        tab.item.draw(x+w/8-2, y+h/8-2, 1.5, 500);
      }
    });
  })
)

register("guiMouseClick", (mouseX, mouseY, button) => {
  if (Player.getPlayer() === null || Player.getContainer() === null || locraw.gametype != "SKYBLOCK") return;
  let name = Client.currentGui.getClassName();
  if (name != "GuiInventory" && name != "GuiChest") return;

  tabs.forEach((tab, index) => {
    let w = inventoryPosition.getWidth()/6;
    let h = inventoryPosition.getHeight()/6;
    let colIndex = (Math.floor(index/4));
    let rowIndex = index % 4;
    let x = inventoryPosition.getX()-w-4 - colIndex*(w+w/4);
    let y = inventoryPosition.getY() + rowIndex*(w+w/4);

    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      if (index == 0) ChatLib.command(tab.command, true);
      else {
        if (button == 1) {
          ChatLib.command(`removebutton ${index}`, true);
        }
        else {
          ChatLib.say(tab.command);
        }
      }
      World.playSound("gui.button.press", 1, 1);
    }
  })
})

register("command", (...args) => {
  let itemName = args[0];
  let command = args.slice(1).join(" ");
  tabs.push({
    item: new Item(itemName), 
    command: command
  });
  updateButtons();
  ChatLib.chat(`&aAdded button for "${command}" with item ${itemName}\n&7(Use '/removebutton ${tabs.length - 1}' to remove)`)
}).setName("addbutton")

register("command", (...args) => {
  let itemIndex = args[0];
  if (!tabs[itemIndex]) {
    ChatLib.chat(`&cError! No button at index ${itemIndex}`);
    return;
  }

  tabs.splice(itemIndex, 1);
  updateButtons();
  ChatLib.chat(`&aRemoved button at index ${itemIndex}`)
}).setName("removebutton")

const tabGui = new Gui();
const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField");
let searchBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = inventoryPosition.getX(), y = inventoryPosition.getY(), w = inventoryPosition.getWidth(), h = Renderer.screen.getHeight()/30);
let nameBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = inventoryPosition.getX()+16, y = inventoryPosition.getY()+inventoryPosition.getHeight()-Renderer.screen.getHeight()/30, w = inventoryPosition.getWidth()-16, h = Renderer.screen.getHeight()/30);

let filteredData = [];
let selectedItem;
let commandString;

tabGui.registerClosed(() => {
  searchBar.func_146195_b(false);
  nameBar.func_146195_b(false);
})

tabGui.registerKeyTyped((char, keyCode) => {
  if (searchBar.func_146206_l() ) { // if text box is focused
    searchBar.func_146201_a(char, keyCode); // add character to text box
    filteredData = filterData(searchBar.func_146179_b()).slice(0, 10).map(item => item.displayname);
  }
  else if (nameBar.func_146206_l() ) { // if text box is focused
    if (keyCode == 28 && commandString) {//enter
      tabs.push({
        item: selectedItem?? new Item("minecraft:crafting_table"),
        command: commandString
      });
      updateButtons();
      tabGui.close();
      ChatLib.chat(`&aAdded button for "${commandString}" with item ${selectedItem.getName()}\n&7(Use '/removebutton ${tabs.length - 1}' to remove)`);
      return;
    }
    nameBar.func_146201_a(char, keyCode); // add character to text box
    commandString = nameBar.func_146179_b();
  }
})

tabGui.registerDraw(() => {
  let x = inventoryPosition.getX();
  let y = inventoryPosition.getY();
  let width = inventoryPosition.getWidth();
  let height = inventoryPosition.getHeight();
  Renderer.drawRect(Renderer.color(0, 0, 0, 200), x, y, width, height);

  filteredData.forEach((item, index) => {
    Renderer.drawString(item, x, y+Renderer.screen.getHeight()/30 + index*10, true);
  })

  if (selectedItem) {
    selectedItem.draw(x, y+height-16);
  }

  searchBar.func_146194_f(); // drawTextBox()
  nameBar.func_146194_f(); // drawTextBox()
})

tabGui.registerClicked((mouseX, mouseY, button) => {
  searchBar.func_146192_a(mouseX, mouseY, button); //GuiTextField.mouseClicked()
  nameBar.func_146192_a(mouseX, mouseY, button); //GuiTextField.mouseClicked()

  let x = inventoryPosition.getX();
  let y = inventoryPosition.getY();
  if (mouseX > x && mouseX < x+inventoryPosition.getWidth() && mouseY > y+Renderer.screen.getHeight()/30) {
    let scale = 0;
    if (Renderer.screen.getScale() < 2) {
      scale = -1;
    }
    else if (Renderer.screen.getScale() > 2) {
      scale = 1;
    }
    let index = Math.floor((mouseY - y)/10)-2+scale;
    let item = items[getItemId(filteredData[index])];
    if (!item) return;
    selectedItem = neuItemToCt(item, 1);
  }
})

register("command", () => {
  commandString = null;
  selectedItem = null;
  filteredData = [];
  searchBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = inventoryPosition.getX(), y = inventoryPosition.getY(), w = inventoryPosition.getWidth(), h = Renderer.screen.getHeight()/30);
  nameBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = inventoryPosition.getX()+16, y = inventoryPosition.getY()+inventoryPosition.getHeight()-Renderer.screen.getHeight()/30, w = inventoryPosition.getWidth()-16, h = Renderer.screen.getHeight()/30);
  tabGui.open();
}).setName("cimopentabgui");