const fs = require('fs');
const path = require('path');

const replacements = [
  // #154212 -> primary
  { from: /text-\[#154212\]/g, to: 'text-primary' },
  { from: /bg-\[#154212\]/g, to: 'bg-primary' },
  { from: /hover:bg-\[#154212\]/g, to: 'hover:bg-primary' },
  { from: /ring-\[#154212\]\/10/g, to: 'ring-primary/10' },
  { from: /border-\[#154212\]/g, to: 'border-primary' },
  { from: /hover:text-\[#154212\]/g, to: 'hover:text-primary' },

  // #2d5a27 -> primary-container
  { from: /bg-\[#2d5a27\]/g, to: 'bg-primary-container' },
  { from: /shadow-\[#2d5a27\]\/20/g, to: 'shadow-primary-container/20' },
  { from: /focus:ring-\[#2d5a27\]\/20/g, to: 'focus:ring-primary-container/20' },
  { from: /focus:border-\[#2d5a27\]/g, to: 'focus:border-primary-container' },
  { from: /hover:text-\[#2d5a27\]/g, to: 'hover:text-primary-container' },
  { from: /text-\[#2d5a27\]/g, to: 'text-primary-container' },
  { from: /border-\[#2d5a27\]/g, to: 'border-primary-container' },
  { from: /bg-\[#2d5a27\]\/5/g, to: 'bg-primary-container/5' },
  { from: /hover:bg-\[#2d5a27\]\/10/g, to: 'hover:bg-primary-container/10' },
  { from: /border-\[#2d5a27\]\/20/g, to: 'border-primary-container/20' },
  { from: /hover:border-\[#2d5a27\]/g, to: 'hover:border-primary-container' },
  { from: /hover:bg-\[#2d5a27\]\/5/g, to: 'hover:bg-primary-container/5' },
  { from: /text-\[#2d5a27\]\/40/g, to: 'text-primary-container/40' },
  { from: /text-\[#2d5a27\]\/60/g, to: 'text-primary-container/60' },
  { from: /border-\[#2d5a27\]\/10/g, to: 'border-primary-container/10' },
  { from: /focus:ring-\[#2d5a27\]/g, to: 'focus:ring-primary-container' },

  // #c2c9bb -> outline-variant
  { from: /border-\[#c2c9bb\]/g, to: 'border-outline-variant' },
  { from: /border-\[#c2c9bb\]\/50/g, to: 'border-outline-variant/50' },
  { from: /border-\[#c2c9bb\]\/30/g, to: 'border-outline-variant/30' },
  { from: /border-\[#c2c9bb\]\/40/g, to: 'border-outline-variant/40' },
  { from: /border-\[#c2c9bb\]\/60/g, to: 'border-outline-variant/60' },
  { from: /divide-\[#c2c9bb\]\/20/g, to: 'divide-outline-variant/20' },
  { from: /bg-\[#c2c9bb\]/g, to: 'bg-outline-variant' },
  { from: /disabled:hover:border-\[#c2c9bb\]\/60/g, to: 'disabled:hover:border-outline-variant/60' },

  // #eeeee9 -> surface-container
  { from: /hover:bg-\[#eeeee9\]/g, to: 'hover:bg-surface-container' },

  // #f4f4ef -> surface-container-low
  { from: /hover:bg-\[#f4f4ef\]/g, to: 'hover:bg-surface-container-low' },
  { from: /bg-\[#f4f4ef\]/g, to: 'bg-surface-container-low' },

  // #805533 -> secondary
  { from: /text-\[#805533\]/g, to: 'text-secondary' },

  // #42493e -> on-surface-variant
  { from: /text-\[#42493e\]/g, to: 'text-on-surface-variant' },

  // Structure rules
  { from: /h-\[1px\]/g, to: 'h-px' },
  { from: /bg-\[#2d5a27\]\/30/g, to: 'bg-primary-container/30' },
  { from: /flex-shrink-0/g, to: 'shrink-0' },
  { from: /z-\[100\]/g, to: 'z-100' }
];

const files = [
  'src/app/admin/animals/[id]/edit/page.tsx',
  'src/app/admin/animals/page.tsx',
  'src/app/admin/countries/page.tsx',
  'src/app/login/page.tsx',
  'src/components/features/admin/animals/animal-distribution-card.tsx',
  'src/components/features/admin/animals/animal-identity-card.tsx',
  'src/components/features/admin/animals/AnimalForm.tsx',
  'src/components/features/admin/countries/CountryFilters.tsx',
  'src/components/features/admin/countries/CountryModal.tsx',
  'src/components/features/admin/countries/CountryStats.tsx',
  'src/components/features/admin/countries/CountryTable.tsx',
  'src/components/layouts/admin/admin-sidebar.tsx',
  'src/components/layouts/admin/admin-topbar.tsx',
  'src/components/layouts/dashboard/top-nav-bar.tsx'
];

const projectRoot = path.join(__dirname, '..');

files.forEach(relativePath => {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`File not found: ${absolutePath}`);
    return;
  }

  let content = fs.readFileSync(absolutePath, 'utf8');
  let originalContent = content;

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Refactored: ${relativePath}`);
  } else {
    console.log(`No changes needed: ${relativePath}`);
  }
});

console.log('Refactoring complete!');
