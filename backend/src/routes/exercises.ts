import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

// GET user exercise history
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const { data, error } = await supabase
      .from('exercise_scores')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Sandbox Mock Fallback if database is not active
    const scores = data && data.length > 0 ? data : [
      { id: '1', game_type: 'memory', score: 85, xp_earned: 120, completed_at: new Date(Date.now() - 86400000).toISOString() },
      { id: '2', game_type: 'focus', score: 92, xp_earned: 140, completed_at: new Date(Date.now() - 172800000).toISOString() },
      { id: '3', game_type: 'reflex', score: 78, xp_earned: 100, completed_at: new Date(Date.now() - 259200000).toISOString() }
    ];

    res.json({ success: true, scores });
  } catch (err: any) {
    console.error('Fetch exercises error:', err);
    res.status(500).json({ error: 'Failed to retrieve exercise metrics' });
  }
});

// POST save a new brain exercise score
router.post('/log', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { game_type, score } = req.body;

  if (!game_type || score === undefined) {
    res.status(400).json({ error: 'Missing parameters game_type or score' });
    return;
  }

  // Calculate XP based on score (e.g., Score * 1.5 rounded)
  const xpEarned = Math.round(score * 1.5);

  try {
    let success = true;
    let savedScore = null;

    if (process.env.SUPABASE_URL) {
      // 1. Log score in Supabase
      const { data, error } = await supabase
        .from('exercise_scores')
        .insert({
          user_id: userId,
          game_type,
          score,
          xp_earned: xpEarned
        })
        .select()
        .single();

      if (error) throw error;
      savedScore = data;

      // 2. Perform streak calculation in profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_active_at, streak_count')
        .eq('id', userId)
        .single();

      if (profile) {
        const lastActive = new Date(profile.last_active_at);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastActive.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = profile.streak_count;
        if (diffDays <= 1) {
          // Keep/increment streak
          newStreak = profile.streak_count === 0 ? 1 : profile.streak_count;
        } else if (diffDays === 2) {
          // Increment streak
          newStreak = profile.streak_count + 1;
        } else {
          // Streak broken, reset
          newStreak = 1;
        }

        await supabase
          .from('profiles')
          .update({
            streak_count: newStreak,
            last_active_at: today.toISOString()
          })
          .eq('id', userId);
      }
    } else {
      // Sandbox fallback object
      savedScore = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: userId,
        game_type,
        score,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString()
      };
    }

    res.json({
      success: true,
      message: `Log created! Earned +${xpEarned} XP`,
      score: savedScore,
      xpEarned
    });
  } catch (err: any) {
    console.error('Log score error:', err);
    res.status(500).json({ error: 'Failed to register cognitive score' });
  }
});

export default router;
