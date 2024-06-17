let playerViewData = {};
let name;
let selectedButton = 0;
let profiles = [];
let currentProfile;
let responseData;

import { nbtToItem, formatNumber, nbtToJson } from './utils.js';
import { buttons, getViewText } from './buttons.js';
import axios from 'axios';

const items = JSON.parse(FileLib.read('ChatItemMenu', 'items.json'));

export const gui = new Gui();

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

gui.registerDraw(() => {
  Renderer.drawRect(Renderer.color(0, 0, 0, 180), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight());
  const width = Renderer.screen.getWidth() / 4;
  const height = Renderer.screen.getHeight() / 4;
  for (let button of buttons) {
    let index = buttons.indexOf(button) * width * 2 / buttons.length;
    Renderer.drawRect(button.dark, width + index, height - height / 8 + 4, width * 2 / buttons.length, height / 2);
    if (!button.clicked) Renderer.drawRect(button.color, width + index, height - height / 8, width * 2 / buttons.length, height / 8);
    Renderer.drawString(button.text, width + index + ((width * 2 / buttons.length) - button.text.length) / 4 - 4, height - height / 8 + 6, true);
  }
  Renderer.drawRect(Renderer.BLACK, width + 16, height, width * 2, height * 2 + 16);
  Renderer.drawRect(Renderer.DARK_GRAY, width, height, width * 2, height * 2);
  const content = getViewText(playerViewData, selectedButton);
  for (let section of content) {
    let index = content.indexOf(section) * width * 2 / content.length;
    Renderer.drawString(section, width + 4 + index, height + 8, true);
  }
  if (profiles) {
    for (let profile of profiles) {
      let index = profiles.indexOf(profile) * width * 2 / profiles.length;
      let colour = currentProfile == profile? Renderer.DARK_AQUA : Renderer.DARK_BLUE;
      Renderer.drawRect(colour, width + index, Renderer.screen.getHeight() - height - height / 6, width * 2 / profiles.length, height / 6);
      let currentGamemode = Object.values(responseData.profiles)[profiles.indexOf(profile)].game_mode;
      Renderer.drawString(`${profile}\n(${currentGamemode})`, width + index + 4, Renderer.screen.getHeight() - height - height / 6 + 4);
    }
  }
  if (selectedButton == 1 && playerViewData.inv) {
    if (playerViewData.inv.content) {
      for (let item of playerViewData.inv.content) {
        item.item.draw(item.pos.x, item.pos.y);
      }
    }
    if (playerViewData.currentTooltip) {
      let x = Client.getMouseX();
      let y = Client.getMouseY();
      let scrollx = playerViewData.currentTooltip?.scrolled?.x?? 0;
      let scrolly = playerViewData.currentTooltip?.scrolled?.y?? 0;
      if (playerViewData.currentTooltip.content) Renderer.drawString(playerViewData.currentTooltip.content.join("\n"), x + scrollx + 4, y + scrolly + 4, true);
    }
  }
  if (selectedButton == 7 && playerViewData.trophy) {
    if (playerViewData.trophy.content) {
      for (let item of playerViewData.trophy.content) {
        item.item.draw(item.pos.x, item.pos.y);
        Renderer.drawString(item.count, item.pos.x, item.pos.y - 16);
      }
    }
    if (playerViewData.currentTooltip) {
      let x = Client.getMouseX();
      let y = Client.getMouseY();
      let scrollx = playerViewData.currentTooltip?.scrolled?.x?? 0;
      let scrolly = playerViewData.currentTooltip?.scrolled?.y?? 0;
      if (playerViewData.currentTooltip.content) Renderer.drawString(playerViewData.currentTooltip.content.join("\n"), x + scrollx + 4, y + scrolly + 4, true);
    }
  }

  let mouseX = Client.getMouseX();
  let mouseY = Client.getMouseY();
  if (!playerViewData.currentTooltip) playerViewData.currentTooltip = {};
  let itemClicked = false;
  if (playerViewData.inv && playerViewData.inv.content && selectedButton == 1) {
    for (let item of playerViewData.inv.content) {
      if (mouseX > item.pos.x && mouseX < item.pos.x + 16 && mouseY > item.pos.y && mouseY < item.pos.y + 16) {
        itemClicked = true;
        playerViewData.currentTooltip.content = item.item.getLore();
        for (let line of playerViewData.currentTooltip.content) {
          if (match = line.match(/<local-time\s+timestamp="(\d+)">/)) {
            playerViewData.currentTooltip.content[playerViewData.currentTooltip.content.indexOf(line)] = "&7Obtained: &c" + new Date(parseInt(match[1])).toLocaleDateString({});
          }
        }
      }
    }
  }
  if (playerViewData.trophy && playerViewData.trophy.content && selectedButton == 7) {
    for (let item of playerViewData.trophy.content) {
      if (mouseX > item.pos.x && mouseX < item.pos.x + 16 && mouseY > item.pos.y && mouseY < item.pos.y + 16) {
        itemClicked = true;
        playerViewData.currentTooltip.content = item.item.getLore();
      }
    }
  }
  if (!itemClicked) playerViewData.currentTooltip = null;

  Renderer.scale(0.5);
  if (playerViewData.image) playerViewData.image.draw(0, Renderer.screen.getHeight() / 8);
  Renderer.scale(3);
  Renderer.drawString(name, ((Renderer.screen.getWidth() - Renderer.getStringWidth(name) * 2) / 2) / 3, Renderer.screen.getHeight() / 32, true);
})

