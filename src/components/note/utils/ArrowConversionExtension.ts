import { Extension } from "@tiptap/core";

export const ArrowConversionExtension = Extension.create({
  name: 'arrowConversion',

  addInputRules() {
    return [
      {
        find: /->/g,
        handler: ({ state, range, chain }) => {
          const { from, to } = range;
          const tr = state.tr.replaceWith(from, to, state.schema.text('→'));
          chain().insertContent(tr).run();
        },
      },
    ];
  },
})

export const DableRightConversionExtension = Extension.create({
  name: 'dableRightConversion',

  addInputRules() {
    return [
      {
        find: />>/g,
        handler: ({ state, range, chain }) => {
          const { from, to } = range;
          const tr = state.tr.replaceWith(from, to, state.schema.text('»'));
          chain().insertContent(tr).run();
        },
      },
    ];
  },
})

export const DableLeftConversionExtension = Extension.create({
  name: 'dableLeftConversion',

  addInputRules() {
    return [
      {
        find: /<</g,
        handler: ({ state, range, chain }) => {
          const { from, to } = range;
          const tr = state.tr.replaceWith(from, to, state.schema.text('«'));
          chain().insertContent(tr).run();
        },
      },
    ];
  },
})