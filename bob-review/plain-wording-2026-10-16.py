#!/usr/bin/env python3
"""Rewrite desk questions in plain words, asking Bob only what he knows.

Run after refresh-2026-10-16.py. Bob is a data-migration expert; Miah sets up
the newsletter, LinkedIn settings, platforms, registrations and ghostwriting.
Questions that are really Miah's tasks move to a "Miah is handling these"
section. Sub-question letters keep their meaning where Bob has already
answered (Q-01, Q-10) so saved answers still line up. Idempotent.
"""
import json
from pathlib import Path

P = Path(__file__).with_name("questions.json")
q = json.loads(P.read_text())

# id -> (prompt, why, [sub-questions], yes/no letters, {letter: "details prompt on Yes"})
PLAIN = {
    "Q-01": ("Roughly how many people could hear from you today?", "So the plan starts from your real numbers, not guesses.", None, "", {}),
    "Q-03": ("What have clients and employers actually paid you recently?", "So any prices in the plan match what you have really been paid. This stays private.",
             ["What were you paid per hour or per day on the Lam contract, and on your last Accenture work?",
              "Some of your notes show \"$220\" and \"155\". Were those hourly rates?",
              "Miah has drafted price levels for an audit offer (top level $75,000, fallback $24,500). Are you comfortable with Miah setting those prices?"], "bc", {}),
    "Q-05": ("If you take a full-time job, how many hours a week could you still give this work?", "So the plan does not count on time you will not have. For example: 15 to 20, 5 to 8, or none.", None, "", {}),
    "Q-10": ("How should we count your engagements, and the Lam validations?", "Different files use different numbers. You decide which ones are right.",
             ["When you count your engagements, do you count each project once, or each role you held on it?",
              "In public, should we say \"more than twenty engagements\" or \"twenty-four\"?",
              "Lam: was 453 the number of validations in each test cycle (Mock 2, Mock 3, Dress Rehearsal), or the total for all three?"], "", {}),
    "Q-11": ("What was your part in the Lam validation protocol?", "Some letters say you designed it; older files say you taught and improved it. Only you know.",
             ["In one sentence: did you design it, build it together with the business people, or teach and improve one Lam already had?",
              "If you designed it: what was there before you started?",
              "Some letters you sent say you \"designed and delivered\" it. Do any of them need a correction before an interview?"], "c",
             {"c": "Which letters, and what should the correction say?"}),
    "Q-12": ("Your DAMA exam", "Letters mention an 89 percent \"Master level\" score, but there is no record of the exam itself.",
             ["Which DAMA exam did you take, and roughly when? (A screenshot of the result is enough.)",
              "Did DAMA send you a certificate, or only a score?",
              "Should we stop saying \"Master level\" until you hold the full certification?"], "c", {}),
    "Q-15": ("The classes you taught at BackOffice", "No file has the details, so nothing about these classes is used in public yet.",
             ["What did you teach, roughly which years, and about how many groups?",
              "Do you remember a pass rate? If not, we will leave it out.",
              "May any former students be named?"], "c", {"c": "Who may be named?"}),
    "Q-04": ("What do your Accenture and Lam paperwork say?", "Before anything public names Lam or Accenture, we need to know if your agreements limit it. Saying \"I don't know\" is fine.",
             ["Your Accenture separation paperwork: does it say anything about naming clients, publicity, or approaching former clients?",
              "Your Lam/Magnit contract: does it say anything like that?",
              "Would you like a lawyer to read them before anything public names Lam or Accenture?"], "c", {"c": "Who, and by when?"}),
    "Q-19": ("If you take a job", "Some employers limit side work and public writing.",
             ["When you interview, will you ask about the employer's rules on side work and writing in public?",
              "If you take a job, what should happen to the newsletter and consulting: pause, keep going, or decide then?"], "a", {}),
    "Q-13": ("Company names in public", "No company has given permission to be quoted, and the files use three different lists of names.",
             ["The fifth company you mentioned: was it Ahold Delhaize, the grocery company?",
              "Should we write \"Lam Research\" or \"LAM Research\"?",
              "Which client names are you comfortable seeing in public writing? A: only Eli Lilly, Kraft and Graybar. B: also Novelis, SABMiller, Merck, Kautex and ExxonMobil. C: also Lam Research, Chevron, Dow and Exxon."], "a", {}),
    "Q-23": ("Talking about Lam and Accenture", "For now, Lam and Accenture are kept out of anything published.",
             ["Is it fine to talk about Lam and Accenture in interviews and private conversations?",
              "Miah suggested your website could name Lam and Accenture (but not Accenture's clients). Is that OK with you?",
              "Your LinkedIn already names Lam and Accenture. Is that OK to leave as it is?"], "abc", {}),
    "Q-20": ("Miah showing her work for you", "Miah would like to show the system she built for you as an example of her work.",
             ["May Miah show it as an example of her work?",
              "If yes, may it show your name and website, or should it be anonymous?"], "a", {}),
    "WP-1": ("The Dimension Data white paper", "Miah's October white paper reuses your 2014 Dimension Data slides, which name your old colleagues.",
             ["May we name your old colleagues, or should we show only their roles?",
              "What was your actual title on that project?",
              "Is it OK to name Dimension Data in public?"], "c", {}),
    "NAME": ("Your firm's name", "Miah will handle the registration. She needs your choice and anything she should know.",
             ["Do you want your firm to be called TransformingData, LLC?",
              "Anything Miah should know before she registers it (for example, which state, or whose address)?"], "a", {}),
    "Q-08": ("The newsletter's name", "Miah checks whether a name is free before it is used.",
             ["Do you like \"The Sign-Off\" as the newsletter's name?",
              "Should the newsletter carry your own name, your firm's name, or its own name?"], "a", {}),
    "Q-22": ("The first three months", "The business will not earn anything in the first three months.",
             ["Until it does, what pays the household bills, and for how long?",
              "Are you still getting Texas unemployment? (Miah will sort out how consulting income is reported.)"], "b", {}),
    "Q-24": ("Naming Lam and Accenture more widely later", "The plan says to revisit this after about six months.",
             ["When should we revisit it: on a date, or after you have read your agreements?",
              "Who at Lam or Accenture could give permission, if we ever asked?",
              "If your website already names them (see Q-23), is that enough for now?"], "c", {}),
    "CR-1": ("Lam Research dates", "Your files disagree on these.",
             ["Did the Lam contract run February to July 2026, through Magnit?",
              "Should we remove \"current\" and \"Present\" for Lam everywhere?",
              "Is it OK to name Magnit?"], "abc", {}),
    "CR-2": ("Accenture dates", "Your files disagree on these.",
             ["Did your Accenture job end in January 2026?",
              "May we name Amgen as the medical device client?"], "ab", {}),
    "CR-4": ("How to describe Syniti", "BackOffice Associates renamed itself Syniti in May 2019; some letters say it was \"sold\".",
             ["Is it OK to write \"BackOffice Associates, now Syniti\"?",
              "Do you know what year Capgemini bought Syniti? (Fine to say no.)"], "a", {}),
    "CR-5": ("Databricks, Snowflake and SAP MDG", "Some letters claim more hands-on work than you described.",
             ["Databricks and Snowflake: is it right to say you helped sell two pilots but did not work in the tools yourself?",
              "SAP MDG: did you work in it hands-on, design around it, or not use it?"], "a", {}),
    "JS-1": ("Your Client Experience Application", "It is still half filled in, and your newer Engagement History covers the same ground.",
             ["Should we drop the Client Experience Application and use your Engagement History instead?"], "a", {}),
    "JS-2": ("Your Lyra Health application", "Three versions of the resume exist, and it is not clear which one you sent.",
             ["Which resume did you send to Lyra Health? (Fine to say you don't remember.)",
              "That version says \"every continent except Antarctica\" and \"teams of hundreds\". Are those accurate?"], "b", {}),
    "JS-3": ("Your Fujitsu application", "It was rejected, so this only matters for the record.",
             ["Do you remember which resume you sent to Fujitsu?",
              "Did you apply on 16 July or 23 July? (This goes in your Texas work-search log.)"], "", {}),
    "JS-4": ("Your main resume", "Miah will pick one main resume to use from now on.",
             ["Is that OK?",
              "Do Databricks, Snowflake, SAP MDG and Informatica IDMC belong in your skills list?"], "ab", {"b": "Which ones belong?"}),
    "LI-1": ("What you want LinkedIn to bring you", "Miah writes the profile; she needs to know what you are after.",
             ["In a sentence, what kind of work do you want people to contact you about?",
              "Are you open to part-time executive roles, like a part-time Chief Data Officer?"], "b", {"b": "What kind of part-time role?"}),
    "LI-2": ("Your LinkedIn headline", "Miah drafts the wording; you only say whether it feels right.",
             ["Are you happy with your current LinkedIn headline?",
              "Should it keep \"30+ Years\"?"], "ab", {}),
    "LI-3": ("The Lam story on LinkedIn", "Your About section leads with the 104 people and 453 validations at Lam, without naming Lam.",
             ["Is \"seven functional areas\" the same as \"Master Data plus six process streams\"? Which do you prefer?",
              "Is it OK to tell that story without naming Lam, even though Lam is listed in your job history?"], "b", {}),
    "LI-4": ("How people reach you", "Miah writes the closing line of your LinkedIn About section.",
             ["When someone wants to reach you from LinkedIn, should they message you there, email you, or go to your website?"], "", {}),
    "LI-5": ("Your Accenture and Zudy jobs", "Your LinkedIn says little about these two roles.",
             ["For Accenture and for Zudy: how many people did you lead, and one result you are proud of?"], "", {}),
    "LI-6": ("Changes to your LinkedIn", "Your profile changed in September, but the project files say nothing was changed.",
             ["Did you change your LinkedIn profile yourself in September?"], "a", {"a": "What did you change?"}),
    "IV-1": ("Stories you tell in interviews", "A few details in your stories do not match across files.",
             ["One interview summary mentions a \"Caltex\" project from 2011 to 2015. Was that actually Kautex?",
              "Is \"every continent except Antarctica\" accurate for where you have worked?"], "ab", {}),
    "IV-2": ("Why you do this work", "Your own words in about 30 files are consistent.",
             ["Do Leadership, Custody and Governance still describe how you see data governance?",
              "Would you like a practice interview with Miah? If yes, when?"], "a", {}),
    "EM-1": ("Who the newsletter is for", "Miah sets up and writes the newsletter; she needs your view of the reader.",
             ["In one line, who should read it? For example: business leaders running SAP projects.",
              "Have you sent Miah your list of practice points (the bullets you mentioned on 29 September)?"], "b", {}),
    "EM-2": ("Your time for the newsletter", "Miah drafts each issue; you review it.",
             ["How much time a week can you give it, for talking through ideas and reviewing drafts?"], "", {}),
    "EM-3": ("Who gets the newsletter", "Nobody is added without their permission.",
             ["Do you already have a list of people who asked to hear from you? If not, we start from zero."], "", {}),
    "EM-6": ("The first issue", "Miah will draft it for you to review.",
             ["Is there a topic you would most like to start with?"], "", {}),
}

