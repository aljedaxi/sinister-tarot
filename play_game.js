const { majorArcana } = require('./cards.js');
const deck = majorArcana;
const _ = require('ramda');
const fs = require('fs');

const print = console.log;
const DEFAULT_IMAGE_PATH = 'faces/lain.png';
const HEIGHT = '300px';
const WIDTH = '220px';

const shuffle = deck => {
		const a = deck;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

shuffle(deck);

const drawCard = deck.pop.bind(deck);

const readFile = _.either(
	filename => fs.readFileSync(filename, 'utf8'),
	'bitch you slipped'
);

const extractNumber = div => div.split('id="')[1].split('"')[0];
const getCardImage = _.prop('imagePath');
const getDefaultImage = card => DEFAULT_IMAGE_PATH;
//TODO make easy mode with names attached
const imgCard = cardImage => (cardImage) ? `<img src="${cardImage}" height="${HEIGHT}" width="${WIDTH}"/>` : false;
const makeImgCard = card => `<p>${card.cardName}</p>`;
const grabImgCard = _.compose(imgCard, getCardImage);
const tagitize = _.either(grabImgCard, makeImgCard);
const innerHTML = number => `document.getElementById("${number}").innerHTML = '${tagitize(drawCard())}'`;

const makeCardCode = _.compose(innerHTML, extractNumber);
const putInScript = commands => `<script>\n${commands.join(';\n')};\n</script>`;

const fillWithCards = fileString => {
	const commands = fileString.split('\n')
		.filter(s => /class="(card|card crossed)"/.test(s))
		.map(makeCardCode);

	const addToFile = (fileString, commands) => {
		return `${fileString}\n${putInScript(commands)}`
	};

	return addToFile(fileString, commands);
};

// app :: String -> String
const app = _.compose(
	fillWithCards,
	readFile
);

print(
	app('celtic.html')
);
