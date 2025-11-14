# Checkpoint 1: FormAI

## How it works:
1. User uploads a video
2. Body keypoints data and metrics extracted
3. Computations to analyze relative angles
4. Sends the results to LLM, good reps, bad reps, didnt hit depth, knees caving, etc
5. Here is a video demo of how the results are returned and sent to LLM. 
<img width="733" height="924" alt="image" src="https://github.com/user-attachments/assets/a6ec49f9-64db-405b-8361-cf9d39245f24" />


### Demo 1: Perfect Form Squats

**Input Data (sent to LLM):**
```
System Prompt: You are a professional strength coach analyzing squat form. Provide friendly, actionable feedback in 3-4 sentences. Focus on: 1) Overall form quality, 2) Main issues to fix, 3) Specific tips for improvement. Be encouraging but honest. Use simple language, not technical jargon.

User Prompt:
Squat Session Summary:
- Total Reps: 5
- Perfect Form: 5 reps
- Needs Work: 0 reps

Main Issues:
- None! All reps had good form.

Give encouraging feedback with specific tips to improve their squat form.
```

**Expected Output:**
```
Excellent work! All 5 reps showed perfect form with proper depth and knee tracking. Your consistency is impressive - you maintained hip depth below the knees and kept your knees at shoulder-width throughout every rep. Keep up this great technique and consider progressing to heavier weight or trying pause squats to build even more strength at the bottom position.
```

---

### Demo 2: Depth Issues

**Input Data (sent to LLM):**
```
System Prompt: You are a professional strength coach analyzing squat form. Provide friendly, actionable feedback in 3-4 sentences. Focus on: 1) Overall form quality, 2) Main issues to fix, 3) Specific tips for improvement. Be encouraging but honest. Use simple language, not technical jargon.

User Prompt:
Squat Session Summary:
- Total Reps: 6
- Perfect Form: 2 reps
- Needs Work: 4 reps

Main Issues:
- Depth Problems: 4 reps didn't reach proper depth (hips below knees)

Give encouraging feedback with specific tips to improve their squat form.
```

**Expected Output:**
```
Good effort on this set! You nailed 2 reps with perfect depth, but 4 reps were cut short. Your main focus should be getting your hips below your knees at the bottom - think "sitting back into a chair." Try practicing with a box or bench behind you to build confidence going lower, or reduce the weight slightly until you can consistently hit proper depth. Quality depth beats high reps every time!
```

---

### Demo 3: Knee Tracking Issues

**Input Data (sent to LLM):**
```
System Prompt: You are a professional strength coach analyzing squat form. Provide friendly, actionable feedback in 3-4 sentences. Focus on: 1) Overall form quality, 2) Main issues to fix, 3) Specific tips for improvement. Be encouraging but honest. Use simple language, not technical jargon.

User Prompt:
Squat Session Summary:
- Total Reps: 5
- Perfect Form: 1 reps
- Needs Work: 4 reps

Main Issues:
- Knee Tracking: 4 reps had knees too narrow (should be shoulder-width)

Give encouraging feedback with specific tips to improve their squat form.
```

**Expected Output:**
```
You're getting depth right, but watch those knees! In 4 out of 5 reps, your knees came too close together during the descent. Focus on pushing your knees out to track over your toes - they should stay at least shoulder-width apart throughout the entire movement. Try the "band around knees" cue to practice pushing out, or point your toes slightly outward to naturally widen your stance. This will protect your knees and make you stronger!
```

---

### Demo 4: Multiple Issues

**Input Data (sent to LLM):**
```
System Prompt: You are a professional strength coach analyzing squat form. Provide friendly, actionable feedback in 3-4 sentences. Focus on: 1) Overall form quality, 2) Main issues to fix, 3) Specific tips for improvement. Be encouraging but honest. Use simple language, not technical jargon.

User Prompt:
Squat Session Summary:
- Total Reps: 7
- Perfect Form: 1 reps
- Needs Work: 6 reps

Main Issues:
- Depth Problems: 3 reps didn't reach proper depth (hips below knees)
- Knee Tracking: 5 reps had knees too narrow (should be shoulder-width)

Give encouraging feedback with specific tips to improve their squat form.
```

**Expected Output:**
```
You've got some work to do, but that's okay - one perfect rep shows you can do it! Your two main issues are depth (3 reps too high) and knee tracking (5 reps with knees caving in). Start by focusing on knee position first - actively push your knees out to shoulder-width as you descend, which will naturally help you reach better depth. Practice with lighter weight or bodyweight squats, using a mirror to check your form. Fix these fundamentals and you'll be squatting like a pro in no time!
```

---

