import"./modulepreload-polyfill-B5Qt9EMX.js";class Dm{constructor(t){this.video=t,this.stream=null,this.currentDeviceId=null,this.targetResolution={width:1280,height:720},this.isMirrored=!0,this.onFrameCallback=null,this.isStreaming=!1}async getDevices(){var t;if(!((t=navigator.mediaDevices)!=null&&t.enumerateDevices))return[];try{return(await navigator.mediaDevices.enumerateDevices()).filter(i=>i.kind==="videoinput")}catch(e){return console.warn("Failed to enumerate media devices:",e),[]}}async start(t=null,e={width:1280,height:720}){this.stop(),this.targetResolution=e,t&&(this.currentDeviceId=t);const i={audio:!1,video:{deviceId:this.currentDeviceId?{exact:this.currentDeviceId}:void 0,width:{ideal:e.width},height:{ideal:e.height},frameRate:{ideal:60,min:30}}};try{return this.stream=await navigator.mediaDevices.getUserMedia(i),this.video.srcObject=this.stream,this.video.playsInline=!0,this.video.muted=!0,await new Promise(s=>{const r=async()=>{try{await this.video.play()}catch(a){console.warn("Video play deferred or blocked by browser autoplay policy:",a)}s()};this.video.readyState>=1?r():(this.video.onloadedmetadata=()=>r(),setTimeout(r,1e3))}),this.isStreaming=!0,{width:this.video.videoWidth||e.width,height:this.video.videoHeight||e.height,deviceId:this.currentDeviceId}}catch(s){if(console.error("Camera initialization error:",s),t||e.width>640){console.warn("Retrying with basic fallback camera constraints...");try{const r=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}}});this.stream=r,this.video.srcObject=r;try{await this.video.play()}catch(a){console.warn("Fallback video play deferred:",a)}return this.isStreaming=!0,{width:this.video.videoWidth||640,height:this.video.videoHeight||480,deviceId:null}}catch(r){throw console.error("Camera fallback failed:",r),r}}throw s}}stop(){this.stream&&(this.stream.getTracks().forEach(t=>t.stop()),this.stream=null),this.video.srcObject=null,this.isStreaming=!1}setMirrored(t){this.isMirrored=t}getVideoDimensions(){return{width:this.video.videoWidth||1280,height:this.video.videoHeight||720}}}var rr=typeof self<"u"?self:{};function Kd(n,t){t:{for(var e=["CLOSURE_FLAGS"],i=rr,s=0;s<e.length;s++)if((i=i[e[s]])==null){e=null;break t}e=i}return(n=e&&e[n])!=null?n:t}function ns(){throw Error("Invalid UTF8")}function Gh(n,t){return t=String.fromCharCode.apply(null,t),n==null?t:n+t}let Sa,Vo;const Im=typeof TextDecoder<"u";let Fm;const Um=typeof TextEncoder<"u";function Zd(n){if(Um)n=(Fm||(Fm=new TextEncoder)).encode(n);else{let e=0;const i=new Uint8Array(3*n.length);for(let s=0;s<n.length;s++){var t=n.charCodeAt(s);if(t<128)i[e++]=t;else{if(t<2048)i[e++]=t>>6|192;else{if(t>=55296&&t<=57343){if(t<=56319&&s<n.length){const r=n.charCodeAt(++s);if(r>=56320&&r<=57343){t=1024*(t-55296)+r-56320+65536,i[e++]=t>>18|240,i[e++]=t>>12&63|128,i[e++]=t>>6&63|128,i[e++]=63&t|128;continue}s--}t=65533}i[e++]=t>>12|224,i[e++]=t>>6&63|128}i[e++]=63&t|128}}n=e===i.length?i:i.subarray(0,e)}return n}function Jd(n){rr.setTimeout((()=>{throw n}),0)}var wc,Nm=Kd(610401301,!1),Wh=Kd(748402147,!0);function Xh(){var n=rr.navigator;return n&&(n=n.userAgent)?n:""}const Yh=rr.navigator;function po(n){return po[" "](n),n}wc=Yh&&Yh.userAgentData||null,po[" "]=function(){};const Qd={};let Yr=null;function Om(n){const t=n.length;let e=3*t/4;e%3?e=Math.floor(e):"=.".indexOf(n[t-1])!=-1&&(e="=.".indexOf(n[t-2])!=-1?e-2:e-1);const i=new Uint8Array(e);let s=0;return(function(r,a){function o(l){for(;c<r.length;){const h=r.charAt(c++),u=Yr[h];if(u!=null)return u;if(!/^[\s\xa0]*$/.test(h))throw Error("Unknown base64 encoding at char: "+h)}return l}tf();let c=0;for(;;){const l=o(-1),h=o(0),u=o(64),d=o(64);if(d===64&&l===-1)break;a(l<<2|h>>4),u!=64&&(a(h<<4&240|u>>2),d!=64&&a(u<<6&192|d))}})(n,(function(r){i[s++]=r})),s!==e?i.subarray(0,s):i}function tf(){if(!Yr){Yr={};var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),t=["+/=","+/","-_=","-_.","-_"];for(let e=0;e<5;e++){const i=n.concat(t[e].split(""));Qd[e]=i;for(let s=0;s<i.length;s++){const r=i[s];Yr[r]===void 0&&(Yr[r]=s)}}}}var Bm=typeof Uint8Array<"u",ef=!(!(Nm&&wc&&wc.brands.length>0)&&(Xh().indexOf("Trident")!=-1||Xh().indexOf("MSIE")!=-1))&&typeof btoa=="function";const qh=/[-_.]/g,km={"-":"+",_:"/",".":"="};function zm(n){return km[n]||""}function nf(n){if(!ef)return Om(n);n=qh.test(n)?n.replace(qh,zm):n,n=atob(n);const t=new Uint8Array(n.length);for(let e=0;e<n.length;e++)t[e]=n.charCodeAt(e);return t}function Dl(n){return Bm&&n!=null&&n instanceof Uint8Array}var ar={};function Ts(){return Vm||(Vm=new li(null,ar))}function Il(n){sf(ar);var t=n.g;return(t=t==null||Dl(t)?t:typeof t=="string"?nf(t):null)==null?t:n.g=t}var li=class{h(){return new Uint8Array(Il(this)||0)}constructor(n,t){if(sf(t),this.g=n,n!=null&&n.length===0)throw Error("ByteString should be constructed with non-empty values")}};let Vm,Hm;function sf(n){if(n!==ar)throw Error("illegal external caller")}function rf(n,t){n.__closure__error__context__984382||(n.__closure__error__context__984382={}),n.__closure__error__context__984382.severity=t}function Cc(n){return rf(n=Error(n),"warning"),n}function or(n,t){if(n!=null){var e=Hm??(Hm={}),i=e[n]||0;i>=t||(e[n]=i+1,rf(n=Error(),"incident"),Jd(n))}}function Sr(){return typeof BigInt=="function"}var Er=typeof Symbol=="function"&&typeof Symbol()=="symbol";function ui(n,t,e=!1){return typeof Symbol=="function"&&typeof Symbol()=="symbol"?e&&Symbol.for&&n?Symbol.for(n):n!=null?Symbol(n):Symbol():t}var Gm=ui("jas",void 0,!0),jh=ui(void 0,"0di"),Vr=ui(void 0,"1oa"),Tn=ui(void 0,Symbol()),Wm=ui(void 0,"0ub"),Xm=ui(void 0,"0ubs"),Rc=ui(void 0,"0ubsb"),Ym=ui(void 0,"0actk"),cr=ui("m_m","Pa",!0),$h=ui();const af={Ga:{value:0,configurable:!0,writable:!0,enumerable:!1}},of=Object.defineProperties,At=Er?Gm:"Ga";var Ls;const Kh=[];function oa(n,t){Er||At in n||of(n,af),n[At]|=t}function ze(n,t){Er||At in n||of(n,af),n[At]=t}function ca(n){return oa(n,34),n}function ea(n){return oa(n,8192),n}ze(Kh,7),Ls=Object.freeze(Kh);var lr={};function Cn(n,t){return t===void 0?n.h!==As&&!!(2&(0|n.v[At])):!!(2&t)&&n.h!==As}const As={};function Fl(n,t){if(n!=null){if(typeof n=="string")n=n?new li(n,ar):Ts();else if(n.constructor!==li)if(Dl(n))n=n.length?new li(new Uint8Array(n),ar):Ts();else{if(!t)throw Error();n=void 0}}return n}class Zh{constructor(t,e,i){this.g=t,this.h=e,this.l=i}next(){const t=this.g.next();return t.done||(t.value=this.h.call(this.l,t.value)),t}[Symbol.iterator](){return this}}var qm=Object.freeze({});function cf(n,t,e){const i=128&t?0:-1,s=n.length;var r;(r=!!s)&&(r=(r=n[s-1])!=null&&typeof r=="object"&&r.constructor===Object);const a=s+(r?-1:0);for(t=128&t?1:0;t<a;t++)e(t-i,n[t]);if(r){n=n[s-1];for(const o in n)!isNaN(o)&&e(+o,n[o])}}var lf={};function br(n){return 128&n?lf:void 0}function mo(n){return n.Na=!0,n}var jm=mo((n=>typeof n=="number")),Jh=mo((n=>typeof n=="string")),$m=mo((n=>typeof n=="boolean")),go=typeof rr.BigInt=="function"&&typeof rr.BigInt(0)=="bigint";function An(n){var t=n;if(Jh(t)){if(!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(t))throw Error(String(t))}else if(jm(t)&&!Number.isSafeInteger(t))throw Error(String(t));return go?BigInt(n):n=$m(n)?n?"1":"0":Jh(n)?n.trim()||"0":String(n)}var Lc=mo((n=>go?n>=Zm&&n<=Qm:n[0]==="-"?Qh(n,Km):Qh(n,Jm)));const Km=Number.MIN_SAFE_INTEGER.toString(),Zm=go?BigInt(Number.MIN_SAFE_INTEGER):void 0,Jm=Number.MAX_SAFE_INTEGER.toString(),Qm=go?BigInt(Number.MAX_SAFE_INTEGER):void 0;function Qh(n,t){if(n.length>t.length)return!1;if(n.length<t.length||n===t)return!0;for(let e=0;e<n.length;e++){const i=n[e],s=t[e];if(i>s)return!1;if(i<s)return!0}}const t0=typeof Uint8Array.prototype.slice=="function";let e0,be=0,Fe=0;function tu(n){const t=n>>>0;be=t,Fe=(n-t)/4294967296>>>0}function hr(n){if(n<0){tu(-n);const[t,e]=Ol(be,Fe);be=t>>>0,Fe=e>>>0}else tu(n)}function Ul(n){const t=e0||(e0=new DataView(new ArrayBuffer(8)));t.setFloat32(0,+n,!0),Fe=0,be=t.getUint32(0,!0)}function hf(n,t){const e=4294967296*t+(n>>>0);return Number.isSafeInteger(e)?e:na(n,t)}function n0(n,t){return An(Sr()?BigInt.asUintN(64,(BigInt(t>>>0)<<BigInt(32))+BigInt(n>>>0)):na(n,t))}function uf(n,t){return Sr()?An(BigInt.asIntN(64,(BigInt.asUintN(32,BigInt(t))<<BigInt(32))+BigInt.asUintN(32,BigInt(n)))):An(Nl(n,t))}function na(n,t){if(n>>>=0,(t>>>=0)<=2097151)var e=""+(4294967296*t+n);else Sr()?e=""+(BigInt(t)<<BigInt(32)|BigInt(n)):(n=(16777215&n)+6777216*(e=16777215&(n>>>24|t<<8))+6710656*(t=t>>16&65535),e+=8147497*t,t*=2,n>=1e7&&(e+=n/1e7>>>0,n%=1e7),e>=1e7&&(t+=e/1e7>>>0,e%=1e7),e=t+eu(e)+eu(n));return e}function eu(n){return n=String(n),"0000000".slice(n.length)+n}function Nl(n,t){if(2147483648&t)if(Sr())n=""+(BigInt(0|t)<<BigInt(32)|BigInt(n>>>0));else{const[e,i]=Ol(n,t);n="-"+na(e,i)}else n=na(n,t);return n}function _o(n){if(n.length<16)hr(Number(n));else if(Sr())n=BigInt(n),be=Number(n&BigInt(4294967295))>>>0,Fe=Number(n>>BigInt(32)&BigInt(4294967295));else{const t=+(n[0]==="-");Fe=be=0;const e=n.length;for(let i=t,s=(e-t)%6+t;s<=e;i=s,s+=6){const r=Number(n.slice(i,s));Fe*=1e6,be=1e6*be+r,be>=4294967296&&(Fe+=Math.trunc(be/4294967296),Fe>>>=0,be>>>=0)}if(t){const[i,s]=Ol(be,Fe);be=i,Fe=s}}}function Ol(n,t){return t=~t,n?n=1+~n:t+=1,[n,t]}function Jn(n){return Array.prototype.slice.call(n)}const la=typeof BigInt=="function"?BigInt.asIntN:void 0,i0=typeof BigInt=="function"?BigInt.asUintN:void 0,ws=Number.isSafeInteger,vo=Number.isFinite,ur=Math.trunc,s0=An(0);function qr(n){if(n!=null&&typeof n!="number")throw Error(`Value of float/double field must be a number, found ${typeof n}: ${n}`);return n}function ci(n){return n==null||typeof n=="number"?n:n==="NaN"||n==="Infinity"||n==="-Infinity"?Number(n):void 0}function ia(n){if(n!=null&&typeof n!="boolean"){var t=typeof n;throw Error(`Expected boolean but got ${t!="object"?t:n?Array.isArray(n)?"array":t:"null"}: ${n}`)}return n}function df(n){return n==null||typeof n=="boolean"?n:typeof n=="number"?!!n:void 0}const r0=/^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;function ha(n){switch(typeof n){case"bigint":return!0;case"number":return vo(n);case"string":return r0.test(n);default:return!1}}function Tr(n){if(n==null)return n;if(typeof n=="string"&&n)n=+n;else if(typeof n!="number")return;return vo(n)?0|n:void 0}function ff(n){if(n==null)return n;if(typeof n=="string"&&n)n=+n;else if(typeof n!="number")return;return vo(n)?n>>>0:void 0}function pf(n){const t=n.length;return(n[0]==="-"?t<20||t===20&&n<="-9223372036854775808":t<19||t===19&&n<="9223372036854775807")?n:(_o(n),Nl(be,Fe))}function Bl(n){if(n=ur(n),!ws(n)){hr(n);var t=be,e=Fe;(n=2147483648&e)&&(e=~e>>>0,(t=1+~t>>>0)==0&&(e=e+1>>>0)),n=typeof(t=hf(t,e))=="number"?n?-t:t:n?"-"+t:t}return n}function mf(n){var t=ur(Number(n));return ws(t)?String(t):((t=n.indexOf("."))!==-1&&(n=n.substring(0,t)),pf(n))}function gf(n){var t=ur(Number(n));return ws(t)?An(t):((t=n.indexOf("."))!==-1&&(n=n.substring(0,t)),Sr()?An(la(64,BigInt(n))):An(pf(n)))}function _f(n){return ws(n)?n=An(Bl(n)):(n=ur(n),ws(n)?n=String(n):(hr(n),n=Nl(be,Fe)),n=An(n)),n}function so(n){const t=typeof n;return n==null?n:t==="bigint"?An(la(64,n)):ha(n)?t==="string"?gf(n):_f(n):void 0}function vf(n){if(typeof n!="string")throw Error();return n}function ua(n){if(n!=null&&typeof n!="string")throw Error();return n}function qe(n){return n==null||typeof n=="string"?n:void 0}function kl(n,t,e,i){return n!=null&&n[cr]===lr?n:Array.isArray(n)?((i=(e=0|n[At])|32&i|2&i)!==e&&ze(n,i),new t(n)):(e?2&i?((n=t[jh])||(ca((n=new t).v),n=t[jh]=n),t=n):t=new t:t=void 0,t)}function a0(n,t,e){if(t)t:{if(!ha(t=n))throw Cc("int64");switch(typeof t){case"string":t=gf(t);break t;case"bigint":t=An(la(64,t));break t;default:t=_f(t)}}else t=so(n);return(n=t)==null?e?s0:void 0:n}const o0={};let c0=(function(){try{return po(new class extends Map{constructor(){super()}}),!1}catch{return!0}})();class Ho{constructor(){this.g=new Map}get(t){return this.g.get(t)}set(t,e){return this.g.set(t,e),this.size=this.g.size,this}delete(t){return t=this.g.delete(t),this.size=this.g.size,t}clear(){this.g.clear(),this.size=this.g.size}has(t){return this.g.has(t)}entries(){return this.g.entries()}keys(){return this.g.keys()}values(){return this.g.values()}forEach(t,e){return this.g.forEach(t,e)}[Symbol.iterator](){return this.entries()}}const l0=c0?(Object.setPrototypeOf(Ho.prototype,Map.prototype),Object.defineProperties(Ho.prototype,{size:{value:0,configurable:!0,enumerable:!0,writable:!0}}),Ho):class extends Map{constructor(){super()}};function nu(n){return n}function Go(n){if(2&n.J)throw Error("Cannot mutate an immutable Map")}var Ri=class extends l0{constructor(n,t,e=nu,i=nu){super(),this.J=0|n[At],this.K=t,this.S=e,this.fa=this.K?h0:i;for(let s=0;s<n.length;s++){const r=n[s],a=e(r[0],!1,!0);let o=r[1];t?o===void 0&&(o=null):o=i(r[1],!1,!0,void 0,void 0,this.J),super.set(a,o)}}V(n){return ea(Array.from(super.entries(),n))}clear(){Go(this),super.clear()}delete(n){return Go(this),super.delete(this.S(n,!0,!1))}entries(){if(this.K){var n=super.keys();n=new Zh(n,u0,this)}else n=super.entries();return n}values(){if(this.K){var n=super.keys();n=new Zh(n,Ri.prototype.get,this)}else n=super.values();return n}forEach(n,t){this.K?super.forEach(((e,i,s)=>{n.call(t,s.get(i),i,s)})):super.forEach(n,t)}set(n,t){return Go(this),(n=this.S(n,!0,!1))==null?this:t==null?(super.delete(n),this):super.set(n,this.fa(t,!0,!0,this.K,!1,this.J))}Ma(n){const t=this.S(n[0],!1,!0);n=n[1],n=this.K?n===void 0?null:n:this.fa(n,!1,!0,void 0,!1,this.J),super.set(t,n)}has(n){return super.has(this.S(n,!1,!1))}get(n){n=this.S(n,!1,!1);const t=super.get(n);if(t!==void 0){var e=this.K;return e?((e=this.fa(t,!1,!0,e,this.ra,this.J))!==t&&super.set(n,e),e):t}}[Symbol.iterator](){return this.entries()}};function h0(n,t,e,i,s,r){return n=kl(n,i,e,r),s&&(n=Vl(n)),n}function u0(n){return[n,this.get(n)]}let d0;function iu(){return d0||(d0=new Ri(ca([]),void 0,void 0,void 0,o0))}function xo(n){return Tn?n[Tn]:void 0}function ro(n,t){for(const e in n)!isNaN(e)&&t(n,+e,n[e])}Ri.prototype.toJSON=void 0;var Pc=class{};const f0={Ka:!0};function p0(n,t){t<100||or(Xm,1)}function yo(n,t,e,i){const s=i!==void 0;i=!!i;var r,a=Tn;!s&&Er&&a&&(r=n[a])&&ro(r,p0),a=[];var o=n.length;let c;r=4294967295;let l=!1;const h=!!(64&t),u=h?128&t?0:-1:void 0;1&t||(c=o&&n[o-1],c!=null&&typeof c=="object"&&c.constructor===Object?r=--o:c=void 0,!h||128&t||s||(l=!0,r=r-u+u)),t=void 0;for(var d=0;d<o;d++){let f=n[d];if(f!=null&&(f=e(f,i))!=null)if(h&&d>=r){const g=d-u;(t??(t={}))[g]=f}else a[d]=f}if(c)for(let f in c){if((o=c[f])==null||(o=e(o,i))==null)continue;let g;d=+f,h&&!Number.isNaN(d)&&(g=d+u)<r?a[g]=o:(t??(t={}))[f]=o}return t&&(l?a.push(t):a[r]=t),s&&Tn&&(n=xo(n))&&n instanceof Pc&&(a[Tn]=(function(f){const g=new Pc;return ro(f,((v,m,p)=>{g[m]=Jn(p)})),g.da=f.da,g})(n)),a}function m0(n){return n[0]=sa(n[0]),n[1]=sa(n[1]),n}function sa(n){switch(typeof n){case"number":return Number.isFinite(n)?n:""+n;case"bigint":return Lc(n)?Number(n):""+n;case"boolean":return n?1:0;case"object":if(Array.isArray(n)){var t=0|n[At];return n.length===0&&1&t?void 0:yo(n,t,sa)}if(n!=null&&n[cr]===lr)return xf(n);if(n instanceof li){if((t=n.g)==null)n="";else if(typeof t=="string")n=t;else{if(ef){for(var e="",i=0,s=t.length-10240;i<s;)e+=String.fromCharCode.apply(null,t.subarray(i,i+=10240));e+=String.fromCharCode.apply(null,i?t.subarray(i):t),t=btoa(e)}else{e===void 0&&(e=0),tf(),e=Qd[e],i=Array(Math.floor(t.length/3)),s=e[64]||"";let l=0,h=0;for(;l<t.length-2;l+=3){var r=t[l],a=t[l+1],o=t[l+2],c=e[r>>2];r=e[(3&r)<<4|a>>4],a=e[(15&a)<<2|o>>6],o=e[63&o],i[h++]=c+r+a+o}switch(c=0,o=s,t.length-l){case 2:o=e[(15&(c=t[l+1]))<<2]||s;case 1:t=t[l],i[h]=e[t>>2]+e[(3&t)<<4|c>>4]+o+s}t=i.join("")}n=n.g=t}return n}return n instanceof Ri?n=n.size!==0?n.V(m0):void 0:void 0}return n}let g0,_0;function xf(n){return yo(n=n.v,0|n[At],sa)}function ys(n,t){return yf(n,t[0],t[1])}function yf(n,t,e,i=0){if(n==null){var s=32;e?(n=[e],s|=128):n=[],t&&(s=-16760833&s|(1023&t)<<14)}else{if(!Array.isArray(n))throw Error("narr");if(s=0|n[At],Wh&&1&s)throw Error("rfarr");if(2048&s&&!(2&s)&&(function(){if(Wh)throw Error("carr");or(Ym,5)})(),256&s)throw Error("farr");if(64&s)return(s|i)!==s&&ze(n,s|i),n;if(e&&(s|=128,e!==n[0]))throw Error("mid");t:{s|=64;var r=(e=n).length;if(r){var a=r-1;const c=e[a];if(c!=null&&typeof c=="object"&&c.constructor===Object){if((a-=t=128&s?0:-1)>=1024)throw Error("pvtlmt");for(var o in c)(r=+o)<a&&(e[r+t]=c[o],delete c[o]);s=-16760833&s|(1023&a)<<14;break t}}if(t){if((o=Math.max(t,r-(128&s?0:-1)))>1024)throw Error("spvt");s=-16760833&s|(1023&o)<<14}}}return ze(n,64|s|i),n}function v0(n,t){if(typeof n!="object")return n;if(Array.isArray(n)){var e=0|n[At];return n.length===0&&1&e?void 0:su(n,e,t)}if(n!=null&&n[cr]===lr)return ru(n);if(n instanceof Ri){if(2&(t=n.J))return n;if(!n.size)return;if(e=ca(n.V()),n.K)for(n=0;n<e.length;n++){const i=e[n];let s=i[1];s=s==null||typeof s!="object"?void 0:s!=null&&s[cr]===lr?ru(s):Array.isArray(s)?su(s,0|s[At],!!(32&t)):void 0,i[1]=s}return e}return n instanceof li?n:void 0}function su(n,t,e){return 2&t||(!e||4096&t||16&t?n=Ar(n,t,!1,e&&!(16&t)):(oa(n,34),4&t&&Object.freeze(n))),n}function zl(n,t,e){return n=new n.constructor(t),e&&(n.h=As),n.m=As,n}function ru(n){const t=n.v,e=0|t[At];return Cn(n,e)?n:Hl(n,t,e)?zl(n,t):Ar(t,e)}function Ar(n,t,e,i){return i??(i=!!(34&t)),n=yo(n,t,v0,i),i=32,e&&(i|=2),ze(n,t=16769217&t|i),n}function Vl(n){const t=n.v,e=0|t[At];return Cn(n,e)?Hl(n,t,e)?zl(n,t,!0):new n.constructor(Ar(t,e,!1)):n}function wr(n){if(n.h!==As)return!1;var t=n.v;return oa(t=Ar(t,0|t[At]),2048),n.v=t,n.h=void 0,n.m=void 0,!0}function Cr(n){if(!wr(n)&&Cn(n,0|n.v[At]))throw Error()}function Ps(n,t){t===void 0&&(t=0|n[At]),32&t&&!(4096&t)&&ze(n,4096|t)}function Hl(n,t,e){return!!(2&e)||!(!(32&e)||4096&e)&&(ze(t,2|e),n.h=As,!0)}const Mf=An(0),Ni={};function Te(n,t,e,i,s){if((t=Li(n.v,t,e,s))!==null||i&&n.m!==As)return t}function Li(n,t,e,i){if(t===-1)return null;const s=t+(e?0:-1),r=n.length-1;let a,o;if(!(r<1+(e?0:-1))){if(s>=r)if(a=n[r],a!=null&&typeof a=="object"&&a.constructor===Object)e=a[t],o=!0;else{if(s!==r)return;e=a}else e=n[s];if(i&&e!=null){if((i=i(e))==null)return i;if(!Object.is(i,e))return o?a[t]=i:n[s]=i,i}return e}}function pe(n,t,e,i){Cr(n),Be(n=n.v,0|n[At],t,e,i)}function Be(n,t,e,i,s){const r=e+(s?0:-1);var a=n.length-1;if(a>=1+(s?0:-1)&&r>=a){const o=n[a];if(o!=null&&typeof o=="object"&&o.constructor===Object)return o[e]=i,t}return r<=a?(n[r]=i,t):(i!==void 0&&(e>=(a=(t??(t=0|n[At]))>>14&1023||536870912)?i!=null&&(n[a+(s?0:-1)]={[e]:i}):n[r]=i),t)}function ms(){return qm===void 0?2:4}function gs(n,t,e,i,s){let r=n.v,a=0|r[At];i=Cn(n,a)?1:i,s=!!s||i===3,i===2&&wr(n)&&(r=n.v,a=0|r[At]);let o=(n=Gl(r,t))===Ls?7:0|n[At],c=Wl(o,a);var l=!(4&c);if(l){4&c&&(n=Jn(n),o=0,c=Ss(c,a),a=Be(r,a,t,n));let h=0,u=0;for(;h<n.length;h++){const d=e(n[h]);d!=null&&(n[u++]=d)}u<h&&(n.length=u),e=-513&(4|c),c=e&=-1025,c&=-4097}return c!==o&&(ze(n,c),2&c&&Object.freeze(n)),Sf(n,c,r,a,t,i,l,s)}function Sf(n,t,e,i,s,r,a,o){let c=t;return r===1||r===4&&(2&t||!(16&t)&&32&i)?Ms(t)||((t|=!n.length||a&&!(4096&t)||32&i&&!(4096&t||16&t)?2:256)!==c&&ze(n,t),Object.freeze(n)):(r===2&&Ms(t)&&(n=Jn(n),c=0,t=Ss(t,i),i=Be(e,i,s,n)),Ms(t)||(o||(t|=16),t!==c&&ze(n,t))),2&t||!(4096&t||16&t)||Ps(e,i),n}function Gl(n,t,e){return n=Li(n,t,e),Array.isArray(n)?n:Ls}function Wl(n,t){return 2&t&&(n|=2),1|n}function Ms(n){return!!(2&n)&&!!(4&n)||!!(256&n)}function Ef(n){return Fl(n,!0)}function bf(n){n=Jn(n);for(let t=0;t<n.length;t++){const e=n[t]=Jn(n[t]);Array.isArray(e[1])&&(e[1]=ca(e[1]))}return ea(n)}function Wi(n,t,e,i){Cr(n),Be(n=n.v,0|n[At],t,(i==="0"?Number(e)===0:e===i)?void 0:e)}function Rr(n,t,e){if(2&t)throw Error();const i=br(t);let s=Gl(n,e,i),r=s===Ls?7:0|s[At],a=Wl(r,t);return(2&a||Ms(a)||16&a)&&(a===r||Ms(a)||ze(s,a),s=Jn(s),r=0,a=Ss(a,t),Be(n,t,e,s,i)),a&=-13,a!==r&&ze(s,a),s}function Wo(n,t){var e=mp;return Yl(Xl(n=n.v),n,void 0,e)===t?t:-1}function Xl(n){if(Er)return n[Vr]??(n[Vr]=new Map);if(Vr in n)return n[Vr];const t=new Map;return Object.defineProperty(n,Vr,{value:t}),t}function Tf(n,t,e,i,s){const r=Xl(n),a=Yl(r,n,t,e,s);return a!==i&&(a&&(t=Be(n,t,a,void 0,s)),r.set(e,i)),t}function Yl(n,t,e,i,s){let r=n.get(i);if(r!=null)return r;r=0;for(let a=0;a<i.length;a++){const o=i[a];Li(t,o,s)!=null&&(r!==0&&(e=Be(t,e,r,void 0,s)),r=o)}return n.set(i,r),r}function ql(n,t,e){let i=0|n[At];const s=br(i),r=Li(n,e,s);let a;if(r!=null&&r[cr]===lr){if(!Cn(r))return wr(r),r.v;a=r.v}else Array.isArray(r)&&(a=r);if(a){const o=0|a[At];2&o&&(a=Ar(a,o))}return a=ys(a,t),a!==r&&Be(n,i,e,a,s),a}function Af(n,t,e,i,s){let r=!1;if((i=Li(n,i,s,(a=>{const o=kl(a,e,!1,t);return r=o!==a&&o!=null,o})))!=null)return r&&!Cn(i)&&Ps(n,t),i}function re(n,t,e,i){let s=n.v,r=0|s[At];if((t=Af(s,r,t,e,i))==null)return t;if(r=0|s[At],!Cn(n,r)){const a=Vl(t);a!==t&&(wr(n)&&(s=n.v,r=0|s[At]),r=Be(s,r,e,t=a,i),Ps(s,r))}return t}function wf(n,t,e,i,s,r,a,o){var c=Cn(n,e);r=c?1:r,a=!!a||r===3,c=o&&!c,(r===2||c)&&wr(n)&&(e=0|(t=n.v)[At]);var l=(n=Gl(t,s))===Ls?7:0|n[At],h=Wl(l,e);if(o=!(4&h)){var u=n,d=e;const f=!!(2&h);f&&(d|=2);let g=!f,v=!0,m=0,p=0;for(;m<u.length;m++){const S=kl(u[m],i,!1,d);if(S instanceof i){if(!f){const x=Cn(S);g&&(g=!x),v&&(v=x)}u[p++]=S}}p<m&&(u.length=p),h|=4,h=v?-4097&h:4096|h,h=g?8|h:-9&h}if(h!==l&&(ze(n,h),2&h&&Object.freeze(n)),c&&!(8&h||!n.length&&(r===1||r===4&&(2&h||!(16&h)&&32&e)))){for(Ms(h)&&(n=Jn(n),h=Ss(h,e),e=Be(t,e,s,n)),i=n,c=h,l=0;l<i.length;l++)(u=i[l])!==(h=Vl(u))&&(i[l]=h);c|=8,ze(n,h=c=i.length?4096|c:-4097&c)}return Sf(n,h,t,e,s,r,o,a)}function Pi(n,t,e){const i=n.v;return wf(n,i,0|i[At],t,e,ms(),!1,!0)}function Cf(n){return n==null&&(n=void 0),n}function Bt(n,t,e,i,s){return pe(n,e,i=Cf(i),s),i&&!Cn(i)&&Ps(n.v),n}function Kr(n,t,e,i){t:{var s=i=Cf(i);Cr(n);const r=n.v;let a=0|r[At];if(s==null){const o=Xl(r);if(Yl(o,r,a,e)!==t)break t;o.set(e,0)}else a=Tf(r,a,e,t);Be(r,a,t,s)}i&&!Cn(i)&&Ps(n.v)}function Ss(n,t){return-273&(2&t?2|n:-3&n)}function jl(n,t,e,i){var s=i;Cr(n),n=wf(n,i=n.v,0|i[At],e,t,2,!0),s=s??new e,n.push(s),t=e=n===Ls?7:0|n[At],(s=Cn(s))?(e&=-9,n.length===1&&(e&=-4097)):e|=4096,e!==t&&ze(n,e),s||Ps(i)}function kn(n,t,e){return Tr(Te(n,t,void 0,e))}function Pe(n,t){return Te(n,t,void 0,void 0,ci)??0}function Di(n,t,e){if(e!=null){if(typeof e!="number"||!vo(e))throw Cc("int32");e|=0}pe(n,t,e)}function Dt(n,t,e){pe(n,t,qr(e))}function Rn(n,t,e){Wi(n,t,ua(e),"")}function ao(n,t,e){{Cr(n);const a=n.v;let o=0|a[At];if(e==null)Be(a,o,t);else{var i=n=e===Ls?7:0|e[At],s=Ms(n),r=s||Object.isFrozen(e);for(s||(n=0),r||(e=Jn(e),i=0,n=Ss(n,o),r=!1),n|=5,n|=(4&n?512&n?512:1024&n?1024:0:void 0)??1024,s=0;s<e.length;s++){const c=e[s],l=vf(c);Object.is(c,l)||(r&&(e=Jn(e),i=0,n=Ss(n,o),r=!1),e[s]=l)}n!==i&&(r&&(e=Jn(e),n=Ss(n,o)),ze(e,n)),Be(a,o,t,e)}}}function Mo(n,t,e){Cr(n),gs(n,t,qe,2,!0).push(vf(e))}var Ns=class{constructor(n,t,e){if(this.buffer=n,e&&!t)throw Error();this.g=t}};function $l(n,t){if(typeof n=="string")return new Ns(nf(n),t);if(Array.isArray(n))return new Ns(new Uint8Array(n),t);if(n.constructor===Uint8Array)return new Ns(n,!1);if(n.constructor===ArrayBuffer)return n=new Uint8Array(n),new Ns(n,!1);if(n.constructor===li)return t=Il(n)||new Uint8Array(0),new Ns(t,!0,n);if(n instanceof Uint8Array)return n=n.constructor===Uint8Array?n:new Uint8Array(n.buffer,n.byteOffset,n.byteLength),new Ns(n,!1);throw Error()}function Kl(n,t){let e,i=0,s=0,r=0;const a=n.h;let o=n.g;do e=a[o++],i|=(127&e)<<r,r+=7;while(r<32&&128&e);if(r>32)for(s|=(127&e)>>4,r=3;r<32&&128&e;r+=7)e=a[o++],s|=(127&e)<<r;if(Es(n,o),!(128&e))return t(i>>>0,s>>>0);throw Error()}function Zl(n){let t=0,e=n.g;const i=e+10,s=n.h;for(;e<i;){const r=s[e++];if(t|=r,(128&r)==0)return Es(n,e),!!(127&t)}throw Error()}function Zi(n){const t=n.h;let e=n.g,i=t[e++],s=127&i;if(128&i&&(i=t[e++],s|=(127&i)<<7,128&i&&(i=t[e++],s|=(127&i)<<14,128&i&&(i=t[e++],s|=(127&i)<<21,128&i&&(i=t[e++],s|=i<<28,128&i&&128&t[e++]&&128&t[e++]&&128&t[e++]&&128&t[e++]&&128&t[e++])))))throw Error();return Es(n,e),s}function hi(n){return Zi(n)>>>0}function oo(n){var t=n.h;const e=n.g;var i=t[e],s=t[e+1];const r=t[e+2];return t=t[e+3],Es(n,n.g+4),n=2*((s=(i<<0|s<<8|r<<16|t<<24)>>>0)>>31)+1,i=s>>>23&255,s&=8388607,i==255?s?NaN:n*(1/0):i==0?1401298464324817e-60*n*s:n*Math.pow(2,i-150)*(s+8388608)}function x0(n){return Zi(n)}function Es(n,t){if(n.g=t,t>n.l)throw Error()}function Rf(n,t){if(t<0)throw Error();const e=n.g;if((t=e+t)>n.l)throw Error();return n.g=t,e}function Lf(n,t){if(t==0)return Ts();var e=Rf(n,t);return n.Y&&n.j?e=n.h.subarray(e,e+t):(n=n.h,e=e===(t=e+t)?new Uint8Array(0):t0?n.slice(e,t):new Uint8Array(n.subarray(e,t))),e.length==0?Ts():new li(e,ar)}var au=[];function Pf(n,t,e,i){if(co.length){const s=co.pop();return s.o(i),s.g.init(n,t,e,i),s}return new y0(n,t,e,i)}function Df(n){n.g.clear(),n.l=-1,n.h=-1,co.length<100&&co.push(n)}function If(n){var t=n.g;if(t.g==t.l)return!1;n.m=n.g.g;var e=hi(n.g);if(t=e>>>3,!((e&=7)>=0&&e<=5)||t<1)throw Error();return n.l=t,n.h=e,!0}function $a(n){switch(n.h){case 0:n.h!=0?$a(n):Zl(n.g);break;case 1:Es(n=n.g,n.g+8);break;case 2:if(n.h!=2)$a(n);else{var t=hi(n.g);Es(n=n.g,n.g+t)}break;case 5:Es(n=n.g,n.g+4);break;case 3:for(t=n.l;;){if(!If(n))throw Error();if(n.h==4){if(n.l!=t)throw Error();break}$a(n)}break;default:throw Error()}}function da(n,t,e){const i=n.g.l;var s=hi(n.g);let r=(s=n.g.g+s)-i;if(r<=0&&(n.g.l=s,e(t,n,void 0,void 0,void 0),r=s-n.g.g),r)throw Error();return n.g.g=s,n.g.l=i,t}function Jl(n){var t=hi(n.g),e=Rf(n=n.g,t);if(n=n.h,Im){var i,s=n;(i=Vo)||(i=Vo=new TextDecoder("utf-8",{fatal:!0})),t=e+t,s=e===0&&t===s.length?s:s.subarray(e,t);try{var r=i.decode(s)}catch(o){if(Sa===void 0){try{i.decode(new Uint8Array([128]))}catch{}try{i.decode(new Uint8Array([97])),Sa=!0}catch{Sa=!1}}throw!Sa&&(Vo=void 0),o}}else{t=(r=e)+t,e=[];let o,c=null;for(;r<t;){var a=n[r++];a<128?e.push(a):a<224?r>=t?ns():(o=n[r++],a<194||(192&o)!=128?(r--,ns()):e.push((31&a)<<6|63&o)):a<240?r>=t-1?ns():(o=n[r++],(192&o)!=128||a===224&&o<160||a===237&&o>=160||(192&(i=n[r++]))!=128?(r--,ns()):e.push((15&a)<<12|(63&o)<<6|63&i)):a<=244?r>=t-2?ns():(o=n[r++],(192&o)!=128||o-144+(a<<28)>>30!=0||(192&(i=n[r++]))!=128||(192&(s=n[r++]))!=128?(r--,ns()):(a=(7&a)<<18|(63&o)<<12|(63&i)<<6|63&s,a-=65536,e.push(55296+(a>>10&1023),56320+(1023&a)))):ns(),e.length>=8192&&(c=Gh(c,e),e.length=0)}r=Gh(c,e)}return r}function Ff(n){const t=hi(n.g);return Lf(n.g,t)}function So(n,t,e){var i=hi(n.g);for(i=n.g.g+i;n.g.g<i;)e.push(t(n.g))}var y0=class{constructor(n,t,e,i){if(au.length){const s=au.pop();s.init(n,t,e,i),n=s}else n=new class{constructor(s,r,a,o){this.h=null,this.j=!1,this.g=this.l=this.m=0,this.init(s,r,a,o)}init(s,r,a,{Y:o=!1,ea:c=!1}={}){this.Y=o,this.ea=c,s&&(s=$l(s,this.ea),this.h=s.buffer,this.j=s.g,this.m=r||0,this.l=a!==void 0?this.m+a:this.h.length,this.g=this.m)}clear(){this.h=null,this.j=!1,this.g=this.l=this.m=0,this.Y=!1}}(n,t,e,i);this.g=n,this.m=this.g.g,this.h=this.l=-1,this.o(i)}o({ha:n=!1}={}){this.ha=n}},co=[];function ou(n){return n?/^\d+$/.test(n)?(_o(n),new Dc(be,Fe)):null:M0||(M0=new Dc(0,0))}var Dc=class{constructor(n,t){this.h=n>>>0,this.g=t>>>0}};let M0;function cu(n){return n?/^-?\d+$/.test(n)?(_o(n),new Ic(be,Fe)):null:S0||(S0=new Ic(0,0))}var Ic=class{constructor(n,t){this.h=n>>>0,this.g=t>>>0}};let S0;function tr(n,t,e){for(;e>0||t>127;)n.g.push(127&t|128),t=(t>>>7|e<<25)>>>0,e>>>=7;n.g.push(t)}function Lr(n,t){for(;t>127;)n.g.push(127&t|128),t>>>=7;n.g.push(t)}function Eo(n,t){if(t>=0)Lr(n,t);else{for(let e=0;e<9;e++)n.g.push(127&t|128),t>>=7;n.g.push(1)}}function Ql(n){var t=be;n.g.push(t>>>0&255),n.g.push(t>>>8&255),n.g.push(t>>>16&255),n.g.push(t>>>24&255)}function dr(n,t){t.length!==0&&(n.l.push(t),n.h+=t.length)}function Vn(n,t,e){Lr(n.g,8*t+e)}function th(n,t){return Vn(n,t,2),t=n.g.end(),dr(n,t),t.push(n.h),t}function eh(n,t){var e=t.pop();for(e=n.h+n.g.length()-e;e>127;)t.push(127&e|128),e>>>=7,n.h++;t.push(e),n.h++}function bo(n,t,e){Vn(n,t,2),Lr(n.g,e.length),dr(n,n.g.end()),dr(n,e)}function lo(n,t,e,i){e!=null&&(t=th(n,t),i(e,n),eh(n,t))}function di(){const n=class{constructor(){throw Error()}};return Object.setPrototypeOf(n,n.prototype),n}var nh=di(),Uf=di(),ih=di(),sh=di(),rh=di(),Nf=di(),E0=di(),To=di(),Of=di(),Bf=di();function fi(n,t,e){var i=n.v;Tn&&Tn in i&&(i=i[Tn])&&delete i[t.g],t.h?t.j(n,t.h,t.g,e,t.l):t.j(n,t.g,e,t.l)}var wt=class{constructor(n,t){this.v=yf(n,t,void 0,2048)}toJSON(){return xf(this)}j(){var s;var n=sg,t=this.v,e=n.g,i=Tn;if(Er&&i&&((s=t[i])==null?void 0:s[e])!=null&&or(Wm,3),t=n.g,$h&&Tn&&$h===void 0&&(i=(e=this.v)[Tn])&&(i=i.da))try{i(e,t,f0)}catch(r){Jd(r)}return n.h?n.m(this,n.h,n.g,n.l):n.m(this,n.g,n.defaultValue,n.l)}clone(){const n=this.v,t=0|n[At];return Hl(this,n,t)?zl(this,n,!0):new this.constructor(Ar(n,t,!1))}};wt.prototype[cr]=lr,wt.prototype.toString=function(){return this.v.toString()};var Pr=class{constructor(n,t,e){this.g=n,this.h=t,n=nh,this.l=!!n&&e===n||!1}};function Ao(n,t){return new Pr(n,t,nh)}function kf(n,t,e,i,s){lo(n,e,Gf(t,i),s)}const b0=Ao((function(n,t,e,i,s){return n.h===2&&(da(n,ql(t,i,e),s),!0)}),kf),T0=Ao((function(n,t,e,i,s){return n.h===2&&(da(n,ql(t,i,e),s),!0)}),kf);var wo=Symbol(),Co=Symbol(),Fc=Symbol(),lu=Symbol(),hu=Symbol();let zf,Vf;function Ds(n,t,e,i){var s=i[n];if(s)return s;(s={}).qa=i,s.T=(function(u){switch(typeof u){case"boolean":return g0||(g0=[0,void 0,!0]);case"number":return u>0?void 0:u===0?_0||(_0=[0,void 0]):[-u,void 0];case"string":return[0,u];case"object":return u}})(i[0]);var r=i[1];let a=1;r&&r.constructor===Object&&(s.ba=r,typeof(r=i[++a])=="function"&&(s.ma=!0,zf??(zf=r),Vf??(Vf=i[a+1]),r=i[a+=2]));const o={};for(;r&&Array.isArray(r)&&r.length&&typeof r[0]=="number"&&r[0]>0;){for(var c=0;c<r.length;c++)o[r[c]]=r;r=i[++a]}for(c=1;r!==void 0;){let u;typeof r=="number"&&(c+=r,r=i[++a]);var l=void 0;if(r instanceof Pr?u=r:(u=b0,a--),u==null?void 0:u.l){r=i[++a],l=i;var h=a;typeof r=="function"&&(r=r(),l[h]=r),l=r}for(h=c+1,typeof(r=i[++a])=="number"&&r<0&&(h-=r,r=i[++a]);c<h;c++){const d=o[c];l?e(s,c,u,l,d):t(s,c,u,d)}}return i[n]=s}function Hf(n){return Array.isArray(n)?n[0]instanceof Pr?n:[T0,n]:[n,void 0]}function Gf(n,t){return n instanceof wt?n.v:Array.isArray(n)?ys(n,t):void 0}function ah(n,t,e,i){const s=e.g;n[t]=i?(r,a,o)=>s(r,a,o,i):s}function oh(n,t,e,i,s){const r=e.g;let a,o;n[t]=(c,l,h)=>r(c,l,h,o||(o=Ds(Co,ah,oh,i).T),a||(a=ch(i)),s)}function ch(n){let t=n[Fc];if(t!=null)return t;const e=Ds(Co,ah,oh,n);return t=e.ma?(i,s)=>zf(i,s,e):(i,s)=>{for(;If(s)&&s.h!=4;){var r=s.l,a=e[r];if(a==null){var o=e.ba;o&&(o=o[r])&&(o=w0(o))!=null&&(a=e[r]=o)}if(a==null||!a(s,i,r)){if(a=(o=s).m,$a(o),o.ha)var c=void 0;else c=o.g.g-a,o.g.g=a,c=Lf(o.g,c);a=void 0,o=i,c&&((a=o[Tn]??(o[Tn]=new Pc))[r]??(a[r]=[])).push(c)}}return(i=xo(i))&&(i.da=e.qa[hu]),!0},n[Fc]=t,n[hu]=A0.bind(n),t}function A0(n,t,e,i){var s=this[Co];const r=this[Fc],a=ys(void 0,s.T),o=xo(n);if(o){var c=!1,l=s.ba;if(l){if(s=(h,u,d)=>{if(d.length!==0)if(l[u])for(const f of d){h=Pf(f);try{c=!0,r(a,h)}finally{Df(h)}}else i==null||i(n,u,d)},t==null)ro(o,s);else if(o!=null){const h=o[t];h&&s(o,t,h)}if(c){let h=0|n[At];if(2&h&&2048&h&&!(e!=null&&e.Ka))throw Error();const u=br(h),d=(f,g)=>{if(Li(n,f,u)!=null){if((e==null?void 0:e.Qa)===1)return;throw Error()}g!=null&&(h=Be(n,h,f,g,u)),delete o[f]};t==null?cf(a,0|a[At],((f,g)=>{d(f,g)})):d(t,Li(a,t,u))}}}}function w0(n){const t=(n=Hf(n))[0].g;if(n=n[1]){const e=ch(n),i=Ds(Co,ah,oh,n).T;return(s,r,a)=>t(s,r,a,i,e)}return t}function Ro(n,t,e){n[t]=e.h}function Lo(n,t,e,i){let s,r;const a=e.h;n[t]=(o,c,l)=>a(o,c,l,r||(r=Ds(wo,Ro,Lo,i).T),s||(s=Wf(i)))}function Wf(n){let t=n[lu];if(!t){const e=Ds(wo,Ro,Lo,n);t=(i,s)=>Xf(i,s,e),n[lu]=t}return t}function Xf(n,t,e){cf(n,0|n[At],((i,s)=>{if(s!=null){var r=(function(a,o){var c=a[o];if(c)return c;if((c=a.ba)&&(c=c[o])){var l=(c=Hf(c))[0].h;if(c=c[1]){const h=Wf(c),u=Ds(wo,Ro,Lo,c).T;c=a.ma?Vf(u,h):(d,f,g)=>l(d,f,g,u,h)}else c=l;return a[o]=c}})(e,i);r?r(t,s,i):i<500||or(Rc,3)}})),(n=xo(n))&&ro(n,((i,s,r)=>{for(dr(t,t.g.end()),i=0;i<r.length;i++)dr(t,Il(r[i])||new Uint8Array(0))}))}const C0=An(0);function Dr(n,t){if(Array.isArray(t)){var e=0|t[At];if(4&e)return t;for(var i=0,s=0;i<t.length;i++){const r=n(t[i]);r!=null&&(t[s++]=r)}return s<i&&(t.length=s),(n=-1537&(5|e))!==e&&ze(t,n),2&n&&Object.freeze(t),t}}function sn(n,t,e){return new Pr(n,t,e)}function Ir(n,t,e){return new Pr(n,t,e)}function rn(n,t,e){Be(n,0|n[At],t,e,br(0|n[At]))}var R0=Ao((function(n,t,e,i,s){if(n.h!==2)return!1;if(n=Jn(n=da(n,ys([void 0,void 0],i),s)),s=br(i=0|t[At]),2&i)throw Error();let r=Li(t,e,s);if(r instanceof Ri)(2&r.J)!=0?(r=r.V(),r.push(n),Be(t,i,e,r,s)):r.Ma(n);else if(Array.isArray(r)){var a=0|r[At];8192&a||ze(r,a|=8192),2&a&&(r=bf(r),Be(t,i,e,r,s)),r.push(n)}else Be(t,i,e,ea([n]),s);return!0}),(function(n,t,e,i,s){if(t instanceof Ri)t.forEach(((r,a)=>{lo(n,e,ys([a,r],i),s)}));else if(Array.isArray(t)){for(let r=0;r<t.length;r++){const a=t[r];Array.isArray(a)&&lo(n,e,ys(a,i),s)}ea(t)}}));function Yf(n,t,e){(t=ci(t))!=null&&(Vn(n,e,5),n=n.g,Ul(t),Ql(n))}function qf(n,t,e){if(t=(function(i){if(i==null)return i;const s=typeof i;if(s==="bigint")return String(la(64,i));if(ha(i)){if(s==="string")return mf(i);if(s==="number")return Bl(i)}})(t),t!=null&&(typeof t=="string"&&cu(t),t!=null))switch(Vn(n,e,0),typeof t){case"number":n=n.g,hr(t),tr(n,be,Fe);break;case"bigint":e=BigInt.asUintN(64,t),e=new Ic(Number(e&BigInt(4294967295)),Number(e>>BigInt(32))),tr(n.g,e.h,e.g);break;default:e=cu(t),tr(n.g,e.h,e.g)}}function jf(n,t,e){(t=Tr(t))!=null&&t!=null&&(Vn(n,e,0),Eo(n.g,t))}function $f(n,t,e){(t=df(t))!=null&&(Vn(n,e,0),n.g.g.push(t?1:0))}function Kf(n,t,e){(t=qe(t))!=null&&bo(n,e,Zd(t))}function Zf(n,t,e,i,s){lo(n,e,Gf(t,i),s)}function Jf(n,t,e){(t=t==null||typeof t=="string"||t instanceof li?t:void 0)!=null&&bo(n,e,$l(t,!0).buffer)}function Qf(n,t,e){(t=ff(t))!=null&&t!=null&&(Vn(n,e,0),Lr(n.g,t))}function tp(n,t,e){return(n.h===5||n.h===2)&&(t=Rr(t,0|t[At],e),n.h==2?So(n,oo,t):t.push(oo(n.g)),!0)}var Ue=sn((function(n,t,e){return n.h===5&&(rn(t,e,oo(n.g)),!0)}),Yf,To),L0=Ir(tp,(function(n,t,e){if((t=Dr(ci,t))!=null)for(let a=0;a<t.length;a++){var i=n,s=e,r=t[a];r!=null&&(Vn(i,s,5),i=i.g,Ul(r),Ql(i))}}),To),lh=Ir(tp,(function(n,t,e){if((t=Dr(ci,t))!=null&&t.length){Vn(n,e,2),Lr(n.g,4*t.length);for(let i=0;i<t.length;i++)e=n.g,Ul(t[i]),Ql(e)}}),To),P0=sn((function(n,t,e){return n.h===5&&(rn(t,e,(n=oo(n.g))===0?void 0:n),!0)}),Yf,To),Ji=sn((function(n,t,e){return n.h!==0?n=!1:(rn(t,e,Kl(n.g,uf)),n=!0),n}),qf,Nf),Xo=sn((function(n,t,e){return n.h!==0?t=!1:(rn(t,e,(n=Kl(n.g,uf))===C0?void 0:n),t=!0),t}),qf,Nf),D0=sn((function(n,t,e){return n.h!==0?n=!1:(rn(t,e,Kl(n.g,n0)),n=!0),n}),(function(n,t,e){if(t=(function(i){if(i==null)return i;var s=typeof i;if(s==="bigint")return String(i0(64,i));if(ha(i)){if(s==="string")return s=ur(Number(i)),ws(s)&&s>=0?i=String(s):((s=i.indexOf("."))!==-1&&(i=i.substring(0,s)),(s=i[0]!=="-"&&((s=i.length)<20||s===20&&i<="18446744073709551615"))||(_o(i),i=na(be,Fe))),i;if(s==="number")return(i=ur(i))>=0&&ws(i)||(hr(i),i=hf(be,Fe)),i}})(t),t!=null&&(typeof t=="string"&&ou(t),t!=null))switch(Vn(n,e,0),typeof t){case"number":n=n.g,hr(t),tr(n,be,Fe);break;case"bigint":e=BigInt.asUintN(64,t),e=new Dc(Number(e&BigInt(4294967295)),Number(e>>BigInt(32))),tr(n.g,e.h,e.g);break;default:e=ou(t),tr(n.g,e.h,e.g)}}),E0),Oe=sn((function(n,t,e){return n.h===0&&(rn(t,e,Zi(n.g)),!0)}),jf,sh),fa=Ir((function(n,t,e){return(n.h===0||n.h===2)&&(t=Rr(t,0|t[At],e),n.h==2?So(n,Zi,t):t.push(Zi(n.g)),!0)}),(function(n,t,e){if((t=Dr(Tr,t))!=null&&t.length){e=th(n,e);for(let i=0;i<t.length;i++)Eo(n.g,t[i]);eh(n,e)}}),sh),Js=sn((function(n,t,e){return n.h===0&&(rn(t,e,(n=Zi(n.g))===0?void 0:n),!0)}),jf,sh),Ae=sn((function(n,t,e){return n.h===0&&(rn(t,e,Zl(n.g)),!0)}),$f,Uf),bs=sn((function(n,t,e){return n.h===0&&(rn(t,e,(n=Zl(n.g))===!1?void 0:n),!0)}),$f,Uf),Ze=Ir((function(n,t,e){return n.h===2&&(n=Jl(n),Rr(t,0|t[At],e).push(n),!0)}),(function(n,t,e){if((t=Dr(qe,t))!=null)for(let a=0;a<t.length;a++){var i=n,s=e,r=t[a];r!=null&&bo(i,s,Zd(r))}}),ih),Yi=sn((function(n,t,e){return n.h===2&&(rn(t,e,(n=Jl(n))===""?void 0:n),!0)}),Kf,ih),me=sn((function(n,t,e){return n.h===2&&(rn(t,e,Jl(n)),!0)}),Kf,ih),Ye=(function(n,t,e=nh){return new Pr(n,t,e)})((function(n,t,e,i,s){return n.h===2&&(i=ys(void 0,i),Rr(t,0|t[At],e).push(i),da(n,i,s),!0)}),(function(n,t,e,i,s){if(Array.isArray(t)){for(let r=0;r<t.length;r++)Zf(n,t[r],e,i,s);1&(n=0|t[At])||ze(t,1|n)}})),Me=Ao((function(n,t,e,i,s,r){if(n.h!==2)return!1;let a=0|t[At];return Tf(t,a,r,e,br(a)),da(n,t=ql(t,i,e),s),!0}),Zf),ep=sn((function(n,t,e){return n.h===2&&(rn(t,e,Ff(n)),!0)}),Jf,Of),I0=Ir((function(n,t,e){return(n.h===0||n.h===2)&&(t=Rr(t,0|t[At],e),n.h==2?So(n,hi,t):t.push(hi(n.g)),!0)}),(function(n,t,e){if((t=Dr(ff,t))!=null)for(let a=0;a<t.length;a++){var i=n,s=e,r=t[a];r!=null&&(Vn(i,s,0),Lr(i.g,r))}}),rh),F0=sn((function(n,t,e){return n.h===0&&(rn(t,e,(n=hi(n.g))===0?void 0:n),!0)}),Qf,rh),Qe=sn((function(n,t,e){return n.h===0&&(rn(t,e,Zi(n.g)),!0)}),(function(n,t,e){(t=Tr(t))!=null&&(t=parseInt(t,10),Vn(n,e,0),Eo(n.g,t))}),Bf);class U0{constructor(t,e){var i=Pn;this.g=t,this.h=e,this.m=re,this.j=Bt,this.defaultValue=void 0,this.l=i.Oa!=null?lf:void 0}register(){po(this)}}function pi(n,t){return new U0(n,t)}function es(n,t){return(e,i)=>{{const r={ea:!0};i&&Object.assign(r,i),e=Pf(e,void 0,void 0,r);try{const a=new n,o=a.v;ch(t)(o,e);var s=a}finally{Df(e)}}return s}}function Po(n){return function(){const t=new class{constructor(){this.l=[],this.h=0,this.g=new class{constructor(){this.g=[]}length(){return this.g.length}end(){const a=this.g;return this.g=[],a}}}};Xf(this.v,t,Ds(wo,Ro,Lo,n)),dr(t,t.g.end());const e=new Uint8Array(t.h),i=t.l,s=i.length;let r=0;for(let a=0;a<s;a++){const o=i[a];e.set(o,r),r+=o.length}return t.l=[e],e}}var uu=class extends wt{constructor(n){super(n)}},du=[0,Yi,sn((function(n,t,e){return n.h===2&&(rn(t,e,(n=Ff(n))===Ts()?void 0:n),!0)}),(function(n,t,e){if(t!=null){if(t instanceof wt){const i=t.Ra;return void(i?(t=i(t),t!=null&&bo(n,e,$l(t,!0).buffer)):or(Rc,3))}if(Array.isArray(t))return void or(Rc,3)}Jf(n,t,e)}),Of)];let Yo,fu=globalThis.trustedTypes;function pu(n){var t;return Yo===void 0&&(Yo=(function(){let e=null;if(!fu)return e;try{const i=s=>s;e=fu.createPolicy("goog#html",{createHTML:i,createScript:i,createScriptURL:i})}catch{}return e})()),n=(t=Yo)?t.createScriptURL(n):n,new class{constructor(e){this.g=e}toString(){return this.g+""}}(n)}function Ea(n,...t){if(t.length===0)return pu(n[0]);let e=n[0];for(let i=0;i<t.length;i++)e+=encodeURIComponent(t[i])+n[i+1];return pu(e)}var np=[0,Oe,Qe,Ae,-1,fa,Qe,-1,Ae],N0=class extends wt{constructor(n){super(n)}},ip=[0,Ae,me,Ae,Qe,-1,Ir((function(n,t,e){return(n.h===0||n.h===2)&&(t=Rr(t,0|t[At],e),n.h==2?So(n,x0,t):t.push(Zi(n.g)),!0)}),(function(n,t,e){if((t=Dr(Tr,t))!=null&&t.length){e=th(n,e);for(let i=0;i<t.length;i++)Eo(n.g,t[i]);eh(n,e)}}),Bf),me,-1,[0,Ae,-1],Qe,Ae,-1],sp=[0,3,Ae,-1,2,[0,[2],Oe,Me,[0,sn((function(n,t,e){return n.h===0&&(rn(t,e,hi(n.g)),!0)}),Qf,rh)]],[0,Qe,Ae,Qe,Ae,Qe,Ae,me,-1],[0,[3,4],me,-1,Me,[0,Oe],Me,[0,Qe]],[0]],rp=[0,me,-2],mu=class extends wt{constructor(n){super(n)}},ap=[0],op=[0,Oe,Ae,1,Ae,-4],Pn=class extends wt{constructor(n){super(n,2)}},ke={};ke[336783863]=[0,me,Ae,-1,Oe,[0,[1,2,3,4,5,6,7,8,9],Me,ap,Me,ip,Me,rp,Me,op,Me,np,Me,[0,me,-2],Me,[0,me,Qe],Me,sp,Me,[0,Qe,-1,Ae]],[0,me],Ae,[0,[1,3],[2,4],Me,[0,fa],-1,Me,[0,Ze],-1,Ye,[0,me,-1]],me];var gu=[0,Xo,-1,bs,-3,Xo,fa,Yi,Js,Xo,-1,bs,Js,bs,-2,Yi];function Se(n,t){Mo(n,3,t)}function Qt(n,t){Mo(n,4,t)}var gn=class extends wt{constructor(n){super(n,500)}o(n){return Bt(this,0,7,n)}},Zr=[-1,{}],_u=[0,me,1,Zr],vu=[0,me,Ze,Zr];function Hn(n,t){jl(n,1,gn,t)}function we(n,t){Mo(n,10,t)}function ce(n,t){Mo(n,15,t)}var Dn=class extends wt{constructor(n){super(n,500)}o(n){return Bt(this,0,1001,n)}},cp=[-500,Ye,[-500,Yi,-1,Ze,-3,[-2,ke,Ae],Ye,du,Js,-1,_u,vu,Ye,[0,Yi,bs],Yi,gu,Js,Ze,987,Ze],4,Ye,[-500,me,-1,[-1,{}],998,me],Ye,[-500,me,Ze,-1,[-2,{},Ae],997,Ze,-1],Js,Ye,[-500,me,Ze,Zr,998,Ze],Ze,Js,_u,vu,Ye,[0,Yi,-1,Zr],Ze,-2,gu,Yi,-1,bs,[0,bs,F0],978,Zr,Ye,du];Dn.prototype.g=Po(cp);var O0=es(Dn,cp),B0=class extends wt{constructor(n){super(n)}},lp=class extends wt{constructor(n){super(n)}g(){return Pi(this,B0,1)}},hp=[0,Ye,[0,Oe,Ue,me,-1]],Do=es(lp,hp),k0=class extends wt{constructor(n){super(n)}},z0=class extends wt{constructor(n){super(n)}},qo=class extends wt{constructor(n){super(n)}l(){return re(this,k0,2)}g(){return Pi(this,z0,5)}},up=es(class extends wt{constructor(n){super(n)}},[0,Ze,fa,lh,[0,Qe,[0,Oe,-3],[0,Ue,-3],[0,Oe,-1,[0,Ye,[0,Oe,-2]]],Ye,[0,Ue,-1,me,Ue]],me,-1,Ji,Ye,[0,Oe,Ue],Ze,Ji]),dp=class extends wt{constructor(n){super(n)}},er=es(class extends wt{constructor(n){super(n)}},[0,Ye,[0,Ue,-4]]),fp=class extends wt{constructor(n){super(n)}},pa=es(class extends wt{constructor(n){super(n)}},[0,Ye,[0,Ue,-4]]),V0=class extends wt{constructor(n){super(n)}},H0=[0,Oe,-1,lh,Qe],pp=class extends wt{constructor(n){super(n)}};pp.prototype.g=Po([0,Ue,-4,Ji]);var G0=class extends wt{constructor(n){super(n)}},W0=es(class extends wt{constructor(n){super(n)}},[0,Ye,[0,1,Oe,me,hp],Ji]),xu=class extends wt{constructor(n){super(n)}},X0=class extends wt{constructor(n){super(n)}na(){const n=Te(this,1,void 0,void 0,Ef);return n??Ts()}},Y0=class extends wt{constructor(n){super(n)}},mp=[1,2],q0=es(class extends wt{constructor(n){super(n)}},[0,Ye,[0,mp,Me,[0,lh],Me,[0,ep],Oe,me],Ji]),hh=class extends wt{constructor(n){super(n)}},gp=[0,me,Oe,Ue,Ze,-1],yu=class extends wt{constructor(n){super(n)}},j0=[0,Ae,-1],Mu=class extends wt{constructor(n){super(n)}},Ka=[1,2,3,4,5,6],ho=class extends wt{constructor(n){super(n)}g(){return Te(this,1,void 0,void 0,Ef)!=null}l(){return qe(Te(this,2))!=null}},Re=class extends wt{constructor(n){super(n)}g(){return df(Te(this,2))??!1}},_p=[0,ep,me,[0,Oe,Ji,-1],[0,D0,Ji]],Ne=[0,_p,Ae,[0,Ka,Me,op,Me,ip,Me,np,Me,ap,Me,rp,Me,sp],Qe],Io=class extends wt{constructor(n){super(n)}},uh=[0,Ne,Ue,-1,Oe],$0=pi(502141897,Io);ke[502141897]=uh;var K0=es(class extends wt{constructor(n){super(n)}},[0,[0,Qe,-1,L0,I0],H0]),vp=class extends wt{constructor(n){super(n)}},xp=class extends wt{constructor(n){super(n)}},Uc=[0,Ne,Ue,[0,Ne],Ae],Z0=pi(508968150,xp);ke[508968150]=[0,Ne,uh,Uc,Ue,[0,[0,_p]]],ke[508968149]=Uc;var Os=class extends wt{constructor(n){super(n)}l(){return re(this,hh,2)}g(){pe(this,2)}},yp=[0,Ne,gp];ke[478825465]=yp;var J0=class extends wt{constructor(n){super(n)}},Mp=class extends wt{constructor(n){super(n)}},dh=class extends wt{constructor(n){super(n)}},fh=class extends wt{constructor(n){super(n)}},Sp=class extends wt{constructor(n){super(n)}},Su=[0,Ne,[0,Ne],yp,-1],Ep=[0,Ne,Ue,Oe],ph=[0,Ne,Ue],bp=[0,Ne,Ep,ph,Ue],Q0=pi(479097054,Sp);ke[479097054]=[0,Ne,bp,Su],ke[463370452]=Su,ke[464864288]=Ep;var tg=pi(462713202,fh);ke[462713202]=bp,ke[474472470]=ph;var eg=class extends wt{constructor(n){super(n)}},Tp=class extends wt{constructor(n){super(n)}},Ap=class extends wt{constructor(n){super(n)}},wp=class extends wt{constructor(n){super(n)}},mh=[0,Ne,Ue,-1,Oe],Nc=[0,Ne,Ue,Ae];wp.prototype.g=Po([0,Ne,ph,[0,Ne],uh,Uc,mh,Nc]);var Cp=class extends wt{constructor(n){super(n)}},ng=pi(456383383,Cp);ke[456383383]=[0,Ne,gp];var Rp=class extends wt{constructor(n){super(n)}},ig=pi(476348187,Rp);ke[476348187]=[0,Ne,j0];var Lp=class extends wt{constructor(n){super(n)}},Eu=class extends wt{constructor(n){super(n)}},Pp=[0,Qe,-1],sg=pi(458105876,class extends wt{constructor(n){super(n)}g(){let n;var t=this.v;const e=0|t[At];return n=Cn(this,e),t=(function(i,s,r,a){var o=Eu;!a&&wr(i)&&(r=0|(s=i.v)[At]);var c=Li(s,2);if(i=!1,c==null){if(a)return iu();c=[]}else if(c.constructor===Ri){if(!(2&c.J)||a)return c;c=c.V()}else Array.isArray(c)?i=!!(2&(0|c[At])):c=[];if(a){if(!c.length)return iu();i||(i=!0,ca(c))}else i&&(i=!1,ea(c),c=bf(c));return!i&&32&r&&oa(c,32),r=Be(s,r,2,a=new Ri(c,o,a0,void 0)),i||Ps(s,r),a})(this,t,e,n),!n&&Eu&&(t.ra=!0),t}});ke[458105876]=[0,Pp,R0,[!0,Ji,[0,me,-1,Ze]],[0,fa,Ae,Qe]];var gh=class extends wt{constructor(n){super(n)}},Dp=pi(458105758,gh);ke[458105758]=[0,Ne,me,Pp];var jo=class extends wt{constructor(n){super(n)}},bu=[0,P0,-1,bs],rg=class extends wt{constructor(n){super(n)}},Ip=class extends wt{constructor(n){super(n)}},Oc=[1,2];Ip.prototype.g=Po([0,Oc,Me,bu,Me,[0,Ye,bu]]);var Fp=class extends wt{constructor(n){super(n)}},ag=pi(443442058,Fp);ke[443442058]=[0,Ne,me,Oe,Ue,Ze,-1,Ae,Ue],ke[514774813]=mh;var Up=class extends wt{constructor(n){super(n)}},og=pi(516587230,Up);function Bc(n,t){return t=t?t.clone():new hh,n.displayNamesLocale!==void 0?pe(t,1,ua(n.displayNamesLocale)):n.displayNamesLocale===void 0&&pe(t,1),n.maxResults!==void 0?Di(t,2,n.maxResults):"maxResults"in n&&pe(t,2),n.scoreThreshold!==void 0?Dt(t,3,n.scoreThreshold):"scoreThreshold"in n&&pe(t,3),n.categoryAllowlist!==void 0?ao(t,4,n.categoryAllowlist):"categoryAllowlist"in n&&pe(t,4),n.categoryDenylist!==void 0?ao(t,5,n.categoryDenylist):"categoryDenylist"in n&&pe(t,5),t}function Np(n){const t=Number(n);return Number.isSafeInteger(t)?t:String(n)}function _h(n,t=-1,e=""){return{categories:n.map((i=>({index:kn(i,1)??0??-1,score:Pe(i,2)??0,categoryName:qe(Te(i,3))??""??"",displayName:qe(Te(i,4))??""??""}))),headIndex:t,headName:e}}function cg(n){const t={classifications:Pi(n,G0,1).map((e=>{var i;return _h(((i=re(e,lp,4))==null?void 0:i.g())??[],kn(e,2)??0,qe(Te(e,3))??"")}))};return(function(e){return e==null?e:typeof e=="bigint"?(Lc(e)?e=Number(e):(e=la(64,e),e=Lc(e)?Number(e):String(e)),e):ha(e)?typeof e=="number"?Bl(e):mf(e):void 0})(Te(n,2,void 0,void 0,so))!=null&&(t.timestampMs=Np(Te(n,2,void 0,void 0,so)??Mf)),t}function Op(n){var a,o;var t=gs(n,3,ci,ms()),e=gs(n,2,Tr,ms()),i=gs(n,1,qe,ms()),s=gs(n,9,qe,ms());const r={categories:[],keypoints:[]};for(let c=0;c<t.length;c++)r.categories.push({score:t[c],index:e[c]??-1,categoryName:i[c]??"",displayName:s[c]??""});if((t=(a=re(n,qo,4))==null?void 0:a.l())&&(r.boundingBox={originX:kn(t,1,Ni)??0,originY:kn(t,2,Ni)??0,width:kn(t,3,Ni)??0,height:kn(t,4,Ni)??0,angle:0}),(o=re(n,qo,4))==null?void 0:o.g().length)for(const c of re(n,qo,4).g())r.keypoints.push({x:Te(c,1,void 0,Ni,ci)??0,y:Te(c,2,void 0,Ni,ci)??0,score:Te(c,4,void 0,Ni,ci)??0,label:qe(Te(c,3,void 0,Ni))??""});return r}function Fo(n){const t=[];for(const e of Pi(n,fp,1))t.push({x:Pe(e,1)??0,y:Pe(e,2)??0,z:Pe(e,3)??0,visibility:Pe(e,4)??0});return t}function Jr(n){const t=[];for(const e of Pi(n,dp,1))t.push({x:Pe(e,1)??0,y:Pe(e,2)??0,z:Pe(e,3)??0,visibility:Pe(e,4)??0});return t}function Tu(n){return Array.from(n,(t=>t>127?t-256:t))}function Au(n,t){if(n.length!==t.length)throw Error(`Cannot compute cosine similarity between embeddings of different sizes (${n.length} vs. ${t.length}).`);let e=0,i=0,s=0;for(let r=0;r<n.length;r++)e+=n[r]*t[r],i+=n[r]*n[r],s+=t[r]*t[r];if(i<=0||s<=0)throw Error("Cannot compute cosine similarity on embedding with 0 norm.");return e/Math.sqrt(i*s)}let ba;ke[516587230]=[0,Ne,mh,Nc,Ue],ke[518928384]=Nc;const lg=new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);async function Bp(n){if(n)return!0;if(ba===void 0)try{await WebAssembly.instantiate(lg),ba=!0}catch{ba=!1}return ba}async function Ta(n,t,e){return{wasmLoaderPath:`${t}/${n}_${e=`wasm${e?"_module":""}${await Bp(e)?"":"_nosimd"}_internal`}.js`,wasmBinaryPath:`${t}/${n}_${e}.wasm`}}var ds=class{};function kp(){var n=navigator;return typeof OffscreenCanvas<"u"&&(!(function(t=navigator){return(t=t.userAgent).includes("Safari")&&!t.includes("Chrome")})(n)||!!((n=n.userAgent.match(/Version\/([\d]+).*Safari/))&&n.length>=1&&Number(n[1])>=17))}async function wu(n){if(typeof importScripts!="function"){const t=document.createElement("script");return t.src=n.toString(),t.crossOrigin="anonymous",new Promise(((e,i)=>{t.addEventListener("load",(()=>{e()}),!1),t.addEventListener("error",(s=>{i(s)}),!1),document.body.appendChild(t)}))}try{importScripts(n.toString())}catch(t){if(!(t instanceof TypeError))throw t;{const e=self.import;e?await e(n.toString()):await import(n.toString())}}}function zp(n){return n.videoWidth!==void 0?[n.videoWidth,n.videoHeight]:n.naturalWidth!==void 0?[n.naturalWidth,n.naturalHeight]:n.displayWidth!==void 0?[n.displayWidth,n.displayHeight]:[n.width,n.height]}function Lt(n,t,e){n.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target"),e(t=n.i.stringToNewUTF8(t)),n.i._free(t)}function Cu(n,t,e){if(!n.i.canvas)throw Error("No OpenGL canvas configured.");if(e?n.i._bindTextureToStream(e):n.i._bindTextureToCanvas(),!(e=n.i.canvas.getContext("webgl2")||n.i.canvas.getContext("webgl")))throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");n.i.gpuOriginForWebTexturesIsBottomLeft&&e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t),n.i.gpuOriginForWebTexturesIsBottomLeft&&e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1);const[i,s]=zp(t);return!n.l||i===n.i.canvas.width&&s===n.i.canvas.height||(n.i.canvas.width=i,n.i.canvas.height=s),[i,s]}function Ru(n,t,e){n.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target");const i=new Uint32Array(t.length);for(let s=0;s<t.length;s++)i[s]=n.i.stringToNewUTF8(t[s]);t=n.i._malloc(4*i.length),n.i.HEAPU32.set(i,t>>2),e(t);for(const s of i)n.i._free(s);n.i._free(t)}function ri(n,t,e){n.i.simpleListeners=n.i.simpleListeners||{},n.i.simpleListeners[t]=e}function Oi(n,t,e){let i=[];n.i.simpleListeners=n.i.simpleListeners||{},n.i.simpleListeners[t]=(s,r,a)=>{r?(e(i,a),i=[]):i.push(s)}}ds.forVisionTasks=function(n,t=!1){return Ta("vision",n??Ea``,t)},ds.forTextTasks=function(n,t=!1){return Ta("text",n??Ea``,t)},ds.forGenAiTasks=function(n,t=!1){return Ta("genai",n??Ea``,t)},ds.forAudioTasks=function(n,t=!1){return Ta("audio",n??Ea``,t)},ds.isSimdSupported=function(n=!1){return Bp(n)};async function hg(n,t,e,i){return n=await(async(s,r,a,o,c)=>{if(r&&await wu(r),!self.ModuleFactory||a&&(await wu(a),!self.ModuleFactory))throw Error("ModuleFactory not set.");return self.Module&&c&&((r=self.Module).locateFile=c.locateFile,c.mainScriptUrlOrBlob&&(r.mainScriptUrlOrBlob=c.mainScriptUrlOrBlob)),c=await self.ModuleFactory(self.Module||c),self.ModuleFactory=self.Module=void 0,new s(c,o)})(n,e.wasmLoaderPath,e.assetLoaderPath,t,{locateFile:s=>s.endsWith(".wasm")?e.wasmBinaryPath.toString():e.assetBinaryPath&&s.endsWith(".data")?e.assetBinaryPath.toString():s}),await n.o(i),n}function $o(n,t){const e=re(n.baseOptions,ho,1)||new ho;typeof t=="string"?(pe(e,2,ua(t)),pe(e,1)):t instanceof Uint8Array&&(pe(e,1,Fl(t,!1)),pe(e,2)),Bt(n.baseOptions,0,1,e)}function Lu(n){try{const t=n.H.length;if(t===1)throw Error(n.H[0].message);if(t>1)throw Error("Encountered multiple errors: "+n.H.map((e=>e.message)).join(", "))}finally{n.H=[]}}function vt(n,t){n.C=Math.max(n.C,t)}function Uo(n,t){n.B=new gn,Rn(n.B,2,"PassThroughCalculator"),Se(n.B,"free_memory"),Qt(n.B,"free_memory_unused_out"),we(t,"free_memory"),Hn(t,n.B)}function fr(n,t){Se(n.B,t),Qt(n.B,t+"_unused_out")}function No(n){n.g.addBoolToStream(!0,"free_memory",n.C)}var kc=class{constructor(n){this.g=n,this.H=[],this.C=0,this.g.setAutoRenderToScreen(!1)}l(n,t=!0){var e,i,s,r,a,o;if(t){const c=n.baseOptions||{};if((e=n.baseOptions)!=null&&e.modelAssetBuffer&&((i=n.baseOptions)!=null&&i.modelAssetPath))throw Error("Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer");if(!((s=re(this.baseOptions,ho,1))!=null&&s.g()||(r=re(this.baseOptions,ho,1))!=null&&r.l()||(a=n.baseOptions)!=null&&a.modelAssetBuffer||(o=n.baseOptions)!=null&&o.modelAssetPath))throw Error("Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set");if((function(l,h){let u=re(l.baseOptions,Mu,3);if(!u){var d=u=new Mu,f=new mu;Kr(d,4,Ka,f)}"delegate"in h&&(h.delegate==="GPU"?(h=u,d=new N0,Kr(h,2,Ka,d)):(h=u,d=new mu,Kr(h,4,Ka,d))),Bt(l.baseOptions,0,3,u)})(this,c),c.modelAssetPath)return fetch(c.modelAssetPath.toString()).then((l=>{if(l.ok)return l.arrayBuffer();throw Error(`Failed to fetch model: ${c.modelAssetPath} (${l.status})`)})).then((l=>{try{this.g.i.FS_unlink("/model.dat")}catch{}this.g.i.FS_createDataFile("/","model.dat",new Uint8Array(l),!0,!1,!1),$o(this,"/model.dat"),this.m(),this.L()}));if(c.modelAssetBuffer instanceof Uint8Array)$o(this,c.modelAssetBuffer);else if(c.modelAssetBuffer)return(async function(l){const h=[];for(var u=0;;){const{done:d,value:f}=await l.read();if(d)break;h.push(f),u+=f.length}if(h.length===0)return new Uint8Array(0);if(h.length===1)return h[0];l=new Uint8Array(u),u=0;for(const d of h)l.set(d,u),u+=d.length;return l})(c.modelAssetBuffer).then((l=>{$o(this,l),this.m(),this.L()}))}return this.m(),this.L(),Promise.resolve()}L(){}ca(){let n;if(this.g.ca((t=>{n=O0(t)})),!n)throw Error("Failed to retrieve CalculatorGraphConfig");return n}setGraph(n,t){this.g.attachErrorListener(((e,i)=>{this.H.push(Error(i))})),this.g.Ja(),this.g.setGraph(n,t),this.B=void 0,Lu(this)}finishProcessing(){this.g.finishProcessing(),Lu(this)}close(){this.B=void 0,this.g.closeGraph()}};function ji(n,t){if(!n)throw Error(`Unable to obtain required WebGL resource: ${t}`);return n}kc.prototype.close=kc.prototype.close;class ug{constructor(t,e,i,s){this.g=t,this.h=e,this.m=i,this.l=s}bind(){this.g.bindVertexArray(this.h)}close(){this.g.deleteVertexArray(this.h),this.g.deleteBuffer(this.m),this.g.deleteBuffer(this.l)}}function Pu(n,t,e){const i=n.g;if(e=ji(i.createShader(e),"Failed to create WebGL shader"),i.shaderSource(e,t),i.compileShader(e),!i.getShaderParameter(e,i.COMPILE_STATUS))throw Error(`Could not compile WebGL shader: ${i.getShaderInfoLog(e)}`);return i.attachShader(n.h,e),e}function Du(n,t){const e=n.g,i=ji(e.createVertexArray(),"Failed to create vertex array");e.bindVertexArray(i);const s=ji(e.createBuffer(),"Failed to create buffer");e.bindBuffer(e.ARRAY_BUFFER,s),e.enableVertexAttribArray(n.O),e.vertexAttribPointer(n.O,2,e.FLOAT,!1,0,0),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW);const r=ji(e.createBuffer(),"Failed to create buffer");return e.bindBuffer(e.ARRAY_BUFFER,r),e.enableVertexAttribArray(n.L),e.vertexAttribPointer(n.L,2,e.FLOAT,!1,0,0),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t?[0,1,0,0,1,0,1,1]:[0,0,0,1,1,1,1,0]),e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindVertexArray(null),new ug(e,i,s,r)}function vh(n,t){if(n.g){if(t!==n.g)throw Error("Cannot change GL context once initialized")}else n.g=t}function dg(n,t,e,i){return vh(n,t),n.h||(n.m(),n.D()),e?(n.u||(n.u=Du(n,!0)),e=n.u):(n.A||(n.A=Du(n,!1)),e=n.A),t.useProgram(n.h),e.bind(),n.l(),n=i(),e.g.bindVertexArray(null),n}function Vp(n,t,e){return vh(n,t),n=ji(t.createTexture(),"Failed to create texture"),t.bindTexture(t.TEXTURE_2D,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,e??t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,e??t.LINEAR),t.bindTexture(t.TEXTURE_2D,null),n}function Hp(n,t,e){vh(n,t),n.B||(n.B=ji(t.createFramebuffer(),"Failed to create framebuffe.")),t.bindFramebuffer(t.FRAMEBUFFER,n.B),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0)}function fg(n){var t;(t=n.g)==null||t.bindFramebuffer(n.g.FRAMEBUFFER,null)}var Gp=class{H(){return`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
  }
 `}m(){const n=this.g;if(this.h=ji(n.createProgram(),"Failed to create WebGL program"),this.X=Pu(this,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,n.VERTEX_SHADER),this.W=Pu(this,this.H(),n.FRAGMENT_SHADER),n.linkProgram(this.h),!n.getProgramParameter(this.h,n.LINK_STATUS))throw Error(`Error during program linking: ${n.getProgramInfoLog(this.h)}`);this.O=n.getAttribLocation(this.h,"aVertex"),this.L=n.getAttribLocation(this.h,"aTex")}D(){}l(){}close(){if(this.h){const n=this.g;n.deleteProgram(this.h),n.deleteShader(this.X),n.deleteShader(this.W)}this.B&&this.g.deleteFramebuffer(this.B),this.A&&this.A.close(),this.u&&this.u.close()}};function bi(n,t){switch(t){case 0:return n.g.find((e=>e instanceof Uint8Array));case 1:return n.g.find((e=>e instanceof Float32Array));case 2:return n.g.find((e=>typeof WebGLTexture<"u"&&e instanceof WebGLTexture));default:throw Error(`Type is not supported: ${t}`)}}function zc(n){var t=bi(n,1);if(!t){if(t=bi(n,0))t=new Float32Array(t).map((i=>i/255));else{t=new Float32Array(n.width*n.height);const i=pr(n);var e=xh(n);if(Hp(e,i,Wp(n)),"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"document"in self&&"ontouchend"in self.document){e=new Float32Array(n.width*n.height*4),i.readPixels(0,0,n.width,n.height,i.RGBA,i.FLOAT,e);for(let s=0,r=0;s<t.length;++s,r+=4)t[s]=e[r]}else i.readPixels(0,0,n.width,n.height,i.RED,i.FLOAT,t)}n.g.push(t)}return t}function Wp(n){let t=bi(n,2);if(!t){const e=pr(n);t=Yp(n);const i=zc(n),s=Xp(n);e.texImage2D(e.TEXTURE_2D,0,s,n.width,n.height,0,e.RED,e.FLOAT,i),Vc(n)}return t}function pr(n){if(!n.canvas)throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");return n.h||(n.h=ji(n.canvas.getContext("webgl2"),"You cannot use a canvas that is already bound to a different type of rendering context.")),n.h}function Xp(n){if(n=pr(n),!Aa)if(n.getExtension("EXT_color_buffer_float")&&n.getExtension("OES_texture_float_linear")&&n.getExtension("EXT_float_blend"))Aa=n.R32F;else{if(!n.getExtension("EXT_color_buffer_half_float"))throw Error("GPU does not fully support 4-channel float32 or float16 formats");Aa=n.R16F}return Aa}function xh(n){return n.l||(n.l=new Gp),n.l}function Yp(n){const t=pr(n);t.viewport(0,0,n.width,n.height),t.activeTexture(t.TEXTURE0);let e=bi(n,2);return e||(e=Vp(xh(n),t,n.m?t.LINEAR:t.NEAREST),n.g.push(e),n.j=!0),t.bindTexture(t.TEXTURE_2D,e),e}function Vc(n){n.h.bindTexture(n.h.TEXTURE_2D,null)}var Aa,We=class{constructor(n,t,e,i,s,r,a){this.g=n,this.m=t,this.j=e,this.canvas=i,this.l=s,this.width=r,this.height=a,this.j&&--Iu===0&&console.error("You seem to be creating MPMask instances without invoking .close(). This leaks resources.")}Fa(){return!!bi(this,0)}ka(){return!!bi(this,1)}R(){return!!bi(this,2)}ja(){return(t=bi(n=this,0))||(t=zc(n),t=new Uint8Array(t.map((e=>Math.round(255*e)))),n.g.push(t)),t;var n,t}ia(){return zc(this)}N(){return Wp(this)}clone(){const n=[];for(const t of this.g){let e;if(t instanceof Uint8Array)e=new Uint8Array(t);else if(t instanceof Float32Array)e=new Float32Array(t);else{if(!(t instanceof WebGLTexture))throw Error(`Type is not supported: ${t}`);{const i=pr(this),s=xh(this);i.activeTexture(i.TEXTURE1),e=Vp(s,i,this.m?i.LINEAR:i.NEAREST),i.bindTexture(i.TEXTURE_2D,e);const r=Xp(this);i.texImage2D(i.TEXTURE_2D,0,r,this.width,this.height,0,i.RED,i.FLOAT,null),i.bindTexture(i.TEXTURE_2D,null),Hp(s,i,e),dg(s,i,!1,(()=>{Yp(this),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.drawArrays(i.TRIANGLE_FAN,0,4),Vc(this)})),fg(s),Vc(this)}}n.push(e)}return new We(n,this.m,this.R(),this.canvas,this.l,this.width,this.height)}close(){this.j&&pr(this).deleteTexture(bi(this,2)),Iu=-1}};We.prototype.close=We.prototype.close,We.prototype.clone=We.prototype.clone,We.prototype.getAsWebGLTexture=We.prototype.N,We.prototype.getAsFloat32Array=We.prototype.ia,We.prototype.getAsUint8Array=We.prototype.ja,We.prototype.hasWebGLTexture=We.prototype.R,We.prototype.hasFloat32Array=We.prototype.ka,We.prototype.hasUint8Array=We.prototype.Fa;var Iu=250;function ti(...n){return n.map((([t,e])=>({start:t,end:e})))}const pg=(function(n){return class extends n{Ja(){this.i._registerModelResourcesGraphService()}}})((Fu=class{constructor(n,t){this.l=!0,this.i=n,this.g=null,this.h=0,this.m=typeof this.i._addIntToInputStream=="function",t!==void 0?this.i.canvas=t:kp()?this.i.canvas=new OffscreenCanvas(1,1):(console.warn("OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas."),this.i.canvas=document.createElement("canvas"))}async initializeGraph(n){const t=await(await fetch(n)).arrayBuffer();n=!(n.endsWith(".pbtxt")||n.endsWith(".textproto")),this.setGraph(new Uint8Array(t),n)}setGraphFromString(n){this.setGraph(new TextEncoder().encode(n),!1)}setGraph(n,t){const e=n.length,i=this.i._malloc(e);this.i.HEAPU8.set(n,i),t?this.i._changeBinaryGraph(e,i):this.i._changeTextGraph(e,i),this.i._free(i)}configureAudio(n,t,e,i,s){this.i._configureAudio||console.warn('Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?'),Lt(this,i||"input_audio",(r=>{Lt(this,s=s||"audio_header",(a=>{this.i._configureAudio(r,a,n,t??0,e)}))}))}setAutoResizeCanvas(n){this.l=n}setAutoRenderToScreen(n){this.i._setAutoRenderToScreen(n)}setGpuBufferVerticalFlip(n){this.i.gpuOriginForWebTexturesIsBottomLeft=n}ca(n){ri(this,"__graph_config__",(t=>{n(t)})),Lt(this,"__graph_config__",(t=>{this.i._getGraphConfig(t,void 0)})),delete this.i.simpleListeners.__graph_config__}attachErrorListener(n){this.i.errorListener=n}attachEmptyPacketListener(n,t){this.i.emptyPacketListeners=this.i.emptyPacketListeners||{},this.i.emptyPacketListeners[n]=t}addAudioToStream(n,t,e){this.addAudioToStreamWithShape(n,0,0,t,e)}addAudioToStreamWithShape(n,t,e,i,s){const r=4*n.length;this.h!==r&&(this.g&&this.i._free(this.g),this.g=this.i._malloc(r),this.h=r),this.i.HEAPF32.set(n,this.g/4),Lt(this,i,(a=>{this.i._addAudioToInputStream(this.g,t,e,a,s)}))}addGpuBufferToStream(n,t,e){Lt(this,t,(i=>{const[s,r]=Cu(this,n,i);this.i._addBoundTextureToStream(i,s,r,e)}))}addBoolToStream(n,t,e){Lt(this,t,(i=>{this.i._addBoolToInputStream(n,i,e)}))}addDoubleToStream(n,t,e){Lt(this,t,(i=>{this.i._addDoubleToInputStream(n,i,e)}))}addFloatToStream(n,t,e){Lt(this,t,(i=>{this.i._addFloatToInputStream(n,i,e)}))}addIntToStream(n,t,e){Lt(this,t,(i=>{this.i._addIntToInputStream(n,i,e)}))}addUintToStream(n,t,e){Lt(this,t,(i=>{this.i._addUintToInputStream(n,i,e)}))}addStringToStream(n,t,e){Lt(this,t,(i=>{Lt(this,n,(s=>{this.i._addStringToInputStream(s,i,e)}))}))}addStringRecordToStream(n,t,e){Lt(this,t,(i=>{Ru(this,Object.keys(n),(s=>{Ru(this,Object.values(n),(r=>{this.i._addFlatHashMapToInputStream(s,r,Object.keys(n).length,i,e)}))}))}))}addProtoToStream(n,t,e,i){Lt(this,e,(s=>{Lt(this,t,(r=>{const a=this.i._malloc(n.length);this.i.HEAPU8.set(n,a),this.i._addProtoToInputStream(a,n.length,r,s,i),this.i._free(a)}))}))}addEmptyPacketToStream(n,t){Lt(this,n,(e=>{this.i._addEmptyPacketToInputStream(e,t)}))}addBoolVectorToStream(n,t,e){Lt(this,t,(i=>{const s=this.i._allocateBoolVector(n.length);if(!s)throw Error("Unable to allocate new bool vector on heap.");for(const r of n)this.i._addBoolVectorEntry(s,r);this.i._addBoolVectorToInputStream(s,i,e)}))}addDoubleVectorToStream(n,t,e){Lt(this,t,(i=>{const s=this.i._allocateDoubleVector(n.length);if(!s)throw Error("Unable to allocate new double vector on heap.");for(const r of n)this.i._addDoubleVectorEntry(s,r);this.i._addDoubleVectorToInputStream(s,i,e)}))}addFloatVectorToStream(n,t,e){Lt(this,t,(i=>{const s=this.i._allocateFloatVector(n.length);if(!s)throw Error("Unable to allocate new float vector on heap.");for(const r of n)this.i._addFloatVectorEntry(s,r);this.i._addFloatVectorToInputStream(s,i,e)}))}addIntVectorToStream(n,t,e){Lt(this,t,(i=>{const s=this.i._allocateIntVector(n.length);if(!s)throw Error("Unable to allocate new int vector on heap.");for(const r of n)this.i._addIntVectorEntry(s,r);this.i._addIntVectorToInputStream(s,i,e)}))}addUintVectorToStream(n,t,e){Lt(this,t,(i=>{const s=this.i._allocateUintVector(n.length);if(!s)throw Error("Unable to allocate new unsigned int vector on heap.");for(const r of n)this.i._addUintVectorEntry(s,r);this.i._addUintVectorToInputStream(s,i,e)}))}addStringVectorToStream(n,t,e){Lt(this,t,(i=>{const s=this.i._allocateStringVector(n.length);if(!s)throw Error("Unable to allocate new string vector on heap.");for(const r of n)Lt(this,r,(a=>{this.i._addStringVectorEntry(s,a)}));this.i._addStringVectorToInputStream(s,i,e)}))}addBoolToInputSidePacket(n,t){Lt(this,t,(e=>{this.i._addBoolToInputSidePacket(n,e)}))}addDoubleToInputSidePacket(n,t){Lt(this,t,(e=>{this.i._addDoubleToInputSidePacket(n,e)}))}addFloatToInputSidePacket(n,t){Lt(this,t,(e=>{this.i._addFloatToInputSidePacket(n,e)}))}addIntToInputSidePacket(n,t){Lt(this,t,(e=>{this.i._addIntToInputSidePacket(n,e)}))}addUintToInputSidePacket(n,t){Lt(this,t,(e=>{this.i._addUintToInputSidePacket(n,e)}))}addStringToInputSidePacket(n,t){Lt(this,t,(e=>{Lt(this,n,(i=>{this.i._addStringToInputSidePacket(i,e)}))}))}addProtoToInputSidePacket(n,t,e){Lt(this,e,(i=>{Lt(this,t,(s=>{const r=this.i._malloc(n.length);this.i.HEAPU8.set(n,r),this.i._addProtoToInputSidePacket(r,n.length,s,i),this.i._free(r)}))}))}addBoolVectorToInputSidePacket(n,t){Lt(this,t,(e=>{const i=this.i._allocateBoolVector(n.length);if(!i)throw Error("Unable to allocate new bool vector on heap.");for(const s of n)this.i._addBoolVectorEntry(i,s);this.i._addBoolVectorToInputSidePacket(i,e)}))}addDoubleVectorToInputSidePacket(n,t){Lt(this,t,(e=>{const i=this.i._allocateDoubleVector(n.length);if(!i)throw Error("Unable to allocate new double vector on heap.");for(const s of n)this.i._addDoubleVectorEntry(i,s);this.i._addDoubleVectorToInputSidePacket(i,e)}))}addFloatVectorToInputSidePacket(n,t){Lt(this,t,(e=>{const i=this.i._allocateFloatVector(n.length);if(!i)throw Error("Unable to allocate new float vector on heap.");for(const s of n)this.i._addFloatVectorEntry(i,s);this.i._addFloatVectorToInputSidePacket(i,e)}))}addIntVectorToInputSidePacket(n,t){Lt(this,t,(e=>{const i=this.i._allocateIntVector(n.length);if(!i)throw Error("Unable to allocate new int vector on heap.");for(const s of n)this.i._addIntVectorEntry(i,s);this.i._addIntVectorToInputSidePacket(i,e)}))}addUintVectorToInputSidePacket(n,t){Lt(this,t,(e=>{const i=this.i._allocateUintVector(n.length);if(!i)throw Error("Unable to allocate new unsigned int vector on heap.");for(const s of n)this.i._addUintVectorEntry(i,s);this.i._addUintVectorToInputSidePacket(i,e)}))}addStringVectorToInputSidePacket(n,t){Lt(this,t,(e=>{const i=this.i._allocateStringVector(n.length);if(!i)throw Error("Unable to allocate new string vector on heap.");for(const s of n)Lt(this,s,(r=>{this.i._addStringVectorEntry(i,r)}));this.i._addStringVectorToInputSidePacket(i,e)}))}attachBoolListener(n,t){ri(this,n,t),Lt(this,n,(e=>{this.i._attachBoolListener(e)}))}attachBoolVectorListener(n,t){Oi(this,n,t),Lt(this,n,(e=>{this.i._attachBoolVectorListener(e)}))}attachIntListener(n,t){ri(this,n,t),Lt(this,n,(e=>{this.i._attachIntListener(e)}))}attachIntVectorListener(n,t){Oi(this,n,t),Lt(this,n,(e=>{this.i._attachIntVectorListener(e)}))}attachUintListener(n,t){ri(this,n,t),Lt(this,n,(e=>{this.i._attachUintListener(e)}))}attachUintVectorListener(n,t){Oi(this,n,t),Lt(this,n,(e=>{this.i._attachUintVectorListener(e)}))}attachDoubleListener(n,t){ri(this,n,t),Lt(this,n,(e=>{this.i._attachDoubleListener(e)}))}attachDoubleVectorListener(n,t){Oi(this,n,t),Lt(this,n,(e=>{this.i._attachDoubleVectorListener(e)}))}attachFloatListener(n,t){ri(this,n,t),Lt(this,n,(e=>{this.i._attachFloatListener(e)}))}attachFloatVectorListener(n,t){Oi(this,n,t),Lt(this,n,(e=>{this.i._attachFloatVectorListener(e)}))}attachStringListener(n,t){ri(this,n,t),Lt(this,n,(e=>{this.i._attachStringListener(e)}))}attachStringVectorListener(n,t){Oi(this,n,t),Lt(this,n,(e=>{this.i._attachStringVectorListener(e)}))}attachProtoListener(n,t,e){ri(this,n,t),Lt(this,n,(i=>{this.i._attachProtoListener(i,e||!1)}))}attachProtoVectorListener(n,t,e){Oi(this,n,t),Lt(this,n,(i=>{this.i._attachProtoVectorListener(i,e||!1)}))}attachAudioListener(n,t,e){this.i._attachAudioListener||console.warn('Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?'),ri(this,n,((i,s)=>{i=new Float32Array(i.buffer,i.byteOffset,i.length/4),t(i,s)})),Lt(this,n,(i=>{this.i._attachAudioListener(i,e||!1)}))}finishProcessing(){this.i._waitUntilIdle()}closeGraph(){this.i._closeGraph(),this.i.simpleListeners=void 0,this.i.emptyPacketListeners=void 0}},class extends Fu{get ga(){return this.i}pa(n,t,e){Lt(this,t,(i=>{const[s,r]=Cu(this,n,i);this.ga._addBoundTextureAsImageToStream(i,s,r,e)}))}Z(n,t){ri(this,n,t),Lt(this,n,(e=>{this.ga._attachImageListener(e)}))}aa(n,t){Oi(this,n,t),Lt(this,n,(e=>{this.ga._attachImageVectorListener(e)}))}}));var Fu,ei=class extends pg{};async function ie(n,t,e){return(async function(i,s,r,a){return hg(i,s,r,a)})(n,e.canvas??(kp()?void 0:document.createElement("canvas")),t,e)}function qp(n,t,e,i){if(n.U){const r=new pp;if(e!=null&&e.regionOfInterest){if(!n.oa)throw Error("This task doesn't support region-of-interest.");var s=e.regionOfInterest;if(s.left>=s.right||s.top>=s.bottom)throw Error("Expected RectF with left < right and top < bottom.");if(s.left<0||s.top<0||s.right>1||s.bottom>1)throw Error("Expected RectF values to be in [0,1].");Dt(r,1,(s.left+s.right)/2),Dt(r,2,(s.top+s.bottom)/2),Dt(r,4,s.right-s.left),Dt(r,3,s.bottom-s.top)}else Dt(r,1,.5),Dt(r,2,.5),Dt(r,4,1),Dt(r,3,1);if(e!=null&&e.rotationDegrees){if((e==null?void 0:e.rotationDegrees)%90!=0)throw Error("Expected rotation to be a multiple of 90°.");if(Dt(r,5,-Math.PI*e.rotationDegrees/180),(e==null?void 0:e.rotationDegrees)%180!=0){const[a,o]=zp(t);e=Pe(r,3)*o/a,s=Pe(r,4)*a/o,Dt(r,4,e),Dt(r,3,s)}}n.g.addProtoToStream(r.g(),"mediapipe.NormalizedRect",n.U,i)}n.g.pa(t,n.X,i??performance.now()),n.finishProcessing()}function ni(n,t,e){var i;if((i=n.baseOptions)!=null&&i.g())throw Error("Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.");qp(n,t,e,n.C+1)}function mi(n,t,e,i){var s;if(!((s=n.baseOptions)!=null&&s.g()))throw Error("Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.");qp(n,t,e,i)}function mr(n,t,e,i){var s=t.data;const r=t.width,a=r*(t=t.height);if((s instanceof Uint8Array||s instanceof Float32Array)&&s.length!==a)throw Error("Unsupported channel count: "+s.length/a);return n=new We([s],e,!1,n.g.i.canvas,n.P,r,t),i?n.clone():n}var Ln=class extends kc{constructor(n,t,e,i){super(n),this.g=n,this.X=t,this.U=e,this.oa=i,this.P=new Gp}l(n,t=!0){if("runningMode"in n&&pe(this.baseOptions,2,ia(!!n.runningMode&&n.runningMode!=="IMAGE")),n.canvas!==void 0&&this.g.i.canvas!==n.canvas)throw Error("You must create a new task to reset the canvas.");return super.l(n,t)}close(){this.P.close(),super.close()}};Ln.prototype.close=Ln.prototype.close;var Fn=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect_in",!1),this.j={detections:[]},Bt(n=this.h=new Io,0,1,t=new Re),Dt(this.h,2,.5),Dt(this.h,3,.3)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return"minDetectionConfidence"in n&&Dt(this.h,2,n.minDetectionConfidence??.5),"minSuppressionThreshold"in n&&Dt(this.h,3,n.minSuppressionThreshold??.3),this.l(n)}F(n,t){return this.j={detections:[]},ni(this,n,t),this.j}G(n,t,e){return this.j={detections:[]},mi(this,n,e,t),this.j}m(){var n=new Dn;we(n,"image_in"),we(n,"norm_rect_in"),ce(n,"detections");const t=new Pn;fi(t,$0,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.face_detector.FaceDetectorGraph"),Se(e,"IMAGE:image_in"),Se(e,"NORM_RECT:norm_rect_in"),Qt(e,"DETECTIONS:detections"),e.o(t),Hn(n,e),this.g.attachProtoVectorListener("detections",((i,s)=>{for(const r of i)i=up(r),this.j.detections.push(Op(i));vt(this,s)})),this.g.attachEmptyPacketListener("detections",(i=>{vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};Fn.prototype.detectForVideo=Fn.prototype.G,Fn.prototype.detect=Fn.prototype.F,Fn.prototype.setOptions=Fn.prototype.o,Fn.createFromModelPath=async function(n,t){return ie(Fn,n,{baseOptions:{modelAssetPath:t}})},Fn.createFromModelBuffer=function(n,t){return ie(Fn,n,{baseOptions:{modelAssetBuffer:t}})},Fn.createFromOptions=function(n,t){return ie(Fn,n,t)};var yh=ti([61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]),Mh=ti([263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]),Sh=ti([276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]),jp=ti([474,475],[475,476],[476,477],[477,474]),Eh=ti([33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]),bh=ti([46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]),$p=ti([469,470],[470,471],[471,472],[472,469]),Th=ti([10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]),Kp=[...yh,...Mh,...Sh,...Eh,...bh,...Th],Zp=ti([127,34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],[120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],[232,121],[121,128],[128,232],[104,69],[69,67],[67,104],[175,171],[171,148],[148,175],[118,50],[50,101],[101,118],[73,39],[39,40],[40,73],[9,151],[151,108],[108,9],[48,115],[115,131],[131,48],[194,204],[204,211],[211,194],[74,40],[40,185],[185,74],[80,42],[42,183],[183,80],[40,92],[92,186],[186,40],[230,229],[229,118],[118,230],[202,212],[212,214],[214,202],[83,18],[18,17],[17,83],[76,61],[61,146],[146,76],[160,29],[29,30],[30,160],[56,157],[157,173],[173,56],[106,204],[204,194],[194,106],[135,214],[214,192],[192,135],[203,165],[165,98],[98,203],[21,71],[71,68],[68,21],[51,45],[45,4],[4,51],[144,24],[24,23],[23,144],[77,146],[146,91],[91,77],[205,50],[50,187],[187,205],[201,200],[200,18],[18,201],[91,106],[106,182],[182,91],[90,91],[91,181],[181,90],[85,84],[84,17],[17,85],[206,203],[203,36],[36,206],[148,171],[171,140],[140,148],[92,40],[40,39],[39,92],[193,189],[189,244],[244,193],[159,158],[158,28],[28,159],[247,246],[246,161],[161,247],[236,3],[3,196],[196,236],[54,68],[68,104],[104,54],[193,168],[168,8],[8,193],[117,228],[228,31],[31,117],[189,193],[193,55],[55,189],[98,97],[97,99],[99,98],[126,47],[47,100],[100,126],[166,79],[79,218],[218,166],[155,154],[154,26],[26,155],[209,49],[49,131],[131,209],[135,136],[136,150],[150,135],[47,126],[126,217],[217,47],[223,52],[52,53],[53,223],[45,51],[51,134],[134,45],[211,170],[170,140],[140,211],[67,69],[69,108],[108,67],[43,106],[106,91],[91,43],[230,119],[119,120],[120,230],[226,130],[130,247],[247,226],[63,53],[53,52],[52,63],[238,20],[20,242],[242,238],[46,70],[70,156],[156,46],[78,62],[62,96],[96,78],[46,53],[53,63],[63,46],[143,34],[34,227],[227,143],[123,117],[117,111],[111,123],[44,125],[125,19],[19,44],[236,134],[134,51],[51,236],[216,206],[206,205],[205,216],[154,153],[153,22],[22,154],[39,37],[37,167],[167,39],[200,201],[201,208],[208,200],[36,142],[142,100],[100,36],[57,212],[212,202],[202,57],[20,60],[60,99],[99,20],[28,158],[158,157],[157,28],[35,226],[226,113],[113,35],[160,159],[159,27],[27,160],[204,202],[202,210],[210,204],[113,225],[225,46],[46,113],[43,202],[202,204],[204,43],[62,76],[76,77],[77,62],[137,123],[123,116],[116,137],[41,38],[38,72],[72,41],[203,129],[129,142],[142,203],[64,98],[98,240],[240,64],[49,102],[102,64],[64,49],[41,73],[73,74],[74,41],[212,216],[216,207],[207,212],[42,74],[74,184],[184,42],[169,170],[170,211],[211,169],[170,149],[149,176],[176,170],[105,66],[66,69],[69,105],[122,6],[6,168],[168,122],[123,147],[147,187],[187,123],[96,77],[77,90],[90,96],[65,55],[55,107],[107,65],[89,90],[90,180],[180,89],[101,100],[100,120],[120,101],[63,105],[105,104],[104,63],[93,137],[137,227],[227,93],[15,86],[86,85],[85,15],[129,102],[102,49],[49,129],[14,87],[87,86],[86,14],[55,8],[8,9],[9,55],[100,47],[47,121],[121,100],[145,23],[23,22],[22,145],[88,89],[89,179],[179,88],[6,122],[122,196],[196,6],[88,95],[95,96],[96,88],[138,172],[172,136],[136,138],[215,58],[58,172],[172,215],[115,48],[48,219],[219,115],[42,80],[80,81],[81,42],[195,3],[3,51],[51,195],[43,146],[146,61],[61,43],[171,175],[175,199],[199,171],[81,82],[82,38],[38,81],[53,46],[46,225],[225,53],[144,163],[163,110],[110,144],[52,65],[65,66],[66,52],[229,228],[228,117],[117,229],[34,127],[127,234],[234,34],[107,108],[108,69],[69,107],[109,108],[108,151],[151,109],[48,64],[64,235],[235,48],[62,78],[78,191],[191,62],[129,209],[209,126],[126,129],[111,35],[35,143],[143,111],[117,123],[123,50],[50,117],[222,65],[65,52],[52,222],[19,125],[125,141],[141,19],[221,55],[55,65],[65,221],[3,195],[195,197],[197,3],[25,7],[7,33],[33,25],[220,237],[237,44],[44,220],[70,71],[71,139],[139,70],[122,193],[193,245],[245,122],[247,130],[130,33],[33,247],[71,21],[21,162],[162,71],[170,169],[169,150],[150,170],[188,174],[174,196],[196,188],[216,186],[186,92],[92,216],[2,97],[97,167],[167,2],[141,125],[125,241],[241,141],[164,167],[167,37],[37,164],[72,38],[38,12],[12,72],[38,82],[82,13],[13,38],[63,68],[68,71],[71,63],[226,35],[35,111],[111,226],[101,50],[50,205],[205,101],[206,92],[92,165],[165,206],[209,198],[198,217],[217,209],[165,167],[167,97],[97,165],[220,115],[115,218],[218,220],[133,112],[112,243],[243,133],[239,238],[238,241],[241,239],[214,135],[135,169],[169,214],[190,173],[173,133],[133,190],[171,208],[208,32],[32,171],[125,44],[44,237],[237,125],[86,87],[87,178],[178,86],[85,86],[86,179],[179,85],[84,85],[85,180],[180,84],[83,84],[84,181],[181,83],[201,83],[83,182],[182,201],[137,93],[93,132],[132,137],[76,62],[62,183],[183,76],[61,76],[76,184],[184,61],[57,61],[61,185],[185,57],[212,57],[57,186],[186,212],[214,207],[207,187],[187,214],[34,143],[143,156],[156,34],[79,239],[239,237],[237,79],[123,137],[137,177],[177,123],[44,1],[1,4],[4,44],[201,194],[194,32],[32,201],[64,102],[102,129],[129,64],[213,215],[215,138],[138,213],[59,166],[166,219],[219,59],[242,99],[99,97],[97,242],[2,94],[94,141],[141,2],[75,59],[59,235],[235,75],[24,110],[110,228],[228,24],[25,130],[130,226],[226,25],[23,24],[24,229],[229,23],[22,23],[23,230],[230,22],[26,22],[22,231],[231,26],[112,26],[26,232],[232,112],[189,190],[190,243],[243,189],[221,56],[56,190],[190,221],[28,56],[56,221],[221,28],[27,28],[28,222],[222,27],[29,27],[27,223],[223,29],[30,29],[29,224],[224,30],[247,30],[30,225],[225,247],[238,79],[79,20],[20,238],[166,59],[59,75],[75,166],[60,75],[75,240],[240,60],[147,177],[177,215],[215,147],[20,79],[79,166],[166,20],[187,147],[147,213],[213,187],[112,233],[233,244],[244,112],[233,128],[128,245],[245,233],[128,114],[114,188],[188,128],[114,217],[217,174],[174,114],[131,115],[115,220],[220,131],[217,198],[198,236],[236,217],[198,131],[131,134],[134,198],[177,132],[132,58],[58,177],[143,35],[35,124],[124,143],[110,163],[163,7],[7,110],[228,110],[110,25],[25,228],[356,389],[389,368],[368,356],[11,302],[302,267],[267,11],[452,350],[350,349],[349,452],[302,303],[303,269],[269,302],[357,343],[343,277],[277,357],[452,453],[453,357],[357,452],[333,332],[332,297],[297,333],[175,152],[152,377],[377,175],[347,348],[348,330],[330,347],[303,304],[304,270],[270,303],[9,336],[336,337],[337,9],[278,279],[279,360],[360,278],[418,262],[262,431],[431,418],[304,408],[408,409],[409,304],[310,415],[415,407],[407,310],[270,409],[409,410],[410,270],[450,348],[348,347],[347,450],[422,430],[430,434],[434,422],[313,314],[314,17],[17,313],[306,307],[307,375],[375,306],[387,388],[388,260],[260,387],[286,414],[414,398],[398,286],[335,406],[406,418],[418,335],[364,367],[367,416],[416,364],[423,358],[358,327],[327,423],[251,284],[284,298],[298,251],[281,5],[5,4],[4,281],[373,374],[374,253],[253,373],[307,320],[320,321],[321,307],[425,427],[427,411],[411,425],[421,313],[313,18],[18,421],[321,405],[405,406],[406,321],[320,404],[404,405],[405,320],[315,16],[16,17],[17,315],[426,425],[425,266],[266,426],[377,400],[400,369],[369,377],[322,391],[391,269],[269,322],[417,465],[465,464],[464,417],[386,257],[257,258],[258,386],[466,260],[260,388],[388,466],[456,399],[399,419],[419,456],[284,332],[332,333],[333,284],[417,285],[285,8],[8,417],[346,340],[340,261],[261,346],[413,441],[441,285],[285,413],[327,460],[460,328],[328,327],[355,371],[371,329],[329,355],[392,439],[439,438],[438,392],[382,341],[341,256],[256,382],[429,420],[420,360],[360,429],[364,394],[394,379],[379,364],[277,343],[343,437],[437,277],[443,444],[444,283],[283,443],[275,440],[440,363],[363,275],[431,262],[262,369],[369,431],[297,338],[338,337],[337,297],[273,375],[375,321],[321,273],[450,451],[451,349],[349,450],[446,342],[342,467],[467,446],[293,334],[334,282],[282,293],[458,461],[461,462],[462,458],[276,353],[353,383],[383,276],[308,324],[324,325],[325,308],[276,300],[300,293],[293,276],[372,345],[345,447],[447,372],[352,345],[345,340],[340,352],[274,1],[1,19],[19,274],[456,248],[248,281],[281,456],[436,427],[427,425],[425,436],[381,256],[256,252],[252,381],[269,391],[391,393],[393,269],[200,199],[199,428],[428,200],[266,330],[330,329],[329,266],[287,273],[273,422],[422,287],[250,462],[462,328],[328,250],[258,286],[286,384],[384,258],[265,353],[353,342],[342,265],[387,259],[259,257],[257,387],[424,431],[431,430],[430,424],[342,353],[353,276],[276,342],[273,335],[335,424],[424,273],[292,325],[325,307],[307,292],[366,447],[447,345],[345,366],[271,303],[303,302],[302,271],[423,266],[266,371],[371,423],[294,455],[455,460],[460,294],[279,278],[278,294],[294,279],[271,272],[272,304],[304,271],[432,434],[434,427],[427,432],[272,407],[407,408],[408,272],[394,430],[430,431],[431,394],[395,369],[369,400],[400,395],[334,333],[333,299],[299,334],[351,417],[417,168],[168,351],[352,280],[280,411],[411,352],[325,319],[319,320],[320,325],[295,296],[296,336],[336,295],[319,403],[403,404],[404,319],[330,348],[348,349],[349,330],[293,298],[298,333],[333,293],[323,454],[454,447],[447,323],[15,16],[16,315],[315,15],[358,429],[429,279],[279,358],[14,15],[15,316],[316,14],[285,336],[336,9],[9,285],[329,349],[349,350],[350,329],[374,380],[380,252],[252,374],[318,402],[402,403],[403,318],[6,197],[197,419],[419,6],[318,319],[319,325],[325,318],[367,364],[364,365],[365,367],[435,367],[367,397],[397,435],[344,438],[438,439],[439,344],[272,271],[271,311],[311,272],[195,5],[5,281],[281,195],[273,287],[287,291],[291,273],[396,428],[428,199],[199,396],[311,271],[271,268],[268,311],[283,444],[444,445],[445,283],[373,254],[254,339],[339,373],[282,334],[334,296],[296,282],[449,347],[347,346],[346,449],[264,447],[447,454],[454,264],[336,296],[296,299],[299,336],[338,10],[10,151],[151,338],[278,439],[439,455],[455,278],[292,407],[407,415],[415,292],[358,371],[371,355],[355,358],[340,345],[345,372],[372,340],[346,347],[347,280],[280,346],[442,443],[443,282],[282,442],[19,94],[94,370],[370,19],[441,442],[442,295],[295,441],[248,419],[419,197],[197,248],[263,255],[255,359],[359,263],[440,275],[275,274],[274,440],[300,383],[383,368],[368,300],[351,412],[412,465],[465,351],[263,467],[467,466],[466,263],[301,368],[368,389],[389,301],[395,378],[378,379],[379,395],[412,351],[351,419],[419,412],[436,426],[426,322],[322,436],[2,164],[164,393],[393,2],[370,462],[462,461],[461,370],[164,0],[0,267],[267,164],[302,11],[11,12],[12,302],[268,12],[12,13],[13,268],[293,300],[300,301],[301,293],[446,261],[261,340],[340,446],[330,266],[266,425],[425,330],[426,423],[423,391],[391,426],[429,355],[355,437],[437,429],[391,327],[327,326],[326,391],[440,457],[457,438],[438,440],[341,382],[382,362],[362,341],[459,457],[457,461],[461,459],[434,430],[430,394],[394,434],[414,463],[463,362],[362,414],[396,369],[369,262],[262,396],[354,461],[461,457],[457,354],[316,403],[403,402],[402,316],[315,404],[404,403],[403,315],[314,405],[405,404],[404,314],[313,406],[406,405],[405,313],[421,418],[418,406],[406,421],[366,401],[401,361],[361,366],[306,408],[408,407],[407,306],[291,409],[409,408],[408,291],[287,410],[410,409],[409,287],[432,436],[436,410],[410,432],[434,416],[416,411],[411,434],[264,368],[368,383],[383,264],[309,438],[438,457],[457,309],[352,376],[376,401],[401,352],[274,275],[275,4],[4,274],[421,428],[428,262],[262,421],[294,327],[327,358],[358,294],[433,416],[416,367],[367,433],[289,455],[455,439],[439,289],[462,370],[370,326],[326,462],[2,326],[326,370],[370,2],[305,460],[460,455],[455,305],[254,449],[449,448],[448,254],[255,261],[261,446],[446,255],[253,450],[450,449],[449,253],[252,451],[451,450],[450,252],[256,452],[452,451],[451,256],[341,453],[453,452],[452,341],[413,464],[464,463],[463,413],[441,413],[413,414],[414,441],[258,442],[442,441],[441,258],[257,443],[443,442],[442,257],[259,444],[444,443],[443,259],[260,445],[445,444],[444,260],[467,342],[342,445],[445,467],[459,458],[458,250],[250,459],[289,392],[392,290],[290,289],[290,328],[328,460],[460,290],[376,433],[433,435],[435,376],[250,290],[290,392],[392,250],[411,416],[416,433],[433,411],[341,463],[463,464],[464,341],[453,464],[464,465],[465,453],[357,465],[465,412],[412,357],[343,412],[412,399],[399,343],[360,363],[363,440],[440,360],[437,399],[399,456],[456,437],[420,456],[456,363],[363,420],[401,435],[435,288],[288,401],[372,383],[383,353],[353,372],[339,255],[255,249],[249,339],[448,261],[261,255],[255,448],[133,243],[243,190],[190,133],[133,155],[155,112],[112,133],[33,246],[246,247],[247,33],[33,130],[130,25],[25,33],[398,384],[384,286],[286,398],[362,398],[398,414],[414,362],[362,463],[463,341],[341,362],[263,359],[359,467],[467,263],[263,249],[249,255],[255,263],[466,467],[467,260],[260,466],[75,60],[60,166],[166,75],[238,239],[239,79],[79,238],[162,127],[127,139],[139,162],[72,11],[11,37],[37,72],[121,232],[232,120],[120,121],[73,72],[72,39],[39,73],[114,128],[128,47],[47,114],[233,232],[232,128],[128,233],[103,104],[104,67],[67,103],[152,175],[175,148],[148,152],[119,118],[118,101],[101,119],[74,73],[73,40],[40,74],[107,9],[9,108],[108,107],[49,48],[48,131],[131,49],[32,194],[194,211],[211,32],[184,74],[74,185],[185,184],[191,80],[80,183],[183,191],[185,40],[40,186],[186,185],[119,230],[230,118],[118,119],[210,202],[202,214],[214,210],[84,83],[83,17],[17,84],[77,76],[76,146],[146,77],[161,160],[160,30],[30,161],[190,56],[56,173],[173,190],[182,106],[106,194],[194,182],[138,135],[135,192],[192,138],[129,203],[203,98],[98,129],[54,21],[21,68],[68,54],[5,51],[51,4],[4,5],[145,144],[144,23],[23,145],[90,77],[77,91],[91,90],[207,205],[205,187],[187,207],[83,201],[201,18],[18,83],[181,91],[91,182],[182,181],[180,90],[90,181],[181,180],[16,85],[85,17],[17,16],[205,206],[206,36],[36,205],[176,148],[148,140],[140,176],[165,92],[92,39],[39,165],[245,193],[193,244],[244,245],[27,159],[159,28],[28,27],[30,247],[247,161],[161,30],[174,236],[236,196],[196,174],[103,54],[54,104],[104,103],[55,193],[193,8],[8,55],[111,117],[117,31],[31,111],[221,189],[189,55],[55,221],[240,98],[98,99],[99,240],[142,126],[126,100],[100,142],[219,166],[166,218],[218,219],[112,155],[155,26],[26,112],[198,209],[209,131],[131,198],[169,135],[135,150],[150,169],[114,47],[47,217],[217,114],[224,223],[223,53],[53,224],[220,45],[45,134],[134,220],[32,211],[211,140],[140,32],[109,67],[67,108],[108,109],[146,43],[43,91],[91,146],[231,230],[230,120],[120,231],[113,226],[226,247],[247,113],[105,63],[63,52],[52,105],[241,238],[238,242],[242,241],[124,46],[46,156],[156,124],[95,78],[78,96],[96,95],[70,46],[46,63],[63,70],[116,143],[143,227],[227,116],[116,123],[123,111],[111,116],[1,44],[44,19],[19,1],[3,236],[236,51],[51,3],[207,216],[216,205],[205,207],[26,154],[154,22],[22,26],[165,39],[39,167],[167,165],[199,200],[200,208],[208,199],[101,36],[36,100],[100,101],[43,57],[57,202],[202,43],[242,20],[20,99],[99,242],[56,28],[28,157],[157,56],[124,35],[35,113],[113,124],[29,160],[160,27],[27,29],[211,204],[204,210],[210,211],[124,113],[113,46],[46,124],[106,43],[43,204],[204,106],[96,62],[62,77],[77,96],[227,137],[137,116],[116,227],[73,41],[41,72],[72,73],[36,203],[203,142],[142,36],[235,64],[64,240],[240,235],[48,49],[49,64],[64,48],[42,41],[41,74],[74,42],[214,212],[212,207],[207,214],[183,42],[42,184],[184,183],[210,169],[169,211],[211,210],[140,170],[170,176],[176,140],[104,105],[105,69],[69,104],[193,122],[122,168],[168,193],[50,123],[123,187],[187,50],[89,96],[96,90],[90,89],[66,65],[65,107],[107,66],[179,89],[89,180],[180,179],[119,101],[101,120],[120,119],[68,63],[63,104],[104,68],[234,93],[93,227],[227,234],[16,15],[15,85],[85,16],[209,129],[129,49],[49,209],[15,14],[14,86],[86,15],[107,55],[55,9],[9,107],[120,100],[100,121],[121,120],[153,145],[145,22],[22,153],[178,88],[88,179],[179,178],[197,6],[6,196],[196,197],[89,88],[88,96],[96,89],[135,138],[138,136],[136,135],[138,215],[215,172],[172,138],[218,115],[115,219],[219,218],[41,42],[42,81],[81,41],[5,195],[195,51],[51,5],[57,43],[43,61],[61,57],[208,171],[171,199],[199,208],[41,81],[81,38],[38,41],[224,53],[53,225],[225,224],[24,144],[144,110],[110,24],[105,52],[52,66],[66,105],[118,229],[229,117],[117,118],[227,34],[34,234],[234,227],[66,107],[107,69],[69,66],[10,109],[109,151],[151,10],[219,48],[48,235],[235,219],[183,62],[62,191],[191,183],[142,129],[129,126],[126,142],[116,111],[111,143],[143,116],[118,117],[117,50],[50,118],[223,222],[222,52],[52,223],[94,19],[19,141],[141,94],[222,221],[221,65],[65,222],[196,3],[3,197],[197,196],[45,220],[220,44],[44,45],[156,70],[70,139],[139,156],[188,122],[122,245],[245,188],[139,71],[71,162],[162,139],[149,170],[170,150],[150,149],[122,188],[188,196],[196,122],[206,216],[216,92],[92,206],[164,2],[2,167],[167,164],[242,141],[141,241],[241,242],[0,164],[164,37],[37,0],[11,72],[72,12],[12,11],[12,38],[38,13],[13,12],[70,63],[63,71],[71,70],[31,226],[226,111],[111,31],[36,101],[101,205],[205,36],[203,206],[206,165],[165,203],[126,209],[209,217],[217,126],[98,165],[165,97],[97,98],[237,220],[220,218],[218,237],[237,239],[239,241],[241,237],[210,214],[214,169],[169,210],[140,171],[171,32],[32,140],[241,125],[125,237],[237,241],[179,86],[86,178],[178,179],[180,85],[85,179],[179,180],[181,84],[84,180],[180,181],[182,83],[83,181],[181,182],[194,201],[201,182],[182,194],[177,137],[137,132],[132,177],[184,76],[76,183],[183,184],[185,61],[61,184],[184,185],[186,57],[57,185],[185,186],[216,212],[212,186],[186,216],[192,214],[214,187],[187,192],[139,34],[34,156],[156,139],[218,79],[79,237],[237,218],[147,123],[123,177],[177,147],[45,44],[44,4],[4,45],[208,201],[201,32],[32,208],[98,64],[64,129],[129,98],[192,213],[213,138],[138,192],[235,59],[59,219],[219,235],[141,242],[242,97],[97,141],[97,2],[2,141],[141,97],[240,75],[75,235],[235,240],[229,24],[24,228],[228,229],[31,25],[25,226],[226,31],[230,23],[23,229],[229,230],[231,22],[22,230],[230,231],[232,26],[26,231],[231,232],[233,112],[112,232],[232,233],[244,189],[189,243],[243,244],[189,221],[221,190],[190,189],[222,28],[28,221],[221,222],[223,27],[27,222],[222,223],[224,29],[29,223],[223,224],[225,30],[30,224],[224,225],[113,247],[247,225],[225,113],[99,60],[60,240],[240,99],[213,147],[147,215],[215,213],[60,20],[20,166],[166,60],[192,187],[187,213],[213,192],[243,112],[112,244],[244,243],[244,233],[233,245],[245,244],[245,128],[128,188],[188,245],[188,114],[114,174],[174,188],[134,131],[131,220],[220,134],[174,217],[217,236],[236,174],[236,198],[198,134],[134,236],[215,177],[177,58],[58,215],[156,143],[143,124],[124,156],[25,110],[110,7],[7,25],[31,228],[228,25],[25,31],[264,356],[356,368],[368,264],[0,11],[11,267],[267,0],[451,452],[452,349],[349,451],[267,302],[302,269],[269,267],[350,357],[357,277],[277,350],[350,452],[452,357],[357,350],[299,333],[333,297],[297,299],[396,175],[175,377],[377,396],[280,347],[347,330],[330,280],[269,303],[303,270],[270,269],[151,9],[9,337],[337,151],[344,278],[278,360],[360,344],[424,418],[418,431],[431,424],[270,304],[304,409],[409,270],[272,310],[310,407],[407,272],[322,270],[270,410],[410,322],[449,450],[450,347],[347,449],[432,422],[422,434],[434,432],[18,313],[313,17],[17,18],[291,306],[306,375],[375,291],[259,387],[387,260],[260,259],[424,335],[335,418],[418,424],[434,364],[364,416],[416,434],[391,423],[423,327],[327,391],[301,251],[251,298],[298,301],[275,281],[281,4],[4,275],[254,373],[373,253],[253,254],[375,307],[307,321],[321,375],[280,425],[425,411],[411,280],[200,421],[421,18],[18,200],[335,321],[321,406],[406,335],[321,320],[320,405],[405,321],[314,315],[315,17],[17,314],[423,426],[426,266],[266,423],[396,377],[377,369],[369,396],[270,322],[322,269],[269,270],[413,417],[417,464],[464,413],[385,386],[386,258],[258,385],[248,456],[456,419],[419,248],[298,284],[284,333],[333,298],[168,417],[417,8],[8,168],[448,346],[346,261],[261,448],[417,413],[413,285],[285,417],[326,327],[327,328],[328,326],[277,355],[355,329],[329,277],[309,392],[392,438],[438,309],[381,382],[382,256],[256,381],[279,429],[429,360],[360,279],[365,364],[364,379],[379,365],[355,277],[277,437],[437,355],[282,443],[443,283],[283,282],[281,275],[275,363],[363,281],[395,431],[431,369],[369,395],[299,297],[297,337],[337,299],[335,273],[273,321],[321,335],[348,450],[450,349],[349,348],[359,446],[446,467],[467,359],[283,293],[293,282],[282,283],[250,458],[458,462],[462,250],[300,276],[276,383],[383,300],[292,308],[308,325],[325,292],[283,276],[276,293],[293,283],[264,372],[372,447],[447,264],[346,352],[352,340],[340,346],[354,274],[274,19],[19,354],[363,456],[456,281],[281,363],[426,436],[436,425],[425,426],[380,381],[381,252],[252,380],[267,269],[269,393],[393,267],[421,200],[200,428],[428,421],[371,266],[266,329],[329,371],[432,287],[287,422],[422,432],[290,250],[250,328],[328,290],[385,258],[258,384],[384,385],[446,265],[265,342],[342,446],[386,387],[387,257],[257,386],[422,424],[424,430],[430,422],[445,342],[342,276],[276,445],[422,273],[273,424],[424,422],[306,292],[292,307],[307,306],[352,366],[366,345],[345,352],[268,271],[271,302],[302,268],[358,423],[423,371],[371,358],[327,294],[294,460],[460,327],[331,279],[279,294],[294,331],[303,271],[271,304],[304,303],[436,432],[432,427],[427,436],[304,272],[272,408],[408,304],[395,394],[394,431],[431,395],[378,395],[395,400],[400,378],[296,334],[334,299],[299,296],[6,351],[351,168],[168,6],[376,352],[352,411],[411,376],[307,325],[325,320],[320,307],[285,295],[295,336],[336,285],[320,319],[319,404],[404,320],[329,330],[330,349],[349,329],[334,293],[293,333],[333,334],[366,323],[323,447],[447,366],[316,15],[15,315],[315,316],[331,358],[358,279],[279,331],[317,14],[14,316],[316,317],[8,285],[285,9],[9,8],[277,329],[329,350],[350,277],[253,374],[374,252],[252,253],[319,318],[318,403],[403,319],[351,6],[6,419],[419,351],[324,318],[318,325],[325,324],[397,367],[367,365],[365,397],[288,435],[435,397],[397,288],[278,344],[344,439],[439,278],[310,272],[272,311],[311,310],[248,195],[195,281],[281,248],[375,273],[273,291],[291,375],[175,396],[396,199],[199,175],[312,311],[311,268],[268,312],[276,283],[283,445],[445,276],[390,373],[373,339],[339,390],[295,282],[282,296],[296,295],[448,449],[449,346],[346,448],[356,264],[264,454],[454,356],[337,336],[336,299],[299,337],[337,338],[338,151],[151,337],[294,278],[278,455],[455,294],[308,292],[292,415],[415,308],[429,358],[358,355],[355,429],[265,340],[340,372],[372,265],[352,346],[346,280],[280,352],[295,442],[442,282],[282,295],[354,19],[19,370],[370,354],[285,441],[441,295],[295,285],[195,248],[248,197],[197,195],[457,440],[440,274],[274,457],[301,300],[300,368],[368,301],[417,351],[351,465],[465,417],[251,301],[301,389],[389,251],[394,395],[395,379],[379,394],[399,412],[412,419],[419,399],[410,436],[436,322],[322,410],[326,2],[2,393],[393,326],[354,370],[370,461],[461,354],[393,164],[164,267],[267,393],[268,302],[302,12],[12,268],[312,268],[268,13],[13,312],[298,293],[293,301],[301,298],[265,446],[446,340],[340,265],[280,330],[330,425],[425,280],[322,426],[426,391],[391,322],[420,429],[429,437],[437,420],[393,391],[391,326],[326,393],[344,440],[440,438],[438,344],[458,459],[459,461],[461,458],[364,434],[434,394],[394,364],[428,396],[396,262],[262,428],[274,354],[354,457],[457,274],[317,316],[316,402],[402,317],[316,315],[315,403],[403,316],[315,314],[314,404],[404,315],[314,313],[313,405],[405,314],[313,421],[421,406],[406,313],[323,366],[366,361],[361,323],[292,306],[306,407],[407,292],[306,291],[291,408],[408,306],[291,287],[287,409],[409,291],[287,432],[432,410],[410,287],[427,434],[434,411],[411,427],[372,264],[264,383],[383,372],[459,309],[309,457],[457,459],[366,352],[352,401],[401,366],[1,274],[274,4],[4,1],[418,421],[421,262],[262,418],[331,294],[294,358],[358,331],[435,433],[433,367],[367,435],[392,289],[289,439],[439,392],[328,462],[462,326],[326,328],[94,2],[2,370],[370,94],[289,305],[305,455],[455,289],[339,254],[254,448],[448,339],[359,255],[255,446],[446,359],[254,253],[253,449],[449,254],[253,252],[252,450],[450,253],[252,256],[256,451],[451,252],[256,341],[341,452],[452,256],[414,413],[413,463],[463,414],[286,441],[441,414],[414,286],[286,258],[258,441],[441,286],[258,257],[257,442],[442,258],[257,259],[259,443],[443,257],[259,260],[260,444],[444,259],[260,467],[467,445],[445,260],[309,459],[459,250],[250,309],[305,289],[289,290],[290,305],[305,290],[290,460],[460,305],[401,376],[376,435],[435,401],[309,250],[250,392],[392,309],[376,411],[411,433],[433,376],[453,341],[341,464],[464,453],[357,453],[453,465],[465,357],[343,357],[357,412],[412,343],[437,343],[343,399],[399,437],[344,360],[360,440],[440,344],[420,437],[437,456],[456,420],[360,420],[420,363],[363,360],[361,401],[401,288],[288,361],[265,372],[372,353],[353,265],[390,339],[339,249],[249,390],[339,448],[448,255],[255,339]);function Uu(n){n.j={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]}}var ue=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect",!1),this.j={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]},this.outputFacialTransformationMatrixes=this.outputFaceBlendshapes=!1,Bt(n=this.h=new xp,0,1,t=new Re),this.A=new vp,Bt(this.h,0,3,this.A),this.u=new Io,Bt(this.h,0,2,this.u),Di(this.u,4,1),Dt(this.u,2,.5),Dt(this.A,2,.5),Dt(this.h,4,.5)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return"numFaces"in n&&Di(this.u,4,n.numFaces??1),"minFaceDetectionConfidence"in n&&Dt(this.u,2,n.minFaceDetectionConfidence??.5),"minTrackingConfidence"in n&&Dt(this.h,4,n.minTrackingConfidence??.5),"minFacePresenceConfidence"in n&&Dt(this.A,2,n.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in n&&(this.outputFaceBlendshapes=!!n.outputFaceBlendshapes),"outputFacialTransformationMatrixes"in n&&(this.outputFacialTransformationMatrixes=!!n.outputFacialTransformationMatrixes),this.l(n)}F(n,t){return Uu(this),ni(this,n,t),this.j}G(n,t,e){return Uu(this),mi(this,n,e,t),this.j}m(){var n=new Dn;we(n,"image_in"),we(n,"norm_rect"),ce(n,"face_landmarks");const t=new Pn;fi(t,Z0,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph"),Se(e,"IMAGE:image_in"),Se(e,"NORM_RECT:norm_rect"),Qt(e,"NORM_LANDMARKS:face_landmarks"),e.o(t),Hn(n,e),this.g.attachProtoVectorListener("face_landmarks",((i,s)=>{for(const r of i)i=pa(r),this.j.faceLandmarks.push(Fo(i));vt(this,s)})),this.g.attachEmptyPacketListener("face_landmarks",(i=>{vt(this,i)})),this.outputFaceBlendshapes&&(ce(n,"blendshapes"),Qt(e,"BLENDSHAPES:blendshapes"),this.g.attachProtoVectorListener("blendshapes",((i,s)=>{if(this.outputFaceBlendshapes)for(const r of i)i=Do(r),this.j.faceBlendshapes.push(_h(i.g()??[]));vt(this,s)})),this.g.attachEmptyPacketListener("blendshapes",(i=>{vt(this,i)}))),this.outputFacialTransformationMatrixes&&(ce(n,"face_geometry"),Qt(e,"FACE_GEOMETRY:face_geometry"),this.g.attachProtoVectorListener("face_geometry",((i,s)=>{if(this.outputFacialTransformationMatrixes)for(const r of i)(i=re(i=K0(r),V0,2))&&this.j.facialTransformationMatrixes.push({rows:kn(i,1)??0??0,columns:kn(i,2)??0??0,data:gs(i,3,ci,ms()).slice()??[]});vt(this,s)})),this.g.attachEmptyPacketListener("face_geometry",(i=>{vt(this,i)}))),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};ue.prototype.detectForVideo=ue.prototype.G,ue.prototype.detect=ue.prototype.F,ue.prototype.setOptions=ue.prototype.o,ue.createFromModelPath=function(n,t){return ie(ue,n,{baseOptions:{modelAssetPath:t}})},ue.createFromModelBuffer=function(n,t){return ie(ue,n,{baseOptions:{modelAssetBuffer:t}})},ue.createFromOptions=function(n,t){return ie(ue,n,t)},ue.FACE_LANDMARKS_LIPS=yh,ue.FACE_LANDMARKS_LEFT_EYE=Mh,ue.FACE_LANDMARKS_LEFT_EYEBROW=Sh,ue.FACE_LANDMARKS_LEFT_IRIS=jp,ue.FACE_LANDMARKS_RIGHT_EYE=Eh,ue.FACE_LANDMARKS_RIGHT_EYEBROW=bh,ue.FACE_LANDMARKS_RIGHT_IRIS=$p,ue.FACE_LANDMARKS_FACE_OVAL=Th,ue.FACE_LANDMARKS_CONTOURS=Kp,ue.FACE_LANDMARKS_TESSELATION=Zp;var Ah=ti([0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]);function Nu(n){n.gestures=[],n.landmarks=[],n.worldLandmarks=[],n.handedness=[]}function Ou(n){return n.gestures.length===0?{gestures:[],landmarks:[],worldLandmarks:[],handedness:[],handednesses:[]}:{gestures:n.gestures,landmarks:n.landmarks,worldLandmarks:n.worldLandmarks,handedness:n.handedness,handednesses:n.handedness}}function Bu(n,t=!0){const e=[];for(const s of n){var i=Do(s);n=[];for(const r of i.g())i=t&&kn(r,1)!=null?kn(r,1)??0:-1,n.push({score:Pe(r,2)??0,index:i,categoryName:qe(Te(r,3))??""??"",displayName:qe(Te(r,4))??""??""});e.push(n)}return e}var xn=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect",!1),this.gestures=[],this.landmarks=[],this.worldLandmarks=[],this.handedness=[],Bt(n=this.j=new Sp,0,1,t=new Re),this.u=new fh,Bt(this.j,0,2,this.u),this.D=new dh,Bt(this.u,0,3,this.D),this.A=new Mp,Bt(this.u,0,2,this.A),this.h=new J0,Bt(this.j,0,3,this.h),Dt(this.A,2,.5),Dt(this.u,4,.5),Dt(this.D,2,.5)}get baseOptions(){return re(this.j,Re,1)}set baseOptions(n){Bt(this.j,0,1,n)}o(n){var s,r,a,o;if(Di(this.A,3,n.numHands??1),"minHandDetectionConfidence"in n&&Dt(this.A,2,n.minHandDetectionConfidence??.5),"minTrackingConfidence"in n&&Dt(this.u,4,n.minTrackingConfidence??.5),"minHandPresenceConfidence"in n&&Dt(this.D,2,n.minHandPresenceConfidence??.5),n.cannedGesturesClassifierOptions){var t=new Os,e=t,i=Bc(n.cannedGesturesClassifierOptions,(s=re(this.h,Os,3))==null?void 0:s.l());Bt(e,0,2,i),Bt(this.h,0,3,t)}else n.cannedGesturesClassifierOptions===void 0&&((r=re(this.h,Os,3))==null||r.g());return n.customGesturesClassifierOptions?(Bt(e=t=new Os,0,2,i=Bc(n.customGesturesClassifierOptions,(a=re(this.h,Os,4))==null?void 0:a.l())),Bt(this.h,0,4,t)):n.customGesturesClassifierOptions===void 0&&((o=re(this.h,Os,4))==null||o.g()),this.l(n)}Ha(n,t){return Nu(this),ni(this,n,t),Ou(this)}Ia(n,t,e){return Nu(this),mi(this,n,e,t),Ou(this)}m(){var n=new Dn;we(n,"image_in"),we(n,"norm_rect"),ce(n,"hand_gestures"),ce(n,"hand_landmarks"),ce(n,"world_hand_landmarks"),ce(n,"handedness");const t=new Pn;fi(t,Q0,this.j);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph"),Se(e,"IMAGE:image_in"),Se(e,"NORM_RECT:norm_rect"),Qt(e,"HAND_GESTURES:hand_gestures"),Qt(e,"LANDMARKS:hand_landmarks"),Qt(e,"WORLD_LANDMARKS:world_hand_landmarks"),Qt(e,"HANDEDNESS:handedness"),e.o(t),Hn(n,e),this.g.attachProtoVectorListener("hand_landmarks",((i,s)=>{for(const r of i){i=pa(r);const a=[];for(const o of Pi(i,fp,1))a.push({x:Pe(o,1)??0,y:Pe(o,2)??0,z:Pe(o,3)??0,visibility:Pe(o,4)??0});this.landmarks.push(a)}vt(this,s)})),this.g.attachEmptyPacketListener("hand_landmarks",(i=>{vt(this,i)})),this.g.attachProtoVectorListener("world_hand_landmarks",((i,s)=>{for(const r of i){i=er(r);const a=[];for(const o of Pi(i,dp,1))a.push({x:Pe(o,1)??0,y:Pe(o,2)??0,z:Pe(o,3)??0,visibility:Pe(o,4)??0});this.worldLandmarks.push(a)}vt(this,s)})),this.g.attachEmptyPacketListener("world_hand_landmarks",(i=>{vt(this,i)})),this.g.attachProtoVectorListener("hand_gestures",((i,s)=>{this.gestures.push(...Bu(i,!1)),vt(this,s)})),this.g.attachEmptyPacketListener("hand_gestures",(i=>{vt(this,i)})),this.g.attachProtoVectorListener("handedness",((i,s)=>{this.handedness.push(...Bu(i)),vt(this,s)})),this.g.attachEmptyPacketListener("handedness",(i=>{vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};function ku(n){return{landmarks:n.landmarks,worldLandmarks:n.worldLandmarks,handednesses:n.handedness,handedness:n.handedness}}xn.prototype.recognizeForVideo=xn.prototype.Ia,xn.prototype.recognize=xn.prototype.Ha,xn.prototype.setOptions=xn.prototype.o,xn.createFromModelPath=function(n,t){return ie(xn,n,{baseOptions:{modelAssetPath:t}})},xn.createFromModelBuffer=function(n,t){return ie(xn,n,{baseOptions:{modelAssetBuffer:t}})},xn.createFromOptions=function(n,t){return ie(xn,n,t)},xn.HAND_CONNECTIONS=Ah;var yn=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.handedness=[],Bt(n=this.h=new fh,0,1,t=new Re),this.u=new dh,Bt(this.h,0,3,this.u),this.j=new Mp,Bt(this.h,0,2,this.j),Di(this.j,3,1),Dt(this.j,2,.5),Dt(this.u,2,.5),Dt(this.h,4,.5)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return"numHands"in n&&Di(this.j,3,n.numHands??1),"minHandDetectionConfidence"in n&&Dt(this.j,2,n.minHandDetectionConfidence??.5),"minTrackingConfidence"in n&&Dt(this.h,4,n.minTrackingConfidence??.5),"minHandPresenceConfidence"in n&&Dt(this.u,2,n.minHandPresenceConfidence??.5),this.l(n)}F(n,t){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],ni(this,n,t),ku(this)}G(n,t,e){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],mi(this,n,e,t),ku(this)}m(){var n=new Dn;we(n,"image_in"),we(n,"norm_rect"),ce(n,"hand_landmarks"),ce(n,"world_hand_landmarks"),ce(n,"handedness");const t=new Pn;fi(t,tg,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph"),Se(e,"IMAGE:image_in"),Se(e,"NORM_RECT:norm_rect"),Qt(e,"LANDMARKS:hand_landmarks"),Qt(e,"WORLD_LANDMARKS:world_hand_landmarks"),Qt(e,"HANDEDNESS:handedness"),e.o(t),Hn(n,e),this.g.attachProtoVectorListener("hand_landmarks",((i,s)=>{for(const r of i)i=pa(r),this.landmarks.push(Fo(i));vt(this,s)})),this.g.attachEmptyPacketListener("hand_landmarks",(i=>{vt(this,i)})),this.g.attachProtoVectorListener("world_hand_landmarks",((i,s)=>{for(const r of i)i=er(r),this.worldLandmarks.push(Jr(i));vt(this,s)})),this.g.attachEmptyPacketListener("world_hand_landmarks",(i=>{vt(this,i)})),this.g.attachProtoVectorListener("handedness",((i,s)=>{var r=this.handedness,a=r.push;const o=[];for(const c of i){i=Do(c);const l=[];for(const h of i.g())l.push({score:Pe(h,2)??0,index:kn(h,1)??0??-1,categoryName:qe(Te(h,3))??""??"",displayName:qe(Te(h,4))??""??""});o.push(l)}a.call(r,...o),vt(this,s)})),this.g.attachEmptyPacketListener("handedness",(i=>{vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};yn.prototype.detectForVideo=yn.prototype.G,yn.prototype.detect=yn.prototype.F,yn.prototype.setOptions=yn.prototype.o,yn.createFromModelPath=function(n,t){return ie(yn,n,{baseOptions:{modelAssetPath:t}})},yn.createFromModelBuffer=function(n,t){return ie(yn,n,{baseOptions:{modelAssetBuffer:t}})},yn.createFromOptions=function(n,t){return ie(yn,n,t)},yn.HAND_CONNECTIONS=Ah;var Jp=ti([0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],[27,29],[28,30],[29,31],[30,32],[27,31],[28,32]);function zu(n){n.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]}}function Vu(n){try{if(!n.D)return n.h;n.D(n.h)}finally{No(n)}}function wa(n,t){n=pa(n),t.push(Fo(n))}var ye=class extends Ln{constructor(n,t){super(new ei(n,t),"input_frames_image",null,!1),this.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]},this.outputPoseSegmentationMasks=this.outputFaceBlendshapes=!1,Bt(n=this.j=new wp,0,1,t=new Re),this.I=new dh,Bt(this.j,0,2,this.I),this.W=new eg,Bt(this.j,0,3,this.W),this.u=new Io,Bt(this.j,0,4,this.u),this.O=new vp,Bt(this.j,0,5,this.O),this.A=new Tp,Bt(this.j,0,6,this.A),this.M=new Ap,Bt(this.j,0,7,this.M),Dt(this.u,2,.5),Dt(this.u,3,.3),Dt(this.O,2,.5),Dt(this.A,2,.5),Dt(this.A,3,.3),Dt(this.M,2,.5),Dt(this.I,2,.5)}get baseOptions(){return re(this.j,Re,1)}set baseOptions(n){Bt(this.j,0,1,n)}o(n){return"minFaceDetectionConfidence"in n&&Dt(this.u,2,n.minFaceDetectionConfidence??.5),"minFaceSuppressionThreshold"in n&&Dt(this.u,3,n.minFaceSuppressionThreshold??.3),"minFacePresenceConfidence"in n&&Dt(this.O,2,n.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in n&&(this.outputFaceBlendshapes=!!n.outputFaceBlendshapes),"minPoseDetectionConfidence"in n&&Dt(this.A,2,n.minPoseDetectionConfidence??.5),"minPoseSuppressionThreshold"in n&&Dt(this.A,3,n.minPoseSuppressionThreshold??.3),"minPosePresenceConfidence"in n&&Dt(this.M,2,n.minPosePresenceConfidence??.5),"outputPoseSegmentationMasks"in n&&(this.outputPoseSegmentationMasks=!!n.outputPoseSegmentationMasks),"minHandLandmarksConfidence"in n&&Dt(this.I,2,n.minHandLandmarksConfidence??.5),this.l(n)}F(n,t,e){const i=typeof t!="function"?t:{};return this.D=typeof t=="function"?t:e,zu(this),ni(this,n,i),Vu(this)}G(n,t,e,i){const s=typeof e!="function"?e:{};return this.D=typeof e=="function"?e:i,zu(this),mi(this,n,s,t),Vu(this)}m(){var n=new Dn;we(n,"input_frames_image"),ce(n,"pose_landmarks"),ce(n,"pose_world_landmarks"),ce(n,"face_landmarks"),ce(n,"left_hand_landmarks"),ce(n,"left_hand_world_landmarks"),ce(n,"right_hand_landmarks"),ce(n,"right_hand_world_landmarks");const t=new Pn,e=new uu;Rn(e,1,"type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions"),(function(s,r){if(r!=null)if(Array.isArray(r))pe(s,2,yo(r,0,sa));else{if(!(typeof r=="string"||r instanceof li||Dl(r)))throw Error("invalid value in Any.value field: "+r+" expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array");Wi(s,2,Fl(r,!1),Ts())}})(e,this.j.g());const i=new gn;Rn(i,2,"mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph"),jl(i,8,uu,e),Se(i,"IMAGE:input_frames_image"),Qt(i,"POSE_LANDMARKS:pose_landmarks"),Qt(i,"POSE_WORLD_LANDMARKS:pose_world_landmarks"),Qt(i,"FACE_LANDMARKS:face_landmarks"),Qt(i,"LEFT_HAND_LANDMARKS:left_hand_landmarks"),Qt(i,"LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks"),Qt(i,"RIGHT_HAND_LANDMARKS:right_hand_landmarks"),Qt(i,"RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks"),i.o(t),Hn(n,i),Uo(this,n),this.g.attachProtoListener("pose_landmarks",((s,r)=>{wa(s,this.h.poseLandmarks),vt(this,r)})),this.g.attachEmptyPacketListener("pose_landmarks",(s=>{vt(this,s)})),this.g.attachProtoListener("pose_world_landmarks",((s,r)=>{var a=this.h.poseWorldLandmarks;s=er(s),a.push(Jr(s)),vt(this,r)})),this.g.attachEmptyPacketListener("pose_world_landmarks",(s=>{vt(this,s)})),this.outputPoseSegmentationMasks&&(Qt(i,"POSE_SEGMENTATION_MASK:pose_segmentation_mask"),fr(this,"pose_segmentation_mask"),this.g.Z("pose_segmentation_mask",((s,r)=>{this.h.poseSegmentationMasks=[mr(this,s,!0,!this.D)],vt(this,r)})),this.g.attachEmptyPacketListener("pose_segmentation_mask",(s=>{this.h.poseSegmentationMasks=[],vt(this,s)}))),this.g.attachProtoListener("face_landmarks",((s,r)=>{wa(s,this.h.faceLandmarks),vt(this,r)})),this.g.attachEmptyPacketListener("face_landmarks",(s=>{vt(this,s)})),this.outputFaceBlendshapes&&(ce(n,"extra_blendshapes"),Qt(i,"FACE_BLENDSHAPES:extra_blendshapes"),this.g.attachProtoListener("extra_blendshapes",((s,r)=>{var a=this.h.faceBlendshapes;this.outputFaceBlendshapes&&(s=Do(s),a.push(_h(s.g()??[]))),vt(this,r)})),this.g.attachEmptyPacketListener("extra_blendshapes",(s=>{vt(this,s)}))),this.g.attachProtoListener("left_hand_landmarks",((s,r)=>{wa(s,this.h.leftHandLandmarks),vt(this,r)})),this.g.attachEmptyPacketListener("left_hand_landmarks",(s=>{vt(this,s)})),this.g.attachProtoListener("left_hand_world_landmarks",((s,r)=>{var a=this.h.leftHandWorldLandmarks;s=er(s),a.push(Jr(s)),vt(this,r)})),this.g.attachEmptyPacketListener("left_hand_world_landmarks",(s=>{vt(this,s)})),this.g.attachProtoListener("right_hand_landmarks",((s,r)=>{wa(s,this.h.rightHandLandmarks),vt(this,r)})),this.g.attachEmptyPacketListener("right_hand_landmarks",(s=>{vt(this,s)})),this.g.attachProtoListener("right_hand_world_landmarks",((s,r)=>{var a=this.h.rightHandWorldLandmarks;s=er(s),a.push(Jr(s)),vt(this,r)})),this.g.attachEmptyPacketListener("right_hand_world_landmarks",(s=>{vt(this,s)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};ye.prototype.detectForVideo=ye.prototype.G,ye.prototype.detect=ye.prototype.F,ye.prototype.setOptions=ye.prototype.o,ye.createFromModelPath=function(n,t){return ie(ye,n,{baseOptions:{modelAssetPath:t}})},ye.createFromModelBuffer=function(n,t){return ie(ye,n,{baseOptions:{modelAssetBuffer:t}})},ye.createFromOptions=function(n,t){return ie(ye,n,t)},ye.HAND_CONNECTIONS=Ah,ye.POSE_CONNECTIONS=Jp,ye.FACE_LANDMARKS_LIPS=yh,ye.FACE_LANDMARKS_LEFT_EYE=Mh,ye.FACE_LANDMARKS_LEFT_EYEBROW=Sh,ye.FACE_LANDMARKS_LEFT_IRIS=jp,ye.FACE_LANDMARKS_RIGHT_EYE=Eh,ye.FACE_LANDMARKS_RIGHT_EYEBROW=bh,ye.FACE_LANDMARKS_RIGHT_IRIS=$p,ye.FACE_LANDMARKS_FACE_OVAL=Th,ye.FACE_LANDMARKS_CONTOURS=Kp,ye.FACE_LANDMARKS_TESSELATION=Zp;var Un=class extends Ln{constructor(n,t){super(new ei(n,t),"input_image","norm_rect",!0),this.j={classifications:[]},Bt(n=this.h=new Cp,0,1,t=new Re)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return Bt(this.h,0,2,Bc(n,re(this.h,hh,2))),this.l(n)}sa(n,t){return this.j={classifications:[]},ni(this,n,t),this.j}ta(n,t,e){return this.j={classifications:[]},mi(this,n,e,t),this.j}m(){var n=new Dn;we(n,"input_image"),we(n,"norm_rect"),ce(n,"classifications");const t=new Pn;fi(t,ng,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.image_classifier.ImageClassifierGraph"),Se(e,"IMAGE:input_image"),Se(e,"NORM_RECT:norm_rect"),Qt(e,"CLASSIFICATIONS:classifications"),e.o(t),Hn(n,e),this.g.attachProtoListener("classifications",((i,s)=>{this.j=cg(W0(i)),vt(this,s)})),this.g.attachEmptyPacketListener("classifications",(i=>{vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};Un.prototype.classifyForVideo=Un.prototype.ta,Un.prototype.classify=Un.prototype.sa,Un.prototype.setOptions=Un.prototype.o,Un.createFromModelPath=function(n,t){return ie(Un,n,{baseOptions:{modelAssetPath:t}})},Un.createFromModelBuffer=function(n,t){return ie(Un,n,{baseOptions:{modelAssetBuffer:t}})},Un.createFromOptions=function(n,t){return ie(Un,n,t)};var Mn=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect",!0),this.h=new Rp,this.embeddings={embeddings:[]},Bt(n=this.h,0,1,t=new Re)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){var t=this.h,e=re(this.h,yu,2);return e=e?e.clone():new yu,n.l2Normalize!==void 0?pe(e,1,ia(n.l2Normalize)):"l2Normalize"in n&&pe(e,1),n.quantize!==void 0?pe(e,2,ia(n.quantize)):"quantize"in n&&pe(e,2),Bt(t,0,2,e),this.l(n)}za(n,t){return ni(this,n,t),this.embeddings}Aa(n,t,e){return mi(this,n,e,t),this.embeddings}m(){var n=new Dn;we(n,"image_in"),we(n,"norm_rect"),ce(n,"embeddings_out");const t=new Pn;fi(t,ig,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph"),Se(e,"IMAGE:image_in"),Se(e,"NORM_RECT:norm_rect"),Qt(e,"EMBEDDINGS:embeddings_out"),e.o(t),Hn(n,e),this.g.attachProtoListener("embeddings_out",((i,s)=>{i=q0(i),this.embeddings=(function(r){return{embeddings:Pi(r,Y0,1).map((a=>{var l,h;const o={headIndex:kn(a,3)??0??-1,headName:qe(Te(a,4))??""??""};var c=a.v;return Af(c,0|c[At],xu,Wo(a,1))!==void 0?(a=gs(a=re(a,xu,Wo(a,1),void 0),1,ci,ms()),o.floatEmbedding=a.slice()):(c=new Uint8Array(0),o.quantizedEmbedding=((h=(l=re(a,X0,Wo(a,2),void 0))==null?void 0:l.na())==null?void 0:h.h())??c),o})),timestampMs:Np(Te(r,2,void 0,void 0,so)??Mf)}})(i),vt(this,s)})),this.g.attachEmptyPacketListener("embeddings_out",(i=>{vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};Mn.cosineSimilarity=function(n,t){if(n.floatEmbedding&&t.floatEmbedding)n=Au(n.floatEmbedding,t.floatEmbedding);else{if(!n.quantizedEmbedding||!t.quantizedEmbedding)throw Error("Cannot compute cosine similarity between quantized and float embeddings.");n=Au(Tu(n.quantizedEmbedding),Tu(t.quantizedEmbedding))}return n},Mn.prototype.embedForVideo=Mn.prototype.Aa,Mn.prototype.embed=Mn.prototype.za,Mn.prototype.setOptions=Mn.prototype.o,Mn.createFromModelPath=function(n,t){return ie(Mn,n,{baseOptions:{modelAssetPath:t}})},Mn.createFromModelBuffer=function(n,t){return ie(Mn,n,{baseOptions:{modelAssetBuffer:t}})},Mn.createFromOptions=function(n,t){return ie(Mn,n,t)};var Hc=class{constructor(n,t,e){this.confidenceMasks=n,this.categoryMask=t,this.qualityScores=e}close(){var n,t;(n=this.confidenceMasks)==null||n.forEach((e=>{e.close()})),(t=this.categoryMask)==null||t.close()}};function mg(n){var e,i;const t=(function(s){return Pi(s,gn,1)})(n.ca()).filter((s=>(qe(Te(s,1))??"").includes("mediapipe.tasks.TensorsToSegmentationCalculator")));if(n.u=[],t.length>1)throw Error("The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.");t.length===1&&(((i=(e=re(t[0],Pn,7))==null?void 0:e.j())==null?void 0:i.g())??new Map).forEach(((s,r)=>{n.u[Number(r)]=qe(Te(s,1))??""}))}function Hu(n){n.categoryMask=void 0,n.confidenceMasks=void 0,n.qualityScores=void 0}function Gu(n){try{const t=new Hc(n.confidenceMasks,n.categoryMask,n.qualityScores);if(!n.j)return t;n.j(t)}finally{No(n)}}Hc.prototype.close=Hc.prototype.close;var hn=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect",!1),this.u=[],this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new gh,this.A=new Lp,Bt(this.h,0,3,this.A),Bt(n=this.h,0,1,t=new Re)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return n.displayNamesLocale!==void 0?pe(this.h,2,ua(n.displayNamesLocale)):"displayNamesLocale"in n&&pe(this.h,2),"outputCategoryMask"in n&&(this.outputCategoryMask=n.outputCategoryMask??!1),"outputConfidenceMasks"in n&&(this.outputConfidenceMasks=n.outputConfidenceMasks??!0),super.l(n)}L(){mg(this)}segment(n,t,e){const i=typeof t!="function"?t:{};return this.j=typeof t=="function"?t:e,Hu(this),ni(this,n,i),Gu(this)}La(n,t,e,i){const s=typeof e!="function"?e:{};return this.j=typeof e=="function"?e:i,Hu(this),mi(this,n,s,t),Gu(this)}Da(){return this.u}m(){var n=new Dn;we(n,"image_in"),we(n,"norm_rect");const t=new Pn;fi(t,Dp,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph"),Se(e,"IMAGE:image_in"),Se(e,"NORM_RECT:norm_rect"),e.o(t),Hn(n,e),Uo(this,n),this.outputConfidenceMasks&&(ce(n,"confidence_masks"),Qt(e,"CONFIDENCE_MASKS:confidence_masks"),fr(this,"confidence_masks"),this.g.aa("confidence_masks",((i,s)=>{this.confidenceMasks=i.map((r=>mr(this,r,!0,!this.j))),vt(this,s)})),this.g.attachEmptyPacketListener("confidence_masks",(i=>{this.confidenceMasks=[],vt(this,i)}))),this.outputCategoryMask&&(ce(n,"category_mask"),Qt(e,"CATEGORY_MASK:category_mask"),fr(this,"category_mask"),this.g.Z("category_mask",((i,s)=>{this.categoryMask=mr(this,i,!1,!this.j),vt(this,s)})),this.g.attachEmptyPacketListener("category_mask",(i=>{this.categoryMask=void 0,vt(this,i)}))),ce(n,"quality_scores"),Qt(e,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",((i,s)=>{this.qualityScores=i,vt(this,s)})),this.g.attachEmptyPacketListener("quality_scores",(i=>{this.categoryMask=void 0,vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};hn.prototype.getLabels=hn.prototype.Da,hn.prototype.segmentForVideo=hn.prototype.La,hn.prototype.segment=hn.prototype.segment,hn.prototype.setOptions=hn.prototype.o,hn.createFromModelPath=function(n,t){return ie(hn,n,{baseOptions:{modelAssetPath:t}})},hn.createFromModelBuffer=function(n,t){return ie(hn,n,{baseOptions:{modelAssetBuffer:t}})},hn.createFromOptions=function(n,t){return ie(hn,n,t)};var Gc=class{constructor(n,t,e){this.confidenceMasks=n,this.categoryMask=t,this.qualityScores=e}close(){var n,t;(n=this.confidenceMasks)==null||n.forEach((e=>{e.close()})),(t=this.categoryMask)==null||t.close()}};Gc.prototype.close=Gc.prototype.close;var ai=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect_in",!1),this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new gh,this.u=new Lp,Bt(this.h,0,3,this.u),Bt(n=this.h,0,1,t=new Re)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return"outputCategoryMask"in n&&(this.outputCategoryMask=n.outputCategoryMask??!1),"outputConfidenceMasks"in n&&(this.outputConfidenceMasks=n.outputConfidenceMasks??!0),super.l(n)}segment(n,t,e,i){const s=typeof e!="function"?e:{};if(this.j=typeof e=="function"?e:i,this.qualityScores=this.categoryMask=this.confidenceMasks=void 0,e=this.C+1,i=new Ip,t.keypoint&&t.scribble)throw Error("Cannot provide both keypoint and scribble.");if(t.keypoint){var r=new jo;Wi(r,3,ia(!0),!1),Wi(r,1,qr(t.keypoint.x),0),Wi(r,2,qr(t.keypoint.y),0),Kr(i,1,Oc,r)}else{if(!t.scribble)throw Error("Must provide either a keypoint or a scribble.");{const o=new rg;for(r of t.scribble)Wi(t=new jo,3,ia(!0),!1),Wi(t,1,qr(r.x),0),Wi(t,2,qr(r.y),0),jl(o,1,jo,t);Kr(i,2,Oc,o)}}this.g.addProtoToStream(i.g(),"mediapipe.tasks.vision.interactive_segmenter.proto.RegionOfInterest","roi_in",e),ni(this,n,s);t:{try{const o=new Gc(this.confidenceMasks,this.categoryMask,this.qualityScores);if(!this.j){var a=o;break t}this.j(o)}finally{No(this)}a=void 0}return a}m(){var n=new Dn;we(n,"image_in"),we(n,"roi_in"),we(n,"norm_rect_in");const t=new Pn;fi(t,Dp,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.interactive_segmenter.InteractiveSegmenterGraphV2"),Se(e,"IMAGE:image_in"),Se(e,"ROI:roi_in"),Se(e,"NORM_RECT:norm_rect_in"),e.o(t),Hn(n,e),Uo(this,n),this.outputConfidenceMasks&&(ce(n,"confidence_masks"),Qt(e,"CONFIDENCE_MASKS:confidence_masks"),fr(this,"confidence_masks"),this.g.aa("confidence_masks",((i,s)=>{this.confidenceMasks=i.map((r=>mr(this,r,!0,!this.j))),vt(this,s)})),this.g.attachEmptyPacketListener("confidence_masks",(i=>{this.confidenceMasks=[],vt(this,i)}))),this.outputCategoryMask&&(ce(n,"category_mask"),Qt(e,"CATEGORY_MASK:category_mask"),fr(this,"category_mask"),this.g.Z("category_mask",((i,s)=>{this.categoryMask=mr(this,i,!1,!this.j),vt(this,s)})),this.g.attachEmptyPacketListener("category_mask",(i=>{this.categoryMask=void 0,vt(this,i)}))),ce(n,"quality_scores"),Qt(e,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",((i,s)=>{this.qualityScores=i,vt(this,s)})),this.g.attachEmptyPacketListener("quality_scores",(i=>{this.categoryMask=void 0,vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};ai.prototype.segment=ai.prototype.segment,ai.prototype.setOptions=ai.prototype.o,ai.createFromModelPath=function(n,t){return ie(ai,n,{baseOptions:{modelAssetPath:t}})},ai.createFromModelBuffer=function(n,t){return ie(ai,n,{baseOptions:{modelAssetBuffer:t}})},ai.createFromOptions=function(n,t){return ie(ai,n,t)};var Nn=class extends Ln{constructor(n,t){super(new ei(n,t),"input_frame_gpu","norm_rect",!1),this.j={detections:[]},Bt(n=this.h=new Fp,0,1,t=new Re)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return n.displayNamesLocale!==void 0?pe(this.h,2,ua(n.displayNamesLocale)):"displayNamesLocale"in n&&pe(this.h,2),n.maxResults!==void 0?Di(this.h,3,n.maxResults):"maxResults"in n&&pe(this.h,3),n.scoreThreshold!==void 0?Dt(this.h,4,n.scoreThreshold):"scoreThreshold"in n&&pe(this.h,4),n.categoryAllowlist!==void 0?ao(this.h,5,n.categoryAllowlist):"categoryAllowlist"in n&&pe(this.h,5),n.categoryDenylist!==void 0?ao(this.h,6,n.categoryDenylist):"categoryDenylist"in n&&pe(this.h,6),this.l(n)}F(n,t){return this.j={detections:[]},ni(this,n,t),this.j}G(n,t,e){return this.j={detections:[]},mi(this,n,e,t),this.j}m(){var n=new Dn;we(n,"input_frame_gpu"),we(n,"norm_rect"),ce(n,"detections");const t=new Pn;fi(t,ag,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.ObjectDetectorGraph"),Se(e,"IMAGE:input_frame_gpu"),Se(e,"NORM_RECT:norm_rect"),Qt(e,"DETECTIONS:detections"),e.o(t),Hn(n,e),this.g.attachProtoVectorListener("detections",((i,s)=>{for(const r of i)i=up(r),this.j.detections.push(Op(i));vt(this,s)})),this.g.attachEmptyPacketListener("detections",(i=>{vt(this,i)})),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};Nn.prototype.detectForVideo=Nn.prototype.G,Nn.prototype.detect=Nn.prototype.F,Nn.prototype.setOptions=Nn.prototype.o,Nn.createFromModelPath=async function(n,t){return ie(Nn,n,{baseOptions:{modelAssetPath:t}})},Nn.createFromModelBuffer=function(n,t){return ie(Nn,n,{baseOptions:{modelAssetBuffer:t}})},Nn.createFromOptions=function(n,t){return ie(Nn,n,t)};var Wc=class{constructor(n,t,e){this.landmarks=n,this.worldLandmarks=t,this.segmentationMasks=e}close(){var n;(n=this.segmentationMasks)==null||n.forEach((t=>{t.close()}))}};function Wu(n){n.landmarks=[],n.worldLandmarks=[],n.segmentationMasks=void 0}function Xu(n){try{const t=new Wc(n.landmarks,n.worldLandmarks,n.segmentationMasks);if(!n.u)return t;n.u(t)}finally{No(n)}}Wc.prototype.close=Wc.prototype.close;var Sn=class extends Ln{constructor(n,t){super(new ei(n,t),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.outputSegmentationMasks=!1,Bt(n=this.h=new Up,0,1,t=new Re),this.A=new Ap,Bt(this.h,0,3,this.A),this.j=new Tp,Bt(this.h,0,2,this.j),Di(this.j,4,1),Dt(this.j,2,.5),Dt(this.A,2,.5),Dt(this.h,4,.5)}get baseOptions(){return re(this.h,Re,1)}set baseOptions(n){Bt(this.h,0,1,n)}o(n){return"numPoses"in n&&Di(this.j,4,n.numPoses??1),"minPoseDetectionConfidence"in n&&Dt(this.j,2,n.minPoseDetectionConfidence??.5),"minTrackingConfidence"in n&&Dt(this.h,4,n.minTrackingConfidence??.5),"minPosePresenceConfidence"in n&&Dt(this.A,2,n.minPosePresenceConfidence??.5),"outputSegmentationMasks"in n&&(this.outputSegmentationMasks=n.outputSegmentationMasks??!1),this.l(n)}F(n,t,e){const i=typeof t!="function"?t:{};return this.u=typeof t=="function"?t:e,Wu(this),ni(this,n,i),Xu(this)}G(n,t,e,i){const s=typeof e!="function"?e:{};return this.u=typeof e=="function"?e:i,Wu(this),mi(this,n,s,t),Xu(this)}m(){var n=new Dn;we(n,"image_in"),we(n,"norm_rect"),ce(n,"normalized_landmarks"),ce(n,"world_landmarks"),ce(n,"segmentation_masks");const t=new Pn;fi(t,og,this.h);const e=new gn;Rn(e,2,"mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph"),Se(e,"IMAGE:image_in"),Se(e,"NORM_RECT:norm_rect"),Qt(e,"NORM_LANDMARKS:normalized_landmarks"),Qt(e,"WORLD_LANDMARKS:world_landmarks"),e.o(t),Hn(n,e),Uo(this,n),this.g.attachProtoVectorListener("normalized_landmarks",((i,s)=>{this.landmarks=[];for(const r of i)i=pa(r),this.landmarks.push(Fo(i));vt(this,s)})),this.g.attachEmptyPacketListener("normalized_landmarks",(i=>{this.landmarks=[],vt(this,i)})),this.g.attachProtoVectorListener("world_landmarks",((i,s)=>{this.worldLandmarks=[];for(const r of i)i=er(r),this.worldLandmarks.push(Jr(i));vt(this,s)})),this.g.attachEmptyPacketListener("world_landmarks",(i=>{this.worldLandmarks=[],vt(this,i)})),this.outputSegmentationMasks&&(Qt(e,"SEGMENTATION_MASK:segmentation_masks"),fr(this,"segmentation_masks"),this.g.aa("segmentation_masks",((i,s)=>{this.segmentationMasks=i.map((r=>mr(this,r,!0,!this.u))),vt(this,s)})),this.g.attachEmptyPacketListener("segmentation_masks",(i=>{this.segmentationMasks=[],vt(this,i)}))),n=n.g(),this.setGraph(new Uint8Array(n),!0)}};Sn.prototype.detectForVideo=Sn.prototype.G,Sn.prototype.detect=Sn.prototype.F,Sn.prototype.setOptions=Sn.prototype.o,Sn.createFromModelPath=function(n,t){return ie(Sn,n,{baseOptions:{modelAssetPath:t}})},Sn.createFromModelBuffer=function(n,t){return ie(Sn,n,{baseOptions:{modelAssetBuffer:t}})},Sn.createFromOptions=function(n,t){return ie(Sn,n,t)},Sn.POSE_CONNECTIONS=Jp;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const wh="170",gg=0,Yu=1,_g=2,Qp=1,vg=2,Si=3,Qi=0,pn=1,dn=2,$i=0,nr=1,qu=2,ju=3,$u=4,xg=5,fs=100,yg=101,Mg=102,Sg=103,Eg=104,bg=200,Tg=201,Ag=202,wg=203,Xc=204,Yc=205,Cg=206,Rg=207,Lg=208,Pg=209,Dg=210,Ig=211,Fg=212,Ug=213,Ng=214,qc=0,jc=1,$c=2,gr=3,Kc=4,Zc=5,Jc=6,Qc=7,tm=0,Og=1,Bg=2,Ki=0,kg=1,zg=2,Vg=3,em=4,Hg=5,Gg=6,Wg=7,nm=300,_r=301,vr=302,tl=303,el=304,Oo=306,nl=1e3,_s=1001,il=1002,Qn=1003,Xg=1004,Ca=1005,tn=1006,Ko=1007,vs=1008,Ii=1009,im=1010,sm=1011,ra=1012,Ch=1013,Cs=1014,Ti=1015,ma=1016,Rh=1017,Lh=1018,xr=1020,rm=35902,am=1021,om=1022,Zn=1023,cm=1024,lm=1025,ir=1026,yr=1027,hm=1028,Ph=1029,um=1030,Dh=1031,Ih=1033,Za=33776,Ja=33777,Qa=33778,to=33779,sl=35840,rl=35841,al=35842,ol=35843,cl=36196,ll=37492,hl=37496,ul=37808,dl=37809,fl=37810,pl=37811,ml=37812,gl=37813,_l=37814,vl=37815,xl=37816,yl=37817,Ml=37818,Sl=37819,El=37820,bl=37821,eo=36492,Tl=36494,Al=36495,dm=36283,wl=36284,Cl=36285,Rl=36286,Yg=3200,qg=3201,fm=0,jg=1,qi="",un="srgb",Fr="srgb-linear",Bo="linear",fe="srgb",jn=7680,$g=7681,Kg=514,Ll=519,Zg=512,Jg=513,Qg=514,pm=515,t1=516,e1=517,n1=518,i1=519,Ku=35044,Zo=35048,Zu="300 es",Ai=2e3,uo=2001;class Ur{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const $e=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ju=1234567;const Qr=Math.PI/180,aa=180/Math.PI;function Nr(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return($e[n&255]+$e[n>>8&255]+$e[n>>16&255]+$e[n>>24&255]+"-"+$e[t&255]+$e[t>>8&255]+"-"+$e[t>>16&15|64]+$e[t>>24&255]+"-"+$e[e&63|128]+$e[e>>8&255]+"-"+$e[e>>16&255]+$e[e>>24&255]+$e[i&255]+$e[i>>8&255]+$e[i>>16&255]+$e[i>>24&255]).toLowerCase()}function Je(n,t,e){return Math.max(t,Math.min(e,n))}function Fh(n,t){return(n%t+t)%t}function s1(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function r1(n,t,e){return n!==t?(e-n)/(t-n):0}function ta(n,t,e){return(1-e)*n+e*t}function a1(n,t,e,i){return ta(n,t,1-Math.exp(-e*i))}function o1(n,t=1){return t-Math.abs(Fh(n,t*2)-t)}function c1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function l1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function h1(n,t){return n+Math.floor(Math.random()*(t-n+1))}function u1(n,t){return n+Math.random()*(t-n)}function d1(n){return n*(.5-Math.random())}function f1(n){n!==void 0&&(Ju=n);let t=Ju+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function p1(n){return n*Qr}function m1(n){return n*aa}function g1(n){return(n&n-1)===0&&n!==0}function _1(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function v1(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function x1(n,t,e,i,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+i)/2),h=a((t+i)/2),u=r((t-i)/2),d=a((t-i)/2),f=r((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(o*h,c*u,c*d,o*l);break;case"YZY":n.set(c*d,o*h,c*u,o*l);break;case"ZXZ":n.set(c*u,c*d,o*h,o*l);break;case"XZX":n.set(o*h,c*g,c*f,o*l);break;case"YXY":n.set(c*f,o*h,c*g,o*l);break;case"ZYZ":n.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zs(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function an(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Bn={DEG2RAD:Qr,RAD2DEG:aa,generateUUID:Nr,clamp:Je,euclideanModulo:Fh,mapLinear:s1,inverseLerp:r1,lerp:ta,damp:a1,pingpong:o1,smoothstep:c1,smootherstep:l1,randInt:h1,randFloat:u1,randFloatSpread:d1,seededRandom:f1,degToRad:p1,radToDeg:m1,isPowerOfTwo:g1,ceilPowerOfTwo:_1,floorPowerOfTwo:v1,setQuaternionFromProperEuler:x1,normalize:an,denormalize:Zs};class ae{constructor(t=0,e=0){ae.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Je(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qt{constructor(t,e,i,s,r,a,o,c,l){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],v=s[0],m=s[3],p=s[6],S=s[1],x=s[4],_=s[7],w=s[2],b=s[5],A=s[8];return r[0]=a*v+o*S+c*w,r[3]=a*m+o*x+c*b,r[6]=a*p+o*_+c*A,r[1]=l*v+h*S+u*w,r[4]=l*m+h*x+u*b,r[7]=l*p+h*_+u*A,r[2]=d*v+f*S+g*w,r[5]=d*m+f*x+g*b,r[8]=d*p+f*_+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,g=e*u+i*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*i)*v,t[2]=(o*i-s*a)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-o*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(a*e-i*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Jo.makeScale(t,e)),this}rotate(t){return this.premultiply(Jo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Jo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Jo=new qt;function mm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function fo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function y1(){const n=fo("canvas");return n.style.display="block",n}const Qu={};function jr(n){n in Qu||(Qu[n]=!0,console.warn(n))}function M1(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}function S1(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function E1(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ne={enabled:!0,workingColorSpace:Fr,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===fe&&(n.r=wi(n.r),n.g=wi(n.g),n.b=wi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===fe&&(n.r=sr(n.r),n.g=sr(n.g),n.b=sr(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===qi?Bo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function wi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function sr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const td=[.64,.33,.3,.6,.15,.06],ed=[.2126,.7152,.0722],nd=[.3127,.329],id=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sd=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ne.define({[Fr]:{primaries:td,whitePoint:nd,transfer:Bo,toXYZ:id,fromXYZ:sd,luminanceCoefficients:ed,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:td,whitePoint:nd,transfer:fe,toXYZ:id,fromXYZ:sd,luminanceCoefficients:ed,outputColorSpaceConfig:{drawingBufferColorSpace:un}}});let Bs;class b1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Bs===void 0&&(Bs=fo("canvas")),Bs.width=t.width,Bs.height=t.height;const i=Bs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Bs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=wi(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(wi(e[i]/255)*255):e[i]=wi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let T1=0;class gm{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:T1++}),this.uuid=Nr(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Qo(s[a].image)):r.push(Qo(s[a]))}else r=Qo(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function Qo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?b1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let A1=0;class en extends Ur{constructor(t=en.DEFAULT_IMAGE,e=en.DEFAULT_MAPPING,i=_s,s=_s,r=tn,a=vs,o=Zn,c=Ii,l=en.DEFAULT_ANISOTROPY,h=qi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:A1++}),this.uuid=Nr(),this.name="",this.source=new gm(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==nm)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case nl:t.x=t.x-Math.floor(t.x);break;case _s:t.x=t.x<0?0:1;break;case il:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case nl:t.y=t.y-Math.floor(t.y);break;case _s:t.y=t.y<0?0:1;break;case il:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=nm;en.DEFAULT_ANISOTROPY=1;class Ce{constructor(t=0,e=0,i=0,s=1){Ce.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,_=(f+1)/2,w=(p+1)/2,b=(h+d)/4,A=(u+v)/4,R=(g+m)/4;return x>_&&x>w?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=b/i,r=A/i):_>w?_<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),i=b/s,r=R/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=A/r,s=R/r),this.set(i,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(d-h)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class w1 extends Ur{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ce(0,0,t,e),this.scissorTest=!1,this.viewport=new Ce(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:tn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const r=new en(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new gm(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Rs extends w1{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class _m extends en{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Qn,this.minFilter=Qn,this.wrapR=_s,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class C1 extends en{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Qn,this.minFilter=Qn,this.wrapR=_s,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ci{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const d=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-o;const p=c*d+l*f+h*g+u*v,S=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),b=Math.atan2(w,p*S);m=Math.sin(m*b)/w,o=Math.sin(o*b)/w}const _=o*S;if(c=c*m+d*_,l=l*m+f*_,h=h*m+g*_,u=u*m+v*_,m===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-o*f,t[e+2]=l*g+h*f+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),d=c(i/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Je(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*i+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class k{constructor(t=0,e=0,i=0){k.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return tc.copy(this).projectOnVector(t),this.sub(tc)}reflect(t){return this.sub(tc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Je(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const tc=new k,rd=new Ci;class ga{constructor(t=new k(1/0,1/0,1/0),e=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Xn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Xn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Xn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Xn):Xn.fromBufferAttribute(r,a),Xn.applyMatrix4(t.matrixWorld),this.expandByPoint(Xn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ra.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ra.copy(i.boundingBox)),Ra.applyMatrix4(t.matrixWorld),this.union(Ra)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Xn),Xn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Hr),La.subVectors(this.max,Hr),ks.subVectors(t.a,Hr),zs.subVectors(t.b,Hr),Vs.subVectors(t.c,Hr),Bi.subVectors(zs,ks),ki.subVectors(Vs,zs),is.subVectors(ks,Vs);let e=[0,-Bi.z,Bi.y,0,-ki.z,ki.y,0,-is.z,is.y,Bi.z,0,-Bi.x,ki.z,0,-ki.x,is.z,0,-is.x,-Bi.y,Bi.x,0,-ki.y,ki.x,0,-is.y,is.x,0];return!ec(e,ks,zs,Vs,La)||(e=[1,0,0,0,1,0,0,0,1],!ec(e,ks,zs,Vs,La))?!1:(Pa.crossVectors(Bi,ki),e=[Pa.x,Pa.y,Pa.z],ec(e,ks,zs,Vs,La))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Xn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Xn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_i),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const _i=[new k,new k,new k,new k,new k,new k,new k,new k],Xn=new k,Ra=new ga,ks=new k,zs=new k,Vs=new k,Bi=new k,ki=new k,is=new k,Hr=new k,La=new k,Pa=new k,ss=new k;function ec(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){ss.fromArray(n,r);const o=s.x*Math.abs(ss.x)+s.y*Math.abs(ss.y)+s.z*Math.abs(ss.z),c=t.dot(ss),l=e.dot(ss),h=i.dot(ss);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const R1=new ga,Gr=new k,nc=new k;class Uh{constructor(t=new k,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):R1.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Gr.subVectors(t,this.center);const e=Gr.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Gr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(nc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Gr.copy(t.center).add(nc)),this.expandByPoint(Gr.copy(t.center).sub(nc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const vi=new k,ic=new k,Da=new k,zi=new k,sc=new k,Ia=new k,rc=new k;class L1{constructor(t=new k,e=new k(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,vi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=vi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(vi.copy(this.origin).addScaledVector(this.direction,e),vi.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ic.copy(t).add(e).multiplyScalar(.5),Da.copy(e).sub(t).normalize(),zi.copy(this.origin).sub(ic);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Da),o=zi.dot(this.direction),c=-zi.dot(Da),l=zi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ic).addScaledVector(Da,d),f}intersectSphere(t,e){vi.subVectors(t.center,this.origin);const i=vi.dot(this.direction),s=vi.dot(vi)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,vi)!==null}intersectTriangle(t,e,i,s,r){sc.subVectors(e,t),Ia.subVectors(i,t),rc.crossVectors(sc,Ia);let a=this.direction.dot(rc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zi.subVectors(this.origin,t);const c=o*this.direction.dot(Ia.crossVectors(zi,Ia));if(c<0)return null;const l=o*this.direction.dot(sc.cross(zi));if(l<0||c+l>a)return null;const h=-o*zi.dot(rc);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ee{constructor(t,e,i,s,r,a,o,c,l,h,u,d,f,g,v,m){Ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,h,u,d,f,g,v,m)}set(t,e,i,s,r,a,o,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ee().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Hs.setFromMatrixColumn(t,0).length(),r=1/Hs.setFromMatrixColumn(t,1).length(),a=1/Hs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=v+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=v-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=o*c,v=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(P1,t,D1)}lookAt(t,e,i){const s=this.elements;return En.subVectors(t,e),En.lengthSq()===0&&(En.z=1),En.normalize(),Vi.crossVectors(i,En),Vi.lengthSq()===0&&(Math.abs(i.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Vi.crossVectors(i,En)),Vi.normalize(),Fa.crossVectors(En,Vi),s[0]=Vi.x,s[4]=Fa.x,s[8]=En.x,s[1]=Vi.y,s[5]=Fa.y,s[9]=En.y,s[2]=Vi.z,s[6]=Fa.z,s[10]=En.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],v=i[6],m=i[10],p=i[14],S=i[3],x=i[7],_=i[11],w=i[15],b=s[0],A=s[4],R=s[8],M=s[12],y=s[1],L=s[5],B=s[9],D=s[13],N=s[2],j=s[6],W=s[10],Q=s[14],V=s[3],tt=s[7],ot=s[11],nt=s[15];return r[0]=a*b+o*y+c*N+l*V,r[4]=a*A+o*L+c*j+l*tt,r[8]=a*R+o*B+c*W+l*ot,r[12]=a*M+o*D+c*Q+l*nt,r[1]=h*b+u*y+d*N+f*V,r[5]=h*A+u*L+d*j+f*tt,r[9]=h*R+u*B+d*W+f*ot,r[13]=h*M+u*D+d*Q+f*nt,r[2]=g*b+v*y+m*N+p*V,r[6]=g*A+v*L+m*j+p*tt,r[10]=g*R+v*B+m*W+p*ot,r[14]=g*M+v*D+m*Q+p*nt,r[3]=S*b+x*y+_*N+w*V,r[7]=S*A+x*L+_*j+w*tt,r[11]=S*R+x*B+_*W+w*ot,r[15]=S*M+x*D+_*Q+w*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*l*u-r*o*d+i*l*d+s*o*f-i*c*f)+v*(+e*c*f-e*l*d+r*a*d-s*a*f+s*l*h-r*c*h)+m*(+e*l*u-e*o*f-r*a*u+i*a*f+r*o*h-i*l*h)+p*(-s*o*h-e*c*u+e*o*d+s*a*u-i*a*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],S=u*m*l-v*d*l+v*c*f-o*m*f-u*c*p+o*d*p,x=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,_=h*v*l-g*u*l+g*o*f-a*v*f-h*o*p+a*u*p,w=g*u*c-h*v*c-g*o*d+a*v*d+h*o*m-a*u*m,b=e*S+i*x+s*_+r*w;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return t[0]=S*A,t[1]=(v*d*r-u*m*r-v*s*f+i*m*f+u*s*p-i*d*p)*A,t[2]=(o*m*r-v*c*r+v*s*l-i*m*l-o*s*p+i*c*p)*A,t[3]=(u*c*r-o*d*r-u*s*l+i*d*l+o*s*f-i*c*f)*A,t[4]=x*A,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*A,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*p-e*c*p)*A,t[7]=(a*d*r-h*c*r+h*s*l-e*d*l-a*s*f+e*c*f)*A,t[8]=_*A,t[9]=(g*u*r-h*v*r-g*i*f+e*v*f+h*i*p-e*u*p)*A,t[10]=(a*v*r-g*o*r+g*i*l-e*v*l-a*i*p+e*o*p)*A,t[11]=(h*o*r-a*u*r-h*i*l+e*u*l+a*i*f-e*o*f)*A,t[12]=w*A,t[13]=(h*v*s-g*u*s+g*i*d-e*v*d-h*i*m+e*u*m)*A,t[14]=(g*o*s-a*v*s-g*i*c+e*v*c+a*i*m-e*o*m)*A,t[15]=(a*u*s-h*o*s+h*i*c-e*u*c-a*i*d+e*o*d)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,g=r*u,v=a*h,m=a*u,p=o*u,S=c*l,x=c*h,_=c*u,w=i.x,b=i.y,A=i.z;return s[0]=(1-(v+p))*w,s[1]=(f+_)*w,s[2]=(g-x)*w,s[3]=0,s[4]=(f-_)*b,s[5]=(1-(d+p))*b,s[6]=(m+S)*b,s[7]=0,s[8]=(g+x)*A,s[9]=(m-S)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=Hs.set(s[0],s[1],s[2]).length();const a=Hs.set(s[4],s[5],s[6]).length(),o=Hs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Yn.copy(this);const l=1/r,h=1/a,u=1/o;return Yn.elements[0]*=l,Yn.elements[1]*=l,Yn.elements[2]*=l,Yn.elements[4]*=h,Yn.elements[5]*=h,Yn.elements[6]*=h,Yn.elements[8]*=u,Yn.elements[9]*=u,Yn.elements[10]*=u,e.setFromRotationMatrix(Yn),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=Ai){const c=this.elements,l=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s);let f,g;if(o===Ai)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===uo)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Ai){const c=this.elements,l=1/(e-t),h=1/(i-s),u=1/(a-r),d=(e+t)*l,f=(i+s)*h;let g,v;if(o===Ai)g=(a+r)*u,v=-2*u;else if(o===uo)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Hs=new k,Yn=new Ee,P1=new k(0,0,0),D1=new k(1,1,1),Vi=new k,Fa=new k,En=new k,ad=new Ee,od=new Ci;class mn{constructor(t=0,e=0,i=0,s=mn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Je(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ad.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ad,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return od.setFromEuler(this),this.setFromQuaternion(od,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}mn.DEFAULT_ORDER="XYZ";class vm{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let I1=0;const cd=new k,Gs=new Ci,xi=new Ee,Ua=new k,Wr=new k,F1=new k,U1=new Ci,ld=new k(1,0,0),hd=new k(0,1,0),ud=new k(0,0,1),dd={type:"added"},N1={type:"removed"},Ws={type:"childadded",child:null},ac={type:"childremoved",child:null};class nn extends Ur{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:I1++}),this.uuid=Nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=nn.DEFAULT_UP.clone();const t=new k,e=new mn,i=new Ci,s=new k(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ee},normalMatrix:{value:new qt}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Gs.setFromAxisAngle(t,e),this.quaternion.multiply(Gs),this}rotateOnWorldAxis(t,e){return Gs.setFromAxisAngle(t,e),this.quaternion.premultiply(Gs),this}rotateX(t){return this.rotateOnAxis(ld,t)}rotateY(t){return this.rotateOnAxis(hd,t)}rotateZ(t){return this.rotateOnAxis(ud,t)}translateOnAxis(t,e){return cd.copy(t).applyQuaternion(this.quaternion),this.position.add(cd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ld,t)}translateY(t){return this.translateOnAxis(hd,t)}translateZ(t){return this.translateOnAxis(ud,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ua.copy(t):Ua.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(Wr,Ua,this.up):xi.lookAt(Ua,Wr,this.up),this.quaternion.setFromRotationMatrix(xi),s&&(xi.extractRotation(s.matrixWorld),Gs.setFromRotationMatrix(xi),this.quaternion.premultiply(Gs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(dd),Ws.child=t,this.dispatchEvent(Ws),Ws.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(N1),ac.child=t,this.dispatchEvent(ac),ac.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xi.multiply(t.parent.matrixWorld)),t.applyMatrix4(xi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(dd),Ws.child=t,this.dispatchEvent(Ws),Ws.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wr,t,F1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wr,U1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}nn.DEFAULT_UP=new k(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qn=new k,yi=new k,oc=new k,Mi=new k,Xs=new k,Ys=new k,fd=new k,cc=new k,lc=new k,hc=new k,uc=new Ce,dc=new Ce,fc=new Ce;class Kn{constructor(t=new k,e=new k,i=new k){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),qn.subVectors(t,e),s.cross(qn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){qn.subVectors(s,e),yi.subVectors(i,e),oc.subVectors(t,e);const a=qn.dot(qn),o=qn.dot(yi),c=qn.dot(oc),l=yi.dot(yi),h=yi.dot(oc),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,Mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Mi.x),c.addScaledVector(a,Mi.y),c.addScaledVector(o,Mi.z),c)}static getInterpolatedAttribute(t,e,i,s,r,a){return uc.setScalar(0),dc.setScalar(0),fc.setScalar(0),uc.fromBufferAttribute(t,e),dc.fromBufferAttribute(t,i),fc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(uc,r.x),a.addScaledVector(dc,r.y),a.addScaledVector(fc,r.z),a}static isFrontFacing(t,e,i,s){return qn.subVectors(i,e),yi.subVectors(t,e),qn.cross(yi).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return qn.subVectors(this.c,this.b),yi.subVectors(this.a,this.b),qn.cross(yi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Kn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Kn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return Kn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return Kn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Kn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;Xs.subVectors(s,i),Ys.subVectors(r,i),cc.subVectors(t,i);const c=Xs.dot(cc),l=Ys.dot(cc);if(c<=0&&l<=0)return e.copy(i);lc.subVectors(t,s);const h=Xs.dot(lc),u=Ys.dot(lc);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(Xs,a);hc.subVectors(t,r);const f=Xs.dot(hc),g=Ys.dot(hc);if(g>=0&&f<=g)return e.copy(r);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(Ys,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return fd.subVectors(r,s),o=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(fd,o);const p=1/(m+v+d);return a=v*p,o=d*p,e.copy(i).addScaledVector(Xs,a).addScaledVector(Ys,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const xm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},Na={h:0,s:0,l:0};function pc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class te{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=un){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ne.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ne.workingColorSpace){return this.r=t,this.g=e,this.b=i,ne.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ne.workingColorSpace){if(t=Fh(t,1),e=Je(e,0,1),i=Je(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=pc(a,r,t+1/3),this.g=pc(a,r,t),this.b=pc(a,r,t-1/3)}return ne.toWorkingColorSpace(this,s),this}setStyle(t,e=un){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=un){const i=xm[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wi(t.r),this.g=wi(t.g),this.b=wi(t.b),this}copyLinearToSRGB(t){return this.r=sr(t.r),this.g=sr(t.g),this.b=sr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=un){return ne.fromWorkingColorSpace(Ke.copy(this),t),Math.round(Je(Ke.r*255,0,255))*65536+Math.round(Je(Ke.g*255,0,255))*256+Math.round(Je(Ke.b*255,0,255))}getHexString(t=un){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ne.workingColorSpace){ne.fromWorkingColorSpace(Ke.copy(this),e);const i=Ke.r,s=Ke.g,r=Ke.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ne.workingColorSpace){return ne.fromWorkingColorSpace(Ke.copy(this),e),t.r=Ke.r,t.g=Ke.g,t.b=Ke.b,t}getStyle(t=un){ne.fromWorkingColorSpace(Ke.copy(this),t);const e=Ke.r,i=Ke.g,s=Ke.b;return t!==un?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Hi),this.setHSL(Hi.h+t,Hi.s+e,Hi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Hi),t.getHSL(Na);const i=ta(Hi.h,Na.h,e),s=ta(Hi.s,Na.s,e),r=ta(Hi.l,Na.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ke=new te;te.NAMES=xm;let O1=0;class _a extends Ur{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:O1++}),this.uuid=Nr(),this.name="",this.blending=nr,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xc,this.blendDst=Yc,this.blendEquation=fs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=gr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ll,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jn,this.stencilZFail=jn,this.stencilZPass=jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==nr&&(i.blending=this.blending),this.side!==Qi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Xc&&(i.blendSrc=this.blendSrc),this.blendDst!==Yc&&(i.blendDst=this.blendDst),this.blendEquation!==fs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==gr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ll&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==jn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==jn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Xi extends _a{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=tm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ie=new k,Oa=new ae;class fn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Ku,this.updateRanges=[],this.gpuType=Ti,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Oa.fromBufferAttribute(this,e),Oa.applyMatrix3(t),this.setXY(e,Oa.x,Oa.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix3(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix4(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.applyNormalMatrix(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.transformDirection(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Zs(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=an(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Zs(e,this.array)),e}setX(t,e){return this.normalized&&(e=an(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Zs(e,this.array)),e}setY(t,e){return this.normalized&&(e=an(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Zs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=an(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Zs(e,this.array)),e}setW(t,e){return this.normalized&&(e=an(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=an(e,this.array),i=an(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=an(e,this.array),i=an(i,this.array),s=an(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=an(e,this.array),i=an(i,this.array),s=an(s,this.array),r=an(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ku&&(t.usage=this.usage),t}}class ym extends fn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Mm extends fn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class wn extends fn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let B1=0;const On=new Ee,mc=new nn,qs=new k,bn=new ga,Xr=new ga,Ge=new k;class zn extends Ur{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:B1++}),this.uuid=Nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mm(t)?Mm:ym)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new qt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return On.makeRotationFromQuaternion(t),this.applyMatrix4(On),this}rotateX(t){return On.makeRotationX(t),this.applyMatrix4(On),this}rotateY(t){return On.makeRotationY(t),this.applyMatrix4(On),this}rotateZ(t){return On.makeRotationZ(t),this.applyMatrix4(On),this}translate(t,e,i){return On.makeTranslation(t,e,i),this.applyMatrix4(On),this}scale(t,e,i){return On.makeScale(t,e,i),this.applyMatrix4(On),this}lookAt(t){return mc.lookAt(t),mc.updateMatrix(),this.applyMatrix4(mc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qs).negate(),this.translate(qs.x,qs.y,qs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wn(i,3))}else{for(let i=0,s=e.count;i<s;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ga);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];bn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Uh);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(t){const i=this.boundingSphere.center;if(bn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Xr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(bn.min,Xr.min),bn.expandByPoint(Ge),Ge.addVectors(bn.max,Xr.max),bn.expandByPoint(Ge)):(bn.expandByPoint(Xr.min),bn.expandByPoint(Xr.max))}bn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ge.fromBufferAttribute(o,l),c&&(qs.fromBufferAttribute(t,l),Ge.add(qs)),s=Math.max(s,i.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<i.count;R++)o[R]=new k,c[R]=new k;const l=new k,h=new k,u=new k,d=new ae,f=new ae,g=new ae,v=new k,m=new k;function p(R,M,y){l.fromBufferAttribute(i,R),h.fromBufferAttribute(i,M),u.fromBufferAttribute(i,y),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,M),g.fromBufferAttribute(r,y),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),o[R].add(v),o[M].add(v),o[y].add(v),c[R].add(m),c[M].add(m),c[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let R=0,M=S.length;R<M;++R){const y=S[R],L=y.start,B=y.count;for(let D=L,N=L+B;D<N;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const x=new k,_=new k,w=new k,b=new k;function A(R){w.fromBufferAttribute(s,R),b.copy(w);const M=o[R];x.copy(M),x.sub(w.multiplyScalar(w.dot(M))).normalize(),_.crossVectors(b,M);const L=_.dot(c[R])<0?-1:1;a.setXYZW(R,x.x,x.y,x.z,L)}for(let R=0,M=S.length;R<M;++R){const y=S[R],L=y.start,B=y.count;for(let D=L,N=L+B;D<N;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new k,r=new k,a=new k,o=new k,c=new k,l=new k,h=new k,u=new k;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new fn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new zn,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,i);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pd=new Ee,rs=new L1,Ba=new Uh,md=new k,ka=new k,za=new k,Va=new k,gc=new k,Ha=new k,gd=new k,Ga=new k;class Xe extends nn{constructor(t=new zn,e=new Xi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Ha.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(gc.fromBufferAttribute(u,t),a?Ha.addScaledVector(gc,h):Ha.addScaledVector(gc.sub(e),h))}e.add(Ha)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ba.copy(i.boundingSphere),Ba.applyMatrix4(r),rs.copy(t.ray).recast(t.near),!(Ba.containsPoint(rs.origin)===!1&&(rs.intersectSphere(Ba,md)===null||rs.origin.distanceToSquared(md)>(t.far-t.near)**2))&&(pd.copy(r).invert(),rs.copy(t.ray).applyMatrix4(pd),!(i.boundingBox!==null&&rs.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,rs)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=S,w=x;_<w;_+=3){const b=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);s=Wa(this,p,t,i,l,h,u,b,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=o.getX(m),x=o.getX(m+1),_=o.getX(m+2);s=Wa(this,a,t,i,l,h,u,S,x,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let _=S,w=x;_<w;_+=3){const b=_,A=_+1,R=_+2;s=Wa(this,p,t,i,l,h,u,b,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=m,x=m+1,_=m+2;s=Wa(this,a,t,i,l,h,u,S,x,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function k1(n,t,e,i,s,r,a,o){let c;if(t.side===pn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===Qi,o),c===null)return null;Ga.copy(o),Ga.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ga);return l<e.near||l>e.far?null:{distance:l,point:Ga.clone(),object:n}}function Wa(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,ka),n.getVertexPosition(c,za),n.getVertexPosition(l,Va);const h=k1(n,t,e,i,ka,za,Va,gd);if(h){const u=new k;Kn.getBarycoord(gd,ka,za,Va,u),s&&(h.uv=Kn.getInterpolatedAttribute(s,o,c,l,u,new ae)),r&&(h.uv1=Kn.getInterpolatedAttribute(r,o,c,l,u,new ae)),a&&(h.normal=Kn.getInterpolatedAttribute(a,o,c,l,u,new k),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new k,materialIndex:0};Kn.getNormal(ka,za,Va,d.normal),h.face=d,h.barycoord=u}return h}class va extends zn{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new wn(l,3)),this.setAttribute("normal",new wn(h,3)),this.setAttribute("uv",new wn(u,2));function g(v,m,p,S,x,_,w,b,A,R,M){const y=_/A,L=w/R,B=_/2,D=w/2,N=b/2,j=A+1,W=R+1;let Q=0,V=0;const tt=new k;for(let ot=0;ot<W;ot++){const nt=ot*L-D;for(let dt=0;dt<j;dt++){const Vt=dt*y-B;tt[v]=Vt*S,tt[m]=nt*x,tt[p]=N,l.push(tt.x,tt.y,tt.z),tt[v]=0,tt[m]=0,tt[p]=b>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(dt/A),u.push(1-ot/R),Q+=1}}for(let ot=0;ot<R;ot++)for(let nt=0;nt<A;nt++){const dt=d+nt+j*ot,Vt=d+nt+j*(ot+1),X=d+(nt+1)+j*(ot+1),Z=d+(nt+1)+j*ot;c.push(dt,Vt,Z),c.push(Vt,X,Z),V+=6}o.addGroup(f,V,M),f+=V,d+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new va(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Mr(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function on(n){const t={};for(let e=0;e<n.length;e++){const i=Mr(n[e]);for(const s in i)t[s]=i[s]}return t}function z1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Sm(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ne.workingColorSpace}const V1={clone:Mr,merge:on};var H1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,G1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ts extends _a{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=H1,this.fragmentShader=G1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Mr(t.uniforms),this.uniformsGroups=z1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Em extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=Ai}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Gi=new k,_d=new ae,vd=new ae;class $n extends Em{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=aa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Qr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return aa*2*Math.atan(Math.tan(Qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Gi.x,Gi.y).multiplyScalar(-t/Gi.z),Gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Gi.x,Gi.y).multiplyScalar(-t/Gi.z)}getViewSize(t,e){return this.getViewBounds(t,_d,vd),e.subVectors(vd,_d)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Qr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const js=-90,$s=1;class W1 extends nn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $n(js,$s,t,e);s.layers=this.layers,this.add(s);const r=new $n(js,$s,t,e);r.layers=this.layers,this.add(r);const a=new $n(js,$s,t,e);a.layers=this.layers,this.add(a);const o=new $n(js,$s,t,e);o.layers=this.layers,this.add(o);const c=new $n(js,$s,t,e);c.layers=this.layers,this.add(c);const l=new $n(js,$s,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Ai)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===uo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class bm extends en{constructor(t,e,i,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:_r,super(t,e,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class X1 extends Rs{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new bm(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:tn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new va(5,5,5),r=new ts({name:"CubemapFromEquirect",uniforms:Mr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:pn,blending:$i});r.uniforms.tEquirect.value=e;const a=new Xe(s,r),o=e.minFilter;return e.minFilter===vs&&(e.minFilter=tn),new W1(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}const _c=new k,Y1=new k,q1=new qt;class ls{constructor(t=new k(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=_c.subVectors(i,e).cross(Y1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(_c),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||q1.getNormalMatrix(t),s=this.coplanarPoint(_c).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const as=new Uh,Xa=new k;class Nh{constructor(t=new ls,e=new ls,i=new ls,s=new ls,r=new ls,a=new ls){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ai){const i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],v=s[10],m=s[11],p=s[12],S=s[13],x=s[14],_=s[15];if(i[0].setComponents(c-r,d-l,m-f,_-p).normalize(),i[1].setComponents(c+r,d+l,m+f,_+p).normalize(),i[2].setComponents(c+a,d+h,m+g,_+S).normalize(),i[3].setComponents(c-a,d-h,m-g,_-S).normalize(),i[4].setComponents(c-o,d-u,m-v,_-x).normalize(),e===Ai)i[5].setComponents(c+o,d+u,m+v,_+x).normalize();else if(e===uo)i[5].setComponents(o,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),as.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),as.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(as)}intersectsSprite(t){return as.center.set(0,0,0),as.radius=.7071067811865476,as.applyMatrix4(t.matrixWorld),this.intersectsSphere(as)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Xa.x=s.normal.x>0?t.max.x:t.min.x,Xa.y=s.normal.y>0?t.max.y:t.min.y,Xa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Xa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Tm(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function j1(n){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,o),u.length===0)n.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}class xa extends zn{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=t/o,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const S=p*d-a;for(let x=0;x<l;x++){const _=x*u-r;g.push(_,-S,0),v.push(0,0,1),m.push(x/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<o;S++){const x=S+l*p,_=S+l*(p+1),w=S+1+l*(p+1),b=S+1+l*p;f.push(x,_,b),f.push(_,w,b)}this.setIndex(f),this.setAttribute("position",new wn(g,3)),this.setAttribute("normal",new wn(v,3)),this.setAttribute("uv",new wn(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xa(t.width,t.height,t.widthSegments,t.heightSegments)}}var $1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,K1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Z1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,J1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Q1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,t_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,e_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,n_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,i_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,s_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,r_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,a_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,o_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,c_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,l_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,h_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,u_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,d_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,f_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,p_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,m_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,g_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,__=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,v_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,x_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,y_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,M_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,S_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,E_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,b_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,T_="gl_FragColor = linearToOutputTexel( gl_FragColor );",A_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,w_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,C_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,R_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,L_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,P_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,D_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,I_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,F_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,U_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,N_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,O_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,B_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,k_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,z_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,V_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,H_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,G_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,W_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,X_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Y_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,q_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,j_=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,K_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Z_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,J_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Q_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ev=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,iv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,sv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,av=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ov=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,cv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,uv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,fv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,pv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_v=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,vv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,xv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Mv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ev=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Av=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Cv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Lv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Pv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Dv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Iv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Fv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Uv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Nv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ov=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Wv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Yv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const jv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$v=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,e2=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,n2=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,i2=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,s2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,r2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a2=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,o2=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,c2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,l2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,f2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,m2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,g2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,x2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,M2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,E2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,b2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,A2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:$1,alphahash_pars_fragment:K1,alphamap_fragment:Z1,alphamap_pars_fragment:J1,alphatest_fragment:Q1,alphatest_pars_fragment:t_,aomap_fragment:e_,aomap_pars_fragment:n_,batching_pars_vertex:i_,batching_vertex:s_,begin_vertex:r_,beginnormal_vertex:a_,bsdfs:o_,iridescence_fragment:c_,bumpmap_pars_fragment:l_,clipping_planes_fragment:h_,clipping_planes_pars_fragment:u_,clipping_planes_pars_vertex:d_,clipping_planes_vertex:f_,color_fragment:p_,color_pars_fragment:m_,color_pars_vertex:g_,color_vertex:__,common:v_,cube_uv_reflection_fragment:x_,defaultnormal_vertex:y_,displacementmap_pars_vertex:M_,displacementmap_vertex:S_,emissivemap_fragment:E_,emissivemap_pars_fragment:b_,colorspace_fragment:T_,colorspace_pars_fragment:A_,envmap_fragment:w_,envmap_common_pars_fragment:C_,envmap_pars_fragment:R_,envmap_pars_vertex:L_,envmap_physical_pars_fragment:V_,envmap_vertex:P_,fog_vertex:D_,fog_pars_vertex:I_,fog_fragment:F_,fog_pars_fragment:U_,gradientmap_pars_fragment:N_,lightmap_pars_fragment:O_,lights_lambert_fragment:B_,lights_lambert_pars_fragment:k_,lights_pars_begin:z_,lights_toon_fragment:H_,lights_toon_pars_fragment:G_,lights_phong_fragment:W_,lights_phong_pars_fragment:X_,lights_physical_fragment:Y_,lights_physical_pars_fragment:q_,lights_fragment_begin:j_,lights_fragment_maps:$_,lights_fragment_end:K_,logdepthbuf_fragment:Z_,logdepthbuf_pars_fragment:J_,logdepthbuf_pars_vertex:Q_,logdepthbuf_vertex:tv,map_fragment:ev,map_pars_fragment:nv,map_particle_fragment:iv,map_particle_pars_fragment:sv,metalnessmap_fragment:rv,metalnessmap_pars_fragment:av,morphinstance_vertex:ov,morphcolor_vertex:cv,morphnormal_vertex:lv,morphtarget_pars_vertex:hv,morphtarget_vertex:uv,normal_fragment_begin:dv,normal_fragment_maps:fv,normal_pars_fragment:pv,normal_pars_vertex:mv,normal_vertex:gv,normalmap_pars_fragment:_v,clearcoat_normal_fragment_begin:vv,clearcoat_normal_fragment_maps:xv,clearcoat_pars_fragment:yv,iridescence_pars_fragment:Mv,opaque_fragment:Sv,packing:Ev,premultiplied_alpha_fragment:bv,project_vertex:Tv,dithering_fragment:Av,dithering_pars_fragment:wv,roughnessmap_fragment:Cv,roughnessmap_pars_fragment:Rv,shadowmap_pars_fragment:Lv,shadowmap_pars_vertex:Pv,shadowmap_vertex:Dv,shadowmask_pars_fragment:Iv,skinbase_vertex:Fv,skinning_pars_vertex:Uv,skinning_vertex:Nv,skinnormal_vertex:Ov,specularmap_fragment:Bv,specularmap_pars_fragment:kv,tonemapping_fragment:zv,tonemapping_pars_fragment:Vv,transmission_fragment:Hv,transmission_pars_fragment:Gv,uv_pars_fragment:Wv,uv_pars_vertex:Xv,uv_vertex:Yv,worldpos_vertex:qv,background_vert:jv,background_frag:$v,backgroundCube_vert:Kv,backgroundCube_frag:Zv,cube_vert:Jv,cube_frag:Qv,depth_vert:t2,depth_frag:e2,distanceRGBA_vert:n2,distanceRGBA_frag:i2,equirect_vert:s2,equirect_frag:r2,linedashed_vert:a2,linedashed_frag:o2,meshbasic_vert:c2,meshbasic_frag:l2,meshlambert_vert:h2,meshlambert_frag:u2,meshmatcap_vert:d2,meshmatcap_frag:f2,meshnormal_vert:p2,meshnormal_frag:m2,meshphong_vert:g2,meshphong_frag:_2,meshphysical_vert:v2,meshphysical_frag:x2,meshtoon_vert:y2,meshtoon_frag:M2,points_vert:S2,points_frag:E2,shadow_vert:b2,shadow_frag:T2,sprite_vert:A2,sprite_frag:w2},ht={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},oi={basic:{uniforms:on([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:on([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new te(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:on([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:on([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:on([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new te(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:on([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:on([ht.points,ht.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:on([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:on([ht.common,ht.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:on([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:on([ht.sprite,ht.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:on([ht.common,ht.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:on([ht.lights,ht.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};oi.physical={uniforms:on([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const Ya={r:0,b:0,g:0},os=new mn,C2=new Ee;function R2(n,t,e,i,s,r,a){const o=new te(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?e:t).get(x)),x}function v(S){let x=!1;const _=g(S);_===null?p(o,c):_&&_.isColor&&(p(_,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(S,x){const _=g(x);_&&(_.isCubeTexture||_.mapping===Oo)?(h===void 0&&(h=new Xe(new va(1,1,1),new ts({name:"BackgroundCubeMaterial",uniforms:Mr(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),os.copy(x.backgroundRotation),os.x*=-1,os.y*=-1,os.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(os.y*=-1,os.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(C2.makeRotationFromEuler(os)),h.material.toneMapped=ne.getTransfer(_.colorSpace)!==fe,(u!==_||d!==_.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,f=n.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Xe(new xa(2,2),new ts({name:"BackgroundMaterial",uniforms:Mr(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ne.getTransfer(_.colorSpace)!==fe,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,f=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,x){S.getRGB(Ya,Sm(n)),i.buffers.color.setClear(Ya.r,Ya.g,Ya.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(S,x=1){o.set(S),c=x,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,p(o,c)},render:v,addToRenderList:m}}function L2(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(y,L,B,D,N){let j=!1;const W=u(D,B,L);r!==W&&(r=W,l(r.object)),j=f(y,D,B,N),j&&g(y,D,B,N),N!==null&&t.update(N,n.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,_(y,L,B,D),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function h(y){return n.deleteVertexArray(y)}function u(y,L,B){const D=B.wireframe===!0;let N=i[y.id];N===void 0&&(N={},i[y.id]=N);let j=N[L.id];j===void 0&&(j={},N[L.id]=j);let W=j[D];return W===void 0&&(W=d(c()),j[D]=W),W}function d(y){const L=[],B=[],D=[];for(let N=0;N<e;N++)L[N]=0,B[N]=0,D[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:B,attributeDivisors:D,object:y,attributes:{},index:null}}function f(y,L,B,D){const N=r.attributes,j=L.attributes;let W=0;const Q=B.getAttributes();for(const V in Q)if(Q[V].location>=0){const ot=N[V];let nt=j[V];if(nt===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(nt=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(nt=y.instanceColor)),ot===void 0||ot.attribute!==nt||nt&&ot.data!==nt.data)return!0;W++}return r.attributesNum!==W||r.index!==D}function g(y,L,B,D){const N={},j=L.attributes;let W=0;const Q=B.getAttributes();for(const V in Q)if(Q[V].location>=0){let ot=j[V];ot===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(ot=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(ot=y.instanceColor));const nt={};nt.attribute=ot,ot&&ot.data&&(nt.data=ot.data),N[V]=nt,W++}r.attributes=N,r.attributesNum=W,r.index=D}function v(){const y=r.newAttributes;for(let L=0,B=y.length;L<B;L++)y[L]=0}function m(y){p(y,0)}function p(y,L){const B=r.newAttributes,D=r.enabledAttributes,N=r.attributeDivisors;B[y]=1,D[y]===0&&(n.enableVertexAttribArray(y),D[y]=1),N[y]!==L&&(n.vertexAttribDivisor(y,L),N[y]=L)}function S(){const y=r.newAttributes,L=r.enabledAttributes;for(let B=0,D=L.length;B<D;B++)L[B]!==y[B]&&(n.disableVertexAttribArray(B),L[B]=0)}function x(y,L,B,D,N,j,W){W===!0?n.vertexAttribIPointer(y,L,B,N,j):n.vertexAttribPointer(y,L,B,D,N,j)}function _(y,L,B,D){v();const N=D.attributes,j=B.getAttributes(),W=L.defaultAttributeValues;for(const Q in j){const V=j[Q];if(V.location>=0){let tt=N[Q];if(tt===void 0&&(Q==="instanceMatrix"&&y.instanceMatrix&&(tt=y.instanceMatrix),Q==="instanceColor"&&y.instanceColor&&(tt=y.instanceColor)),tt!==void 0){const ot=tt.normalized,nt=tt.itemSize,dt=t.get(tt);if(dt===void 0)continue;const Vt=dt.buffer,X=dt.type,Z=dt.bytesPerElement,ct=X===n.INT||X===n.UNSIGNED_INT||tt.gpuType===Ch;if(tt.isInterleavedBufferAttribute){const it=tt.data,xt=it.stride,Et=tt.offset;if(it.isInstancedInterleavedBuffer){for(let Ft=0;Ft<V.locationSize;Ft++)p(V.location+Ft,it.meshPerAttribute);y.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Ft=0;Ft<V.locationSize;Ft++)m(V.location+Ft);n.bindBuffer(n.ARRAY_BUFFER,Vt);for(let Ft=0;Ft<V.locationSize;Ft++)x(V.location+Ft,nt/V.locationSize,X,ot,xt*Z,(Et+nt/V.locationSize*Ft)*Z,ct)}else{if(tt.isInstancedBufferAttribute){for(let it=0;it<V.locationSize;it++)p(V.location+it,tt.meshPerAttribute);y.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let it=0;it<V.locationSize;it++)m(V.location+it);n.bindBuffer(n.ARRAY_BUFFER,Vt);for(let it=0;it<V.locationSize;it++)x(V.location+it,nt/V.locationSize,X,ot,nt*Z,nt/V.locationSize*it*Z,ct)}}else if(W!==void 0){const ot=W[Q];if(ot!==void 0)switch(ot.length){case 2:n.vertexAttrib2fv(V.location,ot);break;case 3:n.vertexAttrib3fv(V.location,ot);break;case 4:n.vertexAttrib4fv(V.location,ot);break;default:n.vertexAttrib1fv(V.location,ot)}}}}S()}function w(){R();for(const y in i){const L=i[y];for(const B in L){const D=L[B];for(const N in D)h(D[N].object),delete D[N];delete L[B]}delete i[y]}}function b(y){if(i[y.id]===void 0)return;const L=i[y.id];for(const B in L){const D=L[B];for(const N in D)h(D[N].object),delete D[N];delete L[B]}delete i[y.id]}function A(y){for(const L in i){const B=i[L];if(B[y.id]===void 0)continue;const D=B[y.id];for(const N in D)h(D[N].object),delete D[N];delete B[y.id]}}function R(){M(),a=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function P2(n,t,e){let i;function s(l){i=l}function r(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,i,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function D2(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Zn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===ma&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Ii&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ti&&!R)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:w,maxSamples:b}}function I2(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new ls,o=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const S=r?0:i,x=S*4;let _=p.clippingState||null;c.value=_,_=h(g,d,x,f);for(let w=0;w!==x;++w)_[w]=e[w];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,_=f;x!==v;++x,_+=4)a.copy(u[x]).applyMatrix4(S,o),a.normal.toArray(m,_),m[_+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function F2(n){let t=new WeakMap;function e(a,o){return o===tl?a.mapping=_r:o===el&&(a.mapping=vr),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===tl||o===el)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new X1(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}class Oh extends Em{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Qs=4,xd=[.125,.215,.35,.446,.526,.582],ps=20,vc=new Oh,yd=new te;let xc=null,yc=0,Mc=0,Sc=!1;const hs=(1+Math.sqrt(5))/2,Ks=1/hs,Md=[new k(-hs,Ks,0),new k(hs,Ks,0),new k(-Ks,0,hs),new k(Ks,0,hs),new k(0,hs,-Ks),new k(0,hs,Ks),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)];class Sd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){xc=this._renderer.getRenderTarget(),yc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),Sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Td(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(xc,yc,Mc),this._renderer.xr.enabled=Sc,t.scissorTest=!1,qa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_r||t.mapping===vr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),xc=this._renderer.getRenderTarget(),yc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),Sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:tn,minFilter:tn,generateMipmaps:!1,type:ma,format:Zn,colorSpace:Fr,depthBuffer:!1},s=Ed(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ed(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=U2(r)),this._blurMaterial=N2(r,t,e)}return s}_compileMaterial(t){const e=new Xe(this._lodPlanes[0],t);this._renderer.compile(e,vc)}_sceneToCubeUV(t,e,i,s){const o=new $n(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(yd),h.toneMapping=Ki,h.autoClear=!1;const f=new Xi({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),g=new Xe(new va,f);let v=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,v=!0):(f.color.copy(yd),v=!0);for(let p=0;p<6;p++){const S=p%3;S===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):S===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const x=this._cubeSize;qa(s,S*x,p>2?x:0,x,x),h.setRenderTarget(s),v&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===_r||t.mapping===vr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Td()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Xe(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;qa(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,vc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Md[(s-r-1)%Md.length];this._blur(t,r-1,r,a,o)}e.autoClear=i}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Xe(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ps-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):ps;m>ps&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ps}`);const p=[];let S=0;for(let A=0;A<ps;++A){const R=A/v,M=Math.exp(-R*R/2);p.push(M),A===0?S+=M:A<m&&(S+=2*M)}for(let A=0;A<p.length;A++)p[A]=p[A]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const _=this._sizeLods[s],w=3*_*(s>x-Qs?s-x+Qs:0),b=4*(this._cubeSize-_);qa(e,w,b,3*_,2*_),c.setRenderTarget(e),c.render(u,vc)}}function U2(n){const t=[],e=[],i=[];let s=n;const r=n-Qs+1+xd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-Qs?c=xd[a-n+Qs-1]:a===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,S=new Float32Array(v*g*f),x=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let b=0;b<f;b++){const A=b%3*2/3-1,R=b>2?0:-1,M=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];S.set(M,v*g*b),x.set(d,m*g*b);const y=[b,b,b,b,b,b];_.set(y,p*g*b)}const w=new zn;w.setAttribute("position",new fn(S,v)),w.setAttribute("uv",new fn(x,m)),w.setAttribute("faceIndex",new fn(_,p)),t.push(w),s>Qs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ed(n,t,e){const i=new Rs(n,t,e);return i.texture.mapping=Oo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function qa(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function N2(n,t,e){const i=new Float32Array(ps),s=new k(0,1,0);return new ts({name:"SphericalGaussianBlur",defines:{n:ps,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function bd(){return new ts({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function Td(){return new ts({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function Bh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function O2(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===tl||c===el,h=c===_r||c===vr;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Sd(n)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Sd(n)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function B2(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&jr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function k2(n,t,e,i){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],n.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const S=f.array;v=f.version;for(let x=0,_=S.length;x<_;x+=3){const w=S[x+0],b=S[x+1],A=S[x+2];d.push(w,b,b,A,A,w)}}else if(g!==void 0){const S=g.array;v=g.version;for(let x=0,_=S.length/3-1;x<_;x+=3){const w=x+0,b=x+1,A=x+2;d.push(w,b,b,A,A,w)}}else return;const m=new(mm(d)?Mm:ym)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function z2(n,t,e){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){n.drawElements(i,f,r,d*a),e.update(f,i,1)}function l(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,r,d*a,g),e.update(f,i,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,i,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,v,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S]*v[S];e.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function V2(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function H2(n,t,e){const i=new WeakMap,s=new Ce;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let M=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let x=0;f===!0&&(x=1),g===!0&&(x=2),v===!0&&(x=3);let _=o.attributes.position.count*x,w=1;_>t.maxTextureSize&&(w=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const b=new Float32Array(_*w*4*u),A=new _m(b,_,w,u);A.type=Ti,A.needsUpdate=!0;const R=x*4;for(let y=0;y<u;y++){const L=m[y],B=p[y],D=S[y],N=_*w*4*y;for(let j=0;j<L.count;j++){const W=j*R;f===!0&&(s.fromBufferAttribute(L,j),b[N+W+0]=s.x,b[N+W+1]=s.y,b[N+W+2]=s.z,b[N+W+3]=0),g===!0&&(s.fromBufferAttribute(B,j),b[N+W+4]=s.x,b[N+W+5]=s.y,b[N+W+6]=s.z,b[N+W+7]=0),v===!0&&(s.fromBufferAttribute(D,j),b[N+W+8]=s.x,b[N+W+9]=s.y,b[N+W+10]=s.z,b[N+W+11]=D.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new ae(_,w)},i.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];const g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function G2(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}class Am extends en{constructor(t,e,i,s,r,a,o,c,l,h=ir){if(h!==ir&&h!==yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ir&&(i=Cs),i===void 0&&h===yr&&(i=xr),super(null,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Qn,this.minFilter=c!==void 0?c:Qn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const wm=new en,Ad=new Am(1,1),Cm=new _m,Rm=new C1,Lm=new bm,wd=[],Cd=[],Rd=new Float32Array(16),Ld=new Float32Array(9),Pd=new Float32Array(4);function Or(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=wd[s];if(r===void 0&&(r=new Float32Array(s),wd[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Ve(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function He(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ko(n,t){let e=Cd[t];e===void 0&&(e=new Int32Array(t),Cd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function W2(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function X2(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;n.uniform2fv(this.addr,t),He(e,t)}}function Y2(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ve(e,t))return;n.uniform3fv(this.addr,t),He(e,t)}}function q2(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;n.uniform4fv(this.addr,t),He(e,t)}}function j2(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ve(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),He(e,t)}else{if(Ve(e,i))return;Pd.set(i),n.uniformMatrix2fv(this.addr,!1,Pd),He(e,i)}}function $2(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ve(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),He(e,t)}else{if(Ve(e,i))return;Ld.set(i),n.uniformMatrix3fv(this.addr,!1,Ld),He(e,i)}}function K2(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ve(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),He(e,t)}else{if(Ve(e,i))return;Rd.set(i),n.uniformMatrix4fv(this.addr,!1,Rd),He(e,i)}}function Z2(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function J2(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;n.uniform2iv(this.addr,t),He(e,t)}}function Q2(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;n.uniform3iv(this.addr,t),He(e,t)}}function tx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;n.uniform4iv(this.addr,t),He(e,t)}}function ex(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function nx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;n.uniform2uiv(this.addr,t),He(e,t)}}function ix(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;n.uniform3uiv(this.addr,t),He(e,t)}}function sx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;n.uniform4uiv(this.addr,t),He(e,t)}}function rx(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Ad.compareFunction=pm,r=Ad):r=wm,e.setTexture2D(t||r,s)}function ax(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Rm,s)}function ox(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Lm,s)}function cx(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Cm,s)}function lx(n){switch(n){case 5126:return W2;case 35664:return X2;case 35665:return Y2;case 35666:return q2;case 35674:return j2;case 35675:return $2;case 35676:return K2;case 5124:case 35670:return Z2;case 35667:case 35671:return J2;case 35668:case 35672:return Q2;case 35669:case 35673:return tx;case 5125:return ex;case 36294:return nx;case 36295:return ix;case 36296:return sx;case 35678:case 36198:case 36298:case 36306:case 35682:return rx;case 35679:case 36299:case 36307:return ax;case 35680:case 36300:case 36308:case 36293:return ox;case 36289:case 36303:case 36311:case 36292:return cx}}function hx(n,t){n.uniform1fv(this.addr,t)}function ux(n,t){const e=Or(t,this.size,2);n.uniform2fv(this.addr,e)}function dx(n,t){const e=Or(t,this.size,3);n.uniform3fv(this.addr,e)}function fx(n,t){const e=Or(t,this.size,4);n.uniform4fv(this.addr,e)}function px(n,t){const e=Or(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function mx(n,t){const e=Or(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function gx(n,t){const e=Or(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function _x(n,t){n.uniform1iv(this.addr,t)}function vx(n,t){n.uniform2iv(this.addr,t)}function xx(n,t){n.uniform3iv(this.addr,t)}function yx(n,t){n.uniform4iv(this.addr,t)}function Mx(n,t){n.uniform1uiv(this.addr,t)}function Sx(n,t){n.uniform2uiv(this.addr,t)}function Ex(n,t){n.uniform3uiv(this.addr,t)}function bx(n,t){n.uniform4uiv(this.addr,t)}function Tx(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Ve(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||wm,r[a])}function Ax(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Ve(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Rm,r[a])}function wx(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Ve(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Lm,r[a])}function Cx(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Ve(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Cm,r[a])}function Rx(n){switch(n){case 5126:return hx;case 35664:return ux;case 35665:return dx;case 35666:return fx;case 35674:return px;case 35675:return mx;case 35676:return gx;case 5124:case 35670:return _x;case 35667:case 35671:return vx;case 35668:case 35672:return xx;case 35669:case 35673:return yx;case 5125:return Mx;case 36294:return Sx;case 36295:return Ex;case 36296:return bx;case 35678:case 36198:case 36298:case 36306:case 35682:return Tx;case 35679:case 36299:case 36307:return Ax;case 35680:case 36300:case 36308:case 36293:return wx;case 36289:case 36303:case 36311:case 36292:return Cx}}class Lx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=lx(e.type)}}class Px{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Rx(e.type)}}class Dx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const Ec=/(\w+)(\])?(\[|\.)?/g;function Dd(n,t){n.seq.push(t),n.map[t.id]=t}function Ix(n,t,e){const i=n.name,s=i.length;for(Ec.lastIndex=0;;){const r=Ec.exec(i),a=Ec.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Dd(e,l===void 0?new Lx(o,n,t):new Px(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new Dx(o),Dd(e,u)),e=u}}}class no{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Ix(r,a,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function Id(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Fx=37297;let Ux=0;function Nx(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const Fd=new qt;function Ox(n){ne._getMatrix(Fd,ne.workingColorSpace,n);const t=`mat3( ${Fd.elements.map(e=>e.toFixed(4))} )`;switch(ne.getTransfer(n)){case Bo:return[t,"LinearTransferOETF"];case fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Ud(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Nx(n.getShaderSource(t),a)}else return s}function Bx(n,t){const e=Ox(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function kx(n,t){let e;switch(t){case kg:e="Linear";break;case zg:e="Reinhard";break;case Vg:e="Cineon";break;case em:e="ACESFilmic";break;case Gg:e="AgX";break;case Wg:e="Neutral";break;case Hg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ja=new k;function zx(){ne.getLuminanceCoefficients(ja);const n=ja.x.toFixed(4),t=ja.y.toFixed(4),e=ja.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($r).join(`
`)}function Hx(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Gx(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function $r(n){return n!==""}function Nd(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Od(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Wx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pl(n){return n.replace(Wx,Yx)}const Xx=new Map;function Yx(n,t){let e=$t[t];if(e===void 0){const i=Xx.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Pl(e)}const qx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bd(n){return n.replace(qx,jx)}function jx(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function kd(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function $x(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Qp?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===vg?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Si&&(t="SHADOWMAP_TYPE_VSM"),t}function Kx(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case _r:case vr:t="ENVMAP_TYPE_CUBE";break;case Oo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Zx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case vr:t="ENVMAP_MODE_REFRACTION";break}return t}function Jx(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case tm:t="ENVMAP_BLENDING_MULTIPLY";break;case Og:t="ENVMAP_BLENDING_MIX";break;case Bg:t="ENVMAP_BLENDING_ADD";break}return t}function Qx(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function ty(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=$x(e),l=Kx(e),h=Zx(e),u=Jx(e),d=Qx(e),f=Vx(e),g=Hx(r),v=s.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($r).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($r).join(`
`),p.length>0&&(p+=`
`)):(m=[kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($r).join(`
`),p=[kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ki?"#define TONE_MAPPING":"",e.toneMapping!==Ki?$t.tonemapping_pars_fragment:"",e.toneMapping!==Ki?kx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,Bx("linearToOutputTexel",e.outputColorSpace),zx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter($r).join(`
`)),a=Pl(a),a=Nd(a,e),a=Od(a,e),o=Pl(o),o=Nd(o,e),o=Od(o,e),a=Bd(a),o=Bd(o),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Zu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Zu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=S+m+a,_=S+p+o,w=Id(s,s.VERTEX_SHADER,x),b=Id(s,s.FRAGMENT_SHADER,_);s.attachShader(v,w),s.attachShader(v,b),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(L){if(n.debug.checkShaderErrors){const B=s.getProgramInfoLog(v).trim(),D=s.getShaderInfoLog(w).trim(),N=s.getShaderInfoLog(b).trim();let j=!0,W=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(j=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,w,b);else{const Q=Ud(s,w,"vertex"),V=Ud(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+B+`
`+Q+`
`+V)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(D===""||N==="")&&(W=!1);W&&(L.diagnostics={runnable:j,programLog:B,vertexShader:{log:D,prefix:m},fragmentShader:{log:N,prefix:p}})}s.deleteShader(w),s.deleteShader(b),R=new no(s,v),M=Gx(s,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(v,Fx)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ux++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=b,this}let ey=0;class ny{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new iy(t),e.set(t,i)),i}}class iy{constructor(t){this.id=ey++,this.code=t,this.usedTimes=0}}function sy(n,t,e,i,s,r,a){const o=new vm,c=new ny,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,y,L,B,D){const N=B.fog,j=D.geometry,W=M.isMeshStandardMaterial?B.environment:null,Q=(M.isMeshStandardMaterial?e:t).get(M.envMap||W),V=Q&&Q.mapping===Oo?Q.image.height:null,tt=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const ot=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,nt=ot!==void 0?ot.length:0;let dt=0;j.morphAttributes.position!==void 0&&(dt=1),j.morphAttributes.normal!==void 0&&(dt=2),j.morphAttributes.color!==void 0&&(dt=3);let Vt,X,Z,ct;if(tt){const Rt=oi[tt];Vt=Rt.vertexShader,X=Rt.fragmentShader}else Vt=M.vertexShader,X=M.fragmentShader,c.update(M),Z=c.getVertexShaderID(M),ct=c.getFragmentShaderID(M);const it=n.getRenderTarget(),xt=n.state.buffers.depth.getReversed(),Et=D.isInstancedMesh===!0,Ft=D.isBatchedMesh===!0,oe=!!M.map,Ht=!!M.matcap,st=!!Q,P=!!M.aoMap,Gt=!!M.lightMap,kt=!!M.bumpMap,Ut=!!M.normalMap,yt=!!M.displacementMap,It=!!M.emissiveMap,Mt=!!M.metalnessMap,C=!!M.roughnessMap,E=M.anisotropy>0,z=M.clearcoat>0,K=M.dispersion>0,et=M.iridescence>0,$=M.sheen>0,Ct=M.transmission>0,ft=E&&!!M.anisotropyMap,gt=z&&!!M.clearcoatMap,Jt=z&&!!M.clearcoatNormalMap,rt=z&&!!M.clearcoatRoughnessMap,_t=et&&!!M.iridescenceMap,Nt=et&&!!M.iridescenceThicknessMap,zt=$&&!!M.sheenColorMap,pt=$&&!!M.sheenRoughnessMap,jt=!!M.specularMap,Xt=!!M.specularColorMap,de=!!M.specularIntensityMap,F=Ct&&!!M.transmissionMap,lt=Ct&&!!M.thicknessMap,Y=!!M.gradientMap,O=!!M.alphaMap,q=M.alphaTest>0,J=!!M.alphaHash,mt=!!M.extensions;let Ot=Ki;M.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Ot=n.toneMapping);const Zt={shaderID:tt,shaderType:M.type,shaderName:M.name,vertexShader:Vt,fragmentShader:X,defines:M.defines,customVertexShaderID:Z,customFragmentShaderID:ct,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Ft,batchingColor:Ft&&D._colorsTexture!==null,instancing:Et,instancingColor:Et&&D.instanceColor!==null,instancingMorph:Et&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:it===null?n.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:Fr,alphaToCoverage:!!M.alphaToCoverage,map:oe,matcap:Ht,envMap:st,envMapMode:st&&Q.mapping,envMapCubeUVHeight:V,aoMap:P,lightMap:Gt,bumpMap:kt,normalMap:Ut,displacementMap:d&&yt,emissiveMap:It,normalMapObjectSpace:Ut&&M.normalMapType===jg,normalMapTangentSpace:Ut&&M.normalMapType===fm,metalnessMap:Mt,roughnessMap:C,anisotropy:E,anisotropyMap:ft,clearcoat:z,clearcoatMap:gt,clearcoatNormalMap:Jt,clearcoatRoughnessMap:rt,dispersion:K,iridescence:et,iridescenceMap:_t,iridescenceThicknessMap:Nt,sheen:$,sheenColorMap:zt,sheenRoughnessMap:pt,specularMap:jt,specularColorMap:Xt,specularIntensityMap:de,transmission:Ct,transmissionMap:F,thicknessMap:lt,gradientMap:Y,opaque:M.transparent===!1&&M.blending===nr&&M.alphaToCoverage===!1,alphaMap:O,alphaTest:q,alphaHash:J,combine:M.combine,mapUv:oe&&v(M.map.channel),aoMapUv:P&&v(M.aoMap.channel),lightMapUv:Gt&&v(M.lightMap.channel),bumpMapUv:kt&&v(M.bumpMap.channel),normalMapUv:Ut&&v(M.normalMap.channel),displacementMapUv:yt&&v(M.displacementMap.channel),emissiveMapUv:It&&v(M.emissiveMap.channel),metalnessMapUv:Mt&&v(M.metalnessMap.channel),roughnessMapUv:C&&v(M.roughnessMap.channel),anisotropyMapUv:ft&&v(M.anisotropyMap.channel),clearcoatMapUv:gt&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:Jt&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:_t&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:Nt&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:zt&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:pt&&v(M.sheenRoughnessMap.channel),specularMapUv:jt&&v(M.specularMap.channel),specularColorMapUv:Xt&&v(M.specularColorMap.channel),specularIntensityMapUv:de&&v(M.specularIntensityMap.channel),transmissionMapUv:F&&v(M.transmissionMap.channel),thicknessMapUv:lt&&v(M.thicknessMap.channel),alphaMapUv:O&&v(M.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Ut||E),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!j.attributes.uv&&(oe||O),fog:!!N,useFog:M.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:xt,skinning:D.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:dt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ot,decodeVideoTexture:oe&&M.map.isVideoTexture===!0&&ne.getTransfer(M.map.colorSpace)===fe,decodeVideoTextureEmissive:It&&M.emissiveMap.isVideoTexture===!0&&ne.getTransfer(M.emissiveMap.colorSpace)===fe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===dn,flipSided:M.side===pn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:mt&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&M.extensions.multiDraw===!0||Ft)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Zt.vertexUv1s=l.has(1),Zt.vertexUv2s=l.has(2),Zt.vertexUv3s=l.has(3),l.clear(),Zt}function p(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const L in M.defines)y.push(L),y.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(S(y,M),x(y,M),y.push(n.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function S(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function x(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function _(M){const y=g[M.type];let L;if(y){const B=oi[y];L=V1.clone(B.uniforms)}else L=M.uniforms;return L}function w(M,y){let L;for(let B=0,D=h.length;B<D;B++){const N=h[B];if(N.cacheKey===y){L=N,++L.usedTimes;break}}return L===void 0&&(L=new ty(n,y,M,r),h.push(L)),L}function b(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function A(M){c.remove(M)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:w,releaseProgram:b,releaseShaderCache:A,programs:h,dispose:R}}function ry(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function ay(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function zd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Vd(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,f,g,v,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function o(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||ay),i.length>1&&i.sort(d||zd),s.length>1&&s.sort(d||zd)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function oy(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new Vd,n.set(i,[a])):s>=r.length?(a=new Vd,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function cy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new k,color:new te};break;case"SpotLight":e={position:new k,direction:new k,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new k,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new k,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new k,halfWidth:new k,halfHeight:new k};break}return n[t.id]=e,e}}}function ly(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let hy=0;function uy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function dy(n){const t=new cy,e=ly(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new k);const s=new k,r=new Ee,a=new Ee;function o(l){let h=0,u=0,d=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,S=0,x=0,_=0,w=0,b=0,A=0;l.sort(uy);for(let M=0,y=l.length;M<y;M++){const L=l[M],B=L.color,D=L.intensity,N=L.distance,j=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=B.r*D,u+=B.g*D,d+=B.b*D;else if(L.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(L.sh.coefficients[W],D);A++}else if(L.isDirectionalLight){const W=t.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Q=L.shadow,V=e.get(L);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,i.directionalShadow[f]=V,i.directionalShadowMap[f]=j,i.directionalShadowMatrix[f]=L.shadow.matrix,S++}i.directional[f]=W,f++}else if(L.isSpotLight){const W=t.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(B).multiplyScalar(D),W.distance=N,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,i.spot[v]=W;const Q=L.shadow;if(L.map&&(i.spotLightMap[w]=L.map,w++,Q.updateMatrices(L),L.castShadow&&b++),i.spotLightMatrix[v]=Q.matrix,L.castShadow){const V=e.get(L);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,i.spotShadow[v]=V,i.spotShadowMap[v]=j,_++}v++}else if(L.isRectAreaLight){const W=t.get(L);W.color.copy(B).multiplyScalar(D),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=W,m++}else if(L.isPointLight){const W=t.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),W.distance=L.distance,W.decay=L.decay,L.castShadow){const Q=L.shadow,V=e.get(L);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,V.shadowCameraNear=Q.camera.near,V.shadowCameraFar=Q.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=j,i.pointShadowMatrix[g]=L.shadow.matrix,x++}i.point[g]=W,g++}else if(L.isHemisphereLight){const W=t.get(L);W.skyColor.copy(L.color).multiplyScalar(D),W.groundColor.copy(L.groundColor).multiplyScalar(D),i.hemi[p]=W,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_FLOAT_1,i.rectAreaLTC2=ht.LTC_FLOAT_2):(i.rectAreaLTC1=ht.LTC_HALF_1,i.rectAreaLTC2=ht.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const R=i.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==S||R.numPointShadows!==x||R.numSpotShadows!==_||R.numSpotMaps!==w||R.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=_+w-b,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=A,R.directionalLength=f,R.pointLength=g,R.spotLength=v,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=S,R.numPointShadows=x,R.numSpotShadows=_,R.numSpotMaps=w,R.numLightProbes=A,i.version=hy++)}function c(l,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){const x=l[p];if(x.isDirectionalLight){const _=i.directional[u];_.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(x.isSpotLight){const _=i.spot[f];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const _=i.rectArea[g];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),a.identity(),r.copy(x.matrixWorld),r.premultiply(m),a.extractRotation(r),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const _=i.point[d];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const _=i.hemi[v];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:i}}function Hd(n){const t=new dy(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function fy(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Hd(n),t.set(s,[o])):r>=a.length?(o=new Hd(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class py extends _a{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Yg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class my extends _a{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const gy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_y=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function vy(n,t,e){let i=new Nh;const s=new ae,r=new ae,a=new Ce,o=new py({depthPacking:qg}),c=new my,l={},h=e.maxTextureSize,u={[Qi]:pn,[pn]:Qi,[dn]:dn},d=new ts({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:gy,fragmentShader:_y}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new zn;g.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Xe(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qp;let p=this.type;this.render=function(b,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const M=n.getRenderTarget(),y=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),B=n.state;B.setBlending($i),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const D=p!==Si&&this.type===Si,N=p===Si&&this.type!==Si;for(let j=0,W=b.length;j<W;j++){const Q=b[j],V=Q.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const tt=V.getFrameExtents();if(s.multiply(tt),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/tt.x),s.x=r.x*tt.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/tt.y),s.y=r.y*tt.y,V.mapSize.y=r.y)),V.map===null||D===!0||N===!0){const nt=this.type!==Si?{minFilter:Qn,magFilter:Qn}:{};V.map!==null&&V.map.dispose(),V.map=new Rs(s.x,s.y,nt),V.map.texture.name=Q.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const ot=V.getViewportCount();for(let nt=0;nt<ot;nt++){const dt=V.getViewport(nt);a.set(r.x*dt.x,r.y*dt.y,r.x*dt.z,r.y*dt.w),B.viewport(a),V.updateMatrices(Q,nt),i=V.getFrustum(),_(A,R,V.camera,Q,this.type)}V.isPointLightShadow!==!0&&this.type===Si&&S(V,R),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(M,y,L)};function S(b,A){const R=t.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Rs(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(A,null,R,d,v,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(A,null,R,f,v,null)}function x(b,A,R,M){let y=null;const L=R.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(L!==void 0)y=L;else if(y=R.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const B=y.uuid,D=A.uuid;let N=l[B];N===void 0&&(N={},l[B]=N);let j=N[D];j===void 0&&(j=y.clone(),N[D]=j,A.addEventListener("dispose",w)),y=j}if(y.visible=A.visible,y.wireframe=A.wireframe,M===Si?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,R.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const B=n.properties.get(y);B.light=R}return y}function _(b,A,R,M,y){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&y===Si)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,b.matrixWorld);const D=t.update(b),N=b.material;if(Array.isArray(N)){const j=D.groups;for(let W=0,Q=j.length;W<Q;W++){const V=j[W],tt=N[V.materialIndex];if(tt&&tt.visible){const ot=x(b,tt,M,y);b.onBeforeShadow(n,b,A,R,D,ot,V),n.renderBufferDirect(R,null,D,ot,b,V),b.onAfterShadow(n,b,A,R,D,ot,V)}}}else if(N.visible){const j=x(b,N,M,y);b.onBeforeShadow(n,b,A,R,D,j,null),n.renderBufferDirect(R,null,D,j,b,null),b.onAfterShadow(n,b,A,R,D,j,null)}}const B=b.children;for(let D=0,N=B.length;D<N;D++)_(B[D],A,R,M,y)}function w(b){b.target.removeEventListener("dispose",w);for(const R in l){const M=l[R],y=b.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const xy={[qc]:jc,[$c]:Jc,[Kc]:Qc,[gr]:Zc,[jc]:qc,[Jc]:$c,[Qc]:Kc,[Zc]:gr};function yy(n,t){function e(){let F=!1;const lt=new Ce;let Y=null;const O=new Ce(0,0,0,0);return{setMask:function(q){Y!==q&&!F&&(n.colorMask(q,q,q,q),Y=q)},setLocked:function(q){F=q},setClear:function(q,J,mt,Ot,Zt){Zt===!0&&(q*=Ot,J*=Ot,mt*=Ot),lt.set(q,J,mt,Ot),O.equals(lt)===!1&&(n.clearColor(q,J,mt,Ot),O.copy(lt))},reset:function(){F=!1,Y=null,O.set(-1,0,0,0)}}}function i(){let F=!1,lt=!1,Y=null,O=null,q=null;return{setReversed:function(J){if(lt!==J){const mt=t.get("EXT_clip_control");lt?mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.ZERO_TO_ONE_EXT):mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.NEGATIVE_ONE_TO_ONE_EXT);const Ot=q;q=null,this.setClear(Ot)}lt=J},getReversed:function(){return lt},setTest:function(J){J?it(n.DEPTH_TEST):xt(n.DEPTH_TEST)},setMask:function(J){Y!==J&&!F&&(n.depthMask(J),Y=J)},setFunc:function(J){if(lt&&(J=xy[J]),O!==J){switch(J){case qc:n.depthFunc(n.NEVER);break;case jc:n.depthFunc(n.ALWAYS);break;case $c:n.depthFunc(n.LESS);break;case gr:n.depthFunc(n.LEQUAL);break;case Kc:n.depthFunc(n.EQUAL);break;case Zc:n.depthFunc(n.GEQUAL);break;case Jc:n.depthFunc(n.GREATER);break;case Qc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}O=J}},setLocked:function(J){F=J},setClear:function(J){q!==J&&(lt&&(J=1-J),n.clearDepth(J),q=J)},reset:function(){F=!1,Y=null,O=null,q=null,lt=!1}}}function s(){let F=!1,lt=null,Y=null,O=null,q=null,J=null,mt=null,Ot=null,Zt=null;return{setTest:function(Rt){F||(Rt?it(n.STENCIL_TEST):xt(n.STENCIL_TEST))},setMask:function(Rt){lt!==Rt&&!F&&(n.stencilMask(Rt),lt=Rt)},setFunc:function(Rt,Kt,ee){(Y!==Rt||O!==Kt||q!==ee)&&(n.stencilFunc(Rt,Kt,ee),Y=Rt,O=Kt,q=ee)},setOp:function(Rt,Kt,ee){(J!==Rt||mt!==Kt||Ot!==ee)&&(n.stencilOp(Rt,Kt,ee),J=Rt,mt=Kt,Ot=ee)},setLocked:function(Rt){F=Rt},setClear:function(Rt){Zt!==Rt&&(n.clearStencil(Rt),Zt=Rt)},reset:function(){F=!1,lt=null,Y=null,O=null,q=null,J=null,mt=null,Ot=null,Zt=null}}}const r=new e,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,S=null,x=null,_=null,w=null,b=null,A=new te(0,0,0),R=0,M=!1,y=null,L=null,B=null,D=null,N=null;const j=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Q=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=Q>=1):V.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=Q>=2);let tt=null,ot={};const nt=n.getParameter(n.SCISSOR_BOX),dt=n.getParameter(n.VIEWPORT),Vt=new Ce().fromArray(nt),X=new Ce().fromArray(dt);function Z(F,lt,Y,O){const q=new Uint8Array(4),J=n.createTexture();n.bindTexture(F,J),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let mt=0;mt<Y;mt++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(lt,0,n.RGBA,1,1,O,0,n.RGBA,n.UNSIGNED_BYTE,q):n.texImage2D(lt+mt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,q);return J}const ct={};ct[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),ct[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ct[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ct[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),it(n.DEPTH_TEST),a.setFunc(gr),kt(!1),Ut(Yu),it(n.CULL_FACE),P($i);function it(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function xt(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function Et(F,lt){return u[F]!==lt?(n.bindFramebuffer(F,lt),u[F]=lt,F===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=lt),F===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=lt),!0):!1}function Ft(F,lt){let Y=f,O=!1;if(F){Y=d.get(lt),Y===void 0&&(Y=[],d.set(lt,Y));const q=F.textures;if(Y.length!==q.length||Y[0]!==n.COLOR_ATTACHMENT0){for(let J=0,mt=q.length;J<mt;J++)Y[J]=n.COLOR_ATTACHMENT0+J;Y.length=q.length,O=!0}}else Y[0]!==n.BACK&&(Y[0]=n.BACK,O=!0);O&&n.drawBuffers(Y)}function oe(F){return g!==F?(n.useProgram(F),g=F,!0):!1}const Ht={[fs]:n.FUNC_ADD,[yg]:n.FUNC_SUBTRACT,[Mg]:n.FUNC_REVERSE_SUBTRACT};Ht[Sg]=n.MIN,Ht[Eg]=n.MAX;const st={[bg]:n.ZERO,[Tg]:n.ONE,[Ag]:n.SRC_COLOR,[Xc]:n.SRC_ALPHA,[Dg]:n.SRC_ALPHA_SATURATE,[Lg]:n.DST_COLOR,[Cg]:n.DST_ALPHA,[wg]:n.ONE_MINUS_SRC_COLOR,[Yc]:n.ONE_MINUS_SRC_ALPHA,[Pg]:n.ONE_MINUS_DST_COLOR,[Rg]:n.ONE_MINUS_DST_ALPHA,[Ig]:n.CONSTANT_COLOR,[Fg]:n.ONE_MINUS_CONSTANT_COLOR,[Ug]:n.CONSTANT_ALPHA,[Ng]:n.ONE_MINUS_CONSTANT_ALPHA};function P(F,lt,Y,O,q,J,mt,Ot,Zt,Rt){if(F===$i){v===!0&&(xt(n.BLEND),v=!1);return}if(v===!1&&(it(n.BLEND),v=!0),F!==xg){if(F!==m||Rt!==M){if((p!==fs||_!==fs)&&(n.blendEquation(n.FUNC_ADD),p=fs,_=fs),Rt)switch(F){case nr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qu:n.blendFunc(n.ONE,n.ONE);break;case ju:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case $u:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case nr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qu:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ju:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case $u:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}S=null,x=null,w=null,b=null,A.set(0,0,0),R=0,m=F,M=Rt}return}q=q||lt,J=J||Y,mt=mt||O,(lt!==p||q!==_)&&(n.blendEquationSeparate(Ht[lt],Ht[q]),p=lt,_=q),(Y!==S||O!==x||J!==w||mt!==b)&&(n.blendFuncSeparate(st[Y],st[O],st[J],st[mt]),S=Y,x=O,w=J,b=mt),(Ot.equals(A)===!1||Zt!==R)&&(n.blendColor(Ot.r,Ot.g,Ot.b,Zt),A.copy(Ot),R=Zt),m=F,M=!1}function Gt(F,lt){F.side===dn?xt(n.CULL_FACE):it(n.CULL_FACE);let Y=F.side===pn;lt&&(Y=!Y),kt(Y),F.blending===nr&&F.transparent===!1?P($i):P(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const O=F.stencilWrite;o.setTest(O),O&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),It(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?it(n.SAMPLE_ALPHA_TO_COVERAGE):xt(n.SAMPLE_ALPHA_TO_COVERAGE)}function kt(F){y!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),y=F)}function Ut(F){F!==gg?(it(n.CULL_FACE),F!==L&&(F===Yu?n.cullFace(n.BACK):F===_g?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):xt(n.CULL_FACE),L=F}function yt(F){F!==B&&(W&&n.lineWidth(F),B=F)}function It(F,lt,Y){F?(it(n.POLYGON_OFFSET_FILL),(D!==lt||N!==Y)&&(n.polygonOffset(lt,Y),D=lt,N=Y)):xt(n.POLYGON_OFFSET_FILL)}function Mt(F){F?it(n.SCISSOR_TEST):xt(n.SCISSOR_TEST)}function C(F){F===void 0&&(F=n.TEXTURE0+j-1),tt!==F&&(n.activeTexture(F),tt=F)}function E(F,lt,Y){Y===void 0&&(tt===null?Y=n.TEXTURE0+j-1:Y=tt);let O=ot[Y];O===void 0&&(O={type:void 0,texture:void 0},ot[Y]=O),(O.type!==F||O.texture!==lt)&&(tt!==Y&&(n.activeTexture(Y),tt=Y),n.bindTexture(F,lt||ct[F]),O.type=F,O.texture=lt)}function z(){const F=ot[tt];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function K(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function et(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function $(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ct(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ft(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function gt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Jt(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function rt(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function _t(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Nt(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function zt(F){Vt.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),Vt.copy(F))}function pt(F){X.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),X.copy(F))}function jt(F,lt){let Y=l.get(lt);Y===void 0&&(Y=new WeakMap,l.set(lt,Y));let O=Y.get(F);O===void 0&&(O=n.getUniformBlockIndex(lt,F.name),Y.set(F,O))}function Xt(F,lt){const O=l.get(lt).get(F);c.get(lt)!==O&&(n.uniformBlockBinding(lt,O,F.__bindingPointIndex),c.set(lt,O))}function de(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},tt=null,ot={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,S=null,x=null,_=null,w=null,b=null,A=new te(0,0,0),R=0,M=!1,y=null,L=null,B=null,D=null,N=null,Vt.set(0,0,n.canvas.width,n.canvas.height),X.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:it,disable:xt,bindFramebuffer:Et,drawBuffers:Ft,useProgram:oe,setBlending:P,setMaterial:Gt,setFlipSided:kt,setCullFace:Ut,setLineWidth:yt,setPolygonOffset:It,setScissorTest:Mt,activeTexture:C,bindTexture:E,unbindTexture:z,compressedTexImage2D:K,compressedTexImage3D:et,texImage2D:_t,texImage3D:Nt,updateUBOMapping:jt,uniformBlockBinding:Xt,texStorage2D:Jt,texStorage3D:rt,texSubImage2D:$,texSubImage3D:Ct,compressedTexSubImage2D:ft,compressedTexSubImage3D:gt,scissor:zt,viewport:pt,reset:de}}function Gd(n,t,e,i){const s=My(i);switch(e){case am:return n*t;case cm:return n*t;case lm:return n*t*2;case hm:return n*t/s.components*s.byteLength;case Ph:return n*t/s.components*s.byteLength;case um:return n*t*2/s.components*s.byteLength;case Dh:return n*t*2/s.components*s.byteLength;case om:return n*t*3/s.components*s.byteLength;case Zn:return n*t*4/s.components*s.byteLength;case Ih:return n*t*4/s.components*s.byteLength;case Za:case Ja:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Qa:case to:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case rl:case ol:return Math.max(n,16)*Math.max(t,8)/4;case sl:case al:return Math.max(n,8)*Math.max(t,8)/2;case cl:case ll:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case hl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ul:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case dl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case fl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case pl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case ml:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case gl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case _l:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case vl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case xl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case yl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Ml:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Sl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case El:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case bl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case eo:case Tl:case Al:return Math.ceil(n/4)*Math.ceil(t/4)*16;case dm:case wl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Cl:case Rl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function My(n){switch(n){case Ii:case im:return{byteLength:1,components:1};case ra:case sm:case ma:return{byteLength:2,components:1};case Rh:case Lh:return{byteLength:2,components:4};case Cs:case Ch:case Ti:return{byteLength:4,components:1};case rm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Sy(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ae,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,E){return f?new OffscreenCanvas(C,E):fo("canvas")}function v(C,E,z){let K=1;const et=Mt(C);if((et.width>z||et.height>z)&&(K=z/Math.max(et.width,et.height)),K<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const $=Math.floor(K*et.width),Ct=Math.floor(K*et.height);u===void 0&&(u=g($,Ct));const ft=E?g($,Ct):u;return ft.width=$,ft.height=Ct,ft.getContext("2d").drawImage(C,0,0,$,Ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+$+"x"+Ct+")."),ft}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function S(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(C,E,z,K,et=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let $=E;if(E===n.RED&&(z===n.FLOAT&&($=n.R32F),z===n.HALF_FLOAT&&($=n.R16F),z===n.UNSIGNED_BYTE&&($=n.R8)),E===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.R8UI),z===n.UNSIGNED_SHORT&&($=n.R16UI),z===n.UNSIGNED_INT&&($=n.R32UI),z===n.BYTE&&($=n.R8I),z===n.SHORT&&($=n.R16I),z===n.INT&&($=n.R32I)),E===n.RG&&(z===n.FLOAT&&($=n.RG32F),z===n.HALF_FLOAT&&($=n.RG16F),z===n.UNSIGNED_BYTE&&($=n.RG8)),E===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.RG8UI),z===n.UNSIGNED_SHORT&&($=n.RG16UI),z===n.UNSIGNED_INT&&($=n.RG32UI),z===n.BYTE&&($=n.RG8I),z===n.SHORT&&($=n.RG16I),z===n.INT&&($=n.RG32I)),E===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.RGB8UI),z===n.UNSIGNED_SHORT&&($=n.RGB16UI),z===n.UNSIGNED_INT&&($=n.RGB32UI),z===n.BYTE&&($=n.RGB8I),z===n.SHORT&&($=n.RGB16I),z===n.INT&&($=n.RGB32I)),E===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.RGBA8UI),z===n.UNSIGNED_SHORT&&($=n.RGBA16UI),z===n.UNSIGNED_INT&&($=n.RGBA32UI),z===n.BYTE&&($=n.RGBA8I),z===n.SHORT&&($=n.RGBA16I),z===n.INT&&($=n.RGBA32I)),E===n.RGB&&z===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),E===n.RGBA){const Ct=et?Bo:ne.getTransfer(K);z===n.FLOAT&&($=n.RGBA32F),z===n.HALF_FLOAT&&($=n.RGBA16F),z===n.UNSIGNED_BYTE&&($=Ct===fe?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function _(C,E){let z;return C?E===null||E===Cs||E===xr?z=n.DEPTH24_STENCIL8:E===Ti?z=n.DEPTH32F_STENCIL8:E===ra&&(z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Cs||E===xr?z=n.DEPTH_COMPONENT24:E===Ti?z=n.DEPTH_COMPONENT32F:E===ra&&(z=n.DEPTH_COMPONENT16),z}function w(C,E){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Qn&&C.minFilter!==tn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function b(C){const E=C.target;E.removeEventListener("dispose",b),R(E),E.isVideoTexture&&h.delete(E)}function A(C){const E=C.target;E.removeEventListener("dispose",A),y(E)}function R(C){const E=i.get(C);if(E.__webglInit===void 0)return;const z=C.source,K=d.get(z);if(K){const et=K[E.__cacheKey];et.usedTimes--,et.usedTimes===0&&M(C),Object.keys(K).length===0&&d.delete(z)}i.remove(C)}function M(C){const E=i.get(C);n.deleteTexture(E.__webglTexture);const z=C.source,K=d.get(z);delete K[E.__cacheKey],a.memory.textures--}function y(C){const E=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(E.__webglFramebuffer[K]))for(let et=0;et<E.__webglFramebuffer[K].length;et++)n.deleteFramebuffer(E.__webglFramebuffer[K][et]);else n.deleteFramebuffer(E.__webglFramebuffer[K]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[K])}else{if(Array.isArray(E.__webglFramebuffer))for(let K=0;K<E.__webglFramebuffer.length;K++)n.deleteFramebuffer(E.__webglFramebuffer[K]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let K=0;K<E.__webglColorRenderbuffer.length;K++)E.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[K]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const z=C.textures;for(let K=0,et=z.length;K<et;K++){const $=i.get(z[K]);$.__webglTexture&&(n.deleteTexture($.__webglTexture),a.memory.textures--),i.remove(z[K])}i.remove(C)}let L=0;function B(){L=0}function D(){const C=L;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),L+=1,C}function N(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function j(C,E){const z=i.get(C);if(C.isVideoTexture&&yt(C),C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){const K=C.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(z,C,E);return}}e.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+E)}function W(C,E){const z=i.get(C);if(C.version>0&&z.__version!==C.version){X(z,C,E);return}e.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+E)}function Q(C,E){const z=i.get(C);if(C.version>0&&z.__version!==C.version){X(z,C,E);return}e.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+E)}function V(C,E){const z=i.get(C);if(C.version>0&&z.__version!==C.version){Z(z,C,E);return}e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+E)}const tt={[nl]:n.REPEAT,[_s]:n.CLAMP_TO_EDGE,[il]:n.MIRRORED_REPEAT},ot={[Qn]:n.NEAREST,[Xg]:n.NEAREST_MIPMAP_NEAREST,[Ca]:n.NEAREST_MIPMAP_LINEAR,[tn]:n.LINEAR,[Ko]:n.LINEAR_MIPMAP_NEAREST,[vs]:n.LINEAR_MIPMAP_LINEAR},nt={[Zg]:n.NEVER,[i1]:n.ALWAYS,[Jg]:n.LESS,[pm]:n.LEQUAL,[Qg]:n.EQUAL,[n1]:n.GEQUAL,[t1]:n.GREATER,[e1]:n.NOTEQUAL};function dt(C,E){if(E.type===Ti&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===tn||E.magFilter===Ko||E.magFilter===Ca||E.magFilter===vs||E.minFilter===tn||E.minFilter===Ko||E.minFilter===Ca||E.minFilter===vs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,tt[E.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,tt[E.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,tt[E.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,ot[E.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,ot[E.minFilter]),E.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,nt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Qn||E.minFilter!==Ca&&E.minFilter!==vs||E.type===Ti&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Vt(C,E){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",b));const K=E.source;let et=d.get(K);et===void 0&&(et={},d.set(K,et));const $=N(E);if($!==C.__cacheKey){et[$]===void 0&&(et[$]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),et[$].usedTimes++;const Ct=et[C.__cacheKey];Ct!==void 0&&(et[C.__cacheKey].usedTimes--,Ct.usedTimes===0&&M(E)),C.__cacheKey=$,C.__webglTexture=et[$].texture}return z}function X(C,E,z){let K=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(K=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(K=n.TEXTURE_3D);const et=Vt(C,E),$=E.source;e.bindTexture(K,C.__webglTexture,n.TEXTURE0+z);const Ct=i.get($);if($.version!==Ct.__version||et===!0){e.activeTexture(n.TEXTURE0+z);const ft=ne.getPrimaries(ne.workingColorSpace),gt=E.colorSpace===qi?null:ne.getPrimaries(E.colorSpace),Jt=E.colorSpace===qi||ft===gt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Jt);let rt=v(E.image,!1,s.maxTextureSize);rt=It(E,rt);const _t=r.convert(E.format,E.colorSpace),Nt=r.convert(E.type);let zt=x(E.internalFormat,_t,Nt,E.colorSpace,E.isVideoTexture);dt(K,E);let pt;const jt=E.mipmaps,Xt=E.isVideoTexture!==!0,de=Ct.__version===void 0||et===!0,F=$.dataReady,lt=w(E,rt);if(E.isDepthTexture)zt=_(E.format===yr,E.type),de&&(Xt?e.texStorage2D(n.TEXTURE_2D,1,zt,rt.width,rt.height):e.texImage2D(n.TEXTURE_2D,0,zt,rt.width,rt.height,0,_t,Nt,null));else if(E.isDataTexture)if(jt.length>0){Xt&&de&&e.texStorage2D(n.TEXTURE_2D,lt,zt,jt[0].width,jt[0].height);for(let Y=0,O=jt.length;Y<O;Y++)pt=jt[Y],Xt?F&&e.texSubImage2D(n.TEXTURE_2D,Y,0,0,pt.width,pt.height,_t,Nt,pt.data):e.texImage2D(n.TEXTURE_2D,Y,zt,pt.width,pt.height,0,_t,Nt,pt.data);E.generateMipmaps=!1}else Xt?(de&&e.texStorage2D(n.TEXTURE_2D,lt,zt,rt.width,rt.height),F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,rt.width,rt.height,_t,Nt,rt.data)):e.texImage2D(n.TEXTURE_2D,0,zt,rt.width,rt.height,0,_t,Nt,rt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Xt&&de&&e.texStorage3D(n.TEXTURE_2D_ARRAY,lt,zt,jt[0].width,jt[0].height,rt.depth);for(let Y=0,O=jt.length;Y<O;Y++)if(pt=jt[Y],E.format!==Zn)if(_t!==null)if(Xt){if(F)if(E.layerUpdates.size>0){const q=Gd(pt.width,pt.height,E.format,E.type);for(const J of E.layerUpdates){const mt=pt.data.subarray(J*q/pt.data.BYTES_PER_ELEMENT,(J+1)*q/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,J,pt.width,pt.height,1,_t,mt)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,pt.width,pt.height,rt.depth,_t,pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Y,zt,pt.width,pt.height,rt.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xt?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,pt.width,pt.height,rt.depth,_t,Nt,pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Y,zt,pt.width,pt.height,rt.depth,0,_t,Nt,pt.data)}else{Xt&&de&&e.texStorage2D(n.TEXTURE_2D,lt,zt,jt[0].width,jt[0].height);for(let Y=0,O=jt.length;Y<O;Y++)pt=jt[Y],E.format!==Zn?_t!==null?Xt?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,Y,0,0,pt.width,pt.height,_t,pt.data):e.compressedTexImage2D(n.TEXTURE_2D,Y,zt,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?F&&e.texSubImage2D(n.TEXTURE_2D,Y,0,0,pt.width,pt.height,_t,Nt,pt.data):e.texImage2D(n.TEXTURE_2D,Y,zt,pt.width,pt.height,0,_t,Nt,pt.data)}else if(E.isDataArrayTexture)if(Xt){if(de&&e.texStorage3D(n.TEXTURE_2D_ARRAY,lt,zt,rt.width,rt.height,rt.depth),F)if(E.layerUpdates.size>0){const Y=Gd(rt.width,rt.height,E.format,E.type);for(const O of E.layerUpdates){const q=rt.data.subarray(O*Y/rt.data.BYTES_PER_ELEMENT,(O+1)*Y/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,O,rt.width,rt.height,1,_t,Nt,q)}E.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,_t,Nt,rt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,zt,rt.width,rt.height,rt.depth,0,_t,Nt,rt.data);else if(E.isData3DTexture)Xt?(de&&e.texStorage3D(n.TEXTURE_3D,lt,zt,rt.width,rt.height,rt.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,_t,Nt,rt.data)):e.texImage3D(n.TEXTURE_3D,0,zt,rt.width,rt.height,rt.depth,0,_t,Nt,rt.data);else if(E.isFramebufferTexture){if(de)if(Xt)e.texStorage2D(n.TEXTURE_2D,lt,zt,rt.width,rt.height);else{let Y=rt.width,O=rt.height;for(let q=0;q<lt;q++)e.texImage2D(n.TEXTURE_2D,q,zt,Y,O,0,_t,Nt,null),Y>>=1,O>>=1}}else if(jt.length>0){if(Xt&&de){const Y=Mt(jt[0]);e.texStorage2D(n.TEXTURE_2D,lt,zt,Y.width,Y.height)}for(let Y=0,O=jt.length;Y<O;Y++)pt=jt[Y],Xt?F&&e.texSubImage2D(n.TEXTURE_2D,Y,0,0,_t,Nt,pt):e.texImage2D(n.TEXTURE_2D,Y,zt,_t,Nt,pt);E.generateMipmaps=!1}else if(Xt){if(de){const Y=Mt(rt);e.texStorage2D(n.TEXTURE_2D,lt,zt,Y.width,Y.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,_t,Nt,rt)}else e.texImage2D(n.TEXTURE_2D,0,zt,_t,Nt,rt);m(E)&&p(K),Ct.__version=$.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Z(C,E,z){if(E.image.length!==6)return;const K=Vt(C,E),et=E.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+z);const $=i.get(et);if(et.version!==$.__version||K===!0){e.activeTexture(n.TEXTURE0+z);const Ct=ne.getPrimaries(ne.workingColorSpace),ft=E.colorSpace===qi?null:ne.getPrimaries(E.colorSpace),gt=E.colorSpace===qi||Ct===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const Jt=E.isCompressedTexture||E.image[0].isCompressedTexture,rt=E.image[0]&&E.image[0].isDataTexture,_t=[];for(let O=0;O<6;O++)!Jt&&!rt?_t[O]=v(E.image[O],!0,s.maxCubemapSize):_t[O]=rt?E.image[O].image:E.image[O],_t[O]=It(E,_t[O]);const Nt=_t[0],zt=r.convert(E.format,E.colorSpace),pt=r.convert(E.type),jt=x(E.internalFormat,zt,pt,E.colorSpace),Xt=E.isVideoTexture!==!0,de=$.__version===void 0||K===!0,F=et.dataReady;let lt=w(E,Nt);dt(n.TEXTURE_CUBE_MAP,E);let Y;if(Jt){Xt&&de&&e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,jt,Nt.width,Nt.height);for(let O=0;O<6;O++){Y=_t[O].mipmaps;for(let q=0;q<Y.length;q++){const J=Y[q];E.format!==Zn?zt!==null?Xt?F&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q,0,0,J.width,J.height,zt,J.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q,jt,J.width,J.height,0,J.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q,0,0,J.width,J.height,zt,pt,J.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q,jt,J.width,J.height,0,zt,pt,J.data)}}}else{if(Y=E.mipmaps,Xt&&de){Y.length>0&&lt++;const O=Mt(_t[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,jt,O.width,O.height)}for(let O=0;O<6;O++)if(rt){Xt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,0,0,_t[O].width,_t[O].height,zt,pt,_t[O].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,jt,_t[O].width,_t[O].height,0,zt,pt,_t[O].data);for(let q=0;q<Y.length;q++){const mt=Y[q].image[O].image;Xt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q+1,0,0,mt.width,mt.height,zt,pt,mt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q+1,jt,mt.width,mt.height,0,zt,pt,mt.data)}}else{Xt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,0,0,zt,pt,_t[O]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,jt,zt,pt,_t[O]);for(let q=0;q<Y.length;q++){const J=Y[q];Xt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q+1,0,0,zt,pt,J.image[O]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+O,q+1,jt,zt,pt,J.image[O])}}}m(E)&&p(n.TEXTURE_CUBE_MAP),$.__version=et.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function ct(C,E,z,K,et,$){const Ct=r.convert(z.format,z.colorSpace),ft=r.convert(z.type),gt=x(z.internalFormat,Ct,ft,z.colorSpace),Jt=i.get(E),rt=i.get(z);if(rt.__renderTarget=E,!Jt.__hasExternalTextures){const _t=Math.max(1,E.width>>$),Nt=Math.max(1,E.height>>$);et===n.TEXTURE_3D||et===n.TEXTURE_2D_ARRAY?e.texImage3D(et,$,gt,_t,Nt,E.depth,0,Ct,ft,null):e.texImage2D(et,$,gt,_t,Nt,0,Ct,ft,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Ut(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,et,rt.__webglTexture,0,kt(E)):(et===n.TEXTURE_2D||et>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,K,et,rt.__webglTexture,$),e.bindFramebuffer(n.FRAMEBUFFER,null)}function it(C,E,z){if(n.bindRenderbuffer(n.RENDERBUFFER,C),E.depthBuffer){const K=E.depthTexture,et=K&&K.isDepthTexture?K.type:null,$=_(E.stencilBuffer,et),Ct=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ft=kt(E);Ut(E)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft,$,E.width,E.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft,$,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,$,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ct,n.RENDERBUFFER,C)}else{const K=E.textures;for(let et=0;et<K.length;et++){const $=K[et],Ct=r.convert($.format,$.colorSpace),ft=r.convert($.type),gt=x($.internalFormat,Ct,ft,$.colorSpace),Jt=kt(E);z&&Ut(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Jt,gt,E.width,E.height):Ut(E)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Jt,gt,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,gt,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function xt(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(E.depthTexture);K.__renderTarget=E,(!K.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),j(E.depthTexture,0);const et=K.__webglTexture,$=kt(E);if(E.depthTexture.format===ir)Ut(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,et,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,et,0);else if(E.depthTexture.format===yr)Ut(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,et,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Et(C){const E=i.get(C),z=C.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==C.depthTexture){const K=C.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),K){const et=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,K.removeEventListener("dispose",et)};K.addEventListener("dispose",et),E.__depthDisposeCallback=et}E.__boundDepthTexture=K}if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");xt(E.__webglFramebuffer,C)}else if(z){E.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[K]),E.__webglDepthbuffer[K]===void 0)E.__webglDepthbuffer[K]=n.createRenderbuffer(),it(E.__webglDepthbuffer[K],C,!1);else{const et=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=E.__webglDepthbuffer[K];n.bindRenderbuffer(n.RENDERBUFFER,$),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,$)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),it(E.__webglDepthbuffer,C,!1);else{const K=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,et),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,et)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ft(C,E,z){const K=i.get(C);E!==void 0&&ct(K.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Et(C)}function oe(C){const E=C.texture,z=i.get(C),K=i.get(E);C.addEventListener("dispose",A);const et=C.textures,$=C.isWebGLCubeRenderTarget===!0,Ct=et.length>1;if(Ct||(K.__webglTexture===void 0&&(K.__webglTexture=n.createTexture()),K.__version=E.version,a.memory.textures++),$){z.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer[ft]=[];for(let gt=0;gt<E.mipmaps.length;gt++)z.__webglFramebuffer[ft][gt]=n.createFramebuffer()}else z.__webglFramebuffer[ft]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer=[];for(let ft=0;ft<E.mipmaps.length;ft++)z.__webglFramebuffer[ft]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(Ct)for(let ft=0,gt=et.length;ft<gt;ft++){const Jt=i.get(et[ft]);Jt.__webglTexture===void 0&&(Jt.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&Ut(C)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ft=0;ft<et.length;ft++){const gt=et[ft];z.__webglColorRenderbuffer[ft]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[ft]);const Jt=r.convert(gt.format,gt.colorSpace),rt=r.convert(gt.type),_t=x(gt.internalFormat,Jt,rt,gt.colorSpace,C.isXRRenderTarget===!0),Nt=kt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Nt,_t,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,z.__webglColorRenderbuffer[ft])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),it(z.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if($){e.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),dt(n.TEXTURE_CUBE_MAP,E);for(let ft=0;ft<6;ft++)if(E.mipmaps&&E.mipmaps.length>0)for(let gt=0;gt<E.mipmaps.length;gt++)ct(z.__webglFramebuffer[ft][gt],C,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,gt);else ct(z.__webglFramebuffer[ft],C,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);m(E)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ct){for(let ft=0,gt=et.length;ft<gt;ft++){const Jt=et[ft],rt=i.get(Jt);e.bindTexture(n.TEXTURE_2D,rt.__webglTexture),dt(n.TEXTURE_2D,Jt),ct(z.__webglFramebuffer,C,Jt,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,0),m(Jt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let ft=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ft=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ft,K.__webglTexture),dt(ft,E),E.mipmaps&&E.mipmaps.length>0)for(let gt=0;gt<E.mipmaps.length;gt++)ct(z.__webglFramebuffer[gt],C,E,n.COLOR_ATTACHMENT0,ft,gt);else ct(z.__webglFramebuffer,C,E,n.COLOR_ATTACHMENT0,ft,0);m(E)&&p(ft),e.unbindTexture()}C.depthBuffer&&Et(C)}function Ht(C){const E=C.textures;for(let z=0,K=E.length;z<K;z++){const et=E[z];if(m(et)){const $=S(C),Ct=i.get(et).__webglTexture;e.bindTexture($,Ct),p($),e.unbindTexture()}}}const st=[],P=[];function Gt(C){if(C.samples>0){if(Ut(C)===!1){const E=C.textures,z=C.width,K=C.height;let et=n.COLOR_BUFFER_BIT;const $=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ct=i.get(C),ft=E.length>1;if(ft)for(let gt=0;gt<E.length;gt++)e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ct.__webglFramebuffer);for(let gt=0;gt<E.length;gt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(et|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(et|=n.STENCIL_BUFFER_BIT)),ft){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ct.__webglColorRenderbuffer[gt]);const Jt=i.get(E[gt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Jt,0)}n.blitFramebuffer(0,0,z,K,0,0,z,K,et,n.NEAREST),c===!0&&(st.length=0,P.length=0,st.push(n.COLOR_ATTACHMENT0+gt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(st.push($),P.push($),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,P)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ft)for(let gt=0;gt<E.length;gt++){e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,Ct.__webglColorRenderbuffer[gt]);const Jt=i.get(E[gt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,Jt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const E=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function kt(C){return Math.min(s.maxSamples,C.samples)}function Ut(C){const E=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function yt(C){const E=a.render.frame;h.get(C)!==E&&(h.set(C,E),C.update())}function It(C,E){const z=C.colorSpace,K=C.format,et=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==Fr&&z!==qi&&(ne.getTransfer(z)===fe?(K!==Zn||et!==Ii)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),E}function Mt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=B,this.setTexture2D=j,this.setTexture2DArray=W,this.setTexture3D=Q,this.setTextureCube=V,this.rebindTextures=Ft,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=Ht,this.updateMultisampleRenderTarget=Gt,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=ct,this.useMultisampledRTT=Ut}function Ey(n,t){function e(i,s=qi){let r;const a=ne.getTransfer(s);if(i===Ii)return n.UNSIGNED_BYTE;if(i===Rh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Lh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===rm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===im)return n.BYTE;if(i===sm)return n.SHORT;if(i===ra)return n.UNSIGNED_SHORT;if(i===Ch)return n.INT;if(i===Cs)return n.UNSIGNED_INT;if(i===Ti)return n.FLOAT;if(i===ma)return n.HALF_FLOAT;if(i===am)return n.ALPHA;if(i===om)return n.RGB;if(i===Zn)return n.RGBA;if(i===cm)return n.LUMINANCE;if(i===lm)return n.LUMINANCE_ALPHA;if(i===ir)return n.DEPTH_COMPONENT;if(i===yr)return n.DEPTH_STENCIL;if(i===hm)return n.RED;if(i===Ph)return n.RED_INTEGER;if(i===um)return n.RG;if(i===Dh)return n.RG_INTEGER;if(i===Ih)return n.RGBA_INTEGER;if(i===Za||i===Ja||i===Qa||i===to)if(a===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Za)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===to)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Za)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Qa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===to)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sl||i===rl||i===al||i===ol)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===sl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===al)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ol)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cl||i===ll||i===hl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===cl||i===ll)return a===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===hl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ul||i===dl||i===fl||i===pl||i===ml||i===gl||i===_l||i===vl||i===xl||i===yl||i===Ml||i===Sl||i===El||i===bl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ul)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===dl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===fl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===pl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ml)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_l)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===vl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===xl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===yl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ml)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===El)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===bl)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===eo||i===Tl||i===Al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===eo)return a===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Tl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===dm||i===wl||i===Cl||i===Rl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===eo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Cl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Rl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===xr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class by extends $n{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class xs extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ty={type:"move"};class bc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,i),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ty)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new xs;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Ay=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,wy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Cy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new en,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ts({vertexShader:Ay,fragmentShader:wy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Xe(new xa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ry extends Ur{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=new Cy,m=e.getContextAttributes();let p=null,S=null;const x=[],_=[],w=new ae;let b=null;const A=new $n;A.viewport=new Ce;const R=new $n;R.viewport=new Ce;const M=[A,R],y=new by;let L=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Z=x[X];return Z===void 0&&(Z=new bc,x[X]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(X){let Z=x[X];return Z===void 0&&(Z=new bc,x[X]=Z),Z.getGripSpace()},this.getHand=function(X){let Z=x[X];return Z===void 0&&(Z=new bc,x[X]=Z),Z.getHandSpace()};function D(X){const Z=_.indexOf(X.inputSource);if(Z===-1)return;const ct=x[Z];ct!==void 0&&(ct.update(X.inputSource,X.frame,l||a),ct.dispatchEvent({type:X.type,data:X.inputSource}))}function N(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",j);for(let X=0;X<x.length;X++){const Z=_[X];Z!==null&&(_[X]=null,x[X].disconnect(Z))}L=null,B=null,v.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,S=null,Vt.stop(),i.isPresenting=!1,t.setPixelRatio(b),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",N),s.addEventListener("inputsourceschange",j),m.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(w),s.renderState.layers===void 0){const Z={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new Rs(f.framebufferWidth,f.framebufferHeight,{format:Zn,type:Ii,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Z=null,ct=null,it=null;m.depth&&(it=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=m.stencil?yr:ir,ct=m.stencil?xr:Cs);const xt={colorFormat:e.RGBA8,depthFormat:it,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(xt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),S=new Rs(d.textureWidth,d.textureHeight,{format:Zn,type:Ii,depthTexture:new Am(d.textureWidth,d.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Vt.setContext(s),Vt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function j(X){for(let Z=0;Z<X.removed.length;Z++){const ct=X.removed[Z],it=_.indexOf(ct);it>=0&&(_[it]=null,x[it].disconnect(ct))}for(let Z=0;Z<X.added.length;Z++){const ct=X.added[Z];let it=_.indexOf(ct);if(it===-1){for(let Et=0;Et<x.length;Et++)if(Et>=_.length){_.push(ct),it=Et;break}else if(_[Et]===null){_[Et]=ct,it=Et;break}if(it===-1)break}const xt=x[it];xt&&xt.connect(ct)}}const W=new k,Q=new k;function V(X,Z,ct){W.setFromMatrixPosition(Z.matrixWorld),Q.setFromMatrixPosition(ct.matrixWorld);const it=W.distanceTo(Q),xt=Z.projectionMatrix.elements,Et=ct.projectionMatrix.elements,Ft=xt[14]/(xt[10]-1),oe=xt[14]/(xt[10]+1),Ht=(xt[9]+1)/xt[5],st=(xt[9]-1)/xt[5],P=(xt[8]-1)/xt[0],Gt=(Et[8]+1)/Et[0],kt=Ft*P,Ut=Ft*Gt,yt=it/(-P+Gt),It=yt*-P;if(Z.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(It),X.translateZ(yt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),xt[10]===-1)X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Mt=Ft+yt,C=oe+yt,E=kt-It,z=Ut+(it-It),K=Ht*oe/C*Mt,et=st*oe/C*Mt;X.projectionMatrix.makePerspective(E,z,K,et,Mt,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function tt(X,Z){Z===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Z.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let Z=X.near,ct=X.far;v.texture!==null&&(v.depthNear>0&&(Z=v.depthNear),v.depthFar>0&&(ct=v.depthFar)),y.near=R.near=A.near=Z,y.far=R.far=A.far=ct,(L!==y.near||B!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),L=y.near,B=y.far),A.layers.mask=X.layers.mask|2,R.layers.mask=X.layers.mask|4,y.layers.mask=A.layers.mask|R.layers.mask;const it=X.parent,xt=y.cameras;tt(y,it);for(let Et=0;Et<xt.length;Et++)tt(xt[Et],it);xt.length===2?V(y,A,R):y.projectionMatrix.copy(A.projectionMatrix),ot(X,y,it)};function ot(X,Z,ct){ct===null?X.matrix.copy(Z.matrixWorld):(X.matrix.copy(ct.matrixWorld),X.matrix.invert(),X.matrix.multiply(Z.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=aa*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(X){c=X,d!==null&&(d.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let nt=null;function dt(X,Z){if(h=Z.getViewerPose(l||a),g=Z,h!==null){const ct=h.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let it=!1;ct.length!==y.cameras.length&&(y.cameras.length=0,it=!0);for(let Et=0;Et<ct.length;Et++){const Ft=ct[Et];let oe=null;if(f!==null)oe=f.getViewport(Ft);else{const st=u.getViewSubImage(d,Ft);oe=st.viewport,Et===0&&(t.setRenderTargetTextures(S,st.colorTexture,d.ignoreDepthValues?void 0:st.depthStencilTexture),t.setRenderTarget(S))}let Ht=M[Et];Ht===void 0&&(Ht=new $n,Ht.layers.enable(Et),Ht.viewport=new Ce,M[Et]=Ht),Ht.matrix.fromArray(Ft.transform.matrix),Ht.matrix.decompose(Ht.position,Ht.quaternion,Ht.scale),Ht.projectionMatrix.fromArray(Ft.projectionMatrix),Ht.projectionMatrixInverse.copy(Ht.projectionMatrix).invert(),Ht.viewport.set(oe.x,oe.y,oe.width,oe.height),Et===0&&(y.matrix.copy(Ht.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),it===!0&&y.cameras.push(Ht)}const xt=s.enabledFeatures;if(xt&&xt.includes("depth-sensing")){const Et=u.getDepthInformation(ct[0]);Et&&Et.isValid&&Et.texture&&v.init(t,Et,s.renderState)}}for(let ct=0;ct<x.length;ct++){const it=_[ct],xt=x[ct];it!==null&&xt!==void 0&&xt.update(it,Z,l||a)}nt&&nt(X,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Vt=new Tm;Vt.setAnimationLoop(dt),this.setAnimationLoop=function(X){nt=X},this.dispose=function(){}}}const cs=new mn,Ly=new Ee;function Py(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Sm(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,x,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,S,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===pn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===pn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),x=S.envMap,_=S.envMapRotation;x&&(m.envMap.value=x,cs.copy(_),cs.x*=-1,cs.y*=-1,cs.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(cs.y*=-1,cs.z*=-1),m.envMapRotation.value.setFromMatrix4(Ly.makeRotationFromEuler(cs)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===pn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Dy(n,t,e,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,x){const _=x.program;i.uniformBlockBinding(S,_)}function l(S,x){let _=s[S.id];_===void 0&&(g(S),_=h(S),s[S.id]=_,S.addEventListener("dispose",m));const w=x.program;i.updateUBOMapping(S,w);const b=t.render.frame;r[S.id]!==b&&(d(S),r[S.id]=b)}function h(S){const x=u();S.__bindingPointIndex=x;const _=n.createBuffer(),w=S.__size,b=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,w,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,_),_}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const x=s[S.id],_=S.uniforms,w=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let b=0,A=_.length;b<A;b++){const R=Array.isArray(_[b])?_[b]:[_[b]];for(let M=0,y=R.length;M<y;M++){const L=R[M];if(f(L,b,M,w)===!0){const B=L.__offset,D=Array.isArray(L.value)?L.value:[L.value];let N=0;for(let j=0;j<D.length;j++){const W=D[j],Q=v(W);typeof W=="number"||typeof W=="boolean"?(L.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,B+N,L.__data)):W.isMatrix3?(L.__data[0]=W.elements[0],L.__data[1]=W.elements[1],L.__data[2]=W.elements[2],L.__data[3]=0,L.__data[4]=W.elements[3],L.__data[5]=W.elements[4],L.__data[6]=W.elements[5],L.__data[7]=0,L.__data[8]=W.elements[6],L.__data[9]=W.elements[7],L.__data[10]=W.elements[8],L.__data[11]=0):(W.toArray(L.__data,N),N+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(S,x,_,w){const b=S.value,A=x+"_"+_;if(w[A]===void 0)return typeof b=="number"||typeof b=="boolean"?w[A]=b:w[A]=b.clone(),!0;{const R=w[A];if(typeof b=="number"||typeof b=="boolean"){if(R!==b)return w[A]=b,!0}else if(R.equals(b)===!1)return R.copy(b),!0}return!1}function g(S){const x=S.uniforms;let _=0;const w=16;for(let A=0,R=x.length;A<R;A++){const M=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,L=M.length;y<L;y++){const B=M[y],D=Array.isArray(B.value)?B.value:[B.value];for(let N=0,j=D.length;N<j;N++){const W=D[N],Q=v(W),V=_%w,tt=V%Q.boundary,ot=V+tt;_+=tt,ot!==0&&w-ot<Q.storage&&(_+=w-ot),B.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=_,_+=Q.storage}}}const b=_%w;return b>0&&(_+=w-b),S.__size=_,S.__cache={},this}function v(S){const x={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(x.boundary=4,x.storage=4):S.isVector2?(x.boundary=8,x.storage=8):S.isVector3||S.isColor?(x.boundary=16,x.storage=12):S.isVector4?(x.boundary=16,x.storage=16):S.isMatrix3?(x.boundary=48,x.storage=48):S.isMatrix4?(x.boundary=64,x.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),x}function m(S){const x=S.target;x.removeEventListener("dispose",m);const _=a.indexOf(x.__bindingPointIndex);a.splice(_,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const S in s)n.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class Iy{constructor(t={}){const{canvas:e=y1(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const S=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=un,this.toneMapping=Ki,this.toneMappingExposure=1;const _=this;let w=!1,b=0,A=0,R=null,M=-1,y=null;const L=new Ce,B=new Ce;let D=null;const N=new te(0);let j=0,W=e.width,Q=e.height,V=1,tt=null,ot=null;const nt=new Ce(0,0,W,Q),dt=new Ce(0,0,W,Q);let Vt=!1;const X=new Nh;let Z=!1,ct=!1;const it=new Ee,xt=new Ee,Et=new k,Ft=new Ce,oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ht=!1;function st(){return R===null?V:1}let P=i;function Gt(T,I){return e.getContext(T,I)}try{const T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${wh}`),e.addEventListener("webglcontextlost",O,!1),e.addEventListener("webglcontextrestored",q,!1),e.addEventListener("webglcontextcreationerror",J,!1),P===null){const I="webgl2";if(P=Gt(I,T),P===null)throw Gt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let kt,Ut,yt,It,Mt,C,E,z,K,et,$,Ct,ft,gt,Jt,rt,_t,Nt,zt,pt,jt,Xt,de,F;function lt(){kt=new B2(P),kt.init(),Xt=new Ey(P,kt),Ut=new D2(P,kt,t,Xt),yt=new yy(P,kt),Ut.reverseDepthBuffer&&d&&yt.buffers.depth.setReversed(!0),It=new V2(P),Mt=new ry,C=new Sy(P,kt,yt,Mt,Ut,Xt,It),E=new F2(_),z=new O2(_),K=new j1(P),de=new L2(P,K),et=new k2(P,K,It,de),$=new G2(P,et,K,It),zt=new H2(P,Ut,C),rt=new I2(Mt),Ct=new sy(_,E,z,kt,Ut,de,rt),ft=new Py(_,Mt),gt=new oy,Jt=new fy(kt),Nt=new R2(_,E,z,yt,$,f,c),_t=new vy(_,$,Ut),F=new Dy(P,It,Ut,yt),pt=new P2(P,kt,It),jt=new z2(P,kt,It),It.programs=Ct.programs,_.capabilities=Ut,_.extensions=kt,_.properties=Mt,_.renderLists=gt,_.shadowMap=_t,_.state=yt,_.info=It}lt();const Y=new Ry(_,P);this.xr=Y,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const T=kt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=kt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(T){T!==void 0&&(V=T,this.setSize(W,Q,!1))},this.getSize=function(T){return T.set(W,Q)},this.setSize=function(T,I,H=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=T,Q=I,e.width=Math.floor(T*V),e.height=Math.floor(I*V),H===!0&&(e.style.width=T+"px",e.style.height=I+"px"),this.setViewport(0,0,T,I)},this.getDrawingBufferSize=function(T){return T.set(W*V,Q*V).floor()},this.setDrawingBufferSize=function(T,I,H){W=T,Q=I,V=H,e.width=Math.floor(T*H),e.height=Math.floor(I*H),this.setViewport(0,0,T,I)},this.getCurrentViewport=function(T){return T.copy(L)},this.getViewport=function(T){return T.copy(nt)},this.setViewport=function(T,I,H,G){T.isVector4?nt.set(T.x,T.y,T.z,T.w):nt.set(T,I,H,G),yt.viewport(L.copy(nt).multiplyScalar(V).round())},this.getScissor=function(T){return T.copy(dt)},this.setScissor=function(T,I,H,G){T.isVector4?dt.set(T.x,T.y,T.z,T.w):dt.set(T,I,H,G),yt.scissor(B.copy(dt).multiplyScalar(V).round())},this.getScissorTest=function(){return Vt},this.setScissorTest=function(T){yt.setScissorTest(Vt=T)},this.setOpaqueSort=function(T){tt=T},this.setTransparentSort=function(T){ot=T},this.getClearColor=function(T){return T.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor.apply(Nt,arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha.apply(Nt,arguments)},this.clear=function(T=!0,I=!0,H=!0){let G=0;if(T){let U=!1;if(R!==null){const at=R.texture.format;U=at===Ih||at===Dh||at===Ph}if(U){const at=R.texture.type,ut=at===Ii||at===Cs||at===ra||at===xr||at===Rh||at===Lh,St=Nt.getClearColor(),bt=Nt.getClearAlpha(),Wt=St.r,Yt=St.g,Tt=St.b;ut?(g[0]=Wt,g[1]=Yt,g[2]=Tt,g[3]=bt,P.clearBufferuiv(P.COLOR,0,g)):(v[0]=Wt,v[1]=Yt,v[2]=Tt,v[3]=bt,P.clearBufferiv(P.COLOR,0,v))}else G|=P.COLOR_BUFFER_BIT}I&&(G|=P.DEPTH_BUFFER_BIT),H&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",O,!1),e.removeEventListener("webglcontextrestored",q,!1),e.removeEventListener("webglcontextcreationerror",J,!1),gt.dispose(),Jt.dispose(),Mt.dispose(),E.dispose(),z.dispose(),$.dispose(),de.dispose(),F.dispose(),Ct.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",ge),Y.removeEventListener("sessionend",ii),_n.stop()};function O(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function q(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const T=It.autoReset,I=_t.enabled,H=_t.autoUpdate,G=_t.needsUpdate,U=_t.type;lt(),It.autoReset=T,_t.enabled=I,_t.autoUpdate=H,_t.needsUpdate=G,_t.type=U}function J(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function mt(T){const I=T.target;I.removeEventListener("dispose",mt),Ot(I)}function Ot(T){Zt(T),Mt.remove(T)}function Zt(T){const I=Mt.get(T).programs;I!==void 0&&(I.forEach(function(H){Ct.releaseProgram(H)}),T.isShaderMaterial&&Ct.releaseShaderCache(T))}this.renderBufferDirect=function(T,I,H,G,U,at){I===null&&(I=oe);const ut=U.isMesh&&U.matrixWorld.determinant()<0,St=De(T,I,H,G,U);yt.setMaterial(G,ut);let bt=H.index,Wt=1;if(G.wireframe===!0){if(bt=et.getWireframeAttribute(H),bt===void 0)return;Wt=2}const Yt=H.drawRange,Tt=H.attributes.position;let se=Yt.start*Wt,_e=(Yt.start+Yt.count)*Wt;at!==null&&(se=Math.max(se,at.start*Wt),_e=Math.min(_e,(at.start+at.count)*Wt)),bt!==null?(se=Math.max(se,0),_e=Math.min(_e,bt.count)):Tt!=null&&(se=Math.max(se,0),_e=Math.min(_e,Tt.count));const ve=_e-se;if(ve<0||ve===1/0)return;de.setup(U,G,St,H,bt);let ln,le=pt;if(bt!==null&&(ln=K.get(bt),le=jt,le.setIndex(ln)),U.isMesh)G.wireframe===!0?(yt.setLineWidth(G.wireframeLinewidth*st()),le.setMode(P.LINES)):le.setMode(P.TRIANGLES);else if(U.isLine){let Pt=G.linewidth;Pt===void 0&&(Pt=1),yt.setLineWidth(Pt*st()),U.isLineSegments?le.setMode(P.LINES):U.isLineLoop?le.setMode(P.LINE_LOOP):le.setMode(P.LINE_STRIP)}else U.isPoints?le.setMode(P.POINTS):U.isSprite&&le.setMode(P.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)le.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(kt.get("WEBGL_multi_draw"))le.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Pt=U._multiDrawStarts,gi=U._multiDrawCounts,he=U._multiDrawCount,Wn=bt?K.get(bt).bytesPerElement:1,Us=Mt.get(G).currentProgram.getUniforms();for(let vn=0;vn<he;vn++)Us.setValue(P,"_gl_DrawID",vn),le.render(Pt[vn]/Wn,gi[vn])}else if(U.isInstancedMesh)le.renderInstances(se,ve,U.count);else if(H.isInstancedBufferGeometry){const Pt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,gi=Math.min(H.instanceCount,Pt);le.renderInstances(se,ve,gi)}else le.render(se,ve)};function Rt(T,I,H){T.transparent===!0&&T.side===dn&&T.forceSinglePass===!1?(T.side=pn,T.needsUpdate=!0,Fs(T,I,H),T.side=Qi,T.needsUpdate=!0,Fs(T,I,H),T.side=dn):Fs(T,I,H)}this.compile=function(T,I,H=null){H===null&&(H=T),p=Jt.get(H),p.init(I),x.push(p),H.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),T!==H&&T.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const G=new Set;return T.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const at=U.material;if(at)if(Array.isArray(at))for(let ut=0;ut<at.length;ut++){const St=at[ut];Rt(St,H,U),G.add(St)}else Rt(at,H,U),G.add(at)}),x.pop(),p=null,G},this.compileAsync=function(T,I,H=null){const G=this.compile(T,I,H);return new Promise(U=>{function at(){if(G.forEach(function(ut){Mt.get(ut).currentProgram.isReady()&&G.delete(ut)}),G.size===0){U(T);return}setTimeout(at,10)}kt.get("KHR_parallel_shader_compile")!==null?at():setTimeout(at,10)})};let Kt=null;function ee(T){Kt&&Kt(T)}function ge(){_n.stop()}function ii(){_n.start()}const _n=new Tm;_n.setAnimationLoop(ee),typeof self<"u"&&_n.setContext(self),this.setAnimationLoop=function(T){Kt=T,Y.setAnimationLoop(T),T===null?_n.stop():_n.start()},Y.addEventListener("sessionstart",ge),Y.addEventListener("sessionend",ii),this.render=function(T,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(I),I=Y.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,I,R),p=Jt.get(T,x.length),p.init(I),x.push(p),xt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),X.setFromProjectionMatrix(xt),ct=this.localClippingEnabled,Z=rt.init(this.clippingPlanes,ct),m=gt.get(T,S.length),m.init(),S.push(m),Y.enabled===!0&&Y.isPresenting===!0){const at=_.xr.getDepthSensingMesh();at!==null&&cn(at,I,-1/0,_.sortObjects)}cn(T,I,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(tt,ot),Ht=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Ht&&Nt.addToRenderList(m,T),this.info.render.frame++,Z===!0&&rt.beginShadows();const H=p.state.shadowsArray;_t.render(H,T,I),Z===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,U=m.transmissive;if(p.setupLights(),I.isArrayCamera){const at=I.cameras;if(U.length>0)for(let ut=0,St=at.length;ut<St;ut++){const bt=at[ut];Gn(G,U,T,bt)}Ht&&Nt.render(T);for(let ut=0,St=at.length;ut<St;ut++){const bt=at[ut];Br(m,T,bt,bt.viewport)}}else U.length>0&&Gn(G,U,T,I),Ht&&Nt.render(T),Br(m,T,I);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(_,T,I),de.resetDefaultState(),M=-1,y=null,x.pop(),x.length>0?(p=x[x.length-1],Z===!0&&rt.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function cn(T,I,H,G){if(T.visible===!1)return;if(T.layers.test(I.layers)){if(T.isGroup)H=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(I);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||X.intersectsSprite(T)){G&&Ft.setFromMatrixPosition(T.matrixWorld).applyMatrix4(xt);const ut=$.update(T),St=T.material;St.visible&&m.push(T,ut,St,H,Ft.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||X.intersectsObject(T))){const ut=$.update(T),St=T.material;if(G&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ft.copy(T.boundingSphere.center)):(ut.boundingSphere===null&&ut.computeBoundingSphere(),Ft.copy(ut.boundingSphere.center)),Ft.applyMatrix4(T.matrixWorld).applyMatrix4(xt)),Array.isArray(St)){const bt=ut.groups;for(let Wt=0,Yt=bt.length;Wt<Yt;Wt++){const Tt=bt[Wt],se=St[Tt.materialIndex];se&&se.visible&&m.push(T,ut,se,H,Ft.z,Tt)}}else St.visible&&m.push(T,ut,St,H,Ft.z,null)}}const at=T.children;for(let ut=0,St=at.length;ut<St;ut++)cn(at[ut],I,H,G)}function Br(T,I,H,G){const U=T.opaque,at=T.transmissive,ut=T.transparent;p.setupLightsView(H),Z===!0&&rt.setGlobalState(_.clippingPlanes,H),G&&yt.viewport(L.copy(G)),U.length>0&&Is(U,I,H),at.length>0&&Is(at,I,H),ut.length>0&&Is(ut,I,H),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function Gn(T,I,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[G.id]===void 0&&(p.state.transmissionRenderTarget[G.id]=new Rs(1,1,{generateMipmaps:!0,type:kt.has("EXT_color_buffer_half_float")||kt.has("EXT_color_buffer_float")?ma:Ii,minFilter:vs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ne.workingColorSpace}));const at=p.state.transmissionRenderTarget[G.id],ut=G.viewport||L;at.setSize(ut.z,ut.w);const St=_.getRenderTarget();_.setRenderTarget(at),_.getClearColor(N),j=_.getClearAlpha(),j<1&&_.setClearColor(16777215,.5),_.clear(),Ht&&Nt.render(H);const bt=_.toneMapping;_.toneMapping=Ki;const Wt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),p.setupLightsView(G),Z===!0&&rt.setGlobalState(_.clippingPlanes,G),Is(T,H,G),C.updateMultisampleRenderTarget(at),C.updateRenderTargetMipmap(at),kt.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let Tt=0,se=I.length;Tt<se;Tt++){const _e=I[Tt],ve=_e.object,ln=_e.geometry,le=_e.material,Pt=_e.group;if(le.side===dn&&ve.layers.test(G.layers)){const gi=le.side;le.side=pn,le.needsUpdate=!0,ya(ve,H,G,ln,le,Pt),le.side=gi,le.needsUpdate=!0,Yt=!0}}Yt===!0&&(C.updateMultisampleRenderTarget(at),C.updateRenderTargetMipmap(at))}_.setRenderTarget(St),_.setClearColor(N,j),Wt!==void 0&&(G.viewport=Wt),_.toneMapping=bt}function Is(T,I,H){const G=I.isScene===!0?I.overrideMaterial:null;for(let U=0,at=T.length;U<at;U++){const ut=T[U],St=ut.object,bt=ut.geometry,Wt=G===null?ut.material:G,Yt=ut.group;St.layers.test(H.layers)&&ya(St,I,H,bt,Wt,Yt)}}function ya(T,I,H,G,U,at){T.onBeforeRender(_,I,H,G,U,at),T.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),U.onBeforeRender(_,I,H,G,T,at),U.transparent===!0&&U.side===dn&&U.forceSinglePass===!1?(U.side=pn,U.needsUpdate=!0,_.renderBufferDirect(H,I,G,U,T,at),U.side=Qi,U.needsUpdate=!0,_.renderBufferDirect(H,I,G,U,T,at),U.side=dn):_.renderBufferDirect(H,I,G,U,T,at),T.onAfterRender(_,I,H,G,U,at)}function Fs(T,I,H){I.isScene!==!0&&(I=oe);const G=Mt.get(T),U=p.state.lights,at=p.state.shadowsArray,ut=U.state.version,St=Ct.getParameters(T,U.state,at,I,H),bt=Ct.getProgramCacheKey(St);let Wt=G.programs;G.environment=T.isMeshStandardMaterial?I.environment:null,G.fog=I.fog,G.envMap=(T.isMeshStandardMaterial?z:E).get(T.envMap||G.environment),G.envMapRotation=G.environment!==null&&T.envMap===null?I.environmentRotation:T.envMapRotation,Wt===void 0&&(T.addEventListener("dispose",mt),Wt=new Map,G.programs=Wt);let Yt=Wt.get(bt);if(Yt!==void 0){if(G.currentProgram===Yt&&G.lightsStateVersion===ut)return zo(T,St),Yt}else St.uniforms=Ct.getUniforms(T),T.onBeforeCompile(St,_),Yt=Ct.acquireProgram(St,bt),Wt.set(bt,Yt),G.uniforms=St.uniforms;const Tt=G.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Tt.clippingPlanes=rt.uniform),zo(T,St),G.needsLights=je(T),G.lightsStateVersion=ut,G.needsLights&&(Tt.ambientLightColor.value=U.state.ambient,Tt.lightProbe.value=U.state.probe,Tt.directionalLights.value=U.state.directional,Tt.directionalLightShadows.value=U.state.directionalShadow,Tt.spotLights.value=U.state.spot,Tt.spotLightShadows.value=U.state.spotShadow,Tt.rectAreaLights.value=U.state.rectArea,Tt.ltc_1.value=U.state.rectAreaLTC1,Tt.ltc_2.value=U.state.rectAreaLTC2,Tt.pointLights.value=U.state.point,Tt.pointLightShadows.value=U.state.pointShadow,Tt.hemisphereLights.value=U.state.hemi,Tt.directionalShadowMap.value=U.state.directionalShadowMap,Tt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Tt.spotShadowMap.value=U.state.spotShadowMap,Tt.spotLightMatrix.value=U.state.spotLightMatrix,Tt.spotLightMap.value=U.state.spotLightMap,Tt.pointShadowMap.value=U.state.pointShadowMap,Tt.pointShadowMatrix.value=U.state.pointShadowMatrix),G.currentProgram=Yt,G.uniformsList=null,Yt}function Ma(T){if(T.uniformsList===null){const I=T.currentProgram.getUniforms();T.uniformsList=no.seqWithValue(I.seq,T.uniforms)}return T.uniformsList}function zo(T,I){const H=Mt.get(T);H.outputColorSpace=I.outputColorSpace,H.batching=I.batching,H.batchingColor=I.batchingColor,H.instancing=I.instancing,H.instancingColor=I.instancingColor,H.instancingMorph=I.instancingMorph,H.skinning=I.skinning,H.morphTargets=I.morphTargets,H.morphNormals=I.morphNormals,H.morphColors=I.morphColors,H.morphTargetsCount=I.morphTargetsCount,H.numClippingPlanes=I.numClippingPlanes,H.numIntersection=I.numClipIntersection,H.vertexAlphas=I.vertexAlphas,H.vertexTangents=I.vertexTangents,H.toneMapping=I.toneMapping}function De(T,I,H,G,U){I.isScene!==!0&&(I=oe),C.resetTextureUnits();const at=I.fog,ut=G.isMeshStandardMaterial?I.environment:null,St=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Fr,bt=(G.isMeshStandardMaterial?z:E).get(G.envMap||ut),Wt=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Yt=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Tt=!!H.morphAttributes.position,se=!!H.morphAttributes.normal,_e=!!H.morphAttributes.color;let ve=Ki;G.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(ve=_.toneMapping);const ln=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,le=ln!==void 0?ln.length:0,Pt=Mt.get(G),gi=p.state.lights;if(Z===!0&&(ct===!0||T!==y)){const In=T===y&&G.id===M;rt.setState(G,T,In)}let he=!1;G.version===Pt.__version?(Pt.needsLights&&Pt.lightsStateVersion!==gi.state.version||Pt.outputColorSpace!==St||U.isBatchedMesh&&Pt.batching===!1||!U.isBatchedMesh&&Pt.batching===!0||U.isBatchedMesh&&Pt.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Pt.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Pt.instancing===!1||!U.isInstancedMesh&&Pt.instancing===!0||U.isSkinnedMesh&&Pt.skinning===!1||!U.isSkinnedMesh&&Pt.skinning===!0||U.isInstancedMesh&&Pt.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Pt.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Pt.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Pt.instancingMorph===!1&&U.morphTexture!==null||Pt.envMap!==bt||G.fog===!0&&Pt.fog!==at||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==rt.numPlanes||Pt.numIntersection!==rt.numIntersection)||Pt.vertexAlphas!==Wt||Pt.vertexTangents!==Yt||Pt.morphTargets!==Tt||Pt.morphNormals!==se||Pt.morphColors!==_e||Pt.toneMapping!==ve||Pt.morphTargetsCount!==le)&&(he=!0):(he=!0,Pt.__version=G.version);let Wn=Pt.currentProgram;he===!0&&(Wn=Fs(G,I,U));let Us=!1,vn=!1,kr=!1;const xe=Wn.getUniforms(),si=Pt.uniforms;if(yt.useProgram(Wn.program)&&(Us=!0,vn=!0,kr=!0),G.id!==M&&(M=G.id,vn=!0),Us||y!==T){yt.buffers.depth.getReversed()?(it.copy(T.projectionMatrix),S1(it),E1(it),xe.setValue(P,"projectionMatrix",it)):xe.setValue(P,"projectionMatrix",T.projectionMatrix),xe.setValue(P,"viewMatrix",T.matrixWorldInverse);const Fi=xe.map.cameraPosition;Fi!==void 0&&Fi.setValue(P,Et.setFromMatrixPosition(T.matrixWorld)),Ut.logarithmicDepthBuffer&&xe.setValue(P,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&xe.setValue(P,"isOrthographic",T.isOrthographicCamera===!0),y!==T&&(y=T,vn=!0,kr=!0)}if(U.isSkinnedMesh){xe.setOptional(P,U,"bindMatrix"),xe.setOptional(P,U,"bindMatrixInverse");const In=U.skeleton;In&&(In.boneTexture===null&&In.computeBoneTexture(),xe.setValue(P,"boneTexture",In.boneTexture,C))}U.isBatchedMesh&&(xe.setOptional(P,U,"batchingTexture"),xe.setValue(P,"batchingTexture",U._matricesTexture,C),xe.setOptional(P,U,"batchingIdTexture"),xe.setValue(P,"batchingIdTexture",U._indirectTexture,C),xe.setOptional(P,U,"batchingColorTexture"),U._colorsTexture!==null&&xe.setValue(P,"batchingColorTexture",U._colorsTexture,C));const zr=H.morphAttributes;if((zr.position!==void 0||zr.normal!==void 0||zr.color!==void 0)&&zt.update(U,H,Wn),(vn||Pt.receiveShadow!==U.receiveShadow)&&(Pt.receiveShadow=U.receiveShadow,xe.setValue(P,"receiveShadow",U.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(si.envMap.value=bt,si.flipEnvMap.value=bt.isCubeTexture&&bt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&I.environment!==null&&(si.envMapIntensity.value=I.environmentIntensity),vn&&(xe.setValue(P,"toneMappingExposure",_.toneMappingExposure),Pt.needsLights&&Le(si,kr),at&&G.fog===!0&&ft.refreshFogUniforms(si,at),ft.refreshMaterialUniforms(si,G,V,Q,p.state.transmissionRenderTarget[T.id]),no.upload(P,Ma(Pt),si,C)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(no.upload(P,Ma(Pt),si,C),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&xe.setValue(P,"center",U.center),xe.setValue(P,"modelViewMatrix",U.modelViewMatrix),xe.setValue(P,"normalMatrix",U.normalMatrix),xe.setValue(P,"modelMatrix",U.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const In=G.uniformsGroups;for(let Fi=0,Ui=In.length;Fi<Ui;Fi++){const Hh=In[Fi];F.update(Hh,Wn),F.bind(Hh,Wn)}}return Wn}function Le(T,I){T.ambientLightColor.needsUpdate=I,T.lightProbe.needsUpdate=I,T.directionalLights.needsUpdate=I,T.directionalLightShadows.needsUpdate=I,T.pointLights.needsUpdate=I,T.pointLightShadows.needsUpdate=I,T.spotLights.needsUpdate=I,T.spotLightShadows.needsUpdate=I,T.rectAreaLights.needsUpdate=I,T.hemisphereLights.needsUpdate=I}function je(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,I,H){Mt.get(T.texture).__webglTexture=I,Mt.get(T.depthTexture).__webglTexture=H;const G=Mt.get(T);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=H===void 0,G.__autoAllocateDepthBuffer||kt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,I){const H=Mt.get(T);H.__webglFramebuffer=I,H.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(T,I=0,H=0){R=T,b=I,A=H;let G=!0,U=null,at=!1,ut=!1;if(T){const bt=Mt.get(T);if(bt.__useDefaultFramebuffer!==void 0)yt.bindFramebuffer(P.FRAMEBUFFER,null),G=!1;else if(bt.__webglFramebuffer===void 0)C.setupRenderTarget(T);else if(bt.__hasExternalTextures)C.rebindTextures(T,Mt.get(T.texture).__webglTexture,Mt.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Tt=T.depthTexture;if(bt.__boundDepthTexture!==Tt){if(Tt!==null&&Mt.has(Tt)&&(T.width!==Tt.image.width||T.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(T)}}const Wt=T.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(ut=!0);const Yt=Mt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Yt[I])?U=Yt[I][H]:U=Yt[I],at=!0):T.samples>0&&C.useMultisampledRTT(T)===!1?U=Mt.get(T).__webglMultisampledFramebuffer:Array.isArray(Yt)?U=Yt[H]:U=Yt,L.copy(T.viewport),B.copy(T.scissor),D=T.scissorTest}else L.copy(nt).multiplyScalar(V).floor(),B.copy(dt).multiplyScalar(V).floor(),D=Vt;if(yt.bindFramebuffer(P.FRAMEBUFFER,U)&&G&&yt.drawBuffers(T,U),yt.viewport(L),yt.scissor(B),yt.setScissorTest(D),at){const bt=Mt.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+I,bt.__webglTexture,H)}else if(ut){const bt=Mt.get(T.texture),Wt=I||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,bt.__webglTexture,H||0,Wt)}M=-1},this.readRenderTargetPixels=function(T,I,H,G,U,at,ut){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=Mt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ut!==void 0&&(St=St[ut]),St){yt.bindFramebuffer(P.FRAMEBUFFER,St);try{const bt=T.texture,Wt=bt.format,Yt=bt.type;if(!Ut.textureFormatReadable(Wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ut.textureTypeReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=T.width-G&&H>=0&&H<=T.height-U&&P.readPixels(I,H,G,U,Xt.convert(Wt),Xt.convert(Yt),at)}finally{const bt=R!==null?Mt.get(R).__webglFramebuffer:null;yt.bindFramebuffer(P.FRAMEBUFFER,bt)}}},this.readRenderTargetPixelsAsync=async function(T,I,H,G,U,at,ut){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=Mt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ut!==void 0&&(St=St[ut]),St){const bt=T.texture,Wt=bt.format,Yt=bt.type;if(!Ut.textureFormatReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ut.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=T.width-G&&H>=0&&H<=T.height-U){yt.bindFramebuffer(P.FRAMEBUFFER,St);const Tt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Tt),P.bufferData(P.PIXEL_PACK_BUFFER,at.byteLength,P.STREAM_READ),P.readPixels(I,H,G,U,Xt.convert(Wt),Xt.convert(Yt),0);const se=R!==null?Mt.get(R).__webglFramebuffer:null;yt.bindFramebuffer(P.FRAMEBUFFER,se);const _e=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await M1(P,_e,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Tt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,at),P.deleteBuffer(Tt),P.deleteSync(_e),at}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,I=null,H=0){T.isTexture!==!0&&(jr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,T=arguments[1]);const G=Math.pow(2,-H),U=Math.floor(T.image.width*G),at=Math.floor(T.image.height*G),ut=I!==null?I.x:0,St=I!==null?I.y:0;C.setTexture2D(T,0),P.copyTexSubImage2D(P.TEXTURE_2D,H,0,0,ut,St,U,at),yt.unbindTexture()},this.copyTextureToTexture=function(T,I,H=null,G=null,U=0){T.isTexture!==!0&&(jr("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,T=arguments[1],I=arguments[2],U=arguments[3]||0,H=null);let at,ut,St,bt,Wt,Yt,Tt,se,_e;const ve=T.isCompressedTexture?T.mipmaps[U]:T.image;H!==null?(at=H.max.x-H.min.x,ut=H.max.y-H.min.y,St=H.isBox3?H.max.z-H.min.z:1,bt=H.min.x,Wt=H.min.y,Yt=H.isBox3?H.min.z:0):(at=ve.width,ut=ve.height,St=ve.depth||1,bt=0,Wt=0,Yt=0),G!==null?(Tt=G.x,se=G.y,_e=G.z):(Tt=0,se=0,_e=0);const ln=Xt.convert(I.format),le=Xt.convert(I.type);let Pt;I.isData3DTexture?(C.setTexture3D(I,0),Pt=P.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(C.setTexture2DArray(I,0),Pt=P.TEXTURE_2D_ARRAY):(C.setTexture2D(I,0),Pt=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,I.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,I.unpackAlignment);const gi=P.getParameter(P.UNPACK_ROW_LENGTH),he=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Wn=P.getParameter(P.UNPACK_SKIP_PIXELS),Us=P.getParameter(P.UNPACK_SKIP_ROWS),vn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ve.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ve.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,bt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Wt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Yt);const kr=T.isDataArrayTexture||T.isData3DTexture,xe=I.isDataArrayTexture||I.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const si=Mt.get(T),zr=Mt.get(I),In=Mt.get(si.__renderTarget),Fi=Mt.get(zr.__renderTarget);yt.bindFramebuffer(P.READ_FRAMEBUFFER,In.__webglFramebuffer),yt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Fi.__webglFramebuffer);for(let Ui=0;Ui<St;Ui++)kr&&P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Mt.get(T).__webglTexture,U,Yt+Ui),T.isDepthTexture?(xe&&P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Mt.get(I).__webglTexture,U,_e+Ui),P.blitFramebuffer(bt,Wt,at,ut,Tt,se,at,ut,P.DEPTH_BUFFER_BIT,P.NEAREST)):xe?P.copyTexSubImage3D(Pt,U,Tt,se,_e+Ui,bt,Wt,at,ut):P.copyTexSubImage2D(Pt,U,Tt,se,_e+Ui,bt,Wt,at,ut);yt.bindFramebuffer(P.READ_FRAMEBUFFER,null),yt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else xe?T.isDataTexture||T.isData3DTexture?P.texSubImage3D(Pt,U,Tt,se,_e,at,ut,St,ln,le,ve.data):I.isCompressedArrayTexture?P.compressedTexSubImage3D(Pt,U,Tt,se,_e,at,ut,St,ln,ve.data):P.texSubImage3D(Pt,U,Tt,se,_e,at,ut,St,ln,le,ve):T.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,U,Tt,se,at,ut,ln,le,ve.data):T.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,U,Tt,se,ve.width,ve.height,ln,ve.data):P.texSubImage2D(P.TEXTURE_2D,U,Tt,se,at,ut,ln,le,ve);P.pixelStorei(P.UNPACK_ROW_LENGTH,gi),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,he),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Wn),P.pixelStorei(P.UNPACK_SKIP_ROWS,Us),P.pixelStorei(P.UNPACK_SKIP_IMAGES,vn),U===0&&I.generateMipmaps&&P.generateMipmap(Pt),yt.unbindTexture()},this.copyTextureToTexture3D=function(T,I,H=null,G=null,U=0){return T.isTexture!==!0&&(jr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,G=arguments[1]||null,T=arguments[2],I=arguments[3],U=arguments[4]||0),jr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,I,H,G,U)},this.initRenderTarget=function(T){Mt.get(T).__webglFramebuffer===void 0&&C.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?C.setTextureCube(T,0):T.isData3DTexture?C.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?C.setTexture2DArray(T,0):C.setTexture2D(T,0),yt.unbindTexture()},this.resetState=function(){b=0,A=0,R=null,yt.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ne._getDrawingBufferColorSpace(t),e.unpackColorSpace=ne._getUnpackColorSpace()}}class Fy extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Uy extends en{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isVideoTexture=!0,this.minFilter=a!==void 0?a:tn,this.magFilter=r!==void 0?r:tn,this.generateMipmaps=!1;const h=this;function u(){h.needsUpdate=!0,t.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in t&&t.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class Ny extends en{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class kh extends zn{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new k,h=new ae;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new wn(a,3)),this.setAttribute("normal",new wn(o,3)),this.setAttribute("uv",new wn(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kh(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class zh extends zn{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new k,d=new k,f=[],g=[],v=[],m=[];for(let p=0;p<=i;p++){const S=[],x=p/i;let _=0;p===0&&a===0?_=.5/e:p===i&&c===Math.PI&&(_=-.5/e);for(let w=0;w<=e;w++){const b=w/e;u.x=-t*Math.cos(s+b*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+b*r)*Math.sin(a+x*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(b+_,1-x),S.push(l++)}h.push(S)}for(let p=0;p<i;p++)for(let S=0;S<e;S++){const x=h[p][S+1],_=h[p][S],w=h[p+1][S],b=h[p+1][S+1];(p!==0||a>0)&&f.push(x,_,b),(p!==i-1||c<Math.PI)&&f.push(_,w,b)}this.setIndex(f),this.setAttribute("position",new wn(g,3)),this.setAttribute("normal",new wn(v,3)),this.setAttribute("uv",new wn(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zh(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class io extends _a{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fm,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Oy extends io{static get type(){return"MeshPhysicalMaterial"}constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ae(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Pm extends nn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const Tc=new Ee,Wd=new k,Xd=new k;class By{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.map=null,this.mapPass=null,this.matrix=new Ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Nh,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new Ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Wd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wd),Xd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Xd),e.updateMatrixWorld(),Tc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Tc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Tc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class ky extends By{constructor(){super(new Oh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ac extends Pm{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new ky}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class zy extends Pm{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wh);class Yd{constructor(t,e=0){this.y=e,this.s=e,this.setAlpha(t),this.initialized=!1}setAlpha(t){(t<=0||t>1)&&(t=.5),this.alpha=t}filter(t){let e;return this.initialized?e=this.alpha*t+(1-this.alpha)*this.s:(e=t,this.initialized=!0),this.y=t,this.s=e,e}lastValue(){return this.s}reset(){this.initialized=!1}}class Ei{constructor(t=60,e=1,i=.007,s=1){this.freq=t,this.minCutoff=e,this.beta=i,this.dCutoff=s,this.x=new Yd(this.alpha(e)),this.dx=new Yd(this.alpha(s)),this.lastTime=null}alpha(t){const e=1/this.freq;return 1/(1+1/(2*Math.PI*t)/e)}filter(t,e=null){if(this.lastTime!==null&&e!==null){const o=(e-this.lastTime)/1e3;o>0&&(this.freq=1/o)}this.lastTime=e;const i=this.x.lastValue(),s=this.x.initialized?(t-i)*this.freq:0,r=this.dx.filter(s),a=this.minCutoff+this.beta*Math.abs(r);return this.x.setAlpha(this.alpha(a)),this.x.filter(t)}reset(){this.x.reset(),this.dx.reset(),this.lastTime=null}}class Vy{constructor(t=478,e=1.2,i=.01){this.size=t,this.minCutoff=e,this.beta=i,this.filters=[],this.init(t)}init(t){this.size=t,this.filters=Array.from({length:t},()=>({x:new Ei(60,this.minCutoff,this.beta),y:new Ei(60,this.minCutoff,this.beta),z:new Ei(60,this.minCutoff,this.beta)}))}filterLandmarks(t,e){return!t||t.length===0?t:(this.filters.length!==t.length&&this.init(t.length),t.map((i,s)=>{const r=this.filters[s];return{x:r.x.filter(i.x,e),y:r.y.filter(i.y,e),z:i.z!==void 0?r.z.filter(i.z,e):0,visibility:i.visibility}}))}reset(){this.filters.forEach(t=>{t.x.reset(),t.y.reset(),t.z.reset()})}}const qd=[0,11,12,13,14,15,16,17,37,38,39,40,41,61,72,73,74,76,77,78,80,81,82,84,85,86,87,88,91,95,146,178,179,180,181,185,191,267,268,269,270,271,291,302,303,304,306,307,308,310,311,312,314,315,316,317,318,321,324,375,402,403,404,405,409,415,164,165,167,2,152,377,148,400,176,175,171,199,200];class Hy{constructor(t={}){this.faceLandmarker=null,this.isReady=!1,this.useSmoothing=t.smoothing!==!1,this.landmarkFilter=new Vy(478,1,.035),this.pitchFilter=new Ei(60,1,.02),this.yawFilter=new Ei(60,1,.02),this.rollFilter=new Ei(60,1,.02),this.posXFilter=new Ei(60,1,.02),this.posYFilter=new Ei(60,1,.02),this.posZFilter=new Ei(60,1,.02),this.matrixHelper=new Ee,this.eulerHelper=new mn(0,0,0,"YXZ"),this.positionHelper=new k,this.quaternionHelper=new Ci,this.scaleHelper=new k,this.lastVideoTime=-1,this.inferenceLatencyMs=0,this.irisSmoothed=new Array(10).fill(null),this.mouthSmoothed=new Map}async init(t=null){const i=typeof window<"u"?window.location.origin:"",s=i?`${i}/wasm`:"/wasm",r="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",a=i?`${i}/models/face_landmarker.task`:"/models/face_landmarker.task",o="https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",c=(l,h,u)=>Promise.race([l,new Promise((d,f)=>setTimeout(()=>f(new Error(`${u} timed out after ${h}ms`)),h))]);try{t&&t("Loading MediaPipe Vision WASM binaries...");let l=null;try{l=await c(ds.forVisionTasks(s),6e3,"Local WASM load")}catch(u){console.warn("Local WASM failed, falling back to CDN:",u),t&&t("Loading MediaPipe Vision WASM binaries (CDN fallback)..."),l=await c(ds.forVisionTasks(r),2e4,"CDN WASM binary load")}t&&t("Loading Face Landmarker neural model...");const h=async u=>{try{return await c(ue.createFromOptions(l,{baseOptions:{modelAssetPath:u,delegate:"GPU"},outputFaceBlendshapes:!0,outputFacialTransformationMatrixes:!0,runningMode:"VIDEO",numFaces:1}),1e4,"GPU model initialization")}catch(d){return console.warn("GPU delegate failed or timed out, trying CPU delegate:",d),t&&t("Loading neural model (CPU fallback)..."),await c(ue.createFromOptions(l,{baseOptions:{modelAssetPath:u,delegate:"CPU"},outputFaceBlendshapes:!0,outputFacialTransformationMatrixes:!0,runningMode:"VIDEO",numFaces:1}),2e4,"CPU model initialization")}};try{this.faceLandmarker=await h(a)}catch(u){console.warn("Local model initialization failed, falling back to CDN model:",u),t&&t("Loading neural model (CDN fallback)..."),this.faceLandmarker=await h(o)}return this.isReady=!0,t&&t("Ready"),!0}catch(l){throw console.error("Fatal error loading FaceLandmarker:",l),l}}setSmoothing(t){this.useSmoothing=t,t||(this.landmarkFilter.reset(),this.pitchFilter.reset(),this.yawFilter.reset(),this.rollFilter.reset(),this.posXFilter.reset(),this.posYFilter.reset(),this.posZFilter.reset(),this.irisSmoothed.fill(null),this.mouthSmoothed.clear())}processVideoFrame(t,e){if(!this.isReady||!this.faceLandmarker||!t||t.readyState<2)return null;if(t.currentTime===this.lastVideoTime)return this.lastTrackingResult?{...this.lastTrackingResult,isNewFrame:!1,timestamp:e}:null;this.lastVideoTime=t.currentTime;const i=performance.now();this.lastInferenceTime=Math.max(e,(this.lastInferenceTime||0)+1);let s;try{s=this.faceLandmarker.detectForVideo(t,this.lastInferenceTime)}catch(a){return console.warn("FaceLandmarker detectForVideo error:",a),null}this.inferenceLatencyMs=performance.now()-i;const r=this._formatTrackingResult(s,e);return r.isNewFrame=!0,this.lastTrackingResult=r,r}processExternalFrame(t,e=0){if(!this.isReady||!this.faceLandmarker||!t)return null;const i=performance.now();this.lastInferenceTime=Math.max(e,(this.lastInferenceTime||0)+1);let s;try{s=this.faceLandmarker.detectForVideo(t,this.lastInferenceTime)}catch(r){return console.warn("External frame FaceLandmarker error:",r),null}return this.inferenceLatencyMs=performance.now()-i,this._formatTrackingResult(s,e)}_formatTrackingResult(t,e){var c,l;if(!t||!t.faceLandmarks||t.faceLandmarks.length===0)return{detected:!1,latencyMs:this.inferenceLatencyMs};const i=t.faceLandmarks[0];let s=i;if(s.length>=478){const h=s.slice();for(let u=468;u<478;u++){const d=s[u],f=u-468,g=this.irisSmoothed[f];if(!g)this.irisSmoothed[f]={x:d.x,y:d.y,z:d.z||0};else{const m=Math.hypot(d.x-g.x,d.y-g.y)<.003?.35:.92;g.x+=(d.x-g.x)*m,g.y+=(d.y-g.y)*m,g.z+=((d.z||0)-g.z)*m}h[u]={x:this.irisSmoothed[f].x,y:this.irisSmoothed[f].y,z:this.irisSmoothed[f].z,visibility:d.visibility}}s=h}if(this.useSmoothing&&s.length>=468){const h=s===i?s.slice():s;for(let u=0;u<qd.length;u++){const d=qd[u],f=h[d];if(!f)continue;const g=this.mouthSmoothed.get(d);if(!g)this.mouthSmoothed.set(d,{x:f.x,y:f.y,z:f.z||0});else{const m=Math.hypot(f.x-g.x,f.y-g.y)<.003?.35:.96;g.x+=(f.x-g.x)*m,g.y+=(f.y-g.y)*m,g.z+=((f.z||0)-g.z)*m,h[d]={x:g.x,y:g.y,z:g.z,visibility:f.visibility}}}s=h}const r={},a=((l=(c=t.faceBlendshapes)==null?void 0:c[0])==null?void 0:l.categories)||[];for(let h=0;h<a.length;h++){const u=a[h];r[u.categoryName]=u.score}let o={pitch:0,yaw:0,roll:0,x:0,y:0,z:0,matrix:null};if(t.facialTransformationMatrixes&&t.facialTransformationMatrixes.length>0){const h=t.facialTransformationMatrixes[0].data||t.facialTransformationMatrixes[0];this.matrixHelper.fromArray(h),this.matrixHelper.decompose(this.positionHelper,this.quaternionHelper,this.scaleHelper),this.eulerHelper.setFromQuaternion(this.quaternionHelper,"YXZ");let u=Bn.radToDeg(this.eulerHelper.x),d=Bn.radToDeg(this.eulerHelper.y),f=Bn.radToDeg(this.eulerHelper.z),g=this.positionHelper.x,v=this.positionHelper.y,m=this.positionHelper.z;this.useSmoothing&&(u=this.pitchFilter.filter(u,e),d=this.yawFilter.filter(d,e),f=this.rollFilter.filter(f,e),g=this.posXFilter.filter(g,e),v=this.posYFilter.filter(v,e),m=this.posZFilter.filter(m,e)),o={pitch:u,yaw:d,roll:f,x:g,y:v,z:m,matrix:h}}return{detected:!0,timestamp:e,latencyMs:this.inferenceLatencyMs,landmarks:s,rawLandmarks:i,blendshapes:r,headPose:o}}}function Gy(n){if(!n||n.length===0)return[];if(n.length%3===0){let s=!0;const r=Math.min(n.length,30);for(let a=0;a<r;a+=3){const o=n[a],c=n[a+1],l=n[a+2];if(!o||!c||!l||o.end!==c.start||c.end!==l.start||l.end!==o.start){s=!1;break}}if(s){const a=[];for(let o=0;o<n.length;o+=3){const c=n[o].start,l=n[o+1].start,h=n[o+2].start;c<468&&l<468&&h<468&&a.push([c,l,h])}return a}}const t=new Map;for(let s=0;s<n.length;s++){const{start:r,end:a}=n[s];t.has(r)||t.set(r,new Set),t.get(r).add(a)}const e=[],i=new Set;for(let s=0;s<n.length;s++){const r=n[s].start,a=n[s].end,o=t.get(a);o&&o.forEach(c=>{const l=t.get(c);if(l&&l.has(r)){const h=[r,a,c].sort((u,d)=>u-d).join("_");i.has(h)||(i.add(h),r<468&&a<468&&c<468&&e.push([r,a,c]))}})}return e}class Wy{constructor(t,e=null){this.canvas=t,this.videoElement=e,this.isMirrored=!0,this.showWebcam=!0,this.isFaceTextureEnabled=!0,this.textureContrast=1,this.textureSaturation=.95,this.textureUniforms={uContrast:{value:this.textureContrast},uSaturation:{value:this.textureSaturation}},this.isTextureFrozen=!1,this.freezeCanvas=null,this.freezeTexture=null,this.lastLiveLandmarks=null,this.frozenLandmarks=null,this.lastHeadPose=null,this.dpr=Math.min(window.devicePixelRatio||1,2),this.canvasWidth=t.clientWidth||1280,this.canvasHeight=t.clientHeight||720,this.renderer=new Iy({canvas:this.canvas,alpha:!0,antialias:!0,stencil:!0,preserveDrawingBuffer:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(this.dpr),this.renderer.setSize(this.canvasWidth,this.canvasHeight,!1),this.renderer.autoClear=!0,this.renderer.autoClearColor=!0,this.renderer.autoClearDepth=!0,this.renderer.autoClearStencil=!0,this.renderer.toneMapping=em,this.renderer.toneMappingExposure=1.15,this.scene=new Fy,this.cameraOffset={x:0,y:0,pitch:0,yaw:0,roll:0,zoom:1},this.camera=new Oh(-this.canvasWidth/2,this.canvasWidth/2,this.canvasHeight/2,-this.canvasHeight/2,-3e3,3e3),this.scene.add(this.camera),this.updateCameraTransform(),this.setupStudioLighting(),this.videoElement&&this.setupVideoTexture(),this.tesselation=ue.FACE_LANDMARKS_TESSELATION||[],this.rightEye=ue.FACE_LANDMARKS_RIGHT_EYE||[],this.leftEye=ue.FACE_LANDMARKS_LEFT_EYE||[],this.rightIris=ue.FACE_LANDMARKS_RIGHT_IRIS||[],this.leftIris=ue.FACE_LANDMARKS_LEFT_IRIS||[],this.faceOval=ue.FACE_LANDMARKS_FACE_OVAL||[{start:10,end:338},{start:338,end:297},{start:297,end:332},{start:332,end:284},{start:284,end:251},{start:251,end:389},{start:389,end:356},{start:356,end:454},{start:454,end:323},{start:323,end:361},{start:361,end:288},{start:288,end:397},{start:397,end:365},{start:365,end:379},{start:379,end:378},{start:378,end:400},{start:400,end:377},{start:377,end:152},{start:152,end:148},{start:148,end:176},{start:176,end:149},{start:149,end:150},{start:150,end:136},{start:136,end:172},{start:172,end:58},{start:58,end:132},{start:132,end:93},{start:93,end:234},{start:234,end:127},{start:127,end:162},{start:162,end:21},{start:21,end:54},{start:54,end:103},{start:103,end:67},{start:67,end:109},{start:109,end:10}],this.triangles=Gy(this.tesselation),this.setupMeshes(),this.setupEyes(),this.setupMouth()}setupVideoTexture(){this.videoElement&&(this.videoTexture=new Uy(this.videoElement),this.videoTexture.colorSpace=un,this.videoTexture.generateMipmaps=!1,this.videoTexture.minFilter=tn,this.videoTexture.magFilter=tn)}setVideoElement(t){this.videoElement=t,t&&(this.videoTexture||this.setupVideoTexture(),this.textureMaterial&&(this.textureMaterial.map=this.videoTexture,this.textureMaterial.needsUpdate=!0),this.webcamPlaneMaterial&&!this.webcamPlaneMaterial.map&&(this.webcamPlaneMaterial.map=this.videoTexture,this.webcamPlaneMaterial.needsUpdate=!0),this.updateVideoElementTransform())}setupStudioLighting(){this.ambientLight=new zy(16777215,1.15),this.scene.add(this.ambientLight),this.keyLight=new Ac(16777215,1.6),this.keyLight.position.set(-280,420,550),this.scene.add(this.keyLight),this.fillLight=new Ac(16777215,.85),this.fillLight.position.set(320,-120,380),this.scene.add(this.fillLight),this.rimLight=new Ac(16777215,.55),this.rimLight.position.set(0,550,180),this.scene.add(this.rimLight)}buildFeatherWeights(){const t=new Float32Array(this.numVertices);t.fill(1);const e=this.faceOval||[],i=new Set;if(e.forEach(o=>{o.start<468&&i.add(o.start),o.end<468&&i.add(o.end)}),i.size===0)return t;const s=new Map;(this.tesselation||[]).forEach(({start:o,end:c})=>{o<468&&c<468&&(s.has(o)||s.set(o,new Set),s.has(c)||s.set(c,new Set),s.get(o).add(c),s.get(c).add(o))});const r=new Map;i.forEach(o=>r.set(o,0));const a=[...i];for(;a.length>0;){const o=a.shift(),c=r.get(o),l=s.get(o);if(l)for(const h of l)r.has(h)||(r.set(h,c+1),a.push(h))}for(let o=0;o<468;o++){const c=r.has(o)?r.get(o):10;c===0?t[o]=0:c===1?t[o]=.35:c===2?t[o]=.7:c===3?t[o]=.92:t[o]=1}return t}setupMeshes(){this.numVertices=478,this.positions=new Float32Array(this.numVertices*3),this.posAttribute=new fn(this.positions,3),this.posAttribute.setUsage(Zo),this.uvs=new Float32Array(this.numVertices*2);for(let e=0;e<this.numVertices;e++)this.uvs[e*2]=.5,this.uvs[e*2+1]=.5;this.uvAttribute=new fn(this.uvs,2),this.uvAttribute.setUsage(Zo),this.featherAlphas=this.buildFeatherWeights(),this.featherAttribute=new fn(this.featherAlphas,1),this.geometry=new zn,this.geometry.setAttribute("position",this.posAttribute),this.geometry.setAttribute("uv",this.uvAttribute),this.geometry.setAttribute("featherAlpha",this.featherAttribute);const t=[];for(let e=0;e<this.triangles.length;e++){const[i,s,r]=this.triangles[e];i<468&&s<468&&r<468&&t.push(i,s,r)}this.geometry.setIndex(t),this.maskMaterial=new Oy({color:16119287,roughness:.38,metalness:.02,clearcoat:.2,clearcoatRoughness:.35,side:dn,transparent:!0,depthTest:!0,depthWrite:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.maskMaterial.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float featherAlpha;
varying float vFeatherAlpha;`),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vFeatherAlpha = featherAlpha;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying float vFeatherAlpha;`),e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a *= vFeatherAlpha;
if (gl_FragColor.a < 0.005) discard;`)},this.textureMaterial=new io({map:this.videoTexture||null,color:16777215,roughness:.82,metalness:0,side:dn,transparent:!0,depthTest:!0,depthWrite:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.textureMaterial.onBeforeCompile=e=>{e.uniforms.uContrast=this.textureUniforms.uContrast,e.uniforms.uSaturation=this.textureUniforms.uSaturation,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float featherAlpha;
varying float vFeatherAlpha;`),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vFeatherAlpha = featherAlpha;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uContrast;
uniform float uSaturation;
varying float vFeatherAlpha;`),e.fragmentShader=e.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
#ifdef USE_MAP
  // Rec. 709 luminance weights
  float texLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  // Saturation adjustment (mix with grayscale luminance)
  diffuseColor.rgb = mix(vec3(texLuma), diffuseColor.rgb, uSaturation);
  // Contrast adjustment (scale around midpoint 0.5)
  diffuseColor.rgb = (diffuseColor.rgb - vec3(0.5)) * uContrast + vec3(0.5);
#endif`),e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a *= vFeatherAlpha;
if (gl_FragColor.a < 0.005) discard;`)},this.webcamBackgroundGroup=new xs,this.webcamBackgroundGroup.renderOrder=-10,this.webcamBackgroundGroup.visible=!1,this.webcamPlaneDepthSpacing=140,this.webcamPlaneEuler=new mn(0,0,0,"YXZ"),this.webcamPlaneQuat=new Ci,this.webcamPlaneGeo=new xa(1,1),this.webcamPlaneMaterial=new Xi({map:this.freezeTexture||this.videoTexture||null,side:dn,depthTest:!1,depthWrite:!1,transparent:!0}),this.webcamPlane=new Xe(this.webcamPlaneGeo,this.webcamPlaneMaterial),this.webcamPlane.renderOrder=-10,this.webcamBackgroundGroup.add(this.webcamPlane),this.scene.add(this.webcamBackgroundGroup),this.maskMesh=new Xe(this.geometry,this.maskMaterial),this.maskMesh.renderOrder=10,this.scene.add(this.maskMesh)}setupMouth(){this.mouthRimIndices=[78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];const t=this.mouthRimIndices.length,e=t*2+1;this.mouthPositions=new Float32Array(e*3),this.mouthPosAttribute=new fn(this.mouthPositions,3),this.mouthPosAttribute.setUsage(Zo);const i=[];for(let r=0;r<t;r++){const a=(r+1)%t,o=r,c=a,l=t+r,h=t+a;i.push(o,l,h),i.push(o,h,c)}const s=t*2;for(let r=0;r<t;r++){const a=(r+1)%t,o=t+r,c=t+a;i.push(o,s,c)}this.mouthGeometry=new zn,this.mouthGeometry.setAttribute("position",this.mouthPosAttribute),this.mouthGeometry.setIndex(i),this.mouthMaterial=new Xi({color:0,transparent:!0,opacity:.5,side:dn,depthTest:!0,depthWrite:!1}),this.mouthMesh=new Xe(this.mouthGeometry,this.mouthMaterial),this.mouthMesh.renderOrder=8,this.scene.add(this.mouthMesh)}updateOralCavity(t,e,i){if(!this.mouthMesh||!this.mouthMesh.visible||!this.mouthRimIndices)return;const s=this.mouthRimIndices.length;let r=0,a=0,o=0;for(let x=0;x<s;x++){const _=this.mouthRimIndices[x],w=this.positions[_*3]||0,b=this.positions[_*3+1]||0,A=this.positions[_*3+2]||0;this.mouthPositions[x*3]=w,this.mouthPositions[x*3+1]=b,this.mouthPositions[x*3+2]=A,r+=w,a+=b,o+=A}const c=r/s,l=a/s,h=o/s,u=this.positions[40]||l,d=this.positions[43]||l,f=Math.abs(u-d),g=this.positions[234]||c,v=this.positions[308*3]||c,m=Math.abs(v-g),p=Math.max(t*.045,Math.min(t*.14,m*.55+f*1.2));for(let x=0;x<s;x++){const _=this.mouthPositions[x*3],w=this.mouthPositions[x*3+1],A=x<=10?1:-1,R=s+x;this.mouthPositions[R*3]=c+(_-c)*.85,this.mouthPositions[R*3+1]=w+A*(f*.25+t*.006),this.mouthPositions[R*3+2]=h-p*.52}const S=s*2;this.mouthPositions[S*3]=c,this.mouthPositions[S*3+1]=l-f*.12,this.mouthPositions[S*3+2]=h-p*1.05,this.mouthPosAttribute.needsUpdate=!0,this.mouthGeometry.computeVertexNormals()}setupEyes(){this.eyeGroup=new xs,this.eyeGroup.renderOrder=0,this.scene.add(this.eyeGroup);const t=[33,7,163,144,145,153,154,155,133],e=[33,246,161,160,159,158,157,173,133],i=[263,249,390,373,374,380,381,382,362],s=[263,466,388,387,386,385,384,398,362],r=[];for(let h=0;h<t.length-1;h++)r.push(e[h],t[h],t[h+1]),r.push(e[h],t[h+1],e[h+1]);for(let h=0;h<i.length-1;h++)r.push(s[h],i[h],i[h+1]),r.push(s[h],i[h+1],s[h+1]);this.eyeApertureGeometry=new zn,this.eyeApertureGeometry.setAttribute("position",this.posAttribute),this.eyeApertureGeometry.setIndex(r),this.eyeApertureMaterial=new Xi({side:dn,depthTest:!1,depthWrite:!1,colorWrite:!1,stencilWrite:!0,stencilWriteMask:255,stencilRef:1,stencilFunc:Ll,stencilFuncMask:255,stencilZPass:$g,stencilFail:jn,stencilZFail:jn}),this.eyeApertureMesh=new Xe(this.eyeApertureGeometry,this.eyeApertureMaterial),this.eyeApertureMesh.renderOrder=1,this.eyeApertureMesh.frustumCulled=!1,this.scene.add(this.eyeApertureMesh);const a={stencilWrite:!0,stencilWriteMask:0,stencilRef:1,stencilFunc:Kg,stencilFuncMask:255,stencilFail:jn,stencilZFail:jn,stencilZPass:jn};this.scleraMaterial=new io({color:16053752,roughness:.25,metalness:.02,transparent:!0,depthTest:!1,depthWrite:!1,...a}),this.limbalMaterial=new Xi({color:790034,transparent:!0,depthTest:!1,depthWrite:!1,...a}),this.irisMaterial=new io({color:1974308,roughness:.38,metalness:.04,transparent:!0,depthTest:!1,depthWrite:!1,...a}),this.pupilMaterial=new Xi({color:131588,transparent:!0,depthTest:!1,depthWrite:!1,...a}),this.glintMaterial=new Xi({color:16777215,transparent:!0,opacity:.95,depthTest:!1,depthWrite:!1,...a});const o=new zh(1,32,24),c=new kh(1,32),l=()=>{const h=new xs;h.frustumCulled=!1;const u=new Xe(o,this.scleraMaterial);u.renderOrder=2,u.frustumCulled=!1,h.add(u);const d=new Xe(c,this.limbalMaterial);d.renderOrder=3,d.frustumCulled=!1,h.add(d);const f=new Xe(c,this.irisMaterial);f.renderOrder=4,f.frustumCulled=!1,h.add(f);const g=new Xe(c,this.pupilMaterial);g.renderOrder=5,g.frustumCulled=!1,h.add(g);const v=new Xe(c,this.glintMaterial);return v.renderOrder=6,v.frustumCulled=!1,h.add(v),{rig:h,sclera:u,limbal:d,iris:f,pupil:g,glint:v}};this.leftEyeRig=l(),this.eyeGroup.add(this.leftEyeRig.rig),this.rightEyeRig=l(),this.eyeGroup.add(this.rightEyeRig.rig),this.eyeGroup.frustumCulled=!1,this.updateVisibility()}setCameraOffset(t={}){t.x!==void 0&&(this.cameraOffset.x=Number(t.x)||0),t.y!==void 0&&(this.cameraOffset.y=Number(t.y)||0),t.pitch!==void 0&&(this.cameraOffset.pitch=Number(t.pitch)||0),t.yaw!==void 0&&(this.cameraOffset.yaw=Number(t.yaw)||0),t.roll!==void 0&&(this.cameraOffset.roll=Number(t.roll)||0),t.zoom!==void 0&&(this.cameraOffset.zoom=Math.max(.1,Number(t.zoom)||1)),this.updateCameraTransform()}getCameraOffset(){return{...this.cameraOffset}}resetCameraOffset(){return this.cameraOffset={x:0,y:0,pitch:0,yaw:0,roll:0,zoom:1},this.updateCameraTransform(),{...this.cameraOffset}}updateCameraTransform(){if(!this.camera)return;const{x:t,y:e,pitch:i,yaw:s,roll:r,zoom:a}=this.cameraOffset;this.camera.zoom=Math.max(.1,a||1),this.camera.updateProjectionMatrix();const o=1e3,c=-t,l=-e,h=0,u=new mn(Bn.degToRad(-i),Bn.degToRad(-s),Bn.degToRad(r),"YXZ"),d=new Ci().setFromEuler(u),f=new k(c,l,h),g=new k(0,0,o).applyQuaternion(d),v=new k(0,1,0).applyQuaternion(d);this.camera.position.copy(f).add(g),this.camera.up.copy(v),this.camera.lookAt(f),this.camera.updateMatrixWorld(),this.updateVideoElementTransform()}updateVideoElementTransform(){if(!this.videoElement)return;const{x:t,y:e,pitch:i,yaw:s,roll:r,zoom:a}=this.cameraOffset,o=this.isMirrored?-1:1,c=Number(t)||0,l=-(Number(e)||0),h=Math.max(.1,Number(a)||1),u=-(Number(i)||0),d=Number(s)||0,f=Number(r)||0;this.videoElement.style.transformOrigin="center center",this.videoElement.style.transform=`translate3d(${c}px, ${l}px, 0px) scale(${h}) rotateX(${u}deg) rotateY(${d}deg) rotateZ(${f}deg) scaleX(${o})`}resize(t,e){this.canvasWidth=t,this.canvasHeight=e,this.dpr=Math.min(window.devicePixelRatio||1,2),this.renderer.setPixelRatio(this.dpr),this.renderer.setSize(t,e,!1),this.camera.left=-t/2,this.camera.right=t/2,this.camera.top=e/2,this.camera.bottom=-e/2,this.updateCameraTransform()}getVideoMetrics(){const t=this.canvasWidth,e=this.canvasHeight,i=this.videoElement&&this.videoElement.videoWidth>0?this.videoElement.videoWidth:1280,s=this.videoElement&&this.videoElement.videoHeight>0?this.videoElement.videoHeight:720,r=t/e,a=i/s;let o=t,c=e;return r>a?(o=t,c=t/a):(c=e,o=e*a),{renderW:o,renderH:c,videoAspect:a}}setMirrored(t){this.isMirrored=t,this.updateVideoElementTransform()}setRenderMode(t){}setShowWebcam(t){this.showWebcam=t,this.updateVisibility()}setFaceTextureEnabled(t){this.isFaceTextureEnabled=t,t&&!this.videoTexture&&this.videoElement&&(this.setupVideoTexture(),this.textureMaterial&&(this.textureMaterial.map=this.videoTexture)),this.updateVisibility()}setContrast(t){var e;this.textureContrast=t,(e=this.textureUniforms)!=null&&e.uContrast&&(this.textureUniforms.uContrast.value=t)}setSaturation(t){var e;this.textureSaturation=t,(e=this.textureUniforms)!=null&&e.uSaturation&&(this.textureUniforms.uSaturation.value=t)}freezeFaceTexture(t=null,e=null){this.freezeCanvas||(this.freezeCanvas=document.createElement("canvas"));const i=t||this.videoElement;if(!i)return;const s=i.width||i.videoWidth||1280,r=i.height||i.videoHeight||720;this.freezeCanvas.width=s,this.freezeCanvas.height=r,this.freezeCanvas.getContext("2d").drawImage(i,0,0,s,r),this.freezeTexture?this.freezeTexture.needsUpdate=!0:(this.freezeTexture=new Ny(this.freezeCanvas),this.freezeTexture.colorSpace=un,this.freezeTexture.minFilter=tn,this.freezeTexture.magFilter=tn),this.isTextureFrozen=!0,this.uvBlendFrom=null;const o=e||this.lastLiveLandmarks;o&&(this.frozenLandmarks=o.map(c=>({x:c.x,y:c.y,z:c.z})),this.autonomousWebcamLandmarks=this.frozenLandmarks),this.textureMaterial&&(this.textureMaterial.map=this.freezeTexture),this.webcamPlaneMaterial&&(this.webcamPlaneMaterial.map=this.freezeTexture)}setAutonomousWebcamBackground(t=null,e=null){this.freezeFaceTexture(t,e)}unfreezeFaceTexture(){this.isTextureFrozen=!1,this.frozenLandmarks=null,this.uvBlendFrom=null,this.videoTexture&&this.textureMaterial&&(this.textureMaterial.map=this.videoTexture),this.webcamBackgroundGroup&&(this.webcamBackgroundGroup.visible=!1)}toggleFreezeFaceTexture(){return this.isTextureFrozen?(this.unfreezeFaceTexture(),!1):(this.freezeFaceTexture(),!0)}setShowBust(t){this.showBust=!1}updateVisibility(){this.webcamBackgroundGroup&&(this.webcamBackgroundGroup.visible=this.showWebcam&&this.isAutonomousActive),this.maskMesh.visible=!0,this.eyeGroup.visible=!0,this.eyeApertureMesh&&(this.eyeApertureMesh.visible=this.eyeGroup.visible),this.mouthMesh&&(this.mouthMesh.visible=!0),this.videoTexture||this.freezeTexture?this.maskMesh.material=this.textureMaterial:this.maskMesh.material=this.maskMaterial,this.ambientLight.intensity=1.25,this.keyLight.intensity=1.15,this.fillLight.intensity=.8,this.rimLight.intensity=.45,this.textureMaterial&&(this.textureMaterial.color.setHex(16777215),this.textureMaterial.roughness=.82,this.textureMaterial.metalness=0),this.scleraMaterial.color.setHex(16316924),this.limbalMaterial&&this.limbalMaterial.color.setHex(790034),this.irisMaterial.color.setHex(1711136),this.pupilMaterial.color.setHex(131588)}clear(){this.renderer.clear(!0,!0,!0)}update3DEyes(t,e,i,s){if(!this.eyeGroup.visible)return;const r=o=>{const c=t[o];if(!c)return null;const l=this.isMirrored?1-c.x:c.x;return new k((l-.5)*e,(.5-c.y)*i,-(c.z||0)*s)},a=(o,c,l,h,u,d,f)=>{if(!o||!c||!u||!f)return;const g=(l||[]).filter(It=>!!It),v=(h||[]).filter(It=>!!It);if(g.length===0||v.length===0)return;let m=0,p=0,S=0;for(let It=0;It<g.length;It++)m+=g[It].x,p+=g[It].y,S+=g[It].z;const x=new k(m/g.length,p/g.length,S/g.length);let _=0,w=0,b=0;for(let It=0;It<v.length;It++)_+=v[It].x,w+=v[It].y,b+=v[It].z;const A=new k(_/v.length,w/v.length,b/v.length),R=o.distanceTo(c),M=x.distanceTo(A);if(R<1)return;const y=new k().addVectors(o,c).multiplyScalar(.5),L=new k().addVectors(x,A).multiplyScalar(.5),B=new k().addVectors(y.clone().multiplyScalar(.6),L.clone().multiplyScalar(.4)),D=Math.max(8,Math.min(260,R*.76)),N=(x.z+A.z)*.5,j=(o.z+c.z)*.5,W=N*.65+j*.35,Q=Math.min(W-.45,x.z-.25,A.z-.25),V=new k(B.x,B.y,Q-D);f.sclera.position.copy(V),f.sclera.scale.setScalar(D);let tt=0,ot=0;if(d&&d.length>0)for(let It=0;It<d.length;It++){const Mt=d[It];Mt&&(tt+=u.distanceTo(Mt),ot++)}ot>0&&(tt/=ot),(!tt||tt<2||tt>R*.38)&&(tt=R*.22);const nt=tt*.48,dt=Math.max(2,R*.48-nt*1.15),Vt=Math.max(2,M*.48-nt*1.15),X=B.x+Math.max(-dt,Math.min(dt,u.x-B.x)),Z=B.y+Math.max(-Vt,Math.min(Vt,u.y-B.y)),ct=X-V.x,it=Z-V.y,xt=ct*ct+it*it,Et=D*D*.88,Ft=Math.min(xt,Et),oe=Math.sqrt(Math.max(0,D*D-Ft));let Ht=V.z+oe;const st=x.y!==A.y?Math.max(0,Math.min(1,(Z-A.y)/(x.y-A.y))):.5,P=(1-st)*A.z+st*x.z,Gt=Math.min(P-.2,x.z-.2,A.z-.2);Ht=Math.min(Ht,Gt);const kt=new k(ct,it,oe).normalize(),Ut=new Ci().setFromUnitVectors(new k(0,0,1),kt);f.limbal.position.set(X,Z,Math.min(Ht+.01,Gt-.03)),f.limbal.quaternion.copy(Ut),f.limbal.scale.set(tt*1.05,tt*1.05,1),f.iris.position.set(X,Z,Math.min(Ht+.02,Gt-.02)),f.iris.quaternion.copy(Ut),f.iris.scale.set(tt*.96,tt*.96,1),f.pupil.position.set(X,Z,Math.min(Ht+.03,Gt-.01)),f.pupil.quaternion.copy(Ut),f.pupil.scale.set(nt,nt,1);const yt=new k(-tt*.26,tt*.26,.04).applyQuaternion(Ut);f.glint.position.set(X+yt.x,Z+yt.y,Math.min(Ht+yt.z,Gt)),f.glint.quaternion.copy(Ut),f.glint.scale.set(nt*.28,nt*.28,1)};a(r(133),r(33),[r(246),r(161),r(160),r(159),r(158),r(157),r(173)],[r(7),r(163),r(144),r(145),r(153),r(154),r(155)],r(468),[r(469),r(470),r(471),r(472)],this.rightEyeRig),a(r(362),r(263),[r(466),r(388),r(387),r(386),r(385),r(384),r(398)],[r(249),r(390),r(373),r(374),r(380),r(381),r(382)],r(473),[r(474),r(475),r(476),r(477)],this.leftEyeRig)}render(t){if(!t||!t.detected||!t.landmarks){this.clear();return}const{landmarks:e,liveLandmarks:i}=t;i?this.lastLiveLandmarks=i:e&&(this.lastLiveLandmarks=e);const{renderW:s,renderH:r}=this.getVideoMetrics(),a=Math.min(this.numVertices,e.length),o=s*1.1,c=this.isTextureFrozen&&this.frozenLandmarks?this.frozenLandmarks:i||e;for(let g=0;g<a;g++){const v=e[g],m=this.isMirrored?1-v.x:v.x;this.positions[g*3]=(m-.5)*s,this.positions[g*3+1]=(.5-v.y)*r,this.positions[g*3+2]=-(v.z||0)*o;const p=c[g]||v;this.uvs[g*2]=p.x,this.uvs[g*2+1]=1-p.y}this.posAttribute.needsUpdate=!0,this.uvAttribute.needsUpdate=!0,this.geometry.computeVertexNormals(),this.isFaceTextureEnabled&&!this.isTextureFrozen&&this.videoTexture&&(this.videoTexture.needsUpdate=!0),t.headPose&&(this.lastHeadPose=t.headPose),this.update3DEyes(e,s,r,o),this.updateOralCavity(s,r,o);const h=!!t.isAutonomous;this.isAutonomousActive=h;const u=t.blendToLiveWeight!==void 0?t.blendToLiveWeight:null,d=u!==null&&u>.005,f=this.showWebcam&&(h||d)&&(this.freezeTexture||this.videoTexture);if(this.webcamBackgroundGroup)if(f){this.webcamBackgroundGroup.visible=!0,this.webcamPlaneMaterial&&(this.webcamPlaneMaterial.map||(this.webcamPlaneMaterial.map=this.freezeTexture||this.videoTexture),d?this.webcamPlaneMaterial.opacity=Math.max(0,Math.min(1,u)):this.webcamPlaneMaterial.opacity=1);const g=168,v=this.positions[g*3]||0,m=this.positions[g*3+1]||0,p=this.positions[g*3+2]||0,S=t.headPose||this.lastHeadPose||{pitch:0,yaw:0,roll:0},x=this.isMirrored?-1:1;this.webcamPlaneEuler.set(Bn.degToRad(S.pitch||0),Bn.degToRad(-(S.yaw||0)*x),Bn.degToRad((S.roll||0)*x),"YXZ"),this.webcamPlaneQuat.setFromEuler(this.webcamPlaneEuler);let _=S.zDepthScale||1;if(!S.zDepthScale&&S.z!==void 0&&s>0){const y=S.z/s;_=Math.max(.65,Math.min(1.45,1+y*1.8))}const w=this.autonomousWebcamLandmarks&&this.autonomousWebcamLandmarks[g]||this.frozenLandmarks&&this.frozenLandmarks[g]||e&&e[g]||{x:.5,y:.5},A=-((this.isMirrored?1-w.x:w.x)-.5)*s,R=-(.5-w.y)*r,M=this.webcamPlaneDepthSpacing||140;this.webcamBackgroundGroup.position.set(v,m,p),this.webcamBackgroundGroup.quaternion.copy(this.webcamPlaneQuat),this.webcamBackgroundGroup.scale.set(_,_,_),this.webcamPlane.position.set(A,R,-M),this.webcamPlane.scale.set(s*(this.isMirrored?-1:1),r,1)}else this.webcamBackgroundGroup.visible=!1,this.webcamPlaneMaterial&&(this.webcamPlaneMaterial.opacity=1);this.renderer.render(this.scene,this.camera)}}class Vh{constructor(){this.aspectRatio=16/9}setAspectRatio(t){t>.1&&t<10&&(this.aspectRatio=t)}toIsotropic(t){const e=this.aspectRatio;return{x:(t.x-.5)*e,y:t.y-.5,z:(t.z||0)*e}}fromIsotropic(t,e=1){const i=this.aspectRatio;return{x:t.x/i+.5,y:t.y+.5,z:t.z/i,visibility:e}}extractRigidFrame(t){if(!t||t.length<468)return null;const e=this.toIsotropic(t[133]),i=this.toIsotropic(t[362]),s=this.toIsotropic(t[10]),r=this.toIsotropic(t[168]),a={x:(e.x+i.x)*.5,y:(e.y+i.y)*.4+r.y*.2,z:(e.z+i.z)*.5},o=i.x-e.x,c=i.y-e.y,l=i.z-e.z,h=Math.hypot(o,c,l);if(h<.001)return null;const u=h,d={x:o/u,y:c/u,z:l/u},f=s.x-r.x,g=s.y-r.y,v=s.z-r.z,m=f*d.x+g*d.y+v*d.z;let p=f-m*d.x,S=g-m*d.y,x=v-m*d.z;const _=Math.hypot(p,S,x)||1;let w={x:p/_,y:S/_,z:x/_},b={x:d.y*w.z-d.z*w.y,y:d.z*w.x-d.x*w.z,z:d.x*w.y-d.y*w.x};const A=Math.hypot(b.x,b.y,b.z)||1;if(b={x:b.x/A,y:b.y/A,z:b.z/A},this.lastRigidFrame){const R=this.lastRigidFrame;d.x*R.ux.x+d.y*R.ux.y+d.z*R.ux.z<0&&(d.x=-d.x,d.y=-d.y,d.z=-d.z),w.x*R.uy.x+w.y*R.uy.y+w.z*R.uy.z<0&&(w.x=-w.x,w.y=-w.y,w.z=-w.z),b.x*R.uz.x+b.y*R.uz.y+b.z*R.uz.z<0&&(b.x=-b.x,b.y=-b.y,b.z=-b.z)}return{origin:a,scale:h,ux:d,uy:w,uz:b}}smoothRigidFrame(t,e=!0){if(!t)return null;if(!e)return this.lastRigidFrame={origin:{...t.origin},scale:t.scale,ux:{...t.ux},uy:{...t.uy},uz:{...t.uz}},t;if(!this.lastRigidFrame)return this.lastRigidFrame={origin:{...t.origin},scale:t.scale,ux:{...t.ux},uy:{...t.uy},uz:{...t.uz}},this.lastRigidFrame;const i=this.lastRigidFrame,s=Math.hypot(t.origin.x-i.origin.x,t.origin.y-i.origin.y,t.origin.z-i.origin.z),r=Math.max(.28,Math.min(.85,.28+s*25));i.origin.x+=(t.origin.x-i.origin.x)*r,i.origin.y+=(t.origin.y-i.origin.y)*r,i.origin.z+=(t.origin.z-i.origin.z)*r,i.scale+=(t.scale-i.scale)*.25;const a=.4;let o=i.ux.x+(t.ux.x-i.ux.x)*a,c=i.ux.y+(t.ux.y-i.ux.y)*a,l=i.ux.z+(t.ux.z-i.ux.z)*a;const h=Math.hypot(o,c,l)||1;i.ux={x:o/h,y:c/h,z:l/h};let u=i.uy.x+(t.uy.x-i.uy.x)*a,d=i.uy.y+(t.uy.y-i.uy.y)*a,f=i.uy.z+(t.uy.z-i.uy.z)*a;const g=u*i.ux.x+d*i.ux.y+f*i.ux.z;u-=g*i.ux.x,d-=g*i.ux.y,f-=g*i.ux.z;const v=Math.hypot(u,d,f)||1;return i.uy={x:u/v,y:d/v,z:f/v},i.uz={x:i.ux.y*i.uy.z-i.ux.z*i.uy.y,y:i.ux.z*i.uy.x-i.ux.x*i.uy.z,z:i.ux.x*i.uy.y-i.ux.y*i.uy.x},i}toLocalCoordinates(t,e){const{origin:i,scale:s,ux:r,uy:a,uz:o}=e,c=t.length,l=new Array(c);for(let h=0;h<c;h++){const u=this.toIsotropic(t[h]),d=(u.x-i.x)/s,f=(u.y-i.y)/s,g=(u.z-i.z)/s;l[h]={x:d*r.x+f*r.y+g*r.z,y:d*a.x+f*a.y+g*a.z,z:d*o.x+f*o.y+g*o.z}}return l}fromLocalCoordinates(t,e){const{origin:i,scale:s,ux:r,uy:a,uz:o}=e,c=t.length,l=new Array(c);for(let h=0;h<c;h++){const u=t[h];u&&(l[h]={x:i.x+s*(u.x*r.x+u.y*a.x+u.z*o.x),y:i.y+s*(u.x*r.y+u.y*a.y+u.z*o.y),z:i.z+s*(u.x*r.z+u.y*a.z+u.z*o.z)})}return l}}function Xy(){const n=new Float32Array(478);return n.fill(.25),[168,6,10,151,9,8,107,336].forEach(m=>{n[m]=.05}),[0,11,12,13,14,15,16,17,37,38,39,40,41,61,72,73,74,76,77,78,80,81,82,84,85,86,87,88,91,95,146,178,179,180,181,185,191,267,268,269,270,271,291,302,303,304,306,307,308,310,311,312,314,315,316,317,318,321,324,375,402,403,404,405,409,415,164,165,167,2,94].forEach(m=>{m<478&&(n[m]=1)}),[48,64,98,278,294,327,49,279,102,331,218,438,79,309,238,458].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.85))}),[1,4,5,195,197,240,460].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.75))}),[97,326,198,420,236,456].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.55))}),[116,117,118,119,120,121,123,147,187,192,207,213,216,345,346,347,348,349,350,352,376,411,416,427,433,436].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.8))}),[50,101,111,126,142,203,205,206,212,214,280,330,340,355,371,423,425,426,432,434].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.65))}),[57,62,186,287,292,410].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.8))}),[36,138,177,215,227,234,266,367,401,435,447,454].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.35))}),[{indices:[152],w:.9},{indices:[377,148],w:.8},{indices:[400,176],w:.65},{indices:[378,149],w:.5},{indices:[379,150],w:.35},{indices:[365,136],w:.2},{indices:[397,172],w:.08},{indices:[288,58],w:.02}].forEach(({indices:m,w:p})=>{m.forEach(S=>{S<478&&(n[S]=Math.max(n[S],p))})}),[175,199,200,18,19,396,171].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.8))}),[70,63,105,66,107,55,65,52,53,46,300,293,334,296,336,285,295,282,283,276].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.95))}),[9,8,168].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.65))}),[67,109,108,68,69,104,103,297,337,338,298,299,333,332].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.6))}),[33,160,158,133,153,144,362,385,387,263,373,380,159,145,386,374,468,469,470,471,472,473,474,475,476,477,246,161,157,173,466,388,384,398].forEach(m=>{m<478&&(n[m]=Math.max(n[m],.92))}),n}const Yy=[78,191,80,81,82,13,312,311,310,415,308],qy=[78,95,88,178,87,14,317,402,318,324,308],jd=[[13,14],[82,87],[81,178],[80,88],[191,95],[312,317],[311,402],[310,318],[415,324]],jy=[152,377,148,400,176,378,149,379,150,365,136,175,171,396,199,200,18,19];function us(n){if(!n||n.length<468)return n;const t=4e-4;for(let e=0;e<jd.length;e++){const[i,s]=jd[e],r=n[i],a=n[s];if(!(!r||!a)&&a.y>r.y-t){const o=(r.y+a.y)*.5;r.y=o+t*.5,a.y=o-t*.5,a.z>r.z-8e-4&&(a.z=r.z-8e-4)}}return n}const $y={jawOpen:{gain:1.6,gamma:.82,deadzone:.02},mouthFunnel:{gain:1.8,gamma:.78,deadzone:.03},mouthPucker:{gain:1.7,gamma:.78,deadzone:.03},mouthSmileLeft:{gain:1.45,gamma:.88,deadzone:.02},mouthSmileRight:{gain:1.45,gamma:.88,deadzone:.02},mouthRollLower:{gain:1.8,gamma:.8,deadzone:.03},mouthRollUpper:{gain:1.8,gamma:.8,deadzone:.03},mouthUpperUpLeft:{gain:1.6,gamma:.82,deadzone:.02},mouthUpperUpRight:{gain:1.6,gamma:.82,deadzone:.02},mouthLowerDownLeft:{gain:1.6,gamma:.82,deadzone:.02},mouthLowerDownRight:{gain:1.6,gamma:.82,deadzone:.02},mouthStretchLeft:{gain:1.5,gamma:.85,deadzone:.02},mouthStretchRight:{gain:1.5,gamma:.85,deadzone:.02},mouthClose:{gain:1.5,gamma:.85,deadzone:.02},mouthPressLeft:{gain:1.6,gamma:.8,deadzone:.03},mouthPressRight:{gain:1.6,gamma:.8,deadzone:.03},eyeBlinkLeft:{gain:1.35,gamma:.9,deadzone:.03},eyeBlinkRight:{gain:1.35,gamma:.9,deadzone:.03},eyeSquintLeft:{gain:1.5,gamma:.85,deadzone:.03},eyeSquintRight:{gain:1.5,gamma:.85,deadzone:.03},eyeWideLeft:{gain:1.6,gamma:.8,deadzone:.02},eyeWideRight:{gain:1.6,gamma:.8,deadzone:.02},browInnerUp:{gain:1.55,gamma:.82,deadzone:.02},browDownLeft:{gain:1.5,gamma:.85,deadzone:.02},browDownRight:{gain:1.5,gamma:.85,deadzone:.02},browOuterUpLeft:{gain:1.5,gamma:.85,deadzone:.02},browOuterUpRight:{gain:1.5,gamma:.85,deadzone:.02},cheekPuff:{gain:1.7,gamma:.78,deadzone:.04},noseSneerLeft:{gain:1.7,gamma:.8,deadzone:.03},noseSneerRight:{gain:1.7,gamma:.8,deadzone:.03}};class Ky extends EventTarget{constructor(){super(),this.isCalibrating=!1,this.calibrationSamples=[],this.calibrationDurationMs=1e3,this.calibrationStartTime=0,this.baselineScores={},this.globalBoost=1.35}startCalibration(){this.isCalibrating=!0,this.calibrationSamples=[],this.calibrationStartTime=performance.now(),this.dispatchEvent(new CustomEvent("calibration:start"))}setBoost(t){this.globalBoost=Math.max(.5,Math.min(3,t))}process(t,e=performance.now()){if(!t)return t;if(this.isCalibrating){this.calibrationSamples.push({...t});const s=e-this.calibrationStartTime;this.dispatchEvent(new CustomEvent("calibration:progress",{detail:{progress:Math.min(1,s/this.calibrationDurationMs)}})),s>=this.calibrationDurationMs&&this.finishCalibration()}const i={};for(const[s,r]of Object.entries(t)){const a=this.baselineScores[s]||0,o=$y[s]||{gain:1.3,gamma:.9,deadzone:.02};let c=Math.max(0,r-a);const l=Math.max(.1,1-a);if(c=c/l,c<o.deadzone){i[s]=0;continue}const u=Math.pow(c,o.gamma)*o.gain*this.globalBoost;i[s]=Math.max(0,Math.min(1,u))}return i}finishCalibration(){if(this.isCalibrating=!1,this.calibrationSamples.length===0)return;const t={},e=this.calibrationSamples.length;for(let i=0;i<e;i++){const s=this.calibrationSamples[i];for(const[r,a]of Object.entries(s))t[r]=(t[r]||0)+a}this.baselineScores={};for(const[i,s]of Object.entries(t))this.baselineScores[i]=s/e;this.dispatchEvent(new CustomEvent("calibration:complete",{detail:{baselineScores:this.baselineScores}}))}reset(){this.baselineScores={},this.isCalibrating=!1,this.calibrationSamples=[]}}function Zy(){const n=new Float32Array(478);return[468,469,470,471,472,473,474,475,476,477].forEach(s=>{s<478&&(n[s]=1)}),[33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246,263,249,390,373,374,380,381,382,362,398,384,385,386,387,388,466].forEach(s=>{s<478&&(n[s]=1)}),[130,25,110,24,23,22,26,112,243,190,56,28,27,29,30,247,359,255,339,254,253,252,256,341,463,414,286,258,257,259,260,467].forEach(s=>{s<478&&(n[s]=Math.max(n[s],.5))}),n}class Jy extends EventTarget{constructor(){super(),this.isRecording=!1,this.isPlaying=!1,this.recordedFrames=[],this.recordingStartTime=0,this.playbackStartTime=0,this.loopDurationMs=0,this.playbackSpeed=1,this.expressionBlend=0,this.eyeBlend=0,this.expressionBoost=.5,this.contourFix=1,this.antiShake=1,this.ring0=new Set([10,21,54,58,67,93,103,109,127,132,136,148,149,150,152,162,172,176,234,251,284,288,297,323,332,338,356,361,365,377,378,379,389,397,400,454]),this.ring1=new Set([34,68,69,71,104,108,135,137,138,139,140,151,169,170,171,175,177,215,227,264,298,299,301,333,337,364,366,367,368,369,394,395,396,401,435,447]),this.mandibularJawSet=new Set(jy),this.oralApertureSet=new Set([...Yy,...qy,0,11,12,13,14,15,16,17,37,38,39,40,41,61,72,73,74,76,77,84,85,86,91,146,178,179,180,181,185,267,268,269,270,271,291,302,303,304,306,307,314,315,316,321,375,403,404,405,409]),this.useHeadSmoothing=!0,this.weights=Xy(),this.eyeWeights=Zy(),this.referenceLocal=null,this.calibLandmarkSamples=[],this.cranial=new Vh,this.calibrator=new Ky,this.calibrator.addEventListener("calibration:complete",()=>{this.finishLandmarkCalibration()}),this.lastPlaybackLocal=null,this.lastStableNeutralLocal=null,this.lastStableNeutralHeadPose=null,this.preRecordNeutralLocal=null,this.preRecordNeutralHeadPose=null,this.referenceHeadPose=null,this.unloopedFrames=null}setAspectRatio(t){this.cranial.setAspectRatio(t)}setExpressionBlend(t){this.expressionBlend=Math.max(0,Math.min(1,t))}setEyeBlend(t){this.eyeBlend=Math.max(0,Math.min(1,t))}setExpressionBoost(t){this.expressionBoost=Math.max(0,Math.min(1,t))}setContourFix(t){this.contourFix=Math.max(0,Math.min(1,t))}setAntiShake(t){this.antiShake=Math.max(0,Math.min(1,t))}setHeadSmoothing(t){this.useHeadSmoothing=!!t}setSmoothing(t){this.setExpressionBlend(t)}startRecording(t=null){this.recordedFrames=[],this.unloopedFrames=null,this.recordingStartTime=t||performance.now(),this.isRecording=!0,this.isPlaying=!1,this.lastPlaybackLocal=null,this.lastStableNeutralLocal?(this.preRecordNeutralLocal=this.lastStableNeutralLocal.map(e=>({x:e.x,y:e.y,z:e.z})),this.preRecordNeutralHeadPose=this.lastStableNeutralHeadPose?{...this.lastStableNeutralHeadPose}:null):(this.preRecordNeutralLocal=null,this.preRecordNeutralHeadPose=null),this.dispatchEvent(new CustomEvent("recording:start"))}stopRecording(){this.isRecording&&(this.isRecording=!1,this.finalizeRecordedFrames())}exportAnimation(t="Expression",e=null){const i=this.unloopedFrames||this.recordedFrames;return!i||i.length===0?null:{id:`anim_${Date.now()}`,name:t.trim()||"Expression",durationMs:Math.round(this.loopDurationMs),frameCount:i.length,createdAt:new Date().toISOString(),referenceLocal:this.referenceLocal?this.referenceLocal.map(s=>({x:s.x,y:s.y,z:s.z})):null,referenceHeadPose:this.referenceHeadPose?{pitch:Number((this.referenceHeadPose.pitch||0).toFixed(2)),yaw:Number((this.referenceHeadPose.yaw||0).toFixed(2)),roll:Number((this.referenceHeadPose.roll||0).toFixed(2)),x:Number((this.referenceHeadPose.x||0).toFixed(4)),y:Number((this.referenceHeadPose.y||0).toFixed(4)),z:Number((this.referenceHeadPose.z||0).toFixed(4))}:null,hasAudio:!!e,audioData:e||null,frames:i.map(s=>({timeOffsetMs:Math.round(s.timeOffsetMs),localCoords:s.localCoords?s.localCoords.map(r=>({x:Number(r.x.toFixed(4)),y:Number(r.y.toFixed(4)),z:Number(r.z.toFixed(4))})):null,blendshapes:s.blendshapes||{},headPose:s.headPose?{pitch:Number((s.headPose.pitch||0).toFixed(2)),yaw:Number((s.headPose.yaw||0).toFixed(2)),roll:Number((s.headPose.roll||0).toFixed(2)),x:Number((s.headPose.x||0).toFixed(4)),y:Number((s.headPose.y||0).toFixed(4)),z:Number((s.headPose.z||0).toFixed(4))}:null}))}}loadRecordedFrames(t,e=null){!t||t.length===0||(this.isRecording=!1,this.recordedFrames=t,this.finalizeRecordedFrames(e),this.dispatchEvent(new CustomEvent("recording:loaded",{detail:{frameCount:this.recordedFrames.length,durationMs:this.loopDurationMs}})))}finalizeRecordedFrames(t=null){var i,s;const e=this.recordedFrames.length;if(e>2){const r=this.recordedFrames[0].localCoords.length,a=this.recordedFrames[e-1],o=a.timeOffsetMs/(e-1||1);if(this.loopDurationMs=t||a.timeOffsetMs+o,this.referenceLocal)!this.referenceHeadPose&&((i=this.recordedFrames[0])!=null&&i.headPose)&&(this.referenceHeadPose={...this.recordedFrames[0].headPose});else{let u=0,d=1/0;for(let f=0;f<e;f++){const g=this.recordedFrames[f],v=g.blendshapes||{},m=g.localCoords,p=m&&m[14]&&m[13]?Math.abs(m[14].y-m[13].y):0,S=(v.jawOpen||0)*4+(v.mouthFunnel||0)*3+(v.mouthPucker||0)*2+(v.mouthSmileLeft||0)*1.5+(v.mouthSmileRight||0)*1.5+(v.browInnerUp||0)+p*8;S<d&&(d=S,u=f)}if(this.lastStableNeutralLocal){const f=this.lastStableNeutralLocal;(f&&f[14]&&f[13]?Math.abs(f[14].y-f[13].y):0)*8<=d&&(this.referenceLocal=this.lastStableNeutralLocal.map(m=>({x:m.x,y:m.y,z:m.z})),this.referenceHeadPose=this.lastStableNeutralHeadPose?{...this.lastStableNeutralHeadPose}:null)}this.referenceLocal||(this.referenceLocal=this.recordedFrames[u].localCoords.map(f=>({x:f.x,y:f.y,z:f.z})),this.referenceHeadPose=this.recordedFrames[u].headPose?{...this.recordedFrames[u].headPose}:null)}if(this.referenceLocal&&us(this.referenceLocal),this.unloopedFrames=this.recordedFrames.map(u=>({timeOffsetMs:u.timeOffsetMs,localCoords:u.localCoords.map(d=>({x:d.x,y:d.y,z:d.z})),blendshapes:{...u.blendshapes},headPose:u.headPose?{...u.headPose}:null})),e>=5){const u=[.06,.24,.4,.24,.06],d=this.recordedFrames.map(g=>g.localCoords.map(v=>({x:v.x,y:v.y,z:v.z})));for(let g=0;g<e;g++){const v=this.unloopedFrames[g].localCoords,m=this.recordedFrames[g].localCoords;for(let p=0;p<r;p++){let S=0,x=0,_=0,w=0;const b=d[g][p];for(let L=-2;L<=2;L++){const B=Math.max(0,Math.min(e-1,g+L)),D=d[B][p];let N=u[L+2];if(this.oralApertureSet.has(p)){const j=Math.hypot(D.x-b.x,D.y-b.y,D.z-b.z),W=Math.exp(-(j*j)/(2*.012*.012));N*=.4+.6*W}S+=D.x*N,x+=D.y*N,_+=D.z*N,w+=N}const A=w>0?1/w:1,R=S*A,M=x*A,y=_*A;v[p].x=R,v[p].y=M,v[p].z=y,m[p].x=R,m[p].y=M,m[p].z=y}us(v),us(m)}const f=Object.keys(((s=this.recordedFrames[0])==null?void 0:s.blendshapes)||{});if(f.length>0){const g=this.recordedFrames.map(v=>({...v.blendshapes}));for(let v=0;v<e;v++)for(let m=0;m<f.length;m++){const p=f[m];let S=0;for(let x=-2;x<=2;x++){const _=Math.max(0,Math.min(e-1,v+x));S+=(g[_][p]||0)*u[x+2]}this.unloopedFrames[v].blendshapes[p]=S,this.recordedFrames[v].blendshapes[p]=S}}}const c=Math.min(14,Math.floor(e/4));if(c>1)for(let u=0;u<c;u++){const d=e-c+u,f=u,g=this.recordedFrames[d].localCoords,v=this.recordedFrames[f].localCoords,m=this.recordedFrames[d].blendshapes,p=this.recordedFrames[f].blendshapes,S=(u+1)/(c+1),x=S*S*S*(S*(S*6-15)+10);for(let _=0;_<r;_++)g[_].x=g[_].x*(1-x)+v[_].x*x,g[_].y=g[_].y*(1-x)+v[_].y*x,g[_].z=g[_].z*(1-x)+v[_].z*x;if(us(g),m&&p){const _=new Set([...Object.keys(m),...Object.keys(p)]);for(const w of _){const b=m[w]||0,A=p[w]||0;m[w]=b*(1-x)+A*x}}}const l=new Array(r),h=this.recordedFrames[0].localCoords;for(let u=0;u<r;u++)l[u]={x:h[u].x,y:h[u].y,z:h[u].z};us(l),this.recordedFrames.push({timeOffsetMs:this.loopDurationMs,localCoords:l,blendshapes:{...this.recordedFrames[0].blendshapes}}),this.isPlaying=!0,this.playbackStartTime=performance.now(),this.lastPlaybackLocal=null}this.dispatchEvent(new CustomEvent("recording:stop",{detail:{frameCount:this.recordedFrames.length,durationMs:this.loopDurationMs}}))}finishLandmarkCalibration(){if(this.calibLandmarkSamples.length>0){const t=this.calibLandmarkSamples.length,e=this.calibLandmarkSamples[0].length,i=new Array(e);for(let s=0;s<e;s++){let r=0,a=0,o=0;for(let c=0;c<t;c++)r+=this.calibLandmarkSamples[c][s].x,a+=this.calibLandmarkSamples[c][s].y,o+=this.calibLandmarkSamples[c][s].z;i[s]={x:r/t,y:a/t,z:o/t}}this.referenceLocal=i,this.calibLandmarkSamples=[]}}togglePlayback(t=null){this.recordedFrames.length!==0&&(this.isPlaying=t!==null?t:!this.isPlaying,this.isPlaying&&(this.playbackStartTime=performance.now(),this.lastPlaybackLocal=null),this.dispatchEvent(new CustomEvent("playback:toggle",{detail:{isPlaying:this.isPlaying}})))}clear(){this.isRecording=!1,this.isPlaying=!1,this.recordedFrames=[],this.loopDurationMs=0,this.lastPlaybackLocal=null,this.dispatchEvent(new CustomEvent("cleared"))}process(t,e=performance.now(),i=null){if(!t||!t.detected||!t.landmarks)return{...t,isLoopActive:!1,loopProgress:0};i&&this.cranial.setAspectRatio(i);const s=t.landmarks,r=this.cranial.extractRigidFrame(s);if(!r)return{...t,isLoopActive:!1,loopProgress:0};const a=this.cranial.smoothRigidFrame(r,this.useHeadSmoothing),o=this.calibrator.process(t.blendshapes,e);t.blendshapes=o;const c=this.cranial.toLocalCoordinates(s,a),l=t.blendshapes||{},h=l.jawOpen||0,u=Math.max(l.mouthSmileLeft||0,l.mouthSmileRight||0),d=l.browInnerUp||0;return h<.05&&u<.06&&d<.06&&(this.lastStableNeutralLocal=c,this.lastStableNeutralHeadPose=t.headPose?{...t.headPose}:null),this.calibrator.isCalibrating&&this.calibLandmarkSamples.push(c),this.isRecording&&(this.preRecordNeutralLocal||(this.preRecordNeutralLocal=c.map(f=>({x:f.x,y:f.y,z:f.z}))),this.recordedFrames.push({timeOffsetMs:e-this.recordingStartTime,localCoords:c,blendshapes:o,headPose:t.headPose?{...t.headPose}:null})),!this.isPlaying||this.recordedFrames.length===0?{...t,liveLandmarks:s,isLoopActive:!1,loopProgress:0}:this.applyPlayback(t,a,s,c,e)}boostDeformation(t,e,i,s){if(!t||!e||i<=.001||s<.01)return t;const r=1+i*s,a=.38;let o=(t.x-e.x)*r,c=(t.y-e.y)*r,l=(t.z-e.z)*r;const h=Math.hypot(o,c,l);if(h>a){const u=(a+(h-a)*.25)/h;o*=u,c*=u,l*=u}return{x:e.x+o,y:e.y+c,z:e.z+l}}applyPlayback(t,e,i,s,r){const o=(r-this.playbackStartTime)*this.playbackSpeed%this.loopDurationMs,c=o/this.loopDurationMs,l=this.getInterpolatedLocalCoords(o);if(!l)return t;const h=l.length,u=new Array(h),d=this.expressionBlend,f=this.eyeBlend,g=this.referenceLocal,v=.35;for(let A=0;A<h;A++){let R=l[A],M=s[A];const y=g?g[A]:null;if(!R||!M){u[A]=R||M;continue}const L=this.eyeWeights[A]||0,B=this.weights[A]!==void 0?this.weights[A]:.8;if(this.expressionBoost>.001&&y&&(R=this.boostDeformation(R,y,this.expressionBoost,B),M=this.boostDeformation(M,y,this.expressionBoost,B)),L>.01){const j=f*L;u[A]={x:(1-j)*M.x+j*R.x,y:(1-j)*M.y+j*R.y,z:(1-j)*M.z+j*R.z};continue}let D=1;!this.mandibularJawSet.has(A)&&!this.oralApertureSet.has(A)&&(this.ring0.has(A)?D=1-this.contourFix:this.ring1.has(A)&&(D=1-this.contourFix*.5));let N=R;if(D<.999&&(N={x:(1-D)*M.x+D*R.x,y:(1-D)*M.y+D*R.y,z:(1-D)*M.z+D*R.z}),d>.001&&y){const j=(M.x-y.x)*B*d,W=(M.y-y.y)*B*d,Q=(M.z-y.z)*B*d;let V=N.x+j,tt=N.y+W,ot=N.z+Q;const nt=Math.hypot(V-y.x,tt-y.y,ot-y.z);if(nt>v){const dt=(v+(nt-v)*.25)/nt;V=y.x+(V-y.x)*dt,tt=y.y+(tt-y.y)*dt,ot=y.z+(ot-y.z)*dt}u[A]={x:V,y:tt,z:ot}}else u[A]=N}if(this.antiShake>.001&&this.lastPlaybackLocal){let A=0,R=0,M=0,y=0,L=0;for(let B=0;B<h;B++){const D=u[B],N=this.lastPlaybackLocal[B];if(D&&N){const j=D.x-N.x,W=D.y-N.y,Q=D.z-N.z;A+=j,R+=W,M+=Q,y+=Math.hypot(j,W,Q),L++}}if(L>0&&y>1e-4){const B=A/L,D=R/L,N=M/L,j=Math.hypot(B,D,N),W=y/L,V=Math.min(1,j/(W+1e-5))*this.antiShake*.95;if(V>.02){const tt=B*V,ot=D*V,nt=N*V;for(let dt=0;dt<h;dt++)u[dt].x-=tt,u[dt].y-=ot,u[dt].z-=nt}}}if(this.lastPlaybackLocal){const A=.92-this.antiShake*.72;for(let R=0;R<h;R++){const M=u[R],y=this.lastPlaybackLocal[R];M&&y&&(M.x=y.x+(M.x-y.x)*A,M.y=y.y+(M.y-y.y)*A,M.z=y.z+(M.z-y.z)*A)}}us(u),this.lastPlaybackLocal=u;const m=this.cranial.fromLocalCoordinates(u,e),p=new Array(i.length);for(let A=0;A<i.length;A++)p[A]=this.cranial.fromIsotropic(m[A],i[A].visibility);const S=this.getInterpolatedBlendshapes(o),x={},_=t.blendshapes||{},w=S||_,b=new Set([...Object.keys(_),...Object.keys(w)]);for(const A of b){const R=_[A]||0,M=w[A]||0;if(/^eye/i.test(A))x[A]=(1-f)*R+f*M;else{let y=d>.001?Math.min(1,M+R*d):M;this.expressionBoost>.001&&(y=Math.min(1,y*(1+this.expressionBoost))),x[A]=y}}return{...t,blendshapes:x,landmarks:p,liveLandmarks:i,isLoopActive:!0,loopProgress:c}}getInterpolatedLocalCoords(t){const e=this.recordedFrames.length;if(e===0)return null;if(e===1)return this.recordedFrames[0].localCoords;const i=this.recordedFrames[e-1];if(t>=i.timeOffsetMs)return i.localCoords;let s=0,r=e-1;for(;s<=r;){const y=Math.floor((s+r)/2);this.recordedFrames[y].timeOffsetMs<=t?s=y+1:r=y-1}const a=Math.min(e-1,Math.max(0,r)),o=Math.min(e-1,s),c=this.recordedFrames[a],l=this.recordedFrames[o];if(a===o||!c||!l||!c.localCoords||!l.localCoords)return(c||l).localCoords;const h=l.timeOffsetMs-c.timeOffsetMs,u=h>.001?Math.max(0,Math.min(1,(t-c.timeOffsetMs)/h)):0,d=(a-1+e)%e,f=(o+1)%e,g=this.recordedFrames[d].localCoords,v=c.localCoords,m=l.localCoords,p=this.recordedFrames[f].localCoords,S=v.length,x=new Array(S),_=u*u,w=_*u,b=-.5*w+_-.5*u,A=1.5*w-2.5*_+1,R=-1.5*w+2*_+.5*u,M=.5*w-.5*_;for(let y=0;y<S;y++){const L=g[y]||v[y],B=v[y],D=m[y],N=p[y]||m[y];x[y]={x:b*L.x+A*B.x+R*D.x+M*N.x,y:b*L.y+A*B.y+R*D.y+M*N.y,z:b*L.z+A*B.z+R*D.z+M*N.z}}return x}getInterpolatedBlendshapes(t){const e=this.recordedFrames.length;if(e===0)return null;if(e===1)return this.recordedFrames[0].blendshapes;const i=this.recordedFrames[e-1];if(t>=i.timeOffsetMs)return i.blendshapes;let s=0,r=e-1;for(;s<=r;){const g=Math.floor((s+r)/2);this.recordedFrames[g].timeOffsetMs<=t?s=g+1:r=g-1}const a=Math.max(0,r),o=Math.min(e-1,s),c=this.recordedFrames[a],l=this.recordedFrames[o];if(a===o||!c||!l||!c.blendshapes||!l.blendshapes)return(c||l).blendshapes;const h=l.timeOffsetMs-c.timeOffsetMs,u=h>.001?Math.max(0,Math.min(1,(t-c.timeOffsetMs)/h)):0,d={},f=new Set([...Object.keys(c.blendshapes),...Object.keys(l.blendshapes)]);for(const g of f){const v=c.blendshapes[g]||0,m=l.blendshapes[g]||0;d[g]=v+(m-v)*u}return d}}class Qy extends EventTarget{constructor(t){super(),this.looper=t,this.lastFaceSeenTime=0,this.faceAbsentSince=performance.now(),this.faceWasAbsent=!0,this.isCalibrating=!1,this.lastCalibrationTime=0,this.hasCalibratedAtLeastOnce=!1,this.stabilityHistory=[],this.stabilityWindow=15,this.ABSENCE_THRESHOLD_MS=1800,this.MOTION_STABILITY_THRESHOLD=.0065,this.LOCKOUT_COOLDOWN_MS=7e3}update(t,e=performance.now()){if(!t||!t.detected||!t.landmarks){this.faceWasAbsent||(this.faceAbsentSince=e,this.faceWasAbsent=!0),this.stabilityHistory=[];return}const i=e-this.faceAbsentSince,s=!this.hasCalibratedAtLeastOnce||this.faceWasAbsent&&i>=this.ABSENCE_THRESHOLD_MS;if(this.faceWasAbsent=!1,this.lastFaceSeenTime=e,!(this.isCalibrating||this.looper.calibrator.isCalibrating)&&!(this.hasCalibratedAtLeastOnce&&e-this.lastCalibrationTime<this.LOCKOUT_COOLDOWN_MS&&i<this.ABSENCE_THRESHOLD_MS)&&s){const r=t.landmarks,a=r[133],o=r[362],c=r[168];if(!a||!o||!c)return;const l=(a.x+o.x)*.5,h=(a.y+o.y)*.5,u=(a.z||0+(o.z||0))*.5;if(this.stabilityHistory.push({x:l,y:h,z:u,time:e}),this.stabilityHistory.length>this.stabilityWindow&&this.stabilityHistory.shift(),this.stabilityHistory.length>=this.stabilityWindow){let d=0,f=0,g=0;for(const p of this.stabilityHistory)d+=p.x,f+=p.y,g+=p.z;d/=this.stabilityHistory.length,f/=this.stabilityHistory.length,g/=this.stabilityHistory.length;let v=0;for(const p of this.stabilityHistory){const S=p.x-d,x=p.y-f,_=p.z-g;v+=S*S+x*x+_*_}Math.sqrt(v/this.stabilityHistory.length)<this.MOTION_STABILITY_THRESHOLD&&this.startAutoCalibration(e)}}}startAutoCalibration(t){this.isCalibrating=!0,this.stabilityHistory=[],this.dispatchEvent(new CustomEvent("autocalibration:start")),this.looper.calibrator.startCalibration();const e=()=>{this.isCalibrating=!1,this.hasCalibratedAtLeastOnce=!0,this.lastCalibrationTime=performance.now(),this.faceAbsentSince=performance.now(),this.dispatchEvent(new CustomEvent("autocalibration:complete")),this.looper.calibrator.removeEventListener("calibration:complete",e)};this.looper.calibrator.addEventListener("calibration:complete",e)}}class t3 extends EventTarget{constructor(){super(),this.audioCtx=null,this.stream=null,this.mediaRecorder=null,this.audioChunks=[],this.audioBuffer=null,this.activeSource=null,this.gainNode=null,this.isRecording=!1,this.isPlaying=!1,this.isMuted=!1,this.volume=1,this.recordingStartTime=0,this.loopDurationMs=0,this.audioDelaySec=2.2}setAudioDelay(t){this.audioDelaySec=Math.max(0,Math.min(4,Number(t)||0))}async ensureAudioContext(){if(!this.audioCtx){const t=window.AudioContext||window.webkitAudioContext;this.audioCtx=new t,this.gainNode=this.audioCtx.createGain(),this.gainNode.gain.setValueAtTime(this.isMuted?0:this.volume,this.audioCtx.currentTime),this.gainNode.connect(this.audioCtx.destination)}return this.audioCtx.state==="suspended"&&await this.audioCtx.resume(),this.audioCtx}async getMicrophoneStream(){if(this.stream&&this.stream.active){const t=this.stream.getAudioTracks();if(t.length>0&&t[0].readyState==="live")return this.stream}try{return this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!0}}),this.stream}catch(t){console.warn("Microphone access with advanced constraints failed, retrying basic audio:",t);try{return this.stream=await navigator.mediaDevices.getUserMedia({audio:!0}),this.stream}catch(e){return console.warn("Microphone access denied or unavailable:",e),null}}}hasAudio(){return!!this.audioBuffer}async startRecording(t=null){try{await this.ensureAudioContext();const e=await this.getMicrophoneStream();if(!e)return console.warn("Cannot record audio: No microphone stream available"),!1;this.stopPlayback(),this.audioChunks=[],this.audioBuffer=null,this.isRecording=!0,this.recordingStartTime=t||performance.now();const i=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];let s="";for(const a of i)if(typeof MediaRecorder<"u"&&MediaRecorder.isTypeSupported(a)){s=a;break}const r=s?{mimeType:s}:{};return this.mediaRecorder=new MediaRecorder(e,r),this.mediaRecorder.ondataavailable=a=>{a.data&&a.data.size>0&&this.audioChunks.push(a.data)},this.mediaRecorder.start(25),this.dispatchEvent(new CustomEvent("recording:start")),!0}catch(e){return console.error("Failed to start audio recording:",e),this.isRecording=!1,!1}}async stopRecording(t=null){return!this.isRecording||!this.mediaRecorder?null:(this.isRecording=!1,this.loopDurationMs=t||performance.now()-this.recordingStartTime,new Promise(e=>{this.mediaRecorder.onstop=async()=>{try{if(this.audioChunks.length===0){e(null);return}const s=await new Blob(this.audioChunks,{type:this.mediaRecorder.mimeType||"audio/webm"}).arrayBuffer(),r=await this.audioCtx.decodeAudioData(s);this.audioBuffer=this.processSeamlessLoop(r,this.loopDurationMs/1e3),this.dispatchEvent(new CustomEvent("recording:ready",{detail:{durationSec:this.loopDurationMs/1e3}})),e(this.audioBuffer)}catch(i){console.error("Audio decode failed:",i),e(null)}};try{this.mediaRecorder.state!=="inactive"?this.mediaRecorder.stop():this.mediaRecorder.onstop()}catch(i){console.warn("Error stopping mediaRecorder:",i),e(null)}}))}processSeamlessLoop(t,e){if(!t)return null;const i=t.sampleRate,s=t.numberOfChannels,r=Math.min(t.length,Math.max(1,Math.round(e*i))),a=this.audioCtx.createBuffer(s,r,i),o=Math.min(Math.floor(r*.15),Math.round(i*.025));for(let c=0;c<s;c++){const l=t.getChannelData(c),h=a.getChannelData(c);for(let u=0;u<r;u++)h[u]=l[u]||0;if(o>10&&r>o*2)for(let u=0;u<o;u++){const d=u/o,f=Math.sin(d*(Math.PI/2)),g=Math.cos(d*(Math.PI/2)),v=r-o+u,m=h[u],p=h[v];h[u]=m*f+p*(1-f),h[v]=p*g+m*(1-g)}}return a}async loadAudioBuffer(t,e){t&&(await this.ensureAudioContext(),this.stopPlayback(),this.audioChunks=[],this.loopDurationMs=Math.round(e*1e3),this.audioBuffer=this.processSeamlessLoop(t,e),this.dispatchEvent(new CustomEvent("recording:ready",{detail:{durationSec:e}})))}startPlayback(t=0,e=null){if(!this.audioBuffer||!this.audioCtx)return;this.stopPlayback();const i=e||(this.loopDurationMs?this.loopDurationMs/1e3:this.audioBuffer.duration);if(!(i<=.01))try{this.ensureAudioContext();const s=this.audioCtx.createBufferSource();s.buffer=this.audioBuffer,s.loop=!0,s.loopStart=0,s.loopEnd=i,s.connect(this.gainNode);const a=((t-(this.audioDelaySec||0))%i+i)%i;s.start(0,a),this.activeSource=s,this.isPlaying=!0,this.dispatchEvent(new CustomEvent("playback:start",{detail:{offsetSec:a}}))}catch(s){console.warn("Failed to start audio playback:",s)}}stopPlayback(){if(this.activeSource){try{this.activeSource.stop(),this.activeSource.disconnect()}catch{}this.activeSource=null}this.isPlaying=!1,this.dispatchEvent(new CustomEvent("playback:stop"))}pause(){this.stopPlayback()}seek(t,e=null){this.isPlaying&&this.startPlayback(t,e)}setVolume(t){if(this.volume=Math.max(0,Math.min(1,t)),this.gainNode&&this.audioCtx){const e=this.isMuted?0:this.volume;this.gainNode.gain.setValueAtTime(e,this.audioCtx.currentTime)}}setMuted(t){if(this.isMuted=!!t,this.gainNode&&this.audioCtx){const e=this.isMuted?0:this.volume;this.gainNode.gain.setValueAtTime(e,this.audioCtx.currentTime)}this.dispatchEvent(new CustomEvent("mute:change",{detail:{isMuted:this.isMuted}}))}toggleMute(){return this.setMuted(!this.isMuted),this.isMuted}clear(){this.stopPlayback(),this.audioChunks=[],this.audioBuffer=null,this.loopDurationMs=0,this.dispatchEvent(new CustomEvent("cleared"))}exportWavBase64(){if(!this.audioBuffer)return null;try{const t=this.audioBuffer,e=Math.min(2,t.numberOfChannels),i=t.sampleRate,s=1,r=16,a=r/8,o=e*a,c=t.length,l=c*o,u=44+l,d=new ArrayBuffer(u),f=new DataView(d),g=(_,w)=>{for(let b=0;b<w.length;b++)f.setUint8(_+b,w.charCodeAt(b))};g(0,"RIFF"),f.setUint32(4,36+l,!0),g(8,"WAVE"),g(12,"fmt "),f.setUint32(16,16,!0),f.setUint16(20,s,!0),f.setUint16(22,e,!0),f.setUint32(24,i,!0),f.setUint32(28,i*o,!0),f.setUint16(32,o,!0),f.setUint16(34,r,!0),g(36,"data"),f.setUint32(40,l,!0);let v=44;const m=[];for(let _=0;_<e;_++)m.push(t.getChannelData(_));for(let _=0;_<c;_++)for(let w=0;w<e;w++){let b=Math.max(-1,Math.min(1,m[w][_]));b=b<0?b*32768:b*32767,f.setInt16(v,b,!0),v+=2}let p="";const S=new Uint8Array(d),x=32768;for(let _=0;_<S.length;_+=x)p+=String.fromCharCode.apply(null,S.subarray(_,_+x));return"data:audio/wav;base64,"+btoa(p)}catch(t){return console.warn("Failed to export audio to WAV base64:",t),null}}}class e3{constructor(t={}){this.targetFps=t.fps||30,this.maxDurationSec=t.maxDuration||35,this.isCancelled=!1}cancel(){this.isCancelled=!0}async extract(t,e,i,s,r=null){if(this.isCancelled=!1,!t)throw new Error("No video file provided");r&&r({percent:2,message:"Lecture du fichier et décodage audio...",frame:0,totalFrames:0});let a=null;try{const l=await s.ensureAudioContext(),h=await t.arrayBuffer();a=await l.decodeAudioData(h.slice(0)),console.log(`Audio extracted from video: ${a.duration.toFixed(2)}s, ${a.numberOfChannels} ch, ${a.sampleRate}Hz`)}catch(l){console.warn("Video has no decodable audio track or format not supported:",l),a=null}if(this.isCancelled)throw new Error("Extraction cancelled");r&&r({percent:8,message:"Chargement de la vidéo...",frame:0,totalFrames:0});const o=document.createElement("video");o.muted=!0,o.playsInline=!0,o.preload="auto",o.crossOrigin="anonymous";const c=URL.createObjectURL(t);o.src=c;try{await new Promise((x,_)=>{const w=()=>{o.removeEventListener("loadedmetadata",w),o.removeEventListener("error",b),x()},b=A=>{o.removeEventListener("loadedmetadata",w),o.removeEventListener("error",b),_(new Error("Failed to load video file: Unsupported codec or format"))};o.addEventListener("loadedmetadata",w),o.addEventListener("error",b)});const l=Math.min(o.duration||10,this.maxDurationSec);if(l<=.1||!isFinite(l))throw new Error("Invalid video duration");const h=(o.videoWidth||1280)/(o.videoHeight||720);i.setAspectRatio(h);const u=1/this.targetFps,d=Math.max(2,Math.floor(l*this.targetFps)),f=[];let g=null,v=null,m=null;const p=x=>new Promise(_=>{let w=!1;const b=()=>{w||(w=!0,o.removeEventListener("seeked",b),_())};o.addEventListener("seeked",b,{once:!0}),o.currentTime=Math.max(0,Math.min(x,o.duration-.001)),setTimeout(()=>{w||(w=!0,o.removeEventListener("seeked",b),_())},350)});r&&r({percent:10,message:`Extraction des expressions (0 / ${d})...`,frame:0,totalFrames:d});for(let x=0;x<d;x++){if(this.isCancelled)throw new Error("Extraction cancelled");const _=x*u;await p(_);const w=Math.round(_*1e3),b=e.processExternalFrame(o,w);if(b&&b.detected&&b.landmarks){const R=i.extractRigidFrame(b.landmarks);if(R){const M=i.smoothRigidFrame(R,!0),y=i.toLocalCoordinates(b.landmarks,M);us(y),g=y,v=b.blendshapes,m=b.headPose?{...b.headPose}:null,f.push({timeOffsetMs:w,localCoords:y,blendshapes:b.blendshapes,headPose:b.headPose?{...b.headPose}:null})}}else g&&f.push({timeOffsetMs:w,localCoords:g.map(R=>({x:R.x,y:R.y,z:R.z})),blendshapes:{...v},headPose:m?{...m}:null});const A=Math.min(95,Math.round(10+x/d*85));r&&(x%2===0||x===d-1)&&r({percent:A,message:`Extraction des expressions (${x+1} / ${d})...`,frame:x+1,totalFrames:d})}if(f.length<2)throw new Error("No face detected in video. Ensure the face is clearly visible.");r&&r({percent:100,message:"Optimisation du bouclage et lissage 5-tap...",frame:d,totalFrames:d});const S=l*1e3;return{frames:f,durationMs:S,audioBuffer:a,aspectRatio:h}}finally{URL.revokeObjectURL(c),o.src="",o.load()}}}class n3 extends EventTarget{constructor(){super(),this.isActive=!1,this.hasSeenFace=!1,this.isMirrored=!0,this.baseLandmarks=null,this.lastHeadPose=null,this.lastAutonomousLandmarks=null,this.lastAutonomousHeadPose=null,this.currentGaze={x:0,y:0},this.targetGaze={x:0,y:0},this.fromGaze={x:0,y:0},this.saccadeStartTime=0,this.saccadeDuration=65,this.isSaccading=!1,this.currentHead={pitch:0,yaw:0,roll:0},this.targetHead={pitch:0,yaw:0,roll:0},this.currentDamping=.038,this.targetDamping=.038,this.nextPOITime=0,this.currentTrans={x:0,y:0,z:0},this.targetTrans={x:0,y:0,z:0},this.transDamping=.032,this.isTransitioningToAutonomous=!1,this.transToAutoStartTime=0,this.transToAutoDuration=850,this.transFromLandmarks=null,this.currentRhythmMode="CAMERA_CONTACT",this.consecutiveOffCenterLooks=0,this.doubleSaccadePending=!1,this.doubleSaccadeTarget=null,this.doubleSaccadeTime=0,this.currentProceduralExpressions={jawOpen:0,smileL:0,smileR:0,browL:0,browR:0,pucker:0},this.targetProceduralExpressions={jawOpen:0,smileL:0,smileR:0,browL:0,browR:0,pucker:0},this.browPulseTime=0,this.browPulseIntensity=0,this.isBlinking=!1,this.blinkStartTime=0,this.blinkDuration=150,this.nextBlinkTime=performance.now()+2500,this.matrixHelper=new Ee,this.eulerHelper=new mn(0,0,0,"YXZ"),this.rotVec=new k,this.cranial=new Vh,this.EYE_R_UPPER=[33,246,161,160,159,158,157,173,133],this.EYE_R_LOWER=[33,7,163,144,145,153,154,155,133],this.EYE_R_CREASE=[22,23,24,110,25],this.EYE_L_UPPER=[263,466,388,387,386,385,384,398,362],this.EYE_L_LOWER=[263,249,390,373,374,380,381,382,362],this.EYE_L_CREASE=[252,253,254,339,255],this.EYELID_R_TOP=this.EYE_R_UPPER,this.EYELID_R_BOT=this.EYE_R_LOWER,this.EYELID_L_TOP=this.EYE_L_UPPER,this.EYELID_L_BOT=this.EYE_L_LOWER,this.EYEBROW_R=new Set([70,63,105,66,107,55,65,52,53,46]),this.EYEBROW_L=new Set([300,293,334,296,336,285,295,282,283,276]),this.animLibrary=null,this.autonomousSubMode="PROCEDURAL",this.activeAnimation=null,this.animStartTime=0,this.animFadeDuration=600,this.nextAnimationDecisionTime=0,this.lastPlayedAnimName="",this.consecutiveProceduralCycles=0,this.audioCtx=null,this.audioGainNode=null,this.activeAudioSource=null,this.audioPlaybackStartTime=0,this.audioPlaybackPerfNow=0,this.currentAudio=null,this.audioDelaySec=2.2,this.lastRenderedPitch=0,this.lastRenderedYaw=0,this.lastRenderedRoll=0,this.lastRenderedTransX=0,this.lastRenderedTransY=0,this.lastRenderedTransZ=0,this.lastRenderedGazeX=0,this.lastRenderedGazeY=0,this.lastRenderedLandmarks=null,this.animTransitionFrom=null,this.isFadingInProcedural=!1,this.proceduralFadeStartTime=0,this.proceduralFadeDuration=800,this.lastEffHeadPose={pitch:0,yaw:0,roll:0},this.lastEffTrans={x:0,y:0,z:0},this.animEntryHead={pitch:0,yaw:0,roll:0},this.animEntryTrans={x:0,y:0,z:0},this.rigidSkull=new Set([10,21,54,58,67,93,103,109,127,234,251,284,288,297,323,332,338,356,454,168,6,133,362]),this.mandible=new Set([132,136,148,149,150,152,172,175,176,199,200,361,365,377,378,379,400]),this.ring1=new Set([34,68,69,71,104,108,135,137,138,139,140,151,169,170,171,177,215,227,264,298,299,301,333,337,364,366,367,368,369,394,395,396,401,435,447])}setAudioContext(t){if(this.audioCtx=t,this.audioCtx&&!this.audioGainNode)try{this.audioGainNode=this.audioCtx.createGain(),this.audioGainNode.gain.setValueAtTime(.95,this.audioCtx.currentTime),this.audioGainNode.connect(this.audioCtx.destination)}catch(e){console.warn("[AutonomousGaze] GainNode setup error:",e)}}ensureAudioContext(){if(!this.audioCtx){const t=typeof window<"u"?window.AudioContext||window.webkitAudioContext:null;t&&this.setAudioContext(new t)}return this.audioCtx&&this.audioCtx.state==="suspended"&&this.audioCtx.resume(),this.audioCtx}setAnimationLibrary(t){this.animLibrary=t}setMirrored(t){this.isMirrored=!!t}setAspectRatio(t){this.cranial.setAspectRatio(t)}setAudioDelay(t){this.audioDelaySec=Math.max(0,Math.min(4,Number(t)||0))}getCurrentSubMode(){return this.autonomousSubMode}getActiveAnimationName(){return this.activeAnimation?this.activeAnimation.name:null}resetAutonomousMemory(){if(this.baseLandmarks=null,this.lastHeadPose=null,this.lastAutonomousLandmarks=null,this.lastAutonomousHeadPose=null,this.hasSeenFace=!1,this.currentHead={pitch:0,yaw:0,roll:0},this.targetHead={pitch:0,yaw:0,roll:0},this.currentTrans={x:0,y:0,z:0},this.targetTrans={x:0,y:0,z:0},this.currentGaze={x:0,y:0},this.targetGaze={x:0,y:0},this.fromGaze={x:0,y:0},this.isSaccading=!1,this.isTransitioningToAutonomous=!1,this.transFromLandmarks=null,this.currentAudio){try{this.currentAudio.pause()}catch{}this.currentAudio=null}this.autonomousSubMode="PROCEDURAL",this.activeAnimation=null,this.lastPlayedAnimName="",this.consecutiveProceduralCycles=0}setBaseLandmarks(t){if(!t){this.baseLandmarks=null;return}this.baseLandmarks=t.map(e=>({x:e.x,y:e.y,z:e.z||0,visibility:e.visibility})),this.hasSeenFace=!0}updateLiveFace(t){!t||!t.detected||!t.landmarks||(this.hasSeenFace=!0,t.headPose&&(this.lastHeadPose={...t.headPose}))}startAutonomous(t=performance.now(),e=null,i=null){this.isActive=!0,e&&e.length>0?(this.transFromLandmarks=e.map(h=>({x:h.x,y:h.y,z:h.z||0,visibility:h.visibility})),this.isTransitioningToAutonomous=!0,this.transToAutoStartTime=t,this.transToAutoDuration=850):(this.isTransitioningToAutonomous=!1,this.transFromLandmarks=null);const s=Number(i==null?void 0:i.pitch)||0,r=Number(i==null?void 0:i.yaw)||0,a=Number(i==null?void 0:i.roll)||0,o=(Number(i==null?void 0:i.x)||0)/1280,c=(Number(i==null?void 0:i.y)||0)/720,l=(Number(i==null?void 0:i.z)||0)/1280;this.currentHead={pitch:s,yaw:r,roll:a},this.targetHead={pitch:0,yaw:0,roll:0},this.currentTrans={x:o,y:c,z:l},this.targetTrans={x:0,y:0,z:0},this.currentGaze={x:0,y:0},this.targetGaze={x:0,y:0},this.fromGaze={x:0,y:0},this.isSaccading=!1,this.currentDamping=.04,this.transDamping=.035,this.autonomousSubMode="PROCEDURAL",this.activeAnimation=null,this.nextPOITime=t+1100,this.nextBlinkTime=t+1200+Math.random()*1500,this.nextAnimationDecisionTime=t+3500+Math.random()*1e3,this.consecutiveProceduralCycles=0}stopAutonomous(){this.isActive=!1,this.isTransitioningToAutonomous=!1,this.stopAudio(),this.autonomousSubMode="PROCEDURAL",this.activeAnimation=null,this.consecutiveProceduralCycles=0}stopAudio(){if(this.activeAudioSource){try{this.activeAudioSource.stop(),this.activeAudioSource.disconnect()}catch{}this.activeAudioSource=null}if(this.currentAudio){try{this.currentAudio.pause()}catch{}this.currentAudio=null}}playAnimation(t,e=performance.now()){return!t||!t.frames||t.frames.length===0?!1:(this.startAnimationPlayback(t,e),!0)}startAnimationPlayback(t,e){this.stopAudio(),this.ensureAudioContext();const i=Math.max(0,Math.min(4,this.audioDelaySec??2.2));if(t._audioBuffer&&this.audioCtx)try{const s=this.audioCtx.createBufferSource();s.buffer=t._audioBuffer,s.connect(this.audioGainNode);const r=this.audioCtx.currentTime+i;s.start(r),this.activeAudioSource=s,this.audioPlaybackStartTime=r,this.audioPlaybackPerfNow=e+i*1e3}catch(s){console.warn("[AutonomousGaze] Web Audio buffer playback error:",s)}else t.hasAudio&&t.audioData&&this.animLibrary&&this.animLibrary.decodeAudioBuffer(t).then(s=>{if(s&&this.activeAnimation===t&&this.audioCtx)try{const r=this.audioCtx.createBufferSource();r.buffer=s,r.connect(this.audioGainNode);const a=Math.max(0,(performance.now()-this.animStartTime)/1e3);if(a<i){const o=i-a,c=this.audioCtx.currentTime+o;r.start(c,0),this.activeAudioSource=r,this.audioPlaybackStartTime=c}else{const o=a-i;if(o<s.duration){const c=this.audioCtx.currentTime;r.start(c,o),this.activeAudioSource=r,this.audioPlaybackStartTime=c-o}}}catch(r){console.warn("[AutonomousGaze] Late audio start error:",r)}});if(!t._baselineHeadPose){let s=null;if(t.referenceHeadPose)s={...t.referenceHeadPose};else if(t.referenceLocal&&t.frames&&t.frames.length>0){let r=1/0;for(let a=0;a<t.frames.length;a++){const o=t.frames[a];if(!o.localCoords||!o.headPose)continue;let c=0;const l=[13,14,1,33,263,61,291];for(let h=0;h<l.length;h++){const u=l[h],d=o.localCoords[u],f=t.referenceLocal[u];d&&f&&(c+=Math.hypot(d.x-f.x,d.y-f.y))}c<r&&(r=c,s=o.headPose)}}if(!s&&t.frames){let r=0,a=0,o=0,c=0,l=0,h=0,u=0;for(let d=0;d<t.frames.length;d++){const f=t.frames[d].headPose;f&&(r+=f.pitch||0,a+=f.yaw||0,o+=f.roll||0,c+=f.x||0,l+=f.y||0,h+=f.z||0,u++)}u>0&&(s={pitch:r/u,yaw:a/u,roll:o/u,x:c/u,y:l/u,z:h/u})}t._baselineHeadPose=s||{pitch:0,yaw:0,roll:0,x:0,y:0,z:0}}this.animTransitionFrom={head:{pitch:this.lastRenderedPitch||0,yaw:this.lastRenderedYaw||0,roll:this.lastRenderedRoll||0},trans:{x:this.lastRenderedTransX||0,y:this.lastRenderedTransY||0,z:this.lastRenderedTransZ||0},gaze:{x:this.lastRenderedGazeX||0,y:this.lastRenderedGazeY||0},landmarks:this.lastRenderedLandmarks?this.lastRenderedLandmarks.map(s=>({...s})):null},this.animEntryHead={...this.animTransitionFrom.head},this.animEntryTrans={...this.animTransitionFrom.trans},this.animEntryGaze={...this.animTransitionFrom.gaze},this.activeAnimation=t,this.animStartTime=e,this.animFadeDuration=Math.min(700,Math.max(500,Math.round(t.durationMs*.18))),this.autonomousSubMode="RECORDED_ANIM",this.lastPlayedAnimName=t.name,this.isFadingInProcedural=!1,this.dispatchEvent(new CustomEvent("animation:start",{detail:{name:t.name,durationMs:t.durationMs,frameCount:t.frameCount}}))}stopAnimationPlayback(t){this.stopAudio();const e=this.lastPlayedAnimName;this.autonomousSubMode="PROCEDURAL",this.activeAnimation=null,this.currentHead={pitch:this.lastRenderedPitch||0,yaw:this.lastRenderedYaw||0,roll:this.lastRenderedRoll||0},this.targetHead={...this.currentHead},this.currentTrans={x:this.lastRenderedTransX||0,y:this.lastRenderedTransY||0,z:this.lastRenderedTransZ||0},this.targetTrans={...this.currentTrans},this.currentGaze={x:this.lastRenderedGazeX||0,y:this.lastRenderedGazeY||0},this.targetGaze={...this.currentGaze},this.fromGaze={...this.currentGaze},this.isSaccading=!1,this.isFadingInProcedural=!0,this.proceduralFadeStartTime=t,this.proceduralFadeDuration=800,this.nextPOITime=t+1400+Math.random()*800,this.nextAnimationDecisionTime=t+3500+Math.random()*1500,this.dispatchEvent(new CustomEvent("animation:end",{detail:{name:e}}))}scheduleNextPOI(t,e=!1,i=null){this.consecutiveOffCenterLooks=this.consecutiveOffCenterLooks||0;const s=this.consecutiveOffCenterLooks>=5,r=Math.random();let a,o,c,l,h=0,u=0,d=0;if(s||r<.14)this.currentRhythmMode="CAMERA_CONTACT",this.consecutiveOffCenterLooks=0,this.targetDamping=.038,this.transDamping=.032,a=1200+Math.random()*900,this.browPulseIntensity=.0035,o=(Math.random()-.5)*6,c=(Math.random()-.4)*5,l=(Math.random()-.5)*2.5,h=(Math.random()-.5)*.05,u=(Math.random()-.5)*.05,d=.04+Math.random()*.05,this.targetGaze={x:(Math.random()-.5)*.08,y:(Math.random()-.5)*.06},this.targetProceduralExpressions={jawOpen:.02,smileL:.16+Math.random()*.1,smileR:.16+Math.random()*.1,browL:.08,browR:.08,pucker:0};else if(r<.42){this.currentRhythmMode="SEARCHING_WIDE",this.consecutiveOffCenterLooks++,this.targetDamping=.052,this.transDamping=.04,a=950+Math.random()*850,this.browPulseIntensity=.0065;const f=Math.random()>.5?1:-1;o=f*(22+Math.random()*16),c=(Math.random()-.4)*24,l=-f*(4+Math.random()*6),h=f*(.12+Math.random()*.08),u=(Math.random()-.5)*.16,d=(Math.random()-.5)*.12,this.targetGaze={x:f*(.28+Math.random()*.12),y:Math.max(-.35,Math.min(.35,c/20*.38+(Math.random()-.5)*.1))},this.targetProceduralExpressions={jawOpen:.09+Math.random()*.06,smileL:.04,smileR:.04,browL:.26+Math.random()*.15,browR:.26+Math.random()*.15,pucker:0}}else if(r<.68){this.currentRhythmMode="INQUISITIVE_SCAN",this.consecutiveOffCenterLooks++,this.targetDamping=.048,this.transDamping=.038,a=1100+Math.random()*850,this.browPulseIntensity=.0075;const f=Math.random()>.5?1:-1;o=f*(18+Math.random()*18),c=(Math.random()-.35)*20,l=-o*.24+(Math.random()-.5)*8,h=f*(.1+Math.random()*.06),u=(Math.random()-.5)*.14,d=(Math.random()-.3)*.1,this.targetGaze={x:f*(.24+Math.random()*.12),y:Math.max(-.28,Math.min(.32,c/18*.35))},this.targetProceduralExpressions={jawOpen:.1+Math.random()*.07,smileL:f>0?.03:.22+Math.random()*.12,smileR:f>0?.22+Math.random()*.12:.03,browL:f>0?.15:.45+Math.random()*.18,browR:f>0?.45+Math.random()*.18:.15,pucker:0}}else r<.82?(this.currentRhythmMode="DOUBLE_SACCADE",this.consecutiveOffCenterLooks++,this.targetDamping=.05,this.transDamping=.036,a=380+Math.random()*220,this.doubleSaccadePending=!0,this.doubleSaccadeTime=t+a,this.browPulseIntensity=.006,o=(Math.random()-.5)*36,c=(Math.random()-.45)*24,l=-o*.18,h=(Math.random()-.5)*.18,u=(Math.random()-.5)*.16,d=(Math.random()-.5)*.08,this.targetGaze={x:Math.max(-.35,Math.min(.35,o/22*.35)),y:Math.max(-.3,Math.min(.3,c/16*.35))},this.targetProceduralExpressions={jawOpen:.1+Math.random()*.05,smileL:.05,smileR:.05,browL:.35+Math.random()*.15,browR:.35+Math.random()*.15,pucker:0}):r<.92?(this.currentRhythmMode="UPWARD_THINKING",this.consecutiveOffCenterLooks++,this.targetDamping=.032,this.transDamping=.026,a=1300+Math.random()*800,this.browPulseIntensity=.0065,o=(Math.random()-.5)*30,c=16+Math.random()*16,l=(Math.random()-.5)*8,h=(Math.random()-.5)*.18,u=-.1-Math.random()*.08,d=-.06-Math.random()*.08,this.targetGaze={x:Math.max(-.28,Math.min(.28,o/20*.32)),y:.22+Math.random()*.14},this.targetProceduralExpressions={jawOpen:.08+Math.random()*.06,smileL:.02,smileR:.02,browL:.42+Math.random()*.15,browR:.42+Math.random()*.15,pucker:.14+Math.random()*.1}):(this.currentRhythmMode="DOWNWARD_SEARCH",this.consecutiveOffCenterLooks++,this.targetDamping=.034,this.transDamping=.028,a=1e3+Math.random()*800,this.browPulseIntensity=.005,o=(Math.random()-.5)*32,c=-14-Math.random()*12,l=-o*.14+(Math.random()-.5)*5,h=(Math.random()-.5)*.16,u=.08+Math.random()*.08,d=.02+Math.random()*.06,this.targetGaze={x:Math.max(-.28,Math.min(.28,o/20*.32)),y:-.2-Math.random()*.12},this.targetProceduralExpressions={jawOpen:.08+Math.random()*.05,smileL:.04,smileR:.04,browL:.18,browR:.18,pucker:0});i&&(a=i),this.fromGaze={...this.currentGaze},this.saccadeStartTime=t,this.saccadeDuration=e?15:45+Math.random()*30,this.isSaccading=!0,this.browPulseTime=t,this.targetHead={pitch:c*.85,yaw:o*.9,roll:l},this.targetTrans={x:h,y:u,z:d},this.nextPOITime=t+a}triggerSecondarySaccade(t){this.doubleSaccadePending=!1,this.fromGaze={...this.currentGaze};const e=(Math.random()-.5)*.2,i=(Math.random()-.4)*.16;this.targetGaze.x=Math.max(-.35,Math.min(.35,this.currentGaze.x+e)),this.targetGaze.y=Math.max(-.32,Math.min(.32,this.currentGaze.y+i)),this.saccadeStartTime=t,this.saccadeDuration=40+Math.random()*25,this.isSaccading=!0,this.browPulseTime=t,this.browPulseIntensity=.007,this.targetDamping=.038,this.nextPOITime=t+(1100+Math.random()*900)}sampleAnimationAtTime(t,e){if(!t||!t.frames||t.frames.length===0)return null;const i=t.frames,s=i.length;if(s===1||e<=i[0].timeOffsetMs)return i[0];if(e>=i[s-1].timeOffsetMs)return i[s-1];let r=0,a=s-1;for(;r<=a;){const x=r+a>>1;i[x].timeOffsetMs<=e?r=x+1:a=x-1}const o=Math.max(0,a),c=Math.min(s-1,o+1),l=i[o],h=i[c];if(o===c||!l||!h)return l||h;const u=h.timeOffsetMs-l.timeOffsetMs,d=u>0?(e-l.timeOffsetMs)/u:0;let f=null;l.headPose&&h.headPose?f={pitch:l.headPose.pitch+(h.headPose.pitch-l.headPose.pitch)*d,yaw:l.headPose.yaw+(h.headPose.yaw-l.headPose.yaw)*d,roll:l.headPose.roll+(h.headPose.roll-l.headPose.roll)*d,x:(l.headPose.x||0)+((h.headPose.x||0)-(l.headPose.x||0))*d,y:(l.headPose.y||0)+((h.headPose.y||0)-(l.headPose.y||0))*d,z:(l.headPose.z||0)+((h.headPose.z||0)-(l.headPose.z||0))*d}:f=l.headPose||h.headPose;const g=l.blendshapes||{},v=h.blendshapes||{},m=new Set([...Object.keys(g),...Object.keys(v)]),p={};for(const x of m){const _=g[x]||0,w=v[x]||0;p[x]=_+(w-_)*d}let S=null;if(l.localCoords&&h.localCoords&&l.localCoords.length===h.localCoords.length){const x=l.localCoords.length;S=new Array(x);for(let _=0;_<x;_++){const w=l.localCoords[_],b=h.localCoords[_];S[_]={x:w.x+(b.x-w.x)*d,y:w.y+(b.y-w.y)*d,z:w.z+(b.z-w.z)*d}}}else S=l.localCoords||h.localCoords;return{headPose:f,blendshapes:p,localCoords:S}}applyEyelidClosure(t,e=0,i=0){if(!(!t||t.length<468)){if(e>.005){const s=Math.min(1,e),r=Math.min(this.EYE_R_UPPER.length,this.EYE_R_LOWER.length);for(let o=0;o<r;o++){const c=this.EYE_R_UPPER[o],l=this.EYE_R_LOWER[o],h=t[c],u=t[l];if(!h||!u)continue;const d=o===0||o===r-1?.22:o===1||o===r-2?.68:1,f=s*d,g=u.y*.82+h.y*.18,v=Math.max(h.z||0,u.z||0);h.y+=(g-h.y)*f,u.y+=(g-u.y)*(f*.85),h.z!==void 0&&u.z!==void 0&&(h.z+=(v-h.z)*(f*.5),u.z+=(v-u.z)*(f*.5))}const a=s*.012;for(let o=0;o<this.EYE_R_CREASE.length;o++){const c=t[this.EYE_R_CREASE[o]];c&&(c.y+=a)}}if(i>.005){const s=Math.min(1,i),r=Math.min(this.EYE_L_UPPER.length,this.EYE_L_LOWER.length);for(let o=0;o<r;o++){const c=this.EYE_L_UPPER[o],l=this.EYE_L_LOWER[o],h=t[c],u=t[l];if(!h||!u)continue;const d=o===0||o===r-1?.22:o===1||o===r-2?.68:1,f=s*d,g=u.y*.82+h.y*.18,v=Math.max(h.z||0,u.z||0);h.y+=(g-h.y)*f,u.y+=(g-u.y)*(f*.85),h.z!==void 0&&u.z!==void 0&&(h.z+=(v-h.z)*(f*.5),u.z+=(v-u.z)*(f*.5))}const a=s*.012;for(let o=0;o<this.EYE_L_CREASE.length;o++){const c=t[this.EYE_L_CREASE[o]];c&&(c.y+=a)}}}}applyBlendshapesToLandmarks(t,e,i,s){if(!t)return null;const r=t.length,a=new Array(r);for(let w=0;w<r;w++){const b=t[w];a[w]={x:b.x,y:b.y,z:b.z||0,visibility:b.visibility}}if(!e)return a;const o=i/Math.max(1,s),c=e.mouthSmileLeft||0,l=e.mouthSmileRight||0,h=(c+l)*.5,u=e.jawOpen||0,d=e.mouthPucker||0,f=e.mouthFunnel||0,g=[61,76,77,78,95];for(let w=0;w<g.length;w++){const b=g[w];a[b]&&(a[b].x-=c*.038*o,a[b].y-=c*.028)}const v=[291,306,307,308,324];for(let w=0;w<v.length;w++){const b=v[w];a[b]&&(a[b].x+=l*.038*o,a[b].y-=l*.028)}const m=[0,11,12,13,14,15,16,17,37,39,40,84,85,86,87,88,267,269,270,314,315,316,317,318];for(let w=0;w<m.length;w++){const b=m[w];a[b]&&(a[b].y-=h*.012)}if(u>.005){const w=[14,15,16,17,84,85,86,87,88,91,95,146,178,179,180,181,314,315,316,317,318,321,324,375,402,403,405];for(let A=0;A<w.length;A++){const R=w[A];a[R]&&(a[R].y+=u*.065)}const b=[{idx:152,w:1},{idx:175,w:.95},{idx:199,w:.95},{idx:200,w:.95},{idx:18,w:.9},{idx:377,w:.85},{idx:148,w:.85},{idx:400,w:.7},{idx:176,w:.7},{idx:378,w:.5},{idx:149,w:.5}];for(let A=0;A<b.length;A++){const{idx:R,w:M}=b[A];a[R]&&(a[R].y+=u*.06*M)}}if(f>.01){const w=[61,291];for(const b of w)a[b]&&(a[b].x*=.98);for(const b of[13,14])a[b]&&(a[b].y+=(b===14?.02:-.02)*f)}if(d>.01)for(const w of[61,291])a[w]&&(a[w].x+=(w===61?1:-1)*d*.02*o);const p=Math.max(e.browOuterUpRight||0,e.browInnerUp||0),S=Math.max(e.browOuterUpLeft||0,e.browInnerUp||0);p>.005&&this.EYEBROW_R.forEach(w=>{a[w]&&(a[w].y-=p*.016)}),S>.005&&this.EYEBROW_L.forEach(w=>{a[w]&&(a[w].y-=S*.016)});const x=e.eyeBlinkLeft||0,_=e.eyeBlinkRight||0;return(x>.005||_>.005)&&this.applyEyelidClosure(a,_,x),a}generateFrame(t=performance.now(),e=1280,i=720){var de,F,lt,Y;if(!this.baseLandmarks||this.baseLandmarks.length===0)return null;const s=e/Math.max(1,i);if(this.cranial.setAspectRatio(s),this.autonomousSubMode==="PROCEDURAL"){if(this.doubleSaccadePending&&t>=this.doubleSaccadeTime?this.triggerSecondarySaccade(t):t>=this.nextPOITime&&this.scheduleNextPOI(t),this.currentDamping+=(this.targetDamping-this.currentDamping)*.08,this.isSaccading){const O=t-this.saccadeStartTime;if(O>=this.saccadeDuration)this.currentGaze={...this.targetGaze},this.isSaccading=!1;else{const q=O/this.saccadeDuration,J=q*q*(3-2*q);this.currentGaze.x=this.fromGaze.x+(this.targetGaze.x-this.fromGaze.x)*J,this.currentGaze.y=this.fromGaze.y+(this.targetGaze.y-this.fromGaze.y)*J}}else{const O=Math.sin(t*.009)*.007,q=Math.cos(t*.012)*.005;this.currentGaze.x=this.targetGaze.x+O,this.currentGaze.y=this.targetGaze.y+q}this.currentHead.pitch+=(this.targetHead.pitch-this.currentHead.pitch)*this.currentDamping,this.currentHead.yaw+=(this.targetHead.yaw-this.currentHead.yaw)*this.currentDamping,this.currentHead.roll+=(this.targetHead.roll-this.currentHead.roll)*this.currentDamping,this.currentTrans.x+=(this.targetTrans.x-this.currentTrans.x)*this.transDamping,this.currentTrans.y+=(this.targetTrans.y-this.currentTrans.y)*this.transDamping,this.currentTrans.z+=(this.targetTrans.z-this.currentTrans.z)*this.transDamping}const r=t*.00165,a=Math.sin(r)*1.2,o=Math.cos(r*.65)*.55,c=t*.001,l=Math.sin(c*1.3)*2.2+Math.cos(c*2.9)*1.1,h=Math.cos(c*1)*3+Math.sin(c*2.4)*1.5,u=Math.sin(c*.8)*1.8+Math.cos(c*2.1)*.8,d=Math.sin(c*.72)*.038+Math.cos(c*1.55)*.02,f=Math.cos(c*.62)*.032+Math.sin(c*1.8)*.016,g=Math.sin(c*.8)*.035+Math.cos(c*1.4)*.022;let v=1;if(this.isTransitioningToAutonomous&&this.transFromLandmarks){const O=t-this.transToAutoStartTime;if(O<this.transToAutoDuration){const q=Math.max(0,Math.min(1,O/this.transToAutoDuration));v=q*q*q*(q*(q*6-15)+10)}else this.isTransitioningToAutonomous=!1,this.transFromLandmarks=null,v=1}let m=1;if(this.isFadingInProcedural){const O=t-this.proceduralFadeStartTime;if(O<this.proceduralFadeDuration){const q=O/this.proceduralFadeDuration;m=q*q*(3-2*q)}else this.isFadingInProcedural=!1,m=1}const p=(this.isTransitioningToAutonomous?v:1)*m,S=this.currentHead.pitch+(a+l)*p,x=this.currentHead.yaw+h*p,_=this.currentHead.roll+(o+u)*p,w=this.currentTrans.x+d*p,b=this.currentTrans.y+f*p,A=this.currentTrans.z+g*p,R=-(x*75e-5)-w*.7,M=S*75e-5-b*.7,y=this.currentGaze.x+R,L=this.currentGaze.y+M;let B=0;if(t>=this.nextBlinkTime&&!this.isBlinking&&(this.isBlinking=!0,this.blinkStartTime=t,this.blinkDuration=140+Math.random()*40),this.isBlinking){const O=t-this.blinkStartTime;if(O>=this.blinkDuration){this.isBlinking=!1;const q=Math.random()<.15;this.nextBlinkTime=t+(q?200:2600+Math.random()*3600)}else{const q=O/this.blinkDuration;B=Math.sin(q*Math.PI),B=Math.pow(B,1.3)}}const D=this.isMirrored?-1:1,N=Math.max(0,L)*.005,j=_*D*3e-4,W=Math.sin(t*.0018)*.0016+Math.cos(t*9e-4)*.001;let Q=0;const V=t-this.browPulseTime;if(V<750){const O=V/750;Q=Math.sin(O*Math.PI)*this.browPulseIntensity}const tt=Math.max(-.003,Math.min(.012,N+j+W+Q)),ot=Math.max(-.003,Math.min(.012,N-j+W+Q));if(this.autonomousSubMode==="PROCEDURAL"&&t>=this.nextAnimationDecisionTime)if(this.animLibrary&&this.animLibrary.isAutonomousPlaybackEnabled&&this.animLibrary.getActiveAnimationCount()>0)if(Math.random()<.5){const q=this.animLibrary.getRandomAnimationSync();q&&q.durationMs>300&&q.frames&&q.frames.length>0?this.startAnimationPlayback(q,t):this.nextAnimationDecisionTime=t+3e3}else this.nextAnimationDecisionTime=t+3500+Math.random()*1500;else this.nextAnimationDecisionTime=t+3500;let nt=0,dt=null;if(this.autonomousSubMode==="RECORDED_ANIM"&&this.activeAnimation){const O=this.activeAnimation;let q=t-this.animStartTime;const J=(this.audioDelaySec??2.2)*1e3,mt=O._audioBuffer?O._audioBuffer.duration*1e3:0,Ot=Math.max(O.durationMs,J+mt),Zt=this.animFadeDuration,Rt=Ot+Zt;if(q>=Rt)this.stopAnimationPlayback(t);else{if(q<Zt){const ee=Math.max(0,Math.min(1,q/Zt));nt=ee*ee*ee*(ee*(ee*6-15)+10)}else if(q<Ot)nt=1;else{const ee=q-Ot,ge=Math.max(0,Math.min(1,1-ee/Zt));nt=ge*ge*ge*(ge*(ge*6-15)+10)}const Kt=Math.min(O.durationMs,q);dt=this.sampleAnimationAtTime(O,Kt)}}let Vt=0,X=0,Z=0,ct=0,it=0,xt=0,Et=null;if(dt&&nt>1e-4){const O=this.activeAnimation,q=(O==null?void 0:O._baselineHeadPose)||{pitch:0,yaw:0,roll:0,x:0,y:0,z:0},J=dt.headPose;if(J)Vt=(J.pitch||0)-(q.pitch||0),X=(J.yaw||0)-(q.yaw||0),Z=(J.roll||0)-(q.roll||0),ct=((J.x||0)-(q.x||0))*.022,it=((J.y||0)-(q.y||0))*.022,xt=((J.z||0)-(q.z||0))*.022;else if(dt.blendshapes){const mt=dt.blendshapes,Ot=mt.jawOpen||0,Zt=mt.browInnerUp||0,Rt=(mt.mouthSmileRight||0)-(mt.mouthSmileLeft||0);Vt=-Ot*5+Zt*2.5,X=Rt*6,Z=Rt*3,ct=Rt*.015,it=-Ot*.012}if(Vt=Math.max(-35,Math.min(35,Vt)),X=Math.max(-42,Math.min(42,X)),Z=Math.max(-28,Math.min(28,Z)),ct=Math.max(-.12,Math.min(.12,ct)),it=Math.max(-.12,Math.min(.12,it)),xt=Math.max(-.12,Math.min(.12,xt)),dt.localCoords&&dt.localCoords.length>=468){const mt=this.cranial.extractRigidFrame(this.baseLandmarks);if(mt){const Ot=this.cranial.toLocalCoordinates(this.baseLandmarks,mt);let Zt=O.referenceLocal;Zt||(Zt=((de=O.frames[0])==null?void 0:de.localCoords)||Ot);const Rt=Math.min(this.baseLandmarks.length,dt.localCoords.length),Kt=new Array(Rt),ee=Ot[33],ge=Ot[133],ii=ee&&ge?Math.hypot(ee.x-ge.x,ee.y-ge.y):.8,_n=Ot[263],cn=Ot[362],Br=_n&&cn?Math.hypot(_n.x-cn.x,_n.y-cn.y):.8,Gn=dt.blendshapes||{},Is=(Gn.eyeLookOutRight||0)-(Gn.eyeLookInRight||0),ya=(Gn.eyeLookUpRight||0)-(Gn.eyeLookDownRight||0),Fs=(Gn.eyeLookInLeft||0)-(Gn.eyeLookOutLeft||0),Ma=(Gn.eyeLookUpLeft||0)-(Gn.eyeLookDownLeft||0);for(let De=0;De<Rt;De++){const Le=Ot[De],je=dt.localCoords[De],T=Zt?Zt[De]:null;if(!Le||!je){Kt[De]=Le||je;continue}if(De>=468&&De<=477){T?Kt[De]={x:Le.x+(je.x-T.x),y:Le.y+(je.y-T.y),z:Le.z+(je.z-T.z)}:De<=472?Kt[De]={x:Le.x+Is*ii*.35,y:Le.y+ya*ii*.3,z:Le.z}:Kt[De]={x:Le.x+Fs*Br*.35,y:Le.y+Ma*Br*.3,z:Le.z};continue}let I=1;this.rigidSkull.has(De)?I=0:this.mandible.has(De)?I=.9:this.ring1.has(De)&&(I=.65);let H=0,G=0,U=0;T?(H=(je.x-T.x)*I,G=(je.y-T.y)*I,U=(je.z-T.z)*I):(H=(je.x-Le.x)*(I*.7),G=(je.y-Le.y)*(I*.7),U=(je.z-Le.z)*(I*.7));const at=Math.hypot(H,G,U),ut=2;if(at>ut){const St=ut/at;H*=St,G*=St,U*=St}Kt[De]={x:Le.x+H,y:Le.y+G,z:Le.z+U}}Et=this.cranial.fromLocalCoordinates(Kt,mt).map((De,Le)=>{var je;return this.cranial.fromIsotropic(De,((je=this.baseLandmarks[Le])==null?void 0:je.visibility)??1)})}}!Et&&dt.blendshapes&&(Et=this.applyBlendshapesToLandmarks(this.baseLandmarks,dt.blendshapes,e,i))}const Ft=.065;this.currentProceduralExpressions.jawOpen+=(this.targetProceduralExpressions.jawOpen-this.currentProceduralExpressions.jawOpen)*Ft,this.currentProceduralExpressions.smileL+=(this.targetProceduralExpressions.smileL-this.currentProceduralExpressions.smileL)*Ft,this.currentProceduralExpressions.smileR+=(this.targetProceduralExpressions.smileR-this.currentProceduralExpressions.smileR)*Ft,this.currentProceduralExpressions.browL+=(this.targetProceduralExpressions.browL-this.currentProceduralExpressions.browL)*Ft,this.currentProceduralExpressions.browR+=(this.targetProceduralExpressions.browR-this.currentProceduralExpressions.browR)*Ft,this.currentProceduralExpressions.pucker+=(this.targetProceduralExpressions.pucker-this.currentProceduralExpressions.pucker)*Ft;const oe=Math.max(0,Math.sin(r)*.02),Ht=Math.max(0,this.currentProceduralExpressions.jawOpen+oe),st={eyeBlinkLeft:Math.min(1,B*.95),eyeBlinkRight:Math.min(1,B*.95),eyeLookInLeft:Math.max(0,-y*1.15),eyeLookOutLeft:Math.max(0,y*1.15),eyeLookInRight:Math.max(0,y*1.15),eyeLookOutRight:Math.max(0,-y*1.15),eyeLookUpLeft:Math.max(0,L*1.15),eyeLookDownLeft:Math.max(0,-L*1.15),eyeLookUpRight:Math.max(0,L*1.15),eyeLookDownRight:Math.max(0,-L*1.15),browInnerUp:Math.max(0,.08+Math.max(this.currentProceduralExpressions.browL,this.currentProceduralExpressions.browR)*.75+tt*25),browOuterUpRight:Math.max(0,this.currentProceduralExpressions.browR+tt*25),browOuterUpLeft:Math.max(0,this.currentProceduralExpressions.browL+ot*25),jawOpen:Ht,mouthSmileLeft:this.currentProceduralExpressions.smileL,mouthSmileRight:this.currentProceduralExpressions.smileR,mouthPucker:this.currentProceduralExpressions.pucker},P=1-nt;let Gt=null;if(P>.001){const O={...st,eyeBlinkLeft:0,eyeBlinkRight:0};Gt=this.applyBlendshapesToLandmarks(this.baseLandmarks,O,e,i)}const kt={...st};if(dt&&dt.blendshapes&&nt>.001){const O=dt.blendshapes,q=new Set([...Object.keys(st),...Object.keys(O)]);for(const J of q){const mt=st[J]||0,Ot=O[J]||0;kt[J]=mt*(1-nt)+Ot*nt}}let Ut,yt,It,Mt,C,E;if(this.autonomousSubMode==="RECORDED_ANIM"&&this.activeAnimation){const O=this.activeAnimation,q=t-this.animStartTime,J=(this.audioDelaySec??2.2)*1e3,mt=O._audioBuffer?O._audioBuffer.duration*1e3:0,Ot=Math.max(O.durationMs,J+mt),Zt=this.animFadeDuration;if(q<Zt){const Rt=nt,Kt=1-Rt,ee=((F=this.animTransitionFrom)==null?void 0:F.head)||{pitch:S,yaw:x,roll:_},ge=((lt=this.animTransitionFrom)==null?void 0:lt.trans)||{x:w,y:b,z:A};Ut=ee.pitch*Kt+Vt*Rt,yt=ee.yaw*Kt+X*Rt,It=ee.roll*Kt+Z*Rt,Mt=ge.x*Kt+ct*Rt,C=ge.y*Kt+it*Rt,E=ge.z*Kt+xt*Rt}else if(q<Ot)Ut=Vt,yt=X,It=Z,Mt=ct,C=it,E=xt;else{const Rt=q-Ot,Kt=Math.max(0,Math.min(1,Rt/Zt)),ge=1-Kt*Kt*Kt*(Kt*(Kt*6-15)+10);Ut=Vt*ge,yt=X*ge,It=Z*ge,Mt=ct*ge,C=it*ge,E=xt*ge}this.currentHead={pitch:Ut,yaw:yt,roll:It},this.targetHead={...this.currentHead},this.currentTrans={x:Mt,y:C,z:E},this.targetTrans={...this.currentTrans}}else Ut=S,yt=x,It=_,Mt=w,C=b,E=A;const z=this.baseLandmarks.length,K=new Array(z),et=this.baseLandmarks[168]||this.baseLandmarks[1]||{x:.5,y:.5,z:0},$={x:.5+Mt*D,y:.5+C,z:0-E};this.eulerHelper.set(Bn.degToRad(Ut),Bn.degToRad(-yt*D),Bn.degToRad(It*D),"YXZ"),this.matrixHelper.makeRotationFromEuler(this.eulerHelper);const gt=.02*(1+Math.max(0,(Math.abs(x)-22)/20)*.45),Jt=.015,rt=y*gt*D*P,_t=L*Jt*P,Nt=kt.eyeBlinkRight||0,zt=kt.eyeBlinkLeft||0,pt=Math.max(.65,Math.min(1.45,1+E*1.8));for(let O=0;O<z;O++){const q=this.baseLandmarks[O],J=Gt&&Gt[O]||q;let mt=J.x,Ot=J.y,Zt=J.z||0;if(Et&&nt>.001){const cn=Et[O]||q;mt=J.x*(1-nt)+cn.x*nt,Ot=J.y*(1-nt)+cn.y*nt,Zt=(J.z||0)*(1-nt)+(cn.z||0)*nt}const Rt=(mt-et.x)*s,Kt=Ot-et.y,ee=(Zt-et.z)*s;this.rotVec.set(Rt,Kt,ee),this.rotVec.applyMatrix4(this.matrixHelper);let ge=$.x+this.rotVec.x*pt/s,ii=$.y+this.rotVec.y*pt,_n=$.z+this.rotVec.z/s;if(O>=468&&O<=477&&P>.001&&(ge+=rt,ii-=_t),!Gt&&nt<.99){const cn=1-nt;this.EYEBROW_R.has(O)?ii-=tt*cn:this.EYEBROW_L.has(O)&&(ii-=ot*cn)}K[O]={x:ge,y:ii,z:_n,visibility:q.visibility}}(Nt>.005||zt>.005)&&this.applyEyelidClosure(K,Nt,zt);let jt=K;if(this.autonomousSubMode==="RECORDED_ANIM"&&((Y=this.animTransitionFrom)!=null&&Y.landmarks)){const O=t-this.animStartTime;if(O<this.animFadeDuration){const q=Math.max(0,Math.min(1,O/this.animFadeDuration)),J=q*q*q*(q*(q*6-15)+10),mt=1-J,Ot=this.animTransitionFrom.landmarks,Zt=new Array(z);for(let Rt=0;Rt<z;Rt++){const Kt=Ot[Rt]||K[Rt],ee=K[Rt];Zt[Rt]={x:Kt.x*mt+ee.x*J,y:Kt.y*mt+ee.y*J,z:(Kt.z||0)*mt+(ee.z||0)*J,visibility:ee.visibility}}jt=Zt}}else if(this.isTransitioningToAutonomous&&this.transFromLandmarks&&v<1){const O=1-v,q=new Array(z);for(let J=0;J<z;J++){const mt=this.transFromLandmarks[J]||K[J],Ot=K[J];q[J]={x:mt.x*O+Ot.x*v,y:mt.y*O+Ot.y*v,z:(mt.z||0)*O+(Ot.z||0)*v,visibility:Ot.visibility}}jt=q}this.lastRenderedPitch=Ut,this.lastRenderedYaw=yt,this.lastRenderedRoll=It,this.lastRenderedTransX=Mt,this.lastRenderedTransY=C,this.lastRenderedTransZ=E,this.lastRenderedGazeX=y,this.lastRenderedGazeY=L,this.lastRenderedLandmarks=jt;const Xt={pitch:Ut,yaw:yt,roll:It,x:Mt*e,y:C*i,z:E*e,zDepthScale:pt};return this.lastAutonomousLandmarks=jt,this.lastAutonomousHeadPose=Xt,{detected:!0,isAutonomous:!0,subMode:this.autonomousSubMode,activeAnimationName:this.activeAnimation?this.activeAnimation.name:null,animBlendWeight:nt,timestamp:t,latencyMs:0,landmarks:jt,liveLandmarks:this.baseLandmarks,headPose:Xt,blendshapes:kt}}}class i3 extends EventTarget{constructor(t=20,e=1500){super(),this.maxSnapshots=t,this.minAgeMs=e,this.TRACKED_INDICES=[10,168,1,33,263,133,362,234,454,172,397,152],this.SYMMETRY_PAIRS=[[33,263],[133,362],[116,345],[234,454],[172,397],[136,365],[61,291],[105,334]],this.snapshots=[],this.bestOverallSnapshot=null,this.fallbackSnapshot=null,this.archivedReference=null,this.lastSampleTime=0,this.lastFallbackSampleTime=0,this.recentMotionHistory=[],this.lastTrackedLandmarks=null,this.lastPose=null,this.exportCanvas=document.createElement("canvas"),this.exportCanvas.width=1280,this.exportCanvas.height=720,this.exportCtx=this.exportCanvas.getContext("2d")}resetVisitorSession(){if(this.bestOverallSnapshot&&this.bestOverallSnapshot.canvas){const t=document.createElement("canvas");t.width=this.bestOverallSnapshot.canvas.width,t.height=this.bestOverallSnapshot.canvas.height,t.getContext("2d").drawImage(this.bestOverallSnapshot.canvas,0,0),this.archivedReference={canvas:t,landmarks:this.bestOverallSnapshot.landmarks.map(i=>({x:i.x,y:i.y,z:i.z||0,visibility:i.visibility})),headPose:{...this.bestOverallSnapshot.headPose},score:this.bestOverallSnapshot.score||800,timestamp:this.bestOverallSnapshot.timestamp}}this.snapshots=[],this.bestOverallSnapshot=null,this.fallbackSnapshot=null,this.lastSampleTime=0,this.lastFallbackSampleTime=0,this.recentMotionHistory=[],this.lastTrackedLandmarks=null,this.lastPose=null}clear(){this.resetVisitorSession(),this.archivedReference=null}evaluateFaceQuality(t,e,i,s){if(!t||t.length<468||!e)return null;const r=t[168]||t[6],a=t[1],o=t[10],c=t[152],l=t[234],h=t[454];if(!r||!a||!o||!c||!l||!h)return null;const u=.08;if(o.y<u||c.y>1-u||l.x<u||h.x>1-u||a.x<.2||a.x>.8||a.y<.2||a.y>.8)return null;const d=Math.abs(c.y-o.y),f=Math.abs(h.x-l.x);if(d<.2||d>.75||f<.16||f>.65)return null;const g=d/Math.max(.01,f);if(g<1.12||g>1.68)return null;const v=(r.x+a.x)*.5,m=(r.y+a.y)*.5,p=Math.hypot((v-.5)*1,(m-.48)*1.15);if(p>.22)return null;const S=Math.exp(-14*p*p),x=Math.abs(e.yaw||0),_=Math.abs(e.pitch||0),w=Math.abs(e.roll||0);if(x>12||_>12||w>8)return null;const b=Math.exp(-((x/6)**2+(_/6)**2+(w/4.5)**2)),A=Math.hypot(x*1.2,_*1.1,w*.9);if(i>.004||s>.0045)return null;const R=Math.exp(-320*i-220*s);let M=0,y=0;for(let nt=0;nt<this.SYMMETRY_PAIRS.length;nt++){const[dt,Vt]=this.SYMMETRY_PAIRS[nt],X=t[dt],Z=t[Vt];if(!X||!Z)continue;const ct=Math.hypot(X.x-r.x,X.y-r.y),it=Math.hypot(Z.x-r.x,Z.y-r.y),xt=Math.max(ct,it,.01),Et=Math.abs(ct-it)/xt;M+=Et,Et>y&&(y=Et)}const L=M/this.SYMMETRY_PAIRS.length;if(y>.16||L>.09)return null;const B=Math.exp(-16*L)*Math.exp(-8*y),D=t[145]&&t[159]?Math.abs(t[145].y-t[159].y):0,N=t[374]&&t[386]?Math.abs(t[374].y-t[386].y):0,j=(D+N)*.5,W=Math.abs(D-N);if(j<.01||W>.007)return null;const Q=Math.min(1,(j-.009)/.012)*Math.max(0,1-W/.007),V=t[13]&&t[14]?Math.abs(t[13].y-t[14].y):0;if(V>.022)return null;const tt=Math.max(0,1-Math.max(0,V-.008)/.014),ot=Math.round(Math.pow(S,1.5)*Math.pow(b,1.5)*Math.pow(R,1.4)*B*Q*tt*1e3);return{dCenter:p,sCenter:S,angleMagnitude:A,sFrontal:b,sStillness:R,sSym:B,eyeScore:Q,mouthScore:tt,compositeScore:ot}}_createSnapshotEntry(t,e,i,s,r){const a=t.videoWidth||1280,o=t.videoHeight||720;let c=null;if(this.snapshots.length<this.maxSnapshots)c=document.createElement("canvas"),c.width=a,c.height=o;else{let u=-1,d=1/0;for(let g=0;g<this.snapshots.length;g++){const v=this.snapshots[g];v!==this.bestOverallSnapshot&&v.score<d&&(d=v.score,u=g)}u===-1&&(u=0),c=this.snapshots.splice(u,1)[0].canvas,(c.width!==a||c.height!==o)&&(c.width=a,c.height=o)}c.getContext("2d").drawImage(t,0,0,a,o);const h=new Array(e.length);for(let u=0;u<e.length;u++){const d=e[u];h[u]={x:d.x,y:d.y,z:d.z||0,visibility:d.visibility}}return{timestamp:r,canvas:c,landmarks:h,headPose:{yaw:i.yaw||0,pitch:i.pitch||0,roll:i.roll||0},score:s}}recordFrame(t,e,i=performance.now()){if(!t||t.readyState<2||!e||!e.detected||!e.landmarks)return;const s=e.landmarks,r=e.headPose||{pitch:0,yaw:0,roll:0};let a=0;if(this.lastTrackedLandmarks){let S=0,x=0;for(let _=0;_<this.TRACKED_INDICES.length;_++){const w=this.TRACKED_INDICES[_],b=s[w],A=this.lastTrackedLandmarks[_];b&&A&&(S+=Math.hypot(b.x-A.x,b.y-A.y),x++)}a=x>0?S/x:0}let o=0;if(this.lastPose){const S=Math.abs((r.yaw||0)-this.lastPose.yaw),x=Math.abs((r.pitch||0)-this.lastPose.pitch),_=Math.abs((r.roll||0)-this.lastPose.roll);o=(S+x+_)/180*.05}const c=a*.75+o*.25;this.lastTrackedLandmarks=this.TRACKED_INDICES.map(S=>{const x=s[S];return x?{x:x.x,y:x.y}:{x:.5,y:.5}}),this.lastPose={yaw:r.yaw||0,pitch:r.pitch||0,roll:r.roll||0},this.recentMotionHistory.push(c),this.recentMotionHistory.length>15&&this.recentMotionHistory.shift();const l=s[10],h=s[152],u=s[234],d=s[454];if(l&&h&&u&&d&&l.y>=.06&&h.y<=.94&&u.x>=.06&&d.x<=.94&&i-this.lastFallbackSampleTime>=800){if(this.lastFallbackSampleTime=i,!this.fallbackSnapshot){const S=document.createElement("canvas");S.width=t.videoWidth||1280,S.height=t.videoHeight||720,this.fallbackSnapshot={canvas:S,ctx:S.getContext("2d"),landmarks:null,headPose:null,timestamp:i}}this.fallbackSnapshot.ctx.drawImage(t,0,0,this.fallbackSnapshot.canvas.width,this.fallbackSnapshot.canvas.height),this.fallbackSnapshot.landmarks=s.map(S=>({x:S.x,y:S.y,z:S.z||0,visibility:S.visibility})),this.fallbackSnapshot.headPose={yaw:r.yaw||0,pitch:r.pitch||0,roll:r.roll||0},this.fallbackSnapshot.timestamp=i}if(this.recentMotionHistory.length<5)return;let f=0;for(let S=0;S<this.recentMotionHistory.length;S++)f+=this.recentMotionHistory[S];const g=f/this.recentMotionHistory.length,v=this.evaluateFaceQuality(s,r,g,c);if(!v)return;const m=i-this.lastSampleTime,p=!this.bestOverallSnapshot||v.compositeScore>this.bestOverallSnapshot.score;if((m>=150||p)&&v.compositeScore>=180){this.lastSampleTime=i;const S=this._createSnapshotEntry(t,s,r,v.compositeScore,i);for(this.snapshots.push(S);this.snapshots.length>0&&i-this.snapshots[0].timestamp>18e3;)this.snapshots.shift();if(p){this.bestOverallSnapshot=S;try{const x=this.getPristineSnapshotDataUrl(S.canvas,!0);this.dispatchEvent(new CustomEvent("pristine-capture",{detail:{canvas:S.canvas,landmarks:S.landmarks,pose:S.headPose,score:S.score,dataUrl:x}}))}catch{}}}}getPristineSnapshotDataUrl(t=null,e=!0,i=.92){const s=t||(this.bestOverallSnapshot?this.bestOverallSnapshot.canvas:null);if(!s||s.width===0)return null;const r=s.width,a=s.height;return(this.exportCanvas.width!==r||this.exportCanvas.height!==a)&&(this.exportCanvas.width=r,this.exportCanvas.height=a),this.exportCtx.save(),this.exportCtx.clearRect(0,0,r,a),e&&(this.exportCtx.translate(r,0),this.exportCtx.scale(-1,1)),this.exportCtx.drawImage(s,0,0,r,a),this.exportCtx.restore(),this.exportCanvas.toDataURL("image/jpeg",i)}getBestVisitorBackupFrame(t=performance.now(),e=this.minAgeMs){const i=this.snapshots.filter(s=>t-s.timestamp>=e);if(i.length>0){let s=i[0];for(let r=1;r<i.length;r++)i[r].score>s.score&&(s=i[r]);return console.log(`[FaceTextureHistoryBuffer] 🎯 Snapshot optimal sélectionné (Âge: ${Math.round(t-s.timestamp)}ms, Score: ${s.score})`),{timestamp:s.timestamp,canvas:s.canvas,landmarks:s.landmarks,headPose:s.headPose,qualityScore:s.score,isPristine:!0}}if(this.bestOverallSnapshot)return console.log(`[FaceTextureHistoryBuffer] ⭐ Meilleur snapshot de la session sélectionné (Score: ${this.bestOverallSnapshot.score})`),{timestamp:this.bestOverallSnapshot.timestamp,canvas:this.bestOverallSnapshot.canvas,landmarks:this.bestOverallSnapshot.landmarks,headPose:this.bestOverallSnapshot.headPose,qualityScore:this.bestOverallSnapshot.score,isPristine:!0};if(this.snapshots.length>0){let s=this.snapshots[0];for(let r=1;r<this.snapshots.length;r++)this.snapshots[r].score>s.score&&(s=this.snapshots[r]);return{timestamp:s.timestamp,canvas:s.canvas,landmarks:s.landmarks,headPose:s.headPose,qualityScore:s.score,isPristine:!1}}return this.fallbackSnapshot&&this.fallbackSnapshot.landmarks?(console.log("[FaceTextureHistoryBuffer] 🛡️ Snapshot de sécurité cadré appliqué"),{timestamp:this.fallbackSnapshot.timestamp,canvas:this.fallbackSnapshot.canvas,landmarks:this.fallbackSnapshot.landmarks,headPose:this.fallbackSnapshot.headPose,qualityScore:500,isPristine:!1}):this.archivedReference?(console.log("[FaceTextureHistoryBuffer] 🏛️ Référence archivée précédente appliquée"),{timestamp:t,canvas:this.archivedReference.canvas,landmarks:this.archivedReference.landmarks,headPose:this.archivedReference.headPose,qualityScore:this.archivedReference.score||700,isPristine:!0,isArchived:!0}):null}}function $d(){const t={id:"preset_clin_doeil_sourire",name:"Clin d'œil & Sourire",durationMs:2800,frameCount:84,fps:30,createdAt:new Date().toISOString(),hasAudio:!1,frames:[]};for(let r=0;r<84;r++){const a=r/30*1e3,o=r/84;let c=0,l=0,h=0,u=0,d=0,f=0,g=0,v=0,m=0,p=0,S=0;if(o<.25){const x=o/.25,_=x*x*(3-2*x);h=-4.5*_,l=5*_,c=-2*_,g=.35*_,u=.02*_}else if(o<.5){const x=(o-.25)/.25,_=Math.sin(x*Math.PI);h=-4.5+_*-1.5,l=5+_*2,c=-2+_*1.5,v=Math.min(1,_*1.15),g=.35+.45*Math.sin(x*Math.PI*.5),p=.3*_,S=.08*_}else if(o<.75){const x=(o-.5)/.25,_=Math.sin(x*Math.PI);h=-4.5*(1-x*.5),l=5*(1-x*.5),c=-2+_*6.5,g=.8-x*.2,S=.12*_,f=.04*_}else{const x=(o-.75)/.25,_=(1-x)*(1-x);h=-2.25*_,l=2.5*_,c=1*_,g=.6*_}t.frames.push({timeOffsetMs:Math.round(a),headPose:{pitch:Number(c.toFixed(2)),yaw:Number(l.toFixed(2)),roll:Number(h.toFixed(2)),x:Number(u.toFixed(4)),y:Number(d.toFixed(4)),z:Number(f.toFixed(4))},blendshapes:{mouthSmileLeft:Number(g.toFixed(3)),mouthSmileRight:Number((g*.92).toFixed(3)),eyeBlinkLeft:Number(v.toFixed(3)),eyeBlinkRight:Number(m.toFixed(3)),browOuterUpRight:Number(p.toFixed(3)),jawOpen:Number(S.toFixed(3))}})}const e={id:"preset_etonnement_curieux",name:"Étonnement & Curiosité",durationMs:3e3,frameCount:90,fps:30,createdAt:new Date().toISOString(),hasAudio:!1,frames:[]};for(let r=0;r<90;r++){const a=r/30*1e3,o=r/90;let c=0,l=0,h=0,u=0,d=0,f=0,g=0,v=0,m=0,p=0;if(o<.3){const S=o/.3,x=S*S*(3-2*S);c=-6*x,f=-.06*x,g=.85*x,v=.65*x,m=.22*x}else if(o<.65){const S=(o-.3)/.35,x=S*S*(3-2*S);c=-6+x*10,l=14*x,h=-4*x,f=-.06+x*.1,u=.05*x,g=.85-x*.35,v=.65-x*.4,m=.22-x*.12,p=.7*x}else{const x=1-(o-.65)/.35,_=x*x;c=4*_,l=14*_,h=-4*_,f=.04*_,u=.05*_,g=.5*_,p=.7*_}e.frames.push({timeOffsetMs:Math.round(a),headPose:{pitch:Number(c.toFixed(2)),yaw:Number(l.toFixed(2)),roll:Number(h.toFixed(2)),x:Number(u.toFixed(4)),y:Number(d.toFixed(4)),z:Number(f.toFixed(4))},blendshapes:{browInnerUp:Number(g.toFixed(3)),browOuterUpLeft:Number((g*.85).toFixed(3)),browOuterUpRight:Number((g*.85).toFixed(3)),eyeWideLeft:Number(v.toFixed(3)),eyeWideRight:Number(v.toFixed(3)),jawOpen:Number(m.toFixed(3)),mouthSmileLeft:Number(p.toFixed(3)),mouthSmileRight:Number(p.toFixed(3))}})}const i={id:"preset_hochement_complice",name:"Hochement Complice",durationMs:2600,frameCount:78,fps:30,createdAt:new Date().toISOString(),hasAudio:!1,frames:[]};for(let r=0;r<78;r++){const a=r/30*1e3,o=r/78;let c=0,l=0,h=0,u=0,d=0,f=0,g=0,v=0;if(o<.4){const m=o/.4,p=Math.sin(m*Math.PI);c=p*13,h=Math.sin(m*Math.PI*.5)*3.5,g=.55*Math.sin(m*Math.PI*.5),v=.35*p,d=p*.03}else if(o<.75){const m=(o-.4)/.35,p=Math.sin(m*Math.PI);c=p*8.5,h=3.5-m*2,g=.55+.2*p,v=.3*p}else{const m=(o-.75)/.25,p=(1-m)*(1-m);h=1.5*p,g=.55*p}i.frames.push({timeOffsetMs:Math.round(a),headPose:{pitch:Number(c.toFixed(2)),yaw:Number(l.toFixed(2)),roll:Number(h.toFixed(2)),x:Number(u.toFixed(4)),y:Number(d.toFixed(4)),z:Number(f.toFixed(4))},blendshapes:{mouthSmileLeft:Number(g.toFixed(3)),mouthSmileRight:Number(g.toFixed(3)),eyeSquintLeft:Number(v.toFixed(3)),eyeSquintRight:Number(v.toFixed(3))}})}const s={id:"preset_regard_pensif",name:"Regard Pensif & Éclat",durationMs:3200,frameCount:96,fps:30,createdAt:new Date().toISOString(),hasAudio:!1,frames:[]};for(let r=0;r<96;r++){const a=r/30*1e3,o=r/96;let c=0,l=0,h=0,u=0,d=0,f=0,g=0,v=0,m=0,p=0,S=0;if(o<.35){const x=o/.35,_=x*x*(3-2*x);l=-16*_,c=10*_,h=3*_,u=-.06*_,p=.45*_,S=-.5*_,m=.25*_}else if(o<.7){const x=(o-.35)/.35,_=x*x*(3-2*x);l=-16*(1-_)+3*_,c=10*(1-_)-3*_,h=3*(1-_)-2*_,u=-.06*(1-_)+.02*_,p=.45*(1-_),S=-.5*(1-_),m=.25*(1-_),v=.65*_,g=.85*_}else{const x=(o-.7)/.3,_=(1-x)*(1-x);l=3*_,c=-3*_,h=-2*_,u=.02*_,v=.65*_,g=.85*_}s.frames.push({timeOffsetMs:Math.round(a),headPose:{pitch:Number(c.toFixed(2)),yaw:Number(l.toFixed(2)),roll:Number(h.toFixed(2)),x:Number(u.toFixed(4)),y:Number(d.toFixed(4)),z:Number(f.toFixed(4))},blendshapes:{mouthSmileLeft:Number(g.toFixed(3)),mouthSmileRight:Number(g.toFixed(3)),browInnerUp:Number(v.toFixed(3)),browDownLeft:Number(m.toFixed(3)),browDownRight:Number(m.toFixed(3)),eyeLookUpLeft:Number(p.toFixed(3)),eyeLookUpRight:Number(p.toFixed(3)),eyeLookOutLeft:Number(Math.max(0,-S).toFixed(3)),eyeLookInRight:Number(Math.max(0,-S).toFixed(3))}})}return[t,e,i,s]}class s3 extends EventTarget{constructor(){super(),this.animations=[],this.cache=new Map,this.audioCtx=null,this.isAutonomousPlaybackEnabled=!0,this.lastPlayedId=null,this.isInitialized=!1}setAudioContext(t){this.audioCtx=t;for(const e of this.cache.values())e&&e.audioData&&!e._audioBuffer&&this.decodeAudioBuffer(e)}async decodeAudioBuffer(t){if(!t||!t.audioData||t._audioBuffer)return(t==null?void 0:t._audioBuffer)||null;if(!this.audioCtx){const e=window.AudioContext||window.webkitAudioContext;e&&(this.audioCtx=new e)}if(!this.audioCtx)return null;try{const e=t.audioData.replace(/^data:audio\/\w+;base64,/,""),i=atob(e),s=i.length,r=new Uint8Array(s);for(let o=0;o<s;o++)r[o]=i.charCodeAt(o);const a=await this.audioCtx.decodeAudioData(r.buffer.slice(0));return t._audioBuffer=a,a}catch(e){return console.warn("[AnimationLibrary] Audio pre-decode warning:",e),null}}async init(){try{if(await this.refreshList(),this.animations.length===0){console.log("[AnimationLibrary] Directory empty, populating built-in preset animations...");const t=$d();for(const e of t)await this.saveAnimation(e.name,e);await this.refreshList()}for(const t of this.animations){const e=t.filename||t.id;this.cache.has(e)||await this.getAnimationData(e)}this.isInitialized=!0,this.dispatchEvent(new CustomEvent("initialized",{detail:{count:this.animations.length}}))}catch(t){console.warn("[AnimationLibrary] Init warning:",t);const e=$d();for(const i of e)this.cache.set(i.id,i),this.cache.set(`${i.id}.json`,i),this.animations.push({id:i.id,name:i.name,filename:`${i.id}.json`,durationMs:i.durationMs,frameCount:i.frameCount,createdAt:i.createdAt,hasAudio:!1});this.isInitialized=!0}return this.animations}async refreshList(){try{const t=await fetch("/api/animations",{cache:"no-cache"});if(t.ok)return this.animations=await t.json(),this.dispatchEvent(new CustomEvent("list:updated",{detail:{animations:this.animations}})),this.animations}catch(t){console.warn("[AnimationLibrary] Failed to fetch /api/animations:",t)}return this.animations}getAnimations(){return this.animations}hasAnimations(){return this.animations&&this.animations.length>0}async getAnimationData(t){if(this.cache.has(t))return this.cache.get(t);const e=this.animations.find(s=>s.id===t||s.filename===t),i=e?e.filename:t.endsWith(".json")?t:`${t}.json`;try{const s=await fetch(`/animations/${i}`,{cache:"no-cache"});if(s.ok){const r=await s.json();return r&&r.audioData&&this.decodeAudioBuffer(r),this.cache.set(r.id||i,r),this.cache.set(i,r),r}}catch{}return null}async saveAnimation(t,e){const i={name:t.trim()||"Animation",...e};try{const s=await fetch("/api/animations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!s.ok)throw new Error(`Server returned ${s.status}`);const r=await s.json(),a=r.animation;return a&&a.audioData&&await this.decodeAudioBuffer(a),this.cache.set(a.id,a),r.filename&&this.cache.set(r.filename,a),await this.refreshList(),this.dispatchEvent(new CustomEvent("animation:saved",{detail:a})),a}catch(s){console.error("[AnimationLibrary] Failed to save animation:",s);const r=i.id||`anim_${Date.now()}`;return i.id=r,this.cache.set(r,i),this.animations.unshift({id:r,name:i.name,filename:`${r}.json`,durationMs:i.durationMs||0,frameCount:i.frameCount||(i.frames?i.frames.length:0),createdAt:new Date().toISOString(),hasAudio:!!i.audioData}),this.dispatchEvent(new CustomEvent("animation:saved",{detail:i})),i}}async deleteAnimation(t){try{const e=await fetch(`/api/animations?filename=${encodeURIComponent(t)}`,{method:"DELETE"});if(!e.ok)throw new Error(`Server returned ${e.status}`);return this.cache.delete(t),await this.refreshList(),this.dispatchEvent(new CustomEvent("animation:deleted",{detail:{filename:t}})),!0}catch(e){return console.error("[AnimationLibrary] Failed to delete animation:",e),this.animations=this.animations.filter(i=>i.filename!==t),this.dispatchEvent(new CustomEvent("animation:deleted",{detail:{filename:t}})),!1}}async getRandomAnimation(){if(!this.animations||this.animations.length===0)return null;let t=this.animations;this.animations.length>1&&this.lastPlayedId&&(t=this.animations.filter(i=>i.id!==this.lastPlayedId&&i.filename!==this.lastPlayedId)),t.length===0&&(t=this.animations);const e=t[Math.floor(Math.random()*t.length)];return e?(this.lastPlayedId=e.id,await this.getAnimationData(e.filename||e.id)):null}getRandomAnimationSync(){if(!this.animations||this.animations.length===0){if(this.cache.size>0){const s=Array.from(this.cache.values());return s[Math.floor(Math.random()*s.length)]}return null}let t=this.animations;this.animations.length>1&&this.lastPlayedId&&(t=this.animations.filter(s=>s.id!==this.lastPlayedId&&s.filename!==this.lastPlayedId)),t.length===0&&(t=this.animations);const e=t[Math.floor(Math.random()*t.length)];if(!e)return null;this.lastPlayedId=e.id;const i=this.cache.get(e.filename)||this.cache.get(e.id);return i||(this.getAnimationData(e.filename||e.id),this.cache.size>0?Array.from(this.cache.values())[0]:null)}getActiveAnimationCount(){return this.animations.length}setAutonomousPlaybackEnabled(t){this.isAutonomousPlaybackEnabled=!!t,this.dispatchEvent(new CustomEvent("playback:toggled",{detail:{enabled:this.isAutonomousPlaybackEnabled}}))}}class r3 extends EventTarget{constructor(t={}){super(),this.cranial=new Vh,this.cranial.setAspectRatio(16/9),this.DISSIMILARITY_THRESHOLD=t.threshold||.2,this.MORPH_THRESHOLD=t.morphThreshold||.16,this.MIN_ABSENCE_FOR_NEW_VISITOR_MS=t.minAbsenceMs||1500,this.LONG_ABSENCE_RESET_MS=t.longAbsenceMs||2e4,this.activeVisitorSignature=null,this.previousVisitorSignature=null,this.lastDetectedTimestamp=0,this.lastAbsenceDuration=0,this.faceAbsentStartTime=0,this.candidateWindow=[],this.CANDIDATE_WINDOW_SIZE=6,typeof document<"u"?(this.sampleCanvas=document.createElement("canvas"),this.sampleCanvas.width=64,this.sampleCanvas.height=64,this.sampleCtx=this.sampleCanvas.getContext("2d",{willReadFrequently:!0})):(this.sampleCanvas=null,this.sampleCtx=null)}setAspectRatio(t){t>.1&&t<10&&this.cranial.setAspectRatio(t)}reset(){this.activeVisitorSignature=null,this.previousVisitorSignature=null,this.lastDetectedTimestamp=0,this.lastAbsenceDuration=0,this.faceAbsentStartTime=0,this.candidateWindow=[]}sampleSkinPatch(t,e,i,s){if(!t||!e||!this.sampleCtx||i<=0||s<=0)return{r:180,g:150,b:130};try{const r=Math.max(2,Math.min(i-6,Math.round(e.x*i))),a=Math.max(2,Math.min(s-6,Math.round(e.y*s)));this.sampleCtx.drawImage(t,r-2,a-2,4,4,0,0,4,4);const o=this.sampleCtx.getImageData(0,0,4,4).data;let c=0,l=0,h=0,u=0;for(let d=0;d<o.length;d+=4)c+=o[d],l+=o[d+1],h+=o[d+2],u++;return u===0?{r:180,g:150,b:130}:{r:c/u,g:l/u,b:h/u}}catch{return{r:180,g:150,b:130}}}extractSignature(t,e,i){var x,_;if(!t||t.length<468)return null;const s=this.cranial.extractRigidFrame(t);if(!s||s.scale<.001)return null;const r=this.cranial.toLocalCoordinates(t,s);if(!r||r.length<468)return null;const a=(w,b)=>{const A=r[w],R=r[b];if(!A||!R)return 0;const M=A.x-R.x,y=A.y-R.y,L=A.z-R.z;return Math.hypot(M,y,L)},o=a(10,152),c=a(234,454),l=a(168,2),h=a(49,279),u=a(172,397),d=a(33,263),f=a(10,168),g=a(2,152);if(c<.1||o<.1)return null;const v=[o/c,u/c,l/Math.max(.01,h),l/o,h/c,d,f/Math.max(.01,g),Math.abs((((x=r[1])==null?void 0:x.z)||0)-(((_=r[168])==null?void 0:_.z)||0)),a(168,152)/c,f/o,a(172,152)/c,a(397,152)/c];let m=.38,p=.33,S=.5;if(i&&i.videoWidth>0){const w=i.videoWidth,b=i.videoHeight,A=this.sampleSkinPatch(i,t[151],w,b),R=this.sampleSkinPatch(i,t[117],w,b),M=this.sampleSkinPatch(i,t[346],w,b),y=(A.r+R.r+M.r)/3,L=(A.g+R.g+M.g)/3,B=(A.b+R.b+M.b)/3,D=y+L+B||1;m=y/D,p=L/D,S=Math.atan2(Math.sqrt(3)*(L-B),2*y-L-B)}return{morphFeatures:v,skinProfile:{normR:m,normG:p,hue:S}}}compareSignatures(t,e){if(!t||!e)return 1;let i=0;const s=t.morphFeatures.length;for(let d=0;d<s;d++){const f=t.morphFeatures[d],g=e.morphFeatures[d],v=(Math.abs(f)+Math.abs(g))*.5||1;i+=Math.abs(f-g)/v}const r=i/s,a=t.skinProfile,o=e.skinProfile,c=Math.abs(a.normR-o.normR)+Math.abs(a.normG-o.normG);let l=Math.abs(a.hue-o.hue);l>Math.PI&&(l=2*Math.PI-l);const h=Math.min(1,c*4+l/Math.PI*.8),u=r*.7+h*.3;return{total:u,dMorph:r,dSkin:h,valueOf(){return u}}}averageSignatures(t){if(!t||t.length===0)return null;if(t.length===1)return t[0];const e=t[0].morphFeatures.length,i=new Array(e).fill(0);let s=0,r=0,a=0,o=0;const c=t.length;for(const l of t){for(let h=0;h<e;h++)i[h]+=l.morphFeatures[h];s+=l.skinProfile.normR,r+=l.skinProfile.normG,a+=Math.cos(l.skinProfile.hue),o+=Math.sin(l.skinProfile.hue)}for(let l=0;l<e;l++)i[l]/=c;return{morphFeatures:i,skinProfile:{normR:s/c,normG:r/c,hue:Math.atan2(o/c,a/c)}}}update(t,e,i=performance.now()){if(!!!(t&&t.detected&&t.landmarks))return this.lastDetectedTimestamp>0&&(this.faceAbsentStartTime||(this.faceAbsentStartTime=i),this.lastAbsenceDuration=i-this.faceAbsentStartTime,this.currentArrivalAbsenceDuration=this.lastAbsenceDuration),this.candidateWindow=[],{isPresent:!1,isNewVisitor:!1,dissimilarity:0,signature:this.activeVisitorSignature};this.faceAbsentStartTime>0&&(this.currentArrivalAbsenceDuration=i-this.faceAbsentStartTime,this.faceAbsentStartTime=0),this.lastDetectedTimestamp=i;const r=t.headPose||{pitch:0,yaw:0,roll:0};if(!(Math.abs(r.yaw||0)<28&&Math.abs(r.pitch||0)<24)&&this.activeVisitorSignature)return{isPresent:!0,isNewVisitor:!1,dissimilarity:0,signature:this.activeVisitorSignature};const o=this.extractSignature(t.landmarks,r,e);if(!o)return{isPresent:!0,isNewVisitor:!1,dissimilarity:0,signature:this.activeVisitorSignature};if(this.candidateWindow.push(o),this.candidateWindow.length>this.CANDIDATE_WINDOW_SIZE&&this.candidateWindow.shift(),this.candidateWindow.length<5)return{isPresent:!0,isNewVisitor:!1,dissimilarity:0,signature:this.activeVisitorSignature};const c=this.averageSignatures(this.candidateWindow);if(!this.activeVisitorSignature)return this.activeVisitorSignature=c,this.candidateWindow=[],this.currentArrivalAbsenceDuration=0,this.dispatchEvent(new CustomEvent("new-visitor",{detail:{signature:c,dissimilarity:1,reason:"INITIAL_VISITOR"}})),{isPresent:!0,isNewVisitor:!0,dissimilarity:1,signature:c};const l=this.currentArrivalAbsenceDuration||0;if(!(l>=this.MIN_ABSENCE_FOR_NEW_VISITOR_MS))return{isPresent:!0,isNewVisitor:!1,dissimilarity:0,signature:this.activeVisitorSignature};const u=this.compareSignatures(c,this.activeVisitorSignature),d=u.total!==void 0?u.total:Number(u),f=u.dMorph!==void 0?u.dMorph:d,g=l>=this.LONG_ABSENCE_RESET_MS;if(f>=this.MORPH_THRESHOLD&&d>=this.DISSIMILARITY_THRESHOLD||f>=.22||g){const m=g?"LONG_ABSENCE":"DRASTIC_BIOMETRIC_CHANGE";return console.log(`[VisitorDetector] 👤 Nouveau visiteur confirmé ! (Absence: ${Math.round(l)}ms, Diff totale: ${d.toFixed(3)}, Diff morpho points: ${f.toFixed(3)})`),this.previousVisitorSignature=this.activeVisitorSignature,this.activeVisitorSignature=c,this.candidateWindow=[],this.currentArrivalAbsenceDuration=0,this.dispatchEvent(new CustomEvent("new-visitor",{detail:{signature:c,dissimilarity:d,dMorph:f,reason:m}})),{isPresent:!0,isNewVisitor:!0,dissimilarity:d,signature:c}}return this.currentArrivalAbsenceDuration=0,this.candidateWindow=[],{isPresent:!0,isNewVisitor:!1,dissimilarity:d,signature:this.activeVisitorSignature}}}class a3 extends EventTarget{constructor(t,e={}){super(),this.canvas=t,this.fps=e.fps||30,this.stream=null,this.ws=null,this.peers=new Map,this.isConnected=!1,this.reconnectTimer=null,this.totalConnectedViewers=0,this.iceServers=e.iceServers||[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}],this.initStream(),this.connectSignaling()}initStream(){if(this.canvas)try{typeof this.canvas.captureStream=="function"?this.stream=this.canvas.captureStream(this.fps):typeof this.canvas.mozCaptureStream=="function"&&(this.stream=this.canvas.mozCaptureStream(this.fps)),console.log("[WebRTC Broadcaster] 🎥 Canvas stream capturé avec succès (30 FPS)")}catch(t){console.error("[WebRTC Broadcaster] Erreur capture canvas stream:",t)}}getStream(){return this.stream||this.initStream(),this.stream}connectSignaling(){if(typeof window>"u")return;this.reconnectTimer&&clearTimeout(this.reconnectTimer);const e=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/webrtc-signaling`;try{this.ws=new WebSocket(e),this.ws.onopen=()=>{this.isConnected=!0,console.log("[WebRTC Broadcaster] 🟢 Connecté au serveur de signalement"),this.ws.send(JSON.stringify({type:"register",role:"broadcaster"})),this.updateStatusBadge()},this.ws.onmessage=async i=>{try{const s=JSON.parse(i.data);await this.handleSignalingMessage(s)}catch(s){console.error("[WebRTC Broadcaster] Erreur message signalement:",s)}},this.ws.onclose=()=>{this.isConnected=!1,this.updateStatusBadge(),this.reconnectTimer=setTimeout(()=>this.connectSignaling(),2e3)},this.ws.onerror=i=>{console.warn("[WebRTC Broadcaster] WebSocket signaling warning:",i)}}catch{this.reconnectTimer=setTimeout(()=>this.connectSignaling(),3e3)}}async handleSignalingMessage(t){const{type:e,viewerId:i}=t;if(e==="viewer-joined")console.log(`[WebRTC Broadcaster] 📺 Nouveau récepteur détecté (${i}), initialisation WebRTC...`),await this.createPeerForViewer(i);else if(e==="answer"){const s=this.peers.get(i);s&&s.pc&&(await s.pc.setRemoteDescription(new RTCSessionDescription(t.sdp)),console.log(`[WebRTC Broadcaster] ✅ Réponse SDP configurée pour ${i}`))}else if(e==="ice-candidate"){const s=this.peers.get(i);if(s&&s.pc&&t.candidate)try{await s.pc.addIceCandidate(new RTCIceCandidate(t.candidate))}catch(r){console.warn("[WebRTC Broadcaster] Erreur ajout ICE candidate:",r)}}else e==="viewer-left"&&this.closePeer(i)}async createPeerForViewer(t){this.closePeer(t);const e=new RTCPeerConnection({iceServers:this.iceServers});let i=null;try{i=e.createDataChannel("photomaton-meta",{ordered:!0})}catch{}const s={pc:e,dc:i,viewerId:t};this.peers.set(t,s);const r=this.getStream();r&&r.getVideoTracks().forEach(a=>{e.addTrack(a,r)}),e.onicecandidate=a=>{a.candidate&&this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify({type:"ice-candidate",role:"broadcaster",viewerId:t,candidate:a.candidate}))},e.onconnectionstatechange=()=>{console.log(`[WebRTC Broadcaster] État pair ${t}: ${e.connectionState}`),e.connectionState==="connected"?(this.totalConnectedViewers=this.getConnectedCount(),this.updateStatusBadge(),window.dispatchEvent(new CustomEvent("photomaton:webrtc-peer-connected",{detail:{viewerId:t,totalConnected:this.totalConnectedViewers}}))):(e.connectionState==="disconnected"||e.connectionState==="failed"||e.connectionState==="closed")&&this.closePeer(t)};try{const a=await e.createOffer({offerToReceiveAudio:!1,offerToReceiveVideo:!1});await e.setLocalDescription(a),this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify({type:"offer",viewerId:t,sdp:e.localDescription}))}catch(a){console.error(`[WebRTC Broadcaster] Erreur création offer pour ${t}:`,a)}}closePeer(t){const e=this.peers.get(t);if(e){try{e.dc&&e.dc.close(),e.pc&&e.pc.close()}catch{}this.peers.delete(t),this.totalConnectedViewers=this.getConnectedCount(),this.updateStatusBadge(),window.dispatchEvent(new CustomEvent("photomaton:webrtc-peer-disconnected",{detail:{viewerId:t,totalConnected:this.totalConnectedViewers}}))}}getConnectedCount(){let t=0;for(const[e,i]of this.peers)i.pc&&(i.pc.connectionState==="connected"||i.pc.iceConnectionState==="connected")&&t++;return t}notifyNewVisitor(t={}){const e=this.getStream(),i=Date.now();console.log("[WebRTC Broadcaster] 🚀 Démarrage protocole WebRTC pour nouveau visiteur",t);const s={stream:e,visitorDetail:t,timestamp:i,connectedViewers:this.getConnectedCount()};window.dispatchEvent(new CustomEvent("photomaton:webrtc-started",{detail:s})),this.dispatchEvent(new CustomEvent("webrtc-started",{detail:s})),this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify({type:"new-visitor-alert",timestamp:i,reason:t.reason||"NEW_VISITOR",dissimilarity:t.dissimilarity||0}));const r=JSON.stringify({type:"new-visitor",timestamp:i,reason:t.reason||"NEW_VISITOR"});for(const[a,o]of this.peers)if(o.dc&&o.dc.readyState==="open")try{o.dc.send(r)}catch{}this.updateStatusBadge()}updateStatusBadge(){const t=document.getElementById("webrtc-status-badge"),e=document.getElementById("webrtc-status-text"),i=this.getConnectedCount();t&&e&&(i>0?(t.classList.add("connected"),t.classList.remove("waiting"),e.textContent=`WebRTC: ${i} ordi${i>1?"s":""} connecté${i>1?"s":""}`):this.isConnected?(t.classList.remove("connected"),t.classList.add("waiting"),e.textContent="WebRTC: En attente d'un ordi"):(t.classList.remove("connected","waiting"),e.textContent="WebRTC: Déconnecté"))}}class o3{constructor(){this.videoEl=document.getElementById("webcam-video"),this.canvasEl=document.getElementById("output-canvas"),this.loadingOverlay=document.getElementById("loading-overlay"),this.loadingText=document.getElementById("loading-text"),this.camera=new Dm(this.videoEl),this.tracker=new Hy({smoothing:!0}),this.renderer=new Wy(this.canvasEl,this.videoEl),this.looper=new Jy,this.autoCalibrator=new Qy(this.looper),this.audioLooper=new t3,this.videoExtractor=new e3({fps:30,maxDuration:40}),this.autonomousEngine=new n3,this.historyBuffer=new i3(24,150),this.historyBuffer.addEventListener("pristine-capture",t=>this.handlePristineCapture(t.detail)),this.animLibrary=new s3,this.autonomousEngine.setAnimationLibrary(this.animLibrary),this.visitorDetector=new r3({threshold:.2,morphThreshold:.16,minAbsenceMs:1500,longAbsenceMs:2e4}),this.visitorDetector.addEventListener("new-visitor",t=>this.handleNewVisitor(t.detail)),this.canvasBroadcaster=new a3(this.canvasEl),this.isProcessingVideo=!1,this.appState="WAITING",this.lastFaceDetectedTime=0,this.consecutiveDetectedFrames=0,this.hasTakenSnapshotForVisitor=!1,this.lastSnapshotTimestamp=0,this.autoSnapshotEnabled=!0,this.forceAutonomousMode=!1,this.recentSnapshots=[],this.latestSnapshot=null,this.toastTimeout=null,this.lastTrackingLandmarks=null,this.lastTrackingHeadPose=null,this.lastRenderedTrackingResult=null,this.isBlendingToLive=!1,this.blendToLiveStartTime=0,this.blendToLiveDuration=450,this.autoExitLandmarks=null,this.lastFaceCanvas=document.createElement("canvas"),this.lastFaceCtx=this.lastFaceCanvas.getContext("2d"),this.fpsCounter=0,this.lastFpsTime=performance.now(),this.currentFps=60,this.rafId=null,this.isMirrored=!0,this.showWebcam=!0,this.autonomousEngine.setMirrored(this.isMirrored),this.renderer.setMirrored(!0),this.init()}async init(){var t,e;try{this.setupEventListeners(),await this.tracker.init(s=>{this.loadingText&&(this.loadingText.textContent=s)});try{await this.animLibrary.init(),this.updateAnimationBadge()}catch(s){console.warn("Animation Library init warning:",s)}const i=async()=>{try{const s=await this.audioLooper.ensureAudioContext();s&&(this.autonomousEngine.setAudioContext(s),this.animLibrary.setAudioContext(s))}catch{}};window.addEventListener("click",i,{once:!0}),window.addEventListener("touchstart",i,{once:!0}),this.loadingText&&(this.loadingText.textContent="Starting camera stream...");try{await this.camera.start(null,{width:1280,height:720})}catch(s){console.warn("Camera failed to start:",s),this.loadingText&&(this.loadingText.innerHTML=`
            <div style="font-size: 13px; margin-bottom: 8px;">📷 Webcam unavailable (${s.message||"permission denied"})</div>
            <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;">
              <button id="btn-retry-camera" class="tool-btn" style="padding: 6px 12px; font-size: 12px;">↺ Retry Camera</button>
              <button id="btn-skip-camera" class="tool-btn active" style="padding: 6px 12px; font-size: 12px;">📁 Video Upload Mode</button>
            </div>
          `,(t=document.getElementById("btn-retry-camera"))==null||t.addEventListener("click",()=>window.location.reload()),(e=document.getElementById("btn-skip-camera"))==null||e.addEventListener("click",()=>{this.loadingOverlay&&this.loadingOverlay.classList.add("hidden")}))}this.handleResize(),window.addEventListener("resize",()=>this.handleResize()),this.camera.isStreaming&&this.loadingOverlay&&this.loadingOverlay.classList.add("hidden"),this.startLoop()}catch(i){console.error("Initialization failed:",i),this.loadingText&&(this.loadingText.innerHTML=`
          <div>Error: ${i.message||"Initialization failed"}</div>
          <button class="tool-btn" style="padding: 6px 12px; margin-top: 10px;" onclick="window.location.reload()">↺ Retry</button>
        `)}}handleResize(){const t=document.getElementById("stage-container"),e=t.clientWidth,i=t.clientHeight;this.renderer.resize(e,i)}setupEventListeners(){var Ht;this.showWebcam=!0,document.body.classList.add("show-webcam","show-texture");const t=document.getElementById("btn-toggle-mirror");t.addEventListener("click",()=>{this.isMirrored=!this.isMirrored,t.classList.toggle("active",this.isMirrored),this.renderer.setMirrored(this.isMirrored),this.autonomousEngine.setMirrored(this.isMirrored)});const e=document.getElementById("btn-toggle-autonomous");e==null||e.addEventListener("click",()=>{this.forceAutonomousMode=!this.forceAutonomousMode,e.classList.toggle("active",this.forceAutonomousMode),this.forceAutonomousMode?this.autonomousEngine.hasSeenFace?(this.setState("AUTONOMOUS"),this.applyBestTextureReference(performance.now()),this.autonomousEngine.startAutonomous(performance.now(),this.lastTrackingLandmarks,this.lastTrackingHeadPose)):(alert("Veuillez vous placer devant la caméra une première fois pour initialiser le masque."),this.forceAutonomousMode=!1,e.classList.remove("active")):(this.appState==="AUTONOMOUS"&&(this.isBlendingToLive=!0,this.blendToLiveStartTime=performance.now(),this.blendToLiveDuration=600,this.autoExitLandmarks=this.autonomousEngine.lastAutonomousLandmarks?this.autonomousEngine.lastAutonomousLandmarks.map(st=>({x:st.x,y:st.y,z:st.z||0})):null,this.autonomousEngine.stopAutonomous()),this.renderer.isTextureFrozen&&this.renderer.unfreezeFaceTexture(),this.setState("LIVE"))});const i=document.getElementById("btn-toggle-auto-snapshot");i==null||i.addEventListener("click",()=>{this.autoSnapshotEnabled=!this.autoSnapshotEnabled,i.classList.toggle("active",this.autoSnapshotEnabled)});const s=document.getElementById("btn-download-toast-snapshot");s==null||s.addEventListener("click",()=>{this.latestSnapshot&&this.downloadSnapshot(this.latestSnapshot.dataUrl,`webcam_visiteur_${Date.now()}.jpg`)});const r=document.getElementById("btn-close-toast-snapshot");r==null||r.addEventListener("click",()=>{var st;(st=document.getElementById("snapshot-toast"))==null||st.classList.add("hidden")});const a=document.getElementById("btn-calibrate")||document.getElementById("btn-calibrate-neutral"),o=document.getElementById("calib-status"),c=document.getElementById("calib-icon"),l=document.getElementById("calibration-toast"),h=document.getElementById("cal-text");a&&((Ht=this.looper)!=null&&Ht.calibrator)&&(a.addEventListener("click",()=>{this.looper.calibrator.startCalibration()}),this.looper.calibrator.addEventListener("calibration:start",()=>{a.classList.add("calibrating"),o&&(o.textContent="Hold Neutral..."),l&&(l.classList.remove("hidden"),h&&(h.textContent="Calibrating neutral face... Hold still"))}),this.looper.calibrator.addEventListener("calibration:progress",st=>{const P=Math.round(st.detail.progress*100);o&&(o.textContent=`${P}%`),h&&(h.textContent=`Calibrating neutral face... Hold still (${P}%)`)}),this.looper.calibrator.addEventListener("calibration:complete",()=>{a.classList.remove("calibrating"),a.classList.add("calibrated"),c&&(c.textContent="✓"),o&&(o.textContent="Calibrated"),l&&(h&&(h.textContent="✓ Neutral face calibrated"),setTimeout(()=>{l.classList.add("hidden")},1800)),setTimeout(()=>{c&&(c.textContent="🎯"),o&&(o.textContent="Calibrate"),a.classList.remove("calibrated")},2500)}));const u=document.getElementById("btn-snapshot");u&&u.addEventListener("click",()=>this.captureSnapshot());const d=document.getElementById("btn-fullscreen");d&&(d.addEventListener("click",()=>{var st,P,Gt;document.fullscreenElement?((Gt=document.exitFullscreen)==null||Gt.call(document).catch(console.warn),d.textContent="⛶"):((P=(st=document.documentElement).requestFullscreen)==null||P.call(st).catch(console.warn),d.textContent="✕")}),document.addEventListener("fullscreenchange",()=>{d.textContent=document.fullscreenElement?"✕":"⛶"})),this.looper.setHeadSmoothing(!0),this.tracker.setSmoothing(!0);const f=document.getElementById("btn-toggle-smoothing");f&&f.addEventListener("click",()=>{const st=!this.looper.useHeadSmoothing;this.looper.setHeadSmoothing(st),this.tracker.setSmoothing(st),f.classList.toggle("active",st)});const g=document.getElementById("btn-record-clip"),v=document.getElementById("rec-label"),m=document.getElementById("btn-toggle-loop"),p=document.getElementById("loop-btn-icon"),S=document.getElementById("loop-label"),x=document.getElementById("btn-clear-loop"),_=document.getElementById("btn-save-anim");document.getElementById("btn-open-anim-library");const w=document.getElementById("slider-blend")||document.getElementById("slider-smooth"),b=document.getElementById("blend-val-label")||document.getElementById("smooth-val-label"),A=document.getElementById("slider-boost"),R=document.getElementById("boost-val-label"),M=document.getElementById("slider-eye-blend"),y=document.getElementById("eye-blend-val-label"),L=document.getElementById("slider-contour"),B=document.getElementById("contour-val-label"),D=document.getElementById("slider-anti-shake"),N=document.getElementById("anti-shake-val-label"),j=document.getElementById("slider-anim-audio-delay"),W=document.getElementById("anim-audio-delay-val-label"),Q=document.getElementById("app-state-label"),V=document.getElementById("timeline-track");w&&(w.value="0",this.looper.setExpressionBlend(0),w.addEventListener("input",st=>{const P=parseInt(st.target.value,10);this.looper.setExpressionBlend(P/100),b&&(b.textContent=`${P}%`)})),A&&(A.value="50",this.looper.setExpressionBoost(.5),R&&(R.textContent="50%"),A.addEventListener("input",st=>{const P=parseInt(st.target.value,10);this.looper.setExpressionBoost(P/100),R&&(R.textContent=`${P}%`)})),this.looper.setEyeBlend(0),M&&(M.value="0",y&&(y.textContent="0%"),M.addEventListener("input",st=>{const P=parseInt(st.target.value,10);this.looper.setEyeBlend(P/100),y&&(y.textContent=`${P}%`)})),this.looper.setContourFix(1),L&&(L.value="100",B&&(B.textContent="100%"),L.addEventListener("input",st=>{const P=parseInt(st.target.value,10);this.looper.setContourFix(P/100),B&&(B.textContent=`${P}%`)})),this.looper.setAntiShake(1),D&&(D.value="100",N&&(N.textContent="100%"),D.addEventListener("input",st=>{const P=parseInt(st.target.value,10);this.looper.setAntiShake(P/100),N&&(N.textContent=`${P}%`)})),this.autonomousEngine.setAudioDelay(2.2),this.audioLooper.setAudioDelay(2.2),j&&(j.value="2.2",W&&(W.textContent="2.2s"),j.addEventListener("input",st=>{const P=parseFloat(st.target.value);this.autonomousEngine.setAudioDelay(P),this.audioLooper.setAudioDelay(P),W&&(W.textContent=`${P.toFixed(1)}s`)}));const tt=document.getElementById("btn-toggle-audio"),ot=document.getElementById("audio-btn-icon"),nt=document.getElementById("audio-btn-label"),dt=document.getElementById("slider-volume"),Vt=document.getElementById("volume-val-label");tt&&tt.addEventListener("click",()=>{const st=this.audioLooper.toggleMute();tt.classList.toggle("active",!st),ot&&(ot.textContent=st?"🔇":"🔊"),nt&&(nt.textContent=st?"Muted":"Audio")}),dt&&(dt.value="100",this.audioLooper.setVolume(1),Vt&&(Vt.textContent="100%"),dt.addEventListener("input",st=>{const P=parseInt(st.target.value,10);this.audioLooper.setVolume(P/100),Vt&&(Vt.textContent=`${P}%`)}));const X=async()=>{if(this.looper.isRecording)this.looper.stopRecording(),g.classList.remove("recording"),v.textContent="Record Expression",m.disabled=!1,x.disabled=!1,_&&(_.disabled=!1),m.classList.add("active"),p.textContent="❚❚",S.textContent="Loop ON",Q.textContent="LOOPING",await this.audioLooper.stopRecording(this.looper.loopDurationMs)&&this.looper.isPlaying&&this.audioLooper.startPlayback(0,this.looper.loopDurationMs/1e3);else{const st=await this.audioLooper.ensureAudioContext();st&&(this.autonomousEngine.setAudioContext(st),this.animLibrary.setAudioContext(st)),await this.audioLooper.getMicrophoneStream();const P=performance.now();this.looper.startRecording(P),this.audioLooper.startRecording(P),g.classList.add("recording"),v.textContent="Stop Recording",m.disabled=!0,x.disabled=!0,Q.textContent="RECORDING"}};g.addEventListener("click",X),m.addEventListener("click",()=>{this.looper.togglePlayback();const st=this.looper.isPlaying;if(m.classList.toggle("active",st),p.textContent=st?"❚❚":"▶",S.textContent=st?"Loop ON":"Loop OFF",Q.textContent=st?"LOOPING":"LIVE",st&&this.looper.loopDurationMs>0){const Gt=(performance.now()-this.looper.playbackStartTime)*this.looper.playbackSpeed%this.looper.loopDurationMs/1e3;this.audioLooper.startPlayback(Gt,this.looper.loopDurationMs/1e3)}else this.audioLooper.stopPlayback()}),x.addEventListener("click",()=>{this.looper.clear(),this.audioLooper.clear(),m.disabled=!0,x.disabled=!0,_&&(_.disabled=!0);const st=document.getElementById("btn-save-current-loop-modal");st&&(st.disabled=!0),m.classList.remove("active"),p.textContent="▶",S.textContent="Play Loop",document.getElementById("timeline-progress").style.width="0%",document.getElementById("time-current").textContent="0.0s",document.getElementById("time-total").textContent="0.0s",Q.textContent="LIVE"}),V&&V.addEventListener("click",st=>{if(!this.looper.isPlaying||this.looper.loopDurationMs<=0)return;const P=V.getBoundingClientRect(),Gt=Math.max(0,Math.min(1,(st.clientX-P.left)/P.width));this.looper.playbackStartTime=performance.now()-Gt*this.looper.loopDurationMs;const kt=Gt*(this.looper.loopDurationMs/1e3);this.audioLooper.seek(kt,this.looper.loopDurationMs/1e3)});const Z=document.getElementById("btn-upload-video"),ct=document.getElementById("video-file-input"),it=document.getElementById("upload-modal"),xt=document.getElementById("upload-status-text"),Et=document.getElementById("upload-progress-fill"),Ft=document.getElementById("upload-progress-detail"),oe=document.getElementById("btn-cancel-upload");Z&&ct&&(Z.addEventListener("click",()=>{ct.click()}),ct.addEventListener("change",async()=>{var P;const st=(P=ct.files)==null?void 0:P[0];if(st){ct.value="",this.isProcessingVideo=!0,it&&(it.classList.remove("hidden"),Et&&(Et.style.width="0%"),Ft&&(Ft.textContent="0%"),xt&&(xt.textContent="Préparation du fichier vidéo..."));try{const Gt=await this.videoExtractor.extract(st,this.tracker,this.looper.cranial,this.audioLooper,({percent:kt,message:Ut})=>{Et&&(Et.style.width=`${kt}%`),Ft&&(Ft.textContent=`${kt}%`),xt&&(xt.textContent=Ut)});if(this.looper.loadRecordedFrames(Gt.frames,Gt.durationMs),Gt.audioBuffer?(await this.audioLooper.loadAudioBuffer(Gt.audioBuffer,Gt.durationMs/1e3),this.audioLooper.startPlayback(0,Gt.durationMs/1e3)):this.audioLooper.clear(),m.disabled=!1,x.disabled=!1,_&&(_.disabled=!1),m.classList.add("active"),p.textContent="❚❚",S.textContent="Loop ON",Q.textContent="LOOPING",l&&h){const kt=(Gt.durationMs/1e3).toFixed(1);h.textContent=`✓ Vidéo importée (${kt}s, ${Gt.frames.length} frames${Gt.audioBuffer?" + audio":""})`,l.classList.remove("hidden"),setTimeout(()=>{l.classList.add("hidden")},3e3)}}catch(Gt){console.error("Video extraction failed:",Gt),l&&h&&(h.textContent=`Erreur: ${Gt.message||"Échec de l'extraction"}`,l.classList.remove("hidden"),setTimeout(()=>{l.classList.add("hidden")},3500))}finally{it&&it.classList.add("hidden"),this.isProcessingVideo=!1}}})),oe&&oe.addEventListener("click",()=>{this.videoExtractor.cancel(),it&&it.classList.add("hidden"),this.isProcessingVideo=!1}),this.setupAlignControls(),this.setupAnimationLibraryControls(),window.addEventListener("keydown",st=>{var P;st.target.tagName==="INPUT"||st.target.tagName==="SELECT"||(st.code==="Space"?(st.preventDefault(),X()):st.key.toLowerCase()==="m"?t==null||t.click():st.key.toLowerCase()==="u"?Z==null||Z.click():st.key.toLowerCase()==="o"?(P=document.getElementById("btn-toggle-align"))==null||P.click():st.key.toLowerCase()==="a"&&(e==null||e.click()))})}setupAlignControls(){const t=document.getElementById("btn-toggle-align"),e=document.getElementById("align-panel"),i=document.getElementById("btn-close-align"),s=document.getElementById("align-overlay"),r=document.getElementById("align-crosshair"),a=document.getElementById("check-align-grid"),o=document.getElementById("btn-reset-cam-all"),c=document.getElementById("slider-cam-x"),l=document.getElementById("val-cam-x"),h=document.getElementById("slider-cam-y"),u=document.getElementById("val-cam-y"),d=document.getElementById("slider-cam-pitch"),f=document.getElementById("val-cam-pitch"),g=document.getElementById("slider-cam-yaw"),v=document.getElementById("val-cam-yaw"),m=document.getElementById("slider-cam-roll"),p=document.getElementById("val-cam-roll"),S=document.getElementById("slider-cam-zoom"),x=document.getElementById("val-cam-zoom"),_=document.querySelectorAll(".align-btn-reset");this.isAlignModeActive=!1,localStorage.removeItem("facemesh_camera_offset");const w={x:0,y:0,pitch:0,yaw:0,roll:0,zoom:1};this.renderer.setCameraOffset(w);const b=()=>{localStorage.setItem("facemesh_camera_offset",JSON.stringify(this.renderer.getCameraOffset()))},A=()=>{const M=this.renderer.getCameraOffset();c&&(c.value=M.x),l&&(l.textContent=`${Math.round(M.x)}px`),h&&(h.value=M.y),u&&(u.textContent=`${Math.round(M.y)}px`),d&&(d.value=M.pitch),f&&(f.textContent=`${M.pitch.toFixed(1)}°`),g&&(g.value=M.yaw),v&&(v.textContent=`${M.yaw.toFixed(1)}°`),m&&(m.value=M.roll),p&&(p.textContent=`${M.roll.toFixed(1)}°`),S&&(S.value=Math.round(M.zoom*100)),x&&(x.textContent=`${Math.round(M.zoom*100)}%`)};A();const R=M=>{this.isAlignModeActive=M,t&&t.classList.toggle("active",M),e&&e.classList.toggle("hidden",!M),s&&s.classList.toggle("hidden",!M)};if(t&&t.addEventListener("click",()=>{R(!this.isAlignModeActive)}),i&&i.addEventListener("click",()=>{R(!1)}),c&&c.addEventListener("input",M=>{const y=parseFloat(M.target.value);this.renderer.setCameraOffset({x:y}),l&&(l.textContent=`${Math.round(y)}px`),b()}),h&&h.addEventListener("input",M=>{const y=parseFloat(M.target.value);this.renderer.setCameraOffset({y}),u&&(u.textContent=`${Math.round(y)}px`),b()}),d&&d.addEventListener("input",M=>{const y=parseFloat(M.target.value);this.renderer.setCameraOffset({pitch:y}),f&&(f.textContent=`${y.toFixed(1)}°`),b()}),g&&g.addEventListener("input",M=>{const y=parseFloat(M.target.value);this.renderer.setCameraOffset({yaw:y}),v&&(v.textContent=`${y.toFixed(1)}°`),b()}),m&&m.addEventListener("input",M=>{const y=parseFloat(M.target.value);this.renderer.setCameraOffset({roll:y}),p&&(p.textContent=`${y.toFixed(1)}°`),b()}),S&&S.addEventListener("input",M=>{const y=parseFloat(M.target.value),L=y/100;this.renderer.setCameraOffset({zoom:L}),x&&(x.textContent=`${Math.round(y)}%`),b()}),_.forEach(M=>{M.addEventListener("click",()=>{const y=M.dataset.axis,L=this.renderer.getCameraOffset();y==="x"?L.x=0:y==="y"?L.y=0:y==="pitch"?L.pitch=0:y==="yaw"?L.yaw=0:y==="roll"?L.roll=0:y==="zoom"&&(L.zoom=1),this.renderer.setCameraOffset(L),A(),b()})}),o&&o.addEventListener("click",()=>{localStorage.removeItem("facemesh_camera_offset"),this.renderer.resetCameraOffset(),A()}),a&&r&&a.addEventListener("change",M=>{r.classList.toggle("hidden",!M.target.checked)}),s){let M=!1,y=0,L=0,B=!1,D={x:0,y:0,pitch:0,yaw:0};s.addEventListener("mousedown",N=>{N.preventDefault(),M=!0,y=N.clientX,L=N.clientY,B=N.shiftKey||N.button===2,D=this.renderer.getCameraOffset(),s.classList.add("dragging")}),s.addEventListener("contextmenu",N=>{N.preventDefault()}),window.addEventListener("mousemove",N=>{if(!M||!this.isAlignModeActive)return;const j=N.clientX-y,W=N.clientY-L;if(B||N.shiftKey){const tt=Math.round(D.x+j*1),ot=Math.round(D.y-W*1);this.renderer.setCameraOffset({x:Math.max(-300,Math.min(300,tt)),y:Math.max(-300,Math.min(300,ot))})}else{const tt=Number((D.yaw+j*.25).toFixed(1)),ot=Number((D.pitch-W*.25).toFixed(1));this.renderer.setCameraOffset({yaw:Math.max(-45,Math.min(45,tt)),pitch:Math.max(-45,Math.min(45,ot))})}A()}),window.addEventListener("mouseup",()=>{M&&(M=!1,s.classList.remove("dragging"),b())}),s.addEventListener("wheel",N=>{N.preventDefault();const j=this.renderer.getCameraOffset(),W=N.deltaY>0?-.05:.05,Q=Math.max(.5,Math.min(1.8,Number((j.zoom+W).toFixed(2))));this.renderer.setCameraOffset({zoom:Q}),A(),b()},{passive:!1})}}setupAnimationLibraryControls(){const t=document.getElementById("btn-save-anim"),e=document.getElementById("btn-open-anim-library"),i=document.getElementById("anim-library-modal"),s=document.getElementById("backdrop-anim-library"),r=document.getElementById("btn-close-anim-modal"),a=document.getElementById("btn-close-anim-modal-2"),o=document.getElementById("btn-save-current-loop-modal"),c=document.getElementById("toggle-autonomous-playback"),l=document.getElementById("save-anim-modal"),h=document.getElementById("backdrop-save-anim"),u=document.getElementById("btn-close-save-modal"),d=document.getElementById("btn-cancel-save-anim"),f=document.getElementById("btn-confirm-save-anim"),g=document.getElementById("save-anim-name-input"),v=()=>{if(!this.looper.recordedFrames||this.looper.recordedFrames.length===0){alert("Enregistrez d'abord une expression avec le bouton Record ou importez une vidéo.");return}if(l&&(l.classList.remove("hidden"),g)){g.value="";const _=`Performance ${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}`;g.placeholder=_,setTimeout(()=>g.focus(),50)}},m=()=>{l&&l.classList.add("hidden")},p=async()=>{if(!this.looper.recordedFrames||this.looper.recordedFrames.length===0)return;const _=`Performance ${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}`,w=g&&g.value.trim()?g.value.trim():_;f.disabled=!0,f.textContent="Enregistrement...";try{const b=this.audioLooper?this.audioLooper.exportWavBase64():null,A=this.looper.exportAnimation(w,b);if(A){await this.animLibrary.saveAnimation(w,A),this.updateAnimationBadge(),this.renderAnimationList(),m();const R=document.getElementById("calibration-toast"),M=document.getElementById("cal-text");R&&M&&(M.textContent=`✓ Animation "${w}" sauvegardée dans public/animations/ !`,R.classList.remove("hidden"),setTimeout(()=>R.classList.add("hidden"),3e3))}}catch(b){console.error("Save animation error:",b),alert(`Échec de la sauvegarde: ${b.message}`)}finally{f.disabled=!1,f.textContent="Enregistrer"}};t&&t.addEventListener("click",v),o&&o.addEventListener("click",v),u&&u.addEventListener("click",m),d&&d.addEventListener("click",m),h&&h.addEventListener("click",m),f&&f.addEventListener("click",p),g&&g.addEventListener("keydown",_=>{_.key==="Enter"?(_.preventDefault(),p()):_.key==="Escape"&&m()});const S=()=>{this.renderAnimationList(),i&&(i.classList.remove("hidden"),o&&(o.disabled=!this.looper.recordedFrames||this.looper.recordedFrames.length===0))},x=()=>{i&&i.classList.add("hidden")};e&&e.addEventListener("click",S),r&&r.addEventListener("click",x),a&&a.addEventListener("click",x),s&&s.addEventListener("click",x),c&&(c.checked=this.animLibrary.isAutonomousPlaybackEnabled,c.addEventListener("change",_=>{const w=!!_.target.checked;this.animLibrary.setAutonomousPlaybackEnabled(w);const b=document.getElementById("calibration-toast"),A=document.getElementById("cal-text");b&&A&&(A.textContent=w?"✓ Lecture aléatoire (50%) activée en mode autonome":"Lecture aléatoire désactivée en mode autonome",b.classList.remove("hidden"),setTimeout(()=>b.classList.add("hidden"),2500))})),this.animLibrary.addEventListener("list:updated",()=>{this.updateAnimationBadge()})}updateAnimationBadge(){const t=document.getElementById("anim-count-badge"),e=document.getElementById("anim-list-count-label"),i=this.animLibrary?this.animLibrary.getActiveAnimationCount():0;t&&(t.textContent=i),e&&(e.textContent=`${i} animation${i>1?"s":""}`)}renderAnimationList(){const t=document.getElementById("anim-list-container");if(!t)return;t.innerHTML="";const e=this.animLibrary.getAnimations();if(this.updateAnimationBadge(),!e||e.length===0){t.innerHTML=`
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
          Aucune animation enregistrée pour le moment.
        </div>
      `;return}for(const i of e){const s=document.createElement("div");s.className="anim-item-card";const r=((i.durationMs||0)/1e3).toFixed(1),a=i.id&&i.id.startsWith("preset_");s.innerHTML=`
        <div class="anim-item-info">
          <div class="anim-item-title-row">
            <span class="anim-item-name">${i.name||"Animation"}</span>
            ${i.hasAudio?'<span class="anim-item-badge audio">🔊 Audio</span>':""}
            ${a?'<span class="anim-item-badge">Prédéfini</span>':'<span class="anim-item-badge">Enregistré</span>'}
          </div>
          <div class="anim-item-meta">
            ${r}s • ${i.frameCount||(i.frames?i.frames.length:0)} frames • 📁 ${i.filename||i.id+".json"}
          </div>
        </div>
        <div class="anim-item-actions">
          <button class="anim-btn-test" title="Tester immédiatement l'animation sur le masque">▶ Tester</button>
          <button class="anim-btn-del" title="Supprimer cette animation">🗑️</button>
        </div>
      `,s.querySelector(".anim-btn-test").addEventListener("click",async()=>{var h;const l=await this.animLibrary.getAnimationData(i.filename||i.id);l&&(this.appState!=="AUTONOMOUS"&&(this.setState("AUTONOMOUS"),this.applyBestTextureReference(performance.now()),this.autonomousEngine.startAutonomous(performance.now(),this.lastTrackingLandmarks,this.lastTrackingHeadPose)),this.autonomousEngine.playAnimation(l,performance.now()),(h=document.getElementById("anim-library-modal"))==null||h.classList.add("hidden"))}),s.querySelector(".anim-btn-del").addEventListener("click",async()=>{confirm(`Supprimer l'animation "${i.name}" du dossier public/animations/ ?`)&&(await this.animLibrary.deleteAnimation(i.filename||`${i.id}.json`),this.renderAnimationList(),this.updateAnimationBadge())}),t.appendChild(s)}}startLoop(){const t=document.getElementById("stat-fps"),e=document.getElementById("stat-latency"),i=document.getElementById("time-current"),s=document.getElementById("time-total"),r=document.getElementById("timeline-progress");this.setState("WAITING");const a=()=>{const o=performance.now();if(this.isProcessingVideo){this.rafId=requestAnimationFrame(a);return}const c=this.tracker.processVideoFrame(this.videoEl,o),l=!!(c&&c.detected&&!this.forceAutonomousMode),h=(this.videoEl.videoWidth||1280)/Math.max(1,this.videoEl.videoHeight||720);if(this.visitorDetector.setAspectRatio(h),this.visitorDetector.update(l?c:null,this.videoEl,o),l){this.consecutiveDetectedFrames++,this.lastFaceDetectedTime=o,!this.isBlendingToLive&&this.appState!=="AUTONOMOUS"&&this.renderer.isTextureFrozen&&this.renderer.unfreezeFaceTexture(),this.appState==="AUTONOMOUS"?(this.isBlendingToLive=!0,this.blendToLiveStartTime=o,this.blendToLiveDuration=700,this.autoExitLandmarks=this.autonomousEngine.lastAutonomousLandmarks?this.autonomousEngine.lastAutonomousLandmarks.map(m=>({x:m.x,y:m.y,z:m.z||0})):null,this.autonomousEngine.stopAutonomous(),this.appState!=="NEW_PERSON"&&this.setState("LIVE")):this.appState!=="NEW_PERSON"&&this.appState!=="LIVE"&&this.setState("LIVE"),c.isNewFrame!==!1&&this.historyBuffer.recordFrame(this.videoEl,c,o);const u=this.historyBuffer.bestOverallCandidate;u&&u.landmarks&&this.autonomousEngine.setBaseLandmarks(u.landmarks),this.lastTrackingLandmarks=c.landmarks.map(m=>({x:m.x,y:m.y,z:m.z||0,visibility:m.visibility})),this.lastTrackingHeadPose=c.headPose?{...c.headPose}:null;const d=this.videoEl.videoWidth||1280,f=this.videoEl.videoHeight||720;(this.lastFaceCanvas.width!==d||this.lastFaceCanvas.height!==f)&&(this.lastFaceCanvas.width=d,this.lastFaceCanvas.height=f),this.lastFaceCtx.drawImage(this.videoEl,0,0,d,f),this.autonomousEngine.updateLiveFace(c),this.autoCalibrator.update(c,o);const g=(this.videoEl.videoWidth||1280)/(this.videoEl.videoHeight||720),v=this.looper.process(c,o,g);if(v&&v.detected){let m=v;if(this.isBlendingToLive&&this.autoExitLandmarks){const p=o-this.blendToLiveStartTime;if(p<this.blendToLiveDuration){const S=Math.max(0,Math.min(1,p/this.blendToLiveDuration)),x=S*S*S*(S*(S*6-15)+10),_=1-x,w=new Array(v.landmarks.length);for(let b=0;b<v.landmarks.length;b++){const A=v.landmarks[b],R=this.autoExitLandmarks[b]||A;w[b]={x:R.x*_+A.x*x,y:R.y*_+A.y*x,z:(R.z||0)*_+(A.z||0)*x,visibility:A.visibility}}m={...v,landmarks:w,blendToLiveWeight:_}}else this.isBlendingToLive=!1,this.autoExitLandmarks=null,this.renderer.isTextureFrozen&&this.renderer.unfreezeFaceTexture()}this.lastRenderedTrackingResult=m,this.renderer.render(m)}c.latencyMs&&e&&(e.textContent=`${Math.round(c.latencyMs)}ms`)}else if(this.consecutiveDetectedFrames=0,this.autonomousEngine.hasSeenFace||this.forceAutonomousMode){this.appState!=="AUTONOMOUS"&&(this.setState("AUTONOMOUS"),this.hasTakenSnapshotForVisitor=!1,this.isBlendingToLive=!1,this.autoExitLandmarks=null,this.applyBestTextureReference(o),this.autonomousEngine.startAutonomous(o,this.lastTrackingLandmarks,this.lastTrackingHeadPose));const{renderW:u,renderH:d}=this.renderer.getVideoMetrics(),f=this.autonomousEngine.generateFrame(o,u,d);if(f){this.lastRenderedTrackingResult=f,this.renderer.render(f);const g=document.getElementById("app-state-label");g&&this.appState==="AUTONOMOUS"&&(f.activeAnimationName&&f.animBlendWeight>.05?g.textContent=`AUTO // ${f.activeAnimationName.toUpperCase()} (50%)`:g.textContent="AUTONOME")}e&&(e.textContent="0ms")}else this.appState!=="WAITING"&&this.setState("WAITING"),this.renderer.clear(),e&&(e.textContent="0ms");if(this.looper.isRecording){const u=(o-this.looper.recordingStartTime)/1e3;i.textContent=`${u.toFixed(1)}s`,s.textContent="REC...",r.style.width="100%"}else if(this.looper.isPlaying&&this.looper.loopDurationMs>0){const d=(o-this.looper.playbackStartTime)*this.looper.playbackSpeed%this.looper.loopDurationMs,f=this.looper.loopDurationMs/1e3,g=d/1e3;i.textContent=`${g.toFixed(1)}s`,s.textContent=`${f.toFixed(1)}s`,r.style.width=`${d/this.looper.loopDurationMs*100}%`}this.fpsCounter++,o-this.lastFpsTime>=500&&(this.currentFps=Math.round(this.fpsCounter*1e3/(o-this.lastFpsTime)),t&&(t.textContent=this.currentFps),this.fpsCounter=0,this.lastFpsTime=o),this.rafId=requestAnimationFrame(a)};this.rafId=requestAnimationFrame(a)}applyBestTextureReference(t=performance.now(),e=1500){const i=this.historyBuffer.getBestVisitorBackupFrame(t,e);if(i&&i.canvas&&i.landmarks){const s=(t-i.timestamp).toFixed(0);return console.log(`[FaceTextureHistoryBuffer] 🎭 Texture autonome de référence appliquée (Âge: ${s}ms, Score: ${Math.round(i.qualityScore)})`),this.renderer.freezeFaceTexture(i.canvas,i.landmarks),this.autonomousEngine.setBaseLandmarks(i.landmarks),!0}else{if(this.autonomousEngine.baseLandmarks&&this.renderer.isTextureFrozen)return!0;if(this.lastTrackingLandmarks&&this.videoEl&&this.videoEl.readyState>=2)return this.renderer.freezeFaceTexture(this.videoEl,this.lastTrackingLandmarks),this.autonomousEngine.setBaseLandmarks(this.lastTrackingLandmarks),!0}return!1}handlePristineCapture(t={}){const{canvas:e,landmarks:i,score:s,dataUrl:r}=t;if(console.log(`[FaceTextureHistoryBuffer] 🌟 Meilleure référence faciale capturée ! (Score: ${Math.round(s)})`),i&&this.autonomousEngine.setBaseLandmarks(i),this.autoSnapshotEnabled&&r){const o=new Date().toLocaleTimeString(),c={id:Date.now(),dataUrl:r,timeStr:o,width:(e==null?void 0:e.width)||this.videoEl.videoWidth||1280,height:(e==null?void 0:e.height)||this.videoEl.videoHeight||720,isPristine:!0};this.latestSnapshot=c,this.recentSnapshots.push(c),this.showSnapshotToast(r,o)}}handleNewVisitor(t={}){const e=performance.now(),i=t.reason||"BIOMETRIC_CHANGE",s=t.dissimilarity!==void 0?t.dissimilarity.toFixed(3):"N/A";console.log(`[VisitorDetector] 👤 Nouveau visiteur détecté ! (Raison: ${i}, Dissimilarité: ${s})`),this.hasTakenSnapshotForVisitor=!0,this.lastSnapshotTimestamp=e,this.setState("NEW_PERSON"),this.canvasBroadcaster&&this.canvasBroadcaster.notifyNewVisitor(t),this.historyBuffer.resetVisitorSession(),this.autoSnapshotEnabled&&this.captureWebcamSnapshot(),setTimeout(()=>{this.appState==="NEW_PERSON"&&this.setState("LIVE")},1800)}setState(t){this.appState=t,document.body.classList.toggle("state-autonomous",t==="AUTONOMOUS");const e=document.getElementById("state-stat-container"),i=document.getElementById("app-state-label");if(!(!e||!i))switch(e.classList.remove("state-waiting","state-live","state-new-person","state-autonomous"),t){case"WAITING":e.classList.add("state-waiting"),i.textContent="WAITING";break;case"LIVE":e.classList.add("state-live"),i.textContent="LIVE";break;case"NEW_PERSON":e.classList.add("state-new-person"),i.textContent="NOUVEAU VISITEUR";break;case"AUTONOMOUS":e.classList.add("state-autonomous"),i.textContent="AUTONOME";break;default:i.textContent=t}}triggerShutterFlash(){const t=document.getElementById("camera-flash");t&&(t.classList.remove("flash-active"),t.offsetWidth,t.classList.add("flash-active"),setTimeout(()=>{t.classList.remove("flash-active")},45))}playShutterSound(){try{const t=window.AudioContext||window.webkitAudioContext;if(!t)return;const e=new t,i=e.currentTime,s=e.createOscillator(),r=e.createGain();s.type="triangle",s.frequency.setValueAtTime(320,i),s.frequency.exponentialRampToValueAtTime(40,i+.04),r.gain.setValueAtTime(.35,i),r.gain.exponentialRampToValueAtTime(.001,i+.045),s.connect(r),r.connect(e.destination),s.start(i),s.stop(i+.05);const a=e.sampleRate*.05,o=e.createBuffer(1,a,e.sampleRate),c=o.getChannelData(0);for(let d=0;d<a;d++)c[d]=(Math.random()*2-1)*Math.exp(-d/(e.sampleRate*.015));const l=e.createBufferSource();l.buffer=o;const h=e.createBiquadFilter();h.type="highpass",h.frequency.value=2400;const u=e.createGain();u.gain.setValueAtTime(.28,i+.01),u.gain.exponentialRampToValueAtTime(.001,i+.055),l.connect(h),h.connect(u),u.connect(e.destination),l.start(i+.01),l.stop(i+.06)}catch{}}showSnapshotToast(t,e){const i=document.getElementById("snapshot-toast"),s=document.getElementById("snapshot-toast-img"),r=document.getElementById("snapshot-toast-time");!i||!s||(s.src=t,r&&(r.textContent=e),i.classList.remove("hidden"),this.toastTimeout&&clearTimeout(this.toastTimeout),this.toastTimeout=setTimeout(()=>{i.classList.add("hidden")},6e3))}downloadSnapshot(t,e){const i=document.createElement("a");i.href=t,i.download=e||`webcam_snapshot_${Date.now()}.jpg`,document.body.appendChild(i),i.click(),document.body.removeChild(i)}captureWebcamSnapshot(){if(!this.videoEl||this.videoEl.readyState<2)return null;const t=this.videoEl.videoWidth||1280,e=this.videoEl.videoHeight||720,i=document.createElement("canvas");i.width=t,i.height=e;const s=i.getContext("2d");this.isMirrored&&(s.translate(t,0),s.scale(-1,1)),s.drawImage(this.videoEl,0,0,t,e);const r=i.toDataURL("image/jpeg",.92),o=new Date().toLocaleTimeString(),c={id:Date.now(),dataUrl:r,timeStr:o,width:t,height:e};return this.latestSnapshot=c,this.recentSnapshots.push(c),this.showSnapshotToast(r,o),c}captureSnapshot(){const t=document.createElement("canvas");t.width=this.videoEl.videoWidth||1280,t.height=this.videoEl.videoHeight||720;const e=t.getContext("2d");e.fillStyle=this.showWebcam?"#000000":"#ffffff",e.fillRect(0,0,t.width,t.height),this.showWebcam&&(e.save(),this.isMirrored&&(e.translate(t.width,0),e.scale(-1,1)),e.drawImage(this.videoEl,0,0,t.width,t.height),e.restore()),e.drawImage(this.canvasEl,0,0,t.width,t.height),t.toBlob(i=>{const s=URL.createObjectURL(i),r=document.createElement("a");r.href=s,r.download=`facemesh_capture_${Date.now()}.png`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s)},"image/png")}}window.addEventListener("DOMContentLoaded",()=>{new o3});
