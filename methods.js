const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

function createButtonPrimary(buttonId, buttonLabel) {
    const buttonName = new ButtonBuilder()
    .setCustomId(`${buttonId}`)
    .setLabel(`${buttonLabel}`)
    .setStyle(ButtonStyle.Primary)
}