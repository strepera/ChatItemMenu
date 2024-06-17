import { pushToFront, formatNumber } from './utils.js';

const items = JSON.parse(FileLib.read('ChatItemMenu', 'items.json'));
const npcs = JSON.parse(FileLib.read('ChatItemMenu', 'npcs.json'));
const monsters = JSON.parse(FileLib.read('ChatItemMenu', 'monsters.json'));
const bosses = JSON.parse(FileLib.read('ChatItemMenu', 'bosses.json'));

class InfoMessage {
  message = [];

  constructor(data) {
    this.data = {};
    this.data.name = data.name;
    this.data.location = data.location;
    this.data.lbin = data.lbin;
    this.data.recipe = data.recipe;
    this.data.costs = data.costs;
    this.data.sales = data.sales;
    this.data.drops = data.drops;
    this.data.bossDrops = data.bossDrops;
    this.data.enemyRecipes = data.enemyRecipes;
    this.data.grid = data.grid;

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
    recipe[slot] = new TextComponent(`&f${itemAmount}x ${itemName}`).setClick("run_command", Settings.prefix + getItemName(recipe[slot].split(':')[0], false));
  }

  const recipemsg = new TextComponent(`&c&lRecipe for ${data.displayname}&f:\n`).setClick("run_command", "/recipe " + getItemName(data.internalname, false))
  const grid = new Message(recipemsg, recipe.A1, ' ', recipe.A2, ' ', recipe.A3, '\n', recipe.B1, ' ', recipe.B2, ' ', recipe.B3, '\n', recipe.C1, ' ', recipe.C2, ' ', recipe.C3);

  return grid;
}

function filterData(filter) {
  let results = [];
  let exactMatch;
  for (let item in items) {
    if (items[item].displayname.toLowerCase().includes(filter)) {
      results.push(items[item]);
    }
    if (items[item].displayname.replace(/§\S/g, '').toLowerCase() === filter) {
      exactMatch = items[item];
    }
  }
  for (let npc in npcs) {
    if (npcs[npc].displayname.toLowerCase().includes(filter)) {
      results.push(npcs[npc]);
    }
    if (npcs[npc].displayname.replace(/§\S/g, '').toLowerCase() === filter) {
      exactMatch = npcs[npc];
    }
  }
  for (let monster in monsters) {
    if (monsters[monster].displayname.toLowerCase().includes(filter)) {
      results.push(monsters[monster]);
    }
    if (monsters[monster].displayname.replace(/§\S/g, '').toLowerCase() === filter) {
      exactMatch = monsters[monster];
    }
  }
  for (let boss in bosses) {
    if (bosses[boss].displayname.toLowerCase().includes(filter)) {
      results.push(bosses[boss]);
    }
    if (bosses[boss].displayname.replace(/§\S/g, '').toLowerCase() === filter) {
      exactMatch = bosses[boss];
    }
  }

  if (exactMatch) {
    return pushToFront(results, exactMatch);
  }
  else {
    return results;
  }
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
          let type = i.split(':')[0] === "SKYBLOCK_COIN"? "Coins" : getItemName(i.split(':')[0], true);
          let amount = i.split(':')[1];
          if (i.split(':')[1]) arr.push("&f" + amount + "&f " + type);
          else arr.push("&f" + type);
          cost.push(arr.join(' '));
        }
        costs.push(npcs[npc].displayname + '&f: ' + cost.join(', '));
      }
    }
  }
  return costs.join('\n');
}

function getSales(data) {
  if (!data.internalname.endsWith("_NPC")) return "";
  let sales = [];
  for (let sale of data.recipes) {
    let costs = [];
    for (let cost of sale.cost) {
      let arr = [];
      let type = cost.split(':')[0] === "SKYBLOCK_COIN"? "Coins" : getItemName(cost.split(':')[0], true);
      let amount = cost.split(':')[1];
      if (cost.split(':')[1]) arr.push("&f" + amount + "&f " + type);
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
    if (!bosses[boss].recipes || !bosses[boss].recipes[0].drops) continue;
    for (let drop of bosses[boss].recipes[0].drops) {
      if (!drop.id) continue;
      let id = drop.id.split(':')[0];
      if (id === data.internalname) {
        let dropArray = [bosses[boss].displayname, '&f' + drop.chance];
        bossDrops += "\n" + dropArray.join(' ');
      }
    }
  }
  return bossDrops;
}

function getNPCLocation(data) {
  if (!data.island) return "";
  return `&e&l${data.island} X ${data.x} Y ${data.y} Z ${data.z}`;
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