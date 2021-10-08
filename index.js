const Discord = require('discord.js'),
    DisTube = require('distube'),
    client = new Discord.Client({
        fetchAllMembers: true
    }),
    config = require('./config.json'),
    fs = require('fs')
 
client.login(config.token)
client.commands = new Discord.Collection()
 
const { Client } = require("discord-slash-commands-client")

const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });

const disbut = require('discord-buttons');
disbut(client);

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})
 
client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
 
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(message, args, client)
})

// Joueur qui join le discord

//client.on('guildMemberAdd', member => {
//    member.guild.channels.cache.get(config.greeting.channel).send( new Discord.MessageEmbed()
//        .setDescription(`${member} a rejoint le serveur. Nous sommes désormais ${member.guild.memberCount} ! 👋🏻`)
//        .setImage('https://cdn.discordapp.com/attachments/634711892765573130/756186013910695966/welcome.png')
//        .setColor('#FF3455'))
//    member.roles.add(config.greeting.role)
//})

// Joueur qui quitte le discord

//client.on('guildMemberRemove', member => {
//    member.guild.channels.cache.get(config.greeting.channel).send(new Discord.MessageEmbed()
//        .setDescription(`${member.user.tag} a quitté le serveur... 😢`)
//        .setColor('#FF3455'))
//})

// Partie BOT Musique

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == "play" || command == "p")
        distube.play(message, args.join(" "));

    if (["repeat", "loop"].includes(command)|| command == "repeat")
        distube.setRepeatMode(message, parseInt(args[0]));

    if (command == "stop") {
        distube.stop(message);
        message.channel.send("La musique a été stopper!");
    }

    if (command == "skip")
        distube.skip(message);

    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send( new Discord.MessageEmbed()
            .setTitle('Voici la file d\'attente actuelle')
            .setDescription('⌛️ - Queue actuelle:\n' + queue.songs.map((song, id) => `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).slice(0, 10).join("\n"))
            .setColor('#FF3455')
            .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
            .setTimestamp())
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send( new Discord.MessageEmbed()
            .setTitle("Application d\'un nouveau filtre")
            .setDescription("🔊 - Filtre appliqué: `" + (filter || "Off") + "`")
            .setColor('#FF3455')
            .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
            .setTimestamp());
    }
});

// Status de la queue

const status = (queue) => `Volume: \`${queue.volume}%\` | Filtre: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// DisTub events

const btnvolumedown = new disbut.MessageButton()
    .setStyle("gray")
    .setLabel("🔉")
    .setID("volumedown")

const btnrepeat = new disbut.MessageButton()
    .setStyle("gray")
    .setLabel("⏪")
    .setID("btnrepeat")

const btnstop = new disbut.MessageButton()
    .setStyle("gray")
    .setLabel("⏸")
    .setID("btnstop")

const btnskip = new disbut.MessageButton()
    .setStyle("gray")
    .setLabel("⏭")
    .setID("btnskip")

const btnvolumeup = new disbut.MessageButton()
    .setStyle("gray")
    .setLabel("🔊")
    .setID("volumeup")

// DisTube events

distube
    .on("playSong", (message, queue, song) => message.channel.send( new Discord.MessageEmbed()
        .setTitle('Le bot joue actuellement une nouvelle musique')
        .setDescription(`📀 - Joue actuellement: \`${song.name}\` - \`${song.formattedDuration}\`\n💬 - La musique a été demandé par: ${song.user}\n⚙️ - ${status(queue)}`)
        .setColor('#FF3455')
        .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
        .setTimestamp(), {buttons:[btnvolumedown, btnrepeat, btnstop, btnskip, btnvolumeup],}
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        new Discord.MessageEmbed()
        .setTitle('Nouvelle musique ajouter à la queue')
        .setDescription(`⌛️ - Ajout de ${song.name} - \`${song.formattedDuration}\` à la queue \n💬 - La musique a été demandé par: ${song.user}`)
        .setColor('#FF3455')
        .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
        .setTimestamp(), {buttons:[btnstop, btnskip],}
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send( new Discord.MessageEmbed()
        .setTitle('Le bot joue actuellement une nouvelle playlist')
        .setDescription(`📋 - Joue actuellement la playlist \`${playlist.name}\` qui contient (${playlist.songs.length} musiques).\n💬 - Demandé par: ${song.user}\n📀 -Joue actuellement \`${song.name}\` - \`${song.formattedDuration}\`\n⚙️ - ${status(queue)}`)
        .setColor('#FF3455')
        .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
        .setTimestamp(), {buttons:[btnvolumedown, btnrepeat, btnstop, btnskip, btnvolumeup],}
    ))
    .on("addList", (message, queue, playlist) => message.channel.send( new Discord.MessageEmbed()
        .setTitle('Le bot joue actuellement une nouvelle musique')
        .setDescription(`⌛️ - Ajout de la playlist \`${playlist.name}\` qui contient (${playlist.songs.length} musiques) a la queue\n⚙️ - ${status(queue)}`)
        .setColor('#FF3455')
        .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
        .setTimestamp(), {buttons:[btnstop, btnskip],}
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send( new Discord.MessageEmbed()
            .setTitle('Choisissez une options ci-dessous')
            .setDescription(`\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Entrez autre chose ou attendez 60 secondes pour annuler*`)
            .setColor('#FF3455')
            .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
            .setTimestamp()
        )
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`La recherche a été annulé !`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("Une erreur est survenue, je suis désolé ! Code erreur: " + e);
    });

    // Activity BOT
    client.on('ready',() =>{
        client.user.setActivity('/help ou tb!help', { type: 'WATCHING' })
    })

client.on("clickButton", async (button) => {
    if(button.id === "volumedown"){
        button.channel.send( new Discord.MessageEmbed()
        .setTitle('Vous avez choisit de réduire le volume')
        .setDescription(`🔉 - Volume actuel: \`-10%\``)
        .setColor('#FF3455')
        .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
        .setTimestamp()
    )
    }

    if(button.id === "volumeup"){
        button.channel.send( new Discord.MessageEmbed()
        .setTitle('Vous avez choisit d\'augmenter le volume')
        .setDescription(`🔊 - Volume actuel: \`+10%\``)
        .setColor('#FF3455')
        .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
        .setTimestamp()
    )
    }

    if(button.id === "btnstop"){ 
        distube.stop(button);
    }

    if(button.id === "btnskip"){ 
        distube.skip(button);
    }

    if (button.if === "btnrepeat"){
        distube.setRepeatMode(button, parseInt(args[0]));
    }
})