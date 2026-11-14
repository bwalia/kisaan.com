# KISAAN — Competitor & Market Analysis

> Status: Draft v0.2 · Last updated: 2026-11-14 · Owner: Product Strategy / Business Analyst · Source of truth index: [README](README.md)

## 1. Research method

| Item | Detail |
|---|---|
| Research date | 2026-11-14. Every source in §11 was accessed on that date. **v0.2 refresh (2026-11-14):** targeted searches on membership, coupons/promotions, seller stores, wholesale and group buying for the five named competitors (sources 86–90); results are in §5 and §5A. |
| Method | Desk research using web search and page retrieval. Official and government documents (PIB, Meta developer docs, cloud provider docs, GitHub and Hugging Face model cards) were preferred over press. |
| Evidence tags | **VERIFIED** = read directly from an official or company page or document. **Reported** = press or trade media; company figures are self-reported and unaudited. **UNVERIFIED** = could not be confirmed in this session; do not use in external material without checking. |
| Rules | No competitor features, statistics, partnerships or market sizes have been invented. Gaps that were not verified are recorded in §10. Funding, revenue and user figures change often, so re-check them before external use. |
| Not covered | Total Indian agri market size, agritech total addressable market, farmer smartphone and WhatsApp penetration, and Punjab-specific farm and mandi counts. No verified source was found for any of these. |

## 2. Market context (cited figures only)

| Metric | Figure | Source / status |
|---|---|---|
| Operational land holdings (Agri Census 2015-16) | **146.45 million**, up from 138 million in 2010-11; average size **1.08 ha** | Secondary summaries of the official census (Scribd copy; GKToday). PIB PRID 1605058 covers average holding size. Take the exact figure from the official All-India report. |
| Small + marginal share of holdings (2015-16) | **86.21%** (provisional, PTI/Business Standard, Oct 2018). Another summary gives 86.08%. | Sources conflict. Cite the official report. |
| Agri Census 2021-22 (11th) | Fieldwork complete; national results not found | UNVERIFIED |
| eNAM mandis | **1,656** in 23 States + 4 UTs (Mar 2026) | PIB backgrounder, 13 Apr 2026 (VERIFIED) |
| eNAM registered farmers / traders / FPOs | **1.80 crore / 2.73 lakh / 4,724** (Mar 2026) | PIB (VERIFIED) |
| eNAM cumulative trade, 2016 to Mar 2026 | **13.25 crore MT, ₹4.84 lakh crore** | PIB (VERIFIED) |
| Agmarknet-linked mandis | **4,367** (Dec 2025 parliamentary reply) | Secondary (agriculture.institute) |
| AgriStack Farmer IDs | **8.48 crore** (4 Feb 2026, PIB-cited); about 11 crore reported Oct 2026 | PIB-cited via ThePrint/TechObserver. The Oct 2026 figure is secondary. |
| FPOs on ONDC | **More than 9,000** (Jul 2025) | Financial Express (secondary) |
| Bhashini | 22 voice languages, 36 text languages; 350+ models; 450+ customers | PIB factsheet, Feb 2026 |
| Agritech funding | About $160M in 2025, down from more than $360M in 2024 | **UNVERIFIED**. Comes from a search summary citing Business Today; the article was not opened. |

## 3. Competitor landscape: summary

| Player | Type | Primary users | Marketplace role | AI / voice / vernacular (verified level) | Status (Nov 2026) |
|---|---|---|---|---|---|
| **eNAM** (Govt, SFAC) | Government electronic trading layer over APMC mandis | Farmers, FPOs, traders, mandi boards | Online bidding on mandi lots, e-payment, inter-state licence | 12-language web interface; mobile app; "AI enabled quality assessment" mentioned (PIB). No voice or chat assistant found. | Active and expanding (1,656 mandis, Mar 2026) |
| **DeHaat** | Full-stack: inputs, advisory and output linkage through franchised village centres | Smallholder farmers, micro-entrepreneurs, institutional buyers | Input e-commerce plus produce aggregation and sale to buyers | AI crop advisory in regional languages (NITI Frontier Tech); voice calls in regional languages (company page) | Active. Reported EBITDA breakeven in Q1 FY26. Acquired AgriCentral (Jan 2025). |
| **Ninjacart** | B2B fresh-produce supply chain | Fruit and vegetable farmers → retailers, restaurants, quick-commerce | Aggregation, logistics and fulfilment | AI demand forecasting, route optimisation and pricing (company claims) | Active. Cut non-core, low-margin lines in FY25. FY25 revenue ₹1,634 cr, loss ₹256 cr. |
| **AgroStar** | Omnichannel agri-inputs (app, call centre, ~10k retail outlets) | Farmers, agri retailers | Input sales; some output verticals | App with photo-based crop diagnosis, agronomy content and **voice search** (press) | Active. Raised ~$30M (Nov 2025, led by Just Climate). |
| **BigHaat** | Input marketplace plus produce trading and market linkage | Farmers, FPOs, buyers | Inputs (400+ brands, ~10k SKUs) plus output trading (~85% of revenue) | Crop-care tech stack (press). No verified voice feature. | Active. FY25 revenue above ₹1,100 cr (reported); EBITDA positive (company claim). |
| **Arya.ag** | Post-harvest grain commerce: storage, finance, trade | Farmers, FPOs, traders, processors, lenders | Commodity trading, warehouse-receipt finance | No verified voice or vernacular AI | Active. ₹725 cr Series D (Jan 2026, led by GEF Capital). Says it has been profitable since 2021. |
| **AgriBazaar** (StarAgri group) | Online agri-commodity trading plus finance and warehousing | Traders, processors, FPOs, farmers | E-auction and trading, agri finance | No verified voice AI | Active. Earns fees plus interest income (Inc42). |
| **Vegrow** | B2B fruit marketplace | Fruit farmers → organised buyers | Aggregation and sale | UNVERIFIED | Active per aggregators. FY25 revenue ~₹544–555 cr (aggregator, UNVERIFIED). |
| **WayCool** | Food supply chain / B2B distribution | Farmers, retailers, HoReCa | Fruit, vegetable and staples distribution | UNVERIFIED | Distressed: several layoff rounds in 2023–24; a planned $40M raise did not close (press). |
| **Jai Kisan** | Rural fintech (Bharat Khata ledger, rural credit, NBFC) | Rural businesses, farmers | Credit and ledger, not a produce marketplace | UNVERIFIED | Active. FY24 revenue ₹48 cr (reported). |
| **Kalgudi** | Agri and livelihood e-commerce plus engagement platform | FPOs, SHGs, farmers | Listing, translation, fulfilment and settlement for FPO products | "Phygital" model with field digital assistants; product translation listed | Active per its profile. No 2025–26 news found. |
| **Bijak** | B2B agri-trader marketplace app | Traders and commission agents | Trader-to-trader buying and selling with credit features | UNVERIFIED | Active per a Sept 2025 RuralVoice listing |
| **Kisan Network** (YC W16) | Farmer-to-institutional-buyer marketplace | Farmers, institutional buyers | Direct procurement | n/a | **Listed "Inactive" on its YC profile.** No shutdown announcement found. |
| **ONDC agri** | Open network protocol | FPOs selling through seller apps | Discovery and transactions across buyer apps | n/a (protocol) | More than 9,000 FPOs on ONDC (Financial Express, Jul 2025; not from an official dashboard) |
| **Government apps: Kisan e-Mitra, AgriStack** | Scheme helpdesk chatbot; farmer ID registry | All farmers | Not a marketplace | Kisan e-Mitra is voice-enabled in 11 languages including Punjabi (Wadhwani AI), built on Bhashini | Active |

