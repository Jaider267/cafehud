import App from "../../src/App.jsx";

export default function Component() {
  // #region debug-point C:catchall-render
  fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"C",location:"app/routes/catchall.jsx:4",msg:"[DEBUG] Catchall route render",data:{},ts:Date.now()})}).catch(()=>{});
  // #endregion
  return <App />;
}
