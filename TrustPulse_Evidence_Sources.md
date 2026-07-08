# TrustPulse — Supporting Evidence: Breaches & Statistics
### Detailed backup content with sources (for pitch prep, Q&A, and slide expansion)

---

## Part 1: Real-World Privacy Breach Instances

Use these as concrete "this is already happening" evidence during Q&A or in an expanded slide/appendix.

### 1. ICMR / Aadhaar Data Breach (2023, disclosed late 2025)
- **What happened:** A threat actor using the handle "pwn0001" advertised a database of roughly 815 million Indian records for sale on a hacking forum called Breach Forums, priced around $80,000.
- **Data exposed:** Names, phone numbers, addresses, Aadhaar numbers, and passport details; some reporting also mentions health/COVID-test data linked to the Indian Council of Medical Research (ICMR).
- **Root cause:** Investigators traced the exposure to unsecured/poorly authenticated APIs connected to the ICMR's COVID-19 testing data repository — a recurring pattern in large Indian breaches (weak API authentication and rate-limiting).
- **Why it matters for TrustPulse:** This is a textbook case for the Canary Network — millions of people had no way of knowing their data was exposed until cybersecurity researchers found it being resold nearly two years later.
- **Sources:**
  - Bitdefender HotForSecurity — "India's biggest data breach?" — https://www.bitdefender.com/en-us/blog/hotforsecurity/indias-biggest-data-breach-hacking-gang-claims-to-have-stolen-815-million-peoples-personal-information
  - Corbado — "10 Biggest Data Breaches in India [2026]" — https://www.corbado.com/blog/data-breaches-India
  - BitNewsBot — "India's Aadhaar Data Breach Exposes 815M Records On Dark Web" — https://bitnewsbot.com/indias-aadhaar-data-breach-exposes-815m/

### 2. Original Aadhaar Database Exposure (2018)
- **What happened:** A Tribune newspaper investigation (published Jan 3, 2018) found that unauthorized "agents" were selling login access to the UIDAI Aadhaar portal over WhatsApp for as little as ₹500 (under $10), giving buyers lookup access to any registered citizen's demographic data.
- **Root cause:** Not a sophisticated hack — a failure of access control. Reportedly, over 100,000 former Ministry employees still had standing access to the system.
- **Why it matters for TrustPulse:** This is a direct real-world example of **Permission Rot at institutional scale** — access granted once, never revoked, exploited years later. Strong supporting case for the Consent Decay module's core logic, just applied to individual consumer app permissions instead of government employee access.
- **Sources:**
  - Huntress Threat Library — "Aadhaar Data Breach: What Happened, Impact, and Lessons" — https://www.huntress.com/threat-library/data-breach/aadhaar-data-breach
  - Wikipedia — "Data breaches in India" — https://en.wikipedia.org/wiki/Data_breaches_in_India

### 3. Angel One Breach (2025)
- **What happened:** India's largest retail broking firm had a misconfigured, publicly accessible AWS storage bucket, exposing data for roughly 7.9 million users.
- **Data exposed:** Trading details, email addresses, and customer IDs.
- **Root cause:** Cloud misconfiguration — public access left enabled on a storage bucket, not a targeted attack.
- **Source:** EIMT — "25 Major Cyber Attacks in India: Biggest Data Breaches and Lessons" — https://www.eimt.edu.eu/25-major-cyber-attacks-in-india-threats-and-strategies

### 4. Star Health Insurance Leak (2024)
- **What happened:** Roughly 31 million customer records from India's largest standalone health insurer were leaked.
- **Source:** IndiaDataMap — "State-Wise Analysis of Data Breaches in India for 2025" — https://indiadatamap.com/2025/10/11/state-wise-analysis-of-data-breaches-in-india-for-2025/

### 5. Uttar Pradesh Marriage Assistance Scheme Leak
- **What happened:** A welfare-scheme web portal leaked Aadhaar numbers, bank details, and contact information for roughly 200,000 applicants. The exposed data was found indexed and searchable on public search engines.
- **Root cause:** Poor web server configuration and missing access restrictions — no firewall or regular penetration testing.
- **Source:** EIMT — "25 Major Cyber Attacks in India: Biggest Data Breaches and Lessons" — https://www.eimt.edu.eu/25-major-cyber-attacks-in-india-threats-and-strategies

