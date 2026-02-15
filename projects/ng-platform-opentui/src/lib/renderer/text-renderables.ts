import { CliRenderer, TextAttributes, TextNodeOptions, TextNodeRenderable } from '@opentui/core';

export class SpanRenderable extends TextNodeRenderable {
  constructor(_: CliRenderer | null = null, options: TextNodeOptions = {}) {
    super(options);
  }
}

export class BoldSpanRenderable extends SpanRenderable {
  constructor(_: CliRenderer, options: TextNodeOptions = {}) {
    super(_, options);
    this.attributes |= TextAttributes.BOLD;
  }
}

export class ItalicSpanRenderable extends SpanRenderable {
  constructor(_: CliRenderer, options: TextNodeOptions = {}) {
    super(_, options);
    this.attributes |= TextAttributes.ITALIC;
  }
}

export class UnderlineSpanRenderable extends SpanRenderable {
  constructor(_: CliRenderer, options: TextNodeOptions = {}) {
    super(_, options);
    this.attributes |= TextAttributes.UNDERLINE;
  }
}

export class LineBreakRenderable extends SpanRenderable {
  constructor(_: CliRenderer, options: TextNodeOptions = {}) {
    super(_, options);
    this.add('\n');
  }
}

export class LinkRenderable extends SpanRenderable {
  constructor(_: CliRenderer, options: TextNodeOptions = {}) {
    super(_, { ...options, link: { url: '' } });
  }
}
