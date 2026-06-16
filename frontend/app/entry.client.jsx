import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// #region debug-point B:entry-client-start
fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"B",location:"app/entry.client.jsx:6",msg:"[DEBUG] Entry client module evaluated",data:{},ts:Date.now()})}).catch(()=>{});
window.addEventListener("error",(event)=>{fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"B",location:"app/entry.client.jsx:error",msg:"[DEBUG] Window error event",data:{message:event.message,filename:event.filename,lineno:event.lineno,colno:event.colno},ts:Date.now()})}).catch(()=>{});});
window.addEventListener("unhandledrejection",(event)=>{fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"B",location:"app/entry.client.jsx:rejection",msg:"[DEBUG] Window unhandled rejection",data:{reason:String(event.reason)},ts:Date.now()})}).catch(()=>{});});
// #endregion

startTransition(() => {
  // #region debug-point B:hydrate-start
  fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"B",location:"app/entry.client.jsx:18",msg:"[DEBUG] Hydration start",data:{},ts:Date.now()})}).catch(()=>{});
  // #endregion
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
