#!/usr/bin/env python3
"""Refresh questions.json (desk v1.2, 2026-10-16) with what the Box files already say.

Sources: the 2026-10-09 reconciliation checklist (Box 2516603706609), the 13 Oct
TransformingData white paper (Box 2524572032736) and the 14-15 Oct quarantine
logs (Box 2526930400140, 2527700745088). Idempotent: re-running gives the same file.
"""
import json
from pathlib import Path

P = Path(__file__).with_name("questions.json")
q = json.loads(P.read_text())

C, PA, AN, OP = "CONFLICT", "PARTLY ANSWERED", "ANSWERED BY CANON", "OPEN"

FILES = {
    "Q-01": (OP, "No file records your follower, contact, subscriber or pipeline counts. The numbers that do exist belong to Miah or to LettieNotes and will not be used for you.",
             ["Record today's LinkedIn follower and connection counts, with the date.",
              "Give the size and source of any email list, or say there is none.",
              "List open conversations (name, stage, date), or say zero."]),
    "Q-03": (PA, "No file shows a rate you were actually paid. What is on file: a $250,000 floor for employed roles ($250,000 to $400,000 range), a $150+ an hour screening target, an undated \"$220\" note, and a 2017 Zudy price list that does not name you.",
             ["Your hourly or day rate on Lam and on your latest contract (kept private).",
              "Are the \"$220\" and \"155\" figures in your notes hourly rates?",
              "Rule on the three open pricing approvals: $75,000 Tier 3 ceiling, $24,500 Tier 2 fallback, one-card rule."]),
    "Q-05": (OP, "Never decided. The plan models two cases: unchanged at 15 to 20 hours, or 5 to 8 hours. Miah's own hours for this work were reset to 20 a week on 1 October.",
             ["After a job: keep 15 to 20 hours, drop to 5 to 8, or stop? (May depend on Q-19.)"]),
    "Q-09": (OP, "Not in any file. LinkedIn's help pages could not be read automatically, so only your account settings can answer this.",
             ["Open LinkedIn settings and report: is Create newsletter available, is Creator Mode on, and what is the subscriber notification setting? A dated screenshot is enough."]),
    "Q-10": (C, "Your 13 Sep approval and the 21 Sep Fact Base say 24 engagements: 18 as Risk Partner, Project Director or Lead, 4 as SME, 2 as Data Quality Auditor (BackOffice 12+2, Accenture 9, Lam 1). The 17 Sep strategy says to publish \"more than twenty\" until you set the counting rule. Older tallies (27; 13/6/3/2) are still in some files.",
             ["Count by engagement or by role? Is 24 (18/4/2) final?",
              "Public wording: \"more than twenty\" or the exact 24?",
              "453 validations: the count for one cycle, or the total across Mock 2, Mock 3 and Dress Rehearsal? (The Claim Register says per cycle; the Fact Base says total.)"]),
    "Q-11": (C, "Both wordings are in use. July files and your live LinkedIn say you were recruited to teach and refine an existing protocol. From about 20 August, letters and the resume bullet say you designed and delivered it; some resumes say both. The 17 Sep rule: say \"teach and refine\" in anything public until you answer.",
             ["In one sentence: designed it, co-built it with the SMEs, or taught and refined an existing one?",
              "If designed: what existed before you arrived?",
              "Do letters already sent with \"designed and delivered\" need a correction if an interview follows?"]),
    "Q-12": (C, "Letters say you scored 89 percent (\"Master level\") on a DAMA exam taken without preparation, around the first week of August 2026. No score report, certificate, exam name or date is on file. Master certification needs Fundamentals plus two specialist exams at 80 percent.",
             ["Exact exam name and date, plus the score report or a portal screenshot.",
              "Was a certificate issued, and at what level, or was it a score only?",
              "Retire \"Scored at Master level\" and \"above the Master level\"?"]),
    "Q-15": (OP, "No course name or date is on file, only your 17 Sep recollection. Every resume lists Zudy as your only no-code work.",
             ["Class names or product taught, years, and rough number of cohorts.",
              "The power-user pass rate with cohort size, or agree it stays out of public material.",
              "May any former students be named? (See Q-13.)"]),
    "Q-04": (OP, "No Accenture, Lam or Magnit agreement text is in Box, and no file records what they say. The question whether BackOffice NDAs still apply to named clients has been open since 19 July.",
             ["Read the Accenture separation paperwork: does it limit publicity, client references, non-solicitation or engagement figures? Yes or no for each.",
              "Same four checks for the Lam/Magnit contract.",
              "Will an adviser review them before the site names Lam or Accenture?"]),
    "Q-19": (OP, "No employer's outside-activity policy is on file. The 17 Sep plan: if you take a job, pause consulting sales and publish only as the employer's policy allows. The 8 Oct session record notes (recollection) that a former Accenture boss asked whether you are available, with a likely rehire without interview; Accenture's policy would then apply.",
             ["For each live interview process, get the policy before accepting an offer.",
              "Agree now what happens to the newsletter and consulting on the day you accept a job."]),
    "Q-13": (C, "Files write \"Lam Research\", \"Dow\" or \"The Dow Chemical Company\", \"Purdue Pharma\" and \"Chevron Corporation\". The lost fifth name is probably Ahold Delhaize: four transcripts say \"Ahole Delhasie\" (an inference). No organisation has given written permission to be quoted. Three different cleared-for-public client lists are in use.",
             ["Is the fifth name Ahold Delhaize?",
              "Spellings for public use: Lam Research or LAM Research; Purdue Pharma?",
              "Pick one list: A, Eli Lilly, Kraft and Graybar only; B, also Novelis, SABMiller, Merck, Kautex and ExxonMobil; C, also Lam Research, Chevron, Dow and Exxon."]),
    "Q-23": (C, "The working assumption is still \"published content only\". A 29 Sep session decided to lift the exclusion for rbolmsted.com (Lam and Accenture named, Accenture clients by sector only), once you have read your agreements (Q-04). You have not approved the lift on record, and the 1 Oct summary does not mention it. Your live LinkedIn already names Lam, Accenture, 104 SMEs and 453 validations.",
             ["Confirm: the exclusion covers published content only; interviews and private talks are free, subject to your agreements.",
              "Approve or reject the 29 Sep lift for the site, and say whether it is site-only or wider.",
              "Does your LinkedIn profile count as published material?"]),
    "Q-20": (AN, "Not granted. The 17 Sep package contains proposed permission wording, but nothing records you signing it.",
             ["Sign or decline, and list which assets it covers.",
              "May the case study name you and rbolmsted.com, or must it be anonymised?"]),
    "NAME": (PA, "About 55 files still carry \"Olmsted Data Advisory\" or ODAG. No entity can contract for your consulting yet: Impact Arts Society is a nonprofit, Ellevate Creators LLC was dissolved in February 2025, and there is no Washington filing. No file names a registered agent.",
             ["Is TransformingData, LLC the firm name, or only the email domain?",
              "Which state, and who will be the registered agent?",
              "Check the name (state registry, USPTO, handles) before registering."]),
    "Q-08": (PA, "\"The Sign-Off\" is still a proposal. No availability check (domain, handle, trademark) is on file.",
             ["Accept, reject or replace \"The Sign-Off\".",
              "Does the newsletter run under rbolmsted, TransformingData, or its own brand?"]),
    "Q-22": (OP, "Nothing on file covers months 1 to 3. The plan assumes a bridge but does not model one.",
             ["Name the bridge (savings, your income, Miah's salary) and when it runs out.",
              "Is your Texas unemployment claim still active, and how will consulting income be reported against it?"]),
    "Q-21": (C, "The 17 Sep package marks it resolved as before tax, based on Miah's statement. The 1 Oct summary still lists it as open. Other figures on file do not agree with it, including Miah's $85,000+ employed floor and the household obligations total.",
             ["Miah: confirm before tax, and whether it is her draw or the household floor.",
              "Which figure governs your plan?"]),
    "Q-24": (OP, "No date is set. The plan says decide at a \"month six\" gate, but no file says when month one starts. The 29 Sep lift (Q-23) could make round two moot for the site.",
             ["Set the trigger: a date, or a condition such as agreements reviewed.",
              "Who at Lam and Accenture would give clearance, and for what?",
              "Does the 29 Sep lift replace the month-six gate for the site?"]),
    "JS-1": (PA, "Client Experience Application v2 still has blank [ADD YOUR ROLE] placeholders. Engagement History reached v6 and was sent with applications, with no approval on record.",
             ["Fill in the Client Experience Application, or retire it in favour of Engagement History v6.",
              "Merge the two (and Representative Clients 4) into one document?"]),
    "JS-2": (C, "Trackers say you applied on 19 July. Three Lyra resume files exist with different headlines, and which one was uploaded is not recorded. The leadership claims in the standalone version (\"every continent except Antarctica\", \"teams of hundreds\") were never verified.",
             ["Which file went in?",
              "Verify those leadership claims before any reuse."]),
    "JS-3": (C, "Files disagree on whether the custom Fujitsu version or the standard Consulting version was submitted on 16 July. The application was rejected, so this only matters for the record. The date is 16 July in triage and 23 July in the Texas work-search log.",
             ["Which file went in, or \"can't recall\"?",
              "Which date is correct for the Texas log?"]),
    "JS-4": (C, "The approved masters are still v24 and v22 (19 July). Since September, the unversioned Bob_Olmsted_Resume_2026.docx (last changed 20 Sep) has been the file used for 42 applications. A 4 Oct manifest says none of the later candidates passed the quality check.",
             ["Name one master and archive the rest.",
              "Do Databricks, Snowflake, SAP MDG and Informatica IDMC belong on the Skills line?"]),
    "LI-1": (PA, "Your live profile (29 Sep) says: executive roles and advisory engagements in Data Governance, Data Quality and SAP Data Transformation. No one-line target is approved.",
             ["Confirm that line or rewrite it.",
              "Is fractional CDO/CTO still a track?"]),
    "LI-2": (C, "Live headline (29 Sep): \"Data Governance & Data Quality Executive | 30+ Years, 24 Engagements, 18 as Risk Partner, Project Director, or Lead | SAP Data Migration | ...\". It went in outside the approval process, and \"30+ Years\" breaks the July \"no dates, no ages\" rule.",
             ["Keep it, or choose Rework v3 option A or B.",
              "Keep or drop \"30+ Years\"?"]),
    "LI-3": (AN, "The 104 SMEs / 453 validations story leads your live About, anonymised as \"a global manufacturer\". Signature line on file: \"Automated Comparisons are not Validation.\"",
             ["\"Seven functional areas\" or \"Master Data plus six process streams\"?",
              "Can the anonymised story sit in About while Lam is named in Experience?"]),
    "LI-4": (PA, "Your About ends with an availability line, not an ask. No closing line or destination is approved.",
             ["Pick the closing line.",
              "Where does it point: LinkedIn messages, email, rbolmsted.com, or @transformingdata.llc once registered?"]),
    "LI-5": (PA, "Five entries are live. BackOffice and Zudy dates differ between LinkedIn and the resumes, and nothing is stated for Zudy.",
             ["Correct the BackOffice and Zudy dates (see CR-3).",
              "Team size and one outcome for Accenture and Zudy, or none.",
              "Which client names may appear (see Q-13)?"]),
    "LI-6": (C, "Yes, at least twice, outside the approval gate. By 9 Sep the About was gone and the headline had changed; by 29 Sep a new headline and About were in place. Project records still say nothing was changed. The 8 Oct session record says you are happy with LinkedIn and the goal is not to redo it.",
             ["Confirm you made these edits, and which draft you used.",
              "Agree to save a dated PDF of the profile to Box whenever you edit it."]),
    "IV-1": (PA, "A consistent story bank exists: Lam 104/453; BackOffice startup team to Risk Partner; oil-and-gas takeover delivered on time; the utility CIO dispute; the two-hour prototype; the grocery pilots. Open: whether 453 is per cycle or total, whether CASE01 and the Fellowship \"Caltex\" story are the same client (probably Kautex), and the unverified \"every continent except Antarctica\".",
             ["453: per cycle or total?",
              "Same client, and which dates?",
              "Verify the global-reach claims before speaking them."]),
    "IV-2": (AN, "Your own words are consistent across about 30 files: the Business owns the data; automated comparisons are not validation; data quality as ingrained as Safety; Leadership, Custody, Governance. No practice session is on file.",
             ["Do the three facets replace the older \"Leadership and Profiling\"?",
              "Is Interview_Tone_Quotes v03 the spoken set?",
              "Book one practice session."]),
    "EM-1": (PA, "The 17 Sep plan defines the audience (business leaders and SMEs in migrations, in life sciences, semiconductors, manufacturing and energy) and the value (your business-owned-data thesis). You have not approved it. Your 29 Sep request, a post for each bullet of your practice material, still needs your bullet list.",
             ["Approve or edit the audience and the one-sentence promise.",
              "Send the bullet list."]),
    "EM-2": (C, "Newest plan: a weekly beehiiv issue (you record Monday, approve Wednesday, it publishes Thursday) plus a LinkedIn edition every other week. Four older plans differ. Nothing has been published.",
             ["Approve that rhythm, or set a lower one that fits your hours."]),
    "EM-3": (OP, "No list for your newsletter exists in any file.",
             ["Start from zero, or name the list and how consent was given.",
              "Agree: no imports from LinkedIn connections or old address books without opt-in."]),
    "EM-4": (AN, "The files agree: report inquiries, interviews, bookings and revenue first and engagement second, with review gates at months 2, 3, 4 and 6.",
             ["Approve that order and the gates."]),
    "EM-5": (PA, "beehiiv is chosen on paper; the Substack comparison is still open. On 8 Oct static pages on Cloudflare were recommended for the site. No sending domain exists yet, and transformingdata.llc is not registered.",
             ["beehiiv, or the comparison first?",
              "Send from @transformingdata.llc, or from a subdomain of rbolmsted.com?"]),
    "EM-6": (OP, "No first issue exists. Batch 1 article 01, \"Data Quality Begins Before the First Training Session\", is drafted.",
             ["Pick the first topic.",
              "Approve the subject line and preview once drafted."]),
}

