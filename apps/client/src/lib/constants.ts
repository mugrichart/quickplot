
import { 
    getLevelInterpretation, 
    getDeltaInterpretation, 
    RootType,
    Lens,
    Interpretation
} from './interpretations';

export const storySteps = {
    heroJourney: [
        10, // The Ordinary World
        25, // Call to Adventure
        20, // Refusal of the Call
        35, // Meeting the Mentor
        50, // Crossing the First Threshold
        55, // Tests, Allies, Enemies
        65, // Approach to the Inmost Cave
        30, // Ordeal (major setback)
        75, // Reward (Seizing the Sword)
        60, // The Road Back
        90, // Resurrection
        100 // Return with the Elixir
    ]
}

export const heroJourneyDetails = [
    { name: "The Ordinary World", description: "The hero is introduced in their normal life." },
    { name: "Call to Adventure", description: "A challenge or quest is presented to the hero." },
    { name: "Refusal of the Call", description: "The hero hesitates or refuses due to fear or insecurity." },
    { name: "Meeting the Mentor", description: "The hero meets someone who gives them guidance or training." },
    { name: "Crossing the First Threshold", description: "The hero commits to the quest and enters the special world." },
    { name: "Tests, Allies, Enemies", description: "The hero faces trials, makes friends, and encounters foes." },
    { name: "Approach to the Inmost Cave", description: "The hero prepares for the deepest challenge." },
    { name: "Ordeal (major setback)", description: "The hero confronts their greatest fear or a major obstacle." },
    { name: "Reward (Seizing the Sword)", description: "The hero gains the treasure, knowledge, or power." },
    { name: "The Road Back", description: "The hero begins the journey back to the ordinary world." },
    { name: "Resurrection", description: "The final, most dangerous test where the hero is reborn." },
    { name: "Return with the Elixir", description: "The hero returns home altered, bringing a boon to their world." }
]

export interface InterpretationDetails {
    label: string;
    examples: string[];
}

export function getFortuneInterpretation(level: number, lens: Lens = 'generic'): InterpretationDetails {
    const inter = getLevelInterpretation('fortune', level, lens);
    return {
        label: inter.label,
        examples: inter.examples
    };
}

export function getEvolutionInterpretation(level: number, lens: Lens = 'generic'): InterpretationDetails {
    const inter = getLevelInterpretation('evolution', level, lens);
    return {
        label: inter.label,
        examples: inter.examples
    };
}

export function getPlaceAuraInterpretation(level: number): InterpretationDetails {
    const inter = getLevelInterpretation('place', level);
    return {
        label: inter.label,
        examples: inter.examples
    };
}

export {
    getLevelInterpretation,
    getDeltaInterpretation,
    type RootType,
    type Lens,
    type Interpretation
};


