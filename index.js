import Settings from './config.js';
import axios from 'axios';
import { buttons, getViewText } from './buttons.js';
import { createGrid, filterData, getClickableFilteredItems, getRequirements, getCost, getDrops, getBossDrops, getItemName } from './chatitemmenu.js';
import { formatNumber } from './utils.js';

let prices;
axios.get("https://moulberry.codes/lowestbin.json", {
  headers: {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0"
  }
}).then((response) => {
  prices = response.data;
  ChatLib.chat("&c[ChatItemMenu] Loaded price info.");
});

let lastMessage;
register("step", () => {
  const input = Client.getCurrentChatMessage().toLowerCase();
  if (input.startsWith(Settings.prefix.toLowerCase())) {
    const search = input.split(':')[1].trim();
    const filtered = filterData(search).map(item => item.displayname);
    const message = getClickableFilteredItems(filtered).setChatLineId(9922335);
    if (filtered.join('\n') != lastMessage) {
      ChatLib.clearChat(9922335);
      message.chat();
      lastMessage = filtered.join('\n');
    }
  }
  else {
    ChatLib.clearChat(9922335);
  }
}).setDelay(1);

register("messageSent", (message, event) => {
  if (!message.toLowerCase().startsWith(Settings.prefix.toLowerCase())) return;
  cancel(event);
  Client.currentGui.close()
  const search = message.toLowerCase().split(':')[1].trim();
  const first = filterData(search)[0];
  if (!first) return ChatLib.chat("&c&lInvalid item.");
  
  let requirements = "";
  if (first.requirements) {
    requirements += '\n&cRequires &5';
    requirements += getRequirements(first).join(' ');
  }

  const costs = getCost(first);
  const drops = getDrops(first);
  const bossDrops = getBossDrops(first);
  const wiki = first.info? first.info[1] : "";

  if (first.recipe) {
    ChatLib.chat(ChatLib.getChatBreak());
    ChatLib.chat(new Message(new TextComponent("&l" + first.displayname).setClick("open_url", "https://wiki.hypixel.net/" + first.internalname)));
    if (prices[first.internalname]) ChatLib.chat(`&e&lLOWEST BIN ${formatNumber(prices[first.internalname])}`);
    ChatLib.chat(new Message(new TextComponent(`&c&lRecipe for ${first.displayname}&f:${requirements}`).setClick("run_command", "/recipe " + getItemName(first.internalname, false)), new TextComponent(costs), new TextComponent(drops), new TextComponent(bossDrops)));
    ChatLib.chat(createGrid(first));
    ChatLib.chat(new Message(new TextComponent(wiki)));
    ChatLib.chat(ChatLib.getChatBreak());
  }
  else {
    ChatLib.chat(ChatLib.getChatBreak());
    ChatLib.chat(new Message(new TextComponent("&l" + first.displayname).setClick("open_url", "https://wiki.hypixel.net/" + first.internalname)));
    if (prices[first.internalname]) ChatLib.chat(`&e&lLOWEST BIN ${formatNumber(prices[first.internalname])}`);
    ChatLib.chat(new Message(new TextComponent(costs), new TextComponent(drops), new TextComponent(bossDrops)));
    ChatLib.chat(new Message(new TextComponent(wiki)));
    ChatLib.chat(ChatLib.getChatBreak());
  }
})

let playerViewData = {};
let selectedButton = 0;
let profiles = [];
let currentProfile;
let responseData;

const gui = new Gui();

gui.registerDraw(() => {
  const width = Renderer.screen.getWidth() / 4;
  const height = Renderer.screen.getHeight() / 4;
  for (let button of buttons) {
    let index = buttons.indexOf(button) * width * 2 / buttons.length;
    Renderer.drawRect(button.dark, width + index + 16, height - height / 8 + 4, width * 2 / buttons.length, height / 2);
    if (!button.clicked) Renderer.drawRect(button.color, width + index, height - height / 8, width * 2 / buttons.length, height / 8);
    Renderer.drawString(button.text, width + index + 24, height - height / 8 + 4, true);
  }
  Renderer.drawRect(Renderer.BLACK, width + 16, height + 16, width * 2, height * 2);
  Renderer.drawRect(Renderer.DARK_GRAY, width, height, width * 2, height * 2);
  const content = getViewText(playerViewData, selectedButton);
  for (let section of content) {
    let index = content.indexOf(section) * width * 2 / content.length;
    Renderer.drawString(section, width + 4 + index, height + 8, true);
  }
  for (let profile of profiles) {
    let index = profiles.indexOf(profile) * width * 2 / profiles.length;
    let colour = currentProfile == profile? Renderer.DARK_AQUA : Renderer.DARK_BLUE;
    Renderer.drawRect(colour, width + index, Renderer.screen.getHeight() - height - height / 6, width * 2 / profiles.length, height / 6);
    let currentGamemode = Object.values(responseData.profiles)[profiles.indexOf(profile)].game_mode;
    Renderer.drawString(`${profile}\n(${currentGamemode})`, width + index + 4, Renderer.screen.getHeight() - height - height / 6 + 4);
  }

  Renderer.scale(3);
  Renderer.drawString(playerViewData.name, ((Renderer.screen.getWidth() - Renderer.getStringWidth(playerViewData.name) * 2) / 2) / 3, Renderer.screen.getHeight() / 32, true);
})

