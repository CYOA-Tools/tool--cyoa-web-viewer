// @ts-nocheck
import { writable } from "svelte/store";

/**
 * writable store for handling a string variable.
 * @type {import(‘svelte/store’).Writable<any>
 */
export const Choices = writable({
  points: [], // [200, 3]
  selections: {
    // SELECTION_TYPE = uniqueOnce
    // "Character Archetype": "Human Guy" - choicesUnique, maxChoices = 1
    // SELECTION_TYPE = uniqueMulti
    // "Allies": ["Dave", "Bob", "Jim"] - choicesUnique, maxChoices = 3
    // SELECTION_TYPE = multi
    // "Items": { "potion": 2, "shield": 1} - !choicesUnique
  },
  effects: {
    // "Origin": "Origoth - the Cave City" - uniqueString
    // "Allies": [{ "quantity": 1, "name": "Dave", "desc": "..."}, {...}] - list
    // "Items": [{ "quantity": 1, "name": "item", "desc": "..."}] - list
  },
  playerImage: false // or URL
});

export const ChoiceDefault = {
  points: [],
  selections:{},
  effects: {},
  playerImage: false
}

export const SELECTION_TYPE = Object.freeze({
  uniqueOnce: "uniqueOnce",
  uniqueMulti: "uniqueMulti",
  multi: "multi",
});
export const EFFECT_TYPE = Object.freeze({
  uniqueString: "uniqueString",
  list: "list",
});