for s in q["sections"]:
    for item in s["questions"]:
        if item["id"] in FILES:
            st, text, decide = FILES[item["id"]]
            item["files"] = {"status": st, "text": text, "decide": decide}

# NAME: the 13 Oct white paper uses TransformingData, LLC.
for s in q["sections"]:
    for item in s["questions"]:
        if item["id"] == "NAME":
            item["prompt"] = "Is TransformingData, LLC the firm name you want?"
            item["why"] = ("On 9 October Miah recorded that you do not want \"Olmsted Data Advisory\", and that your email will be "
                           "@transformingdata.llc, pointing to rbolmsted.com. On 13 October a white paper in Box was branded "
                           "\"TransformingData, LLC\" with you as Founder. No file shows the LLC registered yet.")

perm = next(s for s in q["sections"] if s["id"] == "permissions")
if not any(x["id"] == "WP-1" for x in perm["questions"]):
    perm["questions"].append({
        "id": "WP-1",
        "title": "The TransformingData white paper",
        "prompt": "May the October white paper name your 2014 Dimension Data colleagues, and call you \"former Senior Global Migration Lead, Dimension Data\"?",
        "why": ("The 13 Oct deck \"Global Deployment Agentic+ Delivery ReVamp\" reproduces the 2014 Dimension Data slides, "
                "with more than 20 colleagues named. Dimension Data is on none of the cleared-for-public lists. "
                "The 2014 slides show you as Data Programme Manager and Data Readiness Lead, not the title on the cover."),
        "files": {"status": OP,
                  "text": "Draft only; nothing records it as published. It also cites outside figures (Caylent, SAP News, Deloitte via Parloa) that need checking before release.",
                  "decide": ["Name colleagues, or show roles only?",
                             "Confirm your Dimension Data title (see CR-10).",
                             "Is Dimension Data cleared to name in public?"]},
    })

