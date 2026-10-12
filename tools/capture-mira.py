"""Offscreen frame capture of the real M.I.R.A. widgets (read-only use of the package).

Builds the production application graph (rule engine, no camera, no audio backend,
no system watchers) and the real DesktopShell, then grabs frames of the main window
and the notch with QWidget.grab(). Inputs are simulated only as a user would give
them: typed chat text, and pointer enter/leave on the notch.
"""
import sys
from pathlib import Path

from PySide6.QtCore import QPointF, QTimer
from PySide6.QtGui import QEnterEvent
from PySide6.QtCore import QCoreApplication, QEvent
from PySide6.QtWidgets import QApplication

from mira.application.composition import build_application
from mira.ui.desktop_shell import DesktopShell, Surface

OUT = Path(sys.argv[1])
FPS = 25
for sub in ("main", "notch"):
    (OUT / sub).mkdir(parents=True, exist_ok=True)

app = QApplication(sys.argv[:1])
application = build_application()
shell = DesktopShell(application, initial_surface=Surface.MAIN_WINDOW)
application.start()
shell.start()
shell.show_surface(Surface.NOTCH)
window, notch = shell.window, shell.notch
print("main window", window.size().toTuple(), "notch", notch.size().toTuple())

state = {"main": 0, "notch": 0, "t": 0}
log = []


def grab():
    t = state["t"]
    window.grab().save(str(OUT / "main" / f"{state['main']:04d}.png"))
    state["main"] += 1
    notch.grab().save(str(OUT / "notch" / f"{state['notch']:04d}.png"))
    state["notch"] += 1
    state["t"] += 1


def type_text(text, start_tick):
    for i in range(1, len(text) + 1):
        QTimer.singleShot(int((start_tick + i * 2) * 1000 / FPS),
                          lambda s=text[:i]: window.chat_panel.input_line.setText(s))
    return start_tick + len(text) * 2


def mark(name):
    log.append((state["t"], name))
    print(f"[{state['t']:4d}] {name}")


def submit():
    mark("submit")
    window.chat_panel.input_line.returnPressed.emit()


def enter():
    mark("notch enter")
    p = QPointF(notch.width() / 2, 10)
    QCoreApplication.sendEvent(notch, QEnterEvent(p, p, notch.mapToGlobal(p)))


def leave():
    mark("notch leave")
    QCoreApplication.sendEvent(notch, QEvent(QEvent.Leave))


timer = QTimer()
timer.timeout.connect(grab)
timer.start(int(1000 / FPS))

ms = lambda tick: int(tick * 1000 / FPS)
# Timeline (ticks at 25 fps): idle, notch hover, idle, typed question, reply.
QTimer.singleShot(ms(75), enter)
QTimer.singleShot(ms(150), leave)
QTimer.singleShot(ms(150), lambda: window.chat_panel.input_line.setFocus())
end_typing = type_text("ciao M.I.R.A.", 200)
QTimer.singleShot(ms(end_typing + 10), submit)
end_typing2 = type_text("che ore sono?", end_typing + 70)
QTimer.singleShot(ms(end_typing2 + 10), submit)
QTimer.singleShot(ms(end_typing2 + 120), lambda: (mark("end"), app.quit()))

app.aboutToQuit.connect(shell.shutdown)
app.aboutToQuit.connect(application.shutdown)
app.exec()
(OUT / "timeline.txt").write_text("\n".join(f"{t} {n}" for t, n in log))
