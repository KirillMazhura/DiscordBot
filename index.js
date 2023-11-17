const {Client, GatewayIntentBits} = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
require('dotenv').config()
// const routes = require("./api/routes/questionRoutes")

const gameBot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
// console.log(`${process.env.botToken}`)
gameBot.login(process.env.botToken)

gameBot.once("ready", () => {
    console.log("bot started")
})
gameBot.on("messageCreate", (message) => {
    if (message.content == "Hi")
    {
        message.reply({content: "Hi too", ephemeral: true});
    }
})

gameBot.on("messageCreate", (message) => {
    if (message.content == "/p")
    {
        message.reply("confirmed")
    }
})

gameBot.on('messageCreate', async (message) => {
    // Check if the message is from a user and not the bot
    if (message.author.bot) return;
  
    // Check if the message starts with a specific command or trigger word
    if (message.content.startsWith('!wait')) {
      // Send a message to the user
      message.channel.send('Please respond within the next 10 seconds.');
  
      // Define a filter to listen for responses only from the same user
      const filter = (response) => response.author.id === message.author.id;
  
      try {
        // Wait for a response from the same user within a 10-second window
        const response = await message.channel.awaitMessages({
          max: 1,
          time: 10000, // Time in milliseconds (10 seconds in this case)
          errors: ['time'],
          filter,
        });
  
        // If a response is received, log it
        message.reply({content: response.first().content, ephemeral: true});
        console.log(`User's response: ${response.first().content}`);
      } catch (error) {
        // If no response is received within the timeout, log an error
        console.error('No response received within the timeout.');
      }
    }
  });
gameBot.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    if (message.content.startsWith('!button')) {
      // Create a button 
      //Working on this
      let winstreak = 0
      const gameButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('button1') // This is a unique ID for your button
        .setLabel('Click Me') // The text displayed on the button
        .setStyle(ButtonStyle.Danger), // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
        new ButtonBuilder()
        .setCustomId('button2')
        .setLabel('Click2')
        .setStyle(ButtonStyle.Primary)
      )
      const tryAgainRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('tryAgain') // This is a unique ID for your button
        .setLabel('Try again') // The text displayed on the button
        .setStyle(ButtonStyle.Danger), // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
        new ButtonBuilder()
        .setCustomId('exit')
        .setLabel('Exit')
        .setStyle(ButtonStyle.Danger)
      )
      const embed = new EmbedBuilder()
      .setTitle('Mini-game guess the mention')
      .setColor("Blue")
      .setDescription(":slight_smile: "+":arrow_right: "+":angry: "+":heavy_plus_sign: "+":green_circle:")

      const embed2 = new EmbedBuilder()
      .setColor("Red")
      .setDescription("You are right") 

      const embed3 = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Try again") 
      const msgEmbed = await message.channel.send({embeds:[embed], components:[gameButton]})
      const collector = message.channel.createMessageComponentCollector();

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'button2')
        {
          winstreak++
           // Send a message
          // After a delay (e.g., 5 seconds), edit the message
          setTimeout(async () => {
            await msgEmbed.edit({embeds: [embed2], components:[]});
            const m = message.author;
            m.send("Current winstreak: "+winstreak.toString());
          },
          1000); // Edit the message after 1 seconds
        }
        else if (interaction.customId === 'button1')
        {
          const m = message.author;
          winstreak = 0
          m.send("Current winstreak: "+winstreak.toString());
          setTimeout(async () => {
            await msgEmbed.edit({embeds: [embed3], components:[tryAgainRow]});
            const m = message.author;
            m.send("Current winstreak: "+winstreak.toString());
          },
          1000);
        }
      })
    }
  });
  gameBot.on("messageCreate", (message) => {
    if (message.content == "loq")
    {
        message.reply(app)
    }
})