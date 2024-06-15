import Settings from './config.js';
import { pushToFront, formatNumber } from './utils.js';

const items = JSON.parse(FileLib.read('ChatItemMenu', 'items.json'));
const npcs = JSON.parse(FileLib.read('ChatItemMenu', 'npcs.json'));
const monsters = JSON.parse(FileLib.read('ChatItemMenu', 'monsters.json'));
const bosses = JSON.parse(FileLib.read('ChatItemMenu', 'bosses.json'));

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

  const grid = new Message(recipe.A1, ' ', recipe.A2, ' ', recipe.A3, '\n', recipe.B1, ' ', recipe.B2, ' ', recipe.B3, '\n', recipe.C1, ' ', recipe.C2, ' ', recipe.C3);

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
        let cost = [npcs[npc].displayname + '&f'];
        for (let i of recipe.cost) {
          let arr = [];
          if (i.split(':')[1]) {
            arr.push(formatNumber(i.split(':')[1]));
          }
          arr.push(i.split(':')[0]);
          cost.push(arr.join(' '));
        }
        costs.push(cost.join(', '));
      }
    }
  }
  return costs;
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

export {createGrid, filterData, getClickableFilteredItems, getRequirements, getCost, getDrops, getBossDrops, getItemName};