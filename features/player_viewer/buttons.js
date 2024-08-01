import { formatNumber } from "../../utils/utils.js";
const skills = JSON.parse(FileLib.read('ChatItemMenu', 'data/skills.json'));

export const buttons = [
  {
    text: "General",
    color: Renderer.BLUE,
    dark: Renderer.DARK_BLUE,
    clicked: true,
    active: true
  },
  {
    text: "Inventory",
    color: Renderer.RED,
    dark: Renderer.DARK_RED,
    clicked: false,
    active: true
  },
  {
    text: "CF",
    color: Renderer.color(153, 102, 51),
    dark: Renderer.color(102, 51, 0),
    clicked: false,
    active: true
  },
  {
    text: "Dungeons",
    color: Renderer.GRAY,
    dark: Renderer.color(60, 60, 60),
    clicked: false,
    active: true
  },
  {
    text: "Slayer",
    color: Renderer.GREEN,
    dark: Renderer.DARK_GREEN,
    clicked: false,
    active: true
  },
  {
    text: "HOTM",
    color: Renderer.color(153, 0, 204),
    dark: Renderer.color(102, 0, 102),
    clicked: false,
    active: true
  },
  {
    text: "Isle",
    color: Renderer.color(230, 97, 5),
    dark: Renderer.color(115, 48, 2),
    clicked: false,
    active: true
  },
  {
    text: "Trophy",
    color: Renderer.AQUA,
    dark: Renderer.DARK_AQUA,
    clicked: false,
    active: true
  }
];

function getLevelColour(level) {
  if (level >= 480) return "&4";
  if (level >= 440) return "&c";
  if (level >= 400) return "&6";
  if (level >= 360) return "&5";
  if (level >= 320) return "&d";
  if (level >= 280) return "&9";
  if (level >= 240) return "&3";
  if (level >= 200) return "&b";
  if (level >= 160) return "&2";
  if (level >= 120) return "&a";
  if (level >= 80) return "&e";
  if (level >= 40) return "&f";
  return "&7";
}

function getDojoColour(score) {
  if (score >= 1000) return "&6";
  if (score >= 800) return "&d";
  if (score >= 600) return "&9";
  if (score >= 200) return "&a";
  return "&c";
}

function getBeltColour(score) {
  if (score >= 7000) return "&0";
  if (score >= 6000) return "&6";
  if (score >= 4000) return "&9";
  if (score >= 2000) return "&a";
  if (score >= 1000) return "&e";
  return "&f";
}

function getExpBarColour(level, skill) {
  level = parseFloat(level);
  let maxLevel = skills[skill].maxLevel;
  let levelPercentage = level / maxLevel * 100;
  const rainbowThreshold = 100;
  const redThreshold = 80;
  const blueThreshold = 60;
  const lightPurpleThreshold = 40;
  const yellowThreshold = 20;

  if (levelPercentage === rainbowThreshold) {
    return Renderer.getRainbow((Date.now() / 10000) % 100, 0.1);
  }
  if (levelPercentage >= redThreshold) {
    return Renderer.RED;
  }
  if (levelPercentage >= blueThreshold) {
    return Renderer.BLUE;
  }
  if (levelPercentage >= lightPurpleThreshold) {
    return Renderer.LIGHT_PURPLE;
  }
  if (levelPercentage >= yellowThreshold) {
    return Renderer.YELLOW;
  }

  return Renderer.WHITE;
}

function drawScaledString(string, x, y, shadow) {
  let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
  Renderer.scale(scale.x, scale.y);
  Renderer.drawString(string, x / scale.x, y / scale.y - 8 * (1 - scale.y), shadow);
}

function getScaledStringWidth(string) {
  let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
  return Renderer.getStringWidth(string) * scale.x;
}

