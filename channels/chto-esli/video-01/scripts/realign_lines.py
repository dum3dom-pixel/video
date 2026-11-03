"""Re-aligns script lines (assets/voice-eleven/lines-v6.json) to the whisper word stream with a global word-level DP.
Whisper writes numbers as digits, so digit tokens are expanded to Russian number words first; matching is fuzzy.
Writes new 'start' (and est flag) into lines-v6.json. Usage (from video-01): python -X utf8 scripts/realign_lines.py"""
import difflib, json, re, sys
U='ноль один два три четыре пять шесть семь восемь девять'.split()
T10='десять одиннадцать двенадцать тринадцать четырнадцать пятнадцать шестнадцать семнадцать восемнадцать девятнадцать'.split()
TENS='_ _ двадцать тридцать сорок пятьдесят шестьдесят семьдесят восемьдесят девяносто'.split()
HUN='_ сто двести триста четыреста пятьсот шестьсот семьсот восемьсот девятьсот'.split()
def num(n):
    if n<10:return [U[n]]
    if n<20:return [T10[n-10]]
    if n<100:return [TENS[n//10]]+([U[n%10]] if n%10 else [])
    if n<1000:return [HUN[n//100]]+(num(n%100) if n%100 else [])
    th=n//1000
    t={1:['тысяча'],2:['две','тысячи']}.get(th, num(th)+['тысяч'])
    return t+(num(n%1000) if n%1000 else [])
cl=lambda s:re.sub(r'[^а-яa-z0-9]','',s.lower().replace('ё','е'))
sim=lambda a,b:difflib.SequenceMatcher(None,a,b).ratio()
p='assets/voice-eleven/lines-v6.json'
L=json.load(open(p,encoding='utf-8'))
W=json.load(open('assets/voice-eleven/whisper-medium.json',encoding='utf-8'))
wh=[]
for s in W['segments']:
    for w in s['words']:
        t=cl(w['w'])
        if not t:continue
        if t.isdigit():
            ws=num(int(t)); n=len(ws)
            for k,x in enumerate(ws): wh.append((w['s']+(w['e']-w['s'])*k/n,x))
        else: wh.append((w['s'],t))
sc=[];own=[]
for i,l in enumerate(L):
    for x in l['text'].split():
        t=cl(x)
        if t: sc.append(t);own.append(i)
n,m=len(sc),len(wh)
MATCH,MIS,GAP=2.0,-1.2,-1.0
import array
score=[array.array('f',[0])*(m+1) for _ in range(n+1)]
bt=[bytearray(m+1) for _ in range(n+1)]
for j in range(1,m+1):score[0][j]=j*GAP;bt[0][j]=2
for i in range(1,n+1):score[i][0]=i*GAP;bt[i][0]=1
for i in range(1,n+1):
    a=sc[i-1];si=score[i];sp=score[i-1];b=bt[i]
    for j in range(1,m+1):
        s=sim(a,wh[j-1][1]) if (abs(len(a)-len(wh[j-1][1]))<5 and a[:1]==wh[j-1][1][:1] or a==wh[j-1][1]) else 0
        d=sp[j-1]+(MATCH if s>=.75 else MIS)
        u=sp[j]+GAP; l_=si[j-1]+GAP
        best=max(d,u,l_)
        si[j]=best;b[j]=0 if best==d else (1 if best==u else 2)
i,j=n,m;mapped={}
while i>0 and j>0:
    c=bt[i][j]
    if c==0:
        if sim(sc[i-1],wh[j-1][1])>=.75 and (abs(len(sc[i-1])-len(wh[j-1][1]))<5):mapped[i-1]=wh[j-1][0]
        i-=1;j-=1
    elif c==1:i-=1
    else:j-=1
starts=[];est=[]
for li in range(len(L)):
    idx=[k for k in range(n) if own[k]==li and k in mapped]
    if idx:starts.append(min(mapped[k] for k in idx));est.append(False)
    else:starts.append(None);est.append(True)
LAST_RECORDED=160  # lines after this are not in the recording (none now: roger + tail cover 0-160)
for k in range(LAST_RECORDED+1,len(starts)):starts[k]=None
# fill unmapped by interpolation, keep monotonic
for k in range(len(starts)):
    if starts[k] is None:
        a=max((q for q in range(k) if starts[q] is not None),default=None)
        b=min((q for q in range(k+1,len(starts)) if starts[q] is not None),default=None)
        if a is None:starts[k]=0.0
        elif b is None:starts[k]=W['duration']+.01*(k-a)  # tail missing from the recording: park after the end
        else:starts[k]=starts[a]+(starts[b]-starts[a])*(k-a)/(b-a)
for k in range(1,len(starts)):
    if starts[k]<=starts[k-1]:print('non-monotonic',k,starts[k-1],starts[k])
old=[l['start'] for l in L]
for k,l in enumerate(L):l['start']=round(starts[k],2);l['est']=est[k]
json.dump(L,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('unmapped lines',[k for k,e in enumerate(est) if e])
print('changed >0.4s:',[(k,round(old[k],1),round(starts[k],1)) for k in range(len(L)) if abs(old[k]-starts[k])>.4])
