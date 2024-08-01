const helper = Java.type('com.snailify.cimhelper.CimHelper');
import { formatNumber, getPriceId } from "../utils/utils.js";
import { settings } from "../config.js";
let Settings = settings.settings;
import { prices, npcPrices } from "../utils/price.js";

register(net.minecraftforge.event.entity.player.ItemTooltipEvent, (event) => {
  if (!Settings.get("Price Tooltip")) return;
  if (!prices) return;

  const item = new Item(event.itemStack);
  if (!item) return;
  
  let id = getPriceId(item);
  if (!id) return;

  let text = getPriceData(id, item.getStackSize());

  if (Settings.get("Date Obtained in Tooltip")) {
    const timestamp = item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getLong("timestamp");
    if (timestamp) {
      text.unshift(`§cObtained §7${new Date(timestamp).toLocaleDateString({})}`);
    }
  }

  text.forEach(line => {
    helper.addTooltip(event, line)
  });
})

function getPriceData(id, count) {
  if (!prices[id]) return [];
  let shiftDown = Keyboard.isKeyDown(Keyboard.KEY_LSHIFT)? count : 1;
  if (prices[id].type == "auction") {
    return [
    `§5§1§2§${Settings.get("Price Tooltip Colour")}§lLowest BIN ${formatNumber(prices[id].price * shiftDown)} §8(x${shiftDown})`,
    `§5§1§2§${Settings.get("Price Tooltip Colour")}§lNPC Sell ${formatNumber(npcPrices[id] * shiftDown)} §8(x${shiftDown})`
    ]
  }
  if (prices[id].type == "bazaar") {
    return [
      `§5§1§2§${Settings.get("Price Tooltip Colour")}§lInstant Buy ${formatNumber(prices[id].buy * shiftDown)} §8(x${shiftDown})`,
      `§5§1§2§${Settings.get("Price Tooltip Colour")}§lInstant Sell ${formatNumber(prices[id].sell * shiftDown)} §8(x${shiftDown})`,
      `§5§1§2§${Settings.get("Price Tooltip Colour")}§lNPC Sell ${formatNumber(npcPrices[id] * shiftDown)} §8(x${shiftDown})`
    ]
  }
  return [];
}
