const TEST_MODE = true;
const ENABLE_SOUND = true;

const tableData = [
	{
		id: 1,
		name: 'Sam',
		score: -10,
		modifyAmt: -10
	},
	{
		id: 2,
		name: 'Amy',
		score: 50,
		modifyAmt: 23
	},
	{
		id: 3,
		name: 'Shane',
		score: 5,
		modifyAmt: 0
	},
	{
		id: 4,
		name: 'Faith',
		score: 809,
		modifyAmt: 1000
	}
];

const quickscoresData = [
	{
		id: 1,
		amount: 10
	},
	{
		id: 2,
		amount: 20
	},
	{
		id: 3,
		amount: 30
	},
	{
		id: 4,
		amount: 40
	}
]

// use a custom editor so we can have access to the input element
// this gets dynamically created each time the user initiates an edit
// the main reason for this is so we can use element.select() on entry
const numericEditor = function(cell, onRendered, success, cancel, editorParams) {
	const editor = document.createElement('input');
	editor.setAttribute('type', 'number');
	editor.style.padding = '4px';
	editor.style.width = '100%';
	editor.style.height = '100%';
	editor.style.boxSizing = 'border-box';

	editor.value = Number(cell.getValue());

	onRendered(function(){
		editor.focus();
		if (editorParams.autoSelect) {
			editor.select();
		}
	});

	function onSuccess(){
		success(
			Number(editor.value)
		);
	}

	editor.addEventListener("change", onSuccess);
	editor.addEventListener("blur", onSuccess);

	return editor;
}

const tableCfg = {
	history: true,
	layout: "fitColumns",
	// persistence: {
		// 	sort: true,
		// 	filter: true,
		// 	columns: true,
		// },
	clipboardCopyConfig: {
		columnHeaders: false,
		columnGroups: false
	},
	clipboard: true,
	clipboardCopied: function() {
		tallymin.intercom('Standings successfully copied');
	},
	clipboardCopyFormatter:function(type, tableData){
		// only want to copy for plain text formats
		if (type !== 'plain') {
			return;
		}

		const entriesWithHeaders = tableData.split('\n').filter(entry => entry.length > 0);
		let rows = entriesWithHeaders
			.slice(1) // remove headers
			.map(row => 
				row
					.split(`${tallymin.cellDelimiter}`) // split name and score cells
					.map(cell => cell.trim() // trim each cell
				)
			);

		// to create the appropriate spacing for column alignment between names and scores
		// find the longest name and use that to determine how many spaces each row needs
		const names = rows.map(row => row[0]);
		const {length: longestNameLength} = names.reduce(
			(prev, cur) => prev.length > cur.length ? prev : cur
		);
		const findDifference = (({length}) => longestNameLength - length);

		let output = '';
		rows.forEach(([name, score]) => {
			// always give at least one space
			let spaceCount = 1 + findDifference(name);
			let spaces = '';

			for (let i = 0; i < spaceCount; i++) {
				spaces = `${spaces} `;
			}

			output = `${output}${name}:${spaces}${score}\n`;
		});

		return `\`\`\`\n${output}\`\`\``;
	},
	columns: [
		{
			field: 'rowSelection',
			formatter: "rowSelection",
			titleFormatter: "rowSelection",
			hozAlign: "center",
			headerSort: false,
			width: 50,
			clipboard: false,
			cellClick: function(e, cell) {
				cell.getRow().toggleSelect();
			}
		},
		{
			field: 'rownum',
			formatter: "rownum",
			hozAlign: "center",
			headerSort: false,
			width: 50
		},
		{
			title: "Name",
			field: "name",
			widthGrow: 2,
			editor: 'input',
			editable: function(cell) {
				return !cell.getElement().classList.contains('locked');
			},
			accessorClipboard: function(value, data, type, params, column) {
				return `${value.trim()}${tallymin.cellDelimiter}`;
			}
		},
		{
			title: "Score",
			field: "score",
			sorter: "number",
			editor: numericEditor,
			widthGrow: 1,
			cellEdited: function(e, cell) {
				tallymin.sortScoreColumn();
			},
			accessorClipboard: function(value, data, type, params, column) {
				return `${value}`.trim();
			}
		},
		{
			title: 'Quick',
			field: 'quickScore',
			headerSort: false,
			widthGrow: 2,
			clipboard: false,
			editor: false,
			formatter: function(cell, formatterParams) {
				if (!tallymin.quickscores) {
					return;
				}
				const quickscoreRows = tallymin.quickscores.getRows() || [];

				const mainTableIndex = cell.getRow().getIndex();
				// offset the readable value by one so it matches the quickscores row numbering
				const createButton = (mainTableIndex, quickscoreIndex) => `
					<button class='quickscores-button' 
						data-quickscores-index='${quickscoreIndex}'
						data-mainTable-index='${mainTableIndex}'
						>
						${quickscoreIndex}
					</button>
				`;
				return quickscoreRows.reduce((acc, currentRow, index) => {
					const quickscoreIndex = currentRow.getIndex();
					return `${acc}${createButton(mainTableIndex, quickscoreIndex)}`;
				}, '');
			}
		},
		{
			title: "Manual",
			field: "modifyAmt",
			headerSort: false,
			widthGrow: 1,
			clipboard: false,
			editor: numericEditor,
			editorParams: {
				autoSelect: true
			}
		},
		{
			field: 'apply',
			width: 140,
			headerSort: false,
			hozAlign: "center",
			clipboard: false,
			formatter: function(cell, formatterParams) {
				return `
					<button class="apply-button">
						<i class="fas fa-check"></i>
						Apply
					</button>
				`;
			},
			cellClick: function(e, cell) {
				let {score, modifyAmt} = cell.getData();
				score = parseInt(score, 10),
				modifyAmt = parseInt(modifyAmt, 10);

				const cells = cell.getRow().getCells();
				const [scoreCell] = cells.filter(cell => cell.getField() === 'score');
				const [modifyAmtCell] = cells.filter(cell => cell.getField() === 'modifyAmt');
				scoreCell.setValue(score + modifyAmt);
				modifyAmtCell.setValue(0);

				tallymin.sortScoreColumn();
			}
		}
	]
};

