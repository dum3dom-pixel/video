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

## bg/bg_kitchen-v2.png ? attempt 2

User requested a new generation rather than local upscaling. References: 1. `video-01/assets/bg/bg_kitchen-try.png` (edit target); 2. `video-01/assets/bg/bg_door_wall.png` (material/light only).

```text
ACTUAL PIXEL RESOLUTION IS CRITICAL: output a full-resolution opaque PNG master of EXACTLY 2560 by 1440 pixels, landscape 16:9. The first attempt was delivered at 1672 by 941, which FAILED the required minimum. Do not return another 1672x941 or 1536px preview. Deliver the largest native full-resolution result, at least 1920x1080, with detailed paper fibers at final size. No upscaling is requested.

Asset: bg/bg_kitchen-v2.png, corrected empty kitchen background and master plate. No people.

Input image 1: bg/bg_kitchen-try.png. This is the edit target and kitchen-design reference. Keep its refrigerator, single sea-themed magnet, central window and checked table, two wooden stools, counter, gas stove, kettle, blank cutting board, paper materials and warm color grading. Correct only the camera framing and final actual pixel resolution as specified below.

Input image 2: bg/bg_door_wall.png. Supporting reference ONLY for physical paper material, six-color palette and warm morning illumination. Do not depict its bedroom layout, furniture or calendar.

Physical room, not screen coordinates: a modest Russian apartment kitchen, September 2005, same family and same warm album grading as the bedroom plates. West wall: one cream-and-warm-gray rounded refrigerator of the early 2000s, with exactly one small round paper magnet at about adult eye height: a sea-themed magnet (a stylized wave and a lifebuoy ring), the ring red #D92F2B and cream, the only red in the picture. South wall: one window with a plain cream curtain trimmed in brick brown, soft mustard-cream morning daylight entering only through it; under the window a wooden kitchen table covered with a mustard-and-cream checked oilcloth that hangs a little over the edges, two plain wooden stools tucked at the near side. East wall: a counter with a blank wooden cutting board (no bread yet), a plain faded-teal kettle and a plain warm-gray gas stove. Lower third of the walls: a muted brick-brown band. Floor: olive-and-cream paper-strip linoleum. No other furniture, decorations, calendar or clock.

Camera A (kitchen master): fixed wide view from the doorway, lens about 1.3 m above the floor, looking south, natural roughly 35 mm-equivalent perspective. Refrigerator screen-left with its magnet clearly visible, window and table centered, counter and stove screen-right. Everything meaningful above 70 percent of the height; bottom fifth only quiet floor. Lock framing, perspective and object positions for all later kitchen shots.

Lighting: dim early morning, soft cream-mustard daylight only through the south window, weaker warm light from the doorway behind the camera. Same exposure and warm album grading as the bedroom; no additional light source or drawn light beam.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the lifebuoy ring of the fridge magnet, nowhere else. One complete finished room illustration.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Kitchen-specific priority clarification: the inherited pilot palette paragraph mentions sock/calendar red permissions, but those objects are ABSENT in this kitchen. For THIS asset the only permitted red #D92F2B is the lifebuoy ring of the single sea-themed fridge magnet, as specified above. No sock, calendar, books or clock. Preserve the explicit kitchen floor, curtain and oilcloth material patterns; they are not writing or effects. Use the reference only for physical paper material and light, never its bedroom furniture or calendar. Deliver the actual full-resolution 2560x1440 PNG, not a preview thumbnail. All refrigerator, table, stools and counter silhouettes fit above 70 percent of frame height, including their feet; the entire bottom fifth is quiet linoleum. No borders or margins.

FRAMING CORRECTION TAKES PRIORITY over the tight framing in input image 1: move the camera physically BACK through the doorway, and tilt it slightly downward. The complete kitchen furnishings become about 75 percent of their previous visual scale. Show a wide foreground expanse of empty olive/cream paper-strip linoleum. All furniture, including the refrigerator feet, stools, table legs, stove base and the right-hand cupboard, must end ABOVE 70 percent of frame height. Keep their whole silhouettes inside x=10..94 percent. Place their lowest feet around y=65 percent. The band from y=70 to 100 percent must be ONLY quiet, uninterrupted linoleum across the ENTIRE width, with no stove or cupboard entering from the right, no refrigerator from the left and no doorway frame. Continue the same perspective floor pattern naturally. Retain plausible furniture dimensions and proportions. Keep the refrigerator left, window/table center, counter and stove right. Do not duplicate any item, add decorations or change morning light. No rendered coordinates, labels, guides, border or inset panel. This is one complete room illustration filling the 16:9 image.
```

