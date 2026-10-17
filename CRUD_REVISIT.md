# Things to revisit

## Where we left off (2026-10-17)

- PR #69 is a draft with the merge done. It still needs a click-through in
  the browser (see the PR's test plan) before it's marked ready.
- Public/private decks are gone (PR #70, and this PR is rebased on it).
  Every deck is public and only notes stay private. `Deck.isPublic` is
  dropped in a follow-up migration (see `COLUMNS_TO_DROP.md`).
- Done: the navigation buttons say "View matchups", the Matchups and
  archetype subtitles both read "record · match win %", and every stat is
  match-based (game scores only on individual matches), like Decks and the
  City.
- Next: apply the create/edit/delete rules below, working through the
  checklist.

## Create, edit and delete rules

Decided 2026-10-17. Everything that can be managed (formats, decks, opponent
archetypes, events, matches) follows these rules.

1. **Titles name the page, not what's selected.** Matchups is titled
   "Matchups". The format and deck it shows are picked in dropdowns, and the
   subtitle is "context · record".
2. **Add and edit sit next to the dropdown that picks the thing.** Wherever a
   format, deck or archetype is chosen from a dropdown, in a filter row or a
   form, it looks like this:

   ```
   Format [ Pauper ▾ ]  [+ Add format]  [Edit format]
   ```

   - "+ Add …" is a button, never an option inside the dropdown.
   - "Edit …" only shows once something is selected.
   - Both are owner-only. Guests just see the dropdown.
   - Exceptions: the event form's deck picker only gets "+ Add deck" (no
     Edit), and the archetype page's deck filter stays view-only.

3. **A filter dropdown always shows**, even with one option, so the page
   always says what it's showing.
4. **Delete lives inside the edit form or dialog** for everything, matches
   included, at the bottom, with its
   "can't delete because…" hint next to it, the way Delete deck already
   works. There are no delete buttons on pages or cards, and no mobile
   "danger zone" sections.
5. **Page buttons go View, then Edit.** For example "View matchups · Edit
   event". Delete is no longer a page button (rule 4).

## Checklist

### Matchups page (`src/app/[username]/matchups/[id]/page.tsx`)

Done in PR #69. Everything after this section is a follow-up PR.

- [ ] Title is "Matchups"; the subtitle stays "record · match win %"
- [ ] Format dropdown always shows (drop the "2+ formats" check)
- [ ] "+ Add format" and "Edit format" buttons next to the Format dropdown
      (reuse the `FormatForm` dialog; after adding, go to the new format)
- [ ] Delete format moves into the Edit format dialog; remove the title
      buttons, the title hint and the mobile danger zone
- [ ] "+ Add deck" and "Edit deck" next to the Deck dropdown (replacing the
      Create deck and Edit deck buttons). "+ Add deck" opens the deck create
      page with this format already chosen

### Opponent archetype page (`src/app/[username]/opponents/[id]/page.tsx`)

- [ ] Delete moves into the Edit dialog, with the "has matches" hint; remove
      the title Delete button, its hint and the mobile danger zone
- [ ] Buttons are "View matchups · Edit"

### Event page (`src/app/[username]/events/[id]/page.tsx`)

- [ ] Delete event moves into the event edit page (`EventForm` in edit
      mode); remove the title Delete button and the mobile danger zone
- [ ] Buttons are "View matchups · Edit event"

### Matches (`MatchSection.tsx`, `MatchForm.tsx`)

- [ ] Each match card only has "Edit"; Delete moves into the Edit match
      dialog
- [ ] Opponent archetype picker: "+ Add archetype" button next to it instead
      of the "+ Add new..." option; the Edit button stays

### Deck form (`src/components/DeckForm`)

- [ ] Format picker: "+ Add format" button next to it instead of the
      "+ Add new..." option; the Edit button stays
- [ ] Delete deck is already inside the form; check it matches rule 4

### Event form (`src/app/[username]/events/EventForm.tsx`)

- [ ] Deck picker (create mode): "+ Add deck" next to it (no Edit deck),
      replacing the "create a deck" link in the hint. How it works is still
      open (below)

### Shared components

- [ ] `FormatSelect` and `OpponentArchetypeSelect` are ~90% the same (see the
      TODO in both). Merging them into one picker with the add and edit
      buttons is the natural way to apply rule 2 to both, and the event
      form's deck picker could use it too.

## Open questions

- **How "+ Add deck" works in the event form.** The deck form is a full
  page, not a dialog, so the button either leaves the event form or the deck
  form has to open in a dialog. Undecided, since a dialog is a big change.

## Decided

- The event form's deck picker gets no "Edit deck".
- The archetype page's deck filter stays view-only.
- Deleting a match moves into its Edit dialog, the same as everything else.
