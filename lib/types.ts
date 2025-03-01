export interface Cat {
  id: string
  name: string
  breed: string
  age: number
  birthDate?: string
  imageUrl?: string
  specialNeeds: boolean
  notes?: string
  feedingSchedule?: string
  weights: Weight[]
  vetVisits: VetVisit[]
  vaccinations: Vaccination[]
}

export interface Weight {
  id: string
  value: number
  date: string
  notes?: string
}

export interface VetVisit {
  id: string
  date: string
  reason: string
  notes?: string
  vetName?: string
}

export interface Vaccination {
  id: string
  name: string
  date: string
  dueDate: string
  notes?: string
}