PLAIN.update({
    "CR-7": ("Clearance and right to work", "Some job postings require these.",
             ["Did you ever hold a security clearance? If yes: what level, for which agency, and roughly when.",
              "Are you a US citizen, or otherwise allowed to work in the US without sponsorship?"], "b", {}),
    "CR-8": ("Length of your career", "Files say 30 years, 25 years, 45 years, or \"since 1975\".",
             ["How many years of experience should we say, and counted from when?",
              "Your resume says \"Planned Sabbatical, July 2019 to March 2024\". Should we drop older wording like \"medical leave\" and \"retired\"?",
              "What were you doing in 2016 to 2017, and March to July 2019?"], "b", {}),
})
# Plain titles (the heading Bob sees)
TITLES = {"Q-01": "Your audience today", "Q-03": "What you have been paid", "Q-05": "Hours after a job",
          "Q-10": "Counting your engagements", "Q-11": "Your part in the Lam protocol", "Q-12": "Your DAMA exam",
          "Q-15": "Your BackOffice classes", "Q-04": "Your Accenture and Lam paperwork", "Q-19": "If you take a job",
          "Q-13": "Company names in public", "Q-23": "Talking about Lam and Accenture", "Q-20": "Miah showing her work for you",
          "WP-1": "The Dimension Data white paper", "NAME": "Your firm's name", "Q-08": "The newsletter's name",
          "Q-22": "The first three months", "Q-24": "Naming Lam and Accenture later", "CR-4": "How to describe Syniti",
          "JS-1": "Your Client Experience Application", "JS-2": "Your Lyra Health application", "JS-3": "Your Fujitsu application",
          "JS-4": "Your main resume", "LI-1": "What you want from LinkedIn", "LI-2": "Your LinkedIn headline",
          "LI-3": "The Lam story on LinkedIn", "LI-4": "How people reach you", "LI-5": "Your Accenture and Zudy jobs",
          "LI-6": "Changes to your LinkedIn", "IV-1": "Stories you tell in interviews", "IV-2": "Why you do this work",
          "EM-1": "Who the newsletter is for", "EM-2": "Your time for the newsletter", "EM-3": "Who gets the newsletter",
          "EM-6": "The first issue", "CR-3": "BackOffice and Zudy dates", "CR-6": "Go-live and hypercare",
          "CR-9": "Your degrees", "CR-10": "Your Dimension Data title"}