gui.registerClicked((mouseX, mouseY, button) => {
  const width = Renderer.screen.getWidth() / 4;
  const height = Renderer.screen.getHeight() / 4;
  if (mouseX > width && mouseX < Renderer.screen.getWidth() - width && mouseY > height - height / 8 && mouseY < height - height / 8 + height / 8) {
    const index = Math.floor(((mouseX - width) / width) * (buttons.length / 2));
    resetButtons(index);
  }
  else if (mouseX > width && mouseX < Renderer.screen.getWidth() - width && mouseY > height * 4 - height - height / 8 - 8 && mouseY < height * 4 - height) {
    const index = Math.floor(((mouseX - width) / width) * (profiles.length / 2));
    data = Object.values(responseData.profiles)[index];
    currentProfile = data.cute_name;
    playerViewData = {name: playerViewData.name};
    setPlayerData(playerViewData, data);
  }
})

function resetButtons(index) {
  buttons.forEach(button => {
    button.clicked = false;
  })
  buttons[index].clicked = true;
  selectedButton = index;
}

function check(value) {
  if (!value) {
    return 0;
  }
  return value;
}

function setPlayerData(playerViewData, data) {
  playerViewData.skyblockLevel = data.data.skyblock_level.xp / 100;
  playerViewData.networth = formatNumber(check(data.data.networth.networth));
  playerViewData.senitherWeight = Math.floor(check(data.data.weight.senither.overall));
  playerViewData.lilyWeight = Math.floor(check(data.data.weight.lily.total));

  playerViewData.skillAverage = check(data.data.skills.averageSkillLevel).toFixed(2);
  for (let skill in data.data.skills.skills) playerViewData[skill] = check(data.data.skills.skills[skill].levelWithProgress).toFixed(2);

  if (data.data.dungeons && data.data.dungeons.catacombs) {
    playerViewData.cataLevel = data.data.dungeons.catacombs.level? check(data.data.dungeons.catacombs.level.levelWithProgress).toFixed(2) : 0;
    playerViewData.secretsFound = check(data.data.dungeons.secrets_found);
    for (let classType in data.data.dungeons.classes.classes) playerViewData[classType] = check(data.data.dungeons.classes.classes[classType].level.levelWithProgress).toFixed(2);
    playerViewData[data.data.dungeons.classes.selected_class] = "[" + playerViewData[data.data.dungeons.classes.selected_class] + "]";
    for (let essence in data.data.dungeons.essence) playerViewData[essence + "_ess"] = formatNumber(check(data.data.dungeons.essence[essence]));
    for (let floor of Object.values(data.data.dungeons.catacombs.floors)) playerViewData[floor.name] = check(floor.stats.tier_completions);
    for (let floor of Object.values(data.data.dungeons.master_catacombs.floors)) playerViewData["master_" + floor.name] = check(floor.stats.tier_completions);
  }

  playerViewData.slayer_level = {};
  playerViewData.slayer_xp = {};
  if (data.data.slayer) {
    for (let slayer in data.data.slayer.slayers) {
      playerViewData.slayer_level[slayer] = check(data.data.slayer.slayers[slayer].level.currentLevel);
      playerViewData.slayer_xp[slayer] = formatNumber(check(data.data.slayer.slayers[slayer].level.xp));
    };
  }
  else {
    playerViewData.slayer_level = {zombie: 0, spider: 0, wolf: 0, enderman: 0, vampire: 0, blaze: 0};
    playerViewData.slayer_xp = {zombie: 0, spider: 0, wolf: 0, enderman: 0, vampire: 0, blaze: 0};
  }

  if (data.data.mining.core) {
    playerViewData.hotmLevel = check(data.data.mining.core.level.unlockableLevelWithProgress).toFixed(2);
    playerViewData.peakLevel = check(data.data.mining.core.nodes.special_0);
    playerViewData.nucleusRuns = check(data.data.mining.core.crystal_nucleus.times_completed);
    playerViewData.mithrilPowder = check(data.data.mining.core.powder.mithril);
    playerViewData.gemstonePowder = check(data.data.mining.core.powder.gemstone);
    playerViewData.glacitePowder = check(data.data.mining.core.powder.glacite);
  }
  else {
    playerViewData.hotmLevel = 0;
    playerViewData.peakLevel = 0;
    playerViewData.nucleusRuns = 0;
    playerViewData.mithrilPowder = 0;
    playerViewData.gemstonePowder = 0;
    playerViewData.glacitePowder = 0;
  }
  playerViewData.commissions = check(data.data.mining.commissions.completions);

}

function view(player) {
  if (playerViewData.name) {
    if (player.toLowerCase() === playerViewData.name.toLowerCase()) return;
  }

  ChatLib.chat("&eLoading stats for " + player);
  playerViewData.name = player;
  resetButtons(0);

  axios.get("https://api.mojang.com/users/profiles/minecraft/" + player).then(response => {
    player = response.data.name;
  })

  axios.get("https://sky.shiiyu.moe/api/v2/profile/" + player).then(response => {
    responseData = response.data;
    let data;
    playerViewData.name = player;
    for (let profile of Object.values(response.data.profiles)) {
      profiles.push(profile.cute_name);
    }
    for (let profile in response.data.profiles) {
      if (response.data.profiles[profile].current === true) {
        data = response.data.profiles[profile];
        break;
      }
    }
    currentProfile = data.cute_name;

    setPlayerData(playerViewData, data);

  })
}

register("command", (...args) => {
  if (!args[0]) args[0] = Player.getName();
  view(args[0].trim());
  gui.open();
}).setName("view", true).setAliases("v");

register("command", () => {
  Settings.openGUI();
}).setName(`cim`, true);
