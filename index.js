const http = require("http");
http
  .createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Bot is active \n");
  })
  .listen(3000);

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: Object.values(
    Discord.GatewayIntentBits,
    Discord.Guilds,
    Discord.GuildMembers,
    Discord.MessageContent
  ),
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("model α");
});

client.on("ready", async () => {
  const data = [
    {
      name: "help",
      description: "ヘルプを表示します。",
    },
    {
      name: "invite",
      description: "招待リンクを表示します。",
    },
    {
      name: "ping",
      description: "pingを計測します。",
    },
  ];
  await client.application.commands.set(data);
  console.log("ok!");
});

client.on("interactionCreate", async (Interaction) => {
  if (!Interaction.isCommand()) {
    return;
  }
  if (Interaction.commandName === "help") {
    const { EmbedBuilder } = require("discord.js");
    const exampleEmbed = new EmbedBuilder()
      .setColor(0xfef8bf)
      .setTitle("ヘルプ")
      .setImage()
      .setDescription(
        "ヘルプを書いてね！"
      )
      .setTimestamp();
    await Interaction.reply({ embeds: [exampleEmbed] });
  }
  if (Interaction.commandName === "invite") {
    const { EmbedBuilder } = require("discord.js");
    const exampleEmbed = new EmbedBuilder()
      .setColor(0xfef8bf)
      .setTitle("招待リンク")
      .setDescription(
        "招待リンクを書いてね！"
      )
      .setTimestamp();
    await Interaction.reply({ embeds: [exampleEmbed] });
  }
  if (Interaction.commandName === "ping") {
    await Interaction.reply(`ping ${client.ws.ping}ms`);
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.includes("ハロー")) {
    message.channel.send(
      "ハロー！"
    );
  }
});

const channelId = "1221965124542140426";
const roleId = "1221966545119477890";
const specialRoleId = "1221997163970560100";
let tofuHP = 10000;

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "べーたスタート" && message.channel.id === channelId) {
    message.channel.send("べーた豆腐討伐開始！残りHP10000");
  }

  if (message.content.includes("べーた豆腐討伐") && message.channel.id === channelId) {
    let damage = 1;
    if (message.member.roles.cache.has(roleId)) {
      damage = 5;
    } else if (message.member.roles.cache.has(specialRoleId)) {
      damage = 10;
    }

    tofuHP -= damage;
    message.channel.send(`べーた豆腐に攻撃！残りHPは${tofuHP}よ`);

    if (tofuHP <= 0) {
      message.channel.send("べーた豆腐を倒した！今夜は豆腐鍋よ");
      tofuHP = 10000; // HPをリセット
    }
  }
});
const messageCountThreshold = 100;

client.on("messageCreate", async (message) => {
  if (message.channel.id === channelId) {
    const channelMessages = await message.channel.messages.fetch({ limit: 100 });
    const userMessageCount = channelMessages.filter(msg => msg.author.id === message.author.id).size;
    
    if (userMessageCount >= messageCountThreshold) {
      const member = message.guild.members.cache.get(message.author.id);
      if (member) {
        member.roles.add(roleId)
          .then(() => console.log(`Added role to ${message.author.username}`))
          .catch(error => console.error(`Error adding role: ${error}`));
      }
    }
  }
});

const roleIdToAdd = "1221997163970560100";
const roleIdToRemove = "1221966545119477890";
const messageCountThreshold2 =1000;

client.on("messageCreate", async (message) => {
  if (message.channel.id === channelId) {
    const channelMessages = await message.channel.messages.fetch({ limit: 100 });
    const userMessageCount = channelMessages.filter(msg => msg.author.id === message.author.id).size;
    
    if (userMessageCount >= messageCountThreshold2) {
      const member = message.guild.members.cache.get(message.author.id);
      if (member) {
        member.roles.add(roleIdToAdd)
          .then(() => {
            console.log(`Added role to ${message.author.username}`);
            // ロールを剥奪する
            if (member.roles.cache.has(roleIdToRemove)) {
              member.roles.remove(roleIdToRemove)
                .then(() => console.log(`Removed role from ${message.author.username}`))
                .catch(error => console.error(`Error removing role: ${error}`));
            }
          })
          .catch(error => console.error(`Error adding role: ${error}`));
      }
    }
  }
});

client.login(process.env.TOKEN);
