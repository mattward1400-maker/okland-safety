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

═══════════════════════════════
SOURCE 4: OKLAND PERMIT KNOWLEDGE — Detailed permit requirements
═══════════════════════════════

AIR MONITORING LOG (Over 4' Excavation & Trench Access Permit):
- Purpose: Documents atmospheric conditions inside excavations/trenches deeper than 4 feet
- Required when: A hazardous atmosphere could reasonably exist; used alongside the Soil Type A, B, or C Excavation Permit
- Fields: Monitor Make/Model, Serial Number, Passive Sensor or Pump, Date/Time Last Bump Tested, Date Last Calibrated, then per-reading: Date, Time, Oxygen % (must be 19.5%-22%), Combustible Gas (must be <10% LEL), Carbon Monoxide CO (0-25 ppm), Hydrogen Sulfide H2S (0-10 ppm), Sulfur Dioxide SO2 (0-2 ppm), Aromatic Hydrocarbon/Benzene (0-1.0 ppm), Other gas, Monitor Reader Initials
- Key requirements: Log results every 2 hours OR at each entry (whichever is more frequent). Work stops if any reading exceeds limits. Bump test and calibration must be current. Keep log at entry point alongside excavation permit.

CONFINED SPACE ENTRY PERMIT (includes Pre-Assessment Checklist and Atmospheric Test Data):
- Purpose: Required for entry into any permit-required confined space (PRCS)
- Required when: Space is large enough to bodily enter, has limited entry/egress, not designed for continuous occupancy, AND has actual or potential hazards
- Pre-Assessment Checklist fields: Section 1 (3 Yes/No questions confirming it's a confined space), Section 2 (7 questions: hazardous atmosphere, engulfment potential, entrapment potential, other hazards, entry method, ventilation need, lifeline detachment need), Section 3 (2 questions for alternate entry procedure eligibility), Final Determination checkbox (Non-Permit / Permit-Required / Alternate Entry Allowed), Type of Space, Date of Entry, Date of Assessment, Dimensions of Space
- Entry Permit fields: Permit Issued Date, Permit Issued For (Company Name), Entry Date, Entry Time, Time of Completion, Location/Area, Authorized Entrant(s), Authorized Attendant(s), Required Safety Controls checklist with Yes/No/Comment for: Attendant, Respiratory Protection, Protective Clothing, PPE, Fire Extinguisher, Non-Entry Rescue Equipment, Detailed Rescue Plan, LOTO, Ventilation, Follow-up Testing, Other Controls, Trained Workers, Local EMS/ERT Notified, Barricade, Space Labeled, Other. Communication method (Visual/Direct Verbal/Phone/Radio), Is space labeled (Yes/No), Other Comments, Permit Prepared by (Print Name, Signature, Date — two signers)
- Atmospheric Test Data fields: Pre-Entry Results and Follow-Up Testing columns 1-6 for O2, % LEL, CO, H2S, Toxic 1/2/3. Instrument Model, Serial #, Gas Calibration Date, Pre-Entry Test By (Name, Date, Time), Zero calibration conducted by
- Who signs: Two Permit Preparers (Print Name, Signature, Date). Attestation: 'I have visually verified that the permit requester has completed the Okland+ course'
- Key requirements: Permit must be completely filled out and remain at entry point until work is complete. Copy forwarded to Safety within one week. Copy maintained at Okland Trailer. Only authorized entrants listed on permit may enter. Attendant must remain outside at all times with dedicated phone. If Section 2 questions 2-4 are Yes, alternate entry procedures are NOT allowed.
- Emergency Contact: Designated Emergency Response Team (EMS, ERT, or 911)

CRITICAL LIFT CRITERIA & PERMIT:
- Purpose: Required when a crane lift meets one or more of the 14 critical lift criteria
- Required when ANY of these apply: Mobile crane over 90% rated capacity; Tower crane over 95% rated capacity; Steel erection with any crane over 75% rated capacity; Any rigging component over 90% rated capacity; Two or more cranes or hoisting equipment simultaneously; Crane combined with other lifting equipment; Pick and carry with track/crawler crane; Lift of 100,000 lbs or more; Hoisting personnel (man-basket); Fully extended outriggers cannot be used; 360° load chart cannot be used; Equipment/load could come within minimum clearance of overhead powerlines per OSHA 29 CFR 1926.1408 Table A; Load with unknown weight or center of gravity; Any lift Okland determines requires exceptional care (size, weight, close tolerance, high value, long lead time)
- Fields: 10 Yes/No/N/A questions — (1) Lift Planning Worksheet completed? (2) Written Critical Lift Plan completed and approved by Crane Superintendent? (3) Will pick use multiple cranes or crane + other equipment? (3a) If yes to Q3: will any crane exceed 75%? (4) If hoisting personnel: hoisting personnel checklist done? (5) Has Crane Superintendent reviewed Lift Planning Worksheet, Critical Lift Plan, rigger/signal qualifications, operator medical card and CCO card, annual inspection, and load chart? (6) Required Okland engineering completed? (7) Pre-operation meeting held at least 2 days prior? (8) In-field pre-lift meeting scheduled each day? (9) Will Written Critical Lift Plan be on site in immediate work area? (10) Rigging plan drawn out? Rigging plan drawing space. Comments field.
- Who signs: Trade Partner Representative (Signature, Date), Okland Superintendent (Signature, Date), Okland Crane Superintendent (Signature, Date), Okland Safety Manager (Signature, Date), Corporate Crane Safety Manager (Date). Attestation: 'I have visually verified that the requester has completed the related Okland+ Course'
- Key requirements: Lift Planning Worksheet must be completed first. Written Critical Lift Plan must be approved by Crane Superintendent. Pre-operation meeting minimum 2 days before lift. Daily pre-lift meetings each day of lifting. Rigging plan with sling angles and spreader bars must be drawn on the permit.

SELECTIVE DEMOLITION PERMIT:
- Purpose: Required before any selective demolition of occupied buildings or structures integrated into a campus system. Note: for site demo (tree stumps, light poles, concrete, asphalt, retaining walls) use the Soil Disturbance Permit process instead.
- Fields cover: Job #, Brief Description (building/structure/area/sq footage), Site Address, Statement of Desired End State (note Bond Release Requirements). PERMITS/JURISDICTIONAL section: City/County Demo Permit, Water and Sewer Capping Permit, NESHAP 10-Day Notification filed to State DEQ, Waste Generator EPA ID, Waste Transporter EPA ID, TSDF Current Permit, Hazardous Waste Yes/No (if yes: proper labeling, secure storage, ship within 90 days, Uniform Hazardous Waste Manifest), NPDES Storm Water Permit. ENVIRONMENTAL section: Environmental audit completed, past/current site use checklist (undeveloped/farmland/residential/industrial etc), soil disturbance dust control and SWPPP, SPCC Plan if chemicals could spill to navigable waters, Section 404 Permit if discharging to surface water, historical site questions (surface soil samples, soil borings, EPA permits, USTs, ASTs, water sheen, pits/ponds, chemical odors, fill material, old drums), HVAC adjacent area dust migration. HAZARDOUS MATERIALS section: Hazardous Materials Survey (by industrial hygienist, must include asbestos, lead via XRF, mercury thermostats, mercury lamps, PCB ballasts/transformers, CFCs, misc hazardous containers, USTs, waste batteries, hydraulic oils, grease/oil separators), All Asbestos/Lead/PCB removed (Yes/No), Remediation Complete (Yes/No, if No attach Remediation Plan), HMTA compliance (DOT labeling, manifesting, placarding). STRUCTURE & UTILITIES section: Engineer Survey obtained and reviewed, architectural/engineering drawings available, extent of demolition clearly defined, stored/potential energy identified, shoring installed, maximum capacity posted on elevated structures, decks scanned for post-tension cables. Utilities investigation complete, pipe/electrical as-builts available, gas/water/steam lines shut off/locked/tagged, chemical/gas/waste lines drained and flushed, red/green marking system established, critical utilities identified/labeled/protected. SAFETY MEASURES section: Public protection in place, JHA completed/reviewed by safety/posted, trade partner JHAs received, PPE requirements (impact/cuts/compression/chemical/heat/cold/dust/light radiation/electrical/biological/noise/respirator plan), PRCS determination, sequence of demolition reviewed. OWNER ACCOMMODATIONS section: walked with owner's rep, sensitive info removed, site access communicated, noise/vibration reviewed, HVAC charcoal filter plan, ICRA performed (Yes/No/NA), pressure readings documented, negative pressure maintained. DAILY LOG: negative pressure readings chart, building/area cleared initials and date/time, notes. EMERGENCY REPORTING PHONE NUMBERS. COMPLETION: follow-up engineer survey attached, completion date and verifier.
- Who signs: Okland Supervisor (Print, Signature), Okland Safety Manager (Print, Signature), Trade Partner Supervisor (Print, Signature), Person Doing the Demo (Print, Signature), Completion verification (Print, Signature, Date)
- Key requirements: Permit plus all supporting documents must be hung in a plastic sleeve accessible during demolition. NESHAP 10-day notification must be filed to State DEQ before demolition. Red/green utility marking system established before demo; only qualified personnel mark utilities. Mock shutdown with Owner Facilities required before actual shutdown. Only Owner Facilities personnel can turn off breakers or exercise valves. Daily log maintained. Follow-up engineer survey attached at completion. If fire hazards anticipated: use Hot Work Permit process.

ENERGIZED ELECTRICAL WORK PERMIT:
- Purpose: Required before any work on energized electrical equipment. Use alongside NFPA 70E — does NOT replace it.
- Required when: Any work on or near energized electrical equipment that cannot be de-energized
- Fields — Part I (Work Request, completed by person requesting): Site/Area, Work Order/Project #, Planned Start Date/Time/Duration, Description of work, Work Classification (Prohibited or Restricted), Restriction duration (until work complete OR temporarily while barriers placed), Equipment requested to shut down, Requester Signature/Title/Date
- Fields — Part II (completed by electrically qualified persons doing the work): Detailed job description procedure, Description of safe work practices, Results of shock hazard analysis, Determination of shock protection boundaries, Results of flash hazard analysis, Determination of flash protection boundary, Necessary PPE to safely perform task, Means to restrict unqualified persons, Evidence of job briefing completion, Agreement that work can be done safely (Yes/No), Electrically Qualified Person Signature(s) and Date(s)
- Fields — Part III (completed by operations/approval): Reason for live work request, Next available shutdown date, Denial of shutdown and authorization for live work (Customer Representative Signature and Date, up to 2), Authorized Electrical Contractor Supervisor Signature and Date, Live work Authorized or Not Authorized
- PPE Groups defined on permit: Group 1 (arc-rated shirt/pants, face shield, hearing protection, safety glasses, leather gloves, leather shoes), Group 2 (adds FR coverall option and sock balaclava), Group 3 (25-cal arc flash suit jacket/pants/hood, hard hat, safety glasses, hearing protection, arc-rated gloves, leather shoes), Group 4 (40-cal arc flash suit jacket/pants/hood, same other PPE as Group 3)
- Protective strategies (in priority order): (1) Turn off the power, (2) Use energized work permit, (3) Plan the work, (4) Use PPE
- Key requirements: Exhaust every effort to work de-energized first. Workers conducting live electrical work cannot work alone. Must comply with most current NFPA 70E. Submit to Okland before ANY live electrical work: this permit + JHA + detailed Method of Procedure. Establish arc-flash and shock approach boundaries before starting.

GUARDRAIL REMOVAL / MODIFICATION PERMIT:
- Purpose: Required for all trade partner removal or modification of guardrail systems that protect any other trade or the public
- Required when: Any trade partner removes or modifies any guardrail protecting another trade or the public
- Fields: Trade Partner (TP) company name, Permit Good Through (expiration), TP Supervisor Name, TP Supervisor Phone, Type of guardrail currently in place (cable/wood/slab-grabber/scaffold/etc), Reason for removal or modification, Length of guardrail affected, Specific Location (Level/Column Line/General Description of what guardrail is currently protecting), Type of temporary area guardrail selected (hard barricade options — NOT tape alone), Workers trained on PFAS (YES), Workers installing temp guardrail trained (YES), Workers re-installing/modifying original guardrail trained (YES), Engineered system manufacturer training (NA or YES), Scaffold Competent Person name if scaffold guardrail being modified, List of tools/equipment needed to restore guardrail (hammer drills, come-alongs, porkchops, cable cutters, wire rope clips, etc.)
- Who signs: Trade Partner Supervisor (Date, Print Name, Signature), Okland Project Superintendent (Date, Mobile #, Signature). Attestation: 'I have visually verified that the requester has completed the related Okland+ Course'
- Key requirements: Temporary area guardrail MUST be in place BEFORE removing/modifying existing guardrail. Danger signage '100% Tie-Off Required Beyond This Point' on temporary guardrail. PFAS must be used during removal and installation when fall exposure exists. Barricade tape and signage alone NEVER acceptable to protect a fall hazard — hard barricades required. TP Supervisor verifies guardrail re-installed per OSHA and Okland requirements before removing temporary guardrail. Permit must be posted in immediate work area. If scaffold guardrail is being modified, Scaffold Competent Person must be present during modification.

HOT WORK PERMIT:
- Purpose: Required for any activity producing open flames, sparks, or heat
- Required for: Open flames, brazing, chop saw cutting, grinding, mixing two-part foam, mixing two-part epoxy, soldering, thawing pipe, torch use, welding, hot wires to cut foam, or any other heat/spark-generating activity
- 7-Day permit eligibility (both conditions required): Cutting/grinding that only generates sparks AND dedicated isolated fixed workstation
- Fields: Expires (valid through end of shift on expiration date), Hot Work Being Done By (Company Name), Project, Location/Building and Floor, Brief Description of Hot Work, Name of Person Doing Hot Work, Phone Number, Name of Assigned Fire Watch, Activity type checkboxes. Required Precautions Checklist (ALL must be checked before work): All combustibles cleaned/removed/shielded within 35' radial sphere (clean surfaces, remove flammables, protect combustible materials), Protect adjacent areas from sparks/heat (cover openings, hang tarps, shut down fans/air intakes), Explosive atmosphere eliminated, Rooftop work checks (verify no flammable stored materials, heat travel to materials above, add fire watch or section off), Wall/ceiling/enclosed equipment checks (verify noncombustible materials, protected combustibles on other side, cleaned enclosed equipment, purged containers), Fire watch requirements (continuous during work and 30 minutes after including breaks, dedicated extinguisher, trained in extinguisher use, watch required on opposite sides of walls/above/below). Additional fields: Non-combustible finishes needing protection (Yes/No), Special ventilation required (Yes/No), Visual observation by Okland needed before permit (Yes/No, if yes was area observed). Fire Watch/Monitor Record (Checked By Initials / Work Completed Time / Fire Watch Completed Time). Dedicated Workstation Inspection for 7-day permit (Date / Competent Person / Shift Start / Shift End / Notes with 5-item checklist: abrasive cutting/grinding only, caution sign posted, area set up to safely contain sparks, dedicated fire extinguisher adjacent, fire extinguisher charged). Permit Close Out (return permit and sleeve before leaving job site, date and time).
- Who signs: Person Doing the Hot Work, Fire Watch, Supervisor from Company Doing the Hot Work, Okland Signature (coordination only — does not verify work area), Okland Printed Name. Attestation: 'I have visually verified that the permit requester has completed the Okland+ course'
- Key requirements: Assess 35' radial sphere for ALL fire hazards before requesting permit. Fire watch continuous during work AND minimum 30 minutes after, including all breaks. Fire watch on opposite sides of walls, above, and below floors and ceilings. Fire watch has dedicated extinguisher and no other duties. Standard permit valid one day only. 7-day permit requires daily pre-shift and post-shift inspection by hot work competent person. Take picture of permit front and back and import into Autodesk. Return permit and sleeve before leaving job site.

MOBILE EQUIPMENT IN PUBLIC RIGHT-OF-WAY PERMIT:
- Purpose: Required before conducting work or moving equipment outside project boundaries with potential to impact the public
- Required when: Any work or equipment travel outside project boundaries that could impact public, including sidewalks, streets, railroads, bus routes
- Fields: Company, Supervisor Name/Contact, Start Date, End Date (note: valid 7 calendar days maximum), Start Time, End Time, Location of Work, Description of Work. Question 1: Does work/travel impact public access/egress, traffic, or public transportation (sidewalks, streets, RR, buses)? Yes/No. Question 2: Will work potentially cause additional impact/disruption or nuisance? Checkboxes: Utilities, Life Safety, Noise, Dust, Light, Other, NA. Question 3: What external permits are required? Checkboxes: City, State, Owner, Municipality, DOT, RR, SWPP, Other, NA. Question 4: What Okland permits are required? Checkboxes: Soil Disturbance, Hot Work, Confined Space, Other, NA. Question 5: Is equipment road ready? Checkboxes: Pilot Car Front, Pilot Car Front and Back, Equipment Triangle, Slow Moving Vehicle Signage, Other, NA. Question 6: What additional controls are needed? Checkboxes: Traffic/Pedestrian Control Devices and Signage, Flaggers, Spotters, Other. Question 7: Have all permits and required documentation been submitted to the Okland Superintendent? Yes/No.
- Who signs: Signature Trade Partner Supervisor, Signature Contract Supervisor, Signature Okland Supervisor, Date
- Key requirements: Must be submitted to Okland PRIOR to work or travel. Valid 7 calendar days maximum. All external permits must be obtained before work begins.

PUBLIC ROW PERMIT (Work In The Public Right-Of-Way Permit):
- Purpose: Required before conducting any work in areas open to the public
- Fields: Company, Supervisor Name/Contact, Start Date, End Date, Start Time, End Time, Location of Work, Description of Work. Question 1: Does work require closing public access/egress (sidewalks, streets, doorways)? Yes/No — if yes: type of barrier used, where signage posted. Question 2: Are there additional permits required? Yes/No — if yes: what permits needed, requiring entity, copies submitted to Okland Superintendent. Question 3: Will work disrupt any MEP systems (utilities, life-safety, airflow)? Yes/No — if yes: systems impacted, precautions to prevent accidental disruption, shut-off locations, who to notify. Question 4: Will work create objectionable odors, dust, sparks, light, or nuisance? Yes/No — if yes: type of nuisance, steps to protect public. Question 5: Additional controls not listed on permit.
- Who signs: Signature Contract Supervisor, Signature Okland Supervisor, Date
- Key requirements: Must be submitted to Okland prior to work in areas open to the public. All additional permits must be secured before work begins. Copies of all additional permits submitted to Okland Superintendent.

ROOFING PERMIT:
- Purpose: Required for all temporary operations involving loading/unloading of material, installation of roofing, or installation of any material associated with the roof. Permits filled out DAILY. Any company found on roof without permit may be sent off job and back charged.
- Fields: Job No., Name of Company/Person(s) Doing Work, Date, Location/Floor #, Description of Work Being Performed, Time Started (Date/Time/AM/PM), Permit Expires (Date/Time/AM/PM). Roof Permit Checklist: Roof inspected with OCC employee prior to any work for prior damage and surrounding materials; Work being performed on minimum 3/4" plywood to protect roofing surface; Cleanup method expressed to Roofing QC Supervisor; Scope/duration/materials/tools approved by Roofing QC Supervisor; Safety methods expressed to Roofing QC Supervisor; Trade Supervisor confirmed no food or drink on roof during work. Materials Storage Checklist: Stored material neat/organized and supported by 3/4" plywood; Material deemed safe to work around; Material stored overnight properly secured/tarped and approved by OCC representative. Other Precautions Taken (free-form).
- Who signs: Roofing QC Supervisor, Person Doing Work on Roof, Roof Watch
- Key requirements: Daily permit — new permit required every day. Roof must be inspected with OCC employee before any work begins. All work on minimum 3/4" plywood to protect roofing surface. No food or drink on roof while work being completed. Overnight material must be secured, tarped, and OCC-approved. Photocopy permit; carry copy at roofing location; post original in designated filing area.

SCAFFOLD ERECTION PERMIT:
- Purpose: Required for any scaffold with a platform height over 24 feet
- Fields: Scaffold Size (Length x Height x Base Width), H to BW ratio, Is bracing required (Yes/No — required if ratio exceeds 4:1, every 30' horizontally and 15' vertically), Describe bracing system and locations. Height checkboxes requiring registered engineer with stamped drawings: Pole scaffold greater than 60', Tube & coupler scaffold greater than 125', Fabricated frame scaffold greater than 125', Cantilevered scaffold, Outrigger scaffold. Registered Engineer name. Electrical clearance confirmation (no part of scaffold within minimum safe distances from energized hazards — table: less than 50K Volts = 10', 50-100K = 12', 101-150K = 14', 151-200K = 16', 201-250K = 18', 251-300K = 20', 301-350K = 22'). Will any portion be wrapped or enclosed? (Yes/No — if yes, wrap-specific qualified person design required). Scaffolds designed for 4x intended load — Maximum Intended Load field. Will any welding be performed on scaffold? (Yes/No). Will scaffold be taller than active lightning protection system? (Yes/No). If yes to either welding or lightning: grounding required. Sketch/describe scaffold location (grid provided). Location coordinated for future work (Yes/No). Ground conditions suitable for all imposed loads (Yes/No). Do mudsills meet Okland mudsill requirements (Yes/No — see table on permit). Platform Access System selection: Internal Stair Access, Ladder Access Bays, External Stair Tower, Internal Ladder with Hatch, Building access only. External ladder infeasibility description if applicable.
- Who signs: Name and Signature of Qualified Person plus Date, Permit reviewed with (Okland authorized scaffold reviewer), Okland Supervisor, Okland Safety Manager, Trade Partner Supervisor, Trade Partner Company, Date of Approval. Attestation: Okland Supervisor has verified Okland+ course completion.
- Key requirements: Erection may only begin once permit is signed. Permit must be displayed on or near scaffolding. Any change in scaffold dimensions or access requires a new permit. This permit only authorizes erection — separate process for use. Pre-shift inspections and tagging by Competent Person required. All scaffolds designed and installed under supervision of a qualified person. Vertical ladder climbs using externally attached ladders NOT permitted unless all internal access systems deemed infeasible. Mudsill requirements vary by ground type: minimum 2"x10"x24" timber for asphalt/grass/firm ground; review with Okland scaffold reviewer for soft/loose/wet ground; 18"x18" minimum 1/2" plywood for concrete/stone/steel; protective material for delicate surfaces.

SCAFFOLD STAIR TOWER PERMIT:
- Purpose: Required before erecting any scaffold stair tower. All scaffold stair towers must be fire department compliant.
- Fields: Stair Tower Dimensions (Length x Height x Base Width), H to BW ratio, Is bracing required (Yes/No), Describe bracing system and locations. Height: over 125' requires registered engineer with stamped drawings. Registered Engineer name. Access limited to construction personnel only (Yes/No — if No: how will stair tower be protected from unauthorized entry). General Lighting Required (Yes/No). Electrical clearance (same distance table as scaffold erection permit). Additional controls if not within safe distances. Barricade from vehicular/equipment traffic (Yes/No). Location coordinated for future work (Yes/No). Taller than lightning protection (Yes/No — if yes, grounding required). Wrapped or enclosed (Yes/No — if yes, tieback system must be designed by registered PE for wind loading). Storm water/drainage impacts (Yes/No — if yes: precautions). Snow/ice removal needs identified (Yes/No). Mudsills meet Okland requirements (Yes/No). Fire Department Compliance — all must be confirmed Yes: minimum 33" clear stairway width between handrails; landings in each direction of travel; landings minimum 36" deep; visible inspection tag documenting daily inspection by Competent Person per OSHA 29 CFR 1926.32(f) at level FD most likely uses for initial access; all stair towers green tagged; minimum footprint 7' x 14'-6".
- Who signs: Name and Signature of Qualified Person plus Date and Company, Competent Person(s) assigned to daily inspection, Permit reviewed with (Okland authorized scaffold reviewer) plus Signature and Date, Okland Supervisor, Okland Safety Manager, Trade Partner Supervisor, Trade Partner Company, Date of Approval. Attestation: 'I have visually verified that the requester has completed the related Okland+ Course'
- Key requirements: Stair tower must be fully integrated to the building. Minimum footprint 7' x 14'-6". Minimum 33" clear width within stairway between handrails. Landings minimum 36" deep in each direction. Daily inspection tag by Competent Person at FD access level. All stair towers green tagged. Standpipes NOT attached to temporary stairways at any time. Erection may only begin once permit is signed. Any change requires new permit. Pre-shift inspections required. Tieback PE engineering requirement is independent from the engineer requirement for scaffolds over 125'.

SCAFFOLD TRASH CHUTE PERMIT:
- Purpose: Required for any scaffold trash chute installation
- Fields: Registered Engineer name (required), Height over 125' requires registered engineer with stamped drawings, Bracing required every 15' vertically. Will scaffold be taller than lightning protection (Yes/No — if yes grounding required). Location coordinated for future work (Yes/No). Types of barricading selected (pictured options to prevent struck-by from drops and vehicular/equipment traffic). How will debris be freed in event of backup (e.g., LOTO procedures, access). How will chute repairs be made if damage occurs. Fall Exposures — how will tie-off or guardrail systems be facilitated near trash chute's point of access from building deck.
- Who signs: Name and Signature of Qualified Person plus Date and Company, Competent Person(s) assigned to daily inspection, Permit reviewed with (Okland authorized scaffold reviewer) plus Signature and Date, Okland Supervisor, Okland Safety Manager, Trade Partner Supervisor, Trade Partner Company, Date of Approval. Attestation: 'I have visually verified that the requester has completed the related Okland+ Course'
- Key requirements: Scaffold must be designed by a qualified person and constructed according to that design. Design drawings must be specific to the project and application. Documentation of design submitted to Okland Superintendent PRIOR to scaffold/platform construction. Scaffold tieback system must be designed by a registered PE to account for additional wind loading (this is independent of the engineer requirement for scaffolds over 125'). Bracing required every 15' vertically. Area around dumpster secured with hard barricades far enough to protect from ricocheting debris. Signage must prohibit personnel access to trash chute and dumpster. Erection only begins once permit is signed. Pre-shift inspections required. If repairs needed or debris must be manually dislodged: a SEPARATE JHA must be completed and approved by Okland Safety AND Operations before any such work.

DRILLING PILES/CAISSONS EXCAVATION PERMIT (Type D):
- Purpose: Required before drilling piles or caissons. Covers fall protection, controlled access zones, tip-over protection, hole covers, and adjacent structure/utility impacts.
- Fields: Company, Permit Good Through (up to 7 days), Days of Week Active (M T W T F S S checkboxes), Engineering Plan Complete and Attached (YES), Soil Disturbance Plan Complete and Attached (YES), Are piles wider than 12" and deeper than 6'? (Yes/No — if yes: Fall Rescue Plan required; all employees between hole and barricade/guardrail must use PFAS; no part of system may cross hole or auger), Depth total and Pile Width, Fall Rescue Plan Complete and Attached (YES or NA), Trained Fall Rescue Personnel on Site (names), Equipment for Fall Rescue (anchor point, confined space retrieval system, etc.). Controlled Access Zone (CAZ) Option selection: Option A (multiple holes in close proximity — barricade + guardrail, control measures C1-C4 and C5-C8), Option B (barricade + guardrail/individual sleeve, no PFAS needed — requires rig bit to lift higher than barricade and guardrail, control measures C1-C4 and C5-C9), Option C (holes far apart — barricade + spotter; when barricade is open and spoil piles not present a spotter is required, control measures C1-C4 and C10), Option D (requires barricade/guardrail + spotter + Safety Review — full-time dedicated spotter, 'Authorized Personnel Only' signage 150' from rig, requires Okland Safety Manager signature, control measures C2-C4 and C5-C8 and C10). Control Measures selection B1-B10 (various barricade and guardrail types, During Work and Unattended selections for each). Spotter Required at 5' (Yes/No), Vacuum Truck or Hand Dig Required at 2' (Yes/No), Soil Disturbance Permit Executed (Yes/No), Existing Utilities Marked Within 20' (Paint/Feathers/NA). Adjacent Structures/Utilities in Zone of Influence (Yes/No — if yes: engineering plan must address, stakeholder meeting held). Overhead Power Line Risk (Yes/No — if yes: danger signs at required safe distance visible to operator every 100' max). Hole Covers for overnight: holes up to 24" plywood covers with minimum 6" overlap or drill bit left in hole; holes larger than 24" or irregularly shaped require guardrail; vehicle/equipment traffic over holes requires traffic plating. Ground Stability — Competent Person confirmations (area inspected, slope limitations known, will monitor). Tip Over Protection — Qualified Rig Operator confirmations (understands manufacturer procedures, will ensure proper setup).
- Who signs: Date/Time Issued, Qualified Rig Operator, Spotter, Okland Supervisor, Competent Person (on site during operations), Competent Person Phone, Okland Safety Manager Signature (required for Option D CAZ only). Attestation: 'Okland supervisor has visually verified that the permit requester has completed the Okland+ course'
- Key requirements: Competent Person responsible to fill out permit and review with workforce prior to start of work each day. Permit may be issued up to 7 days; any changes in operator, spotter, excavation protection, or conditions requires new permit. Option D CAZ requires Okland Safety Manager signature. Holes left unfilled overnight MUST have covers with minimum 6" overlap on all sides. Vehicle/equipment traffic over holes requires traffic plating. Engineering plan must be attached and address adjacent structures/utilities if applicable.

SOIL TYPE A — OVER 4' EXCAVATION & TRENCH ACCESS PERMIT:
- Purpose: Required for all excavations and trenches over 4 feet deep in Type A soil. Competent Person fills out and reviews with workforce before work each day.
- (Note: Separate identical-structure permits exist for Soil Type B and Soil Type C — the soil type determines which cave-in protection methods are allowed)
- Fields: Company, Permit Good Through (up to 7 days), Days of Week Active (M T W T F S S), Soils Disturbance Permit Executed (Yes/No), Existing Utilities Marked Within 20' (Paint/Feathers/NA), Spotter Required at 5' (Yes/No), Vacuum Truck or Hand Dig Required at 2' (Yes/No), Soil Type Verified By and Date. Cave-In Protection Method selection: Slope (YES), Bench (YES), Shield (YES, 20' max), Shore with PE stamp required. Excavation Dimensions: Vertical shield or shoring, Horizontal Distance H1 and H2, Edge to Edge, Vertical total, Trench width at base (T), Barricade to Edge B to E1 and B to E2. Note: any excavation over 20' deep requires a professionally engineered system. Write in values for each side if measurements differ. Excavation protection/warning system selection B1-B10 (various barricade types) with During Work and Unattended selections. Risk of affecting adjacent power poles/foundations/structures (Yes/NA). Excavation within 10' of utilities/thrust blocks (Yes/NA — if yes: stabilization plan). Overhead Risk (Yes/NA — if yes: danger signs on posts, caution tape area with signs). Air Monitoring Required (Yes/No — required when hazardous atmosphere could reasonably exist). Continuous Air Monitoring Required (Yes/No — required when controls reduce contaminants to acceptable levels). Daily Inspection Checklist (initialed each day M through S): Page 1 conditions reviewed and unchanged, no condition changes since prior day, no visible cracks or changes in face of or next to excavation, in and out access with ladders/stairs/ramps and required fall restraint at 6'+, spoils and materials more than 2' from edge, public protection measures in place, workers and excavation protected from water accumulation, measures in place to keep equipment safe distance, never work under loads.
- Who signs: Competent Person fills out and reviews daily, Okland Supervisor, Trade Partner Competent Person, Equipment Operator, Spotter, Date/Time Issued, Competent Person Phone. Attestation: Okland supervisor verified Okland+ course completion.
- Key requirements: Competent Person responsible to fill out permit and review with workforce prior to start of work each day. Permit may be issued up to 7 days; any changes in operator, spotter, excavation protection, or conditions requires new permit. Any excavation over 20' deep requires professionally engineered system. Spoils and all materials kept 2+ feet from edge at all times. Ladders, stairs, or ramps required. Fall restraint required at 6'+ depth. If air monitoring required, results must be documented on an Air Monitoring Log. Daily inspection must be completed and initialed each day. Type A soil classification must be verified by a competent person. Separate permits exist for Type B and Type C soil — use the correct permit for the verified soil type.

TEMPORARY HEATER PERMIT:
- Purpose: Required before using any temporary heater (electric radiant, diesel, natural gas, propane, kerosene, etc.) on the project. Exception: no permit required for indirect heaters where ALL heating elements are enclosed.
- Required when: Any use of a temporary heater on site. EACH company using heaters must complete their own permit.
- Fields: Contractor Name, Purpose for Heater, Beginning Date, Expiration Date (valid no more than 30 days), Will heaters operate while no one is onsite (Yes/No — if yes: each heater inspected and tags signed before leaving unattended AM and PM; fire watch if required by owner/municipality), Location and Heater Type/Model table (list each heater by location: level/grid lines/room, and type/model — multiple rows available). Temporary Heater Inspection Log: Date, AM initials, PM initials. 12-item inspection checklist per shift: fuel source is leak-free, safety devices in place and not bypassed, placed on non-combustible surface, stable placement to prevent movement, ventilation is adequate or mechanical ventilation in place, manufacturer clearance requirements met for all combustibles including dust/lint piles and oil deposits (all flammable liquids/solids/gas containers and oxygen cylinders removed from area), weather protection material secured and not in contact with heater due to wind, connected to electrical circuit rated for size of unit, Okland warning sticker in place and in good condition, explosive atmosphere eliminated or potential not present, 10 lb rated fire extinguisher within 75 ft, fire extinguisher is charged.
- Who signs: Operation and Inspection Competent Person (Print Name, Sign, Contact No.), Contractor Supervisor (Print Name, Sign, Contact No.), Okland Superintendent/Management (Print Name, Sign, Contact No.). Attestation: 'I have visually verified that the permit requester has completed the Okland+ course'
- Key requirements: JHA and Heater Permit must be completed prior to installation. Each company using heaters must complete their own permit. If heater is added or moved more than 20' from location noted on current permit, new permit required. Permits valid no more than 30 days. Okland authorized signers must walk areas in question prior to signing. Each heater must be inspected at start of each shift (AM and PM) and documented on the green Temporary Heater Tag posted on each unit. If green tag is not up to date or missing, heater is OUT OF SERVICE and must be turned off immediately. Heater permits must be logged on permit tracking board and posted in green sleeve adjacent to tracking board in job office. Only trained, competent, authorized employees may install, adjust, move, or maintain heaters. LOTO required for any maintenance or repairs. Shut-off valves required at: main/meter/tank, each floor, each T in the gas line, end of each hose assembly just prior to heater connection. Floor shut-off valves marked for quick identification. Safety features NEVER overridden. No alterations to factory controls to bypass temperature settings. Barriers must protect main supply sources from vehicular traffic.


═══════════════════════════════
SOURCE 5: OKLAND SAFETY EXPERTS & FATAL 10
═══════════════════════════════

OKLAND SAFETY EXPERT CONTACTS:
- Cranes & Rigging Expert: Cory Hollis (Operator)
- Mobile Equipment Expert: David Peebler (Senior Safety Manager)
- Vehicle Expert: Carlyn Chester (Senior Safety Manager)
- Fall Exposure Expert: Austin Hunsaker (Senior Safety Manager)
- Scaffold Expert: Joshua Nix (Senior Safety Manager)
- Stored Energy Expert: Jason Hamilton (Senior Safety Manager)
- Fire and Explosion Expert: Rich Tarzia (Senior Safety Manager - Advanced Manufacturing)
- Confined Spaces Expert: Joseph Knickerbocker (Senior Safety Manager)
- Underground Utility & Excavation Expert: Cameron Holman (Safety Manager)

FATAL 10 — OKLAND'S 10 MOST CRITICAL SAFETY RISKS:

1. CRANES & RIGGING:
- 220 crane-related deaths in the US from 2011-2015 (average 44 per year)
- Over half involved workers struck by an object or equipment
- 60 cases involved a worker struck by an object falling from a crane
- Transportation incidents and falls each made up 14% of crane fatalities
- Expert: Cory Hollis

2. MOBILE EQUIPMENT:
- Rollovers, struck-by, and caught-in/between are common injury types
- Forklifts are the most common piece of mobile equipment used by Okland employees
- Forklift accidents cause about 85 fatalities annually and 30,000+ serious injuries per year
- Expert: David Peebler

3. VEHICLES & DRIVING:
- Motor vehicle crashes are the leading cause of work-related deaths in the US (CDC)
- Workers must be on the Approved Drivers List to drive for company business
- Expert: Carlyn Chester

4. FALL EXPOSURE:
- More than 40% of fatal falls occur from 15 feet or less
- Most common height to fall from is 6-10 feet
- In 2017, falls were the leading cause of worker deaths in construction
- Fatal falls to lower level: 693; same level: 132; through surface/opening: 83; collapsing structure: 47
- Expert: Austin Hunsaker

5. SCAFFOLDING:
- Common source of serious injuries and fatalities on large-scale construction projects
- OSHA reports dozens killed every year in scaffolding accidents
- Expert: Joshua Nix

6. STORED ENERGY (LOTO):
- Energy forms include: chemical, mechanical, gravitational, radiant, thermal, motion, sound, electrical, hydraulic, pneumatic, elastic, electromagnetic
- Inadequate training or failure to recognize hazards can result in severe injury or death
- Expert: Jason Hamilton

7. FIRE & EXPLOSION:
- Can result in catastrophic consequences including deaths and serious property damage
- All employees and subcontractors must prevent ignition of flammable substances
- Expert: Rich Tarzia

8. CONFINED SPACES:
- 481 confined space fatalities over a 5-year study period in the US (almost 2 per week)
- Over 60% of those killed worked in the construction industry
- Two-thirds of confined space deaths globally are individuals attempting to rescue someone
- Expert: Joseph Knickerbocker

9. EXCAVATION & TRENCHING:
- Fatality rate for excavation work is 112% higher than general construction
- Over 100 deaths and thousands of disabling injuries occur every year
- A cave-in can trap a worker within seconds and kill within minutes
- Two cubic yards of soil weigh about 6,000 pounds
- If buried, a worker can suffocate in less than three minutes
- Expert: Cameron Holman

10. STRUCK-BY & CAUGHT-IN/BETWEEN:
- Struck-by: forcible contact between injured person and object/equipment (falling, flying, swinging objects)
- Caught-in/between: person squeezed, caught, crushed, pinched between objects or equipment
- In 2015, 162 construction workers died from struck-by injuries
- Nearly 1 in 5 (18%) construction worker deaths result from struck-by incidents
- Between 2003-2015, caught-in/between injuries resulted in 1,059 construction worker deaths (8% of industry fatalities)

═══════════════════════════════
SOURCE 6: RIGGING & ELECTRICAL COLOR CODE
═══════════════════════════════

MONTHLY INSPECTION COLOR CODE (Crane Rigging & Electrical):
- January: BLUE
- February: YELLOW
- March: ORANGE
- April: PURPLE
- May: BROWN
- June: BLACK
- July: BLUE
- August: YELLOW
- September: ORANGE
- October: PURPLE
- November: BROWN
- December: BLACK

SPECIAL RIGGING COLORS (always apply regardless of month):
- Forklift Rigging: WHITE + current monthly color
- Fall Protection Rigging: GREEN + current monthly color

IMPORTANT RULES:
- DO NOT mix forklift and crane rigging
- Rigging used with a forklift CANNOT be used with a crane
- Contact Okland's Crane Superintendent (Cory Hollis) with any questions

CURRENT MONTH: June — Current color is BLACK


═══════════════════════════════
SOURCE 7: OKLAND SAFETY FUNDAMENTALS (11-13)
═══════════════════════════════

FUNDAMENTAL 11 — PLANNING & PREPARATION:
- 11.1: Emergency Response Plan readily available via hardcopy or immediately available electronically
- 11.2: Emergency contact numbers posted in office/trailer
- 11.3: Next 30 days of work reviewed — potential hazards and control measures discussed
- 11.4: Self-perform work potential hazards and control measures discussed
- 11.5: JHA/JSAs submitted — select one and confirm it matches work in field
- 11.6: Pre-Task Plans filled out and signed before work begins — pick one job and confirm PTP
- 11.7: PTP understood by workers — speak with one worker at random and confirm they KNOW hazards and controls listed on PTP for their task
- 11.8: Workers onsite have gone through safety orientation — select one worker at random to verify

FUNDAMENTAL 12 — PERSONAL & PUBLIC PROTECTION:
- 12.1: Job boundaries secured by fence or other acceptable means
- 12.2: Flaggers on public access roads are trained and certified
- 12.3: Required flaggers are stationed appropriately
- 12.4: Public (pedestrian and vehicle) is protected from falling debris (netting, covered walkways, etc.)
- 12.5: People on site (workers and visitors) have standard PPE — hard hat/helmet, eye protection, work boots with puncture resistant soles, Hi-Viz shirt/vest/jacket, retroreflective around equipment and/or at night
- 12.6: Task specific PPE is being used

FUNDAMENTAL 13 — CLEAN/SAFE WORK CONDITIONS:
- 13.1: Proper respiratory protection is being used
- 13.2: Porta johns are located a safe distance away from any ongoing work location (e.g. where they can be struck by equipment)
- 13.3: Site is clean and material organized — no protruding nails, no spills/leaks
- 13.4: Wood is stored in proper location and stacked neatly with all nails removed
- 13.5: Staging areas are orderly — no trip hazards, materials on pallets, etc.
- 13.6: Proper respiratory protection is being used
- 13.7: Chemicals are in adequate storage containers
- 13.8: Workers have access to necessary SDS information — select one worker at random and ask
- 13.9: Observed chemicals are being stored properly when not in use

═══════════════════════════════
SOURCE 8: OKLAND FREQUENT 4 (14-17)
═══════════════════════════════

FREQUENT 4 #14 — FORMING & STRIPPING:
- 14.1: Protruding nails and screws removed from any observed stripped material
- 14.2: Wall chain hooks fully locked when used
- 14.3: When post-tensioning operations are taking place, area is adequately barricaded
- 14.4: Hoses and slick lines safely routed and secured
- 14.5: When a fall exposure exists on the opposite side of a wall form, fall protection is in place on the backside of the wall
- 14.6: When silica exposure is present, required controls are in place
- 14.7: Controlled access zone established prior to tilt-up operation and workers adhering to the zone

FREQUENT 4 #15 — SLIPS, TRIPS & FALLS:
- 15.1: All main egress routes are adequately lighted
- 15.2: Adequate general lighting is provided by Okland
- 15.3: All main egress routes are clear of material or debris
- 15.4: Safe and adequate access in and out of footing excavations is maintained
- 15.5: Main walkways clear of ice and snow
- 15.6: Main walkways do not have steep grades
- 15.7: Walkways with a change in elevation of 19 inches or more has stairway, ladder, or ramp

FREQUENT 4 #16 — MATERIAL HANDLING/CARRYING:
- 16.1: Individual workers not lifting more than 50 lbs
- 16.2: Proper lifting techniques are being used

FREQUENT 4 #17 — EXTREME WEATHER:
- 17.1: Appropriate drinking water provided for Okland employees
- 17.2: Appropriate drinking water provided by trade partners for their workers


═══════════════════════════════
SOURCE 9: OKLAND ORIENTATION & OKLAND+ INFORMATION
═══════════════════════════════

ANNUAL GENERAL OKLAND SAFETY ORIENTATION:
- All workers must complete the Annual Safety Orientation BEFORE coming on site
- Okland Employee Orientation Course available at: okland.myabsorb.com
- Trade Partner Orientation Course available at: oklandtradepartners.myabsorb.com
- Orientation duration: approximately 2 hours 10 minutes (English), 2 hours 30 minutes (Spanish)
- Spanish orientation available at: care.okland-const.com/orientation-esp
- Orientation Review Handout available at: oklandconstruction.box.com/s/vtliwphn4shjvjyclee7f0g9mz0hcip6

OKLAND+ ORIENTATIONS:
- Okland+ courses available at: care.okland-const.com/okland
- Spanish Okland+ courses available at: care.okland-const.com/okland-esp
- Trade Partners can receive credit for permit certification courses (Soil Disturbance, Hot Work, etc.) by logging in at: oklandtradepartners.myabsorb.com
- Okland employees receive credit on the Okland LMS at: lms.okland.com
- Prior to filling out ANY Okland Permit, workers must take the associated permit training on Okland+

LONE WORKER ACTIVITIES (from Orientation page):
Workers conducting the following activities shall only do so when they can be visually seen and heard by at least one other worker. The identified person must be conducting a joint activity with the lone worker:
1. Activities where a Personal Fall Arrest System is required
2. Activities where work is being performed on elevated decks/floors or a temporary means of access/egress is required
3. Activities in a trench 4 feet or greater in depth
4. Activities entering a permit or non-permit required confined space
5. Activities conducting live electrical work of any voltage
6. Activities using a respirator for any reason
7. Activities conducting demolition work
8. Activities working on or around the project outside normal hours
9. Activities operating earth or material handling equipment (forklifts, skid-steers, backhoes, scrapers, graders) in remote areas, remote yards, or where operation poses a risk of striking workers or public
10. Activities involving maintenance or repair of mobile or fixed equipment (MEWPs, man/material hoists, forklifts, skid-steers, backhoes) where there is potential for release of stored energy

COMPANIES WITH APPROVED DRUG SCREENING POLICY:
- Current list available at: partner.okland.com/docs/approved-companies

═══════════════════════════════
SOURCE 10: OKLAND PERMIT DOWNLOAD LINKS (care.okland-const.com)
═══════════════════════════════

All permits require associated Okland+ permit training BEFORE filling out the permit.

- Confined Space Access Permit: oklandconstruction.box.com/s/1g7d244hjp6zdvz4y90ga87n4xxk3m9a
- Energized Electrical Work Permit: oklandconstruction.box.com/s/rkw010zq18uf16xuqywiv3qs0714xktx
- Guardrail Removal and Modification Permit: oklandconstruction.box.com/s/zzfqbvuphaq5xgm40rlu3pqioc2zdb4g
- Hot Work Permit: oklandconstruction.box.com/s/tbtz8pv00jup2taxjlkybrlpyp8c499n
- Soil Type A Over 4' Excavation & Trench Access Permit: oklandconstruction.box.com/s/sjkhzhoul5uvobe5xtvu2q1s1r6l09yh
- Soil Type B Over 4' Excavation & Trench Access Permit: oklandconstruction.box.com/s/d54btjdcwc5z1jgcz57cf31bt0bkfsdh
- Soil Type C (Default) Over 4' Excavation & Trench Access Permit: oklandconstruction.box.com/s/a20c4kxu4mcha70fy5s9tzws94ixlokt
- Scaffold Erection Over 24' Permit: oklandconstruction.box.com/s/x15bz98fvbfbr1qyzzdcps1zzqga7t2w
- Scaffold Stair Tower Permit: oklandconstruction.box.com/s/yx2g9p9y7jrpejaij30tw9dp5uuwaxc3
- Scaffold Trash Chute Permit: oklandconstruction.box.com/s/moyp1gui0rk0qjpms59pu57dnba1xt4b
- Pile Drilling & Caissons Permit: oklandconstruction.box.com/s/jg7bgi03kjp61rz7fgxvy0t4izu4mcdh
- Soil Disturbance Permit Set-Up Checklist: oklandconstruction.box.com/s/ofm93z7mgjfrjh50uny6chley3uq9r15
- Soil Disturbance Permit Cover Sheet: oklandconstruction.box.com/s/ilj1nhczwlfxzbxvj5iai3e4ue52dmh1
- Soil Disturbance Permit SOP: oklandconstruction.box.com/s/d79nizvual3ulo7x3muwno3mcvrcna2b
- Temporary Heater Permit: oklandconstruction.box.com/s/xmfro623cdxridjw20uv307043dxzimg


═══════════════════════════════
SOURCE 11: OKLAND CARE SITE — DOCUMENTS & RESOURCES
═══════════════════════════════

CARE SITE HOME (care.okland-const.com/safety):
- A resource for those working on an Okland jobsite
- Spanish resources available in the navigation menu (Recursos en español disponibles en el menú de navegación)
- Quick links: Documents, Fatal 10, Fundamentals, Frequent 4, Okland+, Orientation, Permits, Safety Manuals

SAFETY MANUALS (care.okland-const.com/safety-manuals):
- Okland Specific Health & Safety Manual (OSHM): docs.okland.com/msa/safety/OSHM.pdf
- Subcontractor Specific Health & Safety Manual (SSHM): docs.okland.com/msa/safety/SSHM.pdf

DOCUMENTS PAGE (care.okland-const.com/documents):

Barricade Signage Downloads:
- CAUTION sign: oklandconstruction.box.com/s/r5mmhib1vw5ivm6czlotff2nzxeu6i4m
- CAUTION sign Spanish: oklandconstruction.box.com/s/0alfh37xbwpqkscsxu7z11yy2ymqufvi
- DANGER sign: oklandconstruction.box.com/s/vmqryiyt0am7n7n7wo0l7vn7u05jkls6
- DANGER sign Spanish: oklandconstruction.box.com/s/jc1pt5timmoc2x1d9zcy5k77jbw6f53e
- NOTICE sign: oklandconstruction.box.com/s/0qqv6h1m4kvwqkc6xudllbr9yg7i85t1
- NOTICE sign Spanish: oklandconstruction.box.com/s/imli4k70u4mokg41wegzb8uv6hionrcd
- WARNING sign: oklandconstruction.box.com/s/51spf8qi6wnbhlhyia9dl8l25miaqxjd
- WARNING sign Spanish: oklandconstruction.box.com/s/5khgwhb0s5oskttebysq40zfvx3xsy0w
- Yellow Tape Sign CAUTION: oklandconstruction.box.com/s/ia93cvvpk28d6q8udxhtui71v0uf6mkg
- Yellow Tape Sign CAUTION Spanish: oklandconstruction.box.com/s/ud2493r35dx14k19y32hiusp65954w5d
- Red Tape Sign DANGER: oklandconstruction.box.com/s/1io4bb6kydb2r0supfk8l8jniqvphybz
- Red Tape Sign DANGER Spanish: oklandconstruction.box.com/s/ad7w960l9aa789zd057jjipqq9hpud3w
- Blue Tape Sign NOTICE: oklandconstruction.box.com/s/ivguif33oo6m9pcf9k5pvume8huyand4
- Blue Tape Sign NOTICE Spanish: oklandconstruction.box.com/s/bopmtnadoiooom5jb1m9jopgmdlmkza6
- Safety Barricade Tape Guidelines: oklandconstruction.box.com/s/l096dd5deiw67u1ckx78ovnigrsxafrs
- Safety Barricade Tape Guidelines Spanish: oklandconstruction.box.com/s/350203wdmo3dxph0mkf82nd4vt69p2jt

Pre-Task Plan (PTP) Downloads:
- Pre-Task Plan (PTP): oklandconstruction.box.com/s/xlmvds0mlsmnd27w2zmul9p6b93vlya8
- PTP Guide Sheet: oklandconstruction.box.com/s/ozi5cfwwqi3dmvl5nxycvlesc6aurgr5

SDS E-Binder (MSDS Online): chemmanagement.ehs.com/9/88c3cdb2-a47e-4a9f-a66f-751ab55e639f/ebinder

Inspection Forms Downloads:
- Forklift Operators Inspection: oklandconstruction.box.com/s/k1z6k3ckkqhc5n9aq1t1d28t4cghnpqe
- MEWP Operators Inspection: oklandconstruction.box.com/s/jj6l4fuo5shlufqt7qaabipkiapn2knw
- Mobile Equipment Pre-Operational Checklist: oklandconstruction.box.com/s/dsu3pea6j16q985tk6gw50791kuej6mf
- Mobile Equipment Pre-Operational Inspection Guide: oklandconstruction.box.com/s/g4vty2972lkntvgi1yo765kyvxklt56d
- ProJax Narrow Frame Scaffold Inspection Form: oklandconstruction.box.com/s/7n62xtilza6u3tze2inj4iggh1159kza
- Rigging Inspection Checklist: oklandconstruction.box.com/s/9fob3x2cbv2cu47i7g7b3x798375okkg

Lift Planning Worksheet Downloads:
- Hydraulic-Lattice Boom Lift Planning Worksheet: oklandconstruction.box.com/s/l2o1cn8ownr7bscsrqy241imysdpvg5n
- Non-Crane Lift Planning Worksheet: oklandconstruction.box.com/s/ifd5niucthtms6b85eaifwuxmv7buevx
- Tower Crane Lift Planning Worksheet: oklandconstruction.box.com/s/32x41lhopxdi74cyuzl65h9oojn2rk7f

SPANISH ORIENTATION (care.okland-const.com/orientation-esp):
- Okland Employee Orientation Course Spanish: okland.myabsorb.com/#/online-courses/a229d434-d140-4dce-90b1-d8caa1c6518e
- Trade Partner Orientation Course Spanish: oklandtradepartners.myabsorb.com?KeyName=eg2z28wuCVtTgZmllZ43
- Orientation Review Handout Spanish: oklandconstruction.box.com/s/w26vgdbghhabwtvt86kmyq7w2p0xvjpi
- Approved drug screening companies list: partner.okland.com/docs/approved-companies

RESPONSE FORMAT:
- Always cite source using [Okland Specific Manual], [Subcontractor Specific Manual], or [OSHA 29 CFR 1926]
- Use bullet points and headers for clarity
- Be practical and direct
- For Okland employee role questions → Okland Specific Manual
- For on-site compliance questions → Subcontractor Specific Manual
- End high-risk topic answers recommending consultation with Okland Safety Manager for site-specific guidance
- If the user's message is in Spanish OR if they ask you to respond in Spanish, respond entirely in Spanish including all labels, headers, and source citations`;

const SYSTEM_PROMPT_ES = SYSTEM_PROMPT + `

INSTRUCCIÓN IMPORTANTE: El usuario ha seleccionado español. Responde SIEMPRE en español, incluyendo todos los encabezados, viñetas y citas de fuentes. Traduce [Okland Specific Manual] como [Manual Específico de Okland], [Subcontractor Specific Manual] como [Manual Específico de Subcontratistas], y [OSHA 29 CFR 1926] permanece igual.`;

const SUGGESTIONS_EN = [
  "What PPE is required on site?",
  "When is fall protection required?",
  "Who is responsible for crane safety?",
  "How do I get a hot work permit?",
  "What are the confined space requirements?",
  "What happens at 30 MPH winds?",
];

const SUGGESTIONS_ES = [
  "¿Qué EPP se requiere en el sitio?",
  "¿Cuándo se requiere protección contra caídas?",
  "¿Quién es responsable de la seguridad con grúas?",
  "¿Cómo obtengo un permiso de trabajo en caliente?",
  "¿Cuáles son los requisitos para espacios confinados?",
  "¿Qué pasa a vientos de 30 MPH?",
];

const SUGGESTIONS = SUGGESTIONS_EN;

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

const SSHM_BASE = "/viewer?doc=sshm";
const OSHM_BASE = "/viewer?doc=oshm";

const MANUAL_LINKS = [
  { keyword: "responsibility matrix", url: OSHM_BASE + "&page=12", label: "View Responsibility Matrix (OSHM p.12)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "senior leadership", url: OSHM_BASE + "&page=12", label: "View Senior Leadership Role (OSHM p.12)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "all okland workers", url: OSHM_BASE + "&page=14", label: "View All Okland Workers Role (OSHM p.14)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "crane superintendent", url: OSHM_BASE + "&page=14", label: "View Crane Superintendent Role (OSHM p.14)", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "okland specific manual", url: OSHM_BASE, label: "Open Okland Specific Manual", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "okland specific", url: OSHM_BASE, label: "Open Okland Specific Manual", color: "#FFF8CC", border: "#E0C000", text: "#7a5f00" },
  { keyword: "stop work authority", url: SSHM_BASE + "&page=13", label: "View Stop Work Authority (SSHM p.13)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "lone worker", url: SSHM_BASE + "&page=13", label: "View Lone Worker Rules (SSHM p.13)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "visitor", url: SSHM_BASE + "&page=16", label: "View Visitor Requirements (SSHM p.16)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "wind protocol", url: SSHM_BASE + "&page=27", label: "View Wind Protocols (SSHM p.27)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "lightning", url: SSHM_BASE + "&page=28", label: "View Lightning Protocols (SSHM p.28)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "personal protective equipment", url: SSHM_BASE + "&page=29", label: "View PPE Requirements (SSHM p.29)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "ppe requirements", url: SSHM_BASE + "&page=29", label: "View PPE Requirements (SSHM p.29)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "high-visibility garment", url: SSHM_BASE + "&page=29", label: "View PPE Requirements (SSHM p.29)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "fire extinguisher", url: SSHM_BASE + "&page=32", label: "View Fire Protection (SSHM p.32)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "flammable liquid", url: SSHM_BASE + "&page=32", label: "View Fire Protection (SSHM p.32)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "barricade tape", url: SSHM_BASE + "&page=36", label: "View Barricade Tape Rules (SSHM p.36)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "danger tape", url: SSHM_BASE + "&page=36", label: "View Barricade Tape Rules (SSHM p.36)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "caution tape", url: SSHM_BASE + "&page=36", label: "View Barricade Tape Rules (SSHM p.36)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "power tool", url: SSHM_BASE + "&page=39", label: "View Tools Requirements (SSHM p.39)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "lithium batter", url: SSHM_BASE + "&page=39", label: "View Tools Requirements (SSHM p.39)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "hot work permit", url: SSHM_BASE + "&page=44", label: "View Hot Work Requirements (SSHM p.44)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "fire watch", url: SSHM_BASE + "&page=44", label: "View Hot Work Requirements (SSHM p.44)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "welding operations", url: SSHM_BASE + "&page=44", label: "View Welding & Hot Work (SSHM p.44)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "scaffold", url: SSHM_BASE + "&page=49", label: "View Scaffold Requirements (SSHM p.49)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "fall protection", url: SSHM_BASE + "&page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "pfas", url: SSHM_BASE + "&page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "guardrail", url: SSHM_BASE + "&page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "hole cover", url: SSHM_BASE + "&page=57", label: "View Fall Protection (SSHM p.57)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "motor vehicle", url: SSHM_BASE + "&page=67", label: "View Motor Vehicle Rules (SSHM p.67)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "forklift operation", url: SSHM_BASE + "&page=67", label: "View Forklift Requirements (SSHM p.67)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "excavat", url: SSHM_BASE + "&page=73", label: "View Excavation Requirements (SSHM p.73)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "soil disturbance", url: SSHM_BASE + "&page=73", label: "View Soil Disturbance Rules (SSHM p.73)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "trench access", url: SSHM_BASE + "&page=73", label: "View Excavation Requirements (SSHM p.73)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "concrete placement", url: SSHM_BASE + "&page=77", label: "View Concrete Requirements (SSHM p.77)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "rebar cap", url: SSHM_BASE + "&page=77", label: "View Concrete Requirements (SSHM p.77)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "steel erection", url: SSHM_BASE + "&page=80", label: "View Steel Erection (SSHM p.80)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "demolition", url: SSHM_BASE + "&page=81", label: "View Demolition Requirements (SSHM p.81)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "silica", url: SSHM_BASE + "&page=85", label: "View Toxic Substances (SSHM p.85)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "asbestos", url: SSHM_BASE + "&page=85", label: "View Toxic Substances (SSHM p.85)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "confined space", url: SSHM_BASE + "&page=87", label: "View Confined Space Rules (SSHM p.87)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "hole watch", url: SSHM_BASE + "&page=87", label: "View Confined Space Rules (SSHM p.87)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "crane operations", url: SSHM_BASE + "&page=87", label: "View Crane Requirements (SSHM p.87)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "critical lift", url: SSHM_BASE + "&page=94", label: "View Critical Lift Criteria (SSHM p.94)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "rigging requirements", url: SSHM_BASE + "&page=91", label: "View Rigging Requirements (SSHM p.91)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "drug test", url: SSHM_BASE + "&page=98", label: "View Substance Abuse Policy (SSHM p.98)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
  { keyword: "substance abuse", url: SSHM_BASE + "&page=98", label: "View Substance Abuse Policy (SSHM p.98)", color: "#EBF0FB", border: "#7a9cd4", text: "#1a3c8f" },
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
  // Render markdown tables as HTML tables
  function renderTables(input) {
    const lines = input.split('\n');
    const output = [];
    let i = 0;
    while (i < lines.length) {
      if (lines[i].includes('|') && i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1])) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        let tableHtml = '<table style="border-collapse:collapse;width:100%;margin:8px 0;font-size:12.5px">';
        let isFirstDataRow = true;
        tableLines.forEach((row) => {
          if (/^[\s|:-]+$/.test(row)) return;
          const cells = row.split('|').slice(1, -1);
          const tag = isFirstDataRow ? 'th' : 'td';
          const bg = isFirstDataRow ? 'background:#1a1a1a;color:#F5C400;font-weight:600;' : '';
          tableHtml += '<tr style="' + bg + '">';
          cells.forEach(cell => {
            tableHtml += '<' + tag + ' style="border:1px solid #e0e0e0;padding:6px 10px;text-align:left;">' + cell.trim() + '</' + tag + '>';
          });
          tableHtml += '</tr>';
          isFirstDataRow = false;
        });
        tableHtml += '</table>';
        output.push(tableHtml);
      } else {
        output.push(lines[i]);
        i++;
      }
    }
    return output.join('\n');
  }

  text = renderTables(text);

  return text
    .replace(/&(?!amp;|lt;|gt;|#)/g, "&amp;")
    .replace(/<(?!table|\/table|tr|\/tr|th|\/th|td|\/td)/g, "&lt;")
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
    return React.createElement("div", { style: bubbleStyle },
      msg.image && React.createElement("img", { src: msg.image, style: { maxWidth: "100%", borderRadius: 8, marginBottom: msg.text ? 8 : 0, display: "block" } }),
      msg.text && React.createElement("div", null, msg.text)
    );
  }
  return React.createElement("div", { style: bubbleStyle, dangerouslySetInnerHTML: { __html: formatMarkdown(msg.text) } });
}

function App() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Hi! I'm the Okland Safety Assistant. Ask me anything about jobsite safety — I'll answer using Okland's manuals and OSHA standards.",
    sources: ["Okland Specific Manual", "Subcontractor Specific Manual", "OSHA 29 CFR 1926"],
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingImageBase64, setPendingImageBase64] = useState(null);
  const fileInputRef = useRef(null);
  const history = useRef([]);
  const bottomRef = useRef(null);

  const lastMsgRef = useRef(null);

  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          window._userLat = pos.coords.latitude;
          window._userLon = pos.coords.longitude;
        },
        () => {}
      );
    }
  }, []);

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(",")[1];
      setPendingImage(ev.target.result);
      setPendingImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  async function send(text) {
    if ((!text.trim() && !pendingImage) || loading) return;
    setShowSuggestions(false);
    const imageToSend = pendingImageBase64;
    const imagePreview = pendingImage;
    setInput("");
    setPendingImage(null);
    setPendingImageBase64(null);

    // Build user message for display
    const userDisplayText = text.trim() || (lang === "es" ? "¿Puedes identificar los peligros de seguridad en esta foto?" : "Can you identify any safety hazards in this photo?");
    setMessages(m => [...m, { role: "user", text: userDisplayText, image: imagePreview }]);

    // Build message for API - include image if present
    let apiMessage;
    if (imageToSend) {
      apiMessage = {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageToSend
            }
          },
          {
            type: "text",
            text: text.trim() || (lang === "es" ? "Por favor analiza esta foto del sitio de construcción e identifica todos los peligros de seguridad según los manuales de Okland y las normas OSHA." : "Please analyze this construction site photo and identify all safety hazards according to Okland's manuals and OSHA standards.")
          }
        ]
      };
    } else {
      apiMessage = { role: "user", content: text };
    }

    history.current = [...history.current, apiMessage];
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system: lang === "es" ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT,
          messages: history.current,
          lat: window._userLat || null,
          lon: window._userLon || null,
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
      React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#22c55e" } }),
      React.createElement("button", {
        onClick: () => {
          const newLang = lang === "en" ? "es" : "en";
          setLang(newLang);
          setMessages([{
            role: "assistant",
            text: newLang === "es" 
              ? "¡Hola! Soy el Asistente de Seguridad de Okland. Pregúntame cualquier cosa sobre seguridad en el trabajo — responderé usando los manuales de Okland y las normas OSHA."
              : "Hi! I'm the Okland Safety Assistant. Ask me anything about jobsite safety — I'll answer using Okland's manuals and OSHA standards.",
            sources: ["Okland Specific Manual", "Subcontractor Specific Manual", "OSHA 29 CFR 1926"],
          }]);
          setShowSuggestions(true);
          history.current = [];
        },
        style: { background: lang === "es" ? "#F5C400" : "#333", color: lang === "es" ? "#1a1a1a" : "#fff", border: "1px solid #555", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }
      }, lang === "es" ? "🇲🇽 ES" : "🇺🇸 EN")
    ),
    React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "#f9f9f9" } },
      messages.map((msg, i) =>
        React.createElement("div", { key: i, ref: (i === messages.length - 1 && msg.role === "assistant") ? lastMsgRef : null, style: { display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "88%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" } },
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
      (lang === "es" ? SUGGESTIONS_ES : SUGGESTIONS_EN).map(s =>
        React.createElement("button", { key: s, onClick: () => send(s), style: { background: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: 16, padding: "5px 11px", fontSize: 11.5, color: "#555", cursor: "pointer", whiteSpace: "nowrap" } }, s)
      )
    ),
    React.createElement("div", { style: { borderTop: "1px solid #e8e8e8", background: "#fff" } },
      pendingImage && React.createElement("div", { style: { padding: "8px 14px 0", display: "flex", alignItems: "center", gap: 8 } },
        React.createElement("img", { src: pendingImage, style: { height: 60, borderRadius: 8, objectFit: "cover" } }),
        React.createElement("button", {
          onClick: () => { setPendingImage(null); setPendingImageBase64(null); },
          style: { background: "#ff4444", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }
        }, "✕")
      ),
      React.createElement("div", { style: { padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" } },
        React.createElement("input", {
          type: "file",
          accept: "image/*",
          capture: "environment",
          ref: fileInputRef,
          onChange: handleImageSelect,
          style: { display: "none" }
        }),
        React.createElement("button", {
          onClick: () => fileInputRef.current.click(),
          title: lang === "es" ? "Tomar foto" : "Take photo",
          style: { width: 36, height: 36, borderRadius: "50%", background: pendingImage ? "#F5C400" : "#f0f0f0", border: "1px solid #ddd", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }
        }, "📷"),
        React.createElement("textarea", {
          value: input,
          onChange: e => setInput(e.target.value),
          onKeyDown: e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } },
          placeholder: lang === "es" ? "Haz una pregunta o toma una foto..." : "Ask a question or take a photo...",
          rows: 1,
          style: { flex: 1, padding: "9px 13px", border: "1px solid #ddd", borderRadius: 18, fontSize: 13.5, background: "#f9f9f9", color: "#1a1a1a", fontFamily: "inherit", outline: "none", resize: "none", maxHeight: 72 }
        }),
        React.createElement("button", {
          onClick: () => send(input),
          disabled: loading || (!input.trim() && !pendingImage),
          style: { width: 36, height: 36, borderRadius: "50%", background: loading || (!input.trim() && !pendingImage) ? "#ddd" : "#F5C400", border: "none", cursor: loading || (!input.trim() && !pendingImage) ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }
        }, "↑")
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
