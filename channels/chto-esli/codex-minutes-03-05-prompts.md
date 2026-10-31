# Generation prompts: minutes 03?05 and kitchen dependency

Actual English prompts, recorded before each tool call. Workflow follows the user message; cassette box follows props-sheet approval.

## bg/bg_kitchen.png ? attempt 1

Reference: `video-01/assets/bg/bg_door_wall.png` (material and light only).

```text
Asset: bg/bg_kitchen.png, empty kitchen background and master plate. No people.

Input image 1: bg/bg_door_wall.png. Use only as the paper material, palette, soft cream-mustard morning light and album-grading reference. Do NOT copy the bedroom layout.

Physical room, not screen coordinates: a modest Russian apartment kitchen, September 2005, same family and same warm album grading as the bedroom plates. West wall: one cream-and-warm-gray rounded refrigerator of the early 2000s, with exactly one small round paper magnet at about adult eye height: a sea-themed magnet (a stylized wave and a lifebuoy ring), the ring red #D92F2B and cream, the only red in the picture. South wall: one window with a plain cream curtain trimmed in brick brown, soft mustard-cream morning daylight entering only through it; under the window a wooden kitchen table covered with a mustard-and-cream checked oilcloth that hangs a little over the edges, two plain wooden stools tucked at the near side. East wall: a counter with a blank wooden cutting board (no bread yet), a plain faded-teal kettle and a plain warm-gray gas stove. Lower third of the walls: a muted brick-brown band. Floor: olive-and-cream paper-strip linoleum. No other furniture, decorations, calendar or clock.

Camera A (kitchen master): fixed wide view from the doorway, lens about 1.3 m above the floor, looking south, natural roughly 35 mm-equivalent perspective. Refrigerator screen-left with its magnet clearly visible, window and table centered, counter and stove screen-right. Everything meaningful above 70 percent of the height; bottom fifth only quiet floor. Lock framing, perspective and object positions for all later kitchen shots.

Lighting: dim early morning, soft cream-mustard daylight only through the south window, weaker warm light from the doorway behind the camera. Same exposure and warm album grading as the bedroom; no additional light source or drawn light beam.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the lifebuoy ring of the fridge magnet, nowhere else. One complete finished room illustration.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Kitchen-specific priority clarification: the inherited pilot palette paragraph mentions sock/calendar red permissions, but those objects are ABSENT in this kitchen. For THIS asset the only permitted red #D92F2B is the lifebuoy ring of the single sea-themed fridge magnet, as specified above. No sock, calendar, books or clock. Preserve the explicit kitchen floor, curtain and oilcloth material patterns; they are not writing or effects. Use the reference only for physical paper material and light, never its bedroom furniture or calendar. Deliver the actual full-resolution 2560x1440 PNG, not a preview thumbnail. All refrigerator, table, stools and counter silhouettes fit above 70 percent of frame height, including their feet; the entire bottom fifth is quiet linoleum. No borders or margins.
```

Result: `video-01/assets/bg/bg_kitchen-try.png`, RGB PNG, 1672x941. Trial only; below 1920x1080 minimum. Lower-right stove/cabinet enters the bottom fifth, requiring a wider camera for a floor-only subtitle band. Canonical asset not created. User decision on local upscaling pending.

