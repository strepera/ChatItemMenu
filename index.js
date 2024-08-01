import './features/treasurechests.js';
import './features/itemspecifics.js';
import './features/item_search/itemsearch.js';
import './features/item_search/storagesearch.js';
import './features/equipmentviewer.js';
import './features/pricelore.js';
import './features/fairysouls.js';
import './features/gardenhotkeyreplacements.js';
import './features/fruitdigging.js';
import './features/tabs.js';
import './features/dungeonchestprices.js';
import './features/pestborder.js';
import './features/sblevelchat.js';
import './features/warpwheel.js';
import './features/rename.js';
import './features/forgeitemsinchat.js';
import './features/visitorhelper.js';
import './features/glacitetunnelsgemstonewaypoints.js';
import './features/gardenmouselock.js';
import './features/pickuplog.js';
import './features/coordshelper.js';
import './features/gardendisplay.js';
import './features/partycommands.js';
import './features/modifyplayer.js';
import './features/fossilhelper.js';
import './features/arrowtrail.js';
import { view, gui } from './features/player_viewer/view.js';
import { InfoMessage, createGrid, filterData, getClickableFilteredItems, getCost, getSales, getDrops, getBossDrops, getNPCLocation, getEnemyRecipes, getItemName } from './features/item_search/chatitemmenu.js';
import { formatNumber, when } from './utils/utils.js';
import { checkEvaluation } from './features/item_search/math.js';
import { settings } from './config.js';
import { prices, npcPrices } from './utils/price.js';

register("command", () => settings.open()).setName("cim");

ChatLib.chat(`&5&lThanks for installing &6&lChatItemMenu &5&lby snailify!
&9&l&nFeatures
&a&o- Type /v (player) or /view (player) to look at their stats!
&5&oDM @snailify on discord for feature suggestions or bug reports
&d&lUse '/cim' to open the settings GUI`);

let lastMessage;
when(() => Client.isInChat(), 
  register("step", () => {
    const input = Client.getCurrentChatMessage().toLowerCase();
    checkEvaluation(input);
    if (!input.startsWith("s:")) return ChatLib.clearChat(9922335);
    const search = input.split(':')[1].trim();
    const filtered = filterData(search).map(item => item.displayname).slice(0, 300).slice().reverse();
    const message = getClickableFilteredItems(filtered).setChatLineId(9922335);
    if (filtered.join('\n') != lastMessage) {
      ChatLib.clearChat(9922335);
      message.chat();
      lastMessage = filtered.join('\n');
    }
  }).setFps(2)
)

register("messageSent", (message, event) => {
  if (!message.toLowerCase().startsWith("s:")) return;
  cancel(event);

  Client.currentGui.close();
  const search = message.toLowerCase().split(':')[1].trim();
  const first = filterData(search)[0];
  if (!first) return ChatLib.chat("&c&lInvalid item.");
  if (!prices) return ChatLib.chat("&c&lPlease wait for price data to load");

  const costs = getCost(first);
  const sales = getSales(first);
  const drops = getDrops(first);
  const bossDrops = getBossDrops(first);
  const location = getNPCLocation(first);
  const enemyRecipes = getEnemyRecipes(first);
  const wiki = first.info? first.info[1] : "";
  
  let name = new TextComponent(first.displayname + " &8&l(HOVER)").setHoverValue(first.displayname + "\n" + first.lore.join("\n")).setClick("open_url", wiki);
  if (!costs && !sales && !drops && !bossDrops && !location && !enemyRecipes && !first.recipe) name.text += "\n" + first.lore.join("\n");

  let price = "";
  let id = first.internalname;
  if (prices[id] && prices[id].type == "bazaar") {
    price = new TextComponent(`&e&lInstant Buy ${formatNumber(prices[id].buy)}\n&e&lInstant Sell ${formatNumber(prices[id].sell)}\n&e&lNPC Sell ${formatNumber(npcPrices[id])}`).setClick("run_command", "/bz " + getItemName(id, false))
  }
  else if (prices[id] && prices[id].type == "auction") {
    price = new TextComponent(`&e&lLOWEST BIN ${formatNumber(prices[id].price)}\n&e&lNPC Sell ${formatNumber(npcPrices[id])}`).setClick("run_command", "/ahs " + getItemName(id, false))
  }

  const messageData = {
    name: name,
    item: first,
    lbin: price,
    costs: new TextComponent(costs),
    sales: new TextComponent(sales),
    drops: new TextComponent(drops),
    bossDrops: new TextComponent(bossDrops),
    location: new TextComponent(location),
    enemyRecipes: new TextComponent(enemyRecipes)
  };

  ChatLib.chat(ChatLib.getChatBreak());
  new InfoMessage(messageData).send();
  if (first.recipe) createGrid(first).chat();
  ChatLib.chat(ChatLib.getChatBreak());
})

register("command", (...args) => {
  if (!args[0]) args[0] = Player.getName();
  view(args[0].trim());
  gui.open();
}).setName("view", true).setAliases("v");