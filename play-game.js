// LETS ALL LOVE LAIN!
const fs = require('fs');
const _ = require('ramda');
// LETS ALL LOVE LAIN!
const {majorArcana} = require('./cards.js');
const deck = majorArcana;
// LETS ALL LOVE LAIN!
const print = console.log;
const HEIGHT = '300px';
const WIDTH = '220px';
// LETS ALL LOVE LAIN!
const shuffle = a => {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
};

shuffle(deck);

const drawCard = deck.pop.bind(deck);

const imgCard = cardImage => (cardImage) ? `<img src="${cardImage}" height="${HEIGHT}" width="${WIDTH}"/>` : false;
const getCardImage = _.prop('imagePath');
// TODO make easy mode with names attached
const grabImgCard = _.compose(imgCard, getCardImage);
const makeImgCard = card => `<p>${card.cardName}</p>`;
const tagitize = _.either(grabImgCard, makeImgCard);

const cardInClassP = s => /class="(card|card crossed)"/.test(s);

const innerHTML = number => `document.getElementById("${number}").innerHTML = '${tagitize(drawCard())}'`;
const extractNumber = div => div.split('id="')[1].split('"')[0];
const makeCardCode = _.compose(innerHTML, extractNumber);

const fillWithCards = fileString => {
	const commands = fileString
		.split('\n')
		.filter(cardInClassP)
		.map(makeCardCode);

	const putInScript = commands => `<script>\n${commands.join(';\n')};\n</script>`;
	const addToFile = (fileString, commands) => {
		return `${fileString}\n${putInScript(commands)}`;
	};

	return addToFile(fileString, commands);
};

const readFile = filename => fs.readFileSync(filename, 'utf8');

// app :: String -> String
const app = _.compose(
	fillWithCards,
	readFile
);

print(
	app('celtic.html')
);
