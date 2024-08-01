import { pushToFront, formatNumber, getTimeLeft } from '../../utils/utils.js';

const items = JSON.parse(FileLib.read('ChatItemMenu', 'data/items.json'));
const npcs = JSON.parse(FileLib.read('ChatItemMenu', 'data/npcs.json'));
const monsters = JSON.parse(FileLib.read('ChatItemMenu', 'data/monsters.json'));
const bosses = JSON.parse(FileLib.read('ChatItemMenu', 'data/bosses.json'));

const islandReadability = {
  'hub': 'Hub',
  'dungeon_hub': 'Dungeon Hub',
  'farming_1': 'Barn Islands',
  'foraging_1': 'Park',
  'mining_1': 'Gold Mine',
  'mining_2': 'Deep Caverns',
  'mining_3': 'Dwarven Mines',
  'crystal_hollows': 'Crystal Hollows',
  'crimson_isle': 'Crimson Isle',
  'combat_1': "Spider's Den",
  'combat_3': 'End',
  'dynamic': 'Private Island'
}

class InfoMessage {
  message = [];

  constructor(data) {
    this.data = {};
    this.data.item = data.item;
    this.data.name = data.name;
    this.data.location = data.location;
    this.data.lbin = data.lbin;
    this.data.recipe = data.recipe;
    this.data.costs = data.costs;
    this.data.sales = data.sales;
    this.data.drops = data.drops;
    this.data.bossDrops = data.bossDrops;
    this.data.enemyRecipes = data.enemyRecipes;

    for (let value in this.data) {
      if (this.data[value] && this.data[value].text) {
        this.message.push(this.data[value], "\n");
      }
    }
  }

  send() {
    ChatLib.chat(new Message(this.message));
  }
}

function createGrid(data) {
  const recipe = data.recipe;
  for (let slot in recipe) {
    if (!recipe[slot]) {
      recipe[slot] = "&7Empty&f";
      continue;
    }
    if (!recipe[slot].split) {
      recipe[slot] = "&7Empty&f";
      continue;
    }
    let itemAmount = recipe[slot].split(':')[1];
    let itemName = getItemName(recipe[slot].split(':')[0], true);
    recipe[slot] = new TextComponent(`&f${itemAmount}x ${itemName}`).setClick("run_command", "s:" + getItemName(recipe[slot].split(':')[0], false));
  }

  const recipemsg = new TextComponent(`&c&lRecipe for ${data.displayname}&f:\n`).setClick("run_command", "/recipe " + getItemName(data.internalname, false))
  const grid = new Message(recipemsg, recipe.A1, ' ', recipe.A2, ' ', recipe.A3, '\n', recipe.B1, ' ', recipe.B2, ' ', recipe.B3, '\n', recipe.C1, ' ', recipe.C2, ' ', recipe.C3);

  return grid;
}

function filterData(filter) {
  let results = [];
  const exactMatches = new Set();
  const checkString = (str) => str.toLowerCase().includes(filter) || str.replace(/§\S/g, '').toLowerCase() === filter;

  [items, npcs, monsters, bosses].forEach(category => {
    Object.values(category).forEach(item => {
      if (checkString(item.displayname?? "")) {
        if (item.displayname.replace(/§\S/g, '').toLowerCase() === filter) {
          exactMatches.add(item);
          return;
        }
        results.push(item);
        return;
      }

      const formattedLore = ChatLib.removeFormatting(item.lore?.join(""))?.toLowerCase();
      if (checkString(formattedLore?? "")) {
        results.push(item);
        return;
      }
    });
  });

  if (exactMatches.size > 0) {
    results.unshift(...Array.from(exactMatches));
  }

  return results;
}

function getClickableFilteredItems(data) {
  let items = [];
  for (let item of data) {
    items.push(new TextComponent(`${item}\n`).setClick("run_command", "s:" + item.replace(/§\S/g, '')));
  }
  return new Message(items);
}

function getRequirements(data) {
  let requirements = [];
  for (let requirement of data.requirements) {
    for (let part of Object.values(requirement)) {
      requirements.push(part);
    }
  }
  return requirements;
}

