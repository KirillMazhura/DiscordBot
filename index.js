// const fs = require('node:fs');
// const path = require('node:path');
const {Client, GatewayIntentBits, Collection, Events, Embed, InteractionCollector} = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder} = require('discord.js');
require('dotenv').config()
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/questionsdb")
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Помилка з'єднання з базою даних:"));
db.once("open", () => {
  console.log("З'єднання з базою даних встановлено");
});

const QuestionModel = mongoose.model("questions", {
  "Question": String,
  "answers": Object
})
let questionCounter = 0
let questionslist = []

const gameBot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

gameBot.login(process.env.botToken)

gameBot.once("ready", async() => {
    console.log("bot started")
    questionslist = await QuestionModel.find()
    console.log(questionslist)
    questionslist = questionslist.sort(() => Math.random()-0.5)
    console.log("randomize")
    console.log(questionslist)
    // console.log(questionslist.length)
})
// gameBot.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	const command = gameBot.commands.get(interaction.commandName);

// 	if (!command) return;

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 		} else {
// 			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 		}
// 	}
// });
gameBot.on("messageCreate", (message) => {
    if (message.content == "Hi")
    {
        message.reply({content: `${questionslist[questionCounter].Question}`});
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
gameBot.on('messageCreate', async (message, interaction) => {
    if (message.author.bot) return;
  
    if (message.content.startsWith('!button')) {
      // Create a button 
      //Working on this
      let winstreak = 0
        const gameButtonRow = new ActionRowBuilder()
        gameButtonRow.addComponents(
        Object.keys(questionslist[0].answers).forEach( key => {
        console.log('here '+ key)
        new ButtonBuilder()
        .setCustomId('answer1Button') // This is a unique ID for your button
        .setLabel('key.toString()') // The text displayed on the button
        .setStyle(ButtonStyle.Danger) // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
        }))
        // new ButtonBuilder()
        // .setCustomId('answer2Button')
        // .setLabel('answer2')
        // .setStyle(ButtonStyle.Primary),
        // new ButtonBuilder()
        // .setCustomId('answer3Button')
        // .setLabel('answer3')
        // .setStyle(ButtonStyle.Primary),
        // new ButtonBuilder()
        // .setCustomId('answer4Button')
        // .setLabel('answer4')
        // .setStyle(ButtonStyle.Primary),
        // new ButtonBuilder()
        // .setCustomId('exitButton')
        // .setLabel('exit')
        // .setStyle(ButtonStyle.Danger)
      // )
      // const tryAgainRow = new ActionRowBuilder()
      // .addComponents(
      //   new ButtonBuilder()
      //   .setCustomId('tryAgain') // This is a unique ID for your button
      //   .setLabel('Try again') // The text displayed on the button
      //   .setStyle(ButtonStyle.Danger), // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
      //   new ButtonBuilder()
      //   .setCustomId('exit')
      //   .setLabel('Exit')
      //   .setStyle(ButtonStyle.Danger)
      // )
      const guessEmbed = new EmbedBuilder()
      .setTitle('Mini-game guess the mention')
      .setColor("Blue")
      .setDescription(`${questionslist[questionCounter].Question}`)

      // const correctEmbed = new EmbedBuilder()
      // .setColor("Red")
      // .setDescription("You are right") 

      // const wrongEmbed = new EmbedBuilder()
      // .setColor("Red")
      // .setDescription("Try again")
      // const leaveEmbed = new EmbedBuilder()
      // .setColor("Red")
      // .setDescription("Goodbye")
      // // const continueButton = new 
      var msgEmbed = await message.channel.send({embeds:[guessEmbed], components:[gameButtonRow]})
      // const collector = message.channel.createMessageComponentCollector();
      // collector.on('collect', async (interaction) => {
      //     if (interaction.customId === 'exitButton')
      //     {
      //       // msgEmbed.edit({embeds:[leaveEmbed], components:[]})
      //       interaction.update({embeds:[leaveEmbed], components:[gameButtonRow]})
      //     }
      //     else if (interaction.customId === 'answer1Button' )
      //       winstreak++
      //       msgEmbed.edit({embeds: [correctEmbed], components:[]});
      //       const m = message.author;
      //       m.send("Current winstreak: "+winstreak.toString());
      // });
      // const collector = message.channel.createMessageComponentCollector();
      // collector.on('collect', async (interaction) => {
      //   if (interaction.customId === 'button2')
      //   {
      //     winstreak++
      //      // Send a message
      //     // After a delay (e.g., 5 seconds), edit the message
      //     setTimeout(async () => {
      //       await msgEmbed.edit({embeds: [embed2], components:[]});
      //       const m = message.author;
      //       m.send("Current winstreak: "+winstreak.toString());
      //     },
      //     1000); // Edit the message after 1 seconds
      //   }
      //   else if (interaction.customId === 'button1')
      //   {
      //     const m = message.author;
      //     winstreak = 0
      //     m.send("Current winstreak: "+winstreak.toString());
      //     setTimeout(async () => {
      //       await msgEmbed.edit({embeds: [embed3], components:[tryAgainRow]});
      //       const m = message.author;
      //       m.send("Current winstreak: "+winstreak.toString());
      //     },
      //     1000);
      //   }
      // })
      }
    })