import { Tooltip, getArrow, getLongest, formatNumber, getTimeLeft, rarityColours, getItemId, neuItemToCt, when } from "../../utils/utils.js";
import { filterData, getBossDrops, getCost, getDrops, getEnemyRecipes, getNPCLocation, getSales, getItemName } from "./chatitemmenu.js";
import { prices, npcPrices } from "../../utils/price.js";
import { settings } from "../../config.js";
let Settings = settings.settings;

const items = JSON.parse(FileLib.read('ChatItemMenu', 'data/items.json'));
const npcs = JSON.parse(FileLib.read('ChatItemMenu', 'data/npcs.json'));
const monsters = JSON.parse(FileLib.read('ChatItemMenu', 'data/monsters.json'));
const bosses = JSON.parse(FileLib.read('ChatItemMenu', 'data/bosses.json'));
const reforges = JSON.parse(FileLib.read('ChatItemMenu', 'data/reforgestones.json'));

const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField");

let height = Renderer.screen.getHeight();
let width = Renderer.screen.getWidth();
let boxHeight = height / 24;
let boxWidth = width / 4;
let filtered = {names: [], items: []};

let drawItems = [];
let pageIndex = 0;

let searchBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = width / 2 - boxWidth / 2, y = height / 12 * 11, w = boxWidth, h = boxHeight);

register("step", () => {
  let newH = Renderer.screen.getHeight();
  let newW = Renderer.screen.getWidth();
  if (height != newH || width != newW) {
    height = newH;
    width = newW;
    let boxHeight = height / 24;
    let boxWidth = width / 4;
    searchBar = new GuiTextField(0, Client.getMinecraft().field_71466_p /*.fontRendererObj*/,  x = width / 2 - boxWidth / 2, y = height / 12 * 11, w = boxWidth, h = boxHeight);
  }
}).setFps(2);

let isLookingAtReforgeTooltip = false;

let lastSearchTerm = "";
let searchTerm = "";
register("guiKey", (char, keyCode, gui, event) => {
  if (!Settings.get("Item List") && !Settings.get("Container Search")) return;
  let name = Client.currentGui.getClassName();
  if (name != "GuiInventory" && name != "GuiChest") return;
  if (keyCode == 53) {
    searchBar.func_146195_b(true);
    return;
  }
  if (searchBar.func_146206_l() ) { // if text box is focused
    if ((keyCode == 203 || keyCode == 205) && isLookingAtReforgeTooltip) return;
    searchBar.func_146201_a(char, keyCode) // add character to text box
    searchTerm = searchBar.func_146179_b() // getText()
    if (keyCode != 1) { // keycode for escape key
      cancel(event)
    }
  }
})

register("step", () => {
  if (searchTerm == lastSearchTerm) return;
  lastSearchTerm = searchTerm;
  if (!searchTerm) {
    filtered.items = [];
    filtered.names = [];
  }
  else {
    filtered.items = filterData(searchTerm.toLowerCase()).slice(0, 50);
    filtered.names = filtered.items.map(item => item.displayname);
  }
}).setFps(3)

when(() => (Settings.get("Item List") || Settings.get("Container Search")) && (Client.currentGui.getClassName() == "GuiInventory" || Client.currentGui.getClassName() == "GuiChest"),
  register("postGuiRender", () => {
    searchBar.func_146194_f(); // drawTextBox()
  })
)

register("guiMouseClick", (x, y, button) => {
  searchBar.func_146192_a(x, y, button); //GuiTextField.mouseClicked()
})

register("guiClosed", () => {
  searchBar.func_146195_b(false);
})

// item highlighting
let foundItems = {items: [], names: []};
when(() => Settings.get("Container Search") && Player.getContainer() && (Client.currentGui.getClassName() == "GuiInventory" || Client.currentGui.getClassName() == "GuiChest"),
  register('guiRender', () => {
    foundItems.names = [];
    foundItems.items = [];
    let name = Client.currentGui.getClassName();
    Player.getContainer().getItems().forEach((item, index) => {
      let maxSlot = Player.getContainer().getSize();
      if (!item) return;
      if (index <= maxSlot && (item.getRawNBT().toLowerCase().removeFormatting().includes(searchTerm.toLowerCase()) || item.getName().toLowerCase().removeFormatting().includes(searchTerm.toLowerCase())) && searchTerm && !item.getRawNBT().removeFormatting().includes('id:"minecraft:air"')) {
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
        else {
          if (index > maxSlot - 37) {
            y += 0.71;
            if (maxSlot - index < 10) {
              y += 0.23;
            }
          }
        }
        let renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18) + 1;
        let renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - Player.getContainer().getSize() / 18) * 18) + 1;
    
        Renderer.translate(0, 0, 100);
        Renderer.drawRect(Renderer.GREEN, renderX-9, renderY-9, 16, 16);
        foundItems.items.push(item);
        foundItems.names.push("&f" + item.getStackSize() + "x " + item.getName());
      }
    });
  })
)

