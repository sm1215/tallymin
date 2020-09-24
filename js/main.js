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

const tallymin = {
	containerSelector: '#tallymin-container',
	container: null,
	table: null,
	headers: null,
	rows: null,
	init: function() {
		this.container = document.querySelector(this.containerSelector);
		this.table = new Tabulator(this.containerSelector, {});
	}
};

(function() {
	tallymin.init();
})();
