import i18next from "i18next";
import FSBackend from "i18next-fs-backend";

i18next.use(FSBackend).init(
  {
    debug: false,
    initImmediate: false,

    fallbackLng: "en",
    lng: "en",

    defaultNS: "nothing",

    backend: {
      loadPath: "../locales/{{lng}}/{{ns}}.json",
      addPath: "../locales/{{lng}}/{{ns}}.missing.json",
    },

    returnObjects: true,
  },
  async (err, t) => {
    const v = t("owner:dev_panel");
    console.log(v);
  }
);

// (async () => {
//   const t = await i18next.changeLanguage("ru");
//   console.log(t("owner:dev_panel"));
// })();
