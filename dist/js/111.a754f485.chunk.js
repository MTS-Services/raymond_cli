"use strict";
(self.webpackChunkreact_webpack_tailwind_app =
  self.webpackChunkreact_webpack_tailwind_app || []).push([
  [111],
  {
    111(e, s, a) {
      (a.r(s), a.d(s, { default: () => l }), a(6540));
      var t = a(9608),
        r = a(697),
        n = a(8445),
        i = a(4848);
      const l = function () {
        return (0, i.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, i.jsxs)("div", {
              className: "flex items-center justify-between",
              children: [
                (0, i.jsxs)("div", {
                  children: [
                    (0, i.jsx)("h1", {
                      className: "text-2xl font-bold text-gray-900",
                      children: "Jobs",
                    }),
                    (0, i.jsx)("p", {
                      className: "text-gray-500 text-sm mt-1",
                      children: "Post and manage job listings.",
                    }),
                  ],
                }),
                (0, i.jsxs)("button", {
                  type: "button",
                  className:
                    "flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20 cursor-pointer",
                  children: [
                    (0, i.jsx)(r.A, { size: 16, "aria-hidden": "true" }),
                    "Post Job",
                  ],
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className:
                "bg-white rounded-2xl border border-gray-100 shadow-sm",
              children: [
                (0, i.jsxs)("div", {
                  className:
                    "flex items-center gap-3 px-5 py-4 border-b border-gray-100",
                  children: [
                    (0, i.jsx)(n.A, {
                      size: 16,
                      className: "text-gray-400 shrink-0",
                      "aria-hidden": "true",
                    }),
                    (0, i.jsx)("input", {
                      type: "search",
                      placeholder: "Search jobs...",
                      className:
                        "flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent",
                    }),
                  ],
                }),
                (0, i.jsxs)("div", {
                  className:
                    "flex flex-col items-center justify-center py-20 gap-3 text-gray-400",
                  children: [
                    (0, i.jsx)(t.A, {
                      size: 36,
                      className: "text-gray-200",
                      "aria-hidden": "true",
                    }),
                    (0, i.jsx)("p", {
                      className: "text-sm",
                      children:
                        "No job listings yet. Connect your backend to load data.",
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      };
    },
  },
]);
