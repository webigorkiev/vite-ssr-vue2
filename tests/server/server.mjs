import * as http from "http";
import * as fs from "fs";
import entry from "../../dist/server/entry-server.mjs";
import path from "path";
const hostname = '127.0.0.1';
const port = 3000;

const exts = {
    "css"   : "text/css",
    "js"    : "application/javascript",
    "svg"   : "image/svg+xml"

};
const getExt = (path) => path.split(".").pop();

const server = http.createServer(async(req, res) => {
    const ext = getExt(req.url);

    if(["css", "js", "svg"].includes(ext)) {
        let url = req.url
            .replace(/\.\.\//ig, "")
            .replace(/^\.\/?/, "");
        url = `./${url}`;
        const file = path.resolve("./dist/client", url);
        const content = fs.readFileSync(file);

        res.statusCode = 200;
        res.setHeader('Content-Type', exts[ext]);
        res.end(content);

        return;
    }

    const {html} = await entry(req.url, {
        manifest: JSON.parse(fs.readFileSync("./dist/client/ssr-manifest.json", {encoding: "utf-8"})),
        res,
        req,
        context: {}
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});