Smaller apps (also covered in §4.11): **Krishi Network**, an advisory and community app available in Hindi, Marathi, **Punjabi** and English (The Better India), with no 2025–26 status found. **Gramophone**, which offers advisory and inputs (MP-focused) and added a "Vyapar" trading module (date UNVERIFIED).

## 4. Competitor profiles

### 4.1 eNAM (National Agriculture Market): Government of India, implemented by SFAC

| Dimension | Findings |
|---|---|
| Business model | Government platform with no commissions. It integrates existing APMC mandis. The Centre gives up to ₹75 lakh per mandi for integration infrastructure. *(PIB, 13 Apr 2026, VERIFIED)* |
| Scale | 1,656 mandis in 23 States + 4 UTs, up from 1,389 in 2024. 1.80 crore farmers, 2.73 lakh traders and 4,724 FPOs registered. Cumulative trade 13.25 crore MT / ₹4.84 lakh crore. The app gives free prices for 247 commodities (as of Dec 2025). *(PIB, VERIFIED)* |
| Marketplace functionality | Gate entry; lot IDs; quality assaying; online bidding; e-payment to farmers' bank accounts (NEFT/RTGS/UPI); secondary sale module; inter-state trade through a State Unified License; live price dashboard; helpline 1800 270 0224. The "Platform of Platforms" (launched 14 Jul 2022) connects logistics, warehousing, assaying, inputs, finance, insurance and advisory. e-NWR integration lets farmers sell stored produce without moving it. *(PIB, VERIFIED)* |
| UX / technology / AI | 12-language interface (Hindi, English, Gujarati, Marathi, Telugu, Bengali, Tamil, Odia "and others"). "AI enabled quality assessment systems" are mentioned. **No voice-first or conversational interface found.** |
| Strengths | National scale, government backing, integration with mandis, payments and warehouse receipts, free price information. |
| Weaknesses | Inter-mandi and inter-state trade remain small. Commentators cite missing or uneven assaying, logistics gaps, and state APMC rules and taxes (India Seminar 2020; IMPRI; Business Standard). One summary cites a **78% fall in inter-state eNAM trade in FY25** (Rau's IAS Compass, **UNVERIFIED**). eNAM is tied to mandis: it does not offer a conversational experience for farm-gate group sales, retailer group buying or transport matching. |
| Status | Active and expanding. |

### 4.2 DeHaat (Green Agrevolution Pvt Ltd)

| Dimension | Findings |
|---|---|
| Business model | Franchised village "DeHaat Centres" run by micro-entrepreneurs. Revenue from input sales plus commission or margin on produce sourced from farmers and sold to buyers. Also offers advisory and distributes insurance. |
| Financials (reported) | FY24 revenue ₹2,647.6 cr (Inc42); FY25 about ₹3,000 cr (ET via Medial; Inc42). Reported a profit in Q1 FY26 (Inc42). Raised about ₹200 cr of debt in Apr 2025. Last equity round reported as Series E (2022, ~$700M valuation; **UNVERIFIED**). Acquired AgriCentral in Jan 2025. |
| UX / technology / AI | NITI Aayog Frontier Tech: AI crop advisory for 30+ crops in several regional languages, reaching 1.8M+ farmers. An IndiaAI AIKosh page claims 10.6M registered farmers and 26M advisory sessions a month (**UNVERIFIED**; the sources conflict). The company page mentions voice calls in regional languages. |
| Strengths | Physical last-mile network; combines inputs and outputs; scale. |
| Weaknesses | Asset- and people-heavy; long road to profitability (Inc42); the digital layer is built around its app. |
| Status | Active. |

### 4.3 Ninjacart

| Dimension | Findings |
|---|---|
| Business model | B2B fresh fruit and vegetable supply chain (moved from B2C in 2015). Aggregates from farmers, runs collection centres and logistics, and supplies retailers, restaurants and quick-commerce. |
| Financials (reported, PTI/The Week, Dec 2025) | FY25 revenue ₹1,634 cr, down from ₹2,007 cr, after **dropping low-margin and non-core segments**. Loss ₹256 cr. Says all core verticals are operationally profitable and targets overall profitability in FY27. Its core fulfilment platform grew more than 100% year on year. |
| UX / technology / AI | Demand forecasting, route optimisation and catalogue pricing (company/AIM interview; accuracy claims are inconsistent). No verified voice or vernacular conversational layer. |
| Strengths | Supply-chain execution and buyer network for perishables. |
| Weaknesses | Capital-intensive logistics; perishable fruit and vegetables; history of restructuring. |
| Status | Active. |

### 4.4 AgroStar

| Dimension | Findings |
|---|---|
| Business model | Omnichannel agri-inputs: the "Agri Doctor" app, advisory call centres and about 10,000 retail outlets. Says it reaches more than 10M farmers (YourStory, Nov 2025). |
| Funding | ₹57.65 cr (Apr 2025, existing investors). About $30M led by Just Climate (Nov 2025) for omnichannel expansion, input and output verticals, and **AI capabilities**. FY25 revenue above ₹850 cr (Entrackr headline; **UNVERIFIED**). |
| UX / technology / AI | Photo-based advice on crop problems; **voice search for products** (YourStory); call-centre-assisted buying. |
| Strengths | Omnichannel reach, advisory-led trust. |
| Weaknesses for KISAAN's space | Led by input sales; farmer-to-buyer produce trading is not its core. |
| Status | Active. |

### 4.5 BigHaat

| Dimension | Findings |
|---|---|
| Business model | Digital input marketplace (400+ brands, about 10,000 SKUs) plus market linkage. Produce sales are reportedly about 85% of revenue. |
| Financials (reported) | FY25 revenue above ₹1,100 cr; the company claims EBITDA-positive quarters. Funding includes a $10M round led by Bidra Innovation Ventures (OCP Group) and an extended Series C of about ₹37 cr (Nov 2025). Bayer last-mile partnership (date **UNVERIFIED**). Goal of $1bn revenue and expansion to Africa and SE Asia (AgFunderNews). |
| UX / technology / AI | "Real-time crop care" tech stack (Krishi Jagran). Voice features **UNVERIFIED**. |
| Strengths | Breadth of input catalogue; large produce-trading volume. |
| Weaknesses | No verified conversational or voice layer for trading. |
| Status | Active. |

### 4.6 Arya.ag

| Dimension | Findings |
|---|---|
| Business model | Post-harvest grain commerce: warehousing and storage, finance backed by warehouse receipts, and a buyer-seller commerce platform. Serves FPOs, traders and processors. |
| Financials / funding (reported) | FY25 revenue ₹447 cr. H1 FY26 net revenue ₹300 cr and profit ₹31.5 cr (company-reported). $29M equity (Jul 2025). DFC committed a $19.8M guarantee to its subsidiary Aryatech. ₹725 cr Series D led by GEF Capital (Jan 2026; about 70% primary). |
| UX / technology / AI | No verified voice or vernacular AI. |
| Strengths | Strong in storage-linked trade and finance for non-perishables; profitable. |
| Weaknesses | Not a conversational marketplace for smallholders. |
| Relevance to KISAAN | **Potential partner** (storage, e-NWR finance) rather than a direct competitor. |
| Status | Active. |

### 4.7 AgriBazaar (StarAgri group)

| Dimension | Findings |
|---|---|
| Business model | Tech-led agri trading platform earning fees and interest income. Linked to StarAgri warehousing (about 1,080 warehouses as of May 2025) and collateral management. Planned verticals: Stocyard (non-agri) and Agrifresh (fresh produce) (Inc42 BrandLabs, a sponsored piece). Kisan Safalta Card with Yes Bank/RuPay (Agriculture Post). |
| UX / technology / AI | **UNVERIFIED**. |
| Strengths | Integrated warehousing and finance. |
| Weaknesses | No verified conversational, voice or vernacular layer. |
| Status | Active. |

### 4.8 Vegrow

| Dimension | Findings |
|---|---|
| Business model | B2B fruit marketplace that aggregates supply from partner farmers for organised buyers. |
| Financials | FY25 revenue ~₹544–555 cr and losses of about ₹154 cr (aggregators, **UNVERIFIED**). $46M Series C led by GIC (Dec 2023, reported by an aggregator). |
| UX / technology / AI | **UNVERIFIED**. |
| Status | Active per aggregators (**UNVERIFIED**). |

### 4.9 WayCool

| Dimension | Findings |
|---|---|
| Business model | Food supply chain and B2B distribution. |
| Events | Layoffs of about 300 (Jul 2023), 70 (Feb 2024) and 200+ (2024) (Inc42/Outlook Business). A $40M raise led by Lightrock reportedly did not close. |
| UX / technology / AI | **UNVERIFIED**. |
| Status | Distressed or restructured. **2025–26 operating status UNVERIFIED.** |

### 4.10 Jai Kisan

| Dimension | Findings |
|---|---|
| Business model | Rural fintech: the Bharat Khata digital ledger, plus credit through bank and NBFC partners and its own NBFC (acquired Kushal Finnovation). |
| Financials | FY24 revenue ₹48 cr; loss down 26.6% (Kredible). |
| Relevance to KISAAN | Potential **credit partner** (input credit, buyer credit), not a direct marketplace competitor. |
| Status | Active. |

### 4.11 Kalgudi, Bijak, Krishi Network, Gramophone, Kisan Network

| Player | Findings |
|---|---|
| **Kalgudi** | Hyderabad-based agri and livelihood commerce. FPOs, SHGs and farmers can list, translate, fulfil and settle; field "digital assistants" support adoption. Took ₹28 cr in loans from Samunnati (2022–24). No 2025–26 news found. |
| **Bijak** | B2B trader marketplace. A RuralVoice tag page lists a 29 Sept 2025 article calling it "India's No.1 agri-trading app" (self-claim). This suggests it is still operating, but its status is not verified. |
| **Krishi Network** | Advisory and community app in Hindi, Marathi, **Punjabi** and English (The Better India). No 2025–26 status found. |
| **Gramophone** | Advisory and inputs (MP-focused); added a "Vyapar" trading module (date **UNVERIFIED**). |
| **Kisan Network** (YC W16) | Farmer-to-institutional-buyer marketplace. **YC profile shows "Inactive."** No shutdown announcement found, so treat as likely dormant (**UNVERIFIED**). |

### 4.12 Government farmer-facing digital layers

| Layer | Findings |
|---|---|
| **Kisan e-Mitra** | AI chatbot for PM-KISAN and other schemes. Launched 21 Sept 2023 in 5 languages with Bhashini; upgraded in Feb 2024 by Wadhwani AI (with Google.org, Bhashini, EkStep, NIC, Samagra). According to Wadhwani AI it now handles **11 languages including Punjabi**, takes voice queries and answers in the same language, and has resolved more than 3M grievances for more than 290k farmers. It is not a marketplace, but it **shows that Punjabi voice AI for farmers is feasible**. |
| **AgriStack / Digital Agriculture Mission** | Farmer ID registry: **8.48 crore Farmer IDs as of 4 Feb 2026** (PIB, cited by ThePrint/TechObserver); about 11 crore reported in Oct 2026 (secondary). A possible future integration for farmer identity, land and crop data, once the rules on private-sector access are clear (**UNVERIFIED**). |
| **ONDC** | More than 9,000 FPOs onboarded (Financial Express, Jul 2025). KISAAN could plug into ONDC as a buyer-side or seller-side app (Future). |

## 5. Comparison matrix

Legend: ✅ verified present · ◐ partial or claimed · ✗ not found in this review · ? UNVERIFIED. "✗" means *not found in this review*, not proof that the feature is absent.

| Capability | eNAM | DeHaat | Ninjacart | AgroStar | BigHaat | Arya.ag | AgriBazaar | Vegrow | Kisan e-Mitra | **KISAAN (planned)** |
|---|---|---|---|---|---|---|---|---|---|---|
| Farmer → buyer produce trading | ✅ (mandi-bound) | ✅ | ✅ (F&V B2B) | ◐ | ✅ | ✅ (grain) | ✅ | ✅ (fruit) | ✗ | ✅ MVP |
| Agri-inputs sales | ◐ (via Platform of Platforms) | ✅ | ✗ | ✅ | ✅ | ✗ | ? | ✗ | ✗ | Future |
| Voice interaction | ✗ | ◐ (advisory calls) | ✗ | ◐ (voice search) | ? | ✗ | ? | ? | ✅ (scheme help) | ✅ MVP (`KIS-VOX`) |
| Conversational, end-to-end transacting | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ? | ✗ (not a marketplace) | ✅ MVP (one KISAAN AI, `KIS-AI`) |
| Punjabi language | ? | ? | ? | ? | ? | ? | ? | ? | ✅ | ✅ MVP |
| WhatsApp channel | ? | ? | ? | ? | ? | ? | ? | ? | ? | MVP notifications / P2 full (`KIS-WA`) |
| Price information | ✅ (247 commodities) | ? | ◐ (catalogue pricing) | ? | ? | ? | ? | ? | ✗ | ✅ MVP sourced mandi prices (`KIS-MKT`, `market` tools) |
| Online bidding / negotiation | ✅ (bidding) | ? | ✗ | ✗ | ? | ◐ | ✅ (e-auction) | ? | ✗ | ✅ MVP offers and counteroffers (`KIS-OFR`, `offers` tools) |
| Demand-side group buying with area leaders | ✗ (supply-side FPO aggregation only, src 89) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ MVP (`KIS-GROUP`) |
| Wholesale tiers / "buy the whole lot" | ◐ (lot auction) | ✗ | ◐ (B2B ordering; MOQ e.g. 2.5 kg on some vegetables, src 90; no published tiers) | ✗ | ◐ ("Bulk Order Inquiries" channel, src 86; no published tiers) | ◐ (lot trading) | ◐ (auction) | ? | ✗ | ✅ MVP quantity tiers + whole-lot (`KIS-WHL`, `KIS-BULK`) |
| Paid membership | ✗ | ◐ ("Premium Membership Program" for farmers with annual payment option; price/benefits not published, src 88) | ✗ | ✗ (referral points only, src 87) | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ MVP KISAAN Plus (`KIS-MEMBER`) |
| Promotions / coupons | ✗ | ✗ found | ✗ found | ◐ (AgroStar Points via referrals; scratch-card rewards, src 87) | ◐ (platform product offers, e.g. "offers on products under ₹499", src 86) | ✗ | ◐ (Kisan Safalta Card) | ? | ✗ | ✅ MVP **seller-controlled** coupons (`KIS-COUPON`) |
| Seller-run public stores | ✗ | ✗ | ✗ | ✗ | ◐ ("Sell on BigHaat" seller channel, src 86; per-seller storefront not verified) | ✗ | ✗ | ✗ | ✗ | ✅ MVP (`KIS-STORE`) |
| Logistics / transport | ◐ (LSPs on Platform of Platforms) | ✅ | ✅ (own) | ? | ? | ◐ | ? | ✅ | ✗ | ✅ MVP basic, P2 marketplace (`KIS-LOG`, `logistics` tools) |
| Quality assaying | ✅ (uneven in practice) | ? | ? | ✗ | ? | ✅ (storage) | ✅ | ? | ✗ | P2 inspector role; no AI certification |
| Storage / warehouse-receipt finance | ✅ (e-NWR) | ✗ | ✗ | ✗ | ✗ | ✅ | ✅ | ✗ | ✗ | Future via partners |
| AI features (verified level) | ◐ ("AI enabled quality assessment", PIB) | ◐ (AI crop advisory) | ◐ (forecasting/pricing, company claims) | ◐ (photo crop diagnosis) | ◐ ("AI Crop Doctor", src 86) | ✗ | ? | ? | ✅ (scheme Q&A) | ✅ one AI operating marketplace workflows via tools (`KIS-AI`) |
| Physical network / asset-heavy | Mandis | ✅ (centres) | ✅ | ✅ (outlets) | ? | ✅ (warehouses) | ✅ | ✅ | n/a | ✗ (asset-light by design) |

### 5A. Prompt v2 §36 dimension comparison: the five named competitors

Same evidence rules as §1: anything not found is written as **"Not found in public sources (2026-11-14)"**, which is not proof of absence. KISAAN entries are *planned* scope, not shipped features.

| Dimension | eNAM | DeHaat | Ninjacart | AgroStar | BigHaat | **KISAAN (planned)** |
|---|---|---|---|---|---|---|
| Marketplace | Govt e-trading layer over APMC mandis; lots bid online (src 1) | Inputs e-commerce + produce aggregation/sale to institutions | B2B fresh-produce supply chain to retailers/HoReCa (Ninja Kirana app, src 90) | Agri-inputs omnichannel (app, call centre, ~10k outlets) | Inputs marketplace + produce trading (~85% revenue, reported) | Open marketplace: farmers/sellers ↔ individual, bulk and group buyers |
| Seller stores | Not found in public sources (2026-11-14) (mandi lots, not stores) | Not found in public sources (2026-11-14) | Not found (company is the seller to retailers) | Not found (company is the seller) | "Sell on BigHaat" seller channel exists (src 86); per-seller public storefronts not found | Every seller gets a public, shareable store `/store/<slug>` |
| Wholesale | Lot-based auction | Institutional produce sales (B2B) | B2B ordering; MOQ cited as 2.5 kg for some vegetables (company blog testimonial, src 90); tier prices not published | Not found in public sources (2026-11-14) | "Bulk Order Inquiries" (src 86); tier prices not found | Seller-defined quantity tiers, whole-lot price, bulk-buyer onboarding |
| Group buying | Supply-side only: FPOs aggregate members' produce into lots; payment to the FPO account, which pays members (src 89) | Supply-side aggregation via village centres | Not found | Not found | Not found | **Demand-side** buyer groups with verified leaders; members pay the platform PA directly, never the leader |
| AI | "AI enabled quality assessment" mentioned (PIB) | AI crop advisory in regional languages; voice calls | Demand forecasting / route optimisation / pricing (company claims) | Photo crop diagnosis; voice product search (press) | "AI Crop Doctor" pest/disease tool (src 86) | One KISAAN AI operating listing, discovery, pricing explanation, negotiation, group coordination, orders by chat/voice via permissioned tools, with approval gates |
| Pricing (to users) | No commission (govt); mandi fees per state | Input margins; produce commission/margin | Own buy/sell pricing (company sets) | Retail input pricing | Retail input pricing; product-level offers | Seller-set prices + deterministic pricing engine; seller-side commission (D-19) |
| Logistics | Logistics providers via "Platform of Platforms"; unsold-lot logistics on the FPO (src 89) | Own last-mile network | Own collection centres and fleet logistics | Doorstep delivery of inputs | Doorstep delivery; Bayer last-mile partnership (src 86) | Seller-delivered / buyer-pickup in MVP; transporter marketplace P2 (asset-light) |
| Membership | None found | "Premium Membership Program", annual option, priority benefits; price not published (src 88) | Not found in public sources (2026-11-14) | Not found; referral **points** only (src 87) | Not found in public sources (2026-11-14) | KISAAN Plus (monthly/annual): free-delivery waiver within caps, member prices, member-only coupons |
| Coupons / promotions | None found | Not found in public sources (2026-11-14) | Not found in public sources (2026-11-14) | AgroStar Points (100 on referred sign-up; referrer 25 + 125; 45-day expiry, src 87); older scratch-card rewards | Platform-run product discounts (src 86) | **Seller-controlled** coupons with platform guardrails + admin emergency disable |
| User experience | 12-language web + app; mandi-centric workflow | App + village centre + voice calls | Retailer ordering app | App + call centre + retail outlets | App/web in several Indian languages (Telugu pages observed, src 86); missed-call ordering 1800-3000-2434 | Mobile-first PWA, Punjabi/Hindi/English, voice-first, conventional UI always available |
| Business model | Government scheme (no commission) | Input margin + output trading margin + services; membership (src 88) | Trading margin on produce supply | Input retail margin | Input margin + produce trading | Seller commission + KISAAN Plus + logistics fee + featured listings/stores (PAYMENT_AND_BUSINESS_MODEL) |

**What this changes in v0.2.** The v0.1 claim that *no* reviewed player has paid membership is corrected: DeHaat advertises a premium farmer membership (details unpublished). The differentiation still holds where the evidence supports it:
- seller-controlled coupons;
- per-seller public stores;
- demand-side buyer groups with leaders;
- published wholesale tiers;
- one AI that transacts.

None of these was found among the five named competitors.

## 6. Failures and lessons

| Event | Evidence | Lesson for KISAAN |
|---|---|---|
| **BharatAgri** (AI advisory + inputs) shut down in 2025 over a funding crunch | Entrackr / Inc42 | AI advisory alone did not sustain a business. Tie AI to transactions that earn revenue (commission, logistics fee, membership). |
| **Otipy** (farm-to-consumer) shut down in May 2025 | YourStory | Consumer delivery of perishables is costly. KISAAN focuses on B2B and bulk trades and stays out of last-mile consumer delivery. |
| **WayCool** layoffs (2023–24); a planned raise did not close | Inc42, Outlook Business | Capital-heavy distribution is fragile. Stay asset-light. |
| **Ninjacart** cut non-core, low-margin lines (FY25) | PTI / The Week | Keep scope disciplined; drop segments that lose money. |
| **Kisan Network** listed "Inactive" | YC profile (shutdown UNVERIFIED) | A farmer-to-institution marketplace without enough liquidity struggles. Plan cold-start liquidity (group leaders, area focus). |
| Sector-wide shift to profitability (DeHaat, Arya.ag, BigHaat, Ninjacart) | Reported | Revenue from the start (commission + membership + logistics fee) and watched unit economics. See [PAYMENT_AND_BUSINESS_MODEL](PAYMENT_AND_BUSINESS_MODEL.md). |
| eNAM's weaknesses: uneven assaying and limited inter-state trade | India Seminar; IMPRI; Business Standard | Remote buyers need a trust layer: verification, reputation, photos, and optional third-party assaying. |

## 7. Gaps and differentiation opportunities for KISAAN

These are analytical conclusions drawn from the evidence above, not sourced facts.

| # | Gap observed | KISAAN response | Requirement areas | Scope |
|---|---|---|---|---|
| G1 | **Voice-first, conversational transacting is largely unserved.** Voice appears mainly in advisory (Kisan e-Mitra, DeHaat advisory, AgroStar voice search), not in end-to-end buying and selling. | **One KISAAN AI** using permissioned tools so a user can list, discover, negotiate, order, arrange transport and check payment status by voice or chat, with approval gates (D-101) | `KIS-AI`, `KIS-VOX`, `KIS-APR` | MVP |
| G2 | **Punjabi is under-served.** eNAM's listed languages do not explicitly include Punjabi (UNVERIFIED either way), and cloud speech-to-text support for Punjabi is uneven. | Punjab-first launch; pa-IN, hi-IN and en-IN plus code-mixed speech; custom vocabulary for crops, varieties and mandis | `KIS-VOX`, `KIS-AI` | MVP |
| G3 | **No reviewed player combines demand-side group buying through area leaders, published wholesale tiers and membership** for agri trade (DeHaat has a farmer membership, but no group buying or published tiers were found, §5A). | Group leaders with public groups; wholesale tiers and "buy the whole lot" pricing; paid membership | `KIS-GROUP`, `KIS-WHL`, `KIS-MEMBER`, `KIS-PRC` | MVP |
| G4 | **Transport matching is fragmented.** Logistics providers are listed (eNAM Platform of Platforms), but no reviewed player matches lots, buyers and transporters conversationally. | `logistics` tools of the one KISAAN AI over the logistics module; transporter requests, quotes and assignment | `KIS-LOG`, `KIS-AI` | Basic MVP; marketplace P2 |
| G5 | **Price transparency is hard to use.** Agmarknet and eNAM data are public but the portals are clumsy and the data has gaps. | Sourced, dated mandi prices in chat; price alerts by voice or WhatsApp (mind per-message cost) | `KIS-MKT`, `KIS-AI`, `KIS-NOTF`, `KIS-WA` | MVP (in-app), alerts via WhatsApp per [roadmap](DEVELOPMENT_ROADMAP.md) |
| G6 | **Asset-heavy models are failing or pivoting.** | Asset-light marketplace; partner for storage and finance (Arya.ag, AgriBazaar/StarAgri, e-NWR) and credit (Jai Kisan-type NBFCs) | Business model | Future partnerships |
| G7 | **Trust gap for remote buyers** (eNAM assaying weakness) | Verification (`KIS-ONB`), reputation (`KIS-REV`), photo and voice lot descriptions drafted by KISAAN AI (with **no AI quality certification**), leader verification (`KIS-GROUP`), backend risk-rule flags reviewed by humans, optional third-party assayers | `KIS-ONB`, `KIS-REV`, `KIS-SEC`, `KIS-GROUP` | MVP; inspector role P2 |
| G8 | **Seller presence and promotion tools are missing** for small sellers | Public seller stores, seller-controlled coupons, inventory automation (only platform-run offers/points found at BigHaat/AgroStar, §5A) | `KIS-STORE`, `KIS-COUPON`, `KIS-INV` | MVP |
| G9 | **Platform-risk constraints** (WhatsApp AI policy; Bhashini public API limited to proof-of-concept use) | Keep the WhatsApp assistant scoped to marketplace intents; benchmark several STT providers and avoid single-vendor lock-in | `KIS-WA`, `KIS-VOX`, `KIS-AI` | MVP design constraint |

Possible partners rather than head-on competitors: Arya.ag and AgriBazaar/StarAgri (storage, warehouse finance), Jai Kisan (credit), ONDC (network distribution), AgriStack (farmer identity, once private-access rules are clear).

## 8. Data-source landscape

### 8.1 Mandi prices

| Source | What it offers | Access | Status / limits |
|---|---|---|---|
| **data.gov.in: "Current Daily Price of Various Commodities from Various Markets (Mandi)"** (source: AGMARKNET) | Daily wholesale min, max and modal price by commodity, variety and market | REST (JSON/XML/CSV) with a per-user API key. Resource ID `9ef84268-d588-465a-a308-a864a43d0070`. Commonly used pattern: `https://api.data.gov.in/resource/<id>?api-key=<KEY>&format=json&filters[state]=...` | **Live status UNVERIFIED**: the portal was unreachable from the research environment, and a snippet suggested "API for this resource does not exist… Request API". The resource reportedly holds only the latest day, so KISAAN must poll daily and keep its own history (**UNVERIFIED**). Exact refresh time UNVERIFIED. |
| data.gov.in / AIKosh: "Variety-wise Daily Market Prices Data of Commodity" | Daily min, max and modal by variety | data.gov.in; mirrored on IndiaAI AIKosh | Open Government License – India |
| **Agmarknet 2.0** (launched Nov 2025) | Portal and app; 4,367 linked mandis; 350+ commodities, ~2,000 varieties | Portal | **No official public developer API found (UNVERIFIED).** Vendor "Agmarknet API" pages are unofficial. |
| **eNAM** | Live price dashboard; app prices for 247 commodities | Portal / app | No public API found (UNVERIFIED). Covers eNAM mandis and lots only. Arrival data differs significantly from AGMARKNET (Business Standard 2018). |
| Licence | Government Open Data License – India (GODL-India, Gazette Feb 2017): commercial and non-commercial use **with attribution** | — | Full text and attribution wording to verify. |

**Known data-quality problems:** uploads 2–3 days late; mandis that report irregularly or not at all; modal price sometimes entered as the average of min and max; duplicate market IDs; missing series; inconsistent units and commodity or variety names.

**Implications for KISAAN (engineering guidance):**
- Build a normalisation layer: commodity and variety ontology, unit conversion to ₹/quintal, outlier filtering.
- Always show prices as **"indicative mandi rates (source: AGMARKNET via data.gov.in, date X, market Y)"**.
- Never present them as guaranteed offers, and never invent prices when data is missing (see the price-grounding guardrails in [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) and KIS-SEC-096).

**Weather (IMD)** (optional, P2): API reference at `https://api.imd.gov.in/public/api_reference.html` (city forecasts, district nowcast, rainfall, warnings, and more). Access requires a request to whitelist your server's IP address. Commercial-use terms are **UNVERIFIED**.

### 8.2 Speech and language technology

| Option | Punjabi | Hindi | Licence / terms | Implication |
|---|---|---|---|---|
| **Bhashini** (MeitY) | Voice in 22 languages | ✅ | Public API is "**for proof-of-concept purposes only**"; production use needs a paid arrangement (VERIFIED) | Usable for the Phase 0 spike; production use requires a commercial agreement |
| **AI4Bharat IndicConformer 600M** (newer Indic-Transcribe recommended) | ✅ `pa` | ✅ | MIT; Hugging Face access conditions | Can be self-hosted; strong candidate for the benchmark |
| **AI4Bharat IndicTrans2** | ✅ (22 languages) | ✅ | MIT (code and checkpoints) | Translation layer that can be self-hosted |
| **IndicWhisper / Vistaar** | No Punjabi WER found | ✅ (12 languages evaluated) | Open | 2023 results; may be superseded |
| **Google Cloud STT (Chirp 3)** | `pa-Guru-IN` **Preview** | `hi-IN` GA | Commercial | Punjabi not yet GA |
| **AWS Transcribe** | `pa-IN` batch and streaming (streaming not in some regions); no custom language models | `hi-IN` | Commercial | Polly Punjabi TTS UNVERIFIED |
| **Azure AI Speech** | `pa-IN` real-time, fast and batch STT; TTS voices `pa-IN-OjasNeural`, `pa-IN-VaaniNeural` | `hi-IN` | Commercial | The only cloud provider here with verified Punjabi STT and TTS |
| **Sarvam AI** | `pa-IN` STT (Saaras; supports code-mix and transliteration modes) | ✅ | Commercial. STT ₹0.49/min (₹0.59 with diarization); TTS Bulbul v4 Flash ₹1.00 / v3 ₹3.00 per 1,000 chars; translate ₹2.00 per 1,000 chars (excl. GST) | Punjabi TTS **UNVERIFIED**. REST STT is for audio under 30 s; use the Batch API for longer audio. |

**Implications:**
- Run a Phase 0 benchmark on real Punjabi and Hindi farmer voice notes covering IndicConformer/Indic-Transcribe, Sarvam, Azure, Google (Preview) and Bhashini (proof-of-concept only).
- Plan for WhatsApp OGG/Opus voice notes, noisy audio and code-mixing.
- Build a custom vocabulary of crop, variety and mandi names.
- Use a provider-abstraction layer (see [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md)).

### 8.3 WhatsApp Business Platform: constraints (Meta docs VERIFIED unless noted)

| Constraint | Detail | Implication for KISAAN |
|---|---|---|
| Pricing model | Charged per delivered message since 1 Jul 2025. Templates are Marketing, Utility or Authentication; Service messages can only be sent inside the 24-hour customer-service window. | Model notification costs per category |
| From 1 Oct 2026 | Service messages and in-window utility templates are **charged**. Each number gets 1,000 free service messages a month. | Conversational WhatsApp flows now cost money; budget them |
| Meta Business Agent category (from 1 Jul 2026) | Per-token billing at $2.00 per million tokens | Check whether it applies to KISAAN |
| Free entry point | Users arriving from Click-to-WhatsApp ads get a free window of up to 7 days | Acquisition lever |
| India billing | Must switch to INR billing by **31 Dec 2026**; non-INR accounts stop delivering from **1 Jan 2027** | Set up an INR billing account from day one |
| India rates | Marketing ≈ ₹0.8631, Utility/Authentication ≈ ₹0.115, + 18% GST (**UNVERIFIED**, secondary) | Download Meta's official rate card before costing |
| Opt-in | Must state consent, **name the business** and comply with law. Can be collected by SMS, web, IVR, in person or on paper. | Separate opt-ins by type (price alerts vs marketing); record opt-ins collected on paper by leaders; align with DPDP consent (`KIS-PRIV`) |
| Messaging limits | 250 → 2,000 → 10,000 → 100,000 → unlimited unique users per 24h outside the service window, per business portfolio | Get business verification early; protect the quality rating |
| AI chatbot policy | General-purpose AI assistants banned since 15 Jan 2026; business-specific bots allowed (TechCrunch, respond.io; secondary, **verify against Meta terms**) | Keep the assistant **scoped to marketplace intents**; no open-ended chat |
| Practical | Every proactive message needs an approved template; price alerts may be classed as marketing; voice notes arrive as OGG/Opus media; interactive lists, buttons and Flows reduce dependence on STT | Design templates per notification type; use buttons and lists for structured steps |

## 9. Summary: KISAAN positioning

KISAAN's position: **an asset-light, Punjab-first, voice- and WhatsApp-native marketplace for agri trade.** It covers the full transaction (list → discover → negotiate → order → transport → payment status) in conversation, with human approval gates. It adds demand-side group buying, wholesale tiers, KISAAN Plus membership, seller stores and seller-controlled coupons, all operated through one KISAAN AI or conventional screens, and builds trust through verification, reputation and honest, sourced price information. It avoids the capital-heavy logistics and inventory models behind recent agritech failures, and partners for storage, finance and credit.

## 10. Items still to verify (before external use)

1. Whether the data.gov.in mandi API is live, how keys are issued, and its rate limits.
2. Full GODL-India text and attribution wording.
3. Meta's official India rate card (exact INR per category).
4. Exact wording of the WhatsApp Business Solution Terms on AI providers.
5. Bhashini production pricing and terms.
6. Whether Google's Punjabi STT moves from Preview to GA.
7. Whether Amazon Polly and Sarvam Bulbul offer Punjabi TTS.
8. Commercial-use terms for IMD API data.
9. Whether Kisan Network, WayCool and Vegrow are still operating.
10. Whether eNAM's language list includes Punjabi.
11. Official Agriculture Census 2015-16 and 2021-22 figures.
12. The 78% fall in eNAM inter-state trade in FY25 (primary source).
13. Agritech funding totals for 2024 and 2025.
14. AgroStar's FY25 revenue and the DeHaat user figures on AIKosh.
15. DeHaat Premium Membership price, benefits and launch date (src 88 gives no price).
16. Whether "Sell on BigHaat" gives third-party sellers public storefronts, and BigHaat's bulk-order pricing terms.
17. Ninjacart's MOQ/pricing terms (only a company-blog testimonial found).
18. Which AgroStar referral scheme (points vs scratch card) is currently in force.

## 11. Sources (all accessed 2026-11-14)

**Government / official**
1. PIB Backgrounder, "National Agriculture Market (e-NAM): Digital Transformation of Agricultural Trade in India," 13 Apr 2026: https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/apr/doc2026413845801.pdf
2. PIB Bhashini factsheet, Feb 2026: https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202629784101.pdf
3. NeGD/PIB press release on Bhashini, Jan 2026: https://negd.gov.in/wp-content/uploads/2026/01/Press-Release_Press-Information-Bureau2-4.pdf
4. Bhashini API docs (GitBook): https://bhashini.gitbook.io/bhashini-apis/
5. data.gov.in resource page (unreachable on direct fetch): https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi
6. Gist listing the data.gov.in resource ID: https://gist.github.com/yashbonde/c3e2a0b63b2d8672999f5563d4f3728d
7. AIKosh, Variety-wise daily market prices dataset: https://aikosh.indiaai.gov.in/home/datasets/details/variety_wise_daily_market_prices_data_of_commodity.html
8. data.gov.in variety-wise dataset: https://www.data.gov.in/resource/variety-wise-daily-market-prices-data-commodity
9. IMD API reference: https://api.imd.gov.in/public/api_reference.html
10. IMD API whitelisting request: https://city.imd.gov.in/citywx/api_request.php
11. IMD APIs page: https://mausam.imd.gov.in/responsive/apis.php
12. PIB on average land holding (PRID 1605058): https://pib.gov.in/PressReleasePage.aspx?PRID=1605058
13. PIB AgriStack release (PRID 2225978; returned 403 on fetch): https://pib.gov.in/PressReleasePage.aspx?PRID=2225978
14. Y Combinator, Kisan Network profile: https://www.ycombinator.com/companies/kisan-network
15. IndiaAI, Kisan e-Mitra: https://indiaai.gov.in/article/exploring-pradhan-mantri-kisan-ai-chatbot
16. NITI Aayog Frontier Tech, DeHaat story: https://frontiertech.niti.gov.in/story/dehaats-ai-enabled-agriculture-network-driving-market-access-and-efficiency-for-1-8-million-farmers/
17. AIKosh DeHaat use case: https://aikosh.indiaai.gov.in/home/use-cases/details/ai_driven_regional_crop_intelligence_for_intelligent_crop_planning_and_precision_advisory.html

**Platform / vendor documentation**

18. Meta, Pricing on the WhatsApp Business Platform: https://developers.facebook.com/docs/whatsapp/pricing
19. Meta, Get opt-in for WhatsApp: https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in
20. Meta, Messaging limits: https://developers.facebook.com/docs/whatsapp/messaging-limits
21. Google Cloud, Chirp 3 transcription: https://docs.cloud.google.com/speech-to-text/docs/models/chirp-3
22. Google Cloud, Chirp 3 HD voices: https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd
23. AWS Transcribe supported languages: https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html
24. Azure Speech language support: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
25. Sarvam AI pricing: https://docs.sarvam.ai/api-reference-docs/getting-started/pricing
26. Sarvam AI STT API: https://docs.sarvam.ai/api-reference-docs/speech-to-text/transcribe
27. AI4Bharat IndicTrans2: https://github.com/AI4Bharat/IndicTrans2
28. AI4Bharat IndicConformer 600M: https://huggingface.co/ai4bharat/indic-conformer-600m-multilingual
29. AI4Bharat Vistaar / IndicWhisper: https://github.com/AI4Bharat/vistaar
30. Vistaar paper (Interspeech 2023): https://www.isca-archive.org/interspeech_2023/bhogale23_interspeech.pdf

**Press / secondary**

31. Inc42, DeHaat profitable in Q1 FY26: https://inc42.com/buzz/dehaat-turns-profitable-in-q1-fy26-eyes-full-year-profitability/
32. Inc42, Inside DeHaat's ₹3,000 Cr scale: https://inc42.com/features/inside-dehaats-inr-3000-cr-scale-and-its-long-road-to-profitability
33. Medial (ET), DeHaat FY25 revenue: https://medial.app/news/agritech-dehaats-fy25-revenue-up-11percent-to-rs-3000-crore-the-economic-times-97e25a44003a6
34. The Week/PTI, Ninjacart FY25: https://www.theweek.in/wire-updates/business/2025/12/26/dcm46-biz-agri-ninjacart.html
35. Free Press Journal, Ninjacart FY25: https://www.freepressjournal.in/business/ninjacart-battles-256-crore-loss-eyes-2026-27-profit-breakthrough
36. AgroSpectrum, Ninjacart pivot: https://agrospectrumindia.com/news/80/33159/ninjacarts-pivot-mirrors-broader-shake-up-in-indian-agritech.html
37. Analytics India Mag, Ninjacart AI: https://analyticsindiamag.com/how-ninjacart-utilises-ai-a-chat-with-ceo-thirukumaran-nagarajan/
38. YourStory, AgroStar $30M (Nov 2025): https://yourstory.com/2025/11/agritech-commerce-startup-agrostar-funding-just-climate
39. Entrepreneur, AgroStar $6.7M: https://india.entrepreneur.com/news-and-trends/accel-backed-agrostar-secures-usd-67-mn-funding/489751
40. Entrackr, BigHaat FY25: https://entrackr.com/exclusive/exclusive-bighaat-crosses-rs-1100-cr-revenue-in-fy25-turns-ebitda-profitable-9755082
41. AgFunderNews, BigHaat expansion: https://agfundernews.com/bighaat-unveils-global-expansion-plan-1bn-annual-revenue-goal-as-it-edges-towards-profitability
42. Indian Startup Times, BigHaat deep dive: https://www.indianstartuptimes.com/?p=27459
43. Entrackr, Arya.ag Series D: https://entrackr.com/news/agritech-firm-aryaag-raises-over-80-mn-in-series-d-from-gef-capital-10965656
44. Outlook Business, Arya.ag ₹725 cr: https://www.outlookbusiness.com/corporate/aryaag-raises-725-cr-from-gef-capital-to-scale-climate-smart-grain-commerce
45. Inc42 (BrandLabs), AgriBazaar/StarAgri: https://inc42.com/?p=537336
46. StarAgri, our story: https://www.staragri.com/about/our-story/
47. Agriculture Post, AgriBazaar tag: https://agriculturepost.com/tag/agribazaar/
48. Indian Startup Times, Vegrow: https://www.indianstartuptimes.com/?p=25938
49. Inc42, WayCool layoffs: https://inc42.com/buzz/waycool-initiates-another-round-of-layoffs-months-after-cutting-70-jobs
50. Outlook Business, WayCool layoffs: https://www.outlookbusiness.com/corporate/waycool-lays-off-over-200-employees-in-third-round-of-cuts-this-year-report
51. Kredible, Jai Kisan FY24: https://thekredible.com/blogs/jai-kisan-narrows-fy24-losses-by-26-6-revenue-climbs-to-rs-48-cr
52. Entrepreneur, Jai Kisan Series B: https://entrepreneur.com/en-in/news-and-trends/jai-kisan-raises-50-million-in-series-b-funding/432359
53. Indian Startup Times, Kalgudi: https://www.indianstartuptimes.com/?p=29237
54. ICT4Ag, Kalgudi KAEP: https://learningnetwork.ictforag.com/innovation/kalgudi-agri-engagement-platform-kaep
55. RuralVoice, Bijak tag: https://eng.ruralvoice.in/tag/bijak-marketplace
56. The Better India, Krishi Network: https://thebetterindia.com/277821/iit-alumni-app-for-farmers-increase-income-yield-information-krishi-network
57. Entrackr, BharatAgri shutdown: https://entrackr.com/exclusive/exclusive-bharatagri-shuts-down-operations-amid-funding-crunch-10646984
58. YourStory, Otipy shutdown: https://yourstory.com/2025/05/farm-to-consumer-startup-otipy-shuts-down-employees-customers-seek-clarity-layoff
59. Wadhwani AI, Kisan e-Mitra: https://www.wadhwaniai.org/empowering-millions-of-indian-farmers-with-instant-ai-chatbot-support/
60. NewsOnAir, Kisan e-Mitra launch: https://newsonair.gov.in/union-minister-kailash-choudhary-launches-pm-kisan-ai-chatbot-kisan-e-mitra-in-new-delhi
61. ThePrint, 8.48 crore Farmer IDs: https://theprint.in/india/govt-using-tech-in-big-way-in-farm-sector-8-48-cr-farmers-given-digital-ids-so-far-chouhan/2847965
62. Swarajya, 11 crore Farmer IDs: https://swarajyamag.com/news-brief/digital-agriculture-mission-crosses-11-crore-farmer-ids-five-months-before-march-2027-deadline
63. ONDC/Financial Express, FPOs on ONDC: https://ondc.org/blog/farmer-groups-expand-business-outreach-via-ondc
64. Magzter (Financial Express), FPOs rely on ONDC, GeM, eNAM: https://www.magzter.com/en/stories/newspaper/Financial-Express-Kochi/FPOS-RELY-ON-ONDC-GEM-ENAM-TO-BOOST-SALES
65. Global Agriculture, Agmarknet 2.0: https://www.global-agriculture.com/india-region/agmarknet-and-e-nam-empower-farmers-with-real-time-mandi-price-information/
66. agriculture.institute, Agmarknet coverage: https://agriculture.institute/?p=3865
67. Hans India, UP mandis API integration: https://www.thehansindia.com/news/national/yogi-government-connects-all-251-up-mandis-to-national-network-1127009
68. COLVEE, AGMARKNET material: https://opentextbooks.colvee.org/eextension/assets/pdf/AGMARKNET.pdf
69. The Wire, agri data revamp: https://thewire.in/agriculture/indian-agriculture-urgent-data-centric-revamp-policymaking
70. CEDA Ashoka, Agmarknet README (404 on direct fetch; cited via search snippet): https://agmarknet.ceda.ashoka.edu.in/README.html
71. Business Standard (2018), e-NAM distortions: https://www.pressreader.com/india/business-standard/20180425/281496456890241
72. India Seminar (2020), Understanding e-NAM: https://www.india-seminar.com/2020/725/725_shoumitro_and_mekhala.htm
73. IMPRI, e-NAM asymmetric quality testing: https://www.impriindia.com/centres/center-for-the-study-for-finance-and-economics/e-nam-vs-mandis-why-asymmetric-quality-testing-limits-price-arbitrage-for-farmers/
74. Rau's IAS Compass, e-NAM inter-state trade FY25: https://compass.rauias.com/current-affairs/inter-state-trade-electronic-national-agriculture-market-e-nam-declined-fy25/
75. Business Standard/PTI, Agri Census 2015-16: https://business-standard.com/article/pti-stories/govt-releases-agri-census-data-female-participation-rising-in-farm-sector-118100100875_1.html
76. Scribd, Agri Census summary: https://www.scribd.com/document/556652610/Agri-Census
77. GKToday, land fragmentation: https://gktoday.in/?p=154406
78. Atlas, data.gov.in GODL summary: https://atlas.co/data-portals/data-gov-in/
79. Wikimedia, GODL-India template: https://www.wikipedia.org/wiki/Template:GODL-India-text
80. TechCrunch, WhatsApp bars general-purpose chatbots: https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform
81. respond.io, WhatsApp chatbot policy 2026: https://respond.io/blog/whatsapp-chatbot-policy-2026
82. ecorpit, WhatsApp India rates: https://ecorpit.com/whatsapp-business-api-cost-india-d2c-2026/
83. Monty Mobile, India INR rates: https://montymobile.com/blogs/whatsapp-business-api-pricing-in-india-inr-rates-gst-and-the-2026-currency-migration-deadline
84. Analytics India Mag, Sarvam Bulbul v4 Flash: https://analyticsindiamag.com/ai-news/sarvam-ai-launches-bulbul-v4-flash-for-real-time-speech-in-11-indian-languages
85. IFPRI, GenAI voice advisory lessons: https://www.ifpri.org/blog/generative-ai-powered-voice-technology-in-agricultural-advisory-services-lessons-from-india/

**v0.2 refresh sources (accessed 2026-11-14)**
86. BigHaat, "Offers On Products Under 499" collection page (also shows "Sell on BigHaat", "Bulk Order Inquiries", missed-call ordering): https://www.bighaat.com/collections/super-offers-products-under-499 ; Krishi Jagran, Bayer–BigHaat last-mile delivery: https://krishijagran.com/industry-news/bayer-collaborates-with-bighaat-for-last-mile-delivery-of-agri-inputs ; Grow Asia BigHaat profile: https://digital.growasia.org/solutions/bighaat
87. AgroStar referral FAQ: https://corporate.agrostar.in/app-policy/referral-faq-en ; AgroStar scratch-card FAQ: https://corporate.agrostar.in/policy/scratchcard-faq-en
88. DeHaat (Green Agrevolution), "Solution for farmers" (Premium Membership Program): https://www.agrevolution.in/solution-for-farmers ; DeHaat partner tiers: https://mdc.agrevolution.in/partners
89. eNAM, FPO stakeholder page (aggregation, payment to FPO account, unsold-lot logistics): https://enam.gov.in/web/stakeholders-Involved/fpos ; PIB release (4,392 FPOs onboarded by 28 Feb 2025): https://pib.gov.in/PressReleasePage.aspx?PRID=2112409
90. Ninjacart blog, retailer story (MOQ 2.5 kg for some vegetables): https://ninjacart.com/blog/moving-past-the-wholesale-nightmare-a-modern-trade-retailers-story ; Ninja Kirana terms: https://ninjacart.com/ninja-kirana-terms-conditions/
