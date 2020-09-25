const TEST_MODE = true;

const tableData = [
	{
		name: 'Sam',
		score: -10,
		modifyAmt: -10
	},
	{
		name: 'Amy',
		score: 5,
		modifyAmt: 23
	},
	{
		name: 'Shane',
		score: 23,
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
	persistence: {
		sort: true,
		filter: true,
		columns: true,
	},
	columns: [
		{
			field: 'rowSelection',
			formatter: "rowSelection",
			titleFormatter: "rowSelection",
			hozAlign: "center",
			headerSort: false,
			width: 40,
			cellClick: function(e, cell) {
				cell.getRow().toggleSelect();
			}
		},
		{
			formatter: "rownum",
			hozAlign: "center",
		},
		{
			title: "Name",
			field: "name",
			width: 100,
			editor: true,
			editable: function (cell) {
				return cell.getElement().disabled !== true;
			},
			editorParams: {
				allowEmpty: true,
				showListOnEmpty: true,
				values: true
			}
		},
		{
			title: "Score",
			field: "score",
			sorter: "number",
			editor: "number"
		},
		{
			title: "Modify Amount",
			field: "modifyAmt",
			headerSort: false,
			editor: "number"
		},
		{
			field: 'apply',
			headerSort: false,
			hozAlign: "center",
			formatter: function(cell, formatterParams) {
				return `<button class="apply-button">Apply to Row</button>`;
			},
			cellClick: function(e, cell) {
				let {score, modifyAmt} = cell.getData();
				score = parseInt(score, 10),
				modifyAmt = parseInt(modifyAmt, 10);

				const [scoreCell] = cell.getRow().getCells().filter(cell => cell.getField() === 'score');
				scoreCell.setValue(score + modifyAmt);
			}
		}
	]
};

const tallymin = {
	containerSelector: '#tallymin-table',
	table: null,
	namesLocked: false,
	init: function() {
		if (TEST_MODE) {
			tableCfg.data = tableData;
		}
		this.table = new Tabulator(this.containerSelector, tableCfg);

		//Add row on "Add Row" button click
		document.getElementById("add-row").addEventListener("click", function(ev) {
			tallymin.table.addRow({});
		});
		
		//undo button
		document.getElementById("history-undo").addEventListener("click", function(){
			tallymin.table.undo();
		});

		//redo button
		document.getElementById("history-redo").addEventListener("click", function(){
			tallymin.table.redo();
		});

		// multirow modify button
		document.getElementById("multirow-modify-button").addEventListener("click", function() {
			let modifyAmt = document.getElementById("multirow-modify-amount").value;
			modifyAmt = parseInt(modifyAmt, 10);

			tallymin.table.getSelectedRows().forEach(row => {
				let {score} = row.getData();
				score = parseInt(score, 10);
				const [scoreCell] = row.getCells().filter(cell => cell.getField() === 'score');
				scoreCell.setValue(score + modifyAmt);
			});
		});

		// lock names button
		document.getElementById("lock-names").addEventListener("click", function(ev) {
			const locked = tallymin.namesLocked = !tallymin.namesLocked;
			const buttonText = locked ? 'Unlock Names' : 'Lock Names';
			ev.target.textContent = buttonText;

			tallymin.table.getRows().forEach(row => {
				const [nameCell] = row.getCells().filter(cell => cell.getField() === 'name');
				nameCell.getElement().disabled = locked;
			});
		});
	}
};

(function() {
	tallymin.init();
})();
