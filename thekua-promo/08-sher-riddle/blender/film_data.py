"""World layout for the film (shared by the Blender shots and the checks)."""
import math

NEAR, FAR = (-0.9, 0.2), (1.6, 7.6)                 # the two islands ("इस पार" near, "उस पार" far)
_d = (FAR[0] - NEAR[0], FAR[1] - NEAR[1]); _n = math.hypot(*_d); D = (_d[0] / _n, _d[1] / _n)
DOCK = {'near': (NEAR[0] + D[0] * 2.3, NEAR[1] + D[1] * 2.3), 'far': (FAR[0] - D[0] * 2.3, FAR[1] - D[1] * 2.3)}
HEADING = math.degrees(math.atan2(D[1], D[0]))       # the boat's bow points at the far island


def at(island, dx, dy):
    c = NEAR if island == 'near' else FAR
    return (c[0] + dx, c[1] + dy)


SPOT = {
    'near': {'farmer': at('near', .7, .55), 'lion': at('near', -1.05, .15), 'goat': at('near', .95, -.45), 'cabbage': at('near', -.1, -.75)},
    'far': {'farmer': at('far', -.4, -.75), 'lion': at('far', .95, .1), 'goat': at('far', -1.0, -.35), 'cabbage': at('far', .3, -.85)},
}
ROT = {'farmer': 10, 'lion': 25, 'goat': -25, 'cabbage': 0}
CAM = {'wide': ((0.5, -7.0, 8.8), (0.35, 4.1, 0.0), 33)}
NEAR_PALMS = [((-1.5, .75), 2.3, -.3), ((-.5, 1.15), 1.8, -.2)]
FAR_PALMS = [((-.9, .9), 2.2, -.3), ((1.4, .8), 1.8, .25)]
