'use strict';

// LETS ALL LOVE LAIN!
// SANCTUS     SATANAS
// LETS ALL LOVE LAIN!

const _ = require('ramda');
const fs = require('fs');
const {task} = require('folktale/concurrency/task');
// LETS ALL LOVE LAIN!
const print = console.log;
const NO_THE = true;
// LETS ALL LOVE LAIN!
const faces = {
	majorArcana: {
		//TODO missing
		2: 'faces/02-high-priestess-mactoron.jpg',
		3: 'faces/03-mistress-of-earth-davcina.jpg',
		4: 'faces/04-lord-of-earth-kthunae.jpg',
		5: 'faces/05-master-atazoth.jpg',
		6: 'faces/06-lovers-karu-samsu.jpg',
		7: 'faces/07-azoth-satanas1.jpg',
		8: 'faces/08-change-nekalah2.jpg',
		9: 'faces/09-hermit-sauroctonos2.jpg',
		10: 'faces/10-wyrd-azanigin2.jpg',
		11: 'faces/11-desire-lidagon1.jpg',
		12: 'faces/12-opfer-vindex2.jpg',
		13: 'faces/13-death-nythra1.jpg',
		14: 'faces/14-hel-aosoth1.jpg',
		15: 'faces/15-deofel-noctulius2.jpg',
		16: 'faces/16-war-abatu2.jpg',
		17: 'faces/17-star-nemicu3.jpg',
		18: 'faces/18-moon-shugara3.jpg',
		19: 'faces/19-sun-velpecula1.jpg',
		20: 'faces/20-aeon-naos2.jpg'
	},
	minorArcana: {
		Priest: [ //TODO missing
			'faces/magus_of_chalices2.jpg',
			'faces/magus_of_pentacles.jpg'
		],
		Maiden: [
			'faces/maiden_of_chalices.jpg',
			'faces/maiden-of-pentacles.jpg',
			'faces/maiden-of-swords1.jpg',
			'faces/maiden_of_wands.jpg',
		],
		Priestess: [ //TODO missing
			'faces/mousa_of_chalices1.jpg',
			'faces/mousa_of_swords.jpg',
			'faces/mousa_of_wands.jpg'
		],
		Warrior: [
			'faces/warrior_of_chalices.jpg',
			'faces/warrior_of_pentacles.jpg',
			'faces/warrior-of-swords2.jpg',
			'faces/warrior-of-wands21.jpg'
		]
	}
};

const getMinorImage = (court, position) => {
	const getAtPosition = _.compose(_.prop(position), _.prop('minorArcana'));
	const getAtCourt = _.includes(court.toLowerCase());
	const possibilities = getAtPosition(faces).filter(getAtCourt);
	return possibilities[0] || undefined;
};

const spheres = [
	['Moon', [
		['18', 'Moon', 'Shugara'],
		['15', 'Lucifer', 'Noctulius', 'Deofel', true],
		['13', 'Death', 'Nythra', undefined, true]
	]],
	['Mercury', [
		['0', 'Fool', 'Ga Wath Am', 'Physis'],
		['8', 'Change', 'Nekalah', undefined, true],
		['16', 'Tower', 'Abatu', 'War']
	]],
	['Venus', [
		['6', 'Lovers', 'Karu Samsu'],
		['14', 'Hel', 'Aosoth', undefined, true],
		['17', 'Star', 'Nemicu']
	]],
	['Sun', [
		['7', 'Azoth', 'Satanas', undefined, true],
		['12', 'Hanged Man', 'Vindex', 'Opfer'],
		['5', 'Master', 'Atazoth']
	]],
	['Mars', [
		['1', 'Magickian', 'Binan Ath'],
		['4', 'Lord of Earth', 'Kthunae'],
		['9', 'Hermit', 'Sauroctonos']
	]],
	['Jupiter', [
		['11', 'Desire', 'Lidagon'],
		['3', 'Mistress of Earth', 'Davcina'],
		['2', 'High Priestess', 'Mactoron']
	]],
	['Saturn', [
		['10', 'Wyrd', 'Azanigin'],
		['19', 'Sun', 'Velpecula'],
		['20', 'Aeon', 'Naos']
	]]
];

