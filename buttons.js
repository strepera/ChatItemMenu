import { formatNumber } from "./utils";

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
    text: "Skills",
    color: Renderer.GREEN,
    dark: Renderer.DARK_GREEN,
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
    color: Renderer.color(153, 102, 51),
    dark: Renderer.color(102, 51, 0),
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

export function getViewText(data, button) {
  let lines = [];

  if (!data.name) return ["Loading..."];

  try {
    switch(button) {
      case 0:
        lines.push(`Skyblock Level [${data.skyblockLevel?? 0}]\nNetworth ${data.networth?? 0}\nPurse ${data.purse?? 0}\nBank ${data.bank?? 0}\nSenither ${data.senitherWeight?? 0}\nLily ${data.lilyWeight?? 0}\nLast Area [${data.lastArea?? "Unknown"}]`,
        `CF Prestige ${data.cfPrestige?? 0}\nCurrent Chocolate ${data.currentChocolate?? 0}\nChocolate since prestige ${data.chocolateSincePrestige?? 0}\nRabbits ${data.rabbitCount?? 0}/457\nDuplicates ${data.duplicateRabbits?? 0}\nLast checked ${data.lastCfCheck?? "Unknown"}`,
        );
        break;
      case 1:
        lines.push(
          `&f`,
          `${(data.inv?.talismans?.mp?? 0)} MP\n${(data.inv?.talismans?.unique?.normal?? 0)}/${(data.inv?.talismans?.total?.normal?? 0)} Talismans\n${(data.inv?.talismans?.unique?.recomb?? 0)}/${(data.inv?.talismans?.total?.recomb?? 0)} Recombobulated`
        );        
        break;
      case 2:
        lines.push(
          `Skill Average ${data.skillAverage?? 0}`,
          `Taming ${data.taming?? 0}\nFarming ${data.farming?? 0}\nMining ${data.mining?? 0}\nCombat ${data.combat?? 0}\nForaging ${data.foraging?? 0}\nFishing ${data.fishing?? 0}\nEnchanting ${data.enchanting?? 0}\nAlchemy ${data.alchemy?? 0}\nCarpentry ${data.carpentry?? 0}\nRunecrafting ${data.runecrafting?? 0}\nSocial ${data.social?? 0}`
        )
        break;
      case 3:
        lines.push(
          `Catacombs ${(data.dungeons?.cataLevel?? 0)}\nExperience ${(data.dungeons?.cataExp?? 0)}\nSecrets ${(data.dungeons?.secretsFound?? 0)}`,
          `Healer ${(data.dungeons?.classes?.healer?.level?? 0)}\nMage ${(data.dungeons?.classes?.mage?.level?? 0)}\nBerserk ${(data.dungeons?.classes?.berserk?.level?? 0)}\nArcher ${(data.dungeons?.classes?.archer?.level?? 0)}\nTank ${(data.dungeons?.classes?.tank?.level?? 0)}`,
          `Ice ${(data.dungeons?.essence?.ice?? 0)}\nWither ${(data.dungeons?.essence?.wither?? 0)}\nSpider ${(data.dungeons?.essence?.spider?? 0)}\nUndead ${(data.dungeons?.essence?.undead?? 0)}\nDiamond ${(data.dungeons?.essence?.diamond?? 0)}\nDragon ${(data.dungeons?.essence?.dragon?? 0)}\nGold ${(data.dungeons?.essence?.gold?? 0)}\nCrimson ${(data.dungeons?.essence?.crimson?? 0)}`,
          `Watcher\nBonzo\nScarf\nProfessor\nThorn\nLivid\nSadan\nNecron`,
          `${(data.dungeons?.floors?.normal?.entrance?? 0)}\n${(data.dungeons?.floors?.normal?.floor_1?? 0)} / ${(data.dungeons?.floors?.master?.floor_1?? 0)}\n${(data.dungeons?.floors?.normal?.floor_2?? 0)} / ${(data.dungeons?.floors?.master?.floor_2?? 0)}\n${(data.dungeons?.floors?.normal?.floor_3?? 0)} / ${(data.dungeons?.floors?.master?.floor_3?? 0)}\n${(data.dungeons?.floors?.normal?.floor_4?? 0)} / ${(data.dungeons?.floors?.master?.floor_4?? 0)}\n${(data.dungeons?.floors?.normal?.floor_5?? 0)} / ${(data.dungeons?.floors?.master?.floor_5?? 0)}\n${(data.dungeons?.floors?.normal?.floor_6?? 0)} / ${(data.dungeons?.floors?.master?.floor_6?? 0)}\n${(data.dungeons?.floors?.normal?.floor_7?? 0)} / ${(data.dungeons?.floors?.master?.floor_7?? 0)}`
        );             
        break;
      case 4:
        lines.push(
          `Revenant Horror\nTarantula Broodfather\nSven Packmaster\nVoidgloom Seraph\nRiftstalker Bloodfiend\nInferno Demonlord`,
          `${(data.slayer_level? Object.values(data.slayer_level).join('\n') : 0)?? 0}`,
          `${(data.slayer_xp? Object.values(data.slayer_xp).join('\n') : 0)?? 0}`
        );        
        break;
      case 5:
        lines.push(
          `HOTM Level ${(data.hotmLevel?? '0')}\nPeak ${(data.peakLevel?? '0')}\nCommissions ${(data.commissions?? '0')}\nNucleus Runs ${(data.nucleusRuns?? '0')}`,
          `Mithril\n\n\n\nGemstone\n\n\n\nGlacite`,
          `${formatNumber(data.mithrilPowder?.available?? 0)}\n${formatNumber(data.mithrilPowder?.spent?? 0)}/\n${formatNumber(data.mithrilPowder?.total?? 0)}\n\n${formatNumber(data.gemstonePowder?.available?? 0)}\n${formatNumber(data.gemstonePowder?.spent?? 0)}/\n${formatNumber(data.gemstonePowder?.total?? 0)}\n\n${formatNumber(data.glacitePowder?.available?? 0)}\n${formatNumber(data.glacitePowder?.spent?? 0)}/\n${formatNumber(data.glacitePowder?.total?? 0)}\n`
        );        
        break;
      case 6:
        lines.push(
          `Mage ${data.isle.mageRep}\nBarbarian ${data.isle.barbRep}\nLast matriarch:\n${data.isle.lastMatriarch}`,
          `Basic ${data.isle.kuudra.basic}\nHot ${data.isle.kuudra.hot}\nBurning ${data.isle.kuudra.burning}\nFiery ${data.isle.kuudra.fiery}\nInfernal ${data.isle.kuudra.infernal}`,
          `Ashfang ${data.isle.kills.ashfang}\nDuke X ${data.isle.kills.duke}\nBladesoul ${data.isle.kills.bladesoul}\nOutlaw ${data.isle.kills.outlaw}\nMagma Boss ${data.isle.kills.magma}\nVanquisher ${data.isle.kills.vanquisher}`,
          `Total ${data.isle.dojo.total}\nDiscipline ${data.isle.dojo.types.discipline}\nTenacity ${data.isle.dojo.types.tenacity}\nMastery ${data.isle.dojo.types.mastery}\nControl ${data.isle.dojo.types.control}\nSwiftness ${data.isle.dojo.types.swiftness}\nStamina ${data.isle.dojo.types.stamina}\nForce ${data.isle.dojo.types.force}`
        );
        break;
      case 7:
        lines.push(
          `Total caught ${data.trophy?.total?? 0}`
        );
    }
  }
  catch (e) {
    print(e);
    return ["No data"];
  }

  return lines;
}