import React, { useState } from 'react';
import {
  Brain, Pill, Eye, Activity, Baby, FileText, ShieldAlert, Heart,
  Search, Info, Check, ShieldCheck, ChevronRight,
  Clock, AlertCircle, ArrowLeftRight, CheckCircle2, UserCheck
} from 'lucide-react';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  glow: 'teal' | 'emerald' | 'purple' | 'blue' | 'rose' | 'amber' | 'sky' | 'indigo';
}

export const Encyclopedia: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('innovations');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Innovations State
  const [selectedInnovation, setSelectedInnovation] = useState<string>('ai_radiology');

  // 2. Drugs State
  const [drugSearch, setDrugSearch] = useState<string>('');

  // 7. Allergy State
  const [allergyAnswers, setAllergyAnswers] = useState<Record<string, boolean>>({});
  const [showAllergyResult, setShowAllergyResult] = useState<boolean>(false);

  // 8. Blood Donation State
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('O-');

  const categories: Category[] = [
    { id: 'innovations', title: 'Medical Innovations', description: 'AI diagnostics, surgical robotics, gene therapies, precision longevity care.', icon: Brain, color: 'text-purple-600 bg-purple-50 border-purple-100', glow: 'purple' },
    { id: 'drugs', title: 'Pharmaceutical Reference', description: 'CDSCO drug guide, generic vs. brands, Indian market pricing, efficacy.', icon: Pill, color: 'text-teal-600 bg-teal-50 border-teal-100', glow: 'teal' },
    { id: 'tech-surgeries', title: 'Medical Tech & Surgeries', description: 'Analogy-based guides: LASIK, cataract, CT Scan vs. MRI comparisons.', icon: Eye, color: 'text-sky-600 bg-sky-50 border-sky-100', glow: 'sky' },
    { id: 'epidemics', title: 'Epidemic & Outbreak Guides', description: 'Contagious disease protocols, outbreak checklists, personal safety.', icon: Activity, color: 'text-rose-600 bg-rose-50 border-rose-100', glow: 'rose' },
    { id: 'child-care', title: 'Child Care Encyclopedia', description: 'Neonatal schedules, parent immunization guides, childhood fever checklists.', icon: Baby, color: 'text-amber-600 bg-amber-50 border-amber-100', glow: 'amber' },
    { id: 'trials', title: 'Clinical Trials Pipeline', description: 'Phase I to IV trials, placebo controls, ethics, informed consent.', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', glow: 'indigo' },
    { id: 'allergies', title: 'Allergies & Sensitivities', description: 'Penicillin/NSAID sensitivity checker, anaphylaxis warning signs.', icon: ShieldAlert, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', glow: 'emerald' },
    { id: 'blood-donation', title: 'Blood Donation Guide', description: 'Compatibility matrix, physiological benefits, eligibility checklists.', icon: Heart, color: 'text-red-600 bg-red-50 border-red-100', glow: 'rose' },
  ];

  // Filtering categories by search query
  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. Innovations Data
  const innovationsData = [
    {
      id: 'ai_radiology',
      title: 'AI in Radiology & Diagnostics',
      what: 'Neural network algorithms analyzing radiological scans (X-rays, CTs, MRIs) to identify anomalies, fractures, and early stage micro-tumors.',
      why: 'Speeds up triage from hours to seconds and catches tiny nodules that might be invisible to the human eye.',
      benefits: '98.2% diagnostic accuracy, faster treatment starts, reduced radiologist fatigue.',
      risks: 'Over-reliance on automation, potential algorithmic bias on non-diverse scan datasets.',
      adoption: 'Highly active in premium Indian hospitals (Apollo, Fortis, Max) for initial screening.',
      indianContext: 'Helps bridge the massive shortage of radiologists in tier-2 and tier-3 Indian cities.',
      outlook: 'Autonomous preliminary reporting with final human sign-off as standard clinical practice.'
    },
    {
      id: 'surgical_robotics',
      title: 'Surgical Robotics (Da Vinci Systems)',
      what: 'Surgeon-controlled multi-arm robotic consoles that execute micro-surgical incisions with tremors filtered out.',
      why: 'Turns highly invasive open surgeries into minimally invasive keyhole operations.',
      benefits: 'Smaller scars, reduced blood loss, shorter hospital stay (often discharged in 24 hours), micro-precision.',
      risks: 'Extremely high initial installation cost, steep learning curve for surgical staff.',
      adoption: 'Growing steadily; over 100 robotic centers active across metro Indian cities.',
      indianContext: 'Predominantly available in premium private healthcare networks, expanding into government research institutes.',
      outlook: 'AI-guided autonomous suturing and remote telesurgery over ultra-low-latency networks.'
    },
    {
      id: 'crispr_therapies',
      title: 'CRISPR & Gene-Editing Therapies',
      what: 'A molecular technology that acts like a "find-and-replace" tool for DNA to correct mutation sequences.',
      why: 'Enables direct cure of hereditary and genetic disorders at the DNA level.',
      benefits: 'One-time curative treatments for sickle-cell anemia, beta-thalassemia, and specific genetic blindnesses.',
      risks: 'Off-target mutations (editing unintended parts of DNA), long-term safety profile unknowns.',
      adoption: 'Early commercial approval in UK/US (Casgevy). Active clinical trials globally.',
      indianContext: 'CSIR-IGIB in India is actively researching indigenous CRISPR therapies to keep treatments affordable.',
      outlook: 'In-vivo edits delivering direct cures inside the body via nanoparticles.'
    },
    {
      id: 'precision_medicine',
      title: 'Precision Medicine & Longevity Genomics',
      what: 'Customizing disease prevention and therapies based on the genetic, metabolic, and lifestyle blueprint of the individual.',
      why: 'Replaces the clinical "trial-and-error" prescription model with target-specific cures.',
      benefits: 'Optimized oncology chemotherapies, prevention of cardiovascular diseases years before onset.',
      risks: 'High cost of genome sequencing, genetic data privacy concerns.',
      adoption: 'Offered as premium longevity profiling packages in elite wellness centers.',
      indianContext: 'Emerging wellness startups in India are offering consumer-grade genomic assays.',
      outlook: 'Integrating wearable sensor streams with genomic data to update care plans dynamically.'
    }
  ];

  // 2. Pharmaceutical Reference Data
  const drugsData = [
    {
      generic: 'Semaglutide',
      brands: 'Wegovy (Novo Nordisk), Rybelsus (Oral)',
      class: 'GLP-1 Receptor Agonist',
      uses: 'Chronic weight management, Type 2 diabetes control.',
      works: 'Mimics natural GLP-1 hormone to slow gastric emptying, stimulate insulin, and signal fullness to the brain.',
      commonSide: 'Nausea, diarrhea, vomiting, constipation, stomach discomfort.',
      seriousSide: 'Pancreatitis warning, thyroid C-cell tumors risk, gallbladder problems.',
      contra: 'Personal or family history of medullary thyroid carcinoma, MEN 2 syndrome.',
      interactions: 'Delays absorption of oral medications. Combine carefully with insulin.',
      cdsco: 'Rybelsus (oral) approved. Injectable Wegovy undergoing import approval.',
      cost: 'Rybelsus (oral) costs ₹8,000 - ₹10,000/month in India. Injectable Wegovy is higher.',
      notes: 'Must be initiated at low doses and titrated slowly over weeks to minimize gastrointestinal distress.'
    },
    {
      generic: 'Paxlovid (Nirmatrelvir + Ritonavir)',
      brands: 'Paxzen (Zenara Pharma), Primovir',
      class: 'Antiviral Protease Inhibitors',
      uses: 'Treatment of mild-to-moderate COVID-19 in high-risk adult patients.',
      works: 'Nirmatrelvir blocks viral replication; Ritonavir slows the breakdown of Nirmatrelvir to keep it active longer.',
      commonSide: 'Altered sense of taste (dysgeusia), diarrhea, muscle aches.',
      seriousSide: 'Severe drug-drug interactions (can cause toxic levels of other common medicines), hepatotoxicity.',
      contra: 'Severe kidney or liver impairment. Concomitant use of drugs cleared heavily via CYP3A.',
      interactions: 'Extremely high drug interaction risk (statins, blood thinners, anticonvulsants).',
      cdsco: 'Approved under Emergency Use Authorization (EUA) in India.',
      cost: 'Generic versions in India are highly affordable (approx. ₹3,000 - ₹4,500 per course).',
      notes: 'Must be started within 5 days of symptom onset. Course lasts strictly for 5 days.'
    },
    {
      generic: 'Metformin Hydrochloride',
      brands: 'Glycomet, Cetapin, Obimet',
      class: 'Biguanide Antidiabetic',
      uses: 'First-line therapy for Type 2 diabetes mellitus control.',
      works: 'Decreases hepatic glucose production, decreases intestinal absorption, and improves insulin sensitivity.',
      commonSide: 'Metalic taste, diarrhea, abdominal gas, nausea.',
      seriousSide: 'Lactic acidosis (rare but medical emergency, risk increases with kidney disease).',
      contra: 'Severe renal impairment (eGFR < 30 mL/min), acute metabolic acidosis.',
      interactions: 'Contrast dyes (stop Metformin 48h before scans), cimetidine, alcohol.',
      cdsco: 'Standard approved drug, widely available.',
      cost: 'Extremely cheap. Standard tablets cost ₹2 - ₹5 each in India.',
      notes: 'Taking it with meals significantly reduces gastrointestinal side effects.'
    },
    {
      generic: 'Atorvastatin Calcium',
      brands: 'Lipvas, Storvas, Atorva',
      class: 'HMG-CoA Reductase Inhibitor (Statin)',
      uses: 'Hypercholesterolemia control, prevention of cardiovascular diseases.',
      works: 'Blocks the liver enzyme responsible for cholesterol production, clearing LDL from blood.',
      commonSide: 'Muscle pain (myalgia), joint pain, mild headache.',
      seriousSide: 'Rhabdomyolysis (muscle breakdown causing kidney failure), liver enzyme spikes.',
      contra: 'Active liver disease, pregnancy, lactation.',
      interactions: 'Grapefruit juice (increases concentration), fibric acid derivatives.',
      cdsco: 'Standard approved cardiovasular drug.',
      cost: 'Affordable. A pack of 10 costs ₹40 - ₹120 depending on strength.',
      notes: 'Report unexplained muscle weakness immediately to your prescribing physician.'
    }
  ];

  const filteredDrugs = drugsData.filter(d =>
    d.generic.toLowerCase().includes(drugSearch.toLowerCase()) ||
    d.brands.toLowerCase().includes(drugSearch.toLowerCase()) ||
    d.class.toLowerCase().includes(drugSearch.toLowerCase())
  );

  // 7. Allergy Screening Questions
  const allergyQuestions = [
    { id: 'q_hives', text: 'Have you ever developed itchy, raised red welts (hives) within 2 hours of taking Penicillin or Aspirin?' },
    { id: 'q_swelling', text: 'Have you experienced swelling of the lips, tongue, or face after taking any pain relievers?' },
    { id: 'q_breath', text: 'Have you had sudden wheezing, chest tightness, or breathing difficulties after taking an antibiotic?' },
    { id: 'q_dizzy', text: 'Have you ever felt dizzy, lightheaded, or fainted shortly after an injection or tablet?' }
  ];

  const handleAllergyToggle = (id: string, val: boolean) => {
    setAllergyAnswers(prev => ({ ...prev, [id]: val }));
  };

  const checkAllergyRisk = () => {
    setShowAllergyResult(true);
  };

  const resetAllergyChecker = () => {
    setAllergyAnswers({});
    setShowAllergyResult(false);
  };

  const isHighAllergyRisk = Object.values(allergyAnswers).some(val => val === true);

  // 8. Blood Donation Compatibility Data
  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const getBloodCompatibility = (group: string) => {
    switch (group) {
      case 'O-': return {
        give: 'All Blood Types (Universal Donor)',
        receive: 'O Negative Only'
      };
      case 'O+': return {
        give: 'O+, A+, B+, AB+',
        receive: 'O-, O+'
      };
      case 'A-': return {
        give: 'A-, A+, AB-, AB+',
        receive: 'O-, A-'
      };
      case 'A+': return {
        give: 'A+, AB+',
        receive: 'O-, O+, A-, A+'
      };
      case 'B-': return {
        give: 'B-, B+, AB-, AB+',
        receive: 'O-, B-'
      };
      case 'B+': return {
        give: 'B+, AB+',
        receive: 'O-, O+, B-, B+'
      };
      case 'AB-': return {
        give: 'AB-, AB+',
        receive: 'O-, A-, B-, AB-'
      };
      case 'AB+': return {
        give: 'AB+ Only',
        receive: 'All Blood Types (Universal Recipient)'
      };
      default: return { give: 'Unknown', receive: 'Unknown' };
    }
  };

  const compatibility = getBloodCompatibility(selectedBloodGroup);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 text-left animate-[fadeIn_0.5s_ease-out]">
      
      {/* Premium Glassmorphic Hero Banner */}
      <div className="relative rounded-[32px] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-teal-800 to-emerald-950 text-white mb-12 shadow-[0_20px_50px_rgba(13,148,136,0.15)] border border-teal-700/50">
        <div className="absolute right-[5%] top-[10%] w-[320px] h-[320px] bg-emerald-400/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-[10%] bottom-[5%] w-[250px] h-[250px] bg-teal-400/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/30 text-teal-300 text-[10px] font-bold tracking-widest uppercase font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Medora Patient Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Med-AI Encyclopedia
          </h1>
          <p className="text-sm md:text-base text-teal-100/80 leading-relaxed font-medium">
            Explore our comprehensive, patient-friendly, evidence-based medical repository. Demystifying technologies, clinical trials, pharmaceuticals, child care, and contagious diseases with lucid analogical guides and compatibility tools.
          </p>
          
          {/* Main Search Filter */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 max-w-md mt-6 shadow-inner">
            <Search className="w-5 h-5 text-teal-300 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search encyclopedia topics..."
              className="bg-transparent border-none outline-none text-white placeholder-teal-200/60 text-sm w-full focus:ring-0"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-teal-300 hover:text-white font-bold uppercase font-mono">Clear</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Premium Sidebar Menu (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3 lg:sticky lg:top-24">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono mb-1 px-1">Clinical Encyclopedic Domains</h3>
          <div className="flex flex-col gap-2.5">
            {filteredCategories.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-center group relative overflow-hidden ${
                    isActive
                      ? 'bg-white border-teal-100 shadow-[0_10px_25px_-5px_rgba(13,148,136,0.08)] scale-[1.01]'
                      : 'bg-white/40 hover:bg-white/80 border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    isActive ? cat.color : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-slate-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pr-2">
                    <h4 className={`text-sm font-bold transition-colors ${isActive ? 'text-teal-950 font-extrabold' : 'text-slate-700'}`}>
                      {cat.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-1 group-hover:text-slate-500 transition-colors">
                      {cat.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                    isActive ? 'text-teal-600 translate-x-1' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'
                  }`} />
                  
                  {/* Left accent bar for active card */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-500 to-emerald-500" />
                  )}
                </button>
              );
            })}
            
            {filteredCategories.length === 0 && (
              <p className="text-xs text-slate-400 p-6 text-center border border-dashed border-slate-200 rounded-2xl">
                No matching encyclopedia categories found. Try clearing your search filter.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Premium Active Category Container (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-teal-100/80 shadow-[0_12px_40px_rgba(13,148,136,0.03)] rounded-[32px] p-6 md:p-8 min-h-[65vh] flex flex-col justify-between">
          <div>
            
            {/* 1. RECENT MEDICAL INNOVATIONS */}
            {activeCategory === 'innovations' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4">
                  <h2 className="text-xl font-extrabold text-teal-950">Recent Medical Innovations & Healthcare Shifts</h2>
                  <p className="text-xs text-slate-400 mt-1">Tracing technological breakthroughs changing diagnostics and clinical surgery workflows.</p>
                </div>
                
                {/* Micro Tab Selector */}
                <div className="flex flex-wrap gap-2">
                  {innovationsData.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedInnovation(item.id)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                        selectedInnovation === item.id
                          ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>

                {innovationsData.filter(item => item.id === selectedInnovation).map((item) => (
                  <div key={item.id} className="space-y-5 mt-4 p-5 rounded-2xl bg-purple-50/20 border border-purple-100/50">
                    <h3 className="text-base font-extrabold text-purple-950 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      {item.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-left">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-extrabold text-slate-600 uppercase tracking-wider text-[9px] font-mono">What It Is</h4>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{item.what}</p>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-600 uppercase tracking-wider text-[9px] font-mono">Why It Matters</h4>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{item.why}</p>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-emerald-700 uppercase tracking-wider text-[9px] font-mono">Key Benefits</h4>
                          <p className="text-emerald-800 mt-0.5 leading-relaxed font-medium">✓ {item.benefits}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-extrabold text-rose-700 uppercase tracking-wider text-[9px] font-mono">Associated Risks</h4>
                          <p className="text-rose-800 mt-0.5 leading-relaxed font-medium">⚠ {item.risks}</p>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-600 uppercase tracking-wider text-[9px] font-mono">Current Adoption Status</h4>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{item.adoption}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                          <h4 className="font-extrabold text-purple-900 uppercase tracking-wider text-[9px] font-mono">Indian Healthcare Relevance</h4>
                          <p className="text-purple-950 mt-1 leading-relaxed">{item.indianContext}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-purple-100 text-xs flex items-center gap-2 text-purple-900 font-medium">
                      <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>**Future Outlook**: {item.outlook}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. PHARMACEUTICAL REFERENCE */}
            {activeCategory === 'drugs' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-teal-950">Pharmaceutical Reference Guide</h2>
                    <p className="text-xs text-slate-400 mt-1">Indian market CDSCO approvals, generic vs. brands, cost considerations, and safety profiles.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 shrink-0 max-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={drugSearch}
                      onChange={(e) => setDrugSearch(e.target.value)}
                      placeholder="Filter drug index..."
                      className="bg-transparent border-none outline-none text-xs w-full text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredDrugs.map((drug, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-teal-50/10 border border-teal-100/60 space-y-3">
                      <div className="flex items-start justify-between border-b border-teal-50 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-teal-600 font-mono">{drug.class}</span>
                          <h3 className="text-base font-extrabold text-slate-900 leading-tight mt-0.5">{drug.generic}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider font-mono">CDSCO status</span>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">{drug.cdsco}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <p><strong className="text-slate-700">Common Brand Names (India):</strong> <span className="text-teal-800 font-semibold">{drug.brands}</span></p>
                          <p><strong className="text-slate-700">Approved Indications:</strong> {drug.uses}</p>
                          <p><strong className="text-slate-700">Mechanism (Simple):</strong> {drug.works}</p>
                          <p><strong className="text-teal-900">Cost & Affordability:</strong> {drug.cost}</p>
                        </div>
                        <div className="space-y-2">
                          <p><strong className="text-slate-700">Common Side Effects:</strong> {drug.commonSide}</p>
                          <p><strong className="text-rose-700">Serious Side Effects:</strong> {drug.seriousSide}</p>
                          <p><strong className="text-rose-700">Contraindications:</strong> {drug.contra}</p>
                          <p><strong className="text-amber-800">Drug-Food Interactions:</strong> {drug.interactions}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-teal-50 border border-teal-100/50 text-[11px] text-teal-950 flex gap-2 items-start">
                        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span><strong>Clinical Practice Note:</strong> {drug.notes}</span>
                      </div>
                    </div>
                  ))}

                  {filteredDrugs.length === 0 && (
                    <p className="text-xs text-slate-400 p-12 text-center border border-dashed border-slate-200 rounded-2xl">
                      No matching pharmaceuticals found. Try searching for "metformin" or "semaglutide".
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 3. UNDERSTANDING COMPLEX TECH & SURGERIES */}
            {activeCategory === 'tech-surgeries' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4">
                  <h2 className="text-xl font-extrabold text-teal-950">Medical Technologies & Surgery Simplifier</h2>
                  <p className="text-xs text-slate-400 mt-1">Translating complex clinical diagnostic scans and optical surgeries into simple, analogy-backed concepts.</p>
                </div>

                <div className="space-y-6">
                  
                  {/* Surgery Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-l-4 border-sky-500 pl-3">Ophthalmic Surgery Demystified</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="p-5 rounded-2xl bg-sky-50/20 border border-sky-100 flex flex-col gap-3">
                        <h4 className="font-extrabold text-sky-950 text-sm">LASIK Vision Correction</h4>
                        <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-900">
                          <span className="font-bold text-[10px] uppercase font-mono block text-sky-800">Analogy</span>
                          "Like custom reshaping a camera lens to make the light focus perfectly on the digital sensor."
                        </div>
                        <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4">
                          <li>A micro-thin safety flap is created in the outer cornea layer.</li>
                          <li>A computer-controlled cool laser removes micro-layers of tissue underneath.</li>
                          <li>The flap is laid back in place, healing within 24 hours without stitches.</li>
                        </ol>
                      </div>

                      <div className="p-5 rounded-2xl bg-sky-50/20 border border-sky-100 flex flex-col gap-3">
                        <h4 className="font-extrabold text-sky-950 text-sm">Cataract Replacement</h4>
                        <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-900">
                          <span className="font-bold text-[10px] uppercase font-mono block text-sky-800">Analogy</span>
                          "Like replacing a dirty, scratched glass window pane with clear, brand-new plexiglass."
                        </div>
                        <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4">
                          <li>Micro-incision is made to access the clouded natural lens capsule.</li>
                          <li>Ultrasound vibrations dissolve the cloudy lens into liquid debris (vacuumed out).</li>
                          <li>A flexible, custom artificial lens is folded and slipped inside to unfold.</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Scans Comparison */}
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-l-4 border-sky-500 pl-3">Diagnostics: CT Scan vs. MRI Scans</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border border-slate-100 rounded-xl overflow-hidden">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                            <th className="p-3 text-left">Criteria</th>
                            <th className="p-3 text-left">CT Scan (Computed Tomography)</th>
                            <th className="p-3 text-left">MRI (Magnetic Resonance Imaging)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-600">
                          <tr>
                            <td className="p-3 font-semibold text-slate-950">Technology</td>
                            <td className="p-3">Rotational X-rays fired around the body.</td>
                            <td className="p-3">Powerful magnetic fields + radiofrequency waves.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-950">Radiation</td>
                            <td className="p-3 text-amber-700 font-medium">Yes (Ionizing radiation).</td>
                            <td className="p-3 text-emerald-700 font-medium">No radiation (magnetic resonance).</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-950">Scan Speed</td>
                            <td className="p-3">Extremely fast (1 - 5 minutes).</td>
                            <td className="p-3">Slower (20 - 60 minutes, requires staying still).</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-950">Clinical Scope</td>
                            <td className="p-3">Bones, lung pathology, acute trauma, stroke checks.</td>
                            <td className="p-3">Brain tumors, spinal cord, ligaments, joints, muscles.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-950">Analogy</td>
                            <td className="p-3 text-sky-900 italic">"Like taking X-rays of a loaf of bread slice-by-slice."</td>
                            <td className="p-3 text-sky-900 italic">"Like spinning water molecules and mapping their echo."</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 4. EPIDEMICS & CONTAGIOUS DISEASE OUTBREAKS */}
            {activeCategory === 'epidemics' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4">
                  <h2 className="text-xl font-extrabold text-teal-950">Epidemics & Contagious Disease Outbreak Guides</h2>
                  <p className="text-xs text-slate-400 mt-1">Evidence-based safety checksheets for contagious outbreaks and infection prevention protocols.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Disease Reference Panel */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-rose-950 uppercase tracking-wider font-mono">Outbreak Pathogen Index</h3>
                    
                    <div className="p-4 rounded-xl bg-rose-50/20 border border-rose-100 space-y-2.5">
                      <h4 className="font-extrabold text-rose-900 text-xs">Dengue Outbreaks (Vector-borne)</h4>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li><strong>Transmission:</strong> Mosquito bites (Aedes Aegypti).</li>
                        <li><strong>Incubation:</strong> 4 to 10 days post bite.</li>
                        <li><strong>Critical Warning:</strong> Platelet drop, nose/gum bleeding.</li>
                        <li><strong>Isolation:</strong> Keep under mosquito nets to prevent re-infection.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/20 border border-rose-100 space-y-2.5">
                      <h4 className="font-extrabold text-rose-900 text-xs">Respiratory Epidemics (COVID-19 / Influenza)</h4>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li><strong>Transmission:</strong> Airborne aerosol droplets.</li>
                        <li><strong>Incubation:</strong> 2 to 5 days.</li>
                        <li><strong>Critical Warning:</strong> Hypoxia (O2 drop), extreme shortness of breath.</li>
                        <li><strong>Isolation:</strong> Quarantine in single room with cross-ventilation.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Safety Checklists */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider font-mono">Epidemic Safety Checklist</h3>
                    
                    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                      <div className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800">Vector Eradication:</strong> Clear stagnant water in coolers, plant pots, and drains once a week to prevent larvae.
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800">Aerosol Defense:</strong> Wear certified N95 masks in public transport or clinic zones during active surges.
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800">Isolation Setup:</strong> Dedicate an independent bathroom and bedroom with sanitizer stations for symptomatic cases.
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800">Outbreak Triage:</strong> Seek immediate clinical review if oxygen saturation falls below 93% or if fever exceeds 103°F.
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 5. CHILD CARE BEST PRACTICES */}
            {activeCategory === 'child-care' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4">
                  <h2 className="text-xl font-extrabold text-teal-950">Child Care & Pediatric Encyclopedia</h2>
                  <p className="text-xs text-slate-400 mt-1">Pediatric safety guidelines, neonatal care essentials, and immunization timelines.</p>
                </div>

                <div className="space-y-6 text-xs text-slate-600">
                  <div className="p-5 rounded-2xl bg-amber-50/20 border border-amber-100 text-left space-y-3">
                    <h3 className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
                      <Baby className="w-5 h-5 text-amber-600" />
                      Neonatal Core Rules (0 - 3 Months)
                    </h3>
                    <p className="leading-relaxed">
                      Infantile care starts with maintaining proper thermo-regulation and feeding hygiene. Breastmilk provides essential antibodies. Always lay a newborn flat on their back on a firm mattress to sleep. Never place stuffed toys, heavy pillows, or thick blankets in the cot, as they block baby airways and increase SIDS (Sudden Infant Death Syndrome) risks.
                    </p>
                  </div>

                  {/* Vaccine Schedule */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">Standard Pediatric Immunization</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border border-slate-100 rounded-xl overflow-hidden">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                            <th className="p-2.5 text-left">Age Bracket</th>
                            <th className="p-2.5 text-left">Mandatory Vaccine</th>
                            <th className="p-2.5 text-left">Primary Protection</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          <tr>
                            <td className="p-2.5 font-bold text-slate-950">At Birth</td>
                            <td className="p-2.5">BCG, Oral Polio (OPV-0), Hep B (Birth dose)</td>
                            <td className="p-2.5">Tuberculosis, Polio, Hepatitis B infection</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-950">6 Weeks</td>
                            <td className="p-2.5">OPV-1, Pentavalent-1, Rotavirus-1, PCV-1</td>
                            <td className="p-2.5">Diphtheria, Pertussis, Tetanus, Pneumonia, Rotavirus</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-950">10 Weeks</td>
                            <td className="p-2.5">OPV-2, Pentavalent-2, Rotavirus-2</td>
                            <td className="p-2.5">Diphtheria, Pertussis, Tetanus, Rotavirus diarrhea</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-950">9 Months</td>
                            <td className="p-2.5">MR-1 (Measles-Rubella), PCV-Booster</td>
                            <td className="p-2.5">Measles, Rubella, Meningitis prevention</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fever Triage */}
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-950">
                    <h4 className="font-extrabold text-xs flex items-center gap-1.5 text-rose-900">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Critical Pediatric Fever Warnings
                    </h4>
                    <p className="mt-1.5 leading-relaxed">
                      For any infant under 3 months, a rectal or forehead temperature reading of <strong>100.4°F (38°C) or higher</strong> is a clinical emergency requiring immediate pediatrician visit. Do not self-prescribe paracetamol drops.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. DRUG CLINICAL & FIELD TRIALS */}
            {activeCategory === 'trials' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4">
                  <h2 className="text-xl font-extrabold text-teal-950">Drug Clinical Trials & Pipelines</h2>
                  <p className="text-xs text-slate-400 mt-1">Understanding the clinical research phases, placebo protocols, and ethical informed consent guidelines.</p>
                </div>

                <div className="space-y-5 text-xs text-slate-600">
                  <p className="leading-relaxed">
                    A clinical trial is a highly regulated scientific evaluation to confirm the safety and efficacy of novel therapeutic drugs in human subjects before public release.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="p-4 rounded-xl border border-slate-100 space-y-2.5 bg-slate-50/30">
                      <h4 className="font-extrabold text-slate-950 text-xs">Research Concept Glossary</h4>
                      <div className="space-y-2">
                        <p><strong>Placebo:</strong> An inert substance (e.g. sugar pill) formulated to look identical to the active drug, establishing a control baseline.</p>
                        <p><strong>Double-Blind Study:</strong> Neither the clinical volunteers nor the administering medical staff know who gets the active drug, neutralizing evaluation bias.</p>
                        <p><strong>Informed Consent:</strong> An ethical process confirming volunteers understand the timeline, risks, and side-effects before signing participation papers.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] font-mono">The Phase Pipelines</h4>
                      <div className="space-y-2.5">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 font-bold text-indigo-600">I</div>
                          <div><h5 className="font-bold text-slate-800 leading-tight">Phase I (Safety)</h5><p className="text-[11px] text-slate-500">20-80 healthy volunteers to establish dose tolerances and metabolics.</p></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 font-bold text-indigo-600">II</div>
                          <div><h5 className="font-bold text-slate-800 leading-tight">Phase II (Efficacy)</h5><p className="text-[11px] text-slate-500">100-300 patient volunteers to test if the drug treats the targeted condition.</p></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 font-bold text-indigo-600">III</div>
                          <div><h5 className="font-bold text-slate-800 leading-tight">Phase III (Efficacy & Safety)</h5><p className="text-[11px] text-slate-500">1,000-3,000 patient volunteers to monitor side effects vs. standard care.</p></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 font-bold text-indigo-600">IV</div>
                          <div><h5 className="font-bold text-slate-800 leading-tight">Phase IV (Post-Surveillance)</h5><p className="text-[11px] text-slate-500">Long-term tracking in public populations after regulatory clearances.</p></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 7. ALLERGIES & DRUG SENSITIVITY CHECKER */}
            {activeCategory === 'allergies' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4">
                  <h2 className="text-xl font-extrabold text-teal-950">Pharmaceutical Allergies & Sensitivity Checker</h2>
                  <p className="text-xs text-slate-400 mt-1">Review critical medicine triggers, symptoms of drug-induced allergies, and screen your risk indicators.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Interactive Screening Questionnaire */}
                  <div className="space-y-4 p-5 rounded-2xl bg-slate-50/20 border border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <UserCheck className="w-5 h-5 text-teal-600" />
                      Allergy Screening Questionnaire
                    </h3>
                    
                    {!showAllergyResult ? (
                      <div className="space-y-3.5 mt-2">
                        {allergyQuestions.map((q) => (
                          <div key={q.id} className="space-y-1 text-xs text-slate-700">
                            <p className="font-medium leading-relaxed">{q.text}</p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleAllergyToggle(q.id, true)}
                                className={`px-4 py-1.5 rounded-lg border font-bold text-[10px] uppercase font-mono cursor-pointer ${
                                  allergyAnswers[q.id] === true
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-white border-slate-200 text-slate-500'
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => handleAllergyToggle(q.id, false)}
                                className={`px-4 py-1.5 rounded-lg border font-bold text-[10px] uppercase font-mono cursor-pointer ${
                                  allergyAnswers[q.id] === false
                                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                                    : 'bg-white border-slate-200 text-slate-500'
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={checkAllergyRisk}
                          className="w-full mt-2 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider font-mono hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          Check Risk Score
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-2 text-xs">
                        <div className={`p-4 rounded-xl border ${
                          isHighAllergyRisk 
                            ? 'bg-rose-50 border-rose-100 text-rose-950'
                            : 'bg-emerald-50 border-emerald-100 text-emerald-950'
                        }`}>
                          <h4 className="font-extrabold text-sm mb-1.5 flex items-center gap-1.5">
                            {isHighAllergyRisk ? <AlertCircle className="w-5 h-5 text-rose-600" /> : <ShieldCheck className="w-5 h-5 text-emerald-600" />}
                            {isHighAllergyRisk ? 'Elevated Drug Sensitivity Warning' : 'No Immediate Sensitivity Flags'}
                          </h4>
                          <p className="leading-relaxed">
                            {isHighAllergyRisk 
                              ? 'You have flagged positive indicators for pharmaceutical allergies. Inform prescribing doctors before receiving antibiotics (penicillin) or NSAID anti-inflammatories.'
                              : 'Your screening does not show major systemic drug sensitivity indicators. However, new drug doses should always be initiated carefully.'}
                          </p>
                        </div>
                        <button
                          onClick={resetAllergyChecker}
                          className="w-full py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-slate-500 cursor-pointer"
                        >
                          Reset Screening
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Allergy Information */}
                  <div className="space-y-4 text-xs text-slate-600">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">Reaction Classification</h3>
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl border border-slate-100 space-y-1">
                        <h4 className="font-bold text-slate-800 leading-tight">Mild Reactions:</h4>
                        <p>Skin rashes, superficial hives, localized skin itching.</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-100 space-y-1">
                        <h4 className="font-bold text-slate-800 leading-tight">Moderate Reactions:</h4>
                        <p>Mild swelling of facial tissue, wheezing, mild chest congestion.</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/20 space-y-1">
                        <h4 className="font-bold text-rose-900 leading-tight">Emergency: Anaphylaxis</h4>
                        <p className="text-[11px] text-rose-950">Systemic vascular drop, severe throat swelling blocking respiration, fainting, collapsed circulation. Requires emergency Epinephrine shot and urgent hospital triage.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 8. BLOOD DONATION ENCYCLOPEDIA */}
            {activeCategory === 'blood-donation' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-teal-50 pb-4">
                  <h2 className="text-xl font-extrabold text-teal-950">Blood Donation & Compatibility Encyclopedia</h2>
                  <p className="text-xs text-slate-400 mt-1">Recipient-donor match matrices, donor eligibility rules, and extraction safety guidelines.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Interactive Compatibility Tool */}
                  <div className="space-y-4 p-5 rounded-2xl bg-teal-50/10 border border-teal-100/50">
                    <h3 className="text-sm font-extrabold text-teal-950 flex items-center gap-1.5">
                      <ArrowLeftRight className="w-5 h-5 text-teal-600" />
                      Blood Compatibility Finder
                    </h3>
                    
                    <div className="space-y-3 mt-2 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-600 uppercase tracking-wider text-[9px] font-mono">Select Blood Group:</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {bloodGroups.map((g) => (
                            <button
                              key={g}
                              onClick={() => setSelectedBloodGroup(g)}
                              className={`py-2 rounded-lg border font-bold text-[10px] uppercase font-mono transition-all cursor-pointer ${
                                selectedBloodGroup === g
                                  ? 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-100'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-teal-50 space-y-2 mt-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Can Donate To:</span>
                          <span className="font-bold text-red-600 font-mono">{compatibility.give}</span>
                        </div>
                        <hr className="border-teal-50" />
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Can Receive From:</span>
                          <span className="font-bold text-slate-800 font-mono">{compatibility.receive}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Donor Eligibility Rules */}
                  <div className="space-y-4 text-xs text-slate-600">
                    <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider font-mono">Donor Eligibility Criteria</h3>
                    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3.5">
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div><strong>Age Limits:</strong> Volunteer must be between 18 and 65 years of age.</div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div><strong>Weight Limit:</strong> Minimum weight of 50 kg (110 lbs) for whole blood donation.</div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div><strong>Frequency:</strong> Safe recovery window of 3 months for males and 4 months for females.</div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div><strong>Extraction Safety:</strong> All needles are single-use disposable, removing risk of bloodborne pathogen transmission.</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Standard Patient Safety Warning Disclaimer */}
          <div className="mt-8 pt-4 border-t border-slate-100 bg-slate-50 border border-slate-200/50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider font-mono mb-1">Standard Patient Safety Notice</p>
            <p className="text-[10px] leading-relaxed text-slate-500 font-mono">
              Disclaimer: This information is for educational purposes as a medical encyclopedia and does not constitute official medical advice. Please consult a licensed healthcare professional for medical concerns or treatments.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