### 6. Airtel-Linked Data Sale Claim
- **What happened:** Hackers claimed to be selling a database of roughly 375 million users (about 25% of India's population), including Aadhaar numbers and personal details reportedly linked to Airtel. Airtel denied the breach, but the data circulated online regardless.
- **Why it matters:** Illustrates a recurring problem even a "denial" doesn't solve — once data is out, there is no way for individual users to verify whether *their specific* record was included. This is exactly the ambiguity the Canary Network is designed to remove (a canary is proof, not speculation).
- **Source:** EIMT — "25 Major Cyber Attacks in India: Biggest Data Breaches and Lessons" — https://www.eimt.edu.eu/25-major-cyber-attacks-in-india-threats-and-strategies

---

## Part 2: Statistics — Global

| Stat | Figure | Source |
|---|---|---|
| Average time to identify + contain a data breach globally (2025) | **241 days** — the lowest in 9 years (158 days to identify + 83 days to contain) | IBM Cost of a Data Breach Report 2025 — https://www.ibm.com/reports/data-breach ; DataFence analysis — https://www.datafence.ai/data-breach-report-2025 |
| Average global cost of a data breach (2025) | **$4.44 million** — down 9% from $4.88M in 2024, mainly due to faster AI-assisted detection | IBM — https://www.ibm.com/think/x-force/2025-cost-of-a-data-breach-navigating-ai |
| Average cost of a US data breach (2025) | **$10.22 million** — an all-time high, driven by regulatory fines and slower detection | CyberScoop — https://cyberscoop.com/ibm-cost-data-breach-2025/ |
| Cost gap: breaches detected within 200 days vs. beyond | **$3.61M vs. $5.49M** — a $1.88M difference | DataFence — https://www.datafence.ai/data-breach-report-2025 |
| Time to detect breaches involving stolen/compromised credentials | **~246 days** (nearly 8 months of undetected access) | Enzoic — https://www.enzoic.com/blog/ibm-cost-of-a-data-breach-report-2025/ |
| Most frequently compromised data type | **Customer PII**, involved in 53% of all breaches | Bluefin — https://www.bluefin.com/bluefin-news/ibms-2025-data-breach-report-key-findings-and-the-years-biggest-attacks/ |
| Healthcare sector breach cost & detection time | **$7.42M average cost, 279 days to detect/contain** — costliest sector for the 14th consecutive year | AllCovered — https://www.allcovered.com/blog/key-insights-from-ibms-2025-cost-of-a-data-breach-report |
| Organizations still recovering 100+ days after a breach | **76%** of organizations took more than 100 days to fully recover | Bluefin — https://www.bluefin.com/bluefin-news/ibms-2025-data-breach-report-key-findings-and-the-years-biggest-attacks/ |

*Use case in your pitch:* The 241-day average detection gap is your single strongest statistic — it directly justifies why a **crowdsourced, real-time Canary Network** has value: it aims to shrink that window from months to hours for participating users, even before a company's own internal security team notices.

---

## Part 3: Statistics — India-Specific

| Stat | Figure | Source |
|---|---|---|
| India's global rank for number of breached accounts (2023) | **5th** globally, with 5.3 million accounts compromised | Corbado — https://www.corbado.com/blog/data-breaches-India |
| Average cost of a data breach in India (2023) | **$2.18 million** | Corbado — https://www.corbado.com/blog/data-breaches-India |
| CERT-In reported cyber incidents | Rose from **53,117 in 2017** to **1.32 million between Jan–Oct 2023** | Corbado — https://www.corbado.com/blog/data-breaches-India |
| Phishing's share of Indian breach incidents | **22%** of incidents, with compromised credentials responsible for **16%** | Corbado — https://www.corbado.com/blog/data-breaches-India |
| Indian users who reuse the same password across platforms | **60%** | IndiaDataMap (I4C data) — https://indiadatamap.com/2025/10/11/state-wise-analysis-of-data-breaches-in-india-for-2025/ |
| Indian users who use two-factor authentication | Only **25%** | IndiaDataMap (I4C data) — https://indiadatamap.com/2025/10/11/state-wise-analysis-of-data-breaches-in-india-for-2025/ |
| UPI transaction volume (Jan 2025) | **16.99 billion transactions** — a prime target for identity/credential-based attacks alongside 1.3 billion Aadhaar records | IndiaDataMap — https://indiadatamap.com/2025/10/11/state-wise-analysis-of-data-breaches-in-india-for-2025/ |
| Companies complying with CERT-In's 6-hour breach reporting mandate | Only **~10%** comply, despite the 2024 directive | IndiaDataMap — https://indiadatamap.com/2025/10/11/state-wise-analysis-of-data-breaches-in-india-for-2025/ |
| Population with digital-literacy/cyber-safety training (2023) | Only **20%** | IndiaDataMap (I4C data) — https://indiadatamap.com/2025/10/11/state-wise-analysis-of-data-breaches-in-india-for-2025/ |

*Use case in your pitch:* The **10% CERT-In compliance rate** is a strong argument for why a *user-side, independent* detection system (Canary Network) is necessary — you cannot rely on companies to self-report on time, so users need their own early-warning mechanism.

---

## Part 4: How to Use This in Your Pitch

- **Opening hook:** Lead with the Aadhaar/ICMR 815-million-record breach — it's large, recent, and Indian, so it's instantly relatable to judges.
- **Justifying Module 2 (Canary Network):** Anchor on the **241-day global detection gap** and **10% CERT-In compliance rate** — together they prove that neither companies nor regulators currently give users timely warning.
- **Justifying Module 1 (Consent Decay):** Anchor on the **2018 Aadhaar access-control failure** (dormant access exploited at scale) as a real precedent for why *unused* permissions are dangerous even without a "hack."
- **Closing stat:** The **$1.88M cost difference** between fast vs. slow detection reinforces that early detection has real, measurable financial value — not just a privacy nicety.

> **Note on sourcing:** All figures above are paraphrased from the cited reports/articles, not quoted verbatim — safe to restate in your own words during a live pitch. For any number you plan to put directly on a slide, it's good practice to double check the original report (IBM's is linked above) in case newer data has been published closer to your presentation date.
