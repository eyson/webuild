//ui demo html

module.exports = (options) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${options.title}</title>
</head>
<body>
    <div id="app">
        <${options.widget}></${options.widget}>
    </div>
    <script src="${options.output}"></script>
</body>
</html>`;
};
