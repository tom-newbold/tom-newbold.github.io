This site was long overdue an update, so here is the second iteration! A lot less disorginised, and a hell of a lot better looking.

Scaffolded by Claude, refined with Copilot, finishing touches applied by yours truly.

## Time-based theme testing

The page estimates sunrise and sunset for London from the date and interpolates
between night, dawn, golden-hour, day, and dusk palettes. To preview a fixed
London local time, open the page with `?themeTime=2026-06-21T12:00`, or use the
browser console:

```js
timeThemeDebug.setTime('2026-06-21T12:00')
timeThemeDebug.getState()
timeThemeDebug.reset()
```

The debug time uses `YYYY-MM-DDTHH:mm[:ss]` without a timezone suffix.