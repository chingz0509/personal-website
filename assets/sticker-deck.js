(function attachStickerDeck(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  root.StickerDeck = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createStickerDeckApi() {
  const cards = [
    {
      eyebrow: "01 / HELLO",
      title: "你好，我是程卓。",
      body: "设计产品体验，也偶尔帮复杂系统收拾房间。",
    },
    {
      eyebrow: "02 / NOW",
      title: "最近常出没于 AI × Tools。",
      body: "我关心的不只是“能不能做”，还有“用户敢不敢用”。",
    },
    {
      eyebrow: "03 / PATH",
      title: "我的路径不算直线。",
      body: "从 B 端复杂系统出发，现在也在持续探索 C 端与 AI 体验。",
      note: "工作经历与教育信息，等真实资料到位后再展开。",
    },
    {
      eyebrow: "04 / SYSTEMS",
      title: "复杂系统并没有坏脾气。",
      body: "很多时候，只是信息还没坐对位置。",
    },
    {
      eyebrow: "05 / AI EXPERIENCE",
      title: "AI 可以聪明，体验不能靠猜。",
      body: "结果需要解释，操作可以回退，用户始终知道发生了什么。",
    },
    {
      eyebrow: "06 / CAPABILITY",
      title: "我不太喜欢技能墙。",
      body: "比起罗列软件名称，我更想展示自己如何理解产品、组织信息、完成原型并推动落地。",
    },
    {
      eyebrow: "07 / METHOD",
      title: "先把问题说成人话。",
      body: "再把方案做出来，最后让真实反馈来挑刺。",
    },
    {
      eyebrow: "08 / PRINCIPLE",
      title: "复杂越具体，设计越有力。",
      body: "设计不仅要看起来成立，也要真正服务任务、系统和人。",
      action: {
        label: "继续看作品",
        href: "#projects",
      },
    },
  ];

  const wrapIndex = (index, length) => ((index % length) + length) % length;

  const createState = (items, initialIndex = 0) => {
    let index = wrapIndex(initialIndex, items.length);

    return {
      get index() {
        return index;
      },
      get current() {
        return items[index];
      },
      next() {
        index = wrapIndex(index + 1, items.length);
        return this.current;
      },
      previous() {
        index = wrapIndex(index - 1, items.length);
        return this.current;
      },
      goTo(nextIndex) {
        index = wrapIndex(nextIndex, items.length);
        return this.current;
      },
    };
  };

  return { cards, createState, wrapIndex };
});
