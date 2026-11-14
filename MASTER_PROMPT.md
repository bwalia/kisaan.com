# MASTER PROMPT: KISAAN – AI-POWERED AGRICULTURE MARKETPLACE

Act as a Senior Product Architect, Technical Architect, AI Systems Architect, Business Analyst, UX Strategist and Full-Stack Engineering Lead.

I am starting a new project called **KISAAN**, an AI-powered agriculture marketplace that connects farmers, agricultural product sellers, buyers, wholesalers, retailers, businesses and logistics providers.

Your task is to research, analyse, design and prepare COMPLETE, PROFESSIONAL, DEVELOPMENT-READY PROJECT DOCUMENTATION for KISAAN.

Do not start coding or implementing the application. Your first responsibility is to understand the business, identify requirements, design the architecture and prepare comprehensive documentation.

The documentation must be detailed enough that a development team can use it to start building the actual production-ready application without repeatedly guessing requirements.

---

# 1. PROJECT VISION

Project Name: KISAAN

Proposed Product Positioning:
AI-Powered Agriculture Marketplace.

Vision:
Build an intelligent agricultural marketplace where farmers can sell their products directly to buyers, buyers can discover verified suppliers, and AI agents automate most operational activities.

KISAAN should not be another ordinary e-commerce website.

Its biggest differentiator must be its AI-first approach.

Users should be able to interact with the platform through natural conversations, voice commands and regional languages instead of navigating complicated dashboards and filling lengthy forms.

Example:

A farmer says in Punjabi or Hindi:

"Mere paas 100 quintal wheat hai aur main Moga mein hoon. Mujhe achha buyer chahiye."

KISAAN AI should understand the request, collect missing information, prepare a product listing, identify potential buyers, compare available prices and help the farmer receive offers.

The farmer should remain in control of important decisions.

AI can automate repetitive work but must request approval before important actions such as accepting offers, confirming orders, making payments or committing to transactions.

# 2. BUSINESS MODEL AND USER ROLES

Design the platform around these primary user roles.

## A. Farmers / Sellers

Farmers should be able to:

- Register and create profiles.
- Verify their phone numbers and identities.
- Add agricultural products.
- Upload product photographs.
- List crops, quantity, quality, location and expected price.
- Manage available inventory.
- Receive buyer enquiries and offers.
- Negotiate prices.
- Accept or reject offers.
- Manage orders.
- Track payments.
- Arrange transportation.
- View sales history and earnings.
- Receive AI-generated recommendations.

## B. Buyers

Support different buyer categories:

- Individual consumers, where applicable.
- Retailers.
- Wholesalers.
- Distributors.
- Food processing companies.
- Restaurants.
- Exporters.
- Agricultural businesses.

Buyers should be able to:

- Search products.
- Filter by location, price, quantity and quality.
- Discover sellers.
- Compare available offers.
- Submit purchase requests.
- Negotiate prices.
- Place orders.
- Track deliveries.
- View order history.
- Receive notifications about matching products.

## C. Transporters / Logistics Providers

They should be able to:

- Register as transport providers.
- Add vehicle information.
- Specify service locations.
- Receive transportation requests.
- Submit delivery quotations.
- Accept transport assignments.
- Update pickup and delivery status.
- Manage completed deliveries.

## D. Platform Administrators

Admin capabilities should include:

- User management.
- Seller and buyer verification.
- Product listing moderation.
- Order monitoring.
- Dispute resolution.
- Payment monitoring.
- Commission management.
- Fraud detection.
- AI agent monitoring.
- Reports and analytics.
- Platform configuration.
- Audit logs and security controls.

## E. Group Buying Leaders (Bulk Buyers / Area Leaders)

A buyer can act as a **group leader** who buys in bulk on behalf of other people in an area (village, mandi, colony, cooperative, etc.).

- Group leaders use a **separate "Bulk Buyer / Group Leader" signup flow**, distinct from normal buyer signup, with its own verification requirements.
- Group leaders create and manage buying groups.
- See section 2A.2 for full requirements.

Also identify whether additional roles are needed, such as quality inspectors, warehouse operators and support agents.

# 2A. CONFIRMED MUST-HAVE FEATURES