function getCost(data) {
  let costs = [];
  for (let npc in npcs) {
    if (!npcs[npc].recipes) continue;
    for (let recipe of npcs[npc].recipes) {
      if (recipe.result === data.internalname) {
        let cost = [];
        for (let i of recipe.cost) {
          let arr = [];
          let type = i.split(':')[0] === "SKYBLOCK_COIN"? " Coins" : getItemName(i.split(':')[0], true);
          let amount = i.split(':')[1];
          if (i.split(':')[1]) arr.push("&f" + formatNumber(amount) + "&f " + type);
          else arr.push("&f" + type);
          cost.push(arr.join(' '));
        }
        costs.push(npcs[npc].displayname + '&f: ' + cost.join(', '));
      }
    }
  }

  if (data.recipes && data.recipes[0].type) {
    if (data.recipes[0].type == "forge") {
      for (let recipe of data.recipes?? []) {
        let forgeRecipe = [];
        for (let input of recipe.inputs?? []) {
          let name = input.split(":")[0] === "SKYBLOCK_COIN"? " Coins" : "x " + getItemName(input.split(':')[0], true);
          let count = formatNumber(input.split(":")[1]);
          forgeRecipe.push(`${count}${name}`);
        }
        costs.push(`&9&lForge&r (${recipe.count?? 1}x ${getTimeLeft(recipe.duration)}) ` + forgeRecipe.join("&f, "));
      }
    }
  }
  return costs.join('\n');
}

function getSales(data) {
  if (!data.internalname.endsWith("_NPC")) return "";
  let sales = [];
  for (let sale of data.recipes?? []) {
    let costs = [];
    for (let cost of sale.cost) {
      let arr = [];
      let type = cost.split(':')[0] === "SKYBLOCK_COIN"? " Coins" : getItemName(cost.split(':')[0], true);
      let amount = cost.split(':')[1];
      if (cost.split(':')[1]) arr.push("&f" + formatNumber(amount) + "&f " + type);
      else arr.push("&f" + type);
      costs.push(arr.join(', '));
    }
    sales.push(getItemName(sale.result, true) + "&f: " + costs.join(' '));
  }
  return sales.join('\n');
}

function getDrops(data) {
  let drops = "";
  for (let monster in monsters) {
    if (!monsters[monster].recipes || !monsters[monster].recipes[0].drops) continue;
    for (let drop of monsters[monster].recipes[0].drops) {
      if (!drop.id) continue;
      let id = drop.id.split(':')[0];
      if (id === data.internalname) {
        let dropArray = [monsters[monster].displayname, '&f' + drop.chance];
        drops += "\n" + dropArray.join(' ');
      }
    }
  }
  return drops;
}

function getBossDrops(data) {
  let bossDrops = "";
  for (let boss in bosses) {
    for (let recipe of bosses[boss]?.recipes?? []) {
      for (let drop of recipe.drops) {
        if (!drop.id) continue;
        let id = drop.id.split(':')[0];
        if (id === data.internalname) {
          let dropArray = [recipe.name, '&f' + drop.chance, drop?.extra?.join(" ")?? ""];
          bossDrops += "\n" + dropArray.join(' ');
        }
      }
    }
  }
  return bossDrops;
}

function getNPCLocation(data) {
  if (!data.island) return "";
  return `&e&l${islandReadability[data.island]?? data.island} X ${data.x} Y ${data.y} Z ${data.z}`;
}

function getEnemyRecipes(data) {
  if (!data.recipes) return "";
  let recipes = [];
  for (let recipe of data.recipes) {
    if (!recipe.drops) return "";
    let drops = ["\n" + recipe.name];
    for (let drop of recipe.drops) {
      let id = drop.id.split(':')[0];
      let name = getItemName(id)? getItemName(id, true) : id;
      drops.push(name + " " + drop.chance);
    }
    recipes.push(drops.join('\n'));
  }
  return recipes.join("\n");
}

function getItemName(name, colour) {
  for (let item in items) {
    if (items[item].internalname === name) {
      if (items[item].displayname.startsWith('§') && !colour) {
        return items[item].displayname.replace(/§\S/g, '');
      }
      else {
        return items[item].displayname;
      }
    }
  }
}

export {InfoMessage, createGrid, filterData, getClickableFilteredItems, getRequirements, getCost, getSales, getDrops, getBossDrops, getNPCLocation, getEnemyRecipes, getItemName};
