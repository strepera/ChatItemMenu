import GuiHelper from "../utils/gui";
import { getItemUuid, hexToInteger, rgbToInteger, inventoryPosition, hexToRgb, Tooltip, when } from "../utils/utils";
const dyes = JSON.parse(FileLib.read("ChatItemMenu", "data/dyes.json"));
const MCNBTTagList = Java.type("net.minecraft.nbt.NBTTagList");

let renames = FileLib.read("ChatItemMenu", "player_data/renames.json");
if (!renames) {
  renames = {};
  FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
}
else {
  renames = JSON.parse(renames);
}

function setItemColour(color, uuid) {
  if (!renames[uuid]) {
    renames[uuid] = {
      color: color
    }
    FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
  }
  else {
    renames[uuid].color = color;
    FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
  }
}

register("command", (...args) => {
  let item = Player.getHeldItem();
  if (!item) return ChatLib.chat("&cPlease hold an item.");
  let uuid = getItemUuid(item);
  if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
  if (!renames[uuid]) {
    renames[uuid] = {
      name: args.join(" ")
    }
  }
  else {
    renames[uuid].name = args.join(" ");
  }
  FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
  ChatLib.chat("&aSuccessfully renamed item to " + args.join(" ") + " &7(" + uuid + ")");
}).setName("rename");

register("tick", () => {
  let inventory = Player.getInventory();
  if (!inventory) return;
  let elapsed = Player.asPlayerMP().getTicksExisted();
  inventory.getItems().forEach((item) => {
    if (!item) return;
    let uuid = getItemUuid(item);
    if (!uuid) return;
  
    let color = item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("color");
    if (color && renames[uuid] && !gui.isOpen()) {
      if (renames[uuid].animated) {
        let colours = dyes.animated[renames[uuid].animated];
        item.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", hexToInteger(colours[Math.floor(elapsed/(82/colours.length)) % colours.length]));
      }
    }
  })
})

register("packetReceived", (packet, event) => {
  const itemStack = packet?.func_149174_e();
  if (!itemStack) return;
  const item = new Item(itemStack);
  if (!item) return;
  let uuid = getItemUuid(item);
  if (!uuid) return;

  let color = item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("color");
  if (color && renames[uuid] && !gui.isOpen()) {
    if (renames[uuid].color) {
      item.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", renames[uuid].color);
    }
  }

  if (renames[uuid]) {
    if (renames[uuid].glint === false) {
      if (!item.getName().toLowerCase().includes("boots")) {
        item.getNBT().getCompoundTag("tag").removeTag("ench");
      }
    }
    else {
      item.getNBT().getCompoundTag("tag").set("ench", new NBTTagList(new MCNBTTagList()));
    }
  }

  let name = renames[uuid]?.name;
  if (name) {
    item.setName(name);
  }

}).setFilteredClass(net.minecraft.network.play.server.S2FPacketSetSlot)

register("packetReceived", (packet, event) => {
  packet.func_148910_d().forEach(itemStack => {
    if (!itemStack) return;
    let item = new Item(itemStack);
    if (!item) return;
    let uuid = getItemUuid(item);
    if (!uuid) return;
  
    let color = item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("color");
    if (color && renames[uuid] && !gui.isOpen()) {
      if (renames[uuid].color) {
        item.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", renames[uuid].color);
      }
    }
  
    if (renames[uuid]) {
      if (renames[uuid].glint === false) {
        if (!item.getName().toLowerCase().includes("boots")) {
          item.getNBT().getCompoundTag("tag").removeTag("ench");
        }
      }
      else {
        item.getNBT().getCompoundTag("tag").set("ench", new NBTTagList(new MCNBTTagList()));
      }
    }
  
    let name = renames[uuid]?.name;
    if (name) {
      item.setName(name);
    }
  });
}).setFilteredClass(net.minecraft.network.play.server.S30PacketWindowItems)

const gui = new GuiHelper();
let heldItem;
let red = 0;
let green = 0;
let blue = 0;

