export interface Profile {
  id: string
  username: string
  bites: number
  bites_per_second: number
  prestige_level: number
  total_clicks: number
  lifetime_bites: number
  rank: number
  last_active: string
  created_at: string
}

export interface Upgrade {
  id: number
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  base_cost: number
  cost_multiplier: number
  production: number
  glow_color: string
  icon: string
  unlock_level: number
}

export interface PlayerUpgrade {
  id: number
  player_id: string
  upgrade_id: number
  quantity: number
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  requirement_type: 'clicks' | 'lifetime_bites' | 'upgrades' | 'prestige' | 'bps'
  requirement_value: number
  reward_bites: number
}

export interface PlayerAchievement {
  id: number
  player_id: string
  achievement_id: number
  unlocked_at: string
}

export interface LeaderboardEntry extends Profile {
  position: number
}

export type GameScreen = 'home' | 'shop' | 'leaderboard' | 'profile' | 'achievements'

export const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: 'bg-emerald-950/30', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  uncommon: { bg: 'bg-cyan-950/30', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  rare: { bg: 'bg-fuchsia-950/30', border: 'border-fuchsia-500/50', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/20' },
  epic: { bg: 'bg-amber-950/30', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  legendary: { bg: 'bg-rose-950/30', border: 'border-rose-500/50', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
}
