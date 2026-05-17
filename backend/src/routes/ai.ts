import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { openai } from '../config/openai';

const router = Router();

// POST conversational portal with the AI Productivity Coach
router.post('/coach/chat', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Missing parameter messages or invalid array format' });
    return;
  }

  try {
    const isMock = process.env.OPENAI_API_KEY === undefined || process.env.OPENAI_API_KEY === 'mock-key';

    if (!isMock) {
      // Direct call to OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are the Mind Shaper premium AI Cognitive Productivity Coach. 
            Your role is to help the user optimize their daily habits, focus sessions, mood, and brain-training games. 
            Speak with an encouraging, highly professional, scientific, futuristic, and friendly tone. 
            Provide concrete, actionable scientific focus techniques (e.g., Ultra-diadian rhythms, Pomodoro cycles, NSDR, memory hacks, cognitive breathing exercises). 
            Keep replies moderately concise and clean. Use markdown bullet points.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const reply = response.choices[0].message.content;
      res.json({ success: true, reply });
    } else {
      // Sandbox Mock AI Coach responses
      const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let reply = '';

      if (lastUserMessage.includes('focus') || lastUserMessage.includes('pomodoro') || lastUserMessage.includes('study')) {
        reply = `### 🧠 Optimizing Your Focus Engine

To maximize your deep work cycles, I recommend implementing **Ultradian Rhythms**:
* **The Cycle**: Execute **90-minute focus blocks** followed by **15-20 minute mental rests** (complete disconnect - no screens, just walking or stretching).
* **Physiology**: Our brains operate on natural 90-minute cycles of cognitive alertness. Trying to push past this leads to a steep drop-off in neural performance.
* **Zen Action**: Toggle the **Deep Work Timer** on the **Focus Mode** page for a customized 50-minute block to build focus muscle!`;
      } else if (lastUserMessage.includes('habit') || lastUserMessage.includes('routine')) {
        reply = `### ⚡ The Science of Habit Stacking

Building sustainable neurological routines is simplified by **Habit Stacking**:
* **The Formula**: "After I [Established Habit], I will [New Positive Habit]."
* **Example**: "After I complete my morning espresso, I will complete **one memory matrix grid** on Mind Shaper."
* **Reward Mechanism**: Checking off habits on your **Habit Tracker** page activates the **dopaminergic reward pathway**, reinforcing neural links!`;
      } else if (lastUserMessage.includes('memory') || lastUserMessage.includes('game') || lastUserMessage.includes('score')) {
        reply = `### 🧬 Cognitive Neuroplasticity Hacks

To boost your scores in the **Memory Matrix** and **Focus Focus** games:
* **Attention Anchor**: Take three deep **physiological sighs** (double inhale through the nose, long extended exhale through the mouth) right before starting. This downregulates your sympathetic nervous system, lowering stress markers.
* **Frequency**: Neural pathways reinforce through short daily exposures rather than weekly marathons. Play **2-3 games daily** to secure XP streaks!`;
      } else {
        reply = `### 🌟 Welcome to Mind Shaper Neural Coaching!

I am your AI Cognitive Advisor. Here are a few things we can work on to sculpt your mind:
1. **Focus Optimization**: Discussing how to eliminate digital distractions and build deep work blocks.
2. **Streak Building**: Exploring psychological blocks to daily consistency.
3. **Neuroscience Frameworks**: Inquiring about sleep, hydration, and exercise guidelines that actively grow gray matter.

*What cognitive aspect would you like to level up today?*`;
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      res.json({ success: true, reply });
    }
  } catch (err: any) {
    console.error('AI Coach Chat Exception:', err);
    res.status(500).json({ error: 'Failed to communicate with AI Coach' });
  }
});

// GET daily neuroscience quote / motivation
router.get('/insights/daily', async (req, res) => {
  try {
    const insights = [
      {
        quote: "Neuroplasticity is not a capability reserved for youth; it is a lifetime subscription to structural adaptation.",
        author: "Dr. Andrew Huberman",
        category: "Neuroscience"
      },
      {
        quote: "Focus is a muscle, and deep work is the heavy lifting that strengthens its fibers.",
        author: "Cal Newport",
        category: "Productivity"
      },
      {
        quote: "Streaks represent small votes of confidence that accumulate into an identity.",
        author: "James Clear",
        category: "Habits"
      },
      {
        quote: "The brain adapts to what you feed it. Feed it focused blocks, and it will build worlds.",
        author: "Dr. Caroline Leaf",
        category: "Focus"
      }
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    res.json({ success: true, insight: randomInsight });
  } catch (err) {
    console.error('Fetch daily insight error:', err);
    res.status(500).json({ error: 'Failed to compile daily cognitive insights' });
  }
});

export default router;
