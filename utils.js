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
  if (num >= 1000000000000) return "T";
  else if (num >= 1000000000) return "B";
  else if (num >= 1000000) return "m";
  else if (num >= 1000) return "k";
  return "";
}

const suffixes = {
  "T": 1000000000000,
  "B": 1000000000,
  "m": 1000000,
  "k": 1000,
  "": 1
}

function formatNumber(num) {
  num = parseFloat(num);
  if (!num) return 0;

  const suffix = getSuffix(num);
  num /= suffixes[suffix];

  return num.toFixed(2) + suffix;
}

function getItemFromNBT(nbtStr) {
  let nbt = net.minecraft.nbt.JsonToNBT.func_180713_a(nbtStr); // Get MC NBT object from string
  let count = nbt.func_74771_c('Count'); // get byte
  let id = nbt.func_74765_d('id'); // get short
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

export { pushToFront, formatNumber, nbtToItem, nbtToJson};