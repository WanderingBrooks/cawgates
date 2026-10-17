# Things to revisit

## Remove public/private decks

Public decks overcomplicate the app. Drop the concept: every deck is public,
and the only private thing is notes (event and match notes), which only their
author can see.

What it would remove:

- `Deck.isPublic` (needs a migration), and the "Make deck public" checkbox and
  its translations in `DeckForm`
- The guest-only logic in `src/lib/dal.ts`: `getVisibleDecksWhere`,
  `getVisibleMatchesWhere`, `isPublicOnly` in `queryMatchStatistics`, the
  guest 404s in `getDeck`, `getEvent`, `getFormat` and `getOpponentArchetype`,
  and the guest filtering in `getFormatsForOwner`
- The "(private)" deck label in `DeckFilter`, and the guest empty state on
  `/matchups` (guests would see the same formats as the owner)

What stays: `isOwner` for edit controls, and hiding notes from everyone but
their author (already done on the event and archetype pages; check nothing
else shows them).

## Navigation buttons and stats consistency

1. **Event page "View deck" button.** It now opens the Matchups page filtered
   to the event's deck (`/matchups/<formatId>?deck=<slug>`), so the label no
   longer matches where it goes.
2. **Archetype page "View format" button.** It goes back to the Matchups page
   (keeping the deck filter), but there is no "format" page any more. Maybe a
   "Back to matchups" link or a breadcrumb instead of a button.
3. **Subheaders differ between Matchups and the archetype page.**
   - Matchups: the title is the format name, and the subtitle is
     "Match wins 20 · Match losses 14 · Match win % 58.8%".
   - Archetype: the title is the archetype, and the subtitle is
     "Pauper · 1-1-0" (format name and match record).
   They should probably follow the same pattern.
4. **Match vs game stats are shown inconsistently.**
   - Matchups header: match wins, match losses, match win %.
   - Matchups table: match record, game record, game win %, with the win/loss
     tint based on game win %.
   - Archetype page: match record in the subtitle, and a game record per
     match.
   - Event page and events list: match record.
   Decide which stats to show where (match vs game, record vs percentage)
   and use them consistently.

## Where formats and decks are created and edited

Merging the deck pages into Matchups (PR #69) made viewing simpler but scattered
the create/edit/delete actions. This needs more thought before changing.

### Where things are now

| Action        | Where                                                        | Problem                                                   |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| Create deck   | Button next to the Deck dropdown on Matchups                 | Reads as part of the filter                               |
| Edit deck     | Button next to the Deck dropdown, only once a deck is picked | Hidden until you happen to filter                         |
| Create format | Only inside the deck form ("+ Add new…" in its format picker) | Practically undiscoverable                                |
| Edit format   | "Edit" button by the Matchups page title                     | On a page called Matchups, "Edit" doesn't say what it edits |
| Delete format | Next to Edit, plus a mobile danger zone                      | Clutters the title area                                   |

### Option A: manage each thing next to the dropdown that selects it

Follows the pattern the deck form's format picker already uses (a select with
"+ Add new…" plus an Edit button).

```
Format [ Pauper        ▾ ]  [Edit format]     Deck [ Cawgates      ▾ ]  [Edit deck]
         Pauper                                       All decks
         + New format…                                Cawgates
                                                      Jund Gardens (private)
                                                      + New deck…
```

- The owner always sees the Format dropdown, since it holds "+ New format…".
  Guests see it only with 2+ formats.
- "+ New format…" opens the existing `FormatForm` dialog, then goes to the new
  format.
- Edit format sits next to the Format dropdown.
- Delete format moves inside the Edit format dialog, the same way Delete deck
  lives in the deck form. That removes the title buttons, the hint and the
  mobile danger zone.
- "+ New deck…" goes to `/decks/create?format=<id>` with the format already
  chosen. The Create deck button goes away.
- The page title becomes just the format name and totals.

### Option B: a separate Manage page

One page that lists formats, decks and archetypes with all the editing on it,
so Matchups is only for viewing. Cleaner separation, but it brings back a list
page right after we removed them.

### Open questions

- Is the filter row the right home for editing, or does it make the filter
  harder to read?
- Should creating a format be possible without creating a deck at the same
  time?
- Mock it up before building.
