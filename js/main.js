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
	columns: [
		{
			field: 'rowSelection',
			formatter: "rowSelection",
			titleFormatter: "rowSelection",
			hozAlign: "center",
			headerSort: false,
			width: 50,
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
			editor: true,
			widthGrow: 2,
			formatter: function(cell, formatterParams) {
				cell.getElement().classList.add(...['fa', 'fas']);
				return `<span class="content">${cell.getValue()}</span>`;
			},
			editable: function (cell) {
				return cell.getElement().classList.contains('locked');
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
			editor: "number",
			widthGrow: 1
		},
		{
			field: 'apply',
			width: 140,
			headerSort: false,
			hozAlign: "center",
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
	init: function() {
		if (TEST_MODE) {
			tableCfg.data = tableData;
		}
		this.table = new Tabulator(this.containerSelector, tableCfg);

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
	},
	sortScoreColumn: function() {
		const sorters = tallymin.table.getSorters();
		// only sort the score column if it is already being sorted by the user
		// repeat the same sort direction
		const sort = sorters.filter(entry => entry.field === 'score')[0];
		if (sort) {
			tallymin.table.setSort([
				{column: 'score', dir: sort.dir}
			]);
		}
	}
};

(function() {
	tallymin.init();
})();
