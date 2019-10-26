// LETS ALL LOVE LAIN!
const fs = require('fs');
const _ = require('ramda');
const {task, of} = require('folktale/concurrency/task');
task.of = of;
const CACHE_FILE = 'deck.json';
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

	return a;
};

const generalReadFile = wrapData => {
	return filename => res => fs.readFile(filename, 'utf8', (err, data) => {
		if (err) {
			throw err;
		}

		res.resolve(wrapData(data));
	});
};

const readFile = generalReadFile(_.identity);

const getDeckFromCache = arcana => {
	return generalReadFile(_.compose(
		_.prop(arcana),
		shuffle, 
		JSON.parse)
	)(CACHE_FILE);
};

const getDeckFromCardsJs = arcana => res => res.resolve(require('./cards.js')[arcana]);

const unboxDeck = arcana => task(getDeckFromCache(arcana))
	.orElse(task.of(getDeckFromCardsJs(arcana)));

const readBoard = filename => task(readFile(filename));

const imgCard = cardImage => (cardImage) ? `<img src="${cardImage}" height="${HEIGHT}" width="${WIDTH}"/>` : false;
const getCardImage = _.prop('imagePath');
// TODO make easy mode with names attached
const grabImgCard = _.compose(imgCard, getCardImage);
const makeImgCard = card => `<p>${card.cardName}</p>`;
const tagitize = _.either(grabImgCard, makeImgCard);

const cardInClassP = s => /class="(card|card crossed)"/.test(s);

const innerHTML = drawCard => number => `document.getElementById("${number}").innerHTML = '${tagitize(drawCard())}'`;
const extractNumber = div => div.split('id="')[1].split('"')[0];
const makeCardCode = drawCard => _.compose(innerHTML(drawCard), extractNumber);

const fillWithCards = (deck, fileString) => {
	const drawCard = deck.pop.bind(deck);
	const commands = fileString
		.split('\n')
		.filter(cardInClassP)
		.map(makeCardCode(drawCard));

	const putInScript = commands => `<script>\n${commands.join(';\n')};\n</script>`;
	const addToFile = (fileString, commands) => {
		return `${fileString}\n${putInScript(commands)}`;
	};

	return addToFile(fileString, commands);
};

const fillBoardWithCards = ([deck, board]) => fillWithCards(deck, board);

const readFiles = boardFile => deckName => unboxDeck(deckName)
	.and(readBoard(boardFile)).run().future();

const app = log => layoutFile => _.compose(
	_.map(log),
	_.map(fillBoardWithCards),
	readFiles(layoutFile)
);

const drawCeltic = app(print)('celtic.html');

const whichDeck = {
	'deck': 'deck',
	'majorArcana': 'Major Arcana',
	'minorArcana': 'Minor Arcana'
};

drawCeltic(whichDeck.majorArcana);
