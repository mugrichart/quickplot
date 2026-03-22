export interface Character {
  id: string;
  name: string;
  color: string;
  initialFortune?: number;
  initialEvolution?: number;
  initialPlaceId?: string;
}

export interface Place {
  id: string;
  name: string;
  type: string;
  x: number; // 0-100
  y: number; // 0-100
  emoji: string;
}

export interface StoryEvent {
  id: string;
  label: string;
  summary?: string;
  timestamp: number;
  characterEvolution: Record<string, number>; // charId -> trait score (bad to good)
  characterFortunes: Record<string, number>; // charId -> fortune score (unlucky to lucky)
  occurrences: {
    good: number;
    bad: number;
  };
  characterLocations: Record<string, string>; // charId -> placeId
  placeStates: Record<string, string>; // placeId -> state label
  placeFortunes: Record<string, number>; // placeId -> status score (-100 to 100)
}

export interface StoryData {
  characters: Character[];
  places: Place[];
  events: StoryEvent[];
}
