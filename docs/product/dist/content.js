let e=null;chrome.runtime.onMessage.addListener((o,r,n)=>{o.type==="SASS_RESULT"?d(o.originalText,o.sassyText):o.type==="SASS_ERROR"&&l(o.error)});function i(o){o.key==="Escape"&&t()}function d(o,r){t();const n=window.getSelection();if(n.rangeCount===0)return;const s=n.getRangeAt(0).getBoundingClientRect();e=document.createElement("div"),e.id="sassy-overlay",e.style.cssText=`
    position: fixed;
    top: ${s.bottom+window.scrollY+10}px;
    left: ${s.left+window.scrollX}px;
    z-index: 10000;
    max-width: 320px;
    background: #18181b;
    border: 1.5px solid #6366f1;
    border-radius: 14px;
    padding: 18px 20px 16px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: #e5e7eb;
    backdrop-filter: blur(6px);
    transition: box-shadow 0.2s;
  `,e.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="font-weight: 700; color: #6366f1; font-size: 18px; letter-spacing: 1px;">✨</div>
      <button id="close-overlay" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #a1a1aa; transition: color 0.2s;">×</button>
    </div>
    <div style="font-weight: 500; color: #e5e7eb; padding: 4px 0 0 0; font-size: 16px; letter-spacing: 0.2px;">${r}</div>
  `,document.body.appendChild(e),document.getElementById("close-overlay").addEventListener("click",t),document.addEventListener("keydown",i)}function l(o){t(),e=document.createElement("div"),e.id="sassy-overlay",e.style.cssText=`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    max-width: 320px;
    background: #18181b;
    border: 1.5px solid #ef4444;
    border-radius: 14px;
    padding: 18px 20px 16px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 15px;
    color: #e5e7eb;
    backdrop-filter: blur(6px);
    transition: box-shadow 0.2s;
  `,e.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="font-weight: 700; color: #ef4444; font-size: 18px; letter-spacing: 1px;">⚠️ Error</div>
      <button id="close-overlay" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #a1a1aa; transition: color 0.2s;">×</button>
    </div>
    <div style="color: #e5e7eb; padding: 4px 0 0 0; font-size: 16px; letter-spacing: 0.2px;">${o}</div>
  `,document.body.appendChild(e),document.getElementById("close-overlay").addEventListener("click",t),document.addEventListener("keydown",i)}function t(){e&&(e.remove(),e=null,document.removeEventListener("keydown",i))}