The following features are confirmed business requirements. They are NOT optional and must be fully covered in the PRD, functional specification, database schema, API specification, UX specification, testing strategy and roadmap. Give each a unique requirement ID.

## 2A.1 Wholesale / Bulk Pricing Offers (Seller)

Sellers must be able to create wholesale offers on their listings:

- **"Buy the whole lot" offer:** a special price or discount if the buyer purchases the entire available quantity.
- **Quantity-tier discounts:** e.g. "Buy 50+ quintals get 5% off, 100+ quintals get 8% off" (tiered / slab pricing).
- Seller controls whether wholesale offers are enabled per listing, the tiers, minimum quantities and the discount type (percentage or fixed amount per unit).
- Buyers must see the wholesale tiers clearly on the product page and in search results, with the applicable price calculated automatically for the quantity in the cart/offer.
- Define how wholesale pricing interacts with negotiation, coupons (2A.6) and membership benefits (2A.3) — stacking rules must be explicit.

## 2A.2 Group Buying with Area Leaders (Buyer)

- A buyer can register as a **group leader** through a dedicated bulk-buyer signup.
- The group leader creates a **buying group** for an area and other buyers can join it.
- Groups must be **publicly visible**: anyone can see "this user is the leader of this area and is buying this quantity of this product".
- The leader aggregates demand from members and places a single bulk order (which can unlock wholesale pricing from 2A.1).
- Document: group creation, joining/leaving, member quantity commitments, group order lifecycle, how goods/payments are split or settled between leader and members, leader verification and ratings, dispute handling, and fraud/abuse controls (e.g. fake leaders collecting money).
- Clearly flag the legal/payment implications of a leader collecting money on behalf of members.

## 2A.3 Membership Programme (Prime-style)

- A paid membership option similar to Amazon Prime.
- Members receive extra benefits such as **free delivery, faster/priority delivery**, member-only discounts, early access to deals, and priority support (finalise the benefit list and mark which are MVP).
- Define plans (monthly/yearly), pricing placeholders, trial, renewal, cancellation, refunds, and benefit eligibility rules.
- **Terms and Conditions are mandatory**: produce a draft membership T&C covering benefits, eligibility, fees, auto-renewal, cancellation, refunds, benefit changes, misuse and termination. Mark it as requiring legal review.
- Members must accept the T&C (versioned, with acceptance timestamp stored) before activation.

## 2A.4 Public Seller Stores

- Every seller must have their own **public store page** (shareable URL) showing their profile, verification status, ratings, location/service area and all items currently for sale.
- Stores must be discoverable by everyone, including logged-out visitors (respecting privacy settings for contact details).
- Sellers can customise basic store details (name, banner, description, policies).

## 2A.5 Automated Inventory Management

- Alongside the store, sellers must have an inventory module to manage stock quantities.
- Inventory must be **automated**: stock is reserved when an order/offer is accepted, deducted on confirmation, and released on cancellation/expiry — no manual adjustment needed for normal flows.
- Support manual adjustments with reasons (audit logged), low-stock alerts, out-of-stock auto-hiding of listings, and prevention of overselling under concurrent orders.

## 2A.6 Seller-Controlled Discount Coupons

- Sellers can create and manage discount coupons for their own store/products.
- Seller controls: coupon code, discount type (percentage/fixed), value, max discount, minimum order value/quantity, applicable products/categories, **start and end date/time (limited-time coupons)**, total usage limit, per-user usage limit, eligible users (e.g. members only, group leaders only, first-time buyers), and active/paused status.
- Define validation, stacking rules with wholesale and membership discounts, who bears the discount cost, and abuse prevention.
- Platform-level coupons (admin-created) may be considered separately.

# 3. PRODUCT CATEGORIES

Design a scalable product categorisation system.

Consider:

- Wheat.
- Rice.
- Maize.
- Pulses.
- Fruits.
- Vegetables.
- Oilseeds.
- Spices.
- Cotton.
- Sugarcane.
- Seeds.
- Fertilisers.
- Pesticides.
- Agricultural machinery.
- Farming equipment.
- Animal feed.
- Other agricultural products.

