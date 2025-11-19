const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // 读取index.html文件
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else {
        // 处理其他资源请求（如CSS、JS等）
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                // 根据文件扩展名设置Content-Type
                const ext = path.extname(filePath);
                const contentType = {
                    '.html': 'text/html',
                    '.css': 'text/css',
                    '.js': 'text/javascript',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg'
                }[ext] || 'text/plain';
                
                res.writeHead(200, {'Content-Type': contentType});
                res.end(data);
            }
        });
    }
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    
    // 自动打开浏览器
    const openCommand = process.platform === 'win32' ? 'start' : 
                       process.platform === 'darwin' ? 'open' : 'xdg-open';
    
    exec(`${openCommand} http://localhost:${PORT}`, (error) => {
        if (error) {
            console.log('无法自动打开浏览器，请手动访问: http://localhost:3000');
        } else {
            console.log('正在打开浏览器...');
        }
    });
});