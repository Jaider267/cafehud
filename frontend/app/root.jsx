import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "../src/index.css";

export function Layout({ children }) {
  // #region debug-point A:root-layout
  fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"A",location:"app/root.jsx:11",msg:"[DEBUG] Root layout render",data:{hasChildren:Boolean(children)},ts:Date.now()})}).catch(()=>{});
  // #endregion
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CafeHub Premium</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  // #region debug-point A:root-outlet
  fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"A",location:"app/root.jsx:39",msg:"[DEBUG] Root outlet render",data:{},ts:Date.now()})}).catch(()=>{});
  // #endregion
  return <Outlet />;
}
