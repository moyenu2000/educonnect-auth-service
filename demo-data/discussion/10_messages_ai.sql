-- =====================================================
-- DISCUSSION SERVICE - Messages and AI Interactions
-- =====================================================
-- Conversations, messages, and AI query data

-- Insert conversations for private messaging
INSERT INTO discussion.conversations (last_message_id, unread_count, created_at, updated_at) VALUES
(NULL, 0, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 hour'),
(NULL, 1, NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 hours'),
(NULL, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '30 minutes'),
(NULL, 0, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
(NULL, 3, NOW() - INTERVAL '2 days', NOW() - INTERVAL '45 minutes'),
(NULL, 0, NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 hours'),
(NULL, 1, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '15 minutes');

-- Insert conversation participants
INSERT INTO discussion.conversation_participants (conversation_id, user_id) VALUES
-- Conversation 1: Alex and Prof Williams (math help)
(1, 12), (1, 4),
-- Conversation 2: Emily and Dr Patel (biology research)
(2, 15), (2, 7),
-- Conversation 3: James and Prof Garcia (programming guidance)
(3, 35), (3, 8),
-- Conversation 4: Study group coordination (Sarah, Lisa, Anna)
(4, 16), (4, 18), (4, 20),
-- Conversation 5: International students (Raj, Yuki, Ahmed)
(5, 24), (5, 25), (5, 26),
-- Conversation 6: Tom seeking help from Alex
(6, 21), (6, 12),
-- Conversation 7: Class 10 students planning study session
(7, 27), (7, 28);

-- Insert detailed messages
INSERT INTO discussion.messages (content, type, sender_id, recipient_id, conversation_id, is_read, created_at, updated_at) VALUES

-- ========== CONVERSATION 1: ALEX & PROF WILLIAMS (MATH HELP) ==========
('Hi Professor Williams! I''m preparing for the mathematics olympiad and struggling with some advanced algebra problems. Could you guide me on the best approach for solving systems of non-linear equations?', 'TEXT', 12, 4, 1, true, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),
('Hello Alex! I''d be happy to help. For non-linear systems, start with substitution method when possible. Are you working with specific types like quadratic-linear systems?', 'TEXT', 4, 12, 1, true, NOW() - INTERVAL '2 weeks 30 minutes', NOW() - INTERVAL '2 weeks 30 minutes'),
('Yes, exactly! I have problems like x² + y² = 25 and y = 2x + 1. I can substitute but the algebra gets messy quickly.', 'TEXT', 12, 4, 1, true, NOW() - INTERVAL '2 weeks 1 hour', NOW() - INTERVAL '2 weeks 1 hour'),
('Perfect example! Substitute y = 2x + 1 into the first equation: x² + (2x + 1)² = 25. Expand: x² + 4x² + 4x + 1 = 25. This gives you 5x² + 4x - 24 = 0. Use the quadratic formula from there.', 'TEXT', 4, 12, 1, true, NOW() - INTERVAL '2 weeks 1 hour 30 minutes', NOW() - INTERVAL '2 weeks 1 hour 30 minutes'),
('That makes so much sense! Thank you Professor. Would you recommend any specific olympiad preparation books?', 'TEXT', 12, 4, 1, true, NOW() - INTERVAL '2 weeks 2 hours', NOW() - INTERVAL '2 weeks 2 hours'),
('For olympiad level, I recommend "Problem-Solving Strategies" by Arthur Engel and "The Art and Craft of Problem Solving" by Paul Zeitz. Both have excellent non-linear systems chapters.', 'TEXT', 4, 12, 1, true, NOW() - INTERVAL '2 weeks 2 hours 30 minutes', NOW() - INTERVAL '2 weeks 2 hours 30 minutes'),
('Professor, I''ve been working through those books. Could we discuss some complex number applications in geometry sometime this week?', 'TEXT', 12, 4, 1, true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),

-- ========== CONVERSATION 2: EMILY & DR PATEL (BIOLOGY RESEARCH) ==========
('Dr. Patel, I''m fascinated by your research in molecular biology. I''m considering pursuing biotechnology after Class 12. Could you tell me about current research trends?', 'TEXT', 15, 7, 2, true, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('Emily, it''s wonderful to see students interested in research! CRISPR gene editing, personalized medicine, and synthetic biology are the hottest areas right now. What specifically interests you?', 'TEXT', 7, 15, 2, true, NOW() - INTERVAL '1 week 30 minutes', NOW() - INTERVAL '1 week 30 minutes'),
('I''m particularly drawn to genetic engineering for treating diseases. The idea of editing genes to cure genetic disorders seems revolutionary!', 'TEXT', 15, 7, 2, true, NOW() - INTERVAL '1 week 1 hour', NOW() - INTERVAL '1 week 1 hour'),
('Absolutely! We''re seeing incredible progress in treating sickle cell anemia and muscular dystrophy using CRISPR. However, ethical considerations are equally important. Are you familiar with the ethical debates?', 'TEXT', 7, 15, 2, true, NOW() - INTERVAL '1 week 1 hour 30 minutes', NOW() - INTERVAL '1 week 1 hour 30 minutes'),
('Yes, I''ve read about the germline editing controversies. It''s a complex balance between potential benefits and unknown risks for future generations.', 'TEXT', 15, 7, 2, true, NOW() - INTERVAL '1 week 2 hours', NOW() - INTERVAL '1 week 2 hours'),
('Excellent perspective! For undergraduate preparation, focus strongly on molecular biology, biochemistry, and bioethics. I can recommend some summer research programs if you''re interested.', 'TEXT', 7, 15, 2, true, NOW() - INTERVAL '1 week 2 hours 30 minutes', NOW() - INTERVAL '1 week 2 hours 30 minutes'),
('That would be amazing! I''d love to get hands-on research experience.', 'TEXT', 15, 7, 2, false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),

-- ========== CONVERSATION 3: JAMES & PROF GARCIA (PROGRAMMING) ==========
('Professor Garcia, I''m working on a data structures project and hitting a wall with implementing efficient search algorithms. Could you point me in the right direction?', 'TEXT', 35, 8, 3, true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('Of course, James! What type of data are you searching through, and what are your efficiency requirements? Are you looking at linear search, binary search, or something more advanced?', 'TEXT', 8, 35, 3, true, NOW() - INTERVAL '5 days 30 minutes', NOW() - INTERVAL '5 days 30 minutes'),
('I''m working with a large dataset of student records (around 50,000 entries) and need to search by multiple criteria - ID, name, grade, etc. Linear search is too slow.', 'TEXT', 35, 8, 3, true, NOW() - INTERVAL '5 days 1 hour', NOW() - INTERVAL '5 days 1 hour'),
('For multiple search criteria, consider using hash tables for each search field. Create separate hash maps for ID, name, and grade lookups. This gives you O(1) average case performance.', 'TEXT', 8, 35, 3, true, NOW() - INTERVAL '5 days 1 hour 30 minutes', NOW() - INTERVAL '5 days 1 hour 30 minutes'),
('That''s brilliant! I was thinking about binary search trees but hash tables make more sense for this use case. What about memory efficiency?', 'TEXT', 35, 8, 3, true, NOW() - INTERVAL '5 days 2 hours', NOW() - INTERVAL '5 days 2 hours'),
('Good question! Hash tables do use more memory, but for 50K records, it''s manageable. If memory is a concern, consider using a single B-tree with composite keys or implement indexing strategies.', 'TEXT', 8, 35, 3, true, NOW() - INTERVAL '5 days 2 hours 30 minutes', NOW() - INTERVAL '5 days 2 hours 30 minutes'),
('I''ve implemented the hash table approach and it''s working great! Search time went from 5 seconds to milliseconds. Thank you for the guidance!', 'TEXT', 35, 8, 3, false, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),

-- ========== CONVERSATION 4: STUDY GROUP COORDINATION ==========
('Hey everyone! Should we meet this weekend to prepare for the biology exam? I think we need to focus on the circulatory system chapter.', 'TEXT', 16, NULL, 4, true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('Great idea Sarah! I''m free on Saturday afternoon. Should we meet at the library or someone''s place?', 'TEXT', 18, NULL, 4, true, NOW() - INTERVAL '3 days 30 minutes', NOW() - INTERVAL '3 days 30 minutes'),
('Library works for me too! I can bring my anatomy diagrams and we can go through the heart structure together.', 'TEXT', 20, NULL, 4, true, NOW() - INTERVAL '3 days 1 hour', NOW() - INTERVAL '3 days 1 hour'),
('Perfect! Let''s meet at the library study room B-12 at 2 PM on Saturday. I''ll reserve it and bring some practice questions.', 'TEXT', 16, NULL, 4, true, NOW() - INTERVAL '3 days 1 hour 30 minutes', NOW() - INTERVAL '3 days 1 hour 30 minutes'),
('Count me in! I''ll bring snacks and my notes on blood circulation. This is going to be a productive session!', 'TEXT', 18, NULL, 4, true, NOW() - INTERVAL '3 days 2 hours', NOW() - INTERVAL '3 days 2 hours'),

-- ========== CONVERSATION 5: INTERNATIONAL STUDENTS ==========
('Hi everyone! How are you all adapting to the education system here? I''m finding the grading system quite different from what I''m used to in India.', 'TEXT', 24, NULL, 5, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('I totally understand, Raj! Coming from Japan, the classroom participation expectations are very different. Students here are much more vocal during discussions.', 'TEXT', 25, NULL, 5, true, NOW() - INTERVAL '2 days 30 minutes', NOW() - INTERVAL '2 days 30 minutes'),
('Same here! In my country, we rarely questioned teachers directly, but here it''s encouraged. It took me time to feel comfortable speaking up in class.', 'TEXT', 26, NULL, 5, true, NOW() - INTERVAL '2 days 1 hour', NOW() - INTERVAL '2 days 1 hour'),
('The group work culture is also different. Back home, most studying was individual, but here collaborative learning is emphasized so much more.', 'TEXT', 24, NULL, 5, true, NOW() - INTERVAL '2 days 1 hour 30 minutes', NOW() - INTERVAL '2 days 1 hour 30 minutes'),
('Yes! And the practical application focus is stronger too. We''re always asked "how would you use this in real life?" which I really appreciate.', 'TEXT', 25, NULL, 5, true, NOW() - INTERVAL '2 days 2 hours', NOW() - INTERVAL '2 days 2 hours'),
('Should we start a study group for international students? We could help each other adapt while sharing our different educational perspectives.', 'TEXT', 26, NULL, 5, false, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),

-- ========== CONVERSATION 6: TOM SEEKING HELP ==========
('Hi Alex, I hope you don''t mind me reaching out. I''ve been struggling with mathematics and saw how well you explain things in the discussion groups. Could you help me with some basic algebra?', 'TEXT', 21, 12, 6, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('Of course, Tom! I''d be happy to help. What specific topics are giving you trouble? Don''t worry, we all start somewhere and algebra can be tricky at first.', 'TEXT', 12, 21, 6, true, NOW() - INTERVAL '1 day 30 minutes', NOW() - INTERVAL '1 day 30 minutes'),
('I''m having a hard time with solving linear equations, especially when there are variables on both sides. I get confused about which operations to do first.', 'TEXT', 21, 12, 6, true, NOW() - INTERVAL '1 day 1 hour', NOW() - INTERVAL '1 day 1 hour'),
('That''s a common challenge! The key is to think of it like balancing a scale. Whatever you do to one side, you must do to the other. Let''s work through an example: 3x + 5 = 2x + 11', 'TEXT', 12, 21, 6, true, NOW() - INTERVAL '1 day 1 hour 30 minutes', NOW() - INTERVAL '1 day 1 hour 30 minutes'),
('OK, so I need to get all the x terms on one side and all the numbers on the other?', 'TEXT', 21, 12, 6, true, NOW() - INTERVAL '1 day 2 hours', NOW() - INTERVAL '1 day 2 hours'),
('Exactly! Subtract 2x from both sides: 3x - 2x + 5 = 2x - 2x + 11, which gives you x + 5 = 11. Then subtract 5 from both sides: x = 6. Always check by substituting back!', 'TEXT', 12, 21, 6, true, NOW() - INTERVAL '1 day 2 hours 30 minutes', NOW() - INTERVAL '1 day 2 hours 30 minutes'),
('That makes so much more sense when you explain it step by step! Thank you Alex, you''re a great teacher.', 'TEXT', 21, 12, 6, true, NOW() - INTERVAL '1 day 3 hours', NOW() - INTERVAL '1 day 3 hours'),

-- ========== CONVERSATION 7: CLASS 10 STUDENTS ==========
('Emma, are you ready for tomorrow''s English literature test? I''m nervous about the poetry analysis section.', 'TEXT', 27, 28, 7, true, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
('I''m feeling okay about it, but those metaphor and symbolism questions always trip me up. Want to do a quick review together?', 'TEXT', 28, 27, 7, true, NOW() - INTERVAL '12 hours 30 minutes', NOW() - INTERVAL '12 hours 30 minutes'),
('Yes please! I have the study guide with practice questions. Should we meet at the cafeteria before first period?', 'TEXT', 27, 28, 7, false, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes');

-- Update conversation last_message_id and unread counts
UPDATE discussion.conversations SET 
    last_message_id = (SELECT MAX(id) FROM discussion.messages WHERE conversation_id = conversations.id),
    unread_count = (SELECT COUNT(*) FROM discussion.messages WHERE conversation_id = conversations.id AND is_read = false);

-- Insert comprehensive AI queries showing diverse learning scenarios
INSERT INTO discussion.ai_queries (question, answer, type, subject_id, topic_id, context, confidence, user_id, created_at) VALUES

-- ========== MATHEMATICS AI QUERIES ==========
('Explain the concept of derivatives and how they relate to rates of change', 'A derivative represents the instantaneous rate of change of a function at a specific point. Imagine you''re driving a car - your speedometer shows your derivative (rate of change of position). 

**Mathematical Definition**: The derivative of f(x) is the limit of [f(x+h) - f(x)]/h as h approaches 0.

**Geometric Interpretation**: The derivative at a point equals the slope of the tangent line to the function at that point.

**Real-world Applications**:
- Velocity is the derivative of position
- Acceleration is the derivative of velocity  
- Marginal cost in economics
- Population growth rates in biology

**Basic Rules**:
- Power rule: d/dx(x^n) = nx^(n-1)
- Sum rule: d/dx(f+g) = f'' + g''
- Product rule: d/dx(fg) = f''g + fg''

The derivative is fundamental to calculus and helps us understand how quantities change!', 'CONCEPT', 1, 4, 'Student exploring calculus concepts for advanced mathematics', 0.97, 12, NOW() - INTERVAL '3 days'),

('How do I solve systems of linear equations with three variables?', 'Great question! Systems with three variables can be solved using several methods:

**Method 1: Substitution**
1. Solve one equation for one variable
2. Substitute into the other equations
3. Solve the resulting 2-variable system
4. Back-substitute to find all variables

**Method 2: Elimination** 
1. Eliminate one variable from two pairs of equations
2. Solve the resulting 2-variable system
3. Back-substitute

**Method 3: Matrix Methods (Advanced)**
- Use Gaussian elimination or Cramer''s rule

**Example**: 
x + y + z = 6
2x - y + z = 3  
x + 2y - z = 1

From equation 1: z = 6 - x - y
Substitute into equations 2 and 3, then solve!

**Tip**: Always check your solution by substituting back into all original equations.', 'PROBLEM', 1, 3, 'Student working on algebra homework involving three-variable systems', 0.94, 16, NOW() - INTERVAL '5 days'),

-- ========== PHYSICS AI QUERIES ==========
('What is quantum mechanics and why is it important?', 'Quantum mechanics is the branch of physics that describes the behavior of matter and energy at the atomic and subatomic level. Here''s why it''s revolutionary:

**Key Principles**:
1. **Wave-Particle Duality**: Particles can behave like waves and vice versa
2. **Uncertainty Principle**: You can''t know both position and momentum precisely
3. **Superposition**: Particles can exist in multiple states simultaneously
4. **Entanglement**: Particles can be mysteriously connected across distances

**Why It Matters**:
- **Technology**: Lasers, MRI machines, computer chips, LED lights
- **Medicine**: PET scans, radiation therapy
- **Computing**: Quantum computers promise revolutionary processing power
- **Energy**: Solar cells, nuclear power

**Mind-Bending Facts**:
- Electrons "tunnel" through barriers they shouldn''t be able to cross
- Quantum effects only emerge at incredibly small scales
- Einstein called entanglement "spooky action at a distance"

**Modern Applications**: Quantum cryptography, quantum computing, quantum sensors

While counterintuitive, quantum mechanics is one of the most successful theories in physics!', 'CONCEPT', 2, NULL, 'Curious student exploring advanced physics concepts', 0.96, 14, NOW() - INTERVAL '1 week'),

('Explain electromagnetic induction with practical examples', 'Electromagnetic induction is the process where a changing magnetic field creates an electric current. It''s one of the most important discoveries in physics!

**Faraday''s Law**: The induced EMF equals the negative rate of change of magnetic flux.

**Lenz''s Law**: The induced current opposes the change that created it.

**Practical Examples**:

1. **Electric Generators**: Spinning magnets near coils generate electricity in power plants
2. **Transformers**: Change voltage levels in power distribution
3. **Induction Cooking**: Magnetic fields heat metal cookware directly
4. **Wireless Charging**: Magnetic fields transfer energy to phones/cars
5. **Electric Motors**: Reverse of generators - electricity creates motion
6. **Magnetic Levitation Trains**: Induced currents create levitation forces

**Simple Experiment**: Drop a magnet through a copper tube - it falls slowly due to induced currents creating opposing magnetic fields!

**Applications in Daily Life**:
- Car alternators charge batteries
- Credit card readers
- Metal detectors at airports
- Electric guitar pickups

This principle literally powers our modern world!', 'EXPLANATION', 2, 4, 'Student seeking real-world physics applications', 0.98, 25, NOW() - INTERVAL '4 days'),

-- ========== CHEMISTRY AI QUERIES ==========
('How do I balance complex chemical equations?', 'Balancing chemical equations is like solving a puzzle! Here''s a systematic approach:

**Step-by-Step Method**:

1. **Write the unbalanced equation**
   Example: C₄H₁₀ + O₂ → CO₂ + H₂O

2. **Count atoms of each element**
   Left: C=4, H=10, O=2
   Right: C=1, H=2, O=3

3. **Balance the most complex molecule first**
   Start with C₄H₁₀ (already coefficient 1)

4. **Balance carbon**: Need 4 CO₂
   C₄H₁₀ + O₂ → 4CO₂ + H₂O

5. **Balance hydrogen**: Need 5 H₂O  
   C₄H₁₀ + O₂ → 4CO₂ + 5H₂O

6. **Balance oxygen**: Count right side: 4(2) + 5(1) = 13 O atoms
   Need 13/2 = 6.5 O₂ molecules

7. **Clear fractions**: Multiply everything by 2
   **Final**: 2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O

**Pro Tips**:
- Balance metals first, then non-metals, then oxygen and hydrogen last
- Use fractions if needed, then multiply to clear them
- Check your work by counting atoms on both sides
- For redox reactions, balance charge as well as atoms', 'PROBLEM', 3, 10, 'Student struggling with stoichiometry homework', 0.95, 15, NOW() - INTERVAL '2 days'),

-- ========== BIOLOGY AI QUERIES ==========
('What is the difference between mitosis and meiosis?', 'Excellent question! Mitosis and meiosis are both cell division processes but serve very different purposes:

**MITOSIS** (Growth & Repair):
- **Purpose**: Growth, repair, asexual reproduction
- **Result**: 2 identical diploid cells (2n)
- **Chromosome number**: Stays the same as parent
- **Genetic variation**: None - exact copies
- **Where**: Body (somatic) cells
- **Frequency**: Continuous throughout life

**MEIOSIS** (Sexual Reproduction):
- **Purpose**: Produce gametes (sex cells)
- **Result**: 4 genetically different haploid cells (n)  
- **Chromosome number**: Reduced by half
- **Genetic variation**: High due to crossing over and independent assortment
- **Where**: Reproductive organs only
- **Frequency**: Only during gamete formation

**Key Differences**:
1. **DNA replication**: Once in mitosis, once in meiosis (but two divisions)
2. **Crossing over**: Doesn''t occur in mitosis, crucial in meiosis
3. **Chromosome pairing**: No pairing in mitosis, homologs pair in meiosis

**Memory trick**: 
- **Mitosis** = "Mighty identical" (exact copies)
- **Meiosis** = "Mix it up" (genetic diversity)

Both are essential for life - mitosis for growth, meiosis for reproduction!', 'CONCEPT', 4, 6, 'Student preparing for biology exam on cell division', 0.97, 18, NOW() - INTERVAL '6 days'),

-- ========== COMPUTER SCIENCE AI QUERIES ==========
('Explain object-oriented programming concepts with examples', 'Object-Oriented Programming (OOP) is a programming paradigm that organizes code around objects rather than functions. Here are the core concepts:

**1. CLASSES & OBJECTS**
- **Class**: Blueprint/template (like a cookie cutter)
- **Object**: Instance of a class (like the actual cookie)

```python
class Car:
    def __init__(self, brand, color):
        self.brand = brand
        self.color = color
    
    def start_engine(self):
        print(f"The {self.color} {self.brand} engine is starting!")

my_car = Car("Toyota", "red")  # Object creation
```

**2. ENCAPSULATION**
- Bundling data and methods together
- Hiding internal details (private variables)
- Controlled access through methods

**3. INHERITANCE**
- Child classes inherit from parent classes
- Promotes code reuse

```python
class SportsCar(Car):  # Inherits from Car
    def turbo_boost(self):
        print("Turbo activated!")
```

**4. POLYMORPHISM**
- Same interface, different implementations
- Method overriding and overloading

**Benefits**:
- Code reusability
- Easier maintenance
- Better organization
- Real-world modeling

**Real Example**: Video game characters - each has properties (health, speed) and behaviors (move, attack), but different types implement them differently!', 'CONCEPT', 15, 6, 'Programming student learning OOP fundamentals', 0.96, 35, NOW() - INTERVAL '1 week'),

-- ========== STUDY STRATEGIES ==========
('How can I improve my memory for studying?', 'Great question! Memory improvement is a skill that can be developed with the right techniques:

**ACTIVE LEARNING TECHNIQUES**:

1. **Spaced Repetition**: Review material at increasing intervals (1 day, 3 days, 1 week, 1 month)

2. **The Feynman Technique**: Explain concepts in simple terms as if teaching a child

3. **Memory Palace**: Associate information with familiar locations in your mind

4. **Chunking**: Break large amounts of information into smaller, manageable pieces

5. **Elaborative Rehearsal**: Connect new information to what you already know

**PRACTICAL STRATEGIES**:

- **Use multiple senses**: Read aloud, draw diagrams, use colors
- **Create acronyms and mnemonics**: Like "ROYGBIV" for rainbow colors
- **Practice active recall**: Test yourself without looking at notes
- **Form study groups**: Teaching others reinforces your memory
- **Get enough sleep**: Memory consolidation happens during sleep

**LIFESTYLE FACTORS**:
- Regular exercise improves brain function
- Proper nutrition (omega-3s, antioxidants)
- Stay hydrated
- Manage stress levels

**TECHNOLOGY TOOLS**:
- Anki or Quizlet for flashcards
- Mind mapping software
- Voice recording for auditory learners

Remember: Memory is like a muscle - the more you exercise it with proper techniques, the stronger it becomes!', 'STUDY_HELP', NULL, NULL, 'Student seeking effective study strategies', 0.93, 21, NOW() - INTERVAL '2 days'),

-- ========== RECENT AI INTERACTIONS ==========
('What are the applications of calculus in computer science?', 'Calculus has numerous applications in computer science! Here are key areas:

**MACHINE LEARNING**:
- Gradient descent optimization
- Backpropagation in neural networks
- Loss function minimization

**COMPUTER GRAPHICS**:
- 3D modeling and animation
- Bezier curves and surfaces
- Ray tracing calculations

**ALGORITHMS**:
- Time complexity analysis
- Optimization problems
- Numerical methods

**PHYSICS SIMULATIONS**:
- Game physics engines
- Particle systems
- Fluid dynamics

**SIGNAL PROCESSING**:
- Image and audio processing
- Fourier transforms
- Compression algorithms

**DATABASE OPTIMIZATION**:
- Query optimization
- Index selection

**CRYPTOGRAPHY**:
- Mathematical foundations
- Key generation algorithms

While you might not write derivatives directly in code, understanding calculus helps you comprehend how these systems work under the hood!', 'CONCEPT', 25, NULL, 'CS student exploring mathematical foundations', 0.94, 29, NOW() - INTERVAL '1 day'),

('Explain photosynthesis in simple terms', 'Photosynthesis is how plants make their own food using sunlight! Here''s the simple version:

**THE RECIPE**:
- **Ingredients**: Carbon dioxide (from air) + Water (from roots) + Sunlight
- **Result**: Sugar (glucose) + Oxygen

**THE PROCESS**:
1. **Chloroplasts** (tiny green factories in leaves) capture sunlight
2. **Chlorophyll** (green pigment) absorbs light energy
3. Plants split water molecules and grab CO₂ from air
4. Energy from sunlight combines these into sugar
5. Oxygen is released as a "waste" product (lucky for us!)

**THE EQUATION**:
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

**WHY IT MATTERS**:
- Plants get energy to grow
- We get oxygen to breathe
- Food chains start with this process
- Removes CO₂ from atmosphere

**COOL FACT**: The oxygen you''re breathing right now was made by a plant through photosynthesis!

Think of plants as solar-powered sugar factories that give us oxygen as a bonus!', 'CONCEPT', 4, 1, 'Elementary student curious about plant biology', 0.96, 20, NOW() - INTERVAL '3 hours');

-- Insert AI query sources for credibility
INSERT INTO discussion.ai_query_sources (query_id, sources) VALUES
(1, '{"Calculus: Early Transcendentals by Stewart", "Khan Academy Calculus Course", "MIT OpenCourseWare 18.01"}'),
(2, '{"Linear Algebra and Its Applications by Lay", "Paul''s Online Math Notes", "Algebra Fundamentals Textbook"}'),
(3, '{"Introduction to Quantum Mechanics by Griffiths", "Quantum Physics Explained by McMahon", "Stanford Physics Lectures"}'),
(4, '{"University Physics by Young & Freedman", "Electromagnetic Induction Lab Manual", "Physics Classroom Resources"}'),
(5, '{"General Chemistry by Petrucci", "Chemical Equation Balancing Tutorial", "ChemLibreTexts Stoichiometry"}'),
(6, '{"Campbell Biology 12th Edition", "Cell Division Video Series", "Biology LibreTexts Cell Cycle"}'),
(7, '{"Object-Oriented Programming in Python", "Clean Code by Robert Martin", "Design Patterns by Gang of Four"}'),
(8, '{"The Memory Book by Lorayne", "Peak: Secrets from the New Science of Expertise", "Cognitive Psychology Research"}'),
(9, '{"Calculus for Computer Science by Strang", "Mathematics for Machine Learning", "Computer Graphics Principles"}'),
(10, '{"Campbell Biology Photosynthesis Chapter", "Plant Physiology Textbook", "Photosynthesis Research Papers"}');

-- Print confirmation
SELECT 'Messages and AI interactions created successfully' as status;
SELECT COUNT(*) as total_conversations FROM discussion.conversations;
SELECT COUNT(*) as total_messages FROM discussion.messages;
SELECT COUNT(*) as total_ai_queries FROM discussion.ai_queries;
SELECT 
    type,
    COUNT(*) as count
FROM discussion.ai_queries 
GROUP BY type
ORDER BY count DESC;