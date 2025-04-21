import { EventEmitter } from 'events';

// Créer une instance singleton de l'EventEmitter
const appEvents = new EventEmitter();

// Définir des constantes pour les événements
export const EVENTS = {
  FAVORITES_UPDATED: 'favorites_updated',
};

export default appEvents;