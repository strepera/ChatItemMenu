import { locraw } from "../utils/locraw.js";
import { getLongest, when } from "../utils/utils.js";
import { settings } from "../config.js";
import { addDisplay, positionData } from "../utils/display.js";
let Settings = settings.settings;

const points = {"Glacite":{"color":-11113067,"points":[[0,132,392],[-54,147,361]]},"Umber":{"color":-9025473,"points":[[-68,119,268],[-44,123,363],[44,120,366],[38,125,448],[9,146,328]]},"Tungsten":{"color":-13421773,"points":[[-56,119,246],[30,123,326],[2,120,456],[-42,115,462]]},"Peridot":{"color":-8874416,"points":[[87,122,391],[-73,122,458],[-62,147,302],[-77,120,281]]},"Onyx":{"color":0,"points":[[77,118,411],[-69,130,407],[-9,132,388],[17,136,367],[13,137,409]]},"Citrine":{"color":-6921216,"points":[[-94,144,261],[-58,144,420],[-45,127,413]]},"Aquamarine":{"color":-11503361,"points":[[82,150,324],[-2,139,437],[22,140,412]]}}

let currentGemstoneTypes = [];

let commissions = [];

let progression = [];

register("guiOpened", () => {
  Client.scheduleTask(2, () => {
    let container = Player.getContainer();
    if (!container) return;
    if (container.getName() != "Commissions") return;

    const filter = container.getStackInSlot(32);
    let filterType = "";
    for (let line of filter.getLore()) {
      if (match = ChatLib.removeFormatting(line).match(/▶ (.+)/)) {
        filterType = match[1];
      }
    }

    currentGemstoneTypes = [];
    commissions = [];
    for (let item of container.getItems()) {
      if (ChatLib.removeFormatting(item.getName()).match(/Commission #\d/)) {
        let commissionName = ChatLib.removeFormatting(item.getLore()[5]);
        commissions.push(commissionName);
        if (filterType == "Glacite Tunnels") {
          if (match = commissionName.match(/(\S+) Gemstone Collector/)) {
            currentGemstoneTypes.push(match[1]);
          }
          else if (match = commissionName.match(/(\S+) Collector/)) {
            if (points[match[1]]) {
              currentGemstoneTypes.push(match[1]);
            }
          }
        }
      }
    }

  })
})

when(() => Player.getContainer() && Player.getContainer().getName() == "Commissions", 
  register("guiRender", () => {
    let container = Player.getContainer();

    container.getItems().forEach((item, index) => {
      let maxSlot = Player.getContainer().getSize();
      if (!item) return;
      if (index <= maxSlot && item.getLore().map(line => ChatLib.removeFormatting(line).trim()).includes("Click to claim rewards!")) {
        let x = index % 9;
        let y = Math.floor(index / 9);
        if (index > maxSlot - 37) {
          y += 0.71;
          if (maxSlot - index < 10) {
            y += 0.23;
          }
        }
        let renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18) + 1;
        let renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - Player.getContainer().getSize() / 18) * 18) + 1;
    
        Renderer.translate(0, 0, 100);
        Renderer.drawRect(Renderer.GREEN, renderX-9, renderY-9, 16, 16);
      }
    });
  })
)

when(() => Settings.get("Ore/Gemstone waypoints in Glacite Tunnels") && locraw.mode == "mining_3", 
  register("renderWorld", () => {
    let isInTunnels = false;
    for (let line of Scoreboard.getLines()) {
      line = ChatLib.removeFormatting(line).replace(/[^a-zA-Z ]/g, "").trim();
      if (line.match(/Dwarven Base Camp/) || line.match(/Glacite Tunnels/) || line.match(/Glacite Lake/)) {
        isInTunnels = true;
      }
    }
    if (!isInTunnels) return;

    let types = currentGemstoneTypes;
    if (Settings.get("Show all waypoints")) {
      types = ["Glacite", "Umber", "Tungsten", "Peridot", "Onyx", "Citrine", "Aquamarine"];
    }

    for (let type of types) {
      for (let point of points[type].points) {
        Tessellator.drawString(type, point[0]+0.5, point[1]+0.5, point[2]+0.5, points[type].color, true, 1, true);
      }
    }
    Tessellator.drawString("Base", -6.5, 121, 227.5, -2584314, true, 1, true);
  })
)

when(() => TabList && TabList?.getNames(), 
  register("step", () => {
    let lines = TabList.getNames();
    if (!lines) return;
    progression = [];
    for (let line of lines) {
      for (let commission of commissions) {
        if (ChatLib.removeFormatting(line).includes(commission)) {
          progression.push(line);
        }
      }
    }
  }).setDelay(1)
)

let maxMsbCooldown = 120;
let msbDuration = 20;
let msbUsed = 0;
let skymall = "";
register("chat", (message, event) => {
  if (match = message.match(/^New buff: (.+)/)) {
    skymall = match[1];
    if (skymall.includes("Reduce Pickaxe Ability cooldown by 20%.")) {
      maxMsbCooldown = 96;
    }
    else {
      maxMsbCooldown = 120;
    }
  }
}).setCriteria("${message}");

register("chat", () => {
  msbUsed = Date.now();
}).setCriteria("&r&aYou used your &r&6Mining Speed Boost &r&aPickaxe Ability!&r");

register("worldLoad", () => {
  msbUsed = Date.now() - (maxMsbCooldown*1000)/2;
})

when(() => Settings.get("Commission Overlay") && progression.length !== 0, 
  register("renderOverlay", () => {
    let cooldown = maxMsbCooldown - Math.floor((Date.now() - msbUsed)/1000);
    if (cooldown > maxMsbCooldown - msbDuration) {
      let remaining = msbDuration - (maxMsbCooldown - cooldown);
      cooldown = cooldown + "s &7(" + remaining + "s)";
    }
    else if (cooldown <= 0) {
      cooldown = "&aAvailable";
    }
    else {
      cooldown = cooldown + "s";
    }

    let array = progression.slice();
    array.push(`&r &r&eMining Speed Boost &b${cooldown}`);

    Renderer.drawRect(Renderer.color(0, 0, 0, 150), positionData.commissionGui.x*Renderer.screen.getWidth(), positionData.commissionGui.y*Renderer.screen.getHeight(), getLongest(array).width+4, array.length*10+14);
    Renderer.drawString("&r &r&9&lCommissions", positionData.commissionGui.x*Renderer.screen.getWidth(), positionData.commissionGui.y*Renderer.screen.getHeight()+4, true);
    array.forEach((line, index) => {
      Renderer.drawString(line, positionData.commissionGui.x*Renderer.screen.getWidth(), positionData.commissionGui.y*Renderer.screen.getHeight()+14+index*9, true);
    })
  })
)

addDisplay(
  "commissionGui",
  [
    {
      text: "Commissions"
    }
  ],
  [
    {
      color: Renderer.color(0, 0, 0, 150),
      w: 40,
      h: 40
    }
  ],
  x = 0.01,
  y = 0.5
)
