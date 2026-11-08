(function () {
  const TIME_ZONE = 'Europe/London';
  const LATITUDE = 51.5072;
  const LONGITUDE = -0.1276;
  const PALETTES = {
    night: {
      bg: '#101822',
      bgRgb: [16, 24, 34],
      surface: '#19232F',
      ink: '#E3E7E8',
      muted: '#9DAAB3',
      border: '#35424E',
      strongBg: '#202D3B',
      strongText: '#F1ECE4',
      strongMuted: '#BBC4CB'
    },
    dawn: {
      bg: '#332D35',
      bgRgb: [51, 45, 53],
      surface: '#413842',
      ink: '#F4E8DF',
      muted: '#C3B4B1',
      border: '#62535B',
      strongBg: '#59414A',
      strongText: '#FFF0DD',
      strongMuted: '#E2C9BD'
    },
    goldenHour: {
      bg: '#F0E2D3',
      bgRgb: [240, 226, 211],
      surface: '#F9F0E6',
      ink: '#3F3540',
      muted: '#796D72',
      border: '#D8C6B7',
      strongBg: '#59454A',
      strongText: '#FFF8EF',
      strongMuted: '#D6C5BB'
    },
    day: {
      bg: '#F7F3EE',
      bgRgb: [247, 243, 238],
      surface: '#FEFCF9',
      ink: '#1F3048',
      muted: '#72808C',
      border: '#DDD6C8',
      strongBg: '#1F3048',
      strongText: '#FEFCF9',
      strongMuted: '#BBC4CB'
    },
    dusk: {
      bg: '#382B31',
      bgRgb: [56, 43, 49],
      surface: '#47363A',
      ink: '#F4E5DC',
      muted: '#C5B2AB',
      border: '#65504D',
      strongBg: '#51373A',
      strongText: '#FFF0E6',
      strongMuted: '#DCC6BD'
    }
  };
  const londonFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23'
  });
  let fixedTime = null;
  let currentState = null;

  function getLondonTime(date) {
    const parts = {};
    londonFormatter.formatToParts(date).forEach((part) => {
      if (part.type !== 'literal') parts[part.type] = Number(part.value);
    });
    return {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      hour: parts.hour,
      minute: parts.minute,
      second: parts.second
    };
  }

  function parseFixedTime(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
    if (!match) {
      throw new TypeError('Use London local time in YYYY-MM-DDTHH:mm[:ss] format.');
    }

    const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
    const time = {
      year: Number(yearText),
      month: Number(monthText),
      day: Number(dayText),
      hour: Number(hourText),
      minute: Number(minuteText),
      second: Number(secondText || 0)
    };
    const date = new Date(Date.UTC(time.year, time.month - 1, time.day));

    if (
      date.getUTCFullYear() !== time.year ||
      date.getUTCMonth() + 1 !== time.month ||
      date.getUTCDate() !== time.day ||
      time.hour > 23 ||
      time.minute > 59 ||
      time.second > 59
    ) {
      throw new TypeError('The supplied London local time is not a valid date and time.');
    }
    return time;
  }

  function getSunTimes(dayOfYear, time) {
    const declination = 23.44 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365);
    const latitudeRadians = (LATITUDE * Math.PI) / 180;
    const declinationRadians = (declination * Math.PI) / 180;
    const hourAngle = Math.acos(
      -Math.tan(latitudeRadians) * Math.tan(declinationRadians)
    );
    const daylightHours = (24 * hourAngle) / Math.PI;
    const utcNoon = new Date(Date.UTC(time.year, time.month - 1, time.day, 12));
    const utcOffset = getLondonTime(utcNoon).hour - 12;
    const solarNoon = 12 + utcOffset - LONGITUDE / 15;

    return {
      sunrise: solarNoon - daylightHours / 2,
      sunset: solarNoon + daylightHours / 2,
      daylightHours
    };
  }

  function interpolateColor(start, end, amount) {
    const startRgb = start.match(/[A-Fa-f0-9]{2}/g).map((channel) => parseInt(channel, 16));
    const endRgb = end.match(/[A-Fa-f0-9]{2}/g).map((channel) => parseInt(channel, 16));
    return startRgb.map((channel, index) =>
      Math.round(channel + (endRgb[index] - channel) * amount)
    );
  }

  function getLuminance(rgb) {
    const linear = rgb.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }

  function getMinimumContrast(foreground, backgrounds) {
    const foregroundLuminance = getLuminance(foreground);
    return Math.min(...backgrounds.map((background) => {
      const backgroundLuminance = getLuminance(background);
      return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    }));
  }

  function ensureTextContrast(foreground, backgrounds) {
    const minimumContrast = 4.5;
    if (getMinimumContrast(foreground, backgrounds) >= minimumContrast) return foreground;

    const black = [0, 0, 0];
    const white = [255, 255, 255];
    const target = getMinimumContrast(black, backgrounds) >= getMinimumContrast(white, backgrounds)
      ? black
      : white;
    let low = 0;
    let high = 1;

    for (let iteration = 0; iteration < 8; iteration += 1) {
      const amount = (low + high) / 2;
      const candidate = foreground.map((channel, index) =>
        Math.round(channel + (target[index] - channel) * amount)
      );
      if (getMinimumContrast(candidate, backgrounds) >= minimumContrast) {
        high = amount;
      } else {
        low = amount;
      }
    }

    return foreground.map((channel, index) =>
      Math.round(channel + (target[index] - channel) * high)
    );
  }

  function calculatePalette(time) {
    const dayOfYear = Math.floor(
      (Date.UTC(time.year, time.month - 1, time.day) - Date.UTC(time.year, 0, 0)) /
      86400000
    );
    const sun = getSunTimes(dayOfYear, time);
    const clockHours = time.hour + time.minute / 60 + time.second / 3600;
    const hoursSinceSunrise = (clockHours - sun.sunrise + 24) % 24;
    const anchors = [
      { at: 0.1, palette: 'goldenHour' },
      { at: 1.25, palette: 'day' },
      { at: sun.daylightHours - 2, palette: 'day' },
      { at: sun.daylightHours - 0.7, palette: 'goldenHour' },
      { at: sun.daylightHours + 0.5, palette: 'dusk' },
      { at: sun.daylightHours + 1.75, palette: 'night' },
      { at: 22.75, palette: 'dawn' }
    ];
    let start;
    let end;
    let interpolationTime = hoursSinceSunrise;

    if (hoursSinceSunrise < anchors[0].at) {
      start = { ...anchors[anchors.length - 1], at: anchors[anchors.length - 1].at - 24 };
      end = anchors[0];
      interpolationTime -= 24;
    } else {
      for (let index = 0; index < anchors.length; index += 1) {
        if (hoursSinceSunrise < anchors[index].at) {
          start = anchors[index - 1];
          end = anchors[index];
          break;
        }
      }
      if (!end) {
        start = anchors[anchors.length - 1];
        end = { ...anchors[0], at: anchors[0].at + 24 };
      }
    }

    const amount = (interpolationTime - start.at) / (end.at - start.at);
    const from = PALETTES[start.palette];
    const to = PALETTES[end.palette];
    const palette = {};

    ['bg', 'surface', 'ink', 'muted', 'border', 'strongBg', 'strongText', 'strongMuted']
      .forEach((key) => {
        palette[key] = interpolateColor(from[key], to[key], amount);
      });
    palette.ink = ensureTextContrast(palette.ink, [palette.bg, palette.surface]);
    palette.muted = ensureTextContrast(palette.muted, [palette.bg, palette.surface]);
    palette.strongMuted = ensureTextContrast(palette.strongMuted, [palette.strongBg]);
    palette.opinionAccent = ensureTextContrast([46, 108, 114], [palette.bg]);

    return {
      palette,
      phase: start.palette,
      sunrise: sun.sunrise,
      sunset: sun.sunset,
      daylightHours: sun.daylightHours,
      londonTime: time
    };
  }

  function toCssColor(rgb) {
    return `rgb(${rgb.join(', ')})`;
  }

  function render() {
    const time = fixedTime || getLondonTime(new Date());
    currentState = calculatePalette(time);
    const rootStyle = document.documentElement.style;

    rootStyle.setProperty('--bg', toCssColor(currentState.palette.bg));
    rootStyle.setProperty('--bg-rgb', currentState.palette.bg.join(', '));
    rootStyle.setProperty('--surface', toCssColor(currentState.palette.surface));
    rootStyle.setProperty('--ink', toCssColor(currentState.palette.ink));
    rootStyle.setProperty('--muted', toCssColor(currentState.palette.muted));
    rootStyle.setProperty('--border', toCssColor(currentState.palette.border));
    rootStyle.setProperty('--opinion-accent', toCssColor(currentState.palette.opinionAccent));
    rootStyle.setProperty('--strong-bg', toCssColor(currentState.palette.strongBg));
    rootStyle.setProperty('--strong-text', toCssColor(currentState.palette.strongText));
    rootStyle.setProperty('--strong-muted', toCssColor(currentState.palette.strongMuted));
  }

  function getState() {
    const time = currentState.londonTime;
    const formattedTime = [
      time.year,
      String(time.month).padStart(2, '0'),
      String(time.day).padStart(2, '0')
    ].join('-') + ` ${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

    return {
      time: formattedTime,
      phase: currentState.phase,
      sunrise: currentState.sunrise,
      sunset: currentState.sunset,
      daylightHours: currentState.daylightHours
    };
  }

  const queryTime = new URLSearchParams(window.location.search).get('themeTime');
  if (queryTime) {
    try {
      fixedTime = parseFixedTime(queryTime);
    } catch (error) {
      console.error(`Ignoring invalid themeTime query parameter: ${error.message}`);
    }
  }

  window.timeThemeDebug = Object.freeze({
    setTime(value) {
      fixedTime = parseFixedTime(value);
      render();
      return getState();
    },
    reset() {
      fixedTime = null;
      render();
      return getState();
    },
    getState
  });

  render();
  window.setInterval(render, 60000);
})();