gui.addRectangle({
  color: Renderer.color(0, 0, 0, 200),
  x: inventoryPosition.getX(),
  y: inventoryPosition.getY(),
  w: inventoryPosition.getWidth(),
  h: inventoryPosition.getHeight()
})

gui.addTextInput({
  value: "",
  x: inventoryPosition.getX(),
  y: inventoryPosition.getY(),
  w: inventoryPosition.getWidth(),
  h: inventoryPosition.getHeight()/6,
  type: (input, char, keyCode) => {
    let inputText = input.func_146179_b();
    heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", hexToInteger(inputText));
    if (keyCode == 28) {
      let color = hexToInteger(inputText);
      let uuid = getItemUuid(heldItem);
      setItemColour(color, uuid);
      gui.close();
    }
  }
})

gui.addSlider({
  percent: 0,
  color: Renderer.RED,
  color2: Renderer.BLACK,
  x: inventoryPosition.getX(),
  y: inventoryPosition.getY()+inventoryPosition.getHeight()/6,
  w: inventoryPosition.getWidth(),
  h: inventoryPosition.getHeight()/6,
  click: (slider, mouseX, mouseY) => {
    red = slider.percent/100*255;
    heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", rgbToInteger(red, green, blue));
    let uuid = getItemUuid(heldItem);
    setItemColour(rgbToInteger(red, green, blue), uuid);
  },
  drag: (slider, mouseX, mouseY) => {
    red = slider.percent/100*255;
    heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", rgbToInteger(red, green, blue));
    let uuid = getItemUuid(heldItem);
    setItemColour(rgbToInteger(red, green, blue), uuid);
  }
})

gui.addSlider({
  percent: 0,
  color: Renderer.GREEN,
  color2: Renderer.BLACK,
  x: inventoryPosition.getX(),
  y: inventoryPosition.getY()+(inventoryPosition.getHeight()/6)*2,
  w: inventoryPosition.getWidth(),
  h: inventoryPosition.getHeight()/6,
  drag: (slider, mouseX, mouseY) => {
    green = slider.percent/100*255;
    heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", rgbToInteger(red, green, blue));
    let uuid = getItemUuid(heldItem);
    setItemColour(rgbToInteger(red, green, blue), uuid);
  },
  click: (slider, mouseX, mouseY) => {
    green = slider.percent/100*255;
    heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", rgbToInteger(red, green, blue));
    let uuid = getItemUuid(heldItem);
    setItemColour(rgbToInteger(red, green, blue), uuid);
  }
})

gui.addSlider({
  percent: 0,
  color: Renderer.BLUE,
  color2: Renderer.BLACK,
  x: inventoryPosition.getX(),
  y: inventoryPosition.getY()+(inventoryPosition.getHeight()/6)*3,
  w: inventoryPosition.getWidth(),
  h: inventoryPosition.getHeight()/6,
  drag: (slider, mouseX, mouseY) => {
    blue = slider.percent/100*255;
    heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", rgbToInteger(red, green, blue));
    let uuid = getItemUuid(heldItem);
    setItemColour(rgbToInteger(red, green, blue), uuid);
  },
  click: (slider, mouseX, mouseY) => {
    blue = slider.percent/100*255;
    heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", rgbToInteger(red, green, blue));
    let uuid = getItemUuid(heldItem);
    setItemColour(rgbToInteger(red, green, blue), uuid);
  }
})

for (let key in dyes.animated) {
  let name = key;
  let dye = dyes.animated[name];
  let index = Object.values(dyes.animated).indexOf(dye);
  let rgb = hexToRgb(dye[0]);

  let w = inventoryPosition.getWidth()/4;
  let h = w;
  let colIndex = index % 4;
  let rowIndex = Math.floor(index/4);
  let x = inventoryPosition.getX() + colIndex*(w+w/4);
  let y = inventoryPosition.getY() + inventoryPosition.getHeight() + 4 + rowIndex*(w+w/4);

  gui.addRectangle({
    color: Renderer.color(rgb[0], rgb[1], rgb[2]),
    x: x,
    y: y,
    w: w,
    h: h,
    hover: (rect, mouseX, mouseY) => {
      new Tooltip([name], mouseX, mouseY, 0, 0).draw();
    },
    click: (rect, mouseX, mouseY) => {
      World.playSound("gui.button.press", 1, 1);
      heldItem.getNBT().getCompoundTag("tag").getCompoundTag("display").setInteger("color", rgbToInteger(red, green, blue));
      let uuid = getItemUuid(heldItem);
      if (!renames[uuid]) {
        renames[uuid] = {
          animated: name
        }
        FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
      }
      else {
        renames[uuid].animated = name;
        FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
      }
    }
  })
}

