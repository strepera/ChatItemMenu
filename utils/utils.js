const skills = JSON.parse(FileLib.read('ChatItemMenu', 'data/skills.json'));
const items = JSON.parse(FileLib.read('ChatItemMenu', 'data/items.json'));

const dungeonXp = [
  0,
  50,                 
  125,                
  235,                
  395,                
  625,                
  955,                
  1425,               
  2095,               
  3045,               
  4385,   
  6275,   
  8940,   
  12700,  
  17960,  
  25340,  
  35640,  
  50040,  
  70040,  
  97640,  
  135640, 
  188140, 
  259640, 
  356640, 
  488640, 
  668640, 
  911640, 
  1239640,
  1684640,
  2284640,
  3084640,
  4149640,
  5559640,
  7459640,
  9959640,
  13259640,
  17559640,
  23159640,
  30359640,
  39559640,
  51559640,
  66559640,
  85559640,
  109559640,
  139559640,
  177559640,
  225559640,
  285559640,
  360559640,
  453559640,
  569809640
]

const slayerXp = {
  'zombie': [
    5,
    15,
    200,
    1000,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'spider': [
    5,
    25,
    200,
    1000,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'wolf': [
    10,
    30,
    250,
    1500,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'enderman': [
    10,
    30,
    250,
    1500,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'blaze': [
    10,
    30,
    250,
    1500,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'vampire': [
    20,
    75,
    240,
    840,
    2400
  ]
}

const petLevels = [25358785,23472085,21725385,20108685,18611985,17225285,15938585,14746885,13645185,12628485,11691785,10830085,10038385,9311685,8644985,8033285,7471585,6954885,6478185,6036485,5624785,5241085,4883385,4549685,4237985,3946285,3673585,3418885,3181185,2959485,2752785,2560085,2380385,2212685,2055985,1909285,1772085,1643885,1524185,1412485,1308285,1211085,1120385,1035685,956485,882285,812885,748085,687685,631485,579285,530885,486085,444685,406485,371285,338885,309085,281685,256485,233285,211985,192485,174685,158485,143785,130485,118485,107685,97985,89285,81485,74485,68185,62485,57285,52535,48185,44185,40485,37065,33905,30985,28285,25785,23475,21345,19385,17585,15935,14425,13045,11785,10635,9585,8625,7745,6945,6215,5555,4955,4415,3925,3485,3085,2725,2395,2095,1820,1570,1340,1130,940,765,605,460,330,210,100]

const petOffset = {
  "COMMON": 1,
  "UNCOMMON": 6,
  "RARE": 11,
  "EPIC": 16,
  "LEGENDARY": 20,
  "MYTHIC": 20
}

const rarityColours = {
  "VERY SPECIAL": "&c",
  "SPECIAL": "&c",
  "DIVINE": "&b",
  "MYTHIC": "&d",
  "LEGENDARY": "&6",
  "EPIC": "&5",
  "RARE": "&9",
  "UNCOMMON": "&a",
  "COMMON": "&f"
}

function pushToFront(array, first) {
  let newArray = [];
  newArray.push(first);
  for (let value of array) {
    if (value == first) continue;
    newArray.push(value);
  }
  return newArray;
}

function getSuffix(num) {
  num = Math.abs(num);
  if (num >= 1000000000000) return "T";
  else if (num >= 1000000000) return "B";
  else if (num >= 1000000) return "M";
  else if (num >= 1000) return "k";
  return "";
}

const suffixes = {
  "T": 1000000000000,
  "B": 1000000000,
  "M": 1000000,
  "k": 1000,
  "": 1
}

function formatNumber(num) {
  num = parseFloat(num);
  if (!num) return 0;
  if (num < 1000 && num > -1000) return Math.floor(num);

  const suffix = getSuffix(num);
  num /= suffixes[suffix];

  if (num.toFixed(2).endsWith("00")) {
    return Math.floor(num) + suffix;
  }
  return num.toFixed(2) + suffix;
}

function getTimeLeft(time) {
  let sign = "";
  if (time < 0) {
    time = -time;
    sign = ' ago';
  }

  let weeks = Math.floor(time / 604800);
  let days = Math.floor((time % 604800) / 86400);
  let hours = Math.floor(((time % 604800) % 86400) / 3600);
  let minutes = Math.floor((((time % 604800) % 86400) % 3600) / 60);
  let seconds = Math.floor((((time % 604800) % 86400) % 3600) % 60);

  if (weeks >= 1) return `${weeks}w ${days}d${sign}`;
  if (days >= 1) return `${days}d ${hours}h${sign}`;
  if (hours >= 1) return `${hours}h ${minutes}m${sign}`;
  if (minutes >= 1) return `${minutes}m ${seconds}s${sign}`
  return `${seconds}s${sign}`
}

function getItemFromNBT(nbtStr) {
  let nbt = net.minecraft.nbt.JsonToNBT.func_180713_a(nbtStr); // Get MC NBT object from string
  let count = nbt.func_74771_c('Count'); // get byte
  let id = nbt.func_74765_d('id') || nbt.func_74779_i('id'); // get short || string
  let damage = nbt.func_74765_d('Damage'); // get short
  let tag = nbt.func_74781_a('tag'); // get tag
  let item = new Item(id); // create ct item object
  item.setStackSize(count);
  item = item.getItemStack(); // convert to mc object
  item.func_77964_b(damage); // set damage of mc item object
  if (tag) item.func_77982_d(tag); // set tag of mc item object
  item = new Item(item); // convert back to ct object
  return item;
}

function nbtToItem(nbtObject) {
  let str = JSON.stringify(nbtObject, 0, 4),
      arr = str.match(/".*?":/g);

  for (let i = 0; i < arr.length; i++)
      str = str.replace(arr[i], arr[i].replace(/"/g,''));

  return getItemFromNBT(str);
}

function nbtToJson(string) {
  return string.replaceAll("\\", "").replace(/\d+:/g, "").replace(/({|,)([a-zA-Z]+)/g, '$1"$2"');
}

function expToLevel(xp, skill) {
  if (!skills[skill]) return 0;
  let levels = skills[skill].levels.slice().reverse();
  for (let level of levels) {
    if (xp < level.totalExpRequired) continue;
    let index = levels.indexOf(level);
    if (level.level == skills[skill].maxLevel) return `${level.level} + ${formatNumber(xp - level.totalExpRequired)}`;
    return level.level + Math.floor(((xp - level.totalExpRequired) / (levels[index + 1].totalExpRequired - level.totalExpRequired)) * 100) / 100;
  }
  return 0;
}

function dungeonExpToLevel(xp) {
  for (let levelXp of dungeonXp.slice().reverse()) {
    if (xp < levelXp) continue;
    let index = dungeonXp.indexOf(levelXp);
    if (index == dungeonXp.length) return `${index} + ${formatNumber(xp - levelXp)}`;
    return index + Math.floor(((xp - levelXp) / (dungeonXp[index + 1] - levelXp)) * 100) / 100;
  }
  return 0;
}

function slayerExpToLevel(xp, type) {
  for (let level of slayerXp[type].slice().reverse()) {
    if (level < xp) continue;
    let index = slayerXp[type].indexOf(level) + 1;
    if (index == slayerXp[type].length) return `${index} + ${formatNumber(xp - level)}`;
    return index + Math.floor(((xp - level) / (slayerXp[type][index] - level)) * 100) / 100;
  }
  return 0;
}

function getLongest(arr) {
  let longest = {str: "", width: 0};
  if (!arr) return longest;
  for (let value of arr) {
    let width = Renderer.getStringWidth(value);
    if (width > longest.width) {
      longest.str = value;
      longest.width = width;
    }
  }
  return longest;
}

function getArrow(x, y, size, horizontal) {
  if (!horizontal) {
    let points = [
      [x, y - size],
      [x - size, y + size / 2],
      [x + size, y + size / 2]
    ];
    return points;
  }
  else {
    let points = [
      [x - size, y - size],
      [x + size, y],
      [x - size, y + size]
    ];
    return points;
  }
}

class Tooltip {
  constructor(content, x, y, scrollx, scrolly) {
    this.content = content;
    this.x = x + 8;
    this.y = y - 16;
    this.scrollx = scrollx;
    this.scrolly = scrolly;
  }

  draw() {
    let longestLine = "";
    this.content.forEach((line, index) => {
      let match;
      if (match = ChatLib.removeFormatting(line).match(/Obtained: <local-time timestamp="(\d+)"><\/local-time>/)) {
        line = "&7Obtained: &c" + new Date(Number(match[1])).toLocaleDateString({});
        this.content[index] = "&7Obtained: &c" + new Date(Number(match[1])).toLocaleDateString({});
      }
      if (match = ChatLib.removeFormatting(line).match(/By: <a href="\/stats\/\S+">(.+)<\/a>/)) {
        line = "&7By: &c" + match[1];
        this.content[index] = "&7By: &c" + match[1];
      }
      if (Renderer.getStringWidth(line) > Renderer.getStringWidth(longestLine)) longestLine = line;
    })
    let width = Renderer.getStringWidth(longestLine) + 6;
    let height = this.content.length * 9 + 6;
    let loc = {x: this.x + this.scrollx, y: this.y + this.scrolly};
    let screenHeight = Renderer.screen.getHeight();
    let screenWidth = Renderer.screen.getWidth();
    if (loc.x + width > screenWidth && this.scrollx == 0) loc.x -= (loc.x + width - screenWidth);
    if (loc.y + height > screenHeight && this.scrolly == 0) loc.y -= (loc.y + height - screenHeight);
    let outline = Renderer.color(35, 0, 90, 200);
    let fill = Renderer.color(20, 5, 20, 200);
    Renderer.translate(0, 0, 500);
    Renderer.drawRect(fill, loc.x, loc.y - 2, width, height + 4);
    Renderer.translate(0, 0, 500);
    Renderer.drawRect(fill, loc.x - 2, loc.y, width + 4, height);
    Renderer.translate(0, 0, 500);
    Renderer.drawRect(outline, loc.x, loc.y, width, height);
    Renderer.translate(0, 0, 500);
    Renderer.drawRect(fill, loc.x + 2, loc.y + 2, width - 4, height - 4);
    this.content.forEach((line, index) => {
      Renderer.translate(0, 0, 500);
      Renderer.drawString(line, loc.x + 4, loc.y + 4 + index*9, true);
    })
  }
}

const Vec3 = Java.type('net.minecraft.util.Vec3');

function drawLineToCoords (x1, y1, z1, x2, y2, z2, red, green, blue, alpha, esp, lineWidth = 1) {
  if (!esp) {
    let world = World.getWorld();

    let movingObjects = [];

    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 - 0.4, y2 - 0.4, z2 - 0.4), false));
    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 + 0.4, y2 - 0.4, z2 - 0.4), false));
    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 - 0.4, y2 - 0.4, z2 + 0.4), false));
    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 + 0.4, y2 - 0.4, z2 + 0.4), false));

    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 - 0.4, y2 + 0.4, z2 - 0.4), false));
    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 + 0.4, y2 + 0.4, z2 - 0.4), false));
    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 - 0.4, y2 + 0.4, z2 + 0.4), false));
    movingObjects.push(world.func_72901_a(new Vec3(x1, y1, z1), new Vec3(x2 + 0.4, y2 + 0.4, z2 + 0.4), false));

    for (let movingObject of movingObjects) {
      if (!movingObject) continue;
      let movingObjectBlockPos = new BlockPos(movingObject.func_178782_a()/*getBlockPos*/);
      if (movingObjectBlockPos.x != x2 - 0.5 || movingObjectBlockPos.y != y2 - 0.5 || movingObjectBlockPos.z != z2 - 0.5) continue;

      GL11.glBlendFunc(770,771);
      GL11.glEnable(GL11.GL_BLEND);
      GL11.glLineWidth(lineWidth);
      GL11.glDisable(GL11.GL_TEXTURE_2D);
      GL11.glDisable(GL11.GL_DEPTH_TEST);
      GL11.glDepthMask(false);
    
      Tessellator.begin(GL11.GL_LINE_STRIP).colorize(red, green, blue, alpha);
      Tessellator.pos(x1, y1, z1).tex(0, 0);
      Tessellator.pos(x2, y2, z2).tex(0, 0);
      Tessellator.draw();
    
      GL11.glEnable(GL11.GL_TEXTURE_2D);
      GL11.glEnable(GL11.GL_DEPTH_TEST);
      GL11.glDepthMask(true);
      GL11.glDisable(GL11.GL_BLEND);
      return;
    }
  }
  else {
    GL11.glBlendFunc(770,771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(lineWidth);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(false);
  
    Tessellator.begin(GL11.GL_LINE_STRIP).colorize(red, green, blue, alpha);
    Tessellator.pos(x1, y1, z1).tex(0, 0);
    Tessellator.pos(x2, y2, z2).tex(0, 0);
    Tessellator.draw();
  
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
  }
}

