# tallymin

A simple utility to help keep track of scores for trivia games. First version with functionality first, styles to come later.

Visit: https://sm1215.github.io/tallymin/

![Preview](images/preview.png)

Add rows and team names.

Lock the names to avoid accidental changes.

Click into the Score column directly for quick modification changes.

Click into the 'Modify Amount' column to increment or decrement a score. It accepts positive and negative numbers. 

Press the Apply button to alter the current score by the Modify Amount.

The same concept can be applied to multiple rows by just selecting them and using the Multi-row Modification controls.

Use the sortable controls at the top of the Name or Score columns to sort alphabetically or by highscore.

The table history is saved so you can undo / redo changes! Just don't refresh the page (better persistence to survive a page refresh to come).

If the score column is sorted, columns will be re-sorted after each score update to maintain dynamic ordering.

todo
  - hookup clear button functionality, add one to main table
  - add delete last row button to quickscores
  - allow the quickscores table to hide on the side of the screen under a tab
  - migrate instructions to the page itself
  - add a table that displays the history, there's a tradeoff here with how much screen real estate we have available and how much value this would add. might not add this
  - persist table state and history through refresh
  - adjust styles to better fit mobile portrait
  - add hover ability for truncated text

completed changes
  - fill new rows with default data, Name: "Player", Score: 0, Modify Amount: 0
  - clear Modify Amount inputs after applying
  - add style to locked names for better visual indicator
  - add icons for controls
  - re-sort rows after score update
  - deselect rows after multirow update
  - autoselect modify amount values when clicked
  - add ability to copy standings from table
  - added a first theme for colors
  - there's not a way to add just a button to column headers without sacrificing the visibility of it and hiding it under a small menu icon. leaving "lock names" as an easier to reach button.
  - guard number inputs from NaN
  - refactored events into a combination of configuration and storage into handlers object for organization
  - added the quick sores table for quick repeatable scores - round 1 = 10, round 2 = 30, etc
  - add quicksorts events when a new row is added to main table
  - add quicksorts buttons and events when a new row is added to quicksorts table