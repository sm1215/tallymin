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
  - deselect rows after multirow update
  - refacor how events are are added
  - find a way to autoselect modify amount values when clicked
  - continue working on colors / fonts
  - add clear table button
  - persist table state and history through refresh
  - migrate instructions to the page itself
  - adjust styles to better fit mobile portrait
  - add hover ability for truncated text
  - add a table that displays the history
  - add a table for quick repeatable scores - round 1 = 10, round 2 = 30, etc

completed changes
  - fill new rows with default data, Name: "Player", Score: 0, Modify Amount: 0
  - clear Modify Amount inputs after applying
  - add style to locked names for better visual indicator
  - add icons for controls
  - re-sort rows after score update