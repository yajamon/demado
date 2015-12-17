"use strict";
(() => {
  Message.me().send("/mado/list").then((res) => {
    for (var key in res.list) {
      if (key == location.href) {
        var mado = res.list[key];
        return Launcher.of(window).modify(mado.bounds);
      }
    }
  }).then(() => {
    window.onresize = (ev) => {
      Message.me().send("/page/onresize", {
        w: window.innerWidth,
        h: window.innerHeight
      });
    };
    return Promise.resolve();
  }).then(() => {
    TabMessage.listen((req, sender, res) => {
      if (!req.bounds) return res({msg:"invalid"});
      // adjust offset
      Launcher.of(window).modify(req.bounds);
      return res({msg:"ok"});
    });
  });
})();
