const pushRelabel = require('graph-theory-push-relabel');

function testPushRelabel(graphData, sourceIdx, sinkIdx) {
  sourceIdx = sourceIdx || 0;
  sinkIdx = sinkIdx || graphData.length;

  return pushRelabel(graphData, sourceIdx, sinkIdx);
};

module.exports = {
  testPushRelabel,
}