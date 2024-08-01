let playerViewData = {};
let name;
let uuid;
let selectedButton = 0;
let profiles = [];
let coop = [];
let responseData;

import { nbtToItem, formatNumber, nbtToJson, Tooltip, rarityColours } from '../../utils/utils.js';
import { buttons, getViewText } from './buttons.js';
import axios from 'axios';

const items = JSON.parse(FileLib.read('ChatItemMenu', 'data/items.json'));
const rabbits = JSON.parse(FileLib.read('ChatItemMenu', 'data/rabbits.json'));

export const gui = new Gui();

function resetButtons(index) {
  buttons.forEach(button => {
    button.clicked = false;
  })
  buttons[index].clicked = true;
  selectedButton = index;
}

function drawScaledString(string, x, y, shadow) {
  let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
  Renderer.scale(scale.x);
  Renderer.drawString(string, x / scale.x, y / scale.y - 8 * (1 - scale.y), shadow);
}

function getScaledStringWidth(string) {
  let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
  return Renderer.getStringWidth(string) * scale.x;
}

function drawMainFrame(buttons, profiles, responseData) {
  Renderer.drawRect(Renderer.color(0, 0, 0, 180), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight()); // transparent background
  const width = Renderer.screen.getWidth() / 4;
  const height = Renderer.screen.getHeight() / 4;
  for (let button of buttons) {
    let index = buttons.indexOf(button) * width * 2 / buttons.length;
    Renderer.drawRect(button.dark, width + index, height - height / 8 + 4, width * 2 / buttons.length, height / 2);
    if (!button.clicked) Renderer.drawRect(button.color, width + index, height - height / 8, width * 2 / buttons.length, height / 8);
    drawScaledString(button.text, width + index + (width * 2 / buttons.length - getScaledStringWidth(button.text)) / 2, height - height / 8 + 6, true);
  }
  Renderer.drawRect(Renderer.BLACK, width + 16, height, width * 2, height * 2 + 16); // main frame
  Renderer.drawRect(Renderer.DARK_GRAY, width, height, width * 2, height * 2); // main frame shadow

  for (let profile of profiles?? []) {
    let index = profiles.indexOf(profile) * width * 2 / profiles.length;
    let colour = currentProfile == profile? Renderer.color(255, 127, 80) : Renderer.color(0, 128, 128);
    Renderer.drawRect(colour, width + index, Renderer.screen.getHeight() - height - height / 6, width * 2 / profiles?.length?? 1, height / 6);
    let currentGamemode = Object.values(responseData?.profiles?? {})[profiles.indexOf(profile)]?.game_mode?? "Unknown";
    drawScaledString(`${profile}\n(${currentGamemode})`, width + index + 4, Renderer.screen.getHeight() - height - height / 6 + 4, true);
  }

  let longestMember = "";
  (coop?? []).forEach(member => {
    if (getScaledStringWidth(member) > getScaledStringWidth(longestMember)) longestMember = member;
  })
  for (let member of coop?? []) {
    let index = coop.indexOf(member);
    let width = Renderer.screen.getWidth();
    let height = Renderer.screen.getHeight();
    let x1 = width / 4 * 3;
    let x2 = x1 + getScaledStringWidth(longestMember) + 8;
    let y1 = height / 4 + (height / 2 / coop.length) * index;
    let y2 = y1 + height / 2 / coop.length;
    Renderer.drawRect(Renderer.DARK_GRAY, x1 + 16, y1 + 16, x2 - x1, y2 - y1);
    Renderer.drawRect(Renderer.GRAY, x1, y1, x2 - x1, y2 - y1);
    drawScaledString(member, x1 + 4, (y1 + y2) / 2, true);
  }
}

let petScrollBuffer = 0;
let rabbitScrollBuffer = 0;

