const {Client, GatewayIntentBits} = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const gameBot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

const BOT_TOKEN=""
gameBot.login(BOT_TOKEN)

gameBot.once("ready", () => {
    console.log("bot started")
})
gameBot.on("messageCreate", (message) => {
    if (message.content == "Hi")
    {
        msg = message.reply({content: "Hi too", ephemeral: true});
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
        message.reply({content: '${response.first().content}', ephemeral: true});
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
      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('buttonOne') // This is a unique ID for your button
        .setLabel('Click Me') // The text displayed on the button
        .setStyle(ButtonStyle.Primary), // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
      )
      const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription("Button for test")

      const embed2 = new EmbedBuilder()
      .setColor("Red")
      .setDescription("button was pressed") 

      message.channel.send({embeds:[embed], components:[button]})
      const collector = message.channel.createMessageComponentCollector();
      collector.on('collect', async i => {
        await i.update({ embeds: [embed2], components: [button]})
      })
    }
  });