CAREER = [
    ("CR-1", "Lam Research dates and status",
     "Confirm the Lam contract ran February to July 2026 through Magnit, and that nothing is current.",
     (C, "Resumes of record: Business Data Migration Lead (Contract), February to July 2026, through Magnit, ended before cutover. A September letter still calls Lam your current engagement, and the July LinkedIn showed \"Present\". A sent Lam letter dates the whole relationship July 2025 to July 2026, first for Accenture.",
      ["Confirm February to July 2026, via Magnit.", "Retire \"current\" and \"Present\" everywhere.", "May Magnit be named?"])),
    ("CR-2", "Accenture end date",
     "Confirm your Accenture title and dates.",
     (AN, "Associate Director, SAP Data and AI, March 2024 to January 2026, in 177 files, and it matches the 2025 W-2. A few files say it ran to July 2026, and a 12 Sep letter says \"February of this year\".",
      ["Confirm January 2026.", "May Amgen be named as the medical device client?"])),
    ("CR-3", "BackOffice and Zudy dates; Partner wording",
     "Which dates and which Partner wording are right?",
     (C, "BackOffice: June 1996 to May 2016 in 73 resume files; May 1996 on LinkedIn. Twenty July and August letters say \"founding partner\"; September letters say you joined the startup team in 1996. Zudy: August 2017 to March 2019 in 74 files; February 2017 to June 2019 on LinkedIn.",
      ["BackOffice start month: May or June 1996?", "\"Founding partner\", or \"joined the startup team\"? Partner from day one, or promoted (which year)?", "Zudy: August 2017 to March 2019, or February 2017 to June 2019?"])),
    ("CR-4", "How to describe Syniti",
     "Adopt one line for BackOffice Associates and Syniti.",
     (C, "Dated record: BackOffice Associates renamed itself Syniti on 8 May 2019. 137 resume files say \"later acquired by Syniti\", and six letters, including sent Amazon, Helen of Troy and North Highland letters, say \"sold to Syniti in 2016\".",
      ["Adopt \"BackOffice Associates, now Syniti\".", "Confirm the year Capgemini acquired Syniti before using it."])),
    ("CR-5", "Databricks, Snowflake and SAP MDG",
     "What is your actual experience with these platforms?",
     (C, "On 21 Sep you said you have no hands-on Databricks or Snowflake experience. 18 files claim more, including sent Insulet and Chubb letters. SAP MDG is on the \"never claim\" list, yet 13 files say it has been in your scope since 2011.",
      ["Approve one sentence: proposal and solutioning on two accepted pilots, no hands-on work. Remove both from the Skills line.", "Your actual SAP MDG exposure: hands-on, designed around it, or none?"])),
    ("CR-6", "Go-live and hypercare claims",
     "Which engagements did you carry through go-live and hypercare?",
     (C, "Only the oil-and-gas acquisition went through go-live; Lam ended before cutover. Ten letters say \"no hypercare issues due to data\", and the sent Enterprise Data Labs letter says \"through go-live and hypercare\".",
      ["Did you support a hypercare period on the oil-and-gas go-live?", "Which of your lead engagements ran through hypercare?"])),
    ("CR-7", "Clearance and work authorization",
     "Confirm your clearance history and work authorization.",
     (OP, "Three sent letters say you held a Top Secret clearance for State Department work; the Fact Base confirms none. US citizenship or work authorization is not recorded, although at least eight postings require it.",
      ["Clearance: level, agency, approximate years, or none.", "Confirm citizenship or work authorization for the Fact Base."])),
    ("CR-8", "Career length and the 2016-2024 gap",
     "Choose one career-length figure, and confirm the wording for 2016 to 2024.",
     (OP, "Files say 30 years (since 1996), 25 years of consulting, 45 years, or \"since 1975\". Resumes say \"Planned Sabbatical, July 2019 to March 2024\"; older drafts say \"medical leave 2016\" or \"Retired 2018\".",
      ["One figure, and what it counts from.", "Retire \"medical leave\" and \"Retired\"?", "What covers 2016 to 2017, and March to July 2019?"])),
    ("CR-9", "Degrees",
     "Confirm your degree titles, majors and years.",
     (PA, "Master's, Business/Commerce, Penn State; Bachelor's, Allegheny College. Only one file gives years (1978 and 1974), and the Allegheny major is not recorded.",
      ["Degree titles and majors.", "Graduation years, and may they appear on LinkedIn?"])),
    ("CR-10", "Dimension Data title and years",
     "What was your title at Dimension Data, and when?",
     (C, "The 13 Oct white paper calls you \"former Senior Global Migration Lead, Dimension Data\". Its 2014 slides list you as Data Programme Manager and Data Readiness Lead. A sent BNY letter says \"20 years as Risk Partner for a global infrastructure provider\", while the engagement history dates that engagement 2015 to 2016 (that this is Dimension Data is an inference).",
      ["Your title, and the years.", "Is Dimension Data the \"global infrastructure provider\"?"])),
]
if not any(s["id"] == "career" for s in q["sections"]):
    sec = {"id": "career", "title": "Career facts to confirm",
           "blurb": "New on 16 October. Your resumes, letters and LinkedIn disagree on these facts. Each needs a one-line answer before anything reuses it.",
           "questions": []}
    for cid, title, prompt, (st, text, decide) in CAREER:
        sec["questions"].append({"id": cid, "title": title, "prompt": prompt,
                                 "why": "Answer in one line. Miah updates the Fact Base and the resumes from it.",
                                 "files": {"status": st, "text": text, "decide": decide}})
    jsi = next(i for i, s in enumerate(q["sections"]) if s["id"] == "jobsearch")
    q["sections"].insert(jsi, sec)

