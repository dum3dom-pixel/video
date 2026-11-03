"""Prepare actual built-in image_gen requests for the Sasha paper migration."""
import json
from pathlib import Path
import sasha_redesign_inventory as inv

ROOT=inv.ROOT
POSITIONS={
 'p4_sasha':'the single boy sitting up in the CENTER of the bed',
 'h_sasha_palm':'the single boy sitting at the bed edge, palm on face',
 'h_sasha_eyes_cu':'the single boy in the extreme face close-up',
 'k_sasha_table':'the small seated boy, NOT the woman at the stove',
 'r_adults_soup':'the CHILD BETWEEN his two adult parents, never either parent',
 'e1_mama_bread':'the small boy LEFT of the woman cutting bread',
 'e1_papa_pan':'the boy in the LEFT FOREGROUND seen from behind, NOT the moustached father',
 'e1_papa_lowers':'the boy at LEFT FOREGROUND, NOT the moustached father',
 'e1_cocoa':'the small seated boy receiving cocoa, NOT Mama',
 'e1_school_board':'the thin boy AT THE BLACKBOARD at center rear; do NOT change other seated students or the teacher',
 'e1_lights_out':'the boy at the desk on RIGHT seen from behind; NOT Mama in the doorway',
 'e2_try_mama':'the boy beside the woman in the kitchen, NOT Mama',
 'e2_try_teacher':'the boy standing at RIGHT facing the teacher; do not change the teacher or the seated class',
 'e2_try_dimka':'the THIN SPIKY-HAIRED boy at RIGHT, NOT his round-faced cropped-hair friend at LEFT',
 'e2_kostya_room':'the standing boy on RIGHT seen from behind; NOT the older curly-haired brother seated at LEFT',
 'e2_kostya_gives':'the small boy at LEFT FOREGROUND seen from behind reaching for the deck; NOT the older curly-haired brother holding it',
 'e3_bed_edge':'the younger small boy seated at RIGHT, NOT the curly-haired older brother at LEFT',
 'e3_bench':'the smaller younger boy on RIGHT end of the bench; NOT his older curly-haired brother at LEFT',
 'e3b_gena':'the thin spiky-haired boy at RIGHT; NOT the broad short-haired boy at LEFT',
 'e3b_notebooks':'the younger thin spiky-haired boy at RIGHT writing; NOT the older curly-haired brother at LEFT',
 'e5_garage':'the young boy at RIGHT of the elderly craftsman; never change the grandfather',
 'e5_burn':'the wincing boy at RIGHT withdrawing his hand; never change the elderly craftsman',
 'e4_warn_kitchen':'the thin teenager standing at RIGHT addressing his moustached father at LEFT',
 'e4_briefcase':'the teenage boy standing in the LEFT BACKGROUND doorway, NOT the father with briefcase',
 'e4_silent_dinner':'the teenage boy seated at RIGHT of the family table, NOT his parents',
 'e4_winter_fork':'the teenage boy at RIGHT of the table, NOT the moustached father at LEFT',
 'e4b_pc_floor':'the SPIKY-HAIRED younger teen crouched LEFT of the computer tower, NOT curly-haired Kostya behind the tower or Mama in doorway',
 'e5_sundays':'the younger teenager at RIGHT working on the bicycle, NOT the elderly man at LEFT',
 'm_graduation':'the narrow-faced young male graduate in the CENTER wearing the oversized pale blazer; NOT his teacher or any other graduate',
 'm_dimka_phone':'the quiet spiky-haired young man at RIGHT in mustard hoodie; NOT Dimka with short cropped hair and phone at LEFT',
 'm_kostya_car':'the thin STANDING younger man at LEFT on the pavement; NOT curly-haired older brother leaning from the driver window',
 'e6_terrace':'the adult MAN at LEFT in cream shirt; never the woman in teal cardigan at RIGHT',
 'e6_cups':'the adult MAN at LEFT handling the cups; never the woman in teal cardigan at RIGHT',
 'e6_station':'the adult MAN seen from behind at LEFT; NOT the distant woman at RIGHT',
 'f_kostya_door':'the adult man seated at LEFT of kitchen table, NOT the BALD man in doorway at RIGHT',
 'f_kostya_frown':'Sasha at LEFT FOREGROUND seen from behind, NOT the BALD man facing camera',
 'f_player':'the SPIKY-HAIRED man at LEFT operating the deck; NOT the BALD brother at RIGHT',
 'f_pat':'the SPIKY-HAIRED man seated LEFT at the deck, NOT the BALD man at RIGHT touching his shoulder',
 'f_recording':'the SPIKY-HAIRED man at LEFT speaking into deck, NOT the BALD listener at RIGHT',
}
SPECIAL={
 'p4_sasha':'He remains sitting IN BED under the same blanket, same two hands on blanket, not standing. Change visible upper costume to olive tee over cream high-neck long sleeves. Do not add boots on top of bedding.',
 'h_sasha_palm':'Same palm covering face, other hand grips blanket, same seated posture. Olive tee over cream highneck long sleeves and charcoal shorts. Keep feet bare for this bedroom waking moment; no outdoor boots in bed.',
 'h_sasha_eyes_cu':'Preserve the intimate forehead-to-chin crop and slightly wide attentive adult gaze. Hair may naturally meet crop edges. Do not change to a full-body sheet.',
 'e1_clock_ten':'Preserve his existing cream PYJAMAS for this night scene; change face/hair only, no boots or shorts.',
 'e1_school_board':'Preserve SCHOOL costume: cream collared shirt and gray trousers, no home highneck/shorts/boots.',
 'e2_try_teacher':'Preserve SCHOOL costume: cream collared shirt and gray trousers.',
 'e2_try_dimka':'Preserve SCHOOL costume: cream collared shirt and gray trousers.',
 'e3b_gena':'Preserve SCHOOL costume: cream collared shirt and gray trousers.',
 'e3b_library':'Preserve SCHOOL costume: cream collared shirt and gray trousers.',
 'e2_labels':'Only hands and upper torso are visible. Replace olive short bare sleeves with the new olive tee over cream longsleeves where visible, same marker/cassette arrangement. Do not add a head/face or feet.',
 'pv_b_boy':'Keep the original clean empty area for code-written text and calendar/bedroom composition; no new lettering.',
 'e6_station':'Keep both figures distant, backs facing camera. Change only the MAN hair silhouette/color and paper facial/neck material visible, preserving adult creamshirt/trousers. Do not invent a portrait.',
 'e2_life_bus':'Keep the back-view adult passenger, gray clothing and rainy minibus; replace just his visible hair silhouette/color with adult Sasha. No face turned to camera.',
 'e2_life_work':'Keep adult Sasha viewed from behind at the computer in his gray work shirt; replace visible hair silhouette/color only. Do not turn him around or add text to screen.',
 'f_player':'Keep cassette already inside the left deck bay where shown. Preserve bay doors/keys/hands continuity; no duplicated cassette.',
 'f_pat':'Keep Kostya hand on Sasha shoulder and their genuine small smiles. Cassette is fully INSIDE the closed left bay, with no loose floating cassette or extra inserting hand.',
}

