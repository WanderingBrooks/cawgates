## "Deck"."isPublic"

Decks are no longer public or private: every deck is visible to everyone, and
only event and match notes stay private to their author. The app stops reading
and writing the column, but it's kept so the previous deployment can keep
reading it while the new one rolls out. New decks get the column's default
(`false`), which nothing reads. Once the deploy is complete, nothing uses it and
this migration can be safely run:

```sql
ALTER TABLE "Deck" DROP COLUMN "isPublic";
```