Result: `video-01/assets/bg/bg_kitchen-v2.png`, opaque RGB PNG, 1672x941. Wider camera resolves the floor-only bottom fifth. Native output is AGAIN below 1920x1080 minimum and not exact 16:9. No local upscale performed, following user choice. Review candidate only, not accepted as HD. Awaiting user review before dependent shots.

## shots/k_sasha_table.png — attempt 1

References: `video-01/assets/sheets/sasha_sheet_hd.png`, `video-01/assets/sheets/mama_sheet-v2.png`, `video-01/assets/bg/bg_kitchen-v2.png`.

```text
Asset: shots/k_sasha_table.png, Sasha at the kitchen table.

Input image 1: sheets/sasha_sheet_hd.png: the hero. Preserve face, cowlick, outfit.

Input image 2: sheets/mama_sheet-v2.png: the mother in the background. Preserve face, hair clip, housecoat, apron.

Input image 3: bg/bg_kitchen-v2.png: exact camera, framing, table, oilcloth, fridge, window and light. Do not move any fixed object.

Sasha: the same original 12-year-old boy as in the attached sheet: slim, small, an unmistakably adult, tired, watchful gaze, messy dark ash-brown hair with one cowlick at his front-right hairline, faint under-eye shadows, slightly drawn-together eyebrows, faded olive-green T-shirt with one chest pocket, light warm-gray pajama pants. Preserve everything.

Mama is described in her sheet: in this picture she is small in the background at the counter on the screen-right, seen in profile, cutting a loaf of bread on the cutting board with a plain knife; she is looking down at the bread and not at the camera.

Scene: use the exact Camera A of bg_kitchen. Sasha sits on the near-side stool at the checked table, centered, facing the camera in a slight three-quarter view, both hands flat on the oilcloth next to an empty plain cream bowl. His expression is calm and tense: jaw set, eyes wide and old, looking slightly past the camera. The refrigerator with its magnet stays screen-left as in the background plate. Faces and hands above y=752; bottom fifth only quiet floor.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the lifebuoy ring of the fridge magnet, nowhere else.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Scope clarification: the inherited pilot exclusions and palette are verbatim, but no calendar or sock is present here. The kitchen-specific red rule above overrides the pilot red examples. Mama must match the ACTUALLY ATTACHED approved v2 sheet, including the wavy/curly chestnut hair and plain rear mustard barrette; do not invent a different hairstyle. Kitchen furniture and lighting follow the ACTUALLY ATTACHED approved kitchen-v2 plate. No labels or numerals anywhere. Faces, full hair silhouettes, hands and key props must all stay above 70 percent of image height. The lower 20 percent must remain quiet floor, counter or oilcloth. This is one full-frame opaque 16:9 finished illustration, with no borders, no inset layout, no cutout. Actual requested pixel dimensions: 2560x1440, never below 1920x1080. Deliver the full native master, not a reduced preview.
Sasha sits turned partly toward the camera on the near stool, torso lightly rotated so his knees do not intersect the table. Both hands rest naturally on the visible front portion of the oilcloth, next to the empty bowl; no anatomical overlaps or extra fingers. Keep the same fixed kitchen-wide camera as the approved plate. Mama is small at the right counter in profile, cutting bread. Her hands, knife and bread are above 70 percent height.
```

