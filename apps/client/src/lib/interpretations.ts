
export type RootType = 'fortune' | 'evolution' | 'place';
export type Lens = 'socio' | 'econo' | 'politico' | 'generic';

export interface Interpretation {
    label: string;
    examples: string[];
}

const roundTo5 = (val: number) => Math.round(val / 5) * 5;

const LEVELS: Record<string, any> = {
    fortune: {
        socio: {
            100: { label: "Universal Icon", examples: ["Reunited with lost family after decades"] },
            95: { label: "National Beloved", examples: ["Celebrated as a hero of the people"] },
            90: { label: "High Society Elite", examples: ["Inner circle of the most powerful families"] },
            85: { label: "Prominent Figure", examples: ["A widely respected voice in the community"] },
            80: { label: "Social Luminary", examples: ["Constant invitations to the highest circles"] },
            75: { label: "Well-Connected", examples: ["Most people in the city know your name"] },
            70: { label: "Highly Respected", examples: ["Significant influence in your social sphere"] },
            65: { label: "Respected", examples: ["Strong reputation among peers"] },
            60: { label: "Popular", examples: ["A wide circle of genuine friends"] },
            55: { label: "Liked", examples: ["Easy to find help when needed"] },
            50: { label: "Solid Status", examples: ["Stable and positive social life"] },
            45: { label: "Rising Reputation", examples: ["Gaining trust in new circles"] },
            40: { label: "Trustworthy", examples: ["Considered a reliable community member"] },
            35: { label: "Appreciated", examples: ["Small acts of kindness from neighbors"] },
            30: { label: "Well-Liked", examples: ["Pleasant social interactions are the norm"] },
            25: { label: "Positive Ties", examples: ["Forming meaningful new connections"] },
            20: { label: "Growing Network", examples: ["Expanding beyond immediate family"] },
            15: { label: "Friendly Presence", examples: ["Recognized as a pleasant person"] },
            10: { label: "Acknowledged", examples: ["Occasional social recognition"] },
            5: { label: "Politely Received", examples: ["Small, positive social exchanges"] },
            0: { label: "Average Citizen", examples: ["Ordinary social life with typical ups and downs"] },
            "-5": { label: "Social Friction", examples: ["A minor misunderstanding with a colleague"] },
            "-10": { label: "Abridged Trust", examples: ["Someone starts questioning your motives"] },
            "-15": { label: "Minor Gaffe", examples: ["An embarrassing public moment"] },
            "-20": { label: "Social Chill", examples: ["Friends seem slightly more distant"] },
            "-25": { label: "Reputational Dent", examples: ["A small rumor begins to circulate"] },
            "-30": { label: "Discordant", examples: ["Active disagreement with a close group"] },
            "-35": { label: "Questionable", examples: ["Distrust from those who don't know you well"] },
            "-40": { label: "Disliked", examples: ["General coldness from the community"] },
            "-45": { label: "Shunned", examples: ["Exclude from a local gathering or event"] },
            "-50": { label: "Social Crisis", examples: ["A major scandal breaks out"] },
            "-55": { label: "Ostracized", examples: ["Actively ignored by former friends"] },
            "-60": { label: "Infamous", examples: ["Widely known for a negative reason"] },
            "-65": { label: "Vilified", examples: ["Publicly criticized in local circles"] },
            "-70": { label: "Outcast", examples: ["Forced to leave your social community"] },
            "-75": { label: "Social Pariah", examples: ["Disowned by family and friends"] },
            "-80": { label: "Excommunicated", examples: ["Formally removed from all social structures"] },
            "-85": { label: "Public Enemy", examples: ["The community actively works against you"] },
            "-90": { label: "Erased from Memory", examples: ["Old friends no longer speak your name"] },
            "-95": { label: "Socially Dead", examples: ["Absolute isolation from all human contact"] },
            "-100": { label: "Damnatio Memoriae", examples: ["Your history is systematically destroyed"] }
        },
        econo: {
            100: { label: "Rockefeller Elite", examples: ["Unlimited wealth and global financial control"] },
            95: { label: "Industrial Titan", examples: ["Owning major conglomerates and industries"] },
            90: { label: "Ultra-High Net Worth", examples: ["Multi-billionaire with immense resources"] },
            85: { label: "Economic Powerhouse", examples: ["Massive influence on market trends"] },
            80: { label: "Extremely Wealthy", examples: ["Luxury is your everyday reality"] },
            75: { label: "Captain of Industry", examples: ["CEO of a highly profitable corporation"] },
            70: { label: "Vastly Prosperous", examples: ["Significant assets and growing investments"] },
            65: { label: "Very Wealthy", examples: ["Financial freedom to pursue any project"] },
            60: { label: "Affluent", examples: ["High standard of living and security"] },
            55: { label: "Wealthy Professional", examples: ["Top-tier income and substantial savings"] },
            50: { label: "Prosperous", examples: ["Comfortable life with plenty of luxury"] },
            45: { label: "Strongly Secure", examples: ["Diversified assets and no financial worry"] },
            40: { label: "Well-Off", examples: ["Can afford significant high-end purchases"] },
            35: { label: "Economically Solid", examples: ["Reliable and growing net worth"] },
            30: { label: "Comfortable", examples: ["Steady savings and good quality of life"] },
            25: { label: "Financially Stable", examples: ["No debt and a healthy emergency fund"] },
            20: { label: "Decent Savings", examples: ["A few months of expenses put away"] },
            15: { label: "Moderate Buffer", examples: ["Surplus cash after all bills are paid"] },
            10: { label: "Positive Cashflow", examples: ["Small but steady increase in wealth"] },
            5: { label: "Minor Gain", examples: ["Finding a small amount of extra money"] },
            0: { label: "Baseline", examples: ["Living paycheck to paycheck; breaking even"] },
            "-5": { label: "Tight Budget", examples: ["Carefully counting every penny"] },
            "-10": { label: "Minor Debt", examples: ["Credit card balance starting to grow"] },
            "-15": { label: "Financial Strain", examples: ["Struggling to meet unexpected costs"] },
            "-20": { label: "Stressed Resources", examples: ["Cutting back on essential items"] },
            "-25": { label: "Significant Debt", examples: ["Interest rates are eating into income"] },
            "-30": { label: "Economic Hardship", examples: ["Unable to pay some monthly bills"] },
            "-35": { label: "Asset Liquidating", examples: ["Selling belongings to stay afloat"] },
            "-40": { label: "Impoverished", examples: ["Lacking reliable access to basics"] },
            "-45": { label: "Severe Debt", examples: ["Collections agencies are calling daily"] },
            "-50": { label: "Economic Crisis", examples: ["Loss of primary source of income"] },
            "-55": { label: "Deep Poverty", examples: ["Constant struggle for food and shelter"] },
            "-60": { label: "Destitute", examples: ["No assets and no income"] },
            "-65": { label: "Homelessness", examples: ["Lacking a safe place to live"] },
            "-70": { label: "Insolvent", examples: ["Liabilities far exceed all possible assets"] },
            "-75": { label: "Economic Ruin", examples: ["Total loss of all financial standing"] },
            "-80": { label: "Crushing Debt", examples: ["Debt that can never be repaid in a lifetime"] },
            "-85": { label: "Vagrant Existence", examples: ["Surviving on scraps and charity"] },
            "-90": { label: "Bankrupt & Discarded", examples: ["Legally and socially forgotten by markets"] },
            "-95": { label: "Starvation Level", examples: ["Inability to secure life-sustaining resources"] },
            "-100": { label: "Total Annihilation", examples: ["Beyond bankruptcy; negative existence"] }
        },
        politico: {
            100: { label: "Universal Sovereign", examples: ["Absolute ruler of the known world"] },
            95: { label: "Global Hegemon", examples: ["Leader of a massive superpower"] },
            90: { label: "King / President", examples: ["Ultimate executive authority of a nation"] },
            85: { label: "Supreme Minister", examples: ["Architect of national policy"] },
            80: { label: "High Governor", examples: ["Ruling over a massive and wealthy region"] },
            75: { label: "State Player", examples: ["A key figure in national decision-making"] },
            70: { label: "Senator / Peer", examples: ["High-level legislative influence"] },
            65: { label: "Regional Leader", examples: ["Controlling the fate of millions"] },
            60: { label: "Influential Official", examples: ["Department head with significant reach"] },
            55: { label: "Political Strategist", examples: ["Designing the wins for top leaders"] },
            50: { label: "Local Authority", examples: ["Mayor or leader of a major city"] },
            45: { label: "Respected Delegate", examples: ["Representing a significant constituency"] },
            40: { label: "Bureaucratic Power", examples: ["Controlling key administrative gates"] },
            35: { label: "Civil Leader", examples: ["Head of a powerful advocacy group"] },
            30: { label: "Council Member", examples: ["A voice in town management"] },
            25: { label: "Minor Official", examples: ["Starting to have a say in local rules"] },
            20: { label: "Political Voice", examples: ["Recognized advocate for community issues"] },
            15: { label: "Engaged Citizen", examples: ["Active participant in local governance"] },
            10: { label: "Minor Influence", examples: ["Voted and attended a town hall"] },
            5: { label: "Political Awareness", examples: ["Keeping informed on local changes"] },
            0: { label: "Powerless", examples: ["No influence over laws or governance"] },
            "-5": { label: "Muted Voice", examples: ["Opinions ignored by local boards"] },
            "-10": { label: "Bureaucratic Friction", examples: ["Applications or permits always delayed"] },
            "-15": { label: "Minor Harassment", examples: ["Targeted by low-level regulations"] },
            "-20": { label: "Under Watch", examples: ["Marked as a person of minor interest"] },
            "-25": { label: "Rights Restricted", examples: ["Loss of some minor civil liberties"] },
            "-30": { label: "Political Outsider", examples: ["Barred from certain public forums"] },
            "-35": { label: "Silenced", examples: ["Threats of legal action for speaking out"] },
            "-40": { label: "Oppressed", examples: ["Systematically denied basic rights"] },
            "-45": { label: "Disenfranchised", examples: ["Complete loss of voting and legal standing"] },
            "-50": { label: "Political Crisis", examples: ["Labeled as a dissident or rebel"] },
            "-55": { label: "Targeted", examples: ["Active state efforts to suppress your actions"] },
            "-60": { label: "Persecuted", examples: ["Living in fear of state retribution"] },
            "-65": { label: "Fugitive", examples: ["Evading capture by state forces"] },
            "-70": { label: "Political Prisoner", examples: ["Incarcerated for beliefs or influence"] },
            "-75": { label: "Exiled", examples: ["Banished from your home nation forever"] },
            "-80": { label: "State Enemy #1", examples: ["The primary target of national security"] },
            "-85": { label: "Condemned", examples: ["Sentenced to ultimate state punishment"] },
            "-90": { label: "Non-Person", examples: ["Legal identity completely stripped away"] },
            "-95": { label: "Terminated Status", examples: ["Ordered to be removed from existence"] },
            "-100": { label: "Historical Erasure", examples: ["All records of your life are systematically purged"] }
        },
        generic: {
            100: { label: "Divine Miracle", examples: ["Surviving an impossible situation unscathed"] },
            80: { label: "Master Stroke", examples: ["A sequence of perfect coincidences"] },
            60: { label: "Windfall", examples: ["Unexpected major good news or opportunity"] },
            40: { label: "Lucky Break", examples: ["Right place, right time"] },
            20: { label: "Good Omen", examples: ["Small positive turn of events"] },
            0: { label: "Neutral Path", examples: ["Events unfolding as expected"] },
            "-20": { label: "Bad Luck", examples: ["Minor inconveniences piling up"] },
            "-40": { label: "Hardship", examples: ["Losing something valuable or failing a goal"] },
            "-60": { label: "Cursed", examples: ["Everything that can go wrong, does"] },
            "-80": { label: "Devastation", examples: ["Total loss of external well-being"] },
            "-100": { label: "Catastrophe", examples: ["Absolute rock bottom of external life"] }
        }
    },
    evolution: {
        socio: {
            100: { label: "Saintly Altruism", examples: ["Total moral clarity and self-sacrifice for others"] },
            80: { label: "Perfect Empathy", examples: ["Deeply feeling the pain of even your enemies"] },
            60: { label: "Loyal Guardian", examples: ["Steadfast commitment to protecting those in need"] },
            40: { label: "Meaningful Bounds", examples: ["Building deep, honest relationships for the first time"] },
            20: { label: "Kindling Bond", examples: ["A small spark of trust toward a new person"] },
            0: { label: "Pragmatic Neutrality", examples: ["Socializing out of habit rather than connection"] },
            "-20": { label: "Social Isolation", examples: ["Withdrawing into a shell of self-pity"] },
            "-40": { label: "Betrayal", examples: ["Choosing one's own safety over a friend"] },
            "-60": { label: "Cold Calculation", examples: ["Viewing people as mere pawns in a personal game"] },
            "-80": { label: "Misanthropy", examples: ["Active hatred and disgust toward human connection"] },
            "-100": { label: "Soul Dead", examples: ["Total abandonment of empathy and growth"] }
        },
        econo: {
            100: { label: "Nirvana of Non-Attachment", examples: ["Absolute freedom from the desire for possessions"] },
            80: { label: "Philanthropic Spirit", examples: ["Using every resource to lift others out of misery"] },
            60: { label: "Prudent Steward", examples: ["Managing wealth with wisdom and integrity"] },
            40: { label: "Aspirational Honest", examples: ["Resisting the urge to cheat for a small gain"] },
            20: { label: "Material Awakening", examples: ["Recognizing that things don't bring happiness"] },
            0: { label: "Consumerist Routine", examples: ["Acquiring goods to fill a baseline comfort"] },
            "-20": { label: "Material Envy", examples: ["Focusing on what others have rather than your path"] },
            "-40": { label: "Greed Manifest", examples: ["Taking more than your fair share at another's cost"] },
            "-60": { label: "Hoarder's Panic", examples: ["Obsessed with the fear of losing small assets"] },
            "-80": { label: "Unbridled Avarice", examples: ["Writ of sale for your own soul for a few coins"] },
            "-100": { label: "Infinite Greed", examples: ["Total corruption through the love of money"] }
        },
        politico: {
            100: { label: "Enlightened Servant", examples: ["Absolute power used solely for the greater good"] },
            80: { label: "Incorruptible Leader", examples: ["Standing firm against a sea of bribes and threats"] },
            60: { label: "Principled Reformer", examples: ["Working from within to fix a broken system"] },
            40: { label: "Responsibility Seek", examples: ["Taking the blame when a team fails"] },
            20: { label: "Civic Awareness", examples: ["Recognizing your role in the larger community"] },
            0: { label: "Apolitical Drifter", examples: ["Following commands without questioning authority"] },
            "-20": { label: "Status Seeking", examples: ["Performing good acts only for the recognition"] },
            "-40": { label: "Power Drunk", examples: ["Commanding others simply because you can"] },
            "-60": { label: "Corruption's Path", examples: ["Sacrificing truth to maintain your position"] },
            "-80": { label: "Tyrant in Waiting", examples: ["Viewing all dissent as a personal attack to be crushed"] },
            "-100": { label: "Absolute Tyranny", examples: ["Total corruption of the soul through absolute power"] }
        },
        generic: {
            100: { label: "Saintly Enlightenment", examples: ["Total moral clarity and self-sacrifice"] },
            80: { label: "Transcendence", examples: ["Overcoming your deepest flaws entirely"] },
            60: { label: "Heroic Growth", examples: ["Significant positive change in character"] },
            40: { label: "New Perspective", examples: ["Learning from mistakes and improving"] },
            20: { label: "Small Realization", examples: ["A minor moment of self-correction"] },
            0: { label: "Status Quo", examples: ["Maintaining current moral compass"] },
            "-20": { label: "Compromise", examples: ["Briefly betraying your own values"] },
            "-40": { label: "Regression", examples: ["Falling back into old, harmful habits"] },
            "-60": { label: "Moral Decay", examples: ["Significant loss of inner integrity"] },
            "-80": { label: "Depravity", examples: ["Succumbing to dark impulses"] },
            "-100": { label: "Soul Dead", examples: ["Total abandonment of empathy and growth"] }
        }
    },
    place: {
        100: { label: "Eternal Utopia", examples: ["A place of perfect peace and abundance"] },
        90: { label: "Radiant Haven", examples: ["Inspiring beauty and total safety"] },
        80: { label: "Golden Era", examples: ["Peak prosperity and cultural height"] },
        70: { label: "Lush Prosperity", examples: ["Abundant resources and happy people"] },
        60: { label: "Thriving Hub", examples: ["Safe, clean, and rapidly growing"] },
        50: { label: "Resilient Sector", examples: ["Strong community and reliable systems"] },
        40: { label: "Sturdy Community", examples: ["Well-maintained and functional"] },
        30: { label: "Active Locale", examples: ["Growing moderately with minor issues"] },
        20: { label: "Active Town", examples: ["Typical signs of life and growth"] },
        10: { label: "Modest Setting", examples: ["Decent functionality but plain"] },
        0: { label: "Stable Setting", examples: ["Neither booming nor decaying"] },
        "-10": { label: "Faded Glory", examples: ["Slightly dusty and outvoted"] },
        "-20": { label: "Diminished", examples: ["Signs of neglect starting to show"] },
        "-30": { label: "Neglected", examples: ["Streets are quiet and dark"] },
        "-40": { label: "Decaying", examples: ["Crumbling infrastructure and gloom"] },
        "-50": { label: "Dangerous Slum", examples: ["High crime and failing services"] },
        "-60": { label: "Ruined", examples: ["Major damage and abandoned sectors"] },
        "-70": { label: "Hazard Zone", examples: ["Environmental or social danger is high"] },
        "-80": { label: "Desolate Wasteland", examples: ["Uninhabitable and dangerous"] },
        "-90": { label: "Cursed Remnant", examples: ["Unnatural phenomena and total decay"] },
        "-100": { label: "Abyssal Void", examples: ["Erased from the world entirely"] }
    }
};

