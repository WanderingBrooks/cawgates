## "OpponentArchetype"."deckId";

Opponent archetypes moved from being scoped per deck to per format
(`20261001120000_add_formats`). The column is kept, nullable and without a
foreign key, so the previous deployment can keep reading it while the new one
rolls out. New archetypes leave it null. Once the formats deployment is
complete, nothing reads it and this migration can be safely run:

```sql
ALTER TABLE "OpponentArchetype" DROP COLUMN "deckId";
```