const courts = {
	Wands: 'Mercury',
	Pentacles: 'Moon',
	Swords: 'Sun',
	Chalices: 'Venus'
};

const positions = [
	'Priest', // Magnus
	'Priestess', // Mousa
	'Warrior',
	'Maiden'
	// 'Ace'
];

const cardSpec = {
	noThe: NO_THE,
	properties: [
		'cardName',
		'number',
		'sphere',
		'darkGod',
		'court',
		'position',
		'arcana',
		'altName',
		'noThe',
		'imagePath'
	]
};

const tCase = s => `${s[0].toUpperCase()}${s.slice(1)}`;

const setX = _.curry(function (propName, propVal) {
	this[propName] = propVal;
	return this;
});

const cardConstructorConstructor = card => function Card() {
	const cardObj = {};
	card.properties.forEach(p => {
		cardObj[`set${tCase(p)}`] = setX(p);
	});
	return cardObj;
};

const Card = cardConstructorConstructor(cardSpec);

const MajorArcanaCard = _.curry((sphere, card) => {
	const number = card[0];
	const cardName = card[1];
	const darkGod = card[2];
	const altName = card[3] || cardName;
	const noThe = card[4] || false;
	const image = faces.majorArcana[number] || undefined;
	const cardObj = new Card();
	return cardObj
		.setCardName(cardName)
		.setSphere(sphere)
		.setNumber(number)
		.setArcana('Major Arcana')
		.setDarkGod(darkGod)
		.setAltName(altName)
		.setImagePath(image)
		.setNoThe(noThe);
});

const MinorArcanaCard = court => position => {
	return new Card()
		.setCardName(`${position} of ${court}`)
		.setPosition(position)
		.setImagePath(getMinorImage(court, position))
		.setArcana('Minor Arcana');
};

const sphereToCard = sphere => {
	const sphereName = sphere[0];
	const cards = sphere[1];
	return cards.map(MajorArcanaCard(sphereName));
};

const positionToCard = p => {
	return Object.keys(courts).map(c => {
		return MinorArcanaCard(c)(p);
	});
};

const makeDeck = inputToCard => _.compose(
	_.flatten,
	_.map(inputToCard)
);

const makeMajorArcana = makeDeck(sphereToCard);
const makeMinorArcana = makeDeck(positionToCard);

const majorArcana = makeMajorArcana(spheres);
const minorArcana = makeMinorArcana(positions);
const decks = {
	majorArcana,
	minorArcana,
	deck: _.concat(minorArcana, majorArcana)
};

const errorCallback = err => {
	if (err) throw err;
};

const writeToFile = _.curry((filename, s) => {
	return task(resolver => {
		resolver.resolve(
			fs.writeFile(filename, s, errorCallback)
		)
	});
});

const prepareForStorage = card => {
	const strippedCard = {};
	Object.keys(card).forEach(property => {
		if (cardSpec.properties.includes(property)) {
			strippedCard[property] = card[property];
		}
	});
	return strippedCard;
};

const reObjectify = decks => {
	const decksObject = {
		deck: [],
		'Major Arcana': [],
		'Minor Arcana': []
	};
	decks.forEach(cards => {
		cards.forEach(card => {
			decksObject[card.arcana].push(card);
			decksObject.deck.push(card);
		});
	});
	return decksObject;
};

const prettyJSON = s => JSON.stringify(s, null, 2);

const cacheDeck = log => _.compose(
	log,
	prettyJSON,
	reObjectify,
	_.map(_.map(prepareForStorage)),
	_.values()
);

cacheDeck(writeToFile('deck.json'))(decks).run();

module.exports = decks;
