NEJ.deps({
    'pro/a.js':['pro/b.js','pro/c.js'],
    'pro/b.js':['pro/e.js','pro/f.js','pro/a/c/d.js'],
    'pro/c.js':['pro/f.js'],
    'pro/f.js':['pro/f.js','pro/a/c/d.js']
});