const rarities = {
  "COMMON": 0,
  "UNCOMMON": 1,
  "RARE": 2,
  "EPIC": 3,
  "LEGENDARY": 4,
  "MYTHIC": 5
}

export function getPriceId(item) {
  let id = item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getTagMap().get("id");
  if (!id) return;
  id = id.toString().replaceAll('"', '');
  if (id == "ENCHANTED_BOOK") {
    let attributeObject = item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").toObject();
    id = (Object.keys(attributeObject.enchantments)[0] + ";" + Object.values(attributeObject.enchantments)[0]).toUpperCase();
  }
  else if (id == "PET") {
    let attributeObject = item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").toObject();
    id = JSON.parse(attributeObject.petInfo).type + ";" + rarities[JSON.parse(attributeObject.petInfo).tier];
  }

  return id;
}

export function drawScaledString(string, x, y, shadow = false, scale_factor) {
  if (!scale_factor) scale_factor = 1;
  let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
  Renderer.scale(scale.x * scale_factor, scale.y * scale_factor);
  Renderer.drawString(string, x / scale.x / scale_factor, y / scale.y / scale_factor, shadow);
}

export const inventoryPosition = {
  getX: () => {
    let scale = Renderer.screen.getScale();
    let width = Renderer.screen.getWidth();
    switch(scale) {
      case 1:
        return 874*(width/1920);
      case 2:
        return 393*(width/960);
      case 3:
        return 232*(width/640);
      case 4:
        return 153*(width/480);
      default:
        return;
    }
  },
  getY: () => {
    let scale = Renderer.screen.getScale();
    let height = Renderer.screen.getHeight();
    switch(scale) {
      case 1:
        return 429*(height/1016);
      case 2:
        return 171*(height/508);
      case 3:
        return 86*(height/339);
      case 4:
        return 44*(height/254);
      default:
        return;
    }
  },
  getWidth: () => {
    let scale = Renderer.screen.getScale();
    let width = Renderer.screen.getWidth();
    switch(scale) {
      case 1:
        return (1050*(width/1920))-(874*(width/1920));
      case 2:
        return (567*(width/960))-(393*(width/960));
      case 3:
        return (408*(width/640))-(232*(width/640));
      case 4:
        return (328*(width/480))-(153*(width/480));
      default:
        return;
    }
  },
  getHeight: () => {
    let scale = Renderer.screen.getScale();
    let height = Renderer.screen.getHeight();
    switch(scale) {
      case 1:
        return (592*(height/1016))-(429*(height/1016));
      case 2:
        return (336*(height/508))-(171*(height/508));
      case 3:
        return (251*(height/339))-(86*(height/339));
      case 4:
        return (208*(height/254))-(44*(height/254));
      default:
        return;
    }
  }
}