Do not assume all categories must be available in the first release.

Separate MVP categories from future expansion categories.

Design product attributes that can vary by category.

For example, agricultural produce may require:

- Crop variety.
- Quantity.
- Unit (kg, quintal, tonne).
- Harvest date.
- Grade.
- Moisture content.
- Packaging.
- Storage conditions.
- Expected price.
- Minimum order quantity.
- Location.
- Availability.

# 4. CORE MARKETPLACE FUNCTIONALITY

Document all functional requirements for:

1. Authentication and registration.
2. User profiles.
3. Seller onboarding.
4. Buyer onboarding.
5. Product management.
6. Product listings.
7. Product search.
8. Filters and sorting.
9. Product details.
10. Inventory management.
11. Buyer enquiries.
12. Bidding and quotation system.
13. Negotiation and counteroffers.
14. Order management.
15. Payment processing.
16. Invoices and receipts.
17. Delivery management.
18. Reviews and ratings.
19. Notifications.
20. Customer support.
21. Disputes and refunds.
22. Admin dashboard.
23. Analytics and reporting.
24. Wholesale / bulk pricing offers (section 2A.1).
25. Group buying and area leaders (section 2A.2).
26. Membership programme and T&C (section 2A.3).
27. Public seller stores (section 2A.4).
28. Automated inventory (section 2A.5).
29. Seller discount coupons (section 2A.6).

For each feature explain:

- Purpose.
- User roles.
- User journey.
- Functional requirements.
- Business rules.
- Validation rules.
- Error scenarios.
- Dependencies.
- Acceptance criteria.
- MVP or future-phase classification.

# 5. AI-FIRST EXPERIENCE – MAIN DIFFERENTIATOR

This is the most important part of KISAAN.

Design the application around an AI-first conversational experience.

The AI assistant should be accessible throughout the platform.

Users should be able to perform marketplace activities by chatting or speaking.

Examples:

- "I want to sell 50 quintals of wheat."
- "Find rice suppliers near Ludhiana."
- "Show me the best available price for potatoes."
- "Find buyers who need 500 quintals of wheat."
- "Compare these three offers."
- "Arrange transport for my order."
- "Show my pending payments."
- "Where is my order?"

The AI should understand user intent, ask relevant questions, invoke the correct tools and provide actionable responses.

Design the following specialised AI agents.

## Agent 1: Main Kisaan AI Orchestrator

Responsibilities:

- Understand user intent.
- Maintain conversation context.
- Identify the user role.
- Route tasks to specialised agents.
- Coordinate multi-step workflows.
- Track task progress.
- Request user approval when required.
- Handle errors and fallback scenarios.

## Agent 2: Product Listing Agent

Responsibilities:

- Create listings from natural language.
- Extract product information from photographs.
- Generate product descriptions.
- Suggest relevant categories.
- Identify missing product information.
- Convert quantities and units.
- Prepare listings for seller approval.

Important: Image-based product identification must not automatically certify product quality.

## Agent 3: Product Discovery Agent

Responsibilities:

- Understand buyer requirements.
- Search relevant products.
- Identify suitable suppliers.
- Match products based on quantity, location, price and quality.
- Explain recommendations.
- Avoid recommending unavailable products.

## Agent 4: Price Intelligence Agent

Responsibilities:

- Retrieve available mandi prices.
- Compare prices across markets.
- Analyse historical trends where data exists.
- Provide estimated price ranges.
- Identify potential price differences between locations.
- Explain data sources and last updated timestamps.

Never invent market prices or present estimated prices as guaranteed transaction prices.

## Agent 5: Buyer-Seller Matching Agent

Responsibilities:

- Match farmers with relevant buyers.
- Consider location, quantity, product variety, quality and requirements.
- Rank matches.
- Explain why a buyer or seller is recommended.
- Respect user privacy and communication preferences.

## Agent 6: Negotiation Assistant

Responsibilities:

- Compare offers.
- Explain differences.
- Suggest negotiation strategies.
- Generate counteroffer drafts.
- Track negotiation history.
- Help users understand deal terms.

It must never accept or reject an offer without explicit user approval.

## Agent 7: Logistics Agent

Responsibilities:

- Identify available transporters.
- Compare transportation quotations.
- Estimate delivery costs where reliable information exists.
- Coordinate pickup and delivery.
- Track shipment status.

## Agent 8: Trust and Verification Agent

Responsibilities:

- Support identity verification workflows.
- Identify suspicious activity.
- Detect duplicate listings.
- Flag unusual pricing or transaction patterns.
- Support risk scoring.
- Escalate suspicious cases to human administrators.

AI risk scores must not be treated as definitive proof of fraud.

## Agent 9: Notification Agent

Responsibilities:

- Notify users about relevant offers.
- Send order updates.
- Notify users about delivery changes.
- Provide price alerts.
- Send reminders.
- Avoid duplicate or unnecessary notifications.

## Agent 10: Customer Support Agent

Responsibilities:

- Answer platform-related questions.
- Explain order status.
- Help users understand payment and delivery processes.
- Create support tickets.
- Escalate complex issues to human support.

For every agent document:

- Purpose.
- Responsibilities.
- Input.
- Output.
- Tools and API permissions.
- Required data.
- Workflow.
- Error handling.
- Human approval requirements.
- Security restrictions.
- Logging and monitoring.
- Test scenarios.

Also document agent-to-agent communication and orchestration.

# 6. VOICE-FIRST AND MULTILINGUAL EXPERIENCE

KISAAN should be designed for Indian farmers who may not be comfortable typing or using English.

Support:

- Punjabi.
- Hindi.
- English.

Plan for additional Indian languages in future.

Requirements:

- Voice input.
- Speech-to-text.
- Text-to-speech.
- Language detection.
- Regional-language responses.
- Mixed-language understanding.
- Voice-based product listing.
- Voice-based product discovery.
- Accessible UI.
- Simple navigation.
- Large touch-friendly controls.

Consider low-literacy users and users with limited digital experience.

The AI must confirm important extracted details before performing actions.

# 7. UNIQUE FEATURES AND COMPETITIVE DIFFERENTIATION

Analyse and design the following potential differentiators:

1. AI Photo-to-Product Listing.
2. AI Mandi Price Intelligence.
3. Voice-Based Marketplace.
4. Smart Buyer-Seller Matching.
5. AI Negotiation Assistant.
6. Smart Bulk Purchase Requests.
7. AI Logistics Coordination.
8. Seller Performance Insights.
9. Crop Availability Forecasting.
10. Automated Order Management.
11. WhatsApp-based marketplace interaction.
12. AI-powered demand discovery.
13. Multi-buyer quotation comparison.
14. Seller inventory alerts.

For each feature explain:

- How it works.
- Who benefits.
- Technical requirements.
- Data requirements.
- AI requirements.
- Development complexity.
- Business value.
- Whether it belongs in MVP or future versions.

Do not claim AI can reliably predict crop prices or future demand without sufficient validated data.

# 8. USER INTERFACE AND USER EXPERIENCE

Design a modern, clean, mobile-first interface.

The design should feel trustworthy, simple, agricultural and technologically advanced.

Suggested visual direction:

- Primary colour: Natural green.
- Secondary colour: White.
- Supporting colours: Earth tones and subtle amber.
- Clear typography.
- Large buttons.
- Accessible layouts.
- Simple navigation.
- Product photography.
- Easy-to-understand cards.

Design separate experiences for:

- Farmer.
- Buyer.
- Transporter.
- Administrator.

The AI chat interface should be a central interaction point.

However, users must also be able to use conventional screens when they prefer.

Document:

- Navigation structure.
- Page hierarchy.
- Dashboard layouts.
- Mobile layouts.
- Chat interface.
- Product listing screens.
- Search screens.
- Product details.
- Negotiation screens.
- Orders.
- Payments.
- Logistics.
- Admin dashboard.

Provide screen-by-screen specifications and important interaction states.

# 9. TECHNICAL ARCHITECTURE

Recommend a scalable, maintainable technology stack.

Consider the following starting preferences:

Frontend:
- Next.js.
- React.
- TypeScript.
- Tailwind CSS.

