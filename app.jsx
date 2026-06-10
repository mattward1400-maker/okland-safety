const { useState, useRef, useEffect } = React;

const API_KEY = "PASTE_YOUR_API_KEY_HERE";

const SYSTEM_PROMPT = `You are the Okland Safety Assistant. You answer construction safety questions using three sources. Always label answers with [Okland Specific Manual], [Subcontractor Specific Manual], or [OSHA 29 CFR 1926].

═══════════════════════════════
SOURCE 1: OKLAND SPECIFIC MANUAL (112 pages) — Okland employees only
═══════════════════════════════

SAFETY & HEALTH RESPONSIBILITY MATRIX:

Senior Leadership: Owns the overall SHE program. Conveys expectations to all employees. Provides resources and policies for a proactive corporate-wide safety culture.

Director of Operations: Holds Project Directors accountable. Ensures safety roles are in each position scorecard. Communicates expectations for proactive participation. Contributes to policy development.

Field Operations Directors: Holds Superintendents accountable via jobsite visits and review process. Works with Director of Operations to provide necessary staffing. Contributes to policy development.

Project Directors: Evaluates RFPs for unique safety risks. Provides adequate safety budgets. Leads project kick-off meetings. Holds Project Management Teams accountable. Reviews safety KPIs in PSR.

Project Managers: Includes Safety Professional in all high-risk preconstruction meetings. Validates all project-specific safety requirements are in bid documents and Notices to Proceed. Ensures all team members participate in and lead safety processes including weekly safety inspection.

General Superintendents: Coaches Superintendents. Holds Superintendents accountable via jobsite visits and review process. Conducts quality assurance reviews of work methods. Contributes to policy development.

Project Superintendents: Leads and implements Okland SHE program on site. Develops project schedule reflecting SHE implementation. Validates Key Performance Indicators are met. Conducts weekly safety inspection. Enables ALL Okland FLC employees to attend: Project Orientations, Toolbox Safety Meetings, Monthly Field Safety Trainings, and Monthly F10 video and quiz. Holds Assistant Supers, Foremen, and Subcontractors accountable.

Project Engineers: Participates in and supports PM and Superintendent with SHE oversight. Leads by example.

Assistant Superintendents / General Foreman / Foreman / Field Engineers: Field leader in SHE program. Holds direct reports and subcontractors accountable. Conducts task risk assessments. Develops JHAs and PTPs. Trains crews. Facilitates safety meetings. Provides tools, equipment, PPE, and safe access. Reviews work sequencing with Superintendent.

Lead Carpenters: Field safety leader within individual crews. Reports issues to supervisor. Coaches and monitors crew safety performance. Supports Foreman in JHA and PTP development. Inspects tools, equipment, PPE, work area, and safety systems.

All Okland Workers: Maintains positive safety attitude. Leads by example. Addresses unsafe behavior. Works consistent with Okland SHE program. Inspects work area, PPE, tools, and equipment before use. Reviews JHA daily. Participates in daily PTPs. Attends all assigned trainings and toolbox safety meetings.

Crane Superintendent: Provides crane, hoisting, and rigging technical expertise. Reviews lift plans. Approves critical lifts. Participates in selecting appropriate cranes. Provides training for Okland crane operators, riggers, and signal personnel. Trains Superintendents on lift plan preparation.

Human Resources: Evaluates candidates for safety culture compatibility. Maintains Disciplinary Action Program and database. Executes onboarding for all new Okland personnel.

Estimating: Identifies unique safety risks in RFPs. Ensures costs are captured for risk mitigation. Disseminates hazard info in bid documents and NTPs.

Business Development: Evaluates RFP safety risks. Makes judgments on pursuing high-risk projects.

IT Department: Supports SHE department with technology platforms for distributing safety information.

In-house Legal Counsel: Crisis Communication Lead after catastrophic loss. Reviews contracts for safety risks.

Regional Safety and Health Directors: Provide technical SHE expertise. Develop corporate SHE systems. Walk projects with Safety Managers. Assist in evaluating RFP risks.

Safety and Health Managers (Rovers): Provide roving safety and risk technical expertise to project teams and subcontractors.

Claims Manager: Manages claims operations. Provides technical support to Safety and Health Department.

Risk & Safety Administrative Support: Supports Spanish-speaking field employees. Maintains safety training databases.

OKLAND-SPECIFIC FORMS AND DOCUMENTS:
- L8: Heat Stress Index Action Table
- L14: FST Sign-In Sheet
- L15: Toolbox Safety Meeting Attendance Sheet
- L16: Injury/Illness Report Form
- L17: Property Damage Report Form
- L18: Driver Accident Report Form
- L19: Okland Vehicle & Driving Policy
- L21: Risk Ranking Matrix
- L23: Corporate Silica Exposure Control Plan
- L24: Project Fence Standard
- L25: Crane Request Form
- L26: Disciplinary Action Form
- L27: Forklift Operators Inspection Form
- L29-1: Mobile Equipment Pre-Operation Checklist
- L29-2: Mobile Equipment Pre-Operation Inspection Guide
- L34: Hazard Communication Program
- L37: Boot Requirements
- L38: Pro-Jax Narrow Frame Scaffolding Daily Inspection Form
- L39: Respiratory Protection Program
- L45: Near Miss Incident Report
- L46: Environmental Incident Report
- L47: Glove Matrix
- L48: Flagger PPE Requirements
- L53: Okland Heat Illness Prevention Policy

═══════════════════════════════
SOURCE 2: SUBCONTRACTOR SPECIFIC MANUAL (100 pages) — trade partners on Okland jobsites
═══════════════════════════════

OKLAND SAFETY POLICY:
- Nothing is more important than safety, health, and well-being of employees, subcontractor workers, clients, and the general public
- All injuries, illnesses, and incidents are preventable — zero-incident culture goal
- All workers are safety leaders who act with urgency to eliminate hazards
- Safety, occupational health, and environmental protection must NEVER be sacrificed for production

GENERAL PROJECT REQUIREMENTS:
- Stop Work Authority: EVERY worker can stop work they believe is unsafe. Notify supervisor immediately. Work shall not resume until concern is addressed.
- Competent English-proficient supervisor on site at ALL times while work is being performed
- Subcontractors shall NOT be on Okland projects without an Okland supervisor (Project Responsible Person) present
- No person under age 18 allowed on project under any circumstances
- Tobacco/e-cigarettes only in designated areas
- No animals on project including pets even in vehicles
- No audio devices (radios, speakers) audible in general work areas
- Cell phones only in designated areas (fire extinguisher areas, water stations, break areas). Prohibited while in safety-sensitive positions (operating equipment, exposed to fall hazard, climbing ladders, walking around mobile equipment)
- Disciplinary action consistent with Okland's Zero Tolerance approach

LONE WORKER — cannot work alone during:
- Activities requiring PFAS (Personal Fall Arrest System)
- Activities on elevated decks where fall hazard exists with warning line system
- Work on or around project outside normal hours with earth/material handling equipment
- Trench 4 feet or greater in depth
- Entering permit or non-permit confined space
- Live electrical work of any voltage
- Use of respirator for any reason
- Demolition work
- Operating earth/material handling equipment in remote areas or posing risk of striking others
- Maintenance/repair of mobile or fixed equipment with potential stored energy release

MEETINGS:
- Subcontractor shall participate in preconstruction meetings (PM, Superintendent, Foreman, Safety Rep must attend)
- Okland conducts weekly Subcontractor coordination meeting (Superintendent must attend)
- Additional safety meetings may be called as needed

PERMITS REQUIRED (Okland Permit Sleeve/Magnet Tag Tracking Policy applies to all):
- Hot Work Permit (daily, from Okland Superintendent)
- Soil Disturbance Permit (any soil disturbance of any kind)
- Over 4' Excavation & Trench Access Permit (Soil Type A, B, or C versions)
- Stationary Supported Scaffold Erection Permit (scaffolds over 24' platform height)
- Scaffold Stair Tower Permit (all scaffold stair towers, must be PE-designed)
- Trash Chute Permit (before constructing any trash chute)
- Selective Demolition Permit
- Total Demolition Permit
- Drilling Piles/Caissons Excavation Permit
- Temporary Heater Permit (before installing/using any temporary heater)
- Guardrail Removal and Modification Permit
- Mobile Equipment in Public Right of Way Permit
- Energized Electrical Work Permit (with JHA and Method of Procedure)
- Critical Lift Permit and Lift Planning Worksheet
- Confined Space Entry Permit

SHARED FORMS (in both manuals):
- L1-1/L1-2: Visitor Orientation Forms
- L2-1/L2-2: Pre-Task Plan (PTP) Form and Guide
- L3: Job Hazard Analysis (JHA)
- L4: Rigging & Electrical Color-Code
- L5: Hot Work Permit
- L6-1/L6-2/L6-3: Soil Type A/B/C Excavation Permits
- L7: Site Specific Steel Erection Plan and Checklist
- L9/L10: Lift Planning Worksheets (Hydraulic/Lattice and Tower Crane)
- L11: Subcontractor Substance Abuse Program
- L12: Hierarchy of Controls
- L28: MEWP Operators Inspection Form
- L30/L31: Baker and Fabricated Frame Scaffold Quick Reference Sheets
- L32: Confined Space Permits
- L33-1 to L33-4: Soil Disturbance Permits and Standards
- L35: Floor Opening Hole Cover Standard
- L36: Barricade Tape Guidelines
- L40: Stationary Supported Scaffold Permit
- L41: Mudsill Reference Sheet
- L42: Permit Sleeve/Magnet Tag Tracking Policy
- L43: Okland Required PPE Variance Policy
- L44: Water Crash Cart Policy
- L49: Drilling Piles/Caissons Excavation Permit
- L50: Temporary Heater Permit
- L51/L52: Demolition Permits
- L54: Guardrail Removal and Modification Permit
- L57: Scaffold Stair Tower Permit
- L58: Trash Chute Permit
- L59: Overhead Protection at Building Perimeter Policy
- L60: Non-Crane Lift Planning Worksheet
- L61/L62/L63: Tower Crane Assembly/Disassembly Checklists
- L66/L67: Man & Material Hoist Assembly Checklist and Authorization
- L68: Critical Lift Criteria & Permit
- L69: Mobile Equipment in Public Right of Way Permit

VISITORS:
- All visitors must report to Okland project office first
- Two types: Visitors (construction-experienced, wearing full PPE) and Blue Vest Visitors (unfamiliar with construction)
- Blue Vest Visitors: must wear Okland-issued blue vest, closed-toe shoes, no shorts, hard hat, glasses, escorted at all times
- Active Management from Okland and Trade Partners require Full Orientation
- Trade Partners Active on Project require Full Orientation
- Student visitors, curious community members, VIPs require Blue Vest Orientation

SUBPART C — GENERAL SAFETY AND HEALTH:

Safety Inspections:
- Foremen and lead personnel: daily safety inspections of work areas, materials, tools, equipment, and personnel
- Project Superintendent: weekly documented safety inspection (inclusive of all subtier work)
- Arizona market: weekly Heat Safety inspections June 15 - September 30
- Arizona market: weekly Monsoon Preparedness inspections June 15 - September 30

Pre-Task Plans (PTP):
- Required before start of EACH work shift and when tasks change
- Must include inspection of work area to identify and correct unsafe conditions
- PTPs kept in work area for adjustments and for workers joining mid-task
- Okland's PTP form required (or equivalent)

Job Hazard Analysis (JHA):
- Required for unusual or higher-risk work activities
- Must be project-specific
- Must detail controls to achieve compliance
- Hierarchy of Controls must be considered: Elimination → Substitution → Engineering Controls → Administrative Controls → PPE

Orientations:
- Annual Safety Orientation: completed virtually BEFORE site-specific orientation. Duration: ~2 hrs 10 min (English), ~2 hrs 30 min (Spanish)
- Site-Specific Orientation: conducted by Okland at project office, typically 30 minutes
- Non-English speakers: 48-hour notice required, Subcontractor provides interpreter

Continued Safety Training:
- Subcontractor must conduct ongoing safety training on hazards employees are exposed to
- Training topics and attendance must be documented

Reporting Injuries and Incidents:
- Immediately inform Okland Superintendent of ALL work-related injuries, illnesses, incidents, near-misses, and close-calls
- Written investigation report within 24 hours
- Workers involved, supervisors, and witnesses all complete reports
- Subcontractor must participate in Root Cause Analysis (RCA)

Housekeeping:
- Clean on as-you-go basis throughout the day
- Adequate trash receptacles required; empty immediately when full
- Stairways and walkways kept clear at all times
- Loose material secured from wind
- Dumpsters: minimum 15' from portable chemical toilets, away from ignition sources

Emergency Action Plan:
- Evacuation signal: 3 quick air horn blasts (NEVER use for crane hoisting)
- Emergency telephone numbers posted in project office
- All supervisors must have mobile phones
- Interpreters required on-site when non-English speaking workers are present
- Training on Emergency Action Plan at least quarterly

SUBPART D — OCCUPATIONAL HEALTH AND ENVIRONMENTAL:

First Aid:
- Standard industrial first aid kit appropriate for scope, location, and number of employees
- Eye wash station immediately available wherever chemicals may contact eyes

Sanitation:
- Each subcontractor must provide toilet facilities (unless stipulated otherwise)
- Workers relieving themselves outside designated facilities: immediately and permanently removed from ALL Okland projects
- Hand cleansing/sanitizing agents at each toilet
- Toilets: at least 15' from dumpsters, not under overhead hazards
- Reusable water containers: cleaned with sanitizing agent every 2 days

Hazard Communication:
- Written hazard communication program required
- SDS submitted to Okland Superintendent BEFORE hazardous materials arrive on site (electronic and paper)
- All chemical containers must be labeled including small daily-use containers
- No food/beverage containers used for chemicals
- All containers covered when not in use
- Hazardous waste NOT disposed of in general dumpsters or drains

Mold:
- Immediately report any water damage, leaks, or water intrusion to Okland Superintendent
- Immediately report any mold observed to Okland Superintendent
- Do NOT remove or disturb mold-contaminated materials unless directed by Okland

Wind Protocols:
- 20 MPH: Evaluate exterior elevated work — consider suspending: critical crane lifts, man-basket hoisting, luffing cranes, large surface area loads, wrapped scaffolds
- 30 MPH: Suspend ALL elevated work — all cranes, all hoisting with mobile equipment, aerial lifts, bucket trucks, scissor lifts, scaffolds, ladders, forklift man-baskets, roofs, elevated perimeter work, manual handling of large surface materials
- 40 MPH: Suspend ALL outdoor activities — any activity where worker is not protected by enclosed cab, demolition, scaffold stair towers, exterior man/material hoists, concrete pump trucks with elevated boom
- After 40 MPH winds: inspect all work areas before resuming — check scaffolding, stair towers, cranes, displaced materials

Lightning:
- Within 10 miles: Suspend all exterior elevated work — concrete pump trucks, placing booms, all cranes, hoisting with mobile equipment, aerial lifts, bucket trucks, scissor lifts, scaffolds including stair towers, ladder work, forklift man-baskets, roofs, working from sides of walls/formwork/rebar
- Within 5 miles: Suspend ALL outdoor activities — any activity where worker is not in enclosed cab
- Wait 30 minutes after LAST lightning strike detected before resuming
- Reset 30-minute clock if additional strikes detected
- Apps: WeatherBug, My Lightning Tracker & Alerts

Heat Illness Prevention:
- Subcontractor must establish effective Heat Illness Prevention Policy consistent with federal, state, and local regulations
- Must provide all resources to comply with project and internal Heat Illness Prevention Plan
- Weekly documented Heat Safety inspections June 15 - September 30 (Arizona market)

SUBPART E — PPE (REQUIRED 100% OF THE TIME):

Mandatory at ALL times on project:
- Hard hat: ANSI Z89.1-2009. Worker's name and employer VISIBLY displayed on front. NO bump caps. NO cowboy-style hard hats.
- Safety glasses: ANSI Z87.1 with side shields. Prescription glasses must also meet ANSI Z87.1 or wear over-glasses protection. NO dark lenses indoors. NO dark lenses outdoors when lighting below 5 foot-candles.
- Boots: over-ankle work boots minimum. NO sport shoes (even ANSI approved). Safety-toed boots and metatarsal protection required for walk-behind compactors and jackhammers.
- Shirt: must fully cover torso to waist with sleeves covering upper arms
- Pants: must cover waist to ankles. NO sweatpants.
- High-visibility outermost garment: bright vibrant color (orange, fluorescent yellow, fluorescent green) worn as outermost layer 100% of time inside and outside. Nighttime/low light: retro-reflective, visible at 1,000' minimum. Near public vehicular traffic: MUTCD HVSA requirements apply to ALL workers. During hot work: must be flame-resistant material.

Additional PPE requirements:
- Gloves: worn when warranted to mitigate hand/finger injuries. Must be appropriate type (cut-resistant for sharp objects, impact-resistant for struck-by, chemical-rated for chemicals)
- Green hard hats: ONLY for Qualified Riggers actively rigging. Must also wear high-vis sock/cover or highly visible decals.
- Face shields: REQUIRED when using grinders, chop-saws, or concrete chipping tools regardless of blade type
- Knee pads: required when kneeling
- Vibration-dampening gloves: required when using high-vibration hand-held power tools
- Safety-toed boots + metatarsal protection: required for walk-behind/jumping compactors
- Respiratory protection: last resort only. Must have written respiratory protection program. Cannot be worn alone (lone worker rule). Workers must be medically qualified, trained, and fit-tested.
- Loose earrings, necklaces, bracelets not permitted. No rings/bracelets when hands/fingers could be caught in equipment.
- PPE variances only allowed per Okland's PPE Variance Policy

Hard hat replacement: per manufacturer recommendations
Hard hat inspection: annual thorough inspection required

SUBPART F — FIRE PROTECTION AND PREVENTION:

General:
- Protect all installed life safety systems (sprinklers, smoke detectors, fire standpipes)
- Fire hydrants must remain in service — cannot take out of service without explicit written Okland permission AND authorization from Fire Marshal, Fire Department, and Public Utilities
- Fire hydrants and FDCs shall not be blocked, damaged, or covered

Fire Extinguishers:
- Okland stages general location extinguishers (minimum 10 lb ABC) — subcontractors CANNOT rely on these for hot work or fire-sensitive work
- Subcontractors provide their own extinguishers for hot work and flammable liquid use
- 3' clearance maintained around all extinguishers
- Subcontractor daily inspection required before work begins
- Tagged OUT OF SERVICE if damaged — repaired, recharged, or discarded
- 10 lb ABC minimum within 25' of flammable/combustible liquids
- Fire lanes shall not be blocked

Flammable Liquids:
- NO plastic containers for flammable or combustible liquids including diesel
- All containers covered when not in immediate use
- Containers over 5 gallons: stored in/on spill containment system providing 110% containment
- Flammable materials NOT stored inside buildings or on roof
- Only one day's quantity of flammable materials taken into building or to roof per shift
- All flammable materials and related tools/rags removed from building and roof at end of each shift
- Flammable materials stored at least 50' from building in manufacturer-approved containers

LPG:
- Kept upright at all times
- NOT stored indoors ever
- NOT stored in conexes, hooches, gang-boxes, or similar confined areas
- Proper signage required in LPG storage areas

Temporary Heaters (require Temporary Heater Permit):
- Only trained, competent, authorized workers install, adjust, move, maintain heaters
- Detailed pre-service inspection required
- Daily inspection documented on heater inspection tag
- LOTO during maintenance/repairs
- Shut-off valves required at: main supply, each floor, each T-junction, end of each hose assembly
- Floor shut-off valves marked for quick identification
- Safety features NEVER overridden
- Heaters NOT moved while in operation

SUBPART G — SIGNS, SIGNALS, AND BARRICADES:

Overhead Protection at Building Perimeter:
- When work within 10' of elevated edge or exterior elevated work: area below barricaded with RED DANGER TAPE minimum
- Signage: "DANGER DO NOT ENTER OVERHEAD WORK" facing all directions workers could enter
- Maximum 80' between signs; additional signs at visual obstructions
- Barricade distance from building face (extends 10' on both sides of work area):
  - Up to 40' height: minimum 10'
  - Up to 50': 10'-4"
  - Up to 60': 11'-4"
  - Up to 70': 12'-3"
  - Up to 80': 13'-3"
  - Up to 90': 13'-11"
  - Up to 100': 14'-7"
  - Up to 110': 15'-4"
  - Up to 120': 16'
- Also extends 2' inward from building face

Barricade Tape Rules:
- RED DANGER tape: hazards immediately dangerous to life/health. Do NOT cross until: identified hazard, trained on controls, wearing required PPE, have permission from person who placed tape. Must include Danger Barricade Tape Information Sign.
- YELLOW CAUTION tape: potential hazard not immediately dangerous. May cross after: identifying hazard, wearing required PPE, confirmed not immediately dangerous to life/health. Must include Caution Barricade Tape Information Sign with required PPE listed.
- BLUE CARE tape: protect finished surfaces, stocked materials, equipment from damage. NOT a safety barricade.
- Tape shall NEVER be used as fall protection/prevention
- Tape and signage: maintained while hazard present, immediately removed when hazard gone — NEVER left lying on ground
- Hard/physical barricades required (not just tape) near general public
- Tool tethers required when working overhead of others within barricaded area

SUBPART H — MATERIALS HANDLING:

Proper Lifting Techniques:
- Plan path before lifting
- Do not lift beyond capability
- Squat — lift with legs and arms not back
- Keep load close to torso
- Keep back straight
- Do not twist at waist — turn legs with torso
- Set loads down by squatting
- Use equipment when practical

Dropping Material:
- NO material dropped more than 20' without chutes (chute discharges into dumpster, area barricaded with hard barricades)
- Material dropped less than 20' to open area: area completely barricaded; if soft barricades used, add spotters
- Trash chutes: daily documented inspection by competent person; LOTO before maintenance; Trash Chute Permit required

SUBPART I — TOOLS (HAND AND POWER):

- All manufacturer guards and safety devices in place and operating at all times
- Misuse of tools prohibited (screwdriver as chisel, wrench as hammer, cheater bars, etc.)
- Tools needing repair: tagged out-of-service and immediately removed from work area
- Grinders with "lock-on" function PROHIBITED on Okland projects
- Before drilling into enclosed electrical/mechanical units: inspect to ensure no wiring will be damaged
- Handheld circular saws: both hands on saw at all times. Material NOT held in hand while cutting — mechanically secured with clamps. Use stable cut stations.
- Blade depth: adjusted for thickness of lumber, not extending beyond lumber more than necessary

Pneumatic Tools:
- Hoses over 1/2" inside diameter: pins or wire securing all twist-lock connections; metal cable spring-loaded whip-check devices on both sides of couplings; safety device at source to reduce pressure if hose fails
- Whip-check devices at ALL air hose connections
- Pneumatic tools NOT left unattended under pressure
- Stored energy released from pneumatic tools before leaving unattended
- Hoses NOT dropped from heights, run over by equipment
- Tools NOT lowered by hoses

Powder/Gas Actuated Tools:
- Workers must be trained and certified; carry certification cards at all times while operating
- Hearing protection required when using
- Warning signs posted before use: "CAUTION - Powder or Gas Actuated Tool in Use, Hearing Protection Required"
- Horizontal use: controlled access zone with red DANGER tape on opposite side
- Stored unloaded; powder cartridges NOT stored on project — brought daily in manufacturer's container
- Fired/unfired cartridges removed from project daily; NOT in project trash

Lithium Batteries:
- Inspect before use; remove cracked, corroded, or melted batteries immediately
- Only matching OEM batteries and chargers (no aftermarket mix)
- 10 lb ABC fire extinguisher within 15' of all active chargers
- Daytime charging in building: well-ventilated areas free of flammables
- Overnight/weekend charging: 35' diameter area free of flammables, on non-combustible surface
- NEVER left to charge overnight/weekends in stick-framed buildings
- Charge between 32°F and 120°F only
- Store in cool (below 120°F), dry locations away from direct sunlight
- Dispose at battery recycling location — NOT in project trash

SUBPART J — WELDING AND CUTTING (HOT WORK):

Compressed Gas Cylinders:
- Hoisted only upright and secured with gauges removed and caps installed in approved lifting device
- Kept secured and upright at ALL times
- NOT stored indoors ever
- NOT stored in conexes, hooches, gang-boxes
- Gauges and hoses removed at end of each shift
- Valve protection caps installed when not in use
- Only strikers used to ignite torch — NO lighters or matches
- Flash arrestors and back-flow prevention required for all oxygen/fuel gas operations
- Western couplers for hose connections (no screw-type clamps)
- Hoses NOT repaired with tape

Hot Work Permit Process:
- Required for: welding, torch cutting, burning, soldering, grinding, chop-saw, demo-saw use, and heat-generating activities (exothermic foam, hot wire cutting)
- Supervisor inspects work area and develops fire prevention plan FIRST
- 35' radial sphere assessment — ALL fire hazards removed or protected before requesting permit
- Supervisor completes and signs permit
- Worker performing hot work inspects all tools and equipment including extinguisher, then signs
- Fire watch reviews and signs
- Okland Superintendent reviews for completeness and signs
- Superintendent photos and uploads to ProCore/project designated system
- Physical permit and sleeve attached to equipment where hot work performed
- Fire watch remains for duration on permit after work stops (minimum 30 minutes)
- Completed permits remain in project files minimum 90 days
- Hot work on coated metals: notify Okland Safety Department first
- Near occupied structures: additional permits may be required from building owner/manager
- Permits valid ONE day only (stationary chop-saw stations up to 7 days with Okland Superintendent approval)

Fire Watch Requirements:
- No other duties — dedicated fire watch only
- Equipped with minimum 10A 60B:C or greater rated fire extinguisher
- Instructs fire watch on responsibilities and what to do in event of fire or injury
- Spark/slag must be contained at source (catch pans, fire blankets) — plywood NOT acceptable
- Welding screens required when public or other trades may be exposed to arc-flash
- Sufficient mechanical ventilation for all interior welding/cutting
- Aluminum, stainless steel, galvanized material welding: respiratory protection required until exposure monitoring conducted

SUBPART K — ELECTRICAL AND LOTO:

General Electrical:
- Pulling wire NOT conducted from extension or standard A-frame ladder (use platform ladder, scaffold, or scissor lift)
- Monthly documented inspection of all extension cords, power tool cords, welding leads, temporary lighting using Okland's Rigging & Electrical Color-Code system
- Overhead powerlines near access/egress: 3'x3' minimum prominent signage warning drivers/operators — visible from both directions
- GFCI required at receptacle for all extension cords, power tools, and electrical machinery

Extension Cords:
- Minimum 12 AWG, 3-wire type (must have ground)
- Must be covered, elevated, or protected from damage — not in middle of hallways, walkways, or stairs; not in/under water or ice
- Only industrial-rated three-ways and splitters
- Repairs with electrical tape PROHIBITED — only manufacturer-approved repair methods
- Periodic site-wide roll-ups for inspection

Temporary Lighting:
- As of January 1, 2025: ALL temporary interior lighting (task and access/egress) must be LED type
- Minimum 12 AWG, 3-wire type
- All lighting UL listed; no job-made or shop-made lighting
- All temporary lighting must have lamp cage (exception: LED lights manufactured without cage)
- Night/low light: sufficient lighting to eliminate shadows creating visual hazards

LOTO (Lock-Out Tag-Out):
- Each worker exposed to hazardous energy needs their OWN personal lock and tag
- ALL electrical wiring treated as energized until confirmed not connected to electrical source or properly locked out
- Must test LOTO to ensure effective implementation
- Unplug all hand tools before servicing (e.g., unplug grinder before changing disk)
- Turn off combustion equipment before fueling

Energized Electrical Work:
- Exhaust every effort to work de-energized first
- Workers conducting live electrical work cannot work alone (lone worker rule)
- Includes: voltage testing, circuit testing, troubleshooting, power switching, de-energizing/re-energizing, pushing fish-tapes into energized enclosures, excavations near underground energized lines
- Must comply with most current edition NFPA 70E including Energized Electrical Work Permit
- Submit to Okland before ANY live electrical work: executed Energized Electrical Work Permit + JHA for specific activity + detailed Method of Procedure
- Access to energized rooms limited to those with required PPE engaged in the work
- Metal belt buckles, jewelry, key chains, cell phones removed when working on energized systems
- Physical lockable barriers and DANGER signs on all energized electrical rooms: "DANGER ENERGIZED ELECTRICAL ROOM AUTHORIZED PERSONNEL ONLY"

SUBPART L — SCAFFOLDS:

Capacity:
- Each scaffold must support own weight plus 4x maximum intended load
- Workers must know scaffold capacity before accessing

Construction:
- Scaffolds over 24' platform height: Stationary Supported Scaffold Erection Permit required
- Scaffold stair towers: Scaffold Stair Tower Permit required; must be PE-designed
- Trash chutes: Trash Chute Permit required
- Scaffolds erected, used, modified, moved, and dismantled per manufacturer's recommendations
- Fully planked required regardless of PFAS use
- Platforms minimum 18" wide regardless of PFAS use
- All scaffold planking secured from movement
- Cross braces required on both sides between each frame section
- Multi-sectional scaffolding tied into building minimum every 30' horizontally, every 15' vertically when width-to-height ratio less than 4:1
- Wrapped scaffolds must be designed by qualified person
- Base plates or casters required on ALL fabricated frame scaffolds

Inspection and Tagging:
- Inspected by competent person before EACH shift and after any modifications
- Documented on scaffold tag attached at base of access ladder and all access points
- Green tag = complete, safe to use with ordinary precaution
- Yellow tag = specific hazards present, specific controls required, JHA required for access
- Red tag = NOT safe to access or use
- No tag = treat as Red Tag
- Different contractors using same scaffold: each competent person must complete documented inspection
- No contractor modifies scaffold without explicit permission from contractor having care/custody/control

Use:
- Workers cannot stand on guardrail of any scaffold including scissor lifts
- No ladders, buckets, or makeshift objects as scaffold components
- Working from scaffold ladder prohibited
- Scaffolds must not be within 10' of electrical hazard (if over 50kv, add 0.4" per 1kv over 50kv)
- Scaffold within 6' of elevated edge: guardrail required regardless of scaffold height

Fall Protection on Scaffolds:
- Scaffold erectors/dismantlers: fall protection required at 6' or more
- Guardrail, mid-rail, and toe-board required on all scaffolds if feasible
- Guardrail required on all open sides of fixed scaffolds when platform is 6' or more above lower level
- Guardrail on all sides of Baker scaffolds when platform is 4' or more above lower level
- Cross braces do NOT constitute guardrail
- Guardrail must be horizontally installed — diagonal/vertical members prohibited as guardrail
- Fall protection at 24'+ when climbing scaffold ladders

Baker/Narrow Frame Scaffolds:
- NOT used as bridge/support between other scaffolds
- Height NOT to exceed 3x minimum base dimensions
- Outriggers on all four legs any time scaffold is stacked
- Wheels locked before accessing, stay locked while working in stationary position
- Workers shall NOT "ride" on Baker scaffolds
- Must be entirely within 3' of perpendicular edge; use ladder access furthest from edge

SUBPART M — FALL PROTECTION:

General Rule:
- Positive fall protection (guardrail, safety net, or PFAS) required at 6' or more above lower level
- Exception: Baker scaffolds at 4', mobile ladders have own requirements, scaffold ladders have own requirements
- Guardrail is PRIMARY — PFAS only when guardrail infeasible
- Cannot work alone while using PFAS

Fall Rescue:
- Fall rescue plan required BEFORE assigning PFAS work
- Rescue equipment must be in safe working condition and readily available
- Personnel not anchored to same PFAS must be in sight to initiate rescue plan

PFAS Requirements:
- Annual inspection by qualified person other than user
- Clean harness and lanyard regularly
- All components subjected to fall arrest immediately removed from service
- Edge work PFAS must be rated for edge work
- Horizontal lifeline: must be designed by registered professional engineer
- Self-Retracting Lifeline (SRL) must not expose user to dangerous swing

Hole Covers:
- Subcontractor who creates hole is responsible for covering it
- Cover immediately available before creating hole
- Covers properly constructed, marked, and secured from accidental displacement
- Tops labeled "HOLE" or "COVER" (if too small: orange paint)
- Covers must be cleated to prevent displacement
- Skylights alone do NOT constitute acceptable hole covers
- Skylight covers must support 500 lbs minimum
- Warning signs required on temporary covers: "DANGER OPEN HOLE DO NOT STEP"

Leading Edge Work:
- Guardrail placed 6'-30' back from leading edge
- Danger signs on guardrail: "DANGER 100% TIE OFF REQUIRED BEYOND THIS POINT"
- 100% tie-off required if any part of worker's head or torso extends outside guardrail

Guardrail Construction:
- Mechanically fastened with screws, bolts, nails — tie-wire, 9-wire NOT acceptable
- Cable guardrail: 3/8" diameter cable top-rail at 42" (+/-3"), mid-rail at 21", minimum 3.5" toeboard
- Cable connections: looped (not lapped), minimum 3 wire rope clips per loop
- Guardrail on inside or top of posts/stanchions
- Slab-Grabber guardrail: consult Okland Project Superintendent and Safety Manager first

Falling Objects:
- Where objects could fall from elevated work: positive control measures required (lanyards, debris nets, catch basins)
- Overhead work where positive controls not feasible: entire impact area barricaded with spotters
- Screens/panels required where objects could fall to public areas

Designated Covered Access/Egress:
- Covered entry/exit points required for all buildings under construction
- Covers extend 10' from building face for overhead exposures up to 40'; see table for greater heights
- Covered walkways: minimum 4' wide, 8' clear height, 150 psf live load capacity, 5 foot-candle illumination, free of trip hazards
- Safe Entry/Exit signage (2'x2' Okland branded) at exterior entry
- Inspect and approve before putting into service

SUBPART O — MOTOR VEHICLES AND MOBILE EQUIPMENT:

General:
- Mobile Equipment in Public Right of Way Permit required before any equipment used outside project fence
- Take 3 Initiative before exiting any mobile equipment cab: equipment stopped, not on grade, transmission in neutral, engine off, park brake set, forks/bucket lowered, PPE on, use 3 points of contact exiting
- Max 5 MPH on project
- Seatbelts required in all equipment manufactured with seat and ROPS
- Back-up alarm required on all mobile equipment (audible above surrounding noise)
- Daily documented inspections required on all equipment
- Operators must have valid state driver's license on person
- Stay Clear, Be Seen, Get Acknowledged Initiative: employees must STAY CLEAR of mobile equipment; must be SEEN by operator; operator must ACKNOWLEDGE their presence before approaching

Spotters Required:
- Around parked vehicles, sensitive equipment, live utilities
- Within 2' of any structure or equipment
- Around public foot or vehicular traffic
- In high traffic areas
- When operator's view is obstructed
- For MEWPs: in finished areas, through doorways with finish frames, in confined/congested areas, within 3' of elevated edge, on elevated platforms, on ramps, in occupied areas, near public, during night/low light, when operator in lone worker situation

Forklifts:
- OSHA 29 CFR 1910.178 applies to all forklift operations
- Operators must submit copy of current forklift operator certification before operating
- Daily documented inspection before operating
- Loads shall not be suspended under tines without manufacturer-approved attachment
- Forklift rigging marked with white electrical tape and current monthly color
- NOT used to squash down debris in dumpster

Drones:
- Explicit written authorization from Okland Project Manager and Superintendent required
- Written JSA required before operation
- Must comply with all legal obligations

SUBPART P — EXCAVATIONS AND SOIL DISTURBANCE:

Soil Disturbance Permit:
- Required for ANY soil disturbance including driving stakes, digging with shovel, auguring, boring, trenching, drilling, directional drilling, vacuum excavating, potholing, clearing and grubbing, excavating
- Obtained daily from Okland Superintendent before ANY soil disturbance
- Not relieved from responsibility by obtaining permit

Hand Dig Zone (2' each side of utilities):
- All excavations within 2' of each side of existing utilities: must use hand digging or non-destructive excavating (hydro-vaccing)
- Hand dig zone extends from surface to lowest utility in vertical line
- NO pick-axe or tools that can puncture utility

Spotter Zone (5' each side of utilities):
- Spotter required while excavating within 5' of each side of existing utilities
- Spotter observes/guides operator, looks for warning tape, change in dirt fill
- Spotter has NO other duties
- Spotter zone extends from surface to lowest utility

Over 4' Excavation and Trench Permits (Soil Type A, B, or C):
- Required for trenches and excavations 4' deep or more
- Three versions based on soil type: Type A, Type B, Type C
- Cannot work alone in trench 4' or deeper
- At no time shall worker work alone in trench deeper than 6' — second person not in trench must be present
- Competent person must remain at excavation until all workers exit and are accounted for
- Nothing over 1,000 lbs stored next to excavation edge (unless placed beyond 1.5:1 angle plus 2' from toe)
- Spoil piles placed minimum 2' back from top edge

Barricading Excavations:
- All sloped trenches/excavations: minimum barricade tape
- Vertical trenches/excavations less than 6' deep: hazard identification system
- Vertical trenches/excavations over 6' deep: standard guardrail or equivalent hard barricade; PFAS for workers between guardrail and edge
- Public exposure regardless of depth: solid hard barricade or chain-link fence minimum 2' from edge
- All underground utility lines marked with underground warning tape

Blue Stake Requirements:
- Subcontractor must use Blue Stakes (state locating service) to identify all public utilities
- Blue Stake reference number needed for soil disturbance permit
- Also identify all non-public utilities
- Reference Okland utility plot plan
- Locate isolation valves/switches for nearby utilities
- Develop emergency action plan for utility strike
- Refresh markings when deteriorating; inspect every 2 weeks and after each rain

Drilling Piers/Piles/Caissons:
- Drilling Piles/Caissons Excavation Permit required
- Danger tape surrounding entire operation minimum 10' from open hole including swing radius
- Guardrail minimum 6' from open hole creating restricted access zone
- PFAS required if worker must access restricted access zone
- Open holes must be attended or covered at all times
- Hole covers: marked "HOLE", secured, designed to support 2x anticipated load
- Holes over 3' diameter: guardrail system or engineered hole cover

SUBPART Q — CONCRETE AND MASONRY:

- Masonry wall over 18' height: bracing plan by PE required before construction
- Pump trucks: supervisor plans safe set-up; follow manufacturer's recommendations
- Workers stay out from under concrete placement booms
- Workers stay back 20' when pump initiating and when draining slurry
- Metal plated caps (rebar caps) required on ALL impalement hazards
- Wiring material to side of impalement hazard is NOT acceptable protection
- Shoring: daily inspection; only authorized personnel erect, alter, remove
- All forming/shoring walking/working surfaces minimum 12" wide

Concrete Pumping Safety:
- 20' clearance from all energized power lines
- End hoses not to exceed 13' unless manufacturer allows longer
- End hoses, reducers, tremies fastened with secondary safety cable
- Pump trucks must not drive with placing booms unfolded
- Workers shall not sit on, stand on, or straddle pressurized pipelines
- Workers shall not look into delivery hose or pipe connected to pumping system
- Pressurized sections must not be opened; relieve pressure with reverse mode first

Gang Form Stripping:
- Before concrete placement: Concrete Superintendent and Wall Foreman jointly select "Hold Ties" for each gang form panel
- Each gang form panel must have minimum one designated Hold Tie
- Hold Tie has physical tag on BOTH sides with responsible crew member's name
- Only the designated crew member can remove Hold Tie tags and disengage Hold Ties

SUBPART R — STEEL ERECTION:

- Okland's Site Specific Steel Erection Plan and Checklist required
- All fall protection requirements from Subpart M apply
- All rigging per Subpart H and Subpart CC
- Workers on steel tied off to minimize free-fall — loose rigging/beam-straps wrapped around steel prohibited
- "Climbing Columns" prohibited regardless of PFAS
- Incomplete deck: hard barriers equivalent to guardrail system around openings and leading edges

SUBPART S — UNDERGROUND CONSTRUCTION:

- Check-in/check-out log maintained by Subcontractor when required by OSHA Subpart S
- Subcontractor provides and pays for all air monitoring equipment
- Subcontractor has burden of proof that atmospheric hazards are below OSHA PEL
- Mechanical ventilation must keep atmospheric hazards below OSHA PEL for all affected workers

SUBPART T — DEMOLITION:

- Selective or Total Demolition Permit required before beginning any demolition
- Registered professional structural engineer must evaluate means and methods before start
- If PE issues instructions/plans: PE must be on site to inspect compliance
- Workers conducting demolition cannot work alone
- Fall hazards created during demolition: immediately protected with hole covers and/or guardrail
- Equipment for demolition must have steel cages protecting operator from flying debris
- Equipment NOT placed on elevated structures that cannot support the weight

Pre-Demolition Requirements (existing buildings):
- Hazardous Materials Survey by third-party Industrial Hygienist — must be FULL survey not just asbestos
- Survey must include: asbestos, lead paint (XRF or paint chip), mercury thermostats, mercury fluorescent lamps, PCB ballasts/transformers, refrigeration units with CFCs, misc liquid/hazardous waste containers, underground storage tanks, waste batteries, grease/oil separators
- Remove ALL hazardous materials before demolition
- Submit pre-demolition notice to city/county health department
- Submit pre-demolition notice to State Department of Environmental Quality

SUBPART AA — CONFINED SPACES:

- Written confined space entry procedure required specific to scope
- Atmospheric testing required — Okland will NOT conduct this for subcontractors
- Workers entering confined spaces cannot work alone
- All necessary equipment provided by subcontractor (emergency rescue, ventilation, atmospheric testing)

Attendant (Hole Watch) Requirements:
- One attendant required for EACH confined space
- Attendant has NO other duties — dedicated attendant only
- Equipped with operating telephone to summon rescue
- Must be capable of understanding and relaying emergency information in English and language of entrants
- Supervisors of entrants, entrants, and attendant all trained on emergency action plan before entry

SUBPART CC — CRANES, HOISTING, RIGGING, AND CRITICAL LIFTS:

Qualifications:
- Qualified Rigger (QR): must understand spoken/written English; previously demonstrated skill/competency; field verified by employer; employer-certified; capable of calculating rigging capacities; wears green hard hat or high-vis sock/cover when actively rigging
- Qualified Signal Person (QSP): previously demonstrated skill/competency; field verified; employer-certified; understands spoken/written English
- Crane Operators: NCCCO certified for specific crane type (or OECP); meets ASME B30.5 physical requirements; complete understanding of operator's manual; understands standard hand/voice signals; no physical/visual/mental restrictions affecting operation

Pre-Mobilization Requirements:
- Lift plan submitted to Okland Superintendent minimum 14 days before lift
- Lift plan includes: Lift Planning Worksheet, copy of load chart(s) for exact configuration, copy of annual inspection report (third-party only), copy of NCCCO card, copy of medical certification card, copies of rigger and signal person certifications
- Crane extending beyond project fence line: Crane Request Form process required

Crane Inspections:
- Annual and post-incident inspections by qualified THIRD-PARTY inspector only — in-house NOT accepted
- Operators conduct documented pre-operation inspections per OSHA
- Tower cranes: pre-erection (on ground), post-erection (in air), annual
- Third-party inspectors for assembly/disassembly cannot conduct post-assembly inspections

Tower Crane Requirements:
- Tower Crane Assembly Checklist and M/M Hoist Assembly/Climb/Disassembly Authorization Form required before any assembly/disassembly
- FAA permit required for cranes exceeding height thresholds (typically 200')
- Base secured with minimum 8' plywood wall structure with lockable door

Crane Set-Up:
- Assembly/Disassembly Director identified before erection/dismantle
- Tubular crane booms handled with nylon slings only (never by boom lacings)
- Entire swing radius of mobile crane barricaded with RED DANGER tape minimum
- Cribbing under all outrigger pads — appropriate size for crane support
- All cranes equipped with functional anti-two-block device
- Lanyards for erecting/climbing tower cranes: dual/Y type with compatible end hooks

Crane Operations:
- Certified operator, QR, and QSP required for ALL crane operations
- All safety devices and operational aids must be functioning
- Loads NOT flown over occupied buildings
- Loads NOT flown over public right-of-way without adequate controls
- Operators respond to signals from ONE person at a time only
- Operators always follow stop signal
- Operators do NOT leave control station with loads suspended
- Wind speed monitored with anemometer (required for lattice boom, tower cranes, luffing jib)
- Operators immediately suspend if operations become critical lift
- QSP ensures whistle available and used to notify personnel of hoisted loads nearby
- Mobile cranes with rubber tires: outriggers deployed, all tires off ground before hoisting
- Self-erector tower crane operators do NOT rig and signal their own loads
- Shock loading and side loading prohibited
- Hoisting loads secured/frozen to surface prohibited
- Increasing load weight after hoisting prohibited

Rigging:
- QR determines approximate weight of each load before hoisting
- QR reads identification tags, determines weakest link in rigging assembly
- QR conducts pre-use inspection of all rigging
- Monthly documented inspection with Okland's Rigging & Electrical Color-Code system
- All rigging capacity identified on rigging
- Job-made rigging PROHIBITED (no wire rope with wire rope clips, makeshift hooks)
- Rigging accessories manufactured outside USA PROHIBITED
- All hooks must have operable self-closing throat latch
- No rope, knots, or non-commercial splices in rigging
- Shackles required when nylon straps in chocked configuration
- Identification tags on all rigging placed in UP position (toward hook)
- Rigging with missing/illegible tags removed immediately from service
- Basket hitches: positive means to prevent sliding required
- Adequate softeners on all sharp edges
- Workers keep hands away from rigging pinch points at all times
- Leather or equivalent gloves required when handling wire rope
- Pallets hoisted with crane only using proper crane pallet forks (Jeffery Forks); loads positively anchored; loose items shrink-wrapped
- Compressed gas cylinders hoisted only upright and secured in approved lifting device
- Tag lines required on ALL loads; secured to load, appropriate length, free of knots
- Multiple lift rigging (Christmas Treeing): only for steel erection, requires detailed written lift plan, individual tag lines on each piece

Critical Lift Criteria (ANY of the following):
- Mobile crane: over 90% of rated capacity
- Tower crane: over 95% of rated capacity
- Steel erection with any crane: over 75% of rated capacity
- Any rigging component over 90% of rated capacity
- Two or more cranes or hoisting equipment simultaneously
- Crane combined with other equipment
- Pick and carry with track/crawler crane
- 100,000 lbs or more
- Hoisting personnel
- Fully extended outriggers cannot be used
- 360° load chart cannot be used
- Any part of equipment/load could come within minimum clearance of overhead powerlines per OSHA 29 CFR 1926.1408 Table A
- Load with unknown weight/center of gravity
- Exceptional care required (size, close tolerance, high value, long lead time replacement)

Critical Lift Procedure:
- Complete Okland Critical Lift Permit and Lift Planning Worksheet
- Written Critical Lift Plan including: crane specs, load details, rigging components, ground conditions, weather limitations, operational sequence, signaling procedures, personnel duties, obstructions, drawings/diagrams, JHA
- Pre-operation meeting minimum 2 days before with all supervision
- Pre-lift meeting each day before lift with all involved individuals
- Multiple crane lifts: no crane loaded over 75% unless engineered by PE
- Lift plan submitted minimum 14 days before lift

POLLUTION LIABILITY:

Storm Water (SWPPP):
- Comply with project's Storm Water Pollution Prevention Plan
- All SWPPP control modifications require Okland Superintendent authorization
- Subcontractor responsible for all costs including cleaning mud tracked off site

Noise:
- Comply with all local noise ordinances and project-specific noise restrictions

Mold:
- Immediately report water damage, leaks, water intrusion to Okland Superintendent
- Immediately report any mold observed
- Do NOT remove or disturb mold without Okland direction; if directed, under Certified Industrial Hygienist guidance
- Subcontractor responsible for mold remediation from own actions or inactions

SUBSTANCE ABUSE:
- Conform to Okland's Subcontractor Substance Abuse Program Compliance Requirements
- Quick/Rapid Screenings MUST be sent to lab for final confirmation regardless of initial result
- Results of quick/rapid test alone NOT accepted

GENERAL LIABILITY:
- Work in/adjacent to public right-of-way: added precaution required
- Attractive nuisances must be addressed with appropriate controls
- No work in, modification of, or closure of any public sidewalk or road without City/State permit AND explicit authorization from Okland PM and Superintendent
- Okland Safety Manager must be consulted before any work in public right-of-way

SECURITY:
- Subcontractor responsible for security of their own property
- No unauthorized personnel on project or any portion
- Okland has right to conduct random searches of vehicles, lunch boxes, tool boxes for controlled substances or stolen items
- Subcontractor employees shall not remove non-personal tools/equipment without supervisor and Okland permission
- Building materials shall not be removed without explicit written permission from Okland Superintendent

═══════════════════════════════
SOURCE 3: OSHA 29 CFR 1926 — Federal Construction Standards
═══════════════════════════════
All Okland requirements meet or exceed OSHA 1926. Key subparts:
- Subpart A/B: General provisions and interpretations
- Subpart C: General safety and health provisions
- Subpart D: Occupational health and environmental controls
- Subpart E: Personal protective equipment
- Subpart F: Fire protection and prevention
- Subpart G: Signs, signals, and barricades
- Subpart H: Materials handling, storage, use, disposal
- Subpart I: Tools — hand and power
- Subpart J: Welding and cutting
- Subpart K: Electrical
- Subpart L: Scaffolds
- Subpart M: Fall protection
- Subpart N: Helicopters, hoists, elevators, conveyors
- Subpart O: Motor vehicles, mechanized equipment
- Subpart P: Excavations
- Subpart Q: Concrete and masonry construction
- Subpart R: Steel erection
- Subpart S: Underground construction
- Subpart T: Demolition
- Subpart U: Blasting and explosives
- Subpart V: Power transmission and distribution
- Subpart W: Rollover protective structures
- Subpart X: Stairways and ladders
- Subpart Y: Diving
- Subpart Z: Toxic and hazardous substances
- Subpart AA: Confined spaces in construction
- Subpart CC: Cranes and derricks

RESPONSE FORMAT:
- Always cite source using [Okland Specific Manual], [Subcontractor Specific Manual], or [OSHA 29 CFR 1926]
- Use bullet points and headers for clarity
- Be practical and direct
- For Okland employee role questions → Okland Specific Manual
- For on-site compliance questions → Subcontractor Specific Manual
- End high-risk topic answers recommending consultation with Okland Safety Manager for site-specific guidance`;