export const containerPosition = {
  getX: () => {
    let scale = Renderer.screen.getScale();
    let width = Renderer.screen.getWidth();
    switch(scale) {
      case 1:
        return 874*(width/1920);
      case 2:
        return 393*(width/960);
      case 3:
        return 232*(width/640);
      case 4:
        return 153*(width/480);
      default:
        return;
    }
  },
  getY: () => {
    let scale = Renderer.screen.getScale();
    let height = Renderer.screen.getHeight();
    let size = Player.getContainer()?.getSize()?? 0;
    switch(scale) {
      case 1:
        return (459-size)*(height/1016);
      case 2:
        return (201-size)*(height/508);
      case 3:
        return (116-size)*(height/339);
      case 4:
        return (74-size)*(height/254);
      default:
        return;
    }
  },
  getWidth: () => {
    let scale = Renderer.screen.getScale();
    let width = Renderer.screen.getWidth();
    switch(scale) {
      case 1:
        return (1050*(width/1920))-(874*(width/1920));
      case 2:
        return (567*(width/960))-(393*(width/960));
      case 3:
        return (408*(width/640))-(232*(width/640));
      case 4:
        return (328*(width/480))-(153*(width/480));
      default:
        return;
    }
  },
  getHeight: () => {
    let scale = Renderer.screen.getScale();
    let height = Renderer.screen.getHeight();
    switch(scale) {
      case 1:
        return (592*(height/1016))-(429*(height/1016));
      case 2:
        return (336*(height/508))-(171*(height/508));
      case 3:
        return (251*(height/339))-(86*(height/339));
      case 4:
        return (208*(height/254))-(44*(height/254));
      default:
        return;
    }
  }
}

