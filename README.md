# dynamic_wordcloud

A text visualization tool with a recency effect

## Installation

```npm i dynamic_wordcloud```

## Usage

The current version of `dynamic_wordcloud` only supports the adding of new words into the `DynamicWordCloud` object:

```
import { DynamicWordCloud } from "dynamic_wordcloud";

let canvas = document.getElementById("word_cloud_class_canvas");

canvas.width = innerWidth;
canvas.height = innerHeight;

let dynamicWordCloud = new DynamicWordCloud(class_canvas);
dynamicWordCloud.animate();

let next_word = "hello";
let size = 30;

dynamicWordCloud.update_word_cloud(next_word, size);
```

See the [demo repo](https://github.com/gabrielmsidik/dynamic_wordcloud_demo) for examples of using this custom object!