Result: `video-01/assets/shots/k_sasha_table.png`, 1672x941 RGB PNG. Dimension check: False. Sasha face, cowlick, olive pocket shirt and warm-gray pants match the sheet; Mama v2 hair, rear barrette, floral robe and apron retained. Empty cream bowl; Mama cutting bread in profile. No visible text or extra red; red only on magnet. Faces, hands and bread above 70 percent; bottom fifth quiet floor. Kitchen retains fridge-left/window-and-table-center/stove-right arrangement, but exact furniture pixel positions differ from background and Sasha is behind the tabletop rather than the requested near-side placement. Native dimensions remain below the HD minimum; review candidate only.

## shots/k_soup.png — attempt 1

References: `video-01/assets/sheets/mama_sheet-v2.png`, `video-01/assets/bg/bg_kitchen-v2.png`.

```text
Asset: shots/k_soup.png, first-person shot at the kitchen table.

Input image 1: sheets/mama_sheet-v2.png. Use only for the housecoat sleeve, her hand and paper material. Do NOT show her face.

Input image 2: bg/bg_kitchen-v2.png. Use for the exact oilcloth, table, window light and wall finish.

Scene: Sasha's point of view, eye level just above the table edge. In the middle-low part of the frame stands a plain cream bowl of mustard-colored soup with one small olive-green leaf on top and a faint paper-cut steam curl, on the mustard-and-cream checked oilcloth. From the upper right, a woman's forearm in the faded olive housecoat sleeve with the small mustard flower pattern and her cream paper hand holding a plain warm-gray spoon extends toward the camera, offering the spoon. Only the forearm and hand are visible: no face, no body, no second person. Behind the table: a simplified cream wall with the brick-brown lower band and a corner of the window with the cream curtain, no clutter. The bowl, hand and spoon above y=752; bottom fifth only quiet oilcloth.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no red #D92F2B visible (the magnet is out of frame).

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Scope clarification: the inherited pilot exclusions and palette are verbatim, but no calendar or sock is present here. The kitchen-specific red rule above overrides the pilot red examples. Mama must match the ACTUALLY ATTACHED approved v2 sheet, including the wavy/curly chestnut hair and plain rear mustard barrette; do not invent a different hairstyle. Kitchen furniture and lighting follow the ACTUALLY ATTACHED approved kitchen-v2 plate. No labels or numerals anywhere. Faces, full hair silhouettes, hands and key props must all stay above 70 percent of image height. The lower 20 percent must remain quiet floor, counter or oilcloth. This is one full-frame opaque 16:9 finished illustration, with no borders, no inset layout, no cutout. Actual requested pixel dimensions: 2560x1440, never below 1920x1080. Deliver the full native master, not a reduced preview.
The attached Mama sheet is used only for her cream-paper hand and rolled floral housecoat sleeve. Do not depict any portrait, face or whole body. The bowl, offered spoon, fingers and steam curl all fit in the middle of the image, entirely above 70 percent height. Bottom fifth only checked oilcloth. No refrigerator magnet is in this tighter crop, so no red.
```

## shots/k_sasha_table-v2.png ? attempt 2

References: kitchen-v2 edit target, Sasha HD identity, Mama v2 identity.

