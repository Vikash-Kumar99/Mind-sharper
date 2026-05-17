import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

// GET user gamification profile stats
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    let profile = null;

    if (process.env.SUPABASE_URL) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      profile = data;

      // If profile doesn't exist yet, insert a default profile
      if (!profile && userId) {
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: `neural_shaper_${Math.floor(Math.random() * 10000)}`,
            full_name: 'Mind Voyager',
            xp: 150,
            level: 1,
            streak_count: 1
          })
          .select()
          .single();

        if (insertError) throw insertError;
        profile = inserted;
      }
    }

    // Sandboxed/Standard Profile values
    const currentProfile = profile || {
      id: userId || '00000000-0000-0000-0000-000000000000',
      username: 'neon_shaper_404',
      full_name: 'Neural Wanderer (Sandbox)',
      avatar_url: '',
      xp: 1450,
      level: 2,
      streak_count: 5,
      last_active_at: new Date().toISOString()
    };

    // Calculate progression details
    const currentXp = currentProfile.xp;
    const currentLevel = currentProfile.level;
    const xpInCurrentLevel = currentXp % 1000;
    const xpNeededForNextLevel = 1000;
    const levelProgressPercentage = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);

    res.json({
      success: true,
      profile: {
        ...currentProfile,
        xpInCurrentLevel,
        xpNeededForNextLevel,
        levelProgressPercentage
      }
    });
  } catch (err: any) {
    console.error('Fetch gamification profile error:', err);
    res.status(500).json({ error: 'Failed to retrieve profile progress' });
  }
});

// GET global leaderboard lists
router.get('/leaderboard', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let leaderboard: any[] = [];

    if (process.env.SUPABASE_URL) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, xp, level, streak_count')
        .order('xp', { ascending: false })
        .limit(10);

      if (error) throw error;
      leaderboard = data || [];
    }

    if (leaderboard.length === 0) {
      // Sandbox Mock Fallback Leaderboard
      leaderboard = [
        { id: '1', username: 'neuro_master', full_name: 'Diana Prince', xp: 9420, level: 10, streak_count: 15 },
        { id: '2', username: 'focus_titan', full_name: 'Bruce Wayne', xp: 8150, level: 9, streak_count: 12 },
        { id: '3', username: 'quantum_leap', full_name: 'Barry Allen', xp: 5200, level: 6, streak_count: 8 },
        { id: '4', username: 'zen_garden', full_name: 'Arthur Curry', xp: 4800, level: 5, streak_count: 6 },
        { id: '5', username: 'cyber_sage', full_name: 'Victor Stone', xp: 3200, level: 4, streak_count: 5 },
        { id: '6', username: 'mind_rider', full_name: 'Hal Jordan', xp: 2900, level: 3, streak_count: 4 },
        { id: '7', username: 'neon_shaper_404', full_name: 'Neural Wanderer (You)', xp: 1450, level: 2, streak_count: 5 }
      ];
    }

    res.json({ success: true, leaderboard });
  } catch (err: any) {
    console.error('Fetch leaderboard error:', err);
    res.status(500).json({ error: 'Failed to retrieve leaderboard rankings' });
  }
});

// GET achievements lists & user unlocks
router.get('/achievements', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    let achievements = [];
    let unlockedIds: string[] = [];

    if (process.env.SUPABASE_URL) {
      // Get all achievements
      const { data: allAchievements, error: allErr } = await supabase
        .from('achievements')
        .select('*');

      if (allErr) throw allErr;
      achievements = allAchievements || [];

      // Get user's unlocked achievements
      const { data: unlocked, error: unlockErr } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      if (unlockErr) throw unlockErr;
      unlockedIds = unlocked?.map(u => u.achievement_id) || [];
    } else {
      // Sandbox Mock Fallback
      achievements = [
        { id: 'a1', title: 'First Light', description: 'Log your first brain training score', icon_key: 'sparkles', xp_reward: 100 },
        { id: 'a2', title: 'Focus Master', description: 'Complete a deep work focus session of 25 minutes or more', icon_key: 'zap', xp_reward: 200 },
        { id: 'a3', title: 'Iron Will', description: 'Maintain a brain training streak of 5 active daily logs', icon_key: 'flame', xp_reward: 300 },
        { id: 'a4', title: 'Mind Architect', description: 'Accumulate 2,000 Total XP across games and habits', icon_key: 'brain', xp_reward: 500 },
        { id: 'a5', title: 'Inner Zen', description: 'Log your mood 3 days in a row to establish mindful awareness', icon_key: 'heart', xp_reward: 150 }
      ];
      // Simulate that "First Light" and "Focus Master" are unlocked
      unlockedIds = ['a1', 'a2'];
    }

    const mappedAchievements = achievements.map(ach => ({
      ...ach,
      unlocked: unlockedIds.includes(ach.id)
    }));

    res.json({ success: true, achievements: mappedAchievements });
  } catch (err: any) {
    console.error('Fetch achievements error:', err);
    res.status(500).json({ error: 'Failed to retrieve achievements log' });
  }
});

export default router;
