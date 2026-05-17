import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

// GET all goals of the user
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    let goals = [];

    if (process.env.SUPABASE_URL) {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('target_date', { ascending: true });

      if (error) throw error;
      goals = data || [];
    } else {
      // Sandbox Mock Fallback
      goals = [
        { id: 'g1', title: 'Complete Memory Matrix Level 10', description: 'Train spatial memory grids', status: 'pending', xp_reward: 150, target_date: new Date(Date.now() + 86400000 * 3).toISOString() },
        { id: 'g2', title: 'Log 120 Deep Work Minutes', description: 'Maintain focused studying cycles', status: 'completed', xp_reward: 200, target_date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'g3', title: 'Achieve 7-day Habit Streak', description: 'Keep core routines active daily', status: 'pending', xp_reward: 250, target_date: new Date(Date.now() + 86400000 * 5).toISOString() }
      ];
    }

    res.json({ success: true, goals });
  } catch (err: any) {
    console.error('Fetch goals error:', err);
    res.status(500).json({ error: 'Failed to retrieve goals list' });
  }
});

// POST create a new goal
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { title, description, target_date, xp_reward } = req.body;

  if (!title || !target_date) {
    res.status(400).json({ error: 'Missing title or target_date parameter' });
    return;
  }

  try {
    let newGoal = null;

    if (process.env.SUPABASE_URL) {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          title,
          description: description || '',
          target_date: new Date(target_date).toISOString(),
          xp_reward: xp_reward || 150,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      newGoal = data;
    } else {
      newGoal = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description: description || '',
        status: 'pending',
        xp_reward: xp_reward || 150,
        target_date: new Date(target_date).toISOString(),
        created_at: new Date().toISOString()
      };
    }

    res.json({ success: true, goal: newGoal });
  } catch (err: any) {
    console.error('Create goal error:', err);
    res.status(500).json({ error: 'Failed to establish goal' });
  }
});

// POST toggle complete goal
router.post('/:id/complete', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const goalId = req.params.id;

  try {
    let updatedGoal = null;
    let earnedXp = 0;

    if (process.env.SUPABASE_URL) {
      // 1. Fetch current goal status
      const { data: goal, error: getError } = await supabase
        .from('goals')
        .select('*')
        .eq('id', goalId)
        .eq('user_id', userId)
        .single();

      if (getError) throw getError;
      if (!goal) {
        res.status(404).json({ error: 'Goal not found' });
        return;
      }

      const newStatus = goal.status === 'pending' ? 'completed' : 'pending';
      earnedXp = newStatus === 'completed' ? goal.xp_reward : -goal.xp_reward;

      // 2. Update status
      const { data, error: updateError } = await supabase
        .from('goals')
        .update({ status: newStatus })
        .eq('id', goalId)
        .select()
        .single();

      if (updateError) throw updateError;
      updatedGoal = data;

      // 3. Update profile total XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            xp: Math.max(0, profile.xp + earnedXp)
          })
          .eq('id', userId);
      }
    } else {
      // Sandbox fallback status toggle
      earnedXp = 150;
      updatedGoal = {
        id: goalId,
        title: 'Sandbox Goal Title',
        status: 'completed',
        xp_reward: 150,
        target_date: new Date().toISOString()
      };
    }

    res.json({
      success: true,
      goal: updatedGoal,
      message: earnedXp > 0 ? `Goal Completed! Earned +${earnedXp} XP` : `Goal marked as pending`,
      xpEarned: earnedXp
    });
  } catch (err: any) {
    console.error('Complete goal error:', err);
    res.status(500).json({ error: 'Failed to update goal completion' });
  }
});

// DELETE a goal
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const goalId = req.params.id;

  try {
    if (process.env.SUPABASE_URL) {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', userId);

      if (error) throw error;
    }

    res.json({ success: true, message: 'Goal removed successfully' });
  } catch (err: any) {
    console.error('Delete goal error:', err);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