const DELTAS: Record<string, any> = {
    fortune: {
        socio: {
            100: { label: "Total Redemption", examples: ["Universal pardon and restoration of all family ties"] },
            50: { label: "Social Resurrection", examples: ["Sudden redemption after a massive scandal"] },
            25: { label: "Popularity Surge", examples: ["A heroic act makes you the talk of the town"] },
            10: { label: "Leveling Up", examples: ["Gaining entry to a new social tier"] },
            "-10": { label: "Noticeable Snub", examples: ["Being ignored by a key contact"] },
            "-50": { label: "Exile", examples: ["Total rejection by your core circle"] }
        },
        econo: {
            100: { label: "Jackpot", examples: ["A multi-generational wealth transfer or discovery"] },
            50: { label: "Financial Relaunch", examples: ["Instant wealth from a massive inheritance"] },
            25: { label: "Asset Boom", examples: ["Investment pays off significantly"] },
            10: { label: "Healthy Gain", examples: ["Promotion or new business success"] },
            "-10": { label: "Budget Cut", examples: ["Significant tightening of belts"] },
            "-50": { label: "Total Loss", examples: ["Complete bankruptcy in a single moment"] }
        },
        politico: {
            100: { label: "Coronated", examples: ["Achieving absolute supreme power instantly"] },
            50: { label: "Ascension", examples: ["Appointed to a high-ranking state office"] },
            25: { label: "Power Grab", examples: ["Successfully taking control of a department"] },
            10: { label: "Influential Step", examples: ["Passing a key piece of legislation"] },
            "-10": { label: "Demotion", examples: ["Relieved of some responsibilities"] },
            "-50": { label: "Coup", examples: ["Stripped of all power by enemies"] }
        },
        generic: {
            50: { label: "Miraculous Turn", examples: ["Disaster avoided at the last second"] },
            10: { label: "Good Break", examples: ["A helpful coincidence"] },
            "-10": { label: "Unlucky Turn", examples: ["A small piece of bad news"] },
            "-50": { label: "Sudden Crisis", examples: ["Unexpected disaster strikes"] }
        }
    },
    evolution: {
        socio: {
            50: { label: "Empathic Awakening", examples: ["A profound reconciliation with an enemy"] },
            10: { label: "Growing Trust", examples: ["Deciding to rely on someone else"] },
            "-10": { label: "Closed Heart", examples: ["Shutting someone out over a minor slight"] },
            "-50": { label: "Core Betrayal", examples: ["Destroying a lifelong bond for personal gain"] }
        },
        econo: {
            50: { label: "Vow of Poverty", examples: ["Renouncing all possessions for a higher cause"] },
            10: { label: "Generous Act", examples: ["Giving when it's not convenient"] },
            "-10": { label: "Stingy Impulse", examples: ["Refusing to share a surplus with someone in need"] },
            "-50": { label: "Soul for Gold", examples: ["Selling out your principles for a major profit"] }
        },
        politico: {
            50: { label: "Selfless Sacrifice", examples: ["Giving up power to ensure others are heard"] },
            10: { label: "Integrity Test", examples: ["Rejecting a minor bribe"] },
            "-10": { label: "Petty Tyranny", examples: ["Using influence to silence a small voice"] },
            "-50": { label: "Descent into Corruption", examples: ["Taking the first major bribe that changes everything"] }
        },
        generic: {
            50: { label: "Enlightenment", examples: ["A total shift in core values"] },
            10: { label: "Lesson Learned", examples: ["Gaining a new understanding"] },
            "-10": { label: "Moral Slip", examples: ["Giving in to a minor temptation"] },
            "-50": { label: "Soul Fracture", examples: ["Betraying who you are completely"] }
        }
    },
    place: {
        100: { label: "Paradise Found", examples: ["Transformation of a ruin into a world wonder"] },
        50: { label: "Revitalization", examples: ["Massive influx of resources and care"] },
        10: { label: "Cleanup", examples: ["Restoring a local landmark"] },
        "-10": { label: "Vandalism", examples: ["Minor damage to the environment"] },
        "-50": { label: "Sacking", examples: ["Raided and major structures destroyed"] },
        "-100": { label: "Annihilation", examples: ["A place being removed from the map entirely"] }
    }
};

