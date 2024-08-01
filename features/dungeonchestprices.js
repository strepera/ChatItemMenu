import { getLongest, formatNumber, getPriceId, inventoryPosition, getItemId, when } from "../utils/utils.js";
import { settings } from '../config.js';
let Settings = settings.settings;
import { prices } from '../utils/price.js';

const chestNames = [
  "Bedrock Chest",
  "Obsidian Chest",
  "Emerald Chest",
  "Diamond Chest",
  "Gold Chest",
  "Wood Chest"
]

let priceData = [];
let openPrice = 0;

register("guiOpened", () => {
  if (!Settings.get("Dungeon Chest Price")) return;
  Client.scheduleTask(1, () => {
    priceData = [];
    openPrice = 0;
    if (!prices) return;
    let name = Player.getContainer()?.getName();
    if (!name) return;
    if (!chestNames.includes(name)) return;
    let container = Player.getContainer();
    container.getItems().forEach((item, index) => {
      if (index > 53) return;
      if (ChatLib.removeFormatting(item.getName()) == "Open Reward Chest") {
        let lines = item.getLore();
        for (let line of lines) {
          if (match = ChatLib.removeFormatting(line).match(/(\S+) Coins/)) {
            openPrice = Number(match[1].replace(/\D+/g, ""));
            return;
          }
        }
      }
      if (match = ChatLib.removeFormatting(item.getName()).match(/(Wither Essence|Undead Essence) x(\d+)/)) {
        if (match[1] == "Wither Essence") {
          priceData.push({
            name: "&dWither Essence &8x" + match[2],
            price: prices["ESSENCE_WITHER"].sell * Number(match[2])
          })
        }
        else if (match[1] == "Undead Essence") {
          priceData.push({
            name: "&dUndead Essence &8x" + match[2],
            price: prices["ESSENCE_UNDEAD"].sell * Number(match[2])
          })
        }
        return;
      }
      let id = getPriceId(item);
      if (!id) return;

      let name = item.getName();
      if (item.getNBT().getTagMap().get("id") == '"minecraft:enchanted_book"') {
        name = item.getLore()[1];
      }

      if (prices[id]) {
        priceData.push({
          name: name,
          price: prices[id].price || prices[id].sell
        })
      }

    })
  })
})

when(() => Settings.get("Dungeon Chest Price") && priceData && Player.getContainer()?.getName() && chestNames.includes(Player.getContainer()?.getName()),
  register("guiRender", (mouseX, mouseY, gui) => {
    let name = Player.getContainer().getName();

    let longest = getLongest(priceData.map(item => `&e(${formatNumber(item.price)})&r ${item.name}`)).width;
    let x = inventoryPosition.getX() + inventoryPosition.getWidth();
    let y = inventoryPosition.getY();

    Renderer.drawRect(Renderer.color(0, 0, 0, 150), x, y+4, longest+4, priceData.length*(10)+22);
    for (let item of priceData) {
      Renderer.drawString(`&e(${formatNumber(item.price)})&r ${item.name}`, x+2, y+6 + priceData.indexOf(item)*10, true);
    }
    let profit = priceData.map(item => item.price).reduce((partialSum, a) => partialSum + a, 0) - openPrice;
    let profitColour = profit >= 0? "&a" : "&c";
    let totalString = `&eCost: ${formatNumber(openPrice)}\n${profitColour}Profit: ${formatNumber(profit)}`;
    Renderer.drawString(totalString, x+2, y+6 + priceData.length*10, true);
  })
)

when(() => Player.getContainer() && Player.getContainer().getName() == "Croesus", 
  register("guiRender", () => {
    let container = Player.getContainer();

    container.getItems().forEach((item, index) => {
      let maxSlot = container.getSize();
      if (!item) return;
      if (index <= maxSlot && item.getLore().map(line => ChatLib.removeFormatting(line).trim()).includes("No Chests Opened!")) {
        let x = index % 9;
        let y = Math.floor(index / 9);
        if (index > maxSlot - 37) {
          y += 0.71;
          if (maxSlot - index < 10) {
            y += 0.23;
          }
        }
        let renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18) + 1;
        let renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - Player.getContainer().getSize() / 18) * 18) + 1;
    
        Renderer.translate(0, 0, 100);
        Renderer.drawRect(Renderer.color(255, 0, 0, 150), renderX-9, renderY-9, 16, 16);
      }
    });
  })
)

let croesusProfitable = {};
let croesusProfitableIndex;
register("guiOpened", () => {
  croesusProfitableIndex = null;
  croesusProfitable = {};
  Client.scheduleTask(2, () => {
    let container = Player.getContainer();
    if (!container) return;
    if (!container.getName().match(/(The Catacombs|Master Mode Catacombs) - Floor (\S+)/)) return;
    container.getItems().forEach((item, containerIndex) => {
      if (!item) return;
      if (!ChatLib.removeFormatting(item.getName()).match(/(\S+) Chest$/)) return;
      let lore = item.getLore();
      let chestItemPrices = [];
      let openCost = 0;

      lore.forEach((line, index) => {
        if (ChatLib.removeFormatting(line).trim() == "Contents") {
          for (let i = index+1; i < lore.length; i++) {
            if (!ChatLib.removeFormatting(lore[i]).trim()) return;
            if (match = ChatLib.removeFormatting(lore[i]).match(/Enchanted Book \((.+)\)/)) {
              let id = getItemId(match[1]);
              chestItemPrices.push(prices[id].sell);
            }
            else if (match = ChatLib.removeFormatting(lore[i]).match(/(Wither Essence|Undead Essence) x(\d+)/)) {
              if (match[1] == "Wither Essence") {
                chestItemPrices.push(prices["ESSENCE_WITHER"].sell * Number(match[2]));
              }
              else {
                chestItemPrices.push(prices["ESSENCE_UNDEAD"].sell * Number(match[2]));
              }
            }
            else {
              let id = getItemId(lore[i]);
              let price = prices[id];
              if (price) {
                if (price.type == "auction") {
                  chestItemPrices.push(price.price);
                }
                else {
                  chestItemPrices.push(price.sell);
                }
              }
            }
          }
        }

        if (ChatLib.removeFormatting(line).trim() == "Cost") {
          openCost = Number(ChatLib.removeFormatting(lore[index+1]).replace(/\D+/g, ""))?? 0;
        }

      })
      croesusProfitable[containerIndex] = {prices: chestItemPrices, openCost: openCost};

    })

    let highestProfit = {amount: 0, index: 0};
    for (let index in croesusProfitable) {
      let profit = Number(croesusProfitable[index].prices.reduce((acc, cur) => acc + cur, 0)) - croesusProfitable[index].openCost;
      if (profit > highestProfit.amount) {
        highestProfit = {amount: profit, index: index};
      }
    }
    croesusProfitableIndex = highestProfit.index;

  })
})

when(() => croesusProfitable && Player.getContainer() && Player.getContainer().getName().match(/(The Catacombs|Master Mode Catacombs) - Floor (\S+)/),
  register("guiRender", () => {
    let container = Player.getContainer();

    let maxSlot = container.getSize();
    let x = croesusProfitableIndex % 9;
    let y = Math.floor(croesusProfitableIndex / 9);
    if (croesusProfitableIndex > maxSlot - 37) {
      y += 0.71;
      if (maxSlot - croesusProfitableIndex < 10) {
        y += 0.23;
      }
    }
    let renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18) + 1;
    let renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - Player.getContainer().getSize() / 18) * 18) + 1;

    Renderer.translate(0, 0, 100);
    Renderer.drawRect(Renderer.GREEN, renderX-9, renderY-9, 16, 16);
  })
)