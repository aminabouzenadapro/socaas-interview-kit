# SOCaaS interview kit

Field-interview website for the market study of our final-year project: a 24/7 SOC as a Service for Algerian companies.

## What it does

- **Guides**: one short interview guide (6 to 9 questions, 10 to 15 minutes) per profile we meet (SME owner, IT manager, CISO, e-commerce founder, cybersecurity expert, post-graduate / academic, incubator, integrator / provider, legal expert). French and English, switch with the button in the top bar.
- **Interview form**: fill it in during the meeting. Every question is a choice question, with an "Autre / Other" chip that opens a free-text field where useful, plus a notes field on every question, a timer, and autosave.
- **No pitch**: the guides never present the project. They only ask about the interviewee's situation, needs and budget, so the offer can be adapted to the real market.
- **Price simulator** (team only, at `#/pricing`, not linked in the menu): computes a monthly quote from the draft pricing table.
- **Report**: a printable summary of each interview (Print / PDF).
- **Insights**: hypothesis scoreboard (H1 to H8), answer distributions, and notes grouped by Business Model Canvas block.

## Run it

No build step and no server. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Where the data goes

Interviews are always saved in the browser first (localStorage), so the form works without a connection.

Without a shared database, you move data between devices by hand: **Interviews → Export (JSON)** on one device, then **Import (JSON)** on the other.

Exports contain personal data. Do not commit them (the `.gitignore` already excludes the default file names).

## Shared database

The site syncs every interview with a Supabase table, so all team devices see the same data. Each device still keeps its own copy and syncs when it is online; if two people edit the same interview, the most recent save wins. The cloud icon in the top bar shows the sync state; tap it to sync now.

There is no sign-in. The project URL and publishable key in `config.js` are public, so anyone who finds them can read and change the interviews. Avoid storing phone numbers or emails in the records.

To use another Supabase project: run `supabase-setup.sql` in its SQL editor, then put its URL and publishable key in `config.js`.

## Editing the questions

In the site: open a guide and tap **✎ Modifier les questions**. You can reword a question, change its answer type and choices, reorder, remove, add a new question or pick an existing one. Changes save automatically and are shared with the team through the database.

Questions store choice answers by position, so once a question has answers, add new choices at the end instead of deleting or reordering.

In the code:

Everything is in `data.js`: questions, profiles, hypotheses and the pricing table. Each text is `[French, English]`. The guides are kept short on purpose; `data.js` also holds reserve questions that you can add to a profile by putting their id in its list.
