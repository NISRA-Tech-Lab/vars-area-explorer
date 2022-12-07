// CORE CONFIG
export const themes = {
	'light': {
		'name': 'light',
		'text': '#222',
		'muted': '#777',
		'pale': '#f0f0f0',
		'background': '#fff'
	},
	'dark': {
		'name': 'dark',
		'text': '#fff',
		'muted': '#bbb',
		'pale': '#333',
		'background': '#222'
	}
};

export const urls = {
	options: 'https://datavis.nisra.gov.uk/techlab/drpvze/places_2001.csv',
	//places: 'https://datavis.nisra.gov.uk/techlab/yalcbs/',
	places: '/data_jsons/',
	base: 'https://nisra-tech-lab.github.io/vars-area-explorer/'
};

export const types = {
	dea: { name: 'District Electoral Area', pl: 'District Electoral Areas' },
	town: { name: 'settlement', pl: 'Settlement' },
	lgd: { name: 'Local Government District', pl: 'Districts' },
	ward: { name: 'Electoral Ward', pl: 'Ward' },
	postcode: { name: 'postcode', pl: 'postcode' },
	ctry: { name: 'Country', pl: 'Countries' }
	/* 	,
		dz: {name: 'DataZones', pl: 'DataZones'},
		sdz: {name: 'Super Data Zones', pl: 'Super Data Zones'}
	 */
};

export const codes = {
	age: [
		{ code: 'a0to14', label: '0-14' },
		{ code: 'a15to39', label: '15-39' },
		{ code: 'a40to64', label: '40-64' },
		{ code: 'a65plus', label: '65+' }
	]

};



export const mapStyle = 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/basemap_styles/style-omt.json';

export const mapSources = {
	lgd: {
		id: 'lgd',
		promoteId: 'LGDCode',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/lgd2014/{z}/{x}/{y}.pbf',
		maxzoom: 12
	},
	dea: {
		id: 'dea',
		promoteId: 'DEA_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/dea_2014/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	} ,
	ward: {
		id: 'ward',
		promoteId: 'Ward_Code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/ward2014/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	} 

/* 	,
	sdz: {
		id: 'sdz',
		promoteId: 'SDZ21_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/sdz2021/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	},
	dz: {
		id: 'dz',
		promoteId: 'DZ21_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/dz2021/{z}/{x}/{y}.pbf',
 		minzoom: 6,
		maxzoom: 12
	}
 */};

export const mapLayers = {
	lgd: {
		source: 'lgd',
		sourceLayer: 'lgd',
		code: 'LGDCode',
		name: 'LGDNAME'
	},
	dea: {
		source: 'dea',
		sourceLayer: 'dea_2014',
		code: 'DEA_code',
		name: 'DEA'
	} ,

	ward: {
		source: 'ward',
		sourceLayer: 'ward',
		code: 'Ward_Code',
		name: 'Ward_Name'
	} 
	/* ,
sdz: {
	source: 'sdz',
	sourceLayer: 'sdz',
	code: 'SDZ21_code',
	name: 'SDZ21_name'
},
dz: {
	source: 'dz',
	sourceLayer: 'dz',
	code: 'DZ21_code',
	name: 'DZ21_name'
} */
};

export const mapPaint = {
	fill: {
		'fill-color': 'rgba(255,255,255,0)',
		'fill-opacity': 0
	},
	line: {
		'line-color': 'rgba(255,255,255,0)',
		'line-width': 1,
		'line-opacity': 0
	},
	'fill-active': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgba(255,255,255,0)',
			'grey'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			['!=', ['feature-state', 'selected'], true], 0.1,
			0
		]
	},
	'fill-self': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgb(17,140,123)',
			'grey'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			0.1
		]
	},
	'fill-child': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'highlighted'], true], 'rgb(17,140,123)',
			'rgba(255,255,255,0)'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			['==', ['feature-state', 'highlighted'], true], 0.1,
			0
		]
	},
	'line-active': {
		'line-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgb(17,140,123)',
			'grey'
		],
		'line-width': 2,
		'line-opacity': 1
	},
	'line-self': {
		'line-color': 'rgb(17,140,123)',
		'line-width': 2,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'selected'], true], 1,
			0
		]
	},
	'line-child': {
		'line-color': 'rgb(17,140,123)',
		'line-width': 1,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'highlighted'], true], 1,
			0
		]
	}
};