import { formatNumber } from "./utils";

export const buttons = [
  {
    text: "General",
    color: Renderer.BLUE,
    dark: Renderer.DARK_BLUE,
    clicked: true
  },
  {
    text: "Skills",
    color: Renderer.GREEN,
    dark: Renderer.DARK_GREEN,
    clicked: false
  },
  {
    text: "Dungeons",
    color: Renderer.GRAY,
    dark: Renderer.color(60, 60, 60),
    clicked: false
  },
  {
    text: "Slayer",
    color: Renderer.color(153, 102, 51),
    dark: Renderer.color(102, 51, 0),
    clicked: false
  },
  {
    text: "HOTM",
    color: Renderer.color(153, 0, 204),
    dark: Renderer.color(102, 0, 102),
    clicked: false
  }
];

export function getViewText(data, button) {
  let lines = [];

  if (!data.name) return "Loading..";

  try {
    switch(button) {
      case 0:
        lines.push(`Skyblock Level [${data.skyblockLevel}]\nNetworth ${data.networth}`, `Senither ${data.senitherWeight}\nLily ${data.lilyWeight}`);
        break;
      case 1:
        lines.push(
          `Skill Average ${data.skillAverage}`,
          `Taming ${data.taming}\nFarming ${data.farming}\nMining ${data.mining}\nCombat ${data.combat}\nForaging ${data.foraging}\nFishing ${data.fishing}\nEnchanting ${data.enchanting}\nAlchemy ${data.alchemy}\nCarpentry ${data.carpentry}\nRunecrafting ${data.runecrafting}\nSocial ${data.social}`
        )
        break;
      case 2:
        lines.push(
          `Catacombs ${data.cataLevel}\nSecrets ${data.secretsFound}\n`,
          `Healer ${data.archer}\nMage ${data.mage}\nBerserk ${data.berserk}\nArcher ${data.archer}\nTank ${data.tank}`,
          `Ice ${data.ice_ess}\nWither ${data.wither_ess}\nSpider ${data.spider_ess}\nUndead ${data.undead_ess}\nDiamond ${data.diamond_ess}\nDragon ${data.dragon_ess}\nGold ${data.gold_ess}\nCrimson ${data.crimson_ess}`,
          `Watcher\nBonzo\nScarf\nProfessor\nThorn\nLivid\nSadan\nNecron`,
          `${data.entrance}\n${data.floor_1} / ${data.master_floor_1}\n${data.floor_2} / ${data.master_floor_2}\n${data.floor_3} / ${data.master_floor_3}\n${data.floor_4} / ${data.master_floor_4}\n${data.floor_5} / ${data.master_floor_5}\n${data.floor_6} / ${data.master_floor_6}\n${data.floor_7} / ${data.master_floor_7}`
        );
        break;
      case 3:
        lines.push(
          `Revenant Horror\nTarantula Broodfather\nSven Packmaster\nVoidgloom Seraph\nRiftstalker Bloodfiend\nInferno Demonlord`,
          `${Object.values(data.slayer_level).join('\n')}`,
          `${Object.values(data.slayer_xp).join('\n')}`
        );
        break;
      case 4:
        lines.push(
          `HOTM Level ${data.hotmLevel}\nPeak ${data.peakLevel}\nCommissions ${data.commissions}\nNucleus Runs ${data.nucleusRuns}`,
          `Mithril\n\n\n\nGemstone\n\n\n\nGlacite`,
          `${formatNumber(data.mithrilPowder.available)}\n${formatNumber(data.mithrilPowder.spent)}/\n${formatNumber(data.mithrilPowder.total)}\n\n${formatNumber(data.gemstonePowder.available)}\n${formatNumber(data.gemstonePowder.spent)}/\n${formatNumber(data.gemstonePowder.total)}\n\n${formatNumber(data.glacitePowder.available)}\n${formatNumber(data.glacitePowder.spent)}/\n${formatNumber(data.glacitePowder.total)}\n`
        )
        break;
    }
  }
  catch (e) {
    print(e);
  }

  return lines;
}