gui.addText({
  text: "Enchant Glint &aON",
  x: inventoryPosition.getX(),
  y: inventoryPosition.getY()+(inventoryPosition.getHeight()/6)*4,
  click: (text, mouseX, mouseY) => {
    World.playSound("gui.button.press", 1, 1);

    let uuid = getItemUuid(heldItem);
    let glint = renames[uuid]?.glint;
    glint = !glint;
    text.text = glint? "Enchant Glint &aON" : "Enchant Glint &cOFF";

    if (heldItem.getNBT().getCompoundTag("tag").getCompoundTag("ench")) {
      if (glint) {
        heldItem.getNBT().getCompoundTag("tag").set("ench", new NBTTagList(new MCNBTTagList()));
      }
      else if (!heldItem.getName().toLowerCase().includes("boots")) {
        heldItem.getNBT().getCompoundTag("tag").removeTag("ench");
      }
    }

    if (!renames[uuid]) {
      renames[uuid] = {
        glint: glint
      }
      FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
    }
    else {
      renames[uuid].glint = glint;
      FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
    }

  }
})

register("command", (...args) => {
  switch (args.join(" ")?.toLowerCase()) {
    case "helmet":
      item = Player.armor.getHelmet();
      if (!item) return ChatLib.chat("&cPlease equip a helmet.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "helm":
      item = Player.armor.getHelmet();
      if (!item) return ChatLib.chat("&cPlease equip a helmet.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "chestplate":
      item = Player.armor.getChestplate();
      if (!item) return ChatLib.chat("&cPlease equip a chestplate.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "chest":
      item = Player.armor.getChestplate();
      if (!item) return ChatLib.chat("&cPlease equip a chestplate.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "leggings":
      item = Player.armor.getLeggings();
      if (!item) return ChatLib.chat("&cPlease equip leggings.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "leg":
      item = Player.armor.getLeggings();
      if (!item) return ChatLib.chat("&cPlease equip leggings.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "legs":
      item = Player.armor.getLeggings();
      if (!item) return ChatLib.chat("&cPlease equip leggings.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "boots":
      item = Player.armor.getBoots();
      if (!item) return ChatLib.chat("&cPlease equip boots.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    case "boot":
      item = Player.armor.getBoots();
      if (!item) return ChatLib.chat("&cPlease equip boots.");
      uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
      break;
    default: 
      let item = Player.getHeldItem();
      if (!item) return ChatLib.chat("&cPlease hold an item.");
      let uuid = getItemUuid(item);
      if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
      heldItem = item;
  }
  gui.open();
}).setName("customize").setAliases(["customise"]);

register("command", () => {
  let item = Player.getHeldItem();
  if (!item) return ChatLib.chat("&cPlease hold an item.");
  let uuid = getItemUuid(item);
  if (!uuid) return ChatLib.chat("&cThis item has no uuid.");
  delete renames[uuid];
  FileLib.write("ChatItemMenu", "player_data/renames.json", JSON.stringify(renames));
  ChatLib.chat("&aReset current item's properties.");
}).setName("reset")

when(() => gui.isOpen(), 
  register("renderOverlay", () => {
    let x = gui.rects[0].x*Renderer.screen.getWidth();
    let y = gui.rects[0].y*Renderer.screen.getHeight();
    let w = gui.rects[0].w*Renderer.screen.getWidth();
    let h = gui.rects[0].h*Renderer.screen.getHeight();
    heldItem.draw(x+w/4, y-96, 6);
  })
)