export function getLevelInterpretation(root: RootType, level: number, lens: Lens = 'generic'): Interpretation {
    const rounded = roundTo5(level);
    
    let catLevels: Record<number, Interpretation>;
    if (root === 'place') {
        catLevels = LEVELS.place;
    } else {
        catLevels = LEVELS[root][lens] || LEVELS[root].generic;
    }
    
    const definedLevels = Object.keys(catLevels).map(Number).sort((a, b) => Math.abs(a - rounded) - Math.abs(b - rounded));
    const nearest = definedLevels[0];
    
    return catLevels[nearest] || { label: "Unknown", examples: ["..."] };
}

export function getDeltaInterpretation(root: RootType, delta: number, lens: Lens = 'generic'): Interpretation {
    const rounded = roundTo5(delta);
    
    if (rounded === 0) return { label: "No Change", examples: ["Steady state maintained"] };

    let catDeltas: Record<number, Interpretation>;
    if (root === 'place') {
        catDeltas = DELTAS.place;
    } else {
        catDeltas = DELTAS[root][lens] || DELTAS[root].generic;
    }

    const definedDeltas = Object.keys(catDeltas).map(Number).sort((a, b) => Math.abs(a - rounded) - Math.abs(b - rounded));
    const nearest = definedDeltas[0];

    return catDeltas[nearest] || { label: delta > 0 ? "Improvement" : "Setback", examples: ["..."] };
}
