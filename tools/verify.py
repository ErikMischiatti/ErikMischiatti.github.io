"""Browser verification for the built site (stdlib only; drives headless Chrome over the
DevTools protocol). No Python or Node dependencies.

usage:
  python3 tools/verify.py BASE_URL OUTDIR page1[,page2...] [--widths 1440,1024,768,390]
                          [--prefix NAME] [--tabs N]
  e.g. python3 tools/verify.py http://127.0.0.1:8766/ shots index.html,pages/rtk_base_station.html

For every page and width it records: horizontal overflow, the lowest text contrast, loaded
fonts, images (rendered size, loading), links, targets under 24 px, reduced-motion scroll
behaviour, smallest rendered SVG text, and optionally the keyboard tab order with focus
styles. It writes full-page and first-screen PNGs and a JSON report. It does not replace
manual testing with screen readers or other browsers.
"""
import base64, json, os, socket, struct, subprocess, sys, tempfile, time, urllib.request

PORT = 9333


class WS:
    def __init__(self, url):
        hostport, path = url[len("ws://"):].split("/", 1)
        host, port = hostport.split(":")
        self.s = socket.create_connection((host, int(port)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\n"
                        f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n").encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.s.recv(4096)
        self.buf = buf.split(b"\r\n\r\n", 1)[1]
        self.id = 0
        self.events = []

    def _recv_exact(self, n):
        while len(self.buf) < n:
            chunk = self.s.recv(1 << 20)
            if not chunk:
                raise EOFError
            self.buf += chunk
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def _recv_msg(self):
        data = b""
        while True:
            b1, b2 = self._recv_exact(2)
            fin, op, ln = b1 & 0x80, b1 & 0x0F, b2 & 0x7F
            if ln == 126:
                ln = struct.unpack(">H", self._recv_exact(2))[0]
            elif ln == 127:
                ln = struct.unpack(">Q", self._recv_exact(8))[0]
            data += self._recv_exact(ln)
            if fin:
                return json.loads(data)

    def send(self, method, params=None, timeout=60):
        self.id += 1
        msg = json.dumps({"id": self.id, "method": method, "params": params or {}}).encode()
        hdr = bytes([0x81])
        ln = len(msg)
        if ln < 126:
            hdr += bytes([0x80 | ln])
        elif ln < 65536:
            hdr += bytes([0x80 | 126]) + struct.pack(">H", ln)
        else:
            hdr += bytes([0x80 | 127]) + struct.pack(">Q", ln)
        mask = os.urandom(4)
        self.s.sendall(hdr + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(msg)))
        while True:
            m = self._recv_msg()
            if m.get("id") == self.id:
                if "error" in m:
                    raise RuntimeError(f"{method}: {m['error']}")
                return m.get("result", {})
            self.events.append(m)

    def drain(self, seconds):
        self.s.settimeout(0.2)
        end = time.time() + seconds
        while time.time() < end:
            try:
                self.events.append(self._recv_msg())
            except (socket.timeout, BlockingIOError):
                pass
        self.s.settimeout(None)

    def eval(self, expr):
        r = self.send("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        if "exceptionDetails" in r:
            raise RuntimeError(r["exceptionDetails"])
        return r["result"].get("value")


CHECKS = r"""
(async () => {
  await document.fonts.ready;
  const W = innerWidth, out = {};
  out.scrollWidth = document.documentElement.scrollWidth; out.innerWidth = W;
  // elements sticking out of the viewport horizontally (ignoring things clipped by an overflow container)
  const over = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || getComputedStyle(el).display === 'none') continue;
    if (r.right > W + 1 || r.left < -1) {
      let p = el.parentElement, clipped = false;
      while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'hidden' || o === 'scroll') { clipped = true; break; } p = p.parentElement; }
      if (!clipped && !el.closest('.vh,.ev__w,.skip')) over.push(el.tagName + '.' + el.className + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
    }
  }
  out.overflow = over.slice(0, 12);
  out.fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.stretch);
  out.archivoBody = getComputedStyle(document.body).fontFamily;
  out.fontCheck = document.fonts.check('700 16px Archivo');
  // images
  out.images = [...document.images].map(i => { const r = i.getBoundingClientRect(); return {
    src: (i.currentSrc || i.src).split('/').slice(-2).join('/'), loading: i.loading, complete: i.complete, nat: i.naturalWidth,
    w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + scrollY), shown: r.width > 0,
    ratio: r.width ? +(i.naturalWidth / (r.width * devicePixelRatio)).toFixed(2) : null }; });
  // contrast of text against effective background
  const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const [r,g,b] = m.slice(0,3).map(v => { v/=255; return v <= .03928 ? v/12.92 : ((v+.055)/1.055)**2.4; }); return .2126*r + .7152*g + .0722*b; };
  const bgOf = el => { while (el) { const b = getComputedStyle(el).backgroundColor; if (b && !/rgba\(.*, 0\)$/.test(b) && b !== 'transparent') return b; el = el.parentElement; } return 'rgb(255,255,255)'; };
  const seen = {}; let min = 99, minEl = '';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue;
    const el = t.parentElement; if (el.closest('.lab-bar,.lab-note,.vh,.skip,svg')) continue;
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    const fg = cs.color, bg = bgOf(el); const L1 = lum(fg), L2 = lum(bg);
    const cr = (Math.max(L1,L2) + .05) / (Math.min(L1,L2) + .05);
    const k = fg + ' on ' + bg; seen[k] = +cr.toFixed(2);
    if (cr < min) { min = cr; minEl = el.tagName + '.' + el.className + ': ' + t.textContent.trim().slice(0, 40); }
  }
  out.contrastPairs = seen; out.contrastMin = +min.toFixed(2); out.contrastMinEl = minEl;
  // small touch targets (links/buttons narrower or lower than 24px, and those under 44px tall)
  const small = [];
  for (const a of document.querySelectorAll('main a, header a, video')) { const r = a.getBoundingClientRect(); if (r.width && r.height < 24) small.push(a.textContent.trim().slice(0,30) + ' ' + Math.round(r.height)); }
  out.smallTargets = small;
  out.reducedMotionScroll = getComputedStyle(document.documentElement).scrollBehavior;
  out.links = [...document.querySelectorAll('a[href]')].map(a => a.href);
  out.height = document.documentElement.scrollHeight;
  out.svgText = [...document.querySelectorAll('svg')].filter(s => s.getBoundingClientRect().width > 0 && s.viewBox && s.viewBox.baseVal && s.viewBox.baseVal.width).map(s => {
    const k = s.getBoundingClientRect().width / s.viewBox.baseVal.width;
    const fs = [...s.querySelectorAll('text')].map(t => parseFloat(getComputedStyle(t).fontSize) * k);
    return { title: (s.querySelector('title') || {}).textContent, min: fs.length ? +Math.min(...fs).toFixed(1) : null };
  });
  out.h1 = document.querySelectorAll('h1').length;
  return out;
})()
"""

TAB_PROBE = r"""
(() => { const a = document.activeElement; const cs = getComputedStyle(a); const r = a.getBoundingClientRect();
  return { tag: a.tagName, text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 40), href: a.getAttribute('href'),
           outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow !== 'none', visible: r.width > 0 && r.bottom > 0 }; })()
"""


def main():
    base, outdir, pages = sys.argv[1].rstrip("/") + "/", sys.argv[2], sys.argv[3].split(",")
    widths = [1440, 1024, 768, 390]
    prefix = "site"
    tabs = 0
    if "--widths" in sys.argv:
        widths = [int(w) for w in sys.argv[sys.argv.index("--widths") + 1].split(",")]
    if "--prefix" in sys.argv:
        prefix = sys.argv[sys.argv.index("--prefix") + 1]
    if "--tabs" in sys.argv:
        tabs = int(sys.argv[sys.argv.index("--tabs") + 1])
    os.makedirs(outdir, exist_ok=True)
    prof = tempfile.mkdtemp(prefix="verify-chrome-")
    chrome = subprocess.Popen(["google-chrome", "--headless=new", f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
                               f"--user-data-dir={prof}", "--no-first-run", "--hide-scrollbars", "--disable-gpu", "about:blank"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try:
                tabs_json = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json"))
                break
            except Exception:
                time.sleep(0.2)
        ws = WS([t for t in tabs_json if t["type"] == "page"][0]["webSocketDebuggerUrl"])
        ws.send("Page.enable"); ws.send("Network.enable", {"cacheDisabled": True} if False else {}); ws.send("Runtime.enable")
        ws.send("Network.setCacheDisabled", {"cacheDisabled": True})
        report = {}
        for page in pages:
            name = page.replace("/", "_").replace(".html", "")
            for w in widths:
                h = 844 if w <= 400 else (1024 if w == 768 else (768 if w == 1024 else 900))
                mobile = w <= 400
                ws.send("Emulation.setDeviceMetricsOverride", {"width": w, "height": h, "deviceScaleFactor": 2 if mobile else 1, "mobile": mobile})
                ws.send("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
                ws.events.clear()
                ws.send("Page.navigate", {"url": base + page})
                ws.drain(2.5)
                # requests made before any scrolling = what the first screen costs
                def img_requests():
                    reqs = {}
                    for e in ws.events:
                        if e.get("method") == "Network.responseReceived":
                            r = e["params"]["response"]; reqs[e["params"]["requestId"]] = [r["url"].split("/")[-1], r.get("mimeType"), 0]
                        if e.get("method") == "Network.loadingFinished" and e["params"]["requestId"] in reqs:
                            reqs[e["params"]["requestId"]][2] = e["params"]["encodedDataLength"]
                    return list(reqs.values())
                initial = img_requests()
                vp_shot = ws.send("Page.captureScreenshot", {"format": "png"})
                with open(os.path.join(outdir, f"{prefix}-{name}-{w}-first-screen.png"), "wb") as f:
                    f.write(base64.b64decode(vp_shot["data"]))
                # scroll through to trigger lazy images
                total = ws.eval("document.documentElement.scrollHeight")
                for y in range(0, total, h // 2):
                    ws.eval(f"window.scrollTo(0,{y})"); ws.drain(0.15)
                ws.eval("window.scrollTo(0,0)"); ws.drain(1.0)
                after = img_requests()
                res = ws.eval(CHECKS)
                res["firstScreenBytes"] = sum(x[2] for x in initial)
                res["firstScreenRequests"] = [(x[0], x[2]) for x in initial if x[1] and (x[1].startswith("image") or x[1].startswith("font") or x[1].startswith("video"))]
                res["allBytes"] = sum(x[2] for x in after)
                res["allRequests"] = [(x[0], x[2]) for x in after if x[1] and (x[1].startswith("image") or x[1].startswith("video"))]
                # full-page capture
                height = ws.eval("document.documentElement.scrollHeight")
                ws.send("Emulation.setDeviceMetricsOverride", {"width": w, "height": height, "deviceScaleFactor": 1, "mobile": mobile})
                ws.drain(0.8)
                shot = ws.send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True})
                with open(os.path.join(outdir, f"{prefix}-{name}-{w}.png"), "wb") as f:
                    f.write(base64.b64decode(shot["data"]))
                ws.send("Emulation.setDeviceMetricsOverride", {"width": w, "height": h, "deviceScaleFactor": 2 if mobile else 1, "mobile": mobile})
                if tabs and w in (1440, 390):
                    seq = []
                    ws.eval("window.scrollTo(0,0); document.activeElement && document.activeElement.blur()")
                    for i in range(tabs):
                        ws.send("Input.dispatchKeyEvent", {"type": "keyDown", "key": "Tab", "code": "Tab", "windowsVirtualKeyCode": 9})
                        ws.send("Input.dispatchKeyEvent", {"type": "keyUp", "key": "Tab", "code": "Tab", "windowsVirtualKeyCode": 9})
                        ws.drain(0.05)
                        seq.append(ws.eval(TAB_PROBE))
                        if i in (1, 9, 13):
                            sh = ws.send("Page.captureScreenshot", {"format": "png"})
                            with open(os.path.join(outdir, f"{prefix}-{name}-{w}-focus-{i+1}.png"), "wb") as f:
                                f.write(base64.b64decode(sh["data"]))
                    res["tabOrder"] = seq
                report[f"{name}@{w}"] = res
                print(f"{name}@{w}: scrollW={res['scrollWidth']} overflow={len(res['overflow'])} contrastMin={res['contrastMin']} "
                      f"fonts={len(res['fonts'])} svgMin={min([s['min'] for s in res['svgText'] if s['min']] or [0])} firstScreen={res['firstScreenBytes']//1024}kB all={res['allBytes']//1024}kB h={res['height']}", flush=True)
        with open(os.path.join(outdir, f"{prefix}-report.json"), "w") as f:
            json.dump(report, f, indent=1)
    finally:
        chrome.terminate()
        chrome.wait()
        import shutil; shutil.rmtree(prof, ignore_errors=True)


if __name__ == "__main__":
    main()