const quickscoresCfg = {
	history: true,
	layout: "fitColumns",
	columns: [
		{
			field: 'index',
			formatter: "rownum",
			hozAlign: "center",
			headerSort: false,
			editor: 'number',
			width: 50
		},
		{
			title: "Amount",
			field: "amount",
			headerSort: false,
			widthGrow: 1,
			clipboard: false,
			editor: numericEditor,
			editorParams: {
				autoSelect: true
			}
		}
	]
}

const tallymin = {
	containerSelector: '#tallymin-table',
	quickscoresSelector: '#quickscores-table',
	table: null,
	quickscores: null,
	namesLocked: false,
	intercomDuration: 3, // seconds
	intercomTimer: null,
	cellDelimiter: '::',
	rowDefaults: {
		table: {
			id: null,
			name: 'Team name',
			score: 0,
			modifyAmt: 0
		},
		quickscores: {
			id: null,
			amount: 0
		}
	},
	events: [
		{
			selector: '.add-row',
			type: 'click',
			handler: 'addRow'
		},
		{
			selector: '#history-undo',
			type: 'click',
			handler: 'historyUndo'
		},
		{
			selector: '#history-redo',
			type: 'click',
			handler: 'historyRedo'
		},
		{
			selector: '#multirow-modify-amount',
			type: 'focus',
			handler: 'modifySelectedFocus'
		},
		{
			selector: '#multirow-modify-amount',
			type: 'blur',
			handler: 'modifySelectedBlur'
		},
		{
			selector: '#multirow-modify-button',
			type: 'click',
			handler: 'modifySelectedRows'
		},
		{
			selector: '#multirow-delete-button',
			type: 'click',
			handler: 'deleteSelectedRows'
		},
		{
			selector: '#lock-names',
			type: 'click',
			handler: 'lockNameCells'
		},
		{
			selector: '#intercom',
			type: 'click',
			handler: 'closeIntercom'
		},
		{
			selector: '#brand-image',
			type: 'mouseover',
			handler: 'playSound'
		},
		{
			selector: '#brand-image',
			type: 'mouseout',
			handler: 'stopSound'
		},
		{
			selector: '.quickscores-button',
			type: 'click',
			handler: 'applyQuickScore'
		}
	],
	init: function() {
		if (TEST_MODE) {
			tableCfg.data = tableData;
			quickscoresCfg.data = quickscoresData;
		}

		// setup quickscores first so rows are available to populate the regular table
		// this only really matters during test mode but doesn't hurt anything either
		// so might as well leverage the benefit
		this.quickscores = new Tabulator(this.quickscoresSelector, quickscoresCfg);
		this.table = new Tabulator(this.containerSelector, tableCfg);
		this.setupEvents();
		// enable copying
		this.table.copyToClipboard('all');
		
		if (!ENABLE_SOUND) {
			this.initSound();
		}
	},
	setupEvents: function(events = []) {
		if (events.length <= 0) {
			events = this.events;
		}
		events.forEach(({selector, type, handler}) => {
			document.querySelectorAll(selector).forEach(node => {
				node.addEventListener(type, this.handlers[handler]);
			});
		});
	},
	initSound: function() {
		var tag = document.createElement('script');
		tag.id = 'iframe-demo';
		tag.src = 'https://www.youtube.com/iframe_api';
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	},
	sortScoreColumn: function() {
		const sorters = tallymin.table.getSorters();
		// only sort the score column if it is already being sorted by the user
		// repeat the same sort direction
		const sort = sorters.filter(entry => entry.field === 'score')[0];
		if (sort) {
			tallymin.table.setSort([
				{ column: 'score', dir: sort.dir }
			]);
		}
	},
	deselectAllRows: function() {
		tallymin.table.getSelectedRows().forEach(row => {
			tallymin.table.deselectRow(row);
		});
	},
	intercom: function(message = '') {
		const intercom = document.getElementById('intercom');
		const content = document.createElement('div');
		const paragraph = document.createElement('p');

		intercom.style.animationDuration = `${tallymin.intercomDuration}s`;
		intercom.classList.add('show');
		content.classList.add('content');
		paragraph.textContent = message;

		content.appendChild(paragraph);
		intercom.appendChild(content);

		tallymin.intercomTimer = setTimeout(() => {
			intercom.classList.remove('show');
			intercom.innerHTML = '';
		}, (tallymin.intercomDuration + 1) * 1000);
	},
	handlers: {
		applyQuickScore: function() {
			const {quickscoresIndex, maintableIndex} = this.dataset;
			const {amount} = tallymin.quickscores
				.getRows()[quickscoresIndex - 1]
				.getData();
			const [scoreCell] = tallymin.table
				.getRows()[maintableIndex - 1]
				.getCells()
				.filter(cell => cell.getField() === 'score');
			const currentScore = scoreCell.getValue();
			scoreCell.setValue(currentScore + amount);
		},
		addRow: function() {
			const {tableType} = this.dataset;
			const rowDefaults = tallymin.rowDefaults[tableType];
			rowDefaults.id = tallymin.table.getRows().length + 1;
			tallymin[tableType].addRow(rowDefaults);
			tallymin.setupEvents([
				...tallymin.events.filter(e => e.handler === 'applyQuickScore')
			]);
		},
		historyUndo: function() {
			tallymin.table.undo();
		},
		historyRedo: function() {
			tallymin.table.redo();
		},
		modifySelectedFocus: function() {
			this.select();
		},
		modifySelectedBlur: function() {
			if (!this.value || this.value.length <= 0) {
				this.value = 0;
			}
		},
		modifySelectedRows: function() {
			const amountInput = document.getElementById("multirow-modify-amount");
			let modifyAmt = amountInput.value;
			modifyAmt = parseInt(modifyAmt, 10);

			tallymin.table.getSelectedRows().forEach(row => {
				let {score} = row.getData();
				score = parseInt(score, 10);
				const [scoreCell] = row.getCells().filter(cell => cell.getField() === 'score');
				scoreCell.setValue(score + modifyAmt);
			});

			amountInput.value = 0;
			tallymin.deselectAllRows();
			tallymin.sortScoreColumn();
		},
		deleteSelectedRows: function() {
			tallymin.table.getSelectedRows().forEach(row => {
				row.delete();
			});
		},
		lockNameCells: function() {
			const locked = tallymin.namesLocked = !tallymin.namesLocked;
			const buttonText = locked ? 'Unlock Names' : 'Lock Names';
			this.textContent = buttonText;

			tallymin.table.getRows().forEach(row => {
				const [nameCell] = row.getCells().filter(cell => cell.getField() === 'name');
				if (locked) {
					nameCell.getElement().classList.add('locked');
				} else {
					nameCell.getElement().classList.remove('locked');
				}
			});
		},
		closeIntercom: function() {
			this.classList.remove('show');
			intercom.innerHTML = '';

			if (tallymin.intercomTimer) {
				clearTimeout(tallymin.intercomTimer);
			}
		},
		playSound: function() {
			// let sound fail silently
			try {
				window.sound.unMute();
				window.sound.setVolume(100);
				window.sound.seekTo(5);
				window.sound.playVideo();
			} catch (e) {}
		},
		stopSound: function() {
			// let sound fail silently
			try {
				window.sound.stopVideo();
			} catch (e) {}
		}
	}
};

(function() {
	tallymin.init();
})();
