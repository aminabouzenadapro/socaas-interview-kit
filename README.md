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

With a Supabase project configured, every signed-in team member sees the same interviews. Each device still keeps its own copy and syncs when it is online; if two people edit the same interview, the most recent save wins.

Setup, once:

1. Create a free project at supabase.com.
2. In **SQL Editor**, paste and run `supabase-setup.sql`. It creates the `interviews` table and allows access to signed-in users only.
3. In **Authentication → Sign In / Providers**, turn **off** "Allow new users to sign up". This matters: the site is public, and with sign-ups open anyone could create an account and read the interviews.
4. In **Authentication → Users**, add one user per team member (email + password, auto-confirmed).
5. In **Project Settings → API**, copy the Project URL and the `anon` (publishable) key into `config.js`, then commit and push. Never use the `service_role` key.

Then each member opens the site, taps **☁ Connexion** in the top bar and signs in once per device.

## Editing the questions

Everything is in `data.js`: questions, profiles, hypotheses and the pricing table. Each text is `[French, English]`. The guides are kept short on purpose; `data.js` also holds reserve questions that you can add to a profile by putting their id in its list.
