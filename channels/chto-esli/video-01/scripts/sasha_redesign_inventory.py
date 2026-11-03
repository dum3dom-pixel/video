"""Inventory and file bookkeeping for the approved Sasha migration; no image generation."""
import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
REV = 'sasha-redesign-2026-11-03'
SPEC = ROOT / 'spec' / (REV + '.json')
BACKUP = ASSETS / 'identity-review' / 'before' / REV
APPROVED = ASSETS / 'experiments/sasha-killua-2026-11-03/sasha_redesign_B_killua_ash_silver.png'

GROUPS = [
    ('12–13 лет: лицо и фигура', 12, '''p4_sasha h_sasha_palm h_sasha_eyes_cu k_sasha_table r_adults_soup e1_mama_bread e1_papa_pan e1_papa_lowers e1_cocoa e1_clock_ten e1_school_board e1_plan_night e1_lights_out e2_try_mama e2_try_teacher e2_try_dimka e2_stairs e2_kostya_room e2_kostya_gives e2_market e2_labels e2_recording e3_bed_edge e3_bench e3b_computer e3b_gena e3b_library e3b_notebooks e5_garage e5_burn pv_b_boy'''),
    ('15 лет: лицо и фигура', 15, '''e4_straight_a e4_warn_kitchen e4_cassette_night e4_briefcase e4_silent_dinner e4_winter_fork e4b_pc_floor e5_sundays'''),
    ('18–22 года: лицо и фигура', 19, '''e5_spring_2011 e5_night_tape m_graduation m_dimka_phone m_kostya_car m_varya_call'''),
    ('26–33 года: лицо и фигура', 33, '''e6_terrace e6_cups e6_station e2_life_bus e2_life_work t_night_kitchen t_old_night t_realize_cu f_kostya_door f_kostya_frown f_player f_pat f_recording'''),
    ('Крупные планы рук, тела и POV', 12, '''h_sasha_hands_cu e1_oilcloth e1_plan_sheet e2_rec_keys e3b_fractions_cu pv_a_deck pv_c_plan e1_videocall e2_2024_night e2_life_sofa e5_iron_palm_cu f_rec_keys e6_dishes'''),
]
SELECTED_V2 = {'k_sasha_table', 'e1_school_board', 'e2_try_mama', 'e2_try_teacher', 'm_graduation', 'm_varya_call', 'e2_life_work'}
AGES = {'e5_garage':13, 'e5_burn':13, 'e5_spring_2011':18, 'e5_night_tape':18, 'm_graduation':18, 'm_dimka_phone':19, 'm_kostya_car':20, 'm_varya_call':22, 'e6_terrace':26, 'e6_cups':26, 'e6_station':26, 'e6_dishes':26, 't_night_kitchen':31, 't_old_night':31, 't_realize_cu':31, 'e1_videocall':33, 'e2_2024_night':31, 'e2_life_sofa':33, 'e5_iron_palm_cu':18, 'f_rec_keys':33}