```text
Precise kitchen scene edit: input image 1 is the FIXED CAMERA AND BACKGROUND EDIT TARGET. Preserve every existing piece of furniture at exactly the same image coordinates and scale. ADD the two characters without zooming, reframing or shifting the background.

Asset: shots/k_sasha_table-v2.png, Sasha at the kitchen table.

Input image 2: sheets/sasha_sheet_hd.png: Sasha identity reference. Preserve face, cowlick, outfit.

Input image 3: sheets/mama_sheet-v2.png: Mama identity reference. Preserve face, hair clip, housecoat, apron.

Input image 1: bg/bg_kitchen-v2.png: the actual image to edit. KEEP the exact camera, framing, table, oilcloth, fridge, window and light. Do not move any fixed object. Only add people and the specified bowl and bread.

Sasha: the same original 12-year-old boy as in the attached sheet: slim, small, an unmistakably adult, tired, watchful gaze, messy dark ash-brown hair with one cowlick at his front-right hairline, faint under-eye shadows, slightly drawn-together eyebrows, faded olive-green T-shirt with one chest pocket, light warm-gray pajama pants. Preserve everything.

Mama is described in her sheet: in this picture she is small in the background at the counter on the screen-right, seen in profile, cutting a loaf of bread on the cutting board with a plain knife; she is looking down at the bread and not at the camera.

Scene: use the exact Camera A of bg_kitchen. Sasha sits on the near-side stool at the checked table, centered, facing the camera in a slight three-quarter view, both hands flat on the oilcloth next to an empty plain cream bowl. His expression is calm and tense: jaw set, eyes wide and old, looking slightly past the camera. The refrigerator with its magnet stays screen-left as in the background plate. Faces and hands above y=752; bottom fifth only quiet floor.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the lifebuoy ring of the fridge magnet, nowhere else.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Scope clarification: the inherited pilot exclusions and palette are verbatim, but no calendar or sock is present here. The kitchen-specific red rule above overrides the pilot red examples. Mama must match the ACTUALLY ATTACHED approved v2 sheet, including the wavy/curly chestnut hair and plain rear mustard barrette; do not invent a different hairstyle. Kitchen furniture and lighting follow the ACTUALLY ATTACHED approved kitchen-v2 plate. No labels or numerals anywhere. Faces, full hair silhouettes, hands and key props must all stay above 70 percent of image height. The lower 20 percent must remain quiet floor, counter or oilcloth. This is one full-frame opaque 16:9 finished illustration, with no borders, no inset layout, no cutout. Actual requested pixel dimensions: 2560x1440, never below 1920x1080. Deliver the full native master, not a reduced preview.
Sasha sits turned partly toward the camera on the near stool, torso lightly rotated so his knees do not intersect the table. Both hands rest naturally on the visible front portion of the oilcloth, next to the empty bowl; no anatomical overlaps or extra fingers. Keep the same fixed kitchen-wide camera as the approved plate. Mama is small at the right counter in profile, cutting bread. Her hands, knife and bread are above 70 percent height.

NEAR-SIDE SEATING CORRECTION: seat Sasha on the existing near-side LEFT stool in image 1, with his back partly toward the camera and his torso turned three-quarter SIDEWAYS; he turns his head back toward the camera so his serious face remains readable. This natural three-quarter seated pose takes priority over a fully frontal pose. His body must be IN FRONT of the table and occlude a small part of its hanging front oilcloth. Do NOT seat him at the far side behind the table or under the window. Both hands reach naturally onto the near table edge next to the empty bowl, shoulders relaxed. Tabletop and TWO STOOLS keep their exact original positions. His entire hair, hands and bare feet end above 70 percent frame height. Mama stands at the counter on the right, PROFILE, at an appropriate adult scale for this fixed wide shot, head and hands above 70 percent. Her action uses the existing cutting board; the kettle remains at its exact original position. Keep the background composition identical to input 1. No additional props, chairs or camera changes.
```

Result: `video-01/assets/shots/k_sasha_table-v2.png`, 1672x941 RGB PNG. Dimension check: False. Selected improved composition: Sasha sits on the near-left stool in a natural sideways pose and turns toward camera, hands on the oilcloth beside the empty bowl. Kitchen framing closely follows kitchen-v2, fridge/window/table/counter positions retained. Mama v2 stands in profile cutting bread at right; rear mustard clip, floral olive robe, cream apron and teal slippers. All faces, hands, feet and bread above 70 percent; bottom fifth quiet floor. Red only on magnet; no visible text, logos, black outlines or film effects. Physical layered-paper rendering matches references. Native scene resolution still below HD minimum.

Result: `video-01/assets/shots/k_soup.png`, 1672x941 RGB PNG. Dimension check: False. Trial requiring composition correction: no adult face, only cream paper hand and floral olive sleeve offering a warm-gray spoon; cream bowl of mustard soup with olive leaf, matching checked oilcloth and window light. No visible text, logos or red. Paper style consistent. Bowl extends to approximately 83 percent height and intrudes into subtitle zone; must shrink and move upward. Native output below HD minimum.

## shots/k_soup-v2.png — attempt 2