export function getItemId(name) {
  name = ChatLib.removeFormatting(name);
  for (let item in items) {
    let itemName = ChatLib.removeFormatting(items[item].displayname);
    if (itemName == name) {
      return items[item].internalname;
    }
  }
  return null;
}

export function neuItemToCt(item, count) {
  if (!count) count = 1;
  let nbt = {
    id: item.itemid,
    Count: count,
    Damage: item.damage
  }
  let ctitem = new Item(net.minecraft.item.ItemStack.func_77949_a(NBT.parse(nbt).rawNBT)); // loadItemStackFromNBT()
  let nbtString = ctitem.getRawNBT().toString().replace(",", ",tag:" + item.nbttag + ",");
  ctitem = getItemFromString(nbtString);
  return ctitem;
}

function getItemFromString(nbtStr) {
  const MCItemStack = Java.type("net.minecraft.item.ItemStack");
  const nbt = net.minecraft.nbt.JsonToNBT.func_180713_a(nbtStr);
  return new Item(MCItemStack.func_77949_a(nbt));
}

export function getItemUuid(item) {
  return item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").get("uuid")?.toString()?.replace(/^"|"$/g, '');
}

export function rgbToInteger(r, g, b) {
  const longInt = (r << 16) | (g << 8) | b;
  return longInt;
}