def dump(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def aliases(folder, stem):
    return sorted([p for p in (ASSETS/folder).glob(stem+'*.png') if re.fullmatch(re.escape(stem)+r'(?:_hd|_rerender-preview|-v\d+|-alt|-try|-distinct-v3)?\.png',p.name)])

def create():
    if SPEC.exists():
        return json.loads(SPEC.read_text(encoding='utf-8'))
    old = json.loads((ROOT/'generation-log-v5.json').read_text(encoding='utf-8-sig'))['assets']
    descriptions={}
    for a in old:
        descriptions.setdefault(a['id'],a.get('prompt','').split('\n\n')[0])
    entries=[]
    for stem in ['sasha_sheet','sasha_ages_sheet','sasha_faces_sheet']:
        paths=aliases('sheets',stem)
        entries.append({'id':stem,'group':'Основные листы','kind':'sheet','age':12,'source':'assets/sheets/'+stem+'.png','destinations':[str(p.relative_to(ROOT)).replace('\\','/') for p in paths], 'status':'pending'})
    for group, age, ids in GROUPS:
        for stem in ids.split():
            paths=aliases('shots',stem)
            selected=ASSETS/'shots'/(stem+('-v2' if stem in SELECTED_V2 else '')+'.png')
            assert selected.exists(),selected
            entries.append({'id':stem,'group':group,'kind':'detail' if group.startswith('Крупные') else 'scene','age':AGES.get(stem,age),'source':str(selected.relative_to(ROOT)).replace('\\','/'),'destinations':[str(p.relative_to(ROOT)).replace('\\','/') for p in paths],'description':descriptions.get(stem,''),'status':'pending'})
    for e in entries:
        for path in e['destinations']:
            src=ROOT/path; dest=BACKUP/Path(path).relative_to('assets')
            dest.parent.mkdir(parents=True,exist_ok=True)
            if not dest.exists(): shutil.copy2(src,dest)
    # Also preserve the complete source documents before publishing the new canon.
    for src in [ROOT.parent/'CHARACTER-STYLE.md',ROOT/'spec/assets-manifest.json']:
        dest=BACKUP/'documents'/src.name;dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists():shutil.copy2(src,dest)
    data={'revision':REV,'generator':'built-in image_gen','approved_reference':str(APPROVED.relative_to(ROOT)).replace('\\','/'),'scope':'All Sasha source sheets and scene/detail assets under this video. Aliases share one replacement; historical renders, thumbnails, experiments, before/trials archives and other projects excluded.','excluded':'Other characters, empty backgrounds, scenes with no Sasha (e3_fallen, e4_car_taken, e4_flash_papers, e4_papa_look_cu, e6_lena_cup_cu, f_last_tape, etc.), rendered MP4 and cover thumbnails.','entries':entries}
    dump(SPEC,data)
    refresh(data)
    return data

def refresh(data):
    rows=['# Перерисовка Саши: новый образ в бумажно-картонном стиле','',
          'Эталон: `'+data['approved_reference']+'`. Материал — единый многослойный бумажно-картонный коллаж проекта: волокна, неровные края, короткие контактные тени, без чёрной обводки и гладкой аниме-заливки. Волосы светлые пепельно-бежевые; серо-бирюзовые глаза, острый растрёпанный силуэт. Детский образ: оливковая футболка поверх кремовой водолазки, тёмные шорты, бирюзовые ботинки. Взрослые версии сохраняют возраст и сюжетную одежду.','',
          'Считаются самостоятельные композиции, а не дубли PNG, HD-копии или монтажные повторы. Исходники сохранены в `assets/identity-review/before/'+REV+'/`. Старые MP4, превью, эксперименты и другие каналы не входят в замену.','']
    entries=data['entries']
    groups=list(dict.fromkeys(e['group'] for e in entries))
    rows += ['| Группа | Количество | Готово |','|---|---:|---:|']
    for group in groups:
        items=[e for e in entries if e['group']==group]
        rows.append(f"| {group} | {len(items)} | {sum(e['status']=='installed' for e in items)} |")
    rows+=['',f"Итого: **{len(entries)} композиций**, **{sum(len(e['destinations']) for e in entries)} файлов с учётом версий и дублей**.",'',
           '| № | Ассет | Возраст | Статус | Подключённые файлы |','|---:|---|---|---|---|']
    for i,e in enumerate(entries,1):
        status={'pending':'В очереди','installed':'Готово','generated':'Сгенерирован, проверяется','needs_fix':'Нужна правка'}.get(e['status'],e['status'])
        rows.append(f"| {i} | `{e['id']}` | {e['age']} | {status} | "+', '.join('`'+x+'`' for x in e['destinations'])+' |')
    (ROOT/'SASHA-REDESIGN.md').write_text('\n'.join(rows)+'\n',encoding='utf-8')
    data['counts']={'compositions':len(entries),'files':sum(len(e['destinations']) for e in entries),'installed':sum(e['status']=='installed' for e in entries)}
    dump(SPEC,data)

def install(asset_id, source):
    from PIL import Image
    data=create();e=next(x for x in data['entries'] if x['id']==asset_id)
    source=Path(source)
    with Image.open(source) as im:
        im.verify()
    with Image.open(source) as im:
        info={'width':im.width,'height':im.height,'mode':im.mode,'bytes':source.stat().st_size,'sha256':sha(source)}
    # Every installed alias was backed up by create() before the first mutation.
    for path in e['destinations']:
        shutil.copy2(source,ROOT/path)
    selected=ASSETS/('sheets' if e['kind']=='sheet' else 'shots')/(asset_id+'-paper-v1.png')
    shutil.copy2(source,selected)
    e.update(status='installed',generated_source=str(source),selected=str(selected.relative_to(ROOT)).replace('\\','/'),verification=info,review='Visually inspected before installation. Check action, Sasha identity/age, other cast and scene preservation; no added labels.')
    if e.get('issue'):
        e.setdefault('resolved_issues',[]).append(e.pop('issue'))
    e.pop('trial_source',None)
    refresh(data)
    return info

if __name__=='__main__':
    import sys
    if len(sys.argv)==4 and sys.argv[1]=='install':
        print(json.dumps(install(sys.argv[2],sys.argv[3]),ensure_ascii=False))
    else:
        data=create()
        print(json.dumps({'counts':data['counts'],'groups':{g:sum(e['group']==g for e in data['entries']) for g in dict.fromkeys(e['group'] for e in data['entries'])}},ensure_ascii=False))