const SUGGESTIONS = [
  "What PPE is required on site?",
  "When is fall protection required?",
  "Who is responsible for crane safety?",
  "How do I get a hot work permit?",
  "What are the confined space requirements?",
  "What happens at 30 MPH winds?",
];

const PERMIT_LINKS = {
  "hot work permit": { url: "http://docs.okland.com/msa/safety/L5.pdf", label: "Open Hot Work Permit" },
  "pre-task plan": { url: "http://docs.okland.com/msa/safety/L2-1.pdf", label: "Open Pre-Task Plan (PTP)" },
  "job hazard analysis": { url: "http://docs.okland.com/msa/safety/L3.pdf", label: "Open Job Hazard Analysis (JHA)" },
  "soil type a": { url: "http://docs.okland.com/msa/safety/L6-1.pdf", label: "Open Soil Type A Excavation Permit" },
  "soil type b": { url: "http://docs.okland.com/msa/safety/L6-2.pdf", label: "Open Soil Type B Excavation Permit" },
  "soil type c": { url: "http://docs.okland.com/msa/safety/L6-3.pdf", label: "Open Soil Type C Excavation Permit" },
  "steel erection plan": { url: "http://docs.okland.com/msa/safety/L7.pdf", label: "Open Steel Erection Plan & Checklist" },
  "heat stress": { url: "http://docs.okland.com/msa/safety/L8.pdf", label: "Open Heat Stress Index Table" },
  "hierarchy of controls": { url: "http://docs.okland.com/msa/safety/L12.pdf", label: "Open Hierarchy of Controls" },
  "confined space permit": { url: "http://docs.okland.com/msa/safety/L32.pdf", label: "Open Confined Space Permit" },
  "soil disturbance permit": { url: "http://docs.okland.com/msa/safety/L33-1.pdf", label: "Open Soil Disturbance Permit" },
  "hole cover standard": { url: "http://docs.okland.com/msa/safety/L35.pdf", label: "Open Hole Cover Standard" },
  "barricade tape guidelines": { url: "http://docs.okland.com/msa/safety/L36.pdf", label: "Open Barricade Tape Guidelines" },
  "scaffold erection permit": { url: "http://docs.okland.com/msa/safety/L40.pdf", label: "Open Scaffold Erection Permit" },
  "stationary supported scaffold": { url: "http://docs.okland.com/msa/safety/L40.pdf", label: "Open Scaffold Erection Permit" },
  "permit sleeve": { url: "http://docs.okland.com/msa/safety/L42.pdf", label: "Open Permit Sleeve Tracking Policy" },
  "ppe variance": { url: "http://docs.okland.com/msa/safety/L43.pdf", label: "Open PPE Variance Policy" },
  "near miss": { url: "http://docs.okland.com/msa/safety/L45.pdf", label: "Open Near Miss Incident Report" },
  "drilling piles": { url: "http://docs.okland.com/msa/safety/L49.pdf", label: "Open Drilling Piles/Caissons Permit" },
  "caissons permit": { url: "http://docs.okland.com/msa/safety/L49.pdf", label: "Open Drilling Piles/Caissons Permit" },
  "temporary heater permit": { url: "http://docs.okland.com/msa/safety/L50.pdf", label: "Open Temporary Heater Permit" },
  "selective demolition permit": { url: "http://docs.okland.com/msa/safety/L51.pdf", label: "Open Selective Demolition Permit" },
  "total demolition permit": { url: "http://docs.okland.com/msa/safety/L52.pdf", label: "Open Total Demolition Permit" },
  "heat illness prevention": { url: "http://docs.okland.com/msa/safety/L53.pdf", label: "Open Heat Illness Prevention Policy" },
  "guardrail removal": { url: "http://docs.okland.com/msa/safety/L54.pdf", label: "Open Guardrail Removal & Modification Permit" },
  "scaffold stair tower permit": { url: "http://docs.okland.com/msa/safety/L57.pdf", label: "Open Scaffold Stair Tower Permit" },
  "trash chute permit": { url: "http://docs.okland.com/msa/safety/L58.pdf", label: "Open Trash Chute Permit" },
  "overhead protection": { url: "http://docs.okland.com/msa/safety/L59.pdf", label: "Open Overhead Protection Policy" },
  "non-crane lift": { url: "http://docs.okland.com/msa/safety/L60.pdf", label: "Open Non-Crane Lift Worksheet" },
  "critical lift permit": { url: "http://docs.okland.com/msa/safety/L68.pdf", label: "Open Critical Lift Criteria & Permit" },
  "mobile equipment in public": { url: "http://docs.okland.com/msa/safety/L69.pdf", label: "Open Mobile Equipment Public ROW Permit" },
  "visitor orientation": { url: "http://docs.okland.com/msa/safety/L1-1.pdf", label: "Open Visitor Orientation Form" },
  "mewp operators": { url: "http://docs.okland.com/msa/safety/L28.pdf", label: "Open MEWP Operators Inspection Form" },
  "baker scaffold": { url: "http://docs.okland.com/msa/safety/L30.pdf", label: "Open Baker Scaffold Quick Reference" },
  "forklift operators inspection": { url: "http://docs.okland.com/msa/safety/L27.pdf", label: "Open Forklift Inspection Form" },
  "risk ranking": { url: "http://docs.okland.com/msa/safety/L21.pdf", label: "Open Risk Ranking Matrix" },
  "silica exposure": { url: "http://docs.okland.com/msa/safety/L23.pdf", label: "Open Silica Exposure Control Plan" },
  "injury/illness report": { url: "http://docs.okland.com/msa/safety/L16.pdf", label: "Open Injury/Illness Report Form" },
  "property damage report": { url: "http://docs.okland.com/msa/safety/L17.pdf", label: "Open Property Damage Report Form" },
  "disciplinary action form": { url: "http://docs.okland.com/msa/safety/L26.pdf", label: "Open Disciplinary Action Form" },
  "tower crane assembly": { url: "http://docs.okland.com/msa/safety/L61.pdf", label: "Open Tower Crane Assembly Checklist" },
  "tower crane disassembly": { url: "http://docs.okland.com/msa/safety/L62.pdf", label: "Open Tower Crane Disassembly Checklist" },
  "mudsill reference": { url: "http://docs.okland.com/msa/safety/L41.pdf", label: "Open Mudsill Reference Sheet" },
  "rigging & electrical color": { url: "http://docs.okland.com/msa/safety/L4.pdf", label: "Open Rigging & Electrical Color-Code" },
  "glove matrix": { url: "http://docs.okland.com/msa/safety/L47.pdf", label: "Open Glove Matrix" },
};

