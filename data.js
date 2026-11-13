/* Interview content: questions, profiles, hypotheses, pricing.
   Every text is [French, English]. Edit freely: the app adapts. */
(function () {
  const Q = {};
  // q(id, type, bmcTag, fr, en, extra)
  // types: text | yn | scale | single | multi | num
  // extra: o (options), h (hint / follow-ups), key (must-ask), hyp + sup (hypothesis + rule)
  const q = (id, type, bmc, fr, en, extra) => { Q[id] = Object.assign({ id, type, bmc, t: [fr, en] }, extra || {}); };

  /* ---------- Context ---------- */
  q("c_role", "text", "seg", "Pouvez-vous présenter votre entreprise et votre rôle ?", "Can you describe your company and your role?",
    { h: ["Activité, effectif, nombre de postes et de serveurs, qui gère l'informatique.", "Activity, headcount, number of endpoints and servers, who runs IT."] });
  q("c_it_dep", "scale", "seg", "À quel point votre activité dépend-elle de l'informatique ?", "How much does your business depend on IT?",
    { h: ["1 = on peut travailler sans · 5 = tout s'arrête sans informatique.", "1 = we can work without it · 5 = everything stops without IT."] });
  q("c_it_who", "single", "seg", "Qui gère l'informatique et la sécurité aujourd'hui ?", "Who manages IT and security today?",
    { key: 1, o: [["Personne en particulier", "Nobody in particular"], ["Un employé polyvalent", "A non-specialist employee"], ["Un informaticien interne", "One in-house IT person"], ["Une équipe IT interne", "An in-house IT team"], ["Une équipe sécurité dédiée", "A dedicated security team"], ["Un prestataire externe", "An external provider"]] });
  q("c_downtime", "text", "vp", "Que vous coûterait une journée complète d'arrêt de vos systèmes ?", "What would a full day of system downtime cost you?",
    { h: ["Chiffre d'affaires perdu, pénalités, image. Demandez un ordre de grandeur en DA.", "Lost revenue, penalties, reputation. Ask for an order of magnitude in DA."] });

  /* ---------- Problem (past facts, no pitch) ---------- */
  q("p_incident", "yn", "vp", "Avez-vous subi un incident de sécurité ces 24 derniers mois ?", "Have you had a security incident in the last 24 months?",
    { key: 1, hyp: "H2", sup: v => v === "y", h: ["Phishing, virus, ransomware, site piraté, fraude. Si oui : que s'est-il passé, combien de temps, combien cela a-t-il coûté ? Notez le récit.", "Phishing, malware, ransomware, hacked site, fraud. If yes: what happened, how long, what did it cost? Write the story down."] });
  q("p_incident_story", "text", "vp", "Racontez le dernier incident : que s'est-il passé ?", "Tell us about the last incident: what happened?",
    { key: 1, h: ["Comment l'avez-vous découvert ? Après combien de temps ? Qui a réagi ? Combien cela a-t-il coûté ? Qu'avez-vous changé ensuite ?", "How did you find out? After how long? Who reacted? What did it cost? What did you change afterwards?"] });
  q("p_fear", "multi", "vp", "Quelles menaces vous inquiètent le plus ?", "Which threats worry you most?",
    { o: [["Phishing / vol de comptes", "Phishing / account theft"], ["Ransomware", "Ransomware"], ["Fuite de données", "Data leak"], ["Piratage / défacement du site web", "Website hack / defacement"], ["Fraude au paiement", "Payment fraud"], ["Menace interne", "Insider threat"], ["Indisponibilité (DDoS, panne)", "Downtime (DDoS, outage)"], ["Aucune en particulier", "None in particular"]] });
  q("p_detect", "single", "vp", "Si un attaquant entrait dans votre réseau cette nuit à 2h, quand le sauriez-vous ?", "If an attacker got into your network tonight at 2am, when would you know?",
    { noOther: 1, key: 1, hyp: "H1", sup: v => v !== 0, o: [["Immédiatement (surveillance 24/7)", "Immediately (24/7 monitoring)"], ["Le lendemain matin", "The next morning"], ["Après quelques jours", "After a few days"], ["Probablement jamais", "Probably never"], ["Je ne sais pas", "I don't know"]] });
  q("p_priority", "scale", "seg", "Quelle priorité la direction donne-t-elle à la cybersécurité ?", "How high a priority is cybersecurity for management?",
    { h: ["1 = pas un sujet · 5 = priorité stratégique avec budget.", "1 = not a topic · 5 = strategic priority with a budget."] });

  /* ---------- Current solutions ---------- */
  q("s_tools", "multi", "comp", "Quelles protections avez-vous en place aujourd'hui ?", "Which protections do you have in place today?",
    { key: 1, o: [["Antivirus", "Antivirus"], ["Pare-feu", "Firewall"], ["Sauvegardes", "Backups"], ["Sauvegardes hors ligne et testées", "Offline, tested backups"], ["EDR / XDR", "EDR / XDR"], ["SIEM / centralisation des logs", "SIEM / central logging"], ["Authentification forte (MFA)", "Multi-factor authentication"], ["Surveillance 24/7", "24/7 monitoring"], ["Rien de particulier", "Nothing in particular"]] });
  q("s_spend", "single", "rev", "Quel est votre budget annuel approximatif pour la sécurité informatique ?", "What is your approximate yearly IT security budget?",
    { o: [["Moins de 100 000 DA", "Under 100,000 DA"], ["100 000 – 500 000 DA", "100,000 – 500,000 DA"], ["500 000 – 2 M DA", "500,000 – 2M DA"], ["2 M – 10 M DA", "2M – 10M DA"], ["Plus de 10 M DA", "Over 10M DA"], ["Pas de budget défini / ne sait pas", "No defined budget / don't know"]] });
  q("s_providers", "text", "comp", "Avez-vous déjà fait appel à un prestataire de sécurité ? Lequel, pour quoi, à quel prix ?", "Have you ever used a security provider? Which one, for what, at what price?",
    { h: ["Audit, pentest, intégrateur, SOC. Étiez-vous satisfait ? Pourquoi avoir arrêté ou continué ?", "Audit, pentest, integrator, SOC. Were you satisfied? Why did you stop or continue?"] });
  q("s_soc_considered", "single", "seg", "Avez-vous déjà envisagé une surveillance continue (SOC) ?", "Have you ever considered continuous monitoring (a SOC)?",
    { key: 1, o: [["Je ne connaissais pas", "Never heard of it"], ["Connu, jamais envisagé", "Known, never considered"], ["Envisagé puis abandonné", "Considered then dropped"], ["Devis demandé", "Asked for a quote"], ["Déjà abonné / en place", "Already subscribed / in place"]] });
  q("s_soc_blockers", "multi", "risk", "Qu'est-ce qui vous a freiné ou vous freinerait ?", "What held you back, or would hold you back?",
    { key: 1, hyp: "H3", sup: v => v.some(i => i <= 2), o: [["Prix trop élevé", "Price too high"], ["Prix non publiés (sur devis)", "No public prices (quote only)"], ["Réservé aux banques / grands comptes", "Only for banks / large accounts"], ["Pas de besoin ressenti", "No perceived need"], ["Manque de confiance dans le prestataire", "Lack of trust in the provider"], ["Données hébergées à l'étranger", "Data hosted abroad"], ["Paiement en devises", "Payment in foreign currency"], ["Trop complexe à mettre en place", "Too complex to set up"], ["Engagement trop long", "Commitment too long"]] });

  /* ---------- Requirements ---------- */
  q("r_hosting", "scale", "vp", "Quelle importance a pour vous l'hébergement de vos données de sécurité en Algérie ?", "How important is it that your security data stays hosted in Algeria?",
    { key: 1, hyp: "H4", sup: v => v >= 4, h: ["1 = indifférent · 5 = obligatoire. Demandez pourquoi (loi, client, direction).", "1 = don't care · 5 = mandatory. Ask why (law, customers, management)."] });
  q("r_dzd", "scale", "rev", "Quelle importance a le paiement en DA sur facture locale ?", "How important is paying in DA with a local invoice?",
    { hyp: "H5", sup: v => v >= 4, h: ["1 = indifférent · 5 = indispensable. Ont-ils déjà payé un service en devises ?", "1 = don't care · 5 = essential. Have they ever paid for a service in foreign currency?"] });
  q("r_lang", "single", "vp", "Dans quelle langue voulez-vous recevoir les rapports ?", "In which language do you want the reports?",
    { hyp: "H6", sup: v => v !== 2, o: [["Français", "French"], ["Arabe", "Arabic"], ["Anglais", "English"], ["Français + arabe", "French + Arabic"]] });
  q("r_alert_channel", "multi", "cr", "Comment voulez-vous être alerté en cas d'incident critique ?", "How do you want to be alerted about a critical incident?",
    { o: [["E-mail", "Email"], ["Appel téléphonique", "Phone call"], ["SMS", "SMS"], ["WhatsApp", "WhatsApp"], ["Telegram", "Telegram"], ["Portail client", "Client portal"]] });
  q("r_compliance", "multi", "vp", "Quelles obligations réglementaires ou normes vous concernent ?", "Which regulations or standards apply to you?",
    { o: [["Loi 18-07 (données personnelles)", "Law 18-07 (personal data)"], ["Décret 20-05 / référentiel ASSI", "Decree 20-05 / ASSI framework"], ["Règles Banque d'Algérie", "Banque d'Algérie rules"], ["ISO 27001", "ISO 27001"], ["PCI DSS", "PCI DSS"], ["Exigences de clients / donneurs d'ordre", "Customer / contractor requirements"], ["Aucune", "None"], ["Je ne sais pas", "I don't know"]] });

  q("r_matters", "multi", "vp", "Qu'est-ce qui compterait vraiment pour vous dans un tel service ?", "What would really matter to you in such a service?",
    { hyps: { H4: v => v.includes(0), H5: v => v.includes(1), H6: v => v.includes(2) },
      h: ["Laissez-les répondre spontanément, puis cochez. Ne lisez la liste que s'ils hésitent.", "Let them answer spontaneously, then tick. Read the list only if they hesitate."],
      o: [["Données hébergées en Algérie", "Data hosted in Algeria"], ["Paiement en DA sur facture locale", "Payment in DA with a local invoice"], ["Rapports en français ou en arabe", "Reports in French or Arabic"], ["Alertes sur WhatsApp / SMS", "Alerts on WhatsApp / SMS"], ["Prix publics, sans devis", "Public prices, no quote"], ["Pas d'engagement long", "No long commitment"], ["Un analyste dédié", "A dedicated analyst"], ["Aide à la conformité", "Compliance help"]] });

  /* ---------- Offer reaction (after the pitch) ---------- */
  q("o_reaction", "scale", "vp", "Après présentation : quel est votre intérêt pour cette offre ?", "After the pitch: how interested are you in this offer?",
    { key: 1, h: ["1 = aucun · 5 = je veux commencer. Notez la première réaction spontanée, mot pour mot.", "1 = none · 5 = I want to start. Write down the first spontaneous reaction, word for word."] });
  q("o_services", "multi", "vp", "Quels services vous intéressent le plus ?", "Which services interest you most?",
    { key: 1, o: [["Surveillance de base (SIEM + EDR + alertes)", "Core monitoring (SIEM + EDR + alerts)"], ["Analystes 24/7", "24/7 analysts"], ["Réponse active (isoler, bloquer)", "Active response (isolate, block)"], ["Threat hunting", "Threat hunting"], ["Heures de réponse à incident", "Incident response hours"], ["Surveillance dark web / fuites .dz", "Dark web / .dz leak monitoring"], ["Rapports de conformité algériens", "Algerian compliance reports"], ["Analyste dédié nommé", "Dedicated named analyst"], ["Surveillance du site web", "Website monitoring"], ["Fraude e-paiement (CIB/Edahabia)", "E-payment fraud (CIB/Edahabia)"], ["Simulation de phishing + formation", "Phishing simulation + training"], ["Test de préparation ransomware", "Ransomware readiness check"], ["Pentest léger", "Light pentest"]] });
  q("o_price_fair", "single", "rev", "Le prix calculé pour votre taille vous semble :", "The price computed for your size seems:",
    { noOther: 1, key: 1, hyp: "H7", sup: v => v === 1 || v === 2, h: ["Montrez d'abord le simulateur avec leur nombre d'utilisateurs. Notez ensuite le budget mensuel qu'ils jugeraient acceptable.", "Show the simulator with their number of users first. Then note the monthly budget they would find acceptable."],
      o: [["Tellement bas que je doute de la qualité", "So low I doubt the quality"], ["Une bonne affaire", "A good deal"], ["Correct", "Fair"], ["Cher, à réfléchir", "Expensive, needs thought"], ["Trop cher, hors de question", "Too expensive, out of the question"]] });
  q("o_wtp", "num", "rev", "Quel budget mensuel maximum seriez-vous prêt à y consacrer ?", "What is the maximum monthly budget you would spend on it?",
    { unit: "DA", h: ["Laissez-les donner un chiffre, ne proposez pas le vôtre.", "Let them name a figure, do not suggest yours."] });
  q("o_model", "single", "rev", "Quel mode de tarification préférez-vous ?", "Which pricing model do you prefer?",
    { o: [["Par utilisateur, services à la carte", "Per user, services à la carte"], ["Packs fixes (Bronze / Argent / Or)", "Fixed packs (Bronze / Silver / Gold)"], ["Forfait annuel négocié", "Negotiated yearly flat fee"], ["Sur devis", "On quote"]] });
  q("o_trust", "multi", "risk", "Qu'est-ce qui vous donnerait confiance dans un nouveau prestataire algérien ?", "What would make you trust a new Algerian provider?",
    { key: 1, o: [["Pilote gratuit de 30 jours", "Free 30-day pilot"], ["Références clients", "Customer references"], ["Certification ISO 27001", "ISO 27001 certification"], ["Agrément / reconnaissance officielle", "Official approval / recognition"], ["Partenariat universitaire", "University partnership"], ["Contrat avec SLA et pénalités", "Contract with SLA and penalties"], ["Visite du SOC", "Visiting the SOC"], ["Accord de confidentialité (NDA)", "Non-disclosure agreement"]] });
  q("o_pilot", "yn", "ch", "Accepteriez-vous un pilote gratuit de 30 jours dans les prochains mois ?", "Would you accept a free 30-day pilot in the coming months?",
    { key: 1, hyp: "H8", sup: v => v === "y", h: ["Un vrai oui = une date ou un contact technique. Sinon, notez « oui poli ».", "A real yes = a date or a technical contact. Otherwise write « polite yes »."] });
  q("o_decider", "text", "ch", "Qui décide de ce type d'achat et comment se passe le processus ?", "Who decides on this kind of purchase, and what is the process?",
    { h: ["Signataire, délais, consultation ou appel d'offres, période budgétaire.", "Signatory, lead time, tender or consultation, budget period."] });
  q("o_channels", "multi", "ch", "Comment trouvez-vous habituellement vos prestataires informatiques ?", "How do you usually find your IT providers?",
    { o: [["Bouche-à-oreille", "Word of mouth"], ["Intégrateur / revendeur habituel", "Usual integrator / reseller"], ["LinkedIn", "LinkedIn"], ["Facebook", "Facebook"], ["Salons et événements", "Trade shows and events"], ["Recherche web", "Web search"], ["Appels d'offres", "Tenders"]] });

  /* ---------- IT manager ---------- */
  q("t_assets", "text", "seg", "Combien de postes, serveurs et sites avez-vous ?", "How many endpoints, servers and sites do you have?",
    { key: 1, h: ["Windows / Linux / Mac, serveurs sur site ou hébergés, télétravail.", "Windows / Linux / Mac, on-prem or hosted servers, remote work."] });
  q("t_infra", "multi", "seg", "Quels éléments composent votre infrastructure ?", "What is your infrastructure made of?",
    { o: [["Active Directory", "Active Directory"], ["Microsoft 365 / Google Workspace", "Microsoft 365 / Google Workspace"], ["Messagerie hébergée en local", "Locally hosted email"], ["ERP / application métier sur site", "On-prem ERP / business app"], ["Cloud étranger (AWS, Azure…)", "Foreign cloud (AWS, Azure…)"], ["Hébergeur algérien", "Algerian hosting provider"], ["Site web / e-commerce", "Website / e-commerce"], ["Réseau industriel (OT/SCADA)", "Industrial network (OT/SCADA)"]] });
  q("t_logs", "single", "vp", "Où vont vos journaux (logs) aujourd'hui ?", "Where do your logs go today?",
    { noOther: 1, key: 1, hyp: "H1", sup: v => v <= 1, o: [["Nulle part / non conservés", "Nowhere / not kept"], ["Sur chaque machine, jamais consultés", "On each machine, never reviewed"], ["Centralisés, consultés après un problème", "Centralised, reviewed after a problem"], ["SIEM avec alertes", "SIEM with alerts"]] });
  q("t_time", "text", "vp", "Combien de temps par semaine consacrez-vous à la sécurité, et à quoi ?", "How much time per week do you spend on security, and on what?",
    { h: ["Que voudriez-vous ne plus avoir à faire ?", "What would you like to stop having to do?"] });
  q("t_backup", "yn", "vp", "Avez-vous testé une restauration complète de vos sauvegardes cette année ?", "Have you tested a full restore of your backups this year?");
  q("t_agent", "scale", "risk", "Seriez-vous à l'aise pour installer un agent sur vos postes et serveurs ?", "How comfortable are you installing an agent on your endpoints and servers?",
    { key: 1, h: ["1 = refus · 5 = aucun problème. Quelles craintes : performance, confidentialité, droits admin ?", "1 = refusal · 5 = no problem. Which fears: performance, privacy, admin rights?"] });
  q("t_active", "single", "vp", "Accepteriez-vous que le SOC isole un poste infecté à votre place ?", "Would you let the SOC isolate an infected host for you?",
    { o: [["Oui, automatiquement", "Yes, automatically"], ["Oui, après ma validation (un clic sur WhatsApp)", "Yes, after my approval (one tap on WhatsApp)"], ["Seulement hors heures de travail", "Only outside working hours"], ["Non, jamais", "No, never"]] });
  q("t_concerns", "text", "risk", "Quelles seraient vos conditions ou inquiétudes pour envoyer vos logs à un prestataire ?", "What conditions or worries would you have about sending your logs to a provider?",
    { h: ["Confidentialité, tunnel VPN, bande passante, accès aux données, réversibilité.", "Confidentiality, VPN tunnel, bandwidth, data access, exit plan."] });

  /* ---------- CISO / regulated ---------- */
  q("g_soc_current", "single", "comp", "Comment la surveillance de sécurité est-elle assurée aujourd'hui ?", "How is security monitoring handled today?",
    { key: 1, o: [["SOC interne 24/7", "In-house 24/7 SOC"], ["SOC interne, heures ouvrables", "In-house SOC, business hours"], ["SOC externalisé à un prestataire algérien", "Outsourced to an Algerian provider"], ["SOC externalisé à un prestataire étranger", "Outsourced to a foreign provider"], ["Pas de SOC", "No SOC"]] });
  q("g_audit", "text", "vp", "Quels contrôles ou audits réglementaires avez-vous, et que vous demandent-ils ?", "Which regulatory audits do you face, and what do they ask for?",
    { h: ["Quels rapports devez-vous produire ? Combien de temps cela prend-il ?", "Which reports must you produce? How long does it take?"] });
  q("g_requirements", "multi", "risk", "Quelles conditions un prestataire SOC doit-il remplir pour travailler avec vous ?", "What must a SOC provider meet to work with you?",
    { key: 1, o: [["Hébergement 100 % en Algérie", "100% hosting in Algeria"], ["ISO 27001", "ISO 27001"], ["Agrément / homologation officielle", "Official approval / accreditation"], ["Références dans le secteur", "References in the sector"], ["SLA avec pénalités", "SLA with penalties"], ["Habilitation du personnel", "Staff vetting"], ["Audit du prestataire par nos équipes", "Provider audit by our teams"], ["Ancienneté de l'entreprise", "Company track record"]] });
  q("g_hybrid", "single", "vp", "Quel modèle vous intéresserait le plus ?", "Which model would interest you most?",
    { noOther: 1, o: [["SOC entièrement externalisé", "Fully outsourced SOC"], ["SOC co-géré (renfort nuit / week-end)", "Co-managed SOC (night / weekend cover)"], ["Services ponctuels (hunting, réponse à incident)", "One-off services (hunting, incident response)"], ["Flux de renseignement local uniquement", "Local threat feed only"], ["Aucun", "None"]] });
  q("g_ti", "scale", "vp", "Quelle valeur aurait pour vous un flux de menaces local (.dz, CIB/Edahabia, BaridiMob) ?", "How valuable would a local threat feed (.dz, CIB/Edahabia, BaridiMob) be to you?",
    { h: ["1 = aucune · 5 = très forte. Quelles sources utilisent-ils aujourd'hui ?", "1 = none · 5 = very high. Which sources do they use today?"] });

  /* ---------- E-commerce / startup ---------- */
  q("e_host", "text", "seg", "Où et par qui votre site ou application est-il hébergé et maintenu ?", "Where and by whom is your site or app hosted and maintained?");
  q("e_down", "text", "vp", "Votre site a-t-il déjà été indisponible ou piraté ? Combien cela vous a-t-il coûté ?", "Has your site ever been down or hacked? What did it cost you?");
  q("e_web_interest", "scale", "vp", "Intérêt pour la surveillance du site (défacement, malware, disponibilité) à 10 000 DA/mois ?", "Interest in website monitoring (defacement, malware, uptime) at 10,000 DA/month?");
  q("e_fraud_interest", "scale", "vp", "Intérêt pour la détection de fraude e-paiement à 50 000 DA/mois ?", "Interest in e-payment fraud detection at 50,000 DA/month?");

  /* ---------- Expert ---------- */
  q("x_bg", "text", "par", "Quel est votre parcours et votre expérience des SOC ?", "What is your background and SOC experience?", { key: 1 });
  q("x_demand", "scale", "seg", "Selon vous, les PME algériennes sont-elles prêtes à payer pour un SOC ?", "In your view, are Algerian SMEs ready to pay for a SOC?",
    { h: ["1 = pas du tout · 5 = tout à fait. Quels secteurs en premier ?", "1 = not at all · 5 = definitely. Which sectors first?"] });
  q("x_stack", "scale", "res", "La pile open source (Wazuh, Suricata, MISP, TheHive, Shuffle) est-elle crédible en production ?", "Is the open-source stack (Wazuh, Suricata, MISP, TheHive, Shuffle) credible in production?",
    { h: ["1 = non · 5 = oui. Que remplaceriez-vous, et par quoi ?", "1 = no · 5 = yes. What would you replace, and with what?"] });
  q("x_diff", "multi", "vp", "Lesquels de nos différenciateurs ont le plus de valeur ?", "Which of our differentiators are the most valuable?",
    { o: [["Prix publics en DA", "Public prices in DA"], ["Hébergement 100 % algérien", "100% Algerian hosting"], ["Rapports en arabe et français", "Reports in Arabic and French"], ["Flux de menaces local .dz", "Local .dz threat feed"], ["Alertes WhatsApp / Telegram / SMS", "WhatsApp / Telegram / SMS alerts"], ["Assistant IA arabe / français", "Arabic / French AI assistant"], ["Rapports de conformité algériens", "Algerian compliance reports"], ["Services à la carte dès 10 utilisateurs", "À la carte services from 10 users"], ["Score de sécurité sur 100", "Security score out of 100"]] });
  q("x_pricing", "single", "rev", "Nos prix (1 500 → 700 DA par utilisateur et par mois) vous semblent :", "Our prices (1,500 → 700 DA per user per month) seem:",
    { noOther: 1, key: 1, o: [["Trop bas pour être rentables", "Too low to be profitable"], ["Bas mais tenables", "Low but sustainable"], ["Réalistes", "Realistic"], ["Trop élevés pour le marché", "Too high for the market"]] });
  q("x_cost", "text", "cost", "Quels sont les principaux coûts que nous risquons de sous-estimer ?", "Which main costs are we likely to underestimate?",
    { h: ["Stockage des logs, hébergement, astreintes, support, intégration de chaque client.", "Log storage, hosting, on-call, support, onboarding each client."] });
  q("x_reg", "text", "risk", "Quelles autorisations ou contraintes réglementaires devons-nous anticiper ?", "Which authorisations or regulatory constraints should we anticipate?");
  q("x_advisor", "yn", "par", "Accepteriez-vous de nous suivre comme mentor ou de relire nos livrables ?", "Would you agree to mentor us or review our deliverables?",
    { h: ["Et qui d'autre devrions-nous rencontrer ?", "And who else should we meet?"] });

  /* ---------- Academic / post-graduate ---------- */
  q("a_bg", "text", "par", "Quel est votre parcours et votre domaine de recherche ou de spécialité ?", "What is your background and research or speciality area?", { key: 1 });
  q("a_skills", "multi", "res", "Quelles compétences SOC maîtrisez-vous déjà ?", "Which SOC skills do you already have?",
    { o: [["Analyse de logs / SIEM", "Log analysis / SIEM"], ["Wazuh / Elastic", "Wazuh / Elastic"], ["Analyse réseau (Suricata, Zeek)", "Network analysis (Suricata, Zeek)"], ["Forensique", "Forensics"], ["Analyse de malware", "Malware analysis"], ["Threat intelligence (MISP)", "Threat intelligence (MISP)"], ["Scripts / automatisation", "Scripting / automation"], ["Pentest", "Pentest"]] });
  q("a_feasible", "scale", "risk", "Le projet vous paraît-il réalisable par une équipe de fin d'études ?", "Does the project seem feasible for a final-year team?",
    { h: ["1 = irréaliste · 5 = tout à fait. Quel périmètre pour un prototype crédible ?", "1 = unrealistic · 5 = fully. What scope for a credible prototype?"] });
  q("a_analyst", "yn", "res", "Seriez-vous intéressé par un poste d'analyste SOC dans une startup algérienne ?", "Would you be interested in a SOC analyst job at an Algerian startup?", { key: 1 });
  q("a_shifts", "scale", "res", "Accepteriez-vous des horaires décalés (nuits, week-ends) ?", "Would you accept shift work (nights, weekends)?",
    { h: ["1 = non · 5 = sans problème. À quelles conditions ?", "1 = no · 5 = no problem. Under what conditions?"] });
  q("a_training", "multi", "act", "Quelle formation vous manquerait pour être opérationnel ?", "Which training would you need to be operational?",
    { o: [["Pratique sur incidents réels", "Practice on real incidents"], ["Outils SIEM / EDR", "SIEM / EDR tooling"], ["Réponse à incident", "Incident response"], ["Rédaction de rapports", "Report writing"], ["Certifications", "Certifications"], ["Communication client", "Client communication"]] });
  q("a_research", "text", "act", "Quels sujets de recherche pourraient enrichir le projet ?", "Which research topics could strengthen the project?",
    { h: ["Détection par IA, NLP arabe / darja pour le phishing, renseignement sur les menaces locales.", "AI detection, Arabic / Darja NLP for phishing, local threat intelligence."] });

  /* ---------- Incubator / accelerator ---------- */
  q("i_program", "text", "par", "Comment fonctionne votre programme d'accompagnement ?", "How does your support programme work?",
    { key: 1, h: ["Durée, sélection, calendrier des appels à candidatures, contreparties.", "Duration, selection, application calendar, what they ask in return."] });
  q("i_offer", "multi", "par", "Que proposez-vous aux startups accompagnées ?", "What do you offer the startups you support?",
    { o: [["Mentorat", "Mentoring"], ["Locaux / coworking", "Office / coworking"], ["Financement", "Funding"], ["Mise en relation clients", "Customer introductions"], ["Accompagnement juridique", "Legal support"], ["Aide au label startup", "Help with the startup label"], ["Crédits d'hébergement / cloud", "Hosting / cloud credits"], ["Formation business", "Business training"]] });
  q("i_fit", "scale", "par", "Notre projet correspond-il à ce que vous recherchez ?", "Does our project fit what you are looking for?",
    { key: 1, h: ["1 = pas du tout · 5 = tout à fait.", "1 = not at all · 5 = entirely."] });
  q("i_bmc", "text", "rev", "Que pensez-vous de notre modèle économique (abonnement mensuel par utilisateur) ?", "What do you think of our business model (monthly per-user subscription)?");
  q("i_funding", "text", "rev", "Quelles sources de financement recommandez-vous pour ce type de projet ?", "Which funding sources do you recommend for this kind of project?",
    { h: ["Label startup / projet innovant, Algerian Startup Fund, concours, subventions.", "Startup / innovative-project label, Algerian Startup Fund, competitions, grants."] });
  q("i_next", "text", "ch", "Quelles sont les prochaines étapes concrètes et les dates limites ?", "What are the concrete next steps and deadlines?", { key: 1 });

  /* ---------- Provider / integrator / partner ---------- */
  q("m_bg", "text", "par", "Pouvez-vous présenter votre société et vos clients types ?", "Can you describe your company and typical customers?", { key: 1 });
  q("m_services", "multi", "comp", "Quels services de sécurité proposez-vous aujourd'hui ?", "Which security services do you offer today?",
    { o: [["Vente et intégration de matériel / licences", "Hardware / licence sales and integration"], ["Infogérance", "Managed IT"], ["Audit", "Audit"], ["Pentest", "Pentest"], ["Surveillance 24/7 / SOC", "24/7 monitoring / SOC"], ["Réponse à incident", "Incident response"], ["Formation / sensibilisation", "Training / awareness"], ["Hébergement / cloud", "Hosting / cloud"]] });
  q("m_demand", "yn", "seg", "Vos clients vous demandent-ils de la surveillance continue ?", "Do your customers ask you for continuous monitoring?",
    { key: 1, h: ["Quels clients ? À quelle fréquence ? Que leur répondez-vous ?", "Which customers? How often? What do you tell them?"] });
  q("m_why", "text", "comp", "Pourquoi le SOC est-il si peu proposé aux PME en Algérie ?", "Why is SOC so rarely offered to SMEs in Algeria?");
  q("m_view", "scale", "vp", "Que pensez-vous de notre offre ?", "What do you think of our offer?",
    { h: ["1 = pas crédible · 5 = très pertinente.", "1 = not credible · 5 = very relevant."] });
  q("m_partner", "single", "par", "Quel type de collaboration vous intéresserait ?", "Which type of collaboration would interest you?",
    { noOther: 1, key: 1, o: [["Revendre notre service à vos clients", "Reselling our service to your customers"], ["Nous recommander contre commission", "Referring us for a commission"], ["Marque blanche", "White label"], ["Nous fournir hébergement / connectivité", "Providing us hosting / connectivity"], ["Aucune", "None"]] });
  q("m_terms", "text", "par", "Quelles conditions attendriez-vous d'un partenariat ?", "What terms would you expect from a partnership?",
    { h: ["Commission, exclusivité, support, formation de vos équipes.", "Commission, exclusivity, support, training your teams."] });
  q("m_hosting", "text", "cost", "Quelles options d'hébergement en Algérie recommandez-vous, et à quel coût ?", "Which hosting options in Algeria do you recommend, and at what cost?");

  /* ---------- Legal / compliance ---------- */
  q("l_bg", "text", "par", "Quelle est votre expérience en droit du numérique ou en conformité ?", "What is your experience in digital law or compliance?", { key: 1 });
  q("l_2005", "text", "vp", "Que demande concrètement le décret 20-05 aux organismes concernés ?", "What does Decree 20-05 concretely require from the bodies it covers?");
  q("l_hosting", "yn", "vp", "L'hébergement local est-il juridiquement obligatoire pour certains secteurs ?", "Is local hosting legally mandatory for some sectors?",
    { h: ["Lesquels ? Quel texte ?", "Which ones? Which text?"] });
  q("l_reports", "text", "vp", "Quels rapports de conformité les entreprises ont-elles le plus de mal à produire ?", "Which compliance reports do companies struggle most to produce?");
  q("l_risk", "scale", "risk", "Quel niveau de risque réglementaire voyez-vous pour notre projet ?", "What level of regulatory risk do you see for our project?",
    { h: ["1 = faible · 5 = bloquant.", "1 = low · 5 = blocking."] });

  /* ---------- Debrief (team only, right after the meeting) ---------- */
  q("d_takeaways", "text", "seg", "À retenir : 3 points et les citations exactes", "To remember: 3 points and the exact quotes", { key: 1 });
  q("d_quotes", "text", "vp", "Citations exactes à réutiliser dans le rapport", "Exact quotes to reuse in the report", { key: 1 });
  q("d_surprise", "text", "risk", "Ce qui nous a surpris ou contredit nos hypothèses", "What surprised us or contradicted our assumptions");
  q("d_signal", "single", "seg", "Niveau du signal", "Signal strength",
    { noOther: 1, key: 1, o: [["Fort : besoin réel + prêt à avancer", "Strong: real need + ready to move"], ["Moyen : intéressé, sans urgence", "Medium: interested, no urgency"], ["Faible : politesse, pas de besoin", "Weak: polite, no need"]] });

  /* ---------- Choice versions of the questions used in the guides ----------
     Single and multi questions get an automatic "Autre / Other" chip with a free-text field,
     unless noOther is set. */
  q("o_refer", "yn", "ch", "Pouvez-vous nous présenter à quelqu'un d'autre à rencontrer ?", "Can you introduce us to someone else we should meet?",
    { h: ["Si oui, notez le nom et le contact.", "If yes, write down the name and contact."] });
  q("e_pay", "multi", "seg", "Quels moyens de paiement acceptez-vous ?", "Which payment methods do you accept?",
    { o: [["CIB", "CIB"], ["Edahabia", "Edahabia"], ["BaridiMob", "BaridiMob"], ["Paiement à la livraison", "Cash on delivery"], ["Virement / CCP", "Bank transfer / CCP"]] });
  q("e_fraud", "multi", "vp", "Lesquels de ces problèmes avez-vous déjà eus ?", "Which of these problems have you already had?",
    { o: [["Fraude au paiement", "Payment fraud"], ["Faux comptes / fausses commandes", "Fake accounts / fake orders"], ["Bots, scraping", "Bots, scraping"], ["Site indisponible", "Site down"], ["Site piraté ou défacé", "Site hacked or defaced"], ["Vol de comptes clients", "Customer account theft"], ["Aucun", "None"]] });
  q("g_soc_pain", "multi", "comp", "Qu'est-ce qui fonctionne mal dans votre dispositif actuel ?", "What works badly in your current setup?",
    { o: [["Recrutement et turnover", "Hiring and turnover"], ["Trop de faux positifs", "Too many false positives"], ["Pas de couverture nuit / week-end", "No night / weekend coverage"], ["Coût des licences", "Licence cost"], ["Manque d'expertise (hunting, forensique)", "Lack of expertise (hunting, forensics)"], ["Rapports peu utiles", "Reports of little use"], ["Outils mal intégrés", "Poorly integrated tools"], ["Rien de particulier", "Nothing in particular"]] });
  q("g_procurement", "single", "ch", "Comment achetez-vous ce type de service ?", "How do you buy this kind of service?",
    { h: ["Notez le délai habituel et si une startup peut répondre.", "Note the usual lead time and whether a startup can bid."],
      o: [["Appel d'offres ouvert", "Open tender"], ["Consultation restreinte", "Restricted consultation"], ["Gré à gré", "Direct award"], ["Via un intégrateur référencé", "Through an approved integrator"]] });
  q("x_market", "multi", "comp", "Qu'est-ce qui manque le plus au marché SOC algérien ?", "What is most missing in the Algerian SOC market?",
    { o: [["Des offres pour les PME", "Offers for SMEs"], ["Des prix publics", "Public prices"], ["Des analystes qualifiés", "Skilled analysts"], ["Un hébergement local fiable", "Reliable local hosting"], ["Des clients plus matures", "More mature customers"], ["Du renseignement sur les menaces locales", "Local threat intelligence"], ["De la réponse à incident", "Incident response"], ["Un cadre réglementaire clair", "A clear regulatory framework"]] });
  q("x_arch", "single", "act", "Notre architecture en 4 couches (collecte, transport, plateforme, analystes) vous paraît :", "Our 4-layer architecture (collection, transport, platform, analysts) seems:",
    { noOther: 1, h: ["Notez le point faible qu'ils citent.", "Note the weak point they mention."],
      o: [["Solide", "Sound"], ["Correcte, avec des ajustements", "Fine, with adjustments"], ["Trop ambitieuse pour démarrer", "Too ambitious to start with"], ["À revoir", "Needs rethinking"]] });
  q("x_staff", "single", "res", "Combien d'analystes faut-il au minimum pour un vrai 24/7 ?", "How many analysts does real 24/7 need at minimum?",
    { o: [["3 à 4", "3 to 4"], ["5 à 6", "5 to 6"], ["7 à 8", "7 to 8"], ["9 ou plus", "9 or more"], ["Commencer en heures ouvrées + astreinte", "Start with business hours + on-call"]] });
  q("x_pitfalls", "multi", "risk", "Quelles erreurs voyez-vous le plus souvent dans les projets de SOC ?", "Which mistakes do you see most often in SOC projects?",
    { o: [["Trop d'alertes, fatigue des analystes", "Too many alerts, analyst fatigue"], ["Intégration des clients sous-estimée", "Client onboarding underestimated"], ["Vouloir tout faire dès le début", "Trying to do everything from day one"], ["Pas de procédures (playbooks)", "No procedures (playbooks)"], ["Turnover des analystes", "Analyst turnover"], ["Stockage des logs sous-estimé", "Log storage underestimated"], ["Mauvaise isolation entre clients", "Poor isolation between clients"], ["SLA impossibles à tenir", "SLAs that cannot be met"]] });
  q("x_mvp", "single", "act", "À notre place, par quoi commenceriez-vous ?", "In our place, what would you start with?",
    { o: [["Surveillance de base (SIEM + EDR)", "Core monitoring (SIEM + EDR)"], ["Surveillance de sites web", "Website monitoring"], ["Flux de menaces local .dz", "Local .dz threat feed"], ["Réponse à incident à la demande", "On-demand incident response"], ["Rapports de conformité", "Compliance reports"], ["Un pilote chez 2 ou 3 clients", "A pilot with 2 or 3 clients"]] });
  q("a_review", "multi", "risk", "Qu'est-ce qui vous paraît le plus fragile dans le projet ?", "What seems most fragile in the project?",
    { o: [["Périmètre trop large", "Scope too wide"], ["Tenir le 24/7 avec peu d'analystes", "Staffing 24/7 with few analysts"], ["Gagner la confiance des clients", "Earning customer trust"], ["Réglementation", "Regulation"], ["Rentabilité à ces prix", "Profitability at these prices"], ["Plateforme multi-clients", "Multi-tenant platform"], ["Rien de majeur", "Nothing major"]] });
  q("a_salary", "single", "cost", "Quel salaire mensuel net attendriez-vous pour un poste d'analyste N1 ?", "What net monthly salary would you expect as an L1 analyst?",
    { noOther: 1, o: [["Moins de 50 000 DA", "Under 50,000 DA"], ["50 000 – 80 000 DA", "50,000 – 80,000 DA"], ["80 000 – 120 000 DA", "80,000 – 120,000 DA"], ["Plus de 120 000 DA", "Over 120,000 DA"]] });
  q("a_partner", "multi", "par", "Quelle forme de partenariat avec votre université serait réaliste ?", "Which form of partnership with your university would be realistic?",
    { o: [["Stages", "Internships"], ["PFE et mémoires", "Final-year projects and theses"], ["Laboratoire commun", "Joint lab"], ["Accès à une plateforme de test", "Access to a test platform"], ["Convention de recherche", "Research agreement"], ["Formation d'analystes", "Analyst training"], ["Aucune pour l'instant", "None for now"]] });
  q("i_criteria", "multi", "par", "Quels critères comptent le plus dans votre sélection ?", "Which criteria matter most in your selection?",
    { o: [["L'équipe", "The team"], ["L'innovation", "Innovation"], ["La taille du marché", "Market size"], ["Un prototype qui fonctionne", "A working prototype"], ["Des premiers clients", "First customers"], ["Le modèle économique", "The business model"], ["L'impact national", "National impact"], ["Le label startup", "The startup label"]] });
  q("i_weak", "multi", "risk", "Quels sont les points faibles de notre dossier aujourd'hui ?", "What are the weak points of our application today?",
    { o: [["Pas de prototype", "No prototype"], ["Pas de preuve de marché", "No market proof"], ["Équipe sans profil commercial", "Team without a business profile"], ["Modèle économique fragile", "Fragile business model"], ["Risque réglementaire", "Regulatory risk"], ["Concurrence", "Competition"], ["Besoin de financement élevé", "High funding need"], ["Rien de majeur", "Nothing major"]] });
  q("i_proof", "multi", "seg", "Quelles preuves attendez-vous avant de nous accepter ?", "Which proof do you expect before accepting us?",
    { o: [["Des entretiens clients", "Customer interviews"], ["Des lettres d'intention", "Letters of intent"], ["Un pilote en cours", "A running pilot"], ["Un prototype ou une démo", "A prototype or demo"], ["Un premier client payant", "A first paying customer"], ["Une étude de marché chiffrée", "A market study with figures"]] });
  q("i_when", "single", "ch", "Quand a lieu votre prochaine sélection ?", "When is your next selection?",
    { o: [["Candidatures ouvertes en continu", "Applications open all year"], ["Dans moins de 3 mois", "Within 3 months"], ["Dans 3 à 6 mois", "In 3 to 6 months"], ["Pas de date prévue", "No date planned"]] });
  q("m_price", "single", "comp", "À quel prix mensuel un SOC pour PME se vend-il réellement sur le marché ?", "At what monthly price is an SME SOC actually sold on the market?",
    { noOther: 1, h: ["Notez la durée d'engagement et ce qui est inclus.", "Note the commitment length and what is included."],
      o: [["Moins de 50 000 DA", "Under 50,000 DA"], ["50 000 – 150 000 DA", "50,000 – 150,000 DA"], ["150 000 – 500 000 DA", "150,000 – 500,000 DA"], ["Plus de 500 000 DA", "Over 500,000 DA"], ["Ne sait pas / jamais vu", "Doesn't know / never seen one"]] });
  q("l_1807", "multi", "risk", "Quelles obligations de la loi 18-07 s'appliqueraient à notre SOC ?", "Which Law 18-07 obligations would apply to our SOC?",
    { o: [["Déclaration auprès de l'autorité", "Declaration to the authority"], ["Autorisation préalable", "Prior authorisation"], ["Contrat de sous-traitance avec chaque client", "Processing contract with each client"], ["Durée de conservation limitée", "Limited retention period"], ["Transfert à l'étranger encadré", "Restricted transfer abroad"], ["Notification des violations", "Breach notification"], ["Désigner un responsable", "Appointing a responsible person"]] });
  q("l_auth", "multi", "risk", "Quelles démarches faut-il avant de commercialiser le service ?", "Which steps are needed before selling the service?",
    { o: [["Registre de commerce avec l'activité adaptée", "Trade register with the right activity"], ["Agrément ou homologation de sécurité", "Security approval or accreditation"], ["Déclaration données personnelles", "Personal-data declaration"], ["Label startup", "Startup label"], ["Aucune démarche spécifique", "No specific step"], ["Ne sait pas", "Doesn't know"]] });
  q("l_contract", "multi", "risk", "Que doit absolument contenir notre contrat client ?", "What must our customer contract absolutely contain?",
    { o: [["Limitation de responsabilité", "Limitation of liability"], ["SLA", "SLA"], ["Confidentialité", "Confidentiality"], ["Clause de sous-traitance des données", "Data-processing clause"], ["Réversibilité et restitution des données", "Exit and data return"], ["Droit d'audit du client", "Customer audit right"], ["Assurance responsabilité civile", "Liability insurance"]] });
  q("l_timeline", "single", "risk", "Combien de temps prévoir pour être en règle avant le premier client ?", "How long should we plan to be compliant before the first customer?",
    { noOther: 1, o: [["Moins d'un mois", "Under a month"], ["1 à 3 mois", "1 to 3 months"], ["3 à 6 mois", "3 to 6 months"], ["Plus de 6 mois", "Over 6 months"]] });
  q("d_next", "multi", "ch", "Prochaines actions", "Next actions",
    { h: ["Notez qui s'en charge et pour quand.", "Note who does it and by when."],
      o: [["Envoyer un message de remerciement", "Send a thank-you message"], ["Envoyer la présentation", "Send the presentation"], ["Contacter la personne recommandée", "Contact the person they recommended"], ["Planifier un pilote", "Schedule a pilot"], ["Relancer plus tard", "Follow up later"], ["Aucune", "None"]] });

  /* ---------- Pitches (two sentences, no more) ---------- */
  const PITCH_CLIENT = [
    "Nous préparons un service de surveillance de sécurité 24/7, hébergé en Algérie et assuré par des analystes algériens. L'abonnement est mensuel, en DA, à prix publics à partir de 15 000 DA, avec des alertes sur WhatsApp et des rapports en français ou en arabe.",
    "We are preparing a 24/7 security monitoring service, hosted in Algeria and run by Algerian analysts. It is a monthly subscription in DA at public prices from 15,000 DA, with alerts on WhatsApp and reports in French or Arabic."];
  const PITCH_REVIEW = [
    "Notre projet de fin d'études : un SOC as a Service 24/7 hébergé en Algérie, vendu par abonnement mensuel en DA à prix publics, pour les entreprises de 10 à 250 utilisateurs. Il repose sur une pile open source (Wazuh, Suricata, MISP, TheHive, Shuffle) et un flux de menaces local .dz.",
    "Our final-year project: a 24/7 SOC as a Service hosted in Algeria, sold by monthly subscription in DA at public prices, for companies with 10 to 250 users. It runs on an open-source stack (Wazuh, Suricata, MISP, TheHive, Shuffle) and a local .dz threat feed."];

  /* Each guide is deliberately short: 6 to 9 questions for the interviewee, mostly one-tap answers.
     Every other question defined above is a reserve: add its id to a list below to use it. */
  const S = (fr, en, qs, extra) => Object.assign({ t: [fr, en], qs }, extra || {});
  const pitchC = { pitch: PITCH_CLIENT, sim: true };
  const pitchR = { pitch: PITCH_REVIEW };
  const debrief = S("Débrief (équipe, après la réunion)", "Debrief (team, after the meeting)", ["d_takeaways", "d_signal", "d_next"],
    { team: true, note: ["À remplir entre vous, sans l'interlocuteur.", "Fill in among yourselves, without the interviewee."] });
  const SIT = ["Leur situation", "Their situation"], OFF = ["Notre offre", "Our offer"];

  const PROFILES = [
    { id: "owner", icon: "🏢", n: ["Dirigeant de PME", "SME owner / manager"],
      who: ["Gérant, DG ou directeur financier d'une entreprise de 10 à 250 personnes.", "Owner, CEO or finance director of a 10 to 250-person company."],
      goal: ["Prouver que le problème existe et mesurer les freins à l'achat.", "Prove the problem exists and measure buying barriers."], dur: 12,
      sections: [
        S(SIT[0], SIT[1], ["c_it_who", "p_incident", "p_detect", "s_soc_blockers"]),
        pitchC,
        S(OFF[0], OFF[1], ["r_matters", "o_services", "o_price_fair", "o_pilot", "o_refer"]), debrief] },
    { id: "it", icon: "🖥️", n: ["Responsable informatique", "IT manager / sysadmin"],
      who: ["La personne qui gère les postes, les serveurs et le réseau au quotidien.", "The person running endpoints, servers and network day to day."],
      goal: ["Évaluer la posture de sécurité réelle et la faisabilité technique.", "Assess the real security posture and technical feasibility."], dur: 12,
      sections: [
        S(SIT[0], SIT[1], ["s_tools", "t_logs", "p_incident", "p_detect"]),
        pitchC,
        S(OFF[0], OFF[1], ["t_agent", "o_services", "o_pilot", "o_refer"]), debrief] },
    { id: "ciso", icon: "🏦", n: ["RSSI — banque, grand compte, organisme public", "CISO — bank, large account, public body"],
      who: ["Responsable sécurité d'une organisation réglementée ou de plus de 250 utilisateurs.", "Security lead at a regulated organisation or one with over 250 users."],
      goal: ["Comprendre les exigences réglementaires et les conditions d'entrée.", "Understand regulatory requirements and entry conditions."], dur: 15,
      sections: [
        S(SIT[0], SIT[1], ["g_soc_current", "g_soc_pain", "p_incident", "r_compliance"]),
        pitchC,
        S(OFF[0], OFF[1], ["g_requirements", "g_hybrid", "g_procurement", "o_refer"]), debrief] },
    { id: "ecom", icon: "🛒", n: ["Fondateur e-commerce / startup", "E-commerce / startup founder"],
      who: ["Fondateur ou CTO d'une boutique en ligne, fintech ou application avec paiement.", "Founder or CTO of an online shop, fintech or app with payments."],
      goal: ["Tester les services web et fraude, et la sensibilité au prix des petites structures.", "Test the website and fraud services, and price sensitivity of small teams."], dur: 12,
      sections: [
        S(SIT[0], SIT[1], ["e_pay", "p_incident", "e_fraud", "p_detect"]),
        pitchC,
        S(OFF[0], OFF[1], ["r_matters", "o_services", "o_price_fair", "o_pilot", "o_refer"]), debrief] },
    { id: "expert", icon: "🛡️", n: ["Expert cybersécurité / praticien SOC", "Cybersecurity expert / SOC practitioner"],
      who: ["Analyste, architecte ou responsable SOC, consultant expérimenté.", "Analyst, architect or SOC lead, experienced consultant."],
      goal: ["Faire critiquer l'architecture, la pile technique, les effectifs et les prix.", "Get the architecture, stack, staffing and prices challenged."], dur: 15,
      sections: [
        S("Le marché", "The market", ["x_market"]),
        pitchR,
        S("Votre avis", "Your view", ["x_arch", "x_stack", "x_staff", "x_pricing", "x_pitfalls", "x_mvp", "x_advisor"]), debrief] },
    { id: "academic", icon: "🎓", n: ["Doctorant / enseignant-chercheur", "Post-graduate student / academic"],
      who: ["Doctorants, étudiants de master et enseignants en sécurité informatique.", "PhD and master's students, and lecturers in IT security."],
      goal: ["Faire relire le projet et valider le vivier d'analystes.", "Get the project reviewed and validate the analyst pipeline."], dur: 10,
      sections: [
        pitchR,
        S("Votre avis", "Your view", ["a_review", "a_feasible"]),
        S("Travailler dans un SOC", "Working in a SOC", ["a_analyst", "a_salary", "a_training", "a_partner", "o_refer"]), debrief] },
    { id: "incubator", icon: "🚀", n: ["Incubateur / accélérateur", "Incubator / accelerator"],
      who: ["Responsable de programme, chargé d'accompagnement, mentor business.", "Programme manager, startup coach, business mentor."],
      goal: ["Connaître les critères de sélection et ce qui manque au dossier.", "Learn the selection criteria and what the application is missing."], dur: 10,
      sections: [
        S("Le programme", "The programme", ["i_offer", "i_criteria"]),
        pitchR,
        S("Votre avis", "Your view", ["i_fit", "i_weak", "i_proof", "i_when"]), debrief] },
    { id: "partner", icon: "🤝", n: ["Intégrateur / prestataire / hébergeur", "Integrator / provider / hosting company"],
      who: ["Intégrateur IT, société d'infogérance, hébergeur ou acteur sécurité déjà en place.", "IT integrator, managed-service company, hosting provider or existing security player."],
      goal: ["Comprendre les prix réels du marché et tester un canal de vente indirect.", "Understand real market prices and test an indirect sales channel."], dur: 10,
      sections: [
        S("Le marché", "The market", ["m_services", "m_demand", "m_price"]),
        pitchR,
        S("Travailler ensemble", "Working together", ["m_view", "m_partner", "o_refer"]), debrief] },
    { id: "legal", icon: "⚖️", n: ["Juriste / expert conformité", "Legal / compliance expert"],
      who: ["Avocat, juriste du numérique, auditeur ou consultant conformité.", "Lawyer, digital-law specialist, auditor or compliance consultant."],
      goal: ["Lever le risque réglementaire : loi 18-07, autorisations, contrats.", "Clear the regulatory risk: Law 18-07, authorisations, contracts."], dur: 10,
      sections: [
        pitchR,
        S("Cadre légal", "Legal framework", ["l_1807", "l_auth", "l_hosting"]),
        S("En pratique", "In practice", ["l_contract", "l_risk", "l_timeline"]), debrief] }
  ];

  const HYPS = [
    { id: "H1", t: ["Les entreprises n'ont pas de surveillance continue", "Companies have no continuous monitoring"] },
    { id: "H2", t: ["Elles ont déjà subi des incidents", "They have already suffered incidents"] },
    { id: "H3", t: ["Le prix, l'absence de prix publics et l'image « réservé aux banques » bloquent l'achat", "Price, no public prices and the « banks only » image block the purchase"] },
    { id: "H4", t: ["L'hébergement en Algérie compte", "Hosting in Algeria matters"] },
    { id: "H5", t: ["Le paiement en DA compte", "Paying in DA matters"] },
    { id: "H6", t: ["Les rapports doivent être en français ou en arabe", "Reports must be in French or Arabic"] },
    { id: "H7", t: ["Nos prix sont jugés acceptables", "Our prices are seen as acceptable"] },
    { id: "H8", t: ["Un pilote gratuit lève le manque de confiance", "A free pilot overcomes the lack of trust"] }
  ];

  const BMC = [
    ["seg", "Segments de clientèle", "Customer segments"], ["vp", "Proposition de valeur", "Value proposition"],
    ["ch", "Canaux", "Channels"], ["cr", "Relation client", "Customer relationships"],
    ["rev", "Sources de revenus", "Revenue streams"], ["res", "Ressources clés", "Key resources"],
    ["act", "Activités clés", "Key activities"], ["par", "Partenaires clés", "Key partners"],
    ["cost", "Structure de coûts", "Cost structure"], ["comp", "Concurrence", "Competition"], ["risk", "Risques de marché", "Market risks"]
  ];

  const RULES = [
    ["Annoncez la durée au début et tenez-la. Si le temps est écoulé, arrêtez-vous et remerciez.", "Announce the duration at the start and keep to it. When time is up, stop and say thank you."],
    ["Parlez de leur vie, pas de votre idée : le pitch vient après les questions sur leur situation.", "Talk about their life, not your idea: the pitch comes after the questions about their situation."],
    ["Demandez des faits passés (« la dernière fois que… »), pas des promesses (« achèteriez-vous… »).", "Ask about past facts (« the last time… »), not promises (« would you buy… »)."],
    ["Venez à deux : une personne parle, l'autre coche et note les mots exacts.", "Go in pairs: one talks, the other ticks and writes down exact words."],
    ["Un compliment n'est pas une preuve. Une date, un contact ou un budget en est une.", "A compliment is not evidence. A date, a contact or a budget is."]
  ];

  const CONSENT = [
    "Merci de nous recevoir. Nous sommes étudiants et nous étudions la cybersécurité des entreprises algériennes. Cela prend {d} minutes, et vos réponses restent anonymes. On peut commencer ?",
    "Thank you for meeting us. We are students studying cybersecurity in Algerian companies. It takes {d} minutes, and your answers stay anonymous. Shall we start?"];

  /* Pricing proposal from the project document (monthly, DA excl. tax). */
  const PRICING = {
    tiers: [[25, 1500], [100, 900], [250, 700]], min: 15000,
    perUser: [
      { id: "a247", t: ["Surveillance 24/7 par des analystes", "24/7 monitoring by analysts"], p: 300 },
      { id: "active", t: ["Réponse active (isoler, bloquer, désactiver)", "Active response (isolate, block, disable)"], p: 150 }
    ],
    choices: [
      { id: "hunt", t: ["Threat hunting", "Threat hunting"], per: "user", o: [[["Non", "No"], 0], [["Trimestriel", "Quarterly"], 150], [["Mensuel", "Monthly"], 300]] },
      { id: "ret", t: ["Conservation des logs", "Log retention"], per: "user", o: [[["3 mois (inclus)", "3 months (included)"], 0], [["6 mois", "6 months"], 50], [["12 mois", "12 months"], 100]] },
      { id: "ir", t: ["Heures de réponse à incident", "Incident response hours"], per: "flat", o: [[["Aucune", "None"], 0], [["4 h", "4 h"], 30000], [["10 h", "10 h"], 70000]] }
    ],
    flat: [
      { id: "dark", t: ["Surveillance dark web et fuites .dz", "Dark web and .dz leak monitoring"], p: 20000 },
      { id: "comp", t: ["Rapports de conformité algériens", "Algerian compliance reports"], p: 25000 },
      { id: "named", t: ["Analyste dédié nommé", "Dedicated named analyst"], p: 60000 },
      { id: "fraud", t: ["Fraude e-paiement (CIB/Edahabia)", "E-payment fraud (CIB/Edahabia)"], p: 50000 }
    ],
    site: 10000,
    oneoff: [
      { id: "phish", t: ["Simulation de phishing + formation (par campagne)", "Phishing simulation + training (per campaign)"], p: 40000 },
      { id: "ransom", t: ["Test de préparation ransomware", "Ransomware readiness check"], p: 120000 },
      { id: "pentest", t: ["Pentest léger", "Light pentest"], p: 200000 }
    ],
    setup: [[25, 25000], [100, 50000], [250, 100000]]
  };

  window.DATA = { Q, PROFILES, HYPS, BMC, RULES, CONSENT, PRICING };
})();