export function hexToInteger(hexColor) {
  if (!hexColor) return 0;
  hexColor = hexColor.replace('#', '');

  let r = hexColor.slice(0, 2);
  let g = hexColor.slice(2, 4);
  let b = hexColor.slice(4);

  let rDec = parseInt(r, 16);
  let gDec = parseInt(g, 16);
  let bDec = parseInt(b, 16);

  return (rDec << 16) | (gDec << 8) | bDec;
}

export function hexToRgb(hex) {
  hex = hex.replace(/^\s*#|\s*$/g, '');

  if (hex.length === 3) {
    hex = hex.split('').map(function(x) {
      return x + x;
    }).join('');
  }

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return [r, g, b];
}

let registers = [];
export function when(check, register) {
  registers.push({
    check: check,
    register: register.unregister(),
    registered: false
  })
}

register("tick", () => {
  for (let register of registers) {
    let bool = register.check()
    if (bool && !register.registered) {
      register.register.register();
      register.registered = true;
    }
    else if (!bool && register.registered) {
      register.registered = false;
      register.register.unregister();
    }
  }
})

export { pushToFront, formatNumber, getTimeLeft, nbtToItem, nbtToJson, expToLevel, dungeonExpToLevel, slayerExpToLevel, getLongest, getItemFromNBT, getArrow, Tooltip, rarityColours, petLevels, petOffset, drawLineToCoords };
