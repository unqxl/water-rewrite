import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  EmbedBuilder,
} from "discord.js";

const row = new ActionRowBuilder<ButtonBuilder>();

const previousButton = new ButtonBuilder();
previousButton.setStyle(ButtonStyle.Secondary);
previousButton.setCustomId("previous");
previousButton.setLabel("➡");

const nextButton = new ButtonBuilder();
nextButton.setStyle(ButtonStyle.Secondary);
nextButton.setCustomId("next");
nextButton.setLabel("➡");

const deleteButton = new ButtonBuilder();
nextButton.setStyle(ButtonStyle.Danger);
nextButton.setCustomId("delete");
nextButton.setLabel("🗑");

row.addComponents(previousButton, nextButton, deleteButton);

export async function create(
  command: ChatInputCommandInteraction | ContextMenuCommandInteraction,
  arr: any[],
  embed: EmbedBuilder
) {
  let i = 0;
  let i1 = 10;
  let page = 1;

  const data = arr.slice(i, i1).join("\n");

  embed.setDescription(data);
  embed.setFooter({
    text: `Page ${page} of ${Math.ceil(arr.length / 10)}`,
  });

  if (command.deferred) {
    await command.deferReply();
  }

  const current = await command.editReply({
    embeds: [embed],
    components: [row],
  });

  const collector = current.createMessageComponentCollector({
    filter: (i) => {
      const { customId } = i;
      const check =
        customId === "previous" || customId === "next" || customId === "delete";

      return check && i.user.id === command.user.id;
    },
    time: 60000,
  });

  collector.on("collect", async (interaction) => {
    if (!interaction.isButton()) return;

    switch (interaction.customId) {
      case "previous": {
        i -= 10;
        i1 -= 10;
        page--;

        if (i < 0) {
          i = 0;
          i1 = 10;
          page = 1;
        }

        const data = arr.slice(i, i1).join("\n");

        embed.setDescription(data);
        embed.setFooter({
          text: `Page ${page} of ${Math.ceil(arr.length / 10)}`,
        });

        await interaction.update({
          embeds: [embed],
          components: [row],
        });

        collector.resetTimer();

        break;
      }

      case "next": {
        i += 10;
        i1 += 10;
        page++;

        if (i1 > arr.length) {
          i = arr.length - 10;
          i1 = arr.length;
          page = Math.ceil(arr.length / 10);
        }

        const data = arr.slice(i, i1).join("\n");

        embed.setDescription(data);
        embed.setFooter({
          text: `Page ${page} of ${Math.ceil(arr.length / 10)}`,
        });

        await interaction.update({
          embeds: [embed],
          components: [row],
        });

        collector.resetTimer();

        break;
      }

      case "delete": {
        await interaction.deleteReply();
        break;
      }
    }
  });

  collector.on("end", async (collected, reason) => {
    if (reason === "time") {
      await current.delete();
    }
  });

  return true;
}