References: `video-01/assets/sheets/mama_sheet-v2.png`, `video-01/assets/bg/bg_kitchen-v2.png`, `video-01/assets/shots/k_soup.png`.

```text
EDIT input image 3, the current result, correcting ONLY the specified composition problem. Earlier inputs retain their stated reference roles. Preserve all accepted identity, palette, material, background and lighting.

Asset: shots/k_soup-v2.png, first-person shot at the kitchen table.

Input image 1: sheets/mama_sheet-v2.png. Use only for the housecoat sleeve, her hand and paper material. Do NOT show her face.

Input image 2: bg/bg_kitchen-v2.png. Use for the exact oilcloth, table, window light and wall finish.

Scene: Sasha's point of view, eye level just above the table edge. In the middle-low part of the frame stands a plain cream bowl of mustard-colored soup with one small olive-green leaf on top and a faint paper-cut steam curl, on the mustard-and-cream checked oilcloth. From the upper right, a woman's forearm in the faded olive housecoat sleeve with the small mustard flower pattern and her cream paper hand holding a plain warm-gray spoon extends toward the camera, offering the spoon. Only the forearm and hand are visible: no face, no body, no second person. Behind the table: a simplified cream wall with the brick-brown lower band and a corner of the window with the cream curtain, no clutter. The bowl, hand and spoon above y=752; bottom fifth only quiet oilcloth.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no red #D92F2B visible (the magnet is out of frame).

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Scope clarification: the inherited pilot exclusions and palette are verbatim, but no calendar or sock is present here. The kitchen-specific red rule above overrides the pilot red examples. Mama must match the ACTUALLY ATTACHED approved v2 sheet, including the wavy/curly chestnut hair and plain rear mustard barrette; do not invent a different hairstyle. Kitchen furniture and lighting follow the ACTUALLY ATTACHED approved kitchen-v2 plate. No labels or numerals anywhere. Faces, full hair silhouettes, hands and key props must all stay above 70 percent of image height. The lower 20 percent must remain quiet floor, counter or oilcloth. This is one full-frame opaque 16:9 finished illustration, with no borders, no inset layout, no cutout. Actual requested pixel dimensions: 2560x1440, never below 1920x1080. Deliver the full native master, not a reduced preview.
The attached Mama sheet is used only for her cream-paper hand and rolled floral housecoat sleeve. Do not depict any portrait, face or whole body. The bowl, offered spoon, fingers and steam curl all fit in the middle of the image, entirely above 70 percent height. Bottom fifth only checked oilcloth. No refrigerator magnet is in this tighter crop, so no red.

Input image 3: assets/shots/k_soup.png, the EDIT TARGET.

PRIORITY CORRECTION: Move the ENTIRE bowl including its base UP substantially and reduce it to 75 percent of its current size, preserving its natural round proportions. Center the bowl at 50 percent width and 48 percent height, with its very bottom at 65 percent height. The bowl top/rim should begin near 35 percent height. Spoon and hand stay above the bowl in the upper half; sleeve comes from upper right. ALL meaningful art, including the soup bowl base and steam, must end above 68 percent height. The bottom THIRD of the image must be NOTHING BUT uninterrupted mustard-and-cream checked oilcloth, no bowl, no hand, no meaningful shadow. Use a slightly wider view if necessary, keep the same window and wall material. This is a framing adjustment, no new objects or effects. Preserve the exact hand, sleeve, spoon, soup, leaf, cream bowl design and warm paper collage.
```

Result: `video-01/assets/shots/k_soup-v2.png`, 1672x941 RGB PNG. Dimension check: False. Selected corrected composition. Entire soup bowl ends around 64 percent height; spoon, hand and steam above 70 percent; bottom third only checked oilcloth. No face or body, only Mama v2 floral olive sleeve and cream paper hand. Same cream bowl, mustard soup, single olive leaf, checked oilcloth, wall finish and window light. No visible text, logos, red or black outlines; layered paper fibers retained. Native resolution still below HD minimum.

## shots/k_mama_bread.png — attempt 1

