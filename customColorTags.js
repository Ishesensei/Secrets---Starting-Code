import chalk from 'chalk';
export { colorTags, chalk };
const colorTags = {
  httpReq: () => {
    console.log(
      chalk.overline.underline.bgBlack.bold(`[-(New HTTP Request Recieved!)-]`)
    );
  },
  log: (el, el2, el3, el4) => {
    var el2 = el2 ? `\n${el2}` : ``;
    var el3 = el3 ? `\n${el3}` : ``;
    var el4 = el4 ? `\n${el4}` : ``;

    console.log(`LOG>`);
    console.log(
      chalk.overline.underline.bgHex('3876BF')(`                          `)
    );
    console.log(chalk.bgHex('3876BF')(`${el}${el2}${el3}${el4}`));
    console.log(
      chalk.overline.underline.bgHex('3876BF')(`                          `),
      `\n`
    );
  },
};