# Questions that are Miah's to handle; Bob only adds a note if he wants to.
MIAH = {
    "Q-09": "Miah will check the LinkedIn newsletter settings with you at the computer when it is time.",
    "Q-21": "Miah confirms her own pay figure; nothing for you to do.",
    "EM-4": "Miah tracks how the newsletter is doing and reports back to you.",
    "EM-5": "Miah sets up the newsletter platform and the address it sends from.",
}

FIELD_LABELS = {"Q-01": {"linkedin_followers": "LinkedIn followers (shown on your profile)",
                         "email_contacts": "People you could email about your work (rough number)",
                         "newsletter_subscribers": "Newsletter subscribers (0 if none yet)",
                         "pipeline": "People you are talking to about paid work right now"}}

secs = {s["id"]: s for s in q["sections"]}
for s in q["sections"]:
    for item in s["questions"]:
        i = item["id"]
        if i in PLAIN:
            prompt, why, subs, yn, yd = PLAIN[i]
            if not prompt.endswith("?"):
                prompt, why = why, ""
            item["prompt"], item["why"] = prompt, why
            if subs is not None and len(subs) == 1 and not yn:
                item["prompt"], subs = subs[0], []
            if subs is None:
                subs = []
            if True:
                item["files"]["decide"] = subs
                item["files"]["yesno"] = list(yn)
                item["files"]["yesDetail"] = yd
            if i in FIELD_LABELS:
                for f in item.get("fields", []):
                    f["label"] = FIELD_LABELS[i].get(f["key"], f["label"])