gui.registerDraw(() => {

  drawMainFrame(buttons, profiles, responseData);

  const content = getViewText(playerViewData, selectedButton);

  const width = Renderer.screen.getWidth() / 4;
  const height = Renderer.screen.getHeight() / 4;

  for (let section of content) {
    let index = content.indexOf(section) * width * 2 / content.length;
    section.draw(width + 4 + index, height + 8);
    if (section.hover && playerViewData.currentTooltip) playerViewData.currentTooltip.content = section.hover(width + 4 + index, height + 8);
  }

  if (playerViewData.currentTooltip) {
    let content = playerViewData.currentTooltip?.content?? [];
    if (content?.join(" ")?.trim()?? "" != "") {
      let x = Client.getMouseX();
      let y = Client.getMouseY();
      let scrollx = playerViewData.currentTooltip?.scrolled?.x?? 0;
      let scrolly = playerViewData.currentTooltip?.scrolled?.y?? 0;
      new Tooltip(playerViewData?.currentTooltip?.content?? [], x, y, scrollx, scrolly).draw();
    }
    else {
      playerViewData.currentTooltip = {content: [], scrolled: {x: 0, y: 0}};
    }
  }

  //scroll buffer
  /*let speed = 0.5;
  let petAmount = petScrollBuffer * speed;
  let rabbitAmount = rabbitScrollBuffer * speed;
  if (playerViewData.name) {
    playerViewData.inv.pets.index += petAmount;
    petScrollBuffer -= petAmount;
    playerViewData.rabbits.index += rabbitAmount;
    rabbitScrollBuffer -= rabbitAmount;
  }*/

  if (!playerViewData.currentTooltip) playerViewData.currentTooltip = {content: [], scrolled: {x: 0, y: 0}};

  if (playerViewData.image) Renderer.drawImage(playerViewData.image, 0, height / 2, width, height * 3);
  Renderer.scale(3);
  let drawName = playerViewData.name || name;
  drawScaledString(drawName, (width * 2 - getScaledStringWidth(drawName) * 2) / 3, (height / 2) / 3, true);
})

gui.registerClicked((mouseX, mouseY, button) => {
  let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
  const width = Renderer.screen.getWidth() / 4;
  const height = Renderer.screen.getHeight() / 4;
  if (mouseX > width && mouseX < Renderer.screen.getWidth() - width && mouseY > height - height / 8 && mouseY < height - height / 8 + height / 8) {
    const index = Math.floor(((mouseX - width) / width) * (buttons.length / 2));
    resetButtons(index);
    World.playSound("gui.button.press", 1, 1);
  }
  else if (mouseX > width && mouseX < Renderer.screen.getWidth() - width && mouseY > height * 4 - height - height / 8 - 8 * scale.y && mouseY < height * 4 - height && playerViewData.name) {
    const index = Math.floor(((mouseX - width) / width) * (profiles.length / 2));
    data = Object.values(responseData.profiles)[index];
    currentProfile = data.cute_name;
    playerViewData = {name: playerViewData.name, image: playerViewData.image};
    setPlayerData(playerViewData, data);
    coop = [];
    for (let member of data.data.members) {
      coop.push(member.display_name);
    }
    World.playSound("gui.button.press", 1, 1);
  }
  else if (mouseX > width * 3 && mouseX < width * 4 && mouseY > height && mouseY < height * 3 && coop != [] && playerViewData.name) {
    let index = Math.floor(((mouseY - height) / height) * (coop.length / 2));
    view(coop[index]);
    World.playSound("gui.button.press", 1, 1);
  }
  // pet up arrow
  else if (mouseX > width * 2 - 8 * scale.x && mouseX < width * 2 + 8 * scale.x && mouseY > height * 3 - 48 * scale.y && mouseY < height * 3 - 32 * scale.y && selectedButton == 1) {
    if (playerViewData.inv.pets.index > 0) playerViewData.inv.pets.index -= 1;
    World.playSound("gui.button.press", 1, 1);
  }
  // pet down arrow
  else if (mouseX > width * 2 - 8 * scale.x && mouseX < width * 2 + 8 * scale.x && mouseY > height * 3 - 38 * scale.y && mouseY < height * 3 - 22 * scale.y && selectedButton == 1) {
    let height = Math.floor(508 / 2 / 10);
    if (playerViewData.inv.pets.index + 1 < Math.floor(playerViewData.inv.pets.pets.length / height) + 1) playerViewData.inv.pets.index += 1;
    World.playSound("gui.button.press", 1, 1);
  }
  // inventory up arrow
  else if (mouseX > width / 3 * 8 - 8 * scale.x && mouseX < width / 3 * 8 + 8 * scale.x && mouseY > height * 3 - 48 * scale.y && mouseY < height * 3 - 32 * scale.y && selectedButton == 1) {
    if (playerViewData.storageIndex > 0) playerViewData.storageIndex -= 1;
    World.playSound("gui.button.press", 1, 1);
  }
  // inventory down arrow
  else if (mouseX > width / 3 * 8 - 8 * scale.x && mouseX < width / 3 * 8 + 8 * scale.x && mouseY > height * 3 - 38 * scale.y && mouseY < height * 3 - 22 * scale.y && selectedButton == 1) {
    if (playerViewData.storageIndex + 1 < playerViewData.storage.length) playerViewData.storageIndex += 1;
    World.playSound("gui.button.press", 1, 1);
  }
  // rabbit up arrow
  else if (mouseX > width * 2 - 8 * scale.x && mouseX < width * 2 + 8 * scale.x && mouseY > height * 3 - 48 * scale.y && mouseY < height * 3 - 32 * scale.y && selectedButton == 2 && playerViewData) {
    if (playerViewData.rabbits.index > 0) playerViewData.rabbits.index -= 1;
    World.playSound("gui.button.press", 1, 1);
  }
  // rabbit down arrow
  else if (mouseX > width * 2 - 8 * scale.x && mouseX < width * 2 + 8 * scale.x && mouseY > height * 3 - 38 * scale.y && mouseY < height * 3 - 22 * scale.y && selectedButton == 2 && playerViewData) {
    let height = Math.floor(508 / 2 / 10);
    if (playerViewData.rabbits.index + 1 < Math.floor(playerViewData.rabbits.rabbits.length / height) + 1) playerViewData.rabbits.index += 1;
    World.playSound("gui.button.press", 1, 1);
  }
  // missing rabbit up arrow
  else if (mouseX > width * 8 / 3 - 8 * scale.x && mouseX < width * 8 / 3 + 8 * scale.x && mouseY > height * 3 - 48 * scale.y && mouseY < height * 3 - 32 * scale.y && selectedButton == 2 && playerViewData) {
    if (playerViewData.missingRabbits.index > 0) playerViewData.missingRabbits.index -= 1;
    World.playSound("gui.button.press", 1, 1);
  }
  // missing rabbit down arrow
  else if (mouseX > width * 8 / 3 - 8 * scale.x && mouseX < width * 8 / 3 + 8 * scale.x && mouseY > height * 3 - 38 * scale.y && mouseY < height * 3 - 22 * scale.y && selectedButton == 2 && playerViewData) {
    let height = Math.floor(508 / 2 / 10);
    if (playerViewData.missingRabbits.index + 1 < Math.floor(playerViewData.missingRabbits.rabbits.length / height) + 1) playerViewData.missingRabbits.index += 1;
    World.playSound("gui.button.press", 1, 1);
  }
})

