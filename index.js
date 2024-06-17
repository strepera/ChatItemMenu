import axios from 'axios';
import { view, gui } from './view.js';
import { InfoMessage, createGrid, filterData, getClickableFilteredItems, getCost, getSales, getDrops, getBossDrops, getNPCLocation, getEnemyRecipes, getItemName } from './chatitemmenu.js';
import { formatNumber } from './utils.js';
import { checkEvaluation } from './math.js';

ChatLib.chat(`&5&lThanks for installing &6&lChatItemMenu &5&lby snailify!
&9&l&nFeatures
&c&o- Type any math question in your chat bar and get an answer!
&e&o- Type "s:" followed by an item, npc or mob and press enter to search for it! e.g. "s:hyperion"
&a&o- Type /v (player) or /view (player) to look at their stats! (If it doesn't load then skycrypt is down)
&5&oDM @snailify on discord for feature suggestions or bug reports`);

let prices;
axios.get("https://moulberry.codes/lowestbin.json", {
  headers: {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0"
  }
}).then((response) => {
  prices = response.data;
});

let lastMessage;
register("step", () => {
  const input = Client.getCurrentChatMessage().toLowerCase();
  checkEvaluation(input);
  if (!input.startsWith("s:")) return ChatLib.clearChat(9922335);
  const search = input.split(':')[1].trim();
  const filtered = filterData(search).map(item => item.displayname).slice(0, 300);
  const message = getClickableFilteredItems(filtered).setChatLineId(9922335);
  if (filtered.join('\n') != lastMessage) {
    ChatLib.clearChat(9922335);
    message.chat();
    lastMessage = filtered.join('\n');
  }
}).setDelay(1);

register("messageSent", (message, event) => {
  if (!message.toLowerCase().startsWith("s:")) return;
  cancel(event);
  Client.currentGui.close()
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

  const messageData = {
    name: new TextComponent(first.displayname).setClick("open_url", wiki),
    lbin: prices[first.internalname]? new TextComponent(`&e&lLOWEST BIN ${formatNumber(prices[first.internalname])}`).setClick("run_command", "/ahs " + getItemName(first.internalname, false)) : "",
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