<template>
  <div class="main my-background">
    <div class="row h-100 my-background">
      <div :class="this.status === 0 ? 'col-9 my-background d-flex justify-content-center align-items-center' : 'col-9 my-background'">
        <svg :class="this.status === 0 ? 'no-size' : ''"></svg>
        <h1 v-if="this.status === 0" class="text-light"> ** 请点击开始 ** </h1>
      </div>
      <div class="col-3 card status-side-bar">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h2 class="text-center">数码问题</h2>
            <h2 class="text-center">可视化</h2>
            <h6 class="text-center mt-3 text-muted">BY 2012930 薛湛童</h6>
          </div>
          <div v-if="this.currentMatrix && this.toMatrix && this.status !== 0">
            <status-matrix :matrix-size="this.matrixSize" :curr-matrix="this.currentMatrix" :to-matrix="this.toMatrix"></status-matrix>
            <h6 class="text-center m-1 text-muted">深度: {{ this.currDepth }}</h6>
            <h6 class="text-center m-1 text-muted" v-if="this.fh !== null">h(#{{algo.getNodesTraversed()}}) = {{ this.fh }}</h6>
          </div>
          <div v-if="algo !== null">
            <h6 class="text-center m-1 text-muted">节点数: {{ algo.getNodesTraversed() }}</h6>
            <h6 class="text-center m-1 text-muted">内存: {{ algo.getMemoryConsumed() }}bytes</h6>
            <h6 class="text-center m-1 text-muted">时间: {{ algo.getTimeConsumed() / 1000 }}s</h6>
            <h6 class="text-center m-1 text-muted" v-if="this.shortestPath !== null">最短路径: {{ this.shortestPath }}</h6>
            <h6 class="text-center m-1 text-muted" v-if="this.longestPath !== null">最长路径: {{ this.longestPath }}</h6>
            <h6 class="text-center m-1 text-muted" v-if="this.answersFound !== 0">已知答案: {{ this.answersFound }}个</h6>
          </div>
          <div class="flex-column d-flex mb-1">
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-outline-success btn-lg" data-bs-toggle="modal" data-bs-target="#configureModal" v-if="this.status === 0"> {{ '>>> 开始 >>>' }} </button>
              <button type="button" class="btn btn-outline-info btn-lg" @click="this.status = 3" v-if="this.status === 1"> {{ '>>> 暂停 <<<' }} </button>
              <button type="button" class="btn btn-outline-primary btn-lg" @click="this.status = 1" v-if="this.status === 3"> 继续 </button>
              <button type="button" class="btn btn-outline-warning btn-lg" @click="this.stepOnce()" v-if="this.status === 3"> 单步 </button>
              <button type="button" class="btn btn-outline-danger btn-lg disabled" v-if="this.status === 2"> 已结束 </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="configureModal" tabindex="-1" aria-labelledby="configureModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="configureModalLabel">配置算法</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="m-1">问题规模:</label>
            <select class="form-select" aria-label="Default select example" v-model="form.size">
              <option selected value="-1">请选择...</option>
              <option value="3">3x3格子，8个数字</option>
              <option value="4">4x4格子，15个数字</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="m-1">算法:</label>
            <select class="form-select" aria-label="Default select example" v-model="form.algo">
              <option selected value="-1">请选择...</option>
              <option value="1">深度优先（有最大深度限制）</option>
              <option value="2">宽度优先</option>
              <option value="3">随机决策</option>
              <option value="4">启发式搜索（启发函数：有多少个数不在位置上）</option>
              <option value="5">启发式搜索（启发函数：不在位置上数字的曼哈顿距离）</option>
            </select>
          </div>
          <div class="mb-3" v-if="form.algo === '1'">
            <label class="m-1">最大深度:</label>
            <input type="number" id="inputMaximumDepth" class="form-control" aria-describedby="depthHelpBlock" v-model="form.maxDepth">
            <div id="depthHelpBlock" class="form-text">
              在使用深度优先搜索时，树的深度将不会超过该设定值。
            </div>
          </div>
          <div class="mb-3">
            <label class="m-1">起始矩阵:</label>
            <div class="input-group">
              <input type="text" class="form-control" aria-describedby="matrixHelpBlock" v-model="form.fromMatrix">
              <button class="btn btn-outline-secondary" type="button" @click="randomMatrix()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-6" viewBox="0 0 16 16">
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/>
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
              </button>
            </div>
            <div id="matrixHelpBlock" class="form-text">
              例如 (仅对 3x3): [0, 1, 2, 3, 4, 5, 6, 7, 8]
            </div>
          </div>
          <div class="mb-3">
            <label class="m-1">目标矩阵:</label>
            <div class="input-group">
              <input type="text" class="form-control" aria-describedby="matrixHelpBlock" v-model="form.toMatrix">
              <button class="btn btn-outline-secondary" type="button" @click="randomMatrix()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-6" viewBox="0 0 16 16">
                  <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/>
                  <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
              </button>
            </div>
            <div id="matrixHelpBlock" class="form-text">
              例如 (仅对 3x3): [0, 1, 2, 3, 4, 5, 6, 7, 8]
            </div>
          </div>
          <div class="mb-3">
            <label class="m-1">动画间隔 (ms):</label>
            <input type="number" class="form-control" aria-describedby="matrixHelpBlock" v-model="form.interval">
            <div id="matrixHelpBlock" class="form-text">
              决定了算法进行每一步之间的间歇。
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="onRunClicked()"> 开始 </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import StatusMatrix from "@/components/status-matrix";
import DepthFirst from "./algo/depth-first";
import BreadthFirst from "./algo/breadth-first";
import RandomChoice from "./algo/random-choice";
import InformedByMissed from "@/algo/informed-by-missed";
import InformedByOffset from "@/algo/informed-by-offset";
import RandomGenerate from "@/util/random-generate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

export default {
  name: 'App',
  components: {StatusMatrix},
  data: function () {
    return {
      update: null,
      fromMatrix: null,
      toMatrix: null,
      currentMatrix: null,
      matrixSize: 3,
      currentStateId: 0,
      timeConsumed: 0,
      algo: null,
      algoIndex: null,
      status: 0,
      currDepth: 0,
      fh: null,
      shortestPath: null,
      longestPath: null,
      maxDepth: null,
      answersFound: 0,
      form: {
        size: '-1',
        algo: '-1',
        maxDepth: 14,
        fromMatrix: '',
        toMatrix: '',
        interval: 300,
      }
    }
  },
  methods: {
    initializeGraph: function () {
      const height = 400;
      const width = 600;
      const renderLink = d3.linkVertical().x(d => d.x).y(d => d.y);
      let tree = d3.tree().size([width - 20, height - 20]);
      let Node = d3.hierarchy.prototype.constructor;
      const svg = d3.select("svg").attr("viewBox", [-10, -10, width, height]);
      const root = new Node;
      const nodes = [root];
      const links = [];

      tree(root);

      let link = svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#ccc")
          .selectAll(".link");

      let node = svg.append("g")
          .selectAll(".node");

      this.update = (from, hl) => {
        // Add a new node to a random parent.
        const parent = nodes[from];
        const child = Object.assign(new Node, {parent, depth: parent.depth + 1, highlighted: hl});
        if (parent.children) parent.children.push(child);
        else parent.children = [child];
        nodes.push(child);
        links.push({source: parent, target: child});

        // Recompute the layout.
        tree(root);

        // Add entering nodes in the parent’s old position.
        node = node.data(nodes);
        node = node.enter().append("circle")
            .attr("class", "node")
            .attr("r", d => d.highlighted ? 4 : 2)
            .attr("cx", d => d.parent ? d.parent.px : d.px = d.x)
            .attr("cy", d => d.parent ? d.parent.py : d.py = d.y)
            .style("fill", d => d.highlighted ? '#f00' : '#ccc')
            .merge(node);

        // Add entering links in the parent’s old position.
        link = link.data(links);
        link = link.enter().insert("path", ".node")
            .attr("class", "link")
            .attr("d", d => {
              const o = {x: d.source.px, y: d.source.py};
              return renderLink({source: o, target: o});
            })
            .merge(link);

        // Transition nodes and links to their new positions.
        const t = svg.transition()
            .duration(this.status === 3 ? 300 : this.form.interval);

        link.transition(t)
            .attr("d", renderLink);

        node.transition(t)
            .attr("cx", d => d.px = d.x)
            .attr("cy", d => d.py = d.y);
      };
    },
    onRunClicked: function () {
      if (this.form.size !== '3' && this.form.size !== '4') {
        alert('未选择问题规模。'); return;
      }
      this.matrixSize = parseInt(this.form.size, 10);
      if (this.form.algo !== '1' && this.form.algo !== '2' && this.form.algo !== '3' && this.form.algo !== '4' && this.form.algo !== '5') {
        alert('未选择使用的算法。'); return;
      }
      this.algoIndex = parseInt(this.form.algo, 10);
      if (this.algoIndex === 1) {
        this.maxDepth = parseInt(this.form.maxDepth, 10);
        if (isNaN(this.maxDepth)) {
          alert('最大深度键入错误。'); return;
        } else if (this.maxDepth <= 2) {
          alert('最大深度过低。'); return ;
        }
      }
      try {
        let from = JSON.parse(this.form.fromMatrix);
        let to = JSON.parse(this.form.toMatrix);
        if (from.length !== this.matrixSize * this.matrixSize) {
          alert('起始矩阵元素数量不正确。'); return;
        }
        if (to.length !== this.matrixSize * this.matrixSize) {
          alert('目标矩阵元素数量不正确。'); return;
        }
        for (let i = 0; i < this.matrixSize * this.matrixSize; ++i) {
          if (from.indexOf(i) === -1) {
            alert(`起始矩阵中缺少数字${i}。`); return;
          }
        }
        for (let i = 0; i < this.matrixSize * this.matrixSize; ++i) {
          if (to.indexOf(i) === -1) {
            alert(`目标矩阵中缺少数字${i}。`); return;
          }
        }
        from[from.indexOf(0)] = null;
        to[to.indexOf(0)] = null;
        this.fromMatrix = from;
        this.toMatrix = to;
      } catch (e) {
        alert('矩阵格式错误。'); return;
      }
      ls.set('fromMatrix', this.form.fromMatrix);
      ls.set('toMatrix', this.form.toMatrix);
      ls.set('size', this.form.size);
      ls.set('algo', this.form.algo);
      ls.set('maxDepth', this.form.maxDepth);
      ls.set('interval', this.form.interval);
      this.initializeAlgo();
    },
    initializeAlgo: function () {
      this.status = 1;
      this.initializeGraph();
      setTimeout(this.onTimeOut, this.form.interval);
      let _algo = null;
      const callback = (parentId, currId, isAnswer, currMatrix, depth, fh) => {
        this.update(parentId, isAnswer);
        this.currentMatrix = currMatrix;
        this.currDepth = depth;
        this.fh = fh;
        if (isAnswer) {
          if (this.shortestPath === null)
            this.shortestPath = depth;
          else
            this.shortestPath = (this.shortestPath > depth ? depth : this.shortestPath);
          if (this.longestPath === null)
            this.longestPath = depth;
          else
            this.longestPath = (this.longestPath < depth ? depth : this.longestPath);
          ++this.answersFound;
        }
      };
      if (this.algoIndex === 1) {
        _algo = DepthFirst;
        _algo.initialize(this.matrixSize, this.fromMatrix, this.toMatrix, callback, this.maxDepth);
      } else {
        if (this.algoIndex === 2)
          _algo = BreadthFirst;
        else if (this.algoIndex === 3)
          _algo = RandomChoice;
        else if (this.algoIndex === 4)
          _algo = InformedByMissed;
        else if (this.algoIndex === 5)
          _algo = InformedByOffset;
        else return;
        _algo.initialize(this.matrixSize, this.fromMatrix, this.toMatrix, callback);
      }
      this.algo = _algo;
    },
    onTimeOut: function () {
      if (this.algo !== null && this.status !== 3 && this.status !== 0) {
        const ret = this.algo.step();
        if (!ret) {
          this.status = 2;
        }
      }
      if (this.status !== 2) {
        setTimeout(this.onTimeOut, this.form.interval);
      }
    },
    stepOnce: function () {
      const ret = this.algo.step();
      if (!ret) {
        this.status = 2;
      }
    },
    randomMatrix: function () {
      if (this.form.size !== '3' && this.form.size !== '4') {
        alert('未选择问题规模。'); return;
      }
      this.matrixSize = parseInt(this.form.size, 10);
      const [fromM, toM] = RandomGenerate.generate(this.matrixSize);
      this.form.fromMatrix = JSON.stringify(fromM);
      this.form.toMatrix = JSON.stringify(toM);
    }
  },
  mounted() {
    this.form.fromMatrix = ls.get('fromMatrix');
    this.form.toMatrix = ls.get('toMatrix');
    this.form.size = ls.get('size');
    this.form.algo = ls.get('algo');
    this.form.maxDepth = ls.get('maxDepth');
    this.form.interval = ls.get('interval');
    if (this.form.size === '')
      this.form.size = '-1';
    if (this.form.algo === '')
      this.form.algo = '-1';
    if (this.form.maxDepth === '')
      this.form.maxDepth = 14;
    else try {
      this.form.maxDepth = parseInt(this.form.maxDepth, 10);
    } catch (e) { this.form.maxDepth = 14; }
    if (this.form.interval === '')
      this.form.interval = 300;
    else try {
      this.form.interval = parseInt(this.form.interval, 10);
    } catch (e) { this.form.interval = 300; }
  }
}
</script>

<style>
.main {
  position: absolute;
  width: 100%;
  height: 100%;
}
.my-background {
  background: #3c3f41;
}
.status-side-bar {
  background: whitesmoke;
}
.no-size {
  width: 0;
  height: 0;
}
</style>