Backend (MANDATORY — see section 9A):
- **opsapi** is the backend. Do not design a new backend from scratch.
- REST APIs provided by opsapi (existing modules plus Kisaan-specific project modules).
- WebSocket or suitable real-time communication (reuse opsapi capabilities where they exist).

Database:
- PostgreSQL.
- Redis for caching and queues where appropriate.

AI:
- LLM integration.
- Tool calling.
- Multi-agent orchestration.
- Retrieval-Augmented Generation where useful.
- Speech-to-text and text-to-speech.
- Model abstraction so providers can be changed.

Storage:
- S3-compatible object storage for photographs and documents.

Infrastructure:
- Docker.
- Kubernetes where justified.
- CI/CD.
- Cloudflare or equivalent edge security.
- Centralised logging and monitoring.

Do not force unnecessary microservices.

Recommend a modular architecture that can start simply and scale as actual demand grows.

Document:

- System architecture.
- Component architecture.
- Backend modules.
- Frontend architecture.
- Database architecture.
- AI architecture.
- External integrations.
- Security architecture.
- Deployment architecture.
- Environment separation.
- Backup and recovery.

Include architecture diagrams using Mermaid.

# 9A. BACKEND PLATFORM: OPSAPI (MANDATORY)

The backend must be built on **opsapi**. Many required modules already exist in opsapi and must be reused instead of rebuilt.

Rules:

1. **opsapi is consumed, not modified.** Kisaan pulls the published opsapi Docker image from Docker Hub (`bwalia/opsapi:<tag>`). No changes are made to the opsapi repository for Kisaan.
2. **All Kisaan migrations live in the Kisaan repository**, never in opsapi. Kisaan follows the opsapi "external consumer product" pattern: a small image `FROM bwalia/opsapi:<tag>` that copies Kisaan's `project.lua` manifest, `migrations/`, and project API modules into `/app/projects/kisaan/`, with migrations run by opsapi's project migrator (tracked in `project_migrations`, separate from opsapi core migrations), e.g. as a deployment pre-upgrade hook.
3. **New APIs are created from Kisaan.** If Kisaan needs an API that opsapi does not provide, it is created within the Kisaan repo using opsapi's dynamic project-module / dynamic API support — not by editing opsapi.
4. Select opsapi features through `PROJECT_CODE` for the Kisaan deployment (e.g. ecommerce, delivery, notifications, reviews, chat, billing) and document the exact code(s) chosen.

Required analysis:

- Inspect opsapi (code and docs) and produce a **reuse map**: for each Kisaan requirement, state whether it is covered by an existing opsapi module (e.g. auth, users, roles/permissions, namespaces, stores, public-store, products, variants, categories, inventory, cart, checkout, orders, payments, delivery partners, reviews, notifications, groups, billing/subscriptions, invoices, AI/voice), needs a Kisaan extension (extra tables/columns via Kisaan migrations), or needs a new Kisaan API module.
- Identify gaps (e.g. wholesale tiers, buying groups, seller coupons, mandi prices, Kisaan membership benefits) and design them as Kisaan project modules.
- Document versioning: which opsapi image tag Kisaan pins, how upgrades are tested, and how to handle breaking changes in opsapi.
- Never invent opsapi capabilities: verify each module against the opsapi source before relying on it, and mark unverified items.

# 10. DATABASE DESIGN

Design a complete relational database model.

Consider entities such as:

- Users.
- UserRoles.
- FarmerProfiles.
- BuyerProfiles.
- TransporterProfiles.
- Addresses.
- Products.
- Categories.
- ProductListings.
- ProductImages.
- Inventory.
- ProductAttributes.
- BuyerRequirements.
- Offers.
- CounterOffers.
- Negotiations.
- Orders.
- OrderItems.
- Payments.
- Invoices.
- Shipments.
- Transporters.
- Reviews.
- Notifications.
- SupportTickets.
- Disputes.
- VerificationRecords.
- AIConversations.
- AIMessageHistory.
- AIAgentExecutions.
- ApprovalRequests.
- AuditLogs.
- SellerStores.
- WholesalePriceTiers.
- BuyingGroups.
- BuyingGroupMembers.
- GroupOrders / GroupOrderAllocations.
- MembershipPlans.
- Memberships.
- MembershipTermsVersions / TermsAcceptances.
- Coupons.
- CouponRedemptions.
- InventoryReservations / InventoryMovements.