// item list
let itemBoxX = 100;
let itemBoxY = 16;
let itemListX = width / 3 * 2;
let itemListY = 16;
let reforgeViewIndex = 0;
let reforgesLength = 0;
when(() => Settings.get("Item List") && (Client.currentGui.getClassName() == "GuiInventory" || Client.currentGui.getClassName() == "GuiChest"),
  register("guiRender", () => {
    itemListX = width / 3 * 2;

    let mouseX = Client.getMouseX();
    let mouseY = Client.getMouseY();

    if (filtered.names.length > 0) {
      let longest = getLongest(filtered.names);
      Renderer.drawRect(Renderer.color(0, 0, 0, 100), itemListX - 4, itemListY - 4, longest.width + 8, filtered.names.length * 9 + 8);
      filtered.names.forEach((name, index) => {
        Renderer.drawString(name, itemListX, itemListY+index*9, true);
      })

      if (mouseX > itemListX && mouseX < itemListX + longest.width && mouseY > itemListY && mouseY < itemListY + filtered.names.length * 9) {
        let index = Math.floor((mouseY - itemBoxY) / 9);
        let item = filtered.items[index];
        let lore = item.lore.slice();
        lore.unshift(item.displayname);
        isLookingAtReforgeTooltip = false;
        if (reforges[item.internalname]) {
          isLookingAtReforgeTooltip = true;
          reforgesLength = Object.values(reforges[item.internalname].reforgeCosts).length;
          lore.push(
            `&8[Arrow keys to switch rarity]`,
            `&6Cost &7[${rarityColours[Object.keys(reforges[item.internalname].reforgeCosts)[reforgeViewIndex]]}${Object.keys(reforges[item.internalname].reforgeCosts)[reforgeViewIndex]}&7] &f${formatNumber(Object.values(reforges[item.internalname].reforgeCosts)[reforgeViewIndex])}`
          )
          for (let stat in Object.values(reforges[item.internalname].reforgeStats)[reforgeViewIndex]) {
            lore.push("&7" + stat + " &f" + Object.values(reforges[item.internalname].reforgeStats)[reforgeViewIndex][stat]);
          }
        }
        let itemPrice = prices[item.internalname];
        if (itemPrice) {
          if (itemPrice.type == "auction") {
            lore.push(
              `&e&lLOWEST BIN ${formatNumber(itemPrice.price)}`,
              `&e&lNPC Sell ${formatNumber(npcPrices[item.internalname])}`
            )
          }
          else {
            lore.push(
              `&e&lInstant Buy ${formatNumber(itemPrice.buy)}`,
              `&e&lInstant Sell ${formatNumber(itemPrice.sell)}`,
              `&e&lNPC Sell ${formatNumber(npcPrices[item.internalname])}`
            )
          }
        }
        new Tooltip(lore, mouseX, mouseY, 0, 0).draw();
      }
      else {
        reforgeViewIndex = 0;
      }
    }
  })
)

register("guiKey", (char, keyCode) => {
  if (!Settings.get("Item List")) return;
  let name = Client.currentGui.getClassName();
  if (name != "GuiInventory" && name != "GuiChest") return;

  switch(keyCode) {
    case 203:
      if (reforgeViewIndex > 0) reforgeViewIndex -= 1;
      break;
    case 205:
      if (reforgeViewIndex < reforgesLength - 1) reforgeViewIndex += 1;
      break;
    default:
      break;
  }
})

register("guiMouseClick", (mouseX, mouseY, button) => {
  if (!Settings.get("Item List")) return;
  let name = Client.currentGui.getClassName();
  if (name != "GuiInventory" && name != "GuiChest") return;

  if (filtered.names.length > 0) {
    let longest = getLongest(filtered.names);
    if (mouseX > itemListX && mouseX < itemListX + longest.width && mouseY > itemListY && mouseY < itemListY + filtered.names.length * 9) {
      let index = Math.floor((mouseY - itemBoxY) / 9);
      drawItems = [];
      if (button == 0) {
        displayItemRecipe(filtered.items[index]);
      }
      else if (button == 1) {
        displayItemUsages(filtered.items[index]);
      }
      if (drawItems[0]) {
        recipeGui.open();
        World.playSound("gui.button.press", 1, 1);
      }
    }
  }
})

