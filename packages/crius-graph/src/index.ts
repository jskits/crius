interface Log {
  key?: string;
  desc?: string | undefined | null;
  type?: "builder" | "step" | string;
  status?: "start" | "end" | string;
  time: number;
}
// TODO: Refactoring & Enhancement
export const graphParser = (params: Array<Array<Log>>) => {
  const data = params.map((params) =>
    params.filter((i) => i.status === "start")
  );
  let result = `
    digraph AC {`;
  for (let j = 0; j < data.length; j++) {
    const item = data[j];
    result += `
      subgraph cluster_${item[0].key} {
        label = "AC ${item[0].key}";
        tooltip = "${item[0].desc || item[0].key}";
        style=filled;
        color=lightgrey;
        node [style=filled,color=white];
    `;
    for (let i = 1; i < item.length; i++) {
      if (item[i].type === "builder") {
        result += `
        ${item[0].key}_${item[i + 1].key}[label = "${item[i + 1].key}",tooltip = "${item[i].desc}"];
        `;
      }
      if (item[i].type === "step" && i !== 2) {
        let endItem = params[j].find(
          ({ key, status }) => item[i].key === key && status === "end"
        );
        result += `
        ${item[0].key}_${item[i - 1].type !== "step" ? item[i - 2].key : item[i - 1].key} -> ${item[0].key}_${item[i].key}[label = " ${endItem && endItem.time ? endItem.time - item[i].time : 0}ms"];`;
        result += `
        ${item[0].key}_${item[i].key}[label = "${item[i].key}"];`;
        if (item[i].desc) {
          result += `
        ${item[0].key}_${item[i].key}[tooltip = "${item[i].desc}"];`;
        }
      }
    }
    result += `
      }
    `;
  }
  for (var j = 0; j < data.length; j++) {
    var item = data[j];
    result += `
      start -> ${item[0].key}_${item[2].key};
      ${item[0].key}_${item[item.length - 1].key} -> end;
    `;
  }
  result += `
      start [shape=box];
      end [shape=box];
    }
  `;
  return result;
};
