const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const c2j = require("csvtojson");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dt')
		.setDescription('Get Pokemon info')
        .addStringOption(option => option.setName('pokemon').setDescription('The Pokemon to get info on').setRequired(true)),
	async execute(interaction) {
        const pokemon = interaction.options.getString('pokemon');
		const pokemonData = await c2j({
			noheader:true
		}).fromFile('./data.csv');
		var fuse = require('fuse.js');	
		const searcher = new fuse(pokemonData, {
			useExtendedSearch: true,
			keys: ['field2']
		});
		try {
			var pokemonInfo = searcher.search(pokemon)[0]['item'];
		} catch (error) {
			return await interaction.reply(`No Pokemon found for ${pokemon}`);
		}
		const pokemonEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(pokemonInfo.field2)
			.setDescription(`Dex: ${pokemonInfo.field1}`)
			.setImage(pokemonInfo.field3)
			.addFields(
				{ name: 'Height', value: pokemonInfo.field16, inline: true},
				{ name: 'Weight', value: pokemonInfo.field17, inline: true},
			)
			.addFields(
				{ name: 'HP', value: pokemonInfo.field9, inline: true },
				{ name: 'Atk', value: pokemonInfo.field10, inline: true },
				{ name: 'Def', value: pokemonInfo.field11, inline: true },
				{ name: 'SpAtk', value: pokemonInfo.field12, inline: true },
				{ name: 'SpDef', value: pokemonInfo.field13, inline: true },
				{ name: 'Spe', value: pokemonInfo.field14, inline: true },
			)
			.addFields(
				{ name: 'Type1', value: pokemonInfo.field4, inline: true},
				{ name: 'Type2', value: pokemonInfo.field5, inline: true},
			)
			.addFields(
				{ name: 'Ability 1', value: pokemonInfo.field6, inline: true},
				{ name: 'Ability 2', value: pokemonInfo.field7, inline: true},
				{ name: 'Hidden Ability', value: pokemonInfo.field8, inline: true},
			)
			.setTimestamp()
			.setFooter({ text: 'luv u'});
		
		//await interaction.reply(`${pokemonInfo.field4}`);
		await interaction.reply({ embeds: [pokemonEmbed] });
	},
};