For every entity, state whether it is **reused from opsapi** (name the existing table), **extended** by a Kisaan migration, or **new** in a Kisaan migration.

For each entity define:

- Purpose.
- Fields.
- Data types.
- Primary keys.
- Foreign keys.
- Indexes.
- Relationships.
- Constraints.

Include an ER diagram using Mermaid.

Consider multi-role users, data privacy, inventory consistency, transaction history and auditability.

# 11. API DOCUMENTATION

Design REST API endpoints.

Group them by module:

- Authentication.
- Users.
- Profiles.
- Products.
- Listings.
- Search.
- Inventory.
- Buyer requirements.
- Offers.
- Negotiations.
- Orders.
- Payments.
- Logistics.
- Notifications.
- Reviews.
- Admin.
- AI assistant.
- AI agents.
- Approvals.
- Seller stores (public and management).
- Wholesale pricing.
- Buying groups and group orders.
- Bulk buyer / group leader signup.
- Membership and T&C acceptance.
- Coupons.

For each endpoint, state whether it is an **existing opsapi endpoint** or a **new Kisaan endpoint** created via a Kisaan project module.

For each endpoint document:

- HTTP method.
- Endpoint.
- Purpose.
- Authentication.
- Permissions.
- Request schema.
- Response schema.
- Validation.
- Error responses.
- Rate limits.
- Idempotency requirements where applicable.

Include realistic JSON request and response examples.

# 12. PAYMENT AND REVENUE MODEL

Analyse suitable business models:

- Transaction commission.
- Seller subscriptions.
- Buyer subscriptions.
- Featured listings.
- Logistics service fees.
- Premium AI services.

- Paid membership (Prime-style) — confirmed requirement, see section 2A.3.

Recommend an initial model and explain why.

Also cover the cost and revenue impact of membership benefits (free/fast delivery), wholesale discounts and seller coupons, including who funds each discount.

For Indian payments, evaluate suitable payment gateway options.

Document:

- Payment lifecycle.
- Payment confirmation.
- Refunds.
- Failed transactions.
- Reconciliation.
- Settlement.
- Invoices.
- Platform commission.
- Payment disputes.

Do not assume the platform can hold or escrow customer funds without evaluating applicable legal and payment-provider requirements.

# 13. SECURITY, PRIVACY AND COMPLIANCE

Document:

- Authentication.
- Role-based access control.
- API security.
- Data encryption.
- Secure file uploads.
- Input validation.
- Rate limiting.
- Abuse prevention.
- Fraud detection.
- Audit logging.
- AI prompt injection protection.
- Tool permission boundaries.
- User consent.
- Data retention.
- Backup policies.

Analyse relevant Indian regulatory considerations, including:

- Digital Personal Data Protection Act and applicable rules.
- Consumer protection and e-commerce requirements.
- GST and invoicing implications.
- Payment gateway requirements.
- Agricultural market and APMC-related rules where applicable.
- Applicable state-specific agricultural trading requirements.
- FSSAI requirements where applicable to relevant products and business activities.

Clearly distinguish legal requirements from recommendations and assumptions.

Flag issues requiring professional legal or tax advice.

# 14. ADMINISTRATION AND BUSINESS INTELLIGENCE

Design a complete administrative dashboard.

Include:

- Total users.
- Verified farmers.
- Registered buyers.
- Active listings.
- Products by category.
- Total orders.
- Completed transactions.
- Pending orders.
- Revenue.
- Commission.
- Disputes.
- Suspicious activity.
- AI agent performance.
- AI operational costs.
- Conversion rates.
- Marketplace activity.

Define analytics events and KPIs.

# 15. NON-FUNCTIONAL REQUIREMENTS

Define measurable requirements for:

- Performance.
- Scalability.
- Availability.
- Reliability.
- Security.
- Accessibility.
- Maintainability.
- Observability.
- Data consistency.
- Disaster recovery.
- Mobile responsiveness.
- Low-bandwidth performance.

Include offline-friendly considerations for farmers with unreliable internet connections.