const recipeGui = new Gui();

recipeGui.registerDraw(() => {
  let mouseX = Client.getMouseX();
  let mouseY = Client.getMouseY();
  Renderer.drawRect(Renderer.color(100, 100, 100, 200), width / 4 + width / 8, height / 4 + height / 8, width / 4, height / 4);
  for (let item of drawItems[pageIndex]?.content?? []) {
    if (item.item) { // is ct item
      let x = (width / 2 - 24) + item.pos.x * 16;
      let y = (height / 2 - 24) + item.pos.y * 16;
      item.item.draw(x, y);
      drawStackSize(item, x, y);
      if (mouseX > x && mouseX < x + 16 && mouseY > y && mouseY < y + 16) {
        new Tooltip(item.item.getLore(), mouseX, mouseY, 0, 0).draw();
      }
    }
    else {
      let x = (width / 4 + width / 8 + 4);
      let y = (height / 4 + height / 8 + 4 + 10);
      if (item.includes("\n")) {
        Renderer.drawString(item, x, y, true);
      }
      else {
        let string = item;
        let maxLineWidth = width / 4 - 8;
        let currentX = 0;
        
        let lines = [];
        let currentLine = '';
        let lastColour = '§f';
        for (let i = 0; i < string.length; i++) {
          if (string[i] == "&" || string[i] == "§") lastColour = "§" + string[i + 1];
          let charWidth = Renderer.getStringWidth(string[i]);
          if (currentX + charWidth <= maxLineWidth || string[i] != " " || string[i] == "&" || string[i - 1] == "&" || string[i] == "§" || string[i - 1] == "§") {
            currentLine += string[i];
            currentX += charWidth;
          } else {
            lines.push(currentLine);
            currentLine = lastColour + string[i];
            currentX = 0;
          }
        }
        lines.push(currentLine.trim()); 
        
        for (let i = 0; i < lines.length; i++) {
            Renderer.drawString(lines[i], x, y + i * 10, true); 
        }
      }
    }
  }

  let leftArrowFill = Renderer.GRAY;
  let rightArrowFill = Renderer.GRAY;

  if (mouseX > width / 2 - 24 && mouseX < width / 2 - 8 && mouseY > height / 2 + height / 12 - 8 && mouseY < height / 2 + height / 12 + 8) {
    leftArrowFill = Renderer.BLUE;
  }
  if (mouseX > width / 2 + 8 && mouseX < width / 2 + 24 && mouseY > height / 2 + height / 12 - 8 && mouseY < height / 2 + height / 12 + 8) {
    rightArrowFill = Renderer.BLUE;
  }

  Renderer.drawShape(Renderer.GRAY, getArrow(width / 2 - 16, height / 2 + height / 12, -8, horizontal = true));
  Renderer.drawShape(leftArrowFill, getArrow(width / 2 - 16, height / 2 + height / 12, -6, horizontal = true));

  Renderer.drawShape(Renderer.GRAY, getArrow(width / 2 + 16, height / 2 + height / 12, 8, horizontal = true));
  Renderer.drawShape(rightArrowFill, getArrow(width / 2 + 16, height / 2 + height / 12, 6, horizontal = true));
  Renderer.drawString(drawItems[pageIndex].name + ` &f(${pageIndex + 1}/${drawItems.length})`, width / 4 + width / 8 + 4, height / 4 + height / 8 + 4, true); // title
})

