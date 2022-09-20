import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { getCommitHash } from "@src/scripts/getCommitHash";
import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  time,
  version,
} from "discord.js";
import { TFunction } from "i18next";
import { get } from "systeminformation";
import Bot = require("@lib/classes/Bot");

export = class DevPanelCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "owner",
      name: "panel",
      description: "Panel that shows bot's hosting statistics.",
      descriptionLocalizations: {
        ru: "Панель, которая показывает статистику хостинга бота.",
      },

      ownerOnly: true,
    });
  }

  async run(
    command: ChatInputCommandInteraction,
    config: GuildData,
    t: TFunction
  ) {
    await command.reply({ content: "..." });

    return await get(
      {
        time: "uptime",
        cpu: "manufacturer, brand, speed, cores, physicalCores",
        mem: "total, used",
        osInfo: "platform, arch",
      },
      async (data) => {
        const commitHash = await getCommitHash();

        const serverUptime = {
          days: Math.floor(data.time.uptime / 86400),
          hours: Math.floor((data.time.uptime % 86400) / 3600),
          minutes: Math.floor((data.time.uptime % 3600) / 60),
          seconds: Math.floor(data.time.uptime % 60),
        };

        const cpuManufacturer = data.cpu.manufacturer;
        const cpuBrand = data.cpu.brand;
        const cpuSpeed = data.cpu.speed;
        const cpuCores = data.cpu.cores;
        const cpuPhysicalCores = data.cpu.physicalCores;

        const [memTotal, memUsed] = [
          this.formatBytes(data.mem.total),
          this.formatBytes(data.mem.used),
        ];

        const osPlatform = data.osInfo.platform;
        const osArch = data.osInfo.arch;

        const fields = {
          stats: t("owner.fields:hosting_stats"),
          server_uptime: t("owner.fields:server_uptime"),
          started_at: t("owner.fields:started_at"),
          versions: t("owner.fields:versions"),
          memory: t("owner.fields:memory"),
          platform: t("owner.fields:platform"),
        };

        const units = {
          days: t("owner.time_units:days"),
          day: t("owner.time_units:day"),

          hours: t("owner.time_units:hours"),
          hour: t("owner.time_units:hour"),

          minutes: t("owner.time_units:minutes"),
          minute: t("owner.time_units:minute"),

          seconds: t("owner.time_units:seconds"),
          second: t("owner.time_units:second"),
        };

        const embed = new EmbedBuilder();
        embed.setColor("Blurple");
        embed.setTitle(fields.stats);
        embed.setAuthor(this.getEmbedAuthor(command));
        embed.addFields(
          {
            name: `› ${fields.server_uptime}`,
            value: [
              `» **${serverUptime.days} ${
                serverUptime.days > 1 ? units.days : units.day
              }**`,
              `» **${serverUptime.hours} ${
                serverUptime.hours > 1 ? units.hours : units.hour
              }**`,
              `» **${serverUptime.minutes} ${
                serverUptime.minutes > 1 ? units.minutes : units.minute
              }**`,
              `» **${serverUptime.seconds} ${
                serverUptime.minutes > 1 ? units.seconds : units.second
              }**`,
            ].join("\n"),
            inline: true,
          },
          {
            name: `› ${fields.started_at}`,
            value: bold(time(this.client.readyAt)),
            inline: true,
          },
          {
            name: `› ${fields.versions}`,
            value: [
              `» **Discord.JS: ${version}**`,
              `» **NodeJS: ${process.version}**`,
            ].join("\n"),
            inline: true,
          },
          {
            name: `› CPU`,
            value:
              "» " + cpuManufacturer
                ? `**${cpuManufacturer} ${cpuBrand}, ${cpuSpeed} GHz | ${cpuCores} Cores, ${cpuPhysicalCores} Trades**`
                : "",
            inline: true,
          },
          {
            name: `› ${fields.memory}`,
            value: [`» **Total: ${memTotal}**`, `» **Used: ${memUsed}**`].join(
              "\n"
            ),
            inline: true,
          },
          {
            name: `› ${fields.platform}`,
            value: "» " + (osPlatform ? `**${osPlatform} ${osArch}**` : ""),
            inline: true,
          },
          {
            name: "› GitHub Commit Hash",
            value: bold(commitHash),
          }
        );

        const restartButton = new ButtonBuilder();
        restartButton.setCustomId("restart_bot");
        restartButton.setStyle(ButtonStyle.Secondary);
        restartButton.setEmoji("🔁");
        restartButton.setLabel("Restart Bot");

        const deleteButton = new ButtonBuilder();
        deleteButton.setCustomId("delete");
        deleteButton.setStyle(ButtonStyle.Secondary);
        deleteButton.setEmoji("❌");

        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(restartButton, deleteButton);

        const msg = await command.fetchReply();
        const new_msg = await msg.edit({
          content: null,
          embeds: [embed],
          components: [row],
        });

        const collector = new_msg.createMessageComponentCollector({
          time: 60000 * 10,
          max: 1,
          filter: ({ user }) => user.id === command.user.id,
        });

        collector.on("collect", async (btn) => {
          if (!btn.isButton()) return;

          if (btn.customId === "restart_bot") {
            await new_msg.edit({
              components: [],
            });

            process.exit();
          } else if (btn.customId === "delete") {
            await new_msg.delete();
            return;
          }
        });

        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            new_msg.edit({
              components: [],
            });

            return;
          }
        });
      }
    );
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes == 0) return "0 Bytes";

    var k = 1024;
    var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    );
  }
};
