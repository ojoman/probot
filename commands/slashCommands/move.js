const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const c2j = require("csvtojson");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Get move info')
        .addStringOption(option => option.setName('move').setDescription('The move to get info on').setRequired(true)),
	async execute(interaction) {
        const move = interaction.options.getString('move');
		const moveData = await c2j({
			noheader:true
		}).fromFile('./moves.csv');
		var fuse = require('fuse.js');	
		const searcher = new fuse(moveData, {
			useExtendedSearch: true,
			keys: ['field1']
		});
		try {
			var moveInfo = searcher.search(move)[0]['item'];
		} catch (error) {
			return await interaction.reply(`No move found for ${move}`);
		} 	
		const moveEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(moveInfo.field1)
			.setDescription(`Dex: ${moveInfo.field1}`)
			.addFields(
				{ name: 'Type', value: moveInfo.field2, inline: true},
				{ name: 'Class', value: moveInfo.field3, inline: true},
			)
			.addFields(
				{ name: 'Power', value: moveInfo.field4, inline: true },
				{ name: 'Accuracy', value: moveInfo.field5, inline: true },
				{ name: 'PP', value: moveInfo.field6, inline: true },
			)
			.addFields(
				{ name: 'Desc', value: moveInfo.field7, inline: false},
			)
			.setTimestamp()
			.setFooter({ text: 'luv u'});
		
		await interaction.reply({ embeds: [moveEmbed] });
	},
};
