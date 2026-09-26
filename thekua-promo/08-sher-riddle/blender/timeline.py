"""The film's timeline (brief §3): scenes, the seven crossings, who is on which island after each, the lion-move
intervals and the catchphrase cues. Exported to src/film/timeline.json for Remotion and the checks."""
import json
import os

FPS, DUR = 24, 90.0
SCENES = [('S1', 0, 6), ('S2', 6, 20), ('S3', 20, 24), ('S4', 24, 34), ('S5', 34, 83), ('S6', 83, 90)]
T0, STEP = 34.0, 7.0                                  # crossing k starts at T0 + (k-1)*STEP
BOARD, PUSH, ARRIVE, UNLOAD = .2, 1.4, 4.9, 5.1        # offsets inside a crossing
# (cargo, direction) for the 7 crossings; direction +1 = to the far island
CROSSINGS = [('goat', 1), (None, -1), ('lion', 1), ('goat', -1), ('cabbage', 1), (None, -1), ('goat', 1)]
# the wrong attempt in scene 4: the lion leaps aboard as the boat pushes off; the goat eats the cabbage
WRONG = {'push': 26.0, 'stop': 29.2, 'goat_walk': 26.8, 'munch': 27.6, 'turn': 29.2, 'wipe': 31.6, 'reset': 32.4}


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
            'states': states(), 'lionMoving': lion_moves(), 'catchphrase': [m['from'] for m in lion_moves()], 'wrong': WRONG}
    json.dump(data, open(path, 'w'), indent=1)
    return data


if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    d = export(os.path.join(root, 'src/film/timeline.json'))
    for s in d['states']: print(s)
    print(d['lionMoving'])
