const puppeteer = require("puppeteer");

const synthStatAddress = "https://stats.synthetix.io/";
const targetSelector =
  "#__next > section > div:nth-child(1) > div.AreaChart__ChartContainer-byfowl-0.cgqFPM > div.AreaChart__ChartHeader-byfowl-1.fCzPMT > div.ChartTitle__ContentContainer-sc-192w4k8-0.kEwMiq > div.ChartTitle__BottomSegment-sc-192w4k8-3.lbizaX > div.ChartTitle__MainNumber-sc-192w4k8-2.yXNbh";

const growthPercentSelector =
  "#__next > section > div:nth-child(1) > div.AreaChart__ChartContainer-byfowl-0.cgqFPM > div.AreaChart__ChartHeader-byfowl-1.fCzPMT > div.ChartTitle__ContentContainer-sc-192w4k8-0.kEwMiq > div.ChartTitle__BottomSegment-sc-192w4k8-3.lbizaX > div.common__PercentChangeBox-o2in1x-0.frqhyk";

const selectors = [
  { name: "SNXPrice", selector: targetSelector },
  { name: "Growth Percent", selector: growthPercentSelector },
];

console.log("here it is");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 4000,
    deviceScaleFactor: 1,
  });
  await page.goto(synthStatAddress, {
    waitUntil: "networkidle2",
  });
  //await page.waitForTimeout(60000);

  await page.screenshot({ path: "example.png", fullPage: true });

  const foo = () => {
    const promises = selectors.map(async (ss) => {
      return {
        name: ss.name,
        elementHandle: await page.$(ss.selector),
      };
    });
    return Promise.all(promises);
  };

  const bar = (elementHandlers) => {
    const promises = elementHandlers.map(async (eh) => {
      return {
        name: eh.name,
        value: await page.evaluate(
          (el) => el.textContent,
          eh.elementHandle
        ),
      };
    });
    return Promise.all(promises);
  };

  foo()
    .then((result) => {
      return bar(result);
    })
    .then((result) => {
      console.log(result);
      browser.close();
    })
    .catch((err) => {
      console.log(err);
      browser.close();
    });

  //const dataCollector = selectors.map((ss) => ({
  //  name: ss.name,
  //  querySelector: await page.$(ss.selector),
  //}));
  //
  //console.log(dataCollector);

  /*   const dataEvaluator = async () =>
    Promise.all(
      dataSelectors.map((selector) => ({
        name: selector.name,
        value: page.evaluate((el) => {
          console.log(selector, el);
          return el.textContent;
        }, selector.querySelector),
      }))
    );

  console.log(await dataEvaluator());
  const doc = await page.$(targetSelector);
  let value = await page.evaluate((el) => el.textContent, doc);
  console.log(value);*/
})();
