// const tableCfg = {
// 	columns: [
// 		{
// 			name: 'Select All',
// 			contents: {
// 				read: [
// 					{
// 						tag: 'label',
// 					},
// 					{
// 						tag: 'input',
// 						type: 'checkbox'
// 					}
// 				],
// 				write: {}
// 			}
// 		},
// 		{
// 			name: 'Name',
// 			contents: {
// 				read: {
// 					tag: 'p'
// 				},
// 				write: {
// 					tag: 'input',
// 					type: 'text'
// 				}
// 			}
// 		},
// 		{
// 			name: 'Score',
// 			contents: {
// 				read: {
// 					tag: 'p'
// 				},
// 				write: {
// 					tag: 'input',
// 					type: 'text'
// 				}
// 			}
// 		},
// 		{
// 			name: 'Modifier',
// 			contents: {
// 				read: {
// 					tag: 'p'
// 				},
// 				write: {
// 					tag: 'input',
// 					type: 'text'
// 				}
// 			}
// 		},
// 		{
// 			name: 'Subtract?',
// 			contents: {
// 				read: {
// 					tag: 'input',
// 					type: 'checkbox'
// 				},
// 				write: {}
// 			}
// 		},
// 		{
// 			name: 'Apply',
// 			contents: {
// 				read: {
// 					tag: 'input',
// 					type: 'button'
// 				},
// 				write: {}
// 			}
// 		}
// 	]
// };
// const appData = [
// 	{
// 		id: 0,
// 		name: 'Sam',
// 		score: 0,
// 		history: []
// 	},
// 	{
// 		id: 1,
// 		name: 'Amy',
// 		score: 20,
// 		history: []
// 	}
// ];

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
	data: tableData,
	// autoColumns: true,
	height: "311px",
	history: true,
	// selectable: true,
	layout: "fitColumns",
	persistence: {
		sort: true,
		filter: true,
		columns: true,
	},
	columns: [
		{
			formatter: "rowSelection",
			titleFormatter: "rowSelection",
			hozAlign: "center",
			headerSort: false,
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
			editor: true,
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
				return `<button>Apply to Row</button>`;
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
}

const tallymin = {
	containerSelector: '#tallymin-table',
	container: null,
	table: null,
	headers: null,
	rows: null,
	init: function() {
		this.container = document.querySelector(this.containerSelector);
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
	}
};

(function() {
	tallymin.init();
})();
