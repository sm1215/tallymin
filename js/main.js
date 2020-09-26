const TEST_MODE = true;

const tableData = [
	{
		name: 'Sam',
		score: -10,
		modifyAmt: -10
	},
	{
		name: 'Amy',
		score: 50,
		modifyAmt: 23
	},
	{
		name: 'Shane',
		score: 5,
		modifyAmt: 0
	},
	{
		name: 'Faith',
		score: 809,
		modifyAmt: 1000
	}
]

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
		columnGrous: false
	},
	clipboard: true,
	clipboardCopied: function() {
		tallymin.intercom('Standings successfully copied');
	},
	clipboardCopyFormatter:function(type, tableData){
		//type - a string representing the type of the content, either "plain" or "html"
		//output - the output string about to be passed to the clipboard
		if (type != 'plain') {
			return;
		}
		const entriesWithHeaders = tableData.split(/[\s]+/).filter(entry => entry.length > 0);
		// remove the headers: [Name, Score]
		const entries = entriesWithHeaders.slice(2);

		const columnCount = 2;
		const output = entries.reduce((prev, cur, index) => {
			
			const addToken = 
				index % columnCount === 0 ?
				': ' :
				'\n';

			return `${prev}${cur}${addToken}`;
		}, '');

		return output;
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
			editable: function (cell) {
				return !cell.getElement().classList.contains('locked');
			}
		},
		{
			title: "Score",
			field: "score",
			sorter: "number",
			editor: "number",
			widthGrow: 1,
			cellEdited: function(e, cell) {
				tallymin.sortScoreColumn();
			}
		},
		{
			title: "Modify Amount",
			field: "modifyAmt",
			headerSort: false,
			widthGrow: 1,
			clipboard: false,
			// use a custom editor so we can have access to the input element
			// this gets dynamically created each time the user initiates an edit
			editor: function(cell, onRendered, success, cancel, editorParams) {
				const editor = document.createElement('input');
				editor.setAttribute('type', 'number');
				editor.style.padding = '4px';
				editor.style.width = '100%';
				editor.style.height = '100%';
    		editor.style.boxSizing = 'border-box';

				let value = cell.getValue();
				editor.value = parseInt(value, 10);

				onRendered(function(){
					editor.focus();
					editor.select();
				});

				function onSuccess(){
					let value = editor.value;
					value = parseInt(value, 10);
					success(value);
				}
		
				editor.addEventListener("change", onSuccess);
				editor.addEventListener("blur", onSuccess);

				return editor;
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

const tallymin = {
	containerSelector: '#tallymin-table',
	table: null,
	namesLocked: false,
	intercomDuration: 3, // seconds
	intercomTimer: null,
	init: function() {
		if (TEST_MODE) {
			tableCfg.data = tableData;
		}
		this.table = new Tabulator(this.containerSelector, tableCfg);
		// enable copying
		tallymin.table.copyToClipboard('all');

		// Add row on "Add Row" button click
		document.getElementById("add-row").addEventListener("click", function(ev) {
			tallymin.table.addRow({
				name: 'Team name',
				score: 0,
				modifyAmt: 0
			});
		});
		
		// undo button
		document.getElementById("history-undo").addEventListener("click", function(){
			tallymin.table.undo();
		});

		// redo button
		document.getElementById("history-redo").addEventListener("click", function(){
			tallymin.table.redo();
		});

		// multirow input focus
		document.getElementById("multirow-modify-amount").addEventListener("focus", function() {
			this.select();
		});

		// multirow input blur
		document.getElementById("multirow-modify-amount").addEventListener("blur", function() {
			if (!this.value || this.value.length <= 0) {
				this.value = 0;
			}
		});

		// multirow modify button
		document.getElementById("multirow-modify-button").addEventListener("click", function() {
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
		});

		// multirow delete button
		document.getElementById("multirow-delete-button").addEventListener("click", function() {
			tallymin.table.getSelectedRows().forEach(row => {
				row.delete();
			});
		});

		// lock names button
		document.getElementById("lock-names").addEventListener("click", function(ev) {
			const locked = tallymin.namesLocked = !tallymin.namesLocked;
			const buttonText = locked ? 'Unlock Names' : 'Lock Names';
			ev.target.textContent = buttonText;

			tallymin.table.getRows().forEach(row => {
				const [nameCell] = row.getCells().filter(cell => cell.getField() === 'name');
				if (locked) {
					nameCell.getElement().classList.add('locked');
				} else {
					nameCell.getElement().classList.remove('locked');
				}
			});
		});

		document.getElementById('intercom').addEventListener('click', function() {
			this.classList.remove('show');
			intercom.innerHTML = '';

			if (tallymin.intercomTimer) {
				clearTimeout(tallymin.intercomTimer);
			}
		});
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
	}
};

(function() {
	tallymin.init();
})();