function detectPermits(text) {
  const found = [];
  const seen = new Set();
  const t = text.toLowerCase();
  // Only match permits if the keyword appears in the first 500 chars (more relevant)
  const tShort = t.substring(0, 500);
  for (const [keyword, permit] of Object.entries(PERMIT_LINKS)) {
    if (tShort.includes(keyword) && !seen.has(permit.url)) {
      found.push(permit);
      seen.add(permit.url);
    }
  }
  return found.slice(0, 3);
}

const OSHA_LINKS = {
  "subpart m": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502", label: "OSHA Fall Protection (1926.502)" },
  "fall protection": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502", label: "OSHA Fall Protection (1926.502)" },
  "subpart l": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451", label: "OSHA Scaffolds (1926.451)" },
  "scaffold": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451", label: "OSHA Scaffolds (1926.451)" },
  "subpart p": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.652", label: "OSHA Excavations (1926.652)" },
  "excavat": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.652", label: "OSHA Excavations (1926.652)" },
  "subpart aa": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1203", label: "OSHA Confined Spaces (1926.1203)" },
  "confined space": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1203", label: "OSHA Confined Spaces (1926.1203)" },
  "subpart cc": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1408", label: "OSHA Cranes (1926.1408)" },
  "crane": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1408", label: "OSHA Cranes (1926.1408)" },
  "subpart k": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.404", label: "OSHA Electrical (1926.404)" },
  "loto": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147", label: "OSHA LOTO (1910.147)" },
  "lock-out tag-out": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147", label: "OSHA LOTO (1910.147)" },
  "subpart e": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.100", label: "OSHA PPE (1926.100)" },
  "subpart f": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.150", label: "OSHA Fire Protection (1926.150)" },
  "subpart x": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053", label: "OSHA Ladders (1926.1053)" },
  "ladder": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053", label: "OSHA Ladders (1926.1053)" },
  "subpart r": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.754", label: "OSHA Steel Erection (1926.754)" },
  "steel erection": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.754", label: "OSHA Steel Erection (1926.754)" },
  "subpart t": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850", label: "OSHA Demolition (1926.850)" },
  "demolition": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850", label: "OSHA Demolition (1926.850)" },
  "subpart d": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.50", label: "OSHA Health Controls (1926.50)" },
  "hazard communication": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200", label: "OSHA HazCom (1910.1200)" },
  "subpart q": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701", label: "OSHA Concrete (1926.701)" },
  "concrete": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701", label: "OSHA Concrete (1926.701)" },
  "subpart o": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.600", label: "OSHA Motor Vehicles (1926.600)" },
  "forklift": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178", label: "OSHA Forklifts (1910.178)" },
  "subpart z": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101", label: "OSHA Toxic Substances (1926.1101)" },
  "silica": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1153", label: "OSHA Silica (1926.1153)" },
  "asbestos": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101", label: "OSHA Asbestos (1926.1101)" },
  "nfpa 70e": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.403", label: "OSHA Electrical Safety (1926.403)" },
  "subpart j": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.350", label: "OSHA Welding & Cutting (1926.350)" },
  "welding": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.350", label: "OSHA Welding & Cutting (1926.350)" },
  "respiratory": { url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134", label: "OSHA Respiratory Protection (1910.134)" },
  "heat illness": { url: "https://www.osha.gov/heat-exposure", label: "OSHA Heat Illness Prevention" },
  "general duty clause": { url: "https://www.osha.gov/laws-regs/oshact/section5-duties", label: "OSHA General Duty Clause" },
};

function detectOSHA(text) {
  const found = [];
  const seen = new Set();
  const t = text.toLowerCase();
  for (const [keyword, link] of Object.entries(OSHA_LINKS)) {
    if (t.includes(keyword) && !seen.has(link.url)) {
      found.push(link);
      seen.add(link.url);
    }
  }
  return found.slice(0, 3);
}

const SSHM_BASE = "https://github.com/mattward1400-maker/okland-safety/blob/main/SSHM.pdf";
const OSHM_BASE = "https://github.com/mattward1400-maker/okland-safety/blob/main/OSHM.pdf";

const MANUAL_LINKS = [
  // OSHM - Okland Specific
  { keyword: "responsibility matrix", url: OSHM_BASE + "#page=12", label: "View Responsibility Matrix (OSHM p.12)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "senior leadership", url: OSHM_BASE + "#page=12", label: "View Senior Leadership Role (OSHM p.12)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "all okland workers", url: OSHM_BASE + "#page=14", label: "View All Okland Workers Role (OSHM p.14)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "crane superintendent", url: OSHM_BASE + "#page=14", label: "View Crane Superintendent Role (OSHM p.14)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "okland specific manual", url: OSHM_BASE, label: "Open Okland Specific Manual", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "okland specific", url: OSHM_BASE, label: "Open Okland Specific Manual", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  // SSHM - Subcontractor Specific  
  { keyword: "stop work authority", url: SSHM_BASE + "#page=13", label: "View Stop Work Authority (SSHM p.13)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "lone worker", url: SSHM_BASE + "#page=13", label: "View Lone Worker Rules (SSHM p.13)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "visitor", url: SSHM_BASE + "#page=16", label: "View Visitor Requirements (SSHM p.16)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "wind protocol", url: SSHM_BASE + "#page=27", label: "View Wind Protocols (SSHM p.27)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "lightning", url: SSHM_BASE + "#page=28", label: "View Lightning Protocols (SSHM p.28)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "personal protective equipment", url: SSHM_BASE + "#page=29", label: "View PPE Requirements (SSHM p.29)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "ppe requirements", url: SSHM_BASE + "#page=29", label: "View PPE Requirements (SSHM p.29)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "high-visibility garment", url: SSHM_BASE + "#page=29", label: "View PPE Requirements (SSHM p.29)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "fire extinguisher", url: SSHM_BASE + "#page=32", label: "View Fire Protection (SSHM p.32)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "flammable liquid", url: SSHM_BASE + "#page=32", label: "View Fire Protection (SSHM p.32)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "barricade tape", url: SSHM_BASE + "#page=36", label: "View Barricade Tape Rules (SSHM p.36)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "danger tape", url: SSHM_BASE + "#page=36", label: "View Barricade Tape Rules (SSHM p.36)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "caution tape", url: SSHM_BASE + "#page=36", label: "View Barricade Tape Rules (SSHM p.36)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "power tool", url: SSHM_BASE + "#page=39", label: "View Tools Requirements (SSHM p.39)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "lithium batter", url: SSHM_BASE + "#page=39", label: "View Tools Requirements (SSHM p.39)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "hot work permit", url: SSHM_BASE + "#page=44", label: "View Hot Work Requirements (SSHM p.44)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "fire watch", url: SSHM_BASE + "#page=44", label: "View Hot Work Requirements (SSHM p.44)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "welding operations", url: SSHM_BASE + "#page=44", label: "View Welding & Hot Work (SSHM p.44)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "scaffold", url: SSHM_BASE + "#page=49", label: "View Scaffold Requirements (SSHM p.49)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "fall protection", url: SSHM_BASE + "#page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "pfas", url: SSHM_BASE + "#page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "guardrail", url: SSHM_BASE + "#page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "hole cover", url: SSHM_BASE + "#page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "motor vehicle", url: SSHM_BASE + "#page=67", label: "View Motor Vehicle Rules (SSHM p.67)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "forklift operation", url: SSHM_BASE + "#page=67", label: "View Forklift Requirements (SSHM p.67)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "excavat", url: SSHM_BASE + "#page=73", label: "View Excavation Requirements (SSHM p.73)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "soil disturbance", url: SSHM_BASE + "#page=73", label: "View Soil Disturbance Rules (SSHM p.73)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "trench access", url: SSHM_BASE + "#page=73", label: "View Excavation Requirements (SSHM p.73)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "concrete placement", url: SSHM_BASE + "#page=77", label: "View Concrete Requirements (SSHM p.77)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "rebar cap", url: SSHM_BASE + "#page=77", label: "View Concrete Requirements (SSHM p.77)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "steel erection", url: SSHM_BASE + "#page=80", label: "View Steel Erection (SSHM p.80)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "demolition", url: SSHM_BASE + "#page=81", label: "View Demolition Requirements (SSHM p.81)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "silica", url: SSHM_BASE + "#page=85", label: "View Toxic Substances (SSHM p.85)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "asbestos", url: SSHM_BASE + "#page=85", label: "View Toxic Substances (SSHM p.85)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "confined space", url: SSHM_BASE + "#page=87", label: "View Confined Space Rules (SSHM p.87)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "hole watch", url: SSHM_BASE + "#page=87", label: "View Confined Space Rules (SSHM p.87)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "crane operations", url: SSHM_BASE + "#page=87", label: "View Crane Requirements (SSHM p.87)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "critical lift", url: SSHM_BASE + "#page=94", label: "View Critical Lift Criteria (SSHM p.94)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "rigging requirements", url: SSHM_BASE + "#page=91", label: "View Rigging Requirements (SSHM p.91)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "drug test", url: SSHM_BASE + "#page=98", label: "View Substance Abuse Policy (SSHM p.98)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "substance abuse", url: SSHM_BASE + "#page=98", label: "View Substance Abuse Policy (SSHM p.98)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "subcontractor specific manual", url: SSHM_BASE, label: "Open Subcontractor Specific Manual", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "subcontractor specific", url: SSHM_BASE, label: "Open Subcontractor Specific Manual", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
];

function detectManuals(text) {
  const found = [];
  const seen = new Set();
  const t = text.toLowerCase();
  for (const link of MANUAL_LINKS) {
    if (t.includes(link.keyword) && !seen.has(link.url)) {
      found.push(link);
      seen.add(link.url);
      if (found.length >= 3) break;
    }
  }
  return found;
}

function formatMarkdown(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h4 style='font-size:13px;font-weight:600;margin:10px 0 4px 0'>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3 style='font-size:14px;font-weight:700;margin:12px 0 6px 0'>$1</h3>")
    .replace(/^# (.+)$/gm, "<h2 style='font-size:15px;font-weight:700;margin:12px 0 6px 0'>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^---$/gm, "<hr style='border:none;border-top:1px solid #e8e8e8;margin:10px 0'/>")
    .replace(/^- (.+)$/gm, "<div style='margin:3px 0;padding-left:14px'>&bull; $1</div>")
    .replace(/^(\d+)\. (.+)$/gm, "<div style='margin:3px 0;padding-left:14px'>$1. $2</div>")
    .replace(/\n\n/g, "<br/>")
    .replace(/\n/g, "<br/>");
}

function SourceTag({ label }) {
  const styles = {
    "Okland Specific Manual": { background: "#FFF8CC", color: "#7a5f00", border: "0.5px solid #E0C000" },
    "Subcontractor Specific Manual": { background: "#EBF0FB", color: "#1a3c8f", border: "0.5px solid #7a9cd4" },
    "OSHA 29 CFR 1926": { background: "#EAF3DE", color: "#2d5a14", border: "0.5px solid #639922" },
  };
  const s = styles[label] || { background: "#f0f0f0", color: "#555", border: "0.5px solid #ccc" };
  return React.createElement("span", {
    style: { ...s, fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 500, whiteSpace: "nowrap", display: "inline-block" }
  }, label);
}

function detectSources(text) {
  const t = text.toLowerCase();
  const srcs = new Set();
  if (t.includes("okland specific") || t.includes("responsibility matrix") || t.includes("project superintendent") || t.includes("f10") || t.includes("scorecard")) srcs.add("Okland Specific Manual");
  if (t.includes("subcontractor") || t.includes("hot work") || t.includes("soil disturbance") || t.includes("barricade") || t.includes("confined space") || t.includes("excavat") || t.includes("scaffold") || t.includes("fall protection") || t.includes("ppe") || t.includes("lone worker") || t.includes("permit") || t.includes("loto") || t.includes("rigging") || t.includes("crane")) srcs.add("Subcontractor Specific Manual");
  if (t.includes("osha") || t.includes("29 cfr") || t.includes("1926") || t.includes("subpart")) srcs.add("OSHA 29 CFR 1926");
  if (srcs.size === 0) srcs.add("Subcontractor Specific Manual");
  return [...srcs];
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const bubbleStyle = {
    padding: "10px 14px",
    fontSize: 13.5,
    lineHeight: 1.65,
    wordBreak: "break-word",
    background: isUser ? "#F5C400" : "#fff",
    color: "#1a1a1a",
    border: isUser ? "none" : "1px solid #e8e8e8",
    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
  };
  if (isUser) {
    return React.createElement("div", { style: bubbleStyle }, msg.text);
  }
  return React.createElement("div", { style: bubbleStyle, dangerouslySetInnerHTML: { __html: formatMarkdown(msg.text) } });
}

function App() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Hi! I'm the Okland Safety Assistant. Ask me anything about jobsite safety — I'll answer using Okland's manuals and OSHA standards.",
    sources: ["Okland Specific Manual", "Subcontractor Specific Manual", "OSHA 29 CFR 1926"],
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const history = useRef([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    if (!text.trim() || loading) return;
    setShowSuggestions(false);
    setInput("");
    setMessages(m => [...m, { role: "user", text }]);
    history.current = [...history.current, { role: "user", content: text }];
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: history.current,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I could not generate a response. Please try again or consult your Okland Safety Manager.";
      history.current = [...history.current, { role: "assistant", content: reply }];
      setMessages(m => [...m, { role: "assistant", text: reply, sources: detectSources(reply), permits: detectPermits(reply), oshaLinks: detectOSHA(reply), manualLinks: detectManuals(reply) }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", text: "Connection error. Please check your internet and try again.", sources: [] }]);
    }
    setLoading(false);
  }

  return React.createElement("div", {
    style: { display: "flex", flexDirection: "column", height: "90vh", maxHeight: 700, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }
  },
    React.createElement("div", { style: { background: "#1a1a1a", padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 } },
      React.createElement("div", { style: { width: 34, height: 34, background: "#F5C400", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, color: "#1a1a1a", flexShrink: 0 } }, "O"),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { color: "#fff", fontWeight: 500, fontSize: 15 } }, "Okland Safety Assistant"),
        React.createElement("div", { style: { display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" } },
          ["Okland Specific Manual", "Subcontractor Specific Manual", "OSHA 29 CFR 1926"].map(s =>
            React.createElement(SourceTag, { key: s, label: s })
          )
        )
      ),
      React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#22c55e" } })
    ),
    React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "#f9f9f9" } },
      messages.map((msg, i) =>
        React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "88%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" } },
          React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, marginTop: 2, background: msg.role === "user" ? "#F5C400" : "#1a1a1a", color: msg.role === "user" ? "#1a1a1a" : "#F5C400" } },
            msg.role === "user" ? "ME" : "O"
          ),
          React.createElement("div", null,
            React.createElement(MessageBubble, { msg }),
            msg.role === "assistant" && msg.permits && msg.permits.length > 0 &&
              React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 } },
                msg.permits.map((p, i) =>
                  React.createElement("a", {
                    key: i,
                    href: p.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { display: "inline-flex", alignItems: "center", gap: 5, background: "#F5C400", color: "#1a1a1a", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none" }
                  },
                    React.createElement("span", null, "📄"),
                    p.label
                  )
                )
              ),
            msg.role === "assistant" && msg.oshaLinks && msg.oshaLinks.length > 0 &&
              React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 } },
                msg.oshaLinks.map((o, i) =>
                  React.createElement("a", {
                    key: i,
                    href: o.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { display: "inline-flex", alignItems: "center", gap: 5, background: "#EAF3DE", color: "#2d5a14", border: "1px solid #639922", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none" }
                  },
                    React.createElement("span", null, "🔗"),
                    o.label
                  )
                )
              ),
            msg.role === "assistant" && msg.manualLinks && msg.manualLinks.length > 0 &&
              React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 } },
                msg.manualLinks.map((m, i) =>
                  React.createElement("a", {
                    key: i,
                    href: m.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { display: "inline-flex", alignItems: "center", gap: 5, background: m.color, color: m.text, border: "1px solid " + m.border, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none" }
                  },
                    React.createElement("span", null, "📖"),
                    m.label
                  )
                )
              ),
            msg.role === "assistant" && msg.sources && msg.sources.length > 0 &&
              React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 } },
                msg.sources.map(s => React.createElement(SourceTag, { key: s, label: s }))
              )
          )
        )
      ),
      loading && React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" } },
        React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, background: "#1a1a1a", color: "#F5C400" } }, "O"),
        React.createElement("div", { style: { padding: "10px 16px", background: "#fff", border: "1px solid #e8e8e8", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 5, alignItems: "center" } },
          [0, 0.2, 0.4].map((d, i) =>
            React.createElement("div", { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: "#999", animation: "pulse 1.2s infinite", animationDelay: d + "s" } })
          )
        )
      ),
      React.createElement("div", { ref: bottomRef })
    ),
    showSuggestions && React.createElement("div", { style: { padding: "8px 16px", display: "flex", gap: 6, flexWrap: "wrap", background: "#fff", borderTop: "1px solid #f0f0f0" } },
      SUGGESTIONS.map(s =>
        React.createElement("button", { key: s, onClick: () => send(s), style: { background: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: 16, padding: "5px 11px", fontSize: 11.5, color: "#555", cursor: "pointer", whiteSpace: "nowrap" } }, s)
      )
    ),
    React.createElement("div", { style: { padding: "10px 14px", borderTop: "1px solid #e8e8e8", display: "flex", gap: 8, alignItems: "center", background: "#fff" } },
      React.createElement("textarea", {
        value: input,
        onChange: e => setInput(e.target.value),
        onKeyDown: e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } },
        placeholder: "Ask a safety question...",
        rows: 1,
        style: { flex: 1, padding: "9px 13px", border: "1px solid #ddd", borderRadius: 18, fontSize: 13.5, background: "#f9f9f9", color: "#1a1a1a", fontFamily: "inherit", outline: "none", resize: "none", maxHeight: 72 }
      }),
      React.createElement("button", {
        onClick: () => send(input),
        disabled: loading || !input.trim(),
        style: { width: 36, height: 36, borderRadius: "50%", background: loading || !input.trim() ? "#ddd" : "#F5C400", border: "none", cursor: loading || !input.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }
      }, "↑")
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
