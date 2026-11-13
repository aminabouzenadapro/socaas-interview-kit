# SOCaaS interview kit

Field-interview website for the market study of our final-year project: a 24/7 SOC as a Service for Algerian companies.

## What it does

- **Guides**: one short interview guide (6 to 9 questions, 10 to 15 minutes) per profile we meet (SME owner, IT manager, CISO, e-commerce founder, cybersecurity expert, post-graduate / academic, incubator, integrator / provider, legal expert). French and English, switch with the button in the top bar.
- **Interview form**: fill it in during the meeting. Every question is a choice question, with an "Autre / Other" chip that opens a free-text field where useful, plus a notes field on every question, a timer, and autosave.
- **Price simulator**: builds the monthly quote for the interviewee's number of users, to show before asking the pricing questions.
- **Report**: a printable summary of each interview (Print / PDF).
- **Insights**: hypothesis scoreboard (H1 to H8), answer distributions, and notes grouped by Business Model Canvas block.

## Run it

No build step and no server. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Where the data goes

Interviews are stored only in the browser you used (localStorage). Nothing is sent anywhere.

To share between team members: **Interviews → Export (JSON)** on one device, then **Import (JSON)** on the other. Records are merged by id and the most recent version wins.

Exports contain personal data. Do not commit them (the `.gitignore` already excludes the default file names).

## Editing the questions

Everything is in `data.js`: questions, profiles, hypotheses, pitch texts and the pricing table. Each text is `[French, English]`. The guides are kept short on purpose; `data.js` also holds reserve questions that you can add to a profile by putting their id in its list.
