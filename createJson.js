// used to update json file with neu repo

const fs = require('fs');

const dir = fs.readdirSync('./items', 'utf8');

const items = {};
const npcs = {};
const monsters = {};
const bosses = {};

for (const file of dir) {
  const data = JSON.parse(fs.readFileSync('./items/' + file, 'utf8'));
  console.log(file);
  if (file.endsWith('_NPC.json')) {
    data.displayname.replace(/\u0027/g, "'");
    npcs[data.internalname] = data;
  }
  else if (file.endsWith('_MONSTER.json')) {
    data.displayname.replace(/\u0027/g, "'");
    monsters[data.internalname] = data;
  }
  else if (file.endsWith('_BOSS.json') || file.endsWith('_MINIBOSS.json')) {
    data.displayname.replace(/\u0027/g, "'");
    bosses[data.internalname] = data;
  }
  else {
    data.displayname.replace(/\u0027/g, "'");
    items[data.internalname] = data;
  }
}

fs.writeFileSync('./items.json', JSON.stringify(items));
fs.writeFileSync('./npcs.json', JSON.stringify(npcs));
fs.writeFileSync('./monsters.json', JSON.stringify(monsters));
fs.writeFileSync('./bosses.json', JSON.stringify(bosses));