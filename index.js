const { Client, Intents, Interaction, MessageEmbed } = require('discord.js')
const { token } = require('./config.json')

const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ],
})

client.on('ready', () => {
    console.log('Le bot est en ligne !')

    const guildId = '895277055816650803'
    const guild = client.guilds.cache.get(guildId)

    let commands
    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }
    commands?.create({
        name: 'help',
        description: "Permet d'obtenir toutes les commandes du bot",
    })
})

const help = {
	color: 0xFF3455,
	title: 'Voici la liste des commandes',
	url: '',
	description: 'Toutes les commandes sont aussi utilisable en écrivant de le chat tb!`nomdelacommande`',
	fields: [
		{
			name: '**/kick** `pseudo`',
			value: 'Permet de kick un membre du discord façon permanente',
			inline: true,
		},
		{
			name: '**/tempkick** `pseudo` `temps`',
			value: 'Permet de kick un membre du discord de facon temporaire',
			inline: true,
		},
        {
			name: '**/ban** `pseudo`',
			value: 'Permet de bannir quelqu\'un du discord',
			inline: true,
		},
        {
			name: '**/tempban** `pseudo` `temps`',
			value: 'Permet de bannir de facon temporaire un membre du discord',
			inline: true,
		},
        {
			name: '**/mute** `pseudo`',
			value: 'Permet de mute quelqu\'un du discord',
			inline: true,
		},
        {
			name: '**/tempmute** `pseudo` `temps`',
			value: 'Permet de mute quelqu\'un de facon temporaire',
			inline: true,
		},
        {
			name: '**/play** `nom de la musique`',
			value: 'Permet de jouer de la musique',
			inline: true,
		},
        {
			name: '**/blindtest** `nombre de musique`',
			value: 'Permet de lancer un Blind-Test',
			inline: true,
		},
        {
			name: '**/pause**',
			value: 'Permet de mettre pause à la musique',
			inline: true,
		},
        {
			name: '**/replays**',
			value: 'Permet de rejouer la musique',
			inline: true,
		},
        {
			name: '**/startgame**',
			value: 'Permet de lancer le mini-jeu',
			inline: true,
		},
        {
			name: '**/joke**',
			value: 'Permet de lancer une blague',
			inline: true,
		},
        {
			name: '**/settings**',
			value: 'Permet d\'accéder au paramètres du Bot',
			inline: true,
		},
	],
	timestamp: new Date(),
	footer: {
		text: 'TheBot',
		icon_url: 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png',
	},
};

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()){
        return
    }

    const { commandName, options} = interaction

    if (commandName === 'help') {
        interaction.reply({embeds: [help]});
    }
})

client.on('messageCreate', (msg) => {
    if (msg.content === 'tb!help') {
        msg.channel.send({embeds: [help]});
    }
})

client.on('ready',() =>{
    client.user.setActivity('/help ou tb!help', { type: 'WATCHING' })
})

client.login(token)