keep = [u for u in q["scanUpdates"] if u["ref"] in ("New", "Caution")]
q["scanUpdates"] = [
    {"kind": "added", "ref": "Files", "text": "Each question now shows what the Box files already say (read 9 October, refreshed 16 October), with a status: files disagree, partly answered, answered in the files, or not in the files. None of it is your decision until you answer."},
    {"kind": "changed", "ref": "NAME", "text": "On 9 October Miah recorded that \"Olmsted Data Advisory\" is dropped and email will be @transformingdata.llc. A 13 October white paper is branded TransformingData, LLC. No registration is on file."},
    {"kind": "changed", "ref": "Q-23", "text": "A 29 September session lifted the Lam and Accenture exclusion for rbolmsted.com, pending your approval and Q-04. The 1 October summary does not mention it."},
    {"kind": "changed", "ref": "JS-4", "text": "The resume actually in use since September is Bob_Olmsted_Resume_2026.docx (42 applications), not the v24/v25 masters the summary names."},
    {"kind": "changed", "ref": "LI-6", "text": "Your live LinkedIn changed at least twice between 18 July and 29 September, outside the approval gate."},
    {"kind": "added", "ref": "Career", "text": "Ten career facts that your files disagree on (CR-1 to CR-10)."},
    {"kind": "added", "ref": "WP-1", "text": "The 13 October TransformingData white paper names Dimension Data colleagues and gives you a title to confirm."},
    {"kind": "confirmed", "ref": "Site", "text": "rbolmsted.com is registered through Cloudflare from 23 September 2026 to 23 September 2031."},
    {"kind": "confirmed", "ref": "Cleanup", "text": "Backup copies: by 15 October, 709 of 780 were in the quarantine folder. 71 were held back on purpose: 9 from \"Hold Do Not Touch\" folders, 10 from pending interviews, and 52 sitting in an older dedupe quarantine, awaiting Miah. Nothing was deleted."},
    {"kind": "unchecked", "ref": "Answers", "text": "Files changed after 9 October were not re-read, apart from the white paper and the quarantine logs. Your own answers on this page are the only thing that closes a question."},
] + keep

q["version"] = "1.2"
q["asOf"] = "2026-10-16"
P.write_text(json.dumps(q, indent=2, ensure_ascii=False) + "\n")
n = sum(len(s["questions"]) for s in q["sections"])
print(f"questions.json v{q['version']}: {n} items, {sum(1 for s in q['sections'] for x in s['questions'] if 'files' in x)} with file notes")

# Sub-questions that take a plain Yes/No (rendered as two buttons on the desk).
YESNO = {
    "Q-03": "b", "Q-11": "c", "Q-12": "c", "Q-15": "c", "Q-04": "c", "Q-13": "a", "Q-23": "ac", "WP-1": "c",
    "Q-24": "c", "CR-1": "abc", "CR-2": "ab", "CR-4": "a", "CR-5": "a", "CR-6": "a", "CR-8": "b", "CR-10": "b",
    "JS-1": "b", "JS-4": "b", "LI-1": "b", "LI-3": "b", "LI-6": "b", "IV-2": "ab", "EM-3": "b",
}
for s in q["sections"]:
    for item in s["questions"]:
        if item["id"] in YESNO:
            item["files"]["yesno"] = list(YESNO[item["id"]])
P.write_text(json.dumps(q, indent=2, ensure_ascii=False) + "\n")
