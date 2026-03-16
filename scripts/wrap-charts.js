const fs = require('fs');
const path = require('path');

// Helper: replace a motion.div chart block with CollapsibleChart
// Strategy: find blocks that contain both ResponsiveContainer and motion.div wrapper
// and replace the outer motion.div wrapper with CollapsibleChart

function extractTitle(block) {
  // Try to get title from h3 inside the block
  const h3Match = block.match(/<h3[^>]*>([^<]+)<\/h3>/);
  if (h3Match) return h3Match[1].trim();
  // Try from openModal first arg
  const modalMatch = block.match(/openModal\(['"]([^'"]+)['"]/);
  if (modalMatch) return modalMatch[1].trim();
  return 'Gráfico';
}

function wrapChartsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Add CollapsibleChart import if missing
  if (!content.includes("import CollapsibleChart from '../CollapsibleChart'")) {
    content = content.replace(
      /import CollapsibleTable from '\.\.\/CollapsibleTable';/,
      "import CollapsibleTable from '../CollapsibleTable';\nimport CollapsibleChart from '../CollapsibleChart';"
    );
    // fallback if no CollapsibleTable import
    if (!content.includes("import CollapsibleChart from '../CollapsibleChart'")) {
      content = content.replace(
        /^(import .+ from 'framer-motion';)/m,
        "$1\nimport CollapsibleChart from '../CollapsibleChart';"
      );
    }
  }

  // Pattern: find motion.div blocks that contain <ResponsiveContainer
  // We'll do a character-by-character parse to find balanced JSX blocks
  let result = '';
  let i = 0;

  while (i < content.length) {
    // Look for <motion.div that contains ResponsiveContainer
    const motionStart = content.indexOf('<motion.div', i);
    if (motionStart === -1) {
      result += content.slice(i);
      break;
    }

    // Check if this motion.div block contains ResponsiveContainer
    // First find the end of this motion.div block
    const blockEnd = findMotionDivEnd(content, motionStart);
    if (blockEnd === -1) {
      result += content.slice(i);
      break;
    }

    const block = content.slice(motionStart, blockEnd);

    if (block.includes('<ResponsiveContainer')) {
      // Extract title
      const title = extractTitle(block);
      // Extract the inner content (everything between the opening tag end and </motion.div>)
      const innerContent = extractInnerContent(block);
      // Build CollapsibleChart replacement
      const indent = getIndent(content, motionStart);
      const replacement = `${indent}<CollapsibleChart title="${title}" defaultOpen={false}>\n${innerContent}\n${indent}</CollapsibleChart>`;
      result += content.slice(i, motionStart) + replacement;
      i = blockEnd;
    } else {
      result += content.slice(i, motionStart + 11); // include '<motion.div'
      i = motionStart + 11;
    }
  }

  if (result !== original) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  } else {
    console.log(`⏭  No changes: ${path.basename(filePath)}`);
  }
}