gui.registerScrolled((mouseX, mouseY, direction) => {
  if (!playerViewData.currentTooltip.scrolled) playerViewData.currentTooltip.scrolled = {x: 0, y: 0};
  if (Keyboard.isKeyDown(Keyboard.KEY_LSHIFT)) playerViewData.currentTooltip.scrolled.x -= direction * 10;
  else playerViewData.currentTooltip.scrolled.y -= direction * 10;
  /*if (selectedButton == 1) {
    let petHeight = Math.floor(Renderer.screen.getHeight() / 2 / 10);
    if ((playerViewData.inv.pets.index + petScrollBuffer) - direction / petHeight * 2 > 0) petScrollBuffer -= direction / petHeight * 2;
  }
  else if (selectedButton == 2) {
    let rabbitHeight = Math.floor(Renderer.screen.getHeight() / 2 / 10);
    if ((playerViewData.rabbits.index + rabbitScrollBuffer) - direction / rabbitHeight * 2 > 0) rabbitScrollBuffer -= direction / rabbitHeight * 2;
  }*/
})

function setPlayerData(playerViewData, data) {
  let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
  //General
  playerViewData.skyblockLevel = data.data.skyblock_level.xp / 100;
  playerViewData.networth = formatNumber(data.data.networth?.networth?? 0);
  playerViewData.purse = formatNumber(data.data.currencies.purse);
  playerViewData.bank = formatNumber(data.data.currencies.bank);
  playerViewData.senitherWeight = Math.floor(data.data.weight?.senither?.overall?? 0);
  playerViewData.lilyWeight = Math.floor(data.data.weight?.lily?.total?? 0);
  playerViewData.lastArea = data.raw.current_area?? "Unknown";
  playerViewData.skillAverage = (data.data.skills?.averageSkillLevel?? 0).toFixed(2);
  playerViewData.skills = [];
  for (let skill in data.data.skills?.skills?? {}) {
    let name = skill.charAt(0).toUpperCase() + skill.slice(1);
    playerViewData.skills.push({name: name, level: data.data.skills.skills[skill].levelWithProgress.toFixed(2)});
  }
  playerViewData.firstJoin = new Date(data.raw.profile?.first_join).toLocaleDateString({})?? "Unknown";
  playerViewData.cookieBuff = data.raw.profile?.cookie_buff_active?? false;
  playerViewData.serums = data.raw.experimentation?.serums_drank?? 0;
  playerViewData.deaths = data.raw.player_data?.death_count?? 0;
  playerViewData.glowingMushroomsBroken = data.raw.player_stats?.glowing_mushrooms_broken?? 0;
  playerViewData.fairySoulsUnspent = data.raw.fairy_soul?.unspent_souls?? 0;
  playerViewData.fairySouls = data.raw.fairy_soul?.total_collected?? 0;
  playerViewData.soulflow = data.raw.item_data?.soulflow?? 0;
  
  //Inventory
  playerViewData.inv = {};
  playerViewData.inv.talismans = {mp: 0, unique: {}, total: {}};
  playerViewData.inv.talismans.mp = data.data.accessories?.magical_power?.total?? 0;
  playerViewData.inv.talismans.power = data.raw.accessory_bag_storage?.selected_power?? "Unknown"; 
  playerViewData.inv.talismans.unique.normal = data.data.accessories?.unique?? 0;
  playerViewData.inv.talismans.unique.recomb = data.data.accessories?.recombobulated?? 0;
  playerViewData.inv.talismans.total.normal = data.data.accessories?.total?? 0;
  playerViewData.inv.talismans.total.recomb = data.data.accessories?.total_recombobulated?? 0;
  playerViewData.inv.content = [];
  let width = Renderer.screen.getWidth();
  let height = Renderer.screen.getHeight();
  let inventoryItems = [];
  let hotbar = [];
  data.data.items.inventory.forEach((item, itemIndex) => {
    if (itemIndex < 9) {
      hotbar.push(item);
    } else {
      inventoryItems.push(item);
    }
  });
  inventoryItems = inventoryItems.concat(hotbar);
  for (let item of data.data.items.armor.armor.slice().reverse()) inventoryItems.push(item);
  inventoryItems.push({});
  for (let item of data.data.items.equipment.equipment) inventoryItems.push(item);
  inventoryItems.push({},{},{},{},{},{},{},{},{},);
  let shouldInsertBlank = 0;
  for (let armourSet of data.data.items.wardrobe) {
    for (let piece of armourSet) {
      inventoryItems.push(piece);
    }
    shouldInsertBlank++;
    if (shouldInsertBlank % 2 !== 0) {
      inventoryItems.push({});
    }
  }
  for (let item of inventoryItems) {
    if (!item) continue;
    if (!item.tag) continue;
    let index = inventoryItems.indexOf(item);

    let colIndex = index % 9;
    let rowIndex = Math.floor(index / 9);
  
    let x = width / 4 + colIndex * 16 * scale.x;
    let y = height / 4 + rowIndex * 16 * scale.y;

    item = nbtToItem(item);

    let itemPosition = {item: item, pos: {x, y}};

    playerViewData.inv.content.push(itemPosition);
  }
  playerViewData.inv.pets = {pets: [], index: 0};
  (data.data.pets?.pets?? []).forEach((pet, petIndex) => {
    let level = pet.level.level;
    let name = `&8[&f${level}&8]&f ${rarityColours[pet.rarity.toUpperCase()]}${pet.display_name}`;
    let lore = pet.tag.display.Lore;
    if (lore[0] != name) lore.unshift(name);
    playerViewData.inv.pets.pets.push({name: name, lore: lore});
  })
  playerViewData.storageIndex = 0;
  playerViewData.storage = [];
  for (let talisman of data.data?.items?.accessory_bag?? []) {
    if (!talisman) continue;
    if (!talisman.tag) continue;
    let index = data.data.items.accessory_bag.indexOf(talisman);

    let pageIndex = Math.floor(index / 45);
    let colIndex = index % 9;
    let rowIndex = Math.floor(index / 9) - (pageIndex * 5);

    let x = width / 1.75 + colIndex * 16 * scale.x
    let y = height / 4 + rowIndex * 16 * scale.y + height / 8;

    talisman = nbtToItem(talisman);

    let position = {item: talisman, pos: {x, y}};

    if (!playerViewData.storage[pageIndex]) playerViewData.storage[pageIndex] = {name: "&eAccessories &f" + (pageIndex + 1), content: []};
    playerViewData.storage[pageIndex].content.push(position);
  }
  let echestPages = [];
  for (let item of data.data?.items?.enderchest?? []) {
    let index = data.data.items.enderchest.indexOf(item);
    let pageIndex = Math.floor(index / 45);
    if (!echestPages[pageIndex]) echestPages[pageIndex] = [];

    if (!item || !item.tag) continue;

    let colIndex = index % 9;
    let rowIndex = Math.floor(index / 9) - (pageIndex * 5);

    let x = width / 1.75 + colIndex * 16 * scale.x;
    let y = height / 4 + rowIndex * 16 * scale.y + height / 8;

    item = nbtToItem(item);

    let position = {item: item, pos: {x, y}};

    echestPages[pageIndex].push(position);
  }
  echestPages.forEach((page, index) => playerViewData.storage.push({name: "&5Ender Chest &f" + (index + 1), content: page}));
  let backpackPages = [];
  for (let backpack of data.data?.items?.storage?? []) {
    let backpackIndex = data.data.items.storage.indexOf(backpack);
    backpackPages[backpackIndex] = [];
    for (let item of backpack?.containsItems?? []) {
      if (!item || !item.tag) continue;
      let index = backpack.containsItems.indexOf(item);

      let colIndex = index % 9;
      let rowIndex = Math.floor(index / 9);
  
      let x = width / 1.75 + colIndex * 16 * scale.x;
      let y = height / 4 + rowIndex * 16 * scale.y + height / 8;
  
      item = nbtToItem(item);
  
      let position = {item: item, pos: {x, y}};
  
      if (!backpackPages[backpackIndex]) backpackPages[backpackIndex] = [];
      backpackPages[backpackIndex].push(position);
    }
  }
  backpackPages.forEach((page, index) => playerViewData.storage.push({name: "&6Backpack &f" + (index + 1), content: page}));

  //CF
  playerViewData.cfPrestige = data.raw.events?.easter?.chocolate_level?? 0;
  playerViewData.currentChocolate = formatNumber(data.raw.events?.easter?.chocolate?? 0);
  playerViewData.chocolateSincePrestige = formatNumber(data.raw.events?.easter?.chocolate_since_prestige?? 0);
  playerViewData.rabbits = {rabbits: [], index: 0};
  playerViewData.rabbitCount = 0;
  playerViewData.duplicateRabbits = 0;
  playerViewData.rabbitRarityCount = {"DIVINE": 0, "MYTHIC": 0, "LEGENDARY": 0, "EPIC": 0, "RARE": 0, "UNCOMMON": 0, "COMMON": 0};
  for (let rabbit in data.raw.events?.easter?.rabbits?? {}) {
    if (rabbit === "collected_eggs" || rabbit === "collected_locations") continue;
    let count = data.raw.events.easter.rabbits[rabbit];
    if (rabbits[rabbit]) {
      playerViewData.rabbits.rabbits.push({name: "&8[&f" + count + "&8]&f " + rabbits[rabbit].name, lore: rabbits[rabbit].lore, rarity: rabbits[rabbit].rarity});
      let rarityUnformatted = ChatLib.removeFormatting(rabbits[rabbit].rarity.toLowerCase()).toUpperCase();
      playerViewData.rabbitRarityCount[rarityUnformatted]++;
    } else {
      playerViewData.rabbits.rabbits.push({ rarity: '', name: rabbit, lore: [] });
    }
    playerViewData.rabbitCount++;
    playerViewData.duplicateRabbits += count - 1;
  }
  playerViewData.rabbits.rabbits = sortRabbits(playerViewData.rabbits.rabbits);
  playerViewData.lastCfCheck = new Date(data.raw.events?.easter?.last_viewed_chocolate_factory?? null).toLocaleDateString({})?? "Unknown";
  playerViewData.missingRabbits = {rabbits: [], index: 0};
  let rabbitNames = (playerViewData.rabbits?.rabbits?? []).map(rabbit => rabbit.name);
  for (let rabbit in rabbits) {
    if (!rabbitNames.includes(rabbits[rabbit].name)) {
      playerViewData.missingRabbits.rabbits.push({name: "&8[&70&8] &f" + rabbits[rabbit].name, lore: rabbits[rabbit].lore, rarity: rabbits[rabbit].rarity});
    }
  }
  playerViewData.timeTower = data.raw?.events?.easter?.time_tower?.level?? 0;
  playerViewData.shrine = data.raw?.events?.easter?.rabbit_rarity_upgrades?? 0;
  playerViewData.coach = data.raw?.events?.easter?.chocolate_multiplier_upgrades?? 0;

  //Dungeons
  playerViewData.dungeons = {
    cataLevel: 0,
    cataExp: 0,
    secretsFound: 0, 
    classes: {
      healer: {
        level: 0,
        exp: 0,
        selected: false
      },
      mage: {
        level: 0,
        exp: 0,
        selected: false
      },
      berserk: {
        level: 0,
        exp: 0,
        selected: false
      },
      archer: {
        level: 0,
        exp: 0,
        selected: false
      },
      tank: {
        level: 0,
        exp: 0,
        selected: false
      }
    },
    essence: {
      ice: 0,
      wither: 0,
      spider: 0,
      undead: 0,
      diamond: 0,
      dragon: 0,
      gold: 0,
      crimson: 0
    },
    floors: {
      normal: {
        entrance: 0,
        floor_1: 0,
        floor_2: 0,
        floor_3: 0,
        floor_4: 0,
        floor_5: 0,
        floor_6: 0,
        floor_7: 0
      },
      master: {
        floor_1: 0,
        floor_2: 0,
        floor_3: 0,
        floor_4: 0,
        floor_5: 0,
        floor_6: 0,
        floor_7: 0
      }
    }
  }
  playerViewData.dungeons = getDungeonsData(data.data.dungeons, playerViewData.dungeons);

  //Slayer
  playerViewData.slayer_level = {zombie: 0, spider: 0, wolf: 0, enderman: 0, vampire: 0, blaze: 0};
  playerViewData.slayer_xp = {zombie: 0, spider: 0, wolf: 0, enderman: 0, vampire: 0, blaze: 0};
  for (let slayer in data.data.slayer?.slayers?? {}) {
    playerViewData.slayer_level[slayer] = data.data.slayer.slayers[slayer].level.currentLevel;
    playerViewData.slayer_xp[slayer] = formatNumber(data.data.slayer.slayers[slayer].level.xp);
  };

  //HOTM
  playerViewData.hotmLevel = 0;
  playerViewData.peakLevel = 0;
  playerViewData.nucleusRuns = 0;
  playerViewData.mithrilPowder = 0;
  playerViewData.gemstonePowder = 0;
  playerViewData.glacitePowder = 0;
  playerViewData.commissions = 0;
  playerViewData.hotmLevel = (data.data.mining?.core?.level?.unlockableLevelWithProgress?? 0).toFixed(2);
  playerViewData.peakLevel = data.data.mining?.core?.nodes?.special_0?? 0;
  playerViewData.nucleusRuns = data.data.mining?.core?.crystal_nucleus?.times_completed?? 0;
  playerViewData.mithrilPowder = data.data.mining?.core?.powder?.mithril?? 0;
  playerViewData.gemstonePowder = data.data.mining?.core?.powder?.gemstone?? 0;
  playerViewData.glacitePowder = data.data.mining?.core?.powder?.glacite?? 0;
  playerViewData.commissions = data.data.mining?.commissions?.completions?? 0;

  //Isle
  playerViewData.isle = {
    mageRep: 0,
    barbRep: 0,
    lastMatriarch: "Unknown",
    kuudra: {
      basic: 0,
      hot: 0,
      burning: 0,
      fiery: 0,
      infernal: 0
    },
    kills: {
      ashfang: 0,
      duke: 0,
      bladesoul: 0,
      outlaw: 0,
      magma: 0,
      vanquisher: 0
    },
    dojo: {
      total: 0,
      types: {
        discipline: 0,
        tenacity: 0,
        mastery: 0,
        control: 0,
        swiftness: 0,
        stamina: 0,
        force: 0
      }
    }
  };
  playerViewData.isle.mageRep = data.raw.nether_island_player_data?.mages_reputation?? 0;
  if (data.data.crimson_isle?.factions?.selected_faction?? null == "Mages") playerViewData.isle.mageRep = "&8[&f" + playerViewData.isle.mageRep + "&8]";
  else if (data.data.crimson_isle?.factions?.selected_faction?? null == "Barbarians") playerViewData.isle.barbRep = "&8[&f" + playerViewData.isle.barbRep + "&8]";
  playerViewData.isle.barbRep = data.raw.nether_island_player_data?.barbarians_reputation?? 0;
  playerViewData.isle.lastMatriarch = new Date(data.raw.nether_island_player_data?.matriarch?.last_attempt?? null).toLocaleDateString({})?? "Unknown";
  playerViewData.isle.kuudra.basic = data.raw.nether_island_player_data?.kuudra_completed_tiers?.none?? 0;
  playerViewData.isle.kuudra.hot = data.raw.nether_island_player_data?.kuudra_completed_tiers?.hot?? 0;
  playerViewData.isle.kuudra.burning = data.raw.nether_island_player_data?.kuudra_completed_tiers?.burning?? 0;
  playerViewData.isle.kuudra.fiery = data.raw.nether_island_player_data?.kuudra_completed_tiers?.fiery?? 0;
  playerViewData.isle.kuudra.infernal = data.raw.nether_island_player_data?.kuudra_completed_tiers?.infernal?? 0;
  playerViewData.isle.kills.ashfang = data.data.bestiary?.categories?.crimson_isle?.mobs?.[0]?.kills?? 0;
  playerViewData.isle.kills.duke = data.data.bestiary?.categories?.crimson_isle?.mobs?.[1]?.kills?? 0;
  playerViewData.isle.kills.bladesoul = data.data.bestiary?.categories?.crimson_isle?.mobs?.[2]?.kills?? 0;
  playerViewData.isle.kills.outlaw = data.data.bestiary?.categories?.crimson_isle?.mobs?.[9]?.kills?? 0;
  playerViewData.isle.kills.magma = data.data.bestiary?.categories?.crimson_isle?.mobs?.[11]?.kills?? 0;
  playerViewData.isle.kills.vanquisher = data.data.bestiary?.categories?.crimson_isle?.mobs?.[18]?.kills?? 0;
  playerViewData.isle.dojo.total = data.data.crimson_isle?.dojo?.total_points?? 0;
  playerViewData.isle.dojo.types.discipline = data.data.crimson_isle?.dojo?.dojo?.SWORD_SWAP?.points?? 0;
  playerViewData.isle.dojo.types.tenacity = data.data.crimson_isle?.dojo?.dojo?.FIREBALL?.points?? 0;
  playerViewData.isle.dojo.types.mastery = data.data.crimson_isle?.dojo?.dojo?.ARCHER?.points?? 0;
  playerViewData.isle.dojo.types.control = data.data.crimson_isle?.dojo?.dojo?.LOCK_HEAD?.points?? 0;
  playerViewData.isle.dojo.types.swiftness = data.data.crimson_isle?.dojo?.dojo?.SNAKE?.points?? 0;
  playerViewData.isle.dojo.types.stamina = data.data.crimson_isle?.dojo?.dojo?.WALL_JUMP?.points?? 0;
  playerViewData.isle.dojo.types.force = data.data.crimson_isle?.dojo?.dojo?.MOB_KB?.points?? 0;

  //Trophy fish
  playerViewData.trophy = {};
  playerViewData.trophy.total = data.data.crimson_isle?.trophy_fish?.total_caught?? 0;
  playerViewData.trophy.content = [];
  for (let fish of data.data.crimson_isle?.trophy_fish?.fish?? []) {
    let index = data.data.crimson_isle.trophy_fish.fish.indexOf(fish);

    let colIndex = index % 18;
    let rowIndex = Math.floor(index / 18);
  
    let x = width / 4 + colIndex * (width / 2 / 18);
    let y = height / 3 + rowIndex * 16 * scale.y;

    let tag;
    for (let i in items) {
      if (items[i].displayname.includes(fish.display_name)) {
        let nbt = nbtToJson(items[i].nbttag);
        tag = JSON.parse(nbt);
        break;
      }
    }

    let item = {
      id: 397,
      Count: 1, 
      tag: tag, 
      Damage: 3
    };
    item = nbtToItem(item);
    let colour = fish.highest_tier? trophyFishTierColours[fish.highest_tier] : ""
    let tier = fish.highest_tier? colour + fish.highest_tier.toUpperCase() : "";
    item.setName(fish.display_name + tier);
    let lore = [];
    fish.description.split(/[.,]+/).forEach(line => lore.push("&7" + line.trim()));
    lore.push("&5&oTotal: " + fish.total, "&8Bronze: " + fish.bronze, "&7Silver: " + fish.silver, "&6Gold: " + fish.gold, "&bDiamond: " + fish.diamond);
    item.setLore(lore);

    let itemPosition = {item: item, pos: {x, y}, count: colour.trim() + fish.total};

    playerViewData.trophy.content.push(itemPosition);
  }
}

