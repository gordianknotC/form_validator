/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
// const cColors = require("./src/presentation/assets/colors/default_colors");

/**
 * 以下用來擋掉 tailwind future color migration warning
 * tailwind 3.0.24 之後無效
 */
delete colors["lightBlue"];
delete colors["warmGray"];
delete colors["trueGray"];
delete colors["coolGray"];
delete colors["blueGray"];

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        // ...cColors,
        current: "currentColor",
        transparent: "transparent"
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }
        md: "768px",
        // => @media (min-width: 768px) { ... }
        lg: "1024px",
        // => @media (min-width: 1024px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1536px"
        // => @media (min-width: 1536px) { ... }
      },
      fontSize: {
        "2xs": "0.625rem;"
      },
      // backgroundColor: _ => Object.assign({}, cColors.bg),
      // textColor: _ => Object.assign({}, cColors.text),
      zIndex: {
        75: 75,
        100: 100
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "10px"
      },
      dropShadow: {
        DEFAULT: "1.93535px 4.96164px 8.4491px rgba(209, 217, 230, 0.67)"
      },
      boxShadow: {
        DEFAULT:
          "1.93535px 4.96164px 8.4491px rgba(209, 217, 230, 0.8), -3.29px -4.24667px 8.19689px rgba(255, 255, 255, 0.75)"
      },
      fontFamily: {
        Lexend: ["Lexend", "sans-serif"],
        SFProDisplay: ["SFProDisplay", "sans-serif"]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        /** -------------------------
         *      background class
         - -------------------------- */
        ".header-bg": {
          // backgroundColor: cColors.primary.d1
        },
        ".tab-gradient-bg": {
          background:
            "linear-gradient(90deg, rgba(76,105,151,1.0) 0%, rgba(64,93,138,1.0) 100%)"
        },
        ".aside-gradient-bg": {
          background: "linear-gradient(1.73deg, #00193E 0%, #072C64 100%)"
        },
        /** -------------------------
         *          shadow 
         - -------------------------- */
        ".input-inner-shadow": {
          boxShadow:
            "inset 4.79419px 3.83535px 5.43341px rgba(209, 217, 230, 0.34),\n" +
            "      inset 4.79419px 4.47458px 6.07264px rgba(209, 217, 230, 0.4),\n" +
            "      inset 4.79419px 5.59322px 7.19128px rgba(209, 217, 230, 0.48),\n" +
            "      inset 4.79419px 8.62954px 9.74818px rgba(209, 217, 230, 0.67),\n" +
            "      inset -3.19613px -10.0678px 10.3874px rgba(255, 255, 255, 0.75),\n" +
            "      inset -3.19613px -5.88633px 6.81923px rgba(255, 255, 255, 0.539141),\n" +
            "      inset -3.19613px -5.01213px 5.59737px rgba(255, 255, 255, 0.44708),\n" +
            "      inset -3.19613px -4.54145px 4.82082px rgba(255, 255, 255, 0.375)"
        },
        ".button-shadow": {
          boxShadow:
            "-3.3px 0px 3px 1.8px rgba(255, 255, 255, 0.25), 2px 3.3px 7px -1.8px rgba(14, 14, 44, 0.2), inset 0.6px 0.6px 0.6px rgba(255, 255, 255, 0.5)"
        },
        ".button-active-shadow": {
          boxShadow:
            "inset 4.79419px 3.83535px 5.43341px rgba(209, 217, 230, 0.34), inset 4.79419px 4.47458px 6.07264px rgba(209, 217, 230, 0.4), inset 4.79419px 5.59322px 7.19128px rgba(209, 217, 230, 0.48), inset 4.79419px 8.62954px 9.74818px rgba(209, 217, 230, 0.67), inset -3.19613px -10.0678px 10.3874px rgba(255, 255, 255, 0.75), inset -3.19613px -5.88633px 6.81923px rgba(255, 255, 255, 0.539141), inset -3.19613px -5.01213px 5.59737px rgba(255, 255, 255, 0.44708), inset -3.19613px -4.54145px 4.82082px rgba(255, 255, 255, 0.375)"
        },
        ".button-primary-active-shadow": {
          boxShadow:
            "inset 2.32446px 1.85956px 2.63438px rgba(0, 56, 255, 0.5), inset 2.32446px 2.16949px 2.94431px rgba(0, 55, 255, 0.4), inset 2.32446px 2.71186px 3.48668px rgba(0, 55, 255, 0.48), inset 2.32446px 4.18402px 4.72639px rgba(0, 55, 255, 0.67), inset -1.54964px -4.88136px 5.03632px rgba(145, 169, 255, 0.75), inset -1.54964px -2.85398px 3.3063px rgba(144, 169, 255, 0.539141), inset -1.54964px -2.43012px 2.71388px rgba(144, 169, 255, 0.44708), inset -1.54964px -2.20192px 2.33737px rgba(144, 169, 255, 0.375)"
        },
        ".button-secondary-active-shadow": {
          boxShadow:
            "inset 2.32446px 1.85956px 2.63438px rgba(21, 192, 151, 0.75), inset 2.32446px 2.16949px 2.94431px rgba(21, 192, 151, 0.4), inset 2.32446px 2.71186px 3.48668px rgba(21, 192, 151, 0.48), inset 2.32446px 4.18402px 4.72639px rgba(21, 192, 151, 0.67), inset -1.54964px -4.88136px 5.03632px rgba(69, 239, 198, 0.75), inset -1.54964px -2.85398px 3.3063px rgba(69, 239, 198, 0.539141), inset -1.54964px -2.43012px 2.71388px rgba(69, 239, 198, 0.44708), inset -1.54964px -2.20192px 2.33737px rgba(69, 239, 198, 0.375)"
        }
      });
    }
  ],
  experimental: {
    applyComplexClasses: true
  }
};