export function getViewText(data, button) {
  let content = [];

  if (data.error) return [{draw: (x, y) => { 
    drawScaledString("&e" + data.error, Renderer.screen.getWidth() / 2 - getScaledStringWidth(data.error) / 2, Renderer.screen.getHeight() / 2 - 10, true);
  }}]

  if (!data.name) return [{draw: (x, y) => {
    let elipsis = ["."];
    for (let i = 0; i < Math.floor(Date.now() / 500 % 3); i++) {
      elipsis.push(".");
    }
    let string = "&eLoading" + elipsis.join("")
    drawScaledString(string, Renderer.screen.getWidth() / 2 - getScaledStringWidth(string) / 2, Renderer.screen.getHeight() / 2 - 10, true);
  }}];

  try {
    switch(button) {
      case 0:
        content.push(
          {
            draw: (x, y) => {
              let line = `&bSkyblock Level &8[${getLevelColour(data.skyblockLevel?? 0)}${data.skyblockLevel?? 0}&8]\n&9Skill Average &f${data.skillAverage?? 0}\n&eNetworth &6${data.networth?? 0}\n&ePurse &6${data.purse?? 0}\n&eBank &6${data.bank?? 0}\n&cSenither &f${data.senitherWeight?? 0}\n&dLily &f${data.lilyWeight?? 0}\n&aLast Area &8[&f${data.lastArea?? "Unknown"}&8]`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let cookieStatus = data.cookieBuff? "&aTrue" : "&cFalse";
              let line = `&9First Join &f${data.firstJoin?? "Unknown"}\n&6Cookie Active ${cookieStatus}\n&cDeaths &f${data.deaths}\n&5Serums &f${data.serums}\n&dFairy Souls &f${data.fairySouls}&8/&f247\n&dUnspent &f${data.fairySoulsUnspent}\n&9Soulflow &f${data.soulflow}\n&aGlowing Mushrooms Broken &f${data.glowingMushroomsBroken}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let barWidth = Renderer.screen.getWidth() / 8;
              let barHeight = Renderer.screen.getHeight() / 25;
              (data.skills?? []).forEach((skill, index) => {
                let colour = getExpBarColour(skill.level, skill.name.toUpperCase());
                new ExpBar(x, y + index * barHeight, colour, Renderer.DARK_GRAY, Renderer.BLACK, parseFloat(skill.level) - Math.floor(skill.level), barWidth, barHeight).draw();
                drawScaledString(skill.name + " " + skill.level, x + 2, y + index * barHeight + 2, true);
              })
            }
          }
        );
        break;
      case 1:
        content.push(
          {
            draw: (x, y) => {
              let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
              let width = Renderer.screen.getWidth();
              let height = Renderer.screen.getHeight();
              if (data.inv?.content?? null) {
                for (let item of data.inv.content) {
                  item.item.draw(item.pos.x, item.pos.y, scale.x);
                  drawStackSize(item);
                }
              }
              if (data.inv?.pets?.pets?? null) {
                let height = Math.floor(508 / 2 / 10);
                let culledPets = data.inv.pets.pets.slice(height * data.inv.pets.index, height * data.inv.pets.index + height);
                let line = `${culledPets.map(pet => pet.name).join("\n")}`;
                drawScaledString(line, Renderer.screen.getWidth() / 5 * 2, Renderer.screen.getHeight() / 4 + 2, true);
              }
              if (data.storage?? null) {
                let page = data.storage[(data.storageIndex?? 0)]?? {name: "&eAccessories", content: []};
                drawScaledString(page.name, width / 1.75 + 16 * 4.5 - getScaledStringWidth(ChatLib.removeFormatting(page.name)) / 2, height / 4 + height / 10, true);
                for (let item of page?.content?? []) {
                  item.item.draw(item.pos.x, item.pos.y, scale.x);
                  drawStackSize(item);
                }
              }
              //pet up
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2, height / 4 * 3 - 40 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2, height / 4 * 3 - 40 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              //pet down
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2, height / 4 * 3 - 24 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2, height / 4 * 3 - 24 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
              //storage up
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2, height / 4 * 3 - 40 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2, height / 4 * 3 - 40 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              //storage down
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2, height / 4 * 3 - 24 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2, height / 4 * 3 - 24 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
            },
            hover: (x, y) => {
              let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
              let mouseX = Client.getMouseX();
              let mouseY = Client.getMouseY();
              let width = Renderer.screen.getWidth();
              let height = Renderer.screen.getHeight();
              for (let item of data.inv?.content?? []) {
                if (mouseX > item.pos.x && mouseX < item.pos.x + 16 * scale.y && mouseY > item.pos.y && mouseY < item.pos.y + 16 * scale.y) {
                  return item.item.getLore();
                }
              }
              let page = data.storage? data.storage[(data.storageIndex?? 0)] : {name: "", content: []};
              for (let item of page?.content?? []) {
                if (mouseX > item.pos.x && mouseX < item.pos.x + 16 * scale.x && mouseY > item.pos.y && mouseY < item.pos.y + 16 * scale.y) {
                  return item.item.getLore();
                }
              }
              let petHeight = Math.floor(508 / 2 / 10);
              let culledPets = (data?.inv?.pets?.pets?? []).slice(petHeight * data.inv?.pets?.index?? 0, petHeight + petHeight * data.inv?.pets?.index?? 0);
              for (let pet of culledPets) {
                let index = culledPets.indexOf(pet);
                if (mouseX > width / 5 * 2 && mouseX < width / 5 * 2 + getScaledStringWidth(pet.name) && mouseY > height / 4 + index * 9 * scale.y + 2 * scale.y && mouseY < height / 4 + index * 9 * scale.y + 10 * scale.y) {
                  return pet?.lore?? [];
                }
              }
              // pet up arrow
              if (mouseX > width / 2 - 8 * scale.x && mouseX < width / 2 + 8 * scale.x && mouseY > height / 4 * 3 - 48 * scale.y && mouseY < height / 4 * 3 - 32 * scale.y) { 
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2, height / 4 * 3 - 40 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2, height / 4 * 3 - 40 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
              }
              // pet down arrow
              else if (mouseX > width / 2 - 8 * scale.x && mouseX < width / 2 + 8 * scale.x && mouseY > height / 4 * 3 - 38 * scale.y && mouseY < height / 4 * 3 - 22 * scale.y) {
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2, height / 4 * 3 - 24 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2, height / 4 * 3 - 24 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
              }
              //storage up arrow
              if (mouseX > width / 3 * 2 - 8 * scale.x && mouseX < width / 3 * 2 + 8 * scale.x && mouseY > height / 4 * 3 - 48 * scale.y && mouseY < height / 4 * 3 - 32 * scale.y) { 
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2, height / 4 * 3 - 40 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2, height / 4 * 3 - 40 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
              }
              //storage down arrow
              else if (mouseX > width / 3 * 2 - 8 * scale.x && mouseX < width / 3 * 2 + 8 * scale.x && mouseY > height / 4 * 3 - 38 * scale.y && mouseY < height / 4 * 3 - 22 * scale.y) {
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2, height / 4 * 3 - 24 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2, height / 4 * 3 - 24 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
              }
            }
          },
          {
            draw: (x, y) => {
              
            }
          },
          {
            draw: (x, y) => {
              let line = `&f${(data.inv?.talismans?.mp?? 0)} &9MP\n&c${data.inv?.talismans?.power?? "None"}\n&f${(data.inv?.talismans?.unique?.normal?? 0)}&8/&f${(data.inv?.talismans?.total?.normal?? 0)} &3Talismans\n&f${(data.inv?.talismans?.unique?.recomb?? 0)}&8/&f${(data.inv?.talismans?.total?.recomb?? 0)} &6Recombobulated`;
              drawScaledString(line, x, y, true);
            }
          }
        );
        break;
      case 2:
        content.push(
          {
            draw: (x, y) => {
              let line = `&6CF Prestige &f${data.cfPrestige?? 0}\n&6Current Chocolate &f${data.currentChocolate?? 0}\n&6Since prestige &f${data.chocolateSincePrestige?? 0}\n&6Rabbits &f${data.rabbitCount?? 0}&8/&f457\n&cMissing &f${457 - (data.rabbitCount?? 0)}\n&6Duplicates &f${data.duplicateRabbits?? 0}\n&6Last checked &f${data.lastCfCheck?? "Unknown"}\n&6Time tower &f${data.timeTower}\n&6Coach &f${data.coach}\n&6Shrine &f${data.shrine}\n&bDivine &f${data.rabbitRarityCount?.DIVINE?? 0}&8/&f5\n&dMythic &f${data.rabbitRarityCount?.MYTHIC?? 0}&8/&f11\n&6Legendary &f${data.rabbitRarityCount?.LEGENDARY?? 0}&8/&f24\n&5Epic &f${data.rabbitRarityCount?.EPIC?? 0}&8/&f31\n&9Rare &f${data.rabbitRarityCount?.RARE?? 0}&8/&f67\n&aUncommon &f${data.rabbitRarityCount?.UNCOMMON?? 0}&8/&f114\n&fCommon &f${data.rabbitRarityCount?.COMMON?? 0}&8/&f205`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
              if (data.rabbits?.rabbits?? null) {
                let height = Math.floor(508 / 2 / 10);
                let culledRabbits = (data.rabbits.rabbits.map(rabbit => rabbit.name)).slice(height * data.rabbits.index, height * data.rabbits.index + height);
                let line = `${culledRabbits.join("\n")}`;
                drawScaledString(line, Renderer.screen.getWidth() / 5 * 2, Renderer.screen.getHeight() / 4 + 2, true);
              }
              if (data.missingRabbits?.rabbits?? null) {
                let height = Math.floor(508 / 2 / 10);
                let culledRabbits = (data.missingRabbits.rabbits.map(rabbit => rabbit.name)).slice(height * data.missingRabbits.index, height * data.missingRabbits.index + height);
                let line = `${culledRabbits.join("\n")}`;
                drawScaledString(line, Renderer.screen.getWidth() / 5 * 2.7, Renderer.screen.getHeight() / 4 + 2, true);
              }
              let width = Renderer.screen.getWidth();
              let height = Renderer.screen.getHeight();
              //up
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2, height / 4 * 3 - 40 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2, height / 4 * 3 - 40 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              //down
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2, height / 4 * 3 - 24 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 2, height / 4 * 3 - 24 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
              //missing up
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2, height / 4 * 3 - 40 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2, height / 4 * 3 - 40 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 3 * scale.x);
              //missing down
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2, height / 4 * 3 - 24 * scale.y, 3 * scale.x);
              Renderer.drawLine(Renderer.BLACK, width / 3 * 2, height / 4 * 3 - 24 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 3 * scale.x);
            },
            hover: (x, y) => {
              let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
              let mouseX = Client.getMouseX();
              let mouseY = Client.getMouseY();
              let width = Renderer.screen.getWidth();
              let height = Renderer.screen.getHeight();
              let rabbitHeight = Math.floor(508 / 2 / 10);
              let culledRabbits = (data.rabbits?.rabbits?? []).slice(rabbitHeight * data.rabbits?.index?? 0, rabbitHeight + rabbitHeight * data.rabbits?.index?? 0);
              for (let rabbit of culledRabbits) {
                let index = culledRabbits.indexOf(rabbit);
                if (mouseX > width / 5 * 2 && mouseX < width / 5 * 2 + getScaledStringWidth(ChatLib.removeFormatting(rabbit.name)) && mouseY > height / 4 + index * 9 * scale.y + 2 * scale.y && mouseY < height / 4 + index * 9 * scale.y + 10 * scale.y) {
                  return rabbit?.lore?? [];
                }
              }
              let culledMissingRabbits = (data.missingRabbits?.rabbits?? []).slice(rabbitHeight * data.missingRabbits?.index?? 0, rabbitHeight + rabbitHeight * data.missingRabbits?.index?? 0);
              for (let rabbit of culledMissingRabbits) {
                let index = culledMissingRabbits.indexOf(rabbit);
                if (mouseX > width / 5 * 2.7 && mouseX < width / 5 * 2.7 + getScaledStringWidth(ChatLib.removeFormatting(rabbit.name)) && mouseY > height / 4 + index * 9 + 2 && mouseY < height / 4 + index * 9 + 10) {
                  return rabbit?.lore?? [];
                }
              }
              // rabbit up arrow
              if (mouseX > width / 2 - 8 * scale.x && mouseX < width / 2 + 8 * scale.x && mouseY > height / 4 * 3 - 48 * scale.y && mouseY < height / 4 * 3 - 32 * scale.y) { 
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 2, height / 4 * 3 - 40 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2, height / 4 * 3 - 40 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
              }
              // rabbit down arrow
              else if (mouseX > width / 2 - 8 * scale.x && mouseX < width / 2 + 8 * scale.x && mouseY > height / 4 * 3 - 38 * scale.y && mouseY < height / 4 * 3 - 22 * scale.y) {
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 2, height / 4 * 3 - 24 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 2, height / 4 * 3 - 24 * scale.y, width / 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
              }
              // missing rabbit up arrow
              if (mouseX > width / 3 * 2 - 8 * scale.x && mouseX < width / 3 * 2 + 8 * scale.x && mouseY > height / 4 * 3 - 48 * scale.y && mouseY < height / 4 * 3 - 32 * scale.y) { 
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 34 * scale.y, width / 3 * 2, height / 4 * 3 - 40 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2, height / 4 * 3 - 40 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 34 * scale.y, 2 * scale.x);
              }
              // missing rabbit down arrow
              else if (mouseX > width / 3 * 2 - 8 * scale.x && mouseX < width / 3 * 2 + 8 * scale.x && mouseY > height / 4 * 3 - 38 * scale.y && mouseY < height / 4 * 3 - 22 * scale.y) {
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2 - 4 * scale.x, height / 4 * 3 - 30 * scale.y, width / 3 * 2, height / 4 * 3 - 24 * scale.y, 2 * scale.x);
                Renderer.drawLine(Renderer.BLUE, width / 3 * 2, height / 4 * 3 - 24 * scale.y, width / 3 * 2 + 4 * scale.x, height / 4 * 3 - 30 * scale.y, 2 * scale.x);
              }
            }
          }
        );
        break;
      case 3:
        content.push(
          {
            draw: (x, y) => {
              let line = `&4Catacombs &f${(data.dungeons?.cataLevel?? 0)}\n&aExperience &f${(data.dungeons?.cataExp?? 0)}\n&6Secrets &f${(data.dungeons?.secretsFound?? 0)}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&5Healer &f${(data.dungeons?.classes?.healer?.level?? 0)}\n&9Mage &f${(data.dungeons?.classes?.mage?.level?? 0)}\n&6Berserk &f${(data.dungeons?.classes?.berserk?.level?? 0)}\n&cArcher &f${(data.dungeons?.classes?.archer?.level?? 0)}\n&aTank &f${(data.dungeons?.classes?.tank?.level?? 0)}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&bIce &f${(data.dungeons?.essence?.ice?? 0)}\n&0Wither &f${(data.dungeons?.essence?.wither?? 0)}\n&8Spider &f${(data.dungeons?.essence?.spider?? 0)}\n&dUndead &f${(data.dungeons?.essence?.undead?? 0)}\n&3Diamond &f${(data.dungeons?.essence?.diamond?? 0)}\n&5Dragon &f${(data.dungeons?.essence?.dragon?? 0)}\n&eGold &f${(data.dungeons?.essence?.gold?? 0)}\n&6Crimson &f${(data.dungeons?.essence?.crimson?? 0)}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&fWatcher &a${(data.dungeons?.floors?.normal?.entrance?? 0)}\n&cBonzo &a${(data.dungeons?.floors?.normal?.floor_1?? 0)}&8/&c${(data.dungeons?.floors?.master?.floor_1?? 0)}\n&7Scarf &a${(data.dungeons?.floors?.normal?.floor_2?? 0)}&8/&c${(data.dungeons?.floors?.master?.floor_2?? 0)}\n&9Professor &a${(data.dungeons?.floors?.normal?.floor_3?? 0)}&8/&c${(data.dungeons?.floors?.master?.floor_3?? 0)}\n&2Thorn &a${(data.dungeons?.floors?.normal?.floor_4?? 0)}&8/&c${(data.dungeons?.floors?.master?.floor_4?? 0)}\n&5Livid &a${(data.dungeons?.floors?.normal?.floor_5?? 0)}&8/&c${(data.dungeons?.floors?.master?.floor_5?? 0)}\n&6Sadan &a${(data.dungeons?.floors?.normal?.floor_6?? 0)}&8/&c${(data.dungeons?.floors?.master?.floor_6?? 0)}\n&4Necron &a${(data.dungeons?.floors?.normal?.floor_7?? 0)}&8/&c${(data.dungeons?.floors?.master?.floor_7?? 0)}`;
              drawScaledString(line, x, y, true);
            }
          },
        );         
        break;
      case 4:
        content.push(
          {
            draw: (x, y) => {
              let line = `&aRevenant Horror\n&8Tarantula Broodfather\n&fSven Packmaster\n&5Voidgloom Seraph\n&4Riftstalker Bloodfiend\n&6Inferno Demonlord`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&c${(data.slayer_level? Object.values(data.slayer_level).join('\n&c') : 0)?? 0}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&a${(data.slayer_xp? Object.values(data.slayer_xp).join('\n&a') : 0)?? 0}`;
              drawScaledString(line, x, y, true);
            }
          }
        );   
        break;
      case 5:
        content.push(
          {
            draw: (x, y) => {
              let line = `&5HOTM Level &f${(data.hotmLevel?? 0)}\n&5Peak &f${(data.peakLevel?? 0)}\n&cCommissions &f${(data.commissions?? 0)}\n&cNucleus Runs &f${(data.nucleusRuns?? 0)}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&2Mithril\n\n\n&dGemstone\n\n\n&bGlacite`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&2${formatNumber(data.mithrilPowder?.available?? 0)} &funused\n&2${formatNumber(data.mithrilPowder?.spent?? 0)}&8/&2${formatNumber(data.mithrilPowder?.total?? 0)}\n\n&d${formatNumber(data.gemstonePowder?.available?? 0)} &funused\n&d${formatNumber(data.gemstonePowder?.spent?? 0)}&8/&d${formatNumber(data.gemstonePowder?.total?? 0)}\n\n&b${formatNumber(data.glacitePowder?.available?? 0)} &funused\n&b${formatNumber(data.glacitePowder?.spent?? 0)}&8/&b${formatNumber(data.glacitePowder?.total?? 0)}`;
              drawScaledString(line, x, y, true);
            }
          }
        );     
        break;
      case 6:
        content.push(
          {
            draw: (x, y) => {
              let line = `&5Mage &f${data.isle?.mageRep?? 0}\n&cBarbarian &f${data.isle?.barbRep?? 0}\n&7Last matriarch:\n&f${data.isle?.lastMatriarch?? "Unknown"}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&fBasic &f${data.isle?.kuudra?.basic?? 0}\n&eHot &f${data.isle?.kuudra?.hot?? 0}\n&6Burning &f${data.isle?.kuudra?.burning?? 0}\n&cFiery &f${data.isle?.kuudra?.fiery?? 0}\n&4Infernal &f${data.isle?.kuudra?.infernal?? 0}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let line = `&8&lAshfang &f${data.isle?.kills?.ashfang?? 0}\n&8&lDuke X &f${data.isle?.kills?.duke?? 0}\n&8&lBladesoul &f${data.isle?.kills?.bladesoul?? 0}\n&5&lOutlaw &f${data.isle?.kills?.outlaw?? 0}\n&4&lMagma Boss &f${data.isle?.kills?.magma?? 0}\n&5Vanquisher &f${data.isle?.kills?.vanquisher?? 0}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let total = data.isle?.dojo?.total?? 0;
              let discipline = data.isle?.dojo?.types?.discipline?? 0;
              let tenacity = data.isle?.dojo?.types?.tenacity?? 0;
              let mastery = data?.isle?.dojo?.types?.mastery?? 0;
              let control = data.isle?.dojo?.types?.control?? 0;
              let swiftness = data?.isle?.dojo?.types?.swiftness?? 0;
              let stamina = data.isle?.dojo?.types?.stamina?? 0;
              let force = data.isle?.dojo?.types?.force?? 0;
              let line = `${getBeltColour(total)}Total &f${total}\n${getDojoColour(discipline)}Discipline &f${discipline}\n${getDojoColour(tenacity)}Tenacity &f${tenacity}\n${getDojoColour(mastery)}Mastery &f${mastery}\n${getDojoColour(control)}Control &f${control}\n${getDojoColour(swiftness)}Swiftness &f${swiftness}\n${getDojoColour(stamina)}Stamina &f${stamina}\n${getDojoColour(force)}Force &f${force}`;
              drawScaledString(line, x, y, true);
            }
          }
        );
        break;
      case 7:
        content.push(
          {
            draw: (x, y) => {
              let line = `&6Total caught &f${data.trophy?.total?? 0}`;
              drawScaledString(line, x, y, true);
            }
          },
          {
            draw: (x, y) => {
              let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
              for (let item of data.trophy?.content?? []) {
                item.item.draw(item.pos.x, item.pos.y, scale.x);
                drawScaledString(item.count, item.pos.x + (3 - ChatLib.removeFormatting(item.count).length) * 3, item.pos.y + 24, true);
              }
            },
            hover: () => {
              let scale = {x: Renderer.screen.getWidth() / 960, y: Renderer.screen.getHeight() / 508};
              let mouseX = Client.getMouseX();
              let mouseY = Client.getMouseY();
              for (let item of data.trophy?.content?? []) {
                if (mouseX > item.pos.x && mouseX < item.pos.x + 16 * scale.x && mouseY > item.pos.y && mouseY < item.pos.y + 16 * scale.y) {
                  return item.item.getLore();
                }
              }
            }
          }
        );
        break;
    }
  }
  catch (e) {
    print(e);
    return [{draw: (x, y) => drawScaledString("No data", x, y, true)}];
  }

  return content;
}

class ExpBar {
  constructor(x, y, colour, background, outline, amount, width, height) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.background = background;
    this.outline = outline;
    this.amount = amount;
    if (!width) this.width = 60;
    else this.width = width;
    if (!height) this.height = 20;
    else this.height = height;
  }

  draw() {
    if (this.amount < 0.01) this.amount = 1;
    Renderer.drawRect(this.outline, this.x, this.y, this.width, this.height);
    Renderer.drawRect(this.background, this.x + 2, this.y + 2, this.width - 4, this.height - 4);
    Renderer.drawRect(this.colour, this.x + 2, this.y + 2, this.width * this.amount - 4, this.height - 4);
    let amountStr = Math.floor(this.amount * 100) + "%";
    drawScaledString(amountStr, this.x + this.width + 4, this.y + this.height / 2, true);
  }
}

function drawStackSize(item) {
  let stackSize = item.item.getStackSize();
  if (stackSize > 1) {
    Renderer.translate(0, 0, 500);
    drawScaledString(stackSize, item.pos.x + (3 - stackSize.toString().length) * 5, item.pos.y + 8, true);
  }
}