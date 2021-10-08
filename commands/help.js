const Discord = require('discord.js')
 
module.exports = {
    run: message => {
        message.channel.send( new Discord.MessageEmbed()
            .setTitle('Liste des commandes')
            .setDescription('Voici la liste des commandes du bot vous pouvez également les consulter sur le [Site Internet](https://google.fr)')
            .setColor('#FF3455')
            .addField('tb!**help**', 'Cette commande permet de demander les commandes que propose le bot !', true)
            .addField('tb!**joke**', 'Cette commande permet de demander une blague au bot', true)
            .addField('tb!**kick** `pseudo`', 'Permet de kick un membre du discord', true)
            .addField('tb!**tempkick** `pseudo` `temps`', 'Permet de kick un membre du discord de facon temporaire', true)
            .addField('tb!**ban** `pseudo`', 'Permet de bannir quelqu\'un du discord', true)
            .addField('tb!**tempban** `pseudo` `temps`', 'Permet de bannir de facon temporaire un membre du discord', true)
            .addField('tb!**mute** `pseudo`', 'Permet de mute quelqu\'un du discord', true)
            .addField('tb!**tempmute** `pseudo`', 'Permet de mute quelqu\'un du discord', true)
            .addField('tb!**startgame**', 'Permet de lancer le mini-jeu inclut dans le bot', true)
            .addField('tb!**play** `musique`', 'Permet de faire jouer de la musique au bot', true)
            .addField('tb!**skip**', 'Permet de passer à la musique suivante', true)
            .addField('tb!**stop**', 'Permet de couper la musique du bot', true)
            .addField('tb!**queue**', 'Permet de connaitre la queue actuelle du bot discord', true)
            .addField('tb!**loop**', 'Permet de jouer en boucle la musique voulut', true)
            .addField('tb!**repeat**', 'Permet de rejouer la précedente musique', true)
            .addField('tb!`filtre`', 'Permet de mettre un filtre sur le bot pour profiter encore mieux de la musique', true)
            .addField('tb!**settings**', 'Permet d\'accéder aux paramètres du bot', true)
            .setFooter('TheBot ツ', 'https://cdn.discordapp.com/attachments/641713008414031912/895287107738816613/TheBot.png')
            .setTimestamp())
    },
    name: 'help'
}