References: `video-01/assets/sheets/mama_sheet-v2.png`, `video-01/assets/shots/k_sasha_table-v2.png`, `video-01/assets/bg/bg_kitchen-v2.png`.

```text
Asset: shots/k_mama_bread.png, Mama cutting bread, closer.

Input image 1: sheets/mama_sheet-v2.png: the hero of this picture. Preserve face, hair clip, housecoat, apron, age.

Input image 2: shots/k_sasha_table-v2.png: approved kitchen rendering and Mama's look in this scene; keep the same world.

Input image 3: bg/bg_kitchen-v2.png: counter, cutting board, window and light.

Mama: an original 38-year-old woman, Sasha's mother, of medium build, with a warm, slightly tired face. Shoulder-length dark chestnut hair (brick-brown and warm-gray paper) pulled back and held by one plain mustard hair clip at the back. Large kind dark eyes, faint smile lines at the corners, the same underlying nose and eyebrow shape as Sasha, small straight nose, a gentle small mouth. Warm cream paper skin. Clothes: a soft housecoat of faded olive-green with a small mustard flower material pattern, a plain cream apron over it, faded teal slippers. No jewelry, no glasses. Preserve age, face, hair and clothing exactly across all pictures.

Scene: a closer medium shot of Mama at the counter, torso and head, three-quarter view, at the cutting board with a round loaf of bread and a plain knife in her hands. She has just turned her head toward the camera with a light, puzzled, kind look, eyebrows slightly raised, mouth slightly open as if she is about to ask a question. The faded teal kettle and part of the south window with the cream curtain are behind her. Face, hands and bread above y=752; bottom fifth only quiet counter and floor.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no red #D92F2B visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Scope clarification: the inherited pilot exclusions and palette are verbatim, but no calendar or sock is present here. The kitchen-specific red rule above overrides the pilot red examples. Mama must match the ACTUALLY ATTACHED approved v2 sheet, including the wavy/curly chestnut hair and plain rear mustard barrette; do not invent a different hairstyle. Kitchen furniture and lighting follow the ACTUALLY ATTACHED approved kitchen-v2 plate. No labels or numerals anywhere. Faces, full hair silhouettes, hands and key props must all stay above 70 percent of image height. The lower 20 percent must remain quiet floor, counter or oilcloth. This is one full-frame opaque 16:9 finished illustration, with no borders, no inset layout, no cutout. Actual requested pixel dimensions: 2560x1440, never below 1920x1080. Deliver the full native master, not a reduced preview.
Keep her entire head and hair above 50 percent height and BOTH hands, bread and plain kitchen knife entirely above 70 percent. The bottom fifth only quiet counter front or floor, never hands or loaf. Show the same woman as input 1, age 38, not a teenage girl. No red: fridge and magnet outside this close shot.
```

Result: `video-01/assets/shots/k_mama_bread.png`, 1672x941 RGB PNG. Dimension check: False. First close-up: Mama face, curly chestnut hair, rear mustard clip, floral robe and apron match v2; kind puzzled look and bread-cutting action readable. Teal kettle, cream curtain with brick trim and checked table consistent. No visible text or red; physical paper material retained. Bread/board extend slightly beyond 70 percent height, hair is too near the top edge, and lower apron enters subtitle area. Wider waist-up framing with foreground counter needed. Native resolution below HD minimum.

## shots/k_mama_bread-v2.png — attempt 2

References: `video-01/assets/sheets/mama_sheet-v2.png`, `video-01/assets/shots/k_sasha_table-v2.png`, `video-01/assets/bg/bg_kitchen-v2.png`, `video-01/assets/shots/k_mama_bread.png`.

