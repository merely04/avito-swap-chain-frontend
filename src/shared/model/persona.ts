import { create } from 'zustand'

/** Демо-персона: за кого сейчас смотрят сервис. */
export interface Persona {
  id: string
  name: string
  rating: number
}

/**
 * Все трое — участники первой цепочки, поэтому один и тот же обмен виден тремя парами глаз:
 * кто-то ещё думает, кто-то уже подтвердил. Реестр лежит в shared, потому что его читают
 * и мок-api в entities, и переключатель в features — а entities о features знать не могут.
 */
export const PERSONAS: Persona[] = [
  { id: 'u1', name: 'Даша', rating: 4.8 },
  { id: 'u2', name: 'Марк', rating: 4.9 },
  { id: 'u3', name: 'Лена', rating: 4.7 },
]

interface PersonaState {
  personaId: string
  setPersonaId: (id: string) => void
}

/** Кто сейчас «я». В бою здесь была бы сессия авторизации, в демо — выбор персоны. */
export const usePersonaStore = create<PersonaState>()((set) => ({
  personaId: PERSONAS[0].id,
  setPersonaId: (personaId) => set({ personaId }),
}))

/** Текущая персона вне React — мок-api это обычные функции, а не хуки. */
export const currentPersonaId = (): string => usePersonaStore.getState().personaId
