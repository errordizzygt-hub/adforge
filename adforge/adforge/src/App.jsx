import { useState, useCallback, useRef } from "react";
import { Upload, Sparkles, ChevronRight, X, Check, Volume2, VolumeX, RefreshCw, Film, ArrowLeft, AlertCircle, Loader2, Copy, CheckCheck } from "lucide-react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`;

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
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
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:var(--gold);cursor:pointer;box-shadow:0 0 12px rgba(201,168,76,0.5);}
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
.toggle-row{display:flex;gap:0.75rem;}
.toggle-opt{flex:1;display:flex;align-items:center;gap:0.6rem;padding:0.75rem 1rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;transition:all 0.2s;background:var(--surface);font-size:0.82rem;}
.toggle-opt.selected{border-color:var(--gold);background:var(--gold-dim);color:var(--gold);}
.gen-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:2.5rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem;width:100%;max-width:520px;}
.orbit-wrap{position:relative;width:100px;height:100px;}
.orbit-core{position:absolute;inset:50%;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold) 0%,#8a5c1a 100%);display:flex;align-items:center;justify-content:center;}
.orbit-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(201,168,76,0.3);animation:spin 3s linear infinite;}
.orbit-ring::before{content:'';position:absolute;top:-3px;left:50%;width:6px;height:6px;background:var(--gold);border-radius:50%;transform:translateX(-50%);}
.orbit-ring2{animation-duration:2s;animation-direction:reverse;border-color:rgba(91,156,224,0.2);width:80%;height:80%;top:10%;left:10%;}
.orbit-ring2::before{background:#5b9ce0;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.spin{animation:spin 1s linear infinite;}
.notice{border-radius:var(--radius-sm);padding:0.85rem 1rem;font-size:0.78rem;line-height:1.6;display:flex;gap:0.7rem;align-items:flex-start;}
.notice.err{background:var(--red-dim);border:1px solid rgba(224,85,85,0.2);color:var(--red);}

/* RESULTS */
.results{display:flex;flex-direction:column;gap:1.5rem;width:100%;}
.hero-card{background:linear-gradient(135deg,var(--surface) 0%,#0d0d12 100%);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.hero-inner{display:grid;grid-template-columns:1fr 2fr;gap:0;}
.hero-img{aspect-ratio:1;overflow:hidden;position:relative;}
.hero-img img{width:100%;height:100%;object-fit:cover;}
.hero-img-overlay{position:absolute;inset:0;background:linear-gradient(to right,transparent 60%,var(--surface));}
.hero-text{padding:2rem 2rem 2rem 1rem;display:flex;flex-direction:column;justify-content:center;gap:0.75rem;}
.hero-badge{display:inline-flex;align-items:center;gap:0.4rem;font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:0.1em;color:var(--gold);background:var(--gold-dim);border:1px solid rgba(201,168,76,0.25);padding:0.2rem 0.6rem;border-radius:999px;width:fit-content;}
.hero-headline{font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:600;line-height:1.2;color:var(--text);}
.hero-tagline{font-size:0.9rem;color:var(--gold);font-style:italic;font-weight:300;}
.hero-cta{display:inline-flex;align-items:center;gap:0.5rem;margin-top:0.5rem;font-size:0.78rem;font-weight:600;color:var(--bg);background:linear-gradient(135deg,var(--gold),#9a6f20);padding:0.5rem 1.2rem;border-radius:999px;width:fit-content;letter-spacing:0.04em;}

.panels{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1.25rem;}
.panel-label{font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:0.1em;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.75rem;}
.panel-text{font-size:0.82rem;line-height:1.7;color:var(--text-dim);}

.storyboard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1.25rem;}
.storyboard-label{font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:0.1em;color:var(--text-muted);text-transform:uppercase;margin-bottom:1rem;}
.shots{display:flex;flex-direction:column;gap:0.75rem;}
.shot{display:flex;gap:1rem;align-items:flex-start;}
.shot-frame{width:60px;height:40px;border-radius:6px;overflow:hidden;flex-shrink:0;position:relative;background:#0d0d12;border:1px solid var(--border);}
.shot-frame img{width:100%;height:100%;object-fit:cover;opacity:0.7;}
.shot-frame-num{position:absolute;bottom:2px;right:4px;font-family:'DM Mono',monospace;font-size:0.5rem;color:var(--gold);}
.shot-time{font-family:'DM Mono',monospace;font-size:0.65rem;color:var(--gold);background:var(--gold-dim);padding:0.15rem 0.45rem;border-radius:4px;white-space:nowrap;flex-shrink:0;margin-top:0.1rem;}
.shot-desc{font-size:0.78rem;line-height:1.5;color:var(--text-dim);flex:1;}
.shot-overlay-text{font-size:0.7rem;color:var(--gold);font-style:italic;margin-top:0.2rem;}

.copy-panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1.25rem;}
.copy-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;}
.copy-btn{display:flex;align-items:center;gap:0.4rem;font-size:0.72rem;color:var(--text-muted);cursor:pointer;background:none;border:1px solid var(--border);padding:0.3rem 0.7rem;border-radius:999px;font-family:'Outfit',sans-serif;transition:all 0.2s;}
.copy-btn:hover{border-color:var(--gold);color:var(--gold);}
.voiceover-text{font-size:0.82rem;line-height:1.8;color:var(--text-dim);font-style:italic;}

.details-row{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;}
.detail-chip{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:0.85rem;text-align:center;}
.detail-chip-label{font-family:'DM Mono',monospace;font-size:0.55rem;letter-spacing:0.1em;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.3rem;}
.detail-chip-value{font-size:0.78rem;color:var(--text);font-weight:500;}

.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.7rem 1.6rem;border-radius:var(--radius-sm);font-family:'Outfit',sans-serif;font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.2s;border:none;outline:none;}
.btn-primary{background:linear-gradient(135deg,var(--gold) 0%,#9a6f20 100%);color:#0a0a0b;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 30px rgba(201,168,76,0.35);}
.btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
.btn-ghost{background:transparent;color:var(--text-dim);border:1.5px solid var(--border);}
.btn-ghost:hover{color:var(--text);border-color:var(--gold);}
.btn-lg{padding:0.9rem 2.2rem;font-size:0.9rem;border-radius:var(--radius);}

@media(max-width:600px){
  .grid4{grid-template-columns:1fr 1fr;}
  .grid2{grid-template-columns:1fr;}
  .panels{grid-template-columns:1fr;}
  .hero-inner{grid-template-columns:1fr;}
  .hero-img{aspect-ratio:16/9;}
  .hero-img-overlay{background:linear-gradient(to bottom,transparent 60%,var(--surface));}
  .details-row{grid-template-columns:1fr 1fr;}
  .header{padding:1rem 1.25rem;}
  .main{padding:2rem 1rem 3rem;}
  .step-title h2{font-size:1.8rem;}
}`;

const MOODS=[
  {id:"luxury",emoji:"✦",name:"Luxury",sub:"Premium feel"},
  {id:"clean",emoji:"◻",name:"Minimal",sub:"Clean & simple"},
  {id:"bold",emoji:"⚡",name:"Bold",sub:"High energy"},
  {id:"playful",emoji:"✿",name:"Playful",sub:"Fun & vibrant"},
];
const PLATFORMS=[
  {id:"instagram",name:"Instagram",ratio:"9:16"},
  {id:"youtube",name:"YouTube",ratio:"16:9"},
  {id:"facebook",name:"Facebook",ratio:"1:1"},
  {id:"all",name:"All Platforms",ratio:"Multi"},
];

export default function AdForge(){
  const[step,setStep]=useState(0);
  const[image,setImage]=useState(null);
  const[dragOver,setDragOver]=useState(false);
  const fileRef=useRef();
  const[duration,setDuration]=useState(30);
  const[mood,setMood]=useState("luxury");
  const[platforms,setPlatforms]=useState(["all"]);
  const[brandName,setBrandName]=useState("");
  const[slogan,setSlogan]=useState("");
  const[narration,setNarration]=useState("voiceover");
  const[adResult,setAdResult]=useState(null);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);
  const[copied,setCopied]=useState(false);

  const moodObj=MOODS.find(m=>m.id===mood)||MOODS[0];

  const handleFile=useCallback((file)=>{
    if(!file?.type.startsWith("image/"))return;
    setImage(URL.createObjectURL(file));
  },[]);

  const togglePlatform=id=>{
    if(id==="all"){setPlatforms(["all"]);return;}
    setPlatforms(prev=>{
      const f=prev.filter(p=>p!=="all");
      if(f.includes(id)){const n=f.filter(p=>p!==id);return n.length?n:["all"];}
      return[...f,id];
    });
  };

  const generateAd=async()=>{
    setStep(2);setError(null);setAdResult(null);setLoading(true);
    try{
      const platformList=platforms.includes("all")?"Instagram, YouTube, Facebook":platforms.join(", ");
      const prompt=`You are an expert advertising creative director. Create a ${duration}-second video ad package.

Product: ${brandName||"the product in mind"}
Brand name: ${brandName||"generate a fitting brand name"}
Slogan: ${slogan||"generate a compelling slogan"}
Style: ${moodObj.name}
Platforms: ${platformList}
Narration: ${narration==="voiceover"?"Voiceover with music":"Music only"}

Reply ONLY with valid JSON, no markdown, no extra text:
{
  "productName": "product name",
  "brandName": "brand name",
  "headline": "powerful headline max 8 words",
  "tagline": "memorable tagline max 7 words",
  "voiceover": "${narration==="voiceover"?"full "+duration+" second voiceover script":"(music only - no voiceover)"}",
  "shots": [
    {"time":"0-10s","visual":"detailed shot description with camera angle, lighting, motion","text":"on-screen text or empty"},
    {"time":"10-20s","visual":"detailed shot description","text":"on-screen text or empty"},
    {"time":"20-30s","visual":"detailed shot description with CTA","text":"on-screen text or empty"}
  ],
  "musicMood": "specific music style and mood description",
  "colorPalette": "3 specific colors with names",
  "ctaText": "call to action text",
  "productDescription": "2 sentence description of the product being advertised"
}`;

      const cr=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const cd=await cr.json();
      if(cd.error)throw new Error(cd.error.message||cd.error);
      const raw=cd.content?.map(c=>c.text||"").join("")||"";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setAdResult(parsed);
      setStep(3);
    }catch(err){
      setError(err.message||"Generation failed. Please try again.");
      setStep(2);
    }finally{
      setLoading(false);
    }
  };

  const copyVoiceover=()=>{
    if(!adResult?.voiceover)return;
    navigator.clipboard.writeText(adResult.voiceover);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  const reset=()=>{setStep(0);setImage(null);setAdResult(null);setError(null);};
  const STEPS=["Upload","Configure","Generating","Ad Package"];

  return(<>
    <style dangerouslySetInnerHTML={{__html:FONTS+CSS}}/>
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-mark"><Film size={16} color="#0a0a0b"/></div>
          <span className="logo-name">Ad<span>Forge</span></span>
        </div>
        <div className="header-badge">POWERED BY CLAUDE AI · FREE</div>
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
            <p>Claude AI will write your complete ad package</p>
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
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",color:"var(--text-muted)",marginTop:"0.5rem"}}>JPG · PNG · WEBP</span>
            </>)}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          <div style={{display:"flex",gap:"1rem",marginTop:"1.5rem"}}>
            <button className="btn btn-primary btn-lg" onClick={()=>setStep(1)}>Continue <ChevronRight size={16}/></button>
            {image&&<button className="btn btn-ghost btn-lg" onClick={()=>setImage(null)}><X size={15}/> Clear</button>}
          </div>
          <p style={{fontSize:"0.75rem",color:"var(--text-muted)",marginTop:"1rem"}}>No image? No problem — Claude will imagine a great product!</p>
        </>)}

        {step===1&&(<>
          <div className="step-title">
            <h2>Configure your <span className="gold-text">ad</span></h2>
            <p>Tell Claude what kind of ad to create</p>
          </div>
          <div className="config-grid">
            <div>
              <span className="config-label">Ad Duration</span>
              <div className="slider-row">
                <div style={{flex:1}}><input type="range" min={10} max={30} step={10} value={duration} onChange={e=>setDuration(Number(e.target.value))}/></div>
                <div className="slider-value">{duration}s</div>
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
                  <label style={{fontSize:"0.68rem",color:"var(--text-muted)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>SLOGAN (optional)</label>
                  <input type="text" placeholder="e.g. Born to shine" value={slogan} onChange={e=>setSlogan(e.target.value)}/>
                </div>
              </div>
            </div>
            <div>
              <span className="config-label">Narration Style</span>
              <div className="toggle-row">
                <div className={`toggle-opt ${narration==="voiceover"?"selected":""}`} onClick={()=>setNarration("voiceover")}><Volume2 size={15}/> Voiceover + Music</div>
                <div className={`toggle-opt ${narration==="music"?"selected":""}`} onClick={()=>setNarration("music")}><VolumeX size={15}/> Music Only</div>
              </div>
            </div>
            <div style={{display:"flex",gap:"1rem",paddingTop:"0.5rem"}}>
              <button className="btn btn-ghost" onClick={()=>setStep(0)}><ArrowLeft size={15}/> Back</button>
              <button className="btn btn-primary btn-lg" onClick={generateAd}><Sparkles size={16}/> Generate Ad Package</button>
            </div>
          </div>
        </>)}

        {step===2&&(<>
          <div className="step-title">
            <h2>Creating your <span className="gold-text">ad</span></h2>
            <p>Claude is writing your complete ad package</p>
          </div>
          <div className="gen-box">
            <div className="orbit-wrap">
              <div className="orbit-ring orbit-ring2"/>
              <div className="orbit-ring"/>
              <div className="orbit-core"><Sparkles size={16} color="#0a0a0b"/></div>
            </div>
            {loading&&<div style={{fontSize:"0.85rem",color:"var(--text-dim)",textAlign:"center"}}>Writing your headline, storyboard,<br/>voiceover script & production notes...</div>}
            {error&&(<>
              <div className="notice err" style={{width:"100%"}}><AlertCircle size={15} style={{flexShrink:0}}/>{error}</div>
              <div style={{display:"flex",gap:"0.75rem"}}>
                <button className="btn btn-primary" onClick={generateAd}><RefreshCw size={13}/> Retry</button>
                <button className="btn btn-ghost" onClick={()=>setStep(1)}><ArrowLeft size={13}/> Back</button>
              </div>
            </>)}
          </div>
        </>)}

        {step===3&&adResult&&(<>
          <div className="step-title">
            <h2>Your <span className="gold-text">ad package</span> is ready</h2>
            <p>{adResult.brandName} · {duration}s · {moodObj.name}</p>
          </div>
          <div className="results">

            {/* Hero card */}
            <div className="hero-card">
              <div className="hero-inner">
                {image&&(
                  <div className="hero-img">
                    <img src={image} alt="Product"/>
                    <div className="hero-img-overlay"/>
                  </div>
                )}
                <div className="hero-text" style={!image?{gridColumn:"1/-1",padding:"2rem"}:{}}>
                  <div className="hero-badge"><Sparkles size={8}/> {moodObj.name.toUpperCase()} · {duration}S AD</div>
                  <div className="hero-headline">{adResult.headline}</div>
                  <div className="hero-tagline">"{adResult.tagline}"</div>
                  <div style={{fontSize:"0.78rem",color:"var(--text-dim)",lineHeight:1.6}}>{adResult.productDescription}</div>
                  <div className="hero-cta">{adResult.ctaText} →</div>
                </div>
              </div>
            </div>

            {/* Storyboard */}
            <div className="storyboard">
              <div className="storyboard-label">Shot-by-Shot Storyboard</div>
              <div className="shots">
                {(adResult.shots||[]).map((s,i)=>(
                  <div key={i} className="shot">
                    <div className="shot-frame">
                      {image&&<img src={image} alt=""/>}
                      <div className="shot-frame-num">#{i+1}</div>
                    </div>
                    <span className="shot-time">{s.time}</span>
                    <div style={{flex:1}}>
                      <div className="shot-desc">{s.visual}</div>
                      {s.text&&<div className="shot-overlay-text">Text overlay: "{s.text}"</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voiceover */}
            {narration==="voiceover"&&adResult.voiceover&&(
              <div className="copy-panel">
                <div className="copy-header">
                  <span className="config-label" style={{margin:0}}>Voiceover Script</span>
                  <button className="copy-btn" onClick={copyVoiceover}>
                    {copied?<><CheckCheck size={12}/> Copied!</>:<><Copy size={12}/> Copy</>}
                  </button>
                </div>
                <div className="voiceover-text">"{adResult.voiceover}"</div>
              </div>
            )}

            {/* Details */}
            <div className="panels">
              <div className="panel">
                <div className="panel-label">Music Direction</div>
                <div className="panel-text">{adResult.musicMood}</div>
              </div>
              <div className="panel">
                <div className="panel-label">Color Palette</div>
                <div className="panel-text">{adResult.colorPalette}</div>
              </div>
            </div>

            <div className="details-row">
              <div className="detail-chip">
                <div className="detail-chip-label">Duration</div>
                <div className="detail-chip-value">{duration} seconds</div>
              </div>
              <div className="detail-chip">
                <div className="detail-chip-label">Style</div>
                <div className="detail-chip-value">{moodObj.name}</div>
              </div>
              <div className="detail-chip">
                <div className="detail-chip-label">CTA</div>
                <div className="detail-chip-value">{adResult.ctaText}</div>
              </div>
            </div>

            <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",paddingTop:"0.5rem"}}>
              <button className="btn btn-primary" onClick={generateAd}><RefreshCw size={15}/> Regenerate</button>
              <button className="btn btn-ghost" onClick={()=>setStep(1)}><ArrowLeft size={15}/> Reconfigure</button>
              <button className="btn btn-ghost" onClick={reset}>New Ad</button>
            </div>
          </div>
        </>)}

      </main>
    </div>
  </>);
}
