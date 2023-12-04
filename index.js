// const fs = require('node:fs');
// const path = require('node:path');
const {Client, GatewayIntentBits} = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
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
})
gameBot.on("messageCreate", (message) => {
    if (message.content == "!Hi")
    {
        message.reply({content: `Hi too`, ephemeral: true});
    }
})

gameBot.on('messageCreate', async (message) => {
    // Check if the message is from a user and not the bot
    if (message.author.bot) return;
    // Check if the message starts with a specific command or trigger word
    if (message.content.startsWith('!help')) {
      msg = message.channel.send("There are the list of commands\n!button - command that allow to play quiz game\n!Hi  - command that sends greetings to the channel")
    }
  });
let activeGameSession = null
gameBot.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!button') && activeGameSession!=true) {
      activeGameSession = true
      // Create a button 
      //Working on this
      questionslist = questionslist.sort(() => Math.random()-0.5)
      console.log("randomize")
      console.log(questionslist)
      let maximalwinstreak = 0
      let winstreak = 0
      let globalIndex = 0
      let questionCounter = 0
      let correctAnswersCounter = 0
        let gameButtonRow = new ActionRowBuilder()
        Object.keys(questionslist[questionCounter].answers).forEach( (key, index) => {
          gameButtonRow.addComponents(
            new ButtonBuilder()
            .setCustomId('answer'+index+'Button') // This is a unique ID for your button
            .setLabel(key.toString()) // The text displayed on the button
            .setStyle(ButtonStyle.Primary) // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
          )
          if(questionslist[questionCounter].answers[key]) {
            globalIndex = index
          }
          })
          // gameButtonRow.addComponents(
          //   new ButtonBuilder()
          //   .setCustomId('exitButton')
          //   .setLabel('exit')
          //   .setStyle(ButtonStyle.Danger)
          // )
      let guessEmbed = new EmbedBuilder()
      .setTitle(`Mini-game guess the mention\n${questionCounter+1}/${questionslist.length}`)
      .setColor("Blue")
      .setDescription(`${questionslist[questionCounter].Question}`)

      // const correctEmbed = new EmbedBuilder()
      // .setColor("Red")
      // .setDescription("You are right") 

      const leaveEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Goodbye")
      var msgEmbed = await message.channel.send({embeds:[guessEmbed], components:[gameButtonRow]})
      gameBot.on('interactionCreate', interaction => {
        if(!interaction.isButton()) return
          // if (interaction.customId === 'exitButton')
          // {
          //   maximalwinstreak = 0
          //   winstreak = 0
          //   globalIndex = 0
          //   questionCounter = 0
          //   correctAnswersCounter = 0
          //   interaction.update({
          //     content: "",
          //     embeds: [leaveEmbed],
          //     components: []
          //   })
          // }
          else if (interaction.customId === 'answer'+globalIndex+'Button') {
            winstreak++
            if (maximalwinstreak < winstreak) {
              maximalwinstreak = winstreak
            }
            // console.log(winstreak)
            correctAnswersCounter++
            questionCounter++
            if(questionCounter < questionslist.length) {
              let guessEmbed = new EmbedBuilder()
            .setTitle(`Mini-game guess the mention\n${questionCounter+1}/${questionslist.length}`)
            .setColor("Blue")
            .setDescription(`${questionslist[questionCounter].Question}`)
            let gameButtonRow = new ActionRowBuilder()
            Object.keys(questionslist[questionCounter].answers).forEach( (key, index) => {
            gameButtonRow.addComponents(
            new ButtonBuilder()
            .setCustomId('answer'+index+'Button') // This is a unique ID for your button
            .setLabel(key.toString()) // The text displayed on the button
            .setStyle(ButtonStyle.Primary) // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
            )

            if(questionslist[questionCounter].answers[key]==true) {
              globalIndex = index
            }
            })
            // gameButtonRow.addComponents(
            //   new ButtonBuilder()
            //   .setCustomId('exitButton')
            //   .setLabel('exit')
            //   .setStyle(ButtonStyle.Danger),
            // )
            
            interaction.update({embeds: [guessEmbed], components: [gameButtonRow]})
            } else if (questionCounter == questionslist.length) {
              let winEmbed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(`Here you are!\nYou've got the end of this game!\nCount of correct answers is ${correctAnswersCounter} of ${questionslist.length} and your better winstreak is ${maximalwinstreak}\nIf you want to try again you can type !button`)
              interaction.update({embeds: [winEmbed], components: []})
              activeGameSession = null
            }
            
        } else if (interaction.customId !== 'answer'+globalIndex+'Button') {
          questionCounter++
          if (maximalwinstreak < winstreak) {
            maximalwinstreak = winstreak
          }
          winstreak = 0
          // console.log(winstreak)
          if(questionCounter<questionslist.length) {
            let guessEmbed = new EmbedBuilder()
            .setTitle(`Mini-game guess the mention\n${questionCounter+1}/${questionslist.length}`)
            .setColor("Blue")
            .setDescription(`${questionslist[questionCounter].Question}`)
            let gameButtonRow = new ActionRowBuilder()
            Object.keys(questionslist[questionCounter].answers).forEach( (key, index) => {
            gameButtonRow.addComponents(
            new ButtonBuilder()
            .setCustomId('answer'+index+'Button') // This is a unique ID for your button
            .setLabel(key.toString()) // The text displayed on the button
            .setStyle(ButtonStyle.Primary) // Button style (PRIMARY, SECONDARY, SUCCESS, DANGER, LINK)
            )

            if(questionslist[questionCounter].answers[key]==true) {
              globalIndex = index
            }
            })
            // gameButtonRow.addComponents(
            //   new ButtonBuilder()
            //   .setCustomId('exitButton')
            //   .setLabel('exit')
            //   .setStyle(ButtonStyle.Danger),
            // )
          interaction.update({
            embeds:[guessEmbed],
            components:[gameButtonRow]
          })
          } else if(questionCounter == questionslist.length){
            let winEmbed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(`Here you are!\nYou've got the end of this game!\nCount of correct answers is ${correctAnswersCounter} of ${questionslist.length} and your better winstreak is ${maximalwinstreak}\nIf you want to try again you can type !button`)
              interaction.update({
                embeds:[winEmbed],
                components:[]
              })
              correctAnswersCounter = 0
              activeGameSession = null
        }
      }
      });
      return
      }
    })