import { Pipe, PipeTransform } from '@angular/core';
import {
  StylableInput,
  StyledText,
  t,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  brightBlack,
  brightRed,
  brightGreen,
  brightYellow,
  brightBlue,
  brightMagenta,
  brightCyan,
  brightWhite,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bold,
  italic,
  underline,
  strikethrough,
  dim,
  blink,
  Color,
  fg,
  bg,
  link,
  reverse,
} from '@opentui/core';

// Color Pipes
@Pipe({ name: 'black' })
export class BlackPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${black(value)}`;
  }
}

@Pipe({ name: 'red' })
export class RedPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${red(value)}`;
  }
}

@Pipe({ name: 'green' })
export class GreenPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${green(value)}`;
  }
}

@Pipe({ name: 'yellow' })
export class YellowPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${yellow(value)}`;
  }
}

@Pipe({ name: 'blue' })
export class BluePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${blue(value)}`;
  }
}

@Pipe({ name: 'magenta' })
export class MagentaPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${magenta(value)}`;
  }
}

@Pipe({ name: 'cyan' })
export class CyanPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${cyan(value)}`;
  }
}

@Pipe({ name: 'white' })
export class WhitePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${white(value)}`;
  }
}

// Bright Color Pipes
@Pipe({ name: 'brightBlack' })
export class BrightBlackPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightBlack(value)}`;
  }
}

@Pipe({ name: 'brightRed' })
export class BrightRedPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightRed(value)}`;
  }
}

@Pipe({ name: 'brightGreen' })
export class BrightGreenPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightGreen(value)}`;
  }
}

@Pipe({ name: 'brightYellow' })
export class BrightYellowPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightYellow(value)}`;
  }
}

@Pipe({ name: 'brightBlue' })
export class BrightBluePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightBlue(value)}`;
  }
}

@Pipe({ name: 'brightMagenta' })
export class BrightMagentaPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightMagenta(value)}`;
  }
}

@Pipe({ name: 'brightCyan' })
export class BrightCyanPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightCyan(value)}`;
  }
}

@Pipe({ name: 'brightWhite' })
export class BrightWhitePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${brightWhite(value)}`;
  }
}

// Background Color Pipes
@Pipe({ name: 'bgBlack' })
export class BgBlackPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgBlack(value)}`;
  }
}

@Pipe({ name: 'bgRed' })
export class BgRedPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgRed(value)}`;
  }
}

@Pipe({ name: 'bgGreen' })
export class BgGreenPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgGreen(value)}`;
  }
}

@Pipe({ name: 'bgYellow' })
export class BgYellowPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgYellow(value)}`;
  }
}

@Pipe({ name: 'bgBlue' })
export class BgBluePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgBlue(value)}`;
  }
}

@Pipe({ name: 'bgMagenta' })
export class BgMagentaPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgMagenta(value)}`;
  }
}

@Pipe({ name: 'bgCyan' })
export class BgCyanPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgCyan(value)}`;
  }
}

@Pipe({ name: 'bgWhite' })
export class BgWhitePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bgWhite(value)}`;
  }
}

// Style Pipes
@Pipe({ name: 'bold' })
export class BoldPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${bold(value)}`;
  }
}

@Pipe({ name: 'italic' })
export class ItalicPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${italic(value)}`;
  }
}

@Pipe({ name: 'underline' })
export class UnderlinePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${underline(value)}`;
  }
}

@Pipe({ name: 'strikethrough' })
export class StrikethroughPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${strikethrough(value)}`;
  }
}

@Pipe({ name: 'dim' })
export class DimPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${dim(value)}`;
  }
}

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${reverse(value)}`;
  }
}

@Pipe({ name: 'blink' })
export class BlinkPipe implements PipeTransform {
  transform(value: StylableInput): StyledText {
    return t`${blink(value)}`;
  }
}

// Custom Color Pipes
@Pipe({ name: 'fg' })
export class FgPipe implements PipeTransform {
  transform(value: StylableInput, color: Color): StyledText {
    return t`${fg(color)(value)}`;
  }
}

@Pipe({ name: 'bg' })
export class BgPipe implements PipeTransform {
  transform(value: StylableInput, color: Color): StyledText {
    return t`${bg(color)(value)}`;
  }
}

@Pipe({ name: 'link' })
export class LinkPipe implements PipeTransform {
  transform(value: StylableInput, url: string): StyledText {
    return t`${link(url)(value)}`;
  }
}