for s in q["sections"]:
    for item in s["questions"]:
        if item["id"] in TITLES:
            item["title"] = TITLES[item["id"]]

if "miah" not in secs:
    moved = []
    for s in q["sections"]:
        keep = []
        for item in s["questions"]:
            (moved if item["id"] in MIAH else keep).append(item)
        s["questions"] = keep
    for item in moved:
        item["owner"] = "miah"
        item["prompt"] = MIAH[item["id"]]
        item["why"] = "You do not need to answer this. Add a note only if you want to."
        item.pop("fields", None)
        item["files"]["decide"] = []
        item["files"]["yesno"] = []
    q["sections"].append({"id": "miah", "title": "Miah is handling these",
                          "blurb": "You do not need to answer anything here. Add a note only if you want to.",
                          "questions": moved})

# Section blurbs in plain words
BLURBS = {"facts": "Facts from your own records. If you don't know, say so; nothing is guessed.",
          "permissions": "What you are comfortable with. Saying \"I don't know\" is fine.",
          "joint": "Choices you and Miah settle together.",
          "linkedin": "Miah writes your profile; these are the parts only you can answer.",
          "newsletter": "Miah sets up and writes the newsletter; these are the parts only you can answer."}
for s in q["sections"]:
    if s["id"] in BLURBS:
        s["blurb"] = BLURBS[s["id"]]

P.write_text(json.dumps(q, indent=2, ensure_ascii=False) + "\n")
print("bob items:", sum(len(s["questions"]) for s in q["sections"] if s["id"] != "miah"),
      "| miah items:", sum(len(s["questions"]) for s in q["sections"] if s["id"] == "miah"))