STYLE='''PAPER STYLE LOCK: Match input1 existing project's handmade layered paper/cardboard collage AND input2 required paper character sheet. Every new face, hair lock, hand, clothing fold must be thick MATTE colored paper, visible inherent fibers and small creases, imperfect cut/torn edges, slight pale fiber rims, overlapping discrete pieces and soft short contact shadows. No continuous black contour lines, smooth anime linework/cel shading, glossy3D, watercolor, applied grain or blur. Do not change the whole frame's rendering or color grade. Palette warm cream, muted olive, faded teal, warmgray, mustard and brick-brown. Sasha hair is consistently LIGHT ASH-BEIGE/PEARL GREIGE, between silver white and brown, matching input2: not brown, not bright pure white. Use scene light on this local paper color. Keep the original lighting and time-of-day.'''

def build():
 d=inv.create(); jobs=[]
 for e in d['entries']:
  if e['kind']=='sheet':continue
  backup=inv.BACKUP/Path(e['source']).relative_to('assets')
  refs=[str(backup),str(ROOT/'assets/sheets/sasha_sheet-paper-v1.png')]
  if e['age']>=15:
   refs += [str(ROOT/'assets/sheets/sasha_faces_sheet-paper-v1.png'),str(ROOT/'assets/sheets/sasha_ages_sheet-paper-v1.png')]
  loc=POSITIONS.get(e['id'],'the single Sasha shown in this frame, identifiable by the old spiky brown hair')
  wardrobe=('For ordinary childhood HOME/DAY scenes update his visible outfit to the approved olive loose T-shirt over cream high-neck long sleeves, warmgray shorts and teal high boots with cream cuffs/toes and small mustard tabs, adapting cloth folds to the EXISTING pose. Do not show hidden limbs. Keep outdoors windbreakers and practical scene-specific costume when present; school and nightwear overrides are specified below.' if e['age']<=13 else 'Preserve his EXISTING age-appropriate clothes, colors and props exactly; do not put the child shorts/boots costume on a teenager or adult. Use age sheets for mature anatomy and face only.')
  if e['kind']=='detail':
   request=f'''Use case: precise-object-edit. Edit input1, a Sasha body/hand/POV insert. Maintain EXACT camera, subject sizes, hand poses, number of hands/fingers, props and setting. Sasha age{e['age']}. No face/head is visible: DO NOT add a head, new figure or hair. Where CHILD sleeve is visible and this is not schoolwear, change it to the approved cream long sleeve under olive tee. All adult/teen sleeves and clothing remain their existing scene-specific color/cut. Render hands/material consistently as physical paper matching input2. Preserve exactly the radio, cassette keys including the single red RECORD key if present, blank paper/screens/labels, and any existing other person's hands. Do not add any ring to a child's hand.'''
  else:
   request=f'''Use case: identity-preserve. Precisely edit ONLY SASHA in input1: {loc}. New Sasha identity is input2 (child) and age-appropriate panels of input3/4 when provided. Age in this scene is {e['age']}. Preserve his EXACT pose, action, emotional expression, gaze direction, placement and body/head scale in the scene. Adapt NEW identity to that existing expression rather than making all scenes a neutral face. Narrow angular face, small straight nose, gray-teal eyes, mature watchful gaze, voluminous sharply spiky radial hair with short jagged bangs, no old tall single cowlick. Keep child size at12/13, lanky teen at15, youngadult at18–22, clearly adult at26–33 (adult chin/cheekbones, appropriate subtle stubble only when original/age reference has it). {wardrobe}'''
  prompt=request+'\n\nREFERENCE ROLES: input1 is the EDIT TARGET and strict scene/other-cast/material reference; input2 is the NEW SASHA paper design/material reference only, never its sheet layout. Additional age sheets, if attached, guide face age, not scene composition.\n\n'+STYLE+'\n\nSCENE CONTEXT (preserve what is actually shown, do not invent objects): '+e.get('description','')+'\n\n'+SPECIAL.get(e['id'],'')+'''\n\nSTRICT INVARIANTS: All other characters remain EXACTLY unchanged including Kostya's curls or bald head, broad face and clothes; all parents, Dimka, Lena and grandfather keep their approved identities. Preserve background architecture, camera, crop, furniture positions, objects, light and quiet lower subtitle area. Never redraw a brother as Sasha, add/remove people, rearrange a room or change the story action. Do not add lettering, digits, labels, signatures, logos, arrows, sparks or powers. Every paper/notebook/calendar/screen stays blank as in target. Preserve small red accents ONLY where already present. ONE opaque PNG; preserve input1 aspect ratio and native resolution if supported. Finished full scene/detail, not a character sheet or collage of before/after comparisons.'''
  j={'id':e['id'],'age':e['age'],'kind':e['kind'],'generator':'built-in image_gen','style_revision':'paper-v1','references':refs,'prompt':prompt}
  inv.dump(ROOT/'spec/identity-generation'/inv.REV/(e['id']+'-paper-v1.json'),j)
  jobs.append(j)
 inv.dump(ROOT/'spec'/('sasha-paper-jobs.json'),jobs)
 return jobs

if __name__=='__main__':
 print(json.dumps(build(),ensure_ascii=True))
