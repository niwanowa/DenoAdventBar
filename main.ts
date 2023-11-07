import { MultiProgressBar } from "https://deno.land/x/progress@v1.3.9/mod.ts";

const title = "Advent Calendar Progress";
const total = 100;

// progressオブジェクトの型を定義
interface ProgressFromJson {
  title: string;
  progress: string;
}

interface Progress {
  title: string;
  progress: number;
}

// 文字列と進行状況の値のマッピングの型を定義
interface ProgressMapping {
  [key: string]: number;
}

// 文字列と進行状況の値のマッピング
const progressMapping: ProgressMapping = {
  "タイトル未定": 0,
  "タイトルだけ決まった": 33,
  "書いてる": 66,
  "書いた": 100,
};

const bars = new MultiProgressBar({
  title,
  complete: "=",
  incomplete: "-",
  display: "[:bar] :text :percent :completed/:total",
});

let completed = 0;

// get progress grom progress.json
function getProgressFromJson(): Progress[] {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync("./progress.json");
  const json = JSON.parse(decoder.decode(data));
  // progressオブジェクトを型付け
  const progressInfo: Progress[] = Object.entries(json).map(([day, progressData]: [string, unknown]) => {
    const progress = progressData as ProgressFromJson;
    return {
      title: day,
      progress: progressMapping[progress.progress],
    };
  });

  return progressInfo;
}

function showProgress(progress: Progress[]) {
  if (completed <= total){
    completed += 1;
    bars.render(
      progress.map(p => ({ completed:(p.progress >= completed) ? completed:p.progress, total,  text: p.title }))
    )
    setTimeout(function () {
      showProgress(progress);
    }, 100);
  }else{
    bars.end();
  }
}

function main() {
  const progress = getProgressFromJson();
  showProgress(progress);
}

main();