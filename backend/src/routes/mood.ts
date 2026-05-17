import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

// GET user mood history
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    let moods = [];

    if (process.env.SUPABASE_URL) {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      moods = data || [];
    } else {
      // Sandbox Mock Fallback
      moods = [
        { id: 'm1', mood_score: 4, note: 'Had a highly productive focus session!', logged_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
        { id: 'm2', mood_score: 3, note: 'Slightly tired, but maintained my morning habits.', logged_date: new Date(Date.now() - 172800000).toISOString().split('T')[0] },
        { id: 'm3', mood_score: 5, note: 'Unlocked neural architect milestone! Excellent focus.', logged_date: new Date(Date.now() - 259200000).toISOString().split('T')[0] }
      ];
    }

    res.json({ success: true, moods });
  } catch (err: any) {
    console.error('Fetch mood error:', err);
    res.status(500).json({ error: 'Failed to retrieve mood history logs' });
  }
});

// POST submit a new mood check-in
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { mood_score, note } = req.body;

  if (mood_score === undefined || mood_score < 1 || mood_score > 5) {
    res.status(400).json({ error: 'Invalid or missing mood_score. Must be between 1 and 5' });
    return;
  }

  try {
    let newLog = null;

    if (process.env.SUPABASE_URL) {
      const today = new Date().toISOString().split('T')[0];

      // Check if logged already today, update if exists, or insert new
      const { data: existing, error: checkError } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('logged_date', today)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // Update today's log
        const { data, error } = await supabase
          .from('mood_logs')
          .update({ mood_score, note: note || '' })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        newLog = data;
      } else {
        // Insert new log
        const { data, error } = await supabase
          .from('mood_logs')
          .insert({
            user_id: userId,
            mood_score,
            note: note || '',
            logged_date: today
          })
          .select()
          .single();

        if (error) throw error;
        newLog = data;
      }
    } else {
      newLog = {
        id: Math.random().toString(36).substr(2, 9),
        mood_score,
        note: note || '',
        logged_date: new Date().toISOString().split('T')[0]
      };
    }

    res.json({ success: true, mood: newLog, message: 'Mood recorded successfully!' });
  } catch (err: any) {
    console.error('Create mood log error:', err);
    res.status(500).json({ error: 'Failed to complete mood check-in' });
  }
});

// DELETE a mood log
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const logId = req.params.id;

  try {
    if (process.env.SUPABASE_URL) {
      const { error } = await supabase
        .from('mood_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);

      if (error) throw error;
    }

    res.json({ success: true, message: 'Mood log removed' });
  } catch (err: any) {
    console.error('Delete mood log error:', err);
    res.status(500).json({ error: 'Failed to delete mood history point' });
  }
});

export default router;
