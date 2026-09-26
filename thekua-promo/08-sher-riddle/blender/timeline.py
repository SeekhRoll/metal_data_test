"""The film's timeline (brief §3): scenes, the seven crossings, who is on which island after each, the lion-move
intervals and the catchphrase cues. Exported to src/film/timeline.json for Remotion and the checks."""
import json
import os

# Scene lengths follow the recorded narration (the brief's windows, stretched a little: 91.5 s in all)
FPS, DUR = 24, 91.5
SCENES = [('S1', 0, 8.4), ('S2', 8.4, 25.0), ('S3', 25.0, 28.4), ('S4', 28.4, 38.6), ('S5', 38.6, 85.0), ('S6', 85.0, 91.5)]
T0, STEP = 38.8, 6.6                                  # crossing k starts at T0 + (k-1)*STEP
BOARD, PUSH, ARRIVE, UNLOAD = .2, 1.3, 4.5, 4.7        # offsets inside a crossing
# (cargo, direction) for the 7 crossings; direction +1 = to the far island
CROSSINGS = [('goat', 1), (None, -1), ('lion', 1), ('goat', -1), ('cabbage', 1), (None, -1), ('goat', 1)]
# the wrong attempt in scene 4: the lion leaps aboard as the boat pushes off; the goat eats the cabbage
WRONG = {'push': 32.3, 'stop': 35.0, 'goat_walk': 32.9, 'munch': 33.6, 'turn': 35.0, 'wipe': 37.8, 'reset': 38.55}
# other story beats (seconds)
BEATS = {
    'wave': (.5, 2.4), 'swing': (9.0, 14.0), 'farmer_board': 14.4, 'goat_in': 15.6, 'goat_out': 24.0,
    'scratch': (25.1, 28.2), 'freeze': (25.9, 28.2),
    'lion_yawn': (4.0, 5.4), 'farmer_off': 85.3, 'nuzzle': (86.4, 90.0), 'yawn2': (87.2, 88.8), 'golden': (86.6, 90.6), 'pullup': (86.8, 91.5),
    'panel_in': 38.2,
}
BUBBLES = [{'who': 'lion', 'from': 17.0, 'to': 20.3}, {'who': 'goat', 'from': 20.5, 'to': 24.2}]


def crossing_times(k):
    t = T0 + (k - 1) * STEP
    return {'start': t, 'board': t + BOARD, 'push': t + PUSH, 'arrive': t + ARRIVE, 'unload': t + UNLOAD, 'end': t + STEP}


def states():
    """who is where after each crossing (checked against the brief's solution table)"""
    near, far = {'lion', 'goat', 'cabbage'}, set()
    out = [{'k': 0, 'near': sorted(near), 'far': sorted(far)}]
    for k, (cargo, d) in enumerate(CROSSINGS, 1):
        if cargo:
            (near, far) = (near - {cargo}, far | {cargo}) if d > 0 else (near | {cargo}, far - {cargo})
        out.append({'k': k, 'near': sorted(near), 'far': sorted(far)})
    return out


def lion_moves():
    """every interval in which the lion is carried: from the leap aboard (= push-off) until it steps off"""
    iv = [{'from': WRONG['push'], 'to': WRONG['stop'], 'what': 'wrong attempt'}]
    for k, (cargo, _) in enumerate(CROSSINGS, 1):
        if cargo == 'lion':
            c = crossing_times(k)
            iv.append({'from': c['push'], 'to': c['unload'] + 1.0, 'what': f'crossing {k}'})
    return iv


def export(path):
    data = {'fps': FPS, 'duration': DUR, 'scenes': [{'id': a, 'from': b, 'to': c} for a, b, c in SCENES],
            'crossings': [{'k': k, 'cargo': cg, 'dir': d, **crossing_times(k)} for k, (cg, d) in enumerate(CROSSINGS, 1)],
            'states': states(), 'lionMoving': lion_moves(), 'catchphrase': [m['from'] for m in lion_moves()], 'wrong': WRONG,
            'beats': BEATS, 'bubbles': BUBBLES}
    json.dump(data, open(path, 'w'), indent=1)
    return data


if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    d = export(os.path.join(root, 'src/film/timeline.json'))
    for s in d['states']: print(s)
    print(d['lionMoving'])