```text
EDIT input image 4, the current result, correcting ONLY the specified composition problem. Earlier inputs retain their stated reference roles. Preserve all accepted identity, palette, material, background and lighting.

Asset: shots/k_mama_bread-v2.png, Mama cutting bread, closer.

Input image 1: sheets/mama_sheet-v2.png: the hero of this picture. Preserve face, hair clip, housecoat, apron, age.

Input image 2: shots/k_sasha_table-v2.png: approved kitchen rendering and Mama's look in this scene; keep the same world.

Input image 3: bg/bg_kitchen-v2.png: counter, cutting board, window and light.

Mama: an original 38-year-old woman, Sasha's mother, of medium build, with a warm, slightly tired face. Shoulder-length dark chestnut hair (brick-brown and warm-gray paper) pulled back and held by one plain mustard hair clip at the back. Large kind dark eyes, faint smile lines at the corners, the same underlying nose and eyebrow shape as Sasha, small straight nose, a gentle small mouth. Warm cream paper skin. Clothes: a soft housecoat of faded olive-green with a small mustard flower material pattern, a plain cream apron over it, faded teal slippers. No jewelry, no glasses. Preserve age, face, hair and clothing exactly across all pictures.

Scene: a closer medium shot of Mama at the counter, torso and head, three-quarter view, at the cutting board with a round loaf of bread and a plain knife in her hands. She has just turned her head toward the camera with a light, puzzled, kind look, eyebrows slightly raised, mouth slightly open as if she is about to ask a question. The faded teal kettle and part of the south window with the cream curtain are behind her. Face, hands and bread above y=752; bottom fifth only quiet counter and floor.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no red #D92F2B visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.

Scope clarification: the inherited pilot exclusions and palette are verbatim, but no calendar or sock is present here. The kitchen-specific red rule above overrides the pilot red examples. Mama must match the ACTUALLY ATTACHED approved v2 sheet, including the wavy/curly chestnut hair and plain rear mustard barrette; do not invent a different hairstyle. Kitchen furniture and lighting follow the ACTUALLY ATTACHED approved kitchen-v2 plate. No labels or numerals anywhere. Faces, full hair silhouettes, hands and key props must all stay above 70 percent of image height. The lower 20 percent must remain quiet floor, counter or oilcloth. This is one full-frame opaque 16:9 finished illustration, with no borders, no inset layout, no cutout. Actual requested pixel dimensions: 2560x1440, never below 1920x1080. Deliver the full native master, not a reduced preview.
Keep her entire head and hair above 50 percent height and BOTH hands, bread and plain kitchen knife entirely above 70 percent. The bottom fifth only quiet counter front or floor, never hands or loaf. Show the same woman as input 1, age 38, not a teenage girl. No red: fridge and magnet outside this close shot.

Input image 4: assets/shots/k_mama_bread.png, the EDIT TARGET.

PRIORITY CORRECTION: Widen this medium shot by reducing the ENTIRE Mama-and-bread action group to 80 percent of its current visual size. Give her whole hair generous headroom: top of hair at about 12 percent frame height. Keep the SAME face and expression, no redesign. Frame her from the waist upward BEHIND the foreground counter. Her entire face, both hands, knife, loaf, bread slices and cutting board must fit in the upper TWO THIRDS, with the bottom of the cutting board no lower than 65 percent height. Both hands near 50 percent height. Hide her lower body behind a simple foreground section of the same counter: the bottom quarter across the whole frame contains ONLY quiet counter front, oilcloth or plain wall, no person, apron, hands, bread or key props. Do not move her face upward or crop her hair to obtain this; make the whole action smaller within the frame. Keep the same warm kitchen, paper material, curtain, teal kettle and blank cutting board, no new objects. Make the foreground counter fascia visually quiet, no large knobs in the subtitle area. No red.
```

Result: `video-01/assets/shots/k_mama_bread-v2.png`, 1672x941 RGB PNG. Dimension check: False. Selected wider close-up. Mama face and curly chestnut hair follow v2; mustard rear clip, floral olive robe and cream apron retained, kind puzzled glance, mouth slightly open. Both hands, plain knife, loaf, slices and board above 65 percent height, full hair safely below top margin. Bottom fifth only quiet counter front. Same warm morning palette, paper layers, teal kettle, curtain trim and oilcloth. No visible text, logos or red. This closer view includes a foreground counter fascia not visible in the master plate; verify spatial continuity before production. Native dimensions remain below HD minimum.

