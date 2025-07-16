function createUIControls(startCallback) {
  const controls = createDiv().style('margin', '10px');

  createSpan('Grid Size: ').parent(controls);
  const gridSizeInput = createInput('6', 'number').parent(controls);
  gridSizeInput.attribute('min', '3');
  gridSizeInput.attribute('max', '12');

  createSpan(' AI Depth: ').parent(controls);
  const aiDepthInput = createInput('5', 'number').parent(controls);
  aiDepthInput.attribute('min', '1');
  aiDepthInput.attribute('max', '10');

  const startButton = createButton('Start New Game').parent(controls);
  startButton.mousePressed(() => {
    const gridSize = int(gridSizeInput.value());
    const aiDepth = int(aiDepthInput.value());
    startCallback(gridSize, aiDepth);
  });
}
