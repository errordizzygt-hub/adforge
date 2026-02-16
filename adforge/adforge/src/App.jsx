import { useState, useCallback, useRef } from "react";
import { Upload, Sparkles, Play, Download, ChevronRight, X, Check, Volume2, VolumeX, RefreshCw, Film, Zap, ArrowLeft, AlertCircle, Loader2, Pause } from "lucide-react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#08080a;--surface:#111115;--surface2:#18181f;--border:#2a2a35;
  --gold:#c9a84c;--gold-dim:rgba(201,168,76,0.12);
  --text:#f0ede8;--text-dim:#888890;--text-muted:#444450;
  --red:#e05555;--red-dim:rgba(224,85,85,0.1);
  --green:#5ec47a;--green-dim:rgba(94,196,122,0.1);
  --radius:14px;--radius-sm:8px;
  font-family:'Outfit',sans-serif;
}
body{background:var(--bg);color:var(--text);min-height:100vh;}
.app{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);position:relative;overflow:hidden;}
.app::before{content:'';position:fixed;top:-40%;left:-20%;width:60%;height:80%;background:radial-gradient(ellipse,rgba(201,168,76,0.04) 0%,transparent 70%);pointer-events:none;}
.app::after{content:'';position:fixed;bottom:-30%;right:-10%;width:50%;height:60%;background:radial-gradient(ellipse,rgba(91,156,224,0.03) 0%,transparent 70%);pointer-events:none;}
.header{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2.5rem;border-bottom:1px solid var(--border);position:relative;z-index:10;}
.logo{display:flex;align-items:center;gap:0.6rem;}
.logo-mark{width:32px;height:32px;background:linear-gradient(135deg,var(--gold) 0%,#8a5c1a 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;}
.logo-name{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;letter-spacing:0.02em;}
.logo-name span{color:var(--gold);}
.header-badge{font-family:'DM Mono',monospace;font-size:0.65rem;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(201,168,76,0.3);padding:0.25rem 0.7rem;border-radius:999px;letter-spacing:0.08em;}
.steps-bar{display:flex;align-items:center;justify-content:center;padding:1.5rem 2.5rem 0;position:relative;z-index:10;}
.step-item{display:flex;align-items:center;}
.step-dot{display:flex;align-items:center;gap:0.5rem;padding:0.4rem 1rem;border-radius:999px;transition:all 0.3s;font-size:0.78rem;font-weight:500;letter-spacing:0.03em;white-space:nowrap;}
.step-dot.active{background:var(--gold-dim);color:var(--gold);border:1px solid rgba(201,168,76,0.35);}
.step-dot.done{color:var(--green);}
.step-dot.pending{color:var(--text-muted);}
.step-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-family:'DM Mono',monospace;background:currentColor;color:var(--bg);flex-shrink:0;}
.step-connector{width:40px;height:1px;background:var(--border);margin:0 0.2rem;}
.step-connector.done{background:var(--green);opacity:0.4;}
.main{flex:1;display:flex;flex-direction:column;align-items:center;padding:3rem 2rem 5rem;position:relative;z-index:5;max-width:920px;margin:0 auto;width:100%;}
.step-title{text-align:center;margin-bottom:2.5rem;}
.step-title h2{font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:500;line-height:1.15;margin-bottom:0.5rem;}
.step-title p{color:var(--text-dim);font-size:0.9rem;font-weight:300;}
.gold-text{color:var(--gold);}
.notice{border-radius:var(--radius-sm);padding:0.85rem 1rem;font-size:0.78rem;line-height:1.6;margin-bottom:1rem;display:flex;gap:0.7rem;align-items:flex-start;}
.notice.warn{background:var(--gold-dim);border:1px solid rgba(201,168,76,0.2);color:var(--gold);}
.notice.err{background:var(--red-dim);border:1px solid rgba(224,85,85,0.2);color:var(--red);}
.upload-zone{width:100%;max-width:520px;aspect-ratio:1;border:1.5px dashed var(--border);border-radius:var(--radius);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;background:var(--surface);}
.upload-zone:hover{border-color:var(--gold);background:var(--gold-dim);}
.upload-zone.drag-over{border-color:var(--gold);background:var(--gold-dim);transform:scale(1.01);}
.upload-zone.has-image{border-style:solid;border-color:var(--border);}
.upload-zone img{width:100%;height:100%;object-fit:cover;}
.upload-overlay{position:absolute;inset:0;background:rgba(8,8,10,0.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;opacity:0;transition:opacity 0.2s;}
.upload-zone.has-image:hover .upload-overlay{opacity:1;}
.upload-icon{width:48px;height:48px;background:var(--gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:0.5rem;color:var(--gold);}
.config-grid{display:flex;flex-direction:column;gap:2rem;width:100%;max-width:680px;}
.config-label{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.9rem;display:block;}
.slider-row{display:flex;align-items:center;gap:1rem;}
input[type=range]{width:100%;-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:var(--border);outline:none;cursor:pointer;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:var(--gold);cursor:pointer;box-shadow:0 0 12px rgba(201,168,76,0.5);transition:transform 0.15s;}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2);}
.slider-value{font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:500;color:var(--gold);width:70px;text-align:right;}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;}
.card-opt{padding:1rem 0.75rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;text-align:center;transition:all 0.2s;background:var(--surface);}
.card-opt:hover{border-color:var(--gold);}
.card-opt.selected{border-color:var(--gold);background:var(--gold-dim);}
.card-emoji{font-size:1.5rem;display:block;margin-bottom:0.35rem;}
.card-name{font-size:0.78rem;font-weight:500;}
.card-sub{font-size:0.68rem;color:var(--text-dim);margin-top:0.15rem;font-weight:300;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.input-field{display:flex;flex-direction:column;gap:0.4rem;}
.input-field input{background:var(--surface);border:1.5px solid var(--border);color:var(--text);font-family:'Outfit',sans-serif;font-size:0.85rem;padding:0.65rem 1rem;border-radius:var(--radius-sm);outline:none;transition:border-color 0.2s;width:100%;}
.input-field input:focus{border-color:var(--gold);}
.input-field input::placeholder{color:var(--text-muted);}
.color-row{display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;}
.color-swatch{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all 0.2s;flex-shrink:0;}
.color-swatch.selected{border-color:var(--text);transform:scale(1.15);}
.toggle-row{display:flex;gap:0.75rem;}
.toggle-opt{flex:1;display:flex;align-items:center;gap:0.6rem;padding:0.75rem 1rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;transition:all 0.2s;background:var(--surface);font-size:0.82rem;}
.toggle-opt:hover{border-color:rgba(201,168,76,0.5);}
.toggle-opt.selected{border-color:var(--gold);background:var(--gold-dim);color:var(--gold);}
.gen-layout{display:flex;flex-direction:column;align-items:center;gap:2rem;width:100%;max-width:580px;}
.product-chip{display:flex;align-items:center;gap:1rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:0.75rem 1.25rem;width:100%;}
.product-chip img{width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0;}
.orbit-wrap{position:relative;width:100px;height:100px;}
.orbit-core{position:absolute;inset:50%;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold) 0%,#8a5c1a 100%);display:flex;align-items:center;justify-content:center;}
.orbit-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(201,168,76,0.3);animation:spin 3s linear infinite;}
.orbit-ring::before{content:'';position:absolute;top:-3px;left:50%;width:6px;height:6px;background:var(--gold);border-radius:50%;transform:translateX(-50%);}
.orbit-ring2{animation-duration:2s;animation-direction:reverse;border-color:rgba(91,156,224,0.2);width:80%;height:80%;top:10%;left:10%;}
.orbit-ring2::before{background:#5b9ce0;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.scene-list{display:flex;flex-direction:column;gap:0.6rem;width:100%;}
.scene-row{display:flex;align-items:center;gap:1rem;padding:0.85rem 1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);transition:border-color 0.3s,background 0.3s;}
.scene-row.active{border-color:rgba(201,168,76,0.4);background:var(--gold-dim);}
.scene-row.done{border-color:rgba(94,196,122,0.3);background:var(--green-dim);}
.scene-row.error{border-color:rgba(224,85,85,0.3);background:var(--red-dim);}
.scene-text{flex:1;font-size:0.78rem;color:var(--text-dim);line-height:1.4;}
.scene-row.active .scene-text{color:var(--gold);}
.scene-row.done .scene-text{color:var(--green);}
.scene-detail{font-size:0.7rem;color:var(--text-muted);white-space:nowrap;flex-shrink:0;}
.spin{animation:spin 1s linear infinite;}
.clips-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;}
.clip-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:border-color 0.2s;}
.clip-card:hover{border-color:var(--gold);}
.clip-video-wrap{position:relative;aspect-ratio:16/9;background:#000;overflow:hidden;}
.clip-video-wrap.vertical{aspect-ratio:9/16;}
.clip-video-wrap.square{aspect-ratio:1;}
.clip-video-wrap video{width:100%;height:100%;object-fit:cover;}
.clip-hover{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);opacity:0;transition:opacity 0.2s;}
.clip-card:hover .clip-hover{opacity:1;}
.play-btn{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border:1.5px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;}
.clip-info{padding:0.85rem 1rem;}
.clip-label{font-family:'DM Mono',monospace;font-size:0.65rem;color:var(--gold);margin-bottom:0.3rem;}
.clip-desc{font-size:0.75rem;color:var(--text-dim);line-height:1.4;}
.clip-footer{display:flex;padding:0.6rem 1rem;border-top:1px solid var(--border);}
.script-panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;}
.script-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;flex-wrap:wrap;gap:0.75rem;}
.tab-row{display:flex;gap:0.25rem;background:var(--bg);border-radius:8px;padding:0.25rem;}
.tab{padding:0.35rem 0.85rem;border-radius:6px;font-size:0.75rem;cursor:pointer;transition:all 0.2s;color:var(--text-dim);}
.tab.active{background:var(--surface2);color:var(--text);}
.shot-list{display:flex;flex-direction:column;gap:0.75rem;}
.shot-row{display:flex;gap:1rem;align-items:flex-start;}
.shot-time{font-family:'DM Mono',monospace;font-size:0.65rem;color:var(--gold);background:var(--gold-dim);padding:0.2rem 0.5rem;border-radius:4px;white-space:nowrap;margin-top:0.1rem;flex-shrink:0;}
.shot-text{font-size:0.8rem;line-height:1.55;color:var(--text-dim);}
.prose{font-size:0.82rem;line-height:1.7;color:var(--text-dim);}
.prose strong{color:var(--text);font-weight:500;}
.prose-col{display:flex;flex-direction:column;gap:0.6rem;}
.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.7rem 1.6rem;border-radius:var(--radius-sm);font-family:'Outfit',sans-serif;font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.2s;border:none;outline:none;letter-spacing:0.02em;}
.btn-primary{background:linear-gradient(135deg,var(--gold) 0%,#9a6f20 100%);color:#0a0a0b;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 30px rgba(201,168,76,0.35);}
.btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-secondary{background:var(--surface2);color:var(--text);border:1.5px solid var(--border);}
.btn-secondary:hover{border-color:var(--gold);}
.btn-ghost{background:transparent;color:var(--text-dim);border:1.5px solid transparent;}
.btn-ghost:hover{color:var(--text);border-color:var(--border);}
.btn-sm{padding:0.4rem 0.9rem;font-size:0.75rem;}
.btn-lg{padding:0.9rem 2.2rem;font-size:0.9rem;border-radius:var(--radius);}
.tag{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.72rem;padding:0.25rem 0.7rem;border-radius:999px;}
.tag-gold{background:var(--gold-dim);color:var(--gold);border:1px solid rgba(201,168,76,0.25);}
.format-btn{padding:0.4rem 0.9rem;border-radius:999px;border:1.5px solid var(--border);font-size:0.72rem;cursor:pointer;transition:all 0.2s;background:transparent;color:var(--text-dim);font-family:'Outfit',sans-serif;}
.format-btn:hover{border-color:var(--gold);}
.format-btn.sel{border-color:var(--gold);color:var(--gold);background:var(--gold-dim);}
@media(max-width:600px){
  .grid4{grid-template-columns:1fr 1fr;}
  .grid2{grid-template-columns:1fr;}
  .header{padding:1rem 1.25rem;}
  .main{padding:2rem 1rem 3rem;}
  .step-title h2{font-size:1.8rem;}
  .clips-grid{grid-template-columns:1fr;}
}`;

const MOODS=[
  {id:"luxury",emoji:"✦",name:"Luxury",sub:"Premium feel",style:"cinematic 8K high-end commercial, dramatic rim lighting, luxury product photography, dark background"},
  {id:"clean",emoji:"◻",name:"Minimal",sub:"Clean & simple",style:"clean minimal studio photography, soft diffused light, white neutral background, crisp product focus"},
  {id:"bold",emoji:"⚡",name:"Bold",sub:"High energy",style:"vibrant high-contrast colors, dynamic motion blur, electric atmosphere, high-energy commercial"},
  {id:"playful",emoji:"✿",name:"Playful",sub:"Fun & vibrant",style:"bright colorful lifestyle scene, warm natural light, fun energetic movement, joyful atmosphere"},
];
const PLATFORMS=[
  {id:"instagram",name:"Instagram",ratio:"9:16",runway:"720:1280"},
  {id:"youtube",name:"YouTube",ratio:"16:9",runway:"1280:720"},
  {id:"facebook",name:"Facebook",ratio:"1:1",runway:"960:960"},
  {id:"all",name:"All",ratio:"Multi",runway:"1280:720"},
];
const BRAND_COLORS=["#c9a84c","#e05555","#5ec47a","#5b9ce0","#b05be0","#e07e3a","#3acce0","#f0ede8"];
const CLIP_SEC=10;

export default function AdForge(){
  const[step,setStep]=useState(0);
  const[image,setImage]=useState(null);
  const[imageB64,setImageB64]=useState(null);
  const[imageDataUri,setImageDataUri]=useState(null);
  const[dragOver,setDragOver]=useState(false);
  const fileRef=useRef();
  const[duration,setDuration]=useState(30);
  const[mood,setMood]=useState("luxury");
  const[platforms,setPlatforms]=useState(["all"]);
  const[brandName,setBrandName]=useState("");
  const[slogan,setSlogan]=useState("");
  const[brandColor,setBrandColor]=useState("#c9a84c");
  const[customColor,setCustomColor]=useState("#c9a84c");
  const[narration,setNarration]=useState("voiceover");
  const[adResult,setAdResult]=useState(null);
  const[sceneStatuses,setSceneStatuses]=useState([]);
  const[generatedClips,setGeneratedClips]=useState([]);
  const[genError,setGenError]=useState(null);
  const[scriptTab,setScriptTab]=useState("voiceover");
  const[previewFmt,setPreviewFmt]=useState("youtube");

  const moodObj=MOODS.find(m=>m.id===mood)||MOODS[0];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  const handleFile=useCallback((file)=>{
    if(!file?.type.startsWith("image/"))return;
    setImage(URL.createObjectURL(file));
    const reader=new FileReader();
    reader.onload=e=>{setImageDataUri(e.target.result);setImageB64(e.target.result.split(",")[1]);};
    reader.readAsDataURL(file);
  },[]);

  const togglePlatform=id=>{
    if(id==="all"){setPlatforms(["all"]);return;}
    setPlatforms(prev=>{
      const f=prev.filter(p=>p!=="all");
      if(f.includes(id)){const n=f.filter(p=>p!==id);return n.length?n:["all"];}
      return[...f,id];
    });
  };

  const createTask=async(promptText,ratio)=>{
    const r=await fetch("/api/create-task",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"gen3a_turbo",promptImage:imageDataUri,promptText,duration:CLIP_SEC,ratio})});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||`HTTP ${r.status}`);
    return d.id||d.task_id||d.taskId;
  };

  const pollTask=async(taskId)=>{
    for(let i=0;i<72;i++){
      await sleep(5000+Math.random()*1500);
      const r=await fetch(`/api/poll-task?taskId=${taskId}`);
      if(!r.ok)throw new Error(`Poll error ${r.status}`);
      const d=await r.json();
      if(d.status==="SUCCEEDED")return d.output?.[0]||null;
      if(d.status==="FAILED"||d.status==="CANCELED")throw new Error(`Task ${d.status}: ${d.failure||"unknown"}`);
    }
    throw new Error("Generation timed out");
  };

  const generateAd=async()=>{
    setStep(2);setGenError(null);setGeneratedClips([]);setSceneStatuses([]);
    try{
      setSceneStatuses([{text:"Claude AI — analyzing product & writing ad concept",status:"active"}]);
      const msgs=imageB64
        ?[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imageB64}},{type:"text",text:claudePrompt()}]
        :[{type:"text",text:claudePrompt()}];
      const cr=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:msgs}]})});
      const cd=await cr.json();
      const raw=cd.content?.map(c=>c.text||"").join("")||"";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setAdResult(parsed);
      setSceneStatuses([{text:"Claude AI — analyzing product & writing ad concept",status:"done"}]);

      const shots=(parsed.shots||[]).slice(0,Math.ceil(duration/CLIP_SEC));
      const ratio=getRatio();
      const clips=[];

      for(let i=0;i<shots.length;i++){
        const shot=shots[i];
        setSceneStatuses(prev=>[...prev,{text:`Scene ${i+1} / ${shots.length} · ${shot.time}`,status:"active",detail:"Starting..."}]);
        let videoUrl=null;
        try{
          const prompt=runwayPrompt(shot,parsed);
          setSceneStatuses(prev=>prev.map((s,idx)=>idx===prev.length-1?{...s,detail:"Queued..."}:s));
          const taskId=await createTask(prompt,ratio);
          setSceneStatuses(prev=>prev.map((s,idx)=>idx===prev.length-1?{...s,detail:"Rendering..."}:s));
          videoUrl=await pollTask(taskId);
          setSceneStatuses(prev=>prev.map((s,idx)=>idx===prev.length-1?{...s,status:"done",detail:"Ready ✓"}:s));
        }catch(e){
          setSceneStatuses(prev=>prev.map((s,idx)=>idx===prev.length-1?{...s,status:"error",detail:e.message.slice(0,40)}:s));
        }
        clips.push({index:i,time:shot.time,visual:shot.visual,textOverlay:shot.text,url:videoUrl});
        setGeneratedClips([...clips]);
      }

      const pf=platforms.includes("all")||platforms.includes("youtube")?"youtube":platforms.includes("instagram")?"instagram":platforms.includes("facebook")?"facebook":"youtube";
      setPreviewFmt(pf);
      setStep(3);
    }catch(err){
      setGenError(err.message||"Generation failed.");
    }
  };

  const claudePrompt=()=>`You are an expert advertising creative director. Create a ${duration}-second video ad for this product.
Settings: Duration=${duration}s, Style=${moodObj.name}, Brand=${brandName||"none"}, Slogan=${slogan||"generate"}, Narration=${narration}
Reply ONLY with valid JSON (no markdown fences):
{"productName":"name","headline":"max 8 words","tagline":"max 7 words","voiceover":"${narration==="voiceover"?"full "+duration+"s script":""}","shots":[${Array.from({length:Math.ceil(duration/CLIP_SEC)},(_,i)=>`{"time":"${i*CLIP_SEC}-${Math.min((i+1)*CLIP_SEC,duration)}s","visual":"detailed cinematic shot for Runway AI with camera angle, lighting, motion, mood","text":"on-screen text or empty"}`).join(",")}],"musicMood":"music style","colorPalette":"colors","ctaText":"CTA"}`;

  const runwayPrompt=(shot,ad)=>`${shot.visual}. ${moodObj.style}. ${brandName?`Brand: ${brandName}.`:""} ${ad.tagline?`Tagline: ${ad.tagline}.`:""} No text overlays. Smooth cinematic camera movement. Professional commercial quality.`.trim();

  const getRatio=()=>{const p=platforms[0];if(p==="instagram")return"720:1280";if(p==="facebook")return"960:960";return"1280:720";};
  const aspectClass=()=>{if(previewFmt==="instagram")return"vertical";if(previewFmt==="facebook")return"square";return"";};
  const reset=()=>{setStep(0);setImage(null);setImageB64(null);setImageDataUri(null);setAdResult(null);setGeneratedClips([]);setSceneStatuses([]);};
  const STEPS=["Upload","Configure","Generating","Preview"];

  return(<>
    <style dangerouslySetInnerHTML={{__html:FONTS+CSS}}/>
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-mark"><Film size={16} color="#0a0a0b"/></div>
          <span className="logo-name">Ad<span>Forge</span></span>
        </div>
        <div className="header-badge">RUNWAY GEN-3 · POWERED BY CLAUDE</div>
      </header>
      <div className="steps-bar">
        {STEPS.map((name,i)=>(
          <div className="step-item" key={i}>
            {i>0&&<div className={`step-connector ${i<=step?"done":""}`}/>}
            <div className={`step-dot ${i===step?"active":i<step?"done":"pending"}`}>
              <span className="step-num">{i<step?<Check size={10}/>:i+1}</span>{name}
            </div>
          </div>
        ))}
      </div>
      <main className="main">

        {step===0&&(<>
          <div className="step-title">
            <h2>Upload your <span className="gold-text">product</span></h2>
            <p>A high-quality photo gives the best Runway AI results</p>
          </div>
          <div className={`upload-zone ${dragOver?"drag-over":""} ${image?"has-image":""}`}
            onClick={()=>fileRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}>
            {image?(<>
              <img src={image} alt="Product"/>
              <div className="upload-overlay"><Upload size={22} color="white"/><span style={{fontSize:"0.82rem",color:"white"}}>Change image</span></div>
            </>):(<>
              <div className="upload-icon"><Upload size={22}/></div>
              <span style={{fontWeight:500}}>Drag & drop your product image</span>
              <span style={{color:"var(--text-dim)",fontSize:"0.82rem",marginTop:"0.25rem"}}>or click to browse</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",color:"var(--text-muted)",marginTop:"0.5rem",letterSpacing:"0.06em"}}>JPG · PNG · WEBP · up to 20MB</span>
            </>)}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          <div style={{display:"flex",gap:"1rem",marginTop:"1.5rem"}}>
            <button className="btn btn-primary btn-lg" disabled={!image} onClick={()=>setStep(1)}>Continue <ChevronRight size={16}/></button>
            {image&&<button className="btn btn-ghost btn-lg" onClick={()=>{setImage(null);setImageB64(null);setImageDataUri(null);}}><X size={15}/> Clear</button>}
          </div>
        </>)}

        {step===1&&(<>
          <div className="step-title">
            <h2>Configure your <span className="gold-text">ad</span></h2>
            <p>Customize every detail of your {duration}-second spot</p>
          </div>
          <div className="config-grid">
            <div>
              <span className="config-label">Ad Duration</span>
              <div className="slider-row">
                <div style={{flex:1}}><input type="range" min={10} max={30} step={10} value={duration} onChange={e=>setDuration(Number(e.target.value))}/></div>
                <div className="slider-value">{duration}s</div>
              </div>
              <div style={{fontSize:"0.72rem",color:"var(--text-muted)",marginTop:"0.5rem",fontFamily:"'DM Mono',monospace"}}>
                {Math.ceil(duration/CLIP_SEC)} scene{Math.ceil(duration/CLIP_SEC)>1?"s":""} × 10s each (Runway Gen-3 max per clip)
              </div>
            </div>
            <div>
              <span className="config-label">Style & Mood</span>
              <div className="grid4">
                {MOODS.map(m=>(
                  <div key={m.id} className={`card-opt ${mood===m.id?"selected":""}`} onClick={()=>setMood(m.id)}>
                    <span className="card-emoji">{m.emoji}</span>
                    <div className="card-name">{m.name}</div>
                    <div className="card-sub">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="config-label">Target Platform</span>
              <div className="grid4">
                {PLATFORMS.map(p=>(
                  <div key={p.id} className={`card-opt ${platforms.includes(p.id)?"selected":""}`} onClick={()=>togglePlatform(p.id)}>
                    <div className="card-name">{p.name}</div>
                    <div className="card-sub">{p.ratio}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="config-label">Branding</span>
              <div className="grid2">
                <div className="input-field">
                  <label style={{fontSize:"0.68rem",color:"var(--text-muted)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>BRAND NAME</label>
                  <input type="text" placeholder="e.g. Aurelia" value={brandName} onChange={e=>setBrandName(e.target.value)}/>
                </div>
                <div className="input-field">
                  <label style={{fontSize:"0.68rem",color:"var(--text-muted)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>SLOGAN</label>
                  <input type="text" placeholder="e.g. Born to shine" value={slogan} onChange={e=>setSlogan(e.target.value)}/>
                </div>
              </div>
              <div style={{marginTop:"1rem"}}>
                <span className="config-label">Brand Color</span>
                <div className="color-row">
                  {BRAND_COLORS.map(c=>(
                    <div key={c} className={`color-swatch ${brandColor===c?"selected":""}`} style={{background:c}} onClick={()=>{setBrandColor(c);setCustomColor(c);}}/>
                  ))}
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginLeft:"0.25rem"}}>
                    <div className="color-swatch" style={{background:customColor,border:"2px solid var(--border)"}}/>
                    <input type="text" placeholder="#ffffff" value={customColor} onChange={e=>{setCustomColor(e.target.value);setBrandColor(e.target.value);}} style={{background:"var(--surface)",border:"1.5px solid var(--border)",color:"var(--text)",fontFamily:"'DM Mono',monospace",fontSize:"0.75rem",padding:"0.4rem 0.6rem",borderRadius:"6px",outline:"none",width:"90px"}}/>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="config-label">Narration</span>
              <div className="toggle-row">
                <div className={`toggle-opt ${narration==="voiceover"?"selected":""}`} onClick={()=>setNarration("voiceover")}><Volume2 size={15}/> Voiceover + Music</div>
                <div className={`toggle-opt ${narration==="music"?"selected":""}`} onClick={()=>setNarration("music")}><VolumeX size={15}/> Music Only</div>
              </div>
            </div>
            <div style={{display:"flex",gap:"1rem",paddingTop:"0.5rem"}}>
              <button className="btn btn-ghost" onClick={()=>setStep(0)}><ArrowLeft size={15}/> Back</button>
              <button className="btn btn-primary btn-lg" onClick={generateAd}><Sparkles size={16}/> Generate Ad</button>
            </div>
          </div>
        </>)}

        {step===2&&(<>
          <div className="step-title">
            <h2>Generating your <span className="gold-text">ad</span></h2>
            <p>Creating {Math.ceil(duration/CLIP_SEC)} video clip{Math.ceil(duration/CLIP_SEC)>1?"s":""} via Runway Gen-3 Alpha Turbo</p>
          </div>
          <div className="gen-layout">
            {image&&(
              <div className="product-chip">
                <img src={image} alt="Product"/>
                <div>
                  <div className="tag tag-gold" style={{marginBottom:"0.4rem"}}><Zap size={10}/> {moodObj.name} · {duration}s</div>
                  <div style={{fontSize:"0.78rem",color:"var(--text-dim)"}}>Runway Gen-3 Alpha Turbo</div>
                </div>
              </div>
            )}
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"2rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem",width:"100%"}}>
              <div className="orbit-wrap">
                <div className="orbit-ring orbit-ring2"/>
                <div className="orbit-ring"/>
                <div className="orbit-core"><Sparkles size={16} color="#0a0a0b"/></div>
              </div>
              {genError?(
                <div style={{width:"100%"}}>
                  <div className="notice err"><AlertCircle size={15} style={{flexShrink:0}}/>{genError}</div>
                  <div style={{display:"flex",gap:"0.75rem",marginTop:"0.75rem"}}>
                    <button className="btn btn-primary btn-sm" onClick={generateAd}><RefreshCw size={13}/> Retry</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setStep(1)}><ArrowLeft size={13}/> Back</button>
                  </div>
                </div>
              ):(
                <div className="scene-list">
                  {sceneStatuses.map((s,i)=>(
                    <div key={i} className={`scene-row ${s.status}`}>
                      {s.status==="done"?<Check size={14} style={{color:"var(--green)",flexShrink:0}}/>
                      :s.status==="active"?<Loader2 size={14} className="spin" style={{flexShrink:0}}/>
                      :s.status==="error"?<AlertCircle size={14} style={{color:"var(--red)",flexShrink:0}}/>
                      :<div style={{width:14,height:14,borderRadius:"50%",border:"1.5px solid var(--border)",flexShrink:0}}/>}
                      <div className="scene-text">{s.text}</div>
                      {s.detail&&<div className="scene-detail">{s.detail}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>)}

        {step===3&&adResult&&(<>
          <div className="step-title">
            <h2>Your <span className="gold-text">ad</span> is ready</h2>
            <p>{adResult.productName} · {duration}s · {moodObj.name} · {generatedClips.length} clip{generatedClips.length!==1?"s":""}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",width:"100%",maxWidth:"800px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap"}}>
              <span style={{fontSize:"0.78rem",color:"var(--text-dim)"}}>Preview format:</span>
              {(platforms.includes("all")?["youtube","instagram","facebook"]:platforms).map(p=>(
                <button key={p} className={`format-btn ${previewFmt===p?"sel":""}`} onClick={()=>setPreviewFmt(p)}>
                  {PLATFORMS.find(pl=>pl.id===p)?.name}
                </button>
              ))}
            </div>
            <div className="clips-grid">
              {generatedClips.map(clip=><ClipCard key={clip.index} clip={clip} aspectClass={aspectClass()}/>)}
            </div>
            <div className="script-panel">
              <div className="script-header">
                <div>
                  <div style={{fontSize:"0.75rem",color:"var(--text-dim)",marginBottom:"0.3rem"}}>Ad Package</div>
                  <span className="tag tag-gold"><Sparkles size={10}/>{adResult.tagline}</span>
                </div>
                <div className="tab-row">
                  {["voiceover","shots","details"].map(t=>(
                    <div key={t} className={`tab ${scriptTab===t?"active":""}`} onClick={()=>setScriptTab(t)}>
                      {t.charAt(0).toUpperCase()+t.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
              {scriptTab==="voiceover"&&<div className="prose">{narration==="music"?<em style={{color:"var(--text-muted)"}}>Music only mode</em>:adResult.voiceover}</div>}
              {scriptTab==="shots"&&(
                <div className="shot-list">
                  {(adResult.shots||[]).map((s,i)=>(
                    <div key={i} className="shot-row">
                      <span className="shot-time">{s.time}</span>
                      <div>
                        <div className="shot-text">{s.visual}</div>
                        {s.text&&<div style={{fontSize:"0.75rem",color:"var(--gold)",fontStyle:"italic",marginTop:"0.2rem"}}>"{s.text}"</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {scriptTab==="details"&&(
                <div className="prose prose-col">
                  <div><strong>Headline:</strong> {adResult.headline}</div>
                  <div><strong>CTA:</strong> {adResult.ctaText}</div>
                  <div><strong>Music:</strong> {adResult.musicMood}</div>
                  <div><strong>Colors:</strong> {adResult.colorPalette}</div>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
              <button className="btn btn-primary" onClick={()=>{setStep(1);setAdResult(null);setGeneratedClips([]);setSceneStatuses([]);}}><RefreshCw size={15}/> Regenerate</button>
              <button className="btn btn-ghost" onClick={reset}>New Ad</button>
            </div>
          </div>
        </>)}

      </main>
    </div>
  </>);
}

function ClipCard({clip,aspectClass}){
  const[playing,setPlaying]=useState(false);
  const videoRef=useRef();
  const togglePlay=()=>{
    if(!videoRef.current)return;
    if(playing){videoRef.current.pause();setPlaying(false);}
    else{videoRef.current.play().then(()=>setPlaying(true)).catch(()=>{});}
  };
  return(
    <div className="clip-card">
      <div className={`clip-video-wrap ${aspectClass}`}>
        {clip.url
          ?<video ref={videoRef} src={clip.url} loop playsInline style={{width:"100%",height:"100%",objectFit:"cover"}} onEnded={()=>setPlaying(false)}/>
          :<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#0d0d12,#1a1a24)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}><Film size={28} style={{opacity:0.2}}/><span style={{fontSize:"0.68rem",fontFamily:"'DM Mono',monospace",color:"var(--text-muted)"}}>RENDER FAILED</span></div>}
        <div className="clip-hover">
          {clip.url&&<button className="play-btn" onClick={togglePlay}>{playing?<Pause size={18} color="white"/>:<Play size={18} color="white" fill="white"/>}</button>}
        </div>
      </div>
      <div className="clip-info">
        <div className="clip-label">SCENE {clip.index+1} · {clip.time}</div>
        <div className="clip-desc">{clip.visual?.slice(0,85)}{(clip.visual?.length||0)>85?"…":""}</div>
      </div>
      <div className="clip-footer">
        {clip.url
          ?<a href={clip.url} download={`adforge-scene-${clip.index+1}.mp4`} className="btn btn-sm btn-secondary" style={{flex:1,justifyContent:"center",textDecoration:"none"}}><Download size={13}/> Download</a>
          :<span style={{fontSize:"0.7rem",color:"var(--text-muted)",padding:"0.25rem 0"}}>Scene failed to render</span>}
      </div>
    </div>
  );
}
