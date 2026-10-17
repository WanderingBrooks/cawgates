# Columns to drop

Columns are dropped in two steps, so the running deployment never reads a
column that's gone:

1. A PR stops the app reading and writing the column, and lists it here.
2. Once that PR is deployed, a later PR drops it in a migration and removes it
   from this list.

Nothing is waiting to be dropped right now.