function getDungeonsData(data, pData) {
  pData.cataLevel = parseFloat((data?.catacombs?.level?.levelWithProgress?? 0).toFixed(2));
  pData.cataExp = formatNumber(Math.floor(data?.catacombs?.level?.xp?? 0));
  pData.secretsFound = data?.secrets_found?? 0;
  for (let type in data?.classes?.classes?? {}) {
    let classData = data.classes.classes[type];
    pData.classes[type].level = parseFloat(classData.level.levelWithProgress.toFixed(2));
    pData.classes[type].exp = Math.floor(classData.level.xp);
    pData.classes[type].selected = classData.current;
  }
  for (let essence in data?.essence?? {}) {
    pData.essence[essence] = formatNumber(data.essence[essence]);
  }
  for (let floor of Object.values(data?.catacombs?.floors?? {})) pData.floors.normal[floor.name] = floor.stats?.tier_completions?? 0;
  for (let floor of Object.values(data?.master_catacombs?.floors?? {})) pData.floors.master[floor.name] = floor.stats?.tier_completions?? 0;
  return pData;
}

const rabbitOrder = [
  "DIVINE",
  "MYTHIC",
  "LEGENDARY",
  "EPIC",
  "RARE",
  "UNCOMMON",
  "COMMON"
]

function sortRabbits(arr) {
  let sortedRabbits = [[], [], [], [], [], [], []];

  arr.forEach(rabbit => {
    let index = 0;
    for (let order of rabbitOrder) {
      let rarity = ChatLib.removeFormatting(rabbit.rarity.toLowerCase());
      if (rarity == order.toLowerCase()) index = rabbitOrder.indexOf(order);
    }
    sortedRabbits[index].push(rabbit);
  });
  let combined = [];
  for (let arr of sortedRabbits) {
    for (let element of arr) {
      combined.push(element);
    }
  }

  return combined;
}