gui.registerClicked((mouseX, mouseY, button) => {
  const width = Renderer.screen.getWidth() / 4;
  const height = Renderer.screen.getHeight() / 4;
  if (mouseX > width && mouseX < Renderer.screen.getWidth() - width && mouseY > height - height / 8 && mouseY < height - height / 8 + height / 8) {
    const index = Math.floor(((mouseX - width) / width) * (buttons.length / 2));
    resetButtons(index);
  }
  else if (mouseX > width && mouseX < Renderer.screen.getWidth() - width && mouseY > height * 4 - height - height / 8 - 8 && mouseY < height * 4 - height && playerViewData.name) {
    const index = Math.floor(((mouseX - width) / width) * (profiles.length / 2));
    data = Object.values(responseData.profiles)[index];
    currentProfile = data.cute_name;
    playerViewData = {name: playerViewData.name, image: playerViewData.image};
    setPlayerData(playerViewData, data);
  }
})

gui.registerScrolled((mouseX, mouseY, direction) => {
  if (!playerViewData.currentTooltip) return;
  if (!playerViewData.currentTooltip.scrolled) playerViewData.currentTooltip.scrolled = {x: 0, y: 0};
  if (Keyboard.isKeyDown(Keyboard.KEY_LSHIFT)) playerViewData.currentTooltip.scrolled.x -= direction * 10;
  else playerViewData.currentTooltip.scrolled.y -= direction * 10;
})