recipeGui.registerClicked((mouseX, mouseY, button) => {
  if (pageIndex - 1 >= 0 && mouseX > width / 2 - 24 && mouseX < width / 2 - 8 && mouseY > height / 2 + height / 12 - 8 && mouseY < height / 2 + height / 12 + 8) {
    pageIndex -= 1;
    World.playSound("gui.button.press", 1, 1);
  }
  if (pageIndex + 1 < drawItems.length && mouseX > width / 2 + 8 && mouseX < width / 2 + 24 && mouseY > height / 2 + height / 12 - 8 && mouseY < height / 2 + height / 12 + 8) {
    pageIndex += 1;
    World.playSound("gui.button.press", 1, 1);
  }

  if (button == 0) { // left click
    for (let item of drawItems[pageIndex].content) {
      if (!item.item) continue;
      let x = (width / 2 - 24) + item.pos.x * 16;
      let y = (height / 2 - 24) + item.pos.y * 16;
      if (mouseX > x && mouseX < x + 16 && mouseY > y && mouseY < y + 16) {
        drawItems = [];
        displayItemRecipe(items[getItemId(item.item.getName())]);
        World.playSound("gui.button.press", 1, 1);
      }
    }
  }
  else if (button == 1) { // right click
    for (let item of drawItems[pageIndex].content) {
      if (!item.item) continue;
      let x = (width / 2 - 24) + item.pos.x * 16;
      let y = (height / 2 - 24) + item.pos.y * 16;
      if (mouseX > x && mouseX < x + 16 && mouseY > y && mouseY < y + 16) {
        drawItems = [];
        displayItemUsages(items[getItemId(item.item.getName())]);
        World.playSound("gui.button.press", 1, 1);
      }
    }
  }
})

function makeRecipe(data) { // makeRecipe(neuItem) : ctItem
  let newGrid = [];
  if (!data.recipe) return newGrid;
  for (let slot of Object.values(data.recipe)) {
    if (!slot || !slot.split) {
      newGrid.push(null);
      continue;
    }
    let item = items[slot.split(":")[0]];
    let count = parseInt(slot.split(":")[1]);
    let ctitem = neuItemToCt(item, count);
    newGrid.push(ctitem);
  }
  newGrid.push(neuItemToCt(data, data.recipe?.count?? 0));
  return newGrid;
}

function displayItemRecipe(data) {
  pageIndex = 0;
  const info = {
    recipe: makeRecipe(data),
    location: getNPCLocation(data),
    costs: getCost(data),
    sales: getSales(data),
    drops: getDrops(data),
    bossDrops: getBossDrops(data),
    enemyRecipes: getEnemyRecipes(data)
  }
  let index = 0;
  for (let i in info) {
    if (!info[i] || i == "recipe") continue;
    drawItems[index] = {content: [info[i]], name: data.displayname};
    index++;
  }
  if (info.recipe.length > 0) {
    drawItems[index] = {content: getCtItems(info.recipe), name: "Recipe for " + data.displayname};
    index++;
  }
}

function displayItemUsages(data) { // displayItemUsages(neuItem) pushes item usages to drawItems[]
  pageIndex = 0;
  let usageItems = [];
  for (let item in items) {
    for (let forge of items[item].recipes??  []) {
      if (forge.inputs && forge.inputs.map(item => item.split(":")[0]).includes(data.internalname)) {
        let forgeRecipe = [];
        for (let input of forge.inputs?? []) {
          let name = input.split(":")[0] === "SKYBLOCK_COIN"? " Coins" : "x " + getItemName(input.split(':')[0], true);
          let count = formatNumber(input.split(":")[1]);
          forgeRecipe.push(`${count}${name}`);
        }
        usageItems.push(`&9&lForge &7[${items[item].displayname}&7]&r (${forge.count?? 1}x ${getTimeLeft(forge.duration)}) ` + forgeRecipe.join("&f, "));
      }
    }
    if (!items[item].recipe) continue;
    for (let slot in items[item].recipe) {
      let slotItem = items[item].recipe[slot];
      if (!slotItem.split) continue;
      let itemItem = slotItem.split(":")[0];
      if (itemItem == data.internalname) {
        let recipe = makeRecipe(items[item]);
        if (!usageItems.includes(recipe)) {
          usageItems.push(recipe);
          break;
        }
      }
    }
  }
  for (let grid of usageItems) {
    let gridIndex = usageItems.indexOf(grid);
    if (typeof grid == "string") {
      drawItems[gridIndex] = {content: grid.split("\n"), name: "Usages for " + data.displayname};
    }
    else if (grid.length > 0){
      drawItems[gridIndex] = {content: getCtItems(grid), name: "Usages for " + data.displayname};
    }
  }
}

function getCtItems(array) {
  let data = [];
  array.forEach((item, index) => {
    if (!item) return;
    let x = index % 3;
    let y = Math.floor(index / 3);
    if (index == array.length - 1) {
      x = 4; y = 1; // makes it look like the result
    }
    data.push({item: item, pos: {x: x, y: y}});
  })
  return data;
}

function drawStackSize(item, x, y) {
  let stackSize = item.item.getStackSize();
  if (stackSize > 1) {
    Renderer.translate(0, 0, 499);
    Renderer.drawString(stackSize, x + (3 - stackSize.toString().length) * 5, y + 8, true);
  }
}