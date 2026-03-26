## "Match"."opponentArchetype";

Opponent archetype was moved to it's own table. Once that is deployed,
we should add a new migration to drop the column. This is delayed, so that
we remove the risk of issues during deployments. Old code can query this column
and new code will query opponentArchetypeId. Then once the migration and deployment
is complete everything will query opponentArchetypeId. Then the migration to drop
this column can be safely run

```sql
ALTER TABLE "Match" DROP COLUMN "opponentArchetype";
```
