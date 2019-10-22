'use strict';

const _ = require('ramda');

const print = console.log;
const NO_THE = true;

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
const faces = {
	majorArcana: {
		//TODO missing
		'02': 'faces/02-high-priestess-mactoron.jpg',
		'03': 'faces/03-mistress-of-earth-davcina.jpg',
		'04': 'faces/04-lord-of-earth-kthunae.jpg',
		'05': 'faces/05-master-atazoth.jpg',
		'06': 'faces/06-lovers-karu-samsu.jpg',
		'07': 'faces/07-azoth-satanas1.jpg',
		'08': 'faces/08-change-nekalah2.jpg',
		'09': 'faces/09-hermit-sauroctonos2.jpg',
		'10': 'faces/10-wyrd-azanigin2.jpg',
		'11': 'faces/11-desire-lidagon1.jpg',
		'12': 'faces/12-opfer-vindex2.jpg',
		'13': 'faces/13-death-nythra1.jpg',
		'14': 'faces/14-hel-aosoth1.jpg',
		'15': 'faces/15-deofel-noctulius2.jpg',
		'16': 'faces/16-war-abatu2.jpg',
		'17': 'faces/17-star-nemicu3.jpg',
		'18': 'faces/18-moon-shugara3.jpg',
		'19': 'faces/19-sun-velpecula1.jpg',
		'20': 'faces/20-aeon-naos2.jpg'
	},
	minorArcana: {
		magus: [ //TODO missing
			'faces/magus_of_chalices2.jpg',
			'faces/magus_of_pentacles.jpg'
		],
		maiden: [
			'faces/maiden_of_chalices.jpg',
			'faces/maiden-of-pentacles.jpg',
			'faces/maiden-of-swords1.jpg',
			'faces/maiden_of_wands.jpg',
		],
		mousa: [ //TODO missing
			'faces/mousa_of_chalices1.jpg',
			'faces/mousa_of_swords.jpg',
			'faces/mousa_of_wands.jpg',
		],
		warrior: [
			'faces/warrior_of_chalices.jpg',
			'faces/warrior_of_pentacles.jpg',
			'faces/warrior-of-swords2.jpg',
			'faces/warrior-of-wands21.jpg'
		]
	}
};

const setX = _.curry(function (propName, propVal) {
	this[propName] = propVal;
	return this;
});

const tCase = s => `${s[0].toUpperCase()}${s.slice(1)}`;

const cardConstructorConstructor = card => function () {
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
	const image = faces.majorArcana[number] || 'NO IMAGE';
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
		.setArcana('Minor Arcana');
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

const newCard = sphere => {
	const sphereName = sphere[0];
	const cards = sphere[1];
	const generator = MajorArcanaCard(sphereName);
	return cards.map(generator);
};

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

const majorArcana = spheres.map(newCard).flat();

const minorArcana = positions.map(p => {
	return Object.values(courts).map(c => {
		return MinorArcanaCard(c)(p);
	});
}).flat();

module.exports = {
	deck: [...majorArcana, ...minorArcana],
	minorArcana,
	majorArcana
};
