(()=>{if(window.brokerModalInitialized)return;window.brokerModalInitialized=!0;let r=null,l=null,o=null,i=null,s=null;const u="BROKER",p="123",v="/broker.html",y=700;function g(){const e=`
            <div id="brokerLogin" class="bl-modal" hidden>
                <div class="bl-overlay"></div>
                <div class="bl-dialog">
                    <button class="bl-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="bl-head">
                        <div class="bl-mark">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10,17 15,12 10,7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </div>
                        <h2 class="bl-title">Broker Login</h2>
                        <p class="bl-sub">Enter your credentials to access the broker dashboard</p>
                    </div>
                    
                    <form id="bl-form" class="bl-form">
                        <div class="bl-row">
                            <label for="bl-user">Username</label>
                            <input type="text" id="bl-user" name="username" placeholder="Enter your username" required>
                        </div>
                        
                        <div class="bl-row">
                            <label for="bl-pass">Password</label>
                            <input type="password" id="bl-pass" name="password" placeholder="Enter your password" required>
                        </div>
                        
                        <button type="submit" class="bl-btn bl-btn-primary bl-btn-block">
                            <span class="btn-text">Login</span>
                            <span class="btn-loading" hidden>
                                <i class="fas fa-spinner fa-spin"></i>
                                Logging in...
                            </span>
                        </button>
                        
                        <p class="bl-note">Demo Credentials</p>
                        <p class="bl-help">Username: <code>BROKER</code> | Password: <code>123</code></p>
                    </form>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",e),r=document.getElementById("brokerLogin"),l=document.getElementById("bl-form"),o=document.getElementById("bl-user"),i=document.getElementById("bl-pass"),s=document.querySelector(".bl-btn")}function b(){if(!r){console.warn("Modal not initialized");return}r.removeAttribute("hidden"),document.body.style.overflow="hidden",setTimeout(()=>{o&&o.focus()},40)}function d(){if(!r){console.warn("Modal not initialized");return}r.setAttribute("hidden",""),l&&l.reset(),f(),c(!1),document.body.style.overflow=""}function f(){if(!l)return;l.querySelectorAll(".bl-error").forEach(t=>{t.classList.remove("bl-error")}),l.querySelectorAll(".bl-errtext").forEach(t=>{t.remove()})}function a(e,n){e.classList.add("bl-error");const t=document.createElement("div");t.className="bl-errtext",t.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${n}`,e.parentNode.insertBefore(t,e.nextSibling)}function c(e){if(!s)return;const n=s.querySelector(".btn-text"),t=s.querySelector(".btn-loading");e?(s.classList.add("loading"),s.disabled=!0,n&&(n.style.display="none"),t&&(t.hidden=!1)):(s.classList.remove("loading"),s.disabled=!1,n&&(n.style.display="inline"),t&&(t.hidden=!0))}function h(){console.log("Redirecting to broker dashboard...");const e={loggedIn:!0,user:{username:u,email:"broker@eastleighturf.com",phone:"+254700000000",role:"broker"},loginTime:new Date().toISOString()};localStorage.setItem("authState",JSON.stringify(e)),window.location.href=v}function E(e){if(e.preventDefault(),!l||!o||!i){console.error("Form elements not found");return}f();const n=o.value.trim(),t=i.value.trim();if(!n){a(o,"Username is required"),o.focus();return}if(!t){a(i,"Password is required"),i.focus();return}c(!0),setTimeout(()=>{n===u&&t===p?h():(c(!1),o&&a(o,"Invalid credentials. Use demo username: BROKER"),i&&a(i,"Invalid credentials. Use demo password: 123"),o&&o.focus())},y)}function w(e){e.key==="Escape"&&r&&!r.hidden&&d()}function L(){if(!r||!l||!o||!i||!s){console.error("Required modal elements not found");return}const e=document.getElementById("dealerLoginBtn");e&&e.addEventListener("click",t=>{t.preventDefault(),b()}),r.querySelectorAll(".bl-close, .bl-overlay").forEach(t=>{t.addEventListener("click",d)}),l.addEventListener("submit",E),document.addEventListener("keydown",w)}function m(){try{g(),L(),console.log("Broker login modal initialized successfully")}catch(e){console.error("Failed to initialize broker login modal:",e)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m(),window.BrokerLogin={open:b,close:d}})();
//# sourceMappingURL=BrokerLoginModal.594b1f0b.js.map
