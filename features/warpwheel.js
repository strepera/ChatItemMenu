import GuiHelper from "../utils/gui";
import { locraw } from "../utils/locraw.js";
import { getItemFromNBT, Tooltip } from "../utils/utils.js";
import { Keybind } from "KeybindFix"

const gui = new GuiHelper();

const row1 = [
  {
    name: "Private Island",
    locraw: "dynamic",
    command: "is",
    children: [],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"0181077c-8141-4b56-9cfd-22dc35994c41",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzljODg4MWU0MjkxNWE5ZDI5YmI2MWExNmZiMjZkMDU5OTEzMjA0ZDI2NWRmNWI0MzliM2Q3OTJhY2Q1NiJ9fX0="}]},Name:"§0181077c-8141-4b56-9cfd-22dc35994c41"},display:{Lore:[0:"§8/warp home",1:"",2:"§7Your very own chunk of SkyBlock. Nice",3:"§7housing for your minions.",4:"",5:"§aYou are here!"],Name:"§bPrivate Island"}},Damage:3s}'
  },
  {
    name: "SkyBlock Hub",
    locraw: "hub",
    command: "warp hub",
    children: [
      {
        name: "Castle",
        command: "warp castle"
      },
      {
        name: "Sirius Shack",
        command: "warp da"
      },
      {
        name: "Crypts",
        command: "warp crypt"
      },
      {
        name: "Museum",
        command: "warp museum"
      },
      {
        name: "Wizard",
        command: "warp wiz"
      },
      {
        name: "Trade Centre",
        command: "warp stonks"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"f5a3c783-ad64-4049-9ac3-307edbddcbf8",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0aW1lc3RhbXAiOjE1NTkyMTU0MTY5MDksInByb2ZpbGVJZCI6IjQxZDNhYmMyZDc0OTQwMGM5MDkwZDU0MzRkMDM4MzFiIiwicHJvZmlsZU5hbWUiOiJNZWdha2xvb24iLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2Q3Y2M2Njg3NDIzZDA1NzBkNTU2YWM1M2UwNjc2Y2I1NjNiYmRkOTcxN2NkODI2OWJkZWJlZDZmNmQ0ZTdiZjgifX19"}]},Name:"§f5a3c783-ad64-4049-9ac3-307edbddcbf8"},display:{Lore:[0:"§8/warp hub",1:"",2:"§7Where everything happens and",3:"§7anything is possible.",4:"",5:"§8Right-Click to warp!",6:"§eLeft-Click to open!"],Name:"§bSkyBlock Hub"}},Damage:3s}'
  },
  {
    name: "Dungeon Hub",
    locraw: "dungeon_hub",
    command: "warp dhub",
    children: [
      {
        name: "F7",
        command: "joindungeon catacombs_floor_seven"
      },
      {
        name: "F6",
        command: "joindungeon catacombs_floor_six"
      },
      {
        name: "F5",
        command: "joindungeon catacombs_floor_five"
      },
      {
        name: "F4",
        command: "joindungeon catacombs_floor_four"
      },
      {
        name: "F3",
        command: "joindungeon catacombs_floor_three"
      },
      {
        name: "F2",
        command: "joindungeon catacombs_floor_two"
      },
      {
        name: "F1",
        command: "joindungeon catacombs_floor_one"
      },
      {
        name: "Entrance",
        command: "joindungeon catacombs_entrance"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"f50e4c6c-39f2-47ef-90b8-efb29c50684a",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0aW1lc3RhbXAiOjE1Nzg0MDk0MTMxNjksInByb2ZpbGVJZCI6IjQxZDNhYmMyZDc0OTQwMGM5MDkwZDU0MzRkMDM4MzFiIiwicHJvZmlsZU5hbWUiOiJNZWdha2xvb24iLCJzaWduYXR1cmVSZXF1aXJlZCI6dHJ1ZSwidGV4dHVyZXMiOnsiU0tJTiI6eyJ1cmwiOiJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzliNTY4OTViOTY1OTg5NmFkNjQ3ZjU4NTk5MjM4YWY1MzJkNDZkYjljMWIwMzg5YjhiYmViNzA5OTlkYWIzM2QiLCJtZXRhZGF0YSI6eyJtb2RlbCI6InNsaW0ifX19fQ=="}]},Name:"§f50e4c6c-39f2-47ef-90b8-efb29c50684a"},display:{Lore:[0:"§8/warp dungeon_hub",1:"",2:"§7Group up with friends and take on",3:"§7challenging Dungeons.",4:"",5:"§eClick to warp!"],Name:"§aDungeon Hub§7 - §bSpawn"}},Damage:3s}'
  },
  {
    name: "Master Mode",
    locraw: "dungeon_hub",
    command: "warp dhub",
    children: [
      {
        name: "M7",
        command: "joindungeon master_catacombs_floor_seven"
      },
      {
        name: "M6",
        command: "joindungeon master_catacombs_floor_six"
      },
      {
        name: "M5",
        command: "joindungeon master_catacombs_floor_five"
      },
      {
        name: "M4",
        command: "joindungeon master_catacombs_floor_four"
      },
      {
        name: "M3",
        command: "joindungeon master_catacombs_floor_three"
      },
      {
        name: "M2",
        command: "joindungeon master_catacombs_floor_two"
      },
      {
        name: "M1",
        command: "joindungeon master_catacombs_floor_one"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:\"c4aefb26-9e84-3f46-a3c4-79ba57a89059\",Properties:{textures:[0:{Value:\"ewogICJ0aW1lc3RhbXAiIDogMTY0NTg2MzYyOTgxNSwKICAicHJvZmlsZUlkIiA6ICJiOTE5M2NiMjkzMWI0M2FhYmM1OGQ2NjAwMTg3NGRjMyIsCiAgInByb2ZpbGVOYW1lIiA6ICJiMmJsYWtlIiwKICAic2lnbmF0dXJlUmVxdWlyZWQiIDogdHJ1ZSwKICAidGV4dHVyZXMiIDogewogICAgIlNLSU4iIDogewogICAgICAidXJsIiA6ICJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlL2EwNGU0N2M0MzU3NmY4ZDcyZWJhYmI0NTg3NjRhZmZiNTg4ZmMwMTgyNjI3MzJlODUxNDlkZjliYmFhYjc3NjciCiAgICB9CiAgfQp9\"}]}},display:{Lore:[0:\"§7Grants §a+10% §c§c❤ Health§7 and\",1:\"§7§c§c❁ Strength§7 while in\",2:\"§7§cMaster Mode§7 Dungeons.\",3:\"\",4:\"§6§lLEGENDARY DUNGEON ACCESSORY\"],Name:\"§f§f§6Master Skull - Tier 7\"},ExtraAttributes:{id:\"MASTER_SKULL_TIER_7\"}},Damage:3s}'
  },
  {
    name: "The Barn",
    locraw: "farming_1",
    command: "warp barn",
    children: [
      {
        name: "Desert",
        command: "warp desert"
      },
      {
        name: "Trapper",
        command: "warp trapper"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"9ab6b4de-0f6f-466f-8ca5-2fec8f4ef4d3",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGQzYTZiZDk4YWMxODMzYzY2NGM0OTA5ZmY4ZDJkYzYyY2U4ODdiZGNmM2NjNWIzODQ4NjUxYWU1YWY2YiJ9fX0="}]},Name:"§9ab6b4de-0f6f-466f-8ca5-2fec8f4ef4d3"},display:{Lore:[0:"§8/warp barn",1:"",2:"§7Collect basic farming resources from",3:"§7plentiful crops or the local animal",4:"§7population.",5:"",6:"§7Main skill: §bFarming",7:"§7Island tier: §eI",8:"",9:"§8Right-Click to warp!",10:"§eLeft-Click to open!"],Name:"§aThe Barn§7 - §bSpawn"}},Damage:3s}'
  },
  {
    name: "The Park",
    locraw: "foraging_1",
    command: "warp park",
    children: [
      {
        name: "Jungle",
        command: "warp jungle"
      },
      {
        name: "Howling Cave",
        command: "warp howl"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"88a239a2-17cc-4dde-85c1-90362539af25",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTIyMWY4MTNkYWNlZTBmZWY4YzU5Zjc2ODk0ZGJiMjY0MTU0NzhkOWRkZmM0NGMyZTcwOGE2ZDNiNzU0OWIifX19"}]},Name:"§88a239a2-17cc-4dde-85c1-90362539af25"},display:{Lore:[0:"§8/warp park",1:"",2:"§7Chop down trees and explore to meet",3:"§7various characters across different",4:"§7biome layers.",5:"",6:"§7Main skill: §bForaging",7:"§7Island tier: §eI",8:"",9:"§8Right-Click to warp!",10:"§eLeft-Click to open!"],Name:"§aThe Park§7 - §bSpawn"}},Damage:3s}'
  },
  {
    name: "Gold Mines",
    locraw: "mining_1",
    command: "warp gold",
    children: [],
    item: `{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"88658796-e22a-4a34-8842-9b3901180b04",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzNiYzk2NWQ1NzljM2M2MDM5ZjBhMTdlYjdjMmU2ZmFmNTM4YzdhNWRlOGU2MGVjN2E3MTkzNjBkMGE4NTdhOSJ9fX0="}]},Name:"§88658796-e22a-4a34-8842-9b3901180b04"},display:{Lore:[0:"§8/warp gold",1:"",2:"§7Your first stop for extended mining",3:"§7related activities and home to",4:"§7SkyBlock's local janitor Rusty.",5:"",6:"§7Main skill: §bMining",7:"§7Island tier: §eI",8:"",9:"§eClick to warp!"],Name:"§aGold Mine§7 - §bSpawn"}},Damage:3s}`
  },
  {
    name: "Deep Caverns",
    locraw: "mining_2",
    command: "warp deep",
    children: [],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"dafa65c5-89d1-4dfe-a74c-532634e25cac",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTY5YTFmMTE0MTUxYjQ1MjEzNzNmMzRiYzE0YzI5NjNhNTAxMWNkYzI1YTY1NTRjNDhjNzA4Y2Q5NmViZmMifX19"}]},Name:"§dafa65c5-89d1-4dfe-a74c-532634e25cac"},display:{Lore:[0:"§8/warp deep",1:"",2:"§7An island that gets progressively",3:"§7deeper and contains 6 layers of",4:"§7dangerous mobs and new resources.",5:"",6:"§7Main skill: §bMining",7:"§7Island tier: §eII",8:"",9:"§eClick to warp!"],Name:"§aDeep Caverns§7 - §bSpawn"}},Damage:3s}'
  }
]

const row2 = [
  {
    name: "Dwarven Mines",
    locraw: "mining_3",
    command: "warp mines",
    children: [
      {
        name: "Forge",
        command: "warp forge"
      },
      {
        name: "Base Camp",
        command: "warp basecamp"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"4690ced4-389d-4a84-9d75-6be25a96c4bb",hypixelPopulated:1b,Properties:{textures:[0:{Value:"ewogICJ0aW1lc3RhbXAiIDogMTYwODMxNDY5NDY2OSwKICAicHJvZmlsZUlkIiA6ICI0MWQzYWJjMmQ3NDk0MDBjOTA5MGQ1NDM0ZDAzODMxYiIsCiAgInByb2ZpbGVOYW1lIiA6ICJNZWdha2xvb24iLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmIyMGIyM2MxYWEyYmUwMjcwZjAxNmI0YzkwZDZlZTZiODMzMGExN2NmZWY4Nzg2OWQ2YWQ2MGIyZmZiZjNiNSIKICAgIH0KICB9Cn0="}]},Name:"§4690ced4-389d-4a84-9d75-6be25a96c4bb"},display:{Lore:[0:"§8/warp dwarves",1:"",2:"§7Discover new ores and minerals and",3:"§7level up your Heart of the Mountain",4:"§7whilst completing commissions from the",5:"§7Dwarven King himself.",6:"",7:"§7Main skill: §bMining",8:"§7Island tier: §eIII",9:"",10:"§8Right-Click to warp!",11:"§eLeft-Click to open!"],Name:"§aDwarven Mines§7 - §bSpawn"}},Damage:3s}'
  },
  {
    name: "Crystal Hollows",
    locraw: "crystal_hollows",
    command: "warp ch",
    children: [
      {
        name: "Nucleus",
        command: "warp cn"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"a53266a8-8056-4533-9d17-e454c63a8e5a",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjFkYmUzMGIwMjdhY2JjZWI2MTI1NjNiZDg3N2NkN2ViYjcxOWVhNmVkMTM5OTAyN2RjZWU1OGJiOTA0OWQ0YSJ9fX0="}]},Name:"§a53266a8-8056-4533-9d17-e454c63a8e5a"},display:{Lore:[0:"§8/warp crystals",1:"",2:"§7A vast series of caves and random",3:"§7structures with tougher Stone and",4:"§7special gems!",5:"",6:"§7Main skill: §bMining",7:"§7Island tier: §eIV",8:"",9:"§7You have a free pass to the Crystal",10:"§7Hollows for helping §6Dulin§7!",11:"",12:"§8Right-Click to warp!",13:"§eLeft-Click to open!"],Name:"§aCrystal Hollows§7 - §bEntrance"}},Damage:3s}'
  },
  {
    name: "Spider's Den",
    locraw: "combat_1",
    command: "warp spider",
    children: [
      {
        name: "Top of Nest",
        command: "warp top"
      },
      {
        name: "Arachne",
        command: "warp arachne"
      }
    ],
    item: `{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"9feb0ce8-5734-4b05-8551-1d2359f05aa7",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzc1NDMxOGEzMzc2ZjQ3MGU0ODFkZmNkNmM4M2E1OWFhNjkwYWQ0YjRkZDc1NzdmZGFkMWMyZWYwOGQ4YWVlNiJ9fX0="}]},Name:"§9feb0ce8-5734-4b05-8551-1d2359f05aa7"},display:{Lore:[0:"§8/warp spider",1:"",2:"§7Explore a dangerous nest, discover",3:"§7the Bestiary, hunt for Relics, and fight",4:"§7all kinds of Spiders!",5:"",6:"§7Main skill: §bCombat",7:"§7Island tier: §eI",8:"",9:"§8Right-Click to warp!",10:"§eLeft-Click to open!"],Name:"§aSpider's Den§7 - §bSpawn"}},Damage:3s}`
  },
  {
    name: "The End",
    locraw: "combat_3",
    command: "warp end",
    children: [
      {
        name: "Nest",
        command: "warp drag"
      },
      {
        name: "Sepulture",
        command: "warp void"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"534ca757-c94c-423a-9766-4c4929476ed2",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzg0MGI4N2Q1MjI3MWQyYTc1NWRlZGM4Mjg3N2UwZWQzZGY2N2RjYzQyZWE0NzllYzE0NjE3NmIwMjc3OWE1In19fQ=="}]},Name:"§534ca757-c94c-423a-9766-4c4929476ed2"},display:{Lore:[0:"§8/warp end",1:"",2:"§7Fight Zealots, mine End Stone, and",3:"§7defeat ancient Dragons!",4:"",5:"§7Main skill: §bCombat",6:"§7Island tier: §eIII",7:"",8:"§8Right-Click to warp!",9:"§eLeft-Click to open!"],Name:"§aThe End§7 - §bSpawn"}},Damage:3s}'
  },
  {
    name: "Crimson Isle",
    locraw: "crimson_isle",
    command: "warp nether",
    children: [
      {
        name: "Gatekeeper",
        command: "warp kuudra"
      },
      {
        name: "Wasteland",
        command: "warp wasteland"
      },
      {
        name: "Dragontail",
        command: "warp dragontail"
      },
      {
        name: "Scarleton",
        command: "warp scarleton"
      },
      {
        name: "Tomb",
        command: "warp smold"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"f66bb1cd-868f-4502-9904-bac304716eef",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzM2ODdlMjVjNjMyYmNlOGFhNjFlMGQ2NGMyNGU2OTRjM2VlYTYyOWVhOTQ0ZjRjZjMwZGNmYjRmYmNlMDcxIn19fQ"}]},Name:"§f66bb1cd-868f-4502-9904-bac304716eef"},display:{Lore:[0:"§8/warp nether",1:"",2:"§7Fight challenging bosses, discover new",3:"§7Sea Creatures, complete epic quests,",4:"§7and join your favorite faction!",5:"",6:"§7Main skill: §bCombat",7:"§7Island tier: §eIV",8:"",9:"§8Right-Click to warp!",10:"§eLeft-Click to open!"],Name:"§aCrimson Isle§7 - §bSpawn"}},Damage:3s}'
  },
  {
    name: "Kuudra",
    locraw: "kuudra_hollow",
    command: "warp kuudra",
    children: [
      {
        name: "&7Basic",
        command: "joindungeon kuudra_normal"
      },
      {
        name: "&eHot",
        command: "joindungeon kuudra_hot"
      },
      {
        name: "&6Burning",
        command: "joindungeon kuudra_burning"
      },
      {
        name: "&cFiery",
        command: "joindungeon kuudra_fiery"
      },
      {
        name: "&4Infernal",
        command: "joindungeon kuudra_infernal"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{HideFlags:254,SkullOwner:{Id:\"3877a428-ace8-3faf-9992-4644fbd87f4c\",Properties:{textures:[0:{Value:\"ewogICJ0aW1lc3RhbXAiIDogMTY0MzY1MjkxMzA5NiwKICAicHJvZmlsZUlkIiA6ICJjNTlkMDFlMDI4MWI0MGNhOTczNjc5ODc4NmRmN2FmNiIsCiAgInByb2ZpbGVOYW1lIiA6ICJvWm9va3hQYXJjY2VyIiwKICAic2lnbmF0dXJlUmVxdWlyZWQiIDogdHJ1ZSwKICAidGV4dHVyZXMiIDogewogICAgIlNLSU4iIDogewogICAgICAidXJsIiA6ICJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzgyZWUyNTQxNGFhN2VmYjRhMmI0OTAxYzZlMzNlNWVhYTcwNWE2YWIyMTJlYmViZmQ2YTRkZTk4NDEyNWM3YTAiCiAgICB9CiAgfQp9\"}]}},display:{Lore:[0:\"§7§7Used to unlock the reward chest in\",1:\"§7the Infernal Tier of the Kuudra fight.\",2:\"\",3:\"§8§l* §8Co-op Soulbound §8§l*\",4:\"§6§lLEGENDARY\"],Name:\"§6Infernal Kuudra Key\"},ExtraAttributes:{id:\"KUUDRA_INFERNAL_TIER_KEY\"}},Damage:3s}'
  },
  {
    name: "The Garden",
    locraw: "garden",
    command: "warp garden",
    children: [
      {
        name: "Barn",
        command: "plottp barn"
      }
    ],
    item: '{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"75b36c83-7925-453c-9c40-aa00c0eecb61",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjQ4ODBkMmMxZTdiODZlODc1MjJlMjA4ODI2NTZmNDViYWZkNDJmOTQ5MzJiMmM1ZTBkNmVjYWE0OTBjYjRjIn19fQ=="}]},Name:"§75b36c83-7925-453c-9c40-aa00c0eecb61"},display:{Lore:[0:"§8/warp garden",1:"",2:"§7Spawn on your very own §aGarden§7.",3:"",4:"§eClick to warp!"],Name:"§aThe Garden"}},Damage:3s}'
  },
  {
    name: "Jerry's Workshop",
    locraw: "winter",
    command: "warp jerry",
    children: [],
    item: `{id:"minecraft:skull",Count:1b,tag:{SkullOwner:{Id:"e95e6c8e-4756-478f-85f5-9670ce7c8020",hypixelPopulated:1b,Properties:{textures:[0:{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmRkNjYzMTM2Y2FmYTExODA2ZmRiY2E2YjU5NmFmZDg1MTY2YjRlYzAyMTQyYzhkNWFjODk0MWQ4OWFiNyJ9fX0="}]},Name:"§e95e6c8e-4756-478f-85f5-9670ce7c8020"},display:{Lore:[0:"§7Teleports you to §cJerry's Workshop§7.",1:"§7Available for a limited time!",2:"",3:"§cIsland is closed until Winter!"],Name:"§bWarp to: §cJerry's Workshop"}},Damage:3s}`
  }
]

row1.forEach(island => {
  island.item = getItemFromNBT(island.item);
})
row2.forEach(island => {
  island.item = getItemFromNBT(island.item);
})

const squareWidth = 60;

row1.forEach((island, index) => {
  gui.addRectangle({
    color: Renderer.color(0, 0, 0, 200),
    x: Renderer.screen.getWidth()/2 - squareWidth*(row1.length/2)+index*squareWidth,
    y: Renderer.screen.getHeight()/2 - squareWidth,
    w: squareWidth,
    h: squareWidth,
    hover: (rect, mouseX, mouseY) => {
      rect.color = Renderer.color(0, 0, 255, 200);

      if (mouseY < rect.y*Renderer.screen.getHeight() + island.children.length*15) {
        let relativeY = (rect.y*Renderer.screen.getHeight() + island.children.length*15) - mouseY;
        let childIndex = Math.floor(relativeY/15);
        Renderer.drawRect(Renderer.WHITE, rect.x*Renderer.screen.getWidth(), rect.y*Renderer.screen.getHeight()+(island.children.length-1 - childIndex)*15, squareWidth, 15);
        new Tooltip([island.children[childIndex].name], mouseX, mouseY, 0, 0).draw();
      }
      else {
        new Tooltip([island.name], mouseX, mouseY, 0, 0).draw();
      }

      island.children.forEach((string, childIndex) => {
        let x = rect.x*Renderer.screen.getWidth();
        let y = rect.y*Renderer.screen.getHeight()+island.children.length*15;
        Renderer.drawString(string.name, x, y-15-15*childIndex+4, true);
      })

      rect.h = (squareWidth+island.children.length*15)/Renderer.screen.getHeight();
      rect.y = (Renderer.screen.getHeight()/2 - squareWidth - island.children.length*15)/Renderer.screen.getHeight();
      rect.x = (Renderer.screen.getWidth()/2 - squareWidth*(row1.length/2)+index*squareWidth)/Renderer.screen.getWidth();
      rect.w = (squareWidth)/Renderer.screen.getWidth();
    },
    unhover: (rect, mouseX, mouseY) => {
      rect.h = (squareWidth)/Renderer.screen.getHeight();
      rect.y = (Renderer.screen.getHeight()/2 - squareWidth)/Renderer.screen.getHeight();
      rect.x = (Renderer.screen.getWidth()/2 - squareWidth*(row1.length/2)+index*squareWidth)/Renderer.screen.getWidth();
      rect.w = (squareWidth)/Renderer.screen.getWidth();
      if (island.locraw == locraw.mode) {
        rect.color = Renderer.color(0, 255, 0, 200);
      }
      else {
        rect.color = Renderer.color(0, 0, 0, 200);
      }
    },
    click: (rect, mouseX, mouseY, button) => {
      if (button != 0) return;
      if (mouseY < rect.y*Renderer.screen.getHeight() + island.children.length*15) {
        let relativeY = (rect.y*Renderer.screen.getHeight() + island.children.length*15) - mouseY;
        let childIndex = Math.floor(relativeY/15);
        if (locraw.gametype != "SKYBLOCK") {
          gui.close();
          ChatLib.command("skyblock");
        }
        else {
          gui.close();
          ChatLib.command(island.children[childIndex].command);
        }
      }
      else {
        if (locraw.gametype != "SKYBLOCK") {
          gui.close();
          ChatLib.command("skyblock");
        }
        else {
          gui.close();
          ChatLib.command(island.command);
        }
      }
    }
  })

  gui.addItem({
    item: island.item,
    x: () => { return Renderer.screen.getWidth()/2 - squareWidth*(row1.length/2)+index*squareWidth },
    y: () => { return Renderer.screen.getHeight()/2 - squareWidth },
    scale: 4
  })
})

row2.forEach((island, index) => {
  gui.addRectangle({
    color: Renderer.color(0, 0, 0, 200),
    x: Renderer.screen.getWidth()/2 - squareWidth*(row2.length/2)+index*squareWidth,
    y: Renderer.screen.getHeight()/2,
    w: squareWidth,
    h: squareWidth,
    hover: (rect, mouseX, mouseY) => {
      rect.color = Renderer.color(0, 0, 255, 200);

      if (mouseY > rect.y*Renderer.screen.getHeight() + squareWidth) {
        let relativeY = mouseY - (rect.y*Renderer.screen.getHeight() + squareWidth);
        let childIndex = Math.floor(relativeY/15);
        Renderer.drawRect(Renderer.WHITE, rect.x*Renderer.screen.getWidth(), rect.y*Renderer.screen.getHeight()+squareWidth+childIndex*15, squareWidth, 15);
        new Tooltip([island.children[childIndex].name], mouseX, mouseY, 0, 0).draw();
      }
      else {
        new Tooltip([island.name], mouseX, mouseY, 0, 0).draw();
      }

      island.children.forEach((string, childIndex) => {
        let x = rect.x*Renderer.screen.getWidth();
        let y = rect.y*Renderer.screen.getHeight();
        Renderer.drawString(string.name, x, y+squareWidth+15*childIndex+4, true);
      })

      rect.h = (squareWidth+island.children.length*15)/Renderer.screen.getHeight();
      rect.y = (Renderer.screen.getHeight()/2)/Renderer.screen.getHeight();
      rect.x = (Renderer.screen.getWidth()/2 - squareWidth*(row2.length/2)+index*squareWidth)/Renderer.screen.getWidth();
      rect.w = (squareWidth)/Renderer.screen.getWidth();
    },
    unhover: (rect, mouseX, mouseY) => {
      rect.h = (squareWidth)/Renderer.screen.getHeight();
      rect.y = (Renderer.screen.getHeight()/2)/Renderer.screen.getHeight();
      rect.x = (Renderer.screen.getWidth()/2 - squareWidth*(row2.length/2)+index*squareWidth)/Renderer.screen.getWidth();
      rect.w = (squareWidth)/Renderer.screen.getWidth();
      if (island.locraw == locraw.mode) {
        rect.color = Renderer.color(0, 255, 0, 200);
      }
      else {
        rect.color = Renderer.color(0, 0, 0, 200);
      }
    },
    click: (rect, mouseX, mouseY, button) => {
      if (button != 0) return;
      if (mouseY > rect.y*Renderer.screen.getHeight() + squareWidth) {
        let relativeY = mouseY - (rect.y*Renderer.screen.getHeight() + squareWidth);
        let childIndex = Math.floor(relativeY/15);
        if (locraw.gametype != "SKYBLOCK") {
          gui.close();
          ChatLib.command("skyblock");
        }
        else {
          gui.close();
          ChatLib.command(island.children[childIndex].command);
        }
      }
      else {
        if (locraw.gametype != "SKYBLOCK") {
          gui.close();
          ChatLib.command("skyblock");
        }
        else {
          gui.close();
          ChatLib.command(island.command);

        }
      }
    }
  })

  gui.addItem({
    item: island.item,
    x: () => { return Renderer.screen.getWidth()/2 - squareWidth*(row2.length/2)+index*squareWidth },
    y: () => { return Renderer.screen.getHeight()/2 },
    scale: 4
  })
})

const openKeybind = new Keybind("Open Warp Menu", 48, "ChatItemMenu");

openKeybind.registerKeyDown(() => {
  gui.open();
})
