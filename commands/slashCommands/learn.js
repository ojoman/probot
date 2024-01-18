const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const c2j = require("csvtojson");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ln')
		.setDescription('Get movepool info')
        .addStringOption(option => option.setName('pokemon').setDescription('The Pokemon').setRequired(true))
		.addStringOption(option => option.setName('move').setDescription('The move').setRequired(true)),
	async execute(interaction) {
        const pokemon = interaction.options.getString('pokemon');
		const move = interaction.options.getString('move');
		
		const pokemonData = await c2j({
			noheader:true
		}).fromFile('./data.csv');
		//console.log(pokemonData);
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

		const moveData = await c2j({
			noheader:true
		}).fromFile('./moves.csv');

		const moveSearcher = new fuse(moveData, {
			useExtendedSearch: true,
			keys: ['field1']
		});

		try {
			var moveInfo = moveSearcher.search(move)[0]['item'];
		} catch (error) {
			return await interaction.reply(`No Move found for ${pokemon}`);
		}
		console.log(moveInfo)
		const movepool = pokemonInfo.field15.split('#');
		const found = movepool.includes(moveInfo.field1);

		if (found) {
			return await interaction.reply(`${pokemonInfo.field2} **DOES** learn ${moveInfo.field1}`);
		}
		return await interaction.reply(`${pokemonInfo.field2} **DOES NOT** learn ${moveInfo.field1}`);
	},
};