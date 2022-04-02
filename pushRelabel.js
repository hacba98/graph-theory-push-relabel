const _ = require('underscore');

const pushRelabel = function() {
  const self = this;

  self.run = function(data, sourceIdx, sinkIdx) {

    // preset some variable
    sourceIdx = sourceIdx || 0;
    sinkIdx = sinkIdx || data.length - 1;
    const edges = constructEdgeArr(data);
    const heights = new Array(data.length).fill(0); // height of each node
    const excessFlow = new Array(data.length).fill(0); // excess flow of each node -> stop algorithm when this reach zero for all nodes

    // Initialize PreFlow()
    preflow();

    // main logic
    let tmp = getOverFlow();
    let counter = 1;
    while (tmp.length !== 0) {
      // do something
      const highlightNode = _.sample(tmp); // get any node to have multiple solutions
      if (!push(highlightNode)) {
        relabel(highlightNode);
      }

      // console.log('tmp', tmp, counter);
      // console.log('after one loop', [...heights], [...excessFlow]);

      // check again
      tmp = getOverFlow();
      counter++; // debug only
    }

    console.log('Number of steps:', counter);
    console.log('Result from our module for maximum flow is:', excessFlow[sinkIdx]);
    console.log('Table for edges that used in the solution:', edges.filter(o => o.current > 0));

    return;

    // init
    function preflow() {
      // Initialize height of source vertex equal to total number of vertices in graph.
      heights[sourceIdx] = data.length;

      // all vertices adjacent to source s, flow and excess flow is equal to capacity initially
      edges.forEach(e => {
        if (e.from === sourceIdx) {
          e.current = e.capacity;
          excessFlow[e.to] += e.current;
          edges.push({
            from: e.to,
            to: e.from,
            capacity: 0,
            current: -e.current,
          });
        }
      });

    }

    // get overflow indexes
    function getOverFlow() {
      const res = [];
      for (let i=1; i < excessFlow.length -1; i++) {
        if (excessFlow[i] > 0) {
          res.push(i);
        }
      }
      return res;
    }


    // Update reverse flow for residual flow added on edges[i]
    function updateReverseEdgeFlow(i, flow) {
      let from = edges[i].to;
      let to = edges[i].from;

      edges.forEach(e => {
        if (e.from === from && e.to === to) {
          e.current -= flow;
        }
      });

      // adding reverse Edge in residual graph
      edges.push({
        from: from,
        to: to,
        capacity: flow,
        current: 0,
      });
    }

    // push flow from overflowing node index 'i'
    function push(nodeIdx) {
      // Traverse through all edges to find an adjacent nodes to which flow can be pushed
      edges.forEach((e, i) => {
        if (e.from === nodeIdx) {

          // if flow is equal to capacity then no push is possible
          if (e.current === e.capacity) return;

          // Push is only possible if height of adjacent is smaller than height of overflowing vertex
          if (heights[nodeIdx] <= heights[e.to]) return;

          // Flow to be pushed is equal to minimum of remaining flow on edge and excess flow.
          const flow = Math.min(e.capacity - e.current, excessFlow[nodeIdx]);
          excessFlow[nodeIdx] -= flow; // Reduce excess flow for overflowing vertex
          excessFlow[e.to] += flow; // Increase excess flow for adjacent
          e.current += flow; // Add residual flow (With capacity 0 and negative current flow
          updateReverseEdgeFlow(i, flow);
          return true; // turn on result flag

        }
      });

      return false;
    }

    // relabel height of node
    function relabel(index) {
      let newHeight = Number.MAX_SAFE_INTEGER;
      edges.forEach(e => {
        if (e.from === index) {
          // if flow is equal to capacity then no relabeling
          if (e.current === e.capacity) return;

          if (heights[e.to] < newHeight) {
            newHeight = heights[e.to];
            // update new height of node
            heights[index] = newHeight + 1;
          }
        }
      });
    }
  }

  // get array of edges from matrix
  function constructEdgeArr(data) {
    const res = [];
    data.forEach((target, srcIdx) => {
      target.forEach((capacity, vIdx) => {
        if (data[srcIdx][vIdx] === 0) return;
        res.push({
          from: srcIdx,
          to: vIdx,
          capacity: capacity,
          current: 0, // current flow
        });
      });
    });
    return res;
  }
}

module.exports = {
  pushRelabel,
}