const trophyFishTierColours = {
  "bronze": " &r&8&l",
  "silver": " &r&7&l",
  "gold": " &r&6&l",
  "diamond": " &r&b&l"
}

let requesting = false;
export function view(player) {
  if (playerViewData.name) {
    if (player.toLowerCase() === playerViewData.name.toLowerCase() || player.toLowerCase() === name.toLowerCase()) return;
  }

  if (requesting === true) return;

  requesting = true;

  name = player;
  playerViewData = {};
  coop = [];
  profiles = [];
  resetButtons(0);

  axios.get("https://api.mojang.com/users/profiles/minecraft/" + player).then(response => {
    name = response.data.name;
    playerViewData.uuid = response.data.id;
    playerViewData.image = new Image(player + "_view_image.png", "https://visage.surgeplay.com/full/1024/" + uuid);
  }).catch(e => {
    requesting = false;
    playerViewData.error = e.response.data.error;
  })

  axios.get("https://sky.lenny.ie/api/v2/profile/" + player).then(response => {
    responseData = response.data;
    playerViewData.name = player;
    let data;
    for (let profile of Object.values(responseData.profiles)) {
      profiles.push(profile.cute_name);
    }
    for (let profile of Object.values(responseData.profiles)) {
      if (profile.current === true) {
        currentProfile = profile.cute_name;
        data = profile;
        break;
      }
    }
    for (let member of data.data.members) {
      coop.push(member.display_name);
    }

    setPlayerData(playerViewData, data);
    requesting = false;
  }).catch(e => {
    if (e.response.data.error == "Player has no SkyBlock profiles.") {
      axios.get("https://sky.lenny.ie/stats/" + player).then(response => {
        axios.get("https://sky.lenny.ie/api/v2/profile/" + player).then(response => {
          responseData = response.data;
          playerViewData.name = player;
          let data;
          for (let profile of Object.values(responseData.profiles)) {
            profiles.push(profile.cute_name);
          }
          for (let profile of Object.values(responseData.profiles)) {
            if (profile.current === true) {
              currentProfile = profile.cute_name;
              data = profile;
              break;
            }
          }
          for (let member of data.data.members) {
            coop.push(member.display_name);
          }
      
          setPlayerData(playerViewData, data);
          requesting = false;
        }).catch(e => {
          requesting = false;
          playerViewData.error = e.response.data.error;
        })
      })
    }
    else {
      requesting = false;
      playerViewData.error = e.response.data.error;
    }
  });
}
