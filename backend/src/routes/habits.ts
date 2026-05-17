import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

// GET all habits of the user with today's completion logs
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    let habits: any[] = [];

    if (process.env.SUPABASE_URL) {
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);

      if (habitsError) throw habitsError;
      habits = habitsData || [];

      // Fetch today's completions
      const habitIds = habits.map(h => h.id);
      if (habitIds.length > 0) {
        const { data: logsData, error: logsError } = await supabase
          .from('habit_logs')
          .select('habit_id')
          .in('habit_id', habitIds)
          .eq('completed_date', today);

        if (logsError) throw logsError;

        const completedSet = new Set(logsData?.map(l => l.habit_id) || []);
        habits = habits.map(h => ({
          ...h,
          completedToday: completedSet.has(h.id)
        }));
      }
    } else {
      // Sandbox Mock Fallback
      habits = [
        { id: 'h1', name: 'Morning Meditation', category: 'mindfulness', frequency: 'daily', streak: 4, completedToday: true },
        { id: 'h2', name: 'Read 10 Pages', category: 'learning', frequency: 'daily', streak: 2, completedToday: false },
        { id: 'h3', name: 'Drink 3L Water', category: 'health', frequency: 'daily', streak: 12, completedToday: true },
        { id: 'h4', name: 'Stretching Routine', category: 'exercise', frequency: 'daily', streak: 0, completedToday: false }
      ];
    }

    res.json({ success: true, habits });
  } catch (err: any) {
    console.error('Fetch habits error:', err);
    res.status(500).json({ error: 'Failed to retrieve habits' });
  }
});

// POST create a new habit
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, category, frequency } = req.body;

  if (!name || !category) {
    res.status(400).json({ error: 'Missing name or category parameters' });
    return;
  }

  try {
    let newHabit = null;

    if (process.env.SUPABASE_URL) {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: userId,
          name,
          category,
          frequency: frequency || 'daily',
          streak: 0
        })
        .select()
        .single();

      if (error) throw error;
      newHabit = { ...data, completedToday: false };
    } else {
      newHabit = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        category,
        frequency: frequency || 'daily',
        streak: 0,
        completedToday: false
      };
    }

    res.json({ success: true, habit: newHabit });
  } catch (err: any) {
    console.error('Create habit error:', err);
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

// DELETE a habit
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const habitId = req.params.id;

  try {
    if (process.env.SUPABASE_URL) {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', userId);

      if (error) throw error;
    }

    res.json({ success: true, message: 'Habit deleted successfully' });
  } catch (err: any) {
    console.error('Delete habit error:', err);
    res.status(500).json({ error: 'Failed to remove habit' });
  }
});

// POST toggle habit completion status for today
router.post('/:id/toggle', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const habitId = req.params.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    let completedToday = false;
    let newStreak = 0;
    const habitXpReward = 50;

    if (process.env.SUPABASE_URL) {
      // Check if logged already
      const { data: existingLog, error: checkError } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .eq('completed_date', today)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLog) {
        // Toggle off: Delete log and decrement streak
        await supabase
          .from('habit_logs')
          .delete()
          .eq('id', existingLog.id);

        const { data: habit } = await supabase
          .from('habits')
          .select('streak')
          .eq('id', habitId)
          .single();

        newStreak = habit ? Math.max(0, habit.streak - 1) : 0;
        await supabase
          .from('habits')
          .update({ streak: newStreak })
          .eq('id', habitId);

        // Deduct XP
        await supabase
          .from('profiles')
          .update({
            xp: supabase.rpc('decrement', { x: habitXpReward }) // Safe or raw update
          } as any)
          .eq('id', userId);

        completedToday = false;
      } else {
        // Toggle on: Insert log and increment streak
        await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            completed_date: today
          });

        const { data: habit } = await supabase
          .from('habits')
          .select('streak')
          .eq('id', habitId)
          .single();

        newStreak = habit ? habit.streak + 1 : 1;
        await supabase
          .from('habits')
          .update({
            streak: newStreak,
            last_completed_at: new Date().toISOString()
          })
          .eq('id', habitId);

        // Award +50 XP
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', userId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              xp: profile.xp + habitXpReward
            })
            .eq('id', userId);
        }

        completedToday = true;
      }
    } else {
      // Sandbox sandbox random toggle logic
      completedToday = Math.random() > 0.5;
      newStreak = Math.floor(Math.random() * 10);
    }

    res.json({
      success: true,
      completedToday,
      streak: newStreak,
      xpEarned: completedToday ? habitXpReward : -habitXpReward
    });
  } catch (err: any) {
    console.error('Toggle habit error:', err);
    res.status(500).json({ error: 'Failed to record habit completion' });
  }
});

export default router;