function setPlayerData(playerViewData, data) {
  //General
  playerViewData.skyblockLevel = data.data.skyblock_level.xp / 100;
  playerViewData.networth = formatNumber(check(data.data.networth.networth));
  playerViewData.purse = formatNumber(data.data.currencies.purse);
  playerViewData.bank = formatNumber(data.data.currencies.bank);
  playerViewData.senitherWeight = Math.floor(data.data.weight?.senither?.overall?? 0);
  playerViewData.lilyWeight = Math.floor(data.data.weight?.lily?.total?? 0);
  playerViewData.lastArea = data.raw.current_area?? "Unknown";
  playerViewData.cfPrestige = data.raw.events?.easter?.chocolate_level?? 0;
  playerViewData.currentChocolate = formatNumber(data.raw.events?.easter?.chocolate?? 0);
  playerViewData.chocolateSincePrestige = formatNumber(data.raw.events?.easter?.chocolate_since_prestige?? 0);
  let rabbitCount = 0;
  let duplicates = 0;
  for (let rabbit in data.raw.events.easter.rabbits) {
    if (rabbit == "collected_eggs" || rabbit == "collected_locations") continue;
    let count = data.raw.events.easter.rabbits[rabbit];
    rabbitCount++;
    duplicates += count - 1;
  }
  playerViewData.rabbitCount = rabbitCount;
  playerViewData.duplicateRabbits = duplicates;
  playerViewData.lastCfCheck = new Date(data.raw.events?.easter?.last_viewed_chocolate_factory?? null).toLocaleDateString({})?? "Unknown";
  
  //Inventory
  playerViewData.inv = {};
  playerViewData.inv.talismans = {mp: 0, unique: {}, total: {}};
  playerViewData.inv.talismans.mp = data.data.accessories?.magical_power?.total?? 0;
  playerViewData.inv.talismans.unique.normal = data.data.accessories?.unique?? 0;
  playerViewData.inv.talismans.unique.recomb = data.data.accessories?.recombobulated?? 0;
  playerViewData.inv.talismans.total.normal = data.data.accessories?.total?? 0;
  playerViewData.inv.talismans.total.recomb = data.data.accessories?.total_recombobulated?? 0;
  playerViewData.inv.content = [];
  let width = Renderer.screen.getWidth();
  let height = Renderer.screen.getHeight();
  let inventoryItems = [];
  for (let item of data.data.items.inventory) inventoryItems.push(item);
  for (let item of data.data.items.armor.armor.reverse()) inventoryItems.push(item);
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
  
    let x = width / 4 + (width / 9 * colIndex + 8) / 7;
    let y = height / 4 + rowIndex * 16;

    item = nbtToItem(item);

    let itemPosition = {item: item, pos: {x, y}};

    playerViewData.inv.content.push(itemPosition);
  }

  //Skills
  playerViewData.skillAverage = check(data.data.skills.averageSkillLevel).toFixed(2);
  for (let skill in data.data.skills.skills) playerViewData[skill] = check(data.data.skills.skills[skill].levelWithProgress).toFixed(2);

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

  //HOTM
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
  if (data.data.crimson_isle?.factions?.selected_faction?? 0 == "Mages") playerViewData.isle.mageRep = "[" + playerViewData.isle.mageRep + "]";
  if (data.data.crimson_isle?.factions?.selected_faction?? 0 == "Barbarians") playerViewData.isle.barbRep = "[" + playerViewData.isle.barbRep + "]";
  playerViewData.isle.barbRep = data.raw.nether_island_player_data?.barbarians_reputation?? 0;
  playerViewData.isle.lastMatriarch = new Date(data.raw.nether_island_player_data?.matriarch?.last_attempt?? null).toLocaleDateString({})?? "Unknown";
  playerViewData.isle.kuudra.basic = data.raw.nether_island_player_data?.kuudra_completed_tiers?.none?? 0;
  playerViewData.isle.kuudra.hot = data.raw.nether_island_player_data?.kuudra_completed_tiers?.hot?? 0;
  playerViewData.isle.kuudra.burning = data.raw.nether_island_player_data?.kuudra_completed_tiers?.burning?? 0;
  playerViewData.isle.kuudra.fiery = data.raw.nether_island_player_data?.kuudra_completed_tiers?.fiery?? 0;
  playerViewData.isle.kuudra.infernal = data.raw.nether_island_player_data?.kuudra_completed_tiers?.infernal?? 0;
  playerViewData.isle.kills.ashfang = data.data.bestiary?.categories?.crimson_isle?.mobs[0]?.kills?? 0;
  playerViewData.isle.kills.duke = data.data.bestiary?.categories?.crimson_isle?.mobs[1]?.kills?? 0;
  playerViewData.isle.kills.bladesoul = data.data.bestiary?.categories?.crimson_isle?.mobs[2]?.kills?? 0;
  playerViewData.isle.kills.outlaw = data.data.bestiary?.categories?.crimson_isle?.mobs[9]?.kills?? 0;
  playerViewData.isle.kills.magma = data.data.bestiary?.categories?.crimson_isle?.mobs[11]?.kills?? 0;
  playerViewData.isle.kills.vanquisher = data.data.bestiary?.categories?.crimson_isle?.mobs[18]?.kills?? 0;
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
  for (let fish of data.data.crimson_isle.trophy_fish.fish) {
    let index = data.data.crimson_isle.trophy_fish.fish.indexOf(fish);

    let colIndex = index % 18;
    let rowIndex = Math.floor(index / 18);
  
    let x = width / 4 + (width / 9 * colIndex + 8) / 4;
    let y = height / 3 + rowIndex * 16;

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
    let tier = fish.highest_tier? trophyFishTierColours[fish.highest_tier] + fish.highest_tier.toUpperCase() : "";
    item.setName(fish.display_name + tier);
    let lore = [];
    lore.push(fish.description.split(". ").join(".\n&7"), "&5&oTotal: " + fish.total, "&8Bronze: " + fish.bronze, "&7Silver: " + fish.silver, "&6Gold: " + fish.gold, "&bDiamond: " + fish.diamond);
    item.setLore(lore.join("\n"));

    let itemPosition = {item: item, pos: {x, y}, count: fish.total};

    playerViewData.trophy.content.push(itemPosition);
  }
}

const trophyFishTierColours = {
  "bronze": " &r&8&l",
  "silver": " &r&7&l",
  "gold": " &r&6&l",
  "diamond": " &r&b&l"
}

function getDungeonsData(data, pData) {
  try {
    pData.cataLevel = parseFloat(data.catacombs.level.levelWithProgress.toFixed(2));
    pData.cataExp = formatNumber(Math.floor(data.catacombs.level.xp));
    pData.secretsFound = data.secrets_found;
    for (let type in data.classes.classes) {
      let classData = data.classes.classes[type];
      pData.classes[type].level = parseFloat(classData.level.levelWithProgress.toFixed(2));
      pData.classes[type].exp = Math.floor(classData.level.xp);
      pData.classes[type].selected = classData.current;
    }
    for (let essence in data.essence) {
      pData.essence[essence] = formatNumber(data.essence[essence]);
    }
    for (let floor of Object.values(data.catacombs.floors)) pData.floors.normal[floor.name] = check(floor.stats.tier_completions);
    for (let floor of Object.values(data.master_catacombs.floors)) pData.floors.master[floor.name] = check(floor.stats.tier_completions);
    return pData;
  }
  catch(e) {
    print(e);
    return pData;
  }
}

export function view(player) {
  if (playerViewData.name) {
    if (player.toLowerCase() === playerViewData.name.toLowerCase()) return;
  }

  name = player;
  playerViewData = {};
  profiles = [];
  resetButtons(0);

  axios.get("https://api.mojang.com/users/profiles/minecraft/" + player).then(response => {
    player = response.data.name;
    playerViewData.image = new Image(player + "_view_image.png", "https://visage.surgeplay.com/full/1024/" + response.data.id);
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