# 16. TESTING AND QUALITY ASSURANCE

Prepare a comprehensive testing strategy.

Include:

- Unit testing.
- Integration testing.
- API testing.
- End-to-end testing.
- UI testing.
- Mobile testing.
- Security testing.
- Performance testing.
- AI agent testing.
- Prompt injection testing.
- Voice recognition testing.
- Regional language testing.
- Payment testing.
- Order lifecycle testing.
- Logistics testing.
- Role and permission testing.

Create realistic end-to-end test scenarios.

Example:

A farmer registers, lists 100 quintals of wheat using voice, receives three buyer offers, negotiates, accepts one offer, receives an order, arranges transportation and completes the transaction.

Test the complete lifecycle.

# 17. DEVELOPMENT ROADMAP

Create a practical development roadmap divided into:

Phase 0: Discovery and planning.

Phase 1: Project foundation and authentication.

Phase 2: Core marketplace.

Phase 3: Offers and negotiation.

Phase 4: Orders and payments.

Phase 5: AI assistant and core AI agents.

Phase 6: Voice and regional languages.

Phase 7: Logistics and advanced intelligence.

Phase 8: Production readiness and launch.

For every phase specify:

- Deliverables.
- Features.
- Technical dependencies.
- Development tasks.
- Testing requirements.
- Completion criteria.
- Risks.
- Dependencies on external services.

Prioritise an achievable MVP rather than attempting to build everything simultaneously.

Place every section 2A feature (wholesale offers, group buying, membership, public stores, automated inventory, coupons) into a specific phase. Phase 1 must include setting up the Kisaan repo on the opsapi image (project module, migrations pipeline, PROJECT_CODE).

# 18. BUSINESS RISKS AND OPEN QUESTIONS

Identify potential challenges:

- Farmer onboarding.
- User trust.
- Product quality verification.
- Price fluctuations.
- Buyer and seller disputes.
- Logistics reliability.
- Payment failures.
- Fake listings.
- Fraud.
- Regional language accuracy.
- AI hallucinations.
- Market data availability.
- Regulatory restrictions.
- Marketplace liquidity.

Provide practical mitigation strategies.

# 19. MARKET AND COMPETITOR RESEARCH

Research existing Indian agricultural marketplaces and relevant platforms.

Consider platforms such as:

- eNAM.
- DeHaat.
- Ninjacart.
- AgroStar.
- BigHaat.
- Other relevant agricultural marketplaces.

Analyse:

- Business models.
- User experiences.
- Marketplace functionality.
- Technology approach.
- Strengths.
- Weaknesses.
- Gaps.
- Opportunities for differentiation.

Use reliable and current sources.

Never invent competitor features, statistics, partnerships or market-size figures.

Provide source links and research dates.

# 20. DOCUMENTATION DELIVERABLES

Create a complete documentation structure.

At minimum, prepare these separate Markdown documents:

1. README.md
   - Project overview.
   - Vision.
   - Objectives.
   - Documentation index.

2. PROJECT_OVERVIEW.md
   - Business vision.
   - Product scope.
   - User roles.
   - Business model.

3. PRD.md
   - Complete product requirements.
   - User stories.
   - Functional requirements.
   - Acceptance criteria.

4. FUNCTIONAL_SPECIFICATION.md
   - Detailed feature specifications.
   - Workflows.
   - Business rules.
   - Edge cases.

5. AI_AGENT_ARCHITECTURE.md
   - Agent ecosystem.
   - Orchestration.
   - Tools.
   - Permissions.
   - Approval workflows.
   - Failure handling.

6. UX_UI_SPECIFICATION.md
   - User journeys.
   - Page hierarchy.
   - Interface specifications.
   - Design system.

7. SYSTEM_ARCHITECTURE.md
   - Technical stack.
   - Architecture.
   - Infrastructure.
   - Integrations.
   - Mermaid diagrams.

8. DATABASE_SCHEMA.md
   - Entities.
   - Fields.
   - Relationships.
   - ER diagram.

9. API_SPECIFICATION.md
   - Endpoints.
   - Schemas.
   - Authentication.
   - Examples.

10. SECURITY_AND_COMPLIANCE.md
    - Security.
    - Privacy.
    - Indian regulatory considerations.

11. PAYMENT_AND_BUSINESS_MODEL.md
    - Revenue.
    - Payments.
    - Commission.
    - Refunds.

12. TESTING_STRATEGY.md
    - QA approach.
    - Test scenarios.
    - AI testing.

13. DEVELOPMENT_ROADMAP.md
    - Phases.
    - Milestones.
    - Dependencies.
    - Priorities.

14. RISKS_AND_ASSUMPTIONS.md
    - Risks.
    - Unknowns.
    - Assumptions.
    - Decisions required.

15. COMPETITOR_ANALYSIS.md
    - Market research.
    - Competitor comparison.
    - Differentiation.

16. REQUIREMENTS_TRACEABILITY.md
    - Requirement IDs.
    - Linked features.
    - APIs.
    - Database entities.
    - Test cases.

17. OPSAPI_INTEGRATION.md
    - opsapi reuse map (requirement → existing module / extension / new Kisaan module).
    - PROJECT_CODE selection.
    - Kisaan project-module structure, migrations and dynamic API approach.
    - Image pinning, upgrade and deployment process.

18. MEMBERSHIP_TERMS_AND_CONDITIONS.md
    - Draft membership T&C (requires legal review).
    - Benefit definitions and eligibility.

# 21. IMPORTANT WORKING INSTRUCTIONS

Follow these rules strictly:

1. Do not start coding.
2. Do not generate a superficial or generic project document.
3. Think like an experienced product and software architecture team.
4. Make documentation detailed, structured and implementation-ready.
5. Clearly separate MVP, Phase 2 and future features.
6. Identify dependencies between modules.
7. Avoid unnecessary complexity.
8. Prefer modular, maintainable and scalable architecture.
9. Use Mermaid for architecture, workflows and ER diagrams.
10. Include realistic examples.
11. Do not invent external APIs, data sources or integrations.
12. Research current Indian market and regulatory information where internet access is available.
13. Clearly mark unverified assumptions.
14. Never allow AI to execute sensitive financial or transactional actions without appropriate authorisation.
15. Design for low-bandwidth rural users.
16. Consider mobile-first usability.
17. Ensure the documentation is consistent across all files.
18. Give every major requirement a unique ID.
19. Include security, privacy and failure scenarios from the beginning.
20. Do not silently make major business decisions that have not been confirmed.
21. The features in section 2A are confirmed requirements and must not be dropped or deferred without flagging it.
22. Use opsapi as the backend; reuse its modules wherever possible.
23. Never propose changes to the opsapi repository. All Kisaan migrations and new APIs live in the Kisaan repository.

# 22. HOW TO EXECUTE THIS TASK

Work in the following order:

Step 1: Analyse the complete business concept.

Step 2: Identify missing business decisions and assumptions.

Step 3: Research the Indian agriculture marketplace and competitors.

Step 4: Define product scope and MVP.

Step 5: Design user journeys and business workflows.

Step 6: Design AI agent architecture.

Step 7: Design technical architecture.

Step 8: Design database and APIs.

Step 9: Define security, compliance and testing.

Step 10: Create the development roadmap.

Step 11: Generate all requested documentation files.

Step 12: Perform a consistency review across all documents.

Step 13: Create a final documentation completion report highlighting:
- Documents created.
- Requirements covered.
- Major architectural decisions.
- Unresolved questions.
- External dependencies.
- Risks.
- Recommended next steps.

If working inside an existing repository:

- First inspect the repository and Git status.
- Preserve all existing work.
- Do not overwrite unrelated files.
- Create a dedicated documentation directory, preferably /docs/kisaan/.
- Do not modify application code.
- Do not commit, push, merge or deploy anything.

If no repository is available, generate the complete documentation in a clearly organised standalone folder.

FINAL EXPECTATION:

I want KISAAN to become a serious, production-grade, AI-first agricultural marketplace, not just a simple e-commerce application with a chatbot.

Think deeply about how AI agents can genuinely reduce manual work for farmers, buyers, sellers and platform administrators.

Prepare documentation that can serve as the single source of truth for future product development.
