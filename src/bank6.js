/* ── Drugs, drowsiness and enforcement ────────────────────────────────────
   The handbook devotes a whole section to drugs and another to drowsy driving.
   Both were missing here, which left impairment reading as an alcohol-only
   topic.                                                                   */
BANK.push(
/* ══ DRUGS ══════════════════════════════════════════════════════════════ */
{t:"penalties", q:"Driving while impaired by a DRUG is:", a:["A minor offence","Only an offence for illegal drugs","A crime in Canada, exactly like alcohol impairment","Not an offence if prescribed"], c:2,
 w:"The Criminal Code makes no distinction. Alcohol or a drug — impaired is impaired."},
{t:"penalties", q:"Can you be charged with impaired driving if your vehicle is not moving?", a:["No, it must be moving","Yes — you can be charged sitting behind the wheel","Only if the engine is running","Only in a parking lot"], c:1,
 w:"Straight from the handbook: your vehicle does not have to be moving."},
{t:"penalties", q:"Investigating possible drug impairment, police may require you to:", a:["Only give a breath sample","Perform field sobriety tests, a drug recognition evaluation, or give oral fluid, urine or blood","Just answer questions","Wait 24 hours"], c:1,
 w:"All of those are lawful demands, and each one is refusable only at your peril."},
{t:"penalties", q:"You refuse to comply with a police demand for a sample or a sobriety test. You are:", a:["Free to go","Charged under the Criminal Code, the same as failing it","Given a warning","Fined $100"], c:1,
 w:"Refusing is treated as seriously as failing. There is no advantage in saying no."},
{t:"penalties", q:"Prescription medicine can affect your driving through side effects such as:", a:["Improved focus","Dizziness, blurred vision, nausea or drowsiness","Faster reflexes","Nothing measurable"], c:1,
 w:"Ask your doctor before you drive on a new prescription, and about allergy shots too."},
{t:"penalties", q:"Which over-the-counter medicines can impair your driving?", a:["None — they are sold without a prescription","Cold, allergy, sedative and diet pills","Only sleeping pills","Only ones with codeine"], c:1,
 w:"Read the package. 'No prescription needed' does not mean 'safe to drive on'."},
{t:"penalties", q:"Mixing a drug with alcohol is dangerous:", a:["Only if you take them together","Only with illegal drugs","Even several days after taking the drug","Only for new drivers"], c:2,
 w:"The handbook is explicit: the interaction can last days. Ask your doctor or pharmacist."},
{t:"penalties", q:"Unsure whether a medication is safe to drive on? You should ask:", a:["A friend","Your doctor or pharmacist","The police","Nobody — try it and see"], c:1,
 w:"They know the side effects. Guessing is how people end up charged."},
{t:"penalties", q:"Police may stop a driver to check for alcohol or drugs:", a:["Only after a collision","Only with a warrant","Any time, including at roadside spot checks","Only between midnight and 5 a.m."], c:2,
 w:"Roadside spot checks are lawful and need no suspicion of an offence."},
{t:"penalties", q:"You cannot give a breath sample, or it is impractical to take one. Police may then require:", a:["Nothing further","A blood sample","A second breath test tomorrow","A written statement"], c:1,
 w:"A qualified person takes it. Refusing that is still a Criminal Code charge."},
{t:"penalties", q:"Driving while your licence is suspended for a Criminal Code offence means your vehicle is impounded for at least:", a:["7 days","14 days","30 days","45 days"], c:3,
 w:"45 days minimum — and the owner is responsible, so lending your car to a suspended driver costs you too."},

/* ══ DROWSY DRIVING ═════════════════════════════════════════════════════ */
{t:"ready", q:"Compared with a drunk driver, a very tired driver is:", a:["Much safer","Slightly worse","Can be just as impaired","Only a risk on highways"], c:2,
 w:"The handbook puts them side by side: tired drivers can be as impaired as drunk drivers."},
{t:"ready", q:"Which is a warning sign that you are about to fall asleep at the wheel?", a:["You feel hungry","You cannot remember the last few kilometres you drove","The radio seems loud","You are driving slowly"], c:1,
 w:"Others: eyes hard to keep open, head tilting, frequent yawning, missing lights, drifting out of your lane."},
{t:"ready", q:"You notice you are drifting out of your lane and yawning. You should:", a:["Open a window and continue","Turn up the radio","Pull off and park somewhere safe and well lit","Drive faster to finish sooner"], c:2,
 w:"A well-lit rest stop or truck stop. You can fall asleep without ever realising it."},
{t:"ready", q:"Coffee or an energy drink when you are sleep deprived will:", a:["Replace the sleep you need","Help briefly, then wear off quickly","Keep you alert all night","Make you a safer driver"], c:1,
 w:"Stimulants are never a substitute for sleep."},
{t:"ready", q:"Drowsy-driving collisions happen most often:", a:["During morning rush hour","Between 2 a.m. and 6 a.m., and again between 2 p.m. and 4 p.m.","At noon","On weekends only"], c:1,
 w:"Your body clock dips in the small hours and again mid-afternoon."},

/* ══ AGGRESSION AND RACING ══════════════════════════════════════════════ */
{t:"emergencies", q:"Another driver is behaving aggressively and you feel threatened. You should:", a:["Pull over and confront them","Stay in your vehicle with the doors locked and call police","Speed up and lose them","Gesture back"], c:1,
 w:"Use your horn and signals to attract attention. Avoid eye contact and do not return aggression."},
{t:"emergencies", q:"You think an aggressive driver is following you. You should drive to:", a:["Your home","A police station or a busy public place","A quiet side street","The nearest highway"], c:1,
 w:"Never lead someone to where you live."},
{t:"penalties", q:"Street racing is treated as:", a:["A minor speeding offence","One of the most serious forms of aggressive driving","Legal on closed roads","A parking offence"], c:1,
 w:"It carries the stunt-driving sanctions: roadside suspension, impoundment, and 6 demerit points on